// Tạo ảnh bằng model chạy trên máy cá nhân (image-gen-kit: FLUX schnell/dev, tool của skill image-gen).
//
//   npm run gen-local                          các ảnh dạng icon còn thiếu (hoá chất, huy hiệu, biểu tượng)
//   npm run gen-local -- --only "hh-chem-*"    chỉ các ảnh này (thêm --force để làm lại ảnh đã có)
//   npm run gen-local -- --dry-run             xem sẽ tạo gì, không chạy model
//   npm run gen-local -- --model dev --steps 20 --quantize 8   chất lượng cao hơn (chậm hơn)
//   npm run gen-local -- --all                 cả nền, bìa, nhân vật (không khuyên dùng, xem ghi chú)
//   Ảnh nào hợp tạo bằng local hay gpt được ghi ở cột "Tạo bằng" trong docs/ASSET_PROMPTS.md (xem genOf trong assets.ts)
//   npm run gen-local -- --tool-dir <thư mục image-gen-kit>
//
// Ghi chú: model này vẽ icon (đồ vật, hoá chất, huy hiệu) tốt, nhưng nền và ảnh bìa chỉ khoảng 7/10 và không
// giữ được nhân vật Mochi/Bit (không có ảnh tham chiếu). Nền, bìa, nhân vật nên tạo bằng `npm run asset-helper`.
// Ảnh nền trong suốt: model không xuất alpha nên nhờ nền xanh lá trơn, convert-assets tự xoá nền khi chuyển sang WebP.
// Ảnh ra ở assets-src/<id>.png, cuối cùng tool tự chuyển sang WebP, cập nhật available.json và docs/ASSET_PROMPTS.md.
import { existsSync } from "node:fs";
import { spawnSync, execSync } from "node:child_process";
import { homedir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { IMAGES, genOf, type ImageAsset } from "@/content/assets";
import { SRC, byGen, cli, finalize, pick } from "./asset-lib";

const { flag, opt, only } = cli();

/** thư mục image-gen-kit: --tool-dir, hoặc biến IMAGE_GEN_KIT, hoặc suy ra từ skill ~/.claude/skills/image-gen */
function toolDir() {
  const given = opt("tool-dir") ?? process.env.IMAGE_GEN_KIT;
  if (given) return resolve(given);
  try {
    const skill = execSync(`readlink -f "${join(homedir(), ".claude/skills/image-gen")}"`, { encoding: "utf8" }).trim();
    return join(dirname(dirname(skill)), "tools/py/image-gen-kit");
  } catch {
    return "";
  }
}

const GREEN = "isolated on a plain flat solid bright green background (#00FF00), no shadow, no gradient, no ground, no checkerboard, green kept out of the subject";

const promptOf = (a: ImageAsset) => (a.transparent ? a.prompt.replace("isolated on a fully transparent background", GREEN) : a.prompt);

// mặc định chỉ ảnh genOf = "local" (icon); --gen gpt hoặc --all để lấy cả loại khác
const list = byGen(pick(IMAGES, only, flag("force")), flag("all") ? undefined : (opt("gen") ?? "local"));
const limit = Number(opt("limit") ?? list.length);
const todo = list.slice(0, limit);
if (!todo.length) {
  console.log(`Không còn ảnh "gen = ${flag("all") ? "nào" : (opt("gen") ?? "local")}" nào thiếu. Dùng --only <id> --force để làm lại, hoặc --all để gồm cả nền, bìa.`);
  process.exit(0);
}

const model = opt("model") ?? "schnell";
const steps = opt("steps") ?? (model === "dev" ? "20" : "4");
const quantize = opt("quantize") ?? "4";
const TOOL = toolDir();

console.log(`Sẽ tạo ${todo.length} ảnh bằng model ${model} (${steps} bước, ${quantize}-bit):`);
for (const a of todo) console.log(`  ${a.id}  ${a.size}${a.transparent ? " · nền trong suốt" : ""}`);
if (flag("dry-run")) {
  console.log(`\nPrompt mẫu (${todo[0].id}):\n${promptOf(todo[0])}`);
  console.log(`\n--dry-run: không chạy model. Tool: ${TOOL || "(chưa tìm thấy, dùng --tool-dir)"}`);
  process.exit(0);
}
if (!TOOL || !existsSync(TOOL)) {
  console.error(`Không thấy image-gen-kit${TOOL ? ` ở ${TOOL}` : ""}. Chỉ định bằng --tool-dir <thư mục> hoặc biến IMAGE_GEN_KIT.`);
  process.exit(1);
}

const seedOf = (id: string) => opt("seed") ?? String([...id].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 100000, 7));
let ok = 0;
for (const [i, a] of todo.entries()) {
  const [w, h] = a.size.split("x");
  const out = resolve(SRC, `${a.id}.png`);
  console.log(`\n━━━ ${i + 1}/${todo.length}  ${a.id} ━━━`);
  const r = spawnSync("uv", ["run", "--project", TOOL, "image-gen-kit", "generate", promptOf(a), "--model", model, "--out", out, "--width", w, "--height", h, "--steps", steps, "--seed", seedOf(a.id), "--quantize", quantize], { stdio: "inherit" });
  if (r.status === 0 && existsSync(out)) ok++;
  else console.log(`(Lỗi khi tạo ${a.id}, bỏ qua.)`);
}
console.log(`\nXong ${ok}/${todo.length} ảnh. Đang chuyển sang WebP…`);
if (ok) finalize();
