/**
 * Chương trình của bé dạng cây lệnh (đọc ra từ khối Blockly, hoặc viết tay trong dữ liệu bài).
 * Dạng chữ dùng trong dữ liệu:
 *   F = Đi tới, L = Rẽ trái, R = Rẽ phải
 *   3(F L)  = Lặp lại 3 lần
 *   U(...)  = Lặp cho tới khi tới cờ
 *   W?(...) = Nếu phía trước có tường thì …   A?(...) = Nếu bên trái có đường   D?(...) = Nếu bên phải có đường
 */

/** điều kiện cảm biến: W tường phía trước, A bên trái có đường, D bên phải có đường, G đang ở cờ */
export type Cond = "W" | "A" | "D" | "G";

export type Stmt =
  | { op: "forward" | "left" | "right"; id?: string }
  | { op: "repeat"; n: number; body: Stmt[]; id?: string }
  | { op: "if"; cond: Cond; body: Stmt[]; id?: string }
  | { op: "until"; cond: Cond; body: Stmt[]; id?: string };

export function parseProgram(src: string): Stmt[] {
  const toks = src.match(/\d+\(|[WAD]\?\(|U\(|\)|[FLR]/g) ?? [];
  let i = 0;
  const seq = (): Stmt[] => {
    const out: Stmt[] = [];
    while (i < toks.length) {
      const t = toks[i++];
      if (t === ")") return out;
      if (t === "F") out.push({ op: "forward" });
      else if (t === "L") out.push({ op: "left" });
      else if (t === "R") out.push({ op: "right" });
      else if (t === "U(") out.push({ op: "until", cond: "G", body: seq() });
      else if (t.endsWith("?(")) out.push({ op: "if", cond: t[0] as Cond, body: seq() });
      else out.push({ op: "repeat", n: parseInt(t), body: seq() });
    }
    return out;
  };
  return seq();
}

export function programText(p: Stmt[]): string {
  return p
    .map((s) => {
      if (s.op === "repeat") return `${s.n}(${programText(s.body)})`;
      if (s.op === "until") return `U(${programText(s.body)})`;
      if (s.op === "if") return `${s.cond}?(${programText(s.body)})`;
      return s.op === "forward" ? "F" : s.op === "left" ? "L" : "R";
    })
    .join(" ");
}

const hasBody = (s: Stmt): s is Extract<Stmt, { body: Stmt[] }> => "body" in s;

/** số khối trong chương trình (không tính khối "Khi bấm Chạy") */
export const countBlocks = (p: Stmt[]): number => p.reduce((a, s) => a + 1 + (hasBody(s) ? countBlocks(s.body) : 0), 0);

export const BLOCK_LABEL = { forward: "Đi tới", left: "Rẽ trái", right: "Rẽ phải" } as const;
export const COND_LABEL: Record<Cond, string> = { W: "có tường phía trước", A: "có đường bên trái", D: "có đường bên phải", G: "tới cờ" };

/** đọc chương trình thành chữ cho câu hỏi: "Đi tới · Rẽ trái · Đi tới" */
export const sayProgram = (p: Stmt[]): string =>
  p
    .map((s) => {
      if (s.op === "repeat") return `Lặp ${s.n} lần (${sayProgram(s.body)})`;
      if (s.op === "until") return `Lặp tới khi ${COND_LABEL[s.cond]} (${sayProgram(s.body)})`;
      if (s.op === "if") return `Nếu ${COND_LABEL[s.cond]} thì (${sayProgram(s.body)})`;
      return BLOCK_LABEL[s.op];
    })
    .join(" · ");

/** một dòng code Python dịch từ khối (cho bảng xem trước ở giao diện Hologram) */
export interface PyLine {
  indent: number;
  text: string;
  /** id khối sinh ra dòng này, để tô sáng dòng đang chạy */
  id?: string;
}

const PY_COND: Record<Cond, string> = { W: "co_tuong_truoc()", A: "co_duong_trai()", D: "co_duong_phai()", G: "toi_co()" };

export function pythonLines(p: Stmt[], indent = 0): PyLine[] {
  return p.flatMap((s): PyLine[] => {
    if (s.op === "forward") return [{ indent, text: "di_toi()", id: s.id }];
    if (s.op === "left") return [{ indent, text: "re_trai()", id: s.id }];
    if (s.op === "right") return [{ indent, text: "re_phai()", id: s.id }];
    if (!hasBody(s)) return [];
    const head = s.op === "repeat" ? `for i in range(${s.n}):` : s.op === "until" ? `while not ${PY_COND[s.cond]}:` : `if ${PY_COND[s.cond]}:`;
    const body = pythonLines(s.body, indent + 1);
    return [{ indent, text: head, id: s.id }, ...(body.length ? body : [{ indent: indent + 1, text: "pass" }])];
  });
}
