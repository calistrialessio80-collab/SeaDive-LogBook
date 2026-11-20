"""Calcola i vettori dei nomi di tutte le specie con BioCLIP e prova il riconoscimento su una foto."""
import json, struct, sys, numpy as np, torch, open_clip, onnxruntime as ort
from PIL import Image

PHOTO = sys.argv[1] if len(sys.argv) > 1 else ""
names = json.load(open(r"C:\sdbio\names.json", encoding="utf-8"))
taxa = json.load(open(r"C:\sdbio\taxa.json", encoding="utf-8"))
model, _, preprocess = open_clip.create_model_and_transforms("hf-hub:imageomics/bioclip")
tok = open_clip.get_tokenizer("hf-hub:imageomics/bioclip")
model.eval()

labels = sorted(names)


def tax_text(la):
    t = taxa.get(la) or []
    parts = la.split()
    if t and t[0] and t[5]:
        epithet = parts[1] if len(parts) > 1 else ""
        return "a photo of " + " ".join(x for x in t[:6] if x) + (" " + epithet if epithet else "")
    return "a photo of " + la


@torch.no_grad()
def encode(texts):
    out = []
    for i in range(0, len(texts), 256):
        f = model.encode_text(tok(texts[i:i + 256]))
        out.append(f / f.norm(dim=-1, keepdim=True))
    return torch.cat(out)


e_tax = encode([tax_text(la) for la in labels])
e_lat = encode(["a photo of " + la for la in labels])
emb = e_tax + e_lat
emb = (emb / emb.norm(dim=-1, keepdim=True)).numpy().astype(np.float32)

# int8 con scala per specie: 512 byte + 4 di scala a specie
scales = np.abs(emb).max(axis=1) / 127.0
q = np.round(emb / scales[:, None]).astype(np.int8)
with open(r"C:\sdbio\out\bioclip-species.bin", "wb") as f:
    f.write(struct.pack("<II", len(labels), emb.shape[1]))
    f.write(scales.astype(np.float32).tobytes())
    f.write(q.tobytes())
json.dump(labels, open(r"C:\sdbio\out\bioclip-species.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("specie:", len(labels), "dim:", emb.shape[1])

if PHOTO:
    deq = q.astype(np.float32) * scales[:, None]
    img = Image.open(PHOTO).convert("RGB")
    with torch.no_grad():
        f = model.encode_image(preprocess(img).unsqueeze(0))
        f = (f / f.norm(dim=-1, keepdim=True)).numpy()[0]
    # stessa preparazione che farà il browser: lato corto 224, ritaglio centrale, normalizzazione CLIP
    w, h = img.size
    s = 224 / min(w, h)
    im = img.resize((max(224, round(w * s)), max(224, round(h * s))), Image.BICUBIC)
    l, t = (im.width - 224) // 2, (im.height - 224) // 2
    arr = np.asarray(im.crop((l, t, l + 224, t + 224)), dtype=np.float32) / 255.0
    arr = (arr - [0.48145466, 0.4578275, 0.40821073]) / [0.26862954, 0.26130258, 0.27577711]
    x = arr.transpose(2, 0, 1)[None].astype(np.float32)
    sess = ort.InferenceSession(r"C:\sdbio\out\bioclip-visual-q8.onnx")
    g = sess.run(None, {"pixel_values": x})[0][0]
    for tag, vec, table in (("torch fp32", f, emb), ("onnx int8 + nomi int8", g, deq)):
        sims = table @ vec
        p = np.exp(100 * (sims - sims.max()))
        p /= p.sum()
        top = np.argsort(-sims)[:5]
        print(tag)
        for i in top:
            print(f"  {labels[i]:32s} {names[labels[i]].get('it',''):30s} {p[i]*100:5.1f}%")
