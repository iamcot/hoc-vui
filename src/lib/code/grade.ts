import { countBlocks, parseProgram, type Key, type Stmt } from "./program";
import { runAll, type State } from "./run";
import { runListAll, type ListWorld } from "./list";
import { parseLevel, solve, type Level, type World } from "./world";

/** sân của một màn: sân lưới hoặc kho hàng */
export type AnyWorld = World | ListWorld;
export const isList = (w: AnyWorld): w is ListWorld => "kind" in w && w.kind === "list";

/** nét do một chương trình vẽ ra trên sân (dùng để dựng hình mẫu cho màn bút vẽ) */
export function traceTrail(w: World, program: Stmt[]): Set<string> {
  const { state } = runAll({ ...w, target: new Set(["__never__"]) }, program);
  return new Set(state.trail);
}

/** các sân của màn: sân chính rồi tới các sân ẩn (cùng chương trình phải đúng ở mọi sân) */
export function worldsOf(l: Level): AnyWorld[] {
  if (l.list) {
    const { arrs, goal, find, at } = l.list;
    return arrs.map((arr, k) => ({ kind: "list", arr, goal, find: find?.[k], at }));
  }
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

/** các phím bé đã lập trình (khối Khi bấm phím ở ngoài cùng; trùng phím thì lấy khối đầu) */
export function handlersOf(program: Stmt[]): Map<Key, Stmt[]> {
  const m = new Map<Key, Stmt[]>();
  for (const s of program) if (s.op === "key" && !m.has(s.key)) m.set(s.key, s.body);
  return m;
}

/**
 * Màn phím: tìm cách bấm ít lần nhất để thắng (tìm theo bề rộng trên trạng thái đứng ở đâu, nhìn đâu, đã nhặt sao nào).
 * Bấm phím mà đụng tường thì thua nên bỏ nhánh đó. Trả về dãy phím, không được thì null.
 */
export function solveKeys(w: World, program: Stmt[], pad: Key[], presses: number): Key[] | null {
  const hs = handlersOf(program);
  const keys = pad.filter((k) => hs.has(k));
  const id = (s: State) => `${s.x},${s.y},${s.dir},${[...s.got].sort().join(".")}`;
  const start = runAll(w, program);
  if (start.outcome === "win") return [];
  if (start.outcome !== "short" && start.outcome !== "stars") return null;
  let layer: { s: State; path: Key[] }[] = [{ s: start.state, path: [] }];
  const seen = new Set([id(start.state)]);
  for (let d = 0; d < presses && layer.length; d++) {
    const next: typeof layer = [];
    for (const { s, path } of layer) {
      for (const k of keys) {
        const r = runAll(w, program, { from: s, entry: hs.get(k) });
        if (r.outcome === "win") return [...path, k];
        if (r.outcome !== "short" && r.outcome !== "stars") continue;
        const key = id(r.state);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ s: r.state, path: [...path, k] });
      }
    }
    layer = next;
  }
  return null;
}

/** chạy hết một lần trên sân bất kỳ, lấy kết quả */
export const outcomeIn = (w: AnyWorld, program: Stmt[]) => (isList(w) ? runListAll(w, program).outcome : runAll(w, program).outcome);

/** Chấm theo kết quả, không so code: phải qua mọi sân của màn (màn phím: phải có cách bấm thắng trong số pin). */
export function grade(l: Level, program: Stmt[]): { win: boolean; stars: number; blocks: number; optimal: number } {
  const blocks = countBlocks(program);
  const optimal = optimalOf(l);
  const ws = worldsOf(l);
  const win = l.keys ? ws.every((w) => !isList(w) && !!solveKeys(w, program, l.keys!.pad, l.keys!.presses)) : ws.every((w) => outcomeIn(w, program) === "win");
  return { win, stars: win ? starsFor(blocks, optimal) : 0, blocks, optimal };
}

export const presetOf = (l: Level): Stmt[] => (l.preset ? parseProgram(l.preset) : []);
