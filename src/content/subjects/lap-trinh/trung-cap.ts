import type { Block, Unit } from "@/content/types";
import type { BlockKind, Dir, KeySpec, Level } from "@/lib/code/world";
import { make, type Def } from "./co-ban";
import { qCallSteps, qIfElse, qKeyPress, qParamSteps, qRandomSure, qVarGrow, qVarValue } from "./questions-adv";
import { canvas, corridor } from "./trace";

/**
 * Trình độ Trung cấp (lớp 6-8): biến n, hàm tự đặt tên, hàm có số n, sự kiện bấm phím (mini game), sân ngẫu nhiên.
 * Hướng dẫn là Bit. Mọi màn có `solution` (màn phím: các khối Khi bấm phím mẫu), kiểm thử soát lại.
 */

const text = (t: string): Block => ({ type: "text", text: t });
const tip = (t: string, tone?: "warn"): Block => ({ type: "tip", text: t, tone });
const demo = (map: string[], dir: Dir, program: string, label?: string, draw?: boolean): Block => ({ type: "code", map, dir, program, label, draw });

const MOVE: BlockKind[] = ["forward", "left", "right"];
const VAR1: BlockKind[] = [...MOVE, "set", "repeatn"];
const VAR: BlockKind[] = [...MOVE, "repeat", "set", "add", "repeatn"];
const FN: BlockKind[] = [...MOVE, "def", "call"];
const FNN: BlockKind[] = [...MOVE, "def", "calln", "repeatn"];
const KEY: BlockKind[] = [...MOVE, "key"];
const KEYR: BlockKind[] = [...MOVE, "repeat", "key"];
const RAND: BlockKind[] = [...MOVE, "until", "if", "ifelse"];

const hall = (id: string, blocks: BlockKind[], dir: Dir, path: string, solution: string, hint: string, stars?: number[]): Level => ({
  id,
  blocks,
  dir,
  map: corridor(path, dir, { stars, goal: !stars?.length || undefined }),
  solution,
  hint,
});

const pen = (id: string, blocks: BlockKind[], w: number, h: number, sx: number, sy: number, dir: Dir, solution: string, hint: string): Level => ({
  id,
  blocks,
  dir,
  map: canvas(w, h, sx, sy),
  draw: solution,
  solution,
  hint,
});

/** màn phím: bé tự lập trình phím rồi bấm phím chơi */
const keys = (id: string, blocks: BlockKind[], map: string[], dir: Dir, k: KeySpec, solution: string, hint: string): Level => ({ id, blocks, dir, map, keys: k, solution, hint });

/** sân ngẫu nhiên: mỗi lần chơi bốc 3 trong các sân, cùng chương trình phải đúng ở mọi sân */
const random = (id: string, paths: [Dir, string][], solution: string, hint: string, pick = 3): Level => ({
  id,
  blocks: RAND,
  dir: paths[0][0],
  map: corridor(paths[0][1], paths[0][0]),
  alt: paths.slice(1).map(([dir, p]) => ({ dir, map: corridor(p, dir) })),
  pick,
  solution,
  hint,
});

const trungCap: Def[] = [
  {
    id: "lt-c01",
    title: "Biến n",
    short: "Một chiếc hộp nhớ số, đổi số là đổi cả chương trình",
    emoji: "📦",
    slides: [
      {
        title: "Biến là chiếc hộp có tên",
        mood: "wow",
        blocks: [
          text("**Biến** giống một chiếc hộp có tên, bên trong cất một con số. Hộp của mình tên là **n**. Khối **📦 n = 4** cất số 4 vào hộp."),
          text("Khối **🔁 Lặp lại n lần** mở hộp ra xem số bao nhiêu thì lặp bấy nhiêu lần."),
          tip("Muốn đi xa hơn? Chỉ cần sửa số trong hộp, không phải sửa khối Lặp. Ô góc dưới sân chơi cho biết n đang bằng mấy."),
        ],
      },
      { title: "Thử chạy xem", mood: "happy", blocks: [text("Hộp n cất số 5, nên Lặp lại n lần là lặp 5 lần."), demo(["S....G"], 1, "n=5 n(F)", "n = 5 · Lặp lại n lần (Đi tới)")] },
      {
        title: "Biến thay đổi được",
        mood: "think",
        blocks: [
          text("**📦 n tăng thêm 1** cộng 1 vào hộp. Mỗi vòng n lớn dần, mỗi đoạn **dài hơn** đoạn trước: thành **xoắn ốc**!"),
          demo(corridor("F R 2(F) R 3(F) R 4(F)", 0), 0, "n=1 4(n(F) R n+1)", "n = 1 · Lặp 4 lần (Lặp n lần (Đi tới) · Rẽ phải · n tăng 1)"),
        ],
      },
    ],
    code: {
      levels: [
        hall("c01-1", VAR1, 1, "6(F)", "n=6 n(F)", "Cất số bước vào hộp n, rồi Lặp lại n lần."),
        hall("c01-2", VAR1, 1, "3(F) R 3(F)", "n=3 n(F) R n(F)", "Hai đoạn dài bằng nhau: dùng lại cùng một biến n."),
        hall("c01-3", VAR, 0, "F R 2(F) R 3(F) R 4(F)", "n=1 4(n(F) R n+1)", "Mỗi đoạn dài hơn đoạn trước 1 ô. Cho n tăng sau mỗi đoạn."),
        hall("c01-4", VAR, 1, "F R 2(F) R 3(F) R 4(F) R 5(F)", "n=1 5(n(F) R n+1)", "Xoắn ốc to hơn, vẫn chương trình đó."),
        hall("c01-5", VAR, 1, "F L F R 2(F) L 2(F) R 3(F) L 3(F)", "n=1 3(n(F) L n(F) R n+1)", "Bậc thang lớn dần: mỗi bậc rộng và cao bằng n."),
      ],
    },
    practice: [qVarValue, qVarGrow],
  },
  {
    id: "lt-c02",
    title: "Hàm tự đặt tên",
    short: "Gom một nhóm khối lại, đặt tên, gọi tên là chạy",
    emoji: "🧩",
    slides: [
      {
        title: "Dạy Bit một chiêu mới",
        mood: "wow",
        blocks: [
          text("**Hàm** là một nhóm khối có **tên**. Kéo khối **🧩 Hàm** ra bàn, bấm vào tên để đặt tên tùy em (vd. *bậc thang*), rồi gắn các khối vào trong."),
          text("Mỗi lần dùng khối **⚡ Gọi bậc thang** là Bit làm hết các khối trong hàm."),
          tip("Khối Hàm đặt **rời** trên bàn, không gắn dưới ▶ Khi bấm Chạy. Chỉ khối Gọi mới gắn vào chương trình."),
        ],
      },
      {
        title: "Gọi hàm 3 lần",
        mood: "happy",
        blocks: [
          text("Một hàm bậc thang, gọi 3 lần là có 3 bậc. Sửa trong hàm là cả 3 bậc cùng đổi."),
          demo(corridor("3(F F L F R)", 1), 1, "bac{F F L F R} @bac @bac @bac", "Hàm bậc thang (Đi · Đi · Rẽ trái · Đi · Rẽ phải), gọi 3 lần"),
        ],
      },
    ],
    code: {
      levels: [
        hall("c02-1", FN, 1, "3(F F L F R)", "bac{F F L F R} @bac @bac @bac", "Tạo hàm cho một bậc thang rồi gọi 3 lần."),
        hall("c02-2", FN, 1, "3(F F L F F R)", "bac{F F L F F R} @bac @bac @bac", "Bậc cao 2 ô. Sửa trong hàm là cả 3 bậc cùng đổi."),
        hall("c02-3", FN, 1, "2(3(F) R 3(F) L)", "z{F F F R F F F L} @z @z", "Hình chữ Z lặp lại: gom một chữ Z vào hàm."),
        hall("c02-4", FN, 1, "4(F R F L)", "b{F R F L} @b @b @b @b", "Không có khối Lặp, hàm sẽ giúp em đỡ kéo khối."),
        hall("c02-5", FN, 0, "2(F F R F L F R F F L)", "s{F F R F L F R F F L} @s @s", "Màn trùm: tìm khúc đường lặp lại hai lần."),
      ],
    },
    practice: [qCallSteps],
  },
  {
    id: "lt-c03",
    title: "Hàm có số n",
    short: "Gọi hàm kèm một con số, mỗi lần một khác",
    emoji: "🎛️",
    slides: [
      {
        title: "Hàm biết nhận số",
        mood: "think",
        blocks: [
          text("**⚡ Gọi … với n = 3** cho hộp n bằng 3 **trong lúc chạy hàm**. Số đưa vào gọi là **tham số** (Python: `doan(3)`)."),
          demo(corridor("3(F) R 5(F) R 2(F)", 1), 1, "doan{n(F) R} @doan:3 @doan:5 @doan:2", "Hàm đoạn (Lặp n lần (Đi tới) · Rẽ phải): gọi với 3, 5, 2"),
        ],
      },
    ],
    code: {
      levels: [
        hall("c03-1", FNN, 1, "3(F) R 4(F) R 2(F)", "d{n(F) R} @d:3 @d:4 @d:2", "Ba đoạn dài khác nhau, cùng rẽ phải ở cuối."),
        hall("c03-2", FNN, 1, "2(F) L 5(F) L 3(F) R 4(F)", "d{n(F)} @d:2 L @d:5 L @d:3 R @d:4", "Đường rẽ lúc trái lúc phải: hàm chỉ lo phần đi thẳng."),
        hall("c03-3", FNN, 1, "5(F) R 4(F) R 4(F) R 3(F) R 3(F) R 2(F)", "s{n(F) R} @s:5 @s:4 @s:4 @s:3 @s:3 @s:2", "Xoắn ốc vào trong: mỗi lần gọi đưa số nhỏ dần."),
        pen("c03-4", [...FNN, "repeat"], 5, 5, 0, 4, 0, "v{4(n(F) R)} @v:1 @v:2 @v:3", "Vẽ ba hình vuông chung một góc, cạnh 1, 2, 3."),
        pen("c03-5", [...FNN, "repeat"], 7, 4, 0, 3, 0, "v{4(n(F) R) R n(F) L} @v:1 @v:2 @v:3", "Màn trùm: ba hình vuông to dần đứng cạnh nhau."),
      ],
    },
    practice: [qParamSteps, qCallSteps],
  },
  {
    id: "lt-c04",
    title: "Sự kiện: khi bấm phím",
    short: "Lập trình phím rồi tự cầm lái",
    emoji: "⌨️",
    slides: [
      {
        title: "Chương trình chờ em bấm",
        mood: "wow",
        blocks: [
          text("Game nào cũng chờ người chơi bấm phím. Khối **⌨️ Khi bấm phím ⬆️** là một **sự kiện**: mỗi lần em bấm ⬆️ thì các khối bên trong chạy."),
          text("Ghép xong thì bấm **🎮 Chơi**, rồi bấm nút mũi tên dưới sân (hoặc phím trên bàn phím) để lái Bit."),
          tip("Mỗi màn có **🔋 pin**: chỉ bấm được bấy nhiêu lần. Cho mỗi phím làm được nhiều việc thì đỡ tốn pin!"),
        ],
      },
    ],
    code: {
      levels: [
        keys("c04-1", KEY, ["S..#", "#.##", "#..G"], 1, { pad: ["u", "l", "r"], presses: 10 }, "#u{F} #l{L} #r{R}", "Cho ⬆️ đi tới, ⬅️ rẽ trái, ➡️ rẽ phải. Rồi bấm Chơi."),
        keys("c04-2", KEY, ["S.#...", "#.#.#.", "#...#G"], 1, { pad: ["u", "l", "r"], presses: 12 }, "#u{F} #l{L F} #r{R F}", "Ít pin hơn! Cho phím rẽ vừa rẽ vừa bước luôn."),
        keys("c04-3", KEYR, ["S.......", "#######.", "G......."], 1, { pad: ["u", "r", "s"], presses: 4 }, "#u{F} #r{R 2(F) R} #s{7(F)}", "Đường dài mà pin ít: phím cách cho Bit lướt một mạch."),
        keys("c04-4", KEYR, ["S..#...", "#.##.#.", "#....#G"], 1, { pad: ["u", "l", "r", "s"], presses: 13 }, "#u{F} #l{L F} #r{R F} #s{3(F)}", "Mê cung nhỏ: chọn phím nào làm gì cho thật khéo."),
      ],
    },
    practice: [qKeyPress],
  },
  {
    id: "lt-c05",
    title: "Làm mini game",
    short: "Nhặt hết sao trước khi hết pin",
    emoji: "🎮",
    slides: [
      {
        title: "Em là người làm game",
        mood: "happy",
        blocks: [
          text("Giờ em vừa **làm game** vừa **chơi game**: tự quyết mỗi phím làm gì, rồi lái Bit nhặt hết ⭐ và về cờ trước khi **🔋 hết pin**."),
          tip("Nghĩ trước khi kéo khối: đường có đoạn thẳng dài thì cho một phím đi xa. Hay phải quay đầu thì cho một phím quay đầu (rẽ 2 lần)."),
        ],
      },
    ],
    code: {
      levels: [
        keys("c05-1", KEY, ["S.*.", "G##.", "*..."], 1, { pad: ["u", "l", "r"], presses: 10 }, "#u{F} #l{L F} #r{R F}", "Nhặt 2 sao rồi về cờ."),
        keys("c05-2", KEYR, ["S...*", "####.", "*...."], 1, { pad: ["u", "r", "s"], presses: 4 }, "#u{F} #r{R 2(F) R} #s{4(F)}", "Đường chữ U: thêm phím quay đầu."),
        keys("c05-3", KEYR, ["*.S.*", ".###.", "..G.."], 1, { pad: ["u", "l", "r", "s"], presses: 12 }, "#u{F} #l{L F} #r{R F} #s{L L}", "Sao ở hai bên: cần một phím quay đầu."),
        keys(
          "c05-4",
          KEYR,
          ["S..*...", "#.###.#", "#..*..#", "###.###", "G..*..."],
          1,
          { pad: ["u", "l", "r", "s"], presses: 12 },
          "#u{F} #l{L F} #r{R F} #s{2(F)}",
          "Màn trùm: ba sao, pin vừa đủ cho người làm game giỏi.",
        ),
      ],
    },
    practice: [qKeyPress],
  },
  {
    id: "lt-c06",
    title: "Sân ngẫu nhiên",
    short: "Mỗi lần chơi một sân mới: chương trình phải thật khôn",
    emoji: "🎲",
    slides: [
      {
        title: "Không biết trước sân nào",
        mood: "think",
        blocks: [
          text("Ở bài này, mỗi lần chơi máy **bốc ngẫu nhiên** 3 sân. Em không biết trước đường đi, nên không đếm ô được. Chương trình phải **tự nhìn đường**."),
          tip("Máy tính cũng **bốc ngẫu nhiên** như tung xúc xắc. Trong Python có `random.randint(1, 6)`."),
        ],
      },
      {
        title: "Nếu … không thì …",
        mood: "wow",
        blocks: [
          text("Khối mới **❓ Nếu … thì … không thì …**: đúng thì làm nhánh trên, sai thì làm nhánh dưới."),
          demo(corridor("3(F) L 2(F) L 3(F)", 1), 1, "U(W?(L | F))", "Lặp tới cờ (Nếu có tường thì Rẽ trái, không thì Đi tới)"),
        ],
      },
    ],
    code: {
      levels: [
        random(
          "c06-1",
          [
            [1, "4(F)"],
            [1, "7(F)"],
            [1, "2(F)"],
            [1, "5(F)"],
            [1, "9(F)"],
          ],
          "U(F)",
          "Đường thẳng, dài ngắn ngẫu nhiên.",
        ),
        random(
          "c06-2",
          [
            [1, "3(F) L 4(F)"],
            [1, "5(F) L 2(F) L 2(F)"],
            [1, "2(F) L 2(F) L 4(F)"],
            [1, "6(F) L 3(F)"],
          ],
          "U(W?(L | F))",
          "Gặp tường thì rẽ trái, không thì đi tới.",
        ),
        random(
          "c06-3",
          [
            [1, "3(F) R 3(F)"],
            [1, "2(F) L 4(F)"],
            [1, "4(F) R 2(F) L 2(F)"],
            [1, "F L 2(F) L 3(F)"],
          ],
          "U(W?(A?(L | R) | F))",
          "Lúc rẽ trái lúc rẽ phải: hỏi tiếp xem bên trái có đường không.",
        ),
        random(
          "c06-4",
          [
            [0, "2(F) R 2(F) L 2(F) L 2(F)"],
            [0, "F R F R F L 3(F)"],
            [0, "3(F) L F R 2(F) R F"],
            [0, "4(F) R 4(F)"],
          ],
          "U(P?(F | A?(L | R)))",
          "Màn trùm: đường đi được thì cứ đi, hết đường mới rẽ.",
        ),
      ],
    },
    practice: [qIfElse, qRandomSure],
  },
];

export const unitsTrungCap: Unit[] = [
  { id: "lt-tc-1", title: "Biến và hàm", lessons: trungCap.slice(0, 3).map(make("lt-cover-trung-cap")) },
  { id: "lt-tc-2", title: "Làm game", lessons: trungCap.slice(3, 5).map(make("lt-cover-trung-cap")) },
  { id: "lt-tc-3", title: "Sân ngẫu nhiên", lessons: trungCap.slice(5).map(make("lt-cover-trung-cap")) },
];
