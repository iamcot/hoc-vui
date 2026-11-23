import type { QuestionGen } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { numKeys } from "@/content/devices/fx580";
import { choiceQ, qid } from "../helpers";

/* Bộ sinh bài tập trình độ lớp 9 (Toán 9, GDPT 2018) trên fx-580VN X. */

const nz = (rng: Rng, lo: number, hi: number) => {
  let x = 0;
  while (x === 0) x = rng.int(lo, hi);
  return x;
};
const par = (x: number) => (x < 0 ? ["LP", "NEG", ...numKeys(-x), "RP"] : numKeys(x));
const num = (x: number) => (x < 0 ? `−${-x}` : `${x}`);
const term = (c: number, v: string, first = false) => {
  const abs = Math.abs(c) === 1 && v ? "" : String(Math.abs(c));
  if (first) return `${c < 0 ? "−" : ""}${abs}${v}`;
  return `${c < 0 ? "−" : "+"} ${abs}${v}`;
};
const round2 = (x: number) => Math.round(x * 100) / 100;
const PI = ["SHIFT", "EXP:π"];

/* ---------------- Bài 1: Căn bậc hai, căn bậc ba ---------------- */
const genRoots: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const n = nz(rng, -12, 12);
    return {
      id: qid("l9-can"), kind: "number", topic: "l9-can",
      prompt: `Tính ∛(${num(n ** 3)})`,
      answer: String(n), keys: ["SHIFT", "SQRT:∛▯", ...numKeys(n ** 3), "EQ"],
      hint: "Căn bậc ba là chữ vàng trên phím √: bấm SHIFT rồi √.",
    };
  }
  if (form === 1) {
    const s = rng.pick([2, 3, 5, 6, 7]), x = rng.int(1, 6), y = rng.int(2, 7);
    const a = s * x * x, b = s * y * y;
    return {
      id: qid("l9-can"), kind: "number", topic: "l9-can",
      prompt: `Tính √${a} · √${b}`,
      answer: String(s * x * y), keys: ["SQRT", ...numKeys(a), "RIGHT", "MUL", "SQRT", ...numKeys(b), "EQ"],
      hint: "√a · √b = √(a·b). Bấm ▶ để ra khỏi căn thứ nhất.",
    };
  }
  let x = rng.int(101, 999);
  while (Number.isInteger(Math.sqrt(x))) x++;
  return {
    id: qid("l9-can"), kind: "number", topic: "l9-can", tolerance: 0.006,
    prompt: `Tính √${x}, làm tròn đến hàng phần trăm`,
    answer: String(round2(Math.sqrt(x))), keys: ["SQRT", ...numKeys(x), "EQ", "SD"],
    hint: "Ra dạng a√b thì bấm S⇔D để có số thập phân.",
  };
};

/* ---------------- Bài 2: Hệ hai phương trình bậc nhất hai ẩn ---------------- */
const genSystem: QuestionGen = (rng) => {
  let a1 = 0, b1 = 0, a2 = 0, b2 = 0;
  do {
    a1 = nz(rng, -5, 5); b1 = nz(rng, -5, 5); a2 = nz(rng, -5, 5); b2 = nz(rng, -5, 5);
  } while (a1 * b2 - a2 * b1 === 0);
  const x = rng.int(-6, 6), y = rng.int(-6, 6);
  const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
  return {
    id: qid("l9-hpt"), kind: "pair", topic: "l9-he-pt", pairLabels: ["x", "y"],
    prompt: `Giải hệ: ${term(a1, "x", true)} ${term(b1, "y")} = ${num(c1)} và ${term(a2, "x", true)} ${term(b2, "y")} = ${num(c2)}`,
    answer: `${x};${y}`,
    keys: ["LP", ...par(c1), "MUL", ...par(b2), "SUB", ...par(c2), "MUL", ...par(b1), "RP", "DIV", "LP", ...par(a1), "MUL", ...par(b2), "SUB", ...par(a2), "MUL", ...par(b1), "RP", "EQ"],
    hint: "x = (c₁b₂ − c₂b₁) : (a₁b₂ − a₂b₁). Có x rồi thay vào một phương trình để tìm y.",
  };
};

/* ---------------- Bài 3: Phương trình bậc hai ---------------- */
const genQuadratic: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const r1 = nz(rng, -9, 9);
    let r2 = nz(rng, -9, 9);
    if (r2 === r1) r2 = r1 > 0 ? -rng.int(1, 5) : rng.int(1, 5);
    const big = Math.max(r1, r2), small = Math.min(r1, r2);
    const b = -(r1 + r2), c = r1 * r2;
    return {
      id: qid("l9-pt2"), kind: "pair", topic: "l9-pt-bac-hai", pairLabels: ["x₁ (lớn hơn)", "x₂"],
      prompt: `Giải phương trình x² ${b === 0 ? "" : term(b, "x")} ${term(c, "")} = 0`.replace("  ", " "),
      answer: `${big};${small}`,
      keys: ["LP", ...par(-b), "ADD", "SQRT", ...par(b), "POW2", "SUB", "4", "MUL", ...par(c), "RIGHT", "RP", "DIV", "2", "EQ"],
      hint: "Δ = b² − 4ac. x₁ = (−b + √Δ) : 2a, x₂ = (−b − √Δ) : 2a.",
    };
  }
  if (form === 1) {
    const a = nz(rng, -4, 4), b = rng.int(-12, 12), c = nz(rng, -15, 15);
    return {
      id: qid("l9-pt2"), kind: "number", topic: "l9-pt-bac-hai",
      prompt: `Tính Δ của phương trình ${term(a, "x²", true)} ${b === 0 ? "" : term(b, "x")} ${term(c, "")} = 0`.replace("  ", " "),
      answer: String(b * b - 4 * a * c), keys: [...par(b), "POW2", "SUB", "4", "MUL", ...par(a), "MUL", ...par(c), "EQ"],
      hint: "Δ = b² − 4ac. Δ > 0: hai nghiệm, Δ = 0: nghiệm kép, Δ < 0: vô nghiệm.",
    };
  }
  const r1 = nz(rng, -8, 8), r2 = nz(rng, -8, 8);
  const S = r1 + r2, P = r1 * r2;
  const ask = rng.pick(["tổng", "tích"] as const);
  const ans = ask === "tổng" ? S : P;
  return choiceQ(rng, {
    topic: "l9-pt-bac-hai",
    prompt: `Phương trình x² ${S === 0 ? "" : term(-S, "x")} ${term(P, "")} = 0 có hai nghiệm. ${ask === "tổng" ? "Tổng" : "Tích"} hai nghiệm bằng bao nhiêu? (dùng Vi-ét)`.replace("  ", " "),
    answer: num(ans),
    hint: "Vi-ét: x₁ + x₂ = −b/a, x₁ · x₂ = c/a.",
  }, [num(-ans), num(ans + 1), num(ask === "tổng" ? P : S)]);
};

/* ---------------- Bài 4: Tỉ số lượng giác ---------------- */
const genTrig: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const fn = rng.pick(["sin", "cos", "tan"] as const), ang = rng.int(15, 75);
    const v = Math[fn]((ang * Math.PI) / 180);
    return {
      id: qid("l9-lg"), kind: "number", topic: "l9-luong-giac", tolerance: 0.006,
      prompt: `Tính ${fn} ${ang}° (làm tròn đến hàng phần trăm)`,
      answer: String(round2(v)), keys: [fn.toUpperCase(), ...numKeys(ang), "RP", "EQ"],
      hint: "Máy đang ở chế độ độ (chữ D nhỏ trên màn hình).",
    };
  }
  if (form === 1) {
    const hyp = rng.int(5, 30), ang = rng.int(20, 70);
    return {
      id: qid("l9-lg"), kind: "number", topic: "l9-luong-giac", unit: "m", tolerance: 0.006,
      prompt: `Một chiếc thang dài ${hyp} m dựa vào tường, tạo với mặt đất góc ${ang}°. Đầu thang cao bao nhiêu mét? (làm tròn đến hàng phần trăm)`,
      answer: String(round2(hyp * Math.sin((ang * Math.PI) / 180))), keys: [...numKeys(hyp), "MUL", "SIN", ...numKeys(ang), "RP", "EQ"],
      hint: "Cạnh đối = cạnh huyền × sin góc.",
    };
  }
  const opp = rng.int(2, 12), hyp = rng.int(opp + 2, opp + 15);
  return {
    id: qid("l9-lg"), kind: "number", topic: "l9-luong-giac", unit: "°",
    prompt: `Tam giác vuông có cạnh đối ${opp} cm và cạnh huyền ${hyp} cm. Góc α bằng bao nhiêu độ? (làm tròn đến độ)`,
    answer: String(Math.round((Math.asin(opp / hyp) * 180) / Math.PI)), keys: ["SHIFT", "SIN:sin⁻¹", ...numKeys(opp), "DIV", ...numKeys(hyp), "RP", "EQ"],
    hint: "sin α = cạnh đối : cạnh huyền, nên α = sin⁻¹(đối : huyền). sin⁻¹ là SHIFT rồi sin.",
  };
};

/* ---------------- Bài 5: Đường tròn ---------------- */
const genCircle: QuestionGen = (rng) => {
  const R = rng.int(2, 25), form = rng.int(0, 3);
  if (form === 0)
    return { id: qid("l9-dt"), kind: "number", topic: "l9-duong-tron", unit: "cm", tolerance: 0.006, prompt: `Tính chu vi đường tròn bán kính ${R} cm (làm tròn đến hàng phần trăm)`, answer: String(round2(2 * Math.PI * R)), keys: ["2", ...PI, "MUL", ...numKeys(R), "EQ", "SD"], hint: "C = 2πR. π là chữ vàng trên phím ×10ˣ." };
  if (form === 1)
    return { id: qid("l9-dt"), kind: "number", topic: "l9-duong-tron", unit: "cm²", tolerance: 0.006, prompt: `Tính diện tích hình tròn bán kính ${R} cm (làm tròn đến hàng phần trăm)`, answer: String(round2(Math.PI * R * R)), keys: [...PI, "MUL", ...numKeys(R), "POW2", "EQ", "SD"], hint: "S = πR²." };
  const n = rng.pick([30, 45, 60, 72, 90, 120, 135, 150]);
  if (form === 2)
    return { id: qid("l9-dt"), kind: "number", topic: "l9-duong-tron", unit: "cm", tolerance: 0.006, prompt: `Tính độ dài cung ${n}° của đường tròn bán kính ${R} cm (làm tròn đến hàng phần trăm)`, answer: String(round2((Math.PI * R * n) / 180)), keys: [...PI, "MUL", ...numKeys(R), "MUL", ...numKeys(n), "DIV", "1", "8", "0", "EQ", "SD"], hint: "l = πRn : 180." };
  return { id: qid("l9-dt"), kind: "number", topic: "l9-duong-tron", unit: "cm²", tolerance: 0.006, prompt: `Tính diện tích hình quạt tròn ${n}°, bán kính ${R} cm (làm tròn đến hàng phần trăm)`, answer: String(round2((Math.PI * R * R * n) / 360)), keys: [...PI, "MUL", ...numKeys(R), "POW2", "MUL", ...numKeys(n), "DIV", "3", "6", "0", "EQ", "SD"], hint: "S = πR²n : 360." };
};

/* ---------------- Bài 6: Hình trụ, hình nón, hình cầu ---------------- */
const genSolids: QuestionGen = (rng) => {
  const r = rng.int(2, 12), h = rng.int(3, 20), form = rng.int(0, 3);
  if (form === 0)
    return { id: qid("l9-hk"), kind: "number", topic: "l9-hinh-khoi", unit: "cm³", tolerance: 0.006, prompt: `Tính thể tích hình trụ bán kính đáy ${r} cm, chiều cao ${h} cm (làm tròn đến hàng phần trăm)`, answer: String(round2(Math.PI * r * r * h)), keys: [...PI, "MUL", ...numKeys(r), "POW2", "MUL", ...numKeys(h), "EQ", "SD"], hint: "V = πr²h." };
  if (form === 1)
    return { id: qid("l9-hk"), kind: "number", topic: "l9-hinh-khoi", unit: "cm³", tolerance: 0.006, prompt: `Tính thể tích hình nón bán kính đáy ${r} cm, chiều cao ${h} cm (làm tròn đến hàng phần trăm)`, answer: String(round2((Math.PI * r * r * h) / 3)), keys: [...PI, "MUL", ...numKeys(r), "POW2", "MUL", ...numKeys(h), "DIV", "3", "EQ", "SD"], hint: "V = πr²h : 3, bằng một phần ba hình trụ cùng đáy, cùng chiều cao." };
  if (form === 2)
    return { id: qid("l9-hk"), kind: "number", topic: "l9-hinh-khoi", unit: "cm³", tolerance: 0.006, prompt: `Tính thể tích quả bóng hình cầu bán kính ${r} cm (làm tròn đến hàng phần trăm)`, answer: String(round2((4 / 3) * Math.PI * r ** 3)), keys: ["4", "FRAC", "3", "RIGHT", ...PI, "MUL", ...numKeys(r), "SHIFT", "POW2:x³", "EQ", "SD"], hint: "V = 4/3 πr³." };
  return { id: qid("l9-hk"), kind: "number", topic: "l9-hinh-khoi", unit: "cm²", tolerance: 0.006, prompt: `Tính diện tích mặt cầu bán kính ${r} cm (làm tròn đến hàng phần trăm)`, answer: String(round2(4 * Math.PI * r * r)), keys: ["4", ...PI, "MUL", ...numKeys(r), "POW2", "EQ", "SD"], hint: "S = 4πr²." };
};

export const PRACTICE = {
  "l9-can": [genRoots],
  "l9-he-pt": [genSystem],
  "l9-pt-bac-hai": [genQuadratic],
  "l9-luong-giac": [genTrig],
  "l9-duong-tron": [genCircle],
  "l9-hinh-khoi": [genSolids],
} satisfies Record<string, QuestionGen[]>;

