import type { Subject } from "@/content/types";
import { tierLessons } from "@/content/subjects";
import type { LessonState } from "./store";

/**
 * Cấp thi đấu của từng môn, tính theo % số bài đã học xong của lộ trình môn đó (bài có ít nhất 1 sao):
 * Sơ cấp từ 0%, Trung cấp từ 30%, Cao cấp từ 70%. Bé đi hết lộ trình mới lên cấp cao. Cấp không tụt.
 */
export const RANKS = [
  { id: "start", name: "Sơ cấp", from: 0 },
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

export const rankName = (id: string | null | undefined) => (!id || id === FREE_ROOM ? "Tự do" : (RANKS.find((r) => r.id === id)?.name ?? "Tự do"));

/**
 * Bài dùng ra đề cho phòng theo cấp: đoạn lộ trình ứng với cấp đó
 * (Sơ cấp: 30% bài đầu, Trung cấp: 30% đến 70%, Cao cấp: 70% đến hết). Phòng tự do: undefined = cả môn.
 */
export function rankLessonIds(s: Subject, rankId: string | null | undefined): string[] | undefined {
  const k = RANKS.findIndex((r) => r.id === rankId);
  if (k < 0) return undefined;
  const all = s.tiers.flatMap((t) => tierLessons(t));
  const from = Math.floor(RANKS[k].from * all.length);
  const to = k + 1 < RANKS.length ? Math.floor(RANKS[k + 1].from * all.length) : all.length;
  const ids = all.slice(from, Math.max(to, from + 1)).map((l) => l.id);
  return ids.length ? ids : undefined;
}

/** bé chỉ vào được phòng đúng hạng của mình hoặc thấp hơn; phòng tự do ai cũng vào */
export function canJoin(roomRank: string | null | undefined, mine: number) {
  if (!roomRank || roomRank === FREE_ROOM) return true;
  const r = RANKS.findIndex((x) => x.id === roomRank);
  return r < 0 || r <= mine;
}
