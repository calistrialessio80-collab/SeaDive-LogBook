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

function durationToMin(raw, asSeconds) {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  if (/^\d+:\d{2}(:\d{2})?$/.test(s)) {
    const p = s.split(":").map(Number);
    if (p.length === 3) return Math.round(p[0] * 60 + p[1] + p[2] / 60);
    return Math.round(p[0] + p[1] / 60);
  }
  const n = num(s);
  if (n === "") return "";
  if (asSeconds || n >= 180) return Math.max(0, Math.round(n / 60));
  return Math.round(n);
}

function secToMin(raw) {
  const n = num(raw);
  if (n === "") return "";
  return Math.round((n / 60) * 10) / 10;
}

function pressureBar(v) {
  const n = num(v);
  if (n === "") return "";
  if (n > 100000) return String(Math.round(n / 100000));
  if (n > 2500) return String(Math.round(n / 1000));
  return String(Math.round(n * 10) / 10);
}

function volumeLiters(v) {
  const n = num(v);
  if (n === "") return "";
  if (n > 0 && n < 1.5) return String(Math.round(n * 1000));
  return String(Math.round(n * 10) / 10);
}

function o2Percent(v) {
  const n = num(v);
  if (n === "") return "";
  if (n > 0 && n <= 1) return String(Math.round(n * 100));
  return String(Math.round(n));
}

function tempC(v) {
  const n = num(String(v).replace(/[^\d.,-]/g, ""));
  if (n === "") return "";
  if (n > 200) return String(Math.round((n - 273.15) * 10) / 10);
  return String(Math.round(n * 10) / 10);
}

function addMinutes(time, mins) {
  if (!time || mins === "" || mins == null) return "";
  const p = String(time).split(":").map(Number);
  if (p.length < 2 || !Number.isFinite(p[0])) return "";
  let t = p[0] * 60 + p[1] + Number(mins);
  if (!Number.isFinite(t)) return "";
  t = ((t % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.round(t % 60)).padStart(2, "0")}`;
}

function safetyFromProfile(pts) {
  const near = (pts || []).filter((p) => p.d >= 3 && p.d <= 7);
  if (near.length < 2) return "";
  const t = near[near.length - 1].t - near[0].t;
  return t >= 1 ? String(Math.round(t)) : "";
}

function inferTypes(d) {
  const blob = `${d.site || ""} ${d.notes || ""} ${d.types || ""}`.toLowerCase();
  const types = Array.isArray(d.types) ? [...d.types] : [];
  const add = (t) => {
    if (!types.includes(t)) types.push(t);
  };
  if (/wreck|relitto|shipwreck/.test(blob)) add("Relitto");
  if (/night|notturn/.test(blob)) add("Notturna");
  if (/drift|corrente|current/.test(blob)) add("Corrente");
  if (Number(d.maxDepth) >= 30) add("Profonda");
  if (/boat|barca/.test(blob)) add("Da barca");
  if (/shore|riva|beach/.test(blob)) add("Da riva");
  return types;
}

function strField(v) {
  if (v == null || v === "") return "";
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return String(v).trim();
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

const FIELD_ALIASES = {
  site: ["sitename", "site", "spot", "divename", "divesite", "poi", "waypointname"],
  location: ["location", "city", "place", "country", "region", "area", "state"],
  timeIn: ["timein", "starttime", "entrytime", "oraingresso"],
  timeOut: ["timeout", "endtime", "stoptime", "exittime", "orauscita"],
  maxDepth: ["greatestdepth", "maxdepth", "maximumdepth", "depthmax", "profmax"],
  plannedDepth: ["programmedivedepth", "planneddepth", "targetdepth", "plandepth"],
  bottomTime: ["bottomtime", "divetime", "diveduration", "duration", "tempofondo"],
  totalTime: ["totaltime", "totale", "totalruntime"],
  safetyStop: ["safetystop", "safetystoptime", "stoptime", "sostasicurezza"],
  surfaceInterval: ["surfaceintervalbeforedive", "surfaceinterval", "si", "surfacetime"],
  visibility: ["horizontalvisibility", "visibility", "vis", "visibilita", "visibility_m"],
  waterTemp: ["lowesttemperature", "watertemp", "watertemperature", "mintemp", "tempacqua"],
  airTemp: ["airtemperature", "airtemp", "air_temp", "temparia"],
  current: ["currentstrength", "current", "corrente"],
  seaConditions: ["seacondition", "seaconditions", "weather", "waves", "sea", "condizioni", "wind"],
  wetsuit: ["exposureprotection", "wetsuit", "suit", "suittype", "muta"],
  ballast: ["leadquantity", "ballast", "weight", "lead", "zavorra"],
  tank: ["tankvolume", "tanksize", "cylindersize", "volume", "bombola"],
  mix: ["oxygen", "nitrox", "o2", "ean", "mix", "fo2"],
  pressureStart: ["tankpressurebegin", "beginpressure", "startpressure", "start_bar", "pressurestart", "cylpressure"],
  pressureEnd: ["tankpressureend", "endpressure", "end_bar", "pressureend"],
  regulator: ["regulator", "autorespiratore", "bcd"],
  instruments: ["computer", "devicemodel", "model", "divecomputer", "serialnumber"],
  buddyName: ["divebuddy", "buddy", "partner", "compagno"],
  buddyCert: ["buddycert", "buddycertificate", "partnercert"],
  guideName: ["diveguide", "guide", "instructor", "divemaster"],
  guideCert: ["guidecert", "instructorcert"],
  centerName: ["divecenter", "diveshop", "shop", "operator", "center"],
  centerLead: ["centerlead", "owner", "responsabile"],
  notes: ["observation", "remarks", "comment", "description", "notes", "note"],
  lat: ["latitude", "lat", "gpslat"],
  lng: ["longitude", "long", "lon", "lng", "gpslon"],
  feeling: ["rating", "stars", "score", "feeling", "voto"],
};

const NOTE_EXTRA_KEYS = [
  "weather", "wind", "waves", "salinity", "averagedepth", "avgdepth", "meandepth",
  "cns", "otu", "deco", "helium", "he", "n2", "nitrogen", "gasname", "mixname",
  "airconsumption", "sac", "rmv", "density", "altitude", "platform", "boat",
  "purpose", "trip", "vessel", "serial", "firmware", "desaturation", "noflytime",
  "ascent", "descent", "hangtime", "ndl", "tts",
];

function xmlBag(root) {
  const bag = {};
  if (!root) return bag;
  [...root.querySelectorAll("*")].forEach((el) => {
    const name = localName(el);
    const direct = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(" ");
    if (direct && bag[name] == null) bag[name] = direct;
  });
  [...root.attributes || []].forEach((a) => {
    if (a.value && bag[a.name.toLowerCase()] == null) bag[a.name.toLowerCase()] = a.value;
  });
  return bag;
}

function flattenVals(obj, out = {}, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 7) return out;
  if (Array.isArray(obj)) {
    obj.slice(0, 8).forEach((item) => flattenVals(item, out, depth + 1));
    return out;
  }
  Object.entries(obj).forEach(([k, v]) => {
    if (v == null || v === "") return;
    const key = String(k).toLowerCase();
    if (typeof v === "object") flattenVals(v, out, depth + 1);
    else if (out[key] == null) out[key] = v;
  });
  return out;
}

function aliasGet(bag, names) {
  if (!bag) return "";
  for (const n of names) {
    const k = n.toLowerCase();
    if (bag[k] != null && bag[k] !== "") return bag[k];
  }
  const keys = Object.keys(bag);
  for (const n of names) {
    const k = n.toLowerCase();
    const hit = keys.find((x) => x === k || x.endsWith(k));
    if (hit && bag[hit] != null && bag[hit] !== "") return bag[hit];
  }
  return "";
}

function extraNotes(bag, already) {
  if (!bag) return "";
  const skip = new Set(
    Object.values(FIELD_ALIASES)
      .flat()
      .concat(["date", "datetime", "divedate", "time", "depth", "samples", "profile", "id", "ref"])
      .map((s) => s.toLowerCase())
  );
  const lines = [];
  NOTE_EXTRA_KEYS.forEach((k) => {
    const v = aliasGet(bag, [k]);
    if (v === "" || v == null) return;
    const s = strField(v);
    if (!s || already.includes(s)) return;
    lines.push(`${k}: ${s}`);
  });
  Object.keys(bag).forEach((k) => {
    if (skip.has(k) || NOTE_EXTRA_KEYS.includes(k)) return;
    const v = bag[k];
    if (typeof v !== "string" && typeof v !== "number") return;
    const s = strField(v);
    if (!s || s.length > 80 || already.includes(s)) return;
  });
  return lines.join(" · ");
}

function fillFromBag(partial, bag) {
  if (!bag) return partial;
  Object.entries(FIELD_ALIASES).forEach(([key, names]) => {
    if (partial[key] != null && partial[key] !== "") return;
    const v = aliasGet(bag, names);
    if (v === "" || v == null) return;
    if (key === "feeling") {
      const n = num(v);
      if (n >= 1 && n <= 5) partial[key] = n;
      return;
    }
    partial[key] = v;
  });
  const extra = extraNotes(bag, `${partial.notes || ""} ${partial.site || ""} ${partial.location || ""}`);
  if (extra) partial.notes = [partial.notes, extra].filter(Boolean).join("\n");
  return partial;
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
  d.tank = "";
  d.mix = "";
  d.pressureStart = "";
  d.safetyStop = "";
  const merged = {
    ...d,
    id: typeof uid === "function" ? uid() : String(Date.now()) + Math.random(),
    imported: true,
    sourceComputer: partial.sourceComputer || "",
    ...partial,
  };
  return normalizeImported(merged);
}

function normalizeImported(d) {
  d.waterTemp = tempC(d.waterTemp);
  d.airTemp = tempC(d.airTemp);
  if (d.tank !== "" && d.tank != null) d.tank = volumeLiters(d.tank) || strField(d.tank);
  const mix = o2Percent(d.mix);
  d.mix = mix || "21";
  d.pressureStart = pressureBar(d.pressureStart);
  d.pressureEnd = pressureBar(d.pressureEnd);
  d.maxDepth = d.maxDepth === "" || d.maxDepth == null ? "" : String(Math.round(Number(d.maxDepth) * 10) / 10);
  d.plannedDepth = strField(d.plannedDepth) || d.maxDepth;
  d.visibility = strField(d.visibility);
  d.current = strField(d.current);
  d.seaConditions = strField(d.seaConditions);
  d.site = strField(d.site);
  d.location = strField(d.location);
  d.notes = strField(d.notes);
  d.instruments = strField(d.instruments);
  d.buddyName = strField(d.buddyName);
  d.buddyCert = strField(d.buddyCert);
  d.guideName = strField(d.guideName);
  d.guideCert = strField(d.guideCert);
  d.centerName = strField(d.centerName);
  d.centerLead = strField(d.centerLead);
  d.wetsuit = strField(d.wetsuit);
  d.ballast = strField(d.ballast);
  d.regulator = strField(d.regulator);
  d.bottomTime = d.bottomTime === "" || d.bottomTime == null ? "" : String(Math.round(Number(d.bottomTime) || 0) || "");
  d.totalTime = d.totalTime === "" || d.totalTime == null ? "" : String(Math.round(Number(d.totalTime) || 0) || "");
  if (!d.totalTime && d.bottomTime) d.totalTime = d.bottomTime;
  if (!d.bottomTime && d.totalTime) d.bottomTime = d.totalTime;
  if (!d.timeOut && d.timeIn && d.totalTime) d.timeOut = addMinutes(d.timeIn, d.totalTime);
  const pts = Array.isArray(d.profilePoints) ? downsampleProfile(d.profilePoints) : [];
  d.profilePoints = pts;
  if (pts.length >= 3) d.profileFromComputer = true;
  if (!d.safetyStop) d.safetyStop = safetyFromProfile(pts) || (Number(d.maxDepth) >= 10 ? "3" : "");
  d.types = inferTypes(d);
  if (d.lat !== "" && d.lat != null) d.lat = String(d.lat);
  if (d.lng !== "" && d.lng != null) d.lng = String(d.lng);
  return d;
}

function parseUDDF(xml) {
  const dives = [];
  const diveNodes = findAll(xml, "dive").filter((el) => findOne(el, ["informationafterdive", "samples", "informationbeforedive"]));
  const sites = new Map();
  findAll(xml, "site").forEach((site) => {
    const id = site.getAttribute("id") || "";
    const name = txt(site, ["name"]) || txt(site, ["sitename"]);
    const geo = geoFromXml(site);
    const location = txt(site, ["location", "city"]) || txt(findOne(site, "geography") || site, ["location", "country"]);
    if (id) sites.set(id, { name, location, ...geo });
  });

  diveNodes.forEach((node) => {
    const after = findOne(node, "informationafterdive") || node;
    const before = findOne(node, "informationbeforedive") || node;
    const dt = splitDateTime(txt(before, ["datetime", "dateoftrip", "startdate"]) || txt(after, ["datetime"]));
    const maxDepth = num(txt(after, ["greatestdepth", "maxdepth", "depth"]));
    const totalMin = durationToMin(txt(after, ["diveduration", "duration"]), true);
    const waypoints = findAll(node, "waypoint");
    const profilePoints = [];
    const wpPress = [];
    const wpTemp = [];
    waypoints.forEach((w) => {
      const t = secToMin(txt(w, ["divetime", "time"]));
      const depth = num(txt(w, ["depth"]));
      if (t !== "" && depth !== "") profilePoints.push({ t: Number(t), d: Number(depth) });
      const p = txt(w, ["tankpressure", "pressure"]);
      if (p) wpPress.push(p);
      const tw = txt(w, ["temperature"]);
      if (tw) wpTemp.push(tw);
    });
    const siteRef = findOne(before, "link")?.getAttribute("ref") || findOne(node, "link")?.getAttribute("ref") || "";
    const siteInfo = sites.get(siteRef) || {};
    const geo = geoFromXml(findOne(node, "geography") || node);
    const tank = findOne(node, "tankdata") || findOne(node, "tank");
    const mixEl = findOne(node, "mix") || tank;
    const o2 = txt(mixEl || node, ["o2", "oxygen"]);
    const vis = txt(after, ["visibility", "horizontalvisibility", "visibility_m"]);
    const current = txt(after, ["current", "currentstrength"]) || txt(before, ["current"]);
    const rating = num(txt(after, ["rating", "stars", "score"]));
    const manufacturer = txt(findOne(xml, "manufacturer") || xml, ["name"]) || txt(xml, ["manufacturer"]);
    const model = txt(findOne(xml, "generator") || xml, ["model", "devicemodel"]);
    const he = txt(mixEl || node, ["he", "helium"]);
    const avg = txt(after, ["averagedepth", "mean"]);
    const bag = { ...xmlBag(before), ...xmlBag(after), ...xmlBag(tank), ...xmlBag(mixEl), ...xmlBag(node) };
    dives.push(
      baseImported(
        fillFromBag(
          {
            date: dt.date,
            timeIn: dt.time,
            maxDepth: maxDepth === "" ? "" : String(maxDepth),
            plannedDepth: strField(num(txt(before, ["programmedivedepth", "planneddepth"]))),
            bottomTime: totalMin === "" ? "" : String(totalMin),
            totalTime: totalMin === "" ? "" : String(totalMin),
            surfaceInterval: strField(durationToMin(txt(before, ["surfaceintervalbeforedive", "surfaceinterval"]), true)),
            waterTemp: txt(after, ["lowesttemperature", "temperature"]) || wpTemp[0] || "",
            airTemp: txt(before, ["airtemperature"]),
            visibility: vis.replace(/[^\d.,-]/g, ""),
            current,
            seaConditions: txt(after, ["seacondition", "weather", "waves"]) || txt(before, ["weather"]),
            wetsuit: txt(node, ["suit", "exposureprotection", "wetsuit"]),
            ballast: txt(node, ["lead", "leadquantity", "weight", "ballast"]),
            site: siteInfo.name || txt(before, ["sitename", "site", "divesite"]) || "Import UDDF",
            location: siteInfo.location || "",
            lat: geo.lat || siteInfo.lat || "",
            lng: geo.lng || siteInfo.lng || "",
            mix: o2,
            tank: txt(tank || node, ["tankvolume", "volume"]),
            pressureStart: txt(tank || node, ["tankpressurebegin", "beginpressure", "startpressure"]) || wpPress[0] || "",
            pressureEnd: txt(tank || node, ["tankpressureend", "endpressure"]) || wpPress[wpPress.length - 1] || "",
            instruments: [manufacturer, model].filter(Boolean).join(" ") || "Computer (UDDF)",
            buddyName: txt(findOne(node, "buddy") || node, ["personal", "name", "buddy", "divebuddy", "partner"]),
            guideName: txt(node, ["diveguide", "guide", "instructor"]),
            centerName: txt(node, ["shop", "divecenter", "operator"]),
            feeling: rating >= 1 && rating <= 5 ? rating : 0,
            sourceComputer: "uddf",
            profilePoints,
            notes: [
              txt(after, ["notes", "comment", "remarks", "observation"]),
              avg ? `prof. media ${avg} m` : "",
              he && num(he) > 0 ? `He ${o2Percent(he)}%` : "",
            ]
              .filter(Boolean)
              .join(" · "),
          },
          bag
        )
      )
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
    const endDt = splitDateTime(txt(node, ["endtime", "stoptime", "timeout"]));
    return baseImported(
      fillFromBag(
        {
          date: dt.date,
          timeIn: dt.time,
          timeOut: endDt.time,
          maxDepth: maxDepth === "" ? "" : String(maxDepth),
          plannedDepth: strField(num(txt(node, ["planneddepth", "targetdepth"]))),
          bottomTime: totalTime === "" ? "" : String(totalTime),
          totalTime: totalTime === "" ? "" : String(totalTime),
          surfaceInterval: strField(durationToMin(txt(node, ["surfaceinterval", "si"]))),
          safetyStop: strField(durationToMin(txt(node, ["safetystop", "stoptime"]))),
          site: txt(node, ["site", "spot", "divename", "divesite"]) || "Suunto",
          location: txt(node, ["city", "country", "place", "location"]) || "",
          lat: geo.lat,
          lng: geo.lng,
          waterTemp: txt(node, ["watertemp", "temperature", "mintemp", "water_temp"]),
          airTemp: txt(node, ["airtemp", "airtemperature"]),
          visibility: txt(node, ["visibility", "vis"]),
          current: txt(node, ["current"]),
          seaConditions: txt(node, ["weather", "sea", "waves"]),
          mix: txt(node, ["o2", "oxygen", "nitrox", "mix"]),
          tank: txt(node, ["tank", "tanksize", "cylindersize", "volume"]),
          pressureStart: txt(node, ["startpressure", "cylpressure", "pressure", "start_bar"]),
          pressureEnd: txt(node, ["endpressure", "end_bar"]),
          ballast: txt(node, ["weight", "ballast", "lead"]),
          wetsuit: txt(node, ["suit", "wetsuit"]),
          regulator: txt(node, ["regulator"]),
          instruments: model,
          buddyName: txt(node, ["buddy", "partner"]),
          guideName: txt(node, ["guide", "instructor"]),
          centerName: txt(node, ["diveshop", "center", "operator"]),
          feeling: (() => {
            const n = num(txt(node, ["rating", "stars"]));
            return n >= 1 && n <= 5 ? n : 0;
          })(),
          sourceComputer: "suunto",
          profilePoints,
          notes: txt(node, ["notes", "description", "comment"]),
        },
        xmlBag(node)
      )
    );
  });
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const split = (row) => row.split(/[;,\t]/).map((c) => c.trim().replace(/^"|"$/g, ""));
  const headers = split(lines[0]).map((h) => h.toLowerCase());
  const idx = (names) => names.map((n) => headers.findIndex((h) => h.includes(n))).find((i) => i >= 0);
  const iDate = idx(["date", "data"]);
  const iTime = idx(["time in", "timein", "start time", "ora", "start"]);
  const iOut = idx(["time out", "timeout", "end time", "fine"]);
  const iDepth = idx(["max depth", "maxdepth", "depth", "prof"]);
  const iPlan = idx(["planned", "program"]);
  const iDur = idx(["bottom", "fondo", "duration", "divetime", "tempo"]);
  const iTotal = idx(["total time", "totaltime", "totale"]);
  const iSite = idx(["site", "sito", "spot"]);
  const iLoc = idx(["country", "località", "localita", "place", "location"]);
  const iLat = idx(["lat", "latitude"]);
  const iLng = idx(["lng", "lon", "long", "longitude"]);
  const iMix = idx(["o2", "nitrox", "mix", "ean"]);
  const iTank = idx(["tank", "cyl", "bombola", "volume"]);
  const iP0 = idx(["start press", "startpressure", "bar in", "pressure start"]);
  const iP1 = idx(["end press", "endpressure", "bar out", "pressure end"]);
  const iTemp = idx(["water temp", "watertemp", "temp acqua", "temp"]);
  const iAir = idx(["air temp", "airtemp"]);
  const iVis = idx(["visib"]);
  const iNotes = idx(["note", "comment", "remark"]);
  const iBuddy = idx(["buddy"]);
  const iGuide = idx(["guide", "instructor"]);
  const iCenter = idx(["center", "shop", "diving"]);
  return lines.slice(1).map((line) => {
    const cols = split(line);
    const col = (i) => (i >= 0 ? cols[i] : "");
    const bag = {};
    headers.forEach((h, i) => {
      if (h && cols[i]) bag[h] = cols[i];
    });
    const dt = splitDateTime(`${col(iDate) || ""} ${col(iTime) || ""}`.trim());
    return baseImported(
      fillFromBag(
        {
          date: dt.date || (col(iDate) || "").slice(0, 10),
          timeIn: dt.time,
          timeOut: col(iOut),
          maxDepth: String(num(col(iDepth)) || ""),
          plannedDepth: String(num(col(iPlan)) || ""),
          bottomTime: String(durationToMin(col(iDur)) || ""),
          totalTime: String(durationToMin(col(iTotal) || col(iDur)) || ""),
          site: col(iSite) || "Import CSV",
          location: col(iLoc) || "",
          lat: iLat >= 0 ? num(col(iLat)) : "",
          lng: iLng >= 0 ? num(col(iLng)) : "",
          mix: col(iMix),
          tank: col(iTank),
          pressureStart: col(iP0),
          pressureEnd: col(iP1),
          waterTemp: col(iTemp),
          airTemp: col(iAir),
          visibility: col(iVis),
          buddyName: col(iBuddy),
          guideName: col(iGuide),
          centerName: col(iCenter),
          notes: col(iNotes),
          instruments: "Computer (CSV)",
          sourceComputer: "csv",
        },
        bag
      )
    );
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
    profilePoints,
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
    if (hit == null || obj[hit] == null || obj[hit] === "") continue;
    if (typeof obj[hit] === "object") continue;
    return obj[hit];
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

function jsonProfile(obj) {
  const arr = obj.samples || obj.profile || obj.waypoints || obj.profilePoints || obj.diveProfile || [];
  if (!Array.isArray(arr)) return [];
  return arr
    .map((p, i) => {
      if (p == null) return null;
      if (Array.isArray(p)) return { t: Number(p[0]) || i, d: Number(p[1]) };
      const depth = num(pickKey(p, ["d", "depth", "Depth"]));
      if (depth === "") return null;
      let t = num(pickKey(p, ["t", "time", "divetime", "offset", "minute", "min"]));
      if (t === "") t = i;
      if (t > 180) t = Math.round((t / 60) * 10) / 10;
      return { t: Number(t), d: Number(depth) };
    })
    .filter(Boolean);
}

function jsonDive(obj) {
  if (!obj || typeof obj !== "object") return null;
  const gas = obj.gas || obj.gases || obj.tank || obj.cylinder || {};
  const dt = splitDateTime(
    String(
      pickKey(obj, ["datetime", "startTime", "starttime", "date", "divedate", "timestamp", "start"]) ||
        `${pickKey(obj, ["date", "divedate"])} ${pickKey(obj, ["time", "starttime", "timeIn", "timein"])}`.trim()
    )
  );
  const end = splitDateTime(String(pickKey(obj, ["endtime", "endTime", "timeOut", "timeout", "stoptime"]) || ""));
  const depth = num(pickKey(obj, ["maxdepth", "maxDepth", "max_depth", "depth", "greatestdepth", "max"]));
  const dur = pickKey(obj, ["bottomtime", "bottomTime", "bottom_time", "duration", "diveduration", "diveTime", "divetime", "totaltime", "minutes"]);
  const total = pickKey(obj, ["totaltime", "totalTime", "diveduration", "duration"]);
  const geo = geoFromObj(obj);
  const siteObj = typeof obj.site === "object" ? obj.site : null;
  const computer = obj.computer || obj.device || obj.diveComputer || {};
  return baseImported(
    fillFromBag(
      {
        date: dt.date,
        timeIn: dt.time,
        timeOut: end.time,
        maxDepth: depth === "" ? "" : String(depth),
        plannedDepth: strField(pickKey(obj, ["planneddepth", "plannedDepth", "targetDepth"])),
        bottomTime: String(durationToMin(dur) || ""),
        totalTime: String(durationToMin(total || dur) || ""),
        surfaceInterval: strField(durationToMin(pickKey(obj, ["surfaceinterval", "surfaceInterval", "si"]))),
        safetyStop: strField(durationToMin(pickKey(obj, ["safetystop", "safetyStop"]))),
        site: String(pickKey(obj, ["site", "siteName", "sitename", "spot", "divename", "title"]) || siteObj?.name || "Import JSON"),
        location: String(
          pickKey(obj, ["location", "place", "country", "city"]) ||
            (typeof obj.location === "string" ? obj.location : "") ||
            siteObj?.country ||
            ""
        ),
        lat: geo.lat || (siteObj ? geoFromObj(siteObj).lat : ""),
        lng: geo.lng || (siteObj ? geoFromObj(siteObj).lng : ""),
        waterTemp: strField(pickKey(obj, ["watertemp", "waterTemp", "water_temp", "minTemp", "temperature", "temp"])),
        airTemp: strField(pickKey(obj, ["airtemp", "airTemp", "air_temp"])),
        visibility: strField(pickKey(obj, ["visibility", "vis"])),
        current: strField(pickKey(obj, ["current"])),
        seaConditions: strField(pickKey(obj, ["sea", "weather", "conditions", "seaConditions"])),
        mix: strField(pickKey(obj, ["mix", "o2", "oxygen", "nitrox"]) || pickKey(gas, ["o2", "oxygen", "mix"])),
        tank: strField(pickKey(obj, ["tank", "tankSize", "volume"]) || pickKey(gas, ["size", "volume", "tank"])),
        pressureStart: strField(pickKey(obj, ["pressureStart", "startpressure", "startPressure"]) || pickKey(gas, ["start", "begin", "pressureStart"])),
        pressureEnd: strField(pickKey(obj, ["pressureEnd", "endpressure", "endPressure"]) || pickKey(gas, ["end", "pressureEnd"])),
        ballast: strField(pickKey(obj, ["ballast", "weight", "lead"])),
        wetsuit: strField(pickKey(obj, ["wetsuit", "suit"])),
        regulator: strField(pickKey(obj, ["regulator"])),
        instruments: String(pickKey(obj, ["computer", "model", "instruments"]) || pickKey(computer, ["name", "model"]) || "Computer (JSON)"),
        buddyName: strField(pickKey(obj, ["buddy", "buddyName", "partner"])),
        guideName: strField(pickKey(obj, ["guide", "guideName", "instructor"])),
        centerName: strField(pickKey(obj, ["center", "diveCenter", "shop", "operator"])),
        feeling: (() => {
          const n = num(pickKey(obj, ["rating", "stars", "feeling"]));
          return n >= 1 && n <= 5 ? n : 0;
        })(),
        sourceComputer: "json",
        profilePoints: jsonProfile(obj),
        notes: strField(pickKey(obj, ["notes", "comment", "remarks", "description"])),
      },
      flattenVals(obj)
    )
  );
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
  const last = pts[pts.length - 1];
  const lat = num(first.getAttribute("lat"));
  const lng = num(first.getAttribute("lon"));
  const when = splitDateTime(txt(first, ["time"]) || txt(xml, ["time"]));
  const end = splitDateTime(txt(last, ["time"]));
  const name = txt(xml, ["name"]) || "Traccia GPX";
  let total = "";
  if (when.date && when.time && end.time) {
    const a = when.time.split(":").map(Number);
    const b = end.time.split(":").map(Number);
    let n = b[0] * 60 + b[1] - (a[0] * 60 + a[1]);
    if (n < 0) n += 1440;
    total = String(n);
  }
  return [
    baseImported({
      date: when.date,
      timeIn: when.time,
      timeOut: end.time,
      bottomTime: total,
      totalTime: total,
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

function fitMeters(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n > 200) return n / 1000;
  return n;
}

function fitMinutes(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n > 100000) return String(Math.round(n / 60000));
  if (n > 180) return String(Math.round(n / 1000 / 60) || Math.round(n / 60));
  return String(Math.round(n));
}

function parseFit(bytes) {
  const headerSize = bytes[0] || 14;
  const dataSize = fitU32(bytes, 4, true);
  const end = Math.min(bytes.length - 2, headerSize + dataSize);
  const defs = {};
  let i = headerSize;
  let lastTs = 0;
  const bag = { sessions: [], summaries: [], gps: [], samples: [], temps: [], gases: [], tanks: [] };

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
      collectFit(def.global, rec, bag);
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
    collectFit(def.global, rec, bag);
  }

  const depths = bag.samples.map((s) => s.depth).filter((n) => n > 0);
  const profilePoints = [];
  if (bag.samples.length) {
    const t0 = bag.samples[0].ts || 0;
    bag.samples.forEach((s) => {
      if (!s.depth) return;
      profilePoints.push({ t: Math.max(0, Math.round(((s.ts - t0) % 86400) / 60)), d: Math.round(s.depth * 10) / 10 });
    });
  }
  const g = bag.gps[0] || {};
  const minTemp = bag.temps.length ? Math.min(...bag.temps) : "";
  const dives = [];
  const sources = bag.summaries.length ? bag.summaries : bag.sessions;
  sources.forEach((s) => {
    const when = fitTime(s.start || s.ts);
    const maxM = fitMeters(s.maxDepth) || (depths.length ? Math.max(...depths) : 0);
    const mins = fitMinutes(s.bottom) || fitMinutes(s.elapsed) || "";
    dives.push(
      baseImported({
        date: when ? when.toISOString().slice(0, 10) : "",
        timeIn: when ? when.toISOString().slice(11, 16) : "",
        maxDepth: maxM ? String(Math.round(maxM * 10) / 10) : "",
        bottomTime: mins,
        totalTime: mins,
        surfaceInterval: fitMinutes(s.surface),
        waterTemp: minTemp !== "" ? String(minTemp) : tempC(s.bottomTemp || s.startTemp || s.maxTemp),
        mix: bag.gases[0] ? o2Percent(bag.gases[0]) : "",
        tank: "",
        pressureStart: bag.tanks[0] != null ? pressureBar(bag.tanks[0]) : "",
        pressureEnd: bag.tanks.length ? pressureBar(bag.tanks[bag.tanks.length - 1]) : "",
        site: "Garmin",
        lat: g.lat || s.lat || "",
        lng: g.lng || s.lng || "",
        instruments: "Garmin (FIT)",
        sourceComputer: "fit",
        profilePoints,
        notes: [
          s.avgDepth ? `prof. media ${fitMeters(s.avgDepth)} m` : "",
          s.hang ? `sosta ${fitMinutes(s.hang)} min` : "",
        ]
          .filter(Boolean)
          .join(" · "),
      })
    );
  });
  if (!dives.length && (bag.gps.length || depths.length || bag.sessions.length)) {
    const when = fitTime(bag.sessions[0]?.start || bag.samples[0]?.ts);
    dives.push(
      baseImported({
        date: when ? when.toISOString().slice(0, 10) : "",
        timeIn: when ? when.toISOString().slice(11, 16) : "",
        maxDepth: depths.length ? String(Math.max(...depths)) : "",
        waterTemp: minTemp !== "" ? String(minTemp) : "",
        site: "Garmin",
        lat: g.lat ?? "",
        lng: g.lng ?? "",
        instruments: "Garmin (FIT)",
        sourceComputer: "fit",
        profilePoints,
      })
    );
  }
  if (!dives.length) throw new Error("File FIT senza immersioni (sessioni / dive summary).");
  return dives;
}

function collectFit(global, rec, bag) {
  const ts = rec[253];
  if (global === 20) {
    let lat = null;
    let lng = null;
    if (rec[0] != null && rec[1] != null && rec[0] !== 0x7fffffff && rec[1] !== 0x7fffffff) {
      lat = rec[0] * (180 / 2147483648);
      lng = rec[1] * (180 / 2147483648);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) bag.gps.push({ lat, lng });
    }
    const depthRaw = rec[78] ?? rec[73] ?? rec[15];
    const depth = depthRaw != null && depthRaw > 0 && depthRaw < 500000 ? fitMeters(depthRaw) : 0;
    if (rec[13] != null && rec[13] > -20 && rec[13] < 50) bag.temps.push(rec[13]);
    bag.samples.push({ ts: ts || 0, depth, lat, lng });
  }
  if (global === 18) {
    let lat = "";
    let lng = "";
    if (rec[3] != null && rec[4] != null && rec[3] !== 0x7fffffff) {
      lat = rec[3] * (180 / 2147483648);
      lng = rec[4] * (180 / 2147483648);
    }
    bag.sessions.push({
      ts,
      start: rec[2] || ts,
      sport: rec[5],
      elapsed: rec[7] ?? rec[8],
      maxTemp: rec[14] ?? rec[13],
      lat,
      lng,
    });
  }
  if (global === 259 && rec[1] != null) bag.gases.push(rec[1] > 1 ? rec[1] / 100 : rec[1]);
  if (global === 319 && rec[2] != null && rec[2] !== 0xffff) bag.tanks.push(rec[2]);
  if (global === 268) {
    bag.summaries.push({
      ts,
      start: rec[253] || ts,
      avgDepth: rec[2],
      maxDepth: rec[3],
      surface: rec[4],
      bottom: rec[11],
      hang: rec[16],
      startTemp: rec[17] ?? rec[11],
      bottomTemp: rec[18] ?? rec[12],
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
