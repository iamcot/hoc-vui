import type { Question, Subject } from "@/content/types";
import { allLessons } from "@/content/subjects";
import { makeRng } from "./rng";

/** Đề luyện tập cho một bài */
export function practiceSet(subject: Subject, lessonId: string, seed: string, count = 8): Question[] {
  const lesson = allLessons(subject).find((l) => l.id === lessonId);
  if (!lesson) return [];
  const rng = makeRng(`${subject.id}:${lessonId}:${seed}`);
  return dedupe(Array.from({ length: count * 2 }, () => rng.pick(lesson.practice)(rng))).slice(0, count);
}

/** Đề trộn nhiều bài (kiểm tra trình độ, thi đấu). Cùng seed thì cùng đề. */
export function mixedSet(subject: Subject, seed: string, count: number, lessonIds?: string[]): Question[] {
  const lessons = allLessons(subject).filter((l) => !lessonIds || lessonIds.includes(l.id));
  const rng = makeRng(`${subject.id}:mix:${seed}`);
  const out: Question[] = [];
  let i = 0;
  const order = rng.shuffle(lessons);
  while (out.length < count && i < count * 4) {
    const l = order[i % order.length];
    const q = rng.pick(l.practice)(rng);
    if (!out.some((o) => o.prompt === q.prompt)) out.push({ ...q, id: `${seed}-${out.length}` });
    i++;
  }
  return out;
}

function dedupe(qs: Question[]) {
  const seen = new Set<string>();
  return qs.filter((q) => (seen.has(q.prompt) ? false : (seen.add(q.prompt), true)));
}

export interface Level {
  id: string;
  name: string;
  emoji: string;
  min: number;
  note: string;
}
export const LEVELS: Level[] = [
  { id: "mam", name: "Hạt mầm", emoji: "🌱", min: 0, note: "Mới bắt đầu, học lại từ chặng 1 nhé." },
  { id: "choi", name: "Chồi non", emoji: "🌿", min: 40, note: "Đã nắm được phần cơ bản." },
  { id: "cay", name: "Cây xanh", emoji: "🌳", min: 65, note: "Bấm máy khá vững rồi đó." },
  { id: "hoa", name: "Cây nở hoa", emoji: "🌸", min: 85, note: "Rất giỏi, sẵn sàng thi đấu!" },
];
export const levelFor = (pct: number) => [...LEVELS].reverse().find((l) => pct >= l.min) ?? LEVELS[0];
