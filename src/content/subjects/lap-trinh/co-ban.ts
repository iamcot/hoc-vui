import type { Block, CodeSpec, Lesson, QuestionGen, Slide, Unit } from "@/content/types";
import type { BlockKind, Dir, Level } from "@/lib/code/world";
import { qIfWall, qNested, qRepeatSame, qRepeatSteps, qShape, qUntil } from "./questions";
import { canvas, corridor } from "./trace";

/**
 * Trình độ Cơ bản (lớp 3-5): lặp lại, lặp trong lặp, nếu có tường, lặp cho tới khi, bút vẽ.
 * Màn có khối lặp/nếu ghi sẵn `solution` (lời giải ít khối nhất), kiểm thử soát lại mọi màn.
 * Bài Nếu / Lặp tới khi có sân ẩn (`alt`): cùng chương trình phải đúng ở mọi sân.
 */

const text = (t: string): Block => ({ type: "text", text: t });
const tip = (t: string, tone?: "warn"): Block => ({ type: "tip", text: t, tone });
const demo = (map: string[], dir: Dir, program: string, label?: string, draw?: boolean): Block => ({ type: "code", map, dir, program, label, draw });

const LOOP: BlockKind[] = ["forward", "left", "right", "repeat"];
const IF: BlockKind[] = ["forward", "left", "right", "repeat", "if"];
const UNTIL: BlockKind[] = ["forward", "left", "right", "until", "if"];

export interface Def {
  id: string;
  title: string;
  short: string;
  emoji: string;
  slides: Slide[];
  code: CodeSpec;
  practice: QuestionGen[];
}

export const make =
  (cover: string) =>
  (d: Def): Lesson => ({ id: d.id, title: d.title, short: d.short, emoji: d.emoji, cover, minutes: 8, slides: d.slides, practice: d.practice, code: d.code });

/** màn đi trên hành lang vẽ từ đường mẫu `path` (chỉ F L R và lặp N lần), lời giải gọn là `solution` */
export const hall = (id: string, blocks: BlockKind[], dir: Dir, path: string, solution: string, hint: string, stars?: number[]): Level => ({
  id,
  blocks,
  dir,
  map: corridor(path, dir, { stars, goal: !stars?.length || undefined }),
  solution,
  hint,
});

/** màn có sân ẩn: mỗi đường mẫu là một sân, cùng một lời giải phải đi được hết */
export const multi = (id: string, blocks: BlockKind[], paths: [Dir, string][], solution: string, hint: string): Level => ({
  id,
  blocks,
  dir: paths[0][0],
  map: corridor(paths[0][1], paths[0][0]),
  alt: paths.slice(1).map(([dir, p]) => ({ dir, map: corridor(p, dir) })),
  solution,
  hint,
});

/** màn bút vẽ trên sân trống: vẽ lại đúng hình do `solution` vẽ ra */
export const pen = (id: string, w: number, h: number, sx: number, sy: number, dir: Dir, solution: string, hint: string): Level => ({
  id,
  blocks: LOOP,
  dir,
  map: canvas(w, h, sx, sy),
  draw: solution,
  solution,
  hint,
});

const coBan: Def[] = [
  {
    id: "lt-b01",
    title: "Lặp lại N lần",
    short: "Một khối Lặp thay cho cả dãy khối giống nhau",
    emoji: "🔁",
    slides: [
      {
        title: "Đỡ phải kéo mỏi tay",
        mood: "wow",
        blocks: [
          text("Đường dài 8 ô thì phải kéo 8 khối Đi tới? Mệt lắm! Khối **Lặp lại** làm các khối bên trong **nhiều lần** giùm em."),
          demo(["S.......G"], 1, "8(F)", "Lặp lại 8 lần (Đi tới): chỉ 2 khối"),
          tip("Kéo khối Đi tới **vào bên trong** khối Lặp lại, rồi bấm vào con số để đổi số lần."),
        ],
      },
    ],
    code: {
      levels: [
        hall("b01-1", LOOP, 1, "7(F)", "7(F)", "Dùng một khối Lặp lại cho cả đường thẳng."),
        hall("b01-2", LOOP, 0, "6(F)", "6(F)", "Đổi con số trong khối Lặp cho khớp số ô."),
        hall("b01-3", LOOP, 1, "5(F) R 4(F)", "5(F) R 4(F)", "Hai đoạn thẳng, mỗi đoạn một khối Lặp."),
        hall("b01-4", LOOP, 1, "4(F R F L)", "4(F R F L)", "Tìm đoạn lặp đi lặp lại trên đường bậc thang."),
        hall("b01-5", LOOP, 2, "3(2(F) L 2(F) R)", "3(2(F) L 2(F) R)", "Đường ngoằn ngoèo, nhưng vẫn có mẫu lặp lại."),
      ],
    },
    practice: [qRepeatSteps, qRepeatSame],
  },
  {
    id: "lt-b02",
    title: "Lặp trong lặp",
    short: "Đặt một khối Lặp vào trong khối Lặp khác",
    emoji: "🪆",
    slides: [
      {
        title: "Vòng lặp lồng nhau",
        mood: "think",
        blocks: [
          text('Đi quanh một hình vuông: **đi 4 ô rồi rẽ phải**, làm như vậy 3 lần. Phần "đi 4 ô" lại là một vòng lặp nữa, nên ta đặt **lặp trong lặp**.'),
          demo(
            corridor("3(4(F) R)", 1, { stars: [4, 8, 12] }).map((r) => r),
            1,
            "3(4(F) R)",
            "Lặp 3 lần (Lặp 4 lần (Đi tới) · Rẽ phải)",
          ),
          tip("Vòng **trong** chạy hết rồi vòng **ngoài** mới sang lượt sau."),
        ],
      },
    ],
    code: {
      levels: [
        hall("b02-1", LOOP, 1, "3(4(F) R)", "3(4(F) R)", "Nhặt sao ở ba góc. Đi một cạnh, rẽ, lặp lại.", [4, 8, 12]),
        hall("b02-2", LOOP, 0, "3(5(F) R)", "3(5(F) R)", "Hình vuông to hơn, sửa con số thôi.", [5, 10, 15]),
        hall("b02-3", LOOP, 1, "4(2(F) R 2(F) L)", "4(2(F) R 2(F) L)", "Bậc thang cao 2 ô."),
        hall("b02-4", LOOP, 1, "2(3(F) R 2(F) R 3(F) L 2(F) L)", "2(3(F) R 2(F) R 3(F) L 2(F) L)", "Đường rắn bò, nhìn kỹ một khúc lặp lại."),
        hall("b02-5", LOOP, 0, "3(2(F) R) 4(F)", "3(2(F) R) 4(F)", "Màn khó: một vòng xoắn rồi chạy thẳng."),
      ],
    },
    practice: [qNested, qRepeatSteps],
  },
  {
    id: "lt-b03",
    title: "Nếu có tường thì…",
    short: "Mochi tự nhìn đường rồi mới quyết định",
    emoji: "❓",
    slides: [
      {
        title: "Mochi biết tự nhìn",
        mood: "wow",
        blocks: [
          text("Khối **Nếu … thì** chỉ làm các khối bên trong **khi điều kiện đúng**. Ví dụ: **Nếu có tường phía trước thì Rẽ trái**."),
          demo(corridor("3(F) L 2(F) L 3(F)", 1), 1, "8(W?(L) F)", "Mỗi vòng: gặp tường thì rẽ trái, rồi đi tới"),
          tip("Ở bài này có **nhiều sân**. Cùng một chương trình phải chạy đúng ở sân nào cũng được. Đó là sức mạnh của khối Nếu!"),
        ],
      },
    ],
    code: {
      levels: [
        multi(
          "b03-1",
          IF,
          [
            [1, "3(F) L 3(F)"],
            [1, "2(F) L 4(F)"],
          ],
          "7(W?(L) F)",
          "Hai sân khác nhau, một chương trình. Gặp tường thì rẽ trái.",
        ),
        multi(
          "b03-2",
          IF,
          [
            [0, "2(F) R 3(F) R 2(F)"],
            [0, "4(F) R 2(F) R 3(F)"],
          ],
          "10(W?(R) F)",
          "Lần này đường rẽ phải.",
        ),
        multi(
          "b03-3",
          IF,
          [
            [1, "4(F) L 3(F) L 2(F) L 1(F)"],
            [1, "3(F) L 3(F) L 3(F)"],
            [1, "5(F) L 2(F)"],
          ],
          "12(W?(L) F)",
          "Ba sân! Lặp đủ nhiều lần nhé.",
        ),
        multi(
          "b03-4",
          IF,
          [
            [1, "3(F) L 2(F) R 3(F)"],
            [1, "2(F) R 2(F) L 2(F)"],
          ],
          "10(A?(L) D?(R) F)",
          "Đường rẽ cả hai phía. Mochi nhìn trái, nhìn phải.",
        ),
        multi(
          "b03-5",
          IF,
          [
            [0, "2(F) R 2(F) L 2(F) L 2(F) R 2(F)"],
            [0, "F L 3(F) R 2(F) R 3(F)"],
            [0, "5(F)"],
          ],
          "12(A?(L) D?(R) F)",
          "Màn trùm: ba sân, đủ kiểu khúc quanh.",
        ),
      ],
    },
    practice: [qIfWall, qRepeatSteps],
  },
  {
    id: "lt-b04",
    title: "Lặp cho tới khi",
    short: "Không cần đếm: cứ lặp tới cờ thì dừng",
    emoji: "🏁",
    slides: [
      {
        title: "Không biết bao xa? Không sao!",
        mood: "happy",
        blocks: [
          text("Khối **Lặp cho tới khi tới cờ** cứ làm các khối bên trong mãi, **tới cờ thì tự dừng**. Không cần đếm ô nữa."),
          demo(["S.....G"], 1, "U(F)", "Lặp cho tới khi tới cờ (Đi tới)"),
          tip("Nếu bên trong không có khối nào đưa Mochi tới cờ, vòng lặp sẽ chạy mãi. Mochi sẽ dừng lại và nhắc em.", "warn"),
        ],
      },
    ],
    code: {
      levels: [
        multi(
          "b04-1",
          UNTIL,
          [
            [1, "4(F)"],
            [1, "7(F)"],
            [1, "2(F)"],
          ],
          "U(F)",
          "Ba sân dài ngắn khác nhau. Một chương trình 2 khối là đủ!",
        ),
        multi(
          "b04-2",
          UNTIL,
          [
            [1, "3(F) L 4(F)"],
            [1, "6(F) L 2(F)"],
          ],
          "U(W?(L) F)",
          "Lặp tới cờ, gặp tường thì rẽ trái.",
        ),
        multi(
          "b04-3",
          UNTIL,
          [
            [0, "2(F) R 3(F) R 2(F) L 2(F)"],
            [0, "3(F) R 4(F)"],
            [0, "F R F L F R F"],
          ],
          "U(A?(L) D?(R) F)",
          "Đường nào cũng được, Mochi tự nhìn.",
        ),
        multi(
          "b04-4",
          UNTIL,
          [
            [1, "5(F) R 5(F) R 4(F) R 3(F) R 2(F)"],
            [1, "4(F) R 4(F) R 3(F) R 2(F)"],
          ],
          "U(W?(R) F)",
          "Vòng xoắn ốc vào giữa.",
        ),
        multi(
          "b04-5",
          UNTIL,
          [
            [2, "F L 2(F) R 2(F) R 3(F) L 2(F) L F"],
            [2, "3(F) L 3(F) R 3(F)"],
            [2, "2(F L F R)"],
          ],
          "U(A?(L) D?(R) F)",
          "Màn trùm: mê cung ba sân.",
        ),
      ],
    },
    practice: [qUntil, qIfWall],
  },
  {
    id: "lt-b05",
    title: "Bút vẽ",
    short: "Mochi cầm bút, đi tới đâu vẽ tới đó",
    emoji: "✏️",
    slides: [
      {
        title: "Mochi làm họa sĩ",
        mood: "happy",
        blocks: [
          text("Ở các màn này Mochi **cầm bút**: đi tới đâu vẽ nét tới đó. Nhiệm vụ là vẽ **đúng hình mẫu** (nét đứt mờ trên sân), không thừa không thiếu."),
          demo(canvas(4, 4, 0, 3), 0, "4(3(F) R)", "Lặp 4 lần (Lặp 3 lần (Đi tới) · Rẽ phải): một hình vuông", true),
          tip("Nét màu hồng đậm là nét vẽ **thừa**, không có trong hình mẫu."),
        ],
      },
    ],
    code: {
      levels: [
        pen("b05-1", 5, 5, 0, 4, 0, "4(F)", "Vẽ một đường thẳng đứng."),
        pen("b05-2", 5, 5, 0, 4, 0, "4(F) R 3(F)", "Vẽ chữ L ngược."),
        pen("b05-3", 5, 5, 1, 3, 0, "4(2(F) R)", "Hình vuông cạnh 2 ô."),
        pen("b05-4", 6, 5, 0, 4, 0, "2(3(F) R 5(F) R)", "Hình chữ nhật: hai cạnh dài, hai cạnh ngắn."),
        pen("b05-5", 5, 5, 0, 4, 0, "4(F R F L)", "Bậc thang."),
      ],
    },
    practice: [qShape],
  },
  {
    id: "lt-b06",
    title: "Vẽ hoa văn bằng lặp",
    short: "Lặp một hình nhỏ để có hoa văn lớn",
    emoji: "🌸",
    slides: [
      {
        title: "Hình nhỏ lặp lại thành hoa văn",
        mood: "wow",
        blocks: [
          text("Vẽ một ô vuông nhỏ, xoay người, lại vẽ ô vuông nữa… Lặp **4 lần** là có cái **cửa sổ 4 ô**. Họa sĩ máy tính vẽ hoa văn đúng như thế!"),
          demo(canvas(5, 5, 2, 2), 0, "4(4(F R) R)", "Lặp 4 lần (vẽ ô vuông nhỏ · Rẽ phải)", true),
        ],
      },
    ],
    code: {
      levels: [
        pen("b06-1", 5, 5, 2, 2, 0, "4(4(F R) R)", "Cửa sổ 4 ô: một ô vuông nhỏ, lặp 4 lần."),
        pen("b06-2", 5, 5, 1, 4, 0, "3(4(F R) F)", "Tháp 3 tầng: vẽ ô vuông, đi lên, lặp lại."),
        pen("b06-3", 7, 5, 0, 4, 0, "3(2(F) R 2(F) R F L 2(F) L)", "Răng cưa: tìm khúc lặp lại."),
        pen("b06-4", 5, 5, 2, 2, 0, "4(2(F) L 2(F) R R)", "Chong chóng 4 cánh."),
        pen("b06-5", 6, 6, 1, 4, 0, "4(4(F R) F F R)", "Màn trùm: bốn ô vuông ở bốn góc hình to."),
      ],
    },
    practice: [qShape, qNested],
  },
];

export const unitsCoBan: Unit[] = [
  { id: "lt-cb-1", title: "Vòng lặp", lessons: coBan.slice(0, 2).map(make("lt-cover-co-ban")) },
  { id: "lt-cb-2", title: "Tự nhìn đường", lessons: coBan.slice(2, 4).map(make("lt-cover-co-ban")) },
  { id: "lt-cb-3", title: "Bút vẽ", lessons: coBan.slice(4).map(make("lt-cover-co-ban")) },
];
