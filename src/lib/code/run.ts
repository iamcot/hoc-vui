import type { Cond, Stmt } from "./program";
import { DX, DY, edgeKey, isOpen, turnLeft, turnRight, type Dir, type Pos, type World } from "./world";

/**
 * Trình chạy từng bước. Không dùng eval: chương trình là cây lệnh, chạy bằng generator,
 * mỗi lần `next()` là một lệnh, kèm id khối để sáng khối đang chạy.
 * Có giới hạn số bước (tính cả mỗi vòng lặp) để chặn vòng lặp vô tận.
 */

export interface State {
  x: number;
  y: number;
  dir: Dir;
  /** chỉ số các sao đã nhặt */
  got: number[];
  /** màn bút vẽ: các nét đã vẽ (khóa cạnh), theo thứ tự */
  trail: string[];
}

export type StepKind = "move" | "turn" | "bump" | "star";

export interface Step {
  kind: StepKind;
  blockId?: string;
  state: State;
}

export type Outcome = "win" | "bump" | "short" | "stars" | "limit" | "shape";

export const MAX_STEPS = 400;

export const initState = (w: World): State => {
  const s0 = w.stars.findIndex((s) => s.x === w.start.x && s.y === w.start.y);
  return { x: w.start.x, y: w.start.y, dir: w.dir, got: s0 >= 0 ? [s0] : [], trail: [] };
};

const at = (p: Pos | null, s: State) => !!p && p.x === s.x && p.y === s.y;

const sameShape = (target: Set<string>, trail: string[]) => {
  const t = new Set(trail);
  return t.size === target.size && [...t].every((k) => target.has(k));
};

export const isWin = (w: World, s: State) => {
  if (w.target) return sameShape(w.target, s.trail);
  return s.got.length === w.stars.length && (!w.goal || at(w.goal, s));
};

export function check(w: World, s: State, c: Cond): boolean {
  if (c === "G") return isWin(w, s);
  const d = c === "W" ? s.dir : c === "A" ? turnLeft(s.dir) : turnRight(s.dir);
  const open = isOpen(w, s.x + DX[d], s.y + DY[d]);
  return c === "W" ? !open : open;
}

/**
 * Chạy chương trình. Generator trả từng bước, kết thúc bằng kết quả:
 * win = tới đích / vẽ đúng hình (dừng ngay khi đạt), bump = đụng tường, short = hết lệnh mà chưa tới,
 * stars = tới cờ nhưng thiếu sao, shape = vẽ xong mà chưa giống mẫu, limit = quá nhiều bước.
 */
export function* run(w: World, program: Stmt[]): Generator<Step, Outcome> {
  let s = initState(w);
  let steps = 0;
  function* exec(list: Stmt[]): Generator<Step, Outcome | null> {
    for (const st of list) {
      if (st.op === "repeat" || st.op === "until") {
        for (let k = 0; st.op === "repeat" ? k < st.n : !check(w, s, st.cond); k++) {
          // mỗi vòng tính một bước, để vòng lặp rỗng / không bao giờ tới cũng bị chặn
          if (++steps > MAX_STEPS) return "limit";
          const r = yield* exec(st.body);
          if (r) return r;
        }
        continue;
      }
      if (st.op === "if") {
        if (check(w, s, st.cond)) {
          const r = yield* exec(st.body);
          if (r) return r;
        }
        continue;
      }
      if (++steps > MAX_STEPS) return "limit";
      if (st.op === "left" || st.op === "right") {
        s = { ...s, dir: st.op === "left" ? turnLeft(s.dir) : turnRight(s.dir) };
        yield { kind: "turn", blockId: st.id, state: s };
        continue;
      }
      const nx = s.x + DX[s.dir];
      const ny = s.y + DY[s.dir];
      if (!isOpen(w, nx, ny)) {
        yield { kind: "bump", blockId: st.id, state: { ...s } };
        return "bump";
      }
      const trail = w.target ? [...s.trail, edgeKey(s.x, s.y, nx, ny)] : s.trail;
      s = { ...s, x: nx, y: ny, trail };
      const si = w.stars.findIndex((p, i) => p.x === nx && p.y === ny && !s.got.includes(i));
      if (si >= 0) {
        s = { ...s, got: [...s.got, si] };
        yield { kind: "star", blockId: st.id, state: s };
      } else yield { kind: "move", blockId: st.id, state: s };
      if (isWin(w, s)) return "win";
    }
    return null;
  }
  if (isWin(w, s)) return "win";
  const r = yield* exec(program);
  if (r) return r;
  if (w.target) return "shape";
  return w.goal && at(w.goal, s) ? "stars" : "short";
}

/** chạy hết một lần, lấy kết quả và trạng thái cuối (dùng cho chấm bài, câu hỏi, kiểm thử) */
export function runAll(w: World, program: Stmt[]): { outcome: Outcome; state: State; steps: number } {
  const g = run(w, program);
  let state = initState(w);
  let steps = 0;
  for (;;) {
    const r = g.next();
    if (r.done) return { outcome: r.value, state, steps };
    state = r.value.state;
    steps++;
  }
}

/** lời Mochi nói khi chưa qua màn */
export const OUTCOME_TEXT: Record<Exclude<Outcome, "win">, string> = {
  bump: "Ối! Mochi đụng tường (hoặc ra mép sân) rồi. Xem lại khối đang sáng nhé.",
  short: "Hết lệnh rồi mà Mochi chưa tới cờ. Thêm khối nữa nhé!",
  stars: "Tới cờ rồi nhưng còn sót ngôi sao. Nhặt hết sao trước nhé!",
  limit: "Chương trình chạy lâu quá, Mochi mỏi chân rồi. Xem lại vòng lặp nhé!",
  shape: "Hình vẽ chưa giống hình mẫu (nét mờ). So từng cạnh xem thiếu hay thừa chỗ nào nhé!",
};
