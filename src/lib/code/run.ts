import type { Stmt } from "./program";
import { DX, DY, isOpen, turnLeft, turnRight, type Dir, type Pos, type World } from "./world";

/**
 * Trình chạy từng bước. Không dùng eval: chương trình là cây lệnh, chạy bằng generator,
 * mỗi lần `next()` là một lệnh, kèm id khối để sáng khối đang chạy.
 * Có giới hạn số bước để chặn vòng lặp quá dài.
 */

export interface State {
  x: number;
  y: number;
  dir: Dir;
  /** chỉ số các sao đã nhặt */
  got: number[];
}

export type StepKind = "move" | "turn" | "bump" | "star";

export interface Step {
  kind: StepKind;
  blockId?: string;
  state: State;
}

export type Outcome = "win" | "bump" | "short" | "stars" | "limit";

export const MAX_STEPS = 400;

export const initState = (w: World): State => {
  const s0 = w.stars.findIndex((s) => s.x === w.start.x && s.y === w.start.y);
  return { x: w.start.x, y: w.start.y, dir: w.dir, got: s0 >= 0 ? [s0] : [] };
};

const at = (p: Pos | null, s: State) => !!p && p.x === s.x && p.y === s.y;

export const isWin = (w: World, s: State) => s.got.length === w.stars.length && (!w.goal || at(w.goal, s));

/**
 * Chạy chương trình. Generator trả từng bước, kết thúc bằng kết quả:
 * win = tới đích (dừng ngay khi tới), bump = đụng tường, short = hết lệnh mà chưa tới,
 * stars = tới cờ nhưng thiếu sao, limit = quá nhiều bước.
 */
export function* run(w: World, program: Stmt[]): Generator<Step, Outcome> {
  let s = initState(w);
  let steps = 0;
  function* exec(list: Stmt[]): Generator<Step, Outcome | null> {
    for (const st of list) {
      if (st.op === "repeat") {
        for (let k = 0; k < st.n; k++) {
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
        yield { kind: "bump", blockId: st.id, state: s };
        return "bump";
      }
      s = { ...s, x: nx, y: ny };
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
  limit: "Chương trình chạy lâu quá, Mochi mỏi chân rồi. Bớt lặp lại nhé!",
};
