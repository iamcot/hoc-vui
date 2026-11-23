// Trợ lý tạo ảnh bằng tài khoản ChatGPT của bạn (không cần API, không tốn thêm tiền).
//
//   npm run asset-helper                      lần lượt các ảnh còn thiếu
//   npm run asset-helper -- --only fx-l05-*   chỉ các ảnh này (thêm --force để làm lại ảnh đã có)
//   npm run asset-helper -- --downloads D:\Tai-ve    thư mục trình duyệt lưu file (mặc định ~/Downloads)
//
// Mỗi ảnh: tool chép sẵn prompt vào clipboard và mở thư mục ảnh tham chiếu. Bạn chỉ cần
// kéo ảnh tham chiếu vào ChatGPT, dán (Ctrl/Cmd+V), gửi, rồi bấm tải ảnh về.
// Tool thấy file mới trong Downloads sẽ tự đổi đúng tên, chuyển vào assets-src/ và sang ảnh kế tiếp.
// Phím tắt trong lúc chờ:  c = chép lại prompt · s = bỏ qua · b = quay lại ảnh trước · q = thoát
// Khi thoát, tool tự chuyển ảnh sang WebP và cập nhật docs/ASSET_PROMPTS.md.
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, unlinkSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { homedir, platform } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { emitKeypressEvents } from "node:readline";
import { IMAGES, type ImageAsset } from "@/content/assets";
import { REF_INTRO, SRC, cli, mochiFirst, pick, refsFor, finalize } from "./asset-lib";

const { flag, opt, only } = cli();
const DOWNLOADS = resolve(opt("downloads") ?? process.env.ASSET_DOWNLOADS ?? join(homedir(), "Downloads"));
const REF_DIR = resolve(SRC, "_tham-chieu");
const IMG_EXT = /\.(png|webp|jpe?g)$/i;
const OS = platform();

const list = pick(IMAGES, only, flag("force")).sort(mochiFirst);
if (!list.length) {
  console.log("Không còn ảnh nào thiếu. Dùng --only <id> --force để làm lại một ảnh.");
  process.exit(0);
}
if (!existsSync(DOWNLOADS)) {
  console.error(`Không thấy thư mục ${DOWNLOADS}. Chỉ định bằng --downloads <đường dẫn>.`);
  process.exit(1);
}

// ---------- tiện ích hệ điều hành ----------
function copy(text: string) {
  const tries: [string, string[]][] =
    OS === "darwin" ? [["pbcopy", []]]
    : OS === "win32" ? [["powershell", ["-NoProfile", "-Command", "$input | Set-Clipboard"]], ["clip", []]]
    : [["wl-copy", []], ["xclip", ["-selection", "clipboard"]], ["xsel", ["--clipboard", "--input"]]];
  for (const [cmd, a] of tries) {
    const r = spawnSync(cmd, a, { input: text });
    if (r.status === 0) return true;
  }
  return false;
}
function open(target: string) {
  const [cmd, a] = OS === "darwin" ? ["open", [target]] : OS === "win32" ? ["cmd", ["/c", "start", "", target]] : ["xdg-open", [target]];
  const p = spawn(cmd, a as string[], { detached: true, stdio: "ignore" });
  p.on("error", () => console.log(`(Không tự mở được ${target}, hãy mở bằng tay.)`));
  p.unref();
}

const ratio = (s: ImageAsset["size"]) =>
  s === "1024x1024" ? "Square image, 1:1." : s === "1536x1024" ? "Wide landscape image, 3:2." : "Tall portrait image, 2:3.";

function promptFor(a: ImageAsset, refs: string[]) {
  return `${refs.length ? REF_INTRO : ""}${a.prompt} ${ratio(a.size)}${a.transparent ? " Export as PNG with a transparent background." : ""}`;
}

/** đặt ảnh tham chiếu vào một thư mục riêng, đánh số để dễ kéo vào ChatGPT */
function prepareRefs(refs: string[]) {
  rmSync(REF_DIR, { recursive: true, force: true });
  mkdirSync(REF_DIR, { recursive: true });
  refs.forEach((r, i) => copyFileSync(r, join(REF_DIR, `${i + 1}-${basename(r)}`)));
}

// ---------- theo dõi thư mục tải về ----------
const snapshot = () => new Map(readdirSync(DOWNLOADS).filter((f) => IMG_EXT.test(f)).map((f) => [f, statSync(join(DOWNLOADS, f)).mtimeMs]));
let seen = snapshot();

/** file ảnh mới (hoặc vừa ghi đè) đã tải xong: kích thước đứng yên ít nhất 1 giây */
const sizes = new Map<string, number>();
function newDownload(): string | undefined {
  const now = snapshot();
  for (const [f, m] of now) {
    if (seen.get(f) === m) continue;
    const p = join(DOWNLOADS, f);
    const size = statSync(p).size;
    if (size > 0 && sizes.get(f) === size) return p;
    sizes.set(f, size);
  }
}

// ---------- vòng chính ----------
mkdirSync(SRC, { recursive: true });
let i = 0;
let saved = 0;
let busy = false;

function show() {
  const a = list[i];
  const refs = refsFor(a);
  const text = promptFor(a, refs);
  console.log(`\n━━━ ${i + 1}/${list.length}  ${a.id}  (${a.size}${a.transparent ? ", nền trong suốt" : ""}) ━━━`);
  console.log(`Dùng ở: ${a.usage}`);
  if (refs.length) {
    prepareRefs(refs);
    console.log(`Kéo ${refs.length} ảnh tham chiếu trong thư mục vừa mở vào ChatGPT: ${refs.map((r) => basename(r)).join(", ")}`);
    if (i === 0 || refsFor(list[i - 1]).join() !== refs.join()) open(REF_DIR);
  } else console.log("Ảnh này không cần ảnh tham chiếu (nên mở cuộc trò chuyện mới).");
  console.log(copy(text) ? "📋 Đã chép prompt. Dán vào ChatGPT, gửi, rồi bấm tải ảnh về." : `Không chép được clipboard, prompt:\n\n${text}\n`);
  console.log(`Đang chờ file mới trong ${DOWNLOADS} ...   [c] chép lại  [s] bỏ qua  [b] quay lại  [q] thoát`);
}

function next(step = 1) {
  i += step;
  sizes.clear();
  seen = snapshot();
  if (i < 0) i = 0;
  if (i >= list.length) finish();
  else show();
}

function finish() {
  clearInterval(timer);
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  rmSync(REF_DIR, { recursive: true, force: true });
  console.log(`\nĐã lưu ${saved} ảnh.`);
  if (saved) {
    console.log("Đang chuyển sang WebP và cập nhật danh sách...");
    finalize();
  }
  process.exit(0);
}

const timer = setInterval(() => {
  if (busy) return;
  const f = newDownload();
  if (!f) return;
  busy = true;
  const a = list[i];
  const dest = join(SRC, `${a.id}${extname(f).toLowerCase()}`);
  for (const old of readdirSync(SRC)) if (basename(old, extname(old)) === a.id) unlinkSync(join(SRC, old));
  try {
    renameSync(f, dest);
  } catch {
    copyFileSync(f, dest); // khác ổ đĩa
    unlinkSync(f);
  }
  saved++;
  console.log(`✅ ${basename(f)} → ${dest}`);
  busy = false;
  next();
}, 700);

if (process.stdin.isTTY) {
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_s, key) => {
    if (!key) return;
    if (key.name === "q" || (key.ctrl && key.name === "c")) finish();
    else if (key.name === "s") next();
    else if (key.name === "b") next(-1);
    else if (key.name === "c") console.log(copy(promptFor(list[i], refsFor(list[i]))) ? "📋 Đã chép lại prompt." : "Không chép được.");
  });
}

console.log(`Còn ${list.length} ảnh cần tạo. Đang mở ChatGPT...`);
if (!flag("no-open")) open("https://chatgpt.com/");
show();
