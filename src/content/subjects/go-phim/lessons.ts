import type { Block, Lesson, Question, QuestionGen, Slide, TypingSpec, Unit } from "@/content/types";
import type { Rng } from "@/lib/rng";

/**
 * Môn Gõ phím 10 ngón. Mỗi bài: 2-3 slide (ngón nào gõ phím nào, gõ thử),
 * luyện tập là trò chơi "thợ lặn và cá mập" (xem src/components/typing/SharkGame.tsx).
 * Bắt đầu không dấu; trình độ cuối học gõ Telex ngay trong app.
 */

const HOME = "asdfghjkl;";

/** sinh một "cụm" 1-3 ký tự từ các phím, phím mới hay ra hơn */
export function keyChunk(rng: Rng, keys: string, focus = "", max = 3): string {
  const pool = [...keys.replace(/ /g, "")];
  const hot = [...focus];
  const n = rng.int(1, max);
  return Array.from({ length: n }, () => (hot.length && rng.next() < 0.5 ? rng.pick(hot) : rng.pick(pool))).join("");
}

/** một dòng luyện gõ cho câu hỏi kiểu "type" (dùng ở thử thách, kiểm tra, thi đấu) */
export function lineFor(spec: TypingSpec, rng: Rng): string {
  if (spec.unit === "word" && spec.words?.length) {
    const ws = rng.shuffle(spec.words);
    const out: string[] = [];
    for (const w of ws) {
      if (out.join(" ").length + w.length > 22 && out.length) break;
      out.push(w);
    }
    return out.join(" ");
  }
  return Array.from({ length: 4 }, () => keyChunk(rng, spec.keys, spec.focus, 3)).join(" ");
}

const typeQ =
  (topic: string, spec: TypingSpec): QuestionGen =>
  (rng) => {
    const line = lineFor(spec, rng);
    const q: Question = { id: `${topic}-${line}`, prompt: `Gõ: ${line}`, kind: "type", answer: line, topic };
    return q;
  };

const kb = (keys: string, focus?: string, label?: string): Block => ({ type: "keyboard", keys, focus, label });
const text = (t: string): Block => ({ type: "text", text: t });
const tip = (t: string, tone?: "warn"): Block => ({ type: "tip", text: t, tone });
const drill = (t: string, label?: string): Block => ({ type: "drill", text: t, label });

interface Def {
  id: string;
  title: string;
  short: string;
  glyph: string;
  spec: TypingSpec;
  slides: Slide[];
}

const make = (cover: string) => (d: Def): Lesson => ({
  id: d.id,
  title: d.title,
  short: d.short,
  emoji: "⌨️",
  cover,
  glyph: d.glyph,
  minutes: 5,
  slides: d.slides,
  practice: [typeQ(d.id, d.spec)],
  typing: d.spec,
});

// ───────────────────────── Trình độ 1 · Hàng phím nhà ─────────────────────────
const nha: Def[] = [
  {
    id: "gp-n01",
    title: "Tư thế và phím F J",
    short: "Hai ngón trỏ tìm gờ nổi",
    glyph: "F J",
    spec: { keys: "fj", focus: "fj", unit: "key", count: 16, speed: 1 },
    slides: [
      {
        title: "Ngồi thẳng, tay thả lỏng",
        mood: "happy",
        voice: "vo-gp-n01",
        blocks: [
          text("Lưng thẳng, mắt nhìn màn hình, khuỷu tay vuông góc. **Không nhìn bàn phím** khi gõ, nhìn màn hình thôi."),
          kb(HOME, "fj", "Hai phím F và J có gờ nổi nhỏ. Hai ngón trỏ đặt lên đó."),
          tip("Mất chỗ? Sờ tìm gờ nổi trên F và J là tay về đúng vị trí, không cần nhìn."),
        ],
      },
      {
        title: "Gõ thử F và J",
        mood: "think",
        blocks: [
          kb("fj ", "fj"),
          text("Ngón **trỏ trái** gõ F, ngón **trỏ phải** gõ J. Ngón cái gõ phím cách."),
          drill("fff jjj fj fj jf jf", "Gõ dòng này, nhìn màn hình nhé"),
        ],
      },
    ],
  },
  {
    id: "gp-n02",
    title: "Ngón giữa: D K",
    short: "Thêm hai phím cạnh F J",
    glyph: "D K",
    spec: { keys: "fjdk", focus: "dk", unit: "key", count: 18, speed: 1 },
    slides: [
      {
        title: "Ngón giữa gõ D và K",
        mood: "happy",
        blocks: [kb(HOME, "dk"), text("Đặt lại tám ngón lên hàng nhà. Ngón **giữa trái** là D, ngón **giữa phải** là K."), drill("ddd kkk dk kd fd jk dfjk")],
      },
    ],
  },
  {
    id: "gp-n03",
    title: "Ngón áp út: S L",
    short: "Ngón yếu cần tập nhiều",
    glyph: "S L",
    spec: { keys: "fjdksl", focus: "sl", unit: "key", count: 20, speed: 1.1 },
    slides: [
      {
        title: "Ngón áp út gõ S và L",
        mood: "think",
        blocks: [kb(HOME, "sl"), text("Ngón áp út hơi yếu, gõ chậm mà chắc. Các ngón khác vẫn nằm yên trên hàng nhà."), drill("sss lll sl ls sdf jkl lds")],
      },
    ],
  },
  {
    id: "gp-n04",
    title: "Ngón út: A và ;",
    short: "Đủ tám ngón trên hàng nhà",
    glyph: "A ;",
    spec: { keys: "asdfjkl;", focus: "a;", unit: "key", count: 22, speed: 1.1 },
    slides: [
      {
        title: "Ngón út giữ hai đầu",
        mood: "wow",
        blocks: [kb(HOME, "a;"), text("Ngón **út trái** là A, ngón **út phải** là dấu chấm phẩy **;**. Giờ em đã có đủ tám ngón trên hàng nhà!"), drill("aaa ;;; asdf jkl; a; ;a")],
      },
    ],
  },
  {
    id: "gp-n05",
    title: "Ngón trỏ với tới G H",
    short: "Trỏ trượt vào giữa rồi về",
    glyph: "G H",
    spec: { keys: HOME, focus: "gh", unit: "key", count: 22, speed: 1.2 },
    slides: [
      {
        title: "G và H ở giữa",
        mood: "think",
        blocks: [kb(HOME, "gh"), text("Ngón **trỏ trái** trượt sang phải gõ G, ngón **trỏ phải** trượt sang trái gõ H. Gõ xong về lại F, J ngay."), drill("fgf jhj gh hg fghj")],
      },
    ],
  },
  {
    id: "gp-n06",
    title: "Từ đầu tiên",
    short: "Gõ cả từ trên hàng nhà",
    glyph: "ha ha",
    spec: { keys: HOME, unit: "word", words: ["ha", "la", "da", "ga", "sa", "gala", "hall", "flash", "salad", "glad", "dash", "half", "ask", "flask", "lass", "jak", "kal", "had", "has", "shall"], count: 16, speed: 1.1 },
    slides: [
      {
        title: "Gõ thành từ",
        mood: "cheer",
        blocks: [kb(HOME), text("Chỉ với hàng nhà, em đã gõ được nhiều từ rồi. Gõ hết từ thì bấm phím cách bằng ngón cái."), drill("ha ha la da ga salad")],
      },
    ],
  },
];

// ───────────────────────── Trình độ 2 · Từng bàn tay ─────────────────────────
const TOP_L = "qwert";
const TOP_R = "yuiop";
const BOT_L = "zxcvb";
const BOT_R = "nm,./";
const tay: Def[] = [
  {
    id: "gp-t01",
    title: "Tay trái, hàng trên",
    short: "Q W E R T",
    glyph: "Q W E",
    spec: { keys: HOME + TOP_L, focus: TOP_L, unit: "key", count: 22, speed: 1.2 },
    slides: [
      {
        title: "Với lên hàng trên",
        mood: "happy",
        voice: "vo-gp-t01",
        blocks: [kb(HOME + TOP_L, TOP_L), text("Mỗi ngón trái với thẳng lên trên: út Q, áp út W, giữa E, trỏ R và T. Gõ xong là **về hàng nhà**."), drill("fr ft de sw aq fr de sw")],
      },
    ],
  },
  {
    id: "gp-t02",
    title: "Tay phải, hàng trên",
    short: "Y U I O P",
    glyph: "U I O",
    spec: { keys: HOME + TOP_L + TOP_R, focus: TOP_R, unit: "key", count: 24, speed: 1.2 },
    slides: [
      {
        title: "Tay phải với lên",
        mood: "think",
        blocks: [kb(HOME + TOP_R, TOP_R), text("Trỏ phải gõ Y và U, giữa I, áp út O, út P."), drill("ju jy ki lo ;p ju ki lo")],
      },
    ],
  },
  {
    id: "gp-t03",
    title: "Tay trái, hàng dưới",
    short: "Z X C V B",
    glyph: "Z X C",
    spec: { keys: HOME + TOP_L + TOP_R + BOT_L, focus: BOT_L, unit: "key", count: 24, speed: 1.25 },
    slides: [
      {
        title: "Cụp ngón xuống hàng dưới",
        mood: "think",
        blocks: [kb(HOME + BOT_L, BOT_L), text("Ngón cụp xuống, hơi chéo vào trong: út Z, áp út X, giữa C, trỏ V và B."), drill("fv fb dc sx az fv dc")],
      },
    ],
  },
  {
    id: "gp-t04",
    title: "Tay phải, hàng dưới",
    short: "N M , . /",
    glyph: "N M",
    spec: { keys: HOME + TOP_L + TOP_R + BOT_L + BOT_R, focus: "nm,.", unit: "key", count: 24, speed: 1.25 },
    slides: [
      {
        title: "Đủ cả bảng chữ cái!",
        mood: "wow",
        blocks: [kb(HOME + BOT_R, BOT_R), text("Trỏ phải gõ N và M, giữa gõ dấu phẩy, áp út gõ dấu chấm. Giờ em đã gõ được **mọi chữ cái**."), drill("jn jm k, l. jn jm")],
      },
    ],
  },
  {
    id: "gp-t05",
    title: "Chỉ dùng tay trái",
    short: "Những từ toàn phím trái",
    glyph: "we",
    spec: { keys: "", unit: "word", words: ["we", "tea", "red", "sad", "fast", "card", "best", "free", "tree", "west", "crab", "dress", "great", "sweet", "after", "water", "brave", "zebra", "taxi", "draw"], count: 16, speed: 1.15 },
    slides: [
      {
        title: "Một tay cũng gõ được",
        mood: "happy",
        blocks: [kb(HOME + TOP_L + BOT_L), text("Các từ dưới đây chỉ dùng **tay trái**. Tay phải chỉ chạm phím cách thôi."), drill("we fast card tree")],
      },
    ],
  },
  {
    id: "gp-t06",
    title: "Chỉ dùng tay phải",
    short: "Những từ toàn phím phải",
    glyph: "you",
    spec: { keys: "", unit: "word", words: ["you", "him", "join", "pool", "kim", "lion", "moon", "only", "pink", "hook", "milk", "mom", "noon", "jump", "nhung", "minh", "nho", "phim", "kim", "hop"], count: 16, speed: 1.15 },
    slides: [
      {
        title: "Đổi sang tay phải",
        mood: "happy",
        blocks: [kb("hjklyuiopnm"), text("Giờ chỉ dùng **tay phải**. Nhớ: mắt nhìn màn hình!"), drill("you moon pink jump")],
      },
    ],
  },
];

// ───────────────────────── Trình độ 3 · Phối hợp hai tay ─────────────────────────
const phoiHop: Def[] = [
  {
    id: "gp-p01",
    title: "Hai tay thay phiên",
    short: "Gõ từ tiếng Việt không dấu",
    glyph: "hoa",
    spec: { keys: "", unit: "word", words: ["hoa", "lan", "con", "meo", "cho", "ga", "ca", "chim", "bong", "mua", "gio", "sao", "trang", "nha", "sach", "but", "ban", "vui", "hoc", "bien"], count: 18, speed: 1.2 },
    slides: [
      {
        title: "Hai tay cùng chơi",
        mood: "cheer",
        voice: "vo-gp-p01",
        blocks: [kb("qwertyuiopasdfghjklzxcvbnm"), text("Gõ tiếng Việt **không dấu** trước: hai tay luân phiên rất nhanh."), drill("con meo hoc bai vui")],
      },
    ],
  },
  {
    id: "gp-p02",
    title: "Chữ hoa với Shift",
    short: "Giữ Shift ở tay bên kia",
    glyph: "Aa",
    spec: { keys: "", unit: "word", words: ["Ha Noi", "Viet Nam", "Hue", "Da Lat", "Sai Gon", "Mochi", "Bit", "Lan", "Minh", "Nam", "An", "Binh", "Hoa", "Tuan", "Mai"], count: 16, speed: 1.1 },
    slides: [
      {
        title: "Shift tay bên kia",
        mood: "think",
        blocks: [
          kb("asdfghjkl"),
          text("Chữ hoa gõ bằng tay trái (như **H**)? Ngón **út phải** giữ Shift. Chữ ở tay phải (như **N**)? Ngón **út trái** giữ Shift."),
          drill("Ha Noi Viet Nam"),
        ],
      },
    ],
  },
  {
    id: "gp-p03",
    title: "Dấu câu",
    short: "Dấu phẩy, chấm, hỏi, than",
    glyph: ", . ?",
    spec: { keys: "", unit: "word", words: ["vui,", "nhe.", "ok?", "hay!", "ban oi,", "di thoi.", "that a?", "gioi qua!", "chao ban.", "ai do?"], count: 16, speed: 1.1 },
    slides: [
      {
        title: "Gõ dấu câu",
        mood: "think",
        blocks: [kb(",./;", ",./"), text("Dấu **?** là Shift + / , dấu **!** là Shift + 1. Sau dấu câu nhớ gõ một phím cách."), drill("ban oi, di thoi. hay!")],
      },
    ],
  },
  {
    id: "gp-p04",
    title: "Hàng số",
    short: "Với lên cao nhất",
    glyph: "1 2 3",
    spec: { keys: "1234567890", focus: "1234567890", unit: "key", count: 22, speed: 1.1 },
    slides: [
      {
        title: "Hàng số trên cùng",
        mood: "wow",
        blocks: [kb("1234567890"), text("Mỗi ngón phụ trách số ngay trên phím hàng trên của nó. Trỏ trái gõ 4 và 5, trỏ phải gõ 6 và 7."), drill("123 456 789 10 2025")],
      },
    ],
  },
  {
    id: "gp-p05",
    title: "Câu ngắn",
    short: "Gõ cả câu không dấu",
    glyph: "abc.",
    spec: {
      keys: "",
      unit: "word",
      words: ["con meo trang", "em yeu truong em", "hoc vui moi ngay", "ca map boi nhanh", "tho bit lan sau", "bien xanh mat", "go phim that vui", "sao sang tren troi", "ban phim cua em"],
      count: 10,
      speed: 0.9,
    },
    slides: [{ title: "Từng câu một", mood: "happy", blocks: [text("Mỗi con cá giờ mang **cả câu ngắn**. Gõ đều tay, không cần vội."), drill("hoc vui moi ngay")] }],
  },
  {
    id: "gp-p06",
    title: "Tăng tốc",
    short: "Cá nhanh hơn, từ dài hơn",
    glyph: "WPM",
    spec: { keys: "", unit: "word", words: ["truong", "nguoi", "nghieng", "khuyen", "thuyen", "chuyen", "nghien", "luyen", "tuyet", "quyen", "khoang", "thuong", "phuong", "huong", "duong"], count: 18, speed: 1.4 },
    slides: [
      {
        title: "Nhanh mà vẫn đúng",
        mood: "wow",
        blocks: [text("**WPM** là số từ em gõ được trong một phút. Bạn mới tập thường 10 đến 20 WPM, gõ giỏi là 40 trở lên."), tip("Đúng trước, nhanh sau. Sai nhiều thì chậm lại một chút.")],
      },
    ],
  },
];

// ───────────────────────── Trình độ 4 · Gõ tiếng Việt (Telex) ─────────────────────────
const telex: Def[] = [
  {
    id: "gp-v01",
    title: "Telex: â ê ô",
    short: "Gõ hai lần: aa ee oo",
    glyph: "â ê ô",
    spec: { keys: "", unit: "word", words: ["cân", "sân", "lên", "bên", "tên", "ông", "hôm", "mây", "tây", "cô", "bô", "trên", "dân", "nên"], count: 16, speed: 1 },
    slides: [
      {
        title: "Gõ tiếng Việt có dấu",
        mood: "wow",
        voice: "vo-gp-v01",
        blocks: [
          text("Học Vui tự ghép chữ theo kiểu **Telex**, em không cần cài bộ gõ. Muốn có **â** thì gõ **aa**, **ê** là **ee**, **ô** là **oo**."),
          tip("Nếu máy đang bật bộ gõ tiếng Việt (Unikey, EVKey, bàn phím Việt của iPad), hãy chuyển sang tiếng Anh trước khi chơi.", "warn"),
          drill("cân sân lên ông", "Gõ: caan saan leen oong"),
        ],
      },
    ],
  },
  {
    id: "gp-v02",
    title: "Telex: ă ơ ư đ",
    short: "aw ow uw dd",
    glyph: "ơ ư đ",
    spec: { keys: "", unit: "word", words: ["ăn", "trăng", "mơ", "cơm", "hơn", "thư", "đi", "đen", "đông", "lưng", "trưa", "ơn", "sư", "đêm"], count: 16, speed: 1 },
    slides: [
      {
        title: "Chữ có móc và đ",
        mood: "think",
        blocks: [text("**ă** = aw, **ơ** = ow, **ư** = uw, **đ** = dd. Chữ **ươ** gõ là uwow."), kb("wd", "wd"), drill("ăn cơm đi đêm")],
      },
    ],
  },
  {
    id: "gp-v03",
    title: "Năm dấu thanh",
    short: "s f r x j ở cuối tiếng",
    glyph: "á à ả",
    spec: { keys: "", unit: "word", words: ["má", "mà", "mả", "mã", "mạ", "bé", "cá", "lá", "cỏ", "mũ", "nhỏ", "bạn", "về", "sẽ", "đẹp"], count: 18, speed: 1 },
    slides: [
      {
        title: "Dấu gõ ở cuối",
        mood: "think",
        blocks: [
          text("Gõ hết chữ rồi mới gõ dấu: **s** sắc, **f** huyền, **r** hỏi, **x** ngã, **j** nặng. Ví dụ **cá** = cas, **bạn** = banj."),
          kb("sfrxj", "sfrxj"),
          drill("má mà mả mã mạ"),
        ],
      },
    ],
  },
  {
    id: "gp-v04",
    title: "Từ có dấu",
    short: "Ghép dấu mũ và dấu thanh",
    glyph: "cá mập",
    spec: { keys: "", unit: "word", words: ["cá mập", "thợ lặn", "bàn phím", "biển xanh", "ngôi sao", "đường đua", "con thỏ", "học sinh", "bạn bè", "tàu ngầm", "rạn san hô", "ánh đèn"], count: 14, speed: 0.95 },
    slides: [
      {
        title: "Ghép tất cả lại",
        mood: "cheer",
        blocks: [text("**thợ** = thowj, **lặn** = lawnj, **đường** = dduwowngf. Dấu mũ gõ ngay sau chữ, dấu thanh gõ cuối cùng."), drill("cá mập thợ lặn")],
      },
    ],
  },
  {
    id: "gp-v05",
    title: "Câu có dấu",
    short: "Chữ hoa, dấu câu, có dấu",
    glyph: "Câu",
    spec: {
      keys: "",
      unit: "word",
      words: ["Em gõ bằng mười ngón.", "Cá mập bơi rất nhanh.", "Thỏ Bit lặn xuống biển.", "Hôm nay trời đẹp quá!", "Bạn đã ăn cơm chưa?", "Học vui mỗi ngày."],
      count: 8,
      speed: 0.8,
    },
    slides: [{ title: "Cả câu tiếng Việt", mood: "happy", blocks: [text("Giờ là câu hoàn chỉnh: chữ hoa đầu câu, có dấu, có dấu chấm cuối câu."), drill("Học vui mỗi ngày.")] }],
  },
  {
    id: "gp-v06",
    title: "Gõ đoạn văn",
    short: "Nối tiếp vào Bài gõ hay",
    glyph: "¶",
    spec: {
      keys: "",
      unit: "word",
      words: ["Biển sâu có nhiều bí mật.", "Rạn san hô sáng lấp lánh.", "Cá mập không ăn bàn phím.", "Mười ngón tay là mười người bạn.", "Gõ đúng rồi mới gõ nhanh."],
      count: 8,
      speed: 0.85,
    },
    slides: [
      {
        title: "Sẵn sàng cho đoạn văn",
        mood: "cheer",
        blocks: [text("Em đã gõ được tiếng Việt có dấu. Vào **Bài gõ hay** để gõ cả đoạn văn, bài thơ, hoặc **Đua xe** với bạn nhé!"), drill("Mười ngón tay là mười người bạn.")],
      },
    ],
  },
];

const u = (id: string, title: string, cover: string, defs: Def[]): Unit => ({ id, title, lessons: defs.map(make(cover)) });

export const unitsNha: Unit[] = [u("gp-u-nha", "Tám ngón trên hàng nhà", "gp-cover-nha", nha)];
export const unitsTay: Unit[] = [u("gp-u-tay", "Hàng trên, hàng dưới", "gp-cover-tay", tay)];
export const unitsPhoiHop: Unit[] = [u("gp-u-phoi", "Hai tay phối hợp", "gp-cover-phoi", phoiHop)];
export const unitsTelex: Unit[] = [u("gp-u-telex", "Gõ có dấu kiểu Telex", "gp-cover-telex", telex)];
