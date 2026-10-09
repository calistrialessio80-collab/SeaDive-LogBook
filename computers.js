/** Import immersioni da computer subacquei (FIT Suunto/Garmin, UDDF, XML, CSV). */
const COMPUTERS = [
  {
    id: "suunto-eon-core",
    brand: "Suunto",
    models: "EON Core (priorità), EON Steel, D5, D4i Novo, Vyper, Zoop",
    how: "Carica il file FIT, UDDF, XML o JSON dall’app Suunto. Bluetooth sperimentale solo su Chrome Android.",
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
  waterTemp: ["watertemp", "watertemperature", "avgtemp", "meantemp", "tempacqua"],
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
  cns: ["cns", "endcns", "o2_toxicity", "cns_load", "cnspercent"],
  otu: ["otu", "otus", "otu_total"],
  tss: ["tss", "hrtss", "hr_tss", "relative_effort", "training_stress", "training_load"],
  bottomTemp: ["bottomtemp", "tempfondo", "lowesttemperature", "mintemp"],
  ascentRate: ["ascentrate", "avgascentrate", "ascent_rate", "verticalspeed"],
  ascentMax: ["maxascentrate", "maxascent", "ascentmax"],
  sac: ["sac", "rmv", "airconsumption", "surfaceairconsumption", "gasconsumption", "ventilation"],
  avgDepth: ["averagedepth", "avgdepth", "meandepth", "depthavg", "depthaverage"],
  ndl: ["ndl", "nodectime", "nodeco", "ndltime"],
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
  d.bottomTemp = tempC(d.bottomTemp) || d.waterTemp;
  d.cns = strField(d.cns);
  d.otu = strField(d.otu);
  d.tss = strField(d.tss);
  d.ascentRate = strField(d.ascentRate);
  d.ascentMax = strField(d.ascentMax);
  d.sac = strField(d.sac);
  d.gf = strField(d.gf) || strField(d.computerLog?.gf);
  if (d.tank !== "" && d.tank != null) d.tank = volumeLiters(d.tank) || strField(d.tank);
  const mix = o2Percent(d.mix);
  d.mix = mix || "21";
  d.pressureStart = pressureBar(d.pressureStart);
  d.pressureEnd = pressureBar(d.pressureEnd);
  d.maxDepth = d.maxDepth === "" || d.maxDepth == null ? "" : String(Math.round(Number(d.maxDepth) * 10) / 10);
  const avgN = Number(d.avgDepth);
  d.avgDepth = Number.isFinite(avgN) && avgN > 0.05 ? String(Math.round(avgN * 10) / 10) : "";
  if (Number.isNaN(Number(d.maxDepth))) d.maxDepth = "";
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
  d.ndl = strField(d.ndl);
  if (d.deco == null && d.noDeco == null) {
    d.deco = false;
    d.noDeco = true;
  } else {
    d.deco = Boolean(d.deco);
    d.noDeco = d.noDeco != null ? Boolean(d.noDeco) : !d.deco;
  }
  if (d.circuitOpen == null && d.circuitClosed == null) {
    const r = String(d.regulator || "");
    const closed = /chiuso|ccr|rebreather/i.test(r);
    const open = /aperto|open circuit|\boc\b/i.test(r);
    d.circuitClosed = closed;
    d.circuitOpen = open || !closed;
  } else {
    d.circuitOpen = Boolean(d.circuitOpen);
    d.circuitClosed = Boolean(d.circuitClosed);
  }
  d.regulator = [d.circuitOpen && "Circuito aperto", d.circuitClosed && "Circuito chiuso"].filter(Boolean).join(" + ");
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
      const tw = txt(w, ["temperature"]);
      if (tw) wpTemp.push(tw);
      if (t !== "" && depth !== "") {
        const pt = { t: Number(t), d: Number(depth) };
        const c = sampleTemp({ c: tempC(tw) });
        if (c != null) pt.c = c;
        profilePoints.push(pt);
      }
      const p = txt(w, ["tankpressure", "pressure"]);
      if (p) wpPress.push(p);
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
      if (depth !== "") {
        const pt = { t: Number(t) || i, d: Number(depth) };
        const c = sampleTemp({ c: tempC(txt(s, ["temperature", "temp", "watertemp"])) });
        if (c != null) pt.c = c;
        profilePoints.push(pt);
      }
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

function sampleTemp(p) {
  if (!p || typeof p !== "object") return null;
  const raw = p.c ?? p.temp ?? p.temperature;
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= -5 || n >= 45) return null;
  return Math.round(n * 10) / 10;
}

function downsampleProfile(pts) {
  const cleaned = (pts || [])
    .map((p) => {
      const c = sampleTemp(p);
      const row = { t: Number(p.t), d: Number(p.d) };
      if (c != null) row.c = c;
      return row;
    })
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.d) && p.d >= 0 && p.t >= 0)
    .sort((a, b) => a.t - b.t || a.d - b.d);
  if (cleaned.length <= 1) return cleaned;
  const uniq = [];
  cleaned.forEach((p) => {
    const prev = uniq[uniq.length - 1];
    if (!prev || Math.abs(prev.t - p.t) > 0.008 || Math.abs(prev.d - p.d) > 0.04) uniq.push(p);
    else if (p.d > prev.d) uniq[uniq.length - 1] = { ...p, c: p.c != null ? p.c : prev.c };
    else if (prev.c == null && p.c != null) prev.c = p.c;
  });
  if (uniq.length <= 480) return uniq;
  const n = 220;
  const t0 = uniq[0].t;
  const span = Math.max(0.001, uniq[uniq.length - 1].t - t0);
  const buckets = Array.from({ length: n }, () => []);
  uniq.forEach((p) => {
    const i = Math.min(n - 1, Math.floor(((p.t - t0) / span) * n));
    buckets[i].push(p);
  });
  const out = [];
  buckets.forEach((b) => {
    if (!b.length) return;
    let lo = b[0];
    let hi = b[0];
    b.forEach((p) => {
      if (p.d < lo.d) lo = p;
      if (p.d > hi.d) hi = p;
    });
    [b[0], lo, hi, b[b.length - 1]]
      .sort((a, c) => a.t - c.t || a.d - c.d)
      .forEach((p) => {
        const prev = out[out.length - 1];
        if (!prev || prev.t !== p.t || prev.d !== p.d) out.push(p);
      });
  });
  return out.length >= 8 ? out : uniq;
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
      const pt = { t: Number(t), d: Number(depth) };
      const c = sampleTemp({ c: tempC(pickKey(p, ["c", "temp", "temperature", "watertemp"])) });
      if (c != null) pt.c = c;
      return pt;
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

function kelvinC(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n > 200 && n < 400) return String(Math.round((n - 273.15) * 10) / 10);
  return tempC(n);
}

function paToBar(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n > 50000) return String(Math.round(n / 100000));
  if (n > 400) return String(Math.round(n / 100));
  return String(Math.round(n * 10) / 10);
}

function pickDeep(obj, names) {
  if (!obj || typeof obj !== "object") return "";
  const want = names.map((n) => n.toLowerCase());
  const stack = [obj];
  let found = "";
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;
    Object.entries(cur).forEach(([k, v]) => {
      if (v == null || v === "") return;
      if (typeof v === "object") {
        stack.push(v);
        return;
      }
      if (want.includes(String(k).toLowerCase())) found = v;
    });
  }
  return found;
}

function parseSuuntoDeviceLog(root) {
  const log = root?.DeviceLog || root?.deviceLog;
  if (!log || typeof log !== "object") return null;
  const header = log.Header || log.header || {};
  const samples = log.Samples || log.samples || [];
  const activity = Number(header.ActivityType);
  const depthObj = header.Depth && typeof header.Depth === "object" ? header.Depth : {};
  if (activity && activity !== 51 && !(depthObj.Max || header.DepthAverage)) return [];
  const diving = header.Diving && typeof header.Diving === "object" ? header.Diving : {};
  const device = header.Device && typeof header.Device === "object" ? header.Device : {};
  const tempObj = header.Temperature && typeof header.Temperature === "object" ? header.Temperature : {};
  const maxM = Number(depthObj.Max || header.MaxDepth || 0);
  const avgM = Number(header.DepthAverage || depthObj.Avg || depthObj.Average || 0);
  const durS = Number(header.Duration || header.DiveTime || 0);
  const mins = durS > 0 ? String(Math.max(1, Math.round(durS / 60))) : "";
  const dt = splitDateTime(String(header.DateTime || header.StartTime || ""));
  const brand = device.Name ? (/suunto/i.test(device.Name) ? device.Name : "Suunto " + device.Name) : "Suunto";
  let t0 = 0;
  samples.forEach((s) => {
    if (!s || t0) return;
    const ms = Date.parse(s.TimeISO8601 || s.Timestamp || s.Time || "");
    if (s.DiveEvents?.DiveStatus && ms) t0 = ms;
    const ev = s.Events;
    if (Array.isArray(ev) && ev.some((e) => e?.State?.Active && e.State.Type === "Dive Active") && ms) t0 = ms;
  });
  if (!t0) {
    const first = samples.find((s) => Number(s?.Depth) > 0.4) || samples[0];
    t0 = Date.parse(first?.TimeISO8601 || first?.Timestamp || 0) || 0;
  }
  const pts = [];
  const vents = [];
  let lastCns = "";
  let lastOtu = "";
  let pStart = "";
  let pEnd = "";
  let lastC = null;
  let deepC = "";
  let deepD = 0;
  let minC = "";
  samples.forEach((s) => {
    if (!s || typeof s !== "object") return;
    const ms = Date.parse(s.TimeISO8601 || s.Timestamp || s.Time || 0);
    const depth = Number(s.Depth);
    if (Number.isFinite(depth) && depth >= 0 && ms && t0) {
      const t = Math.max(0, Math.round(((ms - t0) / 60000) * 100) / 100);
      const pt = { t, d: Math.round(depth * 10) / 10 };
      const c = kelvinC(s.Temperature);
      if (c) {
        lastC = Number(c);
        pt.c = lastC;
        if (minC === "" || lastC < Number(minC)) minC = String(lastC);
      } else if (lastC != null) pt.c = lastC;
      pts.push(pt);
      if (depth > deepD && lastC != null) {
        deepD = depth;
        deepC = String(lastC);
      }
    }
    if (s.CNS != null && s.CNS !== "") lastCns = s.CNS;
    if (s.Cns != null && s.Cns !== "") lastCns = s.Cns;
    if (s.OTU != null && s.OTU !== "") lastOtu = s.OTU;
    if (s.Otu != null && s.Otu !== "") lastOtu = s.Otu;
    if (s.O2Toxicity != null && s.O2Toxicity !== "") lastCns = lastCns || s.O2Toxicity;
    const vent = Number(s.Ventilation);
    if (vent > 0 && depth > 1) vents.push(vent);
    (s.Cylinders || []).forEach((cyl) => {
      const bar = paToBar(cyl?.Pressure);
      if (bar) {
        if (!pStart) pStart = bar;
        pEnd = bar;
      }
      const v2 = Number(cyl?.Ventilation);
      if (v2 > 0) vents.push(v2);
    });
  });
  const meanD =
    avgM > 0
      ? avgM
      : pts.filter((p) => p.d > 0.4).length
        ? pts.filter((p) => p.d > 0.4).reduce((a, p) => a + p.d, 0) / pts.filter((p) => p.d > 0.4).length
        : 0;
  const sacVent = vents.length ? round1((vents.reduce((a, b) => a + b, 0) / vents.length) * 60000) : "";
  const cns = pickDeep(header, ["cns", "endcns", "o2toxicity"]) || diving.CNS || lastCns;
  const otu = pickDeep(header, ["otu", "otus"]) || diving.OTU || lastOtu;
  const gfLo = pickDeep(header, ["gf_low", "gflow", "gradientfactorlow", "lowgf"]) || diving.GradientFactorLow;
  const gfHi = pickDeep(header, ["gf_high", "gfhigh", "gradientfactorhigh", "highgf"]) || diving.GradientFactorHigh;
  const o2 = pickDeep(header, ["o2", "oxygen", "fo2"]) || (diving.Gases && diving.Gases[0] && (diving.Gases[0].Oxygen || diving.Gases[0].O2));
  const mix = o2Percent(o2) || "21";
  const ndl = pickDeep({ samples: samples.slice(-5), header }, ["nodectime", "ndl", "ndltime", "nodecotime"]) || "";
  const surfaceInterval =
    fitMinutes(pickDeep(header, ["surfaceinterval", "surfacetime", "surface_time", "surfaceintervalbeforedive"])) ||
    fitMinutes(diving.SurfaceTime || header.SurfaceTime || "");
  const extras = {
    format: "Suunto JSON",
    avgDepth: meanD ? String(Math.round(meanD * 10) / 10) : "",
    cns: cns !== "" && cns != null ? String(cns) : "",
    otu: otu !== "" && otu != null ? String(otu) : "",
    sacFit: sacVent && Number(sacVent) > 0.5 && Number(sacVent) < 80 ? sacVent : "",
    gf: formatGf(gfLo, gfHi),
    ndl: ndl !== "" && ndl != null ? fitNdlMin(ndl) || String(ndl) : "",
    surfaceInterval,
    mode: String(pickDeep(header, ["divemode", "mode"]) || ""),
    samples: pts.length,
  };
  if (!extras.cns) extras.cns = computeCnsFromProfile(pts, mix);
  if (!extras.otu) extras.otu = estimateOtu(meanD, maxM, mix, mins);
  if (!extras.sacFit) extras.sacFit = computeFitSac("12", pStart, pEnd, mins, meanD, maxM);
  const deco = samples.some((s) => Number(s?.Ceiling) > 0.3) || String(ndl) === "0";
  return [
    baseImported({
      date: dt.date,
      timeIn: dt.time,
      timeOut: dt.time && mins ? addMinutes(dt.time, mins) : "",
      maxDepth: maxM ? String(Math.round(maxM * 10) / 10) : pts.length ? String(Math.max(...pts.map((p) => p.d))) : "",
      avgDepth: extras.avgDepth,
      plannedDepth: maxM ? String(Math.round(maxM * 10) / 10) : "",
      bottomTime: mins,
      totalTime: mins,
      surfaceInterval,
      waterTemp: deepC || minC,
      bottomTemp: minC || kelvinC(Math.min(Number(tempObj.Max) || 999, Number(tempObj.Min) || 999)),
      cns: extras.cns,
      otu: extras.otu,
      sac: extras.sacFit,
      ndl: ndl !== "" && ndl != null ? fitNdlMin(ndl) || String(ndl) : "",
      deco,
      noDeco: !deco,
      mix,
      pressureStart: pStart,
      pressureEnd: pEnd,
      instruments: brand,
      sourceComputer: "suunto-json",
      profilePoints: downsampleProfile(pts),
      computerLog: extras,
      notes: strField(header.Notes),
      gf: extras.gf,
    }),
  ];
}

function mergeSuuntoPair(jsonDive, fitDive) {
  if (!jsonDive) return fitDive;
  if (!fitDive) return jsonDive;
  const d = { ...jsonDive };
  ["cns", "otu", "sac", "avgDepth", "mix", "tank", "ndl", "ascentRate", "ascentMax", "pressureStart", "pressureEnd", "waterTemp", "bottomTemp", "gf", "surfaceInterval"].forEach((k) => {
    if (d[k] === "" || d[k] == null) d[k] = fitDive[k];
  });
  d.computerLog = { ...(fitDive.computerLog || {}), ...(jsonDive.computerLog || {}) };
  if (!(d.computerLog.gf) && fitDive.computerLog?.gf) d.computerLog.gf = fitDive.computerLog.gf;
  if (!(d.profilePoints?.length >= 8) && (fitDive.profilePoints || []).length >= 8) d.profilePoints = fitDive.profilePoints;
  if ((d.profilePoints || []).length >= 3) d.profileFromComputer = true;
  if (jsonDive.circuitClosed || fitDive.circuitClosed) d.circuitClosed = true;
  if (jsonDive.circuitOpen || fitDive.circuitOpen) d.circuitOpen = true;
  d.instruments = d.instruments || fitDive.instruments;
  d.sourceComputer = "suunto-json+fit";
  return normalizeImported(d);
}

function computeCnsFromProfile(pts, mix) {
  const fo2 = (Number(mix) || 21) / 100;
  const sorted = [...(pts || [])].sort((a, b) => Number(a.t) - Number(b.t));
  if (sorted.length < 3 || !(fo2 > 0)) return "";
  const table = [
    [0.5, 720],
    [0.6, 570],
    [0.7, 450],
    [0.8, 350],
    [0.9, 310],
    [1.0, 270],
    [1.1, 240],
    [1.2, 210],
    [1.3, 180],
    [1.4, 150],
    [1.5, 120],
    [1.6, 45],
  ];
  const limMin = (po2) => {
    if (po2 < 0.5) return 0;
    if (po2 >= 1.6) return 45;
    for (let i = 1; i < table.length; i++) {
      if (po2 <= table[i][0]) {
        const [p0, t0] = table[i - 1];
        const [p1, t1] = table[i];
        return t0 + ((po2 - p0) / (p1 - p0)) * (t1 - t0);
      }
    }
    return 45;
  };
  let cns = 0;
  for (let i = 1; i < sorted.length; i++) {
    const dt = Number(sorted[i].t) - Number(sorted[i - 1].t);
    if (!(dt > 0)) continue;
    const d = (Number(sorted[i].d) + Number(sorted[i - 1].d)) / 2;
    const po2 = (1 + Math.max(0, d) / 10) * fo2;
    const lim = limMin(po2);
    if (lim > 0) cns += (dt / lim) * 100;
  }
  if (!(cns > 0.05)) return "0";
  return String(Math.round(cns * 10) / 10);
}

function parseDiveJson(text) {
  const data = JSON.parse(text);
  if (data.DeviceLog || data.deviceLog) {
    const suunto = parseSuuntoDeviceLog(data);
    if (suunto && suunto.length) return suunto;
  }
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

function isFitAt(bytes, o) {
  return o + 12 <= bytes.length && String.fromCharCode(bytes[o + 8], bytes[o + 9], bytes[o + 10], bytes[o + 11]) === ".FIT";
}

function isFit(bytes) {
  return isFitAt(bytes, 0);
}

function fitU16(b, i, le) {
  return le ? b[i] | (b[i + 1] << 8) : (b[i] << 8) | b[i + 1];
}
function fitU32(b, i, le) {
  return le
    ? (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0
    : ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
}
function fitS16(b, i, le) {
  const v = fitU16(b, i, le);
  return v & 0x8000 ? v - 0x10000 : v;
}
function fitS32(b, i, le) {
  return fitU32(b, i, le) | 0;
}
function fitF32(b, i, le) {
  return new DataView(b.buffer, b.byteOffset + i, 4).getFloat32(0, le);
}
function fitF64(b, i, le) {
  return new DataView(b.buffer, b.byteOffset + i, 8).getFloat64(0, le);
}
function fitString(b, i, size) {
  let s = "";
  for (let k = 0; k < size; k++) {
    if (!b[i + k]) break;
    s += String.fromCharCode(b[i + k]);
  }
  return s.trim();
}

function fitScalar(bytes, o, size, base, le) {
  const t = base & 0x1f;
  if (t === 7 || ((t === 13 || t === 0) && size > 1)) return fitString(bytes, o, size);
  if (t === 8) return size >= 4 ? fitF32(bytes, o, le) : null;
  if (t === 9) return size >= 8 ? fitF64(bytes, o, le) : null;
  if (t === 1) return bytes[o] << 24 >> 24;
  if (t === 0 || t === 2 || t === 10 || t === 13) return bytes[o];
  if (t === 3) return fitS16(bytes, o, le);
  if (t === 4 || t === 11) return fitU16(bytes, o, le);
  if (t === 5) return fitS32(bytes, o, le);
  if (t === 6 || t === 12) return fitU32(bytes, o, le);
  if (size === 1) return bytes[o];
  if (size === 2) return fitU16(bytes, o, le);
  if (size === 4) return fitU32(bytes, o, le);
  if (size === 8 && t === 9) return fitF64(bytes, o, le);
  return fitString(bytes, o, size);
}

function fitIsInvalid(base, val) {
  if (val == null || val === "") return true;
  const t = base & 0x1f;
  if (typeof val === "number" && !Number.isFinite(val)) return true;
  if (t === 0 || t === 2 || t === 10 || t === 13) return val === 0xff;
  if (t === 4 || t === 11) return val === 0xffff;
  if (t === 6 || t === 12) return val === 0xffffffff;
  if (t === 5) return val === 0x7fffffff;
  if (t === 3) return val === 0x7fff;
  return false;
}

function guessDevBase(size, metaBase) {
  if (metaBase != null && metaBase !== "") return metaBase;
  if (size === 4) return 0x88;
  if (size === 1) return 2;
  if (size === 2) return 4;
  if (size === 8) return 0x89;
  return 0x88;
}

function fitDevScalar(bytes, o, size, base, le) {
  const v = fitScalar(bytes, o, size, base, le);
  if (size >= 4) {
    const f = fitF32(bytes, o, le);
    if (Number.isFinite(f) && Math.abs(f) < 1e7) {
      const vn = Number(v);
      if (!Number.isFinite(vn) || Math.abs(vn) > 1e7 || (Math.abs(vn) > 8000 && Math.abs(f) < 800)) return f;
    }
  }
  if (v != null && v !== "" && !(typeof v === "number" && !Number.isFinite(v))) return v;
  if (size === 1) return bytes[o];
  if (size === 2) return fitU16(bytes, o, le);
  return v;
}

function fitReadRecord(bytes, i, def, desc) {
  const rec = { dev: {} };
  let o = i;
  def.fields.forEach((f) => {
    const val = fitScalar(bytes, o, f.size, f.base, def.le);
    if (!fitIsInvalid(f.base, val)) rec[f.num] = val;
    o += f.size;
  });
  (def.devFields || []).forEach((f) => {
    const meta = desc?.get(`${f.devIdx}:${f.num}`);
    const base = guessDevBase(f.size, meta?.base != null ? meta.base : f.base);
    let val = fitDevScalar(bytes, o, f.size, base, def.le);
    const scale = Number(meta?.scale);
    if ([10, 100, 1000].includes(scale) && typeof val === "number" && Number.isFinite(val)) val = val / scale;
    rec.dev[`${f.devIdx}:${f.num}`] = val;
    o += f.size;
  });
  return rec;
}

function fitClock(v, offset) {
  if (!v || v === 0xffffffff) return { date: "", time: "" };
  const d = new Date((Number(v) + 631065600 + (offset || 0)) * 1000);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  return { date: d.toISOString().slice(0, 10), time: d.toISOString().slice(11, 16) };
}

function fitDepthM(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n >= 0xffffffff) return 0;
  if (n <= 80) return Math.round(n * 10) / 10;
  if (n <= 130) return Math.round(n * 10) / 10;
  if (n <= 13000) return Math.round(n) / 100;
  if (n <= 130000) return Math.round(n) / 1000;
  return 0;
}

function fitFieldName(desc, k) {
  return String(desc.get(k)?.name || "")
    .toLowerCase()
    .replace(/%/g, "pct")
    .replace(/[\s.]+/g, "_");
}

function pickSampleDepth(dev, desc) {
  const rows = Object.entries(dev || {}).map(([k, v]) => ({
    v,
    name: fitFieldName(desc, k),
    native: Number(desc.get(k)?.nativeField),
  }));
  const hit = rows.find(
    (r) =>
      r.native === 98 ||
      r.name === "depth" ||
      r.name === "dive_depth" ||
      r.name === "current_depth" ||
      r.name.endsWith("_depth") && !/max|avg|average|stop|ndl|ceiling/.test(r.name)
  );
  if (hit && hit.v != null && hit.v !== "") return fitDepthM(hit.v);
  return 0;
}

function recordDepthM(rec, desc) {
  const fromDev = pickSampleDepth(rec.dev, desc);
  if (fromDev > 0 && fromDev < 130) return fromDev;
  const n98 = fitDepthM(rec[98]);
  if (n98 > 0 && n98 < 130) return n98;
  const pa = rec[97] > 110000 ? rec[97] : rec[91];
  if (pa > 110000 && pa < 2500000) return Math.max(0, Math.round(((pa - 101325) / 10000) * 10) / 10);
  return 0;
}

function meanSampleDepth(samples) {
  const ds = (samples || []).map((s) => Number(s.depth)).filter((d) => d > 0.4 && d < 130);
  if (ds.length < 3) return 0;
  return Math.round((ds.reduce((a, b) => a + b, 0) / ds.length) * 10) / 10;
}

function meanProfileDepthM(pts) {
  const s = [...(pts || [])]
    .filter((p) => Number.isFinite(Number(p.t)) && Number(p.d) > 0.15 && Number(p.d) < 130)
    .sort((a, b) => Number(a.t) - Number(b.t));
  if (s.length < 3) return 0;
  let acc = 0;
  let dt = 0;
  for (let i = 1; i < s.length; i++) {
    const w = Number(s[i].t) - Number(s[i - 1].t);
    if (!(w > 0)) continue;
    const d = (Number(s[i].d) + Number(s[i - 1].d)) / 2;
    if (d < 0.3) continue;
    acc += d * w;
    dt += w;
  }
  if (dt >= 0.15) return Math.round((acc / dt) * 10) / 10;
  const ds = s.map((p) => Number(p.d)).filter((d) => d > 0.3);
  if (ds.length < 3) return 0;
  return Math.round((ds.reduce((a, b) => a + b, 0) / ds.length) * 10) / 10;
}

function saneDiveDepth(v, maxM) {
  const m = fitDepthM(v);
  if (!(m > 0.3) || m >= 130) return 0;
  if (maxM > 1 && m > maxM * 1.25 + 0.8) return 0;
  if (maxM > 3 && m < maxM * 0.12) return 0;
  return m;
}

function trimDiveSamples(samples) {
  if (!samples?.length) return samples || [];
  let a = samples.findIndex((s) => s.depth >= 0.7);
  if (a < 0) return samples;
  let b = samples.length - 1;
  for (let i = samples.length - 1; i >= 0; i--) {
    if (samples[i].depth >= 0.7) {
      b = i;
      break;
    }
  }
  return samples.slice(Math.max(0, a - 1), Math.min(samples.length - 1, b + 1) + 1);
}

function alignDepthToMax(points, maxM) {
  const peak = Math.max(0, ...points.map((p) => Number(p.d) || 0));
  if (!(maxM > 1) || !(peak > 0.2)) return points;
  const ratio = maxM / peak;
  let k = 0;
  if (ratio > 8 && ratio < 12.5) k = 10;
  else if (ratio > 80 && ratio < 125) k = 100;
  else if (ratio > 0.08 && ratio < 0.125) k = 0.1;
  else if (Math.abs(ratio - 1) < 0.35 || (ratio > 0.5 && ratio < 2)) return points;
  else return points;
  if (!k) return points;
  return points.map((p) => ({ ...p, d: Math.round(p.d * k * 10) / 10 }));
}

function fitSampleTemp(v) {
  if (v == null || v === "") return null;
  let n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n > 200 && n < 400) n -= 273.15;
  if (n > 50 && n < 450) n /= 10;
  return sampleTemp({ c: n });
}

function fitMinutes(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n === 0xffffffff) return "";
  if (n > 100000) return String(Math.max(1, Math.round(n / 60000)));
  if (n >= 180) return String(Math.max(1, Math.round(n / 60)));
  return String(Math.round(n));
}

function fitNdlMin(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n === 0xffffffff || n === 0xffff || n === 0xff) return "";
  if (n === 0) return "0";
  if (n > 100000) return String(Math.round(n / 60000));
  if (n > 99) return String(Math.round(n / 60));
  return String(Math.round(n));
}

function fitGfPct(v) {
  if (v == null || v === "") return "";
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n === 0xffffffff || n === 0xff) return "";
  let p = n;
  if (p > 0 && p <= 1.0001) p *= 100;
  else if (p > 100 && p <= 1000) p /= 10;
  else if (p > 1000 && p <= 10000) p /= 100;
  if (p < 1 || p > 100) return "";
  return String(Math.round(p));
}

function formatGf(lo, hi) {
  const a = fitGfPct(lo);
  const b = fitGfPct(hi);
  if (!a && !b) return "";
  return `${a || "—"}/${b || "—"}`;
}

function lastWetVal(list, desc, names, field) {
  const wet = (list || []).filter((x) => Number(x.depth) > 0.8);
  return lastDevVal(wet.length ? wet : list, desc, names, field);
}

function surfaceBetween(prev, cur) {
  if (!prev || !cur) return "";
  const prevEnd = Number(prev.ts) || 0;
  const prevStart = Number(prev.start) || 0;
  const curStart = Number(cur.start || cur.ts) || 0;
  const end = prevEnd > prevStart ? prevEnd : 0;
  if (end > 1000 && curStart > end) {
    const sec = curStart - end;
    if (sec >= 60 && sec <= 36 * 3600) return fitMinutes(sec);
  }
  return "";
}

function fitSemicircle(v) {
  if (v == null || v === 0x7fffffff) return "";
  const deg = Number(v) * (180 / 2147483648);
  return Number.isFinite(deg) && Math.abs(deg) <= 180 ? deg : "";
}

function round1(n) {
  return String(Math.round(Number(n) * 10) / 10);
}

function ascentFromPoints(pts) {
  const sorted = [...(pts || [])]
    .filter((p) => Number.isFinite(Number(p.t)) && Number.isFinite(Number(p.d)))
    .sort((a, b) => a.t - b.t);
  if (sorted.length < 4) return { avg: "", max: "" };
  const maxD = Math.max(...sorted.map((p) => Number(p.d) || 0));
  if (maxD < 3) return { avg: "", max: "" };
  let iDeep = 0;
  sorted.forEach((p, i) => {
    if (Number(p.d) >= maxD * 0.88) iDeep = i;
  });
  const rates = [];
  let climb = 0;
  let climbT = 0;
  for (let i = iDeep; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const dt = Number(b.t) - Number(a.t);
    const dd = Number(a.d) - Number(b.d);
    if (dt < 0.08 || dd < 0.25 || Number(a.d) < 1.5) continue;
    const r = dd / dt;
    if (r > 0.5 && r < 55) {
      rates.push(r);
      climb += dd;
      climbT += dt;
    }
  }
  if (!rates.length || climb < 2) return { avg: "", max: "" };
  return { avg: round1(climb / climbT), max: round1(Math.max(...rates)) };
}

function fitAscentMmin(v) {
  const n = Math.abs(Number(v));
  if (!Number.isFinite(n) || n === 0 || n === 0xffffffff) return "";
  if (n <= 0.85) return round1(n * 60);
  if (n > 40 && n < 2500) return round1(n * 0.6);
  if (n <= 40) return round1(n);
  return "";
}

function lastDevVal(list, desc, names, field) {
  for (let i = (list || []).length - 1; i >= 0; i--) {
    const x = list[i];
    const v = pickDev(x.dev, desc, names);
    if (v !== "" && v != null && Number(v) !== 0xffffffff) return v;
    if (field != null && x.fields?.[field] != null && x.fields[field] !== 0xffffffff) return x.fields[field];
  }
  return "";
}

function fitPct(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n === 0xffffffff || n === 0xff || n === 0xffff) return "";
  if (n <= 1.5) return String(Math.round(n * 1000) / 10);
  if (n <= 130) return String(Math.round(n * 10) / 10);
  if (n <= 13000) return String(Math.round(n) / 100);
  return "";
}

function fitScore(v, max) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > max) return "";
  return String(Math.round(n * 10) / 10);
}

function fitTssVal(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n === 0xffffffff) return "";
  if (n > 200 && n <= 2000) return String(Math.round(n) / 10);
  if (n > 2000) return "";
  return String(Math.round(n * 10) / 10);
}

function harvestDev(rec, desc, bag) {
  if (!bag.devLast) bag.devLast = {};
  if (!bag.devAll) bag.devAll = [];
  if (rec.dev && Object.keys(rec.dev).length) bag.devAll.push(rec.dev);
  Object.entries(rec.dev || {}).forEach(([k, v]) => {
    if (v == null || v === "") return;
    if (typeof v === "number" && !Number.isFinite(v)) return;
    const name = fitFieldName(desc, k);
    if (name) bag.devLast[name] = v;
  });
}

function ingestDevEntry(cat, k, v, desc) {
  if (v == null || v === "") return;
  if (typeof v === "number" && !Number.isFinite(v)) return;
  const meta = desc.get(k) || {};
  let name = String(meta.name || "").replace(/\0/g, "").trim();
  if (!name) name = String(k);
  const key = name.toLowerCase().replace(/[\s.]+/g, "_");
  if (!key || key === "undefined") return;
  const n = Number(v);
  const put = (slot) => {
    if (!slot) return;
    if (!cat[slot]) {
      cat[slot] = { first: v, last: v, min: n, max: n, units: meta.units || "" };
      return;
    }
    cat[slot].last = v;
    if (Number.isFinite(n)) {
      if (!Number.isFinite(cat[slot].min) || n < cat[slot].min) cat[slot].min = n;
      if (!Number.isFinite(cat[slot].max) || n > cat[slot].max) cat[slot].max = n;
    }
  };
  put(key);
  const tail = key.split("_").filter(Boolean).pop();
  if (tail && tail !== key && /^(cns|otu|otus|sac|rmv|ndl|tts|gf_low|gf_high|avg_depth|max_depth|o2_toxicity|cns_load|depth)$/.test(tail)) {
    put(tail);
  }
}

function buildDevCatalog(bag, desc) {
  const cat = {};
  const walk = (dev) => {
    Object.entries(dev || {}).forEach(([k, v]) => ingestDevEntry(cat, k, v, desc));
  };
  (bag.sessions || []).forEach((s) => walk(s.dev));
  (bag.laps || []).forEach((s) => walk(s.dev));
  (bag.summaries || []).forEach((s) => walk(s.dev));
  (bag.samples || []).forEach((s) => walk(s.dev));
  (bag.devAll || []).forEach(walk);
  bag.devLast = {};
  Object.entries(cat).forEach(([k, row]) => {
    bag.devLast[k] = row.last;
  });
  return cat;
}

function prettyFitVal(v, units) {
  if (v == null || v === "") return "";
  if (typeof v === "string" && !v.trim()) return "";
  const n = Number(v);
  let text;
  if (typeof v === "string" && !Number.isFinite(n)) text = v;
  else if (!Number.isFinite(n)) text = String(v);
  else if (Math.abs(n) >= 100 && Number.isInteger(n)) text = String(n);
  else text = String(Math.round(n * 100) / 100);
  const u = String(units || "").replace(/\0/g, "").trim();
  return u ? `${text} ${u}` : text;
}

const FIT_IT = {
  cns: "CNS",
  end_cns: "CNS fine",
  start_cns: "CNS inizio",
  o2_toxicity: "CNS (o2_toxicity)",
  otu: "OTU",
  otus: "OTU",
  hrtss: "TSS",
  tss: "TSS",
  sac: "SAC",
  rmv: "RMV",
  air_consumption: "Consumo aria",
  gas_consumption: "Consumo gas",
  max_depth: "Prof. max",
  avg_depth: "Prof. media",
  depth: "Profondità",
  temperature: "Temperatura",
  temp: "Temperatura",
  tank_pressure: "Pressione bombola",
  start_pressure: "Press. inizio",
  end_pressure: "Press. fine",
  tank_volume: "Volume bombola",
  tank_size: "Bombola",
  dive_mode: "Modo immersione",
  feeling: "Feeling",
  recovery_time: "Recupero",
  peak_epoc: "EPOC",
  surface_time: "Tempo superficie",
  dive_number_in_series: "N° in serie",
  ndl: "NDL",
  tts: "TTS",
  helium: "Elio",
  oxygen: "Ossigeno",
};

function catalogDump(cat, extra) {
  const all = {};
  Object.keys(cat)
    .sort()
    .forEach((k) => {
      const row = cat[k];
      const label = FIT_IT[k] || k.replace(/_/g, " ");
      const last = prettyFitVal(row.last, row.units);
      if (last === "") return;
      const maxN = Number(row.max);
      const lastN = Number(row.last);
      const max = Number.isFinite(maxN) && Number.isFinite(lastN) && maxN > lastN + 0.05 ? ` · max ${prettyFitVal(row.max, row.units)}` : "";
      all[label] = last + max;
    });
  Object.entries(extra || {}).forEach(([k, v]) => {
    if (v == null || v === "") return;
    if (all[k] == null) all[k] = String(v);
  });
  return all;
}

function catPick(cat, names, how = "last") {
  for (const n of names) {
    const row = cat[n.toLowerCase().replace(/\s+/g, "_")];
    if (!row) continue;
    const v = how === "max" ? row.max : how === "first" ? row.first : row.last;
    if (v != null && v !== "") return v;
  }
  const keys = Object.keys(cat);
  for (const n of names) {
    const want = n.toLowerCase().replace(/\s+/g, "_");
    const hit = keys.find((k) => k === want || k.endsWith("_" + want));
    if (hit && cat[hit]) {
      const v = how === "max" ? cat[hit].max : how === "first" ? cat[hit].first : cat[hit].last;
      if (v != null && v !== "") return v;
    }
  }
  return "";
}

function pickBagDev(bag, matcher) {
  const last = bag.devLast || {};
  const keys = Object.keys(last);
  const hit = keys.find((k) => matcher(k));
  return hit != null ? last[hit] : "";
}

function isCnsName(name) {
  const n = String(name || "").toLowerCase().replace(/%/g, "pct");
  if (/otu|start_cns/.test(n) && !/o2_toxicity/.test(n)) return false;
  return /(^|[._-])cns([._-]|pct|$)|o2_toxicity|oxygen_toxicity|cnspercent|cns_pct|cns_load|cns_percent/.test(n);
}

function isOtuName(name) {
  const n = String(name || "").toLowerCase().replace(/%/g, "pct");
  if (/o2_toxicity/.test(n)) return false;
  return /(^|[._-])otu(s)?([._-]|pct|$)|pulmonary|uptd|oxygen_tolerance|otu_total/.test(n);
}

function isTssName(name) {
  return /(^|_)(hr)?tss(_|$)|relative_effort|training_stress|training_load|dive_load/.test(name);
}

function isSacName(name) {
  return /(^|[._-])(sac|rmv)([._-]|$)|air_consumption|gas_consumption|surface_air|volume_sac|consumo|ventilation/.test(name);
}

function isNdlName(name) {
  return /(^|[._-])ndl([._-]|$)|no_deco_time|nodectime|no_stop_time|ndl_time|ndl_remaining/.test(name);
}

function isSiName(name) {
  if (/air|sac|consumption/.test(name)) return false;
  return /surface_interval|surfaceinterval|surface_time|surfacetime|si_before|interval_before|time_at_surface/.test(name);
}

function isGfLowName(name) {
  return /gf_low|gflow|low_gf|gradient_factor_low|gf_lo([^a-z]|$)|lowgf/.test(name);
}

function isGfHighName(name) {
  return /gf_high|gfhigh|high_gf|gradient_factor_high|gf_hi([^a-z]|$)|highgf/.test(name) && !/setpoint/.test(name);
}

function firstGood(vals, mapFn) {
  for (const v of vals) {
    const s = mapFn(v);
    if (s !== "") return s;
  }
  return "";
}

function isTankPressName(name) {
  return /tank_pressure|cylinder_pressure|cyl_pressure|gas_pressure|start_pressure|end_pressure|begin_pressure/.test(name) && !/water|ambient/.test(name);
}

function isTankVolName(name) {
  return /tank_vol|tank_size|cylinder_vol|cylinder_size|cyl_size|tankvolume/.test(name);
}

function fitSacVal(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n === 0xffffffff) return "";
  if (n > 0 && n < 0.02) return round1(n * 60000);
  if (n > 80 && n <= 8000) return String(Math.round(n) / 100);
  if (n > 80) return "";
  return round1(n);
}

function computeFitSac(vol, p0, p1, minutes, avgM, maxM) {
  const v = Number(vol) > 0 ? Number(vol) : 12;
  const a = Number(p0);
  const b = Number(p1);
  const t = Number(minutes);
  if (!(a > b && b >= 0 && a <= 350 && t > 0)) return "";
  const depth = Number(avgM) > 0.5 ? Number(avgM) : Number(maxM) * 0.65;
  const ata = Math.max(1.05, 1 + Math.max(0, depth) / 10);
  return round1((v * (a - b)) / (t * ata));
}

function sacFromGasUsed(used, minutes, avgM, maxM) {
  let liters = Number(used);
  if (!Number.isFinite(liters) || liters <= 0) return "";
  if (liters > 400) liters /= 1000;
  if (liters <= 0 || liters > 400) return "";
  const t = Number(minutes);
  if (!(t > 0)) return "";
  const depth = Number(avgM) > 0.5 ? Number(avgM) : Number(maxM) * 0.65;
  const ata = Math.max(1.05, 1 + Math.max(0, depth) / 10);
  return round1(liters / (t * ata));
}

function bestNum(vals, mapFn) {
  let best = "";
  vals.forEach((v) => {
    const s = mapFn(v);
    if (s === "") return;
    if (best === "" || Number(s) >= Number(best)) best = s;
  });
  return best;
}

function estimateOtu(avgM, maxM, mix, minutes) {
  const depth = Number(avgM) > 0.5 ? Number(avgM) : Number(maxM) * 0.65;
  const t = Number(minutes);
  const fo2 = (Number(mix) || 21) / 100;
  if (!(depth > 0) || !(t > 0) || !(fo2 > 0)) return "";
  const po2 = (1 + depth / 10) * fo2;
  if (po2 <= 0.5) return "0";
  return round1(t * Math.pow((po2 - 0.5) / 0.5, 0.83));
}

function pickDev(dev, desc, names) {
  const want = names.map((n) => n.toLowerCase());
  const rows = Object.entries(dev || {}).map(([k, v]) => ({
    v,
    name: fitFieldName(desc, k),
  }));
  for (const w of want) {
    const hit = rows.find((r) => r.name === w && r.v != null && r.v !== "");
    if (hit) return hit.v;
  }
  for (const w of want) {
    const hit = rows.find((r) => r.name.includes(w) && r.v != null && r.v !== "");
    if (hit) return hit.v;
  }
  return "";
}

function fitPressureBar(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n > 50000) return pressureBar(n);
  if (n > 400) return String(Math.round(n / 100));
  return String(Math.round(n * 10) / 10);
}

function inferFitChannels(samples, desc) {
  if (!samples.length) return;
  samples.forEach((s) => {
    const fromDev = pickSampleDepth(s.dev, desc);
    if (fromDev > 0) s.depth = fromDev;
    else if (!(s.depth > 0)) s.depth = recordDepthM({ ...s.fields, dev: s.dev }, desc);
    if (s.temp == null) s.temp = fitSampleTemp(pickDev(s.dev, desc, ["temperature", "temp", "watertemp"]));
    const f = s.fields || {};
    if (!(s.depth > 0)) {
      const m = recordDepthM({ ...f, dev: s.dev }, desc);
      if (m > 0 && m < 130) s.depth = m;
    }
    if (s.temp == null) s.temp = fitSampleTemp(f[13] ?? f[57] ?? f[58]);
    if (!(s.tankBar > 0)) {
      const tp = pickDev(s.dev, desc, ["tank_pressure", "cylinder_pressure", "cyl_pressure", "gas_pressure"]);
      const bar = fitPressureBar(tp);
      if (bar) s.tankBar = Number(bar);
    }
  });
  if (samples.filter((s) => s.depth > 0).length >= Math.max(4, samples.length * 0.25)) return;
  const keys = new Set();
  samples.forEach((s) => Object.keys(s.dev || {}).forEach((k) => keys.add(k)));
  keys.forEach((k) => {
    const name = String(desc.get(k)?.name || "").toLowerCase();
    const vals = samples.map((s) => Number(s.dev?.[k])).filter((n) => Number.isFinite(n));
    if (vals.length < 4) return;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    if ((name.includes("depth") && !/max|avg|average|stop|ndl/.test(name)) || (min >= 0 && max > 4 && max < 80 && max - min > 1.5 && !/max|avg/.test(name))) {
      samples.forEach((s) => {
        if (s.depth > 0) return;
        const m = fitDepthM(s.dev[k]);
        if (m > 0) s.depth = m;
      });
    }
    if (samples.every((s) => s.temp == null) && (name.includes("temp") || (min > 4 && max < 40 && max - min < 25))) {
      samples.forEach((s) => {
        if (s.temp == null) s.temp = fitSampleTemp(s.dev[k]);
      });
    }
  });
}

function cloneFitDef(def) {
  return {
    global: def.global,
    fields: def.fields,
    devFields: (def.devFields || []).map((f) => ({ ...f })),
    dataSize: def.dataSize,
    le: def.le,
  };
}

function applyDescToDef(def, desc) {
  (def.devFields || []).forEach((f) => {
    const meta = desc.get(`${f.devIdx}:${f.num}`);
    if (!meta) return;
    if (meta.base != null) f.base = meta.base;
    if (meta.scale != null) f.scale = meta.scale;
  });
}

const SUUNTO_DIVE_MODE = ["Off", "Gauge", "Free", "Air", "EAN", "Mixed", "CCR", "Nitrox", "Trimix", "CCR Nitrox", "CCR Trimix"];

function parseFit(bytes) {
  const dives = [];
  let offset = 0;
  while (offset + 14 <= bytes.length) {
    if (!isFitAt(bytes, offset)) {
      if (!offset) break;
      offset += 1;
      continue;
    }
    const block = parseFitBlock(bytes, offset);
    dives.push(...block.dives);
    offset = Math.max(offset + 1, block.next);
  }
  if (!dives.length) throw new Error("File FIT senza immersioni (sessioni, campioni o dive summary).");
  return dives;
}

function parseFitBlock(bytes, origin) {
  const headerSize = bytes[origin] || 14;
  const dataSize = fitU32(bytes, origin + 4, true);
  const end = Math.min(bytes.length, origin + headerSize + dataSize);
  const defs = {};
  const desc = new Map();
  let i = origin + headerSize;
  const pending = [];
  const bag = {
    sessions: [],
    summaries: [],
    laps: [],
    gps: [],
    samples: [],
    temps: [],
    gases: [],
    tanks: [],
    tankStart: [],
    tankEnd: [],
    tankVol: [],
    gasUsed: [],
    mfg: 0,
    product: "",
    tz: 0,
    created: 0,
    waterType: "",
    gfLow: "",
    gfHigh: "",
    devLast: {},
    catalog: {},
    hr: [],
    he: [],
    devAll: [],
  };

  while (i < end) {
    const h = bytes[i++];
    if (h & 0x80) {
      const local = (h >> 5) & 3;
      const def = defs[local];
      if (!def) continue;
      pending.push({ compressed: true, offset: i, def: cloneFitDef(def), delta: h & 0x1f });
      i += def.dataSize;
      continue;
    }
    const isDef = h & 0x40;
    const local = h & 0x0f;
    const hasDev = h & 0x20;
    if (isDef) {
      if (i + 5 > bytes.length) break;
      i += 1;
      const le = bytes[i++] === 0;
      const global = fitU16(bytes, i, le);
      i += 2;
      const nfields = bytes[i++];
      const fields = [];
      let recSize = 0;
      for (let f = 0; f < nfields; f++) {
        const num = bytes[i++];
        const size = bytes[i++];
        const base = bytes[i++];
        fields.push({ num, size, base });
        recSize += size;
      }
      const devFields = [];
      if (hasDev) {
        const nd = bytes[i++];
        for (let f = 0; f < nd; f++) {
          const num = bytes[i++];
          const size = bytes[i++];
          const devIdx = bytes[i++];
          const meta = desc.get(`${devIdx}:${num}`) || {};
          devFields.push({ num, size, devIdx, base: meta.base != null ? meta.base : 0x88 });
          recSize += size;
        }
      }
      defs[local] = { global, fields, devFields, dataSize: recSize, le };
      continue;
    }
    const def = defs[local];
    if (!def) continue;
    if (def.global === 206) {
      const rec = fitReadRecord(bytes, i, def, desc);
      collectFit(206, rec, bag, desc);
    } else {
      pending.push({ compressed: false, offset: i, def: cloneFitDef(def) });
    }
    i += def.dataSize;
  }
  let lastTs = 0;
  pending.forEach((item) => {
    applyDescToDef(item.def, desc);
    const rec = fitReadRecord(bytes, item.offset, item.def, desc);
    if (item.compressed) {
      lastTs += item.delta;
      rec[253] = lastTs;
    } else if (rec[253]) lastTs = rec[253];
    collectFit(item.def.global, rec, bag, desc);
  });

  inferFitChannels(bag.samples, desc);
  bag.catalog = buildDevCatalog(bag, desc);
  const bindDev = (row) => {
    if (!row) return row;
    if (!row.maxDepth) row.maxDepth = pickDev(row.dev, desc, ["max_depth", "maxdepth"]);
    if (!row.avgDepth) row.avgDepth = pickDev(row.dev, desc, ["avg_depth", "avgdepth"]);
    if (row.surfaceTime == null || row.surfaceTime === "") {
      row.surfaceTime = pickDev(row.dev, desc, ["surface_interval", "surfaceinterval", "surface_time", "surfacetime", "si_before"]);
    }
    if (row.ndl == null || row.ndl === "") {
      row.ndl = pickDev(row.dev, desc, ["ndl", "ndl_time", "no_deco_time", "nodectime", "no_stop_time"]);
    }
    if (row.gfLow == null || row.gfLow === "") row.gfLow = pickDev(row.dev, desc, ["gf_low", "gflow", "low_gf", "gradient_factor_low"]);
    if (row.gfHigh == null || row.gfHigh === "") row.gfHigh = pickDev(row.dev, desc, ["gf_high", "gfhigh", "high_gf", "gradient_factor_high"]);
    if (row.diveMode == null || row.diveMode === "") row.diveMode = pickDev(row.dev, desc, ["dive_mode", "divemode"]);
    if (!row.feeling) row.feeling = Number(pickDev(row.dev, desc, ["feeling"])) || 0;
    if (!row.description) row.description = pickDev(row.dev, desc, ["description"]);
    if (!row.elapsed) row.elapsed = pickDev(row.dev, desc, ["total_elapsed_time", "total_timer_time", "duration"]);
    if (!row.timer) row.timer = pickDev(row.dev, desc, ["total_timer_time"]);
    if (row.cns == null || row.cns === "") row.cns = pickDev(row.dev, desc, ["end_cns", "cns", "o2_toxicity", "cns_load", "cns_percent", "cns_pct", "cnspercent"]);
    if (row.otu == null || row.otu === "") row.otu = pickDev(row.dev, desc, ["otu", "otus", "otu_total", "otu_pct"]);
    if (row.tss == null || row.tss === "") row.tss = pickDev(row.dev, desc, ["hrtss", "tss", "hr_tss", "relative_effort", "training_stress_score", "training_stress", "training_load"]);
    if (!row.ascentAvg) row.ascentAvg = pickDev(row.dev, desc, ["avg_ascent_rate", "average_ascent_rate", "ascent_rate", "ascent_speed", "vertical_speed"]);
    if (!row.ascentMax) row.ascentMax = pickDev(row.dev, desc, ["max_ascent_rate", "max_ascent", "ascent_max"]);
    if (!row.sacFit) row.sacFit = pickDev(row.dev, desc, ["sac", "rmv", "air_consumption", "surface_air_consumption", "gas_consumption", "volume_sac", "avg_volume_sac"]);
    if (!row.pressStart) row.pressStart = pickDev(row.dev, desc, ["start_pressure", "tank_pressure_start", "begin_pressure"]);
    if (!row.pressEnd) row.pressEnd = pickDev(row.dev, desc, ["end_pressure", "tank_pressure_end"]);
    if (!row.tankVol) row.tankVol = pickDev(row.dev, desc, ["tank_volume", "tank_size", "cylinder_size", "cylinder_volume"]);
    return row;
  };
  bag.sessions.forEach(bindDev);
  bag.laps.forEach(bindDev);
  bag.summaries.forEach(bindDev);
  if (bag.sessions.length && bag.summaries.length) {
    bag.sessions.forEach((s, i) => {
      const u = bag.summaries[i];
      if (!u) return;
      if (!s.maxDepth) s.maxDepth = u.maxDepth;
      if (!s.avgDepth) s.avgDepth = u.avgDepth;
      if (!s.bottom) s.bottom = u.bottom;
      if (!s.surface) s.surface = u.surface;
      if (s.ndl == null || s.ndl === "") s.ndl = u.ndl;
      if (s.cns == null || s.cns === "") s.cns = u.cns;
      if (s.otu == null || s.otu === "") s.otu = u.otu;
      if (!s.hang) s.hang = u.hang;
      if (!s.sacFit) s.sacFit = u.sacVol || u.rmv || u.sacPress;
      if (!s.ascentAvg) s.ascentAvg = u.ascentAvg;
      if (!s.ascentMax) s.ascentMax = u.ascentMax;
    });
  }
  const brand = bag.product || (bag.mfg === 23 ? "Suunto" : bag.mfg === 1 ? "Garmin" : "Computer FIT");
  const sources = bag.sessions.length ? bag.sessions : bag.summaries.length ? bag.summaries : bag.laps;
  const dives = [];
  const pushDive = (s, idx) => {
    const start = s.start || s.ts || 0;
    const next = sources[idx + 1];
    const until = next ? next.start || next.ts || Infinity : s.ts && s.start && s.ts > s.start ? s.ts : Infinity;
    const samples = bag.samples.filter((x) => x.ts >= start && (until === Infinity || x.ts <= until));
    const use = trimDiveSamples(samples.length ? samples : bag.samples);
    const wet = use.filter((x) => x.depth > 0.08);
    const curve = wet.length >= 8 ? wet : use;
    const t0 = curve[0]?.ts || start;
    const span = (curve[curve.length - 1]?.ts || 0) - t0;
    const timeDiv = span > 18 * 3600 ? 60000 : 60;
    const spanMin = curve.length >= 2 && span > 2 ? span / timeDiv : 0;
    const durCandidates = [s.elapsed, s.timer, s.bottom, s.duration].map((v) => Number(fitMinutes(v)) || 0);
    const totalMin = Math.round(Math.max(spanMin, ...durCandidates));
    const mins = totalMin >= 1 ? String(totalMin) : "";
    let lastC = null;
    const rawProfile = curve.some((x) => x.depth > 0)
      ? curve.map((x, i) => {
          const c = sampleTemp({ c: x.temp });
          if (c != null) lastC = c;
          let tMin;
          if (span > 2) tMin = (x.ts - t0) / timeDiv;
          else if (totalMin >= 1 && curve.length > 1) tMin = (i / (curve.length - 1)) * totalMin;
          else tMin = i / 60;
          const pt = {
            t: Math.max(0, Math.round(tMin * 100) / 100),
            d: Math.round((x.depth || 0) * 10) / 10,
          };
          if (lastC != null) pt.c = lastC;
          return pt;
        })
      : [];
    const depths = use.map((x) => x.depth).filter((n) => n > 0);
    const temps = use.map((x) => x.temp).filter((n) => n != null && n > -5 && n < 45);
    const gps = use.find((x) => x.lat) || bag.gps[0] || {};
    const maxM = fitDepthM(s.maxDepth) || fitDepthM(catPick(bag.catalog, ["max_depth"])) || (depths.length ? Math.max(...depths) : 0);
    const profilePoints = alignDepthToMax(rawProfile, maxM);
    const avgM =
      meanProfileDepthM(profilePoints) ||
      meanSampleDepth(wet.length ? wet : use) ||
      saneDiveDepth(s.avgDepth, maxM) ||
      saneDiveDepth(catPick(bag.catalog, ["avg_depth", "average_depth", "depth_avg"]), maxM) ||
      (maxM > 1 ? Math.round(maxM * 0.65 * 10) / 10 : 0);
    const bottomMin = Number(fitMinutes(s.bottom));
    const fondo = bottomMin >= 1 && bottomMin <= totalMin + 2 ? String(Math.round(bottomMin)) : mins;
    const when = fitClock(s.start || s.ts || use[0]?.ts, bag.tz);
    const modeNum = Number(s.diveMode);
    const mode =
      Number.isFinite(modeNum) && SUUNTO_DIVE_MODE[modeNum]
        ? SUUNTO_DIVE_MODE[modeNum]
        : s.diveMode
          ? String(s.diveMode)
          : "";
    const o2 = bag.gases[0] != null ? o2Percent(bag.gases[0]) : mode === "Air" ? "21" : "";
    const water =
      temps.length ? String(Math.round(Math.min(...temps) * 10) / 10) : tempC(s.minTemp || s.avgTemp || s.maxTemp);
    const airCands = use.filter((x) => !(x.depth > 1.2) && x.temp != null).map((x) => x.temp);
    const air = airCands.length ? String(airCands[0]) : tempC(s.maxTemp);
    const last = use[use.length - 1] || {};
    const deep = use.reduce((a, x) => ((x.depth || 0) > (a.depth || 0) ? x : a), use[0] || {});
    const bottomTemp = deep?.temp != null ? String(deep.temp) : water;
    const lat = gps.lat || s.lat || "";
    const lng = gps.lng || s.lng || "";
    const hang = fitMinutes(s.hang);
    const created = fitClock(bag.created, bag.tz);
    const date = when.date || created.date;
    const timeIn = when.time || created.time;
    const suunto = bag.mfg === 23 || /suunto/i.test(brand);
    const gfLo =
      catPick(bag.catalog, ["gf_low", "gflow", "low_gf", "gradient_factor_low", "gf_lo", "lowgf"]) ||
      pickBagDev(bag, isGfLowName) ||
      s.gfLow ||
      bag.gfLow;
    const gfHi =
      catPick(bag.catalog, ["gf_high", "gfhigh", "high_gf", "gradient_factor_high", "gf_hi", "highgf"]) ||
      pickBagDev(bag, isGfHighName) ||
      s.gfHigh ||
      bag.gfHigh;
    const surfaceMin =
      fitMinutes(s.surface) ||
      fitMinutes(s.surfaceTime) ||
      fitMinutes(catPick(bag.catalog, ["surface_interval", "surfaceinterval", "surface_time", "surfacetime"])) ||
      fitMinutes(pickBagDev(bag, isSiName)) ||
      surfaceBetween(sources[idx - 1], s) ||
      "";
    const extras = {
      format: brand,
      avgDepth: avgM || "",
      cns: firstGood(
        [
          catPick(bag.catalog, ["end_cns", "cns_load"], "last"),
          catPick(bag.catalog, ["cns"], "last"),
          suunto ? catPick(bag.catalog, ["o2_toxicity"], "last") : "",
          pickBagDev(bag, isCnsName),
          pickDev(s.dev, desc, ["end_cns", "cns", "cns_load", "o2_toxicity", "cns_percent", "cns_pct"]),
          lastDevVal(use, desc, ["end_cns", "cns", "cns_load", "o2_toxicity", "cns_percent", "cns_pct"], 103),
          s.cns,
          suunto ? s.otu : "",
          last?.fields?.[103],
        ],
        fitPct
      ),
      otu: firstGood(
        [
          catPick(bag.catalog, ["otu", "otus", "otu_total"], "last"),
          pickBagDev(bag, isOtuName),
          pickDev(s.dev, desc, ["otu", "otus", "otu_total", "otu_pct"]),
          lastDevVal(use, desc, ["otu", "otus", "otu_total"]),
          suunto ? "" : s.otu,
          suunto ? "" : catPick(bag.catalog, ["o2_toxicity"], "last"),
        ],
        (v) => {
          const s = fitScore(v, 800);
          return Number(s) > 0 ? s : "";
        }
      ),
      tss: bestNum(
        [
          catPick(bag.catalog, ["hrtss", "tss", "hr_tss", "relative_effort", "training_load", "training_stress"], "last"),
          pickBagDev(bag, isTssName),
          pickDev(s.dev, desc, ["hrtss", "tss", "relative_effort", "training_load"]),
          lastDevVal(use, desc, ["hrtss", "tss", "relative_effort", "training_load"]),
          s.tss,
        ],
        fitTssVal
      ),
      ndl: "",
      tts: last.fields?.[101] ?? last.fields?.[77] ?? "",
      mode,
      gf: formatGf(gfLo, gfHi),
      surfaceInterval: surfaceMin,
      diveNumber: s.diveNumber || pickDev(s.dev, desc, ["dive_number_in_series", "dive_number"]) || "",
      samples: use.filter((x) => x.depth > 0).length,
      ascentAvg: fitAscentMmin(s.ascentAvg) || ascentFromPoints(profilePoints).avg,
      ascentMax: fitAscentMmin(s.ascentMax) || ascentFromPoints(profilePoints).max,
      sacFit: "",
    };
    const sampleBars = use.map((x) => Number(x.tankBar)).filter((n) => n > 20 && n < 350);
    const pStart =
      fitPressureBar(bag.tankStart[0]) ||
      fitPressureBar(s.pressStart) ||
      fitPressureBar(catPick(bag.catalog, ["start_pressure", "tank_pressure_start", "begin_pressure"], "first")) ||
      fitPressureBar(pickBagDev(bag, (n) => /start_pressure|begin_pressure|tank_pressure_start/.test(n))) ||
      (sampleBars.length ? String(sampleBars[0]) : "") ||
      fitPressureBar(catPick(bag.catalog, ["tank_pressure", "cylinder_pressure"], "first")) ||
      (bag.tanks[0] != null ? fitPressureBar(bag.tanks[0]) : "");
    const pEnd =
      fitPressureBar(bag.tankEnd[0]) ||
      fitPressureBar(s.pressEnd) ||
      fitPressureBar(catPick(bag.catalog, ["end_pressure", "tank_pressure_end"], "last")) ||
      fitPressureBar(pickBagDev(bag, (n) => /end_pressure|tank_pressure_end/.test(n))) ||
      (sampleBars.length ? String(sampleBars[sampleBars.length - 1]) : "") ||
      fitPressureBar(catPick(bag.catalog, ["tank_pressure", "cylinder_pressure"], "last")) ||
      (bag.tanks.length ? fitPressureBar(bag.tanks[bag.tanks.length - 1]) : "");
    const tankL =
      volumeLiters(bag.tankVol[0]) ||
      volumeLiters(s.tankVol) ||
      volumeLiters(catPick(bag.catalog, ["tank_volume", "tank_size", "cylinder_size", "cylinder_volume"])) ||
      volumeLiters(pickBagDev(bag, isTankVolName)) ||
      (pStart && pEnd ? "12" : "");
    extras.sacFit = firstGood(
      [
        catPick(bag.catalog, ["sac", "rmv", "air_consumption", "gas_consumption", "volume_sac", "avg_volume_sac", "ventilation"]),
        pickBagDev(bag, isSacName),
        s.sacFit,
        s.sacVol,
        s.rmv,
        lastDevVal(use, desc, ["sac", "rmv", "air_consumption", "gas_consumption", "volume_sac", "avg_volume_sac", "ventilation"]),
      ],
      fitSacVal
    );
    if (!extras.sacFit) extras.sacFit = computeFitSac(tankL, pStart, pEnd, mins, avgM, maxM);
    if (!extras.sacFit) extras.sacFit = sacFromGasUsed(bag.gasUsed[0], mins, avgM, maxM);
    if (!extras.sacFit) {
      const ps = Number(s.sacPress || catPick(bag.catalog, ["avg_pressure_sac", "pressure_sac"]));
      const barMin = ps > 80 && ps <= 8000 ? ps / 100 : ps;
      if (Number(tankL) > 0 && barMin > 0.05 && barMin < 8) extras.sacFit = round1(Number(tankL) * barMin);
    }
    if (!extras.otu || !(Number(extras.otu) > 0)) extras.otu = estimateOtu(avgM, maxM, o2 || "21", mins);
    if (!extras.cns || !(Number(extras.cns) > 0)) extras.cns = computeCnsFromProfile(profilePoints, o2 || "21");
    const fromProf = ascentFromPoints(profilePoints);
    const ratePc = extras.ascentAvg;
    const rateProf = fromProf.avg;
    let ascentRate = rateProf || ratePc || "";
    if (rateProf && ratePc) {
      const a = Number(rateProf);
      const b = Number(ratePc);
      if (a > 1 && b > 1 && Math.abs(a - b) < 14) ascentRate = round1((a + b) / 2);
    }
    const ascentMax = fromProf.max || extras.ascentMax || ascentRate;
    const hrAvg = bag.hr.length ? round1(bag.hr.reduce((a, b) => a + b, 0) / bag.hr.length) : fitScore(s.hrAvg, 250);
    const hrMax = bag.hr.length ? String(Math.max(...bag.hr)) : fitScore(s.hrMax, 250);
    extras.hrAvg = hrAvg || "";
    extras.hrMax = hrMax || "";
    extras.ndl = firstGood(
      [
        lastWetVal(use, desc, ["ndl", "ndl_time", "no_deco_time", "nodectime", "no_stop_time", "ndl_remaining"], 102),
        catPick(bag.catalog, ["ndl", "ndl_time", "no_deco_time", "nodectime", "no_stop_time"]),
        pickBagDev(bag, isNdlName),
        pickDev(s.dev, desc, ["ndl", "ndl_time", "no_deco_time", "nodectime"]),
        s.ndl,
      ],
      (v) => (v === 0 || v === "0" ? "0" : fitNdlMin(v))
    );
    extras.tts =
      last.fields?.[101] ?? last.fields?.[77] ?? catPick(bag.catalog, ["tts", "time_to_surface"]);
    const ndlRaw = use
      .map((x) => Number(x.fields?.[102]))
      .filter((n) => Number.isFinite(n) && n >= 0 && n !== 0xffffffff && n !== 0xffff);
    const ceiling = Number(catPick(bag.catalog, ["ceiling", "deco_ceiling", "next_stop_depth"]));
    const decoTime = Number(catPick(bag.catalog, ["deco_time"]));
    extras.deco =
      ndlRaw.some((n) => n === 0) ||
      extras.ndl === "0" ||
      (ceiling > 0.3 && ceiling < 120) ||
      (decoTime > 0 && decoTime < 400) ||
      Number(hang) > 5;
    extras.helium = bag.he[0] != null ? o2Percent(bag.he[0]) : catPick(bag.catalog, ["helium", "he"]);
    extras.all = catalogDump(bag.catalog, {
      Computer: brand,
      "Prof. max": maxM ? maxM + " m" : "",
      "Prof. media": extras.avgDepth ? extras.avgDepth + " m" : "",
      "Durata": mins ? mins + " min" : "",
      "Tempo fondo": fondo ? fondo + " min" : "",
      CNS: extras.cns !== "" ? extras.cns + "%" : "",
      OTU: extras.otu,
      TSS: extras.tss,
      SAC: extras.sacFit ? extras.sacFit + " L/min" : "",
      "Press. inizio": pStart ? pStart + " bar" : "",
      "Press. fine": pEnd ? pEnd + " bar" : "",
      Bombola: tankL ? tankL + " L" : "",
      "Temp. fondo": water ? water + " °C" : "",
      "Temp. acqua": bottomTemp ? bottomTemp + " °C" : "",
      Risalita: ascentRate ? ascentRate + " m/min" : "",
      "Risalita max": ascentMax ? ascentMax + " m/min" : "",
      "FC media": hrAvg ? hrAvg + " bpm" : "",
      "FC max": hrMax ? hrMax + " bpm" : "",
      NDL: extras.ndl !== "" && extras.ndl != null ? extras.ndl + " min" : "",
      "Int. superficie": extras.surfaceInterval ? extras.surfaceInterval + " min" : "",
      Deco: extras.deco ? "Deco" : "No deco",
      Circuito: /ccr/i.test(mode) ? "Circuito chiuso" : "Circuito aperto",
      GF: extras.gf,
      TTS: extras.tts,
      Elio: extras.helium,
      Modo: mode,
      Campioni: extras.samples,
    });
    dives.push(
      baseImported({
        date,
        timeIn,
        timeOut: timeIn && mins ? addMinutes(timeIn, mins) : "",
        maxDepth: maxM ? String(maxM) : "",
        avgDepth: avgM ? String(avgM) : "",
        plannedDepth: maxM ? String(maxM) : "",
        bottomTime: fondo,
        totalTime: mins,
        surfaceInterval: surfaceMin,
        safetyStop: hang || (maxM >= 10 ? "3" : ""),
        waterTemp: bottomTemp,
        bottomTemp: water,
        airTemp: air && air !== water ? air : air || "",
        cns: extras.cns !== "" && extras.cns != null ? String(extras.cns) : "",
        otu: extras.otu !== "" && extras.otu != null ? String(extras.otu) : "",
        tss: extras.tss !== "" && extras.tss != null ? String(extras.tss) : "",
        ascentRate,
        ascentMax,
        sac: extras.sacFit || "",
        gf: extras.gf || "",
        ndl: extras.ndl || "",
        deco: Boolean(extras.deco),
        noDeco: !extras.deco,
        circuitClosed: /ccr/i.test(mode),
        circuitOpen: !/ccr/i.test(mode),
        regulator: /ccr/i.test(mode) ? "Circuito chiuso" : "Circuito aperto",
        mix: o2,
        tank: tankL,
        pressureStart: pStart,
        pressureEnd: pEnd,
        seaConditions: bag.waterType === 1 ? "Acqua di mare" : bag.waterType === 0 ? "Acqua dolce" : "",
        site: lat !== "" ? "Punto GPS" : brand,
        lat,
        lng,
        instruments: brand,
        sourceComputer: bag.mfg === 23 ? "suunto-fit" : "fit",
        feeling: s.feeling >= 1 && s.feeling <= 5 ? s.feeling : 0,
        profilePoints,
        computerLog: extras,
        notes: [
          s.description ? String(s.description) : "",
          extras.avgDepth ? `prof. media ${extras.avgDepth} m` : "",
          extras.mode ? `modo ${extras.mode}` : "",
          extras.cns !== "" && extras.cns != null ? `CNS ${extras.cns}%` : "",
          extras.otu !== "" && extras.otu != null ? `OTU ${extras.otu}` : "",
          extras.tss !== "" && extras.tss != null ? `TSS ${extras.tss}` : "",
          extras.sacFit ? `SAC ${extras.sacFit} L/min` : "",
          ascentRate ? `risalita ${ascentRate} m/min` : "",
          extras.gf ? `GF ${extras.gf}` : "",
          extras.diveNumber ? `n° serie ${extras.diveNumber}` : "",
          hang ? `sosta ${hang} min` : "",
          extras.samples ? `${extras.samples} campioni profilo` : "",
        ]
          .filter(Boolean)
          .join(" · "),
      })
    );
  };

  sources.forEach(pushDive);
  if (!dives.length && bag.samples.some((s) => s.depth > 0)) pushDive({ start: bag.samples[0].ts, ts: bag.samples[bag.samples.length - 1].ts }, 0);
  return { dives, next: end + 2 };
}

function collectFit(global, rec, bag, desc) {
  const ts = rec[253];
  if (global === 206) {
    const key = `${rec[0]}:${rec[1]}`;
    const name = String(rec[3] || rec[4] || "").replace(/\0/g, "").trim();
    if (name) desc.set(key, { name, base: rec[2], units: rec[8], scale: rec[6], nativeField: rec[14] });
    return;
  }
  harvestDev(rec, desc, bag);

  if (global === 0) {
    bag.mfg = rec[1] || bag.mfg;
    if (typeof rec[8] === "string" && rec[8]) bag.product = rec[8];
    if (rec[4]) bag.created = rec[4];
  }
  if (global === 23) {
    bag.mfg = rec[2] || bag.mfg;
    if (typeof rec[9] === "string" && rec[9] && !bag.product) bag.product = rec[9];
  }
  if (global === 34 && rec[5] && ts && rec[5] !== 0xffffffff) bag.tz = Number(rec[5]) - Number(ts);
  if (global === 258) {
    if (rec[4] != null && Number(rec[4]) <= 3) bag.waterType = rec[4];
    else if (rec[5] != null && Number(rec[5]) <= 3) bag.waterType = rec[5];
    const lo = fitGfPct(rec[2]) || fitGfPct(pickDev(rec.dev, desc, ["gf_low", "gflow", "low_gf", "gradient_factor_low"]));
    const hi = fitGfPct(rec[3]) || fitGfPct(pickDev(rec.dev, desc, ["gf_high", "gfhigh", "high_gf", "gradient_factor_high"]));
    if (lo) bag.gfLow = lo;
    if (hi) bag.gfHigh = hi;
  }

  const isRecord = global === 20;
  const depthNow = recordDepthM(rec, desc);
  if (isRecord || (depthNow > 0 && global !== 18 && global !== 19 && global !== 268 && global !== 0 && global !== 23 && global !== 206 && global !== 21 && global !== 258)) {
    const lat = fitSemicircle(rec[0]);
    const lng = fitSemicircle(rec[1]);
    if (lat !== "" && lng !== "") bag.gps.push({ lat, lng });
    let depth = depthNow;
    if (!depth && rec[73] > 110000 && rec[73] < 2500000) {
      depth = Math.max(0, Math.round(((rec[73] - 101325) / 10000) * 10) / 10);
    }
    const temp = fitSampleTemp(rec[13]);
    if (temp != null) bag.temps.push(temp);
    if (rec[3] > 20 && rec[3] < 240) bag.hr.push(rec[3]);
    const tankBar = Number(fitPressureBar(pickDev(rec.dev, desc, ["tank_pressure", "cylinder_pressure", "cyl_pressure", "gas_pressure"])));
    bag.samples.push({
      ts: ts || 0,
      depth,
      temp,
      lat,
      lng,
      tankBar: tankBar > 0 ? tankBar : "",
      dev: rec.dev,
      fields: rec,
    });
  }

  if (global === 18 || global === 19) {
    const row = {
      ts,
      start: rec[2] || ts,
      sport: rec[5],
      elapsed: rec[7] ?? rec[8],
      timer: rec[8],
      tss: rec[35],
      te: rec[24],
      hrAvg: rec[16],
      hrMax: rec[17],
      hrMin: rec[18],
      maxTemp: rec[58] ?? rec[14],
      avgTemp: rec[57],
      minTemp: rec[80],
      maxDepth: rec[125] ?? rec[93],
      avgDepth: rec[124] ?? rec[92],
      lat: fitSemicircle(rec[3]),
      lng: fitSemicircle(rec[4]),
      calories: rec[11],
      work: rec[48],
      dev: rec.dev,
    };
    if (global === 18) bag.sessions.push(row);
    else bag.laps.push(row);
  }

  if (global === 259) {
    const o2 = rec[1] != null ? rec[1] : rec[2];
    if (o2 != null) bag.gases.push(o2 > 1.5 ? o2 : o2 * 100);
    if (rec[0] != null) bag.he.push(rec[0] > 1.5 ? rec[0] : rec[0] * 100);
  }
  if (global === 319 && (rec[1] != null || rec[2] != null)) bag.tanks.push(rec[1] ?? rec[2]);
  if (global === 323) {
    if (rec[1] != null) bag.tankStart.push(rec[1]);
    if (rec[2] != null) bag.tankEnd.push(rec[2]);
    if (rec[3] != null) bag.gasUsed.push(rec[3]);
  }
  if (global === 268) {
    bag.summaries.push({
      ts,
      start: rec[253] || ts,
      avgDepth: rec[2],
      maxDepth: rec[3],
      surface: rec[4],
      cns: rec[6] ?? rec[5],
      otu: rec[9],
      bottom: rec[11],
      diveNumber: rec[10],
      sacVol: rec[13],
      sacPress: rec[12],
      rmv: rec[14],
      hang: rec[25] ?? rec[26],
      ascentAvg: rec[17] != null ? Number(rec[17]) / 1000 : "",
      ascentMax: rec[23] != null ? Number(rec[23]) / 1000 : "",
      dev: rec.dev,
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
  if (lower.endsWith(".fit") || isFit(bytes)) {
    const dives = parseFit(bytes);
    const suunto = dives.some((d) => d.sourceComputer === "suunto-fit" || /suunto/i.test(d.instruments || ""));
    return { dives, format: suunto ? "Suunto FIT" : "FIT" };
  }
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
  ascentFromPoints,
  fitAscentMmin,
  mergeSuuntoPair,
  computeCnsFromProfile,
  estimateOtu,
  meanProfileDepthM,
};
