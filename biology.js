function lifeWeb(q) {
  return `https://it.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}&go=Go`;
}

function lifeWorms(la) {
  return `https://www.marinespecies.org/aphia.php?p=taxlist&searchPar=scientific&tName=${encodeURIComponent(la)}`;
}

const MARINE_LIFE = [
  { it: "Posidonia", la: "Posidonia oceanica", kind: "flora", group: "Pianta", where: "Mediterraneo" },
  { it: "Cymodocea", la: "Cymodocea nodosa", kind: "flora", group: "Pianta", where: "Mediterraneo" },
  { it: "Zostera marina", la: "Zostera marina", kind: "flora", group: "Pianta", where: "Mediterraneo" },
  { it: "Halophila stipulacea", la: "Halophila stipulacea", kind: "flora", group: "Pianta", where: "Invasiva" },
  { it: "Acetabularia", la: "Acetabularia acetabulum", kind: "flora", group: "Alga verde", where: "Mediterraneo" },
  { it: "Ombrello di mare", la: "Padina pavonica", kind: "flora", group: "Alga bruna", where: "Mediterraneo" },
  { it: "Cistoseira", la: "Ericaria amentacea", kind: "flora", group: "Alga bruna", where: "Mediterraneo" },
  { it: "Corallina", la: "Corallina officinalis", kind: "flora", group: "Alga rossa", where: "Mediterraneo" },
  { it: "Tenaglia", la: "Lithophyllum byssoides", kind: "flora", group: "Alga rossa", where: "Mediterraneo" },
  { it: "Lattuga di mare", la: "Ulva lactuca", kind: "flora", group: "Alga verde", where: "Mediterraneo" },
  { it: "Codium a palla", la: "Codium bursa", kind: "flora", group: "Alga verde", where: "Mediterraneo" },
  { it: "Halimeda", la: "Halimeda tuna", kind: "flora", group: "Alga verde", where: "Mediterraneo" },
  { it: "Dittiota", la: "Dictyota dichotoma", kind: "flora", group: "Alga bruna", where: "Mediterraneo" },
  { it: "Caulerpa taxifolia", la: "Caulerpa taxifolia", kind: "flora", group: "Alga verde", where: "Invasiva" },
  { it: "Caulerpa cylindracea", la: "Caulerpa cylindracea", kind: "flora", group: "Alga verde", where: "Invasiva" },
  { it: "Sargasso", la: "Sargassum muticum", kind: "flora", group: "Alga bruna", where: "Invasiva" },
  { it: "Kelp gigante", la: "Macrocystis pyrifera", kind: "flora", group: "Alga bruna", where: "Mondo" },
  { it: "Laminaria", la: "Laminaria digitata", kind: "flora", group: "Alga bruna", where: "Mondo" },
  { it: "Erba tartaruga", la: "Thalassia testudinum", kind: "flora", group: "Pianta", where: "Mondo" },
  { it: "Cernia bruna", la: "Epinephelus marginatus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Cernia dorata", la: "Epinephelus costae", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Ricciola", la: "Seriola dumerili", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Dentice", la: "Dentex dentex", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Orata", la: "Sparus aurata", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Sarago maggiore", la: "Diplodus sargus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Sarago fasciato", la: "Diplodus vulgaris", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Sarago pizzuto", la: "Diplodus puntazzo", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Occhiata", la: "Oblada melanura", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Salpa", la: "Sarpa salpa", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Boga", la: "Boops boops", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Tanuta", la: "Spondyliosoma cantharus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Triglia di scoglio", la: "Mullus surmuletus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Scorfano rosso", la: "Scorpaena scrofa", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Scorfano nero", la: "Scorpaena porcus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Donzella", la: "Coris julis", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Donzella pavonina", la: "Thalassoma pavo", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Castagnola", la: "Chromis chromis", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Re di triglie", la: "Apogon imberbis", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Murena", la: "Muraena helena", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Grongo", la: "Conger conger", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Tordo marvizzo", la: "Symphodus tinca", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Tordo nero", la: "Labrus merula", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce balestra", la: "Balistes capriscus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Luccio di mare", la: "Sphyraena viridensis", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Leccia stella", la: "Trachinotus ovatus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce pettine", la: "Xyrichtys novacula", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Tracina", la: "Trachinus draco", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce prete", la: "Uranoscopus scaber", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pastinaca", la: "Dasyatis pastinaca", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Aquila di mare", la: "Myliobatis aquila", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Torpedine", la: "Torpedo marmorata", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Razza chiodata", la: "Raja clavata", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Gattuccio", la: "Scyliorhinus canicula", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Palombo", la: "Mustelus mustelus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Verdesca", la: "Prionace glauca", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Squalo elefante", la: "Cetorhinus maximus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Diavolo di mare", la: "Mobula mobular", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce luna", la: "Mola mola", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Cavalluccio marino", la: "Hippocampus guttulatus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Cavalluccio muso corto", la: "Hippocampus hippocampus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce ago", la: "Syngnathus typhle", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Tonno rosso", la: "Thunnus thynnus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce spada", la: "Xiphias gladius", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Lampuga", la: "Coryphaena hippurus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Anthias", la: "Anthias anthias", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Ghiozzo boccarossa", la: "Gobius cruentatus", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Bavosa gattorugine", la: "Parablennius gattorugine", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce San Pietro", la: "Zeus faber", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Rana pescatrice", la: "Lophius piscatorius", kind: "fauna", group: "Pesce", where: "Mediterraneo" },
  { it: "Pesce flauto", la: "Fistularia commersonii", kind: "fauna", group: "Pesce", where: "Invasiva" },
  { it: "Pesce scorpione", la: "Pterois miles", kind: "fauna", group: "Pesce", where: "Invasiva" },
  { it: "Sigano", la: "Siganus luridus", kind: "fauna", group: "Pesce", where: "Invasiva" },
  { it: "Pesce palla argenteo", la: "Lagocephalus sceleratus", kind: "fauna", group: "Pesce", where: "Invasiva" },
  { it: "Polpo", la: "Octopus vulgaris", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Seppia", la: "Sepia officinalis", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Calamaro", la: "Loligo vulgaris", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Nacchera", la: "Pinna nobilis", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Cozza", la: "Mytilus galloprovincialis", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Murice", la: "Bolinus brandaris", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Tritone", la: "Charonia lampas", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Vacchetta di mare", la: "Peltodoris atromaculata", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Lepre di mare", la: "Aplysia depilans", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Flabellina", la: "Flabellina affinis", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Cratena", la: "Cratena peregrina", kind: "fauna", group: "Mollusco", where: "Mediterraneo" },
  { it: "Aragosta", la: "Palinurus elephas", kind: "fauna", group: "Crostaceo", where: "Mediterraneo" },
  { it: "Astice", la: "Homarus gammarus", kind: "fauna", group: "Crostaceo", where: "Mediterraneo" },
  { it: "Cicala di mare", la: "Scyllarides latus", kind: "fauna", group: "Crostaceo", where: "Mediterraneo" },
  { it: "Scampo", la: "Nephrops norvegicus", kind: "fauna", group: "Crostaceo", where: "Mediterraneo" },
  { it: "Granceola", la: "Maja squinado", kind: "fauna", group: "Crostaceo", where: "Mediterraneo" },
  { it: "Granchio favollo", la: "Eriphia verrucosa", kind: "fauna", group: "Crostaceo", where: "Mediterraneo" },
  { it: "Pomodoro di mare", la: "Actinia equina", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Anemone verde", la: "Anemonia viridis", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Madrepora a cuscino", la: "Cladocora caespitosa", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Falso corallo", la: "Astroides calycularis", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Corallo rosso", la: "Corallium rubrum", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Gorgonia rossa", la: "Paramuricea clavata", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Gorgonia gialla", la: "Eunicella cavolini", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Gorgonia bianca", la: "Eunicella singularis", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Falso corallo nero", la: "Savalia savaglia", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Medusa luminosa", la: "Pelagia noctiluca", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Cassiopea mediterranea", la: "Cotylorhiza tuberculata", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Polmone di mare", la: "Rhizostoma pulmo", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Aurelia", la: "Aurelia aurita", kind: "fauna", group: "Cnidario", where: "Mediterraneo" },
  { it: "Caravella portoghese", la: "Physalia physalis", kind: "fauna", group: "Cnidario", where: "Mondo" },
  { it: "Spugna da bagno", la: "Spongia officinalis", kind: "fauna", group: "Spugna", where: "Mediterraneo" },
  { it: "Petrosia", la: "Petrosia ficiformis", kind: "fauna", group: "Spugna", where: "Mediterraneo" },
  { it: "Axinella", la: "Axinella polypoides", kind: "fauna", group: "Spugna", where: "Mediterraneo" },
  { it: "Crambe", la: "Crambe crambe", kind: "fauna", group: "Spugna", where: "Mediterraneo" },
  { it: "Riccio femmina", la: "Paracentrotus lividus", kind: "fauna", group: "Echinoderma", where: "Mediterraneo" },
  { it: "Riccio maschio", la: "Arbacia lixula", kind: "fauna", group: "Echinoderma", where: "Mediterraneo" },
  { it: "Riccio violaceo", la: "Sphaerechinus granularis", kind: "fauna", group: "Echinoderma", where: "Mediterraneo" },
  { it: "Cetriolo di mare", la: "Holothuria tubulosa", kind: "fauna", group: "Echinoderma", where: "Mediterraneo" },
  { it: "Stella rossa", la: "Echinaster sepositus", kind: "fauna", group: "Echinoderma", where: "Mediterraneo" },
  { it: "Stella spinosa", la: "Marthasterias glacialis", kind: "fauna", group: "Echinoderma", where: "Mediterraneo" },
  { it: "Spirografo", la: "Sabella spallanzanii", kind: "fauna", group: "Anellide", where: "Mediterraneo" },
  { it: "Verme di fuoco", la: "Hermodice carunculata", kind: "fauna", group: "Anellide", where: "Mediterraneo" },
  { it: "Tartaruga marina", la: "Caretta caretta", kind: "fauna", group: "Rettile", where: "Mediterraneo" },
  { it: "Tartaruga verde", la: "Chelonia mydas", kind: "fauna", group: "Rettile", where: "Mondo" },
  { it: "Dermochelide", la: "Dermochelys coriacea", kind: "fauna", group: "Rettile", where: "Mondo" },
  { it: "Tursiope", la: "Tursiops truncatus", kind: "fauna", group: "Mammifero", where: "Mediterraneo" },
  { it: "Stenella striata", la: "Stenella coeruleoalba", kind: "fauna", group: "Mammifero", where: "Mediterraneo" },
  { it: "Balenottera comune", la: "Balaenoptera physalus", kind: "fauna", group: "Mammifero", where: "Mediterraneo" },
  { it: "Capodoglio", la: "Physeter macrocephalus", kind: "fauna", group: "Mammifero", where: "Mediterraneo" },
  { it: "Foca monaca", la: "Monachus monachus", kind: "fauna", group: "Mammifero", where: "Mediterraneo" },
  { it: "Pesce pagliaccio", la: "Amphiprion ocellaris", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Idolo moresco", la: "Zanclus cornutus", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Pesce Napoleone", la: "Cheilinus undulatus", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Squalo balena", la: "Rhincodon typus", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Manta oceanica", la: "Mobula birostris", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Squalo bianco", la: "Carcharodon carcharias", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Squalo tigre", la: "Galeocerdo cuvier", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Pesce leone", la: "Pterois volitans", kind: "fauna", group: "Pesce", where: "Mondo" },
  { it: "Corallo cervo", la: "Acropora cervicornis", kind: "fauna", group: "Cnidario", where: "Mondo" },
  { it: "Corallo cervello", la: "Diploria labyrinthiformis", kind: "fauna", group: "Cnidario", where: "Mondo" },
  { it: "Tridacna", la: "Tridacna gigas", kind: "fauna", group: "Mollusco", where: "Mondo" },
  { it: "Corona di spine", la: "Acanthaster planci", kind: "fauna", group: "Echinoderma", where: "Mondo" },
  { it: "Nautilo", la: "Nautilus pompilius", kind: "fauna", group: "Mollusco", where: "Mondo" },
];

function lifeNorm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterMarineLife(query, filter) {
  const q = lifeNorm(query).trim();
  return MARINE_LIFE.filter((x) => {
    if (filter === "flora" && x.kind !== "flora") return false;
    if (filter === "fauna" && x.kind !== "fauna") return false;
    if (filter === "med" && x.where !== "Mediterraneo") return false;
    if (filter === "world" && x.where !== "Mondo") return false;
    if (filter === "alien" && x.where !== "Invasiva") return false;
    if (!q) return true;
    return lifeNorm(`${x.it} ${x.la} ${x.group} ${x.where}`).includes(q);
  });
}

function lifeEmoji(x) {
  if (x.kind === "flora") return "🌿";
  const g = x.group;
  if (g === "Pesce") return "🐟";
  if (g === "Mollusco") return "🦑";
  if (g === "Crostaceo") return "🦀";
  if (g === "Cnidario") return "🪸";
  if (g === "Spugna") return "🧽";
  if (g === "Echinoderma") return "⭐";
  if (g === "Anellide") return "🌀";
  if (g === "Rettile") return "🐢";
  if (g === "Mammifero") return "🐋";
  return "🌊";
}

const lifeThumbCache = {};

async function lifeThumb(la, it) {
  const key = String(la || it || "");
  if (Object.prototype.hasOwnProperty.call(lifeThumbCache, key)) return lifeThumbCache[key];
  const titles = [la, it].filter(Boolean);
  for (const wiki of ["it", "en"]) {
    for (const title of titles) {
      try {
        const res = await fetch(
          `https://${wiki}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(title).replace(/ /g, "_"))}`
        );
        if (!res.ok) continue;
        const data = await res.json();
        const src = data.thumbnail?.source;
        if (src && data.type !== "disambiguation") {
          lifeThumbCache[key] = src;
          return src;
        }
      } catch {
        /* prova la fonte successiva */
      }
    }
  }
  try {
    const res = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(la)}&rank=species`);
    const data = await res.json();
    const photo = data.results?.[0]?.default_photo;
    const src = photo?.medium_url || photo?.square_url || photo?.url || "";
    if (src) {
      lifeThumbCache[key] = src;
      return src;
    }
  } catch {
    /* niente foto */
  }
  lifeThumbCache[key] = "";
  return "";
}

window.SeaDiveBiology = {
  MARINE_LIFE,
  filterMarineLife,
  lifeWeb,
  lifeWorms,
  lifeEmoji,
  lifeThumb,
};
