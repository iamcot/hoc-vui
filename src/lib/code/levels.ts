import type { Rng } from "@/lib/rng";
import { parseLevel, solve, type BlockKind, type Dir, type Level } from "./world";

/** công thức sinh màn ngẫu nhiên cho phần luyện tập của một bài */
export interface LevelGen {
  w: number;
  h: number;
  /** số sao cần nhặt */
  stars?: number;
  /** tỉ lệ ô tường (0..1) */
  walls?: number;
  /** độ dài lời giải ngắn nhất cho phép */
  min: number;
  max: number;
  /** số lần rẽ tối thiểu trong lời giải ngắn nhất */
  turns?: number;
  blocks: BlockKind[];
  hint?: string;
}

/**
 * Sinh một màn có kiểm tra giải được bằng tìm đường (BFS). Cùng rng thì cùng màn.
 * Thử tối đa 300 lần, không được thì trả về màn dự phòng đơn giản.
 */
export function genLevel(rng: Rng, g: LevelGen, id = "gen"): Level {
  for (let attempt = 0; attempt < 300; attempt++) {
    const cells: string[][] = Array.from({ length: g.h }, () => Array.from({ length: g.w }, () => (rng.next() < (g.walls ?? 0.25) ? "#" : ".")));
    const free = () => {
      for (let k = 0; k < 50; k++) {
        const x = rng.int(0, g.w - 1);
        const y = rng.int(0, g.h - 1);
        if (cells[y][x] === "." || cells[y][x] === "#") {
          return { x, y };
        }
      }
      return null;
    };
    const place = (c: string) => {
      const p = free();
      if (!p) return false;
      cells[p.y][p.x] = c;
      return true;
    };
    if (!place("S") || !place("G")) continue;
    let ok = true;
    for (let i = 0; i < (g.stars ?? 0); i++) ok = ok && place("*");
    if (!ok) continue;
    const level: Level = { id, map: cells.map((r) => r.join("")), dir: rng.int(0, 3) as Dir, blocks: g.blocks, hint: g.hint };
    const sol = solve(parseLevel(level));
    if (!sol || sol.length < g.min || sol.length > g.max) continue;
    if (sol.filter((o) => o !== "F").length < (g.turns ?? 0)) continue;
    // lời giải chỉ được dùng khối có trong màn (vd. bài chỉ có khối Đi thì không được cần rẽ)
    if (sol.some((o) => (o === "L" && !g.blocks.includes("left")) || (o === "R" && !g.blocks.includes("right")))) continue;
    return { ...level, optimal: sol.length };
  }
  return { id, map: ["S...G"], dir: 1, blocks: g.blocks, optimal: 4, hint: g.hint };
}
