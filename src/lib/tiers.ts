import { isDebug } from "./debug";
import type { Subject, Tier } from "@/content/types";
import { tierLessons } from "@/content/subjects";
import type { LessonState } from "./store";

export const DEFAULT_CHALLENGE = { count: 10, pass: 8 };
export const challengeOf = (t: Tier) => t.challenge ?? DEFAULT_CHALLENGE;

type LessonFn = (subjectId: string, lessonId: string) => LessonState;

/** Học xong trình độ: mọi bài có ít nhất 1 sao. */
export function tierDone(s: Subject, t: Tier, lesson: LessonFn) {
  const ls = tierLessons(t);
  return ls.length > 0 && ls.every((l) => lesson(s.id, l.id).stars > 0);
}

/**
 * Trình độ thứ i mở khi: là trình độ đầu, hoặc đã vượt thử thách lên nó,
 * hoặc trình độ trước đã mở và đã học xong.
 */
export function tierUnlocked(s: Subject, i: number, lesson: LessonFn, unlocks: Record<string, string[]>): boolean {
  if (i <= 0 || isDebug()) return true;
  if (unlocks[s.id]?.includes(s.tiers[i].id)) return true;
  return tierUnlocked(s, i - 1, lesson, unlocks) && tierDone(s, s.tiers[i - 1], lesson);
}

/** Trình độ mở mặc định: cao nhất đã mở mà có bài. */
export function currentTierIndex(s: Subject, lesson: LessonFn, unlocks: Record<string, string[]>) {
  let best = 0;
  s.tiers.forEach((t, i) => {
    if (t.units.length > 0 && tierUnlocked(s, i, lesson, unlocks)) best = i;
  });
  return best;
}

/**
 * Bài "học tiếp" của một môn: bài mở gần nhất (học xong rồi thì bài kế tiếp nếu đã mở);
 * chưa có bài nào được lưu thì lấy bài đầu tiên chưa có sao của trình độ hiện tại.
 */
export function continueLessonId(s: Subject, lesson: LessonFn, unlocks: Record<string, string[]>, last?: string) {
  const all = s.tiers.flatMap((t, ti) => tierLessons(t).map((l) => ({ l, ti })));
  const k = all.findIndex((x) => x.l.id === last);
  if (k >= 0 && tierUnlocked(s, all[k].ti, lesson, unlocks)) {
    const nx = all[k + 1];
    if (lesson(s.id, all[k].l.id).stars === 0 || !nx || !tierUnlocked(s, nx.ti, lesson, unlocks)) return all[k].l.id;
    return nx.l.id;
  }
  const cur = tierLessons(s.tiers[currentTierIndex(s, lesson, unlocks)]);
  return (cur.find((l) => lesson(s.id, l.id).stars === 0) ?? cur[cur.length - 1])?.id;
}
