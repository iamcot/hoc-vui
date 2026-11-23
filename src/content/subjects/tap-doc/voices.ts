/**
 * Mọi chữ/tiếng/câu cần giọng đọc mẫu của môn Tập đọc. Mỗi mục thành một file
 * public/assets/voice/tv-<telex>.mp3 (vd. "bàn" -> tv-banf.mp3). Chưa có file thì app
 * dùng giọng tiếng Việt có sẵn của máy.
 */
import { ONSET_SAY, TONE_SAY, addTone, spellRime, spellSyllable, voiceIdFor } from "@/lib/viet";
import { DOC_CAU, DOC_TRON, HOC_VAN, VO_LONG } from "./data";
import { SAY } from "./lessons";
import { FEEDBACK } from "@/components/reading/feedback";

export interface VoiceLine {
  id: string;
  text: string;
  group: string;
}

function collect(): VoiceLine[] {
  const out = new Map<string, VoiceLine>();
  const add = (text: string, group: string) => {
    const t = text.trim();
    if (!t) return;
    const id = voiceIdFor(t);
    if (!out.has(id)) out.set(id, { id, text: t, group });
  };
  // lời dẫn câu hỏi và lời khen của Mochi
  Object.values(SAY).forEach((x) => add(x, "Lời dẫn câu hỏi"));
  Object.values(FEEDBACK).forEach((x) => add(x, "Mochi khen, nhắc"));
  // âm đọc khi đánh vần
  Object.values(ONSET_SAY).forEach((x) => add(x, "Âm đầu (đánh vần)"));
  Object.values(TONE_SAY).forEach((x) => add(x, "Tên dấu (đánh vần)"));
  ["ngang", "huyen", "sac", "hoi", "nga", "nang"].forEach((t) => add(addTone("ba", t as never), "Sáu thanh"));
  for (const u of [...VO_LONG, ...HOC_VAN])
    for (const l of u.lessons) {
      for (const s of l.sounds) {
        add(s.say, `Âm, vần · ${l.title}`);
        if (s.kind === "van") spellRime(s.g).forEach((x) => add(x, "Mảnh vần (đánh vần)"));
        spellSyllable(s.key).forEach((x) => add(x, `Đánh vần · ${l.title}`));
        s.words.forEach((w) => add(w, `Tiếng · ${l.title}`));
        if (s.phrase) add(s.phrase, `Từ khóa · ${l.title}`);
      }
      if (l.sentence) add(l.sentence, `Câu ứng dụng · ${l.title}`);
      add(l.intro, "Lời Mochi mở bài");
    }
  for (const u of [...DOC_CAU, ...DOC_TRON])
    for (const l of u.lessons) {
      add(l.intro, "Lời Mochi mở bài");
      l.quiz.forEach(([q]) => add(q, `Câu hỏi đọc hiểu · ${l.title}`));
      l.lines.forEach((x) => add(x, `Bài đọc · ${l.title}`));
      if (l.lines.length > 2) add(l.lines.join(l.id.startsWith("td-tho") ? "\n" : " "), `Cả bài · ${l.title}`);
      if (l.id.startsWith("td-tho")) add(l.lines.join(" "), `Cả bài · ${l.title}`);
    }
  return [...out.values()];
}

export const TAPDOC_VOICES = collect();
