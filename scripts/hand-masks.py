"""Tách vùng từng ngón trong gp-hands.webp thành ảnh màu nhỏ gp-hand-<id>.webp (tô ngón trong chế độ Ngón tay ảo).
Chạy: python3 scripts/hand-masks.py public/assets/img/gp-hands.webp public/assets/img
Vẽ lại ảnh bàn tay thì phải đo lại đoạn khép gốc ngón, điểm hạt và HAND_MASK trong Keyboard.tsx."""
import json, sys
from PIL import Image, ImageDraw, ImageFilter, ImageOps
src = sys.argv[1]; out = sys.argv[2]
im = Image.open(src).convert("RGBA")
W, H = im.size
alpha = im.split()[3]
walls0 = alpha.point(lambda v: 255 if v > 40 else 0)

L = {  # closing segment at finger base, seed inside finger (left hand coords)
  "5": ([(30, 268), (110, 268)], (85, 185)),
  "4": ([(106, 268), (190, 252)], (158, 160)),
  "3": ([(186, 252), (277, 257)], (245, 150)),
  "2": ([(271, 257), (374, 292)], (350, 200)),
  "T": ([(338, 374), (428, 362)], (405, 318)),
}
COL = {"5": "#ff4fa3", "4": "#ffb020", "3": "#3ee08f", "2L": "#2fd3ff", "2R": "#7c6bff", "T": "#9aa6c8"}
meta = {}
for side in "LR":
    w = walls0 if side == "L" else ImageOps.mirror(walls0)
    for k, (seg, seed) in L.items():
        m = w.copy()
        d = ImageDraw.Draw(m)
        d.line(seg, fill=255, width=6)
        ImageDraw.floodfill(m, seed, 128)
        region = m.point(lambda v: 255 if v == 128 else 0)
        n = sum(1 for v in region.getdata() if v)
        region = region.filter(ImageFilter.MaxFilter(5))  # tràn nhẹ dưới nét vẽ
        if side == "R":
            region = ImageOps.mirror(region)
        bbox = region.getbbox()
        name = f"{side}{k}" if k != "T" else f"{side}T"
        col = COL["2" + side] if k == "2" else COL[k]
        print(name, n, bbox)
        crop = region.crop(bbox)
        rgba = Image.new("RGBA", crop.size, col)
        rgba.putalpha(crop)
        rgba.save(f"{out}/gp-hand-{name}.webp", lossless=True)
        meta[name] = bbox
print(json.dumps(meta))
