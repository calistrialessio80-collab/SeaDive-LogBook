function uid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function cloneObj(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

const KEY = "seadive-logbook-v1";
const TYPES = ["Da riva", "Da barca", "Notturna", "Corrente", "Profonda", "Relitto", "Corso"];

const emptyProfile = () => ({
  name: "",
  certLevel: "",
  certNumber: "",
  certDate: "",
  medicalExpiry: "",
  insurance: "",
  emergencyName: "",
  emergencyPhone: "",
  equipment: "",
  specialties: "",
  recoverPhone: "",
  recoverEmail: "",
  hrThreshold: "",
  certs: [],
  sign: "",
  portrait: "",
});

const emptyDive = () => ({
  id: uid(),
  number: 1,
  date: new Date().toISOString().slice(0, 10),
  site: "",
  location: "",
  timeIn: "",
  timeOut: "",
  maxDepth: "",
  avgDepth: "",
  plannedDepth: "",
  bottomTime: "",
  totalTime: "",
  safetyStop: "3",
  surfaceInterval: "",
  visibility: "",
  waterTemp: "",
  airTemp: "",
  current: "",
  seaConditions: "",
  wetsuit: "",
  ballast: "",
  tank: "15",
  mix: "21",
  pressureStart: "200",
  pressureEnd: "",
  bottomTemp: "",
  cns: "",
  otu: "",
  tss: "",
  tssKind: "",
  ascentRate: "",
  ascentMax: "",
  sac: "",
  gf: "",
  ndl: "",
  deco: false,
  noDeco: true,
  circuitOpen: true,
  circuitClosed: false,
  regulator: "",
  instruments: "",
  certOnDive: "",
  types: [],
  notes: "",
  feeling: 0,
  photo: "",
  buddyName: "",
  buddyCert: "",
  buddySign: "",
  guideName: "",
  guideCert: "",
  guideSign: "",
  centerName: "",
  centerLead: "",
  centerSign: "",
  sigMeta: { buddy: null, guide: null, center: null },
  profilePoints: [],
  lat: "",
  lng: "",
});

const SESSION_KEY = "seadive-google-session";
const BRAND_KEY = "seadive-brand-photo";
const LEGAL_L70 =
  "Libretto immersioni digitale ai sensi della L. 7 maggio 2026 n. 70, art. 12, comma 8. Firma elettronica semplice con data, ora, generalità e impronta SHA-256 della scheda. Non è firma qualificata SPID/CIE.";

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function brandPhoto() {
  return localStorage.getItem(BRAND_KEY) || "./brand.jpg";
}

const seed = () => ({
  deletedDiveIds: [],
  profile: {
    ...emptyProfile(),
    certLevel: "Open Water Diver",
    insurance: "DAN",
    equipment: "Muta 5 mm, jacket, erogatore octopus, computer",
  },
  dives: [
    {
      ...emptyDive(),
      id: "seed-1",
      number: 1,
      date: "2024-07-12",
      site: "Secca di Isuela",
      location: "Portofino, Italia",
      lat: "44.3056",
      lng: "9.2139",
      timeIn: "09:40",
      timeOut: "10:28",
      maxDepth: "18",
      plannedDepth: "18",
      bottomTime: "42",
      totalTime: "48",
      safetyStop: "3",
      visibility: "12",
      waterTemp: "23",
      airTemp: "28",
      current: "lieve",
      seaConditions: "calmo",
      wetsuit: "5",
      ballast: "6",
      tank: "12",
      mix: "21",
      pressureStart: "200",
      pressureEnd: "70",
      types: ["Da barca"],
      feeling: 5,
      notes: "Cernie tra le fenditure, paramuricee rosse. Discesa lenta e consumo buono.",
      centerName: "Diving Portofino",
      profilePoints: [
        { t: 0, d: 0 },
        { t: 4, d: 12 },
        { t: 12, d: 18 },
        { t: 32, d: 14 },
        { t: 42, d: 5 },
        { t: 48, d: 0 },
      ],
    },
    {
      ...emptyDive(),
      id: "seed-2",
      number: 2,
      date: "2024-08-03",
      site: "Punta del Diavolo",
      location: "Ustica, Italia",
      lat: "38.703",
      lng: "13.193",
      timeIn: "16:10",
      timeOut: "17:02",
      maxDepth: "24",
      plannedDepth: "25",
      bottomTime: "38",
      totalTime: "52",
      safetyStop: "3",
      visibility: "25",
      waterTemp: "26",
      airTemp: "31",
      current: "assente",
      seaConditions: "poco mosso",
      wetsuit: "3",
      ballast: "4",
      tank: "15",
      mix: "32",
      pressureStart: "210",
      pressureEnd: "80",
      types: ["Da barca", "Profonda"],
      feeling: 5,
      notes: "Barracuda in treccia e un piccolo gruppo di cernie. Acqua cristallina.",
      centerName: "Ustica Diving",
      profilePoints: [
        { t: 0, d: 0 },
        { t: 6, d: 18 },
        { t: 16, d: 24 },
        { t: 34, d: 16 },
        { t: 46, d: 5 },
        { t: 52, d: 0 },
      ],
    },
    {
      ...emptyDive(),
      id: "seed-3",
      number: 3,
      date: "2025-06-21",
      site: "Relitto Anna Bianca",
      location: "Isola d'Elba, Italia",
      lat: "42.76",
      lng: "10.30",
      timeIn: "10:05",
      timeOut: "10:51",
      maxDepth: "21",
      plannedDepth: "22",
      bottomTime: "36",
      totalTime: "46",
      safetyStop: "3",
      visibility: "8",
      waterTemp: "22",
      airTemp: "27",
      current: "moderata",
      seaConditions: "mosso",
      wetsuit: "5",
      ballast: "7",
      tank: "12",
      mix: "21",
      pressureStart: "200",
      pressureEnd: "60",
      types: ["Da barca", "Relitto"],
      feeling: 4,
      notes: "Prua coperta di spugne. Scorfani e un polpo nel vano motore.",
      centerName: "Elba Divers",
      profilePoints: [
        { t: 0, d: 0 },
        { t: 5, d: 16 },
        { t: 14, d: 21 },
        { t: 30, d: 12 },
        { t: 40, d: 5 },
        { t: 46, d: 0 },
      ],
    },
  ],
});

function personNames(p) {
  const role = p?.role;
  let first = String(p?.firstName || "").trim();
  let last = String(p?.lastName || "").trim();
  let name = String(p?.name || "").trim().replace(/\s+/g, " ");
  if (role === "center") return { firstName: "", lastName: "", name };
  if (!first && !last && name) {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) first = parts[0];
    else {
      last = parts.pop();
      first = parts.join(" ");
    }
  }
  if (!name) name = [first, last].filter(Boolean).join(" ");
  return { firstName: first, lastName: last, name };
}

function cleanPerson(p) {
  if (!p) return null;
  const role = p.role === "guide" || p.role === "center" ? p.role : "buddy";
  const names = personNames({ ...p, role });
  if (!names.name) return null;
  return {
    id: String(p.id || uid()),
    role,
    name: names.name,
    firstName: names.firstName,
    lastName: names.lastName,
    cert: String(p.cert || "").trim(),
    level: String(p.level || "").trim(),
    lead: String(p.lead || "").trim(),
    note: String(p.note || "").trim(),
    following: p.remoteOwner ? Boolean(p.followOut && p.followIn) : Boolean(p.following),
    followOut: Boolean(p.followOut),
    followIn: Boolean(p.followIn),
    followRev: Number(p.followRev) || 0,
    remoteOwner: String(p.remoteOwner || "").trim(),
    sign: typeof p.sign === "string" && p.sign.startsWith("data:image") ? p.sign : "",
    portrait: typeof p.portrait === "string" && p.portrait.startsWith("data:image/") ? p.portrait : "",
  };
}

function normalizeState(data) {
  const profile = { ...emptyProfile(), ...(data?.profile || {}) };
  if (!Array.isArray(profile.certs)) profile.certs = [];
  const deletedDiveIds = Array.isArray(data?.deletedDiveIds)
    ? data.deletedDiveIds.map(String).filter(Boolean)
    : [];
  const deletedPeople = cleanPersonMarks(data?.deletedPeople);
  const people = [];
  const seen = new Set();
  (Array.isArray(data?.people) ? data.people : []).forEach((raw) => {
    const p = cleanPerson(raw);
    if (!p || personIsGone(p, deletedPeople)) return;
    const key = `${p.role}|${p.name.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    people.push(p);
  });
  return {
    profile,
    dives: Array.isArray(data?.dives) ? data.dives : [],
    deletedDiveIds,
    deletedPeople,
    peopleClock: Number(data?.peopleClock) || 0,
    people,
    peopleSeeded: Boolean(data?.peopleSeeded),
    peopleBackfilled: Boolean(data?.peopleBackfilled),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return normalizeState(JSON.parse(raw));
  } catch {
    return seed();
  }
}

function isSeedDive(d) {
  return String(d?.id || "").startsWith("seed-");
}

function realDiveCount(dives) {
  return (dives || []).filter((d) => !isSeedDive(d)).length;
}

function driveBackupDue() {
  return Boolean(
    realDiveCount(state.dives) ||
    (state.deletedDiveIds || []).length ||
    (state.deletedPeople || []).length ||
    (state.people || []).some((p) => p.remoteOwner && p.followOut)
  );
}

function diveScore(d) {
  if (!d) return 0;
  let n = Object.keys(d).filter((k) => d[k] !== "" && d[k] != null && d[k] !== false).length;
  if (d.profilePoints?.length) n += d.profilePoints.length * 8;
  if (d.photo) n += 40;
  if (d.buddySign || d.guideSign || d.centerSign) n += 60;
  if (d.computerLog) n += 30;
  if (d.notes) n += Math.min(80, String(d.notes).length);
  return n;
}

function diveTombstoneKeys(d) {
  const keys = [];
  if (d?.id) keys.push(String(d.id));
  if (d?.shareId) {
    keys.push("s:" + d.shareId);
    return keys;
  }
  const key = window.SeaDiveComputers?.diveKey?.(d) || `${d?.date || ""}|${d?.timeIn || ""}|${Number(d?.maxDepth) || 0}|${Number(d?.bottomTime) || 0}`;
  if (key && key !== "|||0|0" && key !== "||0|0") keys.push("k:" + key);
  return keys;
}

function diveIsDeleted(d, tombs) {
  if (!d) return false;
  const set = new Set(tombs || []);
  if (d.id && set.has(String(d.id))) return true;
  if (d.shareId && set.has("s:" + d.shareId)) return true;
  if (d.manual) return false;
  const key = window.SeaDiveComputers?.diveKey?.(d) || `${d?.date || ""}|${d?.timeIn || ""}|${Number(d?.maxDepth) || 0}|${Number(d?.bottomTime) || 0}`;
  return Boolean(key) && set.has("k:" + key);
}

function rememberDeletedDive(d) {
  const next = new Set(state.deletedDiveIds || []);
  diveTombstoneKeys(d).forEach((k) => next.add(k));
  state.deletedDiveIds = [...next].slice(-800);
}

function forgetDeletedDive(d) {
  const drop = new Set(diveTombstoneKeys(d));
  state.deletedDiveIds = (state.deletedDiveIds || []).filter((k) => !drop.has(k));
}

function askConfirm({ title = "Conferma", message = "", ok = "Elimina", cancel = "Annulla" } = {}) {
  return new Promise((resolve) => {
    document.querySelector(".confirm-veil")?.remove();
    const veil = document.createElement("div");
    veil.className = "confirm-veil";
    veil.innerHTML = `
      <div class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title">${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
        <div class="confirm-actions">
          <button type="button" class="btn ghost" data-no>${escapeHtml(cancel)}</button>
          <button type="button" class="btn danger" data-yes disabled>${escapeHtml(ok)}</button>
        </div>
      </div>
    `;
    let armed = false;
    const yes = veil.querySelector("[data-yes]");
    const done = (v) => {
      if (v && !armed) return;
      veil.remove();
      resolve(Boolean(v));
    };
    veil.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target === veil) done(false);
    });
    veil.querySelector("[data-no]").onclick = (e) => {
      e.stopPropagation();
      done(false);
    };
    yes.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      done(true);
    };
    document.body.append(veil);
    setTimeout(() => {
      armed = true;
      yes.disabled = false;
    }, 450);
  });
}

function askDeleteDive(d) {
  const where = d?.site || "questa immersione";
  const n = d?.number ? ` n° ${d.number}` : "";
  return askConfirm({
    title: "Conferma eliminazione",
    message: `Vuoi davvero eliminare ${where}${n} dal diario? Non si può annullare.`,
    ok: "Elimina",
    cancel: "Annulla",
  });
}

async function removePerson(person) {
  if (!person) return false;
  const ok = await askConfirm({
    title: "Elimina contatto",
    message: `Vuoi togliere ${person.name || "questo contatto"} dal telefono e dal tuo Drive? Se ha l'app lo ritrovi con Cerca chi usa SeaDive. Il nome resta sulle schede già scritte.`,
    ok: "Elimina",
    cancel: "Annulla",
  });
  if (!ok) return false;
  if (person.remoteOwner) {
    try { await setMyFollow(person, false); } catch { /* il profilo cloud resta cercabile */ }
  }
  rememberDeletedPerson(person);
  state.people = (state.people || []).filter((p) => p.id !== person.id && !personIsGone(p, state.deletedPeople));
  save(state);
  silentDrivePush();
  return true;
}

const DIVE_CONTACT = {
  buddy: { title: "il buddy", name: "buddyName", extra: "buddyCert", id: "buddyId", sign: "buddySign", meta: "buddy" },
  guide: { title: "la guida", name: "guideName", extra: "guideCert", id: "guideId", sign: "guideSign", meta: "guide" },
  center: { title: "il diving", name: "centerName", extra: "centerLead", id: "centerId", sign: "centerSign", meta: "center" },
};

function diveContactPresent(dive, role) {
  const spec = DIVE_CONTACT[role];
  if (!spec || !dive) return false;
  const sign = dive[spec.sign];
  return Boolean(
    String(dive[spec.name] || "").trim() ||
      String(dive[spec.extra] || "").trim() ||
      (typeof sign === "string" && sign.startsWith("data:image"))
  );
}

function clearDiveContact(dive, role) {
  const spec = DIVE_CONTACT[role];
  if (!spec || !dive) return;
  dive[spec.name] = "";
  dive[spec.extra] = "";
  dive[spec.id] = "";
  dive[spec.sign] = "";
  dive.signSkipped = { ...(dive.signSkipped || {}), [role]: true };
  if (dive.sigMeta) dive.sigMeta[spec.meta] = null;
  bumpContactGen(dive, role);
}

function settleDiveContacts(next, before) {
  ["buddy", "guide", "center"].forEach((role) => {
    const spec = DIVE_CONTACT[role];
    const now = String(next?.[spec.name] || "").trim();
    const prev = String(before?.[spec.name] || "").trim();
    if (now) {
      if (now !== prev) {
        if (next.signSkipped) delete next.signSkipped[role];
        bumpContactGen(next, role);
      }
      return;
    }
    if (!prev) return;
    next.signSkipped = { ...(next.signSkipped || {}), [role]: true };
    next[spec.extra] = "";
    next[spec.id] = "";
    next[spec.sign] = "";
    if (next.sigMeta) next.sigMeta[spec.meta] = null;
    bumpContactGen(next, role);
  });
}

function dropContactButton(role, dive) {
  const label = role === "buddy" ? "Togli buddy" : role === "guide" ? "Togli guida" : "Togli diving";
  return `<button class="btn danger btn-block contact-drop" type="button" data-dropcontact="${role}" ${diveContactPresent(dive, role) ? "" : "hidden"}>${label}</button>`;
}

async function askDropDiveContact(dive, role) {
  const spec = DIVE_CONTACT[role];
  const who = String(dive?.[spec?.name] || "").trim() || spec?.title || "questo contatto";
  return askConfirm({
    title: "Togli contatto",
    message: `Vuoi togliere ${who} da questa immersione e dalla copia su Drive? Resta in Community.`,
    ok: "Togli",
    cancel: "Annulla",
  });
}

async function removeDive(d) {
  if (!d) return false;
  if (!(await askDeleteDive(d))) return false;
  rememberDeletedDive(d);
  state.dives = (state.dives || []).filter((x) => x.id !== d.id && !diveIsDeleted(x, state.deletedDiveIds));
  save(state);
  return true;
}

function contactRank(dive, role) {
  const gen = Number(dive?.contactGen?.[role]) || 0;
  const spec = DIVE_CONTACT[role];
  const empty = !String(dive?.[spec?.name] || "").trim();
  const inferred = empty && dive?.signSkipped?.[role] ? 1 : 0;
  return Math.max(gen, inferred);
}

function bumpContactGen(dive, role) {
  if (!dive) return;
  dive.contactGen = { ...(dive.contactGen || {}), [role]: contactRank(dive, role) + 1 };
}

function copyDiveContact(target, source, role) {
  const spec = DIVE_CONTACT[role];
  target[spec.name] = source?.[spec.name] || "";
  target[spec.extra] = source?.[spec.extra] || "";
  target[spec.id] = source?.[spec.id] || "";
  target[spec.sign] = source?.[spec.sign] || "";
  target.signSkipped = { ...(target.signSkipped || {}) };
  if (source?.signSkipped?.[role]) target.signSkipped[role] = true;
  else delete target.signSkipped[role];
  const rank = contactRank(source, role);
  target.contactGen = { ...(target.contactGen || {}), [role]: rank };
  target.sigMeta = { ...(target.sigMeta || {}) };
  target.sigMeta[spec.meta] = source?.sigMeta?.[spec.meta] || null;
}

function mergeDivePair(a, b) {
  const primary = diveScore(a) >= diveScore(b) ? a : b;
  const base = { ...primary };
  if (primary.signSkipped) base.signSkipped = { ...primary.signSkipped };
  if (primary.contactGen) base.contactGen = { ...primary.contactGen };
  if (primary.sigMeta) base.sigMeta = { ...primary.sigMeta };
  ["buddy", "guide", "center"].forEach((role) => {
    const ra = contactRank(a, role);
    const rb = contactRank(b, role);
    if (ra === rb) return;
    copyDiveContact(base, ra > rb ? a : b, role);
  });
  return base;
}

function mergeDiveLists(a, b, tombs) {
  const api = window.SeaDiveComputers;
  const candidates = [...(a || []), ...(b || [])].filter((d) => d && !isSeedDive(d) && !diveIsDeleted(d, tombs));
  if (!candidates.length) {
    return (a || []).some(isSeedDive) ? a : b || [];
  }
  const groups = [];
  candidates.forEach((d) => {
    const key = api?.diveKey?.(d) || `${d.date}|${d.timeIn}|${d.maxDepth}`;
    const blank = key === "||0|0" || key === "|||0|0";
    const i = groups.findIndex((x) => {
      if (d.id && x.id === d.id) return true;
      const shareA = d.shareId || "";
      const shareB = x.shareId || "";
      if (shareA || shareB) return Boolean(shareA) && shareA === shareB;
      return !blank && (api?.diveKey?.(x) || `${x.date}|${x.timeIn}|${x.maxDepth}`) === key;
    });
    if (i < 0) groups.push(d);
    else groups[i] = mergeDivePair(groups[i], d);
  });
  return groups;
}

function mergeProfiles(a, b) {
  const left = a || {};
  const right = b || {};
  const out = { ...emptyProfile(), ...right, ...left };
  Object.keys(emptyProfile()).forEach((k) => {
    if (k === "certs") return;
    if (out[k] === "" || out[k] == null) out[k] = left[k] || right[k] || "";
  });
  const seen = new Set();
  out.certs = [...(left.certs || []), ...(right.certs || [])].filter((c) => {
    const k = `${String(c?.name || "").toLowerCase()}|${c?.number || ""}`;
    if ((!c?.name && !c?.number) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return out;
}

function mergeVaults(local, cloud) {
  const L = normalizeState(local);
  const C = normalizeState(cloud);
  const deletedDiveIds = [...new Set([...(L.deletedDiveIds || []), ...(C.deletedDiveIds || [])])].slice(-800);
  const deletedPeople = mergePersonMarks(L.deletedPeople, C.deletedPeople);
  const peopleClock = Math.max(
    Number(L.peopleClock) || 0,
    Number(C.peopleClock) || 0,
    ...deletedPeople.map((e) => Number(e.t) || 0)
  );
  const localReal = realDiveCount(L.dives);
  const cloudReal = realDiveCount(C.dives);
  let dives;
  if (!localReal && !cloudReal) dives = L.dives.length ? L.dives : C.dives;
  else dives = mergeDiveLists(L.dives, C.dives, deletedDiveIds);
  dives = (dives || []).filter((d) => !diveIsDeleted(d, deletedDiveIds));
  return {
    profile: mergeProfiles(L.profile, C.profile),
    dives,
    deletedDiveIds,
    deletedPeople,
    peopleClock,
    people: mergePeople(L.people, C.people, deletedPeople),
    peopleSeeded: Boolean(L.peopleSeeded || C.peopleSeeded),
    peopleBackfilled: Boolean(L.peopleBackfilled || C.peopleBackfilled),
  };
}

function mergePeople(a, b, marks) {
  const out = [];
  const index = new Map();
  [...(a || []), ...(b || [])].forEach((raw) => {
    const p = cleanPerson(raw);
    if (!p || personIsGone(p, marks)) return;
    const key = `${p.role}|${p.name.toLowerCase()}`;
    const prev = index.get(key);
    if (!prev) {
      index.set(key, p);
      out.push(p);
      return;
    }
    if (!prev.cert && p.cert) prev.cert = p.cert;
    if (!prev.level && p.level) prev.level = p.level;
    if (!prev.lead && p.lead) prev.lead = p.lead;
    if (!prev.note && p.note) prev.note = p.note;
    if (!prev.sign && p.sign) prev.sign = p.sign;
    if (!prev.portrait && p.portrait) prev.portrait = p.portrait;
    if (!prev.firstName && p.firstName) prev.firstName = p.firstName;
    if (!prev.lastName && p.lastName) prev.lastName = p.lastName;
    if (!prev.remoteOwner && p.remoteOwner) prev.remoteOwner = p.remoteOwner;
    const revP = Number(p.followRev) || 0;
    const revPrev = Number(prev.followRev) || 0;
    if (revP > revPrev) {
      prev.followOut = Boolean(p.followOut);
      prev.followIn = Boolean(p.followIn);
      prev.followRev = revP;
    } else if (revP === revPrev) {
      if (p.followOut) prev.followOut = true;
      if (p.followIn) prev.followIn = true;
    }
    if (prev.remoteOwner) prev.following = Boolean(prev.followOut && prev.followIn);
    else if (p.following) prev.following = true;
  });
  return out;
}

function openVault() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("seadive-vault", 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("kv")) req.result.createObjectStore("kv");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function vaultGet() {
  try {
    const db = await openVault();
    const val = await new Promise((resolve, reject) => {
      const tx = db.transaction("kv", "readonly");
      const r = tx.objectStore("kv").get("state");
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return val;
  } catch {
    return null;
  }
}

async function vaultPut(data) {
  try {
    const db = await openVault();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("kv", "readwrite");
      tx.objectStore("kv").put(data, "state");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* IndexedDB non disponibile: resta localStorage */
  }
}

function persistLocal(data) {
  const json = JSON.stringify(data);
  try {
    localStorage.setItem(KEY, json);
  } catch {
    try {
      const slim = {
        profile: data.profile,
        deletedDiveIds: data.deletedDiveIds || [],
        deletedPeople: data.deletedPeople || [],
        peopleClock: Number(data.peopleClock) || 0,
        people: data.people || [],
        peopleSeeded: Boolean(data.peopleSeeded),
        peopleBackfilled: Boolean(data.peopleBackfilled),
        dives: (data.dives || []).map((d) => {
          const copy = { ...d };
          if (copy.photo && String(copy.photo).length > 8000) copy.photo = "";
          if (copy.computerLog) copy.computerLog = { truncated: true };
          return copy;
        }),
      };
      localStorage.setItem(KEY, JSON.stringify(slim));
    } catch {
      /* la copia completa resta in IndexedDB e su Drive */
    }
  }
  vaultPut(data);
}

let cloudHydrated = false;
let backupTimer = 0;
let backupBusy = false;
let syncLock = false;
let pushAgain = false;
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

function save(next) {
  persistLocal(next);
  scheduleDriveBackup();
}

function scheduleDriveBackup() {
  if (!loadSession()) return;
  clearTimeout(backupTimer);
  backupTimer = setTimeout(() => silentDrivePush(), 400);
}

function dueFifteenDaySync() {
  const t = loadMeta().lastBackup;
  if (!t) return true;
  const when = new Date(t).getTime();
  if (!Number.isFinite(when)) return true;
  return Date.now() - when >= FIFTEEN_DAYS_MS;
}

async function silentDrivePush() {
  if (!loadSession()) return { ok: false, reason: "auth" };
  if (syncLock) {
    pushAgain = true;
    return { ok: false, reason: "busy" };
  }
  syncLock = true;
  let res = { ok: false };
  try {
    do {
      pushAgain = false;
      res = await syncWithDrive({ interactive: false });
      const meta = loadMeta();
      meta.pendingBackup = !res?.ok;
      saveMeta(meta);
    } while (pushAgain);
  } finally {
    syncLock = false;
  }
  return res;
}

async function maybeBackupDrive() {
  if (!cloudHydrated || backupBusy) return;
  if (!window.SeaDiveDrive) return;
  const hint = loadSession()?.email || "";
  const token = await window.SeaDiveDrive.ensureToken({ interactive: false, hint });
  if (!token) return;
  backupBusy = true;
  try {
    await window.SeaDiveDrive.uploadDriveBackup(backupPayload());
    const meta = loadMeta();
    meta.lastBackup = new Date().toISOString();
    meta.drive = true;
    meta.diveCount = state.dives.length;
    meta.pendingBackup = false;
    saveMeta(meta);
  } catch {
    const meta = loadMeta();
    meta.pendingBackup = true;
    saveMeta(meta);
  } finally {
    backupBusy = false;
  }
}

async function hydrateFromIdb() {
  const stored = await vaultGet();
  if (!stored?.dives && !stored?.profile) {
    await vaultPut(state);
    return;
  }
  state = mergeVaults(state, stored);
  persistLocal(state);
  rememberCatalogFromDives();
}

async function syncWithDrive({ interactive = false } = {}) {
  if (!window.SeaDiveDrive) return { ok: false, reason: "no-drive" };
  const hint = loadSession()?.email || "";
  const token = await window.SeaDiveDrive.ensureToken({ interactive, hint });
  if (!token) return { ok: false, reason: "auth" };
  try {
    const cloud = await window.SeaDiveDrive.downloadDriveBackup();
    if (cloud && typeof cloud === "object") {
      applyBackupExtras(cloud);
      state = mergeVaults(state, parseBackup(cloud));
      persistLocal(state);
      rememberCatalogFromDives();
    }
    cloudHydrated = true;
    if (driveBackupDue()) await maybeBackupDrive();
    return { ok: true, dives: state.dives.length };
  } catch (err) {
    return { ok: false, reason: err.message || String(err) };
  }
}

function applyBackupExtras(data) {
  if (Array.isArray(data?.sites)) window.SeaDiveSites?.mergeCustomSites?.(data.sites);
  if (data?.brand && String(data.brand).startsWith("data:")) {
    try {
      localStorage.setItem(BRAND_KEY, data.brand);
    } catch {
      /* foto marchio troppo grande */
    }
  }
}

const META_KEY = "seadive-logbook-meta";
function loadMeta() {
  try {
    return { lastBackup: null, ...JSON.parse(localStorage.getItem(META_KEY) || "{}") };
  } catch {
    return { lastBackup: null };
  }
}
function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function backupPayload() {
  let brand = "";
  try {
    brand = localStorage.getItem(BRAND_KEY) || "";
    if (brand && !brand.startsWith("data:")) brand = "";
  } catch {
    brand = "";
  }
  return {
    app: "seadive-logbook",
    version: 2,
    exportedAt: new Date().toISOString(),
    profile: state.profile,
    dives: state.dives,
    deletedDiveIds: state.deletedDiveIds || [],
    deletedPeople: state.deletedPeople || [],
    peopleClock: Number(state.peopleClock) || 0,
    people: state.people || [],
    peopleSeeded: Boolean(state.peopleSeeded),
    sites: window.SeaDiveSites?.loadCustomSites?.() || [],
    brand,
  };
}

function parseBackup(data) {
  if (!data || typeof data !== "object") throw new Error("invalid");
  return normalizeState(data);
}

function personKey(role, name) {
  return `${role}|${String(name || "").trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function personTombKeys(person) {
  const role = person?.role === "guide" || person?.role === "center" ? person.role : "buddy";
  const keys = [];
  const nameKey = personKey(role, person?.name);
  if (!nameKey.endsWith("|")) keys.push(nameKey);
  if (person?.id) keys.push("id:" + person.id);
  return keys;
}

function cleanPersonMarks(raw) {
  if (!Array.isArray(raw)) return [];
  const map = new Map();
  raw.forEach((e) => {
    if (!e || typeof e.k !== "string" || !e.k) return;
    const t = Number(e.t) || 0;
    const prev = map.get(e.k);
    if (!prev || t >= prev.t) map.set(e.k, { k: e.k, t, gone: Boolean(e.gone) });
  });
  return [...map.values()].slice(-800);
}

function mergePersonMarks(a, b) {
  return cleanPersonMarks([...(a || []), ...(b || [])]);
}

function personIsGone(person, marks) {
  const keys = new Set(personTombKeys(person));
  let best = null;
  (marks || []).forEach((e) => {
    if (!e || !keys.has(e.k)) return;
    if (!best || Number(e.t) >= Number(best.t)) best = e;
  });
  return Boolean(best?.gone);
}

function personMarkTime() {
  const tops = (state.deletedPeople || []).map((e) => Number(e.t) || 0);
  const t = Math.max(Number(state.peopleClock) || 0, ...tops, 0) + 1;
  state.peopleClock = t;
  return t;
}

function writePersonMarks(person, gone) {
  const t = personMarkTime();
  const map = new Map((state.deletedPeople || []).map((e) => [e.k, e]));
  personTombKeys(person).forEach((k) => map.set(k, { k, t, gone }));
  state.deletedPeople = [...map.values()].slice(-800);
}

function rememberDeletedPerson(person) {
  if (!person) return;
  writePersonMarks(person, true);
}

function forgetDeletedPerson(person) {
  if (!person) return;
  writePersonMarks(person, false);
}

function roleLabel(role) {
  if (role === "guide") return "Istruttore";
  if (role === "center") return "Diving";
  return "Buddy";
}

function upsertPerson(partial, opts) {
  const name = String(partial?.name || "").trim().replace(/\s+/g, " ");
  if (!name) return null;
  const role = partial.role === "guide" || partial.role === "center" ? partial.role : "buddy";
  if (personIsGone({ id: partial?.id, role, name }, state.deletedPeople)) {
    if (opts?.keepTomb) return null;
    forgetDeletedPerson({ id: partial?.id, role, name });
  }
  if (!Array.isArray(state.people)) state.people = [];
  let found = partial.id ? state.people.find((p) => p.id === partial.id) : null;
  const key = personKey(role, name);
  if (!found) found = state.people.find((p) => personKey(p.role, p.name) === key);
  if (!found) {
    found = { id: partial.id || uid(), role, name, cert: "", lead: "", note: "" };
    state.people.push(found);
  }
  const twin = state.people.find((p) => p !== found && personKey(p.role, p.name) === key);
  found.role = role;
  found.name = name;
  const names = personNames({ ...found, ...partial, role, name });
  found.firstName = names.firstName;
  found.lastName = names.lastName;
  found.name = names.name || name;
  if (String(partial.cert || "").trim()) found.cert = String(partial.cert).trim();
  if (typeof partial.level === "string") found.level = partial.level.trim();
  if (String(partial.lead || "").trim()) found.lead = String(partial.lead).trim();
  if (partial.note != null) found.note = String(partial.note).trim();
  if (typeof partial.remoteOwner === "string" && partial.remoteOwner.trim()) found.remoteOwner = partial.remoteOwner.trim();
  if (partial.followOut === true) found.followOut = true;
  if (partial.followOut === false) found.followOut = false;
  if (partial.followIn === true) found.followIn = true;
  if (partial.followIn === false) found.followIn = false;
  if (Number(partial.followRev) > Number(found.followRev || 0)) found.followRev = Number(partial.followRev);
  if (found.remoteOwner) found.following = Boolean(found.followOut && found.followIn);
  else {
    if (partial.following === true) found.following = true;
    if (partial.following === false) found.following = false;
  }
  if (typeof partial.sign === "string") found.sign = partial.sign.startsWith("data:image") ? partial.sign : "";
  if (typeof partial.portrait === "string") found.portrait = partial.portrait.startsWith("data:image/") ? partial.portrait : "";
  if (twin) {
    if (!found.cert && twin.cert) found.cert = twin.cert;
    if (!found.level && twin.level) found.level = twin.level;
    if (!found.lead && twin.lead) found.lead = twin.lead;
    if (!found.note && twin.note) found.note = twin.note;
    if (!found.sign && twin.sign) found.sign = twin.sign;
    if (!found.portrait && twin.portrait) found.portrait = twin.portrait;
    if (!found.remoteOwner && twin.remoteOwner) found.remoteOwner = twin.remoteOwner;
    (state.dives || []).forEach((d) => {
      if (d.buddyId === twin.id) d.buddyId = found.id;
      if (d.guideId === twin.id) d.guideId = found.id;
      if (d.centerId === twin.id) d.centerId = found.id;
    });
    state.people = state.people.filter((p) => p !== twin);
  }
  return found;
}

function linkPeopleOnDive(dive) {
  const buddy = upsertPerson({ role: "buddy", name: dive.buddyName, cert: dive.buddyCert }, { keepTomb: true });
  const guide = upsertPerson({ role: "guide", name: dive.guideName, cert: dive.guideCert }, { keepTomb: true });
  const center = upsertPerson({ role: "center", name: dive.centerName, lead: dive.centerLead }, { keepTomb: true });
  dive.buddyId = buddy?.id || "";
  dive.guideId = guide?.id || "";
  dive.centerId = center?.id || "";
  if (buddy && diveContactReady(buddy) && !(typeof dive.buddySign === "string" && dive.buddySign.startsWith("data:image"))) {
    const sign = personKnownSign(buddy);
    if (sign) dive.buddySign = sign;
  }
  if (guide && diveContactReady(guide) && !(typeof dive.guideSign === "string" && dive.guideSign.startsWith("data:image"))) {
    const sign = personKnownSign(guide);
    if (sign) dive.guideSign = sign;
  }
}

function seedPeopleOnce() {
  if (state.peopleSeeded) return false;
  if (!Array.isArray(state.people)) state.people = [];
  (state.dives || []).forEach((d) => {
    upsertPerson({ role: "buddy", name: d.buddyName, cert: d.buddyCert }, { keepTomb: true });
    upsertPerson({ role: "guide", name: d.guideName, cert: d.guideCert }, { keepTomb: true });
    upsertPerson({ role: "center", name: d.centerName, lead: d.centerLead }, { keepTomb: true });
  });
  state.peopleSeeded = true;
  return true;
}

function adoptSessionName() {
  if (String(state.profile?.name || "").trim()) return false;
  const sessionName = String(loadSession()?.name || "").trim().replace(/\s+/g, " ");
  if (!sessionName) return false;
  state.profile.name = sessionName;
  return true;
}

function backfillPeopleOnce() {
  if (state.peopleBackfilled) return ensureOwnerPerson();
  if (!Array.isArray(state.people)) state.people = [];
  (state.dives || []).forEach((d) => {
    if (String(d.buddyName || "").trim() && !state.people.some((p) => p.role === "buddy" && samePersonName(p.name, d.buddyName))) {
      upsertPerson({ role: "buddy", name: d.buddyName, cert: d.buddyCert || "" }, { keepTomb: true });
    }
    if (String(d.guideName || "").trim() && !state.people.some((p) => p.role === "guide" && samePersonName(p.name, d.guideName))) {
      upsertPerson({ role: "guide", name: d.guideName, cert: d.guideCert || "" }, { keepTomb: true });
    }
    if (String(d.centerName || "").trim() && !state.people.some((p) => p.role === "center" && samePersonName(p.name, d.centerName))) {
      upsertPerson({ role: "center", name: d.centerName, lead: d.centerLead || "" }, { keepTomb: true });
    }
  });
  state.peopleBackfilled = true;
  ensureOwnerPerson();
  return true;
}

function ensureOwnerPerson() {
  const name = String(state.profile?.name || "").trim().replace(/\s+/g, " ");
  if (!name) return false;
  if (!Array.isArray(state.people)) state.people = [];
  const sign = profileSignImage();
  const portrait = profilePortraitImage();
  const mine = state.people.find((p) => p.role !== "center" && samePersonName(p.name, name));
  if (!mine) {
    const names = personNames({ name });
    upsertPerson({
      role: "buddy",
      name,
      firstName: names.firstName,
      lastName: names.lastName,
      cert: state.profile.certNumber || "",
      sign,
      portrait,
    });
    return true;
  }
  let changed = false;
  if (sign && mine.sign !== sign && !mine.sign) {
    mine.sign = sign;
    changed = true;
  }
  if ((mine.portrait || "") !== portrait) {
    mine.portrait = portrait;
    changed = true;
  }
  return changed;
}

function divesForPerson(p) {
  if (!p) return [];
  const key = personKey(p.role, p.name);
  return (state.dives || []).filter((d) => {
    if (p.role === "buddy") return d.buddyId === p.id || personKey("buddy", d.buddyName) === key;
    if (p.role === "guide") return d.guideId === p.id || personKey("guide", d.guideName) === key;
    return d.centerId === p.id || personKey("center", d.centerName) === key;
  });
}

function stampPersonSign(person) {
  if (!person || person.role === "center" || !diveContactReady(person)) return;
  const sign = personKnownSign(person);
  if (!sign) return;
  const signKey = person.role === "guide" ? "guideSign" : "buddySign";
  const nameKey = person.role === "guide" ? "guideName" : "buddyName";
  const idKey = person.role === "guide" ? "guideId" : "buddyId";
  (state.dives || []).forEach((d) => {
    if (d[idKey] !== person.id && !samePersonName(d[nameKey], person.name)) return;
    if (typeof d[signKey] === "string" && d[signKey].startsWith("data:image")) return;
    d[signKey] = sign;
  });
}

function applyPersonOntoDives(before, person) {
  if (!before || before.role !== person.role) return;
  const oldKey = personKey(before.role, before.name);
  (state.dives || []).forEach((d) => {
    const ready = diveContactReady(person);
    if (person.role === "buddy" && (d.buddyId === before.id || personKey("buddy", d.buddyName) === oldKey)) {
      d.buddyId = person.id;
      d.buddyName = person.name;
      if (ready) {
        d.buddyCert = person.cert || "";
        const sign = personKnownSign(person);
        if (sign && !(typeof d.buddySign === "string" && d.buddySign.startsWith("data:image"))) d.buddySign = sign;
      }
    }
    if (person.role === "guide" && (d.guideId === before.id || personKey("guide", d.guideName) === oldKey)) {
      d.guideId = person.id;
      d.guideName = person.name;
      if (ready) {
        d.guideCert = person.cert || "";
        const sign = personKnownSign(person);
        if (sign && !(typeof d.guideSign === "string" && d.guideSign.startsWith("data:image"))) d.guideSign = sign;
      }
    }
    if (person.role === "center" && (d.centerId === before.id || personKey("center", d.centerName) === oldKey)) {
      d.centerId = person.id;
      d.centerName = person.name;
      d.centerLead = person.lead || "";
    }
  });
}

function shareDiveFilename(d) {
  const site = String(d?.site || "immersione")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "immersione";
  return `seadive-${site}-${d?.date || "data"}.json`;
}

function sharedDiveCopy(d) {
  const copy = { ...d };
  ["id", "number", "photo", "buddyId", "guideId", "centerId", "signSkipped"].forEach((k) => delete copy[k]);
  ["buddySign", "guideSign", "centerSign"].forEach((k) => {
    if (typeof copy[k] !== "string" || !copy[k].startsWith("data:image")) delete copy[k];
  });
  if (copy.sigMeta && typeof copy.sigMeta === "object") {
    copy.sigMeta = {
      buddy: copy.sigMeta.buddy || null,
      guide: copy.sigMeta.guide || null,
      center: copy.sigMeta.center || null,
    };
  } else delete copy.sigMeta;
  if (copy.computerLog && typeof copy.computerLog === "object") {
    const log = { ...copy.computerLog };
    delete log.all;
    copy.computerLog = log;
  }
  return copy;
}

function keepSharedSigns(dive) {
  const next = { ...dive };
  ["buddySign", "guideSign", "centerSign"].forEach((k) => {
    next[k] = typeof next[k] === "string" && next[k].startsWith("data:image") ? next[k] : "";
  });
  const meta = next.sigMeta && typeof next.sigMeta === "object" ? next.sigMeta : {};
  next.sigMeta = {
    buddy: meta.buddy || null,
    guide: meta.guide || null,
    center: meta.center || null,
  };
  return next;
}

async function shareOneDive(d) {
  const shareId = uid();
  const payload = {
    app: "seadive-logbook",
    kind: "dive-share",
    version: 1,
    shareId,
    sharedAt: new Date().toISOString(),
    from: {
      name: state.profile.name || "",
      cert: [state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" "),
    },
    dive: { ...sharedDiveCopy(d), shareId },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "text/plain" });
  const file = new File([blob], shareDiveFilename(d), { type: "text/plain" });
  try {
    if (navigator.share) {
      await navigator.share({ files: [file] });
      return;
    }
  } catch (err) {
    if (err?.name === "AbortError") return;
  }
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = shareDiveFilename(d);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const PDF_WIN = {
  "à": "\\340", "è": "\\350", "é": "\\351", "ì": "\\354", "ò": "\\362", "ù": "\\371",
  "À": "\\300", "È": "\\310", "É": "\\311", "Ì": "\\314", "Ò": "\\322", "Ù": "\\331",
  "á": "\\341", "í": "\\355", "ó": "\\363", "ú": "\\372",
  "°": "\\260", "·": "\\267", "ç": "\\347",
  "’": "\\222", "‘": "\\221",
};

function pdfLiteral(text) {
  let out = "";
  for (const ch of String(text ?? "")) {
    if (PDF_WIN[ch]) {
      out += PDF_WIN[ch];
      continue;
    }
    if (ch === "\\" ) out += "\\\\";
    else if (ch === "(") out += "\\(";
    else if (ch === ")") out += "\\)";
    else if (ch === "\n" || ch === "\r" || ch === "\t") out += " ";
    else if (ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) <= 126) out += ch;
    else out += " ";
  }
  return out.replace(/ {2,}/g, " ").trim();
}

function pdfWrap(text, max) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const rows = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      rows.push(line);
      line = word.slice(0, max);
    } else line = next.slice(0, max);
  });
  if (line) rows.push(line);
  return rows;
}

function pdfNum(n) {
  return (Math.round(Number(n) * 10) / 10).toFixed(1);
}

function pdfFile(content) {
  const enc = new TextEncoder();
  const parts = [];
  let size = 0;
  const write = (s) => {
    const bytes = enc.encode(s);
    parts.push(bytes);
    size += bytes.length;
  };
  write("%PDF-1.4\n");
  const offsets = [0];
  const obj = (n, body) => {
    offsets[n] = size;
    write(`${n} 0 obj\n${body}\nendobj\n`);
  };
  const stream = content.endsWith("\n") ? content : `${content}\n`;
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>");
  obj(4, `<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream`);
  obj(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  obj(6, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const xrefAt = size;
  let xref = "xref\n0 7\n0000000000 65535 f \n";
  for (let i = 1; i <= 6; i += 1) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  xref += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
  write(xref);
  return new Blob(parts, { type: "application/pdf" });
}

function divePdfName(d) {
  return shareDiveFilename(d).replace(/\.json$/, ".pdf");
}

function buildDivePdf(d) {
  const ops = [];
  const txt = (font, size, x, y, str, rgb = "0.05 0.16 0.2") => {
    const safe = pdfLiteral(str);
    if (!safe) return;
    ops.push(`BT ${rgb} rg /F${font} ${size} Tf 1 0 0 1 ${pdfNum(x)} ${pdfNum(y)} Tm (${safe}) Tj ET`);
  };
  const fill = (rgb, x, y, w, h) => ops.push(`${rgb} rg ${pdfNum(x)} ${pdfNum(y)} ${pdfNum(w)} ${pdfNum(h)} re f`);
  ops.push("0.031 0.220 0.282 rg 0 786 595 56 re f");
  txt(2, 16, 36, 816, "SeaDive LogBook", "1 1 1");
  txt(1, 9, 36, 800, "Libretto immersioni", "0.78 0.93 0.95");
  txt(1, 10, 470, 808, d.number ? `N. ${d.number}` : "Scheda", "1 1 1");
  let y = 758;
  txt(2, 18, 36, y, d.site || "Senza nome");
  y -= 16;
  const when = [d.date, [d.timeIn, d.timeOut].filter(Boolean).join(" - ")].filter(Boolean).join("  ·  ");
  if (when) {
    txt(1, 10, 36, y, when, "0.27 0.36 0.4");
    y -= 14;
  }
  const place = [d.location, geoText(d)].filter(Boolean).join("  ·  ");
  if (place) {
    txt(1, 10, 36, y, place, "0.27 0.36 0.4");
    y -= 16;
  }
  y -= 8;
  const shown = (value, unit) => {
    const text = String(value ?? "").trim();
    if (!text || text === "—") return "";
    return unit ? `${text} ${unit}` : text;
  };
  const cells = [];
  const add = (label, value) => {
    if (value) cells.push([label, value]);
  };
  add("Prof. max", shown(d.maxDepth, "m"));
  add("Prof. media", shown(d.avgDepth || d.computerLog?.avgDepth, "m"));
  add("Tempo di fondo", shown(d.bottomTime, "min"));
  add("Tempo totale", shown(d.totalTime, "min"));
  add("Sosta sicurezza", shown(d.safetyStop, "min"));
  add("Visibilità", shown(d.visibility, "m"));
  add("Acqua", shown(d.waterTemp, "°C"));
  add("Aria", shown(d.airTemp, "°C"));
  add("Muta", shown(d.wetsuit, "mm"));
  add("Zavorra", shown(d.ballast, "kg"));
  add("Bombola", shown(d.tank, "L"));
  add("Miscela", shown(d.mix) ? `EAN ${d.mix}` : "");
  add("Pressione", [shown(d.pressureStart), shown(d.pressureEnd)].filter(Boolean).join(" - ") + (shown(d.pressureStart) || shown(d.pressureEnd) ? " bar" : ""));
  add("SAC", shown(d.sac, "L/min"));
  add("Corrente", shown(d.current));
  add("Mare", shown(d.seaConditions));
  add("Fuori curva", d.deco ? "Sì" : "No");
  add("NDL", shown(d.ndl, "min"));
  if (cells.length) {
    txt(2, 11, 36, y, "Scheda", "0.04 0.42 0.45");
    y -= 18;
    for (let i = 0; i < cells.length && y > 210; i += 2) {
      const right = cells[i + 1];
      txt(1, 8, 36, y, cells[i][0], "0.42 0.5 0.54");
      txt(2, 10, 36, y - 12, cells[i][1]);
      if (right) {
        txt(1, 8, 310, y, right[0], "0.42 0.5 0.54");
        txt(2, 10, 310, y - 12, right[1]);
      }
      y -= 28;
    }
    y -= 6;
  }
  const people = [];
  const diver = String(state.profile?.name || "").trim();
  if (diver) people.push(["Subacqueo", [diver, state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" · ")]);
  if (String(d.buddyName || "").trim()) people.push(["Buddy", [d.buddyName, d.buddyCert].filter(Boolean).join(" · ")]);
  if (String(d.guideName || "").trim()) people.push(["Guida", [d.guideName, d.guideCert].filter(Boolean).join(" · ")]);
  if (String(d.centerName || "").trim()) people.push(["Diving", [d.centerName, d.centerLead].filter(Boolean).join(" · ")]);
  if (people.length && y > 160) {
    txt(2, 11, 36, y, "Persone", "0.04 0.42 0.45");
    y -= 16;
    people.forEach((row) => {
      if (y < 150) return;
      txt(1, 8, 36, y, row[0], "0.42 0.5 0.54");
      txt(2, 10, 100, y, row[1]);
      y -= 14;
    });
    y -= 8;
  }
  let points = [];
  try {
    points = profileFor(d) || [];
  } catch {
    points = [];
  }
  if (points.length >= 2 && y > 150) {
    txt(2, 11, 36, y, "Profilo", "0.04 0.42 0.45");
    y -= 78;
    const chartY = y;
    const chartH = 64;
    const chartW = 520;
    fill("0.90 0.97 0.98", 36, chartY, chartW, chartH);
    const sorted = [...points].sort((a, b) => Number(a.t) - Number(b.t));
    const maxT = Math.max(1, ...sorted.map((p) => Number(p.t) || 0));
    const maxD = Math.max(1, ...sorted.map((p) => Number(p.d) || 0));
    const path = sorted.map((p, index) => {
      const x = 36 + ((Number(p.t) || 0) / maxT) * chartW;
      const py = chartY + chartH - ((Number(p.d) || 0) / maxD) * (chartH - 8) - 4;
      return `${pdfNum(x)} ${pdfNum(py)} ${index ? "l" : "m"}`;
    });
    ops.push(`0.03 0.45 0.5 RG 1.4 w ${path.join(" ")} S`);
    txt(1, 8, 40, chartY + 4, `0–${Math.round(maxD)} m`, "0.35 0.48 0.52");
    y -= 16;
  }
  const notes = String(d.notes || "").trim();
  if (notes && y > 80) {
    txt(2, 11, 36, y, "Note", "0.04 0.42 0.45");
    y -= 14;
    pdfWrap(notes, 92).slice(0, 4).forEach((line) => {
      if (y < 48) return;
      txt(1, 10, 36, y, line, "0.15 0.22 0.26");
      y -= 13;
    });
  }
  txt(1, 8, 36, 28, "SeaDive LogBook · scheda dell'immersione", "0.45 0.52 0.56");
  return pdfFile(ops.join("\n"));
}

function saveBlobFile(blob, filename) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function downloadDivePdf(d) {
  saveBlobFile(buildDivePdf(d), divePdfName(d));
}

function parseSharedPayload(text) {
  const clean = String(text || "").replace(/^\uFEFF/, "").trim();
  const tryParse = (raw) => {
    const data = JSON.parse(raw);
    if (data?.kind === "person-follow") {
      const err = new Error("Questo file è un contatto: contiene nome, cognome, brevetto e firma. Aprilo con Ricevi contatto.");
      err.code = "person-follow";
      throw err;
    }
    if (data?.kind === "dive-share" && data.dive && typeof data.dive === "object") return data;
    if (data?.dive && typeof data.dive === "object" && (data.app === "seadive-logbook" || data.site || data.dive.site)) return data;
    return null;
  };
  try {
    const direct = tryParse(clean);
    if (direct) return direct;
  } catch (err) {
    if (err?.code === "person-follow") throw err;
    /* il telefono a volte aggiunge testo intorno al file */
  }
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const wrapped = tryParse(clean.slice(start, end + 1));
      if (wrapped) return wrapped;
    } catch (err) {
      if (err?.code === "person-follow") throw err;
      /* testo intorno al file, ma il JSON interno non è una scheda */
    }
  }
  throw new Error("Questo file non è un'immersione condivisa. Scegli il file SeaDive appena condiviso.");
}

async function readSharedText(file) {
  try {
    const text = await file.text();
    if (String(text || "").trim()) return text;
  } catch {
    /* alcuni telefoni non espongono il testo diretto */
  }
  const buf = await file.arrayBuffer();
  return new TextDecoder("utf-8", { fatal: false }).decode(buf);
}

async function importSharedFile(file) {
  const data = parseSharedPayload(await readSharedText(file));
  const shareId = String(data.shareId || data.dive.shareId || "");
  const signed = keepSharedSigns(data.dive);
  if (shareId) {
    const already = (state.dives || []).find((d) => d.shareId === shareId);
    if (already) {
      already.buddySign = signed.buddySign;
      already.guideSign = signed.guideSign;
      already.centerSign = signed.centerSign;
      already.sigMeta = signed.sigMeta;
      save(state);
      return already;
    }
  }
  const dive = {
    ...emptyDive(),
    ...data.dive,
    id: uid(),
    shareId: shareId || uid(),
    number: nextNumber(),
    photo: "",
    buddySign: signed.buddySign,
    guideSign: signed.guideSign,
    centerSign: signed.centerSign,
    sigMeta: signed.sigMeta,
  };
  delete dive.hadDeco;
  ensureCircuit(dive);
  if (data.from?.name) upsertPerson({ role: "buddy", name: data.from.name, cert: data.from.cert || "" });
  linkPeopleOnDive(dive);
  state.dives.push(dive);
  save(state);
  return dive;
}

function personShareCard(person) {
  const names = personNames(person || {});
  const sign = personKnownSign(person);
  const body = {
    firstName: names.firstName,
    lastName: names.lastName,
    cert: String(person?.cert || "").trim(),
  };
  if (sign) body.sign = sign;
  const portrait = portraitImage(person?.portrait) || (samePersonName(names.name, state.profile?.name) ? profilePortraitImage() : "");
  if (portrait) body.portrait = portrait;
  return {
    app: "seadive-logbook",
    kind: "person-follow",
    version: 1,
    sharedAt: new Date().toISOString(),
    person: body,
  };
}

function myIdentityCard() {
  const names = personNames({ name: state.profile.name || "" });
  const sign = profileSignImage();
  const body = {
    firstName: names.firstName,
    lastName: names.lastName,
    cert: String(state.profile.certNumber || "").trim(),
  };
  if (sign) body.sign = sign;
  const portrait = profilePortraitImage();
  if (portrait) body.portrait = portrait;
  return body;
}

function withMyFollow(card) {
  const me = myIdentityCard();
  const mine = personNameKey([me.firstName, me.lastName].filter(Boolean).join(" "));
  const theirs = personNameKey([card.person.firstName, card.person.lastName].filter(Boolean).join(" "));
  if ((me.firstName || me.lastName) && mine !== theirs) card.me = me;
  return card;
}

async function sharePayloadFile(card, filename) {
  const blob = new Blob([JSON.stringify(card, null, 2)], { type: "text/plain" });
  const file = new File([blob], filename, { type: "text/plain" });
  try {
    if (navigator.share) {
      await navigator.share({ files: [file] });
      return true;
    }
  } catch (err) {
    if (err?.name === "AbortError") return false;
  }
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return true;
}

function contactFileName(person) {
  const names = personNames(person || {});
  const who = (names.lastName || names.firstName || "contatto")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24) || "contatto";
  return `seadive-contatto-${who}.json`;
}

async function sharePersonCard(person) {
  const card = withMyFollow(personShareCard(person));
  if (!card.person.firstName && !card.person.lastName && !card.person.cert) {
    alert("Scrivi nome e numero di brevetto, poi condividi.");
    return false;
  }
  return sharePayloadFile(card, contactFileName(person));
}

async function shareProfileContact(profile, sign) {
  const names = personNames({ name: profile?.name || "" });
  if (!names.firstName || !names.lastName) return { error: "name" };
  const cert = String(profile?.certNumber || "").trim();
  if (!cert) return { error: "cert" };
  const image = typeof sign === "string" && sign.startsWith("data:image") ? sign : "";
  if (!image) return { error: "sign" };
  const shrunk = await shrinkSign(image);
  const body = {
    firstName: names.firstName,
    lastName: names.lastName,
    cert,
  };
  const level = String(profile?.certLevel || "").trim();
  if (level) body.level = level;
  body.sign = shrunk || image;
  const portrait = await shrinkPortrait(profile?.portrait || profilePortraitImage(), 160, 7000);
  if (portrait) body.portrait = portrait;
  const card = {
    app: "seadive-logbook",
    kind: "person-follow",
    version: 1,
    sharedAt: new Date().toISOString(),
    person: body,
  };
  const filename = contactFileName({ name: names.name });
  const blob = new Blob([JSON.stringify(card, null, 2)], { type: "text/plain" });
  const file = new File([blob], filename, { type: "text/plain" });
  const text = `Contatto SeaDive di ${names.name}. In Community tocca Ricevi contatto e scegli questo file: dentro ci sono nome, cognome, numero di brevetto, firma e foto.`;
  try {
    const payload = { files: [file], title: `Contatto ${names.name}`, text };
    if (navigator.canShare?.(payload) || navigator.share) {
      await navigator.share(payload);
      return { ok: true, how: "shared" };
    }
  } catch (err) {
    if (err?.name === "AbortError") return { ok: false, how: "abort" };
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
  return { ok: true, how: "download" };
}

async function shareFollowCard() {
  const card = withMyFollow(personShareCard({
    name: state.profile.name || "",
    cert: state.profile.certNumber || "",
  }));
  if (!card.person.firstName && !card.person.lastName) {
    alert("Scrivi nome e cognome nel profilo, poi segui. Nel file vanno nome, cognome, brevetto e firma.");
    return false;
  }
  return sharePayloadFile(card, contactFileName({ name: state.profile.name || "", cert: state.profile.certNumber || "" }));
}

function splitContactName(full) {
  const name = String(full || "").trim().replace(/\s+/g, " ");
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "", name: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "", name };
  const particle = (token) => {
    const raw = token.toLowerCase();
    const bare = raw.replace(/['’]/g, "");
    return (
      bare === "di" || bare === "de" || bare === "del" || bare === "della" || bare === "dello" ||
      bare === "dei" || bare === "degli" || bare === "delle" || bare === "da" || bare === "dal" ||
      bare === "dallo" || bare === "dai" || bare === "dagli" || bare === "dalle" ||
      bare === "van" || bare === "von" || bare === "der" || bare === "den" || bare === "du" ||
      bare === "le" || bare === "la" || bare === "dos" || bare === "das" || bare === "ten" ||
      bare === "ter" || bare === "mc" || bare === "mac" || raw.startsWith("d'") || raw.startsWith("d’")
    );
  };
  for (let i = 1; i < parts.length; i++) {
    if (particle(parts[i])) {
      return { firstName: parts.slice(0, i).join(" "), lastName: parts.slice(i).join(" "), name };
    }
  }
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1], name };
  return { firstName: parts[0], lastName: parts.slice(1).join(" "), name };
}

function contactImageSign(value) {
  const sign = String(value || "").trim();
  if (/^data:image\/(png|jpe?g)\b/i.test(sign)) return sign;
  if (sign.startsWith("data:image/")) return sign;
  return "";
}

function isLogbookExport(data) {
  if (!data || typeof data !== "object") return false;
  if (data.kind === "person-follow" || data.kind === "dive-share") return false;
  if (data.app !== "seadive-logbook") return false;
  if (!data.profile || typeof data.profile !== "object") return false;
  if (data.dive && typeof data.dive === "object") return false;
  return true;
}

function contactFromLogbook(data) {
  const profile = data.profile;
  const full = String(profile.name || "").trim().replace(/\s+/g, " ");
  const hinted = Array.isArray(data.people)
    ? data.people.find((p) => {
        if (!p || p.role === "center") return false;
        const joined = String(p.name || [p.firstName, p.lastName].filter(Boolean).join(" ")).trim();
        return samePersonName(joined, full);
      })
    : null;
  const hintFirst = String(hinted?.firstName || "").trim();
  const hintLast = String(hinted?.lastName || "").trim();
  const hintJoin = [hintFirst, hintLast].filter(Boolean).join(" ");
  const trustHint = Boolean(hintJoin && samePersonName(hintJoin, full) && (hintLast.includes(" ") || !hintFirst.includes(" ")));
  const names = trustHint ? { firstName: hintFirst, lastName: hintLast } : splitContactName(full);
  if (!names.firstName && !names.lastName) return null;
  const cert = String(profile.certNumber || profile.cert || "").trim();
  const level = String(profile.certLevel || profile.level || "").trim();
  const sign = contactImageSign(profile.sign) || contactImageSign(hinted?.sign);
  const card = {
    firstName: names.firstName,
    lastName: names.lastName,
    cert,
  };
  if (level) card.level = level;
  if (sign) card.sign = sign;
  const portrait = portraitImage(profile.portrait) || portraitImage(hinted?.portrait);
  if (portrait) card.portrait = portrait;
  return card;
}

function parseFollowPayload(text) {
  const clean = String(text || "").replace(/^\uFEFF/, "").trim();
  const readOne = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const sign = contactImageSign(raw.sign);
    let firstName = String(raw.firstName || "").trim();
    let lastName = String(raw.lastName || "").trim();
    if (!firstName && !lastName) {
      const split = splitContactName(raw.name || "");
      firstName = split.firstName;
      lastName = split.lastName;
    }
    const one = {
      firstName,
      lastName,
      cert: String(raw.cert || raw.certNumber || "").trim(),
    };
    const level = String(raw.level || raw.certLevel || "").trim();
    if (level) one.level = level;
    if (sign) one.sign = sign;
    const portrait = portraitImage(raw.portrait);
    if (portrait) one.portrait = portrait;
    if (!one.firstName && !one.lastName && !one.cert) return null;
    return one;
  };
  const read = (raw) => {
    let data = JSON.parse(raw);
    if (typeof data === "string") data = JSON.parse(data);
    if (data?.kind === "dive-share" || (data?.dive && typeof data.dive === "object")) {
      const err = new Error("Questo file è un'immersione. Si riceve solo con Ricevi immersione. Qui passano nome, cognome, brevetto e firma.");
      err.code = "dive-share";
      throw err;
    }
    if (isLogbookExport(data)) return contactFromLogbook(data);
    if (data?.kind !== "person-follow" || !data.person || typeof data.person !== "object") return null;
    const person = readOne(data.person);
    if (!person) return null;
    const me = readOne(data.me);
    if (me) person.me = me;
    return person;
  };
  const tryRaw = (raw) => {
    try {
      return read(raw);
    } catch (err) {
      if (err?.code === "dive-share") throw err;
      return null;
    }
  };
  let card = tryRaw(clean);
  if (!card) {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) card = tryRaw(clean.slice(start, end + 1));
  }
  if (!card || (!card.firstName && !card.lastName)) {
    throw new Error("Questo file non è un contatto SeaDive. Servono nome, cognome e numero di brevetto.");
  }
  return card;
}

function findFollowMatch(card) {
  const full = [card.firstName, card.lastName].filter(Boolean).join(" ").toLowerCase();
  return (state.people || []).find((p) => {
    if (p.role === "center") return false;
    if (card.cert && p.cert && p.cert.toLowerCase() === card.cert.toLowerCase()) return true;
    return full && personNames(p).name.toLowerCase() === full;
  }) || null;
}

async function importFollowFile(file) {
  const card = parseFollowPayload(await readSharedText(file));
  const main = storeFollowedPerson({ ...card, sharedFile: true }, "buddy");
  if (card.me) storeFollowedPerson({ ...card.me, sharedFile: true }, "buddy");
  save(state);
  return main;
}

function storeFollowedPerson(card, role) {
  const name = [card.firstName, card.lastName].filter(Boolean).join(" ");
  const existing = findFollowMatch(card);
  const online = Boolean(card.owner);
  const granted = !online || card.sharedFile || (card.followOut && card.followIn);
  const payload = {
    id: existing?.id,
    role: existing?.role || role || "buddy",
    name,
    firstName: card.firstName,
    lastName: card.lastName,
    following: online ? false : card.following !== false,
  };
  if (granted && card.cert) payload.cert = card.cert;
  if (granted && card.sign) payload.sign = card.sign;
  if (card.followOut === true) payload.followOut = true;
  if (card.followOut === false) payload.followOut = false;
  if (card.followIn === true) payload.followIn = true;
  if (card.followIn === false) payload.followIn = false;
  if (card.level) payload.level = card.level;
  if (card.owner) payload.remoteOwner = card.owner;
  if (card.portrait) payload.portrait = card.portrait;
  const before = existing ? { ...existing } : null;
  const person = upsertPerson(payload);
  if (before && person) applyPersonOntoDives(before, person);
  if (person) stampPersonSign(person);
  return { person, created: !existing, name, card };
}

const COMMUNITY_CLOUD = "https://getpantry.cloud/apiv1/pantry/196bbbae-f1bc-4c2f-a2ca-18dd96bbf5c0/basket/board";
const COMMUNITY_LINKS_CLOUD = "https://getpantry.cloud/apiv1/pantry/196bbbae-f1bc-4c2f-a2ca-18dd96bbf5c0/basket/links";
const COMMUNITY_API = "profiles";
const COMMUNITY_LINKS = "links";
const COMMUNITY_MESSAGES = "messages";
const CHAT_ROOM = "sala";

function blankCommunityBoard() {
  return { profiles: {}, links: {}, messages: [] };
}

function boardFromPayload(data) {
  const board = blankCommunityBoard();
  if (!data || typeof data !== "object" || Array.isArray(data)) return board;
  if (data.profiles && typeof data.profiles === "object" && !Array.isArray(data.profiles)) board.profiles = data.profiles;
  if (data.links && typeof data.links === "object" && !Array.isArray(data.links)) board.links = data.links;
  if (Array.isArray(data.messages)) board.messages = data.messages.filter((row) => row && typeof row === "object");
  return board;
}

function applyCloudKey(board, key, value) {
  if (key.startsWith("p-")) board.profiles[key.slice(2)] = value;
  else if (key.startsWith("l-")) board.links[key.slice(2)] = value;
  else if (key.startsWith("m-")) {
    const id = value && value._id;
    board.messages = (board.messages || []).filter((row) => row._id !== id);
    board.messages.push(value);
    if (board.messages.length > 200) {
      board.messages.sort((a, b) => String(a.at || "").localeCompare(String(b.at || "")));
      board.messages = board.messages.slice(-200);
    }
  }
}

let communityBoardCache = { at: 0, data: null, flight: null };
let communityLoadGen = 0;
let cloudChain = Promise.resolve();
let followSaveBusy = false;

function enqueueCloud(task) {
  const job = cloudChain.then(task, task);
  cloudChain = job.then(() => {}, () => {});
  return job;
}

async function loadCommunityBoard(maxAge = 20000) {
  if (communityBoardCache.data && Date.now() - communityBoardCache.at < maxAge) return communityBoardCache.data;
  if (maxAge !== 0 && communityBoardCache.flight) return communityBoardCache.flight;
  const gen = ++communityLoadGen;
  const boardUrl = `${COMMUNITY_CLOUD}?t=${Date.now()}`;
  const flight = fetch(boardUrl, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  })
    .then(async (res) => {
      if (res.status === 400 || res.status === 404) {
        if (communityBoardCache.data && Object.keys(communityBoardCache.data.profiles || {}).length) return communityBoardCache.data;
        throw new Error("network");
      }
      if (!res.ok) throw new Error("network");
      const board = boardFromPayload(await res.json());
      if (gen === communityLoadGen) communityBoardCache = { at: Date.now(), data: board, flight: null };
      return board;
    })
    .catch((err) => {
      if (communityBoardCache.flight === flight) communityBoardCache.flight = null;
      throw err;
    });
  communityBoardCache.flight = flight;
  return flight;
}

async function postCommunityBoard(next) {
  const body = JSON.stringify({ v: 1, profiles: next.profiles, links: next.links, messages: next.messages });
  if (body.length > 1400000) throw new Error("network");
  const res = await fetch(COMMUNITY_CLOUD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) throw new Error("network");
  communityLoadGen += 1;
  communityBoardCache = { at: Date.now(), data: next, flight: null };
}

async function cloudSet(key, value) {
  return enqueueCloud(async () => {
    let lastErr = new Error("network");
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const board = await loadCommunityBoard(0);
        const next = boardFromPayload(JSON.parse(JSON.stringify(board)));
        applyCloudKey(next, key, value);
        const prevProfiles = Object.keys(board.profiles || {}).length;
        if (prevProfiles && !Object.keys(next.profiles || {}).length) throw new Error("network");
        await postCommunityBoard(next);
        return;
      } catch (err) {
        lastErr = err;
        communityBoardCache = { at: 0, data: null, flight: null };
      }
    }
    throw lastErr;
  });
}

let linkBasketCache = { at: 0, data: null, flight: null };
let linkLoadGen = 0;

function linkMapFromPayload(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const src = data.links && typeof data.links === "object" && !Array.isArray(data.links) ? data.links : data;
  const out = {};
  Object.entries(src).forEach(([key, value]) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    if (key === "v" || key === "_metadata" || key === "links") return;
    const pair = String(value.pair || key);
    if (!pair || pair === "v") return;
    out[pair] = value;
  });
  return out;
}

async function loadLinkBasket(maxAge = 20000) {
  if (linkBasketCache.data && Date.now() - linkBasketCache.at < maxAge) return linkBasketCache.data;
  if (maxAge !== 0 && linkBasketCache.flight) return linkBasketCache.flight;
  const gen = ++linkLoadGen;
  const flight = fetch(`${COMMUNITY_LINKS_CLOUD}?t=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  })
    .then(async (res) => {
      if (res.status === 400 || res.status === 404) return {};
      if (!res.ok) throw new Error("network");
      const map = linkMapFromPayload(await res.json());
      if (gen === linkLoadGen) linkBasketCache = { at: Date.now(), data: map, flight: null };
      return map;
    })
    .catch((err) => {
      if (linkBasketCache.flight === flight) linkBasketCache.flight = null;
      throw err;
    });
  linkBasketCache.flight = flight;
  return flight;
}

async function loadMergedLinks(fresh) {
  const board = await loadCommunityBoard(fresh ? 0 : 20000);
  let basket = {};
  try {
    basket = await loadLinkBasket(fresh ? 0 : 20000);
  } catch {
    basket = linkBasketCache.data || {};
  }
  return { ...(board.links || {}), ...(basket || {}) };
}

async function postLinkBasket(map) {
  const body = JSON.stringify({ v: 1, links: map });
  const res = await fetch(COMMUNITY_LINKS_CLOUD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) throw new Error("network");
  linkLoadGen += 1;
  linkBasketCache = { at: Date.now(), data: map, flight: null };
}

function fitCloudProfile(body) {
  const size = () => JSON.stringify(body).length;
  if (size() > 80000) delete body.portrait;
  if (size() > 80000) delete body.sign;
  return body;
}

function communityWords(name) {
  return personNameKey(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 2);
}

function communityKey(name) {
  const words = communityWords(name).slice().sort();
  if (words.length < 2) return "";
  return words.join("-").slice(0, 80);
}

function communityCardFromRow(data) {
  const firstName = String(data?.firstName || "").trim();
  const lastName = String(data?.lastName || "").trim();
  const cert = String(data?.cert || "").trim();
  const level = String(data?.level || "").trim();
  if (!firstName || !lastName) return null;
  const card = {
    firstName,
    lastName,
    cert,
    owner: String(data?.owner || ""),
    id: String(data?._id || ""),
  };
  if (level) card.level = level;
  if (typeof data?.sign === "string" && data.sign.startsWith("data:image")) card.sign = data.sign;
  const portrait = portraitImage(data?.portrait);
  if (portrait) card.portrait = portrait;
  return card;
}

async function profileOwnerKey() {
  const sub = String(loadSession()?.sub || "");
  if (sub && crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`seadive|${sub}`));
    return Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("").slice(0, 32);
  }
  const stored = localStorage.getItem("seadive-community-owner");
  if (stored) return stored;
  const id = uid().replace(/-/g, "");
  localStorage.setItem("seadive-community-owner", id);
  return id;
}

function trimSign(dataUrl) {
  return new Promise((resolve) => {
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image")) return resolve(dataUrl || "");
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return resolve(dataUrl);
      const src = document.createElement("canvas");
      src.width = w;
      src.height = h;
      const ctx = src.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      let pixels;
      try {
        pixels = ctx.getImageData(0, 0, w, h).data;
      } catch {
        return resolve(dataUrl);
      }
      let minX = w;
      let minY = h;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (pixels[i + 3] < 24) continue;
          if (pixels[i] > 242 && pixels[i + 1] > 242 && pixels[i + 2] > 242) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (maxX < 0) return resolve("");
      const padX = Math.max(12, Math.round(w * 0.02));
      const padY = Math.max(6, Math.round(h * 0.015));
      minX = Math.max(0, minX - padX);
      minY = Math.max(0, minY - padY);
      maxX = Math.min(w - 1, maxX + padX);
      maxY = Math.min(h - 1, maxY + padY);
      const cw = maxX - minX + 1;
      const ch = maxY - minY + 1;
      if (cw > w * 0.92 && ch > h * 0.92) return resolve(dataUrl);
      const out = document.createElement("canvas");
      out.width = cw;
      out.height = ch;
      const octx = out.getContext("2d");
      octx.drawImage(src, minX, minY, cw, ch, 0, 0, cw, ch);
      const cut = octx.getImageData(0, 0, cw, ch);
      for (let i = 0; i < cut.data.length; i += 4) {
        if (cut.data[i] > 242 && cut.data[i + 1] > 242 && cut.data[i + 2] > 242) cut.data[i + 3] = 0;
      }
      octx.putImageData(cut, 0, 0);
      resolve(out.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function shrinkSign(dataUrl) {
  return new Promise((resolve) => {
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image")) return resolve("");
    const img = new Image();
    img.onload = () => {
      const maxW = 420;
      const maxH = 140;
      const scale = Math.min(1, maxW / Math.max(img.width, 1), maxH / Math.max(img.height, 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let quality = 0.62;
      let out = canvas.toDataURL("image/jpeg", quality);
      while (out.length > 11000 && quality > 0.28) {
        quality -= 0.08;
        out = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(out.startsWith("data:image") && out.length <= 12000 ? out : "");
    };
    img.onerror = () => resolve("");
    img.src = dataUrl;
  });
}

function portraitImage(value) {
  const src = String(value || "").trim();
  return src.startsWith("data:image/") ? src : "";
}

function profilePortraitImage() {
  return portraitImage(state.profile?.portrait);
}

function personPortrait(person) {
  if (!person || person.role === "center") return "";
  const own = portraitImage(person.portrait);
  if (own) return own;
  if (samePersonName(person.name, state.profile?.name)) return profilePortraitImage();
  return "";
}

function avatarHtml(src, alt) {
  const photo = portraitImage(src);
  if (!photo) return "";
  return `<img class="people-avatar" alt="${escapeHtml(alt || "")}" src="${escapeHtml(photo)}" />`;
}

function shrinkPortrait(dataUrl, maxSide = 240, limit = 14000) {
  return new Promise((resolve) => {
    if (!portraitImage(dataUrl)) return resolve("");
    const img = new Image();
    img.onload = () => {
      const side = Math.max(img.width, img.height, 1);
      const size = Math.max(1, Math.min(maxSide, side));
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(size / Math.max(img.width, 1), size / Math.max(img.height, 1));
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
      let quality = 0.72;
      let out = canvas.toDataURL("image/jpeg", quality);
      while (out.length > limit && quality > 0.34) {
        quality -= 0.08;
        out = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(out.startsWith("data:image/") && out.length <= limit + 800 ? out : "");
    };
    img.onerror = () => resolve("");
    img.src = dataUrl;
  });
}

async function loadOnlineProfiles() {
  try {
    const board = await loadCommunityBoard();
    return {
      list: Object.values(board.profiles)
        .map((row) => {
          const card = communityCardFromRow(row);
          if (!card) return null;
          card.key = String(row?.key || "");
          return card;
        })
        .filter(Boolean),
    };
  } catch (err) {
    return { error: err?.message === "verify" ? "verify" : "network" };
  }
}

let seaDirectory = { at: 0, list: [], error: "", loading: false };

function peopleSearchWords(query) {
  return String(query || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 1);
}

function applyPeopleSearch(root) {
  if (!root) return;
  const words = peopleSearchWords(root.querySelector("[data-find]")?.value || "");
  const match = (hay) => {
    if (!words.length) return true;
    const text = String(hay || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return words.every((word) => text.includes(word));
  };
  const show = (el, on) => {
    if (el) el.style.display = on ? "" : "none";
  };
  let seaShown = 0;
  root.querySelectorAll("[data-sea] [data-q]").forEach((row) => {
    const self = row.hasAttribute("data-self");
    const ok = self || match(row.getAttribute("data-q") || "");
    show(row, ok);
    if (ok && !self) seaShown += 1;
  });
  let localShown = 0;
  root.querySelectorAll("[data-list] [data-q]").forEach((row) => {
    const ok = match(row.getAttribute("data-q") || "");
    show(row, ok);
    if (ok) localShown += 1;
  });
  const seaWait = root.querySelector("[data-sea-wait]");
  const others = root.querySelectorAll("[data-sea] [data-q]:not([data-self])").length;
  if (seaWait) {
    if (!seaDirectory.at && seaDirectory.loading) {
      show(seaWait, true);
      seaWait.textContent = "Carico chi usa SeaDive…";
    } else if (seaDirectory.error && !others) {
      show(seaWait, true);
      seaWait.textContent = "Elenco non raggiungibile. Riprova tra poco.";
    } else if (words.length && !seaShown) {
      show(seaWait, true);
      seaWait.textContent = "Nessuno con questo nome. L'altra persona deve aprire SeaDive con nome e cognome nel profilo.";
    } else if (!others) {
      show(seaWait, true);
      seaWait.textContent = "Ancora nessun altro profilo. Chi ha già l'app deve aprirla una volta: con nome e cognome compare qui.";
    } else {
      show(seaWait, false);
    }
  }
  const localWait = root.querySelector("[data-list-wait]");
  const localTotal = root.querySelectorAll("[data-list] [data-q]").length;
  if (localWait) {
    if (!localTotal) {
      show(localWait, true);
      localWait.textContent = "Nessuno ancora. Aggiungi un buddy, un istruttore o un diving, oppure salva un'immersione con il loro nome.";
    } else if (!localShown) {
      show(localWait, true);
      localWait.textContent = "Nessuno con questo filtro.";
    } else {
      show(localWait, false);
    }
  }
}

function localSeaPerson(card) {
  const who = `${card.firstName || ""} ${card.lastName || ""}`.trim();
  return (state.people || []).find(
    (p) => p.role !== "center" && (card.owner && p.remoteOwner === card.owner || (who && samePersonName(p.name, who)))
  );
}

async function refreshSeaDirectory() {
  if (seaDirectory.loading) return seaDirectory;
  seaDirectory.loading = true;
  try {
    const loaded = await loadOnlineProfiles();
    const mine = await profileOwnerKey().catch(() => "");
    if (loaded.error) {
      seaDirectory.error = loaded.error;
      if (!seaDirectory.at) seaDirectory.at = Date.now();
    } else {
      seaDirectory.list = loaded.list.filter((card) => card.owner && card.owner !== mine);
      seaDirectory.error = "";
      seaDirectory.at = Date.now();
    }
    return seaDirectory;
  } finally {
    seaDirectory.loading = false;
  }
}

function rememberMutualProfile(person, cardHit, mutual) {
  const who = [cardHit.firstName, cardHit.lastName].filter(Boolean).join(" ") || person?.name || "";
  const payload = {
    id: person?.id,
    role: person?.role || "buddy",
    name: who,
    firstName: cardHit.firstName || person?.firstName,
    lastName: cardHit.lastName || person?.lastName,
    level: cardHit.level || person?.level,
    remoteOwner: cardHit.owner || person?.remoteOwner,
    followOut: true,
    followIn: mutual,
    followRev: Date.now(),
    portrait: cardHit.portrait || person?.portrait || "",
  };
  const cert = String(cardHit.cert || person?.cert || "").trim();
  const sign = cardHit.sign || person?.sign || "";
  if (cert) payload.cert = cert;
  if (typeof sign === "string" && sign.startsWith("data:image")) payload.sign = sign;
  const saved = upsertPerson(payload);
  if (saved) stampPersonSign(saved);
  return saved;
}

async function connectSeaPerson(cardHit, chat) {
  followSaveBusy = true;
  try {
    const stored = insertOnlineProfile(cardHit);
    const person = stored.person;
    if (chat && person) {
      save(state);
      view.peopleHint = "";
      openMainChat();
      return;
    }
    const alreadyIn = Boolean((state.people || []).find((p) => cardHit.owner && p.remoteOwner === cardHit.owner)?.followIn);
    rememberMutualProfile(person, cardHit, alreadyIn);
    save(state);
    silentDrivePush();
    const res = await setMyFollow(cardHit, true);
    const who = stored.name || [cardHit.firstName, cardHit.lastName].filter(Boolean).join(" ");
    if (res.error === "self") {
      view.peopleHint = "Questo profilo non si può seguire ancora. L'altra persona deve riaprire l'app aggiornata.";
      render();
      return;
    }
    const mutual = !res.error && (Boolean(res.followIn) || alreadyIn);
    if (!res.error) {
      rememberMutualProfile(person, cardHit, mutual);
      save(state);
      silentDrivePush();
      if (mutual) publishMyProfile().catch(() => {});
    }
    view.peopleHint = res.error
      ? `Segui ${who}. Nome, cognome, brevetto e firma sono sul tuo Drive. Il collegamento cloud riprova tra poco.`
      : `Segui ${who}. Nome, cognome, numero di brevetto e firma sono sul tuo Drive e nella nuova immersione.`;
    await silentDrivePush();
    render();
  } catch {
    await silentDrivePush().catch(() => {});
    view.peopleHint = "Seguito non registrato. Riprova tra poco.";
    render();
  } finally {
    setTimeout(() => { followSaveBusy = false; }, 800);
  }
}

async function disconnectSeaPerson(cardHit) {
  followSaveBusy = true;
  try {
    const person = localSeaPerson(cardHit);
    const res = await setMyFollow({ ...cardHit, remoteOwner: cardHit.owner }, false);
    if (res.error) {
      view.peopleHint = "Non sono riuscito a togliere il seguito. Riprova tra poco.";
      render();
      return;
    }
    const who = [cardHit.firstName, cardHit.lastName].filter(Boolean).join(" ") || person?.name || "Questo profilo";
    if (person) {
      const saved = upsertPerson({
        id: person.id,
        role: person.role,
        name: person.name,
        firstName: person.firstName,
        lastName: person.lastName,
        remoteOwner: person.remoteOwner || cardHit.owner,
        followOut: false,
        followIn: Boolean(res.followIn),
        followRev: Date.now(),
      });
      if (saved) {
        saved.cert = "";
        saved.sign = "";
        saved.following = Boolean(saved.followOut && saved.followIn);
      }
    }
    save(state);
    await silentDrivePush();
    view.personId = null;
    view.peopleHint = `${who} non è più tra i contatti. Lo ritrovi con Cerca chi usa SeaDive.`;
    render();
  } catch {
    view.peopleHint = "Non sono riuscito a togliere il seguito. Riprova tra poco.";
    render();
  } finally {
    followSaveBusy = false;
  }
}

async function findOnlineProfiles(query) {
  const words = communityWords(query);
  if (words.join("").length < 3) return { error: "short" };
  const loaded = await loadOnlineProfiles();
  if (loaded.error) return loaded;
  const hits = loaded.list.filter((card) => {
    const hay = communityWords(`${card.firstName} ${card.lastName}`);
    return words.every((word) => hay.some((part) => part === word || part.startsWith(word)));
  });
  if (!hits.length) return { error: "missing" };
  return { hits };
}

async function readCommunityCard(name) {
  const found = await findOnlineProfiles(name);
  if (found.error) return found;
  if (found.hits.length !== 1) return { error: "missing" };
  return { card: found.hits[0] };
}

async function publishMyProfile() {
  const names = personNames({ name: state.profile?.name || "" });
  const key = communityKey(names.name);
  if (!key || !names.firstName || !names.lastName) return { error: "short" };
  const owner = await profileOwnerKey();
  const loaded = await loadOnlineProfiles();
  if (loaded.error) return loaded;
  const current = loaded.list.find((card) => card.key === key) || null;
  if (current?.owner && current.owner !== owner) return { error: "taken" };
  const sign = await shrinkSign(profileSignImage());
  const body = {
    key,
    firstName: names.firstName,
    lastName: names.lastName,
    cert: String(state.profile?.certNumber || "").trim(),
    level: String(state.profile?.certLevel || "").trim(),
    owner,
    at: new Date().toISOString(),
  };
  if (sign) body.sign = sign;
  let portrait = await shrinkPortrait(profilePortraitImage(), 96, 3500);
  if (portrait) body.portrait = portrait;
  body.id = owner;
  fitCloudProfile(body);
  try {
    await cloudSet(`p-${owner}`, body);
    return { ok: true, name: names.name };
  } catch (err) {
    return { error: err?.message === "verify" ? "verify" : "network" };
  }
}

let profileOnlineStatus = "";

function queueProfilePublish() {
  if (queueProfilePublish.busy || profileOnlineStatus === "online") return;
  queueProfilePublish.busy = true;
  publishMyProfile()
    .then((res) => {
      const next = res?.ok ? "online" : res?.error || "";
      const became = next === "online" && profileOnlineStatus !== "online";
      profileOnlineStatus = next;
      if (view.name === "profile" || (became && view.name === "people" && !view.personId)) render();
    })
    .catch(() => {})
    .finally(() => {
      queueProfilePublish.busy = false;
    });
}

let chatTimer = 0;
let communitySyncStamp = 0;
const linkedPairs = new Set();

function stopChatPoll() {
  if (chatTimer) clearInterval(chatTimer);
  chatTimer = 0;
}

const chatPending = new Map();
const chatSeen = new Set();
let chatNoticeReady = false;

function askChatNotice() {
  if (!("Notification" in window) || Notification.permission !== "default") return;
  Notification.requestPermission().catch(() => {});
}

function chatUnreadTotal() {
  let n = 0;
  chatPending.forEach((value) => {
    n += value;
  });
  return n;
}

function paintChatBadge() {
  const label = document.querySelector("[data-chatnav] small");
  if (!label) return;
  const n = chatUnreadTotal();
  label.textContent = n > 0 ? "Community " + n : "Community";
}

function openMainChat(roomKey) {
  view.chatRoom = String(roomKey || "");
  if (view.chatRoom) chatPending.delete(view.chatRoom);
  else chatPending.clear();
  paintChatBadge();
  view.name = "chat";
  view.chatPersonId = null;
  view.personId = null;
  view.peopleHint = "";
  render();
}

function openChatFromOwner(from) {
  view.chatFocus = String(from || "");
  openMainChat("");
}

function mutualAdj(links) {
  const adj = new Map();
  const touch = (id) => {
    const key = String(id || "");
    if (!adj.has(key)) adj.set(key, new Set());
    return adj.get(key);
  };
  Object.values(links || {}).forEach((row) => {
    if (!row?.left || !row?.right || row.left === row.right) return;
    if (!row.leftFollows || !row.rightFollows) return;
    touch(row.left).add(String(row.right));
    touch(row.right).add(String(row.left));
  });
  return adj;
}

function roomKey(members) {
  return [...members].filter(Boolean).sort().join("~");
}

function expandCommonRoom(adj, seed) {
  const members = new Set(seed);
  let grew = true;
  while (grew) {
    grew = false;
    const counts = new Map();
    members.forEach((id) => {
      (adj.get(id) || []).forEach((next) => {
        if (members.has(next)) return;
        counts.set(next, (counts.get(next) || 0) + 1);
      });
    });
    counts.forEach((n, id) => {
      if (n >= 2) {
        members.add(id);
        grew = true;
      }
    });
  }
  return members;
}

function mergeChatRooms(adj, rooms) {
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < rooms.length; i += 1) {
      for (let j = i + 1; j < rooms.length; j += 1) {
        let shared = 0;
        rooms[j].members.forEach((id) => {
          if (rooms[i].members.has(id)) shared += 1;
        });
        if (shared < 2) continue;
        rooms[j].members.forEach((id) => rooms[i].members.add(id));
        expandCommonRoom(adj, rooms[i].members).forEach((id) => rooms[i].members.add(id));
        rooms[i].key = roomKey(rooms[i].members);
        rooms.splice(j, 1);
        merged = true;
        break;
      }
      if (merged) break;
    }
  }
  return rooms;
}

function chatRooms(mine, links) {
  const me = String(mine || "");
  if (!me) return [];
  const adj = mutualAdj(links);
  const friends = [...(adj.get(me) || [])];
  if (!friends.length) return [];
  const rooms = [];
  friends.forEach((other) => {
    const members = new Set([me, other]);
    (adj.get(me) || []).forEach((id) => {
      if (id !== other && (adj.get(other) || new Set()).has(id)) members.add(id);
    });
    expandCommonRoom(adj, members).forEach((id) => members.add(id));
    if (members.size < 2) return;
    const key = roomKey(members);
    if (rooms.some((room) => room.key === key)) return;
    rooms.push({ key, members });
  });
  return mergeChatRooms(adj, rooms).sort((a, b) => b.members.size - a.members.size || a.key.localeCompare(b.key));
}

function pickChatRoom(rooms, key, focus) {
  if (!rooms.length) return null;
  const exact = key ? rooms.find((room) => room.key === key) : null;
  if (exact) return exact;
  const wanted = new Set(String(focus || key || "").split("~").filter(Boolean));
  if (wanted.size) {
    let best = null;
    let score = 0;
    rooms.forEach((room) => {
      let n = 0;
      wanted.forEach((id) => {
        if (room.members.has(id)) n += 1;
      });
      if (n > score) {
        score = n;
        best = room;
      }
    });
    if (best && score > 0) return best;
  }
  return rooms.length === 1 ? rooms[0] : null;
}

function messageInRoom(row, room, rooms) {
  if (!row || !room) return false;
  const from = String(row.from || "");
  if (!from || !room.members.has(from)) return false;
  const ids = String(row.with || "").split("~").filter(Boolean);
  if (ids.length) return ids.every((id) => room.members.has(id));
  if (String(row.thread || "") !== CHAT_ROOM) return false;
  const homes = (rooms || []).filter((item) => item.members.has(from));
  return homes.length === 1 && homes[0].key === room.key;
}

function chatInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0] || "?").slice(0, 1) + (parts[1] || "").slice(0, 1)).toUpperCase();
}

function chatMembers(mine, circle, links, profiles) {
  const byOwner = new Map((profiles || []).filter((card) => card.owner).map((card) => [card.owner, card]));
  const nameOf = (id) => {
    if (id === mine) return personNames({ name: state.profile?.name || "" }).name || "Tu";
    const card = byOwner.get(id);
    const remote = card ? [card.firstName, card.lastName].filter(Boolean).join(" ") : "";
    if (remote) return remote;
    const local = (state.people || []).find((p) => p.remoteOwner === id);
    if (local?.name) return local.name;
    for (const row of Object.values(links || {})) {
      if (row?.left === id && row.leftName) return String(row.leftName);
      if (row?.right === id && row.rightName) return String(row.rightName);
    }
    return "Subacqueo";
  };
  const portraitOf = (id) => {
    if (id === mine) return profilePortraitImage();
    const card = byOwner.get(id);
    if (card?.portrait) return card.portrait;
    const local = (state.people || []).find((p) => p.remoteOwner === id);
    return personPortrait(local);
  };
  return [...circle]
    .map((id) => ({ id, name: nameOf(id), portrait: portraitOf(id), self: id === mine }))
    .sort((a, b) => (a.self === b.self ? a.name.localeCompare(b.name, "it") : a.self ? -1 : 1));
}

function chatRoomLabel(room, mine, links, profiles) {
  const names = chatMembers(mine, room.members, links, profiles)
    .filter((person) => !person.self)
    .map((person) => person.name);
  if (!names.length) return "Chat di chi si segue";
  if (names.length === 1) return "Chat con " + names[0];
  if (names.length === 2) return "Chat con " + names[0] + " e " + names[1];
  if (names.length === 3) return "Chat con " + names[0] + ", " + names[1] + " e " + names[2];
  return "Chat con " + names[0] + ", " + names[1] + " e altri " + (names.length - 2);
}

function paintCommunityChats(card) {
  const box = card?.querySelector?.("[data-chatlist]");
  if (!box) return;
  const token = (paintCommunityChats.token = (paintCommunityChats.token || 0) + 1);
  profileOwnerKey().then(async (mine) => {
    if (!box.isConnected || token !== paintCommunityChats.token) return;
    let links = {};
    try {
      links = await loadMergedLinks(false);
    } catch {
      return;
    }
    if (!box.isConnected || token !== paintCommunityChats.token) return;
    let profiles = [];
    try {
      profiles = (await loadOnlineProfiles()).list || [];
    } catch {
      profiles = [];
    }
    if (!box.isConnected || token !== paintCommunityChats.token) return;
    const rooms = chatRooms(mine, links);
    box.replaceChildren();
    const make = (title, key) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-entry";
      const pending = key ? chatPending.get(key) || 0 : chatUnreadTotal();
      button.textContent = pending ? title + " · " + pending : title;
      button.onclick = () => {
        askChatNotice();
        openMainChat(key || "");
      };
      return button;
    };
    if (!rooms.length) {
      box.append(make("Chat di chi si segue", ""));
      return;
    }
    rooms.forEach((room) => box.append(make(chatRoomLabel(room, mine, links, profiles), room.key)));
  }).catch(() => {});
}

async function showChatNotice(title, body, from) {
  const key = from + "\n" + body;
  if (showChatNotice.recent?.has(key)) return;
  if (!showChatNotice.recent) showChatNotice.recent = new Set();
  showChatNotice.recent.add(key);
  setTimeout(() => showChatNotice.recent.delete(key), 20000);
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const options = {
    body,
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: "seadive-chat-" + from,
    renotify: true,
    data: { owner: from },
  };
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.showNotification) {
      await reg.showNotification(title || "SeaDive", options);
      return;
    }
  } catch {
    /* notifica diretta */
  }
  const note = new Notification(title || "SeaDive", options);
  note.onclick = () => openChatFromOwner(from);
}

async function watchChatNotices() {
  if (!loadSession()) return;
  let rows = [];
  try {
    rows = await crudList(COMMUNITY_MESSAGES);
  } catch {
    return;
  }
  const mine = await profileOwnerKey();
  let rooms = [];
  try {
    rooms = chatRooms(mine, await loadMergedLinks(false));
  } catch {
    return;
  }
  const since = localStorage.getItem("seadive-chat-seen-at") || "";
  const firstOpen = !chatNoticeReady && !since;
  for (const row of rows) {
    const id = String(row._id || "");
    if (!id || chatSeen.has(id)) continue;
    chatSeen.add(id);
    const text = String(row.text || "").trim();
    const from = String(row.from || "");
    const at = String(row.at || "");
    const room = rooms.find((item) => messageInRoom(row, item, rooms));
    if (!room || !text || !from || from === mine) continue;
    if (firstOpen || (since && at <= since)) continue;
    const looking = view.name === "chat" && document.visibilityState === "visible" && (!view.chatRoom || view.chatRoom === room.key);
    if (looking) {
      chatPending.delete(room.key);
      continue;
    }
    chatPending.set(room.key, (chatPending.get(room.key) || 0) + 1);
    paintChatBadge();
    paintCommunityChats(document.querySelector(".community-page"));
    const person = (state.people || []).find((p) => p.remoteOwner === from);
    const title = String(row.name || person?.name || "SeaDive").slice(0, 80);
    await showChatNotice(title, text.slice(0, 140), from);
  }
  chatNoticeReady = true;
  localStorage.setItem("seadive-chat-seen-at", new Date().toISOString());
}

function armChatNotices() {
  if (armChatNotices.started || !loadSession()) return;
  armChatNotices.started = true;
  watchChatNotices().catch(() => {});
  setInterval(() => {
    watchChatNotices().catch(() => {});
  }, 15000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") watchChatNotices().catch(() => {});
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "seadive-chat") openChatFromOwner(event.data.owner || "");
    });
  }
}

async function crudList(url, fresh) {
  if (url === COMMUNITY_LINKS) return Object.values(await loadMergedLinks(Boolean(fresh)));
  const board = await loadCommunityBoard(fresh ? 0 : 20000);
  if (url === COMMUNITY_MESSAGES) return board.messages || [];
  if (url === COMMUNITY_API) return Object.values(board.profiles || {});
  return [];
}

function chatPair(a, b) {
  return [String(a || ""), String(b || "")].filter(Boolean).sort().join("~");
}

async function ensureCommunityLink(mine, other) {
  const remote = String(other?.owner || "").trim();
  if (!mine || !remote || mine === remote) return { error: "self" };
  const pair = chatPair(mine, remote);
  if (linkedPairs.has(pair)) return { ok: true, pair };
  const me = personNames({ name: state.profile?.name || "" });
  const otherName = [other.firstName, other.lastName].filter(Boolean).join(" ") || String(other.name || "").trim();
  try {
    await enqueueCloud(async () => {
      const links = await loadMergedLinks(true);
      if (links[pair]) return;
      const leftIsMine = mine < remote;
      const body = {
        pair,
        left: leftIsMine ? mine : remote,
        right: leftIsMine ? remote : mine,
        leftName: (leftIsMine ? me.name : otherName).slice(0, 80),
        rightName: (leftIsMine ? otherName : me.name).slice(0, 80),
        leftCert: (leftIsMine ? String(state.profile?.certNumber || "") : String(other.cert || "")).slice(0, 40),
        rightCert: (leftIsMine ? String(other.cert || "") : String(state.profile?.certNumber || "")).slice(0, 40),
        leftFollows: false,
        rightFollows: false,
      };
      await postLinkBasket({ ...links, [pair]: body });
    });
  } catch (err) {
    return { error: err?.message === "verify" ? "verify" : "network" };
  }
  linkedPairs.add(pair);
  return { ok: true, pair };
}

function linkFollowFlags(row, mine) {
  if (!row || (row.left !== mine && row.right !== mine)) return { followOut: false, followIn: false };
  const followOut = row.left === mine ? Boolean(row.leftFollows) : Boolean(row.rightFollows);
  const followIn = row.left === mine ? Boolean(row.rightFollows) : Boolean(row.leftFollows);
  return { followOut, followIn };
}

function savedFollowOut(person, flags) {
  if (person?.followOut) return true;
  if (person && Number(person.followRev) > 0) return false;
  return Boolean(flags?.followOut);
}

async function setMyFollow(other, on) {
  const mine = await profileOwnerKey();
  const remote = String(other?.owner || other?.remoteOwner || "").trim();
  if (!mine || !remote || mine === remote) return { error: "self" };
  const pair = chatPair(mine, remote);
  const me = personNames({ name: state.profile?.name || "" });
  const otherName = [other.firstName, other.lastName].filter(Boolean).join(" ") || String(other.name || "").trim();
  try {
    const body = await enqueueCloud(async () => {
      const links = await loadMergedLinks(true);
      const current = links[pair] || null;
      const local = (state.people || []).find((p) => p.remoteOwner === remote);
      const left = current?.left || (mine < remote ? mine : remote);
      const right = current?.right || (left === mine ? remote : mine);
      const mineIsLeft = left === mine;
      const nextBody = {
        pair,
        left,
        right,
        leftName: String(current?.leftName || (mineIsLeft ? me.name : otherName)).slice(0, 80),
        rightName: String(current?.rightName || (mineIsLeft ? otherName : me.name)).slice(0, 80),
        leftCert: String(current?.leftCert || (mineIsLeft ? state.profile?.certNumber || "" : other.cert || "")).slice(0, 40),
        rightCert: String(current?.rightCert || (mineIsLeft ? other.cert || "" : state.profile?.certNumber || "")).slice(0, 40),
        leftFollows: Boolean(current?.leftFollows),
        rightFollows: Boolean(current?.rightFollows),
      };
      const theyFollow = Boolean(local?.followIn) || (mineIsLeft ? Boolean(current?.rightFollows) : Boolean(current?.leftFollows));
      if (theyFollow) {
        if (mineIsLeft) nextBody.rightFollows = true;
        else nextBody.leftFollows = true;
      }
      if (mineIsLeft) nextBody.leftFollows = Boolean(on);
      else nextBody.rightFollows = Boolean(on);
      if (nextBody.leftFollows && nextBody.rightFollows) {
        nextBody.leftCert = String(mineIsLeft ? state.profile?.certNumber || current?.leftCert || "" : other.cert || current?.leftCert || "").slice(0, 40);
        nextBody.rightCert = String(mineIsLeft ? other.cert || current?.rightCert || "" : state.profile?.certNumber || current?.rightCert || "").slice(0, 40);
      }
      await postLinkBasket({ ...links, [pair]: nextBody });
      return nextBody;
    });
    linkedPairs.add(pair);
    return { ok: true, ...linkFollowFlags(body, mine) };
  } catch (err) {
    return { error: err?.message === "verify" ? "verify" : "network" };
  }
}

async function syncIncomingLinks() {
  const mine = await profileOwnerKey();
  let changed = false;
  let links = [];
  try {
    links = await crudList(COMMUNITY_LINKS);
  } catch {
    links = [];
  }
  const fetchedAt = Number(communityBoardCache.at) || 0;
  const profiles = await loadOnlineProfiles();
  const cards = profiles.error ? [] : profiles.list;
  const cardByOwner = new Map(cards.filter((c) => c.owner).map((c) => [c.owner, c]));
  links.forEach((row) => {
    if (row.left !== mine && row.right !== mine) return;
    const remote = row.left === mine ? row.right : row.left;
    const remoteName = row.left === mine ? row.rightName : row.leftName;
    const remoteCert = row.left === mine ? row.rightCert : row.leftCert;
    if (!remote || !String(remoteName || "").trim()) return;
    const flags = linkFollowFlags(row, mine);
    const personEarly = (state.people || []).find((p) => p.remoteOwner === remote);
    const remoteLabel = String(remoteName || "").trim();
    if (personIsGone(personEarly || { role: "buddy", name: remoteLabel }, state.deletedPeople)) return;
    if (personEarly?.followOut && !flags.followOut) {
      if (flags.followIn && !personEarly.followIn) {
        personEarly.followIn = true;
        personEarly.following = true;
        changed = true;
      }
      setMyFollow(personEarly, true).catch(() => {});
      return;
    }
    const theyFollowedBack = Boolean(flags.followIn) && personEarly && !personEarly.followIn;
    if (!theyFollowedBack && personEarly && Number(personEarly.followRev) > fetchedAt) return;
    if (
      !theyFollowedBack &&
      personEarly &&
      Date.now() - Number(personEarly.followRev) < 20000 &&
      (Boolean(personEarly.followOut) !== flags.followOut || Boolean(personEarly.followIn) !== flags.followIn)
    ) return;
    const card = cardByOwner.get(remote) || null;
    const names = personNames({ name: card ? `${card.firstName} ${card.lastName}` : remoteName });
    const person = (state.people || []).find(
      (p) => p.remoteOwner === remote || (p.role !== "center" && samePersonName(p.name, names.name || remoteName))
    );
    const before = person ? `${person.followOut}|${person.followIn}|${person.following}|${person.cert}|${person.sign ? 1 : 0}` : "";
    const followOut = savedFollowOut(person, flags);
    const payload = {
      id: person?.id,
      role: person?.role && person.role !== "center" ? person.role : "buddy",
      name: names.name || remoteName,
      firstName: names.firstName,
      lastName: names.lastName,
      remoteOwner: remote,
      followOut,
      followIn: flags.followIn,
    };
    const mutual = followOut && flags.followIn;
    if (card?.portrait) payload.portrait = card.portrait;
    if (mutual) {
      const cert = card?.cert || remoteCert || "";
      if (cert) payload.cert = cert;
      if (card?.level) payload.level = card.level;
      if (card?.sign) payload.sign = card.sign;
      payload.followRev = Date.now();
    }
    const saved = upsertPerson(payload);
    const after = saved ? `${saved.followOut}|${saved.followIn}|${saved.following}|${saved.cert}|${saved.sign ? 1 : 0}` : "";
    if (!person || before !== after) {
      if (saved) saved.followRev = Date.now();
      if (mutual && saved) stampPersonSign(saved);
      changed = true;
    }
  });
  if (changed) save(state);
  return changed;
}

function renderChat() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("Chat"));
  const card = document.createElement("section");
  card.className = "card chat-screen";
  const back = () => {
    view.name = "people";
    view.chatPersonId = null;
    render();
  };
  card.innerHTML = `
    <h2 class="serif" style="margin:0">Chat</h2>
    <p class="hint">La chat è solo di chi è seguito in comune. Se due persone si seguono e seguono anche le stesse persone, la chat diventa una sola e la vedono tutti loro. Chi resta fuori non legge i messaggi. Quando scrivi, gli altri nella chat ricevono una notifica. Il diario non viene inviato.</p>
    <div class="chat-members" data-members></div>
    <div class="chat-list" data-rooms hidden></div>
    <p class="hint" data-gate>Carico chi è dentro…</p>
    <div class="chat-log" data-log hidden></div>
    <form class="chat-compose" hidden>
      <input name="text" maxlength="400" placeholder="Scrivi a chi è in questa chat" autocomplete="off" enterkeyhint="send" />
      <button class="btn primary" type="submit">Invia</button>
    </form>
    <p class="hint" data-chatstatus></p>
    <button class="btn ghost" type="button" data-back>Torna a Community</button>
  `;
  card.querySelector("[data-back]").onclick = back;
  const members = card.querySelector("[data-members]");
  const roomBox = card.querySelector("[data-rooms]");
  const gate = card.querySelector("[data-gate]");
  const log = card.querySelector("[data-log]");
  const status = card.querySelector("[data-chatstatus]");
  const form = card.querySelector("form");
  let owner = "";
  let active = null;
  let knownRooms = [];
  let stick = true;
  const paintMembers = (people) => {
    members.replaceChildren();
    people.forEach((person) => {
      const chip = document.createElement("div");
      chip.className = "chat-member";
      const photo = portraitImage(person.portrait);
      const face = document.createElement(photo ? "img" : "span");
      if (photo) {
        face.alt = "";
        face.src = photo;
      } else {
        face.textContent = chatInitials(person.self ? "Tu" : person.name);
      }
      const label = document.createElement("small");
      label.textContent = person.self ? "Tu" : person.name;
      chip.append(face, label);
      members.append(chip);
    });
  };
  const showRooms = (rooms, links, profiles) => {
    roomBox.hidden = rooms.length < 2;
    roomBox.replaceChildren();
    if (rooms.length < 2) return;
    rooms.forEach((room) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-entry" + (active && room.key === active.key ? " on" : "");
      button.textContent = chatRoomLabel(room, owner, links, profiles);
      button.onclick = () => {
        view.chatRoom = room.key;
        view.chatFocus = "";
        chatPending.delete(room.key);
        paintChatBadge();
        stick = true;
        pull();
      };
      roomBox.append(button);
    });
  };
  const draw = (rows) => {
    const near = log.scrollHeight - log.scrollTop - log.clientHeight < 90;
    log.replaceChildren();
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "hint";
      empty.textContent = "Nessun messaggio. Scrivi tu il primo.";
      log.append(empty);
      return;
    }
    rows.forEach((row) => {
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble" + (row.from === owner ? " mine" : "");
      if (row.from !== owner) {
        const who = document.createElement("strong");
        who.className = "chat-who";
        who.textContent = row.name || "Subacqueo";
        bubble.append(who);
      }
      const text = document.createElement("span");
      text.textContent = row.text;
      const time = document.createElement("time");
      const when = new Date(row.at);
      time.textContent = Number.isNaN(when.getTime())
        ? ""
        : when.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      bubble.append(text, time);
      log.append(bubble);
    });
    if (stick || near) log.scrollTop = log.scrollHeight;
    stick = false;
  };
  const pull = async () => {
    if (view.name !== "chat" || !log.isConnected || !owner) return;
    try {
      const [links, all, profiles] = await Promise.all([
        loadMergedLinks(true),
        crudList(COMMUNITY_MESSAGES, true),
        loadOnlineProfiles(),
      ]);
      if (!log.isConnected) return;
      knownRooms = chatRooms(owner, links);
      active = pickChatRoom(knownRooms, view.chatRoom, view.chatFocus);
      if (active) {
        view.chatRoom = active.key;
        chatPending.delete(active.key);
        paintChatBadge();
      }
      const open = Boolean(active && active.members.has(owner));
      const people = open ? chatMembers(owner, active.members, links, profiles.list || []) : [];
      paintMembers(people);
      showRooms(knownRooms, links, profiles.list || []);
      gate.hidden = open;
      log.hidden = !open;
      form.hidden = !open;
      if (!open) {
        gate.textContent = knownRooms.length
          ? "Scegli una chat. Ognuna riunisce solo le persone seguite in comune."
          : "Ancora fuori. Appena tu e un’altra persona vi seguite, la chat si apre. Se seguite le stesse persone, entrano anche loro.";
        return;
      }
      const rows = all
        .filter((row) => messageInRoom(row, active, knownRooms) && String(row.text || "").trim())
        .map((row) => {
          if (row._id) chatSeen.add(String(row._id));
          return {
            from: String(row.from || ""),
            name: String(row.name || "").slice(0, 80),
            text: String(row.text || "").slice(0, 400),
            at: String(row.at || ""),
          };
        })
        .sort((a, b) => a.at.localeCompare(b.at));
      draw(rows);
      status.textContent = "";
    } catch {
      if (status.isConnected) status.textContent = "Chat non raggiungibile. Riprovo.";
    }
  };
  form.onsubmit = async (e) => {
    e.preventDefault();
    const input = form.querySelector("[name=text]");
    const text = String(input.value || "").trim().slice(0, 400);
    if (!text || !owner || !active?.members.has(owner)) return;
    input.disabled = true;
    try {
      const links = await loadMergedLinks(true);
      knownRooms = chatRooms(owner, links);
      active = pickChatRoom(knownRooms, view.chatRoom, view.chatFocus);
      if (!active?.members.has(owner)) {
        status.textContent = "Sei uscito dalla chat: non vi seguite più.";
        await pull();
      } else {
        const sender = personNames({ name: state.profile?.name || "" }).name || "SeaDive";
        const msg = {
          _id: uid().replace(/-/g, ""),
          thread: active.key,
          with: active.key,
          from: owner,
          name: sender.slice(0, 80),
          text,
          at: new Date().toISOString(),
        };
        await cloudSet(`m-${msg._id}`, msg);
        input.value = "";
        stick = true;
        await pull();
      }
    } catch {
      status.textContent = "Messaggio non inviato. Riprova.";
    }
    input.disabled = false;
    input.focus();
  };
  profileOwnerKey().then((mine) => {
    if (!card.isConnected) return;
    owner = mine;
    pull();
    stopChatPoll();
    chatTimer = setInterval(pull, 15000);
  });
  frag.append(card);
  return frag;
}

function insertOnlineProfile(card) {
  return storeFollowedPerson(card, "buddy");
}

function profileShareLine(person, sign) {
  if (!person) return "";
  return [person.name, person.level, person.cert ? "brevetto " + person.cert : "", sign ? "firma inserita" : "manca la firma"]
    .filter(Boolean)
    .join(" · ");
}

async function adoptCommunityProfile(name) {
  const found = await readCommunityCard(name);
  if (!found.card) return found;
  const stored = storeFollowedPerson(found.card, "buddy");
  save(state);
  return { ...found, stored };
}

function communityMissText(error) {
  if (error === "short") return "Scrivi nome e cognome interi.";
  if (error === "network") return "Elenco profili non raggiungibile. Riprova tra poco.";
  return "Nessun profilo in rete con questo nominativo. L'altra persona deve aprire l'app aggiornata: online vanno nome, cognome, numero di brevetto, firma e foto del profilo.";
}

function scheduleCommunityPull(form) {
  clearTimeout(form._communityTimer);
  form._communityTimer = setTimeout(() => {
    pullCommunitySigns(form).catch(() => {});
  }, 700);
}

async function pullCommunitySigns(form) {
  if (!form?.isConnected) return;
  for (const [nameKey, role] of [
    ["buddyName", "buddy"],
    ["guideName", "guide"],
  ]) {
    const typed = form.querySelector(`[name=${nameKey}]`)?.value || "";
    if (communityWords(typed).join("").length < 3) continue;
    const local = personByTypedName(role, typed);
    if (local && diveContactReady(local)) continue;
    const found = await findOnlineProfiles(typed);
    if (found.hits?.length !== 1) continue;
    const card = found.hits[0];
    if (!form.isConnected) return;
    if ((form.querySelector(`[name=${nameKey}]`)?.value || "") !== typed) continue;
    const full = [card.firstName, card.lastName].filter(Boolean).join(" ");
    const line = form.querySelector("[data-pickedperson]");
    if (!line) continue;
    line.hidden = false;
    line.textContent = local
      ? followWaitText(local)
      : `${full} è su SeaDive. Seguitevi entrambi in Community per usare brevetto e firma.`;
  }
}

function backupFilename() {
  const day = new Date().toISOString().slice(0, 10);
  const who = (state.profile.name || "logbook")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "logbook";
  return `seadive-${who}-${day}.json`;
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(backupPayload(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = backupFilename();
  a.click();
  URL.revokeObjectURL(a.href);
  const meta = loadMeta();
  meta.lastBackup = new Date().toISOString();
  saveMeta(meta);
  render();
}

async function shareBackup() {
  const blob = new Blob([JSON.stringify(backupPayload(), null, 2)], { type: "application/json" });
  const file = new File([blob], backupFilename(), { type: "application/json" });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Backup SeaDive LogBook",
        text: "Il mio diario immersioni — tienilo su Drive / File / iCloud.",
      });
      const meta = loadMeta();
      meta.lastBackup = new Date().toISOString();
      saveMeta(meta);
      render();
      return;
    }
  } catch (err) {
    if (err?.name === "AbortError") return;
  }
  downloadBackup();
}

function daysSinceBackup() {
  const t = loadMeta().lastBackup;
  if (!t) return Infinity;
  return Math.floor((Date.now() - new Date(t).getTime()) / 86400000);
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  (async () => {
    try {
      const wanted = new URL("./sw.js", location.href);
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        regs
          .filter((reg) => {
            const href = (reg.active || reg.waiting || reg.installing || {}).scriptURL || "";
            return href && href.split("?")[0] !== wanted.href;
          })
          .map((reg) => reg.unregister())
      );
      const reg = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      await reg.update();
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (sessionStorage.getItem("seadive-sw-reload")) return;
        sessionStorage.setItem("seadive-sw-reload", "1");
        location.reload();
      });
    } catch (_) {}
  })();
}

let state = load();
rememberCatalogFromDives();
let view = { name: "home", diveId: null, draft: null, query: "", pending: [], computerHint: "" };

function nextNumber() {
  return state.dives.reduce((m, d) => Math.max(m, Number(d.number) || 0), 0) + 1;
}

function certLabel(c) {
  if (!c) return "";
  return [c.name, c.number ? `n° ${c.number}` : ""].filter(Boolean).join(" · ");
}

function profileCerts() {
  const p = state.profile || {};
  const out = [];
  if (p.certLevel || p.certNumber) {
    out.push({ id: "main", name: p.certLevel, number: p.certNumber, main: true });
  }
  (Array.isArray(p.certs) ? p.certs : []).forEach((c) => {
    if (!c || !(c.name || c.number)) return;
    if (out.some((x) => x.name === c.name && x.number === c.number)) return;
    out.push(c);
  });
  return out;
}

function certRowHtml(c = {}) {
  return `<div class="cert-row" data-certrow>
    <input class="cert-name" name="certName" placeholder="Brevetto (es. Nitrox)" value="${escapeHtml(c.name || "")}" autocomplete="off" />
    <input class="cert-no" name="certNo" placeholder="N°" value="${escapeHtml(c.number || "")}" autocomplete="off" />
    <button class="btn ghost cert-del" type="button" data-delcert aria-label="Rimuovi">×</button>
  </div>`;
}

function totals() {
  const n = state.dives.length;
  const max = Math.max(0, ...state.dives.map((d) => Number(d.maxDepth) || 0));
  const mins = state.dives.reduce((s, d) => s + (Number(d.bottomTime) || Number(d.totalTime) || 0), 0);
  const sites = new Set(state.dives.map((d) => d.site).filter(Boolean)).size;
  return { n, max, mins, sites };
}

function fmtMins(m) {
  const h = Math.floor(m / 60);
  const r = Math.round(m % 60);
  return h ? `${h}h ${r}m` : `${r}m`;
}

function fmtItDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function fmtItDateLong(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
}

function dotNumber(v) {
  const raw = String(v ?? "").trim();
  const s = raw.replace(/\s/g, "").replace(",", ".");
  if (!s) return "";
  if (!/^-?\d+(\.\d+)?$/.test(s)) return raw;
  return String(Number(s));
}

function parseDecimal(v) {
  if (v == null || v === "") return NaN;
  const n = parseFloat(String(v).trim().replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function formatDecimal(v) {
  const n = parseDecimal(v);
  if (!Number.isFinite(n)) return "";
  return String(Math.round(n * 10) / 10).replace(".", ",");
}

function fmtDepth(v) {
  const n = parseDecimal(v);
  if (!Number.isFinite(n) || v === "" || v == null) return "—";
  return formatDecimal(n);
}

function diveDuration(d) {
  return Number(d.bottomTime) || Number(d.totalTime) || minutesSpan(d.timeIn, d.timeOut) || 0;
}

function meanDepthM(d) {
  const fromLog = Number(d.computerLog?.avgDepth);
  if (fromLog > 0.5) return fromLog;
  const wet = (d.profilePoints || []).filter((p) => Number(p.d) > 1);
  if (wet.length >= 3) return wet.reduce((s, p) => s + Number(p.d), 0) / wet.length;
  const max = Number(d.maxDepth) || 0;
  return max > 0 ? max * 0.65 : 0;
}

function tankForSac(d) {
  const n = Number(d.tank);
  if (n > 0) return { v: n, assumed: false };
  const p0 = Number(d.pressureStart);
  const p1 = Number(d.pressureEnd);
  if (p0 > 0 && p1 >= 0 && p0 > p1) return { v: 15, assumed: true };
  return { v: 0, assumed: false };
}

function diveSac(d) {
  const { v } = tankForSac(d);
  const p0 = Number(d.pressureStart);
  const p1 = Number(d.pressureEnd);
  const t = Number(d.totalTime) || diveDuration(d);
  if (!(v > 0 && p0 > 0 && p1 >= 0 && p0 > p1 && t > 0)) return 0;
  const ata = Math.max(1.05, 1 + meanDepthM(d) / 10);
  const fromFit = Number(d.computerLog?.sacFit);
  const calc = (v * (p0 - p1)) / (t * ata);
  if (fromFit > 2 && fromFit < 60 && Math.abs(fromFit - calc) / Math.max(calc, 1) < 0.45) {
    return (calc * 0.65 + fromFit * 0.35);
  }
  return calc;
}

function computeAscent(d) {
  const api = window.SeaDiveComputers;
  const fromProf = api?.ascentFromPoints ? api.ascentFromPoints(d.profilePoints) : { avg: "", max: "" };
  const fromLog = {
    avg: d.computerLog?.ascentAvg || "",
    max: d.computerLog?.ascentMax || "",
  };
  let avg = fromProf.avg || fromLog.avg || d.ascentRate || "";
  if (fromProf.avg && fromLog.avg) {
    const a = Number(fromProf.avg);
    const b = Number(fromLog.avg);
    if (a > 1 && b > 1 && Math.abs(a - b) < 14) avg = String(Math.round(((a + b) / 2) * 10) / 10);
  }
  return { avg, max: fromProf.max || fromLog.max || d.ascentMax || avg };
}

function lactateHr(d) {
  const fromProfile = Number(state?.profile?.hrThreshold);
  if (fromProfile > 80 && fromProfile < 230) return fromProfile;
  const max = Number(d?.computerLog?.hrMax);
  if (max > 100 && max < 230) return Math.round(max * 0.9);
  return 165;
}

function computeTss(d) {
  const hours = (Number(d.totalTime) || diveDuration(d) || 0) / 60;
  if (d.tssKind === "manual") {
    const n = Number(d.tss);
    return { value: n > 0 ? String(Math.round(n * 10) / 10) : "", kind: "manual", label: "TSS(Manuale)" };
  }
  const file = Number(d.computerLog?.tss);
  if (file > 0 && file < 500) {
    const hr = Number(d.computerLog?.hrAvg) > 40;
    return {
      value: String(Math.round(file * 10) / 10),
      kind: hr ? "hr" : "file",
      label: hr ? "TSS(hr) dal computer · FC vs soglia zona 4/5" : "TSS dal file FIT",
    };
  }
  const hrAvg = Number(d.computerLog?.hrAvg);
  if (hrAvg > 40 && hours > 0) {
    const iff = Math.max(0.25, Math.min(1.35, hrAvg / lactateHr(d)));
    const tss = hours * iff * iff * 100;
    return { value: String(Math.round(tss * 10) / 10), kind: "hr", label: "TSS(hr) · frequenza vs soglia zona 4/5" };
  }
  if (hours > 0) {
    const sac = diveSac(d) || parseDecimal(d.sac) || 0;
    const depth = meanDepthM(d);
    const climb = Number(d.ascentMax || d.ascentRate) || 0;
    let met = 4;
    if (sac > 0) met += Math.min(6, (sac / 18) * 3.5);
    else met += Math.min(3.2, depth / 15);
    if (climb > 15) met += 0.7;
    if ((d.types || []).includes("Corrente")) met += 0.8;
    const iff = Math.max(0.3, Math.min(1.4, met / 7));
    const tss = hours * iff * iff * 100;
    return { value: String(Math.round(tss * 10) / 10), kind: "met", label: "TSS(MET) · carico metabolico (senza FC/potenza)" };
  }
  return { value: "", kind: "", label: "" };
}

function trainingLoad() {
  const byDay = {};
  (state.dives || []).forEach((d) => {
    const n = Number(computeTss(d).value);
    if (!(n > 0) || !d.date) return;
    byDay[d.date] = (byDay[d.date] || 0) + n;
  });
  const days = Object.keys(byDay).sort();
  if (!days.length) return { ctl: 0, atl: 0, tsb: 0 };
  const start = new Date(`${days[0]}T12:00:00`);
  const end = new Date();
  let ctl = 0;
  let atl = 0;
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const iso = new Date(t).toISOString().slice(0, 10);
    const tss = byDay[iso] || 0;
    ctl += (tss - ctl) / 42;
    atl += (tss - atl) / 7;
  }
  return {
    ctl: Math.round(ctl * 10) / 10,
    atl: Math.round(atl * 10) / 10,
    tsb: Math.round((ctl - atl) * 10) / 10,
  };
}

function fillAvgCnsOtu(d) {
  if (!d) return d;
  const api = window.SeaDiveComputers;
  const mix = d.mix || "21";
  const pts = d.profilePoints || [];
  const mins = d.totalTime || d.bottomTime;
  if (!(Number(d.avgDepth) > 0.3)) {
    const fromProf = api?.meanProfileDepthM ? api.meanProfileDepthM(pts) : 0;
    const fromLog = Number(d.computerLog?.avgDepth);
    const fromMean = meanDepthM(d);
    const v = fromProf > 0.3 ? fromProf : fromLog > 0.3 ? fromLog : fromMean;
    if (v > 0.3) d.avgDepth = String(Math.round(v * 10) / 10);
  }
  if (d.cns === "" || d.cns == null || !(Number(d.cns) > 0)) {
    const log = Number(d.computerLog?.cns);
    if (log > 0) d.cns = String(Math.round(log * 10) / 10);
  }
  if (d.otu === "" || d.otu == null || !(Number(d.otu) > 0)) {
    const log = Number(d.computerLog?.otu);
    if (log > 0) d.otu = String(Math.round(log * 10) / 10);
  }
  if (!String(d.surfaceInterval || "").trim()) {
    const si = d.computerLog?.surfaceInterval;
    if (si !== "" && si != null) d.surfaceInterval = String(si);
    else if (api?.surfaceFromPrevDives) {
      const fromPrev = api.surfaceFromPrevDives(d, typeof state !== "undefined" ? state.dives || [] : []);
      if (fromPrev) d.surfaceInterval = fromPrev;
    }
  }
  if (d.ndl === "" || d.ndl == null) {
    const ndl = d.computerLog?.ndl;
    if (ndl !== "" && ndl != null) d.ndl = String(ndl);
  }
  if (!String(d.gf || "").trim()) {
    const gf = d.computerLog?.gf;
    if (gf) d.gf = String(gf);
  }
  if (d.computerLog) {
    if (!(Number(d.computerLog.avgDepth) > 0.3) && Number(d.avgDepth) > 0.3) d.computerLog.avgDepth = d.avgDepth;
    if (!(Number(d.computerLog.cns) > 0) && d.cns !== "" && d.cns != null) d.computerLog.cns = d.cns;
    if (!(Number(d.computerLog.otu) > 0) && d.otu !== "" && d.otu != null) d.computerLog.otu = d.otu;
    if (!d.computerLog.surfaceInterval && d.surfaceInterval) d.computerLog.surfaceInterval = d.surfaceInterval;
    if ((d.computerLog.ndl === "" || d.computerLog.ndl == null) && d.ndl !== "" && d.ndl != null) d.computerLog.ndl = d.ndl;
    if (!d.computerLog.gf && d.gf) d.computerLog.gf = d.gf;
  }
  return d;
}

function applyDiveMetrics(d) {
  if (!d) return d;
  fillAvgCnsOtu(d);
  ensureDecoProfile(d);
  const ascent = computeAscent(d);
  d.ascentRate = ascent.avg || "";
  d.ascentMax = ascent.max || "";
  const calc = diveSac(d);
  const imported = Number(d.computerLog?.sacFit);
  const already = parseDecimal(d.sac);
  if (d.sacManual) {
    /* SAC digitato a mano, anche con virgola */
  } else if (imported > 0.5 && imported < 80) {
    d.sac = formatDecimal(imported);
  } else if (already > 0.5 && already < 80) {
    d.sac = formatDecimal(already);
  } else if (calc > 0) {
    d.sac = formatDecimal(calc);
  } else {
    d.sac = d.sac || "";
  }
  const tss = computeTss(d);
  if (d.tssKind === "manual") {
    d.tssLabel = tss.label;
  } else if (d.imported && !(Number(d.computerLog?.tss) > 0) && !(Number(d.computerLog?.hrAvg) > 40)) {
    d.tss = d.tss || "";
    d.tssKind = d.tss ? "file" : "";
    d.tssLabel = d.tss ? "TSS dal computer" : "";
  } else {
    d.tss = tss.value;
    d.tssKind = tss.kind;
    d.tssLabel = tss.label;
  }
  return d;
}

function effortSac(d) {
  const imported = Number(d.computerLog?.sacFit);
  const stored = parseDecimal(d.sac);
  const calc = diveSac(d);
  if (imported > 0.5 && imported < 80) return imported;
  if (stored > 0.5 && stored < 80) return stored;
  return calc;
}

function sacBarPct(n) {
  return Math.max(4, Math.min(96, ((n - 8) / 24) * 100));
}

function effortModel(d) {
  const sac = effortSac(d);
  const imported = Number(d.computerLog?.sacFit) > 0.5;
  const pct = sac > 0 ? sacBarPct(sac) : 0;
  let label = "Dati incompleti";
  let hint = "Il segno sulla barra segue il SAC importato (L/min in superficie).";
  if (sac > 0) {
    if (sac < 14) label = "Ottima";
    else if (sac < 18) label = "Buona";
    else if (sac < 22) label = "Nella media";
    else if (sac < 28) label = "Faticosa";
    else label = "Troppo faticosa";
    hint = imported
      ? `Indicatore sul SAC del computer: ${fmtDepth(sac)} L/min.`
      : `Indicatore sul SAC calcolato: ${fmtDepth(sac)} L/min.`;
    if (tankForSac(d).assumed) hint += " Bombola 15 L presunta.";
    if (d.computerLog?.pressureAssumed && Number(d.pressureStart) === 200) hint += " Inizio 200 bar precompilato.";
  }
  return { sac, pct, label, hint, imported };
}

function effortHtml(d, compact = false) {
  const e = effortModel(d);
  const val = e.sac > 0 ? `SAC ${fmtDepth(e.sac)} L/min · ${e.label}` : e.label;
  const ticks = [12, 16, 20, 24, 28]
    .map((n) => `<i class="effort-tick" style="left:${sacBarPct(n)}%"></i>`)
    .join("");
  return `<div class="effort-meter${compact ? " compact" : ""}">
    <div class="effort-track" role="img" aria-label="${escapeHtml(val)}">
      ${ticks}
      ${
        e.sac > 0
          ? `<span class="effort-mark" style="left:${e.pct}%"><em>${fmtDepth(e.sac)}</em></span>`
          : ""
      }
    </div>
    <div class="effort-scale"><span>12</span><span>16</span><span>20</span><span>24</span><span>28 L/min</span></div>
    <strong>${escapeHtml(val)}</strong>
    ${compact ? "" : `<p class="hint">${escapeHtml(e.hint)}</p>`}
  </div>`;
}

function ensureCircuit(d) {
  if (!d) return d;
  if (d.circuitOpen === true || d.circuitClosed === true || d.circuitOpen === false) {
    d.regulator = circuitLabel(d);
    if (d.regulator === "—") d.regulator = "";
    return d;
  }
  const r = String(d.regulator || "");
  const closed = /chiuso|ccr|rebreather/i.test(r);
  const open = /aperto|open circuit|\boc\b/i.test(r);
  d.circuitClosed = closed;
  d.circuitOpen = open || !closed;
  d.regulator = circuitLabel(d);
  if (d.regulator === "—") d.regulator = "";
  return d;
}

function circuitLabel(d) {
  const parts = [];
  if (d.circuitOpen) parts.push("Circuito aperto");
  if (d.circuitClosed) parts.push("Circuito chiuso");
  return parts.join(" + ") || d.regulator || "—";
}

function decoLabel(d) {
  const fuori = Boolean(d.deco) && !d.noDeco;
  const curva = fuori ? "Fuori curva: sì" : "Fuori curva: no";
  return d.ndl ? `${curva} · NDL ${d.ndl} min` : curva;
}

function ensureDecoProfile(d) {
  if (!d) return d;
  const pts = d.profilePoints;
  if (!pts || pts.length < 8) return d;
  const api = window.SeaDiveComputers;
  if (!api?.decoTrackFromProfile) return d;
  const calc = api.decoTrackFromProfile(pts, d.mix || "21", d.gf || d.computerLog?.gf, d.computerLog?.helium);
  if (!d.computerLog) d.computerLog = {};
  d.computerLog.deco = Boolean(calc.deco);
  return d;
}

function checkPicks(pairs) {
  return `<div class="check-picks">${pairs
    .map(
      (p) =>
        `<label class="check-pick"><input type="checkbox" name="${p.name}" ${p.on ? "checked" : ""} /> ${escapeHtml(p.label)}</label>`
    )
    .join("")}</div>`;
}

function ascentClass(v) {
  const n = Number(v);
  if (!(n > 0)) return "";
  if (n > 18) return "ascent-bad";
  if (n > 12) return "ascent-warn";
  return "ascent-ok";
}

function avgSac() {
  const vals = (state.dives || []).map(diveSac).filter((n) => n > 0.5 && n < 80);
  if (!vals.length) return "—";
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return m.toFixed(1).replace(".", ",");
}

function divesByYear() {
  const counts = {};
  (state.dives || []).forEach((d) => {
    const y = String(d.date || "").slice(0, 4);
    if (/^\d{4}$/.test(y)) counts[y] = (counts[y] || 0) + 1;
  });
  const now = new Date().getFullYear();
  const rows = [];
  for (let y = now - 4; y <= now; y++) {
    rows.push({ y: String(y), n: counts[String(y)] || 0, label: `'${String(y).slice(2)}` });
  }
  return rows;
}

function escapeHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function geoCoords(lat, lng) {
  const a = Number(String(lat ?? "").replace(",", "."));
  const b = Number(String(lng ?? "").replace(",", "."));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (Math.abs(a) > 90 || Math.abs(b) > 180 || (a === 0 && b === 0)) return null;
  return { lat: a, lng: b };
}

function geoText(d) {
  const g = coordsForDive(d);
  if (!g) return "";
  return `${g.lat.toFixed(5)}, ${g.lng.toFixed(5)}`;
}

function coordsForDive(d) {
  const direct = geoCoords(d?.lat, d?.lng);
  if (direct) return direct;
  const hit = window.SeaDiveSites?.matchCatalog?.(d);
  if (hit) return { lat: Number(hit.lat), lng: Number(hit.lng) };
  return null;
}

function minutesSpan(a, b) {
  if (!a || !b) return 0;
  const pa = String(a).split(":").map(Number);
  const pb = String(b).split(":").map(Number);
  if (pa.length < 2 || pb.length < 2) return 0;
  let n = pb[0] * 60 + pb[1] - (pa[0] * 60 + pa[1]);
  if (n < 0) n += 24 * 60;
  return n;
}

function autoProfile(d) {
  const max = Number(d.maxDepth) || Number(d.plannedDepth) || 0;
  const stop = Number(d.safetyStop) || (max >= 10 ? 3 : 0);
  let bottom = Number(d.bottomTime) || 0;
  let total = Number(d.totalTime) || minutesSpan(d.timeIn, d.timeOut) || 0;
  if (!max) return [];
  if (!bottom && !total) total = Math.max(20, Math.round(max * 1.2));
  if (!total) total = bottom + stop + Math.max(4, Math.round(max / 8));
  if (!bottom) bottom = Math.max(1, total - stop - Math.max(4, Math.round(max / 8)));
  const descent = Math.max(2, Math.round(max / 10));
  const toStop = Math.max(2, Math.round(Math.max(max - 5, 1) / 10));
  const pts = [{ t: 0, d: 0 }, { t: descent, d: max }];
  let t = descent + Math.max(1, bottom);
  pts.push({ t, d: Math.round(max * 0.9 * 10) / 10 });
  if (stop > 0 && max > 6) {
    t += toStop;
    pts.push({ t, d: 5 });
    t += stop;
    pts.push({ t, d: 5 });
  }
  t = Math.max(t + 2, total);
  pts.push({ t, d: 0 });
  return pts;
}

function profileFor(d) {
  if (d.profileFromComputer && d.profilePoints?.length >= 3) return d.profilePoints;
  const auto = autoProfile(d);
  return auto.length ? auto : d.profilePoints || [];
}

function pointTemp(p) {
  const raw = p?.c ?? p?.temp;
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > -5 && n < 45 ? n : null;
}

function thermoPoints(points) {
  return (points || []).filter((p) => pointTemp(p) != null && Number.isFinite(Number(p.d)) && p.d >= 0);
}

function ensureThermoProfile(d) {
  const pts = profileFor(d).map((p) => ({ ...p }));
  if (thermoPoints(pts).length >= 3) return pts;
  const bottom = Number(d.bottomTemp || d.waterTemp);
  const air = Number(d.airTemp || d.waterTemp || bottom);
  if (!pts.length || !Number.isFinite(bottom)) return pts;
  const maxD = Math.max(1, ...pts.map((p) => Number(p.d) || 0));
  return pts.map((p) => {
    const mix = Math.min(1, (Number(p.d) || 0) / maxD);
    const c = air * (1 - mix) + bottom * mix;
    return { ...p, c: Math.round(c * 10) / 10 };
  });
}

function satMapHtml(d, cls) {
  const g = coordsForDive(d);
  if (!g) return "";
  const pad = 0.038;
  const bbox = `${g.lng - pad},${g.lat - pad},${g.lng + pad},${g.lat + pad}`;
  const src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${encodeURIComponent(
    bbox
  )}&bboxSR=4326&imageSR=4326&size=800,360&format=jpg&f=image`;
  const name = d.site || d.location || "Sito di immersione";
  return `<div class="${cls || "sat-place"}"><img alt="" src="${src}" /><span class="sat-name">${escapeHtml(name)}</span></div>`;
}

function geoMapHtml(lat, lng, name) {
  return satMapHtml({ lat, lng, site: name });
}

function rememberCatalogFromDives() {
  (state.dives || []).forEach((d) => window.SeaDiveSites?.ensureSiteFromDive?.(d));
}

function applyPlaceToDive(d) {
  const hit = window.SeaDiveSites?.matchCatalog?.(d);
  if (hit) {
    if (!geoCoords(d.lat, d.lng)) {
      d.lat = hit.lat;
      d.lng = hit.lng;
    }
    if (!String(d.location || "").trim()) d.location = hit.country || d.location;
  }
  window.SeaDiveSites?.ensureSiteFromDive?.(d);
  return d;
}

function setPageSkin() {
  document.body.classList.toggle("page-auth", !loadSession());
  document.body.classList.toggle("page-app", Boolean(loadSession()));
  document.body.classList.toggle("page-home", Boolean(loadSession()) && view.name === "home");
  document.body.classList.toggle("page-map", Boolean(loadSession()) && view.name === "map");
  document.body.classList.toggle("page-profile", Boolean(loadSession()) && view.name === "profile");
  document.body.classList.toggle("page-bio", Boolean(loadSession()) && view.name === "bio");
  document.body.classList.toggle("page-people", Boolean(loadSession()) && view.name === "people" && !view.personId);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  let color = "#021018";
  if (!loadSession()) color = "#0c3a42";
  else if (view.name === "map") color = "#061018";
  else if (view.name === "bio") color = "#d7f6ff";
  else if (view.name === "people" && !view.personId) color = "#d7f6ff";
  else if (view.name === "profile") color = "#08343c";
  meta.setAttribute("content", color);
}

function bindPhoneFit() {
  if (bindPhoneFit.done) return;
  bindPhoneFit.done = true;
  const typing = (el) => {
    if (!el || !el.matches) return false;
    if (!el.matches("input, textarea, select")) return false;
    const type = String(el.getAttribute("type") || "text").toLowerCase();
    return !["checkbox", "radio", "file", "button", "range", "hidden"].includes(type);
  };
  document.addEventListener("focusin", (e) => {
    if (!typing(e.target)) return;
    document.body.classList.add("kb-open");
    const field = e.target;
    setTimeout(() => {
      if (document.activeElement !== field) return;
      field.scrollIntoView({ block: "center", inline: "nearest" });
    }, 320);
  });
  document.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!typing(document.activeElement)) document.body.classList.remove("kb-open");
    }, 120);
  });
}
bindPhoneFit();

async function finishAuth(user) {
  saveSession(user);
  window.SeaDiveDrive?.setDriveWanted?.(true);
  if (!state.profile.name && user.name) state.profile.name = user.name;
  if (user.email) state.profile.recoverEmail = state.profile.recoverEmail || user.email;
  persistLocal(state);
  await syncWithDrive({ interactive: true });
  view = { name: "home", diveId: null, draft: null, query: "", pending: [], computerHint: "" };
  render();
}

function render() {
  stopChatPoll();
  destroyDiveSiteMap();
  destroyGoogleWorldMap();
  destroyWorldGlobe();
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  const app = document.getElementById("app");
  app.replaceChildren();
  document.querySelectorAll(".nav, .nav-dock").forEach((el) => el.remove());
  setPageSkin();
  if (!loadSession()) {
    app.append(renderAuth());
    return;
  }
  let changed = false;
  if (adoptSessionName()) changed = true;
  if (seedPeopleOnce()) changed = true;
  if (backfillPeopleOnce()) changed = true;
  if (changed) save(state);
  if (view.name === "home") app.append(renderHome());
  if (view.name === "log") app.append(renderLog());
  if (view.name === "stats") app.append(renderStats());
  if (view.name === "profile") app.append(renderProfile());
  if (view.name === "computer") app.append(renderComputer());
  if (view.name === "map") app.append(renderWorldMap());
  if (view.name === "bio") app.append(view.bioId ? renderBioGuide() : renderBiology());
  if (view.name === "people") app.append(view.personId ? renderPerson() : renderPeople());
  if (view.name === "chat") app.append(renderChat());
  if (view.name === "detail") app.append(renderDetail());
  if (view.name === "edit") app.append(renderEdit());
  document.body.append(renderNav());
  if (loadSession()) armChatNotices();
  if (view.name === "log") {
    const fab = document.createElement("button");
    fab.className = "fab";
    fab.title = "Nuova immersione";
    fab.textContent = "+";
    fab.onclick = () => startNew();
    app.append(fab);
  }
  queueProfilePublish();
}

function renderAuth() {
  const wrap = document.createElement("section");
  wrap.className = "gate";
  wrap.innerHTML = `
    <div class="gate-card card">
      <img class="gate-shot" alt="Nudibranco, foto di Alessio Calistri" src="./register.jpg?v=1" />
      <p class="eyebrow">SeaDive LogBook</p>
      <h1>Registrati</h1>
      <p class="meta">Crea l’account con Google. Le immersioni restano tue e si copiano sul Drive, così non si perdono.</p>
      <p class="hint"><a href="./privacy.html">Informativa privacy</a> · <a href="./termini.html">Termini di servizio</a></p>
      <details class="privacy-fold">
        <summary>Informativa privacy</summary>
        <div class="privacy-body">
          <p><strong>Titolare.</strong> I dati del diario sono tuoi.</p>
          <p><strong>Cosa.</strong> Nome, email del login; anagrafica e brevetto; schede immersione; firme; foto e note.</p>
          <p><strong>Perché.</strong> Libretto digitale e firme L. 70/2026 art. 12 c. 8.</p>
          <p><strong>Dove.</strong> Sul telefono (anche se chiudi l’app) e in copia nascosta sul tuo Google Drive, legata all’account. Se perdi o rompi il telefono, rientra con lo stesso Google: il diario torna, anche a distanza di anni. Nome, cognome, didattica, numero di brevetto, firma e foto del profilo sono trovabili dagli altri utenti SeaDive che cercano quel nominativo. I messaggi della chat in Community arrivano all’altra persona. Diario, foto delle immersioni, telefono e dati medici restano sul telefono e sul Drive.</p>
          <p><strong>Diritti.</strong> Accesso, rettifica, cancellazione, portabilità. Reclami: Garante privacy.</p>
        </div>
      </details>
      <label class="privacy-accept">
        <input type="checkbox" data-privacy />
        <span>Ho letto la privacy e acconsento al trattamento per il libretto e il backup.</span>
      </label>
      <button class="btn sso-google" type="button" data-google disabled>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.12-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continua con Google
      </button>
      <p class="hint" data-authhint>Accetta la privacy, poi continua con Google.</p>
    </div>
  `;
  const go = wrap.querySelector("[data-google]");
  const privacy = wrap.querySelector("[data-privacy]");
  const hint = wrap.querySelector("[data-authhint]");
  privacy.onchange = () => {
    go.disabled = !privacy.checked;
    hint.textContent = privacy.checked ? "" : "Accetta la privacy, poi continua con Google.";
  };
  go.onclick = async () => {
    if (!privacy.checked) {
      hint.textContent = "Accetta la privacy per registrarti.";
      return;
    }
    localStorage.setItem("seadive-privacy-ok", new Date().toISOString());
    hint.textContent = "Apro Google (utente e password)…";
    try {
      const user = await window.SeaDiveDrive.signInGoogle();
      await finishAuth(user);
    } catch (err) {
      hint.textContent = err.message || String(err);
    }
  };
  return wrap;
}

function topbar(subtitle, mode) {
  const wrap = document.createElement("div");
  wrap.className = mode === "home" ? "topbar home-top" : "topbar";
  const who = (state.profile.name || loadSession()?.name || "").split(" ")[0];
  if (mode === "home") {
    wrap.innerHTML = `
      <div class="home-brand">
        <h1>SeaDive <small>LogBook</small></h1>
        <p>di ${escapeHtml(who || "te")}</p>
        <p class="hint">Versione 178</p>
      </div>
      <div class="home-tools">
        <button class="icon-btn" type="button" data-act="search" aria-label="Cerca">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </button>
        <button class="icon-btn add" type="button" data-act="add" aria-label="Nuova immersione">+</button>
      </div>
    `;
    wrap.querySelector("[data-act=search]").onclick = () => {
      view = { name: "log", query: view.query || "" };
      render();
    };
    wrap.querySelector("[data-act=add]").onclick = startNew;
    return wrap;
  }
  wrap.innerHTML = `
    <div class="brand">
      <div class="mark"><img src="./icon-192.png" alt="" /></div>
      <div>
        <p>SeaDive</p>
        <h1>${escapeHtml(subtitle || "LogBook")}</h1>
      </div>
    </div>
    <button class="icon-btn add" type="button" data-act="add" aria-label="Nuova immersione">+</button>
  `;
  wrap.querySelector("[data-act=add]").onclick = startNew;
  return wrap;
}

const NAV_SECTIONS = [
  ["home", "🌊", "SeaDive"],
  ["log", "📒", "Diario"],
  ["bio", "🌿", "Biologia"],
  ["computer", "⌚", "Computer"],
  ["profile", `<img src="./nav-diver.png?v=170" alt="" draggable="false" />`, "Profilo"],
  ["map", "🗺️", "Mappa"],
  ["people", "🤿🤿", "Community"],
];

function sectionOfView() {
  if (view.name === "detail" || view.name === "edit") return "log";
  if (view.name === "chat") return "people";
  if (view.name === "stats") return "home";
  return NAV_SECTIONS.some(([id]) => id === view.name) ? view.name : "";
}

function openNavSection(id) {
  view = {
    name: id,
    diveId: null,
    draft: null,
    query: view.query || "",
    bioQuery: view.bioQuery || "",
    bioFilter: view.bioFilter || "all",
    bioWhere: view.bioWhere || "all",
    computerHint: view.computerHint || "",
    peopleRole: view.peopleRole || "all",
  };
  render();
  window.scrollTo(0, 0);
}

function bindSectionSwipe() {
  if (bindSectionSwipe.done) return;
  bindSectionSwipe.done = true;
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let swallowClick = false;
  const horizontalScroller = (el) => {
    let node = el;
    while (node && node !== document.body) {
      const ox = getComputedStyle(node).overflowX;
      if ((ox === "auto" || ox === "scroll") && node.scrollWidth > node.clientWidth + 8) return true;
      node = node.parentElement;
    }
    return false;
  };
  const blocked = (el) => {
    if (!loadSession() || document.querySelector("[aria-modal='true']")) return true;
    if (!el || !el.closest) return true;
    if (el.closest("input, textarea, select, canvas, .nav, .nav-dock, .world-map, .maplibregl-map, .leaflet-container, .gm-style")) return true;
    return horizontalScroller(el);
  };
  const arm = (x, y, el) => {
    if (blocked(el)) {
      tracking = false;
      return;
    }
    tracking = true;
    startX = x;
    startY = y;
  };
  const finish = (x, y) => {
    if (!tracking) return;
    tracking = false;
    const dx = x - startX;
    const dy = y - startY;
    if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    const index = NAV_SECTIONS.findIndex(([id]) => id === sectionOfView());
    if (index < 0) return;
    const next = index + (dx < 0 ? 1 : -1);
    if (next < 0 || next >= NAV_SECTIONS.length) return;
    swallowClick = true;
    setTimeout(() => {
      swallowClick = false;
    }, 700);
    openNavSection(NAV_SECTIONS[next][0]);
  };
  document.addEventListener("click", (e) => {
    if (!swallowClick) return;
    swallowClick = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);
  document.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) {
      tracking = false;
      return;
    }
    arm(e.touches[0].clientX, e.touches[0].clientY, e.target);
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    if (!t) {
      tracking = false;
      return;
    }
    finish(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener("touchcancel", () => {
    tracking = false;
  }, { passive: true });
  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    arm(e.clientX, e.clientY, e.target);
  });
  document.addEventListener("pointerup", (e) => {
    if (e.pointerType === "touch") return;
    finish(e.clientX, e.clientY);
  });
  document.addEventListener("pointercancel", (e) => {
    if (e.pointerType !== "touch") tracking = false;
  });
}
bindSectionSwipe();

function renderNav() {
  const wrap = document.createDocumentFragment();
  const dock = document.createElement("div");
  dock.className = "nav-dock";
  dock.setAttribute("aria-hidden", "true");
  const nav = document.createElement("nav");
  nav.className = "nav";
  const items = NAV_SECTIONS;
  items.forEach(([id, icon, label]) => {
    const b = document.createElement("button");
    const on = view.name === id || (id === "log" && (view.name === "detail" || view.name === "edit")) || (id === "people" && view.name === "chat");
    b.className = on ? "active" : "";
    if (id === "bio") b.classList.add("bio-nav");
    if (id === "people") b.dataset.chatnav = "1";
    const badge = id === "people" && chatUnreadTotal() > 0 ? " " + chatUnreadTotal() : "";
    const spanClass = id === "people" ? "nav-divers" : id === "profile" ? "nav-diver" : "";
    b.innerHTML = `<span${spanClass ? ` class="${spanClass}"` : ""}>${icon}</span><small>${label}${badge}</small>`;
    b.onclick = () => openNavSection(id);
    nav.append(b);
  });
  wrap.append(dock, nav);
  return wrap;
}

let leafletMap = null;
let googleWorldMap = null;
let googleWorldMarkers = [];
let worldGlobe = null;
let worldMapGen = 0;
let diveSiteMap = null;
let diveSiteMarker = null;
let mapPick = null;

function destroyWorldGlobe() {
  worldMapGen += 1;
  if (worldGlobe) {
    try {
      worldGlobe.remove();
    } catch {
      /* già tolta */
    }
    worldGlobe = null;
  }
}

function destroyGoogleWorldMap() {
  googleWorldMarkers.forEach((m) => {
    try {
      m.setMap(null);
    } catch {
      /* già tolta */
    }
  });
  googleWorldMarkers = [];
  googleWorldMap = null;
}

function loadGoogleMaps() {
  if (window.google?.maps?.Map) return Promise.resolve();
  const key = (window.SEADIVE_GOOGLE_MAPS_KEY || "").trim();
  if (!key || key.startsWith("client_secret_")) {
    return Promise.reject(
      new Error("Manca la chiave Google Maps. In Google Cloud (stesso progetto del login) attiva Maps JavaScript API e incolla la chiave in config.js: SEADIVE_GOOGLE_MAPS_KEY.")
    );
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-gmaps]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google Maps non si è caricato.")));
      return;
    }
    window.__seadiveGmapsReady = () => resolve();
    const s = document.createElement("script");
    s.dataset.gmaps = "1";
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&callback=__seadiveGmapsReady`;
    s.onerror = () => reject(new Error("Google Maps non si è caricato. Controlla la chiave e che Maps JavaScript API sia attiva."));
    document.head.appendChild(s);
  });
}

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  const cssHref = [
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  ];
  const jsHref = [
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  ];
  const addCss = (href) => {
    if (document.querySelector("link[data-leaflet]")) return;
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = href;
    css.dataset.leaflet = "1";
    document.head.appendChild(css);
  };
  addCss(cssHref[0]);
  return new Promise((resolve, reject) => {
    let i = 0;
    const tryJs = () => {
      if (window.L) return resolve();
      if (i >= jsHref.length) return reject(new Error("Impossibile caricare la mappa."));
      const s = document.createElement("script");
      s.src = jsHref[i++];
      s.onload = () => (window.L ? resolve() : tryJs());
      s.onerror = tryJs;
      document.body.appendChild(s);
    };
    tryJs();
  });
}

function satBboxUrl(lat, lng, pad) {
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${encodeURIComponent(
    bbox
  )}&bboxSR=4326&imageSR=4326&size=900,480&format=jpg&f=image`;
}

function addSatTiles(map) {
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles © Esri",
    maxZoom: 19,
  }).addTo(map);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
    attribution: "",
    maxZoom: 19,
    opacity: 0.85,
  }).addTo(map);
}

function destroyDiveSiteMap() {
  if (diveSiteMap) {
    diveSiteMap.remove();
    diveSiteMap = null;
    diveSiteMarker = null;
  }
}

function writeDiveCoords(form, d, lat, lng) {
  const latS = Number(lat).toFixed(5);
  const lngS = Number(lng).toFixed(5);
  d.lat = latS;
  d.lng = lngS;
  const latEl = form.querySelector("[name=lat]");
  const lngEl = form.querySelector("[name=lng]");
  if (latEl) latEl.value = latS;
  if (lngEl) lngEl.value = lngS;
}

async function reverseFillLocation(form, d, lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const info = await res.json();
    const a = info.address || {};
    const loc = [a.village || a.town || a.city || a.municipality, a.country].filter(Boolean).join(", ");
    const locField = form.querySelector("[name=location]");
    if (loc && locField && !String(locField.value || "").trim()) {
      locField.value = loc;
      d.location = loc;
    }
  } catch {
    /* coordinate già sul pin */
  }
}

async function geocodeQuery(query) {
  const q = String(query || "").trim();
  if (!q) return null;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q)}`
  );
  const rows = await res.json();
  if (!rows?.[0]) return null;
  return { lat: Number(rows[0].lat), lng: Number(rows[0].lon) };
}

function bindDiveSiteMap(form, d) {
  const el = form.querySelector("[data-sitemap]");
  const hint = form.querySelector("[data-geohint]");
  if (!el) return;
  destroyDiveSiteMap();
  let pad = coordsForDive(d) ? 0.032 : 6;
  const paintStatic = (lat, lng, opts = {}) => {
    writeDiveCoords(form, d, lat, lng);
    const p = opts.wide ? 7 : pad;
    el.innerHTML = `<img alt="Mappa del sito" src="${satBboxUrl(Number(lat), Number(lng), p)}"><i class="map-pin" aria-hidden="true"></i>`;
    if (hint) {
      hint.textContent =
        opts.hint || "Tocca la mappa per spostare il pin sul punto esatto. Poi salva l’immersione.";
    }
    if (!opts.skipGeo) reverseFillLocation(form, d, lat, lng);
  };
  const start = coordsForDive(d) || { lat: 41.9, lng: 12.48 };
  form._placePin = (lat, lng, opts = {}) => {
    if (opts.zoom && opts.zoom >= 14) pad = 0.018;
    else if (opts.zoom && opts.zoom >= 10) pad = 0.08;
    const keepOnMap = () => {
      const typed = String(form.querySelector("[name=site]")?.value || d.site || "").trim();
      const loc = String(form.querySelector("[name=location]")?.value || d.location || "").trim();
      const name = typed || loc;
      if (!name) return;
      if (typed) d.site = typed;
      d.location = loc;
      window.SeaDiveSites?.ensureSiteFromDive?.({ ...d, site: name, location: loc });
    };
    if (diveSiteMap && window.L) {
      writeDiveCoords(form, d, lat, lng);
      keepOnMap();
      const ll = [Number(lat), Number(lng)];
      if (!diveSiteMarker) {
        diveSiteMarker = L.marker(ll, { draggable: true }).addTo(diveSiteMap);
        diveSiteMarker.on("dragend", () => {
          const p = diveSiteMarker.getLatLng();
          form._placePin(p.lat, p.lng, { hint: "Pin spostato e salvato sulla mappa." });
        });
      } else diveSiteMarker.setLatLng(ll);
      diveSiteMap.setView(ll, opts.zoom || Math.max(diveSiteMap.getZoom(), 13));
      if (hint && opts.hint) hint.textContent = opts.hint;
      if (!opts.skipGeo) reverseFillLocation(form, d, lat, lng);
      return;
    }
    paintStatic(lat, lng, opts);
    keepOnMap();
  };
  paintStatic(start.lat, start.lng, {
    skipGeo: true,
    wide: !coordsForDive(d),
    hint: coordsForDive(d)
      ? "Tocca la mappa per spostare il pin, senza scrivere le coordinate."
      : "Tocca una zona, oppure Cerca sito / posizione attuale.",
  });
  el.onclick = (e) => {
    if (diveSiteMap) return;
    const g = geoCoords(d.lat, d.lng) || start;
    const p = geoCoords(d.lat, d.lng) ? pad : 7;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / Math.max(1, r.width);
    const y = (e.clientY - r.top) / Math.max(1, r.height);
    const nLng = Number(g.lng) - p + x * 2 * p;
    const nLat = Number(g.lat) + p - y * 2 * p;
    pad = Math.min(pad, 0.06);
    paintStatic(nLat, nLng);
  };
  loadLeaflet()
    .then(() => {
      if (!form.isConnected || !window.L) return;
      const known = coordsForDive(d);
      const here = known || start;
      el.onclick = null;
      el.innerHTML = "";
      diveSiteMap = L.map(el, { scrollWheelZoom: true, worldCopyJump: true }).setView([here.lat, here.lng], known ? 15 : 5);
      addSatTiles(diveSiteMap);
      diveSiteMap.on("click", (ev) => form._placePin(ev.latlng.lat, ev.latlng.lng));
      form._placePin(here.lat, here.lng, {
        skipGeo: true,
        zoom: known ? 15 : 5,
        hint: known ? "Trascina il pin sul punto esatto." : "Scorri e tocca il sito per piantare il pin.",
      });
      [80, 250, 600].forEach((ms) => setTimeout(() => diveSiteMap?.invalidateSize(), ms));
    })
    .catch(() => {
      if (hint && !String(hint.textContent || "").includes("Tocca")) {
        hint.textContent = "Tocca la foto-mappa per spostare il pin (senza digitare coordinate).";
      }
    });
}

function haversineMapKm(a, b) {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

function diveFlagSvg(kind) {
  const fill = kind === "done" ? "#d61f26" : "#8e949c";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="36" height="46"><rect x="16.8" y="24" width="2.6" height="20" rx="1.1" fill="#4a5562"/><rect x="1.6" y="1.6" width="32.8" height="22.4" rx="3.2" fill="${fill}" stroke="#ffffff" stroke-width="1.7"/><path d="M3 22.2 L33 3.4" stroke="#ffffff" stroke-width="5.4"/></svg>`;
}

function diveFlagIconUrl(kind) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(diveFlagSvg(kind));
}

function flagPixelSize(zoom) {
  const z = Math.max(2, Math.min(18, Number(zoom) || 2));
  const w = Math.round(8 + ((z - 2) / 16) * 16);
  return { w, h: Math.round((w * 46) / 36) };
}

function flagIcon(kind, zoom) {
  const { w, h } = flagPixelSize(zoom);
  return {
    url: diveFlagIconUrl(kind),
    scaledSize: new google.maps.Size(w, h),
    anchor: new google.maps.Point(Math.round(w / 2), h),
  };
}

const DIVE_COUNTRY = {
  IT: "Italia", FR: "Francia", ES: "Spagna", PT: "Portogallo", HR: "Croazia", GR: "Grecia", TR: "Turchia",
  MT: "Malta", CY: "Cipro", EG: "Egitto", IL: "Israele", JO: "Giordania", TN: "Tunisia", MA: "Marocco",
  DZ: "Algeria", AL: "Albania", ME: "Montenegro", SI: "Slovenia", DE: "Germania", GB: "Regno Unito",
  IE: "Irlanda", NO: "Norvegia", SE: "Svezia", IS: "Islanda", NL: "Paesi Bassi", BE: "Belgio",
  US: "USA", MX: "Messico", AU: "Australia", NZ: "Nuova Zelanda", ID: "Indonesia", MY: "Malaysia",
  TH: "Thailandia", PH: "Filippine", JP: "Giappone", MV: "Maldive", ZA: "Sudafrica", BR: "Brasile",
};

function diveCountryName(code) {
  const raw = String(code || "").trim();
  if (!raw) return "";
  return DIVE_COUNTRY[raw.toUpperCase()] || raw;
}

let diveCatalogPromise = null;

function loadDiveCatalog() {
  if (!diveCatalogPromise) {
    diveCatalogPromise = fetch("./dive-sites.json?v=111", { cache: "force-cache" })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) =>
        (Array.isArray(rows) ? rows : [])
          .map((row) => ({
            name: String(row.n || "").trim(),
            country: diveCountryName(row.c),
            lat: Number(row.a),
            lng: Number(row.o),
            kind: row.k === "d" ? "diving" : "sito",
            osm: true,
          }))
          .filter((row) => row.name && Number.isFinite(row.lat) && Number.isFinite(row.lng))
      )
      .catch(() => []);
  }
  return diveCatalogPromise;
}

function loadMapLibre() {
  if (window.maplibregl?.Map) return Promise.resolve();
  const cssHref = "https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.1/dist/maplibre-gl.css";
  const jsHref = [
    "https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.1/dist/maplibre-gl.js",
    "https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js",
  ];
  if (!document.querySelector("link[data-maplibre]")) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = cssHref;
    css.dataset.maplibre = "1";
    document.head.appendChild(css);
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    const tryJs = () => {
      if (window.maplibregl?.Map) return resolve();
      if (i >= jsHref.length) return reject(new Error("Mappa del mondo non disponibile."));
      const s = document.createElement("script");
      s.src = jsHref[i++];
      s.crossOrigin = "anonymous";
      s.onload = () => (window.maplibregl?.Map ? resolve() : tryJs());
      s.onerror = tryJs;
      document.body.appendChild(s);
    };
    tryJs();
  });
}

let divelogsPromise = null;

function loadDivelogsGeo() {
  if (!divelogsPromise) {
    divelogsPromise = fetch("./divelogs-sites.json?v=178")
      .then((res) => {
        if (!res.ok) throw new Error("catalogo");
        return res.json();
      })
      .then((rows) => {
        const features = [];
        const list = Array.isArray(rows) ? rows : [];
        for (let i = 0; i < list.length; i++) {
          const row = list[i];
          if (!row) continue;
          const lat = Number(row[1]);
          const lng = Number(row[2]);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const c = Number(row[3]);
          features.push({
            type: "Feature",
            properties: { n: String(row[0] || "Sito"), c: Number.isFinite(c) ? c : 1 },
            geometry: { type: "Point", coordinates: [lng, lat] },
          });
        }
        return { type: "FeatureCollection", features };
      })
      .catch(() => ({ type: "FeatureCollection", features: [] }));
  }
  return divelogsPromise;
}

function confidencePhrase(c) {
  const n = Number(c) || 0;
  const band = n >= 100 ? "Molto alta" : n >= 50 ? "Alta" : n >= 10 ? "Media" : "Bassa";
  return band + " · " + n.toLocaleString("it-IT") + " schede";
}

function clusterIconSize(zoom) {
  const z = Number(zoom) || 1;
  if (z <= 1) return 0.82;
  if (z >= 12) return 1;
  if (z <= 6) return 0.82 + ((z - 1) / 5) * 0.1;
  return 0.92 + ((z - 6) / 6) * 0.08;
}

function makeFlagImage(color, stripe) {
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 92;
  const g = canvas.getContext("2d");
  g.scale(2, 2);
  g.fillStyle = "#3e4854";
  g.fillRect(16.8, 23.2, 2.6, 20.4);
  const drawCloth = () => {
    const x = 1.6;
    const y = 1.6;
    const w = 32.8;
    const h = 22.4;
    const r = 3.2;
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  };
  drawCloth();
  g.fillStyle = color;
  g.fill();
  g.save();
  g.clip();
  g.strokeStyle = stripe || "rgba(255,255,255,0.95)";
  g.lineWidth = 5.2;
  g.beginPath();
  g.moveTo(3.2, 22);
  g.lineTo(32.6, 3.6);
  g.stroke();
  g.restore();
  drawCloth();
  g.lineWidth = 1.7;
  g.strokeStyle = "#ffffff";
  g.stroke();
  const img = g.getImageData(0, 0, canvas.width, canvas.height);
  return { width: img.width, height: img.height, data: img.data };
}

function personalDiveGeo() {
  const sites = window.SeaDiveSites?.annotateSites(state.dives || [])?.sites || [];
  return {
    type: "FeatureCollection",
    features: sites
      .filter((s) => (s.custom || s.fromDive) && Number.isFinite(Number(s.lat)) && Number.isFinite(Number(s.lng)))
      .map((s) => ({
        type: "Feature",
        properties: {
          n: s.name || "Sito tuo",
          country: s.country || "",
          done: s.done ? 1 : 0,
          dives: s.dives || 0,
        },
        geometry: { type: "Point", coordinates: [Number(s.lng), Number(s.lat)] },
      })),
  };
}

function renderWorldMap() {
  const frag = document.createDocumentFragment();
  const api = window.SeaDiveSites;
  const stage = document.createElement("div");
  stage.className = "map-stage";
  const mapWrap = document.createElement("div");
  mapWrap.className = "world-map";
  mapWrap.setAttribute("data-worldmap", "");
  stage.append(mapWrap);
  const legend = document.createElement("aside");
  legend.className = "map-legend-float";
  legend.innerHTML = `
    <div class="map-legend">
      <span><i class="flag-ico vh"></i> Molto alta, 100+</span>
      <span><i class="flag-ico hi"></i> Alta, 50–99</span>
      <span><i class="flag-ico md"></i> Media, 10–49</span>
      <span><i class="flag-ico lo"></i> Bassa, 1–9</span>
      <span><i class="flag-ico grp">12</i> Zona</span>
      <span><i class="flag-ico mine"></i> Il tuo sito</span>
    </div>
    <p class="map-legend-note" data-mapstatus>Carico i punti…</p>
    <p class="map-legend-note">Fonte: <a href="https://dive-sites.net/" target="_blank" rel="noopener">dive-sites.net</a></p>
  `;
  stage.append(legend);
  const dock = document.createElement("details");
  dock.className = "add-site-dock";
  if (mapPick?.lat) dock.open = true;
  dock.innerHTML = `<summary>Aggiungi un sito</summary>`;
  const form = document.createElement("form");
  form.innerHTML = `
    <p class="hint">Tocca il mare oppure scrivi le coordinate. Resta sul tuo telefono.</p>
    <div class="form-grid">
      ${field("name", "Nome del sito", mapPick?.name || "", true)}
      ${field("country", "Paese / area", mapPick?.country || "")}
      ${field("lat", "Latitudine", mapPick?.lat ?? "")}
      ${field("lng", "Longitudine", mapPick?.lng ?? "")}
    </div>
    <div class="actions">
      <button class="btn primary" type="submit">Salva sul catalogo</button>
    </div>
    <p class="hint" data-maphint></p>
  `;
  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      api.addCustomSite({
        name: fd.get("name"),
        country: fd.get("country"),
        lat: fd.get("lat"),
        lng: fd.get("lng"),
      });
      mapPick = null;
      render();
    } catch (err) {
      form.querySelector("[data-maphint]").textContent = err.message;
    }
  };
  dock.append(form);
  const summary = dock.querySelector("summary");
  const grab = document.createElement("span");
  grab.className = "dock-grab";
  grab.setAttribute("aria-hidden", "true");
  summary.prepend(grab);
  let dockDrag = null;
  const parkDock = () => {
    dock.classList.remove("pulling");
    dock.style.transform = "";
  };
  const dismissDock = () => {
    dock.open = false;
    mapPick = null;
    const hint = form.querySelector("[data-maphint]");
    if (hint) hint.textContent = "";
    ["lat", "lng"].forEach((name) => {
      const input = form.querySelector(`[name=${name}]`);
      if (input) input.value = "";
    });
  };
  dock.addEventListener("pointerdown", (e) => {
    if (!dock.open || (e.button != null && e.button !== 0)) return;
    if (e.target.closest("input, textarea, button, a, select")) return;
    dockDrag = { y: e.clientY, dy: 0, id: e.pointerId };
    try { dock.setPointerCapture(e.pointerId); } catch { /* il dito resta sul pannello */ }
  });
  dock.addEventListener("pointermove", (e) => {
    if (!dockDrag || e.pointerId !== dockDrag.id) return;
    const dy = Math.max(0, e.clientY - dockDrag.y);
    dockDrag.dy = dy;
    if (dy < 6) return;
    dock.classList.add("pulling");
    dock.style.transform = `translateX(-50%) translateY(${dy}px)`;
  });
  const endDockDrag = (e) => {
    if (!dockDrag || e.pointerId !== dockDrag.id) return;
    const dy = dockDrag.dy;
    dockDrag = null;
    parkDock();
    if (dy > 8) dock.dataset.pulled = "1";
    if (dy > 52) dismissDock();
  };
  dock.addEventListener("pointerup", endDockDrag);
  dock.addEventListener("pointercancel", endDockDrag);
  summary.addEventListener("click", (e) => {
    if (!dock.dataset.pulled) return;
    e.preventDefault();
    delete dock.dataset.pulled;
  });
  dock.addEventListener("toggle", () => {
    if (!dock.open) mapPick = null;
  });
  stage.append(dock);
  frag.append(stage);
  queueMicrotask(() => {
    const gen = worldMapGen;
    const el = mapWrap;
    const status = legend.querySelector("[data-mapstatus]");
    loadMapLibre()
      .then(() => {
        if (gen !== worldMapGen || !el?.isConnected || view.name !== "map" || !window.maplibregl) return;
        const map = new maplibregl.Map({
          container: el,
          style: {
            version: 8,
            projection: { type: "globe" },
            sources: {
              sat: {
                type: "raster",
                tiles: [
                  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
                tileSize: 256,
                maxzoom: 19,
                attribution: "Immagini © Esri",
              },
              labels: {
                type: "raster",
                tiles: [
                  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
                ],
                tileSize: 256,
                maxzoom: 19,
              },
            },
            layers: [
              { id: "bg", type: "background", paint: { "background-color": "#061018" } },
              { id: "sat", type: "raster", source: "sat" },
              { id: "labels", type: "raster", source: "labels", paint: { "raster-opacity": 0.88 } },
            ],
          },
          center: [12, 18],
          zoom: 2,
          minZoom: 0,
          maxZoom: 18,
          projection: "globe",
          attributionControl: true,
          dragRotate: true,
          pitchWithRotate: true,
          touchPitch: true,
          maxPitch: 60,
          renderWorldCopies: false,
          locale: {
            "NavigationControl.ZoomIn": "Avvicina",
            "NavigationControl.ZoomOut": "Allontana",
            "NavigationControl.ResetBearing": "Nord in alto",
          },
        });
        worldGlobe = map;
        map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showCompass: true }), "top-right");
        map.scrollZoom.setWheelZoomRate(1 / 200);
        try {
          map.touchZoomRotate.enableRotation();
        } catch {
          /* rotazione già attiva */
        }
        const badges = document.createElement("div");
        badges.className = "cluster-badges";
        el.appendChild(badges);
        let popup = null;
        const openPopup = (lngLat, html) => {
          popup?.remove();
          popup = new maplibregl.Popup({ offset: 18, closeButton: true, maxWidth: "280px" })
            .setLngLat(lngLat)
            .setHTML(html)
            .addTo(map);
        };
        const syncBadges = () => {
          if (worldGlobe !== map || !map.getLayer("clusters")) return;
          const feats = map.queryRenderedFeatures({ layers: ["clusters"] });
          const seen = new Set();
          const parts = [];
          const lift = 46 * clusterIconSize(map.getZoom()) * 0.7;
          feats.forEach((f) => {
            const id = f.properties.cluster_id;
            if (seen.has(id)) return;
            seen.add(id);
            const pt = map.project(f.geometry.coordinates);
            const n = Number(f.properties.point_count) || 0;
            let label = String(n);
            if (n >= 10000) label = Math.round(n / 1000) + "k";
            else if (n >= 1000) label = (n / 1000).toFixed(1).replace(".", ",") + "k";
            parts.push(
              `<b style="transform:translate(${pt.x}px,${pt.y - lift}px) translate(-50%,-50%)">${label}</b>`
            );
          });
          badges.innerHTML = parts.join("");
        };
        let badgeFrame = 0;
        const queueBadges = () => {
          if (badgeFrame) return;
          badgeFrame = requestAnimationFrame(() => {
            badgeFrame = 0;
            syncBadges();
          });
        };
        const hitLayers = () => ["clusters", "sites", "mine"].filter((id) => map.getLayer(id));
        const flyIn = (center, zoom) => {
          map.easeTo({
            center,
            zoom: Math.min(Math.max(zoom, map.getZoom() + 0.6), 16.5),
            pitch: zoom >= 6 ? 30 : 12,
            duration: 950,
            essential: true,
          });
        };
        const armGlobe = () => {
          if (worldGlobe !== map || map.getSource("dives")) return;
          if (status) status.textContent = "Preparo le bandierine…";
          try {
            map.setProjection({ type: "globe" });
          } catch {
            try {
              map.setProjection("globe");
            } catch {
              /* resta la proiezione dello stile */
            }
          }
          try {
            map.setFog({
              range: [0.8, 8],
              color: "rgba(186, 210, 235, 0.45)",
              "high-color": "rgba(36, 92, 180, 0.35)",
              "space-color": "#061018",
              "horizon-blend": 0.08,
              "star-intensity": 0.2,
            });
          } catch {
            /* il globo resta visibile anche senza atmosfera */
          }
          try {
          [
            ["flag-vh", "#00AA00", "rgba(255,255,255,0.95)"],
            ["flag-hi", "#FFD700", "rgba(255,255,255,0.95)"],
            ["flag-md", "#FF8C00", "rgba(255,255,255,0.95)"],
            ["flag-lo", "#DC143C", "rgba(255,255,255,0.95)"],
            ["flag-mine", "#f4f7fb", "#8b95a1"],
          ].forEach(([id, color, stripe]) => {
            if (!map.hasImage(id)) map.addImage(id, makeFlagImage(color, stripe), { pixelRatio: 2 });
          });
          const iconSize = ["interpolate", ["linear"], ["zoom"], 1, 0.82, 6, 0.92, 12, 1];
          map.addSource("dives", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
            cluster: true,
            clusterRadius: 58,
            clusterMaxZoom: 14,
            clusterProperties: { maxc: ["max", ["get", "c"]] },
          });
          map.addSource("mine", { type: "geojson", data: personalDiveGeo() });
          map.addLayer({
            id: "clusters",
            type: "symbol",
            source: "dives",
            filter: ["has", "point_count"],
            layout: {
              "icon-image": ["step", ["get", "maxc"], "flag-lo", 10, "flag-md", 50, "flag-hi", 100, "flag-vh"],
              "icon-size": iconSize,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });
          map.addLayer({
            id: "sites",
            type: "symbol",
            source: "dives",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "icon-image": ["step", ["get", "c"], "flag-lo", 10, "flag-md", 50, "flag-hi", 100, "flag-vh"],
              "icon-size": iconSize,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });
          map.addLayer({
            id: "mine",
            type: "symbol",
            source: "mine",
            layout: {
              "icon-image": "flag-mine",
              "icon-size": 0.9,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
            },
          });
          ["clusters", "sites", "mine"].forEach((id) => {
            map.on("mouseenter", id, () => {
              map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", id, () => {
              map.getCanvas().style.cursor = "";
            });
          });
          map.on("click", "clusters", async (e) => {
            const feat = e.features?.[0];
            if (!feat) return;
            popup?.remove();
            let zoom = map.getZoom() + 1.8;
            try {
              const expanded = await map.getSource("dives").getClusterExpansionZoom(feat.properties.cluster_id);
              zoom = Math.max(Number(expanded) || zoom, map.getZoom() + 0.8);
            } catch {
              /* avvicina comunque */
            }
            flyIn(feat.geometry.coordinates, zoom);
          });
          map.on("click", "sites", (e) => {
            const feat = e.features?.[0];
            if (!feat) return;
            const coords = feat.geometry.coordinates.slice();
            const lat = Number(coords[1]);
            const lng = Number(coords[0]);
            const dived = (state.dives || []).some((d) => {
              const p = api?.divePoint?.(d);
              return p && haversineMapKm(p, { lat, lng }) <= 3;
            });
            openPopup(
              coords,
              `<div class="globe-pop"><strong>${escapeHtml(feat.properties.n || "Sito")}</strong>${escapeHtml(
                confidencePhrase(feat.properties.c)
              )}${dived ? "<br>Già nel diario" : ""}<br>${lat.toFixed(4)}, ${lng.toFixed(
                4
              )}<br><a href="https://dive-sites.net/" target="_blank" rel="noopener">dive-sites.net</a></div>`
            );
            if (map.getZoom() < 15) flyIn(coords, Math.max(map.getZoom(), 15));
          });
          map.on("click", "mine", (e) => {
            const feat = e.features?.[0];
            if (!feat) return;
            const coords = feat.geometry.coordinates.slice();
            const where = feat.properties.country ? escapeHtml(feat.properties.country) + "<br>" : "";
            const note = Number(feat.properties.done) ? "Già nel diario" : "Sito aggiunto da te";
            openPopup(
              coords,
              `<div class="globe-pop"><strong>${escapeHtml(feat.properties.n || "Sito tuo")}</strong>${where}${note}</div>`
            );
            if (map.getZoom() < 13) flyIn(coords, 13.5);
          });
          map.on("click", (e) => {
            if (map.queryRenderedFeatures(e.point, { layers: hitLayers() }).length) return;
            const lat = e.lngLat.lat.toFixed(5);
            const lng = e.lngLat.lng.toFixed(5);
            mapPick = { lat, lng, name: "", country: "" };
            dock.open = true;
            const latEl = form.querySelector("[name=lat]");
            const lngEl = form.querySelector("[name=lng]");
            if (latEl) latEl.value = lat;
            if (lngEl) lngEl.value = lng;
            const hint = form.querySelector("[data-maphint]");
            if (hint) hint.textContent = "Punto preso. Dai un nome e salva.";
          });
          map.on("render", queueBadges);
          loadDivelogsGeo().then((geo) => {
            if (worldGlobe !== map) return;
            const src = map.getSource("dives");
            if (src) src.setData(geo);
            const n = geo.features.length;
            if (status) {
              status.textContent = n
                ? n.toLocaleString("it-IT") + " siti"
                : "Punti non caricati.";
            }
          });
          [80, 300, 700].forEach((ms) => setTimeout(() => worldGlobe === map && map.resize(), ms));
          } catch (err) {
            if (status) status.textContent = err && err.message ? err.message : "Mappa non pronta.";
          }
        };
        map.on("error", (ev) => {
          const message = ev?.error?.message || "";
          if (!status || !message) return;
          const current = status.textContent || "";
          if (current.includes("siti sul globo") || current.includes("Preparo")) return;
          status.textContent = message;
        });
        try {
          map.setProjection({ type: "globe" });
        } catch {
          /* proiezione impostata dallo stile */
        }
        if (map.isStyleLoaded()) armGlobe();
        else map.on("load", armGlobe);
        map.on("idle", armGlobe);
      })
      .catch((err) => {
        if (el) el.innerHTML = `<p class="hint" style="padding:14px">${escapeHtml(err.message || "Mappa non disponibile.")}</p>`;
      });
  });
  return frag;
}

function renderHome() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("", "home"));
  const t = totals();
  const last = [...state.dives].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const years = divesByYear();
  const maxY = Math.max(1, ...years.map((y) => y.n));
  const dash = document.createElement("section");
  dash.className = "kpi-grid";
  dash.innerHTML = `
    <button class="kpi" type="button" data-go="log">
      <p>Registrate <span>~</span></p>
      <strong>${t.n}</strong>
      <em>immersioni</em>
    </button>
    <button class="kpi" type="button" data-go="stats">
      <p>Tempo di fondo <span>◷</span></p>
      <strong>${fmtMins(t.mins)}</strong>
      <em>in acqua</em>
    </button>
    <button class="kpi" type="button" data-go="log">
      <p>Ultima immersione <span>◷</span></p>
      <strong>${last ? fmtItDate(last.date) : "—"}</strong>
    </button>
    <button class="kpi" type="button" data-go="stats">
      <p>SAC medio <span>◎</span></p>
      <strong>${avgSac()}</strong>
      ${avgSac() !== "—" ? "<em>L/min</em>" : ""}
    </button>
    <button class="kpi" type="button" data-go="log">
      <p>Profondità max <span>▼</span></p>
      <strong>${t.max > 0 ? fmtDepth(t.max) : "—"}</strong>
      ${t.max > 0 ? "<em>metri</em>" : ""}
    </button>
    <button class="kpi kpi-chart" type="button" data-go="stats">
      <p>Immersioni per anno <span>▣</span></p>
      <div class="year-chart">
        ${years
          .map(
            (y) => `<div class="yb">
              <i style="height:${Math.max(8, (y.n / maxY) * 72)}px"></i>
              <b>${y.n || ""}</b>
              <small>${y.label}</small>
            </div>`
          )
          .join("")}
      </div>
    </button>
  `;
  dash.querySelectorAll("[data-go]").forEach((b) => {
    b.onclick = () => {
      view = { ...view, name: b.dataset.go };
      render();
    };
  });
  frag.append(dash);
  const vault = document.createElement("p");
  vault.className = "hint vault-home";
  vault.textContent = vaultStatusLine();
  frag.append(vault);

  const listWrap = document.createElement("section");
  listWrap.className = "section feed";
  listWrap.innerHTML = `<div class="section-head"><h3>Le tue immersioni</h3></div>`;
  const recent = [...state.dives].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 8);
  if (!recent.length) listWrap.append(emptyState());
  else {
    const ul = document.createElement("div");
    ul.className = "dive-list";
    recent.forEach((d) => ul.append(diveCard(d)));
    listWrap.append(ul);
  }
  frag.append(listWrap);
  return frag;
}

function emptyState() {
  const d = document.createElement("div");
  d.className = "card empty";
  d.innerHTML = `<p>Il logbook è ancora aperto sulla prima pagina.</p>
    <button class="btn primary" type="button">Registra la prima immersione</button>`;
  d.querySelector("button").onclick = startNew;
  return d;
}

function diveCard(d) {
  applyDiveMetrics(d);
  const art = document.createElement("article");
  const map = satMapHtml(d, "sat-place bare");
  const dur = diveDuration(d);
  const pts = ensureThermoProfile(d);
  const thermo = thermoPoints(pts);
  const temps = thermo.map(pointTemp);
  const tMin = temps.length ? Math.min(...temps) : null;
  const tMax = temps.length ? Math.max(...temps) : null;
  const tLabel = tMin != null ? (tMin === tMax ? `${fmtDepth(tMin)} °C` : `${fmtDepth(tMin)}–${fmtDepth(tMax)} °C`) : "";
  art.className = "log-card";
  art.innerHTML = `
    <header class="log-head">
      <div>
        <h3>${escapeHtml(d.site || "Sito da nominare")}</h3>
        <p>#${escapeHtml(d.number)} · ${escapeHtml(fmtItDateLong(d.date))}${d.timeIn ? " · " + escapeHtml(d.timeIn) : ""} · ${escapeHtml(d.location || "—")}</p>
      </div>
      <button class="btn danger log-del" type="button" data-deldive>Elimina</button>
    </header>
    <div class="log-kpis">
      <div><small>Profondità max</small><b>${fmtDepth(d.maxDepth)} m</b></div>
      <div><small>Durata</small><b>${dur ? dur + " min" : "—"}</b></div>
      ${d.ascentRate ? `<div><small>Risalita</small><b class="${ascentClass(d.ascentRate)}">${fmtDepth(d.ascentRate)} m/min</b></div>` : ""}
      <div><small>Acqua</small><b>${d.waterTemp ? fmtDepth(d.waterTemp) + " °C" : "—"}</b></div>
      ${d.totalTime ? `<div><small>Durata tot.</small><b>${escapeHtml(d.totalTime)} min</b></div>` : ""}
    </div>
    <div class="log-viz">
      <div class="log-profile">
        <span>${thermo.length >= 3 ? "Profondità + temp" : "Profilo profondità"}</span>
        <canvas class="spark"></canvas>
        <strong>${fmtDepth(d.maxDepth)} m</strong>
      </div>
      <div class="log-map">${map || (d.photo ? `<img alt="" src="${d.photo}" />` : `<div class="map-fallback">Mappa</div>`)}</div>
      <div class="log-thermo">
        <span>Temperatura / profondità</span>
        <canvas class="thermo"></canvas>
        <strong>${escapeHtml(tLabel || (d.bottomTemp ? d.bottomTemp + " °C fondo" : "—"))}</strong>
      </div>
    </div>
    ${effortHtml(d, true)}
  `;
  art.querySelector("[data-deldive]").onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!(await removeDive(d))) return;
    render();
  };
  art.onclick = () => {
    view = { name: "detail", diveId: d.id, draft: null, query: view.query };
    render();
  };
  queueMicrotask(() => {
    const c = art.querySelector("canvas.spark");
    const drawn = ensureThermoProfile(d);
    if (c) drawSpark(c, drawn);
    const th = art.querySelector("canvas.thermo");
    if (th) drawTempDepth(th, drawn);
  });
  return art;
}

function fillOcean(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#9fd4f0");
  g.addColorStop(0.18, "#4aa3d4");
  g.addColorStop(0.48, "#1c5f9a");
  g.addColorStop(0.78, "#0c3260");
  g.addColorStop(1, "#04101f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function profileExtent(pts) {
  const maxT = Math.max(0.5, ...pts.map((p) => Number(p.t) || 0));
  const rawD = Math.max(1, ...pts.map((p) => Number(p.d) || 0));
  const maxD = Math.max(5, Math.ceil((rawD * 1.04) / 5) * 5);
  return { maxT: maxT * 1.01, maxD };
}

function drawSpark(canvas, points) {
  const pts = [...(points || [])].sort((a, b) => a.t - b.t);
  const r = canvas.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(r.width * dpr));
  canvas.height = Math.max(1, Math.floor(r.height * dpr));
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  fillOcean(ctx, w, h);
  if (!pts.length) return;
  const { maxT, maxD } = profileExtent(pts);
  const x = (t) => (t / maxT) * w;
  const y = (d) => (d / maxD) * h * 0.86 + h * 0.08;
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(x(p.t), y(p.d)) : ctx.moveTo(x(p.t), y(p.d))));
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2 * dpr;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.lineTo(x(pts[pts.length - 1].t), h);
  ctx.lineTo(x(pts[0].t), h);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  let deep = pts[0];
  pts.forEach((p) => {
    if (p.d >= deep.d) deep = p;
  });
  ctx.beginPath();
  ctx.arc(x(deep.t), y(deep.d), 5 * dpr, 0, Math.PI * 2);
  ctx.fillStyle = "#3dcf6a";
  ctx.fill();
  const temps = pts.map(pointTemp).filter((n) => n != null);
  if (temps.length >= 3) {
    const lo = Math.min(...temps) - 0.4;
    const hi = Math.max(...temps) + 0.4;
    const yT = (c) => h - ((c - lo) / Math.max(0.6, hi - lo)) * h * 0.72 - h * 0.1;
    ctx.beginPath();
    let started = false;
    pts.forEach((p) => {
      const c = pointTemp(p);
      if (c == null) return;
      if (!started) {
        ctx.moveTo(x(p.t), yT(c));
        started = true;
      } else ctx.lineTo(x(p.t), yT(c));
    });
    ctx.strokeStyle = "#ffb45a";
    ctx.lineWidth = 2 * dpr;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}

function drawTempDepth(canvas, points) {
  if (!canvas) return;
  const pts = thermoPoints(points);
  const r = canvas.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(r.width * dpr));
  canvas.height = Math.max(1, Math.floor(r.height * dpr));
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  fillOcean(ctx, w, h);
  if (pts.length < 2) return;
  const temps = pts.map(pointTemp);
  const minC = Math.min(...temps) - 0.5;
  const maxC = Math.max(...temps) + 0.5;
  const maxD = Math.max(1, ...pts.map((p) => Number(p.d))) * 1.08;
  const padL = 8 * dpr;
  const padR = 8 * dpr;
  const padT = 22 * dpr;
  const padB = 22 * dpr;
  const x = (c) => padL + ((c - minC) / Math.max(0.6, maxC - minC)) * (w - padL - padR);
  const y = (d) => padT + (Number(d) / maxD) * (h - padT - padB);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = dpr;
  for (let i = 1; i < 4; i++) {
    const yy = padT + ((h - padT - padB) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, yy);
    ctx.lineTo(w - padR, yy);
    ctx.stroke();
  }
  ctx.beginPath();
  pts.forEach((p, i) => {
    const fn = i ? "lineTo" : "moveTo";
    ctx[fn](x(pointTemp(p)), y(p.d));
  });
  ctx.strokeStyle = "#ffb45a";
  ctx.lineWidth = 2.2 * dpr;
  ctx.lineJoin = "round";
  ctx.stroke();
  const deep = pts.reduce((a, p) => (p.d >= a.d ? p : a), pts[0]);
  ctx.beginPath();
  ctx.arc(x(pointTemp(deep)), y(deep.d), 4.5 * dpr, 0, Math.PI * 2);
  ctx.fillStyle = "#3dcf6a";
  ctx.fill();
}

let bioThumbGen = 0;
let bioPhotoSearch = null;
let bioPhotoToken = 0;
const bioVectorCache = new Map();

function photoColorName(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2 / 255;
  const sat = max === 0 ? 0 : (max - min) / max;
  if (light < 0.12) return "nero";
  if (sat < 0.14) {
    if (light > 0.8) return "bianco";
    if (light < 0.28) return "nero";
    return "grigio";
  }
  let hue = 0;
  const delta = max - min || 1;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  if (hue < 0) hue += 360;
  if (hue < 18 || hue >= 345) return "rosso";
  if (hue < 45) return light < 0.42 ? "bruno" : "arancio";
  if (hue < 70) return light < 0.35 ? "bruno" : "giallo";
  if (hue < 165) return sat < 0.28 && light < 0.45 ? "bruno" : "verde";
  if (hue < 255) return "blu";
  if (hue < 320) return "viola";
  return "rosa";
}

function photoFeatureVector(data, w, h, box, mask, closeup, framed, spotRatio) {
  const minX = box.minX;
  const minY = box.minY;
  const maxX = box.maxX;
  const maxY = box.maxY;
  const bw = Math.max(1, maxX - minX + 1);
  const bh = Math.max(1, maxY - minY + 1);
  const useMask = !closeup && framed && mask;
  const hueHist = new Float64Array(8);
  let hueN = 0;
  let white = 0;
  let gray = 0;
  let black = 0;
  let counted = 0;
  const grid = new Float64Array(27);
  const gridN = new Float64Array(9);
  const lum = new Float32Array(w * h);
  const take = (x, y) => !useMask || mask[y * w + x];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (!take(x, y)) continue;
      const p = y * w + x;
      const o = p * 4;
      const r = data[o] / 255;
      const g = data[o + 1] / 255;
      const b = data[o + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const spread = max - min;
      const sat = max === 0 ? 0 : spread / max;
      lum[p] = 0.3 * data[o] + 0.59 * data[o + 1] + 0.11 * data[o + 2];
      counted += 1;
      if (max < 0.18) black += 1;
      else if (sat < 0.18 && max > 0.72) white += 1;
      else if (sat < 0.18) gray += 1;
      else {
        let hue = 0;
        if (max === r) hue = ((g - b) / spread) % 6;
        else if (max === g) hue = (b - r) / spread + 2;
        else hue = (r - g) / spread + 4;
        hue = (hue * 60 + 360) % 360;
        hueHist[Math.min(7, Math.floor(hue / 45))] += 1;
        hueN += 1;
      }
      const gx = Math.min(2, Math.floor(((x - minX) / bw) * 3));
      const gy = Math.min(2, Math.floor(((y - minY) / bh) * 3));
      const cell = gy * 3 + gx;
      grid[cell * 3] += r;
      grid[cell * 3 + 1] += g;
      grid[cell * 3 + 2] += b;
      gridN[cell] += 1;
    }
  }
  const vec = [];
  for (let i = 0; i < 8; i += 1) vec.push(hueN ? hueHist[i] / hueN : 0);
  vec.push(counted ? white / counted : 0, counted ? gray / counted : 0, counted ? black / counted : 0);
  for (let cell = 0; cell < 9; cell += 1) {
    const n = gridN[cell] || 1;
    vec.push(gridN[cell] ? grid[cell * 3] / n : 0);
    vec.push(gridN[cell] ? grid[cell * 3 + 1] / n : 0);
    vec.push(gridN[cell] ? grid[cell * 3 + 2] / n : 0);
  }
  let vertical = 0;
  let horizontal = 0;
  let diagonal = 0;
  let edges = 0;
  for (let y = minY; y < maxY; y += 1) {
    for (let x = minX; x < maxX; x += 1) {
      const p = y * w + x;
      if (!take(x, y) || !take(x + 1, y) || !take(x, y + 1)) continue;
      const dh = Math.abs(lum[p + 1] - lum[p]);
      const dv = Math.abs(lum[p + w] - lum[p]);
      if (dh + dv < 18) continue;
      edges += 1;
      if (dh > dv * 1.35) vertical += 1;
      else if (dv > dh * 1.35) horizontal += 1;
      else diagonal += 1;
    }
  }
  const aspect = bw / bh;
  vec.push(Math.min(aspect, 3) / 3);
  vec.push(Math.min(1, counted / (bw * bh)));
  vec.push(edges ? vertical / edges : 0, edges ? horizontal / edges : 0, edges ? diagonal / edges : 0);
  vec.push(counted ? Math.min(1, edges / counted) : 0);
  vec.push(Math.max(0, Math.min(1, spotRatio || 0)));
  return vec;
}

function readPhotoSignals(bitmap) {
  const maxSide = 120;
  const scale = maxSide / Math.max(bitmap.width, bitmap.height, 1);
  const w = Math.max(12, Math.round(bitmap.width * scale));
  const h = Math.max(12, Math.round(bitmap.height * scale));
  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const ctx = work.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const count = w * h;
  const rgbAt = (p) => [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]];
  const gap = (a, b) => {
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    return Math.sqrt(dr * dr * 0.45 + dg * dg + db * db * 0.75);
  };
  const border = [];
  const step = Math.max(1, Math.floor(Math.min(w, h) / 18));
  for (let x = 0; x < w; x += step) border.push(rgbAt(x), rgbAt((h - 1) * w + x));
  for (let y = step; y < h - 1; y += step) border.push(rgbAt(y * w), rgbAt(y * w + w - 1));
  const buckets = new Map();
  border.forEach(([r, g, b]) => {
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    const row = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    row.r += r;
    row.g += g;
    row.b += b;
    row.n += 1;
    buckets.set(key, row);
  });
  let palette = [...buckets.values()]
    .filter((row) => row.n / border.length >= 0.08)
    .map((row) => [row.r / row.n, row.g / row.n, row.b / row.n]);
  if (!palette.length) {
    const sum = border.reduce((acc, px) => [acc[0] + px[0], acc[1] + px[1], acc[2] + px[2]], [0, 0, 0]);
    palette = [[sum[0] / border.length, sum[1] / border.length, sum[2] / border.length]];
  }
  const nearest = (px) => palette.reduce((best, color) => Math.min(best, gap(px, color)), 1e9);
  const borderGaps = border.map(nearest).sort((a, b) => a - b);
  const threshold = Math.max(26, Math.min(58, (borderGaps[Math.floor(borderGaps.length * 0.8)] || 12) * 2.4 + 16));
  const raw = new Uint8Array(count);
  const seen = new Uint8Array(count);
  const queue = [];
  for (let x = 0; x < w; x += 1) queue.push(x, (h - 1) * w + x);
  for (let y = 1; y < h - 1; y += 1) queue.push(y * w, y * w + w - 1);
  queue.forEach((p) => {
    seen[p] = 1;
  });
  for (let head = 0; head < queue.length; head += 1) {
    const p = queue[head];
    const x = p % w;
    const y = (p - x) / w;
    const next = [];
    if (x > 0) next.push(p - 1);
    if (x + 1 < w) next.push(p + 1);
    if (y > 0) next.push(p - w);
    if (y + 1 < h) next.push(p + w);
    next.forEach((q) => {
      if (seen[q] || nearest(rgbAt(q)) > threshold) return;
      seen[q] = 1;
      queue.push(q);
    });
  }
  for (let p = 0; p < count; p += 1) if (!seen[p]) raw[p] = 1;
  const mask = new Uint8Array(count);
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const p = y * w + x;
      if (!raw[p]) continue;
      let near = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) near += raw[p + dy * w + dx];
      }
      if (near >= 4) mask[p] = 1;
    }
  }
  const visited = new Uint8Array(count);
  const parts = [];
  for (let p = 0; p < count; p += 1) {
    if (!mask[p] || visited[p]) continue;
    const stack = [p];
    visited[p] = 1;
    let n = 0;
    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    while (stack.length) {
      const q = stack.pop();
      n += 1;
      const x = q % w;
      const y = (q - x) / w;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (x > 0 && mask[q - 1] && !visited[q - 1]) {
        visited[q - 1] = 1;
        stack.push(q - 1);
      }
      if (x + 1 < w && mask[q + 1] && !visited[q + 1]) {
        visited[q + 1] = 1;
        stack.push(q + 1);
      }
      if (y > 0 && mask[q - w] && !visited[q - w]) {
        visited[q - w] = 1;
        stack.push(q - w);
      }
      if (y + 1 < h && mask[q + w] && !visited[q + w]) {
        visited[q + w] = 1;
        stack.push(q + w);
      }
    }
    parts.push({ n, minX, minY, maxX, maxY });
  }
  parts.sort((a, b) => b.n - a.n);
  const kept = parts.filter((part) => part.n / count >= 0.03);
  const subject = kept.length ? kept : parts.filter((part) => part.n / count >= 0.018).slice(0, 1);
  let framed = subject.length > 0;
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  subject.forEach((part) => {
    if (part.minX < minX) minX = part.minX;
    if (part.minY < minY) minY = part.minY;
    if (part.maxX > maxX) maxX = part.maxX;
    if (part.maxY > maxY) maxY = part.maxY;
  });
  if (!framed) {
    const side = Math.round(Math.min(w, h) * 0.7);
    minX = Math.round((w - side) / 2);
    minY = Math.round((h - side) / 2);
    maxX = minX + side - 1;
    maxY = minY + side - 1;
  }
  const padX = Math.round((maxX - minX + 1) * 0.14);
  const padY = Math.round((maxY - minY + 1) * 0.14);
  minX = Math.max(0, minX - padX);
  minY = Math.max(0, minY - padY);
  maxX = Math.min(w - 1, maxX + padX);
  maxY = Math.min(h - 1, maxY + padY);
  let absorbed = 0;
  for (let p = 0; p < count; p += 1) if (seen[p]) absorbed += 1;
  const closeup = !framed && absorbed / count >= 0.72;
  if (closeup) {
    framed = true;
    minX = Math.round(w * 0.06);
    minY = Math.round(h * 0.06);
    maxX = Math.max(minX + 1, Math.round(w * 0.94) - 1);
    maxY = Math.max(minY + 1, Math.round(h * 0.94) - 1);
  }
  const bins = {
    rosso: 0, arancio: 0, giallo: 0, verde: 0, blu: 0, viola: 0, rosa: 0, bianco: 0, nero: 0, bruno: 0, grigio: 0,
  };
  const lum = new Float32Array(count);
  let used = 0;
  const bgNames = new Set(palette.map((px) => photoColorName(px[0], px[1], px[2])));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const p = y * w + x;
      const px = rgbAt(p);
      lum[p] = 0.3 * px[0] + 0.59 * px[1] + 0.11 * px[2];
      if (!closeup && framed && !mask[p]) continue;
      if (!closeup && framed && nearest(px) <= threshold * 0.72) continue;
      bins[photoColorName(px[0], px[1], px[2])] += 1;
      used += 1;
    }
  }
  if (used < 12) {
    used = 0;
    Object.keys(bins).forEach((name) => {
      bins[name] = 0;
    });
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const px = rgbAt(y * w + x);
        bins[photoColorName(px[0], px[1], px[2])] += 1;
        used += 1;
      }
    }
  }
  let colors = Object.entries(bins)
    .filter(([, n]) => used > 0 && n / used >= 0.08)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
  const dull = new Set(["grigio", "nero", "bruno", "bianco"]);
  const vivid = colors.filter((name) => !dull.has(name) && !bgNames.has(name));
  if (colors.length && (dull.has(colors[0]) || bgNames.has(colors[0])) && vivid.length) {
    colors = [...vivid, ...colors.filter((name) => !vivid.includes(name))];
  }
  const withoutBg = colors.filter((name) => !bgNames.has(name));
  if (!closeup && withoutBg.length) colors = withoutBg;
  colors = colors.slice(0, 3);
  const axis = (horizontal) => {
    const values = [];
    const from = horizontal ? minX : minY;
    const to = horizontal ? maxX : maxY;
    for (let i = from; i <= to; i += 1) {
      let sum = 0;
      let n = 0;
      if (horizontal) {
        for (let y = minY; y <= maxY; y += 1) {
          const p = y * w + i;
          if (!closeup && framed && !mask[p]) continue;
          sum += lum[p];
          n += 1;
        }
      } else {
        for (let x = minX; x <= maxX; x += 1) {
          const p = i * w + x;
          if (!closeup && framed && !mask[p]) continue;
          sum += lum[p];
          n += 1;
        }
      }
      if (n) values.push(sum / n);
    }
    let flips = 0;
    let prev = 0;
    for (let i = 1; i < values.length; i += 1) {
      const delta = values[i] - values[i - 1];
      if (Math.abs(delta) < 6) continue;
      const sign = Math.sign(delta);
      if (prev && sign !== prev) flips += 1;
      prev = sign;
    }
    return flips;
  };
  let peaks = 0;
  let samples = 0;
  for (let y = minY + 2; y <= maxY - 2; y += 2) {
    for (let x = minX + 2; x <= maxX - 2; x += 2) {
      const p = y * w + x;
      if (!closeup && framed && !mask[p]) continue;
      samples += 1;
      const around = (lum[p - w * 2] + lum[p + w * 2] + lum[p - 2] + lum[p + 2]) / 4;
      if (Math.abs(lum[p] - around) > 32) peaks += 1;
    }
  }
  const patterns = [];
  const colFlips = axis(true);
  const rowFlips = axis(false);
  if (Math.max(colFlips, rowFlips) >= 3 && Math.max(colFlips, rowFlips) > Math.min(colFlips, rowFlips) * 1.3) patterns.push("bande");
  if (samples > 8 && peaks / samples > 0.14 && !patterns.includes("bande")) patterns.push("macchie");
  const aspect = (maxX - minX + 1) / Math.max(1, maxY - minY + 1);
  const shape = [];
  if (aspect >= 1.65) shape.push("lungo");
  if (aspect <= 0.72) shape.push("alto");
  const vector = photoFeatureVector(
    data,
    w,
    h,
    { minX, minY, maxX, maxY },
    mask,
    closeup,
    framed,
    samples > 8 ? peaks / samples : 0,
  );
  const sx = minX * (bitmap.width / w);
  const sy = minY * (bitmap.height / h);
  const sw = Math.max(1, (maxX - minX + 1) * (bitmap.width / w));
  const sh = Math.max(1, (maxY - minY + 1) * (bitmap.height / h));
  const long = Math.max(sw, sh);
  const shot = document.createElement("canvas");
  shot.width = Math.max(1, Math.round(160 * (sw / long)));
  shot.height = Math.max(1, Math.round(160 * (sh / long)));
  shot.getContext("2d").drawImage(bitmap, sx, sy, sw, sh, 0, 0, shot.width, shot.height);
  if (colors.length) framed = true;
  return {
    colors,
    patterns,
    shape,
    framed,
    vector,
    box: { sx, sy, sw, sh },
    preview: shot.toDataURL("image/jpeg", 0.8),
  };
}

function subjectPhotoCanvas(bitmap, signals) {
  const box = signals?.box;
  if (!bitmap || !box) return null;
  const sx = Math.max(0, Math.round(box.sx));
  const sy = Math.max(0, Math.round(box.sy));
  const sw = Math.max(1, Math.round(Math.min(box.sw, bitmap.width - sx)));
  const sh = Math.max(1, Math.round(Math.min(box.sh, bitmap.height - sy)));
  const cover = (sw * sh) / Math.max(1, bitmap.width * bitmap.height);
  if (cover > 0.86) return null;
  const fit = Math.min(1, 512 / Math.max(sw, sh));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sw * fit));
  canvas.height = Math.max(1, Math.round(sh * fit));
  canvas.getContext("2d").drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function bioPhotoHint() {
  return "Isolo il soggetto, senza lo sfondo, e lo confronto online.";
}

let lifeClipPromise = null;
let lifeClipStatus = () => {};

function loadLifeClip() {
  if (!lifeClipPromise) {
    lifeClipPromise = import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1")
      .then(({ pipeline }) => pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", {
        dtype: "q8",
        progress_callback: (data) => {
          if (!data) return;
          if (data.status === "progress" && data.total) {
            lifeClipStatus(`Scarico il riconoscimento del soggetto… ${Math.min(100, Math.round((100 * data.loaded) / data.total))}%`);
          } else if (data.status === "initiate") {
            lifeClipStatus("Scarico il riconoscimento del soggetto. La prima volta può volerci un po'.");
          }
        },
      }))
      .catch((err) => {
        lifeClipPromise = null;
        throw err;
      });
  }
  return lifeClipPromise;
}

let lifeEmbedPromise = null;
const fishEmbedCache = new Map();

function loadLifeEmbed() {
  if (!lifeEmbedPromise) {
    lifeEmbedPromise = import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1")
      .then(({ pipeline }) => pipeline("image-feature-extraction", "Xenova/siglip-base-patch16-224", {
        dtype: "q4",
        progress_callback: (data) => {
          if (!data) return;
          if (data.status === "progress" && data.total) {
            lifeClipStatus(`Scarico il confronto del soggetto… ${Math.min(100, Math.round((100 * data.loaded) / data.total))}%`);
          } else if (data.status === "initiate") {
            lifeClipStatus("Scarico il confronto del soggetto. La prima volta può volerci un po'.");
          }
        },
      }))
      .catch((err) => {
        lifeEmbedPromise = null;
        throw err;
      });
  }
  return lifeEmbedPromise;
}

let lifeEmbedTail = Promise.resolve();

function withLifeEmbed(task) {
  const run = lifeEmbedTail.then(task, task);
  lifeEmbedTail = run.then(() => {}, () => {});
  return run;
}

function embedVector(out) {
  const data = out?.data;
  if (!data?.length) return null;
  const dims = out.dims || [];
  let seq = 0;
  let hidden = 0;
  if (dims.length === 3) {
    seq = dims[1];
    hidden = dims[2];
  } else if (dims.length === 2 && dims[0] > 1) {
    seq = dims[0];
    hidden = dims[1];
  }
  if (!(seq > 1 && hidden > 32 && data.length === seq * hidden)) return Array.from(data);
  const acc = new Array(hidden).fill(0);
  for (let i = 0; i < seq; i += 1) {
    const base = i * hidden;
    for (let j = 0; j < hidden; j += 1) acc[j] += data[base + j];
  }
  const scale = 1 / seq;
  for (let j = 0; j < hidden; j += 1) acc[j] *= scale;
  return acc;
}

function cosineVec(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na < 1e-8 || nb < 1e-8) return 0;
  return dot / Math.sqrt(na * nb);
}

async function speciesEmbed(extractor, species) {
  if (fishEmbedCache.has(species.id)) return fishEmbedCache.get(species.id);
  let src = "";
  try {
    src = await guideThumbUrl(species);
  } catch {
    src = "";
  }
  if (!src) {
    fishEmbedCache.set(species.id, null);
    return null;
  }
  try {
    const out = await withLifeEmbed(() => extractor(src));
    const vec = embedVector(out);
    if (!vec) return null;
    fishEmbedCache.set(species.id, vec);
    return vec;
  } catch {
    return null;
  }
}

async function rankSubjectByPhotos(image, species, token) {
  const list = (species || []).filter((row) => row?.id);
  if (!list.length) return null;
  lifeClipStatus("Carico il confronto del soggetto…");
  const extractor = await loadLifeEmbed();
  if (token !== bioPhotoToken) return null;
  const query = embedVector(await withLifeEmbed(() => extractor(image)));
  if (!query) return null;
  const scored = [];
  let cursor = 0;
  const step = async () => {
    while (cursor < list.length) {
      const index = cursor;
      cursor += 1;
      if (token !== bioPhotoToken) return;
      if (index % 4 === 0) lifeClipStatus(`Confronto il soggetto online… ${Math.min(list.length, index + 1)}/${list.length}`);
      const vec = await speciesEmbed(extractor, list[index]);
      if (!vec) continue;
      scored.push({ species: list[index], score: cosineVec(query, vec) });
    }
  };
  await Promise.all(Array.from({ length: Math.min(3, list.length) }, () => step()));
  if (token !== bioPhotoToken || !scored.length) return null;
  scored.sort((a, b) => b.score - a.score || a.species.it.localeCompare(b.species.it, "it"));
  const best = scored[0];
  const near = scored.filter((row, index) => index === 0 || best.score - row.score <= 0.025).slice(0, 4);
  const rows = near.map((row) => row.species);
  const hint = `Sembra ${best.species.it}, ${best.species.la}.`;
  return { rows, hint };
}

function speciesInPhotoClass(chosen) {
  const life = window.SeaDiveBiology.MARINE_LIFE || [];
  if (chosen?.id === "pesce") return life.filter((row) => row.group === "pesci");
  const rows = [];
  const seen = new Set();
  (chosen?.kinds || []).forEach((kind) => {
    (window.SeaDiveBiology.speciesForPhotoKind(kind) || []).forEach((row) => {
      if (seen.has(row.id)) return;
      seen.add(row.id);
      rows.push(row);
    });
  });
  return rows;
}

async function clipBest(classifier, image, items, labelOf) {
  const labels = items.map(labelOf);
  const ranked = await classifier(image, labels);
  const score = new Map((Array.isArray(ranked) ? ranked : []).map((row) => [row.label, Number(row.score) || 0]));
  let best = items[0];
  let bestScore = -1;
  items.forEach((item) => {
    const value = score.get(labelOf(item)) || 0;
    if (value > bestScore) {
      best = item;
      bestScore = value;
    }
  });
  return { best, score: bestScore, scores: score };
}

async function recognizePhotoSubject(image, signals, token, focusImage) {
  lifeClipStatus = (text) => {
    if (token !== bioPhotoToken || !bioPhotoSearch) return;
    bioPhotoSearch.hint = text;
    const hint = document.querySelector("[data-biophotohint]");
    if (hint) hint.textContent = text;
  };
  lifeClipStatus("Preparo il riconoscimento del soggetto…");
  const classifier = await loadLifeClip();
  if (token !== bioPhotoToken) return null;
  const classes = window.SeaDiveBiology.LIFE_PHOTO_CLASSES || [];
  const fishClass = classes.find((row) => row.id === "pesce");
  const shots = [focusImage || image, !focusImage && signals?.framed ? signals.preview : ""].filter(Boolean);
  const background = new Set(["corallo", "spugna", "pianta", "verme", "conchiglia", "echinoderma"]);
  let topClass = classes[0];
  let topScore = -1;
  let topImage = image;
  let fishScore = -1;
  let fishImage = image;
  lifeClipStatus("Guardo che soggetto c’è nella foto…");
  for (const shot of shots) {
    if (token !== bioPhotoToken) return null;
    const picked = await clipBest(classifier, shot, classes, (item) => item.prompt || item.label);
    const fish = fishClass ? picked.scores.get(fishClass.prompt || fishClass.label) || 0 : 0;
    if (fish > fishScore) {
      fishScore = fish;
      fishImage = shot;
    }
    if (picked.score > topScore) {
      topScore = picked.score;
      topClass = picked.best;
      topImage = shot;
    }
  }
  let chosen = topClass;
  let chosenImage = topImage;
  if (fishClass && chosen?.id !== "pesce" && background.has(chosen?.id) && fishScore >= topScore * 0.86) {
    chosen = fishClass;
    chosenImage = fishImage;
  }
  if (chosen?.id === "pesce") chosenImage = fishImage;
  const kinds = chosen?.kinds || [];
  if (!kinds.length) return null;
  const photoPool = speciesInPhotoClass(chosen);
  if (photoPool.length) {
    try {
      const ranked = await rankSubjectByPhotos(chosenImage, photoPool, token);
      if (ranked) return ranked;
    } catch {
      /* se il confronto foto non riesce, resta il riconoscimento per tipo */
    }
  }
  const kindPick = await clipBest(classifier, chosenImage, kinds, (item) => item.label);
  const kind = kindPick.best;
  if (token !== bioPhotoToken || !kind) return null;
  let pool = window.SeaDiveBiology.speciesForPhotoKind(kind);
  if (!pool.length) return { rows: [], hint: `Sembra ${kind.phrase}, ma questo soggetto non è nella guida.` };
  const focus = {
    colors: (signals?.colors || []).slice(0, 1),
    patterns: signals?.patterns || [],
    shape: signals?.shape || [],
  };
  const traits = new Map((window.SeaDiveBiology.scoreMarineLifeByPhoto(focus) || []).map((row) => [row.x.id, row.score]));
  const norm = (value) => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const plain = norm(kind.phrase).replace(/^(un|una|uno|il|lo|la)\s+/, "");
  pool = pool.slice().sort((a, b) => {
    const scoreA = (traits.get(a.id) || 0) + (norm(a.it) === plain ? 2 : 0);
    const scoreB = (traits.get(b.id) || 0) + (norm(b.it) === plain ? 2 : 0);
    return scoreB - scoreA || a.it.localeCompare(b.it, "it");
  });
  const rows = pool.length <= 8 ? pool : pool.slice(0, 6);
  const first = rows[0];
  const hint = rows.length === 1
    ? `Sembra ${kind.phrase}: ${first.it}.`
    : `Sembra ${kind.phrase}. Per primo, ${first.it}.`;
  return { rows, hint };
}

function cosineSlice(a, b, from, to) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = from; i < to; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na < 1e-8 || nb < 1e-8) return 0;
  return dot / Math.sqrt(na * nb);
}

function photoVisualScore(a, b) {
  if (!a || !b || a.length !== b.length || !a.length) return 0;
  const color = cosineSlice(a, b, 0, 11);
  const layout = cosineSlice(a, b, 11, 38);
  const form = cosineSlice(a, b, 38, a.length);
  return color * 0.34 + layout * 0.36 + form * 0.3;
}

const bioThumbUrlCache = new Map();
let guideNextAt = 0;

async function guideSlot() {
  const now = Date.now();
  const at = Math.max(now, guideNextAt);
  guideNextAt = at + 90;
  if (at > now) await new Promise((resolve) => setTimeout(resolve, at - now));
}

async function wikiSummary(wiki, title) {
  const url = `https://${wiki}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(title).replace(/ /g, "_"))}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await guideSlot();
    const res = await fetch(url);
    if (res.status === 429) {
      guideNextAt = Date.now() + 2000;
      continue;
    }
    if (!res.ok) return null;
    return res.json();
  }
  throw new Error("rate");
}

async function guideThumbUrl(species) {
  if (bioThumbUrlCache.has(species.id)) return bioThumbUrlCache.get(species.id);
  const titles = [species.la, species.it].filter(Boolean);
  for (const wiki of ["en", "it"]) {
    for (const title of titles) {
      const data = await wikiSummary(wiki, title);
      if (!data || data.type === "disambiguation") continue;
      const src = data.thumbnail?.source || "";
      if (!src) continue;
      bioThumbUrlCache.set(species.id, src);
      return src;
    }
  }
  bioThumbUrlCache.set(species.id, "");
  return "";
}

async function speciesPhotoVector(api, species) {
  if (bioVectorCache.has(species.id)) return bioVectorCache.get(species.id);
  let src = "";
  for (let attempt = 0; attempt < 3 && !src; attempt += 1) {
    try {
      src = await guideThumbUrl(species);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  if (!src) {
    if (bioThumbUrlCache.has(species.id)) bioVectorCache.set(species.id, null);
    return null;
  }
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error("thumb");
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const signals = readPhotoSignals(bitmap);
    bitmap.close?.();
    const vector = signals.vector || null;
    bioVectorCache.set(species.id, vector);
    return vector;
  } catch {
    return null;
  }
}

async function rankPhotoOnGuide(signals, token, onStep) {
  const api = window.SeaDiveBiology;
  const list = api.MARINE_LIFE || [];
  const text = new Map((api.scoreMarineLifeByPhoto?.(signals) || []).map((row) => [row.x.id, row.score]));
  const scored = [];
  let cursor = 0;
  let done = 0;
  const run = async () => {
    while (cursor < list.length) {
      if (token !== bioPhotoToken) return;
      const species = list[cursor];
      cursor += 1;
      let visual = 0;
      try {
        visual = photoVisualScore(signals.vector, await speciesPhotoVector(api, species));
      } catch {
        visual = 0;
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      scored.push({ species, visual, score: visual * 50 + (text.get(species.id) || 0) });
      done += 1;
      if (onStep && (done % 8 === 0 || done === list.length)) onStep(done, list.length);
    }
  };
  await Promise.all([run(), run(), run(), run()]);
  if (token !== bioPhotoToken) return null;
  scored.sort((a, b) => b.score - a.score || a.species.it.localeCompare(b.species.it, "it"));
  const good = scored.filter((row) => row.visual >= 0.36 || (text.get(row.species.id) || 0) >= 5);
  return (good.length >= 4 ? good : scored).slice(0, 16).map((row) => row.species);
}

function bindBioThumbs(root) {
  const api = window.SeaDiveBiology;
  if (!api?.lifeThumb || !root) return;
  const gen = ++bioThumbGen;
  root.querySelectorAll("[data-bioimg]").forEach((img) => {
    const io = new IntersectionObserver(async (entries, obs) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      if (gen !== bioThumbGen) return;
      const src = await api.lifeThumb(img.dataset.la, img.dataset.it);
      if (gen !== bioThumbGen || !src) return;
      img.src = src;
      img.onload = () => {
        img.classList.add("on");
        img.closest(".bio-pic")?.classList.add("has-photo");
      };
    }, { rootMargin: "120px" });
    io.observe(img);
  });
}

function compareSubjectOnGoogle(dataUrl) {
  if (!dataUrl) return;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "soggetto.jpg", { type: "image/jpeg" });
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://lens.google.com/v3/upload?hl=it";
      form.enctype = "multipart/form-data";
      form.target = "_blank";
      form.acceptCharset = "UTF-8";
      form.style.display = "none";
      const input = document.createElement("input");
      input.type = "file";
      input.name = "encoded_image";
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      form.append(input);
      const dims = document.createElement("input");
      dims.type = "hidden";
      dims.name = "processed_image_dimensions";
      dims.value = `${canvas.width},${canvas.height}`;
      form.append(dims);
      document.body.append(form);
      form.submit();
      form.remove();
    }, "image/jpeg", 0.9);
  };
  img.src = dataUrl;
}

function openLifePage(q) {
  const url = window.SeaDiveBiology?.lifeWeb?.(q || "biologia marina mediterraneo");
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

function openBioGuide(id) {
  view = { ...view, name: "bio", bioId: id };
  render();
  window.scrollTo(0, 0);
}

function bioGroupOn() {
  const id = view.bioFilter || "all";
  if (id === "all") return "all";
  return window.SeaDiveBiology?.lifeSection?.(id) ? id : "all";
}

function bioWhereOn() {
  const id = view.bioWhere || "all";
  if (id === "med" || id === "world" || id === "alien") return id;
  if (view.bioFilter === "med" || view.bioFilter === "world" || view.bioFilter === "alien") return view.bioFilter;
  return "all";
}

function bioCardHtml(api, x) {
  const section = api.lifeSection(x.group);
  return `<article class="bio-card" data-bioid="${escapeHtml(x.id)}" role="button" tabindex="0">
        <div class="bio-pic">
          <span class="bio-mark" aria-hidden="true">${api.lifeEmoji(x)}</span>
          <img class="bio-shot" alt="" data-bioimg data-la="${escapeHtml(x.la)}" data-it="${escapeHtml(x.it)}" />
        </div>
        <div class="bio-body">
          <p class="bio-kicker">${escapeHtml(section?.label || x.group)} · ${escapeHtml(x.where)}</p>
          <h3>${escapeHtml(x.it)}</h3>
          <p class="bio-la">${escapeHtml(x.la)}</p>
          <p class="bio-look">${escapeHtml(x.look)}</p>
        </div>
      </article>`;
}

function renderBiology() {
  const api = window.SeaDiveBiology;
  const frag = document.createDocumentFragment();
  frag.append(topbar("Biologia Marina"));
  const sec = document.createElement("section");
  sec.className = "card bio-page";
  const sections = [["all", "Tutti", ""], ...(api.LIFE_SECTIONS || []).map((s) => [s.id, s.label, s.emoji])];
  const seas = [
    ["all", "Tutti i mari"],
    ["med", "Mediterraneo"],
    ["world", "Altri mari"],
    ["alien", "Invasive"],
  ];
  sec.innerHTML = `
    <header class="bio-head">
      <p class="bio-kicker">Guida da immersione</p>
      <h2 class="serif">Biologia Marina</h2>
      <p class="bio-lead">Pesci, coralli, nudibranchi e gli altri gruppi. Apri una specie per riconoscimento, habitat e note in acqua.</p>
    </header>
    <div class="bio-search">
      <input class="search" type="search" enterkeyhint="search" placeholder="Cerca nome, gruppo o ambiente" value="${escapeHtml(view.bioQuery || "")}" data-bioq />
      <div class="bio-search-actions">
        <button class="btn ghost" type="button" data-biophoto>Cerca con foto</button>
        <button class="btn ghost" type="button" data-bioweb>Cerca in rete</button>
      </div>
      <input type="file" accept="image/*" data-biophotofile />
      <div class="bio-photo-chip" data-biophotochip hidden>
        <img alt="" data-biophotoprev />
        <div>
          <p class="hint" data-biophotohint></p>
          <button class="btn ghost" type="button" data-biophotoclear>Togli foto</button>
        </div>
      </div>
    </div>
    <div class="bio-filters">
      <div class="chips" data-biofilters></div>
      <div class="chips" data-biowheres></div>
    </div>
    <p class="hint" data-bioblurb></p>
    <p class="meta" data-biocount></p>
    <div class="bio-list" data-biolist></div>
  `;
  const input = sec.querySelector("[data-bioq]");
  const list = sec.querySelector("[data-biolist]");
  const count = sec.querySelector("[data-biocount]");
  const blurb = sec.querySelector("[data-bioblurb]");
  const groupChips = sec.querySelector("[data-biofilters]");
  const whereChips = sec.querySelector("[data-biowheres]");
  const paint = () => {
    const q = input.value;
    view.bioQuery = q;
    const group = bioGroupOn();
    const where = bioWhereOn();
    view.bioFilter = group;
    view.bioWhere = where;
    const photo = bioPhotoSearch;
    const chip = sec.querySelector("[data-biophotochip]");
    chip.hidden = !photo;
    if (photo) {
      sec.querySelector("[data-biophotoprev]").src = photo.preview;
      sec.querySelector("[data-biophotohint]").textContent = photo.hint;
    }
    let rows;
    if (photo) {
      rows = Array.isArray(photo.rows) ? photo.rows : [];
      if (q.trim()) {
        const allowed = new Set(api.filterMarineLife(q, "all", "all").map((x) => x.id));
        rows = rows.filter((x) => allowed.has(x.id));
      }
    } else {
      rows = api.filterMarineLife(q, group, where);
    }
    const section = group === "all" ? null : api.lifeSection(group);
    blurb.textContent = photo ? "" : (section?.blurb || "");
    count.textContent = photo?.pending ? "Riconoscimento…" : (rows.length === 1 ? "1 specie" : `${rows.length} specie`);
    if (!rows.length) {
      list.innerHTML = photo
        ? `<p class="hint">${escapeHtml(photo.pending ? photo.hint : "Non ho riconosciuto questo soggetto nella guida. Avvicina l’animale e riprova.")}</p>`
        : `<p class="hint">Nessuna specie in elenco. Premi Cerca in rete per aprire Wikipedia con «${escapeHtml(q || "biologia marina")}».</p>`;
      return;
    }
    if (photo || group === "all") {
      list.innerHTML = (api.LIFE_SECTIONS || [])
        .map((s) => {
          const items = rows.filter((x) => x.group === s.id);
          if (!items.length) return "";
          return `<h3 class="bio-sec"><i>${s.emoji}</i><span>${escapeHtml(s.label)}</span><em>${items.length}</em></h3>${items.map((x) => bioCardHtml(api, x)).join("")}`;
        })
        .join("");
    } else {
      list.innerHTML = rows.map((x) => bioCardHtml(api, x)).join("");
    }
    bindBioThumbs(list);
  };
  const openFromList = (id) => {
    if (id) openBioGuide(id);
  };
  list.onclick = (e) => {
    const card = e.target.closest("[data-bioid]");
    if (!card || !list.contains(card)) return;
    openFromList(card.dataset.bioid);
  };
  list.onkeydown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-bioid]");
    if (!card) return;
    e.preventDefault();
    openFromList(card.dataset.bioid);
  };
  sections.forEach(([id, label, emoji]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip bio-chip${bioGroupOn() === id ? " on" : ""}`;
    b.innerHTML = `${emoji ? `<span class="bio-emoji">${emoji}</span>` : ""}${escapeHtml(label)}`;
    b.onclick = () => {
      view.bioFilter = id;
      groupChips.querySelectorAll(".chip").forEach((el) => el.classList.remove("on"));
      b.classList.add("on");
      paint();
    };
    groupChips.append(b);
  });
  seas.forEach(([id, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip bio-sea${bioWhereOn() === id ? " on" : ""}`;
    b.textContent = label;
    b.onclick = () => {
      view.bioWhere = id;
      whereChips.querySelectorAll(".chip").forEach((el) => el.classList.remove("on"));
      b.classList.add("on");
      paint();
    };
    whereChips.append(b);
  });
  input.oninput = paint;
  input.onkeydown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const q = input.value.trim();
    const rows = api.filterMarineLife(q, bioGroupOn(), bioWhereOn());
    const hit = rows.find((x) => lifeNorm(x.it) === lifeNorm(q) || lifeNorm(x.la) === lifeNorm(q)) || rows[0];
    if (hit) openBioGuide(hit.id);
    else openLifePage(q);
  };
  sec.querySelector("[data-bioweb]").onclick = () => {
    const q = (input.value || "").trim();
    const rows = api.filterMarineLife(q, bioGroupOn(), bioWhereOn());
    const hit = rows.find((x) => lifeNorm(x.it) === lifeNorm(q) || lifeNorm(x.la) === lifeNorm(q)) || rows[0];
    openLifePage(hit ? `${hit.it} ${hit.la}` : q);
  };
  const photoButton = sec.querySelector("[data-biophoto]");
  const photoFile = sec.querySelector("[data-biophotofile]");
  photoButton.onclick = () => photoFile.click();
  photoFile.onchange = async () => {
    const file = photoFile.files?.[0];
    if (!file) return;
    const token = ++bioPhotoToken;
    photoButton.disabled = true;
    photoButton.textContent = "Leggo la foto…";
    try {
      const bytes = await file.arrayBuffer();
      photoFile.value = "";
      const type = String(file.type || "").startsWith("image/") ? file.type : "image/jpeg";
      const blob = new Blob([bytes], { type });
      let bitmap;
      try {
        bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      } catch {
        const url = URL.createObjectURL(blob);
        try {
          const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = () => reject(new Error("image"));
            el.src = url;
          });
          const canvas = document.createElement("canvas");
          const limit = 1600;
          const fit = Math.min(1, limit / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height, 1));
          canvas.width = Math.max(1, Math.round((img.naturalWidth || img.width) * fit));
          canvas.height = Math.max(1, Math.round((img.naturalHeight || img.height) * fit));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          bitmap = await createImageBitmap(canvas);
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      const signals = readPhotoSignals(bitmap);
      const frame = document.createElement("canvas");
      const fit = Math.min(1, 384 / Math.max(bitmap.width, bitmap.height, 1));
      frame.width = Math.max(1, Math.round(bitmap.width * fit));
      frame.height = Math.max(1, Math.round(bitmap.height * fit));
      frame.getContext("2d").drawImage(bitmap, 0, 0, frame.width, frame.height);
      const clipImage = frame.toDataURL("image/jpeg", 0.86);
      const subject = subjectPhotoCanvas(bitmap, signals);
      const focusImage = subject ? subject.toDataURL("image/jpeg", 0.9) : "";
      bitmap.close?.();
      bioPhotoSearch = {
        signals,
        preview: signals.preview,
        hint: bioPhotoHint(),
        rows: [],
        pending: true,
      };
      paint();
      sec.querySelector("[data-biophotochip]")?.scrollIntoView({ block: "start", behavior: "smooth" });
      photoButton.disabled = false;
      photoButton.textContent = "Cerca con foto";
      try {
        const found = await recognizePhotoSubject(focusImage || clipImage, signals, token, focusImage);
        if (!found || token !== bioPhotoToken || !bioPhotoSearch) return;
        bioPhotoSearch.rows = found.rows;
        bioPhotoSearch.hint = found.hint;
        bioPhotoSearch.pending = false;
        const first = found.rows?.[0];
        if (first?.id) {
          view.bioFromPhoto = focusImage || clipImage;
          view.bioPhotoName = first.it;
          openBioGuide(first.id);
          return;
        }
        paint();
      } catch {
        if (token !== bioPhotoToken || !bioPhotoSearch) return;
        bioPhotoSearch.pending = false;
        bioPhotoSearch.rows = [];
        bioPhotoSearch.hint = "Non riesco a riconoscere il soggetto adesso. Controlla la rete e riprova.";
        paint();
      }
    } catch {
      photoFile.value = "";
      bioPhotoToken += 1;
      bioPhotoSearch = null;
      paint();
      blurb.textContent = "Foto non leggibile. Scegline un'altra dalla galleria.";
    }
    photoButton.disabled = false;
    photoButton.textContent = "Cerca con foto";
  };
  sec.querySelector("[data-biophotoclear]").onclick = () => {
    bioPhotoToken += 1;
    bioPhotoSearch = null;
    paint();
  };
  paint();
  frag.append(sec);
  return frag;
}

function renderBioGuide() {
  const api = window.SeaDiveBiology;
  const x = api.findMarineLife?.(view.bioId);
  const frag = document.createDocumentFragment();
  frag.append(topbar("Biologia Marina"));
  const sec = document.createElement("section");
  sec.className = "card bio-page";
  if (!x) {
    sec.innerHTML = `<p class="hint">Specie non trovata.</p><button class="btn ghost" type="button" data-bioback>Torna all'elenco</button>`;
  } else {
    const section = api.lifeSection(x.group);
    const fromPhoto = view.bioFromPhoto
      ? `<div class="bio-block">
          <h3>Soggetto della foto</h3>
          <p>Ho isolato il soggetto, senza lo sfondo, e l’ho confrontato con le foto online della guida. Questa è la scheda più vicina.</p>
          <img class="bio-subject" alt="" src="${escapeHtml(view.bioFromPhoto)}" />
          <div class="bio-actions">
            <button class="btn primary" type="button" data-lens>Confronta su Google</button>
          </div>
        </div>`
      : "";
    sec.innerHTML = `
      <button class="bio-back" type="button" data-bioback>Elenco</button>
      ${fromPhoto}
      <div class="bio-hero">
        <span class="bio-mark" aria-hidden="true">${api.lifeEmoji(x)}</span>
        <img class="bio-hero-shot" alt="${escapeHtml(x.it)}" data-bioimg data-la="${escapeHtml(x.la)}" data-it="${escapeHtml(x.it)}" />
        <div class="bio-hero-caption">
          <p>${escapeHtml(section?.emoji || "")} ${escapeHtml(section?.label || "")} · ${escapeHtml(x.where)}</p>
          <h2 class="serif">${escapeHtml(x.it)}</h2>
          <p class="bio-la">${escapeHtml(x.la)}</p>
        </div>
      </div>
      <div class="kv">
        <div><b>Taglia</b>${escapeHtml(x.size)}</div>
        <div><b>Profondità</b>${escapeHtml(x.depth)}</div>
        <div><b>Tipo</b>${escapeHtml(x.tag)}</div>
        <div><b>Mari</b>${escapeHtml(x.where)}</div>
      </div>
      <div class="bio-block"><h3>Dove vive</h3><p>${escapeHtml(x.habitat)}</p></div>
      <div class="bio-block"><h3>Come riconoscerlo</h3><p>${escapeHtml(x.look)}</p></div>
      <div class="bio-block"><h3>Vita</h3><p>${escapeHtml(x.life)}</p></div>
      <div class="bio-block"><h3>In immersione</h3><p>${escapeHtml(x.dive)}</p></div>
      <div class="bio-block" data-biowiki><p class="hint">Caricamento della scheda enciclopedica…</p></div>
      <div class="bio-actions">
        <a class="btn primary" href="${api.lifeWeb(`${x.it} ${x.la}`)}" target="_blank" rel="noopener noreferrer">Wikipedia</a>
        <a class="btn ghost" href="${api.lifeWorms(x.la)}" target="_blank" rel="noopener noreferrer">Scheda WoRMS</a>
      </div>
    `;
  }
  sec.querySelector("[data-bioback]").onclick = () => {
    view = { ...view, name: "bio", bioId: "", bioFromPhoto: "", bioPhotoName: "" };
    render();
    window.scrollTo(0, 0);
  };
  sec.querySelector("[data-lens]")?.addEventListener("click", () => compareSubjectOnGoogle(view.bioFromPhoto));
  if (x) bindBioGuide(sec, x);
  frag.append(sec);
  return frag;
}

function bindBioGuide(root, species) {
  const api = window.SeaDiveBiology;
  const gen = ++bioThumbGen;
  api.lifePage(species.la, species.it).then((page) => {
    if (gen !== bioThumbGen || !root.isConnected) return;
    const img = root.querySelector("[data-bioimg]");
    const src = String(page?.thumb || "");
    if (img && src) {
      const show = () => {
        img.classList.add("on");
        img.closest(".bio-hero")?.classList.add("has-photo");
      };
      img.onload = show;
      img.src = src;
      if (img.complete && img.naturalWidth) show();
    }
    const box = root.querySelector("[data-biowiki]");
    if (!box) return;
    if (page?.extract) {
      const more = page.url
        ? `<p><a href="${escapeHtml(page.url)}" target="_blank" rel="noopener noreferrer">Apri la voce</a></p>`
        : "";
      box.innerHTML = `<h3>Scheda enciclopedica</h3><p>${escapeHtml(page.extract)}</p>${more}<p class="hint">Testo da Wikipedia, licenza CC BY-SA.</p>`;
    } else {
      box.innerHTML = `<p class="hint">La scheda enciclopedica si carica quando c'è rete. Riconoscimento, habitat e note restano nella guida anche offline.</p>`;
    }
  });
}

function lifeNorm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderLog() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("Diario"));
  const listWrap = document.createElement("section");
  listWrap.className = "section";
  const q = (view.query || "").trim().toLowerCase();
  const ordered = [...state.dives].sort((a, b) => {
    const byWhen = `${b.date || ""}T${b.timeIn || ""}`.localeCompare(`${a.date || ""}T${a.timeIn || ""}`);
    return byWhen || Number(b.number) - Number(a.number);
  })
    .filter((d) => {
      if (!q) return true;
      return [d.site, d.location, d.centerName, d.buddyName, d.notes]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  const search = document.createElement("input");
  search.className = "search";
  search.placeholder = "Cerca sito, località, diving, buddy…";
  search.value = view.query || "";
  search.oninput = () => {
    view.query = search.value;
  };
  search.onchange = () => {
    view.query = search.value;
    render();
  };
  search.onkeydown = (e) => {
    if (e.key === "Enter") {
      view.query = search.value;
      render();
    }
  };
  listWrap.append(search);
  if (!ordered.length) listWrap.append(q ? Object.assign(document.createElement("p"), { className: "hint", textContent: "Nessuna immersione trovata." }) : emptyState());
  else {
    const ul = document.createElement("div");
    ul.className = "dive-list";
    ordered.forEach((d) => ul.append(diveCard(d)));
    listWrap.append(ul);
  }
  frag.append(listWrap);
  return frag;
}

function renderComputer() {
  const api = window.SeaDiveComputers;
  const frag = document.createDocumentFragment();
  frag.append(topbar("computer subacqueo"));
  const hero = document.createElement("section");
  hero.className = "card hero";
  hero.innerHTML = `
    <h2>Dal polso al diario</h2>
    <p class="tagline">Carica il file: le immersioni vanno <strong>subito nel diario</strong>, con profilo, luogo e mappa. Formati: UDDF, FIT, JSON, XML, CSV, GPX. Bluetooth sperimentale solo EON su Chrome Android.</p>
    <div class="actions">
      <label class="btn primary">Carica file
        <input type="file" accept="${COMPUTER_FILE_ACCEPT}" multiple hidden data-files />
      </label>
      <button class="btn ghost" type="button" data-ble>Prova Bluetooth (EON)</button>
    </div>
    <p class="hint" data-hint>${escapeHtml(view.computerHint || "Scegli uno o più file dal telefono o dal computer. Se un formato non si apre, esporta UDDF o JSON dall’app del produttore.")}</p>
  `;
  hero.querySelector("[data-files]").onchange = (e) => ingestFiles(e.target.files);
  hero.querySelector("[data-ble]").onclick = async () => {
    try {
      view.computerHint = "Apri il selettore Bluetooth…";
      const hint = hero.querySelector("[data-hint]");
      if (hint) hint.textContent = view.computerHint;
      const { name, dives } = await window.SeaDiveBle.downloadEonDives((m) => {
        view.computerHint = m;
        if (hint) hint.textContent = m;
      });
      const { added } = await mergeImported(dives);
      view.name = added ? "log" : "computer";
      view.computerHint = `${name}: ${added} immersioni sincronizzate nel diario.`;
    } catch (err) {
      view.computerHint = err.message || String(err);
    }
    render();
  };
  frag.append(hero);

  const brands = document.createElement("section");
  brands.className = "section";
  brands.innerHTML = `<div class="section-head"><h3>Come importare (file, non Bluetooth)</h3></div>`;
  const grid = document.createElement("div");
  grid.className = "brand-grid";
  api.COMPUTERS.forEach((c) => {
    const card = document.createElement("article");
    card.className = `brand-card${c.id === "suunto-eon-core" ? " featured" : ""}`;
    card.innerHTML = `<h4>${escapeHtml(c.brand)}</h4><p class="meta">${escapeHtml(c.models)}</p><p class="hint">${escapeHtml(c.how)}</p>`;
    grid.append(card);
  });
  brands.append(grid);
  frag.append(brands);
  return frag;
}

const COMPUTER_FILE_ACCEPT =
  ".uddf,.xml,.csv,.txt,.json,.fit,.gpx,.log,.sml,.ssrf,.zxu,.divelog,application/json,application/xml,application/gpx+xml,*/*";

async function collectImported(fileList) {
  const api = window.SeaDiveComputers;
  const files = [...fileList];
  const notes = [];
  const parsed = [];
  for (const file of files) {
    try {
      const buf = await file.arrayBuffer();
      const { dives, format } = api.parseComputerBytes(file.name, buf);
      notes.push(`${file.name}: ${dives.length} immersioni (${format})`);
      parsed.push({ name: file.name, dives, format });
    } catch (err) {
      notes.push(`${file.name}: ${err.message}`);
    }
  }
  const used = new Set();
  const found = [];
  const stem = (n) =>
    String(n || "")
      .replace(/\.[^.]+$/, "")
      .toLowerCase();
  parsed.forEach((a, i) => {
    if (used.has(i)) return;
    const other = parsed.findIndex(
      (b, j) =>
        j !== i &&
        !used.has(j) &&
        stem(a.name) === stem(b.name) &&
        /json/i.test(a.format) !== /json/i.test(b.format) &&
        (/fit/i.test(a.format) || /json/i.test(a.format)) &&
        (/fit/i.test(b.format) || /json/i.test(b.format))
    );
    if (other >= 0 && a.dives[0] && parsed[other].dives[0] && api.mergeSuuntoPair) {
      const jsonDive = /json/i.test(a.format) ? a.dives[0] : parsed[other].dives[0];
      const fitDive = /fit/i.test(a.format) ? a.dives[0] : parsed[other].dives[0];
      found.push(api.mergeSuuntoPair(jsonDive, fitDive));
      used.add(i);
      used.add(other);
      notes.push(`${a.name} + ${parsed[other].name}: uniti JSON e FIT`);
      return;
    }
    found.push(...a.dives);
    used.add(i);
  });
  return { found, notes };
}

async function ingestFiles(fileList) {
  const { found, notes } = await collectImported(fileList);
  if (found.length) {
    const { added, last } = await mergeImported(found);
    view.computerHint = `${notes.join(" · ")} → ${added} immersioni nel diario.`;
    if (added === 1 && last) {
      view = { name: "edit", diveId: last.id, draft: cloneObj(last), query: view.query, computerHint: view.computerHint };
    } else {
      view.name = added ? "log" : "computer";
    }
  } else {
    view.computerHint = notes.join(" · ") || "Nessun file.";
    view.name = "computer";
  }
  render();
}

function enrichImported(d) {
  if (d.profilePoints?.length >= 3) d.profileFromComputer = true;
  applyPlaceToDive(d);
  if (!d.profileFromComputer) d.profilePoints = autoProfile(d);
  d.profilePoints = ensureThermoProfile(d);
  applyDiveMetrics(d);
  if (!d.timeOut && d.timeIn && d.totalTime) {
    const [h, m] = String(d.timeIn).split(":").map(Number);
    if (Number.isFinite(h)) {
      const t = ((h * 60 + m + Number(d.totalTime)) % 1440 + 1440) % 1440;
      d.timeOut = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    }
  }
  if (!d.certOnDive) d.certOnDive = [state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" ");
  return d;
}

async function reverseImportedPlace(d) {
  const g = geoCoords(d.lat, d.lng);
  if (!g) return d;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${g.lat}&lon=${g.lng}`
    );
    const info = await res.json();
    const a = info.address || {};
    if (!String(d.location || "").trim()) {
      d.location = [a.village || a.town || a.city || a.municipality, a.country].filter(Boolean).join(", ");
    }
    if (!d.site || /^(punto gps|import |suunto|garmin|computer)/i.test(d.site)) {
      d.site = a.hamlet || a.suburb || a.village || a.tourism || d.site || "Punto GPS";
    }
  } catch {
    /* coordinate già sul pin */
  }
  return d;
}

async function mergeImported(dives) {
  const api = window.SeaDiveComputers;
  const existing = new Set(state.dives.map(api.diveKey));
  let n = nextNumber();
  let added = 0;
  let last = null;
  const ordered = [...dives].sort((a, b) => `${a.date || ""}T${a.timeIn || ""}`.localeCompare(`${b.date || ""}T${b.timeIn || ""}`));
  if (api.fillSurfaceFromFitTimes) api.fillSurfaceFromFitTimes(ordered);
  for (const raw of ordered) {
    if (!(Number(raw.surfaceInterval) > 0) && api.surfaceFromPrevDives) {
      const si = api.surfaceFromPrevDives(raw, [...state.dives, ...ordered]);
      if (si) {
        raw.surfaceInterval = si;
        if (raw.computerLog) raw.computerLog.surfaceInterval = si;
      }
    }
    const d = enrichImported(raw);
    await reverseImportedPlace(d);
    const key = api.diveKey(d);
    if (existing.has(key)) continue;
    forgetDeletedDive(d);
    d.number = n++;
    state.dives.push(d);
    existing.add(key);
    added += 1;
    last = d;
  }
  save(state);
  view.pending = [];
  return { added, last };
}

function hasText(v) {
  return String(v ?? "").trim() !== "";
}

function genericComputerSite(s) {
  return /^(punto gps|import |suunto|garmin|computer)/i.test(String(s || "").trim());
}

function applyComputerOnto(target, incoming) {
  const next = cloneObj(target);
  [
    "date",
    "timeIn",
    "timeOut",
    "maxDepth",
    "avgDepth",
    "bottomTime",
    "totalTime",
    "waterTemp",
    "airTemp",
    "bottomTemp",
    "cns",
    "otu",
    "ascentRate",
    "ascentMax",
    "gf",
    "ndl",
    "surfaceInterval",
    "instruments",
    "lat",
    "lng",
    "safetyStop",
  ].forEach((k) => {
    if (hasText(incoming[k])) next[k] = incoming[k];
  });
  if ((incoming.profilePoints || []).length >= 3) {
    next.profilePoints = incoming.profilePoints;
    next.profileFromComputer = true;
  }
  if (incoming.computerLog) next.computerLog = incoming.computerLog;
  if (incoming.sourceComputer) next.sourceComputer = incoming.sourceComputer;
  next.imported = true;
  if (incoming.deco != null) {
    next.deco = Boolean(incoming.deco);
    next.noDeco = incoming.noDeco != null ? Boolean(incoming.noDeco) : !next.deco;
  }
  if (incoming.circuitOpen != null || incoming.circuitClosed != null) {
    next.circuitOpen = Boolean(incoming.circuitOpen);
    next.circuitClosed = Boolean(incoming.circuitClosed);
    if (hasText(incoming.regulator)) next.regulator = incoming.regulator;
  }
  ["visibility", "current", "seaConditions", "wetsuit", "ballast", "plannedDepth"].forEach((k) => {
    if (!hasText(next[k]) && hasText(incoming[k])) next[k] = incoming[k];
  });
  if (hasText(incoming.pressureEnd)) next.pressureEnd = incoming.pressureEnd;
  if (hasText(incoming.sac) && !target.sacManual) next.sac = incoming.sac;
  if (hasText(incoming.tss) && target.tssKind !== "manual") {
    next.tss = incoming.tss;
    if (incoming.tssKind) next.tssKind = incoming.tssKind;
    if (incoming.tssLabel) next.tssLabel = incoming.tssLabel;
  }
  if (!hasText(next.site) || genericComputerSite(next.site)) {
    if (hasText(incoming.site)) next.site = incoming.site;
  }
  if (!hasText(next.location) && hasText(incoming.location)) next.location = incoming.location;
  if (!hasText(next.notes) && hasText(incoming.notes)) next.notes = incoming.notes;
  if (!hasText(next.tank) || (hasText(incoming.tank) && incoming.tank !== "15" && String(target.tank) === "15")) {
    next.tank = incoming.tank || next.tank;
  }
  if (!hasText(next.mix) || (hasText(incoming.mix) && incoming.mix !== "21" && String(target.mix) === "21")) {
    next.mix = incoming.mix || next.mix;
  }
  if (
    !hasText(next.pressureStart) ||
    (hasText(incoming.pressureStart) && incoming.pressureStart !== "200" && String(target.pressureStart) === "200")
  ) {
    next.pressureStart = incoming.pressureStart || next.pressureStart;
  }
  if (Array.isArray(incoming.types) && incoming.types.length) {
    next.types = [...new Set([...(next.types || []), ...incoming.types])];
  }
  ["buddyName", "buddyCert", "guideName", "guideCert", "centerName", "centerLead"].forEach((k) => {
    if (!hasText(next[k]) && hasText(incoming[k])) next[k] = incoming[k];
  });
  next.id = target.id;
  next.number = target.number;
  next.photo = target.photo;
  next.feeling = target.feeling;
  next.buddySign = target.buddySign;
  next.guideSign = target.guideSign;
  next.centerSign = target.centerSign;
  next.sigMeta = target.sigMeta;
  next.certOnDive = hasText(target.certOnDive) ? target.certOnDive : next.certOnDive;
  next.sacManual = target.sacManual;
  return next;
}

function divePickLabel(d) {
  const when = [fmtItDateLong(d.date), d.timeIn].filter(Boolean).join(" · ");
  const where = d.site || d.location || "";
  const depth = hasText(d.maxDepth) ? `${d.maxDepth} m` : "";
  const mins = hasText(d.bottomTime) ? `${d.bottomTime} min` : hasText(d.totalTime) ? `${d.totalTime} min` : "";
  return [when || "Senza data", where, depth, mins].filter(Boolean).join(" · ");
}

function divesByTime(dives) {
  return [...dives].sort((a, b) => `${a.date || ""}T${a.timeIn || ""}`.localeCompare(`${b.date || ""}T${b.timeIn || ""}`));
}

function askPickDive(dives, base) {
  if (!dives || dives.length <= 1) return Promise.resolve(dives?.[0] || null);
  const ordered = divesByTime(dives);
  const latest = ordered[ordered.length - 1];
  const cardDate = String(base?.date || "");
  return new Promise((resolve) => {
    document.querySelector(".confirm-veil")?.remove();
    const veil = document.createElement("div");
    veil.className = "confirm-veil";
    const done = (v) => {
      veil.remove();
      resolve(v);
    };
    const paintChoices = () => {
      const onCard = cardDate ? ordered.filter((d) => d.date === cardDate) : [];
      veil.innerHTML = `
        <div class="confirm-card pick-card" role="dialog" aria-modal="true" aria-labelledby="pick-title">
          <h3 id="pick-title">Quale immersione va in questa scheda?</h3>
          <p>Il file ne contiene ${ordered.length}. Puoi mettere solo l’ultima, oppure quella di una data. Le altre restano fuori dal diario.</p>
          <div class="pick-list">
            <button type="button" class="btn primary" data-last>Solo l’ultima<br><small>${escapeHtml(divePickLabel(latest))}</small></button>
            ${
              onCard.length
                ? `<button type="button" class="btn ghost" data-card>Data di questa scheda<br><small>${escapeHtml(fmtItDateLong(cardDate))}${onCard.length > 1 ? " · " + onCard.length + " immersioni" : " · " + escapeHtml(onCard[0].timeIn || "")}</small></button>`
                : ""
            }
          </div>
          <label class="pick-date">Oppure scegli la data
            <input type="date" data-day value="${escapeHtml(cardDate || latest.date || "")}" />
          </label>
          <p class="hint" data-pickmsg></p>
          <div class="confirm-actions">
            <button type="button" class="btn ghost" data-no>Annulla</button>
            <button type="button" class="btn primary" data-daygo>Carica questa data</button>
          </div>
        </div>
      `;
      veil.querySelector("[data-no]").onclick = () => done(null);
      veil.querySelector("[data-last]").onclick = () => done(latest);
      veil.querySelector("[data-card]")?.addEventListener("click", () => chooseDay(onCard));
      veil.querySelector("[data-daygo]").onclick = () => {
        const day = veil.querySelector("[data-day]").value;
        chooseDay(ordered.filter((d) => d.date === day), day);
      };
    };
    const chooseDay = (hits, day) => {
      if (!hits.length) {
        const msg = veil.querySelector("[data-pickmsg]");
        if (msg) msg.textContent = day ? `Nessuna immersione il ${fmtItDateLong(day)}.` : "Scegli una data.";
        return;
      }
      if (hits.length === 1) {
        done(hits[0]);
        return;
      }
      veil.innerHTML = `
        <div class="confirm-card pick-card" role="dialog" aria-modal="true">
          <h3>Immersioni del ${escapeHtml(fmtItDateLong(hits[0].date))}</h3>
          <p>In questa data ce ne sono ${hits.length}. Scegline una.</p>
          <div class="pick-list">
            ${hits.map((d, i) => `<button type="button" class="btn ghost" data-i="${i}">${escapeHtml(divePickLabel(d))}</button>`).join("")}
          </div>
          <div class="confirm-actions">
            <button type="button" class="btn ghost" data-back>Indietro</button>
            <button type="button" class="btn ghost" data-no>Annulla</button>
          </div>
        </div>
      `;
      veil.querySelector("[data-no]").onclick = () => done(null);
      veil.querySelector("[data-back]").onclick = () => paintChoices();
      veil.querySelectorAll("[data-i]").forEach((btn) => {
        btn.onclick = () => done(hits[Number(btn.getAttribute("data-i"))]);
      });
    };
    veil.addEventListener("click", (e) => {
      if (e.target === veil) done(null);
    });
    paintChoices();
    document.body.append(veil);
  });
}

function snapshotEditForm(form, d) {
  const fd = new FormData(form);
  ["photoFile", "buddySignOk", "guideSignOk", "centerSignOk"].forEach((k) => fd.delete(k));
  const next = {
    ...d,
    ...Object.fromEntries(fd.entries()),
    types: d.types,
    photo: d.photo,
    feeling: d.feeling,
    tssKind: d.tssKind,
    tssLabel: d.tssKind === "manual" ? "TSS(Manuale)" : d.tssLabel,
    buddySign: d.buddySign,
    guideSign: d.guideSign,
    centerSign: d.centerSign,
    sigMeta: d.sigMeta,
    profileFromComputer: d.profileFromComputer,
    profilePoints: d.profilePoints,
    computerLog: d.computerLog || null,
    sacManual: d.sacManual,
    id: d.id,
  };
  next.circuitOpen = fd.has("circuitOpen");
  next.circuitClosed = fd.has("circuitClosed");
  next.noDeco = fd.has("noDeco");
  next.deco = fd.has("hadDeco");
  delete next.hadDeco;
  return next;
}

function currentDiveBase() {
  if (view.name === "edit" && view.draft) {
    const form = document.querySelector("form.dive-edit");
    return form ? snapshotEditForm(form, view.draft) : cloneObj(view.draft);
  }
  const live = state.dives.find((x) => x.id === view.diveId);
  return live ? cloneObj(live) : null;
}

async function fillExistingFromFound(base, { found, notes }) {
  if (!found.length) {
    view.computerHint = notes.join(" · ") || "Nessuna immersione nel file.";
    render();
    return;
  }
  const chosen = await askPickDive(found, base);
  if (!chosen) {
    view.computerHint = "Scelta annullata. La scheda non è cambiata.";
    render();
    return;
  }
  const api = window.SeaDiveComputers;
  const raw = cloneObj(chosen);
  if (!(Number(raw.surfaceInterval) > 0) && api.surfaceFromPrevDives) {
    const si = api.surfaceFromPrevDives(raw, state.dives);
    if (si) {
      raw.surfaceInterval = si;
      if (raw.computerLog) raw.computerLog.surfaceInterval = si;
    }
  }
  let filled = applyComputerOnto(base, raw);
  await reverseImportedPlace(filled);
  filled = enrichImported(filled);
  filled.id = base.id;
  filled.number = base.number;
  view = {
    name: "edit",
    diveId: filled.id,
    draft: filled,
    query: view.query || "",
    computerHint: "Dati del computer messi in questa scheda. Controlla e premi Salva. Foto, firme e note già scritti restano.",
  };
  render();
}

function computerFillHtml() {
  return `
    <div class="computer-fill">
      <h3 class="serif">Dal file</h3>
      <p class="hint">Carica il file dentro questa scheda. Se ci sono più immersioni, metti solo l’ultima oppure quella di una data. Foto, firme e note già scritti restano.</p>
      <div class="actions">
        <button class="btn primary" type="button" data-fillpick>Carica file</button>
        <input type="file" accept="${COMPUTER_FILE_ACCEPT}" multiple data-fillfiles />
        <button class="btn ghost" type="button" data-fillble>Bluetooth (EON)</button>
      </div>
      <p class="hint" data-fillhint ${view.computerHint ? "" : "hidden"}>${escapeHtml(view.computerHint || "")}</p>
    </div>
  `;
}

function bindComputerFill(root) {
  const input = root.querySelector("[data-fillfiles]");
  if (!input) return;
  root.querySelector("[data-fillpick]").onclick = () => input.click();
  input.onchange = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    const base = currentDiveBase();
    if (!base || !files.length) return;
    try {
      await fillExistingFromFound(base, await collectImported(files));
    } catch (err) {
      view.computerHint = err.message || String(err);
      render();
    }
  };
  root.querySelector("[data-fillble]").onclick = async () => {
    const base = currentDiveBase();
    if (!base) return;
    const hint = root.querySelector("[data-fillhint]");
    const say = (m) => {
      view.computerHint = m;
      if (hint) {
        hint.hidden = !m;
        hint.textContent = m;
      }
    };
    try {
      say("Apri il selettore Bluetooth…");
      const { name, dives } = await window.SeaDiveBle.downloadEonDives(say);
      await fillExistingFromFound(base, {
        found: dives || [],
        notes: [`${name}: ${(dives || []).length} immersioni`],
      });
    } catch (err) {
      view.computerHint = err.message || String(err);
      render();
    }
  };
}

function renderStats() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("il tuo mare"));
  const t = totals();
  const load = trainingLoad();
  const sites = [...new Set(state.dives.map((d) => d.site).filter(Boolean))];
  const nitrox = state.dives.filter((d) => Number(d.mix) > 21).length;
  const card = document.createElement("section");
  card.className = "card hero";
  card.innerHTML = `
    <h2>Passaporto subacqueo</h2>
    <p class="tagline">Riepilogo delle immersioni, come le pagine del cartaceo.</p>
    <div class="stats">
      <div class="stat"><b>${t.n}</b><span>Totali</span></div>
      <div class="stat"><b>${t.max || "—"}</b><span>Max assoluta</span></div>
      <div class="stat"><b>${fmtMins(t.mins)}</b><span>Fondo</span></div>
    </div>
    <div class="stats" style="margin-top:8px">
      <div class="stat"><b>${load.ctl || "—"}</b><span>CTL</span></div>
      <div class="stat"><b>${load.atl || "—"}</b><span>ATL</span></div>
      <div class="stat"><b>${load.tsb || "—"}</b><span>TSB</span></div>
    </div>
    <p class="hint">TSS = intensità² × durata (soglia zona 4/5). CTL carico cronico 42 gg, ATL acuto 7 gg, TSB = CTL − ATL. Un TSB negativo è affaticamento; salire troppo in fretta aumenta il rischio.</p>
  `;
  frag.append(card);
  const extra = document.createElement("section");
  extra.className = "card section";
  extra.innerHTML = `
    <div class="kv">
      <div><b>Siti distinti</b>${sites.length}</div>
      <div><b>Immersioni Nitrox</b>${nitrox}</div>
      <div><b>Brevetto</b>${escapeHtml(state.profile.certLevel || "—")}</div>
    </div>
    <h3 class="serif" style="margin:18px 0 8px">Tabella riepilogo</h3>
    <div style="overflow:auto">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="opacity:.6;text-align:left">
          <th style="padding:8px 6px">N°</th><th>Data</th><th>Sito</th><th>Diving</th><th>m</th><th>min</th><th>TSS</th>
        </tr></thead>
        <tbody>
          ${[...state.dives]
            .sort((a, b) => Number(a.number) - Number(b.number))
            .map(
              (d) => `<tr style="border-top:1px solid var(--line)">
              <td style="padding:8px 6px">${escapeHtml(d.number)}</td>
              <td>${escapeHtml(d.date)}</td>
              <td>${escapeHtml(d.site)}</td>
              <td>${escapeHtml(d.centerName)}</td>
              <td>${escapeHtml(d.maxDepth)}</td>
              <td>${escapeHtml(d.bottomTime)}</td>
              <td>${escapeHtml(computeTss(d).value || "—")}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
  frag.append(extra);
  return frag;
}

function renderPeople() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("Community"));
  const card = document.createElement("section");
  card.className = "card community-page";
  const role = view.peopleRole || "all";
  const people = [...(state.people || [])]
    .filter((p) => role === "all" || p.role === role)
    .filter((p) => !p.remoteOwner || p.followOut || samePersonName(p.name, state.profile?.name))
    .sort((a, b) => {
      const ao = samePersonName(a.name, state.profile.name) ? 0 : 1;
      const bo = samePersonName(b.name, state.profile.name) ? 0 : 1;
      if (ao !== bo) return ao - bo;
      return roleLabel(a.role).localeCompare(roleLabel(b.role), "it") || a.name.localeCompare(b.name, "it");
    });
  card.innerHTML = `
    <h2 class="serif" style="margin:0 0 6px">Community</h2>
    <p class="hint">Cerca chi usa SeaDive e seguilo. I profili stanno nel cloud della Community; il diario resta sul tuo Drive. Nome, cognome, brevetto e firma entrano in immersione solo se vi seguite entrambi.</p>
    <div class="chat-list" data-chatlist>
      <button class="chat-entry" type="button" data-openchat>Chat di chi si segue</button>
    </div>
    <input class="search" data-find placeholder="Cerca chi usa SeaDive" value="${escapeHtml(view.peopleQuery || "")}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" inputmode="search" />
    <p class="hint" data-peoplehint ${view.peopleHint ? "" : "hidden"}>${escapeHtml(view.peopleHint || "")}</p>
    <h3 class="serif people-block">Chi usa SeaDive</h3>
    <div class="sea-strip" data-sea></div>
    <h3 class="serif people-block">I tuoi contatti</h3>
    <div class="chips" data-roles></div>
    <div class="people-list" data-list></div>
    <div class="actions">
      <button class="btn primary" type="button" data-addperson>Aggiungi persona</button>
      <button class="btn ghost" type="button" data-receivecontact>Ricevi contatto</button>
      <button class="btn ghost" type="button" data-receive>Ricevi immersione</button>
      <input type="file" data-receivefile />
      <input type="file" data-receivecontactfile />
    </div>
  `;
  const roles = card.querySelector("[data-roles]");
  [["all", "Tutti"], ["buddy", "Buddy"], ["guide", "Istruttori"], ["center", "Diving"]].forEach(([id, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip${role === id ? " on" : ""}`;
    b.textContent = label;
    b.onclick = () => {
      view.peopleRole = id;
      view.personId = null;
      render();
    };
    roles.append(b);
  });
  const list = card.querySelector("[data-list]");
  const sea = card.querySelector("[data-sea]");
  const myNames = personNames({ name: state.profile?.name || "" });
  const selfCard = myNames.firstName && myNames.lastName
    ? {
        self: true,
        firstName: myNames.firstName,
        lastName: myNames.lastName,
        cert: String(state.profile?.certNumber || "").trim(),
        level: String(state.profile?.certLevel || "").trim(),
        portrait: profilePortraitImage(),
        owner: "me",
      }
    : null;
  const otherPeople = seaDirectory.list || [];
  const seaPeople = [selfCard, ...otherPeople].filter(Boolean);
  const seaWait = document.createElement("p");
  seaWait.className = "hint";
  seaWait.setAttribute("data-sea-wait", "");
  const seaRow = document.createElement("div");
  seaRow.className = "sea-row";
  sea.append(seaWait);
  sea.append(seaRow);
  seaPeople.forEach((cardHit) => {
    const who = [cardHit.firstName, cardHit.lastName].filter(Boolean).join(" ");
    const extra = [cardHit.level, cardHit.cert].filter(Boolean).join(" · ");
    if (cardHit.self) {
      const whoSelf = [cardHit.firstName, cardHit.lastName].filter(Boolean).join(" ");
      const extraSelf = [cardHit.level, cardHit.cert].filter(Boolean).join(" · ");
      const selfPhoto = portraitImage(cardHit.portrait);
      const selfInitials = `${(cardHit.firstName || "?").slice(0, 1)}${(cardHit.lastName || "").slice(0, 1)}`.toUpperCase();
      const selfRow = document.createElement("article");
      selfRow.className = "sea-person";
      selfRow.setAttribute("data-self", "");
      selfRow.setAttribute("data-q", [whoSelf, extraSelf].filter(Boolean).join(" "));
      selfRow.innerHTML = `
        <button type="button" class="sea-open">
          ${selfPhoto ? `<img class="sea-photo" alt="" src="${escapeHtml(selfPhoto)}" />` : `<span class="sea-photo sea-photo-fallback">${escapeHtml(selfInitials)}</span>`}
          <strong class="sea-first">${escapeHtml(cardHit.firstName || "")}</strong>
          <strong class="sea-last">${escapeHtml(cardHit.lastName || "")}</strong>
          <small class="sea-status">Sei tu</small>
        </button>
      `;
      selfRow.querySelector(".sea-open").onclick = () => {
        view.name = "profile";
        render();
      };
      seaRow.append(selfRow);
      return;
    }
    const known = localSeaPerson(cardHit);
    const mutual = Boolean(known?.followOut && known?.followIn);
    const mode = mutual ? "mutual" : !known ? "none" : known.followOut ? "out" : known.followIn ? "in" : "none";
    const status = mode === "mutual" ? "Vi seguite" : mode === "in" ? "Ti segue" : "";
    const followBtn = mode === "mutual" || mode === "out"
      ? `<button class="btn ghost" type="button" data-unfollow>Non seguire più</button>`
      : `<button class="btn primary" type="button" data-follow>${mode === "in" ? "Segui anche tu" : "Segui"}</button>`;
    const photo = portraitImage(cardHit.portrait);
    const initials = `${(cardHit.firstName || "?").slice(0, 1)}${(cardHit.lastName || "").slice(0, 1)}`.toUpperCase();
    const row = document.createElement("article");
    row.className = "sea-person";
    row.setAttribute("data-q", [cardHit.firstName, cardHit.lastName, who, extra].filter(Boolean).join(" "));
    row.innerHTML = `
      ${photo ? `<img class="sea-photo" alt="" src="${escapeHtml(photo)}" />` : `<span class="sea-photo sea-photo-fallback">${escapeHtml(initials)}</span>`}
      <strong class="sea-first">${escapeHtml(cardHit.firstName || "")}</strong>
      <strong class="sea-last">${escapeHtml(cardHit.lastName || "")}</strong>
      ${status ? `<small class="sea-status">${escapeHtml(status)}</small>` : ""}
      <div class="people-actions">
        ${followBtn}
      </div>
    `;
    row.querySelector("[data-follow]")?.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const button = e.currentTarget;
      button.disabled = true;
      button.textContent = "Salvo…";
      await connectSeaPerson(cardHit, false);
    });
    row.querySelector("[data-unfollow]")?.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const button = e.currentTarget;
      button.disabled = true;
      button.textContent = "Tolgo…";
      await disconnectSeaPerson(cardHit);
    });
    seaRow.append(row);
  });
  const localWait = document.createElement("p");
  localWait.className = "hint";
  localWait.setAttribute("data-list-wait", "");
  list.append(localWait);
  people.forEach((p) => {
      const n = divesForPerson(p).length;
      const row = document.createElement("article");
      row.className = "people-card";
      row.setAttribute(
        "data-q",
        [p.name, p.firstName, p.lastName, p.cert, p.lead, p.note, roleLabel(p.role)].filter(Boolean).join(" ")
      );
      const names = personNames(p);
      const mine = samePersonName(p.name, state.profile.name);
      const photo = personPortrait(p);
      const initials = p.role === "center"
        ? (p.name || "?").slice(0, 1).toUpperCase()
        : `${(names.firstName || p.name || "?").slice(0, 1)}${(names.lastName || "").slice(0, 1)}`.toUpperCase();
      const status = [
        mine ? "Sei tu" : "",
        p.remoteOwner && p.followOut && p.followIn ? "Vi seguite" : "",
        p.remoteOwner && !p.followOut && p.followIn ? "Ti segue" : "",
        !p.remoteOwner && !mine ? roleLabel(p.role) : "",
        n ? `${n} ${n === 1 ? "scheda" : "schede"}` : "",
      ].filter(Boolean).join(" · ");
      const first = p.role === "center" ? p.name || "" : names.firstName || p.name || "";
      const last = p.role === "center" ? "" : names.lastName || "";
      row.className = "contact-row";
      row.innerHTML = `
        <button type="button" class="contact-main">
          ${photo ? `<img class="contact-photo" alt="" src="${escapeHtml(photo)}" />` : `<span class="contact-photo contact-fallback">${escapeHtml(initials)}</span>`}
          <span class="contact-copy">
            <strong>${escapeHtml([first, last].filter(Boolean).join(" "))}</strong>
            <small>${escapeHtml(status)}</small>
          </span>
        </button>
        <div class="contact-links">
          <button class="contact-del" type="button">Elimina</button>
        </div>
      `;
      row.querySelector(".contact-main").onclick = () => {
        view.personId = p.id;
        view.peopleHint = "";
        render();
      };
      row.querySelector(".contact-del").onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!(await removePerson(p))) return;
        if (view.personId === p.id) view.personId = null;
        render();
      };
      list.append(row);
    });
  const find = card.querySelector("[data-find]");
  find.oninput = () => {
    view.peopleQuery = find.value;
    applyPeopleSearch(card);
  };
  find.onkeydown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };
  applyPeopleSearch(card);
  const openChat = card.querySelector("[data-openchat]");
  if (openChat) {
    openChat.onclick = () => {
      askChatNotice();
      openMainChat("");
    };
  }
  paintCommunityChats(card);
  card.querySelector("[data-addperson]").onclick = () => {
    view.personId = "new";
    view.personDraft = { id: uid(), role: "buddy", name: "", firstName: "", lastName: "", cert: "", lead: "", note: "", following: true };
    view.peopleHint = "";
    render();
  };
  const input = card.querySelector("[data-receivefile]");
  card.querySelector("[data-receive]").onclick = () => input.click();
  input.onchange = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    try {
      const dive = await importSharedFile(files[0]);
      view = { name: "detail", diveId: dive.id, query: view.query || "", peopleRole: view.peopleRole || "all" };
      render();
    } catch (err) {
      view.peopleHint = err.message || String(err);
      render();
    }
  };
  const contactInput = card.querySelector("[data-receivecontactfile]");
  card.querySelector("[data-receivecontact]").onclick = () => contactInput.click();
  contactInput.onchange = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    try {
      const res = await importFollowFile(files[0]);
      view.personId = res.person?.id || null;
      view.personDraft = null;
      view.peopleHint = res.person
        ? res.person.remoteOwner && !mutualFollow(res.person)
          ? `Contatto di ${res.person.name} salvato. Brevetto e firma entrano in immersione quando vi seguite entrambi.`
          : `Contatto di ${res.person.name} salvato. Nome, cognome, brevetto e firma entrano nella nuova immersione.`
        : "";
      render();
    } catch (err) {
      view.peopleHint = err.message || String(err);
      render();
    }
  };
  frag.append(card);
  queueMicrotask(() => {
    const stamp = ++communitySyncStamp;
    const had = seaDirectory.at;
    const before = (seaDirectory.list || []).map((c) => c.owner).join("|");
    const findEl = document.querySelector("[data-find]");
    const typing = findEl && document.activeElement === findEl;
    const caret = typing ? findEl.selectionStart : null;
    const queryNow = typing ? findEl.value : null;
    Promise.all([syncIncomingLinks().catch(() => false), refreshSeaDirectory().catch(() => null)])
      .then(([changed]) => {
        if (followSaveBusy || stamp !== communitySyncStamp || view.name !== "people" || view.personId) return;
        const after = (seaDirectory.list || []).map((c) => c.owner).join("|");
        if (!(changed || !had || before !== after)) return;
        if (queryNow != null) view.peopleQuery = queryNow;
        render();
        if (!typing) return;
        const again = document.querySelector("[data-find]");
        if (!again) return;
        again.focus();
        const pos = Math.min(caret ?? again.value.length, again.value.length);
        again.setSelectionRange?.(pos, pos);
      })
      .catch(() => {});
  });
  return frag;
}

function renderPerson() {
  const creating = view.personId === "new";
  const current = creating ? view.personDraft : (state.people || []).find((p) => p.id === view.personId);
  if (!current) {
    view.personId = null;
    return renderPeople();
  }
  const frag = document.createDocumentFragment();
  frag.append(topbar(creating ? "nuova persona" : roleLabel(current.role)));
  const form = document.createElement("form");
  form.className = "card";
  const dives = creating ? [] : divesForPerson(current);
  const names = personNames(current);
  form.innerHTML = `
    <div class="person-head">
      ${avatarHtml(personPortrait(current), current.name)}
      <h2 class="serif">${creating ? "Nuova persona" : escapeHtml(current.name)}</h2>
    </div>
    <p class="hint">${creating ? "Scegli se è un buddy, un istruttore o un diving. Nome, cognome e brevetto restano pronti sulla scheda." : "Nome, cognome e brevetto si aggiornano anche sulle schede in cui compare già."}</p>
    <p class="hint" style="margin-top:12px">Ruolo</p>
    <div class="chips" data-roles></div>
    <input type="hidden" name="role" value="${escapeHtml(current.role || "buddy")}" />
    <div class="form-grid" style="margin-top:12px">
      ${field("firstName", "Nome", names.firstName, true)}
      ${field("lastName", "Cognome", names.lastName, true)}
      ${field("cert", "N° brevetto", current.cert, true)}
      ${field("name", "Denominazione diving", current.role === "center" ? current.name : "", true)}
      ${field("lead", "Responsabile del diving", current.lead, true)}
      ${field("note", "Note", current.note, true)}
    </div>
    <p class="hint">${creating ? "Un contatto scritto qui è tuo: brevetto e firma che inserisci restano pronti in immersione." : current.remoteOwner && current.followOut && current.followIn ? "Vi seguite. Nome, cognome, numero di brevetto e firma entrano nella nuova immersione." : current.remoteOwner && current.followOut ? "Lo segui. Brevetto e firma entrano in immersione solo quando segue anche te." : current.remoteOwner && current.followIn ? "Ti segue. Segui anche tu per usare brevetto e firma in immersione." : "Per chi è su SeaDive, brevetto e firma entrano in immersione solo se vi seguite entrambi."}</p>
    <div data-personsign ${current.role === "center" ? "hidden" : ""}>
      <p class="hint">${current.remoteOwner && !(current.followOut && current.followIn) ? "La firma entra in immersione solo quando vi seguite entrambi." : "Firma di questa persona. Quando la inserisci come buddy o guida in una nuova immersione, va nello spazio firma."}</p>
      ${signPad("personSign", "Firma", current.role === "guide" ? "Guida / istruttore" : "Buddy", false)}
      ${signPreviewHtml(personKnownSign(current))}
    </div>
    ${current.remoteOwner && current.followOut && current.followIn ? `<p class="hint">Vi seguite. Nome, cognome, brevetto e firma si aggiornano da questo profilo.</p>` : ""}
    ${dives.length ? `<h3 class="serif">Immersioni insieme</h3><div class="people-list" data-dives></div>` : ""}
    <div class="actions">
      <button class="btn primary" type="submit">Salva</button>
      ${creating || current.role === "center" ? "" : `<button class="btn ghost" type="button" data-shareperson>Condividi nome e brevetto</button>`}
      ${creating || current.role === "center" || !current.remoteOwner || current.followOut ? "" : `<button class="btn primary" type="button" data-follow>${current.followIn ? "Segui anche tu" : "Segui"}</button>`}
      ${!creating && current.role !== "center" && current.remoteOwner && current.followOut ? `<button class="btn ghost" type="button" data-unfollow>Non seguire più</button>` : ""}
      ${!creating && current.role !== "center" && !current.remoteOwner && current.following ? `<button class="btn ghost" type="button" data-unfollow>Non seguire più</button>` : ""}
      <button class="btn ghost" type="button" data-back>Torna a Community</button>
      ${creating ? "" : `<button class="btn danger" type="button" data-del>Elimina contatto</button>`}
    </div>
  `;
  const roleInput = form.querySelector("[name=role]");
  const roles = form.querySelector("[data-roles]");
  [["buddy", "Buddy"], ["guide", "Istruttore"], ["center", "Diving"]].forEach(([id, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip${(current.role || "buddy") === id ? " on" : ""}`;
    b.textContent = label;
    if (creating) {
      b.onclick = () => {
        current.role = id;
        roleInput.value = id;
        roles.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        const signBox = form.querySelector("[data-personsign]");
        if (signBox) signBox.hidden = id === "center";
      };
    } else if (id !== (current.role || "buddy")) {
      b.disabled = true;
    }
    roles.append(b);
  });
  const diveBox = form.querySelector("[data-dives]");
  dives
    .slice()
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .forEach((d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "people-row";
      b.innerHTML = `<span><strong>${escapeHtml(d.site || "Senza nome")}</strong><small>${escapeHtml(d.date || "")}${d.maxDepth ? " · " + escapeHtml(d.maxDepth) + " m" : ""}</small></span>`;
      b.onclick = () => {
        view = { name: "detail", diveId: d.id, query: view.query || "" };
        render();
      };
      diveBox.append(b);
    });
  let personSign = personKnownSign(current);
  queueMicrotask(() => {
    bindSign(form.querySelector('[data-sign="personSign"]'), personSign, (v) => {
      personSign = v;
    });
  });
  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const denom = String(fd.get("name") || "").trim();
    const role = fd.get("role") || current.role;
    const name = role === "center" ? denom : [firstName, lastName].filter(Boolean).join(" ");
    if (!name) {
      alert(role === "center" ? "Scrivi la denominazione del diving." : "Scrivi nome e cognome.");
      return;
    }
    const before = creating ? null : { ...current };
    const person = upsertPerson({
      id: current.id,
      role,
      name,
      firstName: role === "center" ? "" : firstName,
      lastName: role === "center" ? "" : lastName,
      cert: fd.get("cert") || "",
      lead: fd.get("lead") || "",
      note: fd.get("note") || "",
      following: role === "center" ? false : current.following !== false,
      sign: role === "center" ? "" : personSign,
    });
    if (before && person) applyPersonOntoDives(before, person);
    if (person) stampPersonSign(person);
    state.peopleSeeded = true;
    save(state);
    view.personId = null;
    view.personDraft = null;
    view.peopleHint = "";
    render();
  };
  form.querySelector("[data-shareperson]")?.addEventListener("click", async () => {
    const names = personNames({
      ...current,
      firstName: form.querySelector("[name=firstName]")?.value || current.firstName,
      lastName: form.querySelector("[name=lastName]")?.value || current.lastName,
      name: current.role === "center" ? current.name : "",
    });
    const sent = await sharePersonCard({
      ...current,
      firstName: names.firstName,
      lastName: names.lastName,
      name: names.name || current.name,
      cert: form.querySelector("[name=cert]")?.value || current.cert,
    });
    if (!sent) return;
    view.peopleHint = "Inviati nome, cognome, brevetto e firma. Su SeaDive servono se vi seguite entrambi.";
  });
  form.querySelector("[data-back]").onclick = () => {
    view.personId = null;
    view.personDraft = null;
    render();
  };
  form.querySelector("[data-follow]")?.addEventListener("click", async () => {
    if (!current.remoteOwner) return;
    const me = myIdentityCard();
    if (!me.firstName && !me.lastName) {
      alert("Scrivi nome e cognome nel profilo, poi segui questa persona.");
      return;
    }
    const card = (seaDirectory.list || []).find((hit) => hit.owner === current.remoteOwner) || {
      owner: current.remoteOwner,
      firstName: current.firstName,
      lastName: current.lastName,
      name: current.name,
      cert: current.cert,
      sign: current.sign,
      level: current.level,
      portrait: current.portrait,
    };
    await connectSeaPerson(card, false);
  });
  form.querySelector("[data-unfollow]")?.addEventListener("click", async () => {
    if (current.remoteOwner) {
      await disconnectSeaPerson({
        owner: current.remoteOwner,
        firstName: current.firstName,
        lastName: current.lastName,
        name: current.name,
        cert: current.cert,
      });
      return;
    }
    upsertPerson({
      id: current.id,
      role: current.role,
      name: current.name,
      firstName: current.firstName,
      lastName: current.lastName,
      cert: current.cert,
      following: false,
    });
    save(state);
    view.personId = null;
    view.peopleHint = `${current.name} non è più tra i seguiti.`;
    render();
  });
  form.querySelector("[data-del]")?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!(await removePerson(current))) return;
    view.personId = null;
    view.personDraft = null;
    render();
  });
  frag.append(form);
  return frag;
}

function peoplePicksHtml() {
  return `<div class="people-picks" data-peoplepicks></div>`;
}

function bindPeoplePicks(form, d) {
  const box = form.querySelector("[data-peoplepicks]");
  if (!box) return;
  const groups = [
    ["buddy", "Buddy in community", "buddyName", "buddyCert", "buddyId"],
    ["guide", "Istruttori in community", "guideName", "guideCert", "guideId"],
    ["center", "Diving in community", "centerName", "centerLead", "centerId"],
  ];
  groups.forEach(([role, title, nameKey, extraKey, idKey]) => {
    const list = (state.people || []).filter((p) => p.role === role && (role === "center" || diveContactReady(p)));
    if (!list.length) return;
    const wrap = document.createElement("div");
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = title;
    const chips = document.createElement("div");
    chips.className = "chips";
    chips.dataset.pickrole = role;
    list
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "it"))
      .forEach((p) => {
        const b = document.createElement("button");
        b.type = "button";
        const extra = role === "center" ? p.lead : p.cert;
        const selected = d[idKey] === p.id || personKey(role, d[nameKey]) === personKey(role, p.name);
        b.className = `chip${selected ? " on" : ""}`;
        b.textContent = extra ? `${p.name} · ${extra}` : p.name;
        b.onclick = async () => {
          if (b.classList.contains("on")) {
            if (form._dropContact) await form._dropContact(role);
            return;
          }
          d[nameKey] = p.name;
          d[idKey] = p.id;
          d[extraKey] = role === "center" ? p.lead || "" : diveContactReady(p) ? p.cert || "" : "";
          const nameInput = form.querySelector(`[name=${nameKey}]`);
          const extraInput = form.querySelector(`[name=${extraKey}]`);
          if (nameInput) nameInput.value = d[nameKey];
          if (extraInput) extraInput.value = d[extraKey];
          chips.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
          b.classList.add("on");
          if (role === "buddy" || role === "guide") {
            const signKey = role === "buddy" ? "buddySign" : "guideSign";
            const sign = diveContactReady(p) ? personKnownSign(p) : "";
            if (sign) d[signKey] = sign;
            form._applyOwnerSign?.({ forceBuddy: role === "buddy", forceGuide: role === "guide" });
            const line = form.querySelector("[data-pickedperson]");
            if (line) {
              line.hidden = false;
              line.textContent = profileShareLine(p, sign);
            }
            save(state);
          }
          const dropBtn = form.querySelector(`[data-dropcontact="${role}"]`);
          if (dropBtn) dropBtn.hidden = false;
        };
        chips.append(b);
      });
    wrap.append(hint, chips);
    box.append(wrap);
  });
}

function renderProfile() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("Profilo"));
  const form = document.createElement("form");
  form.className = "card profile-form";
  const p = state.profile;
  let portrait = profilePortraitImage();
  form.innerHTML = `
    <div class="profile-hero">
      <div class="profile-id">
        <button class="profile-photo" type="button" data-pickphoto aria-label="Foto accanto al nome">
          ${portrait ? `<img alt="" src="${escapeHtml(portrait)}" />` : `<span>Foto</span>`}
        </button>
        <div>
          <p class="profile-kicker">In acqua</p>
          <h2 class="serif profile-title">${escapeHtml(p.name || loadSession()?.name || "Il tuo profilo")}</h2>
          <button class="btn ghost profile-photo-clear" type="button" data-clearphoto ${portrait ? "" : "hidden"}>Togli foto</button>
        </div>
      </div>
    </div>
    <input type="file" accept="image/*" data-photofile hidden />
    <section class="profile-block">
      <h3>Anagrafica</h3>
      <p class="hint">${profileOnlineStatus === "online" ? "Profilo online. Gli altri trovano nome, cognome, numero di brevetto, firma e la foto accanto al nome." : profileOnlineStatus === "short" ? "Servono nome e cognome: solo così il profilo va online." : "Online vanno nome, cognome, numero di brevetto, firma e la foto accanto al nome. Il diario resta sul telefono."}</p>
      <div class="form-grid">
        ${field("name", "Nome e cognome", p.name, true)}
      </div>
    </section>
    <section class="profile-block">
      <h3>Brevetto principale</h3>
      <div class="form-grid">
        ${field("certLevel", "Didattica / livello", p.certLevel, true)}
        ${field("certNumber", "N° brevetto", p.certNumber, true)}
        ${field("certDate", "Conseguito il", p.certDate, true, "date")}
      </div>
    </section>
    <section class="profile-block certs-box">
      <details class="certs-fold">
        <summary>Altri brevetti${(p.certs || []).filter((c) => c.name || c.number).length ? `<em>${(p.certs || []).filter((c) => c.name || c.number).length}</em>` : ""}</summary>
        <p class="hint">Rescue, Nitrox, Deep… con numero. In nuova immersione sono già selezionabili.</p>
        <div data-certs>${(p.certs || []).map((c) => certRowHtml(c)).join("") || certRowHtml()}</div>
        <button class="btn ghost btn-block" type="button" data-addcert>+ Aggiungi brevetto</button>
      </details>
    </section>
    <section class="profile-block">
      <h3>La tua firma</h3>
      <p class="hint">Firma qui una volta. Nome, cognome, didattica, numero di brevetto, firma e foto si vedono in Community: gli altri ti cercano lì, senza WhatsApp. Nella nuova immersione la firma entra nello spazio del buddy.</p>
      ${signPad("ownerSign", "Firma del subacqueo", p.name || "La tua firma", false)}
    </section>
    <section class="profile-block">
      <h3>Medico e assicurazione</h3>
      <div class="form-grid">
        ${field("medicalExpiry", "Certificato medico scadenza", p.medicalExpiry, true, "date")}
        ${field("insurance", "Assicurazione", p.insurance, true)}
      </div>
    </section>
    <section class="profile-block">
      <h3>Emergenza</h3>
      <div class="form-grid">
        <div class="form-pair">
          ${field("emergencyName", "Contatto", p.emergencyName)}
          ${field("emergencyPhone", "Telefono", p.emergencyPhone, false, "tel")}
        </div>
      </div>
    </section>
    <section class="profile-block">
      <h3>Attrezzatura e note</h3>
      <div class="form-grid">
        ${field("specialties", "Specialità", p.specialties, true)}
        ${field("equipment", "Attrezzatura personale", p.equipment, true, "textarea")}
      </div>
    </section>
    <section class="profile-block">
      <h3>Se trovi il diario</h3>
      <div class="form-grid">
        <div class="form-pair">
          ${field("recoverPhone", "Telefono", p.recoverPhone, false, "tel")}
          ${field("recoverEmail", "Email", p.recoverEmail, false, "email")}
        </div>
      </div>
    </section>
    <section class="profile-block vault-box">
      <h3>Copia di sicurezza</h3>
      <p class="hint" data-vaultline>${escapeHtml(vaultStatusLine())}</p>
      <p class="hint">Se perdi il telefono, reinstalli SeaDive e accedi con lo stesso Google: il diario torna da Drive, anche dopo anni. Esci non cancella le immersioni. La copia su Drive si aggiorna da sola a ogni immersione e ogni 15 giorni, senza finestre né richieste.</p>
      <div class="vault-actions">
        <button class="btn primary" type="button" data-syncdrive>Sincronizza con Google</button>
        <button class="btn ghost" type="button" data-sharebak>Copia sul telefono</button>
        <button class="btn ghost" type="button" data-dlbak>Scarica JSON</button>
      </div>
    </section>
    <div class="actions profile-actions">
      <button class="btn primary" type="submit">Salva profilo</button>
      <button class="btn ghost" type="button" data-out>Esci</button>
      <a class="btn ghost" href="./logbook_immersioni.pdf" target="_blank" rel="noopener">PDF cartaceo originale</a>
    </div>
    <p class="hint profile-account">Account: ${escapeHtml(loadSession()?.email || "—")}.</p>
  `;
  form.querySelector("[data-syncdrive]").onclick = async () => {
    const line = form.querySelector("[data-vaultline]");
    if (line) line.textContent = "Sincronizzo con Google…";
    const res = await syncWithDrive({ interactive: true });
    if (line) {
      line.textContent = res.ok
        ? vaultStatusLine()
        : res.reason === "auth"
          ? "Google non ha rinnovato l’accesso. Riprova e scegli lo stesso account."
          : vaultStatusLine();
    }
    render();
  };
  form.querySelector("[data-sharebak]").onclick = () => shareBackup();
  form.querySelector("[data-dlbak]").onclick = () => downloadBackup();
  const certsBox = form.querySelector("[data-certs]");
  const bindDel = (row) => {
    row.querySelector("[data-delcert]").onclick = () => {
      if (certsBox.querySelectorAll("[data-certrow]").length <= 1) {
        row.querySelector("[name=certName]").value = "";
        row.querySelector("[name=certNo]").value = "";
        return;
      }
      row.remove();
    };
  };
  certsBox.querySelectorAll("[data-certrow]").forEach(bindDel);
  form.querySelector("[data-addcert]").onclick = () => {
    certsBox.insertAdjacentHTML("beforeend", certRowHtml());
    bindDel(certsBox.querySelector("[data-certrow]:last-child"));
  };
  let ownerSign = profileSignImage();
  const photoBtn = form.querySelector("[data-pickphoto]");
  const photoFile = form.querySelector("[data-photofile]");
  const clearPhoto = form.querySelector("[data-clearphoto]");
  const paintPortrait = () => {
    photoBtn.innerHTML = portrait ? `<img alt="" src="${escapeHtml(portrait)}" />` : "<span>Foto</span>";
    clearPhoto.hidden = !portrait;
  };
  photoBtn.onclick = () => photoFile.click();
  photoFile.onchange = async () => {
    const file = photoFile.files && photoFile.files[0];
    photoFile.value = "";
    if (!file) return;
    const raw = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
    const shrunk = await shrinkPortrait(raw);
    if (!shrunk) return;
    portrait = shrunk;
    state.profile.portrait = shrunk;
    ensureOwnerPerson();
    save(state);
    publishMyProfile().catch(() => {});
    paintPortrait();
  };
  clearPhoto.onclick = () => {
    portrait = "";
    state.profile.portrait = "";
    ensureOwnerPerson();
    save(state);
    publishMyProfile().catch(() => {});
    paintPortrait();
  };
  queueMicrotask(() => {
    bindSign(form.querySelector('[data-sign="ownerSign"]'), ownerSign, (v) => {
      ownerSign = v;
    });
  });
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    fd.delete("certName");
    fd.delete("certNo");
    const certs = [...certsBox.querySelectorAll("[data-certrow]")]
      .map((row) => ({
        id: uid(),
        name: row.querySelector("[name=certName]").value.trim(),
        number: row.querySelector("[name=certNo]").value.trim(),
      }))
      .filter((c) => c.name || c.number);
    state.profile = {
      ...state.profile,
      ...Object.fromEntries(fd.entries()),
      certs,
      sign: typeof ownerSign === "string" && ownerSign.startsWith("data:image") ? ownerSign : "",
      portrait,
    };
    save(state);
    publishMyProfile().catch(() => {});
    render();
  };
  form.querySelector("[data-out]").onclick = () => {
    window.SeaDiveDrive?.signOutGoogle?.();
    localStorage.removeItem(SESSION_KEY);
    render();
  };
  frag.append(form);
  return frag;
}

function field(name, label, value, full = false, type = "text") {
  const cls = `field${full ? " full" : ""}`;
  if (type === "textarea") {
    return `<label class="${cls}">${escapeHtml(label)}<textarea name="${name}">${escapeHtml(value)}</textarea></label>`;
  }
  if (type === "date") {
    return `<label class="${cls}">${escapeHtml(label)}<span class="date-box"><input name="${name}" type="date" value="${escapeHtml(value)}" /></span></label>`;
  }
  if (type === "time") {
    return `<label class="${cls}">${escapeHtml(label)}<span class="time-box"><input name="${name}" type="time" value="${escapeHtml(value)}" /></span></label>`;
  }
  if (type === "decimal" || type === "number") {
    return `<label class="${cls}">${escapeHtml(label)}<input name="${name}" type="text" inputmode="decimal" lang="it" enterkeyhint="done" value="${escapeHtml(value)}" /></label>`;
  }
  return `<label class="${cls}">${escapeHtml(label)}<input name="${name}" type="${type}" value="${escapeHtml(value)}" /></label>`;
}

function fitDumpHtml(log) {
  const all = log?.all;
  const keys = all && typeof all === "object" ? Object.keys(all) : [];
  if (!keys.length) return "";
  return `<div class="computer-log">
    <h3 class="serif">Tutti i dati del file</h3>
    <div class="kv fit-dump">${keys
      .map((k) => `<div><b>${escapeHtml(k)}</b>${escapeHtml(all[k])}</div>`)
      .join("")}</div>
  </div>`;
}

function renderDetail() {
  const d = state.dives.find((x) => x.id === view.diveId);
  if (d) ensureCircuit(d);
  const frag = document.createDocumentFragment();
  if (!d) {
    view = { name: "log" };
    return renderLog();
  }
  applyDiveMetrics(d);
  if (fillMissingSigns(d)) save(state);
  frag.append(topbar(`immersione n° ${d.number}`));
  const card = document.createElement("section");
  card.className = "card";
  const stars = "★".repeat(d.feeling || 0) + "☆".repeat(Math.max(0, 5 - (d.feeling || 0)));
  card.innerHTML = `
    <div class="detail-hero">
      <div>
        <p class="meta" style="margin:0 0 4px">${escapeHtml(d.date)} · ${escapeHtml(d.timeIn || "—")} → ${escapeHtml(d.timeOut || "—")}</p>
        <h2 class="serif" style="margin:0">${escapeHtml(d.site || "Senza nome")}</h2>
        <p class="meta">${escapeHtml(d.location)}${geoText(d) ? " · " + escapeHtml(geoText(d)) : ""}${d.feeling ? " · " + stars : ""}</p>
        <div class="pills" style="margin-top:10px">${(d.types || []).map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>
      </div>
      <div class="num">${escapeHtml(d.number)}</div>
    </div>
    ${computerFillHtml()}
    ${d.photo ? `<img class="cover" alt="" src="${d.photo}" />` : ""}
    ${satMapHtml(d, "sat-place")}
    <div class="kv">
      <div><b>Coordinate</b>${escapeHtml(geoText(d) || "—")}</div>
      <div><b>Prof. max</b>${escapeHtml(d.maxDepth || "—")} m</div>
      <div><b>Prof. media</b>${escapeHtml(d.avgDepth || d.computerLog?.avgDepth || "—")} m</div>
      <div><b>Prof. programmata</b>${escapeHtml(d.plannedDepth || "—")} m</div>
      <div><b>Tempo di fondo</b>${escapeHtml(d.bottomTime || "—")} min</div>
      <div><b>Tempo totale</b>${escapeHtml(d.totalTime || "—")} min</div>
      <div><b>Risalita media</b><span class="${ascentClass(d.ascentRate)}">${escapeHtml(d.ascentRate || "—")} m/min</span></div>
      <div><b>Risalita max</b><span class="${ascentClass(d.ascentMax)}">${escapeHtml(d.ascentMax || "—")} m/min</span></div>
      <div><b>SAC superficie</b>${escapeHtml(d.sac || "—")} L/min</div>
      <div><b>Sosta sicurezza</b>${escapeHtml(d.safetyStop || "—")} min</div>
      <div><b>Intervallo superficie</b>${escapeHtml(d.surfaceInterval || d.computerLog?.surfaceInterval || "—")}${d.surfaceInterval || d.computerLog?.surfaceInterval ? " min" : ""}</div>
      <div><b>Visibilità</b>${escapeHtml(d.visibility || "—")} m</div>
      <div><b>Temp. acqua / aria</b>${escapeHtml(d.waterTemp || "—")}° / ${escapeHtml(d.airTemp || "—")}°</div>
      <div><b>Temp. fondo</b>${escapeHtml(d.bottomTemp || "—")} °C</div>
      <div><b>CNS</b>${escapeHtml(d.cns !== "" && d.cns != null ? String(d.cns) + "%" : d.computerLog?.cns != null && d.computerLog.cns !== "" ? String(d.computerLog.cns) + "%" : "—")}</div>
      <div><b>OTU</b>${escapeHtml(d.otu !== "" && d.otu != null ? String(d.otu) : d.computerLog?.otu != null && d.computerLog.otu !== "" ? String(d.computerLog.otu) : "—")}</div>
      <div><b>TSS</b>${escapeHtml(d.tss !== "" && d.tss != null ? String(d.tss) : "—")}${d.tssLabel ? " · " + escapeHtml(d.tssLabel) : ""}</div>
      <div><b>Corrente</b>${escapeHtml(d.current || "—")}</div>
      <div><b>Mare</b>${escapeHtml(d.seaConditions || "—")}</div>
      <div><b>Muta / zavorra</b>${escapeHtml(d.wetsuit || "—")} mm · ${escapeHtml(d.ballast || "—")} kg</div>
      <div><b>Bombola / miscela</b>${escapeHtml(d.tank || "—")} L · EAN ${escapeHtml(d.mix || "21")}</div>
      <div><b>Pressione</b>${escapeHtml(d.pressureStart || "—")} → ${escapeHtml(d.pressureEnd || "—")} bar</div>
      <div><b>Autorespiratore</b>${escapeHtml(circuitLabel(d))}</div>
      <div><b>Fuori curva</b>${escapeHtml(d.deco ? "Sì" : "No")}</div>
      <div><b>NDL</b>${escapeHtml(d.ndl !== "" && d.ndl != null ? String(d.ndl) + " min" : "—")}</div>
      <div><b>GF</b>${escapeHtml(d.gf || d.computerLog?.gf || "—")}</div>
      <div><b>Strumentazione</b>${escapeHtml(d.instruments || "—")}</div>
      <div><b>Brevetto in scheda</b>${escapeHtml(d.certOnDive || "—")}</div>
    </div>
    ${fitDumpHtml(d.computerLog)}
    <h3 class="serif">Consumo in superficie</h3>
    ${effortHtml(d)}
    <h3 class="serif">Profilo di immersione</h3>
    <p class="hint">${escapeHtml(d.deco ? "Fuori curva: sì" : "Fuori curva: no")}</p>
    <canvas class="profile" data-readonly="1"></canvas>
    <h3 class="serif">Temperatura / profondità</h3>
    <canvas class="profile thermo-detail" data-thermo="1"></canvas>
    <p class="hint">Curva dal computer: profondità in verticale, temperatura in orizzontale.</p>
    <h3 class="serif">Note e sensazioni</h3>
    <p>${escapeHtml(d.notes || "—")}</p>
    <h3 class="serif">Firme — L. 70/2026</h3>
    <p class="hint">${LEGAL_L70}</p>
    <div class="sign-board">
      ${ownerSignCard()}
      ${signEvidence("buddy", "Buddy", d.buddyName, d.buddyCert, d.buddySign, d.sigMeta?.buddy)}
      ${signEvidence("guide", "Guida / istruttore", d.guideName, d.guideCert, d.guideSign, d.sigMeta?.guide)}
      ${signEvidence("center", "Diving center", d.centerName, d.centerLead, d.centerSign, d.sigMeta?.center)}
    </div>
    <div class="actions">
      <button class="btn primary" type="button" data-act="edit">Modifica</button>
      <button class="btn ghost" type="button" data-act="share">Condividi</button>
      <button class="btn ghost" type="button" data-act="back">Torna al diario</button>
      <button class="btn danger" type="button" data-act="del">Elimina</button>
    </div>
    <p class="hint">Condividi porta anche la firma del buddy, della guida e del diving. Chi la riceve con Ricevi immersione la ritrova già firmata.</p>
    <div class="dive-export">
      <button class="dive-chip" type="button" data-act="pdf" aria-label="Scarica PDF">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7.5L19 8v12.5H7z"/><path d="M14 3.5V8h5"/><path d="M9 13h6M9 16.5h4"/></svg>
        PDF
      </button>
    </div>
  `;
  bindComputerFill(card);
  card.querySelector("[data-act=edit]").onclick = () => {
    view = { name: "edit", diveId: d.id, draft: cloneObj(d), query: view.query };
    render();
  };
  card.querySelector("[data-act=share]").onclick = () => shareOneDive(d);
  card.querySelector("[data-act=pdf]").onclick = () => downloadDivePdf(d);
  card.querySelector("[data-act=back]").onclick = () => {
    view = { name: "log", query: view.query };
    render();
  };
  card.querySelector("[data-act=del]").onclick = async () => {
    if (!(await removeDive(d))) return;
    view = { name: "log", query: view.query };
    render();
  };
  card.querySelectorAll("[data-clearsign]").forEach((btn) => {
    btn.onclick = async () => {
      const who = btn.getAttribute("data-clearsign");
      const spec = DIVE_CONTACT[who];
      if (!spec) return;
      const live = state.dives.find((x) => x.id === d.id);
      if (!live) return;
      if (live[spec.sign]) {
        const ok = await askConfirm({
          title: "Cancella firma",
          message: "Vuoi cancellare questa firma e rifarla?",
          ok: "Cancella",
          cancel: "Annulla",
        });
        if (!ok) return;
        live.signSkipped = { ...(live.signSkipped || {}), [who]: true };
      }
      live[spec.sign] = "";
      if (live.sigMeta) live.sigMeta[spec.meta] = null;
      save(state);
      view = { name: "edit", diveId: live.id, draft: cloneObj(live), query: view.query, focusSign: spec.sign };
      render();
    };
  });
  card.querySelectorAll("[data-dropcontact]").forEach((btn) => {
    btn.onclick = async () => {
      const role = btn.getAttribute("data-dropcontact");
      if (!DIVE_CONTACT[role]) return;
      const live = state.dives.find((x) => x.id === d.id);
      if (!live || !diveContactPresent(live, role)) return;
      if (!(await askDropDiveContact(live, role))) return;
      clearDiveContact(live, role);
      save(state);
      render();
    };
  });
  frag.append(card);
  queueMicrotask(() => {
    const drawn = ensureThermoProfile(d);
    drawProfile(card.querySelector("canvas.profile:not([data-thermo])"), drawn, false, null, d.deco);
    const th = card.querySelector("[data-thermo]");
    if (th) drawTempDepth(th, drawn);
  });
  return frag;
}

function startNew() {
  const draft = emptyDive();
  draft.manual = true;
  draft.number = nextNumber();
  draft.certOnDive = [state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" ");
  const prev = [...(state.dives || [])].sort((a, b) => {
    const da = `${a.date || ""}T${a.timeIn || "00:00"}`;
    const db = `${b.date || ""}T${b.timeIn || "00:00"}`;
    return da.localeCompare(db);
  }).pop();
  draft.tank = "15";
  draft.pressureStart = Number(prev?.pressureStart) >= 150 ? String(prev.pressureStart) : "200";
  forgetDeletedDive(draft);
  state.dives.push(draft);
  save(state);
  view = { name: "edit", diveId: draft.id, draft, query: view.query };
  render();
}

function renderEdit() {
  const d = view.draft;
  ensureCircuit(d);
  applyDiveMetrics(d);
  if (fillMissingSigns(d)) {
    const live = (state.dives || []).find((x) => x.id === d.id);
    if (live) {
      if (!live.buddySign) live.buddySign = d.buddySign;
      if (!live.guideSign) live.guideSign = d.guideSign;
      save(state);
    }
  }
  const frag = document.createDocumentFragment();
  frag.append(topbar(d.number ? `scheda n° ${d.number}` : "nuova scheda"));
  const form = document.createElement("form");
  form.className = "card dive-edit";
  const log = d.computerLog || {};
  form.innerHTML = `
    ${computerFillHtml()}
    <div class="form-grid">
      ${field("number", "Immersione n°", d.number, false, "number")}
      ${field("date", "Data", d.date, false, "date")}
      ${field("site", "Sito di immersione", d.site, true)}
      ${field("location", "Località / paese", d.location, true)}
    </div>
    <input type="hidden" name="lat" value="${escapeHtml(d.lat || "")}" />
    <input type="hidden" name="lng" value="${escapeHtml(d.lng || "")}" />
    <p class="hint" style="margin-top:14px">Mappa del sito — tocca o trascina il pin</p>
    <div class="site-map" data-sitemap></div>
    <div class="actions" style="margin-top:8px">
      <button class="btn ghost" type="button" data-findsite>Cerca il sito sulla mappa</button>
      <button class="btn ghost" type="button" data-geo>Usa posizione attuale</button>
    </div>
    <p class="hint" data-geohint>Tocca o trascina il pin. Non serve scrivere latitudine e longitudine.</p>
    <div class="form-grid">
      <div class="form-pair">
        ${field("timeIn", "Ora ingresso", d.timeIn, false, "time")}
        ${field("timeOut", "Ora uscita", d.timeOut, false, "time")}
      </div>
      ${field("maxDepth", "Prof. max (m)", d.maxDepth, false, "number")}
      ${field("avgDepth", "Prof. media (m)", d.avgDepth || d.computerLog?.avgDepth || "", false, "number")}
      ${field("plannedDepth", "Prof. programmata (m)", d.plannedDepth, false, "number")}
      ${field("bottomTime", "Tempo di fondo (min)", d.bottomTime, false, "number")}
      ${field("totalTime", "Durata totale (min)", d.totalTime, false, "number")}
      ${field("safetyStop", "Sosta sicurezza (min)", d.safetyStop, false, "number")}
      ${field("surfaceInterval", "Intervallo superficie (min)", d.surfaceInterval || d.computerLog?.surfaceInterval || "")}
      ${field("visibility", "Visibilità (m)", d.visibility, false, "number")}
      ${field("waterTemp", "Temp. acqua (°C)", d.waterTemp, false, "number")}
      ${field("bottomTemp", "Temp. fondo (°C)", d.bottomTemp, false, "number")}
      ${field("airTemp", "Temp. aria (°C)", d.airTemp, false, "number")}
      ${field("cns", "CNS %", d.cns !== "" && d.cns != null ? d.cns : d.computerLog?.cns || "", false, "number")}
      ${field("otu", "OTU", d.otu !== "" && d.otu != null ? d.otu : d.computerLog?.otu || "", false, "number")}
      ${field("tss", "TSS stress allenamento", d.tss, false, "number")}
      ${field("current", "Corrente", d.current)}
      ${field("seaConditions", "Mare / condizioni", d.seaConditions)}
      ${field("wetsuit", "Muta (mm)", d.wetsuit)}
      ${field("ballast", "Zavorra (kg)", d.ballast)}
      ${field("tank", "Bombola (L)", d.tank)}
      ${field("mix", "Miscela Nitrox %", d.mix)}
      ${field("pressureStart", "Press. inizio (bar)", d.pressureStart)}
      ${field("pressureEnd", "Press. fine (bar)", d.pressureEnd)}
    </div>
    <p class="hint">Inizio precompilato a 200 bar e bombola 15 L se il computer non li ha. Inserisci i bar di fine: il SAC si calcola da solo.</p>
    <div class="form-grid">
      ${field("ascentRate", "Risalita media (m/min)", d.ascentRate, false, "number")}
      ${field("ascentMax", "Risalita max (m/min)", d.ascentMax, false, "number")}
      ${field("sac", "Consumo superficie / SAC (L/min)", d.sac, false, "decimal")}
      ${field("gf", "GF (low/high)", d.gf || d.computerLog?.gf || "", false, "text")}
      ${field("ndl", "NDL residuo (min)", d.ndl !== "" && d.ndl != null ? d.ndl : d.computerLog?.ndl || "", false, "number")}
      ${field("instruments", "Strumentazione", d.instruments)}
    </div>
    <p class="hint">Autorespiratore — spunta circuito aperto, chiuso o entrambi</p>
    ${checkPicks([
      { name: "circuitOpen", label: "Circuito aperto", on: d.circuitOpen },
      { name: "circuitClosed", label: "Circuito chiuso", on: d.circuitClosed },
    ])}
    <div class="form-grid">
      ${field("certOnDive", "Il tuo brevetto (livello e n°)", d.certOnDive, true)}
    </div>
    <div class="cert-picks" data-certpicks></div>
    <p class="hint">Tocca un brevetto del profilo per inserirlo in scheda. Il principale è già proposto.</p>
    <p class="hint" style="margin-top:14px">TIPO</p>
    <div class="chips" data-chips></div>
    <p class="hint" style="margin-top:14px">Sensazioni</p>
    <div class="stars" data-stars></div>
    <label class="field full" style="margin-top:12px">Foto dell'immersione
      <input name="photoFile" type="file" accept="image/*" />
    </label>
    ${d.photo ? `<img class="cover" alt="" src="${d.photo}" data-preview />` : `<img class="cover" alt="" hidden data-preview />`}
    <label class="field full" style="margin-top:12px">Note e sensazioni
      <textarea name="notes">${escapeHtml(d.notes)}</textarea>
    </label>
    <div class="computer-log">
      <h3 class="serif">Fisiologia e computer</h3>
      <div class="kv">
        <div><b>Origine</b>${escapeHtml(String(log.format || d.instruments || "—"))}</div>
        <div><b>Prof. media</b>${escapeHtml(d.avgDepth || log.avgDepth ? (d.avgDepth || log.avgDepth) + " m" : "—")}</div>
        <div><b>Modo</b>${escapeHtml(log.mode || "—")}</div>
        <div><b>CNS</b>${escapeHtml(d.cns !== "" && d.cns != null ? String(d.cns) + "%" : log.cns !== "" && log.cns != null ? String(log.cns) + "%" : "—")}</div>
        <div><b>OTU</b>${escapeHtml(d.otu !== "" && d.otu != null ? String(d.otu) : log.otu !== "" && log.otu != null ? String(log.otu) : "—")}</div>
        <div><b>TSS</b>${escapeHtml(d.tss !== "" && d.tss != null ? String(d.tss) : "—")}${d.tssLabel ? " · " + escapeHtml(d.tssLabel) : ""}</div>
        <div><b>Temp. fondo</b>${escapeHtml(d.bottomTemp ? d.bottomTemp + " °C" : "—")}</div>
        <div><b>Durata tot.</b>${escapeHtml(d.totalTime ? d.totalTime + " min" : "—")}</div>
        <div><b>Risalita</b>${escapeHtml(d.ascentRate ? d.ascentRate + " m/min" : "—")}${d.ascentMax ? " (max " + escapeHtml(d.ascentMax) + ")" : ""}</div>
        <div><b>SAC</b>${escapeHtml(d.sac ? d.sac + " L/min" : "—")}</div>
        <div><b>Fuori curva</b>${escapeHtml(d.deco ? "Sì" : "No")}</div>
        <div><b>NDL</b>${escapeHtml(d.ndl !== "" && d.ndl != null ? String(d.ndl) + " min" : "—")}</div>
        <div><b>Autorespiratore</b>${escapeHtml(circuitLabel(d))}</div>
        <div><b>GF</b>${escapeHtml(d.gf || log.gf || "—")}</div>
        <div><b>Campioni curva</b>${escapeHtml(String(log.samples || (d.profilePoints || []).length || 0))}</div>
        ${log.hrAvg ? `<div><b>FC media</b>${escapeHtml(String(log.hrAvg))} bpm</div>` : ""}
        ${log.hrMax ? `<div><b>FC max</b>${escapeHtml(String(log.hrMax))} bpm</div>` : ""}
      </div>
    </div>
    ${fitDumpHtml(log)}
    <h3 class="serif">Fatica — litri/minuto in superficie</h3>
    <div data-effortwrap>${effortHtml(d)}</div>
    <p class="hint" data-tsshint>${escapeHtml(d.tssLabel || "TSS = intensità² × durata, ponderata sulla soglia zona 4/5. Senza FC si usa TSS(MET) da SAC e profondità. Puoi sovrascrivere a mano (TSS Manuale).")}</p>
    <h3 class="serif">Profilo di immersione</h3>
    <p class="hint">Fuori curva (decompressione) sì o no — puoi correggere con la spunta.</p>
    ${checkPicks([
      { name: "noDeco", label: "In curva", on: d.noDeco },
      { name: "hadDeco", label: "Fuori curva", on: d.deco },
    ])}
    <canvas class="profile" data-profile></canvas>
    <p class="hint" data-profilehint>Curva profondità dal computer, aggiornata in automatico.</p>
    <h3 class="serif">Temperatura / profondità</h3>
    <canvas class="profile thermo-detail" data-thermo-edit></canvas>
    <p class="hint">Grafico dal FIT: profondità in verticale, temperatura in orizzontale (arancione anche sul profilo).</p>
    <div class="sign-legal" id="firme">
      <h3 class="serif">Firme del libretto — L. 70/2026 art. 12 c. 8</h3>
      <p class="hint">${LEGAL_L70} La firma della guida o istruttore responsabile è richiesta dalla legge (lett. n–o). Ogni firmatario scrive a mano, conferma con la spunta e può cancellare per ripetere.</p>
      ${ownerOnDiveHtml()}
      ${peoplePicksHtml()}
      <p class="hint" data-pickedperson hidden></p>
      <p class="hint">Tocca chi segui: nome, cognome, numero di brevetto e firma entrano nella scheda.</p>
      <div class="form-grid">
        ${field("buddyName", "Buddy — nome e cognome", d.buddyName)}
        ${field("buddyCert", "Buddy — n° brevetto", d.buddyCert)}
        ${dropContactButton("buddy", d)}
        ${field("guideName", "Guida / istruttore — generalità", d.guideName)}
        ${field("guideCert", "N° brevetto guida / istruttore", d.guideCert)}
        ${dropContactButton("guide", d)}
        ${field("centerName", "Denominazione diving center", d.centerName, true)}
        ${field("centerLead", "Responsabile del centro", d.centerLead, true)}
        ${dropContactButton("center", d)}
      </div>
      ${signPad("buddySign", "Firma buddy", "Compagno di immersione")}
      ${signPad("guideSign", "Firma guida / istruttore", "Obbligatoria per legge sulla scheda")}
      ${signPad("centerSign", "Firma diving center", "Responsabile del centro")}
    </div>
    <div class="actions">
      <button class="btn primary" type="submit">Salva immersione</button>
      <button class="btn ghost" type="button" data-cancel>Annulla</button>
      ${state.dives.some((x) => x.id === d.id) ? `<button class="btn danger" type="button" data-deldive>Elimina</button>` : ""}
    </div>
  `;
  bindComputerFill(form);
  bindPeoplePicks(form, d);
  form.querySelectorAll("[data-dropcontact]").forEach((btn) => {
    btn.onclick = async (e) => {
      e.preventDefault();
      const role = btn.getAttribute("data-dropcontact");
      if (form._dropContact) await form._dropContact(role);
    };
  });
  const certInput = form.querySelector("[name=certOnDive]");
  const picks = form.querySelector("[data-certpicks]");
  profileCerts().forEach((c) => {
    const label = certLabel(c);
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip${label === (d.certOnDive || "") ? " on" : ""}`;
    b.textContent = c.main ? `${label} · principale` : label;
    b.onclick = () => {
      d.certOnDive = label;
      if (certInput) certInput.value = label;
      picks.querySelectorAll(".chip").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
    };
    picks.append(b);
  });
  const chips = form.querySelector("[data-chips]");
  TYPES.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `chip${d.types.includes(t) ? " on" : ""}`;
    b.textContent = t;
    b.onclick = () => {
      d.types = d.types.includes(t) ? d.types.filter((x) => x !== t) : [...d.types, t];
      b.classList.toggle("on");
    };
    chips.append(b);
  });
  const stars = form.querySelector("[data-stars]");
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "★";
    b.className = i <= (d.feeling || 0) ? "on" : "";
    b.onclick = () => {
      d.feeling = d.feeling === i ? 0 : i;
      [...stars.children].forEach((el, idx) => el.classList.toggle("on", idx < d.feeling));
    };
    stars.append(b);
  }
  form.querySelector("[data-geo]").onclick = () => {
    const hint = form.querySelector("[data-geohint]");
    if (!navigator.geolocation) {
      hint.textContent = "GPS non disponibile in questo browser.";
      return;
    }
    hint.textContent = "Rilevo la posizione…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (form._placePin) form._placePin(pos.coords.latitude, pos.coords.longitude, { zoom: 16, hint: "Posizione del telefono. Trascina il pin se eri a riva, non sul relitto." });
        else {
          writeDiveCoords(form, d, pos.coords.latitude, pos.coords.longitude);
          reverseFillLocation(form, d, pos.coords.latitude, pos.coords.longitude);
        }
      },
      () => {
        hint.textContent = "Posizione non disponibile. Tocca la mappa sul sito.";
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };
  form.querySelector("[data-findsite]").onclick = async () => {
    const hint = form.querySelector("[data-geohint]");
    const q = [form.querySelector("[name=site]")?.value, form.querySelector("[name=location]")?.value]
      .map((s) => String(s || "").trim())
      .filter(Boolean)
      .join(", ");
    if (!q) {
      hint.textContent = "Scrivi il nome del sito o la località, poi cerca.";
      return;
    }
    hint.textContent = "Cerco il sito…";
    try {
      applyPlaceToDive({ ...d, site: form.querySelector("[name=site]").value, location: form.querySelector("[name=location]").value });
      const hit = coordsForDive({ ...d, site: form.querySelector("[name=site]").value, location: form.querySelector("[name=location]").value, lat: "", lng: "" });
      const found = hit || (await geocodeQuery(q));
      if (!found) {
        hint.textContent = "Nessun punto trovato. Scorri la mappa e tocca a mano.";
        return;
      }
      if (form._placePin) {
        form._placePin(found.lat, found.lng, {
          zoom: 15,
          hint: "Sito trovato e salvato sulla mappa. La prossima volta basta il nome.",
        });
      }
    } catch {
      hint.textContent = "Ricerca non disponibile. Tocca la mappa sul sito.";
    }
  };
  form.querySelector('input[name="photoFile"]').onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    d.photo = await compressImage(file);
    const preview = form.querySelector("[data-preview]");
    preview.src = d.photo;
    preview.hidden = false;
  };
  const canvas = form.querySelector("[data-profile]");
  const refreshProfile = () => {
    if (!d.profileFromComputer || (d.profilePoints || []).length < 3) d.profilePoints = autoProfile(d);
    const pts = ensureThermoProfile(d);
    drawProfile(canvas, pts, false, null, d.deco);
    const hint = form.querySelector("[data-profilehint]");
    if (hint) hint.textContent = d.deco ? "Fuori curva: sì" : "Fuori curva: no";
    const th = form.querySelector("[data-thermo-edit]");
    if (th) drawTempDepth(th, pts);
    refreshPhysio();
  };
  const refreshPhysio = () => {
    applyDiveMetrics(d);
    ["ascentRate", "ascentMax", "sac"].forEach((name) => {
      const el = form.querySelector(`[name=${name}]`);
      if (el && document.activeElement !== el) el.value = d[name] || "";
    });
    const wrap = form.querySelector("[data-effortwrap]");
    if (wrap) wrap.innerHTML = effortHtml(d);
    const th = form.querySelector("[data-tsshint]");
    if (th) th.textContent = d.tssLabel || th.textContent;
  };
  ["site", "location"].forEach((name) => {
    form.querySelector(`[name=${name}]`)?.addEventListener("change", () => {
      d[name] = form.querySelector(`[name=${name}]`).value;
      const before = geoCoords(d.lat, d.lng);
      applyPlaceToDive(d);
      if (!before && geoCoords(d.lat, d.lng) && form._placePin) {
        form._placePin(d.lat, d.lng, { zoom: 15, skipGeo: true, hint: "Punto dal catalogo. Trascina se non è esatto." });
      }
    });
  });
  form.querySelectorAll("[name=hadDeco], [name=noDeco]").forEach((el) => {
    el.addEventListener("change", () => {
      d.deco = Boolean(form.querySelector("[name=hadDeco]")?.checked);
      d.noDeco = Boolean(form.querySelector("[name=noDeco]")?.checked);
      refreshProfile();
    });
  });
  ["maxDepth", "plannedDepth", "bottomTime", "totalTime", "safetyStop", "timeIn", "timeOut", "waterTemp", "bottomTemp", "airTemp", "tank", "pressureStart", "pressureEnd"].forEach((name) => {
    form.querySelector(`[name=${name}]`)?.addEventListener("input", () => {
      d[name] = form.querySelector(`[name=${name}]`).value;
      refreshProfile();
    });
  });
  form.querySelector("[name=sac]")?.addEventListener("input", () => {
    d.sac = form.querySelector("[name=sac]").value;
    d.sacManual = true;
    const wrap = form.querySelector("[data-effortwrap]");
    if (wrap) wrap.innerHTML = effortHtml(d);
  });
  form.querySelector("[name=tss]")?.addEventListener("input", () => {
    d.tss = form.querySelector("[name=tss]").value;
    d.tssKind = "manual";
    d.tssLabel = "TSS(Manuale)";
    const th = form.querySelector("[data-tsshint]");
    if (th) th.textContent = d.tssLabel;
  });
  queueMicrotask(() => {
    applyPlaceToDive(d);
    bindDiveSiteMap(form, d);
    refreshProfile();
    const applied = { buddy: "", guide: "" };
    const buddyPad = bindSign(form.querySelector('[data-sign="buddySign"]'), d.buddySign, (v) => {
      d.buddySign = v;
      if (v !== applied.buddy) applied.buddy = "";
    });
    const guidePad = bindSign(form.querySelector('[data-sign="guideSign"]'), d.guideSign, (v) => {
      d.guideSign = v;
      if (v !== applied.guide) applied.guide = "";
    });
    const centerPad = bindSign(form.querySelector('[data-sign="centerSign"]'), d.centerSign, (v) => (d.centerSign = v));
    const stamped = { buddy: null, guide: null };
    form._applyOwnerSign = (opts = {}) => {
      [
        ["buddyName", "buddyCert", "buddySign", buddyPad, "buddy", "buddyId"],
        ["guideName", "guideCert", "guideSign", guidePad, "guide", "guideId"],
      ].forEach(([nameKey, certKey, signKey, pad, role, idKey]) => {
        const typed = form.querySelector(`[name=${nameKey}]`)?.value || "";
        const force = role === "buddy" ? opts.forceBuddy : opts.forceGuide;
        if (d.signSkipped?.[role] && !force && opts.initial) return;
        if (force && d.signSkipped) delete d.signSkipped[role];
        const named = personByTypedName(role, typed);
        const certInput = form.querySelector(`[name=${certKey}]`);
        const prev = stamped[role];
        const ready = named && diveContactReady(named);
        if (ready) {
          d[idKey] = named.id;
          d[certKey] = named.cert || "";
          if (certInput) certInput.value = named.cert || "";
          stamped[role] = { id: named.id, cert: named.cert || "" };
        } else if (named) {
          d[idKey] = named.id;
          if (certInput && prev && certInput.value === prev.cert) {
            d[certKey] = "";
            certInput.value = "";
          }
          stamped[role] = null;
        } else if (prev && certInput && certInput.value === prev.cert) {
          d[idKey] = "";
          d[certKey] = "";
          certInput.value = "";
          stamped[role] = null;
        }
        const sign = ready
          ? (personKnownSign(named) || signForInsertedPerson(role, typed))
          : samePersonName(state.profile?.name, typed)
            ? profileSignImage()
            : "";
        const current = d[signKey] || "";
        if (sign && (force || !current || applied[role] || current === sign)) {
          applied[role] = sign;
          pad?.set(sign);
          showAppliedSign(form.querySelector(`[data-pad="${signKey}"]`), sign);
        } else if (!sign && applied[role]) {
          applied[role] = "";
          pad?.clear();
          showAppliedSign(form.querySelector(`[data-pad="${signKey}"]`), "");
        }
      });
      const line = form.querySelector("[data-pickedperson]");
      const buddyNamed = personByTypedName("buddy", form.querySelector("[name=buddyName]")?.value || "");
      const guideNamed = personByTypedName("guide", form.querySelector("[name=guideName]")?.value || "");
      const shown = buddyNamed || guideNamed;
      if (line && shown) {
        line.hidden = false;
        line.textContent = diveContactReady(shown) ? profileShareLine(shown, personKnownSign(shown)) : followWaitText(shown);
      } else if (line && !opts.forceBuddy && !opts.forceGuide) {
        line.hidden = true;
        line.textContent = "";
      }
    };
    form._dropContact = async (role) => {
      const spec = DIVE_CONTACT[role];
      if (!spec) return;
      const nameInput = form.querySelector(`[name=${spec.name}]`);
      const extraInput = form.querySelector(`[name=${spec.extra}]`);
      const typed = String(nameInput?.value || d[spec.name] || "").trim();
      if (!typed && !diveContactPresent(d, role)) return;
      if (!(await askDropDiveContact({ ...d, [spec.name]: typed || d[spec.name] }, role))) return;
      clearDiveContact(d, role);
      const live = (state.dives || []).find((x) => x.id === d.id);
      if (live && live !== d) clearDiveContact(live, role);
      save(state);
      if (nameInput) nameInput.value = "";
      if (extraInput) extraInput.value = "";
      const okBox = form.querySelector(`[name=${spec.sign}Ok]`);
      if (okBox) okBox.checked = false;
      if (role === "buddy" || role === "guide") applied[role] = "";
      stamped[role] = null;
      const pad = role === "buddy" ? buddyPad : role === "guide" ? guidePad : centerPad;
      pad?.clear();
      showAppliedSign(form.querySelector(`[data-pad="${spec.sign}"]`), "");
      form.querySelectorAll(`[data-pickrole="${role}"] .chip`).forEach((x) => x.classList.remove("on"));
      const dropBtn = form.querySelector(`[data-dropcontact="${role}"]`);
      if (dropBtn) dropBtn.hidden = true;
      const picked = form.querySelector("[data-pickedperson]");
      const stillBuddy = personByTypedName("buddy", form.querySelector("[name=buddyName]")?.value || "");
      const stillGuide = personByTypedName("guide", form.querySelector("[name=guideName]")?.value || "");
      const still = stillBuddy || stillGuide;
      if (picked) {
        if (still) {
          picked.hidden = false;
          picked.textContent = profileShareLine(still, personKnownSign(still));
        } else {
          picked.hidden = true;
          picked.textContent = "";
        }
      }
    };
    form._applyOwnerSign({ initial: true });
    ["buddyName", "guideName"].forEach((name) => {
      form.querySelector(`[name=${name}]`)?.addEventListener("input", () => {
        form._applyOwnerSign();
        scheduleCommunityPull(form);
      });
    });
    if (view.focusSign) {
      form.querySelector(`[data-sign="${view.focusSign}"]`)?.closest(".sign-pad")?.scrollIntoView({ behavior: "smooth", block: "center" });
      view.focusSign = "";
    }
  });
  form.noValidate = true;
  form.onsubmit = async (e) => {
    e.preventDefault();
    try {
    const fd = new FormData(form);
    fd.delete("photoFile");
    fd.delete("buddySignOk");
    fd.delete("guideSignOk");
    fd.delete("centerSignOk");
    const signed = {
      buddy: Boolean(d.buddySign),
      guide: Boolean(d.guideSign),
      center: Boolean(d.centerSign),
    };
    if (signed.buddy && !form.querySelector('[name=buddySignOk]')?.checked) {
      alert("Per la firma del buddy spunta la conferma legale sotto il riquadro.");
      form.querySelector('[data-pad="buddySign"]')?.scrollIntoView({ block: "center" });
      return;
    }
    if (signed.guide && !form.querySelector('[name=guideSignOk]')?.checked) {
      alert("Per la firma della guida spunta la conferma legale sotto il riquadro (L. 70/2026).");
      form.querySelector('[data-pad="guideSign"]')?.scrollIntoView({ block: "center" });
      return;
    }
    if (signed.center && !form.querySelector('[name=centerSignOk]')?.checked) {
      alert("Per la firma del centro spunta la conferma legale sotto il riquadro.");
      form.querySelector('[data-pad="centerSign"]')?.scrollIntoView({ block: "center" });
      return;
    }
    const contactBefore = {
      buddyName: d.buddyName,
      guideName: d.guideName,
      centerName: d.centerName,
    };
    const next = applyPlaceToDive({
      ...d,
      ...Object.fromEntries(fd.entries()),
      types: d.types,
      photo: d.photo,
      feeling: d.feeling,
      tssKind: d.tssKind,
      tssLabel: d.tssKind === "manual" ? "TSS(Manuale)" : d.tssLabel,
      buddySign: d.buddySign,
      guideSign: d.guideSign,
      centerSign: d.centerSign,
      profileFromComputer: d.profileFromComputer,
      computerLog: d.computerLog || null,
      sacManual: d.sacManual,
    });
    next.circuitOpen = fd.has("circuitOpen");
    next.circuitClosed = fd.has("circuitClosed");
    next.noDeco = fd.has("noDeco");
    next.deco = fd.has("hadDeco");
    delete next.hadDeco;
    ensureCircuit(next);
    ["number", "maxDepth", "avgDepth", "plannedDepth", "bottomTime", "totalTime", "safetyStop", "surfaceInterval", "visibility", "waterTemp", "bottomTemp", "airTemp", "cns", "otu", "tss", "ascentRate", "ascentMax", "sac", "ndl", "pressureStart", "pressureEnd"].forEach((k) => {
      if (next[k] != null && next[k] !== "") next[k] = dotNumber(next[k]);
    });
    if (!next.computerLog && !next.profileFromComputer) next.manual = true;
    next.profilePoints = ensureThermoProfile(next);
    applyDiveMetrics(next);
    settleDiveContacts(next, contactBefore);
    linkPeopleOnDive(next);
    state.peopleSeeded = true;
    if (next.guideSign && !String(next.guideName || "").trim()) {
      alert("Per la firma legale della guida indica le generalità (L. 70/2026).");
      return;
    }
    const hash = await diveDigest(next);
    const now = new Date().toISOString();
    next.sigMeta = {
      buddy: next.buddySign
        ? legalMeta("Buddy", next.buddyName, next.buddyCert, now, hash)
        : null,
      guide: next.guideSign
        ? legalMeta("Istruttore / guida responsabile", next.guideName, next.guideCert, now, hash)
        : null,
      center: next.centerSign
        ? legalMeta("Centro di immersione", next.centerLead || next.centerName, "", now, hash)
        : null,
    };
    forgetDeletedDive(next);
    const i = state.dives.findIndex((x) => x.id === next.id);
    if (i >= 0) state.dives[i] = next;
    else state.dives.push(next);
    save(state);
    view = { name: "detail", diveId: next.id, query: view.query };
    render();
    } catch (err) {
      alert(err.message || String(err));
    }
  };
  form.querySelector("[data-cancel]").onclick = () => {
    view = { name: "log", query: view.query };
    render();
  };
  form.querySelector("[data-deldive]")?.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!(await removeDive(d))) return;
    view = { name: "log", query: view.query };
    render();
  });
  frag.append(form);
  return frag;
}

function legalMeta(role, name, cert, at, hash) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return {
    role,
    name: name || "",
    cert: cert || "",
    at,
    tz,
    hash,
    law: "L. 70/2026 art. 12 c. 8",
    kind: "firma elettronica semplice",
    intent: true,
  };
}

function personNameKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function samePersonName(a, b) {
  const x = personNameKey(a);
  const y = personNameKey(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const sort = (s) => s.split(" ").filter(Boolean).sort().join(" ");
  return sort(x) === sort(y);
}

function profileSignImage() {
  const sign = state.profile?.sign;
  return typeof sign === "string" && sign.startsWith("data:image") ? sign : "";
}

function personKnownSign(person) {
  if (typeof person?.sign === "string" && person.sign.startsWith("data:image")) return person.sign;
  if (person && person.role !== "center" && samePersonName(person.name, state.profile?.name)) return profileSignImage();
  return "";
}

function showAppliedSign(padRoot, sign) {
  const img = padRoot?.querySelector("[data-appliedsign]");
  if (!img) return;
  const ghost = padRoot.querySelector(".sign-ghost");
  if (typeof sign === "string" && sign.startsWith("data:image")) {
    img.src = sign;
    img.hidden = false;
    if (ghost) ghost.hidden = true;
  } else {
    img.hidden = true;
    img.removeAttribute("src");
  }
}

function signPreviewHtml(sign) {
  return typeof sign === "string" && sign.startsWith("data:image")
    ? `<img class="sign-preview" alt="Firma salvata" src="${escapeHtml(sign)}" />`
    : "";
}

function mutualFollow(person) {
  if (!person || person.role === "center") return false;
  if (samePersonName(person.name, state.profile?.name)) return true;
  if (!String(person.remoteOwner || "").trim()) return true;
  return Boolean(person.followOut && person.followIn);
}

function diveContactReady(person) {
  if (!person || person.role === "center") return false;
  if (samePersonName(person.name, state.profile?.name)) return true;
  if (!String(person.remoteOwner || "").trim()) return true;
  return Boolean(person.followOut);
}

function followWaitText(person) {
  const name = person?.name || "questa persona";
  if (person?.followOut && !person?.followIn) return `Segui ${name}. Brevetto e firma entrano in immersione quando segue anche te.`;
  if (person?.followIn && !person?.followOut) return `${name} ti segue. Segui anche tu per usare brevetto e firma.`;
  return `Seguitevi entrambi per usare nome, cognome, brevetto e firma di ${name}.`;
}

function signForInsertedPerson(role, typedName) {
  const key = personNameKey(typedName);
  if (!key || role === "center") return "";
  const people = state.people || [];
  const exact = people.find((p) => p.role === role && samePersonName(p.name, typedName));
  const person = exact || people.find((p) => p.role !== "center" && samePersonName(p.name, typedName));
  if (person && !diveContactReady(person)) {
    if (samePersonName(state.profile?.name, typedName)) return profileSignImage();
    return "";
  }
  const fromPerson = personKnownSign(person);
  if (fromPerson) return fromPerson;
  if (samePersonName(state.profile.name, typedName)) return profileSignImage();
  return "";
}

function fillMissingSigns(d) {
  if (!d) return false;
  let changed = false;
  [
    ["buddy", "buddyName", "buddySign"],
    ["guide", "guideName", "guideSign"],
  ].forEach(([role, nameKey, signKey]) => {
    if (d.signSkipped?.[role]) return;
    if (typeof d[signKey] === "string" && d[signKey].startsWith("data:image")) return;
    const sign = signForInsertedPerson(role, d[nameKey]);
    if (!sign) return;
    d[signKey] = sign;
    changed = true;
  });
  return changed;
}

function personByTypedName(role, typedName) {
  const key = personNameKey(typedName);
  if (!key || role === "center") return null;
  const people = state.people || [];
  return (
    people.find((p) => p.role === role && samePersonName(p.name, typedName)) ||
    people.find((p) => p.role !== "center" && samePersonName(p.name, typedName)) ||
    null
  );
}

function ownerOnDiveHtml() {
  const name = String(state.profile?.name || "").trim();
  const cert = String(state.profile?.certNumber || "").trim();
  const sign = profileSignImage();
  if (!name && !sign) {
    return `<p class="hint">Il tuo profilo entra in ogni scheda: scrivi nome e firma in Profilo.</p>`;
  }
  return `<p class="hint">Il tuo profilo in scheda: ${escapeHtml(name || "—")}${cert ? " · brevetto " + escapeHtml(cert) : ""}${sign ? " · firma inserita" : " · manca la firma in Profilo"}</p>${signPreviewHtml(sign)}`;
}

function ownerSignCard() {
  const name = String(state.profile?.name || "").trim();
  if (!name) return "";
  const cert = [state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" ");
  return signEvidence("owner", "Subacqueo", name, cert, profileSignImage(), null, true);
}

function signPad(key, title, note, withConfirm = true) {
  const profile = key === "ownerSign";
  return `
    <div class="sign-pad${profile ? " sign-pad-profile" : ""}" data-pad="${key}">
      <div class="sign-pad-top">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(note)}</span>
        </div>
        ${profile ? `<button class="btn btn-wipe" type="button" data-clearsign="${key}">Cancella</button>` : ""}
      </div>
      <div class="sign-stage">
        <canvas class="sign" data-sign="${key}"></canvas>
        <img class="sign-applied" data-appliedsign="${key}" alt="" hidden />
        <p class="sign-ghost">${profile ? "Firma sulla riga" : "Firma qui con il dito o il pennino"}</p>
        ${profile ? "" : `<button class="btn btn-wipe" type="button" data-clearsign="${key}">Cancella</button>`}
      </div>
      ${
        withConfirm
          ? `<label class="sign-ok"><input type="checkbox" name="${key}Ok" /> Confermo di firmare questa scheda del libretto immersioni, in questa qualità, ai sensi della L. 70/2026 art. 12 c. 8. Restano allegate data, ora e impronta della scheda.</label>`
          : ""
      }
    </div>`;
}

function signEvidence(who, title, name, cert, image, meta, locked = false) {
  const when = meta?.at ? new Date(meta.at).toLocaleString("it-IT") : "";
  const signed = Boolean(image);
  const hasContact = Boolean(String(name || "").trim() || String(cert || "").trim() || signed);
  const actions = locked
    ? `<span class="sign-lock">${signed ? "Firmata" : "Non firmata"}</span>`
    : `<div class="sign-card-actions">
        <button class="btn btn-wipe" type="button" data-clearsign="${escapeHtml(who)}">${signed ? "Cancella" : "Firma"}</button>
        ${hasContact ? `<button class="btn danger" type="button" data-dropcontact="${escapeHtml(who)}">Togli</button>` : ""}
      </div>`;
  return `<article class="sign-card">
      <div class="sign-card-top">
        <div>
          <b>${escapeHtml(title)}</b>
          <span>${escapeHtml(name || "—")}</span>
          <small>${escapeHtml(cert || "")}${when ? " · " + escapeHtml(when) : ""}</small>
        </div>
        ${actions}
      </div>
      ${signed ? `<img alt="firma" src="${image}" />` : `<p class="sign-empty">Non firmata</p>`}
      ${
        meta?.hash
          ? `<p class="sign-legal-line">${escapeHtml(meta.kind || "Firma elettronica")} · ${escapeHtml(meta.law || "")}<br>Impronta ${escapeHtml(meta.hash.slice(0, 20))}… · ${escapeHtml(meta.tz || "")}</p>`
          : ""
      }
    </article>`;
}

async function diveDigest(d) {
  const canonical = JSON.stringify({
    number: d.number,
    date: d.date,
    site: d.site,
    location: d.location,
    lat: d.lat,
    lng: d.lng,
    timeIn: d.timeIn,
    timeOut: d.timeOut,
    maxDepth: d.maxDepth,
    plannedDepth: d.plannedDepth,
    mix: d.mix,
    regulator: d.regulator,
    certOnDive: d.certOnDive,
    centerName: d.centerName,
    centerLead: d.centerLead,
    guideName: d.guideName,
    guideCert: d.guideCert,
    buddyName: d.buddyName,
  });
  const bytes = new TextEncoder().encode(canonical);
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");
  }
  let h = 2166136261;
  for (let i = 0; i < canonical.length; i++) h = Math.imul(h ^ canonical.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1200;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function drawSignFrame(ctx, img, canvas, onBaseline) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!onBaseline || !iw || !ih) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return;
  }
  const dpr = devicePixelRatio || 1;
  const padX = 16 * dpr;
  const padTop = 6 * dpr;
  const padBottom = 18 * dpr;
  const boxW = Math.max(1, canvas.width - padX * 2);
  const boxH = Math.max(1, canvas.height - padTop - padBottom);
  const scale = Math.min(boxW / iw, boxH / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, padX + (boxW - dw) / 2, padTop + boxH - dh, dw, dh);
}

function bindSign(canvas, existing, onChange) {
  if (!canvas) return;
  let current = existing || "";
  const pad = canvas.closest(".sign-pad");
  const profilePad = canvas.dataset.sign === "ownerSign";
  let frameCapture = false;
  const ghost = pad?.querySelector(".sign-ghost");
  const ok = pad?.querySelector('input[type="checkbox"]');
  const showGhost = () => {
    if (ghost) ghost.hidden = Boolean(current);
  };
  if (existing && ok) ok.checked = true;
  const ctx = canvas.getContext("2d");
  const stylePen = () => {
    ctx.strokeStyle = "#0b4d5e";
    ctx.lineWidth = 2.4 * devicePixelRatio;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };
  const paintImage = (dataUrl, onBaseline) => {
    if (!dataUrl) return;
    const im = new Image();
    im.onload = () => {
      if (!canvas.isConnected) return;
      drawSignFrame(ctx, im, canvas, onBaseline);
    };
    im.src = dataUrl;
  };
  const fit = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(r.height * devicePixelRatio));
    stylePen();
    if (current) paintImage(current, profilePad && !frameCapture);
    showGhost();
    reveal(current, false);
  };
  const reveal = (value, notify) => {
    if (!profilePad || !value) {
      showAppliedSign(pad, value);
      if (notify) onChange(value || "");
      return;
    }
    showAppliedSign(pad, "");
    trimSign(value).then((trimmed) => {
      if (!pad.isConnected) return;
      const shown = trimmed || value;
      if (current !== value && current !== shown) return;
      if (notify || shown !== value) onChange(shown);
    });
  };
  const paint = (value, notify) => {
    current = value || "";
    frameCapture = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stylePen();
    if (current) paintImage(current, profilePad);
    if (ok) ok.checked = Boolean(current);
    showGhost();
    reveal(current, notify);
  };
  const clear = () => paint("", true);
  fit();
  requestAnimationFrame(fit);
  let drawing = false;
  const pos = (ev) => {
    const r = canvas.getBoundingClientRect();
    const t = ev.touches?.[0] || ev;
    return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) };
  };
  const start = (ev) => {
    const appliedImg = pad?.querySelector("[data-appliedsign]");
    if (appliedImg) appliedImg.hidden = true;
    drawing = true;
    const p = pos(ev);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ev.preventDefault();
  };
  const move = (ev) => {
    if (!drawing) return;
    const p = pos(ev);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ev.preventDefault();
  };
  const end = () => {
    if (!drawing) return;
    drawing = false;
    current = canvas.toDataURL("image/png");
    if (profilePad) frameCapture = true;
    showGhost();
    reveal(current, true);
  };
  canvas.onmousedown = start;
  canvas.onmousemove = move;
  window.addEventListener("mouseup", end);
  canvas.ontouchstart = start;
  canvas.ontouchmove = move;
  canvas.ontouchend = end;
  canvas.ondblclick = (e) => {
    e.preventDefault();
    clear();
  };
  const clearBtn = pad?.querySelector(`[data-clearsign="${canvas.dataset.sign}"]`);
  if (clearBtn) {
    clearBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      clear();
    };
  }
  showGhost();
  return {
    set(value) {
      paint(value || "", true);
    },
    clear,
  };
}

function drawProfile(canvas, points, editable, onChange, deco) {
  if (!canvas) return;
  const pts = [...(points || [])].sort((a, b) => a.t - b.t);
  const ctx = canvas.getContext("2d");
  const fit = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(r.height * devicePixelRatio));
    paint();
  };
  const paint = () => {
    const w = canvas.width;
    const h = canvas.height;
    const dpr = devicePixelRatio || 1;
    ctx.clearRect(0, 0, w, h);
    fillOcean(ctx, w, h);
    if (!pts.length) return;
    const { maxT, maxD } = profileExtent(pts);
    const padL = 28 * dpr;
    const padR = 10 * dpr;
    const padT = 12 * dpr;
    const padB = 22 * dpr;
    const x = (t) => padL + (t / maxT) * (w - padL - padR);
    const y = (d) => padT + (d / maxD) * (h - padT - padB);
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = dpr;
    const steps = maxD > 25 ? 5 : maxD > 12 ? 4 : 3;
    for (let i = 1; i <= steps; i++) {
      const dd = (maxD / steps) * i;
      const yy = y(dd);
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(w - padR, yy);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = `${10 * dpr}px Outfit, sans-serif`;
      ctx.fillText(`${Math.round(dd)} m`, 4 * dpr, yy + 3 * dpr);
    }
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(x(p.t), y(p.d)) : ctx.moveTo(x(p.t), y(p.d))));
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.2 * dpr;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.lineTo(x(pts[pts.length - 1].t), h - padB);
    ctx.lineTo(x(pts[0].t), h - padB);
    ctx.closePath();
    ctx.fillStyle = "rgba(4, 16, 31, 0.28)";
    ctx.fill();
    let deep = pts[0];
    pts.forEach((p) => {
      if (p.d >= deep.d) deep = p;
    });
    ctx.beginPath();
    ctx.arc(x(deep.t), y(deep.d), 4.2 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = "#7ee0d4";
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${10 * dpr}px Outfit, sans-serif`;
    ctx.fillText("0 min", padL, h - 6 * dpr);
    ctx.fillStyle = deco ? "#ffb070" : "rgba(255,255,255,0.7)";
    ctx.textAlign = "left";
    ctx.fillText(deco ? "Fuori curva: sì" : "Fuori curva: no", padL, padT + 10 * dpr);
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(Math.max(...pts.map((p) => p.t)))} min`, w - padR, h - 6 * dpr);
    ctx.textAlign = "left";
    const temps = pts.map(pointTemp).filter((n) => n != null);
    if (temps.length >= 3) {
      const lo = Math.min(...temps) - 0.4;
      const hi = Math.max(...temps) + 0.4;
      const yT = (c) => h - padB - ((c - lo) / Math.max(0.6, hi - lo)) * (h - padT - padB) * 0.86;
      ctx.beginPath();
      let started = false;
      pts.forEach((p) => {
        const c = pointTemp(p);
        if (c == null) return;
        if (!started) {
          ctx.moveTo(x(p.t), yT(c));
          started = true;
        } else ctx.lineTo(x(p.t), yT(c));
      });
      ctx.strokeStyle = "#ffb45a";
      ctx.lineWidth = 1.8 * dpr;
      ctx.stroke();
    }
  };
  fit();
  if (!editable) return;
  canvas.onclick = (ev) => {
    const r = canvas.getBoundingClientRect();
    const t = Math.round(((ev.clientX - r.left) / r.width) * 60);
    const dpt = Math.round(((ev.clientY - r.top) / r.height) * 40);
    pts.push({ t: Math.max(0, t), d: Math.max(0, dpt) });
    pts.sort((a, b) => a.t - b.t);
    onChange?.(pts.map((p) => ({ ...p })));
    paint();
  };
  canvas.ondblclick = (ev) => {
    ev.preventDefault();
    pts.length = 0;
    onChange?.([]);
    paint();
  };
}

function vaultStatusLine() {
  const n = realDiveCount(state.dives);
  const meta = loadMeta();
  const online = window.SeaDiveDrive?.driveConnected?.();
  if (meta.lastBackup) {
    const when = new Date(meta.lastBackup);
    const ok = Number.isFinite(when.getTime()) ? when.toLocaleString("it-IT") : meta.lastBackup;
    return online
      ? `Diario al sicuro: ${n} immersioni copiate su Google (${ok}).`
      : `Ultima copia su Google ${ok} · ${n} immersioni. All’apertura l’app rinnova da sola l’accesso.`;
  }
  if (window.SeaDiveDrive?.driveWanted?.() || online) {
    return n
      ? `${n} immersioni sul telefono. La copia su Google parte appena c’è connessione.`
      : "Account Google collegato. Le immersioni si copiano su Drive a ogni salvataggio.";
  }
  return "Entra con Google: è la copia che ti restituisce il diario se perdi il telefono.";
}

(async function boot() {
  try {
    await hydrateFromIdb();
    const returned = await window.SeaDiveDrive.consumeOAuthRedirect();
    if (returned) {
      await finishAuth(returned);
      bindVaultLife();
      return;
    }
    if (loadSession()) await silentDrivePush();
    render();
    bindVaultLife();
  } catch (err) {
    const el = document.getElementById("app");
    if (el) el.innerHTML = `<p class="boot">Errore: ${escapeHtml(err && err.message ? err.message : String(err))}</p>`;
    else render();
  }
})();

function bindVaultLife() {
  const tick = () => {
    if (!loadSession()) return;
    if (loadMeta().pendingBackup || dueFifteenDaySync()) silentDrivePush();
  };
  tick();
  setInterval(tick, 60 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tick();
  });
  window.addEventListener("online", tick);
}
