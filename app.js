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
});

const SESSION_KEY = "seadive-google-session";
const BRAND_KEY = "seadive-brand-photo";
const LEGAL_L70 =
  "Libretto immersioni digitale ai sensi della L. 7 maggio 2026 n. 70, art. 12, comma 8. Firma elettronica con data, ora e impronta della scheda. Non sostituisce una firma qualificata SPID/CIE.";

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
    return { profile: { ...emptyProfile(), ...data.profile }, dives: data.dives || [] };
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
  const profile = data.profile || {};
  const dives = Array.isArray(data.dives) ? data.dives : [];
  return { profile: { ...emptyProfile(), ...profile }, dives };
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

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function installHint() {
  const ua = navigator.userAgent || "";
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (ios) return "iPhone: Safari → Condividi → Aggiungi a Home. Così il diario resta sull’icona anche offline.";
  return "Android: menu Chrome → Installa app / Aggiungi a schermata Home. Poi apri sempre l’icona SeaDive.";
}

let deferredInstall = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstall = e;
  if (view?.name === "home") render();
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

let state = load();
let view = { name: "home", diveId: null, draft: null, query: "", pending: [], computerHint: "" };

function nextNumber() {
  return state.dives.reduce((m, d) => Math.max(m, Number(d.number) || 0), 0) + 1;
}

function totals() {
  const n = state.dives.length;
  const max = Math.max(0, ...state.dives.map((d) => Number(d.maxDepth) || 0));
  const mins = state.dives.reduce((s, d) => s + (Number(d.bottomTime) || 0), 0);
  const sites = new Set(state.dives.map((d) => d.site).filter(Boolean)).size;
  return { n, max, mins, sites };
}

function fmtMins(m) {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}min` : `${r} min`;
}

function escapeHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
  if (view.name === "detail") app.append(renderDetail());
  if (view.name === "edit") app.append(renderEdit());
  app.append(renderNav());
  if (view.name === "home" || view.name === "log") {
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

function topbar(subtitle) {
  const wrap = document.createElement("div");
  wrap.className = "topbar";
  wrap.innerHTML = `
    <div class="brand">
      <div class="mark"><span>🌊</span></div>
      <div>
        <p>SeaDive</p>
        <h1>LogBook</h1>
      </div>
    </div>
    <div class="stamp">${escapeHtml(subtitle || "buone immersioni")}</div>
  `;
  return wrap;
}

function renderNav() {
  const nav = document.createElement("nav");
  nav.className = "nav";
  const items = [
    ["home", "⌂", "Home"],
    ["log", "◎", "Diario"],
    ["computer", "⌚", "Computer"],
    ["stats", "⌁", "Mare"],
    ["profile", "◉", "Profilo"],
  ];
  items.forEach(([id, icon, label]) => {
    const b = document.createElement("button");
    b.className = view.name === id ? "active" : "";
    b.innerHTML = `<span>${icon}</span><small>${label}</small>`;
    b.onclick = () => {
      view = { name: id, diveId: null, draft: null, query: view.query || "" };
      render();
    };
    nav.append(b);
  });
  return nav;
}

function renderHome() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("il diario si scrive da solo"));
  const t = totals();
  const last = [...state.dives].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const hello = state.profile.name ? state.profile.name.split(" ")[0] : "sub";
  const hero = document.createElement("section");
  hero.className = "cinematic on-photo";
  hero.innerHTML = `
    <div class="cinematic-copy">
      <p class="eyebrow">SeaDive LogBook</p>
      <h2>Ciao, ${escapeHtml(hello)}</h2>
      <p>Apri l’app e c’è già tutto: profondità, miscela, tempo di fondo e le note dell’immersione.</p>
    </div>
  `;
  frag.append(hero);

  const dash = document.createElement("section");
  dash.className = "dash";
  dash.innerHTML = `
    <button class="dash-card" type="button" data-go="log"><b>${t.n}</b><span>Immersioni</span></button>
    <button class="dash-card" type="button" data-go="stats"><b>${t.max || "—"}</b><span>Prof. max m</span></button>
    <button class="dash-card" type="button" data-go="stats"><b>${fmtMins(t.mins)}</b><span>Tempo fondo</span></button>
    <button class="dash-card" type="button" data-go="stats"><b>${t.sites}</b><span>Siti</span></button>
  `;
  dash.querySelectorAll("[data-go]").forEach((b) => {
    b.onclick = () => {
      view = { ...view, name: b.dataset.go };
      render();
    };
  });
  frag.append(dash);

  const setup = document.createElement("section");
  setup.className = "card section glass-lite";
  const acc = loadSession();
  setup.innerHTML = `
    <h3 class="serif" style="margin:0 0 8px">Account</h3>
    <p class="meta">Accesso Google · ${escapeHtml(acc?.email || acc?.name || "account")}. Backup automatico sul tuo Drive.</p>
    <p class="meta">${isStandalone() ? "" : installHint()}</p>
    <div class="actions">
      ${!isStandalone() && deferredInstall ? `<button class="btn primary" type="button" data-install>Installa SeaDive</button>` : ""}
      <button class="btn primary" type="button" data-ble>Scarica dal computer</button>
    </div>
  `;
  setup.querySelector("[data-ble]").onclick = () => {
    view = { ...view, name: "computer" };
    render();
  };
  const inst = setup.querySelector("[data-install]");
  if (inst) {
    inst.onclick = async () => {
      deferredInstall?.prompt();
      await deferredInstall?.userChoice;
      deferredInstall = null;
      render();
    };
  }
  frag.append(setup);

  const listWrap = document.createElement("section");
  listWrap.className = "section";
  const recent = [...state.dives].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 4);
  listWrap.innerHTML = `<div class="section-head"><h3>Ultime immersioni</h3></div>`;
  if (!recent.length) listWrap.append(emptyState());
  else {
    const ul = document.createElement("div");
    ul.className = "dive-list";
    recent.forEach((d) => ul.append(diveCard(d)));
    listWrap.append(ul);
  }
  frag.append(listWrap);

  if (last) {
    const note = document.createElement("section");
    note.className = "card section";
    note.innerHTML = `<h3 class="serif" style="margin:0 0 8px">Ultima immersione</h3>
      <p style="margin:0;opacity:.8">${escapeHtml(last.notes || "Nessuna nota.")}</p>
      <p class="meta" style="margin-top:8px">${escapeHtml(last.site)} · ${escapeHtml(last.date)}</p>`;
    frag.append(note);
  }
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
  art.className = `dive-shot${d.photo ? " has-photo" : ""}`;
  art.innerHTML = `
    <div class="shot-media">${d.photo ? `<img alt="" src="${d.photo}" />` : `<canvas class="spark"></canvas>`}</div>
    <div class="shot-body">
      <p class="eyebrow">${escapeHtml(d.date || "—")} · n° ${escapeHtml(d.number)}</p>
      <h4>${escapeHtml(d.site || "Sito da nominare")}</h4>
      <p class="meta">${escapeHtml(d.location || "—")}</p>
      <div class="shot-metrics">
        <span><b>${escapeHtml(d.maxDepth || "—")}</b> m</span>
        <span><b>${escapeHtml(d.bottomTime || "—")}</b> min</span>
        <span><b>EAN ${escapeHtml(d.mix || "21")}</b></span>
      </div>
    </div>
  `;
  art.onclick = () => {
    view = { name: "detail", diveId: d.id, draft: null, query: view.query };
    render();
  };
  queueMicrotask(() => {
    const c = art.querySelector("canvas.spark");
    if (c) drawSpark(c, d.profilePoints || []);
  });
  return art;
}

function drawSpark(canvas, points) {
  const pts = [...(points || [])].sort((a, b) => a.t - b.t);
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(r.width * devicePixelRatio));
  canvas.height = Math.max(1, Math.floor(r.height * devicePixelRatio));
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(8, 40, 52, 0.9)";
  ctx.fillRect(0, 0, w, h);
  if (!pts.length) return;
  const maxT = Math.max(1, ...pts.map((p) => p.t));
  const maxD = Math.max(10, ...pts.map((p) => p.d));
  ctx.beginPath();
  pts.forEach((p, i) => {
    const x = (p.t / maxT) * w;
    const y = (p.d / maxD) * h * 0.86 + h * 0.08;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.strokeStyle = "#5ee8dc";
  ctx.lineWidth = 2 * devicePixelRatio;
  ctx.stroke();
}

function renderLog() {
  const frag = document.createDocumentFragment();
  frag.append(topbar("diario immersioni"));
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
    <p class="tagline">Il Bluetooth nel browser <strong>non è ufficiale</strong> e non vale per tutti i computer. Solo Suunto EON Core / Steel / D5, e solo da <strong>Chrome su Android</strong> (HTTPS o localhost). Su iPhone Safari il Bluetooth web non esiste: esporta un file UDDF dall’app del produttore.</p>
    <div class="actions">
      <button class="btn primary" type="button" data-ble>Prova Bluetooth (EON)</button>
      <label class="btn ghost">Apri file UDDF / XML / CSV
        <input type="file" accept=".uddf,.xml,.csv,.txt,application/xml,text/xml,text/csv" multiple hidden data-files />
      </label>
    </div>
    <p class="hint" data-hint>${escapeHtml(view.computerHint || window.SeaDiveBle?.bleUnavailableReason?.() || "Accendi Bluetooth sul computer, tieni il telefono vicino, scegli il dispositivo. Se fallisce, usa il file UDDF.")}</p>
  `;
  const drop = document.createElement("section");
  drop.className = "card section drop";
  drop.innerHTML = `<p style="margin:0"><strong>Trascina qui i file</strong><br><span class="meta">UDDF (universale), XML Suunto DM5 / EON Core, CSV</span></p>`;
  ["dragenter", "dragover"].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("over");
    });
  });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("over");
    ingestFiles(e.dataTransfer.files);
  });
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
      view.pending = dives;
      view.computerHint = `${name}: ${dives.length} immersioni pronte. Conferma per aggiungerle al diario.`;
    } catch (err) {
      view.computerHint = err.message || String(err);
    }
    render();
  };
  frag.append(hero);
  frag.append(drop);

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

  if (view.pending?.length) {
    const preview = document.createElement("section");
    preview.className = "card section";
    preview.innerHTML = `<h3 class="serif" style="margin-top:0">Pronte da importare (${view.pending.length})</h3>`;
    view.pending.forEach((d, i) => {
      const row = document.createElement("label");
      row.className = "import-row";
      row.innerHTML = `<span><input type="checkbox" checked data-i="${i}" /> <strong>${escapeHtml(d.site || "Sito")}</strong>
        <span class="meta"> ${escapeHtml(d.date)} · ${escapeHtml(d.maxDepth || "—")} m · ${escapeHtml(d.bottomTime || "—")} min · ${escapeHtml(d.instruments || "")}</span></span>`;
      preview.append(row);
    });
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `<button class="btn primary" type="button">Aggiungi al diario</button>
      <button class="btn ghost" type="button">Annulla</button>`;
    actions.children[0].onclick = () => {
      const chosen = [...preview.querySelectorAll("input[type=checkbox]:checked")].map((el) => view.pending[Number(el.dataset.i)]);
      mergeImported(chosen);
    };
    actions.children[1].onclick = () => {
      view.pending = [];
      render();
    };
    preview.append(actions);
    frag.append(preview);
  }
  return frag;
}

async function ingestFiles(fileList) {
  const api = window.SeaDiveComputers;
  const files = [...fileList];
  const found = [];
  const notes = [];
  for (const file of files) {
    try {
      const text = await file.text();
      const { dives, format } = api.parseComputerFile(file.name, text);
      notes.push(`${file.name}: ${dives.length} immersioni (${format})`);
      found.push(...dives);
    } catch (err) {
      notes.push(`${file.name}: ${err.message}`);
    }
  }
  view.pending = found;
  view.computerHint = notes.join(" · ") || "Nessun file.";
  view.name = "computer";
  render();
}

function mergeImported(dives) {
  const api = window.SeaDiveComputers;
  const existing = new Set(state.dives.map(api.diveKey));
  let n = nextNumber();
  let added = 0;
  dives.forEach((d) => {
    const key = api.diveKey(d);
    if (existing.has(key)) return;
    d.number = n++;
    if (!d.certOnDive) d.certOnDive = [state.profile.certLevel, state.profile.certNumber].filter(Boolean).join(" ");
    state.dives.push(d);
    existing.add(key);
    added += 1;
  });
  save(state);
  view.pending = [];
  view.computerHint = added ? `${added} immersioni aggiunte al diario.` : "Nessuna nuova immersione (possibili duplicati).";
  view.name = added ? "log" : "computer";
  render();
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
      ${field("certLevel", "Brevetto / didattica", p.certLevel)}
      ${field("certNumber", "N° brevetto", p.certNumber)}
      ${field("certDate", "Data conseguimento", p.certDate, false, "date")}
      ${field("medicalExpiry", "Certificato medico scadenza", p.medicalExpiry, false, "date")}
      ${field("insurance", "Assicurazione", p.insurance)}
      ${field("emergencyName", "Contatto di emergenza", p.emergencyName)}
      ${field("emergencyPhone", "Telefono", p.emergencyPhone, false, "tel")}
      ${field("specialties", "Brevetti e specialità", p.specialties, true)}
      ${field("equipment", "Attrezzatura personale", p.equipment, true, "textarea")}
      ${field("recoverPhone", "Se lo trovi, restituisci a — telefono", p.recoverPhone, false, "tel")}
      ${field("recoverEmail", "Email", p.recoverEmail, false, "email")}
    </div>
    <div class="actions">
      <button class="btn primary" type="submit">Salva profilo</button>
      <button class="btn ghost" type="button" data-out>Esci</button>
      <a class="btn ghost" href="./logbook_immersioni.pdf" target="_blank" rel="noopener">PDF cartaceo originale</a>
    </div>
    <p class="hint">Account: ${escapeHtml(loadSession()?.email || "—")}. Backup automatico sul tuo Google. Gli amici hanno diari separati.</p>
  `;
  form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    state.profile = { ...state.profile, ...Object.fromEntries(fd.entries()) };
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
        <p class="meta">${escapeHtml(d.location)} ${d.feeling ? " · " + stars : ""}</p>
        <div class="pills" style="margin-top:10px">${(d.types || []).map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>
      </div>
      <div class="num">${escapeHtml(d.number)}</div>
    </div>
    ${d.photo ? `<img class="cover" alt="" src="${d.photo}" />` : ""}
    <div class="kv">
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
    <div class="kv">
      ${signEvidence("Buddy", d.buddyName, d.buddyCert, d.buddySign, d.sigMeta?.buddy)}
      ${signEvidence("Guida / istruttore (obbligatoria)", d.guideName, d.guideCert, d.guideSign, d.sigMeta?.guide)}
      ${signEvidence("Diving center", d.centerName, d.centerLead, d.centerSign, d.sigMeta?.center)}
    </div>
    <p class="hint">${LEGAL_L70}</p>
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
  frag.append(card);
  queueMicrotask(() => drawProfile(card.querySelector("canvas"), d.profilePoints || [], false));
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
    <h3 class="serif">Disegna il profilo</h3>
    <canvas class="profile" data-profile></canvas>
    <p class="hint">Tocca il grafico per aggiungere punti (minuti → profondità). Doppio clic per azzerare.</p>
    <div class="sign-legal">
      <h3 class="serif">Firme del libretto — L. 70/2026 art. 12 c. 8</h3>
      <p class="hint">${LEGAL_L70} La firma della guida o istruttore responsabile è richiesta dalla legge (lett. n–o). Aggiungiamo anche buddy e centro.</p>
      <div class="form-grid">
        ${field("buddyName", "Buddy — nome e cognome", d.buddyName)}
        ${field("buddyCert", "Buddy — n° brevetto", d.buddyCert)}
        ${field("guideName", "Guida / istruttore — generalità", d.guideName)}
        ${field("guideCert", "N° brevetto guida / istruttore", d.guideCert)}
        ${field("centerName", "Denominazione diving center", d.centerName, true)}
        ${field("centerLead", "Responsabile del centro", d.centerLead, true)}
      </div>
      <p class="hint" style="margin-top:12px">Firma buddy</p>
      <canvas class="sign" data-sign="buddySign"></canvas>
      <p class="hint" style="margin-top:12px">Firma guida / istruttore responsabile</p>
      <canvas class="sign" data-sign="guideSign"></canvas>
      <p class="hint" style="margin-top:12px">Firma diving center / responsabile</p>
      <canvas class="sign" data-sign="centerSign"></canvas>
    </div>
    <div class="actions">
      <button class="btn primary" type="submit">Salva immersione</button>
      <button class="btn ghost" type="button" data-cancel>Annulla</button>
    </div>
  `;
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
  form.querySelector('input[name="photoFile"]').onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    d.photo = await compressImage(file);
    const preview = form.querySelector("[data-preview]");
    preview.src = d.photo;
    preview.hidden = false;
  };
  const canvas = form.querySelector("[data-profile]");
  queueMicrotask(() => {
    drawProfile(canvas, d.profilePoints, true, (pts) => (d.profilePoints = pts));
    bindSign(form.querySelector('[data-sign="buddySign"]'), d.buddySign, (v) => (d.buddySign = v));
    bindSign(form.querySelector('[data-sign="guideSign"]'), d.guideSign, (v) => (d.guideSign = v));
    bindSign(form.querySelector('[data-sign="centerSign"]'), d.centerSign, (v) => (d.centerSign = v));
  });
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    fd.delete("photoFile");
    const next = {
      ...d,
      ...Object.fromEntries(fd.entries()),
      types: d.types,
      profilePoints: d.profilePoints,
      photo: d.photo,
      feeling: d.feeling,
      buddySign: d.buddySign,
      guideSign: d.guideSign,
      centerSign: d.centerSign,
    };
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
  return { role, name: name || "", cert: cert || "", at, hash, law: "L. 70/2026 art. 12 c. 8" };
}

function signEvidence(title, name, cert, image, meta) {
  const when = meta?.at ? new Date(meta.at).toLocaleString("it-IT") : "";
  return `<div><b>${escapeHtml(title)}</b>${escapeHtml(name || "—")}<br><small>${escapeHtml(cert || "")}${when ? " · " + escapeHtml(when) : ""}</small>
    ${image ? `<img alt="firma" src="${image}" style="width:100%;max-height:70px;object-fit:contain;margin-top:6px" />` : "<small>non firmata</small>"}
    ${meta?.hash ? `<small class="hint">Impronta ${escapeHtml(meta.hash.slice(0, 16))}…</small>` : ""}</div>`;
}

async function diveDigest(d) {
  const canonical = JSON.stringify({
    number: d.number,
    date: d.date,
    site: d.site,
    location: d.location,
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
  const ctx = canvas.getContext("2d");
  const fit = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(r.height * devicePixelRatio));
    ctx.strokeStyle = "#edd9a3";
    ctx.lineWidth = 2 * devicePixelRatio;
    ctx.lineCap = "round";
    if (existing) {
      const im = new Image();
      im.onload = () => ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
      im.src = existing;
    }
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
    onChange(canvas.toDataURL("image/png"));
  };
  canvas.onmousedown = start;
  canvas.onmousemove = move;
  window.addEventListener("mouseup", end);
  canvas.ontouchstart = start;
  canvas.ontouchmove = move;
  canvas.ontouchend = end;
  canvas.ondblclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };
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
