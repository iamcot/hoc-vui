/**
 * Chương trình của bé dạng cây lệnh (đọc ra từ khối Blockly, hoặc viết tay trong dữ liệu bài).
 * Dạng chữ dùng trong dữ liệu:
 *   F = Đi tới, L = Rẽ trái, R = Rẽ phải
 *   3(F L)  = Lặp lại 3 lần          n(F) = Lặp lại n lần (n là biến)
 *   U(...)  = Lặp cho tới khi tới cờ  UE(...) = Lặp cho tới khi điều kiện E đúng
 *   W?(...) = Nếu phía trước có tường thì …   W?(... | ...) = Nếu … thì … không thì …
 *   A?(...) = Nếu bên trái có đường   D?(...) = Nếu bên phải có đường   P?(...) = Nếu phía trước có đường
 *   n=3 = đặt biến n bằng 3   n+1 / n-1 = tăng / giảm n
 *   nhay{F F} = hàm tên "nhay"   @nhay = gọi hàm   @canh:3 = gọi hàm với n = 3
 *   #u{F} = khi bấm phím ↑ (u lên, l trái, r phải, s phím cách)
 *   Kho hàng (danh sách): > sang hộp kế, ^ về hộp đầu, % đổi chỗ với hộp kế, ! nhớ hộp này
 *     điều kiện: E ở hộp cuối, X hộp này là số cần tìm, M lớn hơn số đã nhớ, N nhỏ hơn số đã nhớ, S lớn hơn hộp kế
 */

/** điều kiện cảm biến trên sân lưới và trong kho hàng */
export type Cond = "W" | "A" | "D" | "G" | "P" | "E" | "X" | "M" | "N" | "S";
export const LIST_CONDS: Cond[] = ["E", "X", "M", "N", "S"];

export type Key = "u" | "l" | "r" | "s";

export type Stmt =
  | { op: "forward" | "left" | "right"; id?: string }
  | { op: "next" | "first" | "swap" | "mem"; id?: string }
  | { op: "repeat"; n: number | "n"; body: Stmt[]; id?: string }
  | { op: "if"; cond: Cond; body: Stmt[]; else?: Stmt[]; id?: string }
  | { op: "until"; cond: Cond; body: Stmt[]; id?: string }
  | { op: "def"; name: string; body: Stmt[]; id?: string }
  | { op: "call"; name: string; arg?: number; id?: string }
  | { op: "set" | "add"; n: number; id?: string }
  | { op: "key"; key: Key; body: Stmt[]; id?: string };

const SIMPLE: Record<string, Stmt["op"]> = { F: "forward", L: "left", R: "right", ">": "next", "^": "first", "%": "swap", "!": "mem" };
const SIMPLE_TEXT: Record<string, string> = Object.fromEntries(Object.entries(SIMPLE).map(([k, v]) => [v, k]));

const TOKENS = /[a-z_][a-z0-9_]*\{|#[ulrs]\{|@[a-z_][a-z0-9_]*(?::-?\d+)?|n[=+-]-?\d+|n\(|\d+\(|U[A-Z]?\(|[A-Z]\?\(|[)}|]|[FLR>^%!]/g;

export function parseProgram(src: string): Stmt[] {
  const toks = src.match(TOKENS) ?? [];
  let i = 0;
  /** đọc tới dấu đóng; trả về danh sách và dấu đã gặp (")", "}", "|" hoặc "" khi hết) */
  const seq = (): [Stmt[], string] => {
    const out: Stmt[] = [];
    while (i < toks.length) {
      const t = toks[i++];
      if (t === ")" || t === "}" || t === "|") return [out, t];
      if (SIMPLE[t]) out.push({ op: SIMPLE[t] } as Stmt);
      else if (t.startsWith("#")) out.push({ op: "key", key: t[1] as Key, body: seq()[0] });
      else if (t.endsWith("{")) out.push({ op: "def", name: t.slice(0, -1), body: seq()[0] });
      else if (t.startsWith("@")) {
        const [name, arg] = t.slice(1).split(":");
        out.push(arg === undefined ? { op: "call", name } : { op: "call", name, arg: parseInt(arg) });
      } else if (/^n[=+-]/.test(t)) out.push({ op: t[1] === "=" ? "set" : "add", n: t[1] === "-" ? -parseInt(t.slice(2)) : parseInt(t.slice(2)) });
      else if (t === "n(") out.push({ op: "repeat", n: "n", body: seq()[0] });
      else if (t.startsWith("U")) out.push({ op: "until", cond: (t.length === 3 ? t[1] : "G") as Cond, body: seq()[0] });
      else if (t.endsWith("?(")) {
        const [body, end] = seq();
        const s: Stmt = { op: "if", cond: t[0] as Cond, body };
        if (end === "|") s.else = seq()[0];
        out.push(s);
      } else out.push({ op: "repeat", n: parseInt(t), body: seq()[0] });
    }
    return [out, ""];
  };
  return seq()[0];
}

export function programText(p: Stmt[]): string {
  return p
    .map((s) => {
      switch (s.op) {
        case "repeat":
          return `${s.n}(${programText(s.body)})`;
        case "until":
          return `U${s.cond === "G" ? "" : s.cond}(${programText(s.body)})`;
        case "if":
          return `${s.cond}?(${programText(s.body)}${s.else ? ` | ${programText(s.else)}` : ""})`;
        case "def":
          return `${s.name}{${programText(s.body)}}`;
        case "key":
          return `#${s.key}{${programText(s.body)}}`;
        case "call":
          return `@${s.name}${s.arg === undefined ? "" : `:${s.arg}`}`;
        case "set":
          return `n=${s.n}`;
        case "add":
          return s.n < 0 ? `n-${-s.n}` : `n+${s.n}`;
        default:
          return SIMPLE_TEXT[s.op];
      }
    })
    .join(" ");
}

export const hasBody = (s: Stmt): s is Extract<Stmt, { body: Stmt[] }> => "body" in s;

/** các khối con trực tiếp (thân, và nhánh "không thì") */
export const childrenOf = (s: Stmt): Stmt[] => (hasBody(s) ? [...s.body, ...(s.op === "if" && s.else ? s.else : [])] : []);

/** số khối trong chương trình (không tính khối "Khi bấm Chạy"; khối Hàm, Khi bấm phím có tính) */
export const countBlocks = (p: Stmt[]): number => p.reduce((a, s) => a + 1 + countBlocks(childrenOf(s)), 0);

/** khối có trong chương trình, đi hết cây */
export const allStmts = (p: Stmt[]): Stmt[] => p.flatMap((s) => [s, ...allStmts(childrenOf(s))]);

export const BLOCK_LABEL = { forward: "Đi tới", left: "Rẽ trái", right: "Rẽ phải", next: "Sang hộp kế", first: "Về hộp đầu", swap: "Đổi chỗ với hộp kế", mem: "Nhớ hộp này" } as const;
export const COND_LABEL: Record<Cond, string> = {
  W: "có tường phía trước",
  A: "có đường bên trái",
  D: "có đường bên phải",
  G: "tới cờ",
  P: "có đường phía trước",
  E: "ở hộp cuối",
  X: "hộp này là số cần tìm",
  M: "hộp này lớn hơn số đã nhớ",
  N: "hộp này nhỏ hơn số đã nhớ",
  S: "hộp này lớn hơn hộp kế",
};
export const KEY_LABEL: Record<Key, string> = { u: "⬆️", l: "⬅️", r: "➡️", s: "phím cách" };

/** đọc chương trình thành chữ cho câu hỏi: "Đi tới · Rẽ trái · Đi tới" */
export const sayProgram = (p: Stmt[]): string =>
  p
    .map((s) => {
      switch (s.op) {
        case "repeat":
          return `Lặp ${s.n} lần (${sayProgram(s.body)})`;
        case "until":
          return `Lặp tới khi ${COND_LABEL[s.cond]} (${sayProgram(s.body)})`;
        case "if":
          return `Nếu ${COND_LABEL[s.cond]} thì (${sayProgram(s.body)})${s.else ? ` không thì (${sayProgram(s.else)})` : ""}`;
        case "def":
          return `Hàm ${s.name} (${sayProgram(s.body)})`;
        case "key":
          return `Khi bấm ${KEY_LABEL[s.key]} (${sayProgram(s.body)})`;
        case "call":
          return s.arg === undefined ? `Gọi ${s.name}` : `Gọi ${s.name} với n = ${s.arg}`;
        case "set":
          return `n = ${s.n}`;
        case "add":
          return s.n < 0 ? `n giảm ${-s.n}` : `n tăng ${s.n}`;
        default:
          return BLOCK_LABEL[s.op];
      }
    })
    .join(" · ");

/** một dòng code Python dịch từ khối (cho bảng xem trước ở giao diện Hologram) */
export interface PyLine {
  indent: number;
  text: string;
  /** id khối sinh ra dòng này, để tô sáng dòng đang chạy */
  id?: string;
}

const PY_COND: Record<Cond, string> = {
  W: "co_tuong_truoc()",
  A: "co_duong_trai()",
  D: "co_duong_phai()",
  G: "toi_co()",
  P: "co_duong_truoc()",
  E: "i == len(a) - 1",
  X: "a[i] == can_tim",
  M: "a[i] > a[nho]",
  N: "a[i] < a[nho]",
  S: "a[i] > a[i + 1]",
};
/** điều kiện ngược (cho vòng "lặp cho tới khi" viết thành while) */
const PY_NOT: Partial<Record<Cond, string>> = { E: "i < len(a) - 1", X: "a[i] != can_tim", G: "not toi_co()", W: "not co_tuong_truoc()", P: "not co_duong_truoc()" };
const PY_SIMPLE: Record<string, string> = { forward: "di_toi()", left: "re_trai()", right: "re_phai()", next: "i += 1", first: "i = 0", swap: "a[i], a[i + 1] = a[i + 1], a[i]", mem: "nho = i" };
const PY_KEY: Record<Key, string> = { u: "len", l: "trai", r: "phai", s: "cach" };

/** tên hàm kiểu Python: bỏ dấu, khoảng trắng thành gạch dưới */
export const pyName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9_]+/g, "_")
    .replace(/^(\d)/, "_$1") || "ham";

export function pythonLines(p: Stmt[], indent = 0): PyLine[] {
  const block = (head: string, body: Stmt[], id?: string, at = indent): PyLine[] => {
    const lines = pythonLines(body, at + 1);
    return [{ indent: at, text: head, id }, ...(lines.length ? lines : [{ indent: at + 1, text: "pass" }])];
  };
  return p.flatMap((s): PyLine[] => {
    switch (s.op) {
      case "repeat":
        return block(`for _ in range(${s.n}):`, s.body, s.id);
      case "until":
        return block(`while ${PY_NOT[s.cond] ?? `not (${PY_COND[s.cond]})`}:`, s.body, s.id);
      case "if":
        return [...block(`if ${PY_COND[s.cond]}:`, s.body, s.id), ...(s.else ? block("else:", s.else) : [])];
      case "def":
        return block(`def ${pyName(s.name)}(${allStmts(s.body).some((x) => x.op === "repeat" && x.n === "n") ? "n" : ""}):`, s.body, s.id);
      case "key":
        return [{ indent, text: `@khi_bam("${PY_KEY[s.key]}")` }, ...block(`def bam_${PY_KEY[s.key]}():`, s.body, s.id)];
      case "call":
        return [{ indent, text: `${pyName(s.name)}(${s.arg ?? ""})`, id: s.id }];
      case "set":
        return [{ indent, text: `n = ${s.n}`, id: s.id }];
      case "add":
        return [{ indent, text: s.n < 0 ? `n -= ${-s.n}` : `n += ${s.n}`, id: s.id }];
      default:
        return [{ indent, text: PY_SIMPLE[s.op], id: s.id }];
    }
  });
}
