import type { Block, CodeSpec, Lesson, QuestionGen, Slide, Unit } from "@/content/types";
import type { BlockKind, Level } from "@/lib/code/world";
import { qBug, qFacing, qPath, qShortest, qSteps } from "./questions";

/**
 * Môn Lập trình khối lệnh. Mỗi bài: 1-2 slide giới thiệu khối mới (có lưới chạy thử),
 * luyện tập là chuỗi màn kéo khối (src/components/code/CodePractice.tsx), thêm màn sinh ngẫu nhiên.
 * Bản đồ màn chơi: xem chú thích ở src/lib/code/world.ts.
 */

const text = (t: string): Block => ({ type: "text", text: t });
const tip = (t: string, tone?: "warn"): Block => ({ type: "tip", text: t, tone });
const demo = (map: string[], dir: 0 | 1 | 2 | 3, program: string, label?: string): Block => ({ type: "code", map, dir, program, label });

const MOVE: BlockKind[] = ["forward"];
const TURN: BlockKind[] = ["forward", "left", "right"];

interface Def {
  id: string;
  title: string;
  short: string;
  emoji: string;
  slides: Slide[];
  code: CodeSpec;
  practice: QuestionGen[];
}

const make = (cover: string) => (d: Def): Lesson => ({ id: d.id, title: d.title, short: d.short, emoji: d.emoji, cover, minutes: 6, slides: d.slides, practice: d.practice, code: d.code });

const lv = (id: string, blocks: BlockKind[], dir: 0 | 1 | 2 | 3, map: string[], hint?: string, preset?: string): Level => ({ id, blocks, dir, map, hint, preset });

// ───────────────────────── Trình độ 1 · Vỡ lòng ─────────────────────────
const voLong: Def[] = [
  {
    id: "lt-a01",
    title: "Đi thẳng",
    short: "Khối Đi tới: mỗi khối một bước",
    emoji: "👣",
    slides: [
      {
        title: "Mochi nghe lệnh của em",
        mood: "happy",
        voice: "vo-lt-a01",
        blocks: [
          text("Máy tính không tự nghĩ được, nó chỉ làm **đúng từng lệnh** mình đưa. Chuỗi lệnh đó gọi là **chương trình**."),
          text("Khối **Đi tới** bảo Mochi bước **1 ô** về phía trước mặt. Muốn đi 3 ô thì xếp 3 khối."),
          demo(["S..G"], 1, "F F F", "Ba khối Đi tới: Mochi tới cờ"),
        ],
      },
      {
        title: "Kéo khối, rồi bấm Chạy",
        mood: "think",
        blocks: [
          text("Ở màn chơi, kéo khối từ cột bên trái và **gắn vào dưới** khối ▶ Khi bấm Chạy. Khối nào không gắn vào thì Mochi không làm."),
          tip("Mochi đi sai? Không sao cả! Bấm **Làm lại**, sửa khối rồi chạy tiếp. Lập trình viên giỏi cũng sửa đi sửa lại nhiều lần."),
        ],
      },
    ],
    code: {
      levels: [
        lv("a01-1", MOVE, 1, ["S.G"], "Kéo 2 khối Đi tới gắn vào dưới ▶ rồi bấm Chạy."),
        lv("a01-2", MOVE, 1, ["S...G"], "Cờ xa hơn rồi. Đếm ô trước khi xếp khối nhé."),
        lv("a01-3", MOVE, 0, ["G", ".", ".", "S"], "Lần này Mochi nhìn lên trên."),
        lv("a01-4", MOVE, 3, ["#####", "G...S", "#####"], "Mochi nhìn sang trái."),
        lv("a01-5", MOVE, 2, ["#S#", "#.#", "#.#", "#.#", "#.#", "#G#"], "Đường dài! Đếm thật kỹ."),
      ],
      gen: { w: 5, h: 5, min: 2, max: 4, blocks: MOVE, walls: 0.2 },
      genCount: 1,
    },
    practice: [qSteps],
  },
  {
    id: "lt-a02",
    title: "Rẽ trái, rẽ phải",
    short: "Quay người tại chỗ để đổi hướng",
    emoji: "↪️",
    slides: [
      {
        title: "Quay người, không bước",
        mood: "wow",
        blocks: [
          text("Khối **Rẽ trái** và **Rẽ phải** làm Mochi **quay người** sang tay trái hoặc tay phải của Mochi. Quay xong vẫn đứng nguyên ô cũ."),
          demo(["..G", "S.."], 1, "F F L F", "Đi 2 ô, rẽ trái, đi 1 ô"),
          tip("Trái phải là theo **mặt Mochi**, không phải theo màn hình. Mochi nhìn xuống thì rẽ trái là sang phải màn hình đó!"),
        ],
      },
    ],
    code: {
      levels: [
        lv("a02-1", TURN, 0, [".G", "S."], "Đi lên 1 ô, rồi rẽ phải."),
        lv("a02-2", TURN, 1, ["#..G", "#.##", "S.##"], "Đường có một khúc quanh."),
        lv("a02-3", TURN, 0, ["G..#", "##.#", "##.#", "##S#"], "Lần này rẽ trái."),
        lv("a02-4", TURN, 1, ["S..#", "##.#", "G..#"], "Hai khúc quanh."),
        lv("a02-5", TURN, 2, ["#S##", "#..#", "##.G"], "Đường bậc thang."),
        lv("a02-6", TURN, 3, ["G.#", "#.#", "#..", "##S"], "Đường ngoằn ngoèo, nhìn kỹ nhé."),
      ],
      gen: { w: 5, h: 5, min: 4, max: 7, turns: 1, blocks: TURN, walls: 0.3 },
      genCount: 1,
    },
    practice: [qFacing, qPath],
  },
  {
    id: "lt-a03",
    title: "Nhặt sao",
    short: "Đi qua mọi ngôi sao rồi mới tới cờ",
    emoji: "⭐",
    slides: [
      {
        title: "Nhặt hết sao rồi về cờ",
        mood: "happy",
        blocks: [
          text("Mochi bước lên ô có ⭐ là nhặt được sao. Phải **nhặt hết sao** thì tới cờ mới tính là qua màn."),
          demo(["S*.", "..*", "..G"], 1, "F F R F F", "Đi qua cả hai ngôi sao"),
          tip("Trước khi xếp khối, lấy ngón tay vẽ đường đi trên màn hình: qua sao nào trước, sao nào sau."),
        ],
      },
    ],
    code: {
      levels: [
        lv("a03-1", TURN, 1, ["S*G"], "Ngôi sao nằm ngay trên đường."),
        lv("a03-2", TURN, 0, ["*.G", "..#", "S.#"], "Sao ở góc trên. Đi lên trước."),
        lv("a03-3", TURN, 1, ["S.#", "#.*", "#G#"], "Ghé lấy sao rồi quay lại."),
        lv("a03-4", TURN, 1, ["S..*", "###.", "G*..", ], "Hai ngôi sao, một đường vòng."),
        lv("a03-5", TURN, 0, ["*...*", ".###.", "S###G"], "Đi vòng qua hai góc trên."),
      ],
      gen: { w: 5, h: 5, stars: 1, min: 4, max: 9, turns: 1, blocks: TURN, walls: 0.25 },
      genCount: 1,
    },
    practice: [qPath, qFacing],
  },
  {
    id: "lt-a04",
    title: "Tìm khối sai",
    short: "Gỡ lỗi: sửa chương trình có sẵn",
    emoji: "🐞",
    slides: [
      {
        title: "Con bọ trong chương trình",
        mood: "think",
        blocks: [
          text("Chương trình chạy sai gọi là có **lỗi** (người ta hay gọi là **bug**, con bọ). Tìm và sửa lỗi gọi là **gỡ lỗi**."),
          text("Ở bài này, chương trình đã xếp sẵn nhưng có khối sai. Bấm **Từng bước** để xem Mochi làm từng lệnh, khối đang chạy sẽ sáng lên."),
          demo(["..G", "...", "S.."], 1, "F F R F F", "Rẽ phải là sai: Mochi đi xuống, đụng mép. Đúng ra phải rẽ trái"),
          tip("Kéo khối sai ra khỏi chương trình (thả về cột bên trái để xóa), rồi gắn khối đúng vào chỗ đó."),
        ],
      },
    ],
    code: {
      levels: [
        lv("a04-1", TURN, 1, ["S...G"], "Thiếu một bước. Thêm khối nào?", "F F F"),
        lv("a04-2", TURN, 1, ["..G", "S.."], "Rẽ nhầm hướng rồi.", "F R F F"),
        lv("a04-3", TURN, 0, ["..G", "..#", "S.#"], "Có một khối thừa.", "F F F R F F"),
        lv("a04-4", TURN, 1, ["S.#", "#.#", "#..G"].map((r) => r.padEnd(4, "#")), "Thiếu một bước ở khúc giữa.", "F R F L F F"),
        lv("a04-5", TURN, 2, ["S##", ".*#", ".G#"], "Rẽ nhầm nên không ghé được sao.", "F R F R F"),
      ],
    },
    practice: [qBug],
  },
  {
    id: "lt-a05",
    title: "Đường ngắn nhất",
    short: "Ít khối nhất thì được 3 sao",
    emoji: "🏁",
    slides: [
      {
        title: "Chương trình gọn là chương trình giỏi",
        mood: "wow",
        blocks: [
          text("Thường có nhiều đường tới cờ. Lập trình viên giỏi chọn cách **ít lệnh nhất**: máy chạy nhanh hơn, người khác đọc cũng dễ hơn."),
          text("Ở màn chơi có ghi **số khối tối ưu**. Dùng đúng bằng số đó là được ⭐⭐⭐."),
          tip("Rẽ phải 3 lần cũng quay về đúng hướng như rẽ trái 1 lần, nhưng tốn tới 3 khối!"),
        ],
      },
    ],
    code: {
      levels: [
        lv("a05-1", TURN, 1, ["S...", ".##.", "...G"], "Hai đường bằng nhau, chọn đường nào cũng được."),
        lv("a05-2", TURN, 2, ["S....", ".###.", ".....", ".###.", "G...."], "Đường thẳng xuống là ngắn nhất?"),
        lv("a05-3", TURN, 1, [".....", ".###.", "S#G#.", ".....", "....."], "Đường vòng nào ngắn hơn?"),
        lv("a05-4", TURN, 3, ["G...*", "####.", "....S"], "Đi lên lấy sao trước."),
        lv("a05-5", TURN, 0, ["*..G", ".#..", "S..*"], "Màn trùm: hai ngôi sao, chọn thứ tự cho khéo."),
      ],
      gen: { w: 5, h: 5, stars: 1, min: 6, max: 11, turns: 2, blocks: TURN, walls: 0.3 },
      genCount: 2,
    },
    practice: [qShortest, qPath],
  },
];

export const unitsVoLong: Unit[] = [
  { id: "lt-vl-1", title: "Đi và rẽ", lessons: voLong.slice(0, 3).map(make("lt-cover-vo-long")) },
  { id: "lt-vl-2", title: "Sửa lỗi, đi gọn", lessons: voLong.slice(3).map(make("lt-cover-vo-long")) },
];
