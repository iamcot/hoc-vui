/**
 * Bàn phím Casio fx-580VN X (rút gọn, đủ dùng cho Toán 6 đến 9).
 * Mỗi phím có nhãn chính, nhãn SHIFT (vàng) và nhãn ALPHA (đỏ) in phía trên.
 * Trong chuỗi phím của bài học, viết "MUL:GCD" nghĩa là bấm phím × để dùng chức năng GCD
 * (khi đó trước nó luôn có ALPHA hoặc SHIFT).
 */
export type KeyKind = "mod" | "fn" | "num" | "op" | "ctl" | "eq";

export interface CalcKey {
  id: string;
  label: string;
  shift?: string;
  alpha?: string;
  kind: KeyKind;
  /** chữ đọc cho màn hình ảo khi bấm */
  out?: string;
}

export const FX580_ROWS: CalcKey[][] = [
  [
    { id: "SHIFT", label: "SHIFT", kind: "mod" },
    { id: "ALPHA", label: "ALPHA", kind: "mod" },
    { id: "LEFT", label: "◀", kind: "ctl" },
    { id: "RIGHT", label: "▶", kind: "ctl" },
    { id: "MENU", label: "MENU", shift: "SETUP", kind: "ctl" },
    { id: "ON", label: "ON", kind: "ctl" },
  ],
  [
    { id: "FRAC", label: "▯/▯", shift: "▯▯/▯", alpha: "÷R", kind: "fn", out: "/" },
    { id: "SQRT", label: "√▯", shift: "∛▯", kind: "fn", out: "√(" },
    { id: "POW2", label: "x²", shift: "x³", kind: "fn", out: "²" },
    { id: "POW", label: "x^▯", shift: "▯√▯", kind: "fn", out: "^" },
    { id: "LOG", label: "log", kind: "fn" },
    { id: "LN", label: "ln", kind: "fn" },
  ],
  [
    { id: "NEG", label: "(−)", kind: "fn", out: "−" },
    { id: "DEG", label: "° ' \"", shift: "FACT", kind: "fn" },
    { id: "INV", label: "x⁻¹", shift: "x!", kind: "fn", out: "⁻¹" },
    { id: "SIN", label: "sin", shift: "sin⁻¹", kind: "fn", out: "sin(" },
    { id: "COS", label: "cos", shift: "cos⁻¹", kind: "fn", out: "cos(" },
    { id: "TAN", label: "tan", shift: "tan⁻¹", kind: "fn", out: "tan(" },
  ],
  [
    { id: "STO", label: "STO", shift: "RECALL", kind: "fn" },
    { id: "ENG", label: "ENG", kind: "fn" },
    { id: "LP", label: "(", kind: "fn", out: "(" },
    { id: "RP", label: ")", shift: ",", kind: "fn", out: ")" },
    { id: "SD", label: "S⇔D", shift: "a b/c⇔d/c", kind: "fn" },
    { id: "MPLUS", label: "M+", kind: "fn" },
  ],
  [
    { id: "7", label: "7", kind: "num", out: "7" },
    { id: "8", label: "8", kind: "num", out: "8" },
    { id: "9", label: "9", shift: "RESET", kind: "num", out: "9" },
    { id: "DEL", label: "DEL", kind: "ctl" },
    { id: "AC", label: "AC", shift: "OFF", kind: "ctl" },
  ],
  [
    { id: "4", label: "4", kind: "num", out: "4" },
    { id: "5", label: "5", kind: "num", out: "5" },
    { id: "6", label: "6", kind: "num", out: "6" },
    { id: "MUL", label: "×", alpha: "GCD", kind: "op", out: "×" },
    { id: "DIV", label: "÷", alpha: "LCM", kind: "op", out: "÷" },
  ],
  [
    { id: "1", label: "1", kind: "num", out: "1" },
    { id: "2", label: "2", kind: "num", out: "2" },
    { id: "3", label: "3", kind: "num", out: "3" },
    { id: "ADD", label: "+", kind: "op", out: "+" },
    { id: "SUB", label: "−", kind: "op", out: "−" },
  ],
  [
    { id: "0", label: "0", kind: "num", out: "0" },
    { id: "DOT", label: ".", kind: "num", out: "." },
    { id: "EXP", label: "×10ˣ", shift: "π", kind: "num" },
    { id: "ANS", label: "Ans", shift: "%", kind: "num", out: "Ans" },
    { id: "EQ", label: "=", kind: "eq", out: "=" },
  ],
];

export const FX580_KEYS: Record<string, CalcKey> = Object.fromEntries(
  FX580_ROWS.flat().map((k) => [k.id, k]),
);

export interface KeyStep {
  key: CalcKey;
  /** chức năng đang dùng (nhãn SHIFT/ALPHA) nếu có */
  as?: string;
  layer?: "shift" | "alpha";
}

/** "MUL:GCD" -> phím × dùng như GCD; "12" -> phím 1 rồi 2 */
export function parseKeys(seq: string[]): KeyStep[] {
  const out: KeyStep[] = [];
  for (const raw of seq) {
    const [id, as] = raw.split(":");
    if (/^\d{2,}$/.test(id)) {
      for (const d of id) out.push({ key: FX580_KEYS[d] });
      continue;
    }
    const key = FX580_KEYS[id];
    if (!key) throw new Error(`Phím không tồn tại: ${raw}`);
    let layer: KeyStep["layer"];
    if (as) layer = key.shift === as ? "shift" : key.alpha === as ? "alpha" : undefined;
    out.push({ key, as, layer });
  }
  return out;
}

/** Tạo chuỗi phím nhập một số nguyên (có thể âm) */
export function numKeys(n: number): string[] {
  const s = String(Math.abs(n));
  const digits = s.split("").map((c) => (c === "." ? "DOT" : c));
  return n < 0 ? ["NEG", ...digits] : digits;
}
