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
      if (s.op === "repeat") for (let k = 0; k < s.n; k++) walk(s.body);
      else if (s.op === "left") d = turnLeft(d);
      else if (s.op === "right") d = turnRight(d);
      else {
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
  return choiceQ("lt-ngan", `${facing(d)} Mochi cần đi ${goal}. Cả bốn chương trình đều đưa Mochi tới nơi. Chương trình nào **ít khối nhất**?`, sayProgram(good), rng.shuffle(longer).map(sayProgram), rng, {
    hint: "Rẽ phải 3 lần cũng bằng rẽ trái 1 lần, nhưng tốn khối hơn!",
  });
};
