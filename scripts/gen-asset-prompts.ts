// In danh sách prompt ảnh/âm thanh ra docs/ASSET_PROMPTS.md. Chạy: npm run prompts
import { writeFileSync } from "node:fs";
import { AUDIO, IMAGES, MOCHI, STYLE, STYLE_TEEN, TAPDOC_AUDIO, VOICE_SETTINGS, XIXI, hasFile } from "@/content/assets";

const lines: string[] = [];
const done = (f: string) => (hasFile(f) ? "✅" : "⬜");
lines.push("# Danh sách ảnh và âm thanh cần tạo", "");
lines.push("File này sinh tự động từ `src/content/assets.ts` bằng `npm run prompts`. ✅ là đã có file, ⬜ là còn thiếu.", "");
lines.push("## Cách làm", "");
lines.push("1. **Ảnh (ChatGPT):** dán prompt, chọn đúng kích thước. Ảnh nhân vật, huy hiệu, avatar cần **nền trong suốt** (nói rõ \"transparent background\", xuất PNG).");
lines.push("2. Đặt file vào `public/assets/img/` với **đúng tên** (đuôi .webp, .png hoặc .jpg đều được; .webp nhẹ nhất, đổi bằng squoosh.app).");
lines.push("3. **Âm thanh (ElevenLabs):** hiệu ứng dùng *Sound Effects*, lời đọc dùng *Text to Speech*. Lưu `.mp3` đúng tên vào `public/assets/sfx/` hoặc `public/assets/voice/`.");
lines.push("4. Chạy `npm run dev` (hoặc deploy lại) là app tự dùng file mới; file nào chưa có thì app hiện hình thay thế.", "");
lines.push("**Giữ nhân vật đồng nhất:** tạo `mochi-happy` trước, sau đó đính kèm ảnh đó vào ChatGPT khi tạo các ảnh khác có Mochi và nói \"same character as the attached image\".", "");
lines.push("### Phong cách chung (đã gắn sẵn vào cuối mỗi prompt)", "", "> " + STYLE, "", "### Phong cách lớp lớn (lớp 8, 9 trở lên): anime trưởng thành, chất công nghệ", "", "> " + STYLE_TEEN, "");
lines.push("### Nhân vật", "", `- ${MOCHI}`, `- ${XIXI}`, "");

lines.push(`## Ảnh (${IMAGES.length})`, "");
for (const i of IMAGES) {
  lines.push(`### ${done(i.file)} \`${i.file.split("/").pop()}\``);
  lines.push(`- Dùng ở: ${i.usage}`);
  lines.push(`- Kích thước: ${i.size}${i.transparent ? " · nền trong suốt" : ""}`);
  lines.push("", "```text", i.prompt, "```", "");
}

lines.push(`## Âm thanh (${AUDIO.length})`, "", `Cài đặt giọng đọc gợi ý: ${VOICE_SETTINGS}`, "");
lines.push("| | File | Loại | Dùng ở | Prompt / lời đọc |", "|---|---|---|---|---|");
for (const a of AUDIO) {
  lines.push(`| ${done(a.file)} | \`${a.file.replace("/assets/", "")}\` | ${a.kind === "voice" ? "Giọng đọc" : a.kind === "music" ? "Nhạc" : "Hiệu ứng"} | ${a.usage} | ${a.prompt.replace(/\|/g, "/")} |`);
}
lines.push("");
writeFileSync("docs/ASSET_PROMPTS.md", lines.join("\n"));
console.log(`docs/ASSET_PROMPTS.md: ${IMAGES.length} ảnh, ${AUDIO.length} âm thanh`);

// Giọng đọc mẫu môn Tập đọc: rất nhiều file nhỏ, in riêng
const tv: string[] = [];
const missing = TAPDOC_AUDIO.filter((a) => !hasFile(a.file)).length;
tv.push("# Giọng đọc mẫu môn Tập đọc", "");
tv.push(`Sinh tự động bằng \`npm run prompts\`. ${TAPDOC_AUDIO.length} file, còn thiếu ${missing}. Chưa có file thì app dùng giọng tiếng Việt có sẵn của máy (iPad: giọng Linh).`, "");
tv.push("## Cách làm", "");
tv.push("- ElevenLabs Text to Speech, model **Multilingual v2** (hoặc v3), **một giọng nữ miền Bắc** trong trẻo, chậm rãi, giống cô giáo lớp 1. Dùng **cùng một giọng** cho mọi file.");
tv.push("- Stability khoảng 60%, Style 0, Speed 0.85. Mỗi dòng là một file riêng, lưu `.mp3` đúng tên vào `public/assets/voice/`.");
tv.push("- Âm và vần đứng một mình (\"bờ\", \"an\", \"oăng\") máy hay đọc sai: nghe lại từng file, sai thì thử thêm dấu chấm sau chữ (\"bờ.\") hoặc đọc lại vài lần chọn bản đúng.");
tv.push("- Tên file theo kiểu gõ Telex: `bàn` → `tv-banf.mp3`, `cái bàn` → `tv-cais_banf.mp3`.");
tv.push("- Ưu tiên tạo trước: nhóm *Âm đầu*, *Tên dấu*, *Âm, vần*, *Từ khóa*; câu dài để sau.", "");
let group = "";
for (const a of TAPDOC_AUDIO) {
  if (a.usage !== group) {
    group = a.usage;
    tv.push("", `### ${group}`, "", "| | File | Lời đọc |", "|---|---|---|");
  }
  tv.push(`| ${done(a.file)} | \`${a.id}.mp3\` | ${a.prompt.replace(/\n/g, " / ").replace(/\|/g, "/")} |`);
}
tv.push("");
writeFileSync("docs/TAPDOC_VOICES.md", tv.join("\n"));
writeFileSync("docs/tapdoc-voices.json", JSON.stringify(TAPDOC_AUDIO.map((a) => ({ id: a.id, file: a.file, text: a.prompt, group: a.usage })), null, 1) + "\n");
console.log(`docs/TAPDOC_VOICES.md: ${TAPDOC_AUDIO.length} giọng đọc Tập đọc`);
// danh sách ảnh cần nền trong suốt, để convert-assets tự xóa nền khi ảnh tải về còn nền (Gemini…)
writeFileSync("scripts/transparent-ids.json", JSON.stringify(IMAGES.filter((i) => i.transparent).map((i) => i.id), null, 1) + "\n");
