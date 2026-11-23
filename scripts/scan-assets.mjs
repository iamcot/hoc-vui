// Liệt kê file ảnh/âm thanh đã có trong public/assets để app biết dùng ảnh thật hay hình thay thế.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
const dirs = ["img", "sfx", "voice"];
const files = [];
for (const d of dirs) {
  const p = `public/assets/${d}`;
  if (!existsSync(p)) continue;
  for (const f of readdirSync(p)) if (!f.startsWith(".")) files.push(`/assets/${d}/${f}`);
}
writeFileSync("src/content/available.json", JSON.stringify(files.sort(), null, 1) + "\n");
console.log(`assets: ${files.length} file`);
