/** Download immersioni Suunto EON Core / Steel / D5 via Web Bluetooth (protocollo libdivecomputer). */
const EON_SVC = "98ae7120-e62e-11e3-badd-0002a5d5c51b";
const EON_RX = "c6339440-e62e-11e3-a5b3-0002a5d5c51b";
const EON_TX = "d0fd6b80-e62e-11e3-a2e9-0002a5d5c51b";
const BLE_CHUNK = 20;

const CMD_INIT = 0x0000;
const CMD_FILE_OPEN = 0x0010;
const CMD_FILE_READ = 0x0110;
const CMD_FILE_CLOSE = 0x0510;
const CMD_FILE_STAT = 0x0710;
const CMD_DIR_OPEN = 0x0810;
const CMD_DIR_READDIR = 0x0910;
const CMD_DIR_CLOSE = 0x0a10;
const DIRTYPE_FILE = 0x0001;
const DIVE_DIR = "0:/dives";

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let b = 0; b < 8; b++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function le16(n, out, o) {
  out[o] = n & 255;
  out[o + 1] = (n >> 8) & 255;
}
function le32(n, out, o) {
  out[o] = n & 255;
  out[o + 1] = (n >> 8) & 255;
  out[o + 2] = (n >> 16) & 255;
  out[o + 3] = (n >>> 24) & 255;
}
function u16(buf, o) {
  return buf[o] | (buf[o + 1] << 8);
}
function u32(buf, o) {
  return (buf[o] | (buf[o + 1] << 8) | (buf[o + 2] << 16) | (buf[o + 3] << 24)) >>> 0;
}

function hdlcEncode(src) {
  const crc = crc32(src);
  const out = [0x7e];
  const push = (v) => {
    if (v === 0x7e || v === 0x7d) {
      out.push(0x7d, v ^ 0x20);
    } else out.push(v);
  };
  for (let i = 0; i < src.length; i++) push(src[i]);
  for (let i = 0; i < 4; i++) push((crc >>> (8 * i)) & 255);
  out.push(0x7e);
  return new Uint8Array(out);
}

function hdlcDecode(stream) {
  const buf = [];
  let state = 0;
  for (let i = 0; i < stream.length; i++) {
    let c = stream[i];
    if (c === 0x7e) {
      if (state === 1) break;
      state = 1;
      continue;
    }
    if (!state) continue;
    if (c === 0x7d) {
      state = 2;
      continue;
    }
    if (state === 2) {
      c ^= 0x20;
      state = 1;
    }
    buf.push(c);
  }
  if (buf.length < 4) throw new Error("Risposta Bluetooth troppo corta.");
  const payload = buf.slice(0, -4);
  const got = u32(buf, buf.length - 4);
  if (crc32(payload) !== got) throw new Error("CRC Bluetooth non valido. Tieni il computer vicino e riprova.");
  return new Uint8Array(payload);
}

class EonSession {
  constructor(rx, tx) {
    this.rx = rx;
    this.tx = tx;
    this.magic = 1;
    this.seq = 0;
    this.incoming = [];
    this.waiter = null;
    this.onNotify = (ev) => {
      const v = ev.target.value;
      const chunk = new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
      for (let i = 0; i < chunk.length; i++) this.incoming.push(chunk[i]);
      if (this.waiter && this.incoming.includes(0x7e) && this.incoming.lastIndexOf(0x7e) > this.incoming.indexOf(0x7e)) {
        this.waiter();
      }
    };
  }

  async start() {
    this.tx.addEventListener("characteristicvaluechanged", this.onNotify);
    await this.tx.startNotifications();
  }

  async stop() {
    try {
      this.tx.removeEventListener("characteristicvaluechanged", this.onNotify);
      await this.tx.stopNotifications();
    } catch {
      /* ignore */
    }
  }

  waitFrame(ms = 12000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        this.waiter = null;
        reject(new Error("Nessuna risposta dal computer. Sbloccalo, tieni Bluetooth acceso e riprova."));
      }, ms);
      this.waiter = () => {
        clearTimeout(t);
        this.waiter = null;
        resolve();
      };
      if (this.incoming.includes(0x7e) && this.incoming.lastIndexOf(0x7e) > this.incoming.indexOf(0x7e)) {
        this.waiter();
      }
    });
  }

  async writeChunks(bytes) {
    for (let i = 0; i < bytes.length; i += BLE_CHUNK) {
      const slice = bytes.slice(i, i + BLE_CHUNK);
      await this.rx.writeValueWithoutResponse(slice);
      await new Promise((r) => setTimeout(r, 8));
    }
  }

  async sendCmd(cmd, payload) {
    const len = payload.length;
    const body = new Uint8Array(12 + len);
    le16(cmd, body, 0);
    le32(this.magic, body, 2);
    le16(this.seq, body, 6);
    le32(len, body, 8);
    body.set(payload, 12);
    this.incoming = [];
    await this.writeChunks(hdlcEncode(body));
  }

  async readFrame() {
    await this.waitFrame();
    const decoded = hdlcDecode(this.incoming);
    this.incoming = [];
    this.bleBuf = decoded;
    this.bleOff = 0;
    return decoded;
  }

  take(n) {
    const slice = this.bleBuf.slice(this.bleOff, this.bleOff + n);
    this.bleOff += slice.length;
    return slice;
  }

  async sendReceive(cmd, payload, maxIn = 2560) {
    await this.sendCmd(cmd, payload);
    const frame = await this.readFrame();
    if (frame.length < 12) throw new Error("Header Bluetooth corto.");
    const rCmd = u16(frame, 0);
    const rMagic = u32(frame, 2);
    const rSeq = u16(frame, 6);
    const rLen = u32(frame, 8);
    if (rCmd !== cmd) throw new Error("Risposta comando non corrispondente.");
    if (rMagic !== ((this.magic + 5) >>> 0)) throw new Error("Handshake magia non corrispondente.");
    if (rSeq !== this.seq) throw new Error("Sequenza Bluetooth non corrispondente.");
    const data = frame.slice(12, 12 + rLen);
    if (data.length < Math.min(rLen, maxIn) && rLen > data.length) {
      throw new Error("Pacchetto immersione incompleto. Avvicina il computer e riprova.");
    }
    this.seq = (this.seq + 1) & 0xffff;
    return data.slice(0, Math.min(rLen, maxIn));
  }

  async init() {
    this.magic = 1;
    this.seq = 0;
    await this.sendCmd(CMD_INIT, new Uint8Array([0x02, 0x00, 0x2a, 0x00]));
    const frame = await this.readFrame();
    if (frame.length < 12) throw new Error("Init EON fallito.");
    const hdrMagic = u32(frame, 2);
    this.magic = (hdrMagic & 0xffff0000) | 0x0005;
    this.seq = (this.seq + 1) & 0xffff;
  }

  async listDives() {
    const path = new TextEncoder().encode(DIVE_DIR + "\0");
    const cmd = new Uint8Array(4 + path.length);
    cmd.set(path, 4);
    await this.sendReceive(CMD_DIR_OPEN, cmd);
    const names = [];
    for (;;) {
      const result = await this.sendReceive(CMD_DIR_READDIR, new Uint8Array(0), 2048);
      if (result.length < 8) break;
      const last = u32(result, 4);
      let p = 8;
      while (p + 8 < result.length) {
        const type = u32(result, p);
        const namelen = u32(result, p + 4);
        const nameBytes = result.slice(p + 8, p + 8 + namelen);
        const name = new TextDecoder().decode(nameBytes);
        if (type === DIRTYPE_FILE && /\.LOG$/i.test(name)) names.push(name);
        p += 8 + namelen + 1;
      }
      if (last) break;
    }
    await this.sendReceive(CMD_DIR_CLOSE, new Uint8Array(0));
    return names;
  }

  async readFile(filename) {
    const path = new TextEncoder().encode(filename + "\0");
    const open = new Uint8Array(4 + path.length);
    open.set(path, 4);
    await this.sendReceive(CMD_FILE_OPEN, open);
    const st = await this.sendReceive(CMD_FILE_STAT, new Uint8Array(0));
    let size = u32(st, 4);
    const chunks = [];
    while (size > 0) {
      const ask = Math.min(size, 1024);
      const q = new Uint8Array(8);
      le32(1234, q, 0);
      le32(ask, q, 4);
      const result = await this.sendReceive(CMD_FILE_READ, q);
      const got = u32(result, 4);
      if (!got) break;
      chunks.push(result.slice(8, 8 + got));
      size -= got;
    }
    await this.sendReceive(CMD_FILE_CLOSE, new Uint8Array(0));
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    chunks.forEach((c) => {
      out.set(c, o);
      o += c.length;
    });
    return out;
  }
}

function bleUnavailableReason() {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (ios) {
    return "Su iPhone Safari non permette il Bluetooth alle app web. Percorso senza PC: apri l’app Suunto → sincronizza l’EON → Condividi/esporta UDDF → aprilo in SeaDive.";
  }
  if (!window.isSecureContext) {
    return "Il Bluetooth del browser funziona solo su HTTPS (o localhost). Apri l’app dal link sicuro, non da file://.";
  }
  if (!navigator.bluetooth) {
    return "Web Bluetooth manca in questo browser. Su Android usa Chrome aggiornato.";
  }
  return "";
}

async function downloadEonDives(onProgress) {
  const why = bleUnavailableReason();
  if (why) throw new Error(why);
  onProgress?.("Scegli EON Core / Steel / D5…");
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: "EON" }, { namePrefix: "Suunto" }, { namePrefix: "D5" }, { namePrefix: "Steel" }],
    optionalServices: [EON_SVC],
  });
  onProgress?.(`Connessione a ${device.name || "EON"}…`);
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(EON_SVC);
  const rx = await service.getCharacteristic(EON_RX);
  const tx = await service.getCharacteristic(EON_TX);
  const session = new EonSession(rx, tx);
  await session.start();
  try {
    onProgress?.("Handshake con il computer…");
    await session.init();
    onProgress?.("Elenco immersioni nel computer…");
    const names = await session.listDives();
    if (!names.length) throw new Error("Nessun file .LOG trovato su 0:/dives. Controlla che ci siano immersioni salvate.");
    const dives = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      onProgress?.(`Scarico ${i + 1}/${names.length}: ${name}`);
      const hex = name.match(/^([0-9a-fA-F]+)\.LOG$/);
      const time = hex ? parseInt(hex[1], 16) : 0;
      const body = await session.readFile(`${DIVE_DIR}/${name}`);
      const wrapped = new Uint8Array(4 + body.length);
      wrapped[0] = time & 255;
      wrapped[1] = (time >> 8) & 255;
      wrapped[2] = (time >> 16) & 255;
      wrapped[3] = (time >>> 24) & 255;
      wrapped.set(body, 4);
      const parsed = window.SeaDiveComputers.parseEonSteelLog(wrapped, device.name || "Suunto EON");
      if (parsed) dives.push(parsed);
    }
    return { name: device.name || "Suunto EON", dives };
  } finally {
    await session.stop();
    try {
      device.gatt.disconnect();
    } catch {
      /* ignore */
    }
  }
}

window.SeaDiveBle = { downloadEonDives, bleUnavailableReason };
