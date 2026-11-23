// In danh sách prompt ảnh/âm thanh ra docs/ASSET_PROMPTS.md. Chạy: npm run prompts
import { writeFileSync } from "node:fs";
import { AUDIO, IMAGES, MOCHI, STYLE, VOICE_SETTINGS, XIXI, hasFile } from "@/content/assets";

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
lines.push("### Phong cách chung (đã gắn sẵn vào cuối mỗi prompt)", "", "> " + STYLE, "");
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
