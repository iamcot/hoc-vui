import type { Cond, Stmt } from "./program";
import { interp, type Machine, type Outcome, type Step } from "./run";
import type { ListGoal } from "./world";

/**
 * Kho hàng (trình độ Nâng cao): một hàng hộp có số, robot đứng trước hộp đầu tiên.
 * Robot sang hộp kế, về hộp đầu, đổi chỗ hộp đang đứng với hộp kế, nhớ một hộp.
 * Chạy xong mới chấm theo mục tiêu (xếp tăng dần, nhớ đúng hộp lớn nhất, đứng đúng hộp cần tìm…).
 */

export interface ListWorld {
  kind: "list";
  /** số ban đầu trên các hộp */
  arr: number[];
  goal: ListGoal;
  find?: number;
  at?: number;
}

export interface Crate {
  /** số thứ tự hộp lúc đầu (để hoạt họa hộp trượt khi đổi chỗ) */
  id: number;
  v: number;
}

export interface ListState {
  /** robot đang đứng ở hộp thứ mấy (từ 0) */
  i: number;
  crates: Crate[];
  /** hộp đang nhớ (vị trí), chưa nhớ thì null */
  mem: number | null;
  swaps: number;
}

export const initList = (w: ListWorld): ListState => ({ i: 0, crates: w.arr.map((v, id) => ({ id, v })), mem: null, swaps: 0 });

export function listCheck(w: ListWorld, s: ListState, c: Cond): boolean {
  const a = s.crates;
  const here = a[s.i].v;
  switch (c) {
    case "E":
      return s.i === a.length - 1;
    case "X":
      return here === w.find;
    case "M":
      return s.mem === null || here > a[s.mem].v;
    case "N":
      return s.mem === null || here < a[s.mem].v;
    case "S":
      return s.i + 1 < a.length && here > a[s.i + 1].v;
    default:
      return false;
  }
}

export function listDone(w: ListWorld, s: ListState): boolean {
  const v = s.crates.map((c) => c.v);
  switch (w.goal) {
    case "sort":
      return v.every((x, k) => k === 0 || v[k - 1] <= x);
    case "max":
      return s.mem !== null && v[s.mem] === Math.max(...v);
    case "min":
      return s.mem !== null && v[s.mem] === Math.min(...v);
    case "find":
      return v[s.i] === w.find;
    case "last":
      return s.i === v.length - 1;
    case "at":
      return s.i === w.at;
  }
}

function listMachine(w: ListWorld): Machine<ListState> {
  let s = initList(w);
  return {
    get: () => s,
    check: (c) => listCheck(w, s, c),
    won: () => false,
    end: () => (listDone(w, s) ? "win" : "wrong"),
    act(op) {
      const n = s.crates.length;
      if (op === "first") {
        s = { ...s, i: 0 };
        return "move";
      }
      if (op === "mem") {
        s = { ...s, mem: s.i };
        return "mem";
      }
      if (op === "next") {
        if (s.i + 1 >= n) return "bump";
        s = { ...s, i: s.i + 1 };
        return "move";
      }
      if (op === "swap") {
        if (s.i + 1 >= n) return "bump";
        const crates = [...s.crates];
        [crates[s.i], crates[s.i + 1]] = [crates[s.i + 1], crates[s.i]];
        s = { ...s, crates, swaps: s.swaps + 1 };
        return "swap";
      }
      return "bump";
    },
  };
}

export function runList(w: ListWorld, program: Stmt[]): Generator<Step<ListState>, Outcome> {
  return interp(listMachine(w), program);
}

export function runListAll(w: ListWorld, program: Stmt[]): { outcome: Outcome; state: ListState } {
  const g = runList(w, program);
  let state = initList(w);
  for (;;) {
    const r = g.next();
    if (r.done) return { outcome: r.value, state };
    state = r.value.state;
  }
}

export const GOAL_TEXT: Record<ListGoal, string> = {
  sort: "Xếp các hộp từ nhỏ tới lớn",
  max: "Nhớ đúng hộp có số lớn nhất",
  min: "Nhớ đúng hộp có số nhỏ nhất",
  find: "Đứng ở hộp có số cần tìm",
  last: "Tới hộp cuối hàng",
  at: "Tới đúng hộp được đánh dấu",
};

/** lời nhắc khi chạy xong mà chưa đúng mục tiêu */
export const LIST_FAIL: Record<ListGoal, string> = {
  sort: "Chạy xong rồi nhưng các hộp chưa xếp từ nhỏ tới lớn. Có thể cần thêm lượt đi lại từ đầu hàng.",
  max: "Hộp đang nhớ chưa phải hộp lớn nhất. Đi hết hàng, gặp hộp lớn hơn thì nhớ hộp đó nhé.",
  min: "Hộp đang nhớ chưa phải hộp nhỏ nhất. Đi hết hàng, gặp hộp nhỏ hơn thì nhớ hộp đó nhé.",
  find: "Robot chưa đứng ở hộp có số cần tìm. Đi tiếp cho tới khi gặp đúng số đó.",
  last: "Robot chưa tới hộp cuối hàng.",
  at: "Robot chưa đứng đúng hộp được đánh dấu.",
};

export const BUMP_LIST = "Hết hàng hộp rồi! Robot không sang tiếp (hay đổi chỗ) được ở hộp cuối.";
