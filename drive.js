/** Login Google (pagina ufficiale) + backup Drive nascosto, valido negli anni. */
const DRIVE_NAME = "seadive-logbook.json";
const CLIENT_KEY = "seadive-google-client-id";
const TOKEN_KEY = "seadive-google-token";
const WANTED_KEY = "seadive-drive-wanted";

function oauthCfg() {
  return window.SEADIVE_OAUTH || {};
}

function driveClientId() {
  const fromConfig = (window.SEADIVE_GOOGLE_CLIENT_ID || "").trim();
  if (fromConfig && !fromConfig.startsWith("client_secret_") && !fromConfig.endsWith(".json")) {
    return fromConfig;
  }
  return (localStorage.getItem(CLIENT_KEY) || "").trim();
}

function setDriveClientId(id) {
  localStorage.setItem(CLIENT_KEY, id.trim());
}

function driveWanted() {
  return localStorage.getItem(WANTED_KEY) === "1";
}

function setDriveWanted(on) {
  if (on) localStorage.setItem(WANTED_KEY, "1");
  else localStorage.removeItem(WANTED_KEY);
}

// Il token Google sta in sessionStorage: sparisce quando l'app viene chiusa invece di restare sul disco.
// Le versioni precedenti lo tenevano in localStorage: lo si toglie da lì.
let memoryToken = null;
try {
  localStorage.removeItem(TOKEN_KEY);
} catch {
  /* storage non disponibile */
}

function readStoredToken() {
  try {
    return JSON.parse(sessionStorage.getItem(TOKEN_KEY) || "null");
  } catch {
    return null;
  }
}

function driveToken() {
  const t = memoryToken || readStoredToken();
  if (!t?.access_token) return null;
  if (t.exp && Date.now() > t.exp) return null;
  return t.access_token;
}

function saveDriveToken(token, expiresIn) {
  memoryToken = { access_token: token, exp: Date.now() + Math.max(60, (expiresIn || 3600) - 60) * 1000 };
  try {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(memoryToken));
  } catch {
    /* resta solo in memoria */
  }
  setDriveWanted(true);
  // La Community (Firebase) usa lo stesso permesso Google per collegarsi senza un'altra finestra.
  try {
    window.dispatchEvent(new CustomEvent("seadive-google-token"));
  } catch {
    /* niente */
  }
}

function forgetDriveToken() {
  memoryToken = null;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* niente da togliere */
  }
}

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    setTimeout(() => reject(new Error("Impossibile caricare l’accesso Google.")), 20000);
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Impossibile caricare l’accesso Google."));
    document.head.append(s);
  });
}

function googleLoginAllowed() {
  const host = String(location.hostname || "");
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
  return location.protocol === "https:";
}

function requestGoogleToken({ silent = false, hint = "" } = {}) {
  if (!googleLoginAllowed()) {
    return Promise.reject(new Error("Sul telefono il diario si apre da solo. Entra con Google dal computer."));
  }
  const clientId = driveClientId();
  if (!clientId) {
    return Promise.reject(new Error("Manca SEADIVE_GOOGLE_CLIENT_ID in config.js."));
  }
  return loadGsi().then(
    () =>
      new Promise((resolve, reject) => {
        // Senza tocco dell'utente Google a volte non risponde mai (Android, app installata): dopo 15 s si lascia perdere.
        const quiet = silent ? setTimeout(() => reject(new Error("Google non risponde.")), 15000) : 0;
        const done = (fn) => (v) => {
          clearTimeout(quiet);
          fn(v);
        };
        resolve = done(resolve);
        reject = done(reject);
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: oauthCfg().google.scope,
          prompt: silent ? "none" : "select_account",
          hint: hint || undefined,
          callback: (resp) => {
            if (resp.error) return reject(new Error(resp.error_description || resp.error));
            saveDriveToken(resp.access_token, resp.expires_in);
            resolve(resp.access_token);
          },
          error_callback: (err) => reject(new Error(err?.message || String(err))),
        });
        client.requestAccessToken(silent ? { prompt: "none" } : {});
      })
  );
}

// Permesso Google per la Community (progetto Firebase): solo nome ed email, chiesto con un tocco.
function requestCommunityToken({ hint = "" } = {}) {
  const clientId = String(window.SEADIVE_FIREBASE_CLIENT_ID || "").trim();
  if (!clientId) return Promise.reject(new Error("community-off"));
  if (!googleLoginAllowed()) return Promise.reject(new Error("community-auth"));
  return loadGsi().then(
    () =>
      new Promise((resolve, reject) => {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
          hint: hint || undefined,
          callback: (resp) => (resp.error ? reject(new Error(resp.error_description || resp.error)) : resolve(resp.access_token)),
          error_callback: (err) => reject(new Error(err?.type || err?.message || String(err))),
        });
        client.requestAccessToken();
      })
  );
}

// Senza un tocco il browser spesso blocca la finestra di Google: dopo un tentativo silenzioso fallito
// non si riprova per 30 minuti (prima si ripeteva a ogni schermata). Un tocco su "Salva su Drive" passa sempre.
const SILENT_RETRY_MS = 30 * 60 * 1000;
let silentFailedAt = 0;

async function ensureToken({ interactive = false, hint = "" } = {}) {
  const existing = driveToken();
  if (existing) return existing;
  if (!interactive && !driveWanted()) return null;
  if (!interactive && Date.now() - silentFailedAt < SILENT_RETRY_MS) return null;
  try {
    const token = await requestGoogleToken({ silent: !interactive, hint });
    silentFailedAt = 0;
    return token;
  } catch (err) {
    if (!interactive) {
      silentFailedAt = Date.now();
      return null;
    }
    throw err;
  }
}

async function userFromGoogleToken(token) {
  const res = await driveFetch(oauthCfg().google.userinfo, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Google ha accettato l’accesso ma il profilo non è arrivato.");
  const user = await res.json();
  return {
    sub: user.sub,
    email: user.email,
    name: user.name,
    picture: user.picture,
    provider: "google",
    at: new Date().toISOString(),
  };
}

async function consumeOAuthRedirect() {
  return null;
}

async function connectDrive() {
  return ensureToken({ interactive: true });
}

async function authHeader({ interactive = false } = {}) {
  const token = await ensureToken({ interactive });
  if (!token) throw new Error("Sessione Google assente.");
  return { Authorization: `Bearer ${token}` };
}

// Le chiamate a Drive non restano appese: dopo 30 s (60 s per il diario) si rinuncia e si riprova più tardi.
function driveFetch(url, init = {}, ms = 30000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { ...init, signal: ctl.signal }).finally(() => clearTimeout(t));
}

async function findDriveFile(headers) {
  const q = encodeURIComponent("name = 'seadive-logbook.json'");
  const res = await driveFetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)&q=${q}`,
    { headers }
  );
  if (res.status === 401) {
    forgetDriveToken();
    throw new Error("Sessione Google scaduta. Rientra con Google.");
  }
  if (!res.ok) throw new Error("Drive non ha risposto.");
  const data = await res.json();
  const files = data.files || [];
  files.sort((a, b) => String(b.modifiedTime || "").localeCompare(String(a.modifiedTime || "")));
  return files[0] || null;
}

async function uploadDriveBackup(payload) {
  const headers = await authHeader({ interactive: false });
  const meta = { name: DRIVE_NAME, parents: ["appDataFolder"] };
  const existing = await findDriveFile(headers);
  const body = new Blob(
    [`--bound\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(existing ? { name: DRIVE_NAME } : meta)}\r\n--bound\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(payload)}\r\n--bound--`],
    { type: "multipart/related; boundary=bound" }
  );
  const url = existing
    ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const res = await driveFetch(url, { method: existing ? "PATCH" : "POST", headers, body }, 60000);
  if (!res.ok) throw new Error("Upload su Drive fallito.");
  return await res.json();
}

async function downloadDriveBackup() {
  const headers = await authHeader({ interactive: false });
  const file = await findDriveFile(headers);
  if (!file) return null;
  const res = await driveFetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, { headers }, 60000);
  if (!res.ok) throw new Error("Download da Drive fallito.");
  return await res.json();
}

function driveConnected() {
  return Boolean(driveToken());
}

async function signInGoogle() {
  const token = await requestGoogleToken({ silent: false });
  setDriveWanted(true);
  return userFromGoogleToken(token);
}

// Uscita: il token viene revocato presso Google (non solo dimenticato) e l'app smette di cercare Drive.
async function signOutGoogle() {
  const token = driveToken();
  forgetDriveToken();
  setDriveWanted(false);
  if (!token) return;
  try {
    await loadGsi();
    await new Promise((resolve) => google.accounts.oauth2.revoke(token, () => resolve()));
  } catch {
    /* senza rete il token scade comunque entro un'ora */
  }
}

window.SeaDiveDrive = {
  googleLoginAllowed,
  driveClientId,
  setDriveClientId,
  connectDrive,
  ensureToken,
  uploadDriveBackup,
  downloadDriveBackup,
  driveConnected,
  currentToken: driveToken,
  communityToken: requestCommunityToken,
  driveWanted,
  setDriveWanted,
  signInGoogle,
  signOutGoogle,
  consumeOAuthRedirect,
};
