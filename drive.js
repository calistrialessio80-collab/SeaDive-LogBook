/** Login Google (pagina ufficiale) + backup Drive. */
const DRIVE_NAME = "seadive-logbook.json";
const CLIENT_KEY = "seadive-google-client-id";
const TOKEN_KEY = "seadive-google-token";

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

function driveToken() {
  try {
    const t = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null");
    if (!t?.access_token) return null;
    if (t.exp && Date.now() > t.exp) return null;
    return t.access_token;
  } catch {
    return null;
  }
}

function saveDriveToken(token, expiresIn) {
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ access_token: token, exp: Date.now() + Math.max(60, (expiresIn || 3600) - 60) * 1000 })
  );
}

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Impossibile caricare l’accesso Google."));
    document.head.append(s);
  });
}

function requestGoogleToken() {
  const clientId = driveClientId();
  if (!clientId) {
    return Promise.reject(new Error("Manca SEADIVE_GOOGLE_CLIENT_ID in config.js."));
  }
  return loadGsi().then(
    () =>
      new Promise((resolve, reject) => {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: oauthCfg().google.scope,
          prompt: "select_account",
          callback: (resp) => {
            if (resp.error) return reject(new Error(resp.error_description || resp.error));
            saveDriveToken(resp.access_token, resp.expires_in);
            resolve(resp.access_token);
          },
          error_callback: (err) => reject(new Error(err?.message || String(err))),
        });
        client.requestAccessToken();
      })
  );
}

async function userFromGoogleToken(token) {
  const res = await fetch(oauthCfg().google.userinfo, { headers: { Authorization: `Bearer ${token}` } });
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
  const existing = driveToken();
  if (existing) return existing;
  return requestGoogleToken();
}

async function authHeader() {
  let token = driveToken();
  if (!token) token = await connectDrive();
  return { Authorization: `Bearer ${token}` };
}

async function findDriveFile(headers) {
  const q = encodeURIComponent("name = 'seadive-logbook.json'");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)&q=${q}`,
    { headers }
  );
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    throw new Error("Sessione Google scaduta. Rientra con Google.");
  }
  if (!res.ok) throw new Error("Drive non ha risposto.");
  const data = await res.json();
  return data.files?.[0] || null;
}

async function uploadDriveBackup(payload) {
  const headers = await authHeader();
  const meta = { name: DRIVE_NAME, parents: ["appDataFolder"] };
  const existing = await findDriveFile(headers);
  const body = new Blob(
    [`--bound\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(existing ? { name: DRIVE_NAME } : meta)}\r\n--bound\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(payload)}\r\n--bound--`],
    { type: "multipart/related; boundary=bound" }
  );
  const url = existing
    ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const res = await fetch(url, { method: existing ? "PATCH" : "POST", headers, body });
  if (!res.ok) throw new Error("Upload su Drive fallito.");
  return await res.json();
}

async function downloadDriveBackup() {
  const headers = await authHeader();
  const file = await findDriveFile(headers);
  if (!file) throw new Error("Nessun backup SeaDive in Drive.");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, { headers });
  if (!res.ok) throw new Error("Download da Drive fallito.");
  return await res.json();
}

function driveConnected() {
  return Boolean(driveToken());
}

async function signInGoogle() {
  const token = await requestGoogleToken();
  return userFromGoogleToken(token);
}

function signOutGoogle() {
  localStorage.removeItem(TOKEN_KEY);
}

window.SeaDiveDrive = {
  driveClientId,
  setDriveClientId,
  connectDrive,
  uploadDriveBackup,
  downloadDriveBackup,
  driveConnected,
  signInGoogle,
  signOutGoogle,
  consumeOAuthRedirect,
};
