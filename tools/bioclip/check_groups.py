import json
names = json.load(open(r"C:\sdbio\names.json", encoding="utf-8"))
taxa = json.load(open(r"C:\sdbio\taxa.json", encoding="utf-8"))

def expected(t):
    k, p, c, o, f, g = (t + [""] * 6)[:6]
    if not k:
        return None
    if k in ("Plantae", "Chromista") and p != "Foraminifera" and p != "Ciliophora":
        return {"flora"}
    if k != "Animalia":
        return {"altri", "flora"}
    if o == "Nudibranchia":
        return {"nudibranchi"}
    if p == "Mollusca":
        return {"molluschi"}
    if p == "Arthropoda":
        return {"crostacei"}
    if p == "Echinodermata":
        return {"echinodermi"}
    if p == "Porifera":
        return {"spugne"}
    if p == "Cnidaria":
        return {"coralli", "meduse"}
    if p in ("Annelida", "Platyhelminthes", "Nemertea", "Sipuncula", "Chaetognatha", "Phoronida", "Echiura"):
        return {"vermi"}
    if p == "Bryozoa":
        return {"briozoi"}
    if p == "Ctenophora":
        return {"meduse", "altri"}
    if p == "Chordata":
        if c in ("Ascidiacea", "Thaliacea", "Appendicularia"):
            return {"tunicati"}
        if c == "Mammalia":
            return {"mammiferi"}
        if c in ("Reptilia", "Testudines", "Squamata", "Crocodylia") or o in ("Testudines", "Squamata"):
            return {"rettili"}
        if c == "Aves":
            return {"altri"}
        return {"pesci"}
    return {"altri"}

bad = []
for la, info in names.items():
    t = taxa.get(la)
    exp = expected(t) if t else None
    if exp and info["g"] not in exp:
        bad.append((info["g"], sorted(exp), la, info.get("it", ""), "/".join(x for x in t[:5] if x)))
bad.sort()
print("sezione sbagliata:", len(bad))
for b in bad:
    print(f"{b[0]:12s} -> {','.join(b[1]):18s} {b[2]:32s} {b[3][:28]:28s} {b[4]}")
