import type { QuestionGen } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { numKeys } from "@/content/devices/fx580";
import { frac, fracStr, vn } from "@/lib/math";
import { choiceQ, k, qid } from "../helpers";

/* Bộ sinh bài tập trình độ lớp 7 (Toán 7, GDPT 2018) trên fx-580VN X. */

/** Phím cho một số nguyên, số âm dùng phím (−). */
const n = (x: number) => (x < 0 ? ["NEG", ...numKeys(-x)] : numKeys(x));
/** Phím cho phân số a/b (a có thể âm), thoát khỏi ô mẫu bằng ▶. */
const f = (a: number, b: number) => [...n(a), "FRAC", ...numKeys(b), "RIGHT"];
/** Viết phân số trong đề: (−3/4) có ngoặc khi âm. */
const fs = (a: number, b: number) => (a < 0 ? `(${a}/${b})`.replace("-", "−") : `${a}/${b}`);
const nz = (rng: Rng, lo: number, hi: number) => {
  let x = 0;
  while (x === 0) x = rng.int(lo, hi);
  return x;
};
const round2 = (x: number) => Math.round(x * 100) / 100;

/* ---------------- Bài 1: Số hữu tỉ ---------------- */
const genRational: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    // cộng trừ phân số có số âm
    const b = rng.pick([3, 4, 5, 6, 8]), d = rng.pick([2, 3, 4, 6, 9, 10]);
    const a = nz(rng, -7, 7), c = nz(rng, -7, 7);
    const op = rng.pick(["+", "-"] as const);
    const r = frac(a * d + (op === "+" ? 1 : -1) * c * b, b * d);
    return {
      id: qid("l7-huu-ti"), kind: "fraction", reduced: true, topic: "l7-huu-ti",
      prompt: `Tính ${fs(a, b)} ${op === "+" ? "+" : "−"} ${fs(c, d)} (phân số tối giản)`,
      answer: fracStr(r), keys: [...f(a, b), op === "+" ? "ADD" : "SUB", ...f(c, d), "EQ"],
      hint: "Số âm thì bấm phím (−) trước tử số. Nhớ ▶ để ra khỏi phân số.",
    };
  }
  if (form === 1) {
    // trộn số thập phân và phân số
    const dec = rng.pick([0.5, 1.25, 0.75, 2.5, 0.2, 1.5]);
    const b = rng.pick([3, 4, 6, 8]), a = rng.int(1, b * 2);
    const res = frac(Math.round(dec * 100) * b - a * 100, 100 * b);
    return {
      id: qid("l7-huu-ti"), kind: "fraction", reduced: true, topic: "l7-huu-ti",
      prompt: `Tính ${vn(dec)} − ${a}/${b} (phân số tối giản)`,
      answer: fracStr(res), keys: [...decKeys(dec), "SUB", ...f(a, b), "EQ"],
      hint: "Máy tự đổi số thập phân sang phân số. Ra số thập phân thì bấm S⇔D để đổi lại phân số.",
    };
  }
  // so sánh hai số hữu tỉ bằng S⇔D
  const b = rng.pick([7, 9, 11, 13]), d = rng.pick([6, 8, 12, 15]);
  const a = rng.int(2, b - 1);
  let c = rng.int(2, d - 1);
  if (a * d === c * b) c = c + 1 < d ? c + 1 : c - 1;
  const bigger = a / b > c / d ? `${a}/${b}` : `${c}/${d}`;
  return choiceQ(rng, {
    topic: "l7-huu-ti",
    prompt: `Số nào lớn hơn: ${a}/${b} hay ${c}/${d}?`,
    answer: bigger,
    keys: [...f(a, b), "EQ", "SD"],
    hint: "Nhập từng phân số, bấm = rồi S⇔D để xem số thập phân, so sánh hai số thập phân.",
  }, [bigger === `${a}/${b}` ? `${c}/${d}` : `${a}/${b}`, "Bằng nhau"]);
};

function decKeys(x: number): string[] {
  const [i, d] = String(x).split(".");
  return d ? [...numKeys(+i), "DOT", ...d.split("")] : numKeys(+i);
}

/* ---------------- Bài 2: Lũy thừa số hữu tỉ ---------------- */
const genRationalPower: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    // (−a)^n với ngoặc
    const a = rng.int(2, 5), e = rng.int(2, 5);
    return {
      id: qid("l7-luy-thua"), kind: "number", topic: "l7-luy-thua",
      prompt: `Tính (−${a})^${e}`,
      answer: String((-a) ** e), keys: ["LP", "NEG", ...numKeys(a), "RP", "POW", ...numKeys(e), "RIGHT", "EQ"],
      hint: "Cơ số âm phải đặt trong ngoặc. Không có ngoặc máy hiểu là −(a^n).",
    };
  }
  if (form === 1) {
    // (a/b)^n
    const a = nz(rng, -3, 3), b = rng.pick([2, 3, 4, 5]), e = rng.int(2, 3);
    const r = frac(a ** e, b ** e);
    return {
      id: qid("l7-luy-thua"), kind: "fraction", reduced: true, topic: "l7-luy-thua",
      prompt: `Tính (${fs(a, b).replace(/[()]/g, "")})^${e}`,
      answer: fracStr(r), keys: ["LP", ...f(a, b), "RP", "POW", ...numKeys(e), "RIGHT", "EQ"],
    };
  }
  // tích, thương lũy thừa cùng cơ số
  const a = rng.pick([2, 3]), m = rng.int(3, 7), p = rng.int(2, 5), q = rng.int(1, m + p - 1);
  return choiceQ(rng, {
    topic: "l7-luy-thua",
    prompt: `Rút gọn ${a}^${m} · ${a}^${p} : ${a}^${q} về dạng một lũy thừa`,
    answer: `${a}^${m + p - q}`,
    keys: [...numKeys(a), "POW", ...numKeys(m), "RIGHT", "MUL", ...numKeys(a), "POW", ...numKeys(p), "RIGHT", "DIV", ...numKeys(a), "POW", ...numKeys(q), "RIGHT", "EQ"],
    hint: "Nhân thì cộng số mũ, chia thì trừ số mũ. Bấm máy để kiểm tra lại giá trị.",
  }, [`${a}^${m * p - q}`, `${a}^${m + p + q}`, `${a}^${m - p + q}`]);
};

/* ---------------- Bài 3: Căn bậc hai, làm tròn ---------------- */
const genSqrt: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const r = rng.int(11, 40);
    return {
      id: qid("l7-can"), kind: "number", topic: "l7-can-bac-hai",
      prompt: `Tính √${r * r}`,
      answer: String(r), keys: ["SQRT", ...numKeys(r * r), "EQ"],
    };
  }
  if (form === 1) {
    let x = rng.int(2, 99);
    while (Number.isInteger(Math.sqrt(x))) x++;
    return {
      id: qid("l7-can"), kind: "number", topic: "l7-can-bac-hai",
      prompt: `Tính √${x}, làm tròn đến hàng phần trăm (2 chữ số sau dấu phẩy)`,
      answer: String(round2(Math.sqrt(x))), keys: ["SQRT", ...numKeys(x), "EQ", "SD"],
      hint: "Máy hiện dạng căn thì bấm S⇔D để ra số thập phân, rồi làm tròn.",
    };
  }
  // cạnh hình vuông biết diện tích
  let s = rng.int(20, 300);
  while (Number.isInteger(Math.sqrt(s))) s++;
  return {
    id: qid("l7-can"), kind: "number", topic: "l7-can-bac-hai", unit: "m",
    prompt: `Một mảnh vườn hình vuông có diện tích ${s} m². Cạnh vườn dài bao nhiêu mét? (làm tròn đến hàng phần mười)`,
    answer: String(Math.round(Math.sqrt(s) * 10) / 10), keys: ["SQRT", ...numKeys(s), "EQ", "SD"],
    hint: "Cạnh hình vuông = √(diện tích).",
  };
};

/* ---------------- Bài 4: Tỉ lệ thức, dãy tỉ số bằng nhau ---------------- */
const genProportion: QuestionGen = (rng) => {
  const form = rng.int(0, 1);
  if (form === 0) {
    const kk = rng.int(2, 9), b = rng.int(2, 12), d = rng.int(2, 15);
    const a = kk * b, x = kk * d;
    return {
      id: qid("l7-tlt"), kind: "number", topic: "l7-ti-le-thuc",
      prompt: `Tìm x biết ${a}/${b} = x/${d}`,
      answer: String(x), keys: k(a, "×", d, "÷", b, "="),
      hint: "Nhân chéo: x = (a × d) : b.",
    };
  }
  const p = rng.int(2, 5), q = rng.int(p + 1, 9), unit = rng.int(3, 20);
  const total = (p + q) * unit;
  return {
    id: qid("l7-tlt"), kind: "pair", topic: "l7-ti-le-thuc", pairLabels: ["x", "y"],
    prompt: `Tìm x, y biết x/${p} = y/${q} và x + y = ${total}`,
    answer: `${p * unit};${q * unit}`, keys: k(total, "÷", "(", p, "+", q, ")", "×", p, "="),
    hint: "Dãy tỉ số bằng nhau: x/p = y/q = (x + y)/(p + q). Tính giá trị chung trước.",
  };
};

/* ---------------- Bài 5: Đại lượng tỉ lệ thuận, nghịch ---------------- */
const genRatio: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const price = rng.pick([12, 15, 18, 25, 35]) * 1000, a = rng.int(2, 6), b = rng.int(7, 15);
    return {
      id: qid("l7-tl"), kind: "number", topic: "l7-ti-le", unit: "đồng",
      prompt: `Mua ${a} quyển vở hết ${(price * a).toLocaleString("vi-VN")} đồng. Mua ${b} quyển như thế hết bao nhiêu tiền?`,
      answer: String(price * b), keys: k(price * a, "÷", a, "×", b, "="),
      hint: "Số vở và số tiền là hai đại lượng tỉ lệ thuận.",
    };
  }
  if (form === 1) {
    const workers = rng.pick([4, 6, 8, 10, 12]), days = rng.pick([6, 9, 12, 15, 18]);
    const opts = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30].filter((w) => w !== workers && (workers * days) % w === 0);
    const w2 = rng.pick(opts.length ? opts : [workers * 2]);
    return {
      id: qid("l7-tl"), kind: "number", topic: "l7-ti-le", unit: "ngày",
      prompt: `${workers} bạn làm xong một khu vườn trong ${days} ngày. Nếu có ${w2} bạn (làm như nhau) thì xong trong mấy ngày?`,
      answer: String((workers * days) / w2), keys: k(workers, "×", days, "÷", w2, "="),
      hint: "Số người và số ngày tỉ lệ nghịch: tích không đổi.",
    };
  }
  const a = rng.int(2, 4), b = rng.int(a + 1, 6), c = rng.int(b + 1, 8), unit = rng.pick([5, 10, 15, 20]);
  const total = (a + b + c) * unit * 1000;
  return {
    id: qid("l7-tl"), kind: "number", topic: "l7-ti-le", unit: "đồng",
    prompt: `Chia ${total.toLocaleString("vi-VN")} đồng cho ba bạn theo tỉ lệ ${a} : ${b} : ${c}. Bạn được nhiều nhất nhận bao nhiêu?`,
    answer: String(c * unit * 1000), keys: k(total, "÷", "(", a, "+", b, "+", c, ")", "×", c, "="),
    hint: "Một phần = tổng : (a + b + c). Bạn thứ ba được c phần.",
  };
};

/* ---------------- Bài 6: Số trung bình, biểu đồ hình quạt ---------------- */
const genStats: QuestionGen = (rng) => {
  const form = rng.int(0, 2);
  if (form === 0) {
    const xs = Array.from({ length: rng.int(4, 6) }, () => rng.int(5, 10));
    const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
    const keys: (string | number)[] = ["("];
    xs.forEach((x, i) => keys.push(...(i ? ["+", x] : [x])));
    keys.push(")", "÷", xs.length, "=");
    return {
      id: qid("l7-tb"), kind: "number", topic: "l7-trung-binh", tolerance: 0.005,
      prompt: `Điểm kiểm tra của Na: ${xs.join("; ")}. Tính điểm trung bình (làm tròn đến hàng phần trăm).`,
      answer: String(round2(mean)), keys: k(...keys),
      hint: "Trung bình = tổng các điểm : số bài. Nhớ đóng ngoặc tổng.",
    };
  }
  if (form === 1) {
    const vals = [rng.int(6, 7), 8, rng.int(9, 10)];
    const cnt = vals.map(() => rng.int(2, 9));
    const N = cnt.reduce((s, c) => s + c, 0);
    const mean = vals.reduce((s, v, i) => s + v * cnt[i], 0) / N;
    const keys: (string | number)[] = ["("];
    vals.forEach((v, i) => keys.push(...(i ? ["+", v, "×", cnt[i]] : [v, "×", cnt[i]])));
    keys.push(")", "÷", N, "=");
    return {
      id: qid("l7-tb"), kind: "number", topic: "l7-trung-binh", tolerance: 0.005,
      prompt: `Lớp 7A: ${cnt[0]} bạn được ${vals[0]} điểm, ${cnt[1]} bạn được ${vals[1]} điểm, ${cnt[2]} bạn được ${vals[2]} điểm. Điểm trung bình cả nhóm là bao nhiêu? (làm tròn đến hàng phần trăm)`,
      answer: String(round2(mean)), keys: k(...keys),
      hint: "Nhân mỗi điểm với số bạn, cộng lại, rồi chia cho tổng số bạn.",
    };
  }
  const part = rng.int(3, 18), N = rng.pick([20, 24, 30, 36, 40, 45]);
  const p = Math.min(part, N - 1);
  return {
    id: qid("l7-tb"), kind: "number", topic: "l7-trung-binh", unit: "%", tolerance: 0.05,
    prompt: `Lớp có ${N} bạn, ${p} bạn thích bóng đá. Trên biểu đồ hình quạt, phần "bóng đá" chiếm bao nhiêu phần trăm? (làm tròn đến hàng phần mười)`,
    answer: String(Math.round((p / N) * 1000) / 10), keys: k(p, "÷", N, "×", 100, "="),
    hint: "Tỉ lệ phần trăm = số bạn thích : tổng số bạn × 100.",
  };
};

export const PRACTICE = {
  "l7-huu-ti": [genRational],
  "l7-luy-thua": [genRationalPower],
  "l7-can-bac-hai": [genSqrt],
  "l7-ti-le-thuc": [genProportion],
  "l7-ti-le": [genRatio],
  "l7-trung-binh": [genStats],
} satisfies Record<string, QuestionGen[]>;
