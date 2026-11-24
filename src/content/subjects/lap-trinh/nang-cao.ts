import type { Block, Unit } from "@/content/types";
import type { BlockKind, Dir, ListGoal, Level } from "@/lib/code/world";
import { make, type Def } from "./co-ban";
import { qBinary, qBubble, qBubblePasses, qIndex, qLast, qMaxChanges, qMaxMem, qRecursion, qRecursionStop, qSeqSearch, qWallFollow } from "./questions-adv";
import { corridor, maze } from "./trace";

/**
 * Trình độ Nâng cao (lớp 8-10): kho hàng (danh sách), lớn nhất / nhỏ nhất, tìm kiếm, sắp xếp nổi bọt,
 * đệ quy nhẹ và mê cung bám tường. Kho hàng có nhiều hàng hộp ẩn: cùng chương trình phải đúng với mọi hàng.
 */

const text = (t: string): Block => ({ type: "text", text: t });
const tip = (t: string, tone?: "warn"): Block => ({ type: "tip", text: t, tone });
const demo = (map: string[], dir: Dir, program: string, label?: string): Block => ({ type: "code", map, dir, program, label });

const WALK: BlockKind[] = ["next", "repeat"];
const SCAN: BlockKind[] = ["next", "luntil"];
const MAXB: BlockKind[] = ["next", "mem", "luntil", "lif"];
const SORT: BlockKind[] = ["next", "first", "swap", "repeat", "luntil", "lif"];
const REC: BlockKind[] = ["forward", "left", "right", "def", "call", "if", "ifelse"];
const WALL: BlockKind[] = ["forward", "left", "right", "until", "ifelse"];

/** màn kho hàng */
const store = (id: string, blocks: BlockKind[], goal: ListGoal, arrs: number[][], solution: string, hint: string, extra: { find?: number[]; at?: number } = {}): Level => ({
  id,
  blocks,
  dir: 1,
  map: [],
  list: { arrs, goal, ...extra },
  solution,
  hint,
});

/** màn sân lưới có sân ẩn */
const multi = (id: string, blocks: BlockKind[], paths: [Dir, string][], solution: string, hint: string): Level => ({
  id,
  blocks,
  dir: paths[0][0],
  map: corridor(paths[0][1], paths[0][0]),
  alt: paths.slice(1).map(([dir, p]) => ({ dir, map: corridor(p, dir) })),
  solution,
  hint,
});

/** màn mê cung: các mê cung sinh từ seed cố định */
const mazes = (id: string, cw: number, ch: number, seeds: number[], dir: Dir, solution: string, hint: string): Level => ({
  id,
  blocks: WALL,
  dir,
  map: maze(cw, ch, seeds[0]),
  alt: seeds.slice(1).map((s) => ({ dir, map: maze(cw, ch, s) })),
  solution,
  hint,
});

const nangCao: Def[] = [
  {
    id: "lt-d01",
    title: "Danh sách",
    short: "Một hàng hộp, mỗi hộp có vị trí đếm từ 0",
    emoji: "📚",
    slides: [
      {
        title: "Kho hàng của Bit",
        mood: "wow",
        blocks: [
          text("**Danh sách** là một hàng hộp xếp liền nhau, mỗi hộp chứa một số. Trong Python: `a = [4, 7, 1, 9]`."),
          text("Mỗi hộp có **vị trí**, đếm **từ 0**: hộp đầu là `a[0]`, hộp thứ hai là `a[1]`… Robot đứng ở hộp `a[0]`, khối **➡️ Sang hộp kế** làm vị trí tăng 1."),
          tip("Hộp càng cao thì số càng lớn. Số vị trí ghi dưới chân mỗi hộp."),
        ],
      },
      {
        title: "Đi tới cuối hàng",
        mood: "think",
        blocks: [
          text("Hàng dài ngắn khác nhau thì không đếm trước được. Dùng **🔁 Lặp cho tới khi ở hộp cuối (Sang hộp kế)**: tới hộp cuối thì tự dừng."),
          tip("Ở hộp cuối mà vẫn Sang hộp kế thì robot hết đường, chương trình dừng với lỗi.", "warn"),
        ],
      },
    ],
    code: {
      levels: [
        store("d01-1", WALK, "at", [[4, 7, 1, 9, 3]], "3(>)", "Tới hộp có cờ 🚩 (vị trí 3).", { at: 3 }),
        store("d01-2", WALK, "at", [[6, 2, 8, 5, 1, 7, 4]], "5(>)", "Hộp có cờ ở vị trí 5. Robot đang ở vị trí 0.", { at: 5 }),
        store(
          "d01-3",
          SCAN,
          "last",
          [
            [3, 1, 4],
            [5, 9, 2, 6, 5, 3],
            [8, 8],
          ],
          "UE(>)",
          "Ba hàng dài khác nhau: đi tới hộp cuối mà không cần đếm.",
        ),
        store(
          "d01-4",
          SCAN,
          "find",
          [
            [4, 8, 15, 16, 23, 42],
            [7, 3, 9, 1],
            [2, 6, 10],
          ],
          "UX(>)",
          "Đi tới khi gặp hộp có số cần tìm.",
          { find: [16, 9, 10] },
        ),
      ],
    },
    practice: [qIndex, qLast],
  },
  {
    id: "lt-d02",
    title: "Tìm lớn nhất, nhỏ nhất",
    short: "Nhớ kỷ lục, gặp số lớn hơn thì nhớ lại",
    emoji: "🏆",
    slides: [
      {
        title: "Giữ kỷ lục",
        mood: "think",
        blocks: [
          text("Muốn tìm số **lớn nhất**: nhớ hộp đầu tiên làm kỷ lục. Đi lần lượt từng hộp, gặp hộp **lớn hơn số đã nhớ** thì **nhớ hộp đó**. Đi hết hàng là kỷ lục chính là số lớn nhất!"),
          text("Khối **🧠 Nhớ hộp này** ghi nhớ hộp đang đứng (hộp có dấu 🧠)."),
          tip("Trong Python: `nho = 0`, rồi `for i in range(len(a)): if a[i] > a[nho]: nho = i`."),
        ],
      },
    ],
    code: {
      levels: [
        store(
          "d02-1",
          MAXB,
          "max",
          [
            [3, 8, 2, 6],
            [5, 1, 9, 4, 7],
            [2, 4, 6, 8],
          ],
          "! UE(> M?(!))",
          "Nhớ hộp đầu, đi tới cuối hàng, gặp số lớn hơn thì nhớ lại.",
        ),
        store(
          "d02-2",
          MAXB,
          "max",
          [
            [9, 3, 5, 1, 7],
            [4, 2, 8, 6, 3, 5],
            [1, 7, 3],
          ],
          "! UE(> M?(!))",
          "Có hàng số lớn nhất nằm ngay hộp đầu đó nha.",
        ),
        store(
          "d02-3",
          MAXB,
          "min",
          [
            [6, 2, 8, 4],
            [7, 9, 3, 5, 1],
            [2, 5, 4],
          ],
          "! UE(> N?(!))",
          "Giờ tìm số nhỏ nhất: đổi điều kiện so sánh.",
        ),
        store(
          "d02-4",
          MAXB,
          "min",
          [
            [8, 6, 9, 3, 7, 5, 4],
            [5, 3, 1, 2, 4],
            [9, 8, 7, 6, 5],
          ],
          "! UE(> N?(!))",
          "Hàng dài hơn, vẫn chương trình đó.",
        ),
      ],
    },
    practice: [qMaxMem, qMaxChanges],
  },
  {
    id: "lt-d03",
    title: "Tìm kiếm",
    short: "Tìm tuần tự từng hộp, và mẹo chia đôi",
    emoji: "🔎",
    slides: [
      {
        title: "Tìm tuần tự",
        mood: "happy",
        blocks: [
          text("**Tìm tuần tự**: xem từ hộp đầu, từng hộp một, thấy số cần tìm là dừng. Chắc chắn tìm được, nhưng hàng dài thì lâu."),
          tip("Trong Python: `i = 0`, `while a[i] != can_tim: i += 1`."),
        ],
      },
      {
        title: "Tìm nhị phân: chia đôi",
        mood: "wow",
        blocks: [
          text("Nếu danh sách **đã xếp tăng dần**, có cách nhanh hơn nhiều: xem hộp **ở giữa**. Số cần tìm nhỏ hơn thì bỏ nửa phải, lớn hơn thì bỏ nửa trái. Mỗi lần **bỏ đi một nửa**!"),
          text("1000 hộp mà chỉ cần xem khoảng **10 lần**. Đó là cách em đoán số 1 tới 100: đoán 50, rồi 25 hay 75…"),
          tip("Tìm nhị phân chỉ đúng khi danh sách **đã xếp**. Chưa xếp thì phải tìm tuần tự (hoặc xếp trước, ở bài sau).", "warn"),
        ],
      },
    ],
    code: {
      levels: [
        store(
          "d03-1",
          SCAN,
          "find",
          [
            [12, 5, 30, 7, 18],
            [3, 9, 27],
            [40, 2, 8, 16, 32, 64],
          ],
          "UX(>)",
          "Tìm tuần tự: đi tới khi gặp đúng số cần tìm.",
          { find: [7, 27, 16] },
        ),
        store(
          "d03-2",
          SCAN,
          "find",
          [
            [5, 1, 4],
            [6, 2, 9, 4, 8, 1, 7],
            [3, 3, 1, 2],
          ],
          "UX(>)",
          "Số cần tìm có khi nằm ngay hộp đầu, có khi ở cuối.",
          { find: [5, 7, 1] },
        ),
        store(
          "d03-3",
          MAXB,
          "find",
          [
            [2, 4, 6, 8, 10, 12, 14],
            [1, 3, 5, 7, 9],
            [10, 20, 30, 40],
          ],
          "UX(>)",
          "Hàng đã xếp tăng dần. Robot chỉ đi từng hộp được, nhưng em hãy đoán: tìm nhị phân sẽ xem hộp nào trước?",
          { find: [12, 3, 30] },
        ),
      ],
    },
    practice: [qSeqSearch, qBinary],
  },
  {
    id: "lt-d04",
    title: "Sắp xếp nổi bọt",
    short: "So từng cặp, lớn hơn thì đổi chỗ, số lớn nổi dần về cuối",
    emoji: "🫧",
    slides: [
      {
        title: "Đổi chỗ hai hộp",
        mood: "think",
        blocks: [
          text("Khối **🔀 Đổi chỗ với hộp kế** đổi hộp đang đứng với hộp bên phải. Hộp **lớn hơn hộp kế** thì đổi, nhỏ hơn thì để yên."),
          text("Đi từ đầu tới cuối hàng làm như vậy là **một lượt**: số lớn nhất sẽ **nổi** dần về cuối hàng như bong bóng nổi lên mặt nước."),
        ],
      },
      {
        title: "Nhiều lượt là xếp xong",
        mood: "wow",
        blocks: [
          text("Mỗi lượt đưa thêm một số lớn về đúng chỗ. Hàng 4 hộp cần **3 lượt**: **Lặp 3 lần (Về hộp đầu · Lặp tới khi ở hộp cuối (Nếu hộp này > hộp kế thì Đổi chỗ · Sang hộp kế))**."),
          tip("Đây là thuật toán **sắp xếp nổi bọt** (bubble sort), một trong những thuật toán đầu tiên dân lập trình nào cũng học."),
        ],
      },
    ],
    code: {
      levels: [
        store("d04-1", ["swap", "next"], "sort", [[2, 1, 3]], "%", "Hai hộp đầu bị ngược. Đổi chỗ một lần là xong."),
        store("d04-2", ["swap", "next"], "sort", [[1, 3, 2]], "> %", "Cặp bị ngược nằm ở giữa: sang hộp kế rồi đổi."),
        store(
          "d04-3",
          SORT,
          "sort",
          [
            [3, 1, 2, 4],
            [2, 1, 3, 5, 4],
            [1, 3, 2],
          ],
          "UE(S?(%) >)",
          "Một lượt nổi bọt: so từng cặp tới cuối hàng.",
        ),
        store(
          "d04-4",
          SORT,
          "sort",
          [
            [4, 3, 2, 1],
            [3, 1, 4, 2],
            [2, 4, 1, 3],
          ],
          "3(^ UE(S?(%) >))",
          "Một lượt chưa đủ. Lặp nhiều lượt, mỗi lượt về hộp đầu.",
        ),
        store(
          "d04-5",
          SORT,
          "sort",
          [
            [5, 1, 4, 2, 3],
            [5, 4, 3, 2, 1],
            [2, 5, 3, 1, 4],
          ],
          "4(^ UE(S?(%) >))",
          "Màn trùm: 5 hộp cần mấy lượt?",
        ),
      ],
    },
    practice: [qBubble, qBubblePasses],
  },
  {
    id: "lt-d05",
    title: "Đệ quy",
    short: "Hàm tự gọi chính nó, có điều kiện để dừng",
    emoji: "🪞",
    slides: [
      {
        title: "Hàm gọi chính nó",
        mood: "wow",
        blocks: [
          text("**Đệ quy** là khi hàm **tự gọi chính nó**. Hàm **đi**: *nếu phía trước có đường thì (Đi tới · Gọi đi)*. Bước một ô rồi lại làm hàm đi, tới khi hết đường."),
          demo(corridor("5(F)", 1), 1, "di{P?(F @di)} @di", "Hàm đi (Nếu có đường phía trước thì (Đi tới · Gọi đi)), rồi Gọi đi"),
        ],
      },
      {
        title: "Điều kiện dừng",
        mood: "think",
        blocks: [
          text("Khối **Nếu** trong hàm là **điều kiện dừng**: hết đường thì không gọi nữa, các lần gọi lần lượt kết thúc."),
          tip("Thiếu điều kiện dừng thì hàm gọi mãi không dừng! Bộ chạy sẽ chặn lại và nhắc em.", "warn"),
          tip("Đệ quy dùng nhiều trong vẽ cây, chia đôi để tìm, duyệt thư mục máy tính…"),
        ],
      },
    ],
    code: {
      levels: [
        multi(
          "d05-1",
          REC,
          [
            [1, "4(F)"],
            [1, "7(F)"],
            [1, "2(F)"],
          ],
          "di{P?(F @di)} @di",
          "Không có khối Lặp. Cho hàm tự gọi lại chính nó.",
        ),
        multi(
          "d05-2",
          REC,
          [
            [1, "3(F) L 4(F)"],
            [1, "5(F) L 2(F)"],
            [1, "F L 5(F)"],
          ],
          "di{P?(F @di)} @di L @di",
          "Đi hết đoạn, rẽ trái, lại đi hết đoạn.",
        ),
        multi(
          "d05-3",
          REC,
          [
            [1, "4(F) R 3(F) R 3(F) R 2(F)"],
            [1, "3(F) R 3(F) R 2(F) R F"],
            [1, "5(F) R 2(F) R 4(F)"],
          ],
          "x{P?(F | R) @x} @x",
          "Xoắn ốc: có đường thì đi, hết đường thì rẽ phải, rồi gọi lại.",
        ),
        multi(
          "d05-4",
          REC,
          [
            [0, "2(F) R 2(F) L 3(F) L F"],
            [0, "F L 2(F) R 2(F) R 2(F)"],
            [0, "3(F) L 3(F)"],
          ],
          "di{P?(F | A?(L | R)) @di} @di",
          "Màn trùm: đường rẽ hai phía, hàm tự nhìn rồi tự gọi lại.",
        ),
      ],
    },
    practice: [qRecursion, qRecursionStop],
  },
  {
    id: "lt-d06",
    title: "Mê cung bám tường",
    short: "Tay phải luôn chạm tường là ra khỏi mê cung",
    emoji: "🌀",
    slides: [
      {
        title: "Mẹo của nhà thám hiểm",
        mood: "think",
        blocks: [
          text("Lạc trong mê cung? Đặt **tay phải lên tường** rồi cứ đi, không bao giờ buông tay. Với mê cung không có vòng tròn, cách này chắc chắn tới được lối ra!"),
          text("Viết thành chương trình: **Lặp tới khi tới cờ (Nếu bên phải có đường thì (Rẽ phải · Đi tới) không thì (Nếu phía trước có đường thì Đi tới không thì Rẽ trái))**."),
          tip("Ưu tiên **phải**, rồi **thẳng**, cuối cùng mới **trái**. Cụt đường thì rẽ trái hai lần là quay đầu."),
        ],
      },
    ],
    code: {
      levels: [
        mazes("d06-1", 3, 3, [3, 8, 21], 1, "U(D?(R F | P?(F | L)))", "Ba mê cung, một chương trình: bám tường bên phải."),
        mazes("d06-2", 4, 3, [5, 12, 40], 1, "U(D?(R F | P?(F | L)))", "Mê cung rộng hơn, vẫn bám tường phải."),
        mazes("d06-3", 4, 4, [2, 17, 33], 2, "U(A?(L F | P?(F | R)))", "Lần này thử bám tường bên trái xem sao."),
        mazes("d06-4", 5, 4, [9, 26, 51], 1, "U(D?(R F | P?(F | L)))", "Màn trùm: mê cung lớn nhất."),
      ],
    },
    practice: [qWallFollow],
  },
];

export const unitsNangCao: Unit[] = [
  { id: "lt-nc-1", title: "Danh sách", lessons: nangCao.slice(0, 3).map(make("lt-cover-nang-cao")) },
  { id: "lt-nc-2", title: "Sắp xếp", lessons: nangCao.slice(3, 4).map(make("lt-cover-nang-cao")) },
  { id: "lt-nc-3", title: "Đệ quy và mê cung", lessons: nangCao.slice(4).map(make("lt-cover-nang-cao")) },
];
