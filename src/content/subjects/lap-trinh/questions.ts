import type { Question, QuestionGen } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { sayProgram, type Stmt } from "@/lib/code/program";
import { DIR_ARROW, DIR_NAME, turnLeft, turnRight, type Dir } from "@/lib/code/world";

/**
 * Câu hỏi trắc nghiệm cho thử thách vượt cấp, kiểm tra trình độ và đấu trường
 * (màn kéo khối không dùng được ở đó). Mọi câu đều tự tính đáp án bằng cách chạy thử trong đầu Mochi:
 * hướng nhìn, vị trí sau chương trình, khối sai.
 */

const F: Stmt = { op: "forward" };
const L: Stmt = { op: "left" };
const R: Stmt = { op: "right" };
const fs = (n: number): Stmt[] => Array.from({ length: n }, () => F);

const dirLabel = (d: Dir) => `${DIR_ARROW[d]} ${DIR_NAME[d]}`;
const facing = (d: Dir) => `Mochi đang nhìn ${dirLabel(d)}.`;

/** chạy chương trình trên sân trống, trả về độ dời và hướng cuối */
function simulate(p: Stmt[], d: Dir) {
  let x = 0;
  let y = 0;
  const walk = (list: Stmt[]) => {
    for (const s of list) {
      if (s.op === "repeat") for (let k = 0; k < (s.n as number); k++) walk(s.body);
      else if (s.op === "left") d = turnLeft(d);
      else if (s.op === "right") d = turnRight(d);
      else if (s.op === "forward") {
        x += [0, 1, 0, -1][d];
        y += [-1, 0, 1, 0][d];
      }
    }
  };
  walk(p);
  return { x, y, d };
}
const sameEnd = (a: Stmt[], b: Stmt[], d: Dir) => {
  const p = simulate(a, d);
  const q = simulate(b, d);
  return p.x === q.x && p.y === q.y;
};

function choiceQ(topic: string, prompt: string, answer: string, wrong: string[], rng: Rng, extra: Partial<Question> = {}): Question {
  const choices = rng.shuffle([answer, ...[...new Set(wrong)].filter((w) => w !== answer).slice(0, 3)]);
  return { id: `${topic}-${prompt}`, prompt, kind: "choice", answer, choices, topic, ...extra };
}

/** lt-a01: cần mấy khối Đi tới */
export const qSteps: QuestionGen = (rng) => {
  const n = rng.int(2, 7);
  const d = rng.int(0, 3) as Dir;
  return choiceQ(
    "lt-buoc",
    `${facing(d)} Lá cờ ở ngay phía trước, cách Mochi ${n} ô. Cần mấy khối **Đi tới** để Mochi đứng đúng lên cờ?`,
    `${n} khối`,
    [`${n - 1} khối`, `${n + 1} khối`, `${n + 2} khối`, `${Math.max(1, n - 2)} khối`],
    rng,
    { hint: "Mỗi khối Đi tới thì Mochi bước đúng 1 ô." },
  );
};

/** lt-a02: rẽ vài lần thì nhìn về đâu */
export const qFacing: QuestionGen = (rng) => {
  const d = rng.int(0, 3) as Dir;
  const turns = Array.from({ length: rng.int(1, 3) }, () => (rng.next() < 0.5 ? L : R));
  const end = simulate(turns, d).d;
  const all = ([0, 1, 2, 3] as Dir[]).map(dirLabel);
  return choiceQ("lt-huong", `${facing(d)} Chạy: **${sayProgram(turns)}**. Bây giờ Mochi nhìn về hướng nào?`, dirLabel(end), all, rng, {
    hint: "Rẽ chỉ làm Mochi quay người tại chỗ, không bước đi. Thử xoay tay mình theo nhé.",
  });
};

/** một đường gấp khúc: đi a ô, rẽ, đi b ô */
function bend(rng: Rng) {
  const d = rng.int(0, 3) as Dir;
  const a = rng.int(1, 3);
  const b = rng.int(1, 3);
  const turn = rng.next() < 0.5 ? L : R;
  const d2 = turn.op === "left" ? turnLeft(d) : turnRight(d);
  const good: Stmt[] = [...fs(a), turn, ...fs(b)];
  const goal = `${a} ô ${DIR_NAME[d]} rồi ${b} ô ${DIR_NAME[d2]}`;
  return { d, a, b, turn, good, goal };
}

/** lt-a02, lt-a03: chương trình nào đúng */
export const qPath: QuestionGen = (rng) => {
  const { d, a, b, turn, good, goal } = bend(rng);
  const other = turn.op === "left" ? R : L;
  const cands: Stmt[][] = [
    [...fs(a), other, ...fs(b)],
    [...fs(b), turn, ...fs(a)],
    [...fs(a + 1), turn, ...fs(b)],
    [...fs(a), turn, ...fs(b + 1)],
    [turn, ...fs(a), ...fs(b)],
  ].filter((p) => !sameEnd(p, good, d));
  return choiceQ("lt-duong", `${facing(d)} Mochi cần đi ${goal}. Chương trình nào đúng?`, sayProgram(good), rng.shuffle(cands).map(sayProgram), rng, {
    hint: "Chạy thử từng khối trong đầu: bước, bước, quay người…",
  });
};

/** lt-a04: tìm khối sai (khối rẽ bị ngược chiều) */
export const qBug: QuestionGen = (rng) => {
  const { d, a, b, turn, goal } = bend(rng);
  const other = turn.op === "left" ? R : L;
  const bad: Stmt[] = [...fs(a), other, ...fs(b)];
  const label = (i: number) => `Khối ${i}: ${sayProgram([bad[i - 1]])}`;
  const answer = label(a + 1);
  const wrong = rng.shuffle(Array.from({ length: bad.length }, (_, i) => label(i + 1)).filter((c) => c !== answer));
  return choiceQ("lt-loi", `${facing(d)} Mochi cần đi ${goal}, nhưng chương trình **${sayProgram(bad)}** chạy sai. Khối nào sai?`, answer, wrong, rng, {
    hint: "Đếm số bước của đoạn đầu, rồi xem Mochi phải quay về phía nào.",
  });
};

/** lt-a05: cả bốn chương trình đều tới đích, cái nào ít khối nhất */
export const qShortest: QuestionGen = (rng) => {
  const { d, a, b, turn, good, goal } = bend(rng);
  const other = turn.op === "left" ? R : L;
  const longer: Stmt[][] = [
    [...fs(a), other, other, other, ...fs(b)],
    [...fs(a), turn, turn, turn, turn, turn, ...fs(b)],
    [L, R, ...fs(a), turn, ...fs(b)],
    [...fs(a), turn, ...fs(b), R, L],
  ];
  return choiceQ(
    "lt-ngan",
    `${facing(d)} Mochi cần đi ${goal}. Cả bốn chương trình đều đưa Mochi tới nơi. Chương trình nào **ít khối nhất**?`,
    sayProgram(good),
    rng.shuffle(longer).map(sayProgram),
    rng,
    { hint: "Rẽ phải 3 lần cũng bằng rẽ trái 1 lần, nhưng tốn khối hơn!" },
  );
};

// ───────────── Cơ bản: lặp, nếu, bút vẽ ─────────────
const rep = (n: number, body: Stmt[]): Stmt => ({ op: "repeat", n, body });

/** lt-b01: lặp N lần thì đi mấy bước */
export const qRepeatSteps: QuestionGen = (rng) => {
  const n = rng.int(2, 6);
  const k = rng.int(1, 3);
  const p = [rep(n, fs(k))];
  const ans = n * k;
  return choiceQ("lt-lap", `Chạy **${sayProgram(p)}**. Mochi bước tất cả bao nhiêu ô?`, `${ans} ô`, [`${n + k} ô`, `${n} ô`, `${ans + k} ô`, `${Math.max(1, ans - k)} ô`], rng, {
    hint: "Mỗi vòng lặp Mochi làm hết các khối bên trong một lần.",
  });
};

/** lt-b01: chương trình nào giống dãy khối dài */
export const qRepeatSame: QuestionGen = (rng) => {
  const n = rng.int(3, 6);
  const unit: Stmt[] = rng.next() < 0.5 ? [F] : [F, rng.next() < 0.5 ? L : R];
  const long = Array.from({ length: n }, () => unit).flat();
  const good = [rep(n, unit)];
  const wrong = [[rep(n - 1, unit)], [rep(n + 1, unit)], [rep(n, [...unit, F])], [rep(Math.max(2, n - 2), unit)]];
  return choiceQ("lt-gon", `Chương trình nào làm **y hệt** dãy khối: ${sayProgram(long)}?`, sayProgram(good), wrong.map(sayProgram), rng, { hint: "Tìm phần lặp lại, rồi đếm xem nó lặp mấy lần." });
};

/** lt-b02: lặp trong lặp */
export const qNested: QuestionGen = (rng) => {
  const a = rng.int(2, 4);
  const b = rng.int(2, 3);
  const p = [rep(a, [rep(b, [F]), R])];
  const ans = a * b;
  return choiceQ("lt-long", `Chạy **${sayProgram(p)}**. Mochi bước tất cả bao nhiêu ô?`, `${ans} ô`, [`${a + b} ô`, `${ans + 1} ô`, `${ans + a} ô`, `${b} ô`], rng, {
    hint: "Vòng trong chạy hết rồi vòng ngoài mới sang lần sau. Nhân số lần hai vòng với nhau.",
  });
};

/** lt-b03: nếu có tường thì… */
export const qIfWall: QuestionGen = (rng) => {
  const d = rng.int(0, 3) as Dir;
  const wall = rng.next() < 0.5;
  const turn = rng.next() < 0.5 ? L : R;
  const p: Stmt[] = [{ op: "if", cond: "W", body: [turn] }];
  const end = wall ? (turn.op === "left" ? turnLeft(d) : turnRight(d)) : d;
  return choiceQ(
    "lt-neu",
    `${facing(d)} ${wall ? "Ngay trước mặt Mochi là **bức tường**." : "Phía trước Mochi là **đường trống**."} Chạy **${sayProgram(p)}**. Giờ Mochi nhìn về hướng nào?`,
    dirLabel(end),
    ([0, 1, 2, 3] as Dir[]).map(dirLabel),
    rng,
    { hint: "Khối Nếu chỉ làm khối bên trong khi điều kiện đúng. Sai thì bỏ qua." },
  );
};

/** lt-b04: lặp tới khi */
export const qUntil: QuestionGen = (rng) => {
  const n = rng.int(3, 9);
  return choiceQ(
    "lt-toi-khi",
    `Lá cờ ở thẳng phía trước, cách Mochi ${n} ô. Chạy **Lặp tới khi tới cờ (Đi tới)**. Mochi bước mấy ô thì dừng?`,
    `${n} ô`,
    [`${n - 1} ô`, `${n + 1} ô`, "Đi mãi không dừng", "1 ô"],
    rng,
    { hint: "Mỗi vòng Mochi kiểm tra: tới cờ chưa? Tới rồi thì dừng ngay." },
  );
};

/** lt-b05, lt-b06: chương trình bút vẽ vẽ ra hình gì */
const SHAPES: [string, Stmt[]][] = [
  ["Hình vuông", [rep(4, [F, F, R])]],
  ["Hình vuông nhỏ", [rep(4, [F, R])]],
  ["Đường thẳng", [rep(4, [F])]],
  ["Chữ L", [F, F, F, R, F, F]],
  ["Bậc thang", [rep(3, [F, R, F, L])]],
  ["Hình chữ nhật", [rep(2, [F, F, F, R, F, R])]],
  ["Ô cửa sổ 4 ô", [rep(4, [rep(4, [F, R]), R])]],
];
export const qShape: QuestionGen = (rng) => {
  const [name, p] = rng.pick(SHAPES);
  const wrong = rng.shuffle(SHAPES.filter(([n]) => n !== name && !(n.startsWith("Hình vuông") && name.startsWith("Hình vuông")))).map(([n]) => n);
  return choiceQ("lt-ve", `Mochi cầm bút, đi tới đâu vẽ tới đó. Chạy **${sayProgram(p)}** thì vẽ ra hình gì?`, name, wrong, rng, { hint: "Lấy ngón tay vẽ thử theo từng khối trên giấy nhé." });
};
