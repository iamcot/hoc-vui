/**
 * Chương trình của bé dạng cây lệnh (đọc ra từ khối Blockly, hoặc viết tay trong dữ liệu bài).
 * Dạng chữ dùng trong dữ liệu: F = Đi, L = Rẽ trái, R = Rẽ phải, 3(F L) = Lặp lại 3 lần.
 */

export type Stmt =
  | { op: "forward" | "left" | "right"; id?: string }
  | { op: "repeat"; n: number; body: Stmt[]; id?: string };

export function parseProgram(src: string): Stmt[] {
  const toks = src.match(/\d+\(|\)|[FLR]/g) ?? [];
  let i = 0;
  const seq = (): Stmt[] => {
    const out: Stmt[] = [];
    while (i < toks.length) {
      const t = toks[i++];
      if (t === ")") return out;
      if (t === "F") out.push({ op: "forward" });
      else if (t === "L") out.push({ op: "left" });
      else if (t === "R") out.push({ op: "right" });
      else out.push({ op: "repeat", n: parseInt(t), body: seq() });
    }
    return out;
  };
  return seq();
}

export function programText(p: Stmt[]): string {
  return p.map((s) => (s.op === "repeat" ? `${s.n}(${programText(s.body)})` : s.op === "forward" ? "F" : s.op === "left" ? "L" : "R")).join(" ");
}

/** số khối trong chương trình (không tính khối "Khi bấm Chạy") */
export const countBlocks = (p: Stmt[]): number => p.reduce((a, s) => a + 1 + (s.op === "repeat" ? countBlocks(s.body) : 0), 0);

export const BLOCK_LABEL = { forward: "Đi tới", left: "Rẽ trái", right: "Rẽ phải" } as const;

/** đọc chương trình thành chữ cho câu hỏi: "Đi tới · Rẽ trái · Đi tới" */
export const sayProgram = (p: Stmt[]): string => p.map((s) => (s.op === "repeat" ? `Lặp ${s.n} lần (${sayProgram(s.body)})` : BLOCK_LABEL[s.op])).join(" · ");
