/* Protezione da incorporamento (clickjacking).
   GitHub Pages non permette l'header X-Frame-Options / frame-ancestors, quindi si controlla qui:
   se SeaDive è aperta dentro un riquadro di un altro sito, l'app non si mostra e compare solo un link
   per aprirla nella sua finestra. Va caricato per primo. */
(function () {
  var framed = false;
  try {
    framed = window.top !== window.self;
  } catch (e) {
    framed = true;
  }
  if (!framed) return;
  window.__seadiveFramed = true;
  document.documentElement.setAttribute("data-framed", "1");
  function block() {
    var body = document.body;
    if (!body) return;
    body.replaceChildren();
    var p = document.createElement("p");
    p.style.cssText = "font:600 16px system-ui,sans-serif;margin:24px;color:#1c2430";
    p.textContent = "Per sicurezza SeaDive non si apre dentro altri siti. ";
    var a = document.createElement("a");
    a.href = location.href;
    a.target = "_top";
    a.rel = "noopener";
    a.textContent = "Apri SeaDive";
    p.append(a);
    body.append(p);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", block);
  else block();
})();
