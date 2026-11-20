/*
 * SeaDive – servizio notifiche (Cloudflare Workers, piano gratuito).
 *
 * Fa una cosa sola: quando qualcuno scrive in chat, "sveglia" i telefoni degli altri partecipanti
 * con una notifica push, anche ad app chiusa. La notifica NON contiene il messaggio (che resta cifrato
 * nell'app): il telefono mostra solo "Nuovo messaggio su SeaDive".
 *
 * Variabili da impostare in Cloudflare (Settings → Variables):
 *   VAPID_PUBLIC   (testo)   chiave pubblica, la stessa scritta in config.js
 *   VAPID_PRIVATE  (secret)  chiave privata in formato JSON (file .claude/notifiche-chiave-privata.json)
 *   VAPID_SUBJECT  (testo)   indirizzo del sito dell'app, es. https://….github.io/SeaDive-LogBook/
 *   ALLOWED_ORIGIN (testo)   origine del sito, es. https://….github.io
 * Archivio KV collegato con il nome SUBS (Settings → Bindings → KV namespace).
 */

const LINKS_URL = "https://getpantry.cloud/apiv1/pantry/196bbbae-f1bc-4c2f-a2ca-18dd96bbf5c0/basket/links";
const PUSH_HOSTS = [/\.googleapis\.com$/, /\.mozilla\.com$/, /\.push\.apple\.com$/, /\.notify\.windows\.com$/, /^fcm\.googleapis\.com$/];
const MAX_DEVICES = 5;
const MAX_TARGETS = 16;

function cors(env, req) {
  const origin = req.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = !allowed.length || allowed.includes(origin) || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : allowed[0] || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function reply(env, req, status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(env, req) } });
}

const validOwner = (id) => typeof id === "string" && /^[a-f0-9]{16,64}$/i.test(id);

function validSub(sub) {
  try {
    const url = new URL(sub.endpoint);
    return url.protocol === "https:" && PUSH_HOSTS.some((re) => re.test(url.hostname)) && String(sub.endpoint).length < 1000;
  } catch {
    return false;
  }
}

function b64url(bytes) {
  let bin = "";
  new Uint8Array(bytes).forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function vapidHeader(env, endpoint) {
  const jwk = JSON.parse(env.VAPID_PRIVATE);
  const key = await crypto.subtle.importKey("jwk", { ...jwk, kty: "EC", crv: "P-256", ext: true }, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const enc = new TextEncoder();
  const head = b64url(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const body = b64url(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.VAPID_SUBJECT })));
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(`${head}.${body}`));
  return `vapid t=${head}.${body}.${b64url(sig)}, k=${env.VAPID_PUBLIC}`;
}

// Chi scrive può avvisare solo chi lo segue e che lui segue (dati pubblici del registro Community).
async function mutualOf(from) {
  const res = await fetch(`${LINKS_URL}?t=${Date.now()}`, { headers: { Accept: "application/json" } });
  if (!res.ok) return new Set();
  const data = await res.json();
  const rows = Object.values((data && data.links) || data || {});
  const out = new Set();
  rows.forEach((row) => {
    if (!row || !row.leftFollows || !row.rightFollows) return;
    if (row.left === from) out.add(row.right);
    if (row.right === from) out.add(row.left);
  });
  return out;
}

async function subscribe(env, req, data) {
  if (!validOwner(data.owner) || !data.sub || !validSub(data.sub)) return reply(env, req, 400, { error: "bad" });
  const key = `s:${data.owner}`;
  const list = JSON.parse((await env.SUBS.get(key)) || "[]").filter((s) => s.endpoint !== data.sub.endpoint);
  list.unshift({ endpoint: data.sub.endpoint, at: Date.now() });
  await env.SUBS.put(key, JSON.stringify(list.slice(0, MAX_DEVICES)));
  return reply(env, req, 200, { ok: true });
}

async function unsubscribe(env, req, data) {
  if (!validOwner(data.owner)) return reply(env, req, 400, { error: "bad" });
  const key = `s:${data.owner}`;
  const list = JSON.parse((await env.SUBS.get(key)) || "[]").filter((s) => s.endpoint !== data.endpoint);
  if (list.length) await env.SUBS.put(key, JSON.stringify(list));
  else await env.SUBS.delete(key);
  return reply(env, req, 200, { ok: true });
}

async function notify(env, req, data) {
  if (!validOwner(data.from) || !Array.isArray(data.to)) return reply(env, req, 400, { error: "bad" });
  const friends = await mutualOf(data.from);
  const targets = [...new Set(data.to)].filter((id) => validOwner(id) && id !== data.from && friends.has(id)).slice(0, MAX_TARGETS);
  let sent = 0;
  for (const owner of targets) {
    const key = `s:${owner}`;
    const list = JSON.parse((await env.SUBS.get(key)) || "[]");
    const keep = [];
    for (const sub of list) {
      const res = await fetch(sub.endpoint, {
        method: "POST",
        headers: { TTL: "86400", Urgency: "high", Authorization: await vapidHeader(env, sub.endpoint), "Content-Length": "0" },
      }).catch(() => null);
      // 404/410: il telefono ha tolto il permesso o reinstallato l'app → indirizzo da dimenticare.
      if (res && (res.status === 404 || res.status === 410)) continue;
      if (res && res.ok) sent += 1;
      keep.push(sub);
    }
    if (keep.length !== list.length) {
      if (keep.length) await env.SUBS.put(key, JSON.stringify(keep));
      else await env.SUBS.delete(key);
    }
  }
  return reply(env, req, 200, { ok: true, sent });
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(env, req) });
    if (req.method !== "POST") return reply(env, req, 405, { error: "method" });
    const path = new URL(req.url).pathname;
    let data;
    try {
      data = await req.json();
    } catch {
      return reply(env, req, 400, { error: "json" });
    }
    if (path === "/subscribe") return subscribe(env, req, data);
    if (path === "/unsubscribe") return unsubscribe(env, req, data);
    if (path === "/notify") return notify(env, req, data);
    return reply(env, req, 404, { error: "path" });
  },
};
