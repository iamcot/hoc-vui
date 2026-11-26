/**
 * Cân bằng phương trình hoá học: đọc công thức ("Ca(OH)₂", "Fe2O3"), đếm nguyên tử mỗi vế,
 * kiểm tra hệ số bé đã đúng chưa, và tự giải hệ số nguyên nhỏ nhất (để kiểm tra đề bài).
 */

export type Counts = Record<string, number>;
export interface Eq {
  left: string[];
  right: string[];
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const digits = (s: string) => s.replace(/[₀-₉]/g, (c) => String(SUB.indexOf(c)));

/** "Ca(OH)₂" → { Ca: 1, O: 2, H: 2 }. Bỏ qua ký hiệu trạng thái như ↑ ↓ */
export function parseFormula(f: string): Counts {
  const s = digits(f.replace(/[↑↓\s]/g, ""));
  let i = 0;
  const num = () => {
    let n = "";
    while (i < s.length && s[i] >= "0" && s[i] <= "9") n += s[i++];
    return n ? Number(n) : 1;
  };
  const group = (): Counts => {
    const out: Counts = {};
    while (i < s.length && s[i] !== ")") {
      if (s[i] === "(") {
        i++;
        const inner = group();
        i++; // ")"
        const k = num();
        for (const e in inner) out[e] = (out[e] ?? 0) + inner[e] * k;
      } else {
        const m = /^[A-Z][a-z]?/.exec(s.slice(i));
        if (!m) throw new Error(`Công thức sai: ${f}`);
        i += m[0].length;
        out[m[0]] = (out[m[0]] ?? 0) + num();
      }
    }
    return out;
  };
  const r = group();
  if (i < s.length) throw new Error(`Công thức sai: ${f}`);
  return r;
}

/** "Fe + O₂ → Fe₂O₃" (hệ số có sẵn ở đầu chất sẽ bị bỏ) */
export function parseEquation(text: string): Eq {
  const [l, r] = text.split(/→|->/);
  const side = (x: string) => x.split("+").map((p) => p.trim().replace(/^\d+\s*/, ""));
  return { left: side(l), right: side(r) };
}

/** đếm nguyên tử từng nguyên tố ở một vế với hệ số cho trước */
export function countSide(formulas: string[], coefs: number[]): Counts {
  const out: Counts = {};
  formulas.forEach((f, i) => {
    const c = parseFormula(f);
    for (const e in c) out[e] = (out[e] ?? 0) + c[e] * (coefs[i] ?? 1);
  });
  return out;
}

export interface Tally {
  element: string;
  left: number;
  right: number;
  ok: boolean;
}

/** bảng đếm nguyên tử hai vế, theo thứ tự xuất hiện */
export function tally(eq: Eq, coefs: number[]): Tally[] {
  const l = countSide(eq.left, coefs.slice(0, eq.left.length));
  const r = countSide(eq.right, coefs.slice(eq.left.length));
  const els = [...new Set([...Object.keys(l), ...Object.keys(r)])];
  return els.map((element) => ({ element, left: l[element] ?? 0, right: r[element] ?? 0, ok: (l[element] ?? 0) === (r[element] ?? 0) }));
}

export const isBalanced = (eq: Eq, coefs: number[]) => coefs.every((c) => c >= 1) && tally(eq, coefs).every((t) => t.ok);

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** hệ số nguyên dương nhỏ nhất, hoặc null nếu không cân bằng được (hoặc có nhiều nghiệm độc lập) */
export function solve(eq: Eq): number[] | null {
  const f = [...eq.left, ...eq.right];
  const n = f.length;
  const cs = f.map(parseFormula);
  const els = [...new Set(cs.flatMap((c) => Object.keys(c)))];
  // ma trận: mỗi nguyên tố một hàng, cột là chất (vế phải mang dấu âm)
  const m: number[][] = els.map((e) => cs.map((c, j) => (c[e] ?? 0) * (j < eq.left.length ? 1 : -1)));
  // khử Gauss bằng số nguyên
  const piv: number[] = [];
  let row = 0;
  for (let col = 0; col < n && row < m.length; col++) {
    const p = m.findIndex((r, k) => k >= row && r[col] !== 0);
    if (p < 0) continue;
    [m[row], m[p]] = [m[p], m[row]];
    for (let k = 0; k < m.length; k++) {
      if (k === row || m[k][col] === 0) continue;
      const a = m[row][col];
      const b = m[k][col];
      m[k] = m[k].map((v, j) => v * a - m[row][j] * b);
      const g = m[k].reduce((x, y) => gcd(x, y), 0);
      if (g > 1) m[k] = m[k].map((v) => v / g);
    }
    piv.push(col);
    row++;
  }
  const free = Array.from({ length: n }, (_, j) => j).filter((j) => !piv.includes(j));
  if (free.length !== 1) return null;
  const fj = free[0];
  // đặt ẩn tự do = tích các pivot để ra số nguyên, rồi rút gọn
  const scale = piv.reduce((x, c, k) => x * Math.abs(m[k][c]), 1);
  const sol = new Array<number>(n).fill(0);
  sol[fj] = scale;
  piv.forEach((c, k) => {
    sol[c] = (-m[k][fj] * scale) / m[k][c];
  });
  const g = sol.reduce((x, y) => gcd(x, y), 0);
  const out = sol.map((v) => v / g);
  return out.every((v) => Number.isInteger(v) && v > 0) ? out : out.every((v) => Number.isInteger(v) && v < 0) ? out.map((v) => -v) : null;
}

/** chất nào đang "lệch" nhất: dùng để Bit gợi ý ("đếm lại nguyên tử O nhé") */
export function firstWrong(eq: Eq, coefs: number[]): string | null {
  return tally(eq, coefs).find((t) => !t.ok)?.element ?? null;
}
