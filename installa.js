/* Pagina "Installa SeaDive": mostra solo i passaggi giusti per questo telefono.
   Sta in un file a parte perché la CSP della pagina vieta gli script scritti dentro l'HTML. */
(function () {
  var ua = navigator.userAgent || "";
  var touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPad con iPadOS
  var isIOS = /iPhone|iPad|iPod/.test(ua) || touchMac;
  var isAndroid = /Android/i.test(ua);
  // Browser dentro altre app: da lì non si installa.
  var inApp = /FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|Telegram|Snapchat|TikTok|musical_ly|; wv\)/i.test(ua);
  var iosOtherBrowser = isIOS && /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  var installed = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  var appUrl = new URL("./", location.href).href;
  var pageUrl = location.origin + location.pathname;

  // Già installata e aperta dalla schermata Home: si va dritti all'app.
  if (installed) {
    location.replace(appUrl);
    return;
  }

  var os = isIOS ? "ios" : isAndroid ? "android" : "desktop";
  document.querySelectorAll("[data-os]").forEach(function (el) {
    el.hidden = el.getAttribute("data-os") !== os;
  });

  if (inApp) {
    var warn = document.querySelector("[data-inapp]");
    var text = document.querySelector("[data-inapp-text]");
    warn.hidden = false;
    if (isIOS) text.innerHTML = "Da qui non si può installare. Tocca <b>···</b> o l'icona della bussola e scegli <b>Apri in Safari</b>.";
    if (isAndroid) text.innerHTML = "Da qui non si può installare. Tocca <b>⋮</b> in alto a destra e scegli <b>Apri in Chrome</b> (o <b>Apri nel browser</b>).";
  }
  if (iosOtherBrowser) document.querySelector("[data-ios-other]").hidden = false;

  var link = document.querySelector("[data-link]");
  if (link) link.textContent = pageUrl;

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var done = function () {
        btn.textContent = "Link copiato ✓";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(done, function () {
          window.prompt("Copia il link:", pageUrl);
        });
      } else {
        window.prompt("Copia il link:", pageUrl);
      }
    });
  });

  // Android (Chrome, Edge, Samsung Internet): il browser offre l'installazione diretta.
  var deferred = null;
  var installBtn = document.querySelector("[data-install]");
  var note = document.querySelector("[data-android-note]");
  var doneMsg = document.querySelector("[data-installed]");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
  });
  window.addEventListener("appinstalled", function () {
    deferred = null;
    if (installBtn) installBtn.hidden = true;
    if (note) note.hidden = true;
    if (doneMsg) doneMsg.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!deferred) {
        // Il browser non ha offerto l'installazione: si evidenzia la strada dal menu.
        note.innerHTML = "Tocca <b>⋮</b> in alto a destra in Chrome, poi <b>Installa app</b> o <b>Aggiungi a schermata Home</b>.";
        note.classList.add("done");
        return;
      }
      installBtn.disabled = true;
      deferred.prompt();
      deferred.userChoice.then(function (choice) {
        installBtn.disabled = false;
        if (choice && choice.outcome === "accepted") {
          installBtn.hidden = true;
          note.hidden = true;
          doneMsg.hidden = false;
        }
        deferred = null;
      });
    });
  }

  // Il service worker dell'app serve al browser per proporre l'installazione.
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(function () {});
})();
