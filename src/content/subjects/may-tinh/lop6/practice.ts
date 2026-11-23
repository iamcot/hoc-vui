import type { QuestionGen } from "@/content/types";
import { factorize, factorString, frac, fracStr, gcd, isPrime, lcm, vn } from "@/lib/math";

import { choiceQ, k, qid } from "../helpers";

/* ---------------- Bài 1: Làm quen ---------------- */
const KEY_BANK: { q: string; a: string; wrong: string[]; hint?: string }[] = [
  { q: "Muốn xóa hết để làm phép tính mới, em bấm phím nào?", a: "AC", wrong: ["DEL", "ON", "SHIFT"] },
  { q: "Lỡ gõ thừa một chữ số, em xóa chữ số đó bằng phím nào?", a: "DEL", wrong: ["AC", "Ans", "ON"] },
  { q: "Muốn dùng chức năng in chữ màu vàng phía trên phím, em bấm phím nào trước?", a: "SHIFT", wrong: ["ALPHA", "MENU", "OPTN"] },
  { q: "Muốn dùng chức năng in chữ màu đỏ phía trên phím, em bấm phím nào trước?", a: "ALPHA", wrong: ["SHIFT", "MENU", "AC"] },
  { q: "Phím nào lấy lại kết quả vừa tính xong?", a: "Ans", wrong: ["=", "DEL", "M+"] },
  { q: "Kết quả đang là phân số 3/4, muốn đổi sang số thập phân 0,75 em bấm phím nào?", a: "S⇔D", wrong: ["=", "▯/▯", "x²"] },
  { q: "Muốn nhập số âm −5, em bấm phím nào trước số 5?", a: "(−)", wrong: ["−", "DEL", "x⁻¹"] },
  { q: "Phím nào dùng để bình phương một số?", a: "x²", wrong: ["x^▯", "√▯", "x⁻¹"] },
  { q: "Phím nào dùng để nhập phân số?", a: "▯/▯", wrong: ["÷", "S⇔D", "( )"] },
  { q: "Để vào bảng chọn các chế độ tính (Tính toán, Thống kê, ...), em bấm phím nào?", a: "MENU", wrong: ["SHIFT", "ON", "OPTN"] },
];
const genKeyQuiz: QuestionGen = (rng) => {
  const it = rng.pick(KEY_BANK);
  return choiceQ(rng, { prompt: it.q, answer: it.a, topic: "lam-quen" }, it.wrong);
};
const genFirstCalc: QuestionGen = (rng) => {
  const a = rng.int(120, 980), b = rng.int(45, 899);
  return {
    id: qid("lam-quen"), kind: "number", topic: "lam-quen",
    prompt: `Bấm máy tính: ${a} + ${b} = ?`,
    answer: String(a + b), keys: k(a, "+", b, "="),
  };
};

/* ---------------- Bài 2: Thứ tự thực hiện phép tính ---------------- */
const genOrder: QuestionGen = (rng) => {
  const form = rng.int(0, 4);
  const a = rng.int(12, 99), b = rng.int(2, 25), c = rng.int(2, 12);
  switch (form) {
    case 0:
      return { id: qid("phep-tinh"), kind: "number", topic: "phep-tinh", prompt: `Tính: ${a} + ${b} × ${c}`, answer: String(a + b * c), keys: k(a, "+", b, "×", c, "="), hint: "Nhân chia trước, cộng trừ sau. Máy tính tự làm đúng thứ tự này." };
    case 1:
      return { id: qid("phep-tinh"), kind: "number", topic: "phep-tinh", prompt: `Tính: (${a} + ${b}) × ${c}`, answer: String((a + b) * c), keys: k("(", a, "+", b, ")", "×", c, "="), hint: "Nhớ bấm cả hai dấu ngoặc." };
    case 2: {
      const q = rng.int(3, 30), d = rng.int(2, 9);
      const big = q * d;
      return { id: qid("phep-tinh"), kind: "number", topic: "phep-tinh", prompt: `Tính: ${a * 10} − ${big} ÷ ${d}`, answer: String(a * 10 - q), keys: k(a * 10, "-", big, "÷", d, "=") };
    }
    case 3: {
      const x = rng.int(100, 500), y = rng.int(10, 99), z = rng.int(2, 9), w = rng.int(2, 9);
      return { id: qid("phep-tinh"), kind: "number", topic: "phep-tinh", prompt: `Tính: ${x} − (${y} − ${z} × ${w})`, answer: String(x - (y - z * w)), keys: k(x, "-", "(", y, "-", z, "×", w, ")", "=") };
    }
    default: {
      const price = rng.pick([5000, 6000, 7500, 8000, 12000]), n = rng.int(3, 9), m = rng.int(2, 6), price2 = rng.pick([3000, 4000, 4500]);
      return { id: qid("phep-tinh"), kind: "number", topic: "phep-tinh", unit: "đồng", prompt: `Bạn An mua ${n} quyển vở giá ${price.toLocaleString("vi-VN")} đồng một quyển và ${m} cây bút giá ${price2.toLocaleString("vi-VN")} đồng một cây. An phải trả tất cả bao nhiêu tiền?`, answer: String(n * price + m * price2), keys: k(n, "×", price, "+", m, "×", price2, "=") };
    }
  }
};

/* ---------------- Bài 3: Lũy thừa ---------------- */
const genPower: QuestionGen = (rng) => {
  const form = rng.int(0, 3);
  if (form === 0) {
    const a = rng.int(11, 39);
    return { id: qid("luy-thua"), kind: "number", topic: "luy-thua", prompt: `Tính ${a}²`, answer: String(a * a), keys: k(a, "²", "=") };
  }
  if (form === 1) {
    const a = rng.int(4, 15);
    return { id: qid("luy-thua"), kind: "number", topic: "luy-thua", prompt: `Tính ${a}³`, answer: String(a ** 3), keys: k(a, "³", "=") };
  }
  if (form === 2) {
    const a = rng.pick([2, 3, 5]), n = a === 2 ? rng.int(6, 12) : rng.int(4, 7);
    return { id: qid("luy-thua"), kind: "number", topic: "luy-thua", prompt: `Tính ${a}^${n} (lũy thừa bậc ${n} của ${a})`, answer: String(a ** n), keys: k(a, "^", n, "▶", "=") };
  }
  const a = rng.int(2, 9), b = rng.int(2, 6), c = rng.int(2, 20);
  return { id: qid("luy-thua"), kind: "number", topic: "luy-thua", prompt: `Tính ${a}³ + ${b}^4 − ${c}`, answer: String(a ** 3 + b ** 4 - c), keys: k(a, "³", "+", b, "^", 4, "▶", "-", c, "=") };
};

/* ---------------- Bài 4: Chia có dư ---------------- */
const genRemainder: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form < 2) {
    const b = rng.int(3, 29), q = rng.int(12, 400), r = rng.int(1, b - 1);
    const a = b * q + r;
    return {
      id: qid("chia-du"), kind: "pair", topic: "chia-du", pairLabels: ["Thương", "Số dư"],
      prompt: `Chia ${a} cho ${b}. Tìm thương và số dư.`,
      answer: `${q};${r}`, keys: [...k(a), "ALPHA", "FRAC:÷R", ...k(b, "=")],
      hint: "Dùng phép chia có dư ÷R: ALPHA rồi phím phân số.",
    };
  }
  const d = rng.pick([2, 3, 5, 9]);
  const yes = rng.next() < 0.5;
  let n = rng.int(1000, 9999);
  if (yes) n -= n % d;
  else if (n % d === 0) n += 1;
  return choiceQ(rng, {
    topic: "chia-du",
    prompt: `Số ${n} có chia hết cho ${d} không?`,
    answer: n % d === 0 ? "Có, số dư bằng 0" : `Không, số dư là ${n % d}`,
    keys: [...k(n), "ALPHA", "FRAC:÷R", ...k(d, "=")],
    hint: "Chia có dư: nếu số dư R = 0 thì chia hết.",
  }, n % d === 0 ? [`Không, số dư là 1`, `Không, số dư là 2`] : ["Có, số dư bằng 0", `Không, số dư là ${(n % d) + 1}`]);
};

/* ---------------- Bài 5: Số nguyên tố, thừa số nguyên tố ---------------- */
const PRIMES = [2, 3, 5, 7, 11, 13];
const genFactor: QuestionGen = (rng) => {
  if (rng.next() < 0.3) {
    const n = rng.pick([91, 97, 101, 111, 113, 119, 127, 133, 137, 143, 149, 151, 161, 163, 169, 173, 187, 191, 197, 199, 203, 211, 221, 223, 247, 251]);
    return choiceQ(rng, {
      topic: "thua-so",
      prompt: `${n} có phải là số nguyên tố không?`,
      answer: isPrime(n) ? "Có, là số nguyên tố" : "Không, là hợp số",
      keys: [...k(n, "="), "SHIFT", "DEG:FACT"],
      explain: isPrime(n) ? `FACT chỉ ra đúng ${n}, nên ${n} là số nguyên tố.` : `${n} = ${factorString(factorize(n))}`,
    }, ["Có, là số nguyên tố", "Không, là hợp số"]);
  }
  let n = 1;
  const f: number[] = [];
  const count = rng.int(3, 5);
  for (let i = 0; i < count; i++) {
    const p = rng.pick(PRIMES.slice(0, 5));
    f.push(p);
    n *= p;
  }
  if (n < 30) n *= 2;
  const fs = factorize(n);
  const answer = factorString(fs);
  const wrong = [
    factorString(fs.map(([p, e], i) => [p, i === 0 ? e + 1 : e] as [number, number])),
    factorString(fs.map(([p, e], i) => [p, i === fs.length - 1 && e > 1 ? e - 1 : e] as [number, number]).concat(fs.length < 2 ? [[7, 1]] : [])),
    factorString(fs.map(([p, e]) => [p === 2 ? 3 : p === 3 ? 2 : p, e] as [number, number]).sort((a, b) => a[0] - b[0])),
    `${n / fs[0][0]} × ${fs[0][0]}`,
  ];
  return choiceQ(rng, {
    topic: "thua-so",
    prompt: `Phân tích ${n} ra thừa số nguyên tố.`,
    answer,
    keys: [...k(n, "="), "SHIFT", "DEG:FACT"],
  }, wrong);
};

/* ---------------- Bài 6: ƯCLN, BCNN ---------------- */
const genGcdLcm: QuestionGen = (rng) => {
  const form = rng.int(0, 3);
  const g = rng.pick([2, 3, 4, 5, 6, 8, 9, 12, 15]);
  let x = rng.int(2, 9), y = rng.int(2, 9);
  while (gcd(x, y) !== 1 || x === y) y = rng.int(2, 11);
  const a = g * x, b = g * y;
  const gk = ["ALPHA", "MUL:GCD", ...k(a, ",", b, ")", "=")];
  const lk = ["ALPHA", "DIV:LCM", ...k(a, ",", b, ")", "=")];
  if (form === 0) return { id: qid("ucln-bcnn"), kind: "number", topic: "ucln-bcnn", prompt: `Tìm ƯCLN(${a}, ${b}).`, answer: String(gcd(a, b)), keys: gk };
  if (form === 1) return { id: qid("ucln-bcnn"), kind: "number", topic: "ucln-bcnn", prompt: `Tìm BCNN(${a}, ${b}).`, answer: String(lcm(a, b)), keys: lk };
  if (form === 2) {
    const [it1, it2] = rng.pick([["bút chì", "quyển vở"], ["cái kẹo", "cái bánh"], ["bông hồng", "bông cúc"], ["quả cam", "quả táo"]]);
    return { id: qid("ucln-bcnn"), kind: "number", topic: "ucln-bcnn", unit: "phần", prompt: `Cô giáo có ${a} ${it1} và ${b} ${it2}. Cô muốn chia đều thành các phần quà giống nhau, mỗi phần có cả hai loại. Chia được nhiều nhất bao nhiêu phần quà?`, answer: String(gcd(a, b)), keys: gk, hint: "Số phần quà phải là ước chung của cả hai số, và lớn nhất." };
  }
  const p = rng.pick([6, 8, 10, 12, 15]), q = rng.pick([9, 14, 18, 20, 25]);
  return { id: qid("ucln-bcnn"), kind: "number", topic: "ucln-bcnn", unit: "phút", prompt: `Xe buýt số 1 cứ ${p} phút có một chuyến, xe số 2 cứ ${q} phút có một chuyến. Lúc 6 giờ hai xe cùng xuất bến. Sau ít nhất bao nhiêu phút hai xe lại cùng xuất bến?`, answer: String(lcm(p, q)), keys: ["ALPHA", "DIV:LCM", ...k(p, ",", q, ")", "=")], hint: "Thời gian phải là bội chung của cả hai, và nhỏ nhất." };
};

/* ---------------- Bài 7: Số nguyên ---------------- */
const genInteger: QuestionGen = (rng) => {
  const form = rng.int(0, 3);
  const a = rng.int(5, 99), b = rng.int(5, 99), c = rng.int(2, 9);
  if (form === 0) return { id: qid("so-nguyen"), kind: "number", topic: "so-nguyen", prompt: `Tính: (−${a}) + ${b}`, answer: String(-a + b), keys: k(-a, "+", b, "=") };
  if (form === 1) return { id: qid("so-nguyen"), kind: "number", topic: "so-nguyen", prompt: `Tính: (−${a}) − ${b}`, answer: String(-a - b), keys: k(-a, "-", b, "=") };
  if (form === 2) return { id: qid("so-nguyen"), kind: "number", topic: "so-nguyen", prompt: `Tính: (−${a}) × (−${c})`, answer: String(a * c), keys: k(-a, "×", -c, "="), hint: "Âm nhân âm ra dương." };
  const t1 = rng.int(-15, -1), t2 = rng.int(5, 30);
  return { id: qid("so-nguyen"), kind: "number", topic: "so-nguyen", unit: "°C", prompt: `Buổi sáng ở Sa Pa nhiệt độ là ${t1}°C, đến trưa tăng thêm ${t2}°C. Nhiệt độ buổi trưa là bao nhiêu?`, answer: String(t1 + t2), keys: k(t1, "+", t2, "=") };
};

/* ---------------- Bài 8: Phân số ---------------- */
const genFraction: QuestionGen = (rng) => {
  const form = rng.int(0, 3);
  const b = rng.int(2, 9), d = rng.int(2, 9);
  const a = rng.int(1, b * 2), c = rng.int(1, d * 2);
  if (form === 0) {
    const r = frac(a * d + c * b, b * d);
    return { id: qid("phan-so"), kind: "fraction", reduced: true, topic: "phan-so", prompt: `Tính ${a}/${b} + ${c}/${d} (viết dạng phân số tối giản, ví dụ 7/6)`, answer: fracStr(r), keys: k(a, "/", b, "▶", "+", c, "/", d, "=") };
  }
  if (form === 1) {
    const r = frac(a * c, b * d);
    return { id: qid("phan-so"), kind: "fraction", reduced: true, topic: "phan-so", prompt: `Tính ${a}/${b} × ${c}/${d} (phân số tối giản)`, answer: fracStr(r), keys: k(a, "/", b, "▶", "×", c, "/", d, "=") };
  }
  if (form === 2) {
    const g = rng.int(2, 12), n = rng.int(1, 9), m = rng.int(n + 1, 13);
    const r = frac(n, m);
    return { id: qid("phan-so"), kind: "fraction", reduced: true, topic: "phan-so", prompt: `Rút gọn phân số ${n * g}/${m * g} về tối giản.`, answer: fracStr(r), keys: k(n * g, "/", m * g, "="), hint: "Nhập phân số rồi bấm =, máy tự rút gọn." };
  }
  const w = rng.int(1, 5), n = rng.int(1, 4), m = rng.int(n + 1, 7);
  const r = frac(w * m + n, m);
  return { id: qid("phan-so"), kind: "fraction", topic: "phan-so", prompt: `Viết hỗn số ${w} ${n}/${m} dưới dạng phân số.`, answer: `${w * m + n}/${m}`, keys: ["SHIFT", "FRAC:▯▯/▯", ...k(w, "▶", n, "▶", m, "=")], explain: `${w} ${n}/${m} = (${w} × ${m} + ${n})/${m} = ${fracStr(r)}` };
};

/* ---------------- Bài 9: Số thập phân, phần trăm ---------------- */
const genPercent: QuestionGen = (rng) => {
  const form = rng.int(0, 3);
  if (form === 0) {
    const p = rng.pick([5, 10, 12, 15, 20, 25, 30, 40, 75]), n = rng.int(4, 60) * 20;
    return { id: qid("phan-tram"), kind: "number", topic: "phan-tram", prompt: `Tính ${p}% của ${n}.`, answer: vn((p * n) / 100), keys: k(n, "×", p, "%", "=") };
  }
  if (form === 1) {
    const total = rng.pick([20, 25, 40, 50, 80]), part = rng.int(1, total - 1);
    return { id: qid("phan-tram"), kind: "number", topic: "phan-tram", unit: "%", prompt: `Lớp có ${total} bạn, trong đó ${part} bạn thích đá cầu. Số bạn thích đá cầu chiếm bao nhiêu phần trăm?`, answer: vn((part / total) * 100), keys: k(part, "÷", total, "%", "="), tolerance: 0.01 };
  }
  if (form === 2) {
    const price = rng.int(5, 40) * 10000, off = rng.pick([10, 15, 20, 25, 30]);
    return { id: qid("phan-tram"), kind: "number", topic: "phan-tram", unit: "đồng", prompt: `Một chiếc cặp giá ${price.toLocaleString("vi-VN")} đồng, được giảm ${off}%. Giá sau khi giảm là bao nhiêu?`, answer: String((price * (100 - off)) / 100), keys: k(price, "-", price, "×", off, "%", "=") };
  }
  const x = rng.int(100, 999) / 100, y = rng.int(11, 99) / 10;
  const prod = Math.round(x * y * 10) / 10;
  return { id: qid("phan-tram"), kind: "number", topic: "phan-tram", prompt: `Tính ${vn(x)} × ${vn(y)} rồi làm tròn kết quả đến hàng phần mười.`, answer: vn(prod), keys: k(x, "×", y, "="), hint: "Nhìn chữ số hàng phần trăm: từ 5 trở lên thì làm tròn lên." };
};

/* ---------------- Bài 10: Chu vi, diện tích ---------------- */
const genGeometry: QuestionGen = (rng) => {
  const form = rng.int(0, 4);
  if (form === 0) {
    const a = rng.int(12, 60), b = rng.int(5, a - 1);
    return { id: qid("hinh-hoc"), kind: "number", topic: "hinh-hoc", unit: "m", prompt: `Một mảnh vườn hình chữ nhật dài ${a} m, rộng ${b} m. Tính chu vi mảnh vườn.`, answer: String(2 * (a + b)), keys: k(2, "×", "(", a, "+", b, ")", "=") };
  }
  if (form === 1) {
    const d1 = rng.int(4, 30) * 2, d2 = rng.int(3, 25);
    return { id: qid("hinh-hoc"), kind: "number", topic: "hinh-hoc", unit: "cm²", prompt: `Hình thoi có hai đường chéo dài ${d1} cm và ${d2} cm. Tính diện tích hình thoi.`, answer: String((d1 * d2) / 2), keys: k(d1, "×", d2, "÷", 2, "="), hint: "Diện tích hình thoi = tích hai đường chéo chia 2." };
  }
  if (form === 2) {
    const a = rng.int(5, 40), h = rng.int(3, 30);
    return { id: qid("hinh-hoc"), kind: "number", topic: "hinh-hoc", unit: "cm²", prompt: `Hình bình hành có cạnh đáy ${a} cm, chiều cao ${h} cm. Tính diện tích.`, answer: String(a * h), keys: k(a, "×", h, "=") };
  }
  if (form === 3) {
    const a = rng.int(10, 40), b = rng.int(4, a - 2), h = rng.int(2, 15) * 2;
    return { id: qid("hinh-hoc"), kind: "number", topic: "hinh-hoc", unit: "m²", prompt: `Một thửa ruộng hình thang có hai đáy ${a} m và ${b} m, chiều cao ${h} m. Tính diện tích thửa ruộng.`, answer: String(((a + b) * h) / 2), keys: k("(", a, "+", b, ")", "×", h, "÷", 2, "="), hint: "Diện tích hình thang = (đáy lớn + đáy bé) × chiều cao : 2." };
  }
  const a = rng.int(3, 9), b = rng.int(3, 8), price = rng.pick([150000, 180000, 220000]);
  const area = a * b;
  return { id: qid("hinh-hoc"), kind: "number", topic: "hinh-hoc", unit: "đồng", prompt: `Nền phòng hình chữ nhật dài ${a} m, rộng ${b} m. Giá lát gạch là ${price.toLocaleString("vi-VN")} đồng cho mỗi mét vuông. Lát kín nền phòng hết bao nhiêu tiền?`, answer: String(area * price), keys: k(a, "×", b, "×", price, "="), explain: `Diện tích ${area} m², nhân với giá mỗi mét vuông.` };
};

export const PRACTICE = {
  "lam-quen": [genKeyQuiz, genKeyQuiz, genFirstCalc],
  "phep-tinh": [genOrder],
  "luy-thua": [genPower],
  "chia-du": [genRemainder],
  "thua-so": [genFactor],
  "ucln-bcnn": [genGcdLcm],
  "so-nguyen": [genInteger],
  "phan-so": [genFraction],
  "phan-tram": [genPercent],
  "hinh-hoc": [genGeometry],
} satisfies Record<string, QuestionGen[]>;
