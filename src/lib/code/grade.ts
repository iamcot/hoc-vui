import { countBlocks, parseProgram, type Stmt } from "./program";
import { runAll } from "./run";
import { parseLevel, solve, type Level, type World } from "./world";

/** nét do một chương trình vẽ ra trên sân (dùng để dựng hình mẫu cho màn bút vẽ) */
export function traceTrail(w: World, program: Stmt[]): Set<string> {
  const { state } = runAll({ ...w, target: new Set(["__never__"]) }, program);
  return new Set(state.trail);
}

/** các sân của màn: sân chính rồi tới các sân ẩn (cùng chương trình phải đúng ở mọi sân) */
export function worldsOf(l: Level): World[] {
  const maps = [{ map: l.map, dir: l.dir }, ...(l.alt ?? [])];
  return maps.map((m) => {
    const w = parseLevel({ ...l, ...m });
    if (l.draw) w.target = traceTrail(w, parseProgram(l.draw));
    return w;
  });
}

/** số khối tối ưu của màn: lấy từ dữ liệu, không có thì tự tìm đường ngắn nhất */
export function optimalOf(l: Level): number {
  if (l.optimal) return l.optimal;
  if (l.solution) return countBlocks(parseProgram(l.solution));
  const p = solve(parseLevel(l));
  if (!p) throw new Error(`${l.id}: không giải được`);
  return p.length;
}

/** sao theo số khối: bằng hoặc ít hơn tối ưu 3 sao, thừa 1-2 khối 2 sao, còn lại 1 sao */
export const starsFor = (blocks: number, optimal: number) => (blocks <= optimal ? 3 : blocks <= optimal + 2 ? 2 : 1);

/** Chấm theo kết quả, không so code: phải qua mọi sân của màn. */
export function grade(l: Level, program: Stmt[]): { win: boolean; stars: number; blocks: number; optimal: number } {
  const blocks = countBlocks(program);
  const optimal = optimalOf(l);
  const win = worldsOf(l).every((w) => runAll(w, program).outcome === "win");
  return { win, stars: win ? starsFor(blocks, optimal) : 0, blocks, optimal };
}

export const presetOf = (l: Level): Stmt[] => (l.preset ? parseProgram(l.preset) : []);
