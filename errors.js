/* Errori non gestiti.
   Prima dell'avvio dell'app (schermata di caricamento) mostra l'errore al posto dell'app, con "Ricarica".
   Dopo l'avvio NON tocca l'app: mostra un avviso in basso, così una scheda a metà compilazione non si perde.
   Il testo dell'errore viene sempre inserito come testo, mai come HTML. */
(function () {
  var TOAST_MS = 12000;

  function reloadButton(label) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn primary";
    btn.textContent = label || "Ricarica";
    btn.onclick = function () {
      location.reload();
    };
    return btn;
  }

  function showBootError(msg) {
    var app = document.getElementById("app");
    if (!app) return;
    var box = document.createElement("div");
    box.className = "boot";
    var p = document.createElement("p");
    p.textContent = "L'app non è partita: " + msg;
    box.append(p, reloadButton("Ricarica"));
    app.replaceChildren(box);
  }

  function showToast(msg) {
    if (document.querySelector(".err-toast")) return;
    var box = document.createElement("div");
    box.className = "err-toast";
    box.setAttribute("role", "alert");
    var p = document.createElement("p");
    p.textContent = "Qualcosa non ha funzionato. I dati già salvati restano al sicuro.";
    var detail = document.createElement("small");
    detail.textContent = msg;
    var close = document.createElement("button");
    close.type = "button";
    close.className = "btn ghost";
    close.textContent = "Chiudi";
    close.onclick = function () {
      box.remove();
    };
    var actions = document.createElement("div");
    actions.className = "err-toast-actions";
    actions.append(close, reloadButton("Ricarica"));
    box.append(p, detail, actions);
    document.body.append(box);
    setTimeout(function () {
      box.remove();
    }, TOAST_MS);
  }

  window.onerror = function (msg, src) {
    if (!src && String(msg) === "Script error.") return;
    var text = String(msg || "errore sconosciuto").slice(0, 200);
    if (window.__seadiveBooted) showToast(text);
    else showBootError(text);
  };
})();
