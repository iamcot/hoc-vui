// Chuyển ảnh PNG/JPG sang WebP nhẹ cho app.
//   node scripts/convert-assets.mjs [thư-mục-nguồn]
// - Mặc định đọc assets-src/ (không đưa lên git), ghi ra public/assets/img/<tên>.webp
// - Ảnh có nền trong suốt (nhân vật, huy hiệu, avatar) được cắt bớt viền trống.
// - Cũng quét public/assets/img: PNG/JPG nào lỡ để ở đó sẽ được đổi sang WebP và xoá bản gốc
//   (chạy tự động trước mỗi lần build/dev).
// - File .mp3/.m4a/.wav trong thư mục nguồn: tên vo-* và tv-* (giọng Tập đọc) vào public/assets/voice, còn lại vào public/assets/sfx.
import { readdirSync, statSync, mkdirSync, copyFileSync, unlinkSync, existsSync, readFileSync } from "node:fs";
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

/** ảnh cần nền trong suốt (sinh bởi npm run prompts) */
const TRANSPARENT = new Set(existsSync("scripts/transparent-ids.json") ? JSON.parse(readFileSync("scripts/transparent-ids.json", "utf8")) : []);

/**
 * Xóa nền trơn (trắng, xanh lá, hay ô caro giả trong suốt) của ảnh tải từ công cụ không xuất được PNG trong suốt.
 * Lấy màu ở viền ảnh, loang từ viền vào các điểm gần màu đó; nét viền nhân vật chặn lại nên phần trắng bên trong không mất.
 */
async function removeBackground(src, single = false) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  // màu nền: tối đa 2 màu hay gặp nhất trên viền (ô caro có 2 màu)
  const count = new Map();
  const border = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  for (const i of border) {
    const [r, g, b] = px(i);
    const k = `${r >> 4},${g >> 4},${b >> 4}`;
    count.set(k, (count.get(k) ?? 0) + 1);
  }
  const top = [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).filter(([, n]) => n > border.length * 0.08);
  const bg = top.map(([k]) => k.split(",").map((v) => +v * 16 + 8));
  if (!bg.length) return null;
  const dist = (i) => {
    const [r, g, b] = px(i);
    return Math.min(...bg.map(([R, G, B]) => Math.hypot(r - R, g - G, b - B)));
  };
  const TOL = 48;
  const seen = new Uint8Array(w * h);
  const stack = border.filter((i) => dist(i) < TOL);
  for (const i of stack) seen[i] = 1;
  while (stack.length) {
    const i = stack.pop();
    data[i * 4 + 3] = 0;
    const x = i % w, y = (i / w) | 0;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (seen[n]) continue;
      seen[n] = 1;
      const d = dist(n);
      if (d < TOL) stack.push(n);
      else if (d < TOL * 2.2) data[n * 4 + 3] = Math.round(255 * ((d - TOL) / (TOL * 1.2))); // mép mềm
    }
  }
  const greenBg = bg.some(([r, g, b]) => g > 180 && r < 120 && b < 120);
  if (single) {
    // nền xanh lá làm model vẽ thêm bóng đổ xanh dưới vật: xoá điểm xanh lá rõ rệt (trừ vật vốn màu xanh)
    if (greenBg && !/qua-chanh|lime/.test(basename(src))) for (let i = 0; i < w * h; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      if (g > r + 25 && g > b + 40) data[i * 4 + 3] = 0;
    }
    keepLargest(data, w, h);
  }
  // bớt ánh xanh ở mép khi nền là xanh lá
  if (greenBg) for (let i = 0; i < w * h; i++) {
    if (data[i * 4 + 3] === 0) continue;
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    if (g > Math.max(r, b)) data[i * 4 + 1] = Math.max(r, b);
  }
  const wm = removeCornerMark(data, w, h);
  console.log(`  ${basename(src)}: không có nền trong suốt, đã tự xóa nền${wm ? " và dấu watermark ở góc" : ""} (${greenBg ? "xanh lá" : bg.length > 1 ? "ô caro" : "màu trơn"})`);
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

/**
 * Vật thừa model vẽ sát vào vật chính (tia lấp lánh, bông hoa) có thể dính liền qua một chỗ hẹp.
 * Co mặt nạ vào (erode) để cắt chỗ hẹp, giữ mảnh lớn nhất rồi nở ra lại trong phạm vi mặt nạ gốc.
 */
function detachNarrow(data, w, h) {
  const r = Math.max(4, Math.round(Math.min(w, h) * 0.02));
  const solid = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = data[i * 4 + 3] >= 16 ? 1 : 0;
  const dilateOrErode = (src, want) => {
    // lọc tách theo chiều ngang rồi dọc (hình vuông bán kính r)
    const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let v = want ? 0 : 1;
      for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++) {
        if (want ? src[y * w + k] : !src[y * w + k]) { v = want ? 1 : 0; break; }
      }
      tmp[y * w + x] = v;
    }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let v = want ? 0 : 1;
      for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++) {
        if (want ? tmp[k * w + x] : !tmp[k * w + x]) { v = want ? 1 : 0; break; }
      }
      out[y * w + x] = v;
    }
    return out;
  };
  const core = dilateOrErode(solid, false);
  // mảnh lớn nhất của phần lõi
  const label = new Int32Array(w * h);
  const sizes = [0];
  let best = 0;
  for (let s0 = 0; s0 < w * h; s0++) {
    if (label[s0] || !core[s0]) continue;
    const id = sizes.length;
    sizes.push(0);
    const stack = [s0];
    label[s0] = id;
    while (stack.length) {
      const i = stack.pop();
      sizes[id]++;
      const x = i % w, y = (i / w) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (label[n] || !core[n]) continue;
        label[n] = id;
        stack.push(n);
      }
    }
    if (sizes[id] > (sizes[best] ?? 0)) best = id;
  }
  if (sizes.length <= 2) return;
  const keep = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) keep[i] = label[i] === best ? 1 : 0;
  const grown = dilateOrErode(keep, true);
  for (let i = 0; i < w * h; i++) if (!grown[i]) data[i * 4 + 3] = 0;
  console.log(`  (cắt vật dính liền, bỏ ${sizes.length - 2} vật thừa)`);
}

/** icon chỉ có một vật: giữ mảnh liền lớn nhất, xoá các mảnh rời (tia lấp lánh, vật thừa model vẽ thêm) */
function keepLargest(data, w, h) {
  detachNarrow(data, w, h);
  const label = new Int32Array(w * h);
  const sizes = [0];
  let best = 0;
  for (let s0 = 0; s0 < w * h; s0++) {
    if (label[s0] || data[s0 * 4 + 3] < 16) continue;
    const id = sizes.length;
    sizes.push(0);
    const stack = [s0];
    label[s0] = id;
    while (stack.length) {
      const i = stack.pop();
      sizes[id]++;
      const x = i % w, y = (i / w) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (label[n] || data[n * 4 + 3] < 16) continue;
        label[n] = id;
        stack.push(n);
      }
    }
    if (sizes[id] > (sizes[best] ?? 0)) best = id;
  }
  if (sizes.length <= 2) return;
  for (let i = 0; i < w * h; i++) if (label[i] && label[i] !== best) data[i * 4 + 3] = 0;
  console.log(`  (giữ mảnh lớn nhất, bỏ ${sizes.length - 2} mảnh rời)`);
}

/**
 * Gemini đóng dấu ngôi sao nhỏ ở góc dưới phải. Sau khi xóa nền, dấu đó thành một mảnh rời:
 * xóa các mảnh nhỏ nằm trọn trong góc dưới phải (không đụng tới hình chính).
 */
function removeCornerMark(data, w, h) {
  const seen = new Uint8Array(w * h);
  const x0 = Math.floor(w * 0.8), y0 = Math.floor(h * 0.8);
  let removed = false;
  for (let y = y0; y < h; y++)
    for (let x = x0; x < w; x++) {
      const s0 = y * w + x;
      if (seen[s0] || data[s0 * 4 + 3] < 16) continue;
      const comp = [s0];
      seen[s0] = 1;
      let inCorner = true;
      for (let k = 0; k < comp.length && comp.length < 40000; k++) {
        const i = comp[k], cx = i % w, cy = (i / w) | 0;
        if (cx < x0 || cy < y0) inCorner = false;
        for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const n = ny * w + nx;
          if (seen[n] || data[n * 4 + 3] < 16) continue;
          seen[n] = 1;
          comp.push(n);
        }
      }
      if (inCorner && comp.length < w * h * 0.01) {
        for (const i of comp) data[i * 4 + 3] = 0;
        removed = true;
      }
    }
  return removed;
}

// Chỉ xử lý ảnh mới hoặc đã đổi: bỏ qua khi bản .webp đã có và mới hơn ảnh nguồn (npm run dev chạy nhanh).
// Muốn làm lại tất cả (vd. sau khi sửa cách xoá nền): node scripts/convert-assets.mjs --force
const FORCE = process.argv.includes("--force");
const upToDate = (file, out) => !FORCE && existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs;

async function toWebp(file) {
  let src = file;
  const name = basename(src, extname(src));
  const out = join(OUT_IMG, `${name}.webp`);
  if (upToDate(file, out)) return;
  let img = sharp(src);
  const meta = await img.metadata();
  let alpha = meta.hasAlpha;
  // ảnh cần trong suốt mà tải về vẫn có nền (Gemini, JPG...) hoặc PNG có kênh alpha nhưng kín nền
  if (TRANSPARENT.has(name)) {
    const st = alpha ? await sharp(src).stats() : null;
    const opaque = !alpha || (st && st.channels[3] && st.channels[3].min === 255);
    if (opaque) {
      const buf = await removeBackground(src, /^hh-chem-/.test(name));
      if (buf) {
        src = buf;
        img = sharp(buf);
        alpha = true;
      }
    }
  }
  if (alpha) {
    // cắt viền trong suốt, chừa lề 3%
    const trimmed = await sharp(src).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
    const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.03);
    img = sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  const sprite = alpha && !/^(bg-|fx-l\d+-(cover|s\d+)|subject-)/.test(name);
  const max = /^ic-/.test(name) ? 192 : /^nav-/.test(name) ? 720 : sprite ? MAX_SPRITE : MAX_WIDE;
  await img
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90, effort: 5 })
    .toFile(out);
  const before = statSync(file).size, after = statSync(out).size;
  console.log(`${name}.webp  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
}

const srcDir = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "assets-src";
mkdirSync(OUT_IMG, { recursive: true });
mkdirSync("public/assets/voice", { recursive: true });
mkdirSync("public/assets/sfx", { recursive: true });

for (const f of walk(srcDir)) {
  const ext = extname(f).toLowerCase();
  if ([".png", ".jpg", ".jpeg"].includes(ext)) await toWebp(f);
  else if ([".mp3", ".m4a", ".wav", ".ogg"].includes(ext)) {
    const dest = /^(vo|tv)-/.test(basename(f)) ? "public/assets/voice" : "public/assets/sfx";
    const to = join(dest, basename(f));
    if (!FORCE && existsSync(to) && statSync(to).size === statSync(f).size) continue;
    copyFileSync(f, to);
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
