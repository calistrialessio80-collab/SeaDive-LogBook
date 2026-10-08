/** Import immersioni da computer subacquei (UDDF, XML Suunto, CSV). */
const COMPUTERS = [
  {
    id: "suunto-eon-core",
    brand: "Suunto",
    models: "EON Core (priorità), EON Steel, D5, D4i Novo, Vyper, Zoop",
    how: "Bluetooth sperimentale: Chrome Android + computer acceso e visibile. Non è l’app ufficiale Suunto e può fallire. Alternativa: app Suunto → file UDDF e aprilo qui.",
    ble: true,
  },
  {
    id: "shearwater",
    brand: "Shearwater",
    models: "Perdix 2, Teric, Peregrine, Petrel",
    how: "Niente Bluetooth in SeaDive. Shearwater Cloud → Export UDDF (o XML) e aprilo qui.",
  },
  {
    id: "garmin",
    brand: "Garmin",
    models: "Descent Mk / G1",
    how: "Niente Bluetooth in SeaDive. Garmin Connect / Dive → UDDF o CSV (i FIT vanno convertiti).",
  },
  {
    id: "mares",
    brand: "Mares",
    models: "Puck, Quad, Genius, Sirius",
    how: "Niente Bluetooth in SeaDive. App Mares o Dive Organizer → UDDF / CSV.",
  },
  {
    id: "cressi",
    brand: "Cressi",
    models: "Leonardo, Goa, Donatello, Neon",
    how: "Niente Bluetooth in SeaDive. App Cressi o software PC → UDDF.",
  },
  {
    id: "scubapro",
    brand: "Scubapro / Uwatec",
    models: "G2, G3, Aladin, Galileo",
    how: "Niente Bluetooth in SeaDive. LogTRAK o app Scubapro → UDDF.",
  },
  {
    id: "oceanic",
    brand: "Oceanic / Aqualung",
    models: "Geo, Veo, i330R, Aqualung",
    how: "Niente Bluetooth in SeaDive. DiverLog+ / Oceanic+ → UDDF o CSV.",
  },
  {
    id: "ratio",
    brand: "Ratio / Tusa / Seac",
    models: "iX3M, IQ, Screen",
    how: "Niente Bluetooth in SeaDive. Software del produttore → UDDF.",
  },
];

function localName(el) {
  return (el.localName || el.tagName || "").toLowerCase();
}

function findAll(root, name) {
  const n = name.toLowerCase();
  return [...root.querySelectorAll("*")].filter((e) => localName(e) === n);
}

function findOne(root, names) {
  const list = Array.isArray(names) ? names : [names];
  for (const name of list) {
    const hit = findAll(root, name)[0];
    if (hit) return hit;
  }
  return null;
}

function txt(root, names) {
  const el = findOne(root, names);
  return el ? el.textContent.trim() : "";
}

function num(v) {
  if (v == null || v === "") return "";
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : "";
}

function durationToMin(raw) {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  if (/^\d+:\d{2}(:\d{2})?$/.test(s)) {
    const p = s.split(":").map(Number);
    if (p.length === 3) return Math.round(p[0] * 60 + p[1] + p[2] / 60);
    return Math.round(p[0] + p[1] / 60);
  }
  const n = num(s);
  if (n === "") return "";
  if (n >= 180) return Math.round(n / 60);
  return Math.round(n);
}

function splitDateTime(raw) {
  const s = String(raw || "").trim();
  const m = s.match(/(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
  if (m) return { date: m[1], time: m[2] };
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { date: s, time: "" };
  return { date: "", time: "" };
}

function baseImported(partial) {
  const d = typeof emptyDive === "function" ? emptyDive() : {};
  return {
    ...d,
    id: typeof uid === "function" ? uid() : String(Date.now()) + Math.random(),
    imported: true,
    sourceComputer: partial.sourceComputer || "",
    ...partial,
  };
}

function parseUDDF(xml) {
  const dives = [];
  const diveNodes = findAll(xml, "dive").filter((el) => findOne(el, ["informationafterdive", "samples", "informationbeforedive"]));
  const sites = new Map();
  findAll(xml, "site").forEach((site) => {
    const id = site.getAttribute("id") || "";
    const name = txt(site, ["name"]) || txt(site, ["sitename"]);
    if (id) sites.set(id, name);
  });

  diveNodes.forEach((node) => {
    const after = findOne(node, "informationafterdive") || node;
    const before = findOne(node, "informationbeforedive") || node;
    const dt = splitDateTime(txt(before, ["datetime", "dateoftrip", "startdate"]) || txt(after, ["datetime"]));
    const maxDepth = num(txt(after, ["greatestdepth", "maxdepth", "depth"]));
    const totalSec = txt(after, ["diveduration", "duration"]);
    const totalTime = durationToMin(totalSec);
    const waypoints = findAll(node, "waypoint");
    const profilePoints = waypoints
      .map((w) => {
        const t = durationToMin(txt(w, ["divetime", "time"]));
        const depth = num(txt(w, ["depth"]));
        return t === "" || depth === "" ? null : { t: Number(t), d: Number(depth) };
      })
      .filter(Boolean);
    const siteRef = findOne(before, "link")?.getAttribute("ref") || "";
    const tank = findOne(node, "tankdata") || findOne(node, "tank");
    const mixEl = findOne(node, "mix") || tank;
    const o2 = num(txt(mixEl || node, ["o2", "oxygen"]));
    dives.push(
      baseImported({
        date: dt.date,
        timeIn: dt.time,
        maxDepth: maxDepth === "" ? "" : String(maxDepth),
        bottomTime: totalTime === "" ? "" : String(totalTime),
        totalTime: totalTime === "" ? "" : String(totalTime),
        waterTemp: txt(after, ["lowesttemperature", "temperature"]).replace(/[^\d.,-]/g, ""),
        site: sites.get(siteRef) || txt(before, ["name", "site", "divesite"]) || "Import UDDF",
        location: txt(xml, ["country", "location"]) || "",
        mix: o2 === "" ? "21" : String(Math.round(o2 > 1 ? o2 : o2 * 100)),
        tank: txt(tank || node, ["tankvolume", "volume"]) || "12",
        instruments: "Computer (UDDF)",
        sourceComputer: "uddf",
        profilePoints,
        notes: txt(after, ["notes", "comment", "remarks"]),
      })
    );
  });
  return dives;
}

function parseSuuntoXml(xml) {
  const diveNodes = findAll(xml, "dive");
  if (!diveNodes.length) return [];
  return diveNodes.map((node) => {
    const dt = splitDateTime(
      txt(node, ["datetime", "starttime", "date", "divedate", "time"])
    );
    const maxDepth = num(txt(node, ["maxdepth", "maximumdepth", "depth"]));
    const totalTime = durationToMin(txt(node, ["duration", "divetime", "diveduration", "bottomtime"]));
    const samplesParent = findOne(node, ["divesamples", "samples", "profile"]);
    const sampleNodes = samplesParent ? findAll(samplesParent, "sample") : findAll(node, "sample");
    const profilePoints = [];
    sampleNodes.forEach((s, i) => {
      const depth = num(txt(s, ["depth", "maxdepth"]));
      const tRaw = txt(s, ["time", "timestamp", "divetime"]);
      const t = tRaw ? durationToMin(tRaw) : i;
      if (depth !== "") profilePoints.push({ t: Number(t) || i, d: Number(depth) });
    });
    const model = txt(xml, ["computer", "devicemodel", "model"]) || "Suunto EON Core";
    return baseImported({
      date: dt.date,
      timeIn: dt.time,
      maxDepth: maxDepth === "" ? "" : String(maxDepth),
      bottomTime: totalTime === "" ? "" : String(totalTime),
      totalTime: totalTime === "" ? "" : String(totalTime),
      site: txt(node, ["site", "location", "spot", "divename"]) || "Suunto",
      location: txt(node, ["city", "country", "place"]) || "",
      waterTemp: String(num(txt(node, ["watertemp", "temperature", "mintemp"])) || ""),
      mix: String(num(txt(node, ["o2", "oxygen", "nitrox"])) || 21),
      pressureStart: String(num(txt(node, ["startpressure", "cylpressure", "pressure"])) || ""),
      pressureEnd: String(num(txt(node, ["endpressure"])) || ""),
      instruments: model,
      sourceComputer: "suunto",
      types: [],
      profilePoints,
      notes: txt(node, ["notes", "description", "comment"]),
    });
  });
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const split = (row) => row.split(/[;,\t]/).map((c) => c.trim().replace(/^"|"$/g, ""));
  const headers = split(lines[0]).map((h) => h.toLowerCase());
  const idx = (names) => names.map((n) => headers.findIndex((h) => h.includes(n))).find((i) => i >= 0);
  const iDate = idx(["date", "data"]);
  const iTime = idx(["time", "ora", "start"]);
  const iDepth = idx(["depth", "prof", "max"]);
  const iDur = idx(["duration", "tempo", "bottom", "fondo", "min"]);
  const iSite = idx(["site", "sito", "location", "spot"]);
  const iLoc = idx(["country", "località", "localita", "place"]);
  return lines.slice(1).map((line) => {
    const cols = split(line);
    const dt = splitDateTime(`${cols[iDate] || ""} ${cols[iTime] || ""}`.trim());
    return baseImported({
      date: dt.date || (cols[iDate] || "").slice(0, 10),
      timeIn: dt.time,
      maxDepth: String(num(cols[iDepth]) || ""),
      bottomTime: String(durationToMin(cols[iDur]) || ""),
      totalTime: String(durationToMin(cols[iDur]) || ""),
      site: cols[iSite] || "Import CSV",
      location: cols[iLoc] || "",
      instruments: "Computer (CSV)",
      sourceComputer: "csv",
    });
  }).filter((d) => d.date || d.maxDepth);
}

function f32(buf, o) {
  const dv = new DataView(buf.buffer, buf.byteOffset + o, 4);
  return dv.getFloat32(0, true);
}

function parseEonSteelLog(bytes, instrument) {
  if (bytes.length < 12) return null;
  const ascii = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
  if (ascii !== "SBEM") return null;
  const unix = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
  const when = unix ? new Date(unix * 1000) : null;
  const types = Array.from({ length: 512 }, () => ({ desc: "", format: "", sample: [] }));
  let maxDepth = 0;
  let diveMs = 0;
  let durationSec = "";
  let mix = "21";
  let temp = "";
  const profilePoints = [];
  let sampleMs = 0;

  const recordType = (id, text) => {
    const rec = { desc: "", format: "", sample: [] };
    text.split("\n").forEach((line) => {
      if (line.length < 5 || line[0] !== "<" || line[4] !== ">") return;
      const body = line.slice(5);
      if (line[1] === "P" || line[1] === "G") rec.desc = body;
      if (line[1] === "F") rec.format = body;
    });
    rec.sample = sampleKinds(rec.desc, rec.format, types);
    if (id < types.length) types[id] = rec;
  };

  const walkEntry = (buf) => {
    if (!buf.length || buf[0]) return buf.length;
    let textlen = buf[1];
    let nameOff = 2;
    if (textlen === 0xff) {
      textlen = buf[2] | (buf[3] << 8) | (buf[4] << 16) | (buf[5] << 24);
      nameOff = 6;
    }
    const id = buf[nameOff] | (buf[nameOff + 1] << 8);
    const name = new TextDecoder().decode(buf.slice(nameOff + 2, nameOff + textlen));
    recordType(id, name);
    let end = nameOff + textlen;
    while (end < buf.length && buf[end]) {
      let type = buf[end++];
      if (type === 0xff) {
        type = buf[end] | (buf[end + 1] << 8);
        end += 2;
      }
      let len = buf[end++];
      if (len === 0xff) {
        len = buf[end] | (buf[end + 1] << 8) | (buf[end + 2] << 16) | (buf[end + 3] << 24);
        end += 4;
      }
      const data = buf.slice(end, end + len);
      const desc = types[type];
      if (desc) applyEonField(desc, data, {
        setMax: (d) => {
          if (d > maxDepth) maxDepth = d;
        },
        addMs: (ms) => {
          diveMs += ms;
          sampleMs += ms;
        },
        depthCm: (cm) => {
          if (cm === 0xffff) return;
          const d = cm / 100;
          if (d > maxDepth) maxDepth = d;
          profilePoints.push({ t: Math.round(sampleMs / 60000), d: Math.round(d * 10) / 10 });
        },
        duration: (s) => {
          durationSec = String(s);
        },
        o2: (v) => {
          mix = String(v);
        },
        water: (c) => {
          temp = String(c);
        },
      });
      end += len;
    }
    return end || buf.length;
  };

  let cur = bytes.slice(12);
  while (cur.length > 4) {
    const n = walkEntry(cur);
    if (!n) break;
    cur = cur.slice(n);
  }

  const raw = Number(durationSec) || 0;
  let mins = Math.round(diveMs / 60000);
  if (raw > 100000) mins = Math.round(raw / 60000);
  else if (raw > 180) mins = Math.round(raw / 60);
  else if (raw > 0) mins = Math.round(raw);
  const date = when ? when.toISOString().slice(0, 10) : "";
  const timeIn = when ? when.toISOString().slice(11, 16) : "";
  return baseImported({
    date,
    timeIn,
    maxDepth: maxDepth ? String(Math.round(maxDepth * 10) / 10) : "",
    bottomTime: mins ? String(mins) : "",
    totalTime: mins ? String(mins) : "",
    waterTemp: temp,
    mix,
    site: instrument || "Suunto EON",
    instruments: instrument || "Suunto EON Core",
    sourceComputer: "suunto-ble",
    profilePoints: downsampleProfile(profilePoints),
    notes: "Scaricata via Bluetooth dal computer.",
  });
}

function downsampleProfile(pts) {
  if (pts.length <= 40) return pts;
  const step = Math.ceil(pts.length / 40);
  return pts.filter((_, i) => i % step === 0);
}

function sampleKinds(desc) {
  const kinds = [];
  if (!desc) return kinds;
  if (desc.includes("sml.DeviceLog.Samples") && (desc.includes("+Sample.Time") || desc.includes("+Time"))) kinds.push("time");
  if (desc.includes(".Sample.Depth") || desc.endsWith("Depth")) kinds.push("depth");
  if (/^\d/.test(desc)) return kinds;
  return kinds;
}

function applyEonField(desc, data, hooks) {
  const name = desc.desc || "";
  if (desc.sample?.includes("time") && data.length >= 2) hooks.addMs(data[0] | (data[1] << 8));
  if (desc.sample?.includes("depth") && data.length >= 2) hooks.depthCm(data[0] | (data[1] << 8));
  if (name.includes("Header.Depth.Max") && data.length >= 4) hooks.setMax(f32(data, 0));
  if (name.endsWith("Header.Duration") && data.length >= 4) {
    const n = data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
    hooks.duration(n);
  }
  if (name.includes("Gases.Gas.Oxygen") && data.length) hooks.o2(data[0]);
  if (name.includes("Temperature") && data.length >= 2) {
    const t = (data[0] | (data[1] << 8)) << 16 >> 16;
    if (t > -3000) hooks.water((t / 10).toFixed(1));
  }
}

function parseComputerFile(name, text) {
  const lower = name.toLowerCase();
  const trimmed = text.trim();
  if (!trimmed) return { dives: [], format: "vuoto" };
  if (lower.endsWith(".csv") || /^[\w ;,\t]+[\r\n]/.test(trimmed) && trimmed.includes(",") && !trimmed.startsWith("<")) {
    return { dives: parseCsv(trimmed), format: "CSV" };
  }
  if (trimmed.startsWith("<") || trimmed.startsWith("\uFEFF<")) {
    const xml = new DOMParser().parseFromString(trimmed, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error(`XML non valido in ${name}`);
    const uddfHits = findAll(xml, "uddf").length || findAll(xml, "profiledata").length;
    if (uddfHits || lower.endsWith(".uddf")) return { dives: parseUDDF(xml), format: "UDDF" };
    return { dives: parseSuuntoXml(xml), format: "XML Suunto / computer" };
  }
  throw new Error(`Formato non riconosciuto: ${name}. Usa UDDF, XML Suunto o CSV.`);
}

function diveKey(d) {
  return `${d.date || ""}|${d.timeIn || ""}|${Number(d.maxDepth) || 0}|${Number(d.bottomTime) || 0}`;
}

async function scanSuuntoBluetooth() {
  if (!navigator.bluetooth) {
    throw new Error("Web Bluetooth non è disponibile qui. Su desktop usa Chrome o Edge, poi importa UDDF dall’app Suunto. L’EON Core non espone il log in GATT aperto: il file resta il canale ufficiale.");
  }
  const device = await navigator.bluetooth.requestDevice({
    filters: [
      { namePrefix: "EON" },
      { namePrefix: "Suunto" },
      { namePrefix: "D5" },
      { namePrefix: "Steel" },
    ],
    optionalServices: ["battery_service", "device_information"],
  });
  return device.name || "Suunto";
}

window.SeaDiveComputers = {
  COMPUTERS,
  parseComputerFile,
  parseEonSteelLog,
  diveKey,
  scanSuuntoBluetooth,
};
