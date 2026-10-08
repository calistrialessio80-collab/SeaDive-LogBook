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
  certs: [],
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
  tank: "12",
  mix: "21",
  pressureStart: "200",
  pressureEnd: "",
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

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    const profile = { ...emptyProfile(), ...data.profile };
    if (!Array.isArray(profile.certs)) profile.certs = [];
    return { profile, dives: data.dives || [] };
  } catch {
    return seed();
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  queueMicrotask(() => maybeBackupDrive());
}

async function maybeBackupDrive() {
  if (!window.SeaDiveDrive?.driveConnected()) return;
  try {
    await window.SeaDiveDrive.uploadDriveBackup(backupPayload());
    const meta = loadMeta();
    meta.lastBackup = new Date().toISOString();
    meta.drive = true;
    saveMeta(meta);
  } catch {
    /* resta il backup locale */
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
  return {
    app: "seadive-logbook",
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: state.profile,
    dives: state.dives,
  };
}

function parseBackup(data) {
  if (!data || typeof data !== "object") throw new Error("invalid");
  const profile = { ...emptyProfile(), ...(data.profile || {}) };
  if (!Array.isArray(profile.certs)) profile.certs = [];
  const dives = Array.isArray(data.dives) ? data.dives : [];
  return { profile, dives };
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
  navigator.serviceWorker.register("./sw.js?v=8", { updateViaCache: "none" }).catch(() => {});
}

let state = load();
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
    <input name="certName" placeholder="Brevetto (es. Nitrox, Rescue)" value="${escapeHtml(c.name || "")}" />
    <input name="certNo" placeholder="N° brevetto" value="${escapeHtml(c.number || "")}" />
    <button class="btn ghost" type="button" data-delcert aria-label="Rimuovi">×</button>
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

function fmtDepth(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || v === "" || v == null) return "—";
  return String(Math.round(n * 10) / 10).replace(".", ",");
}

function diveDuration(d) {
  return Number(d.bottomTime) || Number(d.totalTime) || minutesSpan(d.timeIn, d.timeOut) || 0;
}

function diveSac(d) {
  const v = Number(d.tank);
  const p0 = Number(d.pressureStart);
  const p1 = Number(d.pressureEnd);
  const t = diveDuration(d);
  const max = Number(d.maxDepth) || 0;
  if (!(v > 0 && p0 > 0 && p1 >= 0 && p0 > p1 && t > 0)) return 0;
  const ata = Math.max(1, (max * 0.65) / 10 + 1);
  return (v * (p0 - p1)) / (t * ata);
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
  document.body.classList.toggle("page-home", Boolean(loadSession()) && view.name === "home");
}

async function finishAuth(user) {
  saveSession(user);
  if (!state.profile.name && user.name) state.profile.name = user.name;
  if (user.email) state.profile.recoverEmail = state.profile.recoverEmail || user.email;
  save(state);
  try {
    const cloud = await window.SeaDiveDrive.downloadDriveBackup();
    if (cloud?.dives?.length) {
      state = parseBackup(cloud);
      save(state);
    } else {
      await window.SeaDiveDrive.uploadDriveBackup(backupPayload());
    }
  } catch {
    try {
      await window.SeaDiveDrive.uploadDriveBackup(backupPayload());
    } catch {
      /* backup al prossimo salvataggio */
    }
  }
  view = { name: "home", diveId: null, draft: null, query: "", pending: [], computerHint: "" };
  render();
}

function render() {
  destroyDiveSiteMap();
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  const app = document.getElementById("app");
  app.replaceChildren();
  setPageSkin();
  if (!loadSession()) {
    app.append(renderAuth());
    return;
  }
  if (view.name === "home") app.append(renderHome());
  if (view.name === "log") app.append(renderLog());
  if (view.name === "stats") app.append(renderStats());
  if (view.name === "profile") app.append(renderProfile());
  if (view.name === "computer") app.append(renderComputer());
  if (view.name === "map") app.append(renderWorldMap());
  if (view.name === "detail") app.append(renderDetail());
  if (view.name === "edit") app.append(renderEdit());
  app.append(renderNav());
  if (view.name === "log") {
    const fab = document.createElement("button");
    fab.className = "fab";
    fab.title = "Nuova immersione";
    fab.textContent = "+";
    fab.onclick = () => startNew();
    app.append(fab);
  }
}

function renderAuth() {
  const wrap = document.createElement("section");
  wrap.className = "gate";
  wrap.innerHTML = `
    <div class="gate-card card">
      <img class="gate-shot" alt="SeaDive LogBook" src="./brand.jpg?v=10" />
      <p class="eyebrow">SeaDive LogBook</p>
      <h1>Registrati</h1>
      <p class="meta">Crea l’account con Google. Il diario resta tuo.</p>
      <details class="privacy-fold">
        <summary>Informativa privacy</summary>
        <div class="privacy-body">
          <p><strong>Titolare.</strong> I dati del diario sono tuoi.</p>
          <p><strong>Cosa.</strong> Nome, email del login; anagrafica e brevetto; schede immersione; firme; foto e note.</p>
          <p><strong>Perché.</strong> Libretto digitale e firme L. 70/2026 art. 12 c. 8.</p>
          <p><strong>Dove.</strong> Sul telefono e sul tuo Google Drive nascosto.</p>
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
        <h1>SeaDive</h1>
        <p>di ${escapeHtml(who || "te")}</p>
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

function renderNav() {
  const nav = document.createElement("nav");
  nav.className = "nav";
  const items = [
    ["home", "⌂", "SeaDive"],
    ["log", "☰", "Diario"],
    ["map", "⌖", "Mappa"],
    ["computer", "⌚", "Computer"],
    ["profile", "✦", "Profilo"],
  ];
  items.forEach(([id, icon, label]) => {
    const b = document.createElement("button");
    const on = view.name === id || (id === "log" && (view.name === "detail" || view.name === "edit"));
    b.className = on ? "active" : "";
    b.innerHTML = `<span>${icon}</span><small>${label}</small>`;
    b.onclick = () => {
      view = { name: id, diveId: null, draft: null, query: view.query || "" };
      render();
    };
    nav.append(b);
  });
  return nav;
}

let leafletMap = null;
let diveSiteMap = null;
let diveSiteMarker = null;
let mapPick = null;

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (!document.querySelector("link[data-leaflet]")) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      css.dataset.leaflet = "1";
      document.head.appendChild(css);
    }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Impossibile caricare la mappa."));
    document.body.appendChild(s);
  });
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
  loadLeaflet()
    .then(() => {
      if (!form.isConnected || !window.L) return;
      const known = coordsForDive(d);
      const start = known || { lat: 40.2, lng: 12.5 };
      const zoom = known ? 15 : 5;
      diveSiteMap = L.map(el, { scrollWheelZoom: true, worldCopyJump: true }).setView([start.lat, start.lng], zoom);
      addSatTiles(diveSiteMap);
      const apply = (lat, lng, opts = {}) => {
        writeDiveCoords(form, d, lat, lng);
        const ll = [Number(lat), Number(lng)];
        if (!diveSiteMarker) {
          diveSiteMarker = L.marker(ll, { draggable: true }).addTo(diveSiteMap);
          diveSiteMarker.on("dragend", () => {
            const p = diveSiteMarker.getLatLng();
            apply(p.lat, p.lng, { hint: "Pin spostato. Salva l’immersione per tenerlo." });
          });
        } else {
          diveSiteMarker.setLatLng(ll);
        }
        diveSiteMap.setView(ll, opts.zoom || Math.max(diveSiteMap.getZoom(), 13));
        if (hint) {
          hint.textContent =
            opts.hint || "Punto del sito aggiornato. Trascina il pin o tocca un altro punto.";
        }
        if (!opts.skipGeo) reverseFillLocation(form, d, lat, lng);
      };
      form._placePin = apply;
      diveSiteMap.on("click", (ev) => apply(ev.latlng.lat, ev.latlng.lng));
      if (known) apply(start.lat, start.lng, { skipGeo: true, zoom, hint: "Trascina il pin sul punto esatto, senza scrivere le coordinate." });
      else if (hint) hint.textContent = "Scorri la mappa e tocca il sito per piantare il pin.";
      setTimeout(() => diveSiteMap?.invalidateSize(), 80);
    })
    .catch((err) => {
      el.textContent = err.message || "Mappa non disponibile.";
    });
}

function renderWorldMap() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("siti del mondo"));
  const api = window.SeaDiveSites;
  const pack = api.annotateSites(state.dives || []);
  const doneN = pack.sites.filter((s) => s.done).length;
  const hero = document.createElement("section");
  hero.className = "card hero map-head";
  hero.innerHTML = `
    <h2>Mappa satellitare</h2>
    <p class="tagline">I punti <strong>verde acqua</strong> sono i siti che hai già fatto (dal diario o dalle coordinate). I punti sabbia sono catalogo da scoprire. Tocca la mappa per aggiungere un sito che manca.</p>
    <div class="map-legend">
      <span><i class="dot done"></i> Fatti ${doneN}</span>
      <span><i class="dot todo"></i> Catalogo ${pack.sites.length - doneN}</span>
      <span><i class="dot add"></i> Tuoi aggiunti</span>
    </div>
  `;
  frag.append(hero);
  const mapWrap = document.createElement("section");
  mapWrap.className = "card map-shell";
  mapWrap.innerHTML = `<div class="world-map" data-worldmap></div>`;
  frag.append(mapWrap);
  const form = document.createElement("form");
  form.className = "card section add-site";
  form.innerHTML = `
    <h3 class="serif" style="margin:0 0 8px">Aggiungi un sito</h3>
    <p class="hint">Tocca la mappa oppure scrivi le coordinate. Resta sul tuo telefono, visibile a te.</p>
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
  frag.append(form);
  queueMicrotask(() => {
    loadLeaflet()
      .then(() => {
        const el = mapWrap.querySelector("[data-worldmap]");
        if (!el || !window.L) return;
        if (leafletMap) {
          leafletMap.remove();
          leafletMap = null;
        }
        leafletMap = L.map(el, { worldCopyJump: true, scrollWheelZoom: true }).setView([20, 15], 2);
        addSatTiles(leafletMap);
        pack.sites.forEach((site) => {
          const color = site.done ? "#2ad4c9" : site.custom ? "#ef7a5a" : "#edd9a3";
          const m = L.circleMarker([site.lat, site.lng], {
            radius: site.done ? 9 : 6,
            color: "#021018",
            weight: 1,
            fillColor: color,
            fillOpacity: 0.92,
          }).addTo(leafletMap);
          m.bindPopup(
            `<strong>${escapeHtml(site.name)}</strong><br>${escapeHtml(site.country || "")}<br>${
              site.done ? "Già immerso" : "Da fare"
            }${site.dives ? " · " + site.dives + " nel diario" : ""}`
          );
        });
        leafletMap.on("click", (ev) => {
          mapPick = { lat: ev.latlng.lat.toFixed(5), lng: ev.latlng.lng.toFixed(5), name: "", country: "" };
          form.querySelector("[name=lat]").value = mapPick.lat;
          form.querySelector("[name=lng]").value = mapPick.lng;
          form.querySelector("[data-maphint]").textContent = "Punto preso. Dai un nome e salva.";
        });
        setTimeout(() => leafletMap.invalidateSize(), 80);
      })
      .catch((err) => {
        mapWrap.querySelector("[data-worldmap]").textContent = err.message || "Mappa non disponibile.";
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
  const art = document.createElement("article");
  const map = satMapHtml(d, "sat-place bare");
  const dur = diveDuration(d);
  art.className = "log-card";
  art.innerHTML = `
    <header class="log-head">
      <h3>${escapeHtml(d.site || "Sito da nominare")}</h3>
      <p>#${escapeHtml(d.number)} · ${escapeHtml(fmtItDateLong(d.date))}${d.timeIn ? " · " + escapeHtml(d.timeIn) : ""} · ${escapeHtml(d.location || "—")}</p>
    </header>
    <div class="log-kpis">
      <div><small>Profondità max</small><b>${fmtDepth(d.maxDepth)} m</b></div>
      <div><small>Durata</small><b>${dur ? dur + " min" : "—"}</b></div>
      <div><small>Acqua</small><b>${d.waterTemp ? fmtDepth(d.waterTemp) + " °C" : "—"}</b></div>
    </div>
    <div class="log-viz">
      <div class="log-profile">
        <span>Profilo profondità</span>
        <canvas class="spark"></canvas>
        <strong>${fmtDepth(d.maxDepth)} m</strong>
      </div>
      <div class="log-map">${map || (d.photo ? `<img alt="" src="${d.photo}" />` : `<div class="map-fallback">Mappa</div>`)}</div>
    </div>
  `;
  art.onclick = () => {
    view = { name: "detail", diveId: d.id, draft: null, query: view.query };
    render();
  };
  queueMicrotask(() => {
    const c = art.querySelector("canvas.spark");
    if (c) drawSpark(c, profileFor(d));
  });
  return art;
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
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#24345c");
  g.addColorStop(1, "#12182c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (!pts.length) return;
  const maxT = Math.max(1, ...pts.map((p) => p.t));
  const maxD = Math.max(8, ...pts.map((p) => p.d));
  const x = (t) => (t / maxT) * w;
  const y = (d) => (d / maxD) * h * 0.78 + h * 0.12;
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
}

function renderLog() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("Diario"));
  const listWrap = document.createElement("section");
  listWrap.className = "section";
  const q = (view.query || "").trim().toLowerCase();
  const ordered = [...state.dives]
    .sort((a, b) => Number(b.number) - Number(a.number))
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
        <input type="file" accept=".uddf,.xml,.csv,.txt,.json,.fit,.gpx,.log,.sml,.ssrf,.zxu,.divelog,application/json,application/xml,application/gpx+xml,*/*" multiple hidden data-files />
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
      const added = mergeImported(dives);
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

async function ingestFiles(fileList) {
  const api = window.SeaDiveComputers;
  const files = [...fileList];
  const found = [];
  const notes = [];
  for (const file of files) {
    try {
      const buf = await file.arrayBuffer();
      const { dives, format } = api.parseComputerBytes(file.name, buf);
      notes.push(`${file.name}: ${dives.length} immersioni (${format})`);
      found.push(...dives);
    } catch (err) {
      notes.push(`${file.name}: ${err.message}`);
    }
  }
  if (found.length) {
    const added = mergeImported(found);
    view.computerHint = `${notes.join(" · ")} → ${added} immersioni nel diario.`;
    view.name = added ? "log" : "computer";
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

function mergeImported(dives) {
  const api = window.SeaDiveComputers;
  const existing = new Set(state.dives.map(api.diveKey));
  let n = nextNumber();
  let added = 0;
  dives.forEach((raw) => {
    const d = enrichImported(raw);
    const key = api.diveKey(d);
    if (existing.has(key)) return;
    d.number = n++;
    state.dives.push(d);
    existing.add(key);
    added += 1;
  });
  save(state);
  view.pending = [];
  return added;
}

function renderStats() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("il tuo mare"));
  const t = totals();
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
          <th style="padding:8px 6px">N°</th><th>Data</th><th>Sito</th><th>Diving</th><th>m</th><th>min</th>
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

function renderProfile() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("dati del subacqueo"));
  const form = document.createElement("form");
  form.className = "card";
  const p = state.profile;
  form.innerHTML = `
    <h2 class="serif" style="margin-top:0">Profilo</h2>
    <div class="form-grid">
      ${field("name", "Nome e cognome", p.name, true)}
      ${field("certLevel", "Brevetto principale / didattica", p.certLevel)}
      ${field("certNumber", "N° brevetto principale", p.certNumber)}
      ${field("certDate", "Data conseguimento", p.certDate, false, "date")}
      ${field("medicalExpiry", "Certificato medico scadenza", p.medicalExpiry, false, "date")}
      ${field("insurance", "Assicurazione", p.insurance)}
      ${field("emergencyName", "Contatto di emergenza", p.emergencyName)}
      ${field("emergencyPhone", "Telefono", p.emergencyPhone, false, "tel")}
      ${field("specialties", "Note su specialità", p.specialties, true)}
      ${field("equipment", "Attrezzatura personale", p.equipment, true, "textarea")}
      ${field("recoverPhone", "Se lo trovi, restituisci a — telefono", p.recoverPhone, false, "tel")}
      ${field("recoverEmail", "Email", p.recoverEmail, false, "email")}
    </div>
    <div class="certs-box">
      <h3 class="serif" style="margin:16px 0 6px">Altri brevetti</h3>
      <p class="hint">Aggiungi Rescue, Nitrox, Deep e gli altri con il numero. Il brevetto principale resta sopra. In nuova immersione li trovi già pronti.</p>
      <div data-certs>${(p.certs || []).map((c) => certRowHtml(c)).join("") || certRowHtml()}</div>
      <button class="btn ghost" type="button" data-addcert>+ Aggiungi brevetto</button>
    </div>
    <div class="actions">
      <button class="btn primary" type="submit">Salva profilo</button>
      <button class="btn ghost" type="button" data-out>Esci</button>
      <a class="btn ghost" href="./logbook_immersioni.pdf" target="_blank" rel="noopener">PDF cartaceo originale</a>
    </div>
    <p class="hint">Account: ${escapeHtml(loadSession()?.email || "—")}. Backup automatico sul tuo Google. Gli amici hanno diari separati.</p>
  `;
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
  form.onsubmit = (e) => {
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
    state.profile = { ...state.profile, ...Object.fromEntries(fd.entries()), certs };
    save(state);
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
  return `<label class="${cls}">${escapeHtml(label)}<input name="${name}" type="${type}" value="${escapeHtml(value)}" /></label>`;
}

function renderDetail() {
  const d = state.dives.find((x) => x.id === view.diveId);
  const frag = document.createDocumentFragment();
  if (!d) {
    view = { name: "log" };
    return renderLog();
  }
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
    ${d.photo ? `<img class="cover" alt="" src="${d.photo}" />` : ""}
    ${satMapHtml(d, "sat-place")}
    <div class="kv">
      <div><b>Coordinate</b>${escapeHtml(geoText(d) || "—")}</div>
      <div><b>Prof. max</b>${escapeHtml(d.maxDepth || "—")} m</div>
      <div><b>Prof. programmata</b>${escapeHtml(d.plannedDepth || "—")} m</div>
      <div><b>Tempo di fondo</b>${escapeHtml(d.bottomTime || "—")} min</div>
      <div><b>Tempo totale</b>${escapeHtml(d.totalTime || "—")} min</div>
      <div><b>Sosta sicurezza</b>${escapeHtml(d.safetyStop || "—")} min</div>
      <div><b>Intervallo superficie</b>${escapeHtml(d.surfaceInterval || "—")}</div>
      <div><b>Visibilità</b>${escapeHtml(d.visibility || "—")} m</div>
      <div><b>Temp. acqua / aria</b>${escapeHtml(d.waterTemp || "—")}° / ${escapeHtml(d.airTemp || "—")}°</div>
      <div><b>Corrente</b>${escapeHtml(d.current || "—")}</div>
      <div><b>Mare</b>${escapeHtml(d.seaConditions || "—")}</div>
      <div><b>Muta / zavorra</b>${escapeHtml(d.wetsuit || "—")} mm · ${escapeHtml(d.ballast || "—")} kg</div>
      <div><b>Bombola / miscela</b>${escapeHtml(d.tank || "—")} L · EAN ${escapeHtml(d.mix || "21")}</div>
      <div><b>Pressione</b>${escapeHtml(d.pressureStart || "—")} → ${escapeHtml(d.pressureEnd || "—")} bar</div>
      <div><b>Autorespiratore</b>${escapeHtml(d.regulator || "—")}</div>
      <div><b>Strumentazione</b>${escapeHtml(d.instruments || "—")}</div>
      <div><b>Brevetto in scheda</b>${escapeHtml(d.certOnDive || "—")}</div>
    </div>
    <h3 class="serif">Profilo di immersione</h3>
    <canvas class="profile" data-readonly="1"></canvas>
    <h3 class="serif">Note e sensazioni</h3>
    <p>${escapeHtml(d.notes || "—")}</p>
    <h3 class="serif">Firme — L. 70/2026</h3>
    <p class="hint">${LEGAL_L70}</p>
    <div class="sign-board">
      ${signEvidence("buddy", "Buddy", d.buddyName, d.buddyCert, d.buddySign, d.sigMeta?.buddy)}
      ${signEvidence("guide", "Guida / istruttore", d.guideName, d.guideCert, d.guideSign, d.sigMeta?.guide)}
      ${signEvidence("center", "Diving center", d.centerName, d.centerLead, d.centerSign, d.sigMeta?.center)}
    </div>
    <div class="actions">
      <button class="btn primary" type="button" data-act="edit">Modifica</button>
      <button class="btn ghost" type="button" data-act="back">Torna al diario</button>
      <button class="btn danger" type="button" data-act="del">Elimina</button>
    </div>
  `;
  card.querySelector("[data-act=edit]").onclick = () => {
    view = { name: "edit", diveId: d.id, draft: cloneObj(d), query: view.query };
    render();
  };
  card.querySelector("[data-act=back]").onclick = () => {
    view = { name: "log", query: view.query };
    render();
  };
  card.querySelector("[data-act=del]").onclick = () => {
    if (!confirm("Eliminare questa immersione dal logbook?")) return;
    state.dives = state.dives.filter((x) => x.id !== d.id);
    save(state);
    view = { name: "log", query: view.query };
    render();
  };
  card.querySelectorAll("[data-clearsign]").forEach((btn) => {
    btn.onclick = () => {
      const who = btn.getAttribute("data-clearsign");
      const map = {
        buddy: ["buddySign", "buddy"],
        guide: ["guideSign", "guide"],
        center: ["centerSign", "center"],
      };
      const spec = map[who];
      if (!spec) return;
      const live = state.dives.find((x) => x.id === d.id);
      if (!live) return;
      if (live[spec[0]] && !confirm("Cancellare questa firma e rifarla?")) return;
      live[spec[0]] = "";
      if (live.sigMeta) live.sigMeta[spec[1]] = null;
      save(state);
      view = { name: "edit", diveId: live.id, draft: cloneObj(live), query: view.query, focusSign: spec[0] };
      render();
    };
  });
  frag.append(card);
  queueMicrotask(() => drawProfile(card.querySelector("canvas"), profileFor(d), false));
  return frag;
}

function startNew() {
  const draft = emptyDive();
  draft.number = nextNumber();
  draft.certOnDive = [state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" ");
  view = { name: "edit", diveId: draft.id, draft, query: view.query };
  render();
}

function renderEdit() {
  const d = view.draft;
  const frag = document.createDocumentFragment();
  frag.append(topbar(d.number ? `scheda n° ${d.number}` : "nuova scheda"));
  const form = document.createElement("form");
  form.className = "card";
  form.innerHTML = `
    <div class="form-grid">
      ${field("number", "Immersione n°", d.number, false, "number")}
      ${field("date", "Data", d.date, false, "date")}
      ${field("site", "Sito di immersione", d.site, true)}
      ${field("location", "Località / paese", d.location, true)}
      <input type="hidden" name="lat" value="${escapeHtml(d.lat || "")}" />
      <input type="hidden" name="lng" value="${escapeHtml(d.lng || "")}" />
    </div>
    <p class="hint" style="margin-top:14px">Mappa del sito</p>
    <div class="site-map" data-sitemap></div>
    <div class="actions" style="margin-top:8px">
      <button class="btn ghost" type="button" data-findsite>Cerca il sito sulla mappa</button>
      <button class="btn ghost" type="button" data-geo>Usa posizione attuale</button>
    </div>
    <p class="hint" data-geohint>Tocca o trascina il pin. Non serve scrivere latitudine e longitudine.</p>
    <div class="form-grid">
      ${field("timeIn", "Ora ingresso", d.timeIn, false, "time")}
      ${field("timeOut", "Ora uscita", d.timeOut, false, "time")}
      ${field("maxDepth", "Prof. max (m)", d.maxDepth, false, "number")}
      ${field("plannedDepth", "Prof. programmata (m)", d.plannedDepth, false, "number")}
      ${field("bottomTime", "Tempo di fondo (min)", d.bottomTime, false, "number")}
      ${field("totalTime", "Tempo tot. (min)", d.totalTime, false, "number")}
      ${field("safetyStop", "Sosta sicurezza (min)", d.safetyStop, false, "number")}
      ${field("surfaceInterval", "Intervallo superficie", d.surfaceInterval)}
      ${field("visibility", "Visibilità (m)", d.visibility, false, "number")}
      ${field("waterTemp", "Temp. acqua (°C)", d.waterTemp, false, "number")}
      ${field("airTemp", "Temp. aria (°C)", d.airTemp, false, "number")}
      ${field("current", "Corrente", d.current)}
      ${field("seaConditions", "Mare / condizioni", d.seaConditions)}
      ${field("wetsuit", "Muta (mm)", d.wetsuit)}
      ${field("ballast", "Zavorra (kg)", d.ballast)}
      ${field("tank", "Bombola (L)", d.tank)}
      ${field("mix", "Miscela Nitrox %", d.mix)}
      ${field("pressureStart", "Press. inizio (bar)", d.pressureStart)}
      ${field("pressureEnd", "Press. fine (bar)", d.pressureEnd)}
      ${field("regulator", "Tipo autorespiratore", d.regulator)}
      ${field("instruments", "Strumentazione", d.instruments)}
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
    <h3 class="serif">Profilo di immersione</h3>
    <canvas class="profile" data-profile></canvas>
    <p class="hint" data-profilehint>${d.profileFromComputer ? "Curva letta dal computer subacqueo." : "Il profilo si disegna da solo da profondità, tempi e sosta."}</p>
    <div class="sign-legal" id="firme">
      <h3 class="serif">Firme del libretto — L. 70/2026 art. 12 c. 8</h3>
      <p class="hint">${LEGAL_L70} La firma della guida o istruttore responsabile è richiesta dalla legge (lett. n–o). Ogni firmatario scrive a mano, conferma con la spunta e può cancellare per ripetere.</p>
      <div class="form-grid">
        ${field("buddyName", "Buddy — nome e cognome", d.buddyName)}
        ${field("buddyCert", "Buddy — n° brevetto", d.buddyCert)}
        ${field("guideName", "Guida / istruttore — generalità", d.guideName)}
        ${field("guideCert", "N° brevetto guida / istruttore", d.guideCert)}
        ${field("centerName", "Denominazione diving center", d.centerName, true)}
        ${field("centerLead", "Responsabile del centro", d.centerLead, true)}
      </div>
      ${signPad("buddySign", "Firma buddy", "Compagno di immersione")}
      ${signPad("guideSign", "Firma guida / istruttore", "Obbligatoria per legge sulla scheda")}
      ${signPad("centerSign", "Firma diving center", "Responsabile del centro")}
    </div>
    <div class="actions">
      <button class="btn primary" type="submit">Salva immersione</button>
      <button class="btn ghost" type="button" data-cancel>Annulla</button>
    </div>
  `;
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
      if (form._placePin) form._placePin(found.lat, found.lng, { zoom: 15, hint: "Sito trovato. Trascina il pin sul punto esatto." });
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
    if (!d.profileFromComputer) d.profilePoints = autoProfile(d);
    drawProfile(canvas, profileFor(d), false);
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
  ["maxDepth", "plannedDepth", "bottomTime", "totalTime", "safetyStop", "timeIn", "timeOut"].forEach((name) => {
    form.querySelector(`[name=${name}]`)?.addEventListener("input", () => {
      d[name] = form.querySelector(`[name=${name}]`).value;
      refreshProfile();
    });
  });
  queueMicrotask(() => {
    applyPlaceToDive(d);
    bindDiveSiteMap(form, d);
    refreshProfile();
    bindSign(form.querySelector('[data-sign="buddySign"]'), d.buddySign, (v) => (d.buddySign = v));
    bindSign(form.querySelector('[data-sign="guideSign"]'), d.guideSign, (v) => (d.guideSign = v));
    bindSign(form.querySelector('[data-sign="centerSign"]'), d.centerSign, (v) => (d.centerSign = v));
    if (view.focusSign) {
      form.querySelector(`[data-sign="${view.focusSign}"]`)?.closest(".sign-pad")?.scrollIntoView({ behavior: "smooth", block: "center" });
      view.focusSign = "";
    }
  });
  form.onsubmit = async (e) => {
    e.preventDefault();
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
    const next = applyPlaceToDive({
      ...d,
      ...Object.fromEntries(fd.entries()),
      types: d.types,
      photo: d.photo,
      feeling: d.feeling,
      buddySign: d.buddySign,
      guideSign: d.guideSign,
      centerSign: d.centerSign,
      profileFromComputer: d.profileFromComputer,
    });
    next.profilePoints = profileFor(next);
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
    const i = state.dives.findIndex((x) => x.id === next.id);
    if (i >= 0) state.dives[i] = next;
    else state.dives.push(next);
    save(state);
    view = { name: "detail", diveId: next.id, query: view.query };
    render();
  };
  form.querySelector("[data-cancel]").onclick = () => {
    view = { name: "log", query: view.query };
    render();
  };
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

function signPad(key, title, note) {
  return `
    <div class="sign-pad" data-pad="${key}">
      <div class="sign-pad-top">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(note)}</span>
        </div>
      </div>
      <div class="sign-stage">
        <canvas class="sign" data-sign="${key}"></canvas>
        <p class="sign-ghost">Firma qui con il dito o il pennino</p>
        <button class="btn btn-wipe" type="button" data-clearsign="${key}">Cancella</button>
      </div>
      <label class="sign-ok"><input type="checkbox" name="${key}Ok" /> Confermo di firmare questa scheda del libretto immersioni, in questa qualità, ai sensi della L. 70/2026 art. 12 c. 8. Restano allegate data, ora e impronta della scheda.</label>
    </div>`;
}

function signEvidence(who, title, name, cert, image, meta) {
  const when = meta?.at ? new Date(meta.at).toLocaleString("it-IT") : "";
  const signed = Boolean(image);
  return `<article class="sign-card">
      <div class="sign-card-top">
        <div>
          <b>${escapeHtml(title)}</b>
          <span>${escapeHtml(name || "—")}</span>
          <small>${escapeHtml(cert || "")}${when ? " · " + escapeHtml(when) : ""}</small>
        </div>
        <button class="btn btn-wipe" type="button" data-clearsign="${escapeHtml(who)}">${signed ? "Cancella" : "Firma"}</button>
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

function bindSign(canvas, existing, onChange) {
  if (!canvas) return;
  let current = existing || "";
  const pad = canvas.closest(".sign-pad");
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
  const fit = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(r.height * devicePixelRatio));
    stylePen();
    if (current) {
      const im = new Image();
      im.onload = () => ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
      im.src = current;
    }
    showGhost();
  };
  const clear = () => {
    current = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stylePen();
    if (ok) ok.checked = false;
    showGhost();
    onChange("");
  };
  fit();
  let drawing = false;
  const pos = (ev) => {
    const r = canvas.getBoundingClientRect();
    const t = ev.touches?.[0] || ev;
    return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) };
  };
  const start = (ev) => {
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
    showGhost();
    onChange(current);
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
}

function drawProfile(canvas, points, editable, onChange) {
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
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(42,212,201,0.06)";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(231,251,247,0.12)";
    ctx.lineWidth = devicePixelRatio;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    if (!pts.length) return;
    const maxT = Math.max(60, ...pts.map((p) => p.t));
    const maxD = Math.max(30, ...pts.map((p) => p.d));
    const x = (t) => (t / maxT) * w;
    const y = (d) => (d / maxD) * h;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(x(p.t), y(p.d)) : ctx.moveTo(x(p.t), y(p.d))));
    ctx.strokeStyle = "#2ad4c9";
    ctx.lineWidth = 2 * devicePixelRatio;
    ctx.stroke();
    ctx.lineTo(x(pts[pts.length - 1].t), h);
    ctx.lineTo(x(pts[0].t), h);
    ctx.closePath();
    ctx.fillStyle = "rgba(42,212,201,0.12)";
    ctx.fill();
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(x(p.t), y(p.d), 4 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "#edd9a3";
      ctx.fill();
    });
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

(async function boot() {
  try {
    const returned = await window.SeaDiveDrive.consumeOAuthRedirect();
    if (returned) {
      await finishAuth(returned);
      return;
    }
    render();
  } catch (err) {
    const el = document.getElementById("app");
    if (el) el.innerHTML = `<p class="boot">Errore: ${escapeHtml(err && err.message ? err.message : String(err))}</p>`;
    else render();
  }
})();
