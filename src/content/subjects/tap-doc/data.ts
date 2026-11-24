/**
 * Dữ liệu môn Tập đọc. Bám mạch Tiếng Việt 1 (GDPT 2018): âm và chữ → thanh điệu → chữ ghép
 * → vần → đọc từ, câu → đọc trơn đoạn, thơ. Thứ tự và từ khóa do mình tự chọn, cho gần gũi với bé.
 *
 * g: chữ hiện trên thẻ; say: cách đọc (đọc âm, không đọc tên chữ cái: b đọc "bờ");
 * key: từ khóa của bài (một tiếng có chữ đó); emoji: hình nhỏ đi kèm (thay cho tranh lớn);
 * words: thêm vài tiếng/từ để bé đọc.
 */

export type SoundKind = "nguyen-am" | "phu-am" | "chu-ghep" | "van" | "thanh";

export interface Sound {
  g: string;
  say: string;
  kind: SoundKind;
  key: string;
  emoji: string;
  /** cụm từ chứa từ khóa, vd. "con cá" */
  phrase?: string;
  words: string[];
  note?: string;
}

export interface PhonicsLesson {
  id: string;
  title: string;
  short: string;
  sounds: Sound[];
  /** lời Mochi mở bài */
  intro: string;
  /** câu ứng dụng ngắn (chỉ dùng chữ đã học) */
  sentence?: string;
  tip?: string;
}

const s = (g: string, say: string, kind: SoundKind, key: string, emoji: string, words: string[], phrase?: string, note?: string): Sound => ({
  g,
  say,
  kind,
  key,
  emoji,
  words,
  phrase,
  note,
});
const V = (g: string, say: string, key: string, emoji: string, words: string[], phrase?: string) => s(g, say, "nguyen-am", key, emoji, words, phrase);
const C = (g: string, say: string, key: string, emoji: string, words: string[], phrase?: string, note?: string) => s(g, say, "phu-am", key, emoji, words, phrase, note);
const G = (g: string, say: string, key: string, emoji: string, words: string[], phrase?: string, note?: string) => s(g, say, "chu-ghep", key, emoji, words, phrase, note);
const R = (g: string, key: string, emoji: string, words: string[], phrase?: string) => s(g, g, "van", key, emoji, words, phrase);

// ───────────── Trình độ 1 · Vỡ lòng: âm và chữ ─────────────

export const VO_LONG: { unit: string; title: string; lessons: PhonicsLesson[] }[] = [
  {
    unit: "nguyen-am",
    title: "Chặng 1 · Những nguyên âm đầu tiên",
    lessons: [
      {
        id: "td-a-o-o",
        title: "a, o, ô",
        short: "Miệng mở to, tròn môi",
        intro: "Chào em! Tớ là Mochi. Hôm nay mình gặp ba bạn chữ đầu tiên. Nghe tớ đọc rồi đọc theo nhé!",
        sounds: [V("a", "a", "a", "😮", ["a", "à", "á"], "a!"), V("o", "o", "o", "⭕", ["o", "ò", "ó"], "o tròn"), V("ô", "ô", "ô", "🎩", ["ô", "ồ", "ố"], "ô có mũ")],
        tip: "Chữ **ô** là chữ **o** đội thêm cái mũ.",
      },
      {
        id: "td-o-e-e",
        title: "ơ, e, ê",
        short: "Chữ có râu, chữ có mũ",
        intro: "Chữ ơ có một cái râu nhỏ, chữ ê đội mũ giống ô. Mình cùng đọc nào!",
        sounds: [V("ơ", "ơ", "ơ", "🙋", ["ơ", "ờ", "ớ"], "ơ có râu"), V("e", "e", "e", "🐥", ["e", "è", "é"], "e"), V("ê", "ê", "ê", "👒", ["ê", "ề", "ế"], "ê có mũ")],
      },
      {
        id: "td-i-u-u",
        title: "i, u, ư",
        short: "Chữ có chấm, chữ có râu",
        intro: "Chữ i có một cái chấm trên đầu. Chữ ư là chữ u có thêm râu.",
        sounds: [V("i", "i", "i", "🕯️", ["i", "ì", "í"], "i có chấm"), V("u", "u", "u", "🧲", ["u", "ù", "ú"], "u"), V("ư", "ư", "ư", "🦄", ["ư", "ừ", "ứ"], "ư có râu")],
      },
      {
        id: "td-a-a-y",
        title: "ă, â, y",
        short: "Chữ đội mũ, i dài",
        intro: "ă đội cái mũ hình trăng khuyết, â đội mũ nhọn. Còn y gọi là i dài, đọc giống i.",
        sounds: [V("ă", "á", "ăn", "🍚", ["ăn", "ắt", "ẳm"], "ă trăng"), V("â", "ớ", "ấm", "🫖", ["ấm", "ấp", "ân"], "â mũ"), V("y", "i", "y", "🌿", ["y", "ý", "ỷ"], "i dài")],
        tip: "**ă** và **â** thường đi với chữ khác, ít khi đứng một mình.",
      },
    ],
  },
  {
    unit: "thanh",
    title: "Chặng 2 · Âm b và sáu thanh",
    lessons: [
      {
        id: "td-b-thanh-1",
        title: "b, huyền, sắc",
        short: "ba, bà, bá",
        intro: "Đây là chữ b, đọc là bờ. Ghép bờ với a thành ba. Thêm dấu huyền thành bà, dấu sắc thành bá!",
        sounds: [C("b", "bờ", "bà", "👵", ["ba", "bà", "bé", "bê", "bò", "bố"], "bà")],
        sentence: "bé bế bê",
        tip: "Dấu huyền ` nghiêng sang trái, dấu sắc ´ nghiêng sang phải.",
      },
      {
        id: "td-b-thanh-2",
        title: "Hỏi, ngã, nặng",
        short: "bả, bã, bạ",
        intro: "Thêm ba dấu nữa: dấu hỏi như cái móc câu, dấu ngã như làn sóng, dấu nặng là một chấm dưới chân.",
        sounds: [C("b", "bờ", "bể", "🐟", ["bể", "bẻ", "bẽ", "bõ", "bị", "bạ"], "bể cá")],
        sentence: "bà bẻ bí, bé bê bể",
        tip: "Dấu nặng nằm **dưới** chữ, các dấu khác nằm **trên** chữ.",
      },
    ],
  },
  {
    unit: "phu-am",
    title: "Chặng 3 · Các phụ âm",
    lessons: [
      {
        id: "td-c-d-dd",
        title: "c, d, đ",
        short: "cá, dê, đá",
        intro: "Ba bạn chữ mới: c đọc là cờ, d đọc là dờ, đ có thêm gạch ngang đọc là đờ.",
        sounds: [C("c", "cờ", "cá", "🐟", ["ca", "cá", "cò", "cỏ", "cô"], "con cá"), C("d", "dờ", "dê", "🐐", ["da", "dê", "dì", "dế"], "con dê"), C("đ", "đờ", "đá", "🪨", ["đá", "đò", "đi", "đỗ"], "hòn đá")],
        sentence: "bé đi đò, cô bế bé",
      },
      {
        id: "td-h-l-m",
        title: "h, l, m",
        short: "hổ, lá, mẹ",
        intro: "h đọc là hờ, l đọc là lờ, m đọc là mờ. Miệng ngậm lại khi đọc mờ nhé!",
        sounds: [C("h", "hờ", "hổ", "🐯", ["hè", "hồ", "hổ", "hà"], "con hổ"), C("l", "lờ", "lá", "🍃", ["lá", "lê", "lọ", "lò"], "lá cờ"), C("m", "mờ", "mẹ", "👩", ["mẹ", "me", "mũ", "mơ"], "mẹ bé")],
        sentence: "mẹ bế bé đi hồ",
      },
      {
        id: "td-n-k-g",
        title: "n, k, g",
        short: "nơ, kẻ, gà",
        intro: "n đọc là nờ, k đọc là ca, g đọc là gờ. Chữ k có một luật nhỏ, xem nhé!",
        sounds: [C("n", "nờ", "nơ", "🎀", ["nơ", "no", "nó", "na"], "cái nơ"), C("k", "ca", "kẻ", "✏️", ["kẻ", "kê", "kì", "kể"], "kẻ vở", "k chỉ đứng trước e, ê, i"), C("g", "gờ", "gà", "🐔", ["gà", "gỗ", "gõ", "ga"], "con gà")],
        sentence: "gà mẹ kể cho gà con",
        tip: "Đứng trước **e, ê, i** thì viết **k** (kẻ, kê, kì). Còn lại viết **c** (cá, cò, cô).",
      },
      {
        id: "td-r-s-t",
        title: "r, s, t",
        short: "rổ, sò, tô",
        intro: "r đọc là rờ: uốn cong lưỡi lên, hơi rung, khác với dờ. s đọc là sờ, t đọc là tờ. Cùng đọc to nào!",
        sounds: [C("r", "rờ", "rổ", "🧺", ["rổ", "rá", "rễ", "rì"], "cái rổ"), C("s", "sờ", "sò", "🐚", ["sò", "sẻ", "số", "sư"], "con sò"), C("t", "tờ", "tô", "🥣", ["tô", "tổ", "tủ", "tơ"], "tô mì")],
        sentence: "tổ sẻ ở bờ đê",
      },
      {
        id: "td-v-x-p",
        title: "v, x, p",
        short: "vở, xe, pa",
        intro: "v đọc là vờ, x đọc là xờ, p đọc là pờ. Chữ p hay đi với h, mình sẽ gặp lại sau.",
        sounds: [C("v", "vờ", "vở", "📒", ["vở", "vẽ", "ve", "vó"], "quyển vở"), C("x", "xờ", "xe", "🚗", ["xe", "xô", "xa", "xù"], "xe đỏ"), C("p", "pờ", "pa", "🎈", ["pa", "pí", "pô"], "pa pa")],
        sentence: "bé vẽ xe ở vở",
      },
    ],
  },
  {
    unit: "chu-ghep",
    title: "Chặng 4 · Chữ ghép hai, ba chữ",
    lessons: [
      {
        id: "td-ch-nh-th",
        title: "ch, nh, th",
        short: "chó, nho, thỏ",
        intro: "Hai chữ đứng cạnh nhau thành một âm mới. c với h thành chờ, n với h thành nhờ, t với h thành thờ.",
        sounds: [G("ch", "chờ", "chó", "🐶", ["chó", "chè", "chú", "chị"], "con chó"), G("nh", "nhờ", "nho", "🍇", ["nho", "nhà", "nhổ", "nhẹ"], "chùm nho"), G("th", "thờ", "thỏ", "🐰", ["thỏ", "thả", "thì", "thơ"], "chú thỏ")],
        sentence: "nhà thỏ có chú chó nhỏ",
      },
      {
        id: "td-kh-ph-tr",
        title: "kh, ph, tr",
        short: "khế, phở, tre",
        intro: "Thêm ba chữ ghép: khờ, phờ, trờ. Đọc trờ thì cong lưỡi lên một chút.",
        sounds: [G("kh", "khờ", "khế", "⭐", ["khế", "khó", "khỉ", "kho"], "quả khế"), G("ph", "phờ", "phở", "🍜", ["phở", "phố", "phà", "phú"], "bát phở"), G("tr", "trờ", "tre", "🎋", ["tre", "trẻ", "trà", "trê"], "cây tre")],
        sentence: "phố có phở, nhà có tre",
      },
      {
        id: "td-ng-ngh-gh",
        title: "ng, ngh, gh",
        short: "ngô, nghé, ghế",
        intro: "Hai bạn ng và ngh cùng đọc là ngờ, gh đọc là gờ. Có một luật rất hay về chúng!",
        sounds: [G("ng", "ngờ", "ngô", "🌽", ["ngô", "ngủ", "ngà", "ngõ"], "bắp ngô"), G("ngh", "ngờ", "nghé", "🐃", ["nghé", "nghề", "nghỉ", "nghe"], "chú nghé", "ngh đứng trước e, ê, i"), G("gh", "gờ", "ghế", "🪑", ["ghế", "ghi", "ghẹ", "ghé"], "cái ghế", "gh đứng trước e, ê, i")],
        sentence: "nghé nghe bé ghé nhà",
        tip: "Trước **e, ê, i** thì viết **ngh, gh** (nghé, ghế). Còn lại viết **ng, g** (ngô, gà).",
      },
      {
        id: "td-gi-qu",
        title: "gi, qu",
        short: "gió, quả",
        intro: "gi đọc là di, qu đọc là quờ. Chữ q lúc nào cũng đi cùng chữ u.",
        sounds: [G("gi", "di", "gió", "🌬️", ["gió", "giá", "giỏ", "giò"], "cơn gió"), G("qu", "quờ", "quả", "🍐", ["quả", "quê", "quà", "quạ"], "quả lê", "q luôn đi với u")],
        sentence: "quê bà có gió, có quả",
      },
    ],
  },
];

// ───────────── Trình độ 2 · Học vần ─────────────

export const HOC_VAN: { unit: string; title: string; lessons: PhonicsLesson[] }[] = [
  {
    unit: "van-a",
    title: "Chặng 1 · Vần với a, ă, â",
    lessons: [
      { id: "td-an", title: "an, ăn, ân", short: "bàn, khăn, cân", intro: "Vần mới đây! a ghép với nờ thành an. Ba vần này chỉ khác nhau cái mũ thôi.", sounds: [R("an", "bàn", "🪑", ["bàn", "lan", "nhãn", "đàn"], "cái bàn"), R("ăn", "khăn", "🧣", ["khăn", "chăn", "răn", "lăn"], "khăn len"), R("ân", "cân", "⚖️", ["cân", "sân", "chân", "dân"], "cái cân")], sentence: "bé quàng khăn ra sân" },
      { id: "td-am", title: "am, ăm, âm", short: "cam, tằm, nấm", intro: "Vần am, ăm, âm đều kết thúc bằng mờ, khi đọc xong thì ngậm môi lại.", sounds: [R("am", "cam", "🍊", ["cam", "làm", "nam", "tám"], "quả cam"), R("ăm", "tằm", "🐛", ["tằm", "chăm", "năm", "tắm"], "con tằm"), R("âm", "nấm", "🍄", ["nấm", "mầm", "sấm", "tấm"], "cây nấm")], sentence: "bé chăm làm, bé tắm cho gà" },
      { id: "td-ai", title: "ai, ay, ây", short: "nai, bay, cây", intro: "a ghép với i thành ai, a ghép với y thành ay. Nghe xem có gì khác nhau nhé!", sounds: [R("ai", "nai", "🦌", ["nai", "hai", "tai", "mái"], "con nai"), R("ay", "bay", "✈️", ["bay", "tay", "máy", "chạy"], "máy bay"), R("ây", "cây", "🌳", ["cây", "mây", "dây", "thấy"], "cây xanh")], sentence: "máy bay bay qua mây" },
      { id: "td-ao", title: "ao, au, âu", short: "sao, rau, gấu", intro: "Ba vần tròn môi: ao, au, âu. Đọc xong môi chu ra như thổi nến.", sounds: [R("ao", "sao", "⭐", ["sao", "cao", "táo", "chào"], "ngôi sao"), R("au", "rau", "🥬", ["rau", "cau", "sau", "màu"], "rau cải"), R("âu", "gấu", "🐻", ["gấu", "câu", "sâu", "đậu"], "chú gấu")], sentence: "gấu con hái táo, nhổ rau" },
      { id: "td-at", title: "at, ăt, ât", short: "hát, mắt, mật", intro: "Vần at, ăt, ât đọc ngắn và dứt khoát, cuối vần là tờ.", sounds: [R("at", "hát", "🎤", ["hát", "bát", "mát", "cát"], "ca hát"), R("ăt", "mắt", "👀", ["mắt", "bắt", "cắt", "mặt"], "đôi mắt"), R("ât", "mật", "🍯", ["mật", "đất", "nhất", "vật"], "mật ong")], sentence: "bé hát, mắt bé sáng" },
      { id: "td-ap", title: "ap, ăp, âp", short: "tháp, cặp, tập", intro: "Vần cuối pờ thì đọc xong môi khép lại thật nhanh.", sounds: [R("ap", "tháp", "🗼", ["tháp", "đạp", "sáp", "nạp"], "ngọn tháp"), R("ăp", "cặp", "🎒", ["cặp", "gặp", "sắp", "bắp"], "cái cặp"), R("âp", "tập", "📓", ["tập", "nấp", "cấp", "lập"], "quyển tập")], sentence: "bé đeo cặp đi xe đạp" },
      { id: "td-ac", title: "ac, ăc, âc", short: "nhạc, mặc, gấc", intro: "Vần cuối cờ: ac, ăc, âc. Đọc xong cuống lưỡi chạm lên một chút.", sounds: [R("ac", "nhạc", "🎵", ["nhạc", "bác", "các", "lạc"], "bản nhạc"), R("ăc", "mặc", "👕", ["mặc", "sắc", "lắc", "chắc"], "mặc áo"), R("âc", "gấc", "🍈", ["gấc", "bậc", "nhấc", "giấc"], "quả gấc")], sentence: "bác mặc áo, nghe nhạc" },
      { id: "td-ang", title: "ang, ăng, âng", short: "thang, măng, tầng", intro: "Vần cuối ngờ: ang, ăng, âng. Âm vang lên ở mũi, thử bịt mũi xem!", sounds: [R("ang", "thang", "🪜", ["thang", "làng", "vàng", "sáng"], "cái thang"), R("ăng", "măng", "🎍", ["măng", "trăng", "nắng", "răng"], "măng tre"), R("âng", "tầng", "🏢", ["tầng", "vâng", "nâng", "tâng"], "nhà tầng")], sentence: "trăng sáng cả làng" },
      { id: "td-anh", title: "anh, ach", short: "chanh, sách", intro: "Hai vần có chữ h ở cuối: anh và ach. Đọc lướt nhẹ nhé!", sounds: [R("anh", "chanh", "🍋", ["chanh", "xanh", "bánh", "nhanh"], "quả chanh"), R("ach", "sách", "📖", ["sách", "khách", "sạch", "gạch"], "quyển sách")], sentence: "bé đọc sách, uống nước chanh" },
    ],
  },
  {
    unit: "van-o",
    title: "Chặng 2 · Vần với o, ô, ơ",
    lessons: [
      { id: "td-on", title: "on, ôn, ơn", short: "nón, chồn, sơn", intro: "o, ô, ơ ghép với nờ thành on, ôn, ơn.", sounds: [R("on", "nón", "👒", ["nón", "con", "ngon", "hòn"], "nón lá"), R("ôn", "chồn", "🦊", ["chồn", "thôn", "khôn", "trốn"], "con chồn"), R("ơn", "sơn", "🎨", ["sơn", "lợn", "hơn", "trơn"], "hộp sơn")], sentence: "con chồn đội nón" },
      { id: "td-om", title: "om, ôm, ơm", short: "đom đóm, tôm, cơm", intro: "Vần om, ôm, ơm cuối mờ, ngậm môi lại nhé.", sounds: [R("om", "đóm", "✨", ["đóm", "chòm", "khóm", "bom"], "đom đóm"), R("ôm", "tôm", "🦐", ["tôm", "ôm", "chôm", "nồm"], "con tôm"), R("ơm", "cơm", "🍚", ["cơm", "thơm", "rơm", "bờm"], "bát cơm")], sentence: "cơm thơm, tôm ngon" },
      { id: "td-oi", title: "oi, ôi, ơi", short: "voi, chổi, bơi", intro: "Ba vần kết thúc bằng i: oi, ôi, ơi.", sounds: [R("oi", "voi", "🐘", ["voi", "còi", "nói", "đòi"], "con voi"), R("ôi", "chổi", "🧹", ["chổi", "đôi", "tôi", "gối"], "cái chổi"), R("ơi", "bơi", "🏊", ["bơi", "chơi", "mới", "trời"], "bơi lội")], sentence: "voi con đi bơi, đi chơi" },
      { id: "td-ot", title: "ot, ôt, ơt", short: "ngọt, rốt, ớt", intro: "Vần cuối tờ với o, ô, ơ. Đọc ngắn, gọn.", sounds: [R("ot", "ngọt", "🍰", ["ngọt", "hót", "rót", "sọt"], "bánh ngọt"), R("ôt", "rốt", "🥕", ["rốt", "cột", "một", "tốt"], "cà rốt"), R("ơt", "ớt", "🌶️", ["ớt", "vợt", "thớt", "phớt"], "quả ớt")], sentence: "chim hót, bánh ngọt" },
      { id: "td-op", title: "op, ôp, ơp", short: "cọp, hộp, lớp", intro: "Cuối pờ thì khép môi: op, ôp, ơp.", sounds: [R("op", "cọp", "🐯", ["cọp", "họp", "góp", "bóp"], "con cọp"), R("ôp", "hộp", "🎁", ["hộp", "xốp", "lộp", "độp"], "hộp quà"), R("ơp", "lớp", "🏫", ["lớp", "chớp", "hợp", "đớp"], "lớp học")], sentence: "cả lớp góp quà vào hộp" },
      { id: "td-oc", title: "oc, ôc", short: "cóc, ốc", intro: "Hai vần cuối cờ: oc và ôc.", sounds: [R("oc", "cóc", "🐸", ["cóc", "học", "sóc", "khóc"], "con cóc"), R("ôc", "ốc", "🐌", ["ốc", "gốc", "dốc", "cốc"], "con ốc")], sentence: "sóc nhỏ ở gốc cây" },
      { id: "td-ong", title: "ong, ông", short: "ong, trống", intro: "Vần cuối ngờ: ong và ông. Nghe như tiếng chuông kêu boong boong.", sounds: [R("ong", "ong", "🐝", ["ong", "bóng", "trong", "võng"], "con ong"), R("ông", "trống", "🥁", ["trống", "ông", "bông", "sông"], "cái trống")], sentence: "ong bay qua bông hoa" },
    ],
  },
  {
    unit: "van-e",
    title: "Chặng 3 · Vần với e, ê, i",
    lessons: [
      { id: "td-en", title: "en, ên, in", short: "kèn, nến, pin", intro: "e, ê, i ghép với nờ: en, ên, in.", sounds: [R("en", "kèn", "🎺", ["kèn", "sen", "khen", "đèn"], "cái kèn"), R("ên", "nến", "🕯️", ["nến", "tên", "lên", "bến"], "cây nến"), R("in", "pin", "🔋", ["pin", "xin", "tin", "chín"], "cục pin")], sentence: "bé thổi nến, cả nhà khen" },
      { id: "td-em", title: "em, êm, im", short: "kem, đêm, chim", intro: "Vần cuối mờ: em, êm, im.", sounds: [R("em", "kem", "🍦", ["kem", "xem", "tem", "lém"], "que kem"), R("êm", "đêm", "🌙", ["đêm", "mềm", "thêm", "nệm"], "ban đêm"), R("im", "chim", "🐦", ["chim", "tím", "kim", "phím"], "con chim")], sentence: "chim về tổ khi đêm xuống" },
      { id: "td-et", title: "et, êt, it", short: "vẹt, Tết, vịt", intro: "Cuối tờ: et, êt, it. Đọc gọn như tiếng gõ cửa.", sounds: [R("et", "vẹt", "🦜", ["vẹt", "bét", "hét", "két"], "con vẹt"), R("êt", "tết", "🧧", ["tết", "dệt", "mệt", "hết"], "ngày tết"), R("it", "vịt", "🦆", ["vịt", "mít", "thịt", "chít"], "con vịt")], sentence: "tết này bé được lì xì" },
      { id: "td-ep", title: "ep, êp, ip", short: "dép, bếp, nhịp", intro: "Cuối pờ: ep, êp, ip.", sounds: [R("ep", "dép", "🩴", ["dép", "đẹp", "kẹp", "tép"], "đôi dép"), R("êp", "bếp", "🍳", ["bếp", "xếp", "nếp"], "nhà bếp"), R("ip", "nhịp", "🎶", ["nhịp", "kịp", "híp"], "nhịp trống")], sentence: "mẹ nấu cơm ở bếp" },
      { id: "td-eo", title: "eo, êu, iu, ia", short: "mèo, lều, rìu, mía", intro: "Bốn vần nhỏ xinh: eo, êu, iu, ia.", sounds: [R("eo", "mèo", "🐱", ["mèo", "kẹo", "leo", "trèo"], "con mèo"), R("êu", "lều", "🏕️", ["lều", "kêu", "nếu", "đều"], "cái lều"), R("iu", "rìu", "🪓", ["rìu", "dịu", "xíu", "chịu"], "cái rìu"), R("ia", "mía", "🎋", ["mía", "chia", "kia", "lìa"], "cây mía")], sentence: "mèo con leo cây mía" },
      { id: "td-inh", title: "ênh, inh, êch, ich", short: "kênh, kính, ếch, lịch", intro: "Bốn vần có chữ h ở cuối: ênh, inh, êch, ich.", sounds: [R("ênh", "kênh", "🛶", ["kênh", "bệnh", "lênh", "chênh"], "dòng kênh"), R("inh", "kính", "👓", ["kính", "xinh", "bình", "tính"], "cái kính"), R("êch", "ếch", "🐸", ["ếch", "lệch", "chếch"], "con ếch"), R("ich", "lịch", "📅", ["lịch", "thích", "xích", "ích"], "tờ lịch")], sentence: "ếch xinh ngồi bên kênh" },
    ],
  },
  {
    unit: "van-u",
    title: "Chặng 4 · Vần với u, ư",
    lessons: [
      { id: "td-um", title: "um, un, ui, ưi", short: "chùm, giun, núi, ngửi", intro: "u và ư ghép với các âm cuối: um, un, ui, ưi.", sounds: [R("um", "chùm", "🍇", ["chùm", "tum", "khum", "cúm"], "chùm nho"), R("un", "giun", "🪱", ["giun", "bún", "mùn", "đùn"], "con giun"), R("ui", "núi", "⛰️", ["núi", "túi", "vui", "mũi"], "ngọn núi"), R("ưi", "ngửi", "👃", ["ngửi", "gửi", "cửi"], "ngửi hoa")], sentence: "bé vui đi chơi núi" },
      { id: "td-ut", title: "up, ut, ưt", short: "búp, bút, mứt", intro: "Cuối pờ và tờ: up, ut, ưt.", sounds: [R("up", "búp", "🪷", ["búp", "giúp", "chụp", "núp"], "búp sen"), R("ut", "bút", "🖊️", ["bút", "phút", "sút", "hút"], "cây bút"), R("ưt", "mứt", "🍬", ["mứt", "đứt", "nứt", "sứt"], "hộp mứt")], sentence: "bé cầm bút giúp mẹ" },
      { id: "td-uc", title: "uc, ưc, ung, ưng", short: "cúc, mực, thúng, trứng", intro: "Cuối cờ và ngờ: uc, ưc, ung, ưng.", sounds: [R("uc", "cúc", "🌼", ["cúc", "múc", "trúc", "cục"], "hoa cúc"), R("ưc", "mực", "🦑", ["mực", "đức", "sức", "thức"], "con mực"), R("ung", "thúng", "🧺", ["thúng", "sung", "trung", "rung"], "cái thúng"), R("ưng", "trứng", "🥚", ["trứng", "lưng", "sừng", "mừng"], "quả trứng")], sentence: "gà mẹ ấp trứng" },
      { id: "td-ua", title: "ua, ưa, ưu", short: "cua, ngựa, cừu", intro: "ua đọc như u-a, ưa đọc như ư-a, ưu đọc như ư-u.", sounds: [R("ua", "cua", "🦀", ["cua", "mua", "rùa", "đũa"], "con cua"), R("ưa", "ngựa", "🐴", ["ngựa", "mưa", "dưa", "cửa"], "con ngựa"), R("ưu", "cừu", "🐑", ["cừu", "hưu", "cứu", "lựu"], "con cừu")], sentence: "trời mưa, cua bò ra" },
    ],
  },
  {
    unit: "van-doi",
    title: "Chặng 5 · Vần iê, uô, ươ",
    lessons: [
      { id: "td-ien", title: "iên, iêt, iêu, yêu", short: "kiến, viết, diều, yêu", intro: "iê đọc gần như ia. Ghép với nờ thành iên, với tờ thành iêt.", sounds: [R("iên", "kiến", "🐜", ["kiến", "tiên", "biển", "điện"], "con kiến"), R("iêt", "viết", "✍️", ["viết", "biết", "tiết", "việt"], "tập viết"), R("iêu", "diều", "🪁", ["diều", "nhiều", "chiều", "tiêu"], "cánh diều"), R("yêu", "yêu", "❤️", ["yêu", "yếu"], "yêu bà")], sentence: "chiều chiều bé thả diều" },
      { id: "td-ieng", title: "iêng, iêc, iêm, iêp", short: "chiêng, xiếc, diêm, thiếp", intro: "Thêm bốn vần có iê nữa nè!", sounds: [R("iêng", "chiêng", "🔔", ["chiêng", "riêng", "liệng", "kiềng"], "cái chiêng"), R("iêc", "xiếc", "🎪", ["xiếc", "tiệc", "việc", "chiếc"], "rạp xiếc"), R("iêm", "diêm", "🔥", ["diêm", "kiếm", "điểm", "tiệm"], "que diêm"), R("iêp", "thiếp", "💌", ["thiếp", "kiếp", "nghiệp", "diếp"], "tấm thiếp")], sentence: "cả nhà đi xem xiếc" },
      { id: "td-uon", title: "uôn, uôt, uôi, uôc, uông", short: "cuộn, chuột, chuối, đuốc, chuông", intro: "uô đọc gần như ua. Năm vần trong một bài, bé làm được!", sounds: [R("uôn", "cuộn", "🧶", ["cuộn", "muốn", "buồn", "luôn"], "cuộn len"), R("uôt", "chuột", "🐭", ["chuột", "suốt", "tuốt", "buột"], "con chuột"), R("uôi", "chuối", "🍌", ["chuối", "muối", "suối", "đuôi"], "quả chuối"), R("uôc", "đuốc", "🔥", ["đuốc", "thuốc", "cuốc", "buộc"], "ngọn đuốc"), R("uông", "chuông", "🔔", ["chuông", "vuông", "xuống", "uống"], "cái chuông")], sentence: "chuột con ăn chuối bên suối" },
      { id: "td-uon2", title: "ươn, ươt, ươi, ươc", short: "vườn, lướt, lưới, thước", intro: "ươ đọc gần như ưa. Vườn, lướt, lưới, thước!", sounds: [R("ươn", "vườn", "🏡", ["vườn", "lượn", "mượn", "sườn"], "khu vườn"), R("ươt", "lướt", "🏄", ["lướt", "mượt", "trượt", "vượt"], "lướt ván"), R("ươi", "lưới", "🥅", ["lưới", "tươi", "cười", "mười"], "cái lưới"), R("ươc", "thước", "📏", ["thước", "nước", "bước", "được"], "cây thước")], sentence: "bé tưới nước cho vườn" },
      { id: "td-uong", title: "ương, ươu, ươm, ươp", short: "giường, hươu, bướm, mướp", intro: "Thêm bốn vần ươ nữa. Sắp xong chặng rồi!", sounds: [R("ương", "giường", "🛏️", ["giường", "hương", "sương", "đường"], "cái giường"), R("ươu", "hươu", "🦌", ["hươu", "rượu", "bướu"], "con hươu"), R("ươm", "bướm", "🦋", ["bướm", "gươm", "lượm", "ướm"], "con bướm"), R("ươp", "mướp", "🥒", ["mướp", "cướp"], "quả mướp")], sentence: "bướm bay quanh giàn mướp" },
    ],
  },
  {
    unit: "van-dem",
    title: "Chặng 6 · Vần có âm đệm",
    lessons: [
      { id: "td-oa", title: "oa, oe, uê, uy", short: "hoa, khỏe, huệ, thủy", intro: "Chữ o, u đứng trước làm âm đệm, môi tròn lại: oa, oe, uê, uy.", sounds: [R("oa", "hoa", "🌸", ["hoa", "loa", "tòa", "xóa"], "bông hoa"), R("oe", "khỏe", "💪", ["khỏe", "xòe", "chòe", "hoe"], "khỏe mạnh"), R("uê", "huệ", "💐", ["huệ", "thuê", "thuế"], "hoa huệ"), R("uy", "thủy", "🚢", ["thủy", "lũy", "huy", "tùy"], "tàu thủy")], sentence: "hoa nở, bé khỏe" },
      { id: "td-oan", title: "oan, oăn, oat, oăt", short: "toán, xoăn, hoạt, ngoặt", intro: "o đứng trước an, ăn, at, ăt thành oan, oăn, oat, oăt.", sounds: [R("oan", "toán", "➕", ["toán", "ngoan", "khoan", "đoàn"], "học toán"), R("oăn", "xoăn", "🌀", ["xoăn", "thoăn", "ngoằn"], "tóc xoăn"), R("oat", "hoạt", "📺", ["hoạt", "thoát", "toát", "loát"], "hoạt hình"), R("oăt", "ngoặt", "↪️", ["ngoặt", "choắt", "hoắt"], "khúc ngoặt")], sentence: "bé ngoan học toán" },
      { id: "td-oang", title: "oang, oăng, oanh, oach", short: "khoang, hoẵng, khoanh, hoạch", intro: "Bốn vần dài mà vẫn dễ: oang, oăng, oanh, oach.", sounds: [R("oang", "khoang", "🚃", ["khoang", "hoàng", "loang", "choàng"], "khoang tàu"), R("oăng", "hoẵng", "🦌", ["hoẵng", "loằng", "ngoẵng"], "con hoẵng"), R("oanh", "khoanh", "🙆", ["khoanh", "doanh", "loanh"], "khoanh tay"), R("oach", "hoạch", "🌾", ["hoạch", "toạch", "xoạch"], "thu hoạch")], sentence: "bé khoanh tay chào cô" },
      { id: "td-oai", title: "oai, oay, uân, uât", short: "thoại, xoay, xuân, thuật", intro: "oai, oay, uân, uât. Mùa xuân đến rồi!", sounds: [R("oai", "thoại", "📱", ["thoại", "ngoài", "khoai", "loài"], "điện thoại"), R("oay", "xoay", "🌀", ["xoay", "loay", "ngoáy", "hoáy"], "chong chóng xoay"), R("uân", "xuân", "🌸", ["xuân", "tuần", "luận", "huấn"], "mùa xuân"), R("uât", "thuật", "🎨", ["thuật", "luật", "xuất", "khuất"], "mĩ thuật")], sentence: "mùa xuân, bé trồng khoai" },
      { id: "td-uyen", title: "uyên, uyêt, uynh, uych", short: "thuyền, tuyết, huynh, huỵch", intro: "Bốn vần khó nhất rồi! Đọc chậm, từng phần một nhé.", sounds: [R("uyên", "thuyền", "⛵", ["thuyền", "chuyện", "khuyên", "luyện"], "con thuyền"), R("uyêt", "tuyết", "❄️", ["tuyết", "duyệt", "huyết", "khuyết"], "bông tuyết"), R("uynh", "huynh", "👪", ["huynh", "khuỳnh", "huỳnh"], "phụ huynh"), R("uych", "huỵch", "🏃", ["huỵch", "huých", "uỵch"], "chạy huỵch huỵch")], sentence: "thuyền đi trên biển tuyết" },
    ],
  },
];

// ───────────── Trình độ 3, 4 · Đọc câu, đọc trơn (văn bản tự viết) ─────────────

export interface ReadingLesson {
  id: string;
  title: string;
  short: string;
  emoji: string;
  intro: string;
  /** các câu/đoạn để đọc to, theo thứ tự khó dần */
  lines: string[];
  /** câu hỏi đọc hiểu: [câu hỏi, đáp án đúng, ...đáp án sai] */
  quiz: [string, string, ...string[]][];
  tip?: string;
}

export const DOC_CAU: { unit: string; title: string; lessons: ReadingLesson[] }[] = [
  {
    unit: "tu",
    title: "Chặng 1 · Đọc từ hai tiếng",
    lessons: [
      { id: "td-tu-1", title: "Từ quanh nhà", short: "cái bàn, cửa sổ", emoji: "🏠", intro: "Hai tiếng ghép lại thành một từ. Đọc liền hai tiếng, không ngắt quãng nhé.", lines: ["cái bàn", "cửa sổ", "cái ghế", "bóng đèn", "tủ lạnh", "bàn chải"], quiz: [["Đồ vật nào để ngồi?", "cái ghế", "bóng đèn", "cửa sổ"], ["Đồ vật nào cho ánh sáng?", "bóng đèn", "tủ lạnh", "cái bàn"]] },
      { id: "td-tu-2", title: "Con vật bé yêu", short: "con mèo, chú chó", emoji: "🐾", intro: "Gọi tên các con vật nào!", lines: ["con mèo", "chú chó", "con gà", "đàn vịt", "chim sẻ", "con trâu"], quiz: [["Con gì kêu meo meo?", "con mèo", "con gà", "con trâu"], ["Con gì biết bay?", "chim sẻ", "con trâu", "chú chó"]] },
      { id: "td-tu-3", title: "Màu sắc, trái cây", short: "quả cam, màu đỏ", emoji: "🍉", intro: "Đọc to tên trái cây và màu sắc nhé.", lines: ["quả cam", "dưa hấu", "màu đỏ", "màu xanh", "quả chuối", "trái xoài"], quiz: [["Quả chuối chín có màu gì?", "màu vàng", "màu tím", "màu đen"], ["Dưa hấu ruột màu gì?", "màu đỏ", "màu xanh dương", "màu trắng"]] },
    ],
  },
  {
    unit: "cau",
    title: "Chặng 2 · Đọc câu ngắn",
    lessons: [
      { id: "td-cau-1", title: "Câu và dấu chấm", short: "Chữ đầu câu viết hoa", emoji: "🔤", intro: "Một câu bắt đầu bằng chữ viết hoa và kết thúc bằng dấu chấm. Đến dấu chấm thì nghỉ một chút.", lines: ["Bé đi học.", "Mẹ nấu cơm.", "Mèo nằm ngủ.", "Bố đọc báo.", "Chim hót trên cây."], quiz: [["Ai nấu cơm?", "Mẹ", "Bố", "Bé"], ["Mèo đang làm gì?", "nằm ngủ", "hót", "đọc báo"]], tip: "Gặp dấu chấm **.** thì nghỉ hơi một chút rồi mới đọc tiếp." },
      { id: "td-cau-2", title: "Dấu phẩy", short: "Ngắt hơi ngắn", emoji: "✒️", intro: "Dấu phẩy giống chỗ nghỉ chân. Đến dấu phẩy thì ngắt hơi thật ngắn.", lines: ["Sáng nay, bé dậy sớm.", "Vườn nhà bà có cam, có bưởi.", "Mochi thích cá, thích sữa.", "Trời nắng, gió thổi nhẹ."], quiz: [["Vườn nhà bà có gì?", "cam và bưởi", "táo và lê", "chuối và dừa"], ["Mochi thích gì?", "cá và sữa", "rau và cơm", "kẹo và kem"]], tip: "Dấu phẩy **,** nghỉ ngắn. Dấu chấm **.** nghỉ dài hơn." },
      { id: "td-cau-3", title: "Câu hỏi", short: "Giọng cao lên ở cuối", emoji: "❓", intro: "Câu hỏi kết thúc bằng dấu chấm hỏi. Đọc thì giọng cao lên một chút ở cuối câu.", lines: ["Bạn tên là gì?", "Hôm nay trời có mưa không?", "Ai đang hát thế?", "Mèo con đi đâu?"], quiz: [["Câu hỏi kết thúc bằng dấu gì?", "dấu chấm hỏi", "dấu chấm", "dấu phẩy"]], tip: "Thấy dấu **?** là câu hỏi đó." },
    ],
  },
];

export const DOC_TRON: { unit: string; title: string; lessons: ReadingLesson[] }[] = [
  {
    unit: "doan",
    title: "Chặng 1 · Đọc đoạn văn",
    lessons: [
      { id: "td-doan-1", title: "Mochi đi học", short: "Đoạn văn 4 câu", emoji: "🎒", intro: "Bây giờ mình đọc cả một đoạn. Đọc từng câu, nghỉ đúng chỗ dấu chấm nhé.", lines: ["Sáng nay, Mochi dậy thật sớm.", "Mochi đánh răng, rửa mặt rồi ăn sáng.", "Mẹ đưa Mochi đến lớp.", "Ở lớp, Mochi được cô khen ngoan."], quiz: [["Ai đưa Mochi đến lớp?", "Mẹ", "Bố", "Bà"], ["Ở lớp, Mochi được ai khen?", "cô giáo", "bạn thỏ", "chú bảo vệ"]] },
      { id: "td-doan-2", title: "Khu vườn của bà", short: "Đoạn văn 5 câu", emoji: "🌻", intro: "Cùng đến thăm vườn nhà bà nào!", lines: ["Nhà bà có một khu vườn nhỏ.", "Trong vườn có cây cam, cây bưởi và luống rau xanh.", "Mỗi sáng, bà ra vườn tưới nước.", "Bé thích theo bà nhặt lá vàng.", "Chiều về, chim sẻ bay đến hót líu lo."], quiz: [["Mỗi sáng, bà làm gì?", "tưới nước cho vườn", "đi chợ", "nấu cơm"], ["Con gì bay đến hót?", "chim sẻ", "con quạ", "con bướm"]] },
      { id: "td-doan-3", title: "Trời mưa", short: "Đoạn văn 5 câu", emoji: "🌧️", intro: "Đọc đoạn văn về một ngày mưa nhé.", lines: ["Trời bỗng tối sầm lại.", "Gió thổi mạnh, mây đen kéo đến.", "Rồi mưa rơi lộp độp trên mái nhà.", "Đàn kiến vội vàng chạy về tổ.", "Mưa tạnh, cầu vồng hiện ra thật đẹp."], quiz: [["Khi mưa đến, đàn kiến làm gì?", "chạy về tổ", "đi chơi", "hát ca"], ["Mưa tạnh thì có gì hiện ra?", "cầu vồng", "ông trăng", "ngôi sao"]] },
    ],
  },
  {
    unit: "tho",
    title: "Chặng 2 · Đọc thơ",
    lessons: [
      { id: "td-tho-1", title: "Mèo con rửa mặt", short: "Thơ bốn chữ", emoji: "🐱", intro: "Thơ có vần, đọc lên nghe như hát. Mỗi dòng thơ nghỉ một chút nhé.", lines: ["Mèo con dậy sớm,", "Rửa mặt bằng tay.", "Liếm lông sạch bóng,", "Chào nắng ban mai."], quiz: [["Mèo con rửa mặt bằng gì?", "bằng tay", "bằng khăn", "bằng nước"]] },
      { id: "td-tho-2", title: "Ông trăng", short: "Thơ năm chữ", emoji: "🌕", intro: "Một bài thơ nhỏ về ông trăng.", lines: ["Ông trăng tròn như đĩa,", "Treo lửng giữa trời cao.", "Soi sân nhà bé ngủ,", "Soi cả đàn cá ao."], quiz: [["Ông trăng tròn như cái gì?", "cái đĩa", "quả bóng", "cái nón"], ["Trăng soi gì dưới ao?", "đàn cá", "đàn vịt", "bông sen"]] },
      { id: "td-tho-3", title: "Bàn tay em", short: "Thơ bốn chữ", emoji: "✋", intro: "Đọc thơ về đôi bàn tay chăm chỉ.", lines: ["Bàn tay của em,", "Biết cầm bút viết.", "Biết quét sân nhà,", "Biết ôm bà mẹ."], quiz: [["Bàn tay em biết làm gì?", "cầm bút viết", "bay lên trời", "bơi dưới nước"]] },
    ],
  },
];
