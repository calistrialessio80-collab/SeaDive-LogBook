"""Esporta l'encoder delle immagini di BioCLIP in ONNX (per il browser) e lo comprime in int8."""
import os, torch, open_clip, onnx
from onnxruntime.quantization import quantize_dynamic, QuantType

OUT = r"C:\sdbio\out"
os.makedirs(OUT, exist_ok=True)
model, _, preprocess = open_clip.create_model_and_transforms("hf-hub:imageomics/bioclip")
model.eval()
print(preprocess)


class Visual(torch.nn.Module):
    def __init__(self, m):
        super().__init__()
        self.m = m

    def forward(self, pixel_values):
        f = self.m.encode_image(pixel_values)
        return f / f.norm(dim=-1, keepdim=True)


v = Visual(model)
x = torch.randn(1, 3, 224, 224)
fp32 = os.path.join(OUT, "bioclip-visual.onnx")
torch.onnx.export(v, x, fp32, input_names=["pixel_values"], output_names=["embeds"],
                  opset_version=17, dynamic_axes=None, dynamo=False)
onnx.checker.check_model(fp32)
q8 = os.path.join(OUT, "bioclip-visual-q8.onnx")
quantize_dynamic(fp32, q8, weight_type=QuantType.QUInt8)
for p in (fp32, q8):
    print(p, round(os.path.getsize(p) / 1e6, 1), "MB")
