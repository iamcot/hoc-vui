/**
 * Bàn phím QWERTY và ngón tay phụ trách từng phím (gõ 10 ngón).
 * Ngón: L5 út trái … L2 trỏ trái, R2 trỏ phải … R5 út phải, T ngón cái.
 */
export type Finger = "L5" | "L4" | "L3" | "L2" | "R2" | "R3" | "R4" | "R5" | "T";

export interface KeyCap {
  /** ký tự khi gõ thường (chữ thường) */
  k: string;
  /** ký tự khi giữ Shift */
  s?: string;
  f: Finger;
  /** độ rộng theo đơn vị phím */
  w?: number;
  /** phím chức năng (không gõ ra chữ) */
  fn?: string;
}

const row = (keys: string, shifts: string, fingers: Finger[]): KeyCap[] =>
  [...keys].map((k, i) => ({ k, s: shifts[i] === " " ? undefined : shifts[i], f: fingers[i] }));

export const ROWS: KeyCap[][] = [
  [
    ...row("`1234567890-=", "~!@#$%^&*()_+", ["L5", "L5", "L4", "L3", "L2", "L2", "R2", "R2", "R3", "R4", "R5", "R5", "R5"]),
    { k: "", fn: "⌫", f: "R5", w: 1.6 },
  ],
  [
    { k: "", fn: "Tab", f: "L5", w: 1.5 },
    ...row("qwertyuiop[]", "QWERTYUIOP{}", ["L5", "L4", "L3", "L2", "L2", "R2", "R2", "R3", "R4", "R5", "R5", "R5"]),
    { k: "\\", s: "|", f: "R5", w: 1.1 },
  ],
  [
    { k: "", fn: "Caps", f: "L5", w: 1.8 },
    ...row("asdfghjkl;'", "ASDFGHJKL:\"", ["L5", "L4", "L3", "L2", "L2", "R2", "R2", "R3", "R4", "R5", "R5"]),
    { k: "\n", fn: "Enter", f: "R5", w: 1.8 },
  ],
  [
    { k: "", fn: "Shift", f: "L5", w: 2.3 },
    ...row("zxcvbnm,./", "ZXCVBNM<>?", ["L5", "L4", "L3", "L2", "L2", "R2", "R2", "R3", "R4", "R5"]),
    { k: "", fn: "Shift", f: "R5", w: 2.3 },
  ],
  [{ k: " ", fn: "", f: "T", w: 6.5 }],
];

const BY_CHAR = new Map<string, KeyCap>();
for (const r of ROWS) for (const c of r) {
  if (c.k && !c.fn) BY_CHAR.set(c.k, c);
  if (c.s) BY_CHAR.set(c.s, c);
}
BY_CHAR.set(" ", ROWS[4][0]);

export const keyOf = (ch: string) => BY_CHAR.get(ch) ?? BY_CHAR.get(ch.toLowerCase());
export const fingerOf = (ch: string): Finger | undefined => keyOf(ch)?.f;
/** chữ hoa / ký tự trên cần Shift ở tay đối diện */
export const needsShift = (ch: string) => {
  const c = keyOf(ch);
  return !!c && ch !== c.k && ch === c.s;
};
export const shiftSide = (ch: string): "L" | "R" | undefined => {
  if (!needsShift(ch)) return undefined;
  return fingerOf(ch)?.startsWith("L") ? "R" : "L";
};

export const FINGER_NAME: Record<Finger, string> = {
  L5: "út trái",
  L4: "áp út trái",
  L3: "giữa trái",
  L2: "trỏ trái",
  R2: "trỏ phải",
  R3: "giữa phải",
  R4: "áp út phải",
  R5: "út phải",
  T: "ngón cái",
};

/** màu neon cho từng ngón, hai tay đối xứng */
export const FINGER_COLOR: Record<Finger, string> = {
  L5: "#ff4fa3",
  L4: "#ffb020",
  L3: "#3ee08f",
  L2: "#2fd3ff",
  R2: "#7c6bff",
  R3: "#3ee08f",
  R4: "#ffb020",
  R5: "#ff4fa3",
  T: "#9aa6c8",
};

/** hàng phím nhà: chỗ tám ngón đặt sẵn */
export const HOME: Record<Exclude<Finger, "T">, string> = { L5: "a", L4: "s", L3: "d", L2: "f", R2: "j", R3: "k", R4: "l", R5: ";" };
