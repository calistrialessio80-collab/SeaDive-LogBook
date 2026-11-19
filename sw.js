const CACHE = "seadive-logbook-v226";
const ASSETS = [
  "./",
  "./index.html",
  "./frame-guard.js",
  "./errors.js",
  "./styles.css",
  "./theme-abisso.css",
  "./app.js",
  "./computers.js",
  "./ble-eon.js",
  "./sites.js",
  "./dive-sites.json",
  "./divelogs-sites.json",
  "./biology.js",
  "./drive.js",
  "./config.js",
  "./manifest.json",
  "./aggiorna.html",
  "./aggiorna.js",
  "./version.txt",
  "./splash.jpg",
  "./terra.jpg",
  "./gorgonie.jpg",
  "./nav-diver.png",
  "./register.jpg",
  "./privacy.html",
  "./termini.html",
];

// File grandi che cambiano di rado: si usano subito dalla cache e si aggiornano in background.
const STALE_OK = /\/(dive-sites|divelogs-sites)\.json$|\.(png|jpe?g|svg|webp)$/i;
// Pagina e numero di versione: prima la rete, ma senza aspettare all'infinito con poco segnale.
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  // Niente skipWaiting automatico: la nuova versione aspetta che l'utente tocchi "Aggiorna"
  // (o che l'app venga riaperta), così una scheda a metà compilazione non si perde.
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "seadive-skip-waiting") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const owner = event.notification.data?.owner || "";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        client.postMessage({ type: "seadive-chat", owner });
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});

function putInCache(request, res) {
  if (!res || !res.ok || res.type === "opaque") return;
  // Indirizzi con ?t=… (controlli di versione, ricariche) sono usa e getta: in cache la riempirebbero.
  if (new URL(request.url).searchParams.has("t")) return;
  const copy = res.clone();
  caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
}

// Prima la rete; se dopo 4 s non ha risposto si usa la copia in cache, se c'è.
// Se in cache non c'è niente si continua ad aspettare la rete: meglio lenta che "offline" per sbaglio.
function networkFirst(request, fallback) {
  return new Promise((resolve, reject) => {
    let done = false;
    const finish = (fn, value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn(value);
    };
    const net = fetch(request, { cache: "no-cache" });
    net.then((res) => {
      putInCache(request, res);
      finish(resolve, res);
    }, async () => {
      const cached = await fallback();
      if (cached) finish(resolve, cached);
      else finish(reject, new Error("offline"));
    });
    const timer = setTimeout(async () => {
      const cached = await fallback();
      if (cached) finish(resolve, cached);
    }, NETWORK_TIMEOUT_MS);
  });
}

function offlineResponse() {
  return new Response("Offline", { status: 503, statusText: "Offline", headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

async function fromCache(request, options) {
  return (await caches.match(request, options)) || null;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1) Apertura di una pagina: rete con timeout, poi la copia in cache; offline, la home dell'app.
  if (request.mode === "navigate") {
    const fallback = async () => (await fromCache(request, { ignoreSearch: true })) || (await fromCache("./index.html"));
    event.respondWith(networkFirst(request, fallback).catch(() => offlineResponse()));
    return;
  }

  // 2) File con numero di versione (?v=…): il contenuto non cambia, quindi prima la cache.
  //    Se manca (prima volta dopo un aggiornamento) si va in rete; con rete lenta si ripiega sulla copia installata.
  if (url.searchParams.has("v")) {
    event.respondWith((async () => {
      const cached = await fromCache(request);
      if (cached) return cached;
      return networkFirst(request, () => fromCache(request, { ignoreSearch: true })).catch(() => offlineResponse());
    })());
    return;
  }

  // 3) JSON grandi dei siti e immagini: subito dalla cache, aggiornamento in background.
  if (STALE_OK.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await fromCache(request, { ignoreSearch: true });
      const update = fetch(request, { cache: "no-cache" }).then((res) => {
        putInCache(request, res);
        return res;
      });
      if (cached) {
        event.waitUntil(update.catch(() => {}));
        return cached;
      }
      try {
        return await update;
      } catch {
        return offlineResponse();
      }
    })());
    return;
  }

  // 4) Tutto il resto (version.txt, privacy…): rete con timeout, poi cache. Mai index.html al posto di un file.
  const exact = url.pathname.endsWith("version.txt");
  event.respondWith(networkFirst(request, () => fromCache(request, { ignoreSearch: !exact })).catch(() => offlineResponse()));
});
