import { countBlocks, parseProgram, type Stmt } from "./program";
import { runAll } from "./run";
import { parseLevel, solve, type Level } from "./world";

/** số khối tối ưu của màn: lấy từ dữ liệu, không có thì tự tìm đường ngắn nhất */
export function optimalOf(l: Level): number {
  if (l.optimal) return l.optimal;
  const p = solve(parseLevel(l));
  if (!p) throw new Error(`${l.id}: không giải được`);
  return p.length;
}

/**
 * Chấm theo kết quả, không so code. Qua màn: 1 sao.
 * Bằng hoặc ít hơn số khối tối ưu: 3 sao; thừa 1-2 khối: 2 sao.
 */
export function grade(l: Level, program: Stmt[]): { win: boolean; stars: number; blocks: number; optimal: number } {
  const blocks = countBlocks(program);
  const optimal = optimalOf(l);
  const { outcome } = runAll(parseLevel(l), program);
  if (outcome !== "win") return { win: false, stars: 0, blocks, optimal };
  const stars = blocks <= optimal ? 3 : blocks <= optimal + 2 ? 2 : 1;
  return { win: true, stars, blocks, optimal };
}

export const presetOf = (l: Level): Stmt[] => (l.preset ? parseProgram(l.preset) : []);
