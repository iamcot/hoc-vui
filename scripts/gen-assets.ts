// Tự tạo ảnh (OpenAI Images API) và âm thanh (ElevenLabs API) còn thiếu theo src/content/assets.ts.
//
//   npm run gen-assets -- --dry-run            xem sẽ tạo gì, ước tính chi phí, không gọi API
//   npm run gen-assets                         tạo tất cả file còn thiếu
//   npm run gen-assets -- --images             chỉ ảnh   (--audio: chỉ âm thanh)
//   npm run gen-assets -- --only fx-l04-cover,vo-l02-s1    chỉ các mục này (có thể dùng *, vd "fx-l05-*")
//   npm run gen-assets -- --only mochi-oops --force        tạo lại dù đã có file
//   npm run gen-assets -- --limit 3            chỉ tạo 3 mục đầu (để thử)
//   npm run gen-assets -- --quality high       chất lượng ảnh low | medium | high (mặc định medium)
//   npm run gen-assets -- --no-ref             không gửi ảnh tham chiếu
//
// Key đặt trong .env.local (không đưa lên git):
//   OPENAI_API_KEY=sk-...
//   ELEVENLABS_API_KEY=...
//   ELEVENLABS_VOICE_ID=...        giọng đọc tiếng Việt chọn trong Voice Library
//   ELEVENLABS_MODEL=eleven_multilingual_v2  (mặc định, đọc được tiếng Việt; hoặc eleven_v3, eleven_flash_v2_5)
//   OPENAI_IMAGE_MODEL=gpt-image-1 (tùy chọn)
//
// File tạo ra nằm ở assets-src/<id>.png | .mp3, sau đó script tự chạy convert-assets (PNG → WebP vào
// public/assets/...), scan-assets và in lại docs/ASSET_PROMPTS.md.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, extname, join } from "node:path";
import { AUDIO, IMAGES, type AudioAsset, type ImageAsset } from "@/content/assets";
import { REF_INTRO, SRC, cli, loadEnv, mochiFirst, pick, refsFor as refsOf } from "./asset-lib";

loadEnv(".env.local", ".env");
const { flag, opt, only: ONLY } = cli();
const DRY = flag("dry-run");
const FORCE = flag("force");
const NO_REF = flag("no-ref");
const QUALITY = (opt("quality") ?? "medium") as "low" | "medium" | "high";
const LIMIT = opt("limit") ? Number(opt("limit")) : Infinity;
const CONCURRENCY = Number(opt("concurrency") ?? 3);
const wantImages = !flag("audio") || flag("images");
const wantAudio = !flag("images") || flag("audio");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
const EL_KEY = process.env.ELEVENLABS_API_KEY;
const EL_BASE = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io/v1";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const VOICE_MODEL = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";

let images = wantImages ? pick(IMAGES, ONLY, FORCE).sort(mochiFirst) : [];
let audio = wantAudio ? pick(AUDIO, ONLY, FORCE) : [];
if (Number.isFinite(LIMIT)) {
  images = images.slice(0, LIMIT);
  audio = audio.slice(0, Math.max(0, LIMIT - images.length));
}
const refsFor = (a: ImageAsset) => refsOf(a, NO_REF);

// ---------- ước tính chi phí (giá công bố của gpt-image-1, chỉ để tham khảo) ----------
const PRICE: Record<string, [number, number]> = { low: [0.011, 0.016], medium: [0.042, 0.063], high: [0.167, 0.25] };
const imgCost = (a: ImageAsset) => PRICE[QUALITY][a.size === "1024x1024" ? 0 : 1] + refsFor(a).length * 0.01;

// ---------- gọi API ----------
const mime = (f: string) => ({ ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" })[extname(f).toLowerCase()] ?? "image/png";

async function check(res: Response, what: string) {
  if (res.ok) return res;
  const body = await res.text().catch(() => "");
  throw new Error(`${what}: HTTP ${res.status} ${body.slice(0, 400)}`);
}

async function genImage(a: ImageAsset) {
  const refs = refsFor(a);
  const prompt = refs.length
    ? REF_INTRO + a.prompt
    : a.prompt;
  const common = { model: IMAGE_MODEL, prompt, size: a.size, quality: QUALITY, n: "1", background: a.transparent ? "transparent" : "opaque", output_format: "png" };
  let res: Response;
  if (refs.length) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(common)) fd.append(k, v);
    fd.append("input_fidelity", "high");
    for (const r of refs) fd.append("image[]", new Blob([readFileSync(r)], { type: mime(r) }), basename(r));
    res = await fetch(`${OPENAI_BASE}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${OPENAI_KEY}` }, body: fd });
  } else {
    res = await fetch(`${OPENAI_BASE}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...common, n: 1 }),
    });
  }
  await check(res, a.id);
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${a.id}: API không trả ảnh`);
  writeFileSync(join(SRC, `${a.id}.png`), Buffer.from(b64, "base64"));
  return refs.length ? `tham chiếu: ${refs.map((r) => basename(r)).join(", ")}` : "";
}

/** "0.6 seconds" → 0.6, giới hạn theo ElevenLabs */
const seconds = (p: string) => {
  const m = p.match(/([\d.]+)\s*seconds?/i);
  return m ? Number(m[1]) : undefined;
};

async function genAudio(a: AudioAsset) {
  const headers = { "xi-api-key": EL_KEY!, "Content-Type": "application/json" };
  let res: Response;
  if (a.kind === "voice") {
    res = await fetch(`${EL_BASE}/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        text: a.prompt,
        model_id: VOICE_MODEL,
        language_code: VOICE_MODEL.includes("multilingual_v2") ? undefined : "vi",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.1, speed: 0.92 },
      }),
    });
  } else if (a.kind === "music") {
    const s = seconds(a.prompt) ?? 60;
    res = await fetch(`${EL_BASE}/music?output_format=mp3_44100_128`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt: a.prompt, music_length_ms: Math.round(s * 1000), force_instrumental: true }),
    });
  } else {
    const s = seconds(a.prompt);
    res = await fetch(`${EL_BASE}/sound-generation?output_format=mp3_44100_128`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text: a.prompt, duration_seconds: s ? Math.min(30, Math.max(0.5, s)) : undefined, prompt_influence: 0.5 }),
    });
  }
  await check(res, a.id);
  writeFileSync(join(SRC, `${a.id}.mp3`), Buffer.from(await res.arrayBuffer()));
  return "";
}

async function pool<T>(items: T[], n: number, fn: (t: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(n, queue.length) }, async () => { while (queue.length) await fn(queue.shift()!); }));
}

// ---------- chạy ----------
const total = images.reduce((s, a) => s + imgCost(a), 0);
const chars = audio.reduce((s, a) => s + a.prompt.length, 0);
console.log(`Ảnh: ${images.length} (model ${IMAGE_MODEL}, chất lượng ${QUALITY}, ước tính ~$${total.toFixed(2)})`);
for (const a of images) console.log(`  ⬜ ${a.id}.png  ${a.size}${a.transparent ? " trong suốt" : ""}${refsFor(a).length ? "  ← " + refsFor(a).map((r) => basename(r)).join(", ") : ""}`);
console.log(`Âm thanh: ${audio.length} (ElevenLabs, giọng đọc dùng model ${VOICE_MODEL}, khoảng ${chars} ký tự lời đọc/prompt)`);
for (const a of audio) console.log(`  ⬜ ${a.id}.mp3  ${a.kind}`);

if (DRY) {
  console.log("\n--dry-run: không gọi API. Bỏ --dry-run để tạo thật.");
  process.exit(0);
}
if (!images.length && !audio.length) {
  console.log("Không còn gì để tạo. Dùng --only <id> --force để tạo lại một file.");
  process.exit(0);
}
const missing = [
  images.length && !OPENAI_KEY && "OPENAI_API_KEY",
  audio.length && !EL_KEY && "ELEVENLABS_API_KEY",
  audio.some((a) => a.kind === "voice") && !VOICE_ID && "ELEVENLABS_VOICE_ID",
].filter(Boolean);
if (missing.length) {
  console.error(`\nThiếu ${missing.join(", ")} trong .env.local. Xem hướng dẫn ở đầu file scripts/gen-assets.ts.`);
  process.exit(1);
}

async function main() {
  mkdirSync(SRC, { recursive: true });
  const failed: string[] = [];
  let done = 0;
  const run = async (id: string, fn: () => Promise<string>) => {
    const t = Date.now();
    try {
      const note = await fn();
      console.log(`✅ ${id}  ${((Date.now() - t) / 1000).toFixed(0)}s ${note}`);
      done++;
    } catch (e) {
      console.error(`❌ ${(e as Error).message}`);
      failed.push(id);
    }
  };

  // mochi-happy phải xong trước để làm tham chiếu cho ảnh khác
  if (images[0]?.id === "mochi-happy") await run("mochi-happy", () => genImage(images.shift()!));
  await Promise.all([
    pool(images, CONCURRENCY, (a) => run(a.id, () => genImage(a))),
    pool(audio, 2, (a) => run(a.id, () => genAudio(a))),
  ]);

  console.log(`\nXong ${done} file${failed.length ? `, lỗi ${failed.length}: ${failed.join(", ")}` : ""}.`);
  if (done) {
    console.log("Đang chuyển sang WebP và cập nhật danh sách...");
    execFileSync("node", ["scripts/convert-assets.mjs"], { stdio: "inherit" });
    execFileSync("node", ["scripts/scan-assets.mjs"], { stdio: "inherit" });
    execFileSync("npx", ["tsx", "scripts/gen-asset-prompts.ts"], { stdio: "inherit" });
    console.log("Xem lại ảnh trong public/assets/img. Ảnh nào chưa ưng: npm run gen-assets -- --only <id> --force");
  }
  if (failed.length) process.exit(1);
}
main();
