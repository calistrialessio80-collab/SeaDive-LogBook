"""Raccoglie tutte le specie della guida SeaDive e ne ricava la classificazione completa da GBIF."""
import json, re, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

REPO = r"C:\Users\kokun\SeaDive-LogBook"
OUT = r"C:\sdbio\taxa.json"

cat = json.load(open(REPO + r"\marine-catalog.json", encoding="utf-8"))
fields = cat["fields"]
names = {}
for row in cat["species"]:
    r = dict(zip(fields, row))
    la = (r.get("la") or "").strip()
    if la:
        names[la] = {"g": r.get("g", ""), "it": r.get("it", "")}
bio = open(REPO + r"\biology.js", encoding="utf-8").read()
for g, it, la in re.findall(r'sp\("([^"]+)",\s*"([^"]*)",\s*"([^"]+)"', bio):
    la = la.strip()
    names.setdefault(la, {"g": g, "it": it})
print("specie:", len(names))

try:
    done = json.load(open(OUT, encoding="utf-8"))
except Exception:
    done = {}

RANKS = ["kingdom", "phylum", "class", "order", "family", "genus"]

def match(la):
    url = "https://api.gbif.org/v1/species/match?verbose=false&name=" + urllib.parse.quote(la)
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "seadive-catalog/1.0"})
            with urllib.request.urlopen(req, timeout=20) as res:
                d = json.load(res)
            return la, [d.get(k) or "" for k in RANKS]
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return la, None

todo = [la for la in names if la not in done]
print("da chiedere:", len(todo))
with ThreadPoolExecutor(max_workers=6) as pool:
    for i, (la, tax) in enumerate(pool.map(match, todo)):
        if tax is not None:
            done[la] = tax
        if i % 500 == 0:
            print(i, la, tax, flush=True)
            json.dump(done, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
json.dump(done, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
json.dump(names, open(r"C:\sdbio\names.json", "w", encoding="utf-8"), ensure_ascii=False)
missing = [la for la in names if not (done.get(la) or [""])[0]]
print("con classificazione:", len(names) - len(missing), "senza:", len(missing), missing[:15])
