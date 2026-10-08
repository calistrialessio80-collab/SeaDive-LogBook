/** Import immersioni da computer subacquei (UDDF, XML Suunto, CSV). */
const COMPUTERS = [
  {
    id: "suunto-eon-core",
    brand: "Suunto",
    models: "EON Core (priorità), EON Steel, D5, D4i Novo, Vyper, Zoop",
    how: "Carica UDDF, XML, JSON o LOG dall’app Suunto. Bluetooth sperimentale solo su Chrome Android.",
    ble: true,
  },
  {
    id: "shearwater",
    brand: "Shearwater",
    models: "Perdix 2, Teric, Peregrine, Petrel",
    how: "Shearwater Cloud: esporta UDDF, XML o JSON e caricalo qui.",
  },
  {
    id: "garmin",
    brand: "Garmin",
    models: "Descent Mk / G1",
    how: "Garmin Connect / Dive: carica il file FIT, UDDF, JSON o GPX così com’è.",
  },
  {
    id: "mares",
    brand: "Mares",
    models: "Puck, Quad, Genius, Sirius",
    how: "App Mares / Dive Organizer: UDDF, XML, CSV o JSON.",
  },
  {
    id: "cressi",
    brand: "Cressi",
    models: "Leonardo, Goa, Donatello, Neon",
    how: "App Cressi: UDDF, XML, CSV o JSON.",
  },
  {
    id: "scubapro",
    brand: "Scubapro / Uwatec",
    models: "G2, G3, Aladin, Galileo",
    how: "LogTRAK / Scubapro: UDDF, XML o CSV.",
  },
  {
    id: "oceanic",
    brand: "Oceanic / Aqualung",
    models: "Geo, Veo, i330R, Aqualung",
    how: "DiverLog+ / Oceanic+: UDDF, XML, CSV o JSON.",
  },
  {
    id: "ratio",
    brand: "Ratio / Tusa / Seac",
    models: "iX3M, IQ, Screen",
    how: "Software del produttore: UDDF, FIT, JSON, XML, CSV o GPX.",
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

function geoFromXml(root) {
  if (!root) return {};
  const geo = findOne(root, "geography") || findOne(root, "gps") || root;
  const lat = num(txt(geo, ["latitude", "lat"]) || geo.getAttribute?.("lat") || "");
  const lng = num(txt(geo, ["longitude", "long", "lon", "lng"]) || geo.getAttribute?.("lon") || geo.getAttribute?.("lng") || "");
  return {
    lat: lat === "" ? "" : lat,
    lng: lng === "" ? "" : lng,
  };
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
    const geo = geoFromXml(site);
    if (id) sites.set(id, { name, ...geo });
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
    const siteInfo = sites.get(siteRef) || {};
    const geo = geoFromXml(node) || geoFromXml(before) || { lat: siteInfo.lat, lng: siteInfo.lng };
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
        site: siteInfo.name || txt(before, ["name", "site", "divesite"]) || "Import UDDF",
        location: txt(xml, ["country", "location"]) || "",
        lat: geo.lat ?? "",
        lng: geo.lng ?? "",
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
    const geo = geoFromXml(node);
    return baseImported({
      date: dt.date,
      timeIn: dt.time,
      maxDepth: maxDepth === "" ? "" : String(maxDepth),
      bottomTime: totalTime === "" ? "" : String(totalTime),
      totalTime: totalTime === "" ? "" : String(totalTime),
      site: txt(node, ["site", "location", "spot", "divename"]) || "Suunto",
      location: txt(node, ["city", "country", "place"]) || "",
      lat: geo.lat,
      lng: geo.lng,
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
  const iLat = idx(["lat", "latitude"]);
  const iLng = idx(["lng", "lon", "long", "longitude"]);
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
      lat: iLat >= 0 ? num(cols[iLat]) : "",
      lng: iLng >= 0 ? num(cols[iLng]) : "",
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

function pickKey(obj, names) {
  if (!obj || typeof obj !== "object") return "";
  const keys = Object.keys(obj);
  for (const name of names) {
    const hit = keys.find((k) => k.toLowerCase() === name.toLowerCase());
    if (hit != null && obj[hit] != null && obj[hit] !== "") return obj[hit];
  }
  return "";
}

function geoFromObj(obj) {
  if (!obj || typeof obj !== "object") return { lat: "", lng: "" };
  const nested = obj.gps || obj.geo || obj.geography || obj.position || obj.coordinates || obj.location || {};
  const lat = num(
    pickKey(obj, ["lat", "latitude", "gpslat", "dive_lat"]) ||
      pickKey(nested, ["lat", "latitude"]) ||
      (Array.isArray(nested) ? nested[0] : "")
  );
  const lng = num(
    pickKey(obj, ["lng", "lon", "long", "longitude", "gpslon", "dive_lon"]) || pickKey(nested, ["lng", "lon", "long", "longitude"])
  );
  return { lat: lat === "" ? "" : lat, lng: lng === "" ? "" : lng };
}

function looksLikeDive(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const blob = Object.keys(obj).join(" ").toLowerCase();
  if (/maxdepth|greatestdepth|bottomtime|divetime|divedate/.test(blob)) return true;
  return /depth/.test(blob) && /date|time/.test(blob);
}

function jsonDive(obj) {
  if (!obj || typeof obj !== "object") return null;
  const dt = splitDateTime(
    String(
      pickKey(obj, ["datetime", "starttime", "date", "divedate", "time", "timestamp", "start"]) ||
        `${pickKey(obj, ["date", "divedate"])} ${pickKey(obj, ["time", "starttime", "timein"])}`.trim()
    )
  );
  const depth = num(pickKey(obj, ["maxdepth", "max_depth", "depth", "greatestdepth", "max"]));
  const dur = pickKey(obj, ["bottomtime", "bottom_time", "duration", "diveduration", "divetime", "totaltime", "minutes"]);
  const geo = geoFromObj(obj);
  const siteObj = typeof obj.site === "object" ? obj.site : null;
  return baseImported({
    date: dt.date,
    timeIn: dt.time,
    maxDepth: depth === "" ? "" : String(depth),
    bottomTime: String(durationToMin(dur) || ""),
    totalTime: String(durationToMin(dur) || ""),
    site: String(pickKey(obj, ["site", "sitename", "name", "spot", "divename", "title"]) || siteObj?.name || "Import JSON"),
    location: String(pickKey(obj, ["location", "place", "country", "city"]) || (typeof obj.location === "string" ? obj.location : "") || ""),
    lat: geo.lat || (siteObj ? geoFromObj(siteObj).lat : ""),
    lng: geo.lng || (siteObj ? geoFromObj(siteObj).lng : ""),
    waterTemp: String(num(pickKey(obj, ["watertemp", "water_temp", "temperature", "temp"])) || ""),
    mix: String(num(pickKey(obj, ["mix", "o2", "oxygen", "nitrox"])) || 21),
    instruments: String(pickKey(obj, ["computer", "device", "model", "instruments"]) || "Computer (JSON)"),
    sourceComputer: "json",
    notes: String(pickKey(obj, ["notes", "comment", "remarks", "description"]) || ""),
  });
}

function collectJsonDives(data, acc = []) {
  if (!data) return acc;
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (looksLikeDive(item)) acc.push(jsonDive(item));
      else collectJsonDives(item, acc);
    });
    return acc;
  }
  if (typeof data !== "object") return acc;
  if (looksLikeDive(data) && (data.dives == null || !Array.isArray(data.dives))) acc.push(jsonDive(data));
  ["dives", "Dives", "logs", "activities", "records", "Records", "diveLog", "data", "items"].forEach((k) => {
    if (data[k]) collectJsonDives(data[k], acc);
  });
  return acc;
}

function parseDiveJson(text) {
  const data = JSON.parse(text);
  const dives = collectJsonDives(data).filter((d) => d && (d.date || d.maxDepth));
  if (!dives.length) throw new Error("JSON senza immersioni riconoscibili.");
  return dives;
}

function parseGpx(xml) {
  const pts = [...xml.querySelectorAll("trkpt, wpt")];
  if (!pts.length) return [];
  const first = pts[0];
  const lat = num(first.getAttribute("lat"));
  const lng = num(first.getAttribute("lon"));
  const when = splitDateTime(txt(first, ["time"]) || txt(xml, ["time"]));
  const name = txt(xml, ["name"]) || "Traccia GPX";
  return [
    baseImported({
      date: when.date,
      timeIn: when.time,
      site: name,
      lat,
      lng,
      instruments: "GPX",
      sourceComputer: "gpx",
      notes: `${pts.length} punti GPS.`,
    }),
  ];
}

function isFit(bytes) {
  if (bytes.length < 14) return false;
  return String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) === ".FIT";
}

function fitU16(b, i, le) {
  return le ? b[i] | (b[i + 1] << 8) : (b[i] << 8) | b[i + 1];
}
function fitU32(b, i, le) {
  return le
    ? (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0
    : ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
}
function fitS32(b, i, le) {
  return fitU32(b, i, le) | 0;
}

function fitTime(v) {
  if (!v || v === 0xffffffff) return null;
  return new Date((v + 631065600) * 1000);
}

function fitReadFields(bytes, i, def) {
  const rec = {};
  let o = i;
  def.fields.forEach((f) => {
    let val;
    if (f.size === 1) val = bytes[o];
    else if (f.size === 2) val = fitU16(bytes, o, def.le);
    else if (f.size === 4) val = f.base === 0x85 || f.base === 0x86 ? fitS32(bytes, o, def.le) : fitU32(bytes, o, def.le);
    else val = null;
    rec[f.num] = val;
    o += f.size;
  });
  return rec;
}

function parseFit(bytes) {
  const headerSize = bytes[0] || 14;
  const dataSize = fitU32(bytes, 4, true);
  const end = Math.min(bytes.length - 2, headerSize + dataSize);
  const defs = {};
  let i = headerSize;
  let lastTs = 0;
  const sessions = [];
  const summaries = [];
  const gps = [];
  const depths = [];

  while (i < end) {
    const h = bytes[i++];
    if (h & 0x80) {
      const local = (h >> 5) & 3;
      const def = defs[local];
      if (!def) break;
      lastTs += h & 0x1f;
      const rec = fitReadFields(bytes, i, def);
      rec[253] = lastTs;
      i += def.dataSize;
      collectFit(def.global, rec, sessions, summaries, gps, depths);
      continue;
    }
    const isDef = h & 0x40;
    const local = h & 0x0f;
    const hasDev = h & 0x20;
    if (isDef) {
      i += 1;
      const le = bytes[i++] === 0;
      const global = fitU16(bytes, i, le);
      i += 2;
      const nfields = bytes[i++];
      const fields = [];
      let dataSize = 0;
      for (let f = 0; f < nfields; f++) {
        const num = bytes[i++];
        const size = bytes[i++];
        const base = bytes[i++];
        fields.push({ num, size, base });
        dataSize += size;
      }
      if (hasDev) {
        const nd = bytes[i++];
        for (let f = 0; f < nd; f++) {
          i += 1;
          const size = bytes[i++];
          i += 1;
          dataSize += size;
        }
      }
      defs[local] = { global, fields, dataSize, le };
      continue;
    }
    const def = defs[local];
    if (!def) break;
    const rec = fitReadFields(bytes, i, def);
    if (rec[253]) lastTs = rec[253];
    i += def.dataSize;
    collectFit(def.global, rec, sessions, summaries, gps, depths);
  }

  const dives = [];
  const sources = summaries.length ? summaries : sessions;
  sources.forEach((s, idx) => {
    const when = fitTime(s.start || s.ts);
    const maxM = s.maxDepth != null ? s.maxDepth / (s.maxDepth > 200 ? 1000 : 1) : depths[idx] || Math.max(0, ...depths);
    const mins = s.bottom != null ? Math.round(s.bottom / (s.bottom > 180 ? 60000 : 1)) : s.elapsed ? Math.round(s.elapsed / 1000 / 60) : "";
    const g = gps[0] || {};
    dives.push(
      baseImported({
        date: when ? when.toISOString().slice(0, 10) : "",
        timeIn: when ? when.toISOString().slice(11, 16) : "",
        maxDepth: maxM ? String(Math.round(maxM * 10) / 10) : "",
        bottomTime: mins ? String(mins) : "",
        totalTime: mins ? String(mins) : "",
        site: "Garmin FIT",
        lat: g.lat ?? "",
        lng: g.lng ?? "",
        instruments: "Garmin (FIT)",
        sourceComputer: "fit",
      })
    );
  });
  if (!dives.length && (gps.length || depths.length)) {
    const when = fitTime(sessions[0]?.start);
    const g = gps[0] || {};
    dives.push(
      baseImported({
        date: when ? when.toISOString().slice(0, 10) : "",
        timeIn: when ? when.toISOString().slice(11, 16) : "",
        maxDepth: depths.length ? String(Math.max(...depths)) : "",
        site: "Garmin FIT",
        lat: g.lat ?? "",
        lng: g.lng ?? "",
        instruments: "Garmin (FIT)",
        sourceComputer: "fit",
      })
    );
  }
  if (!dives.length) throw new Error("File FIT senza immersioni (sessioni / dive summary).");
  return dives;
}

function collectFit(global, rec, sessions, summaries, gps, depths) {
  const ts = rec[253];
  if (global === 20) {
    if (rec[0] != null && rec[1] != null && rec[0] !== 0x7fffffff && rec[1] !== 0x7fffffff) {
      gps.push({
        lat: rec[0] * (180 / 2147483648),
        lng: rec[1] * (180 / 2147483648),
      });
    }
    if (rec[14] != null && rec[14] < 20000) depths.push(rec[14] / (rec[14] > 200 ? 100 : 1));
  }
  if (global === 18) {
    sessions.push({
      ts,
      start: rec[2] || ts,
      sport: rec[5],
      elapsed: rec[7],
    });
  }
  if (global === 268) {
    summaries.push({
      ts,
      start: rec[14] || rec[253] || ts,
      maxDepth: rec[4],
      bottom: rec[13],
    });
  }
}

function parseComputerFile(name, text) {
  const lower = name.toLowerCase();
  const trimmed = (text || "").trim().replace(/^\uFEFF/, "");
  if (!trimmed) return { dives: [], format: "vuoto" };
  if (lower.endsWith(".json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return { dives: parseDiveJson(trimmed), format: "JSON" };
  }
  if (lower.endsWith(".csv") || (!trimmed.startsWith("<") && trimmed.includes(",") && /date|data|depth|prof/i.test(trimmed.slice(0, 200)))) {
    return { dives: parseCsv(trimmed), format: "CSV" };
  }
  if (trimmed.startsWith("<") || /\.(uddf|xml|gpx|ssrf|sml|zxu)$/i.test(lower)) {
    const xml = new DOMParser().parseFromString(trimmed, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error(`XML non valido in ${name}`);
    if (lower.endsWith(".gpx") || xml.querySelector("gpx, trkpt")) return { dives: parseGpx(xml), format: "GPX" };
    const uddfHits = findAll(xml, "uddf").length || findAll(xml, "profiledata").length;
    if (uddfHits || lower.endsWith(".uddf") || lower.endsWith(".ssrf")) return { dives: parseUDDF(xml), format: "UDDF" };
    return { dives: parseSuuntoXml(xml), format: "XML computer" };
  }
  throw new Error(`Formato non riconosciuto: ${name}. Prova UDDF, FIT, JSON, XML, CSV o GPX.`);
}

function parseComputerBytes(name, buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const lower = name.toLowerCase();
  if (lower.endsWith(".fit") || isFit(bytes)) return { dives: parseFit(bytes), format: "Garmin FIT" };
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  return parseComputerFile(name, text);
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
  parseComputerBytes,
  parseEonSteelLog,
  diveKey,
  scanSuuntoBluetooth,
};
