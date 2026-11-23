// Chuyển ảnh PNG/JPG sang WebP nhẹ cho app.
//   node scripts/convert-assets.mjs [thư-mục-nguồn]
// - Mặc định đọc assets-src/ (không đưa lên git), ghi ra public/assets/img/<tên>.webp
// - Ảnh có nền trong suốt (nhân vật, huy hiệu, avatar) được cắt bớt viền trống.
// - Cũng quét public/assets/img: PNG/JPG nào lỡ để ở đó sẽ được đổi sang WebP và xoá bản gốc
//   (chạy tự động trước mỗi lần build/dev).
// - File .mp3/.m4a/.wav trong thư mục nguồn: tên vo-* và tv-* (giọng Tập đọc) vào public/assets/voice, còn lại vào public/assets/sfx.
import { readdirSync, statSync, mkdirSync, copyFileSync, unlinkSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const OUT_IMG = "public/assets/img";
const MAX_WIDE = 1600; // nền, ảnh bìa
const MAX_SPRITE = 900; // nhân vật, huy hiệu, avatar

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (f.startsWith(".") || f === "__MACOSX") return [];
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

async function toWebp(src) {
  const name = basename(src, extname(src));
  const out = join(OUT_IMG, `${name}.webp`);
  let img = sharp(src);
  const meta = await img.metadata();
  const alpha = meta.hasAlpha;
  if (alpha) {
    // cắt viền trong suốt, chừa lề 3%
    const trimmed = await sharp(src).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
    const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.03);
    img = sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  const sprite = alpha && !/^(bg-|fx-l\d+-(cover|s\d+)|subject-)/.test(name);
  const max = sprite ? MAX_SPRITE : MAX_WIDE;
  await img
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90, effort: 5 })
    .toFile(out);
  const before = statSync(src).size, after = statSync(out).size;
  console.log(`${name}.webp  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
}

const srcDir = process.argv[2] ?? "assets-src";
mkdirSync(OUT_IMG, { recursive: true });
mkdirSync("public/assets/voice", { recursive: true });
mkdirSync("public/assets/sfx", { recursive: true });

for (const f of walk(srcDir)) {
  const ext = extname(f).toLowerCase();
  if ([".png", ".jpg", ".jpeg"].includes(ext)) await toWebp(f);
  else if ([".mp3", ".m4a", ".wav", ".ogg"].includes(ext)) {
    const dest = /^(vo|tv)-/.test(basename(f)) ? "public/assets/voice" : "public/assets/sfx";
    copyFileSync(f, join(dest, basename(f)));
    console.log(`${basename(f)} → ${dest}`);
  }
}

// lưới an toàn: PNG/JPG nằm thẳng trong public/assets/img
for (const f of walk(OUT_IMG)) {
  if ([".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase())) {
    await toWebp(f);
    unlinkSync(f);
  }
}
