// Cân bằng độ to của âm thanh (cần ffmpeg trên máy):
//   node scripts/normalize-audio.mjs            # chỉnh file lệch mục tiêu quá 1.5 dB
//   node scripts/normalize-audio.mjs --check    # chỉ đo, in bảng, không sửa
//
// Đo bằng chuẩn EBU R128 (LUFS, độ to tai người nghe thấy), không phải biên độ sóng:
// - nhạc nền, giọng đọc: độ to trung bình cả bài (I)
// - hiệu ứng ngắn (dưới 3 giây): độ to lớn nhất trong cửa sổ 0,4 giây (M max), vì tiếng "tách" rất ngắn
// rồi tăng/giảm cho đúng mục tiêu, có limiter giữ đỉnh dưới -1 dBTP để không rè.
// Mục tiêu: giọng đọc làm chuẩn, chúc mừng nhỏ hơn giọng một chút, tiếng gõ/chạm nhỏ nhất nhưng vẫn nghe rõ.
// Âm lượng phát trong app (lib/sound.ts) đặt trên các mức này.
import { execFileSync } from "node:child_process";
import { readdirSync, renameSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const CHECK = process.argv.includes("--check");
const TOL = 1.5;

/** mục tiêu LUFS theo tên file */
function target(name) {
  if (name.startsWith("bgm-")) return { lufs: -17, by: "I" };
  if (/^(tv|vo)-|^vo\d/.test(name)) return { lufs: -16, by: "I" };
  if (/^(levelup|complete)\b/.test(name)) return { lufs: -20, by: "M" };
  if (/^(gp-go|gp-wave)\b/.test(name)) return { lufs: -21, by: "M" };
  if (/^(correct|wrong|gp-hit|gp-miss|gp-bite|lt-bump|lt-run)\b/.test(name)) return { lufs: -21, by: "M" };
  if (/^gp-key\b/.test(name)) return { lufs: -27, by: "M" };
  // tiếng chạm, tích tắc, vút, bước đi...: nhỏ nhưng nghe được
  return { lufs: -25, by: "M" };
}

function measureText(file) {
  const r = execFileSync("sh", ["-c", `ffmpeg -hide_banner -nostats -i "${file}" -af ebur128=peak=true -f null - 2>&1`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const M = [...r.matchAll(/ M:\s*(-?[\d.]+)/g)].map((m) => Number(m[1]));
  const I = [...r.matchAll(/I:\s*(-?[\d.]+) LUFS/g)].map((m) => Number(m[1]));
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }));
  return { I: I.at(-1) ?? -70, M: M.length ? Math.max(...M) : -70, dur };
}

let fixed = 0;
for (const dir of process.argv.includes("--sfx") ? ["public/assets/sfx"] : ["public/assets/sfx", "public/assets/voice"]) {
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".mp3")).sort()) {
    const file = join(dir, name);
    const t = target(name);
    let m;
    try {
      m = measureText(file);
    } catch {
      console.warn(`Bỏ qua ${name}: ffmpeg không đọc được file (hỏng hoặc rỗng)`);
      continue;
    }
    const by = t.by === "I" && m.dur >= 3 ? "I" : "M";
    const now = by === "I" ? m.I : m.M;
    if (now <= -69) continue; // im lặng
    const gain = +(t.lufs - now).toFixed(1);
    const off = Math.abs(gain) > TOL;
    if (CHECK || off) console.log(`${name.padEnd(48)} ${by}=${now.toFixed(1)} → ${t.lufs}  ${off ? `${gain > 0 ? "+" : ""}${gain} dB` : "ok"}`);
    if (CHECK || !off) continue;
    const tmp = file.replace(/\.mp3$/, ".norm.mp3");
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", file, "-af", `volume=${gain}dB,alimiter=limit=0.89:level=false`, "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100", tmp]);
    unlinkSync(file);
    renameSync(tmp, file);
    fixed++;
  }
}
if (!CHECK) console.log(`Đã cân bằng ${fixed} file.`);
