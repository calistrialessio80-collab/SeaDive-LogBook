/* Pagina "Aggiorna SeaDive": toglie service worker e cache vecchie, poi riapre l'app aggiornata.
   Sta in un file (non dentro aggiorna.html) così la CSP può vietare gli script scritti nella pagina. */
(async function () {
  try {
    if ("serviceWorker" in navigator) {
      var regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(function (r) { return r.unregister(); }));
    }
    if (window.caches) {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }
  } catch (e) {}
  var next = new URL("./index.html", location.href);
  next.searchParams.set("v", "231");
  next.searchParams.set("t", String(Date.now()));
  location.replace(next.href);
})();
