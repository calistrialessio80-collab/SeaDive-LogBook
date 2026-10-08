/** Catalogo siti mondiali + siti aggiunti dall’utente. */
const CUSTOM_SITES_KEY = "seadive-custom-sites";

const WORLD_SITES = [
  { id: "isuela", name: "Secca di Isuela", country: "Italia", lat: 44.3056, lng: 9.2139 },
  { id: "portofino", name: "Portofino", country: "Italia", lat: 44.303, lng: 9.21 },
  { id: "tavolara", name: "Secca del Papa", country: "Italia", lat: 40.91, lng: 9.71 },
  { id: "coticcio", name: "Cala Coticcio", country: "Italia", lat: 41.215, lng: 9.361 },
  { id: "ustica", name: "Punta del Diavolo", country: "Italia", lat: 38.703, lng: 13.193 },
  { id: "elba", name: "Relitto Anna Bianca", country: "Italia", lat: 42.76, lng: 10.3 },
  { id: "giglio", name: "Isola del Giglio", country: "Italia", lat: 42.35, lng: 10.9 },
  { id: "palinuro", name: "Capo Palinuro", country: "Italia", lat: 40.028, lng: 15.275 },
  { id: "capri", name: "Punta Campanella", country: "Italia", lat: 40.58, lng: 14.325 },
  { id: "ischia", name: "Secca di Ischia", country: "Italia", lat: 40.73, lng: 13.89 },
  { id: "ponza", name: "Ponza", country: "Italia", lat: 40.9, lng: 12.96 },
  { id: "ventotene", name: "Ventotene", country: "Italia", lat: 40.8, lng: 13.43 },
  { id: "tremiti", name: "Isole Tremiti", country: "Italia", lat: 42.12, lng: 15.5 },
  { id: "pantelleria", name: "Pantelleria", country: "Italia", lat: 36.79, lng: 12.0 },
  { id: "lampedusa", name: "Lampedusa", country: "Italia", lat: 35.51, lng: 12.57 },
  { id: "capocaccia", name: "Capo Caccia / Nereo", country: "Italia", lat: 40.56, lng: 8.16 },
  { id: "maddalena", name: "La Maddalena", country: "Italia", lat: 41.22, lng: 9.4 },
  { id: "cirkewwa", name: "Cirkewwa", country: "Malta", lat: 35.987, lng: 14.328 },
  { id: "bluehole-gozo", name: "Blue Hole Gozo", country: "Malta", lat: 36.054, lng: 14.188 },
  { id: "zenobia", name: "Zenobia", country: "Cipro", lat: 34.896, lng: 33.655 },
  { id: "medes", name: "Isole Medes", country: "Spagna", lat: 42.046, lng: 3.221 },
  { id: "calanques", name: "Calanques", country: "Francia", lat: 43.21, lng: 5.45 },
  { id: "vis", name: "Vis", country: "Croazia", lat: 43.06, lng: 16.18 },
  { id: "kas", name: "Kaş", country: "Turchia", lat: 36.2, lng: 29.64 },
  { id: "santorini", name: "Santorini", country: "Grecia", lat: 36.39, lng: 25.43 },
  { id: "zakynthos", name: "Zakynthos", country: "Grecia", lat: 37.71, lng: 20.87 },
  { id: "dahab", name: "Blue Hole Dahab", country: "Egitto", lat: 28.572, lng: 34.537 },
  { id: "rasmohammed", name: "Ras Mohammed", country: "Egitto", lat: 27.73, lng: 34.26 },
  { id: "sharm", name: "Sharm el-Sheikh", country: "Egitto", lat: 27.86, lng: 34.28 },
  { id: "elphinstone", name: "Elphinstone", country: "Egitto", lat: 25.31, lng: 34.86 },
  { id: "brothers", name: "Brothers Islands", country: "Egitto", lat: 26.31, lng: 34.85 },
  { id: "daedalus", name: "Daedalus", country: "Egitto", lat: 24.93, lng: 35.86 },
  { id: "jackson", name: "Jackson Reef", country: "Egitto", lat: 28.0, lng: 34.47 },
  { id: "aqaba", name: "Aqaba", country: "Giordania", lat: 29.45, lng: 34.97 },
  { id: "eilat", name: "Eilat", country: "Israele", lat: 29.5, lng: 34.92 },
  { id: "maldives-ari", name: "Ari Atoll", country: "Maldive", lat: 3.85, lng: 72.83 },
  { id: "maldives-baa", name: "Baa Atoll / Hanifaru", country: "Maldive", lat: 5.18, lng: 73.13 },
  { id: "similan", name: "Similan", country: "Thailandia", lat: 8.65, lng: 97.65 },
  { id: "richelieu", name: "Richelieu Rock", country: "Thailandia", lat: 9.36, lng: 98.02 },
  { id: "hindaeng", name: "Hin Daeng", country: "Thailandia", lat: 7.16, lng: 99.0 },
  { id: "sipadan", name: "Sipadan", country: "Malaysia", lat: 4.115, lng: 118.629 },
  { id: "mabul", name: "Mabul", country: "Malaysia", lat: 4.245, lng: 118.631 },
  { id: "perhentian", name: "Perhentian", country: "Malaysia", lat: 5.91, lng: 102.74 },
  { id: "komodo", name: "Komodo", country: "Indonesia", lat: -8.55, lng: 119.49 },
  { id: "raja", name: "Raja Ampat", country: "Indonesia", lat: -0.58, lng: 130.52 },
  { id: "lembeh", name: "Lembeh", country: "Indonesia", lat: 1.45, lng: 125.23 },
  { id: "bunaken", name: "Bunaken", country: "Indonesia", lat: 1.62, lng: 124.76 },
  { id: "wakatobi", name: "Wakatobi", country: "Indonesia", lat: -5.75, lng: 123.87 },
  { id: "banda", name: "Banda", country: "Indonesia", lat: -4.53, lng: 129.9 },
  { id: "palau", name: "Blue Corner Palau", country: "Palau", lat: 7.27, lng: 134.24 },
  { id: "jellyfish", name: "Jellyfish Lake", country: "Palau", lat: 7.16, lng: 134.37 },
  { id: "truk", name: "Truk Lagoon", country: "Micronesia", lat: 7.42, lng: 151.78 },
  { id: "tubbataha", name: "Tubbataha", country: "Filippine", lat: 8.85, lng: 119.92 },
  { id: "apo", name: "Apo Island", country: "Filippine", lat: 9.08, lng: 123.27 },
  { id: "coron", name: "Coron", country: "Filippine", lat: 12.0, lng: 120.2 },
  { id: "malapascua", name: "Malapascua", country: "Filippine", lat: 11.33, lng: 124.12 },
  { id: "anilao", name: "Anilao", country: "Filippine", lat: 13.76, lng: 120.92 },
  { id: "gbr", name: "Great Barrier Reef", country: "Australia", lat: -16.28, lng: 145.89 },
  { id: "yongala", name: "SS Yongala", country: "Australia", lat: -19.3, lng: 147.62 },
  { id: "ningaloo", name: "Ningaloo", country: "Australia", lat: -22.7, lng: 113.65 },
  { id: "poor-knights", name: "Poor Knights", country: "Nuova Zelanda", lat: -35.47, lng: 174.74 },
  { id: "fiji", name: "Rainbow Reef", country: "Figi", lat: -16.78, lng: 179.9 },
  { id: "galapagos", name: "Galápagos Darwin", country: "Ecuador", lat: 1.67, lng: -92.0 },
  { id: "cocos", name: "Isla del Coco", country: "Costa Rica", lat: 5.53, lng: -87.07 },
  { id: "malpelo", name: "Malpelo", country: "Colombia", lat: 3.98, lng: -81.61 },
  { id: "socorro", name: "Socorro", country: "Messico", lat: 18.8, lng: -110.98 },
  { id: "cozumel", name: "Cozumel", country: "Messico", lat: 20.42, lng: -86.92 },
  { id: "cenotes", name: "Cenotes Yucatán", country: "Messico", lat: 20.6, lng: -87.1 },
  { id: "belize-hole", name: "Great Blue Hole", country: "Belize", lat: 17.315, lng: -87.535 },
  { id: "roatan", name: "Roatán", country: "Honduras", lat: 16.3, lng: -86.55 },
  { id: "utila", name: "Utila", country: "Honduras", lat: 16.1, lng: -86.93 },
  { id: "bonaire", name: "Bonaire", country: "Caraibi", lat: 12.16, lng: -68.28 },
  { id: "cayman", name: "Bloody Bay Wall", country: "Isole Cayman", lat: 19.68, lng: -80.07 },
  { id: "keys", name: "Florida Keys", country: "USA", lat: 24.66, lng: -81.28 },
  { id: "monterey", name: "Monterey", country: "USA", lat: 36.62, lng: -121.9 },
  { id: "silfra", name: "Silfra", country: "Islanda", lat: 64.255, lng: -21.116 },
  { id: "scapa", name: "Scapa Flow", country: "Regno Unito", lat: 58.9, lng: -3.0 },
  { id: "azores", name: "Azzorre", country: "Portogallo", lat: 38.5, lng: -28.0 },
  { id: "hierro", name: "El Hierro", country: "Spagna", lat: 27.74, lng: -18.03 },
  { id: "sodwana", name: "Sodwana Bay", country: "Sudafrica", lat: -27.54, lng: 32.68 },
  { id: "aliwal", name: "Aliwal Shoal", country: "Sudafrica", lat: -30.26, lng: 30.82 },
  { id: "tofo", name: "Tofo", country: "Mozambico", lat: -23.85, lng: 35.55 },
  { id: "seychelles", name: "Seychelles", country: "Seychelles", lat: -4.33, lng: 55.75 },
  { id: "fakarava", name: "Fakarava", country: "Polinesia", lat: -16.3, lng: -145.6 },
  { id: "rangiroa", name: "Rangiroa", country: "Polinesia", lat: -14.95, lng: -147.65 },
  { id: "moorea", name: "Moorea", country: "Polinesia", lat: -17.54, lng: -149.83 },
];

function loadCustomSites() {
  try {
    const raw = JSON.parse(localStorage.getItem(CUSTOM_SITES_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveCustomSites(list) {
  localStorage.setItem(CUSTOM_SITES_KEY, JSON.stringify(list));
}

function allCatalogSites() {
  return [...WORLD_SITES, ...loadCustomSites()];
}

function haversineKm(a, b) {
  const r = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
}

function normName(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function divePoint(d) {
  const lat = Number(String(d.lat ?? "").replace(",", "."));
  const lng = Number(String(d.lng ?? "").replace(",", "."));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

function siteMatchesDive(site, d) {
  const p = divePoint(d);
  if (p && haversineKm(p, site) <= 4) return true;
  const a = normName(site.name);
  const b = normName(d.site);
  const loc = normName(d.location);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a) || (loc && (a.includes(loc) || loc.includes(a)));
}

function annotateSites(dives) {
  const catalog = allCatalogSites();
  const used = new Set();
  const annotated = catalog.map((site) => {
    const hits = dives.filter((d) => siteMatchesDive(site, d));
    if (hits.length) hits.forEach((d) => used.add(d.id));
    return { ...site, done: hits.length > 0, dives: hits.length };
  });
  const extras = [];
  dives.forEach((d) => {
    if (used.has(d.id)) return;
    const p = divePoint(d);
    if (!p) return;
    extras.push({
      id: `dive-${d.id}`,
      name: d.site || "Immersione del diario",
      country: d.location || "",
      lat: p.lat,
      lng: p.lng,
      done: true,
      dives: 1,
      fromDive: true,
    });
  });
  return { sites: [...annotated, ...extras], done: annotated.filter((s) => s.done).length + extras.length };
}

function addCustomSite(partial) {
  const list = loadCustomSites();
  const site = {
    id: "custom-" + Date.now(),
    name: String(partial.name || "Sito").trim(),
    country: String(partial.country || "").trim(),
    lat: Number(partial.lat),
    lng: Number(partial.lng),
    custom: true,
  };
  if (!site.name || !Number.isFinite(site.lat) || !Number.isFinite(site.lng)) {
    throw new Error("Servono nome, latitudine e longitudine.");
  }
  list.push(site);
  saveCustomSites(list);
  return site;
}

window.SeaDiveSites = {
  WORLD_SITES,
  allCatalogSites,
  annotateSites,
  addCustomSite,
  loadCustomSites,
};
