"""Crea marine-taxonomy.json: regno, phylum, classe, ordine, famiglia per ogni specie della guida (da GBIF).
Le voci in cui GBIF ha confuso la specie con un omonimo di un altro regno vengono scartate."""
import json, sys
sys.path.insert(0, r"C:\sdbio")
from check_groups import expected, names, taxa  # noqa: E402

table, index = [], {}
def ref(s):
    if s not in index:
        index[s] = len(table)
        table.append(s)
    return index[s]

out, dropped = {}, []
for la, info in sorted(names.items()):
    t = taxa.get(la)
    if not t or not t[0] or not t[4]:
        continue
    exp = expected(t) or set()
    ok = info["g"] in exp or (info["g"] == "nudibranchi" and t[1] == "Mollusca") or (info["g"] == "altri" and t[1] == "Arthropoda")
    if not ok:
        dropped.append(la)
        continue
    out[la] = [ref(x) for x in t[:5]]
data = {"v": 1, "source": "GBIF Backbone Taxonomy", "fields": ["regno", "phylum", "classe", "ordine", "famiglia"], "names": table, "t": out}
path = r"C:\Users\kokun\SeaDive-LogBook\marine-taxonomy.json"
json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
import os
print("specie:", len(out), "nomi:", len(table), "scartate:", dropped, "KB:", os.path.getsize(path) // 1024)
