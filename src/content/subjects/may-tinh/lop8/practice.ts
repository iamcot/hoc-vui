import type { QuestionGen } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { numKeys } from "@/content/devices/fx580";
import { frac, fracStr } from "@/lib/math";
import { choiceQ, k, qid } from "../helpers";

/* Bộ sinh bài tập trình độ lớp 8 (Toán 8, GDPT 2018) trên fx-580VN X. */

const nz = (rng: Rng, lo: number, hi: number) => {
  let x = 0;
  while (x === 0) x = rng.int(lo, hi);
  return x;
};
/** số trong ngoặc nếu âm: phím và chữ */
const par = (x: number) => (x < 0 ? ["LP", "NEG", ...numKeys(-x), "RP"] : numKeys(x));
const signed = (x: number) => (x < 0 ? `− ${-x}` : `+ ${x}`);
/** hạng tử có biến: 1x → x, −1x → −x; first = đứng đầu biểu thức */
const term = (c: number, v: string, first = false) => {
  const abs = Math.abs(c) === 1 ? "" : String(Math.abs(c));
  return first ? `${c < 0 ? "−" : ""}${abs}${v}` : `${c < 0 ? "−" : "+"} ${abs}${v}`;
};
const round2 = (x: number) => Math.round(x * 100) / 100;

/* ---------------- Bài 1: Giá trị của đa thức ---------------- */
const genPolyValue: QuestionGen = (rng) => {
  const a = nz(rng, -5, 5), b = nz(rng, -9, 9), c = rng.int(-20, 20), x = nz(rng, -6, 6);
  const val = a * x * x + b * x + c;
  const keys = [...numKeys(a), "MUL", ...par(x), "POW2", "ADD", ...numKeys(b), "MUL", ...par(x), c < 0 ? "SUB" : "ADD", ...numKeys(Math.abs(c)), "EQ"];
  return {
    id: qid("l8-gt"), kind: "number", topic: "l8-gia-tri",
    prompt: `Tính giá trị của P = ${term(a, "x²", true)} ${term(b, "x")}${c === 0 ? "" : " " + signed(c)} tại x = ${x < 0 ? "−" + -x : x}`,
    answer: String(val), keys,
    hint: "Thay x bằng số. Số âm phải đặt trong ngoặc trước khi bình phương.",
  };
};

/* ---------------- Bài 2: Hằng đẳng thức ---------------- */
const genIdentity: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const base = rng.pick([20, 30, 40, 50, 60, 70, 80, 100]), d = rng.int(1, 3) * rng.pick([1, -1]);
    const n = base + d;
    return {
      id: qid("l8-hdt"), kind: "number", topic: "l8-hang-dang-thuc",
      prompt: `Tính nhanh ${n}² (gợi ý: ${n} = ${base} ${d > 0 ? "+" : "−"} ${Math.abs(d)})`,
      answer: String(n * n), keys: k(n, "²", "="),
      hint: `(a ${d > 0 ? "+" : "−"} b)² = a² ${d > 0 ? "+" : "−"} 2ab + b². Tính nhẩm rồi bấm máy kiểm tra.`,
    };
  }
  if (form === 1) {
    const base = rng.pick([30, 40, 50, 60, 100]), d = rng.int(1, 4);
    return {
      id: qid("l8-hdt"), kind: "number", topic: "l8-hang-dang-thuc",
      prompt: `Tính nhanh ${base + d} × ${base - d}`,
      answer: String((base + d) * (base - d)), keys: k(base + d, "×", base - d, "="),
      hint: `(a + b)(a − b) = a² − b² = ${base}² − ${d}².`,
    };
  }
  const forms: [string, string, string[]][] = [
    ["(a + b)²", "a² + 2ab + b²", ["a² + b²", "a² + ab + b²", "a² − 2ab + b²"]],
    ["(a − b)²", "a² − 2ab + b²", ["a² − b²", "a² + 2ab + b²", "a² − ab + b²"]],
    ["a² − b²", "(a − b)(a + b)", ["(a − b)²", "(a + b)²", "(a − b)(a − b)"]],
    ["(a + b)³", "a³ + 3a²b + 3ab² + b³", ["a³ + b³", "a³ + 3ab + b³", "a³ + 2a²b + 2ab² + b³"]],
    ["a³ − b³", "(a − b)(a² + ab + b²)", ["(a − b)³", "(a − b)(a² − ab + b²)", "(a + b)(a² − ab + b²)"]],
  ];
  const [q, a, wrong] = rng.pick(forms);
  return choiceQ(rng, { topic: "l8-hang-dang-thuc", prompt: `${q} bằng biểu thức nào?`, answer: a, hint: "Thử a = 2, b = 1 rồi bấm máy so hai vế." }, wrong);
};

/* ---------------- Bài 3: Phương trình bậc nhất ---------------- */
const genLinearEq: QuestionGen = (rng) => {
  let a = nz(rng, -9, 9), c = nz(rng, -9, 9);
  while (a === c) c = nz(rng, -9, 9);
  const b = rng.int(-30, 30), d = rng.int(-30, 30);
  const x = frac(d - b, a - c);
  return {
    id: qid("l8-pt"), kind: "fraction", reduced: true, topic: "l8-phuong-trinh",
    prompt: `Giải phương trình ${term(a, "x", true)}${b === 0 ? "" : " " + signed(b)} = ${term(c, "x", true)}${d === 0 ? "" : " " + signed(d)} (ghi x dưới dạng số nguyên hoặc phân số tối giản)`,
    answer: fracStr(x), keys: ["LP", ...par(d), "SUB", ...par(b), "RP", "DIV", "LP", ...par(a), "SUB", ...par(c), "RP", "EQ"],
    hint: "Chuyển x sang một vế: (a − c)x = d − b, nên x = (d − b) : (a − c).",
  };
};

/* ---------------- Bài 4: Định lí Pythagore ---------------- */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20]];
const genPythagoras: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const [a, b, c] = rng.pick(TRIPLES);
    return {
      id: qid("l8-py"), kind: "number", topic: "l8-pythagore", unit: "cm",
      prompt: `Tam giác vuông có hai cạnh góc vuông ${a} cm và ${b} cm. Cạnh huyền dài bao nhiêu?`,
      answer: String(c), keys: ["SQRT", ...numKeys(a), "POW2", "ADD", ...numKeys(b), "POW2", "EQ"],
      hint: "Cạnh huyền = √(a² + b²).",
    };
  }
  if (form === 1) {
    const a = rng.int(3, 15), c = rng.int(a + 2, a + 12);
    return {
      id: qid("l8-py"), kind: "number", topic: "l8-pythagore", unit: "cm", tolerance: 0.006,
      prompt: `Tam giác vuông có cạnh huyền ${c} cm, một cạnh góc vuông ${a} cm. Tính cạnh góc vuông còn lại (làm tròn đến hàng phần trăm).`,
      answer: String(round2(Math.sqrt(c * c - a * a))), keys: ["SQRT", ...numKeys(c), "POW2", "SUB", ...numKeys(a), "POW2", "EQ", "SD"],
      hint: "Cạnh góc vuông = √(cạnh huyền² − cạnh kia²).",
    };
  }
  const right = rng.next() < 0.5;
  const [a, b, c0] = rng.pick(TRIPLES);
  const c = right ? c0 : c0 + 1;
  return choiceQ(rng, {
    topic: "l8-pythagore",
    prompt: `Tam giác có ba cạnh ${a} cm, ${b} cm, ${c} cm có phải tam giác vuông không?`,
    answer: right ? "Có, vì a² + b² = c²" : "Không, vì a² + b² ≠ c²",
    keys: k(a, "²", "+", b, "²", "-", c, "²", "="),
    hint: "Bấm a² + b² − c². Ra 0 thì là tam giác vuông.",
  }, [right ? "Không, vì a² + b² ≠ c²" : "Có, vì a² + b² = c²", "Chỉ khi a = b"]);
};

/* ---------------- Bài 5: Hàm số bậc nhất ---------------- */
const genLinearFn: QuestionGen = (rng) => {
  const a = nz(rng, -6, 6), b = rng.int(-15, 15);
  const form = rng.int(0, 1);
  const fx = `y = ${term(a, "x", true)}${b === 0 ? "" : " " + signed(b)}`;
  if (form === 0) {
    const x = nz(rng, -8, 8);
    return {
      id: qid("l8-hs"), kind: "number", topic: "l8-ham-so",
      prompt: `Cho hàm số ${fx}. Tính y khi x = ${x < 0 ? "−" + -x : x}.`,
      answer: String(a * x + b), keys: [...numKeys(a), "MUL", ...par(x), b < 0 ? "SUB" : "ADD", ...numKeys(Math.abs(b)), "EQ"],
    };
  }
  const x = rng.int(-8, 8), y = a * x + b;
  return {
    id: qid("l8-hs"), kind: "number", topic: "l8-ham-so",
    prompt: `Cho hàm số ${fx}. Tìm x để y = ${y < 0 ? "−" + -y : y}.`,
    answer: String(x), keys: ["LP", ...par(y), "SUB", ...par(b), "RP", "DIV", ...par(a), "EQ"],
    hint: "x = (y − b) : a.",
  };
};

/* ---------------- Bài 6: Xác suất ---------------- */
const genProbability: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const red = rng.int(2, 9), blue = rng.int(2, 9), green = rng.int(1, 6);
    const total = red + blue + green;
    return {
      id: qid("l8-xs"), kind: "fraction", reduced: true, topic: "l8-xac-suat",
      prompt: `Hộp có ${red} bi đỏ, ${blue} bi xanh, ${green} bi vàng. Lấy ngẫu nhiên 1 viên. Xác suất lấy được bi đỏ là bao nhiêu? (phân số tối giản)`,
      answer: fracStr(frac(red, total)), keys: [...numKeys(red), "FRAC", ...numKeys(total), "EQ"],
      hint: "Xác suất = số kết quả thuận lợi : tổng số kết quả có thể.",
    };
  }
  if (form === 1) {
    const evens = [2, 4, 6];
    const kind = rng.pick(["chẵn", "lớn hơn 4", "là số nguyên tố"] as const);
    const fav = kind === "chẵn" ? evens.length : kind === "lớn hơn 4" ? 2 : 3;
    return {
      id: qid("l8-xs"), kind: "fraction", reduced: true, topic: "l8-xac-suat",
      prompt: `Gieo một con xúc xắc 6 mặt. Xác suất mặt xuất hiện ${kind} là bao nhiêu? (phân số tối giản)`,
      answer: fracStr(frac(fav, 6)), keys: [...numKeys(fav), "FRAC", "6", "EQ"],
      hint: "Đếm số mặt thỏa mãn rồi chia cho 6.",
    };
  }
  const trials = rng.pick([20, 25, 40, 50, 80, 100]), heads = rng.int(Math.floor(trials * 0.3), Math.floor(trials * 0.7));
  return {
    id: qid("l8-xs"), kind: "number", topic: "l8-xac-suat",
    prompt: `Tung đồng xu ${trials} lần, có ${heads} lần mặt ngửa. Xác suất thực nghiệm của mặt ngửa là bao nhiêu? (viết dạng số thập phân)`,
    answer: String(heads / trials), keys: [...numKeys(heads), "DIV", ...numKeys(trials), "EQ", "SD"],
    hint: "Xác suất thực nghiệm = số lần xảy ra : tổng số lần thử.",
  };
};

export const PRACTICE = {
  "l8-gia-tri": [genPolyValue],
  "l8-hang-dang-thuc": [genIdentity],
  "l8-phuong-trinh": [genLinearEq],
  "l8-pythagore": [genPythagoras],
  "l8-ham-so": [genLinearFn],
  "l8-xac-suat": [genProbability],
} satisfies Record<string, QuestionGen[]>;

