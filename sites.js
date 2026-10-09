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
  { id: "capri-faraglioni", name: "Faraglioni di Capri", country: "Italia", lat: 40.542, lng: 14.253 },
  { id: "procida", name: "Procida", country: "Italia", lat: 40.76, lng: 14.02 },
  { id: "ciano", name: "Secca delle Formiche", country: "Italia", lat: 42.39, lng: 11.2 },
  { id: "giannutri", name: "Giannutri", country: "Italia", lat: 42.25, lng: 11.09 },
  { id: "montecristo", name: "Montecristo", country: "Italia", lat: 42.33, lng: 10.31 },
  { id: "gorgona", name: "Gorgona", country: "Italia", lat: 43.43, lng: 9.9 },
  { id: "capraia", name: "Capraia", country: "Italia", lat: 43.05, lng: 9.84 },
  { id: "pianosa", name: "Pianosa", country: "Italia", lat: 42.58, lng: 10.1 },
  { id: "argentarola", name: "Argentarola", country: "Italia", lat: 42.44, lng: 11.12 },
  { id: "portofino-christ", name: "Cristo degli Abissi", country: "Italia", lat: 44.317, lng: 9.175 },
  { id: "gallinara", name: "Gallinara", country: "Italia", lat: 44.025, lng: 8.226 },
  { id: "bergeggi", name: "Bergeggi", country: "Italia", lat: 44.24, lng: 8.44 },
  { id: "cinque-terre", name: "Cinque Terre", country: "Italia", lat: 44.13, lng: 9.7 },
  { id: "portovenere", name: "Portovenere", country: "Italia", lat: 44.05, lng: 9.83 },
  { id: "sistiana", name: "Sistiana / Duino", country: "Italia", lat: 45.77, lng: 13.63 },
  { id: "numana", name: "Numana", country: "Italia", lat: 43.51, lng: 13.62 },
  { id: "conero", name: "Monte Conero", country: "Italia", lat: 43.55, lng: 13.61 },
  { id: "vieste", name: "Vieste", country: "Italia", lat: 41.88, lng: 16.18 },
  { id: "castellammare", name: "Castellammare del Golfo", country: "Italia", lat: 38.03, lng: 12.88 },
  { id: "sanvito", name: "San Vito Lo Capo", country: "Italia", lat: 38.18, lng: 12.73 },
  { id: "egadi", name: "Isole Egadi", country: "Italia", lat: 37.97, lng: 12.2 },
  { id: "favignana", name: "Favignana", country: "Italia", lat: 37.93, lng: 12.32 },
  { id: "stromboli", name: "Stromboli", country: "Italia", lat: 38.79, lng: 15.21 },
  { id: "panarea", name: "Panarea", country: "Italia", lat: 38.64, lng: 15.07 },
  { id: "salina", name: "Salina", country: "Italia", lat: 38.56, lng: 14.87 },
  { id: "filicudi", name: "Filicudi", country: "Italia", lat: 38.56, lng: 14.57 },
  { id: "alicudi", name: "Alicudi", country: "Italia", lat: 38.54, lng: 14.35 },
  { id: "vulcano", name: "Vulcano", country: "Italia", lat: 38.4, lng: 14.96 },
  { id: "lipari", name: "Lipari", country: "Italia", lat: 38.48, lng: 14.95 },
  { id: "taormina", name: "Isola Bella Taormina", country: "Italia", lat: 37.85, lng: 15.3 },
  { id: "cyclops", name: "Isole dei Ciclopi", country: "Italia", lat: 37.56, lng: 15.17 },
  { id: "syracusewreck", name: "Siracusa / Ortigia", country: "Italia", lat: 37.06, lng: 15.3 },
  { id: "linosa", name: "Linosa", country: "Italia", lat: 35.86, lng: 12.87 },
  { id: "cabrera-it", name: "Capo Rizzuto", country: "Italia", lat: 38.9, lng: 17.1 },
  { id: "gallipoli", name: "Gallipoli", country: "Italia", lat: 40.06, lng: 17.98 },
  { id: "otranto", name: "Otranto", country: "Italia", lat: 40.15, lng: 18.49 },
  { id: "castro", name: "Castro Marina", country: "Italia", lat: 40.0, lng: 18.43 },
  { id: "santa-maria-di-leuc", name: "Santa Maria di Leuca", country: "Italia", lat: 39.8, lng: 18.36 },
  { id: "peschici", name: "Peschici", country: "Italia", lat: 41.95, lng: 16.02 },
  { id: "alghero", name: "Alghero", country: "Italia", lat: 40.56, lng: 8.32 },
  { id: "stintino", name: "Stintino / Asinara", country: "Italia", lat: 40.94, lng: 8.22 },
  { id: "orosei", name: "Golfo di Orosei", country: "Italia", lat: 40.25, lng: 9.7 },
  { id: "calagonone", name: "Cala Gonone", country: "Italia", lat: 40.28, lng: 9.63 },
  { id: "villasimius", name: "Villasimius", country: "Italia", lat: 39.13, lng: 9.52 },
  { id: "carloforte", name: "Carloforte", country: "Italia", lat: 39.15, lng: 8.31 },
  { id: "budelli", name: "Budelli", country: "Italia", lat: 41.28, lng: 9.35 },
  { id: "spargi", name: "Spargi", country: "Italia", lat: 41.24, lng: 9.34 },
  { id: "caprera", name: "Caprera", country: "Italia", lat: 41.21, lng: 9.46 },
  { id: "costa-smeralda", name: "Costa Smeralda", country: "Italia", lat: 41.12, lng: 9.54 },
  { id: "teulada", name: "Teulada", country: "Italia", lat: 38.97, lng: 8.72 },
  { id: "chia", name: "Capo Spartivento", country: "Italia", lat: 38.88, lng: 8.86 },
  { id: "blue-grotto-malta", name: "Blue Grotto Malta", country: "Malta", lat: 35.82, lng: 14.46 },
  { id: "reqqa", name: "Reqqa Point", country: "Malta", lat: 36.08, lng: 14.26 },
  { id: "dwejra", name: "Dwejra", country: "Malta", lat: 36.05, lng: 14.19 },
  { id: "um-el-faroud", name: "Um El Faroud", country: "Malta", lat: 35.82, lng: 14.45 },
  { id: "p29", name: "P29 wreck", country: "Malta", lat: 35.99, lng: 14.33 },
  { id: "comino", name: "Comino", country: "Malta", lat: 36.01, lng: 14.34 },
  { id: "llaut", name: "Imperial Eagle", country: "Malta", lat: 35.95, lng: 14.4 },
  { id: "cabo-de-gata", name: "Cabo de Gata", country: "Spagna", lat: 36.73, lng: -2.19 },
  { id: "tabarca", name: "Tabarca", country: "Spagna", lat: 38.16, lng: -0.47 },
  { id: "formentera", name: "Formentera", country: "Spagna", lat: 38.7, lng: 1.43 },
  { id: "ibiza", name: "Ibiza", country: "Spagna", lat: 38.91, lng: 1.43 },
  { id: "mallorca", name: "Mallorca", country: "Spagna", lat: 39.57, lng: 2.65 },
  { id: "menorca", name: "Menorca", country: "Spagna", lat: 39.95, lng: 4.05 },
  { id: "tenerife", name: "Tenerife", country: "Spagna", lat: 28.29, lng: -16.62 },
  { id: "lanzarote", name: "Lanzarote / Museo Atlántico", country: "Spagna", lat: 28.92, lng: -13.67 },
  { id: "fuerteventura", name: "Fuerteventura", country: "Spagna", lat: 28.36, lng: -14.05 },
  { id: "gran-canaria", name: "Gran Canaria", country: "Spagna", lat: 27.76, lng: -15.6 },
  { id: "la-palma", name: "La Palma", country: "Spagna", lat: 28.68, lng: -17.76 },
  { id: "cadaques", name: "Cadaqués", country: "Spagna", lat: 42.29, lng: 3.28 },
  { id: "costa-brava", name: "Costa Brava", country: "Spagna", lat: 41.85, lng: 3.13 },
  { id: "port-cros", name: "Port-Cros", country: "Francia", lat: 43.0, lng: 6.4 },
  { id: "porquerolles", name: "Porquerolles", country: "Francia", lat: 43.0, lng: 6.2 },
  { id: "cap-ferret", name: "Bassin d’Arcachon", country: "Francia", lat: 44.66, lng: -1.17 },
  { id: "corsica-bonifacio", name: "Bonifacio", country: "Francia", lat: 41.39, lng: 9.16 },
  { id: "corsica-calvi", name: "Calvi", country: "Francia", lat: 42.57, lng: 8.76 },
  { id: "corsica-scandola", name: "Scandola", country: "Francia", lat: 42.37, lng: 8.55 },
  { id: "nice", name: "Nizza / Villefranche", country: "Francia", lat: 43.7, lng: 7.31 },
  { id: "cavtat", name: "Cavtat", country: "Croazia", lat: 42.58, lng: 18.22 },
  { id: "dubrovnik", name: "Dubrovnik", country: "Croazia", lat: 42.64, lng: 18.11 },
  { id: "hvar", name: "Hvar", country: "Croazia", lat: 43.17, lng: 16.44 },
  { id: "brac", name: "Brač / Zlatni Rat", country: "Croazia", lat: 43.26, lng: 16.64 },
  { id: "korcula", name: "Korčula", country: "Croazia", lat: 42.96, lng: 17.14 },
  { id: "lastovo", name: "Lastovo", country: "Croazia", lat: 42.77, lng: 16.9 },
  { id: "mljet", name: "Mljet", country: "Croazia", lat: 42.75, lng: 17.38 },
  { id: "kornati", name: "Kornati", country: "Croazia", lat: 43.8, lng: 15.33 },
  { id: "pag", name: "Pag", country: "Croazia", lat: 44.49, lng: 14.97 },
  { id: "pula", name: "Pula / Brijuni", country: "Croazia", lat: 44.87, lng: 13.85 },
  { id: "rovinj", name: "Rovinj", country: "Croazia", lat: 45.08, lng: 13.64 },
  { id: "krk", name: "Krk", country: "Croazia", lat: 45.03, lng: 14.57 },
  { id: "losinj", name: "Lošinj", country: "Croazia", lat: 44.53, lng: 14.47 },
  { id: "boka", name: "Bocche di Cattaro", country: "Montenegro", lat: 42.45, lng: 18.57 },
  { id: "ulcinj", name: "Ulcinj", country: "Montenegro", lat: 41.92, lng: 19.2 },
  { id: "saranda", name: "Saranda / Ksamil", country: "Albania", lat: 39.87, lng: 20.0 },
  { id: "paxos", name: "Paxos", country: "Grecia", lat: 39.2, lng: 20.16 },
  { id: "corfu", name: "Corfù", country: "Grecia", lat: 39.62, lng: 19.92 },
  { id: "kefalonia", name: "Cefalonia", country: "Grecia", lat: 38.18, lng: 20.49 },
  { id: "lefkada", name: "Lefkada", country: "Grecia", lat: 38.83, lng: 20.7 },
  { id: "paros", name: "Paros", country: "Grecia", lat: 37.08, lng: 25.15 },
  { id: "naxos", name: "Naxos", country: "Grecia", lat: 37.1, lng: 25.38 },
  { id: "mykonos", name: "Mykonos / Delos", country: "Grecia", lat: 37.45, lng: 25.33 },
  { id: "crete-balos", name: "Creta / Balos", country: "Grecia", lat: 35.58, lng: 23.59 },
  { id: "crete-spinalonga", name: "Creta / Spinalonga", country: "Grecia", lat: 35.3, lng: 25.74 },
  { id: "rhodes", name: "Rodi", country: "Grecia", lat: 36.43, lng: 28.22 },
  { id: "kos", name: "Kos", country: "Grecia", lat: 36.89, lng: 27.29 },
  { id: "kalymnos", name: "Kalymnos", country: "Grecia", lat: 36.95, lng: 26.98 },
  { id: "alanya", name: "Alanya", country: "Turchia", lat: 36.54, lng: 32.0 },
  { id: "antalya", name: "Antalya", country: "Turchia", lat: 36.88, lng: 30.7 },
  { id: "fethiye", name: "Fethiye", country: "Turchia", lat: 36.62, lng: 29.1 },
  { id: "bodrum", name: "Bodrum", country: "Turchia", lat: 37.03, lng: 27.43 },
  { id: "marmaris", name: "Marmaris", country: "Turchia", lat: 36.85, lng: 28.27 },
  { id: "cyprus-ayianapa", name: "Ayia Napa", country: "Cipro", lat: 34.98, lng: 34.0 },
  { id: "paphos", name: "Pafos", country: "Cipro", lat: 34.76, lng: 32.41 },
  { id: "hurghada", name: "Hurghada", country: "Egitto", lat: 27.26, lng: 33.81 },
  { id: "marsa-alam", name: "Marsa Alam", country: "Egitto", lat: 25.07, lng: 34.9 },
  { id: "safaga", name: "Safaga", country: "Egitto", lat: 26.75, lng: 33.94 },
  { id: "abu-dabbab", name: "Abu Dabbab", country: "Egitto", lat: 25.34, lng: 34.74 },
  { id: "shaab-samadai", name: "Shaab Samadai", country: "Egitto", lat: 24.99, lng: 35.0 },
  { id: "thistlegorm", name: "SS Thistlegorm", country: "Egitto", lat: 27.81, lng: 33.92 },
  { id: "ras-abu-galum", name: "Ras Abu Galum", country: "Egitto", lat: 28.62, lng: 34.56 },
  { id: "tiran", name: "Isola di Tiran", country: "Egitto", lat: 27.95, lng: 34.56 },
  { id: "shaab-ruhr", name: "Shaab Rumi", country: "Sudan", lat: 19.93, lng: 37.4 },
  { id: "sanganeb", name: "Sanganeb", country: "Sudan", lat: 19.74, lng: 37.44 },
  { id: "jeddah", name: "Gedda", country: "Arabia Saudita", lat: 21.49, lng: 39.18 },
  { id: "yanbu", name: "Yanbu", country: "Arabia Saudita", lat: 24.09, lng: 38.06 },
  { id: "musandam", name: "Musandam", country: "Oman", lat: 26.2, lng: 56.25 },
  { id: "muscat", name: "Mascate / Daymaniyat", country: "Oman", lat: 23.85, lng: 58.09 },
  { id: "fuvahmulah", name: "Fuvahmulah", country: "Maldive", lat: -0.3, lng: 73.43 },
  { id: "male-north", name: "North Malé Atoll", country: "Maldive", lat: 4.42, lng: 73.5 },
  { id: "south-ari", name: "South Ari", country: "Maldive", lat: 3.47, lng: 72.83 },
  { id: "vaavu", name: "Vaavu / Alimatha", country: "Maldive", lat: 3.47, lng: 73.42 },
  { id: "laamu", name: "Laamu", country: "Maldive", lat: 1.92, lng: 73.47 },
  { id: "addu", name: "Addu Atoll", country: "Maldive", lat: -0.64, lng: 73.12 },
  { id: "koh-tao", name: "Koh Tao", country: "Thailandia", lat: 10.1, lng: 99.84 },
  { id: "koh-samui", name: "Koh Samui", country: "Thailandia", lat: 9.51, lng: 100.01 },
  { id: "phuket", name: "Phuket", country: "Thailandia", lat: 7.89, lng: 98.4 },
  { id: "phi-phi", name: "Phi Phi", country: "Thailandia", lat: 7.74, lng: 98.77 },
  { id: "hin-muang", name: "Hin Muang", country: "Thailandia", lat: 7.17, lng: 99.0 },
  { id: "sail-rock", name: "Sail Rock", country: "Thailandia", lat: 10.19, lng: 99.73 },
  { id: "nusa-penida", name: "Nusa Penida", country: "Indonesia", lat: -8.73, lng: 115.54 },
  { id: "nusa-lembongan", name: "Nusa Lembongan", country: "Indonesia", lat: -8.68, lng: 115.45 },
  { id: "tulamben", name: "Tulamben / USAT Liberty", country: "Indonesia", lat: -8.27, lng: 115.59 },
  { id: "menjangan", name: "Menjangan", country: "Indonesia", lat: -8.1, lng: 114.51 },
  { id: "gili-trawangan", name: "Gili Trawangan", country: "Indonesia", lat: -8.35, lng: 116.04 },
  { id: "gili-air", name: "Gili Air", country: "Indonesia", lat: -8.36, lng: 116.08 },
  { id: "gili-meno", name: "Gili Meno", country: "Indonesia", lat: -8.35, lng: 116.06 },
  { id: "alor", name: "Alor", country: "Indonesia", lat: -8.25, lng: 124.75 },
  { id: "flores", name: "Flores / Maumere", country: "Indonesia", lat: -8.62, lng: 122.22 },
  { id: "ambon", name: "Ambon", country: "Indonesia", lat: -3.7, lng: 128.18 },
  { id: "halmahera", name: "Halmahera", country: "Indonesia", lat: 0.6, lng: 127.9 },
  { id: "misool", name: "Misool", country: "Indonesia", lat: -1.87, lng: 130.17 },
  { id: "wayag", name: "Wayag", country: "Indonesia", lat: 0.17, lng: 130.02 },
  { id: "derawan", name: "Derawan", country: "Indonesia", lat: 2.28, lng: 118.25 },
  { id: "sangalaki", name: "Sangalaki", country: "Indonesia", lat: 2.08, lng: 118.4 },
  { id: "we", name: "Weh / Pulau Weh", country: "Indonesia", lat: 5.84, lng: 95.28 },
  { id: "lankayan", name: "Lankayan", country: "Malaysia", lat: 6.5, lng: 117.92 },
  { id: "tioman", name: "Tioman", country: "Malaysia", lat: 2.79, lng: 104.17 },
  { id: "redang", name: "Redang", country: "Malaysia", lat: 5.78, lng: 103.0 },
  { id: "layang", name: "Layang-Layang", country: "Malaysia", lat: 7.37, lng: 113.84 },
  { id: "puerto-galera", name: "Puerto Galera", country: "Filippine", lat: 13.5, lng: 120.95 },
  { id: "moalboal", name: "Moalboal", country: "Filippine", lat: 9.94, lng: 123.4 },
  { id: "panglao", name: "Panglao / Balicasag", country: "Filippine", lat: 9.55, lng: 123.77 },
  { id: "siargao", name: "Siargao", country: "Filippine", lat: 9.85, lng: 126.05 },
  { id: "dauin", name: "Dauin", country: "Filippine", lat: 9.19, lng: 123.27 },
  { id: "cebu-malapascua", name: "Gato Island", country: "Filippine", lat: 11.44, lng: 124.02 },
  { id: "sogod", name: "Sogod Bay", country: "Filippine", lat: 10.2, lng: 125.0 },
  { id: "elan", name: "El Nido", country: "Filippine", lat: 11.18, lng: 119.39 },
  { id: "busuanga", name: "Busuanga", country: "Filippine", lat: 12.16, lng: 120.0 },
  { id: "osprey", name: "Osprey Reef", country: "Australia", lat: -13.9, lng: 146.65 },
  { id: "cod-hole", name: "Cod Hole", country: "Australia", lat: -14.67, lng: 145.67 },
  { id: "ribbon-reef", name: "Ribbon Reefs", country: "Australia", lat: -15.0, lng: 145.7 },
  { id: "heron", name: "Heron Island", country: "Australia", lat: -23.44, lng: 151.91 },
  { id: "lady-elliot", name: "Lady Elliot", country: "Australia", lat: -24.11, lng: 152.71 },
  { id: "ss-yongala", name: "Yongala wreck", country: "Australia", lat: -19.31, lng: 147.62 },
  { id: "julian-rocks", name: "Julian Rocks", country: "Australia", lat: -28.61, lng: 153.63 },
  { id: "rottnest", name: "Rottnest", country: "Australia", lat: -32.0, lng: 115.54 },
  { id: "kiwi-mt", name: "Poor Knights Nursey", country: "Nuova Zelanda", lat: -35.47, lng: 174.74 },
  { id: "goat-island", name: "Goat Island", country: "Nuova Zelanda", lat: -36.27, lng: 174.8 },
  { id: "milford", name: "Milford Sound", country: "Nuova Zelanda", lat: -44.64, lng: 167.91 },
  { id: "beqa", name: "Beqa Lagoon", country: "Figi", lat: -18.4, lng: 178.13 },
  { id: "taveuni", name: "Taveuni", country: "Figi", lat: -16.82, lng: 179.98 },
  { id: "vanuatu-ss-president", name: "SS President Coolidge", country: "Vanuatu", lat: -15.52, lng: 167.18 },
  { id: "efate", name: "Efate", country: "Vanuatu", lat: -17.68, lng: 168.38 },
  { id: "papua-kimbe", name: "Kimbe Bay", country: "Papua Nuova Guinea", lat: -5.55, lng: 150.15 },
  { id: "milne", name: "Milne Bay", country: "Papua Nuova Guinea", lat: -10.32, lng: 150.45 },
  { id: "yap", name: "Yap", country: "Micronesia", lat: 9.51, lng: 138.12 },
  { id: "chuuk", name: "Chuuk / Truk", country: "Micronesia", lat: 7.45, lng: 151.83 },
  { id: "guam", name: "Guam", country: "Guam", lat: 13.44, lng: 144.79 },
  { id: "saipan", name: "Saipan", country: "Isole Marianne", lat: 15.21, lng: 145.75 },
  { id: "kona", name: "Kona / Hawaii", country: "USA", lat: 19.64, lng: -156.0 },
  { id: "maui", name: "Maui / Molokini", country: "USA", lat: 20.63, lng: -156.5 },
  { id: "oahu", name: "Oahu / USS Arizona", country: "USA", lat: 21.36, lng: -157.95 },
  { id: "catalina", name: "Catalina Island", country: "USA", lat: 33.38, lng: -118.42 },
  { id: "channel-islands", name: "Channel Islands CA", country: "USA", lat: 34.0, lng: -119.4 },
  { id: "flower-garden", name: "Flower Garden Banks", country: "USA", lat: 27.92, lng: -93.6 },
  { id: "jupiter-fl", name: "Jupiter Florida", country: "USA", lat: 26.93, lng: -80.07 },
  { id: "west-palm", name: "West Palm Beach", country: "USA", lat: 26.7, lng: -80.03 },
  { id: "key-largo", name: "Key Largo / Spiegel Grove", country: "USA", lat: 25.07, lng: -80.43 },
  { id: "key-west", name: "Key West", country: "USA", lat: 24.55, lng: -81.78 },
  { id: "vancouver-whytecliff", name: "Whytecliff", country: "Canada", lat: 49.37, lng: -123.29 },
  { id: "tobermory", name: "Tobermory", country: "Canada", lat: 45.25, lng: -81.66 },
  { id: "playa-del-carmen", name: "Playa del Carmen", country: "Messico", lat: 20.63, lng: -87.07 },
  { id: "akumal", name: "Akumal", country: "Messico", lat: 20.4, lng: -87.32 },
  { id: "tulum", name: "Tulum / Dos Ojos", country: "Messico", lat: 20.33, lng: -87.39 },
  { id: "isla-mujeres", name: "Isla Mujeres / MUSA", country: "Messico", lat: 21.23, lng: -86.73 },
  { id: "cabo-pulmo", name: "Cabo Pulmo", country: "Messico", lat: 23.45, lng: -109.42 },
  { id: "la-paz", name: "La Paz", country: "Messico", lat: 24.14, lng: -110.31 },
  { id: "guadalupe", name: "Isola Guadalupe", country: "Messico", lat: 29.03, lng: -118.28 },
  { id: "banco-chinchorro", name: "Banco Chinchorro", country: "Messico", lat: 18.58, lng: -87.35 },
  { id: "holbox", name: "Holbox", country: "Messico", lat: 21.53, lng: -87.28 },
  { id: "turneffe", name: "Turneffe Atoll", country: "Belize", lat: 17.3, lng: -87.85 },
  { id: "lighthouse-reef", name: "Lighthouse Reef", country: "Belize", lat: 17.2, lng: -87.53 },
  { id: "glover", name: "Glover’s Reef", country: "Belize", lat: 16.75, lng: -87.8 },
  { id: "bay-islands", name: "Bay Islands", country: "Honduras", lat: 16.3, lng: -86.55 },
  { id: "little-cayman", name: "Little Cayman", country: "Isole Cayman", lat: 19.68, lng: -80.06 },
  { id: "grand-cayman", name: "Grand Cayman", country: "Isole Cayman", lat: 19.3, lng: -81.25 },
  { id: "cayman-brac", name: "Cayman Brac", country: "Isole Cayman", lat: 19.72, lng: -79.82 },
  { id: "st-croix", name: "St. Croix", country: "Isole Vergini", lat: 17.73, lng: -64.83 },
  { id: "st-thomas", name: "St. Thomas", country: "Isole Vergini", lat: 18.34, lng: -64.93 },
  { id: "st-john", name: "St. John", country: "Isole Vergini", lat: 18.33, lng: -64.73 },
  { id: "saba", name: "Saba", country: "Caraibi", lat: 17.63, lng: -63.23 },
  { id: "statia", name: "St. Eustatius", country: "Caraibi", lat: 17.49, lng: -62.97 },
  { id: "st-maarten", name: "St. Maarten", country: "Caraibi", lat: 18.03, lng: -63.05 },
  { id: "antigua", name: "Antigua", country: "Caraibi", lat: 17.07, lng: -61.8 },
  { id: "dominica", name: "Dominica", country: "Caraibi", lat: 15.3, lng: -61.38 },
  { id: "st-lucia", name: "St. Lucia", country: "Caraibi", lat: 13.91, lng: -61.07 },
  { id: "tobago", name: "Tobago", country: "Trinidad e Tobago", lat: 11.18, lng: -60.73 },
  { id: "barbados", name: "Barbados", country: "Caraibi", lat: 13.19, lng: -59.54 },
  { id: "curacao", name: "Curaçao", country: "Caraibi", lat: 12.17, lng: -68.99 },
  { id: "aruba", name: "Aruba", country: "Caraibi", lat: 12.52, lng: -69.97 },
  { id: "bahamas-exuma", name: "Exuma / Thunderball", country: "Bahamas", lat: 24.0, lng: -76.4 },
  { id: "bahamas-tiger", name: "Tiger Beach", country: "Bahamas", lat: 26.86, lng: -79.05 },
  { id: "andros", name: "Andros", country: "Bahamas", lat: 24.7, lng: -77.8 },
  { id: "cuba-jardines", name: "Jardines de la Reina", country: "Cuba", lat: 20.85, lng: -78.92 },
  { id: "cuba-isla", name: "Isla de la Juventud", country: "Cuba", lat: 21.7, lng: -82.8 },
  { id: "varadero", name: "Varadero", country: "Cuba", lat: 23.15, lng: -81.25 },
  { id: "fernando", name: "Fernando de Noronha", country: "Brasile", lat: -3.85, lng: -32.42 },
  { id: "abrolhos", name: "Abrolhos", country: "Brasile", lat: -17.97, lng: -38.7 },
  { id: "armacao", name: "Arraial do Cabo", country: "Brasile", lat: -22.97, lng: -42.03 },
  { id: "bombinhas", name: "Bombinhas", country: "Brasile", lat: -27.14, lng: -48.48 },
  { id: "paracas", name: "Paracas / Ballestas", country: "Perù", lat: -13.83, lng: -76.25 },
  { id: "easter-island", name: "Isola di Pasqua", country: "Cile", lat: -27.11, lng: -109.35 },
  { id: "punta-arenas", name: "Punta Arenas / Magellano", country: "Cile", lat: -53.16, lng: -70.91 },
  { id: "ushuaia", name: "Ushuaia", country: "Argentina", lat: -54.8, lng: -68.3 },
  { id: "antarctic-pen", name: "Penisola Antartica", country: "Antartide", lat: -64.8, lng: -63.5 },
  { id: "cape-town", name: "Città del Capo / Seal Island", country: "Sudafrica", lat: -34.15, lng: 18.58 },
  { id: "false-bay", name: "False Bay", country: "Sudafrica", lat: -34.2, lng: 18.65 },
  { id: "protea", name: "Protea Banks", country: "Sudafrica", lat: -30.83, lng: 30.48 },
  { id: "ponta-do-ouro", name: "Ponta do Ouro", country: "Mozambico", lat: -26.84, lng: 32.89 },
  { id: "pemba-mz", name: "Pemba", country: "Mozambico", lat: -12.97, lng: 40.49 },
  { id: "zanzibar", name: "Zanzibar / Mnemba", country: "Tanzania", lat: -5.82, lng: 39.38 },
  { id: "pemba-tz", name: "Pemba Island", country: "Tanzania", lat: -5.17, lng: 39.77 },
  { id: "mafia", name: "Mafia Island", country: "Tanzania", lat: -7.85, lng: 39.78 },
  { id: "watamu", name: "Watamu", country: "Kenya", lat: -3.36, lng: 40.02 },
  { id: "wasini", name: "Wasini / Kisite", country: "Kenya", lat: -4.66, lng: 39.39 },
  { id: "nosy-be", name: "Nosy Be", country: "Madagascar", lat: -13.32, lng: 48.27 },
  { id: "tulear", name: "Ifaty / Toliara", country: "Madagascar", lat: -23.1, lng: 43.58 },
  { id: "reunion", name: "Réunion", country: "Francia", lat: -21.12, lng: 55.54 },
  { id: "mauritius", name: "Mauritius", country: "Mauritius", lat: -20.3, lng: 57.58 },
  { id: "rodrigues", name: "Rodrigues", country: "Mauritius", lat: -19.72, lng: 63.42 },
  { id: "cape-verde", name: "Capo Verde / Sal", country: "Capo Verde", lat: 16.74, lng: -22.94 },
  { id: "canaries-la-graciosa", name: "La Graciosa", country: "Spagna", lat: 29.25, lng: -13.5 },
  { id: "madeira", name: "Madera", country: "Portogallo", lat: 32.76, lng: -16.96 },
  { id: "porto-santo", name: "Porto Santo", country: "Portogallo", lat: 33.07, lng: -16.35 },
  { id: "berlengas", name: "Berlengas", country: "Portogallo", lat: 39.41, lng: -9.51 },
  { id: "sesimbra", name: "Sesimbra", country: "Portogallo", lat: 38.44, lng: -9.1 },
  { id: "algarve", name: "Algarve / Portimão", country: "Portogallo", lat: 37.13, lng: -8.54 },
  { id: "faro", name: "Isole Faroe", country: "Danimarca", lat: 62.01, lng: -6.77 },
  { id: "lofoten", name: "Lofoten", country: "Norvegia", lat: 68.15, lng: 13.6 },
  { id: "andfjord", name: "Andfjord / orche", country: "Norvegia", lat: 69.0, lng: 16.0 },
  { id: "obrestad", name: "Oban / Sound of Mull", country: "Regno Unito", lat: 56.42, lng: -5.48 },
  { id: "plymouth", name: "Plymouth", country: "Regno Unito", lat: 50.36, lng: -4.14 },
  { id: "lund-y", name: "Lundy", country: "Regno Unito", lat: 51.18, lng: -4.67 },
  { id: "st-abbs", name: "St Abbs", country: "Regno Unito", lat: 55.9, lng: -2.13 },
  { id: "malin", name: "Malin Head", country: "Irlanda", lat: 55.38, lng: -7.37 },
  { id: "okinawa", name: "Okinawa / Kerama", country: "Giappone", lat: 26.2, lng: 127.3 },
  { id: "ishigaki", name: "Ishigaki / Yonaguni", country: "Giappone", lat: 24.34, lng: 124.16 },
  { id: "yonaguni", name: "Yonaguni", country: "Giappone", lat: 24.45, lng: 123.0 },
  { id: "jeju", name: "Jeju", country: "Corea del Sud", lat: 33.38, lng: 126.55 },
  { id: "kenting", name: "Kenting", country: "Taiwan", lat: 21.95, lng: 120.8 },
  { id: "green-island", name: "Green Island", country: "Taiwan", lat: 22.66, lng: 121.49 },
  { id: "nha-trang", name: "Nha Trang", country: "Vietnam", lat: 12.24, lng: 109.2 },
  { id: "con-dao", name: "Con Dao", country: "Vietnam", lat: 8.69, lng: 106.61 },
  { id: "phu-quoc", name: "Phu Quoc", country: "Vietnam", lat: 10.29, lng: 103.98 },
  { id: "sihanouk", name: "Sihanoukville / Koh Rong", country: "Cambogia", lat: 10.63, lng: 103.3 },
  { id: "burma-banks", name: "Burma Banks", country: "Myanmar", lat: 9.8, lng: 97.7 },
  { id: "andaman", name: "Isole Andamane", country: "India", lat: 12.0, lng: 92.95 },
  { id: "lakshadweep", name: "Lakshadweep", country: "India", lat: 10.57, lng: 72.64 },
  { id: "goa", name: "Goa", country: "India", lat: 15.5, lng: 73.76 },
  { id: "trincomalee", name: "Trincomalee", country: "Sri Lanka", lat: 8.57, lng: 81.23 },
  { id: "hikkaduwa", name: "Hikkaduwa", country: "Sri Lanka", lat: 6.14, lng: 80.1 },
  { id: "batticaloa", name: "Batticaloa wrecks", country: "Sri Lanka", lat: 7.73, lng: 81.7 },
  { id: "bougainville", name: "Bougainville", country: "Papua Nuova Guinea", lat: -6.23, lng: 155.56 },
  { id: "new-ireland", name: "New Ireland / Kavieng", country: "Papua Nuova Guinea", lat: -2.58, lng: 150.8 },
  { id: "solomon-munda", name: "Munda", country: "Isole Salomone", lat: -8.33, lng: 157.27 },
  { id: "tonga", name: "Tonga / Vava’u", country: "Tonga", lat: -18.65, lng: -173.98 },
  { id: "samoa", name: "Samoa", country: "Samoa", lat: -13.76, lng: -172.1 },
  { id: "cook", name: "Isole Cook / Rarotonga", country: "Isole Cook", lat: -21.23, lng: -159.78 },
  { id: "tahiti", name: "Tahiti", country: "Polinesia", lat: -17.68, lng: -149.42 },
  { id: "bora-bora", name: "Bora Bora", country: "Polinesia", lat: -16.5, lng: -151.74 },
  { id: "huahine", name: "Huahine", country: "Polinesia", lat: -16.75, lng: -151.0 },
  { id: "tikehau", name: "Tikehau", country: "Polinesia", lat: -15.12, lng: -148.23 },
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

function matchCatalog(d) {
  const list = allCatalogSites();
  const p = divePoint(d);
  let best = null;
  let bestKm = 4;
  if (p) {
    list.forEach((s) => {
      const km = haversineKm(p, s);
      if (km <= bestKm) {
        bestKm = km;
        best = s;
      }
    });
  }
  if (best) return best;
  return list.find((s) => siteMatchesDive(s, d)) || null;
}

function ensureSiteFromDive(d) {
  const p = divePoint(d);
  if (!p) return;
  if (matchCatalog(d)) return;
  try {
    addCustomSite({
      name: d.site || "Sito immersione",
      country: d.location || "",
      lat: p.lat,
      lng: p.lng,
    });
  } catch {
    /* ignora duplicati incompleti */
  }
}

function mergeCustomSites(incoming) {
  if (!Array.isArray(incoming) || !incoming.length) return loadCustomSites();
  const cur = loadCustomSites();
  const keyOf = (s) =>
    `${normName(s.name)}|${Number(s.lat).toFixed(4)}|${Number(s.lng).toFixed(4)}`;
  const seen = new Set(cur.map(keyOf));
  const next = [...cur];
  incoming.forEach((s) => {
    if (!s || !Number.isFinite(Number(s.lat)) || !Number.isFinite(Number(s.lng))) return;
    const k = keyOf(s);
    if (seen.has(k)) return;
    seen.add(k);
    next.push({
      id: s.id || "custom-" + Date.now() + "-" + next.length,
      name: String(s.name || "Sito").trim(),
      country: String(s.country || "").trim(),
      lat: Number(s.lat),
      lng: Number(s.lng),
      custom: true,
    });
  });
  saveCustomSites(next);
  return next;
}

function osmPoint(el) {
  const lat = Number(el.lat || el.center?.lat);
  const lng = Number(el.lon || el.center?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const tags = el.tags || {};
  const diving = tags.amenity === "dive_centre" || tags.shop === "scuba_diving" || tags.office === "diving";
  return {
    id: `osm-${el.type}-${el.id}`,
    name: tags.name || tags["name:en"] || tags["name:it"] || (diving ? "Diving" : "Sito immersione"),
    country: tags["addr:country"] || tags["addr:city"] || "",
    lat,
    lng,
    osm: true,
    kind: diving ? "diving" : "sito",
  };
}

async function fetchOsmDivePlaces(bounds) {
  if (!bounds) return [];
  const s = bounds.getSouth();
  const w = bounds.getWest();
  const n = bounds.getNorth();
  const e = bounds.getEast();
  if (![s, w, n, e].every(Number.isFinite)) return [];
  const box = `${s},${w},${n},${e}`;
  const q = `[out:json][timeout:22];(nwr["amenity"="dive_centre"](${box});nwr["shop"="scuba_diving"](${box});nwr["sport"="scuba_diving"](${box});nwr["leisure"="diving"](${box}););out center 280;`;
  const urls = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];
  let data = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: "data=" + encodeURIComponent(q),
      });
      if (!res.ok) continue;
      data = await res.json();
      break;
    } catch {
      /* prova il prossimo mirror */
    }
  }
  const els = Array.isArray(data?.elements) ? data.elements : [];
  const seen = new Set();
  const out = [];
  els.forEach((el) => {
    const p = osmPoint(el);
    if (!p) return;
    const k = `${p.lat.toFixed(4)}|${p.lng.toFixed(4)}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(p);
  });
  return out;
}

function markDoneAgainstDives(sites, dives) {
  return (sites || []).map((site) => {
    const hits = (dives || []).filter((d) => siteMatchesDive(site, d));
    return { ...site, done: hits.length > 0 || Boolean(site.done), dives: hits.length || site.dives || 0 };
  });
}

window.SeaDiveSites = {
  WORLD_SITES,
  allCatalogSites,
  annotateSites,
  addCustomSite,
  loadCustomSites,
  mergeCustomSites,
  matchCatalog,
  ensureSiteFromDive,
  divePoint,
  fetchOsmDivePlaces,
  markDoneAgainstDives,
};
