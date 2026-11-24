import type { Question, QuestionGen } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { DIR_ARROW, DIR_NAME, turnLeft, turnRight, type Dir } from "@/lib/code/world";

/**
 * Câu hỏi trắc nghiệm Trung cấp, Nâng cao (dùng cho thử thách vượt cấp, kiểm tra trình độ, đấu trường).
 * Đáp án đều tự tính, không ghi tay.
 */

function choiceQ(topic: string, prompt: string, answer: string, wrong: string[], rng: Rng, extra: Partial<Question> = {}): Question {
  const choices = rng.shuffle([answer, ...[...new Set(wrong)].filter((w) => w !== answer).slice(0, 3)]);
  return { id: `${topic}-${prompt}`, prompt, kind: "choice", answer, choices, topic, ...extra };
}
const near = (ans: number, rng: Rng, label = (x: number) => String(x)) => {
  const out = new Set<number>();
  for (const d of rng.shuffle([-2, -1, 1, 2, 3])) if (ans + d >= 0 && out.size < 3) out.add(ans + d);
  return [...out].map(label);
};
const dirLabel = (d: Dir) => `${DIR_ARROW[d]} ${DIR_NAME[d]}`;
const fmtList = (a: number[]) => `[${a.join(", ")}]`;

// ───────────── Trung cấp ─────────────

/** lt-c01: n đổi qua các khối thì cuối cùng bằng mấy */
export const qVarValue: QuestionGen = (rng) => {
  const a = rng.int(1, 5);
  const k = rng.int(2, 4);
  const b = rng.int(1, 3);
  const ans = a + k * b;
  return choiceQ(
    "lt-bien",
    `Chạy: **n = ${a}**, rồi **Lặp ${k} lần (n tăng thêm ${b})**. Cuối cùng trong hộp n là số mấy?`,
    String(ans),
    [String(a + b), String(a * k), String(k * b), ...near(ans, rng)],
    rng,
    { hint: "Mỗi vòng lặp cộng thêm vào hộp n. Đếm số vòng nhé." },
  );
};

/** lt-c01: xoắn ốc, n lớn dần thì đi tổng cộng mấy ô */
export const qVarGrow: QuestionGen = (rng) => {
  const a = rng.int(1, 3);
  const k = rng.int(3, 4);
  let ans = 0;
  for (let i = 0; i < k; i++) ans += a + i;
  return choiceQ(
    "lt-bien-tang",
    `Chạy: **n = ${a}** · **Lặp ${k} lần (Lặp n lần (Đi tới) · Rẽ phải · n tăng thêm 1)**. Bit bước tất cả bao nhiêu ô?`,
    `${ans} ô`,
    [`${a * k} ô`, `${ans + k} ô`, `${ans - 1} ô`, `${k} ô`],
    rng,
    { hint: `Vòng 1 đi ${a} ô, vòng 2 đi ${a + 1} ô… cộng lại.` },
  );
};

/** lt-c02, lt-c03: gọi hàm mấy lần thì đi mấy ô */
export const qCallSteps: QuestionGen = (rng) => {
  const k = rng.int(2, 3);
  const calls = rng.int(2, 4);
  const ans = k * calls;
  return choiceQ(
    "lt-ham",
    `Hàm **nhảy** gồm ${Array.from({ length: k }, () => "Đi tới").join(" · ")}. Chương trình: ${Array.from({ length: calls }, () => "Gọi nhảy").join(" · ")}. Bit bước mấy ô?`,
    `${ans} ô`,
    [`${k + calls} ô`, `${k} ô`, `${calls} ô`, `${ans + k} ô`],
    rng,
    { hint: "Mỗi lần gọi là chạy hết các khối trong hàm một lần." },
  );
};

/** lt-c03: hàm có số n */
export const qParamSteps: QuestionGen = (rng) => {
  const xs = Array.from({ length: rng.int(2, 3) }, () => rng.int(1, 5));
  const ans = xs.reduce((a, b) => a + b, 0);
  return choiceQ(
    "lt-tham-so",
    `Hàm **đoạn** gồm Lặp lại n lần (Đi tới). Chương trình: ${xs.map((x) => `Gọi đoạn với n = ${x}`).join(" · ")}. Bit bước mấy ô?`,
    `${ans} ô`,
    [`${xs.length} ô`, `${Math.max(...xs)} ô`, `${ans + 1} ô`, `${xs[0] * xs.length} ô`],
    rng,
    { hint: "Mỗi lần gọi, n là con số đưa vào. Cộng các con số lại." },
  );
};

/** lt-c04, lt-c05: phím đã lập trình, bấm một dãy phím thì Bit nhìn về đâu */
export const qKeyPress: QuestionGen = (rng) => {
  const d = rng.int(0, 3) as Dir;
  const seq = Array.from({ length: rng.int(3, 4) }, () => rng.pick(["⬆️", "⬅️", "➡️"] as const));
  let e = d;
  let steps = 0;
  for (const k of seq) {
    if (k === "⬅️") e = turnLeft(e);
    else if (k === "➡️") e = turnRight(e);
    else steps++;
  }
  if (rng.next() < 0.5)
    return choiceQ(
      "lt-phim-huong",
      `Đã lập trình: ⬆️ = Đi tới, ⬅️ = Rẽ trái, ➡️ = Rẽ phải. Bit đang nhìn ${dirLabel(d)}. Em bấm ${seq.join(" ")}. Giờ Bit nhìn về đâu?`,
      dirLabel(e),
      ([0, 1, 2, 3] as Dir[]).map(dirLabel),
      rng,
      { hint: "Mỗi lần bấm là chạy khối của phím đó. Xoay tay theo từng phím nhé." },
    );
  return choiceQ(
    "lt-phim-buoc",
    `Đã lập trình: ⬆️ = Lặp 2 lần (Đi tới), ⬅️ = Rẽ trái, ➡️ = Rẽ phải. Em bấm ${seq.join(" ")}. Bit bước tất cả mấy ô?`,
    `${steps * 2} ô`,
    [`${steps} ô`, `${seq.length} ô`, `${steps * 2 + 2} ô`, `${seq.length * 2} ô`],
    rng,
    { hint: "Chỉ phím ⬆️ làm Bit bước, mỗi lần 2 ô." },
  );
};

/** lt-c06: nếu … không thì … */
export const qIfElse: QuestionGen = (rng) => {
  const d = rng.int(0, 3) as Dir;
  const wall = rng.next() < 0.5;
  const left = rng.next() < 0.5;
  const end = wall ? (left ? turnLeft(d) : turnRight(d)) : d;
  return choiceQ(
    "lt-neu-khong",
    `Bit nhìn ${dirLabel(d)}. ${wall ? "Trước mặt là **tường**." : "Trước mặt là **đường trống**."} Chạy **Nếu có tường phía trước thì (${left ? "Rẽ trái" : "Rẽ phải"}) không thì (Đi tới)**. Sau đó Bit nhìn về đâu?`,
    dirLabel(end),
    ([0, 1, 2, 3] as Dir[]).map(dirLabel),
    rng,
    { hint: "Điều kiện đúng thì làm nhánh trên, sai thì làm nhánh dưới. Đi tới không làm đổi hướng." },
  );
};

/** lt-c06: chương trình nào đúng với mọi sân ngẫu nhiên */
export const qRandomSure: QuestionGen = (rng) => {
  const n = rng.int(3, 8);
  return choiceQ(
    "lt-ngau-nhien",
    `Mỗi lần chơi, lá cờ ở thẳng phía trước cách Bit một số ô **ngẫu nhiên** từ 2 tới 9 (lần này là ${n} ô). Chương trình nào lần nào cũng tới cờ?`,
    "Lặp tới khi tới cờ (Đi tới)",
    [`Lặp ${n} lần (Đi tới)`, "Lặp 9 lần (Đi tới)", `Lặp ${n - 1} lần (Đi tới)`, "Đi tới · Đi tới"],
    rng,
    { hint: "Số ô đổi mỗi lần, nên đừng đếm cứng. Cứ đi tới khi tới cờ." },
  );
};

// ───────────── Nâng cao ─────────────

const arr = (rng: Rng, n: number, max = 20) => {
  const s = new Set<number>();
  while (s.size < n) s.add(rng.int(1, max));
  return rng.shuffle([...s]);
};

/** lt-d01: chỉ số trong danh sách (đếm từ 0) */
export const qIndex: QuestionGen = (rng) => {
  const a = arr(rng, rng.int(4, 6));
  const i = rng.int(0, a.length - 1);
  return choiceQ("lt-chi-so", `Danh sách **a = ${fmtList(a)}**. Vị trí đếm từ 0. **a[${i}]** là số mấy?`, String(a[i]), a.filter((x) => x !== a[i]).map(String), rng, {
    hint: "Hộp đầu tiên là a[0], hộp thứ hai là a[1]…",
  });
};

/** lt-d01: độ dài danh sách, vị trí cuối */
export const qLast: QuestionGen = (rng) => {
  const a = arr(rng, rng.int(4, 7));
  return choiceQ(
    "lt-cuoi",
    `Danh sách **a = ${fmtList(a)}** có ${a.length} hộp. Hộp cuối cùng ở vị trí số mấy (đếm từ 0)?`,
    String(a.length - 1),
    [String(a.length), String(a.length - 2), String(a[a.length - 1])],
    rng,
    { hint: "Đếm từ 0 nên vị trí cuối nhỏ hơn số hộp 1 đơn vị." },
  );
};

/** lt-d02: tìm lớn nhất / nhỏ nhất bằng cách nhớ */
export const qMaxMem: QuestionGen = (rng) => {
  const a = arr(rng, 5, 30);
  const big = rng.next() < 0.5;
  const ans = big ? Math.max(...a) : Math.min(...a);
  return choiceQ(
    "lt-lon-nhat",
    `Robot nhớ hộp đầu, rồi đi hết hàng, gặp hộp **${big ? "lớn hơn" : "nhỏ hơn"}** số đang nhớ thì nhớ hộp đó. Hàng hộp: ${fmtList(a)}. Cuối cùng robot nhớ số mấy?`,
    String(ans),
    a.filter((x) => x !== ans).map(String),
    rng,
    { hint: "Đi lần lượt từng hộp, so với số đang nhớ." },
  );
};

/** lt-d02: phải đổi số đang nhớ mấy lần */
export const qMaxChanges: QuestionGen = (rng) => {
  const a = arr(rng, 6, 30);
  let m = a[0];
  let c = 0;
  for (const x of a.slice(1))
    if (x > m) {
      m = x;
      c++;
    }
  return choiceQ(
    "lt-doi-nho",
    `Tìm số lớn nhất trong ${fmtList(a)}: nhớ hộp đầu, gặp số lớn hơn thì nhớ lại. Robot phải **nhớ lại** mấy lần (không tính lần nhớ hộp đầu)?`,
    `${c} lần`,
    near(c, rng, (x) => `${x} lần`),
    rng,
    { hint: "Mỗi khi gặp kỷ lục mới thì nhớ lại một lần." },
  );
};

/** lt-d03: tìm tuần tự phải xem mấy hộp */
export const qSeqSearch: QuestionGen = (rng) => {
  const a = arr(rng, 7, 40);
  const i = rng.int(0, a.length - 1);
  return choiceQ(
    "lt-tim-tuan-tu",
    `Tìm tuần tự số **${a[i]}** trong ${fmtList(a)}: xem từ hộp đầu, từng hộp một, thấy là dừng. Phải xem mấy hộp?`,
    `${i + 1} hộp`,
    near(i + 1, rng, (x) => `${x} hộp`),
    rng,
    { hint: "Đếm cả hộp có số cần tìm." },
  );
};

/** lt-d03: tìm nhị phân trên danh sách đã xếp: nhiều nhất mấy lần hỏi */
export const qBinary: QuestionGen = (rng) => {
  const k = rng.int(3, 7);
  const n = 2 ** k;
  return choiceQ(
    "lt-nhi-phan",
    `Danh sách **đã xếp tăng dần** có ${n} số. Tìm nhị phân: mỗi lần xem số ở giữa, bỏ đi một nửa. Nhiều nhất phải xem mấy lần là tìm ra?`,
    `${k + 1} lần`,
    [`${n} lần`, `${n / 2} lần`, `${k} lần`, `${k + 3} lần`],
    rng,
    { hint: `Mỗi lần chia đôi: ${n} → ${n / 2} → ${n / 4}… tới khi còn 1 số thì xem nốt số đó.` },
  );
};

/** một lượt nổi bọt */
const bubblePass = (a: number[]) => {
  const b = [...a];
  for (let i = 0; i + 1 < b.length; i++) if (b[i] > b[i + 1]) [b[i], b[i + 1]] = [b[i + 1], b[i]];
  return b;
};

/** lt-d04: sau một lượt nổi bọt */
export const qBubble: QuestionGen = (rng) => {
  const a = arr(rng, 5, 9);
  const once = bubblePass(a);
  const wrong = [[...a].sort((x, y) => x - y), [...a].reverse(), bubblePass(once), [once[0], ...once.slice(1).reverse()]].map(fmtList);
  return choiceQ("lt-noi-bot", `Một lượt nổi bọt: đi từ đầu hàng, hộp nào lớn hơn hộp kế thì đổi chỗ. Hàng ${fmtList(a)} sau **một lượt** thành gì?`, fmtList(once), wrong, rng, {
    hint: "Sau một lượt, số lớn nhất luôn trôi về cuối hàng. Làm từng cặp một.",
  });
};

/** lt-d04: cần mấy lượt cho n hộp */
export const qBubblePasses: QuestionGen = (rng) => {
  const n = rng.int(4, 8);
  return choiceQ(
    "lt-luot",
    `Hàng có ${n} hộp xếp **ngược** (lớn tới nhỏ). Mỗi lượt nổi bọt đưa một số lớn nhất còn lại về đúng chỗ. Cần ít nhất mấy lượt để xếp xong?`,
    `${n - 1} lượt`,
    [`${n} lượt`, `${n - 2} lượt`, `${n + 1} lượt`, "1 lượt"],
    rng,
    { hint: "Khi đã đúng chỗ hết, chỉ còn một hộp thì nó cũng tự đúng chỗ." },
  );
};

/** lt-d05: đệ quy */
export const qRecursion: QuestionGen = (rng) => {
  const n = rng.int(3, 7);
  const k = rng.int(1, 2);
  const ans = n * k;
  return choiceQ(
    "lt-de-quy",
    `Hàm **đi(n)**: nếu n > 0 thì (${k === 1 ? "Đi tới" : "Đi tới · Đi tới"} · gọi đi(n - 1)). Gọi **đi(${n})** thì Bit bước mấy ô?`,
    `${ans} ô`,
    [`${n} ô`, `${ans + k} ô`, `${n - 1} ô`, "Đi mãi không dừng"].filter((x) => x !== `${ans} ô`),
    rng,
    { hint: "Mỗi lần hàm tự gọi chính nó thì n bớt 1. Tới n = 0 thì dừng." },
  );
};

/** lt-d05: đệ quy thiếu điều kiện dừng */
export const qRecursionStop: QuestionGen = (rng) => {
  const name = rng.pick(["đi", "chạy", "tiến"]);
  return choiceQ(
    "lt-dung",
    `Hàm **${name}** gồm: Đi tới · Gọi ${name}. Không có khối Nếu nào. Gọi ${name} trên sân rộng thì sao?`,
    "Chạy mãi tới khi đụng tường hoặc bị chặn",
    ["Đi đúng 1 ô rồi dừng", "Không chạy gì cả", "Đi 2 ô rồi dừng"],
    rng,
    { hint: "Đệ quy cần một điều kiện để dừng, không thì gọi mãi." },
  );
};

/** lt-d06: bám tường phải */
export const qWallFollow: QuestionGen = (rng) => {
  const d = rng.int(0, 3) as Dir;
  const right = rng.next() < 0.5;
  const front = rng.next() < 0.5;
  const end = right ? turnRight(d) : front ? d : turnLeft(d);
  const what = right ? "đi được" : "là tường";
  return choiceQ(
    "lt-bam-tuong",
    `Bám tường bên phải: **Nếu bên phải có đường thì (Rẽ phải · Đi tới) không thì (Nếu phía trước có đường thì Đi tới không thì Rẽ trái)**. Bit nhìn ${dirLabel(d)}, bên phải ${what}${right ? "" : `, phía trước ${front ? "đi được" : "là tường"}`}. Bit sẽ quay mặt về đâu?`,
    dirLabel(end),
    ([0, 1, 2, 3] as Dir[]).map(dirLabel),
    rng,
    { hint: "Ưu tiên bên phải trước, rồi tới phía trước, cuối cùng mới rẽ trái." },
  );
};
