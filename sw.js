const CACHE = "seadive-logbook-v221";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
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
  "./version.txt",
  "./splash.jpg",
  "./nav-diver.png",
  "./register.jpg",
  "./privacy.html",
  "./termini.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
    const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(open.map(async (client) => {
      try {
        if (String(client.url || "").includes("v=221")) return;
        const next = new URL("./?v=221", self.location.href);
        if (client.navigate) await client.navigate(next.href);
      } catch (_) {}
    }));
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

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
