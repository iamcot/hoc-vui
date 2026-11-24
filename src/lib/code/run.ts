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

export type StepKind = "move" | "turn" | "bump" | "star" | "calc" | "swap" | "mem";

export interface Step<S = State> {
  kind: StepKind;
  blockId?: string;
  state: S;
  /** giá trị biến n sau lệnh này */
  n: number;
}

/**
 * win = đạt mục tiêu, bump = đụng tường / hết hàng hộp, short = hết lệnh mà chưa tới, stars = tới cờ nhưng thiếu sao,
 * shape = vẽ xong mà chưa giống mẫu, limit = quá nhiều bước (hoặc hàm gọi lồng quá sâu),
 * nofn = gọi hàm chưa có, wrong = kho hàng: chạy xong mà chưa đúng mục tiêu.
 */
export type Outcome = "win" | "bump" | "short" | "stars" | "limit" | "shape" | "nofn" | "wrong";

export const MAX_STEPS = 400;
/** hàm gọi lồng nhau tối đa (đệ quy) */
export const MAX_DEPTH = 40;

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
  const d = c === "W" || c === "P" ? s.dir : c === "A" ? turnLeft(s.dir) : turnRight(s.dir);
  const open = isOpen(w, s.x + DX[d], s.y + DY[d]);
  return c === "W" ? !open : open;
}

/** "máy" chạy lệnh: sân lưới hoặc kho hàng. Bộ chạy chung lo lặp, nếu, biến, hàm. */
export interface Machine<S> {
  get(): S;
  /** làm một lệnh cơ bản (đi, rẽ, sang hộp…). Không làm được thì "bump" */
  act(op: Stmt["op"]): StepKind;
  check(c: Cond): boolean;
  /** đạt mục tiêu thì dừng ngay (sân lưới) */
  won(): boolean;
  /** kết quả khi chạy hết lệnh */
  end(): Outcome;
}

/**
 * Bộ chạy chung. Không dùng eval: chương trình là cây lệnh, chạy bằng generator, mỗi `next()` là một lệnh.
 * Khối Hàm và Khi bấm phím ở cấp ngoài cùng không tự chạy; `entry` là đoạn chạy (mặc định: phần còn lại).
 * Biến n dùng chung; gọi hàm "với n = k" thì trong hàm n là k, xong trả lại n cũ.
 */
export function* interp<S>(m: Machine<S>, program: Stmt[], entry?: Stmt[]): Generator<Step<S>, Outcome> {
  const defs = new Map<string, Stmt[]>();
  for (const st of program) if (st.op === "def" && !defs.has(st.name)) defs.set(st.name, st.body);
  const main = entry ?? program.filter((st) => st.op !== "def" && st.op !== "key");
  let n = 0;
  let steps = 0;
  let depth = 0;
  function* exec(list: Stmt[]): Generator<Step<S>, Outcome | null> {
    for (const st of list) {
      if (st.op === "def" || st.op === "key") continue;
      if (st.op === "repeat" || st.op === "until") {
        const times = st.op === "repeat" ? (st.n === "n" ? n : st.n) : 0;
        for (let k = 0; st.op === "repeat" ? k < times : !m.check(st.cond); k++) {
          // mỗi vòng tính một bước, để vòng lặp rỗng / không bao giờ tới cũng bị chặn
          if (++steps > MAX_STEPS) return "limit";
          const r = yield* exec(st.body);
          if (r) return r;
        }
        continue;
      }
      if (st.op === "if") {
        const branch = m.check(st.cond) ? st.body : st.else;
        if (branch) {
          const r = yield* exec(branch);
          if (r) return r;
        }
        continue;
      }
      if (++steps > MAX_STEPS) return "limit";
      if (st.op === "call") {
        const body = defs.get(st.name);
        if (!body) return "nofn";
        if (++depth > MAX_DEPTH) return "limit";
        const saved = n;
        if (st.arg !== undefined) n = st.arg;
        const r = yield* exec(body);
        if (st.arg !== undefined) n = saved;
        depth--;
        if (r) return r;
        continue;
      }
      if (st.op === "set" || st.op === "add") {
        n = st.op === "set" ? st.n : n + st.n;
        yield { kind: "calc", blockId: st.id, state: m.get(), n };
        continue;
      }
      const kind = m.act(st.op);
      yield { kind, blockId: st.id, state: m.get(), n };
      if (kind === "bump") return "bump";
      if (m.won()) return "win";
    }
    return null;
  }
  if (m.won()) return "win";
  const r = yield* exec(main);
  return r ?? m.end();
}

/** máy sân lưới; `from` là trạng thái bắt đầu (màn phím: chạy tiếp từ chỗ đang đứng) */
export function gridMachine(w: World, from?: State): Machine<State> {
  let s = from ?? initState(w);
  return {
    get: () => s,
    check: (c) => check(w, s, c),
    won: () => isWin(w, s),
    end: () => (w.target ? "shape" : w.goal && at(w.goal, s) ? "stars" : "short"),
    act(op) {
      if (op === "left" || op === "right") {
        s = { ...s, dir: op === "left" ? turnLeft(s.dir) : turnRight(s.dir) };
        return "turn";
      }
      if (op !== "forward") return "bump";
      const nx = s.x + DX[s.dir];
      const ny = s.y + DY[s.dir];
      if (!isOpen(w, nx, ny)) {
        s = { ...s };
        return "bump";
      }
      const trail = w.target ? [...s.trail, edgeKey(s.x, s.y, nx, ny)] : s.trail;
      s = { ...s, x: nx, y: ny, trail };
      const si = w.stars.findIndex((p, i) => p.x === nx && p.y === ny && !s.got.includes(i));
      if (si < 0) return "move";
      s = { ...s, got: [...s.got, si] };
      return "star";
    },
  };
}

/**
 * Chạy chương trình trên sân lưới. Generator trả từng bước, kết thúc bằng kết quả (xem Outcome).
 * Thắng là dừng ngay khi đạt.
 */
export function run(w: World, program: Stmt[], opts: { from?: State; entry?: Stmt[] } = {}): Generator<Step, Outcome> {
  return interp(gridMachine(w, opts.from), program, opts.entry);
}

/** chạy hết một lần, lấy kết quả và trạng thái cuối (dùng cho chấm bài, câu hỏi, kiểm thử) */
export function runAll(w: World, program: Stmt[], opts: { from?: State; entry?: Stmt[] } = {}): { outcome: Outcome; state: State; steps: number } {
  const g = run(w, program, opts);
  let state = opts.from ?? initState(w);
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
  nofn: "Có khối Gọi hàm mà chưa có khối Hàm tên đó. Kéo khối 🧩 Hàm ra và đặt tên cho khớp nhé!",
  wrong: "Chạy xong rồi mà chưa đúng mục tiêu. Xem lại nhé!",
};
