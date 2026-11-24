import type { Subject } from "@/content/types";
import { tierLessons } from "@/content/subjects";
import type { LessonState } from "./store";

/**
 * Hạng thi đấu của từng môn, tính theo % số bài đã học xong của môn đó (bài có ít nhất 1 sao).
 * Mục đích: bé đi hết lộ trình mới lên hạng cao. Hạng không tụt.
 */
export const RANKS = [
  { id: "start", name: "Khởi đầu", from: 0 },
  { id: "mid", name: "Trung cấp", from: 0.3 },
  { id: "high", name: "Cao cấp", from: 0.7 },
] as const;
export type RankId = (typeof RANKS)[number]["id"];
export const FREE_ROOM = "free";

type LessonFn = (subjectId: string, lessonId: string) => LessonState;

export interface RankInfo {
  index: number;
  rank: (typeof RANKS)[number];
  done: number;
  total: number;
  /** hạng kế tiếp và số bài còn thiếu để lên (undefined nếu đã cao nhất) */
  next?: { name: string; left: number };
}

export function rankInfo(s: Subject, lesson: LessonFn, unlocks: Record<string, string[]>): RankInfo {
  const tiers = s.tiers.filter((t) => t.units.length > 0);
  // vượt cấp bằng thử thách: các trình độ trước trình độ đã mở khóa được tính là đã học
  const skipTo = Math.max(-1, ...tiers.map((t, i) => (unlocks[s.id]?.includes(t.id) ? i : -1)));
  let done = 0;
  let total = 0;
  tiers.forEach((t, i) => {
    const ls = tierLessons(t);
    total += ls.length;
    done += i < skipTo ? ls.length : ls.filter((l) => lesson(s.id, l.id).stars > 0).length;
  });
  const pct = total ? done / total : 0;
  let index = 0;
  RANKS.forEach((r, i) => {
    if (pct >= r.from) index = i;
  });
  const nx = RANKS[index + 1];
  return {
    index,
    rank: RANKS[index],
    done,
    total,
    next: nx ? { name: nx.name, left: Math.max(1, Math.ceil(nx.from * total) - done) } : undefined,
  };
}

/** bé chỉ vào được phòng đúng hạng của mình hoặc thấp hơn; phòng tự do ai cũng vào */
export function canJoin(roomRank: string | null | undefined, mine: number) {
  if (!roomRank || roomRank === FREE_ROOM) return true;
  const r = RANKS.findIndex((x) => x.id === roomRank);
  return r < 0 || r <= mine;
}
