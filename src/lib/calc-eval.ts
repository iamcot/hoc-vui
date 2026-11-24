/**
 * Bộ tính cho máy ảo bấm tự do (luyện tập, kiểm tra, thi đấu).
 * Nhận chuỗi token do bàn phím sinh ra, tính bằng số thực, rồi hiển thị gần giống fx-580VN X:
 * kết quả hữu tỉ hiện dạng phân số tối giản, bấm S⇔D để đổi sang số thập phân.
 */

export type Tok =
  | { k: "num"; v: string } // chữ số hoặc dấu chấm
  | { k: "op"; v: "+" | "-" | "*" | "/" | "frac" | "^" | "divr" }
  | { k: "neg" }
  | { k: "lp" }
  | { k: "rp" }
  | { k: "comma" }
  | { k: "fn"; v: "sqrt" | "cbrt" | "sin" | "cos" | "tan" | "asin" | "acos" | "atan" | "gcd" | "lcm" }
  | { k: "post"; v: "sq" | "cube" | "inv" | "fact" | "pct" }
  | { k: "const"; v: "pi" | "ans" };

/** Chữ hiện trên màn hình cho từng token */
export function tokText(t: Tok): string {
  switch (t.k) {
    case "num":
      return t.v;
    case "op":
      return { "+": "+", "-": "−", "*": "×", "/": "÷", frac: "⁄", "^": "^", divr: "÷R" }[t.v];
    case "neg":
      return "−";
    case "lp":
      return "(";
    case "rp":
      return ")";
    case "comma":
      return ",";
    case "fn":
      return { sqrt: "√(", cbrt: "∛(", sin: "sin(", cos: "cos(", tan: "tan(", asin: "sin⁻¹(", acos: "cos⁻¹(", atan: "tan⁻¹(", gcd: "GCD(", lcm: "LCM(" }[t.v];
    case "post":
      return { sq: "²", cube: "³", inv: "⁻¹", fact: "!", pct: "%" }[t.v];
    case "const":
      return t.v === "pi" ? "π" : "Ans";
  }
}

export interface CalcResult {
  value: number;
  /** có dùng π, căn, lượng giác... thì không đổi sang phân số */
  exact: boolean;
  /** chia có dư */
  divr?: { q: number; r: number };
}

class P {
  i = 0;
  exact = true;
  constructor(
    private t: Tok[],
    private ans: number,
  ) {}
  peek() {
    return this.t[this.i];
  }
  next() {
    return this.t[this.i++];
  }
  fail(): never {
    throw new Error("Syntax ERROR");
  }

  expr(): number {
    let v = this.term();
    for (;;) {
      const t = this.peek();
      if (t?.k === "op" && (t.v === "+" || t.v === "-")) {
        this.next();
        const r = this.term();
        v = t.v === "+" ? v + r : v - r;
      } else return v;
    }
  }
  /** nhân chia, kể cả nhân ngầm: 2π, 3(4), 2√(9) */
  term(): number {
    let v = this.unary();
    for (;;) {
      const t = this.peek();
      if (t?.k === "op" && (t.v === "*" || t.v === "/")) {
        this.next();
        const r = this.unary();
        if (t.v === "/" && r === 0) throw new Error("Math ERROR");
        v = t.v === "*" ? v * r : v / r;
      } else if (t && (t.k === "lp" || t.k === "fn" || t.k === "const")) {
        v = v * this.unary();
      } else return v;
    }
  }
  unary(): number {
    if (this.peek()?.k === "neg") {
      this.next();
      return -this.unary();
    }
    return this.fracLevel();
  }
  /** phân số ▯/▯ gắn chặt hơn nhân chia */
  fracLevel(): number {
    let v = this.power();
    while (this.peek()?.k === "op" && (this.peek() as { v: string }).v === "frac") {
      this.next();
      const d = this.power();
      if (d === 0) throw new Error("Math ERROR");
      v = v / d;
    }
    return v;
  }
  power(): number {
    const b = this.postfix();
    const t = this.peek();
    if (t?.k === "op" && t.v === "^") {
      this.next();
      const e = this.unary();
      if (!Number.isInteger(e)) this.exact = false;
      return Math.pow(b, e);
    }
    return b;
  }
  postfix(): number {
    let v = this.primary();
    for (;;) {
      const t = this.peek();
      if (t?.k !== "post") return v;
      this.next();
      if (t.v === "sq") v = v * v;
      else if (t.v === "cube") v = v * v * v;
      else if (t.v === "inv") {
        if (v === 0) throw new Error("Math ERROR");
        v = 1 / v;
      } else if (t.v === "pct") v = v / 100;
      else {
        if (!Number.isInteger(v) || v < 0 || v > 69) throw new Error("Math ERROR");
        let f = 1;
        for (let i = 2; i <= v; i++) f *= i;
        v = f;
      }
    }
  }
  /** đọc biểu thức trong ngoặc; thiếu ngoặc đóng ở cuối thì tự đóng như máy thật */
  group(): number {
    const v = this.expr();
    if (this.peek()?.k === "rp") this.next();
    else if (this.peek()) this.fail();
    return v;
  }
  primary(): number {
    const t = this.next();
    if (!t) this.fail();
    if (t.k === "num") {
      let s = t.v;
      while (this.peek()?.k === "num") s += (this.next() as { v: string }).v;
      if ((s.match(/\./g) ?? []).length > 1) this.fail();
      return parseFloat(s);
    }
    if (t.k === "lp") return this.group();
    if (t.k === "const") {
      if (t.v === "pi") {
        this.exact = false;
        return Math.PI;
      }
      return this.ans;
    }
    if (t.k === "fn") {
      if (t.v === "gcd" || t.v === "lcm") {
        const a = this.expr();
        if (this.next()?.k !== "comma") this.fail();
        const b = this.group();
        if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error("Math ERROR");
        const g = gcd(Math.abs(a), Math.abs(b));
        return t.v === "gcd" ? g : Math.abs(a * b) / g;
      }
      const x = this.group();
      const rad = Math.PI / 180;
      switch (t.v) {
        case "sqrt": {
          if (x < 0) throw new Error("Math ERROR");
          const r = Math.sqrt(x);
          if (!isRationalSqrt(x)) this.exact = false;
          return r;
        }
        case "cbrt": {
          const r = Math.cbrt(x);
          if (Math.abs(r - Math.round(r)) > 1e-9) this.exact = false;
          return r;
        }
        case "sin":
        case "cos":
        case "tan": {
          this.exact = false;
          const v = Math[t.v](x * rad);
          // sin 30° = 0,5 đúng tuyệt đối như máy thật
          return Math.abs(v - Math.round(v * 1e9) / 1e9) < 1e-12 ? Math.round(v * 1e9) / 1e9 : v;
        }
        default: {
          this.exact = false;
          if ((t.v === "asin" || t.v === "acos") && Math.abs(x) > 1) throw new Error("Math ERROR");
          const f = t.v === "asin" ? Math.asin : t.v === "acos" ? Math.acos : Math.atan;
          return f(x) / rad;
        }
      }
    }
    return this.fail();
  }
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

function isRationalSqrt(x: number) {
  const f = toFraction(x);
  if (!f) return false;
  const a = Math.round(Math.sqrt(f[0])), b = Math.round(Math.sqrt(f[1]));
  return a * a === f[0] && b * b === f[1];
}

/** Tính. Ném lỗi "Syntax ERROR" / "Math ERROR" như máy thật. */
export function evaluate(toks: Tok[], ans = 0): CalcResult {
  if (!toks.length) return { value: 0, exact: true };
  // chia có dư: a ÷R b ở cấp ngoài cùng
  const di = toks.findIndex((t) => t.k === "op" && t.v === "divr");
  if (di >= 0) {
    const a = evaluate(toks.slice(0, di), ans).value, b = evaluate(toks.slice(di + 1), ans).value;
    if (!Number.isInteger(a) || !Number.isInteger(b) || b === 0) throw new Error("Math ERROR");
    const q = Math.floor(a / b);
    return { value: q, exact: true, divr: { q, r: a - q * b } };
  }
  const p = new P(toks, ans);
  const v = p.group();
  if (!Number.isFinite(v)) throw new Error("Math ERROR");
  return { value: v, exact: p.exact };
}

/** Đổi số thập phân sang phân số [tử, mẫu] (mẫu ≤ 10⁶), null nếu không gần phân số nào. */
export function toFraction(x: number): [number, number] | null {
  if (!Number.isFinite(x)) return null;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(b);
    [h1, h0] = [a * h1 + h0, h1];
    [k1, k0] = [a * k1 + k0, k1];
    if (k1 > 1e6) return null;
    if (Math.abs(x - h1 / k1) < 1e-10 * Math.max(1, x)) return [sign * h1, k1];
    b = 1 / (b - a);
    if (!Number.isFinite(b)) break;
  }
  return Math.abs(x - h1 / k1) < 1e-10 * Math.max(1, x) && k1 <= 1e6 ? [sign * h1, k1] : null;
}

/** Hiển thị số kiểu máy Casio: tối đa 10 chữ số có nghĩa, dùng dấu chấm. */
export function fmtDecimal(v: number): string {
  if (Object.is(v, -0)) v = 0;
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e10 || a < 1e-9)) {
    const [m, e] = v.toExponential(9).split("e");
    return `${String(+m)}×10^${+e}`;
  }
  return String(+v.toPrecision(10));
}

/** Chuỗi kết quả: phân số khi exact và không nguyên, trừ khi đang xem dạng thập phân. */
export function fmtResult(r: CalcResult, decimal: boolean): string {
  if (r.divr) return `Q=${r.divr.q}, R=${r.divr.r}`;
  if (!decimal && r.exact && !Number.isInteger(r.value)) {
    const f = toFraction(r.value);
    if (f && f[1] !== 1 && f[1] <= 10000) return `${f[0]}/${f[1]}`;
  }
  return fmtDecimal(r.value);
}
