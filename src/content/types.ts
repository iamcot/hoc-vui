import type { Rng } from "@/lib/rng";
import type { Level } from "@/lib/code/world";
import type { LevelGen } from "@/lib/code/levels";

export type Mood = "happy" | "think" | "wow" | "cheer" | "oops";

export type Block =
  | { type: "text"; text: string }
  | { type: "image"; asset: string; caption?: string }
  | { type: "keys"; keys: string[]; label?: string; result?: string; tryIt?: boolean }
  | { type: "tip"; tone?: "tip" | "warn"; text: string }
  | { type: "example"; problem: string; steps: string[]; keys?: string[]; answer: string }
  | { type: "check"; question: Question }
  // ── môn Tập đọc ──
  /** thẻ chữ to: chạm để nghe */
  | { type: "letters"; items: LetterItem[] }
  /** ghép tiếng từng bước: bờ + an → ban, + huyền → bàn */
  | { type: "blend"; word: string; emoji?: string; phrase?: string }
  /** dãy tiếng/từ nhỏ, chạm để nghe */
  | { type: "say"; items: string[]; label?: string }
  /** bé đọc to, máy nghe và chấm */
  | { type: "read"; text: string; strict?: boolean; label?: string }
  // ── môn Gõ phím ──
  /** bàn phím có màu theo ngón, sáng các phím của bài */
  | { type: "keyboard"; keys: string; focus?: string; label?: string }
  /** gõ thử một dòng ngay trong slide */
  | { type: "drill"; text: string; label?: string; keys?: string; focus?: string }
  // ── môn Lập trình khối lệnh ──
  /** lưới nhỏ + chương trình mẫu, bấm "Xem chạy" để Mochi đi theo (program viết kiểu "F F L F", xem lib/code/program.ts) */
  | { type: "code"; map: string[]; dir: 0 | 1 | 2 | 3; program: string; label?: string; draw?: boolean };

export interface LetterItem {
  g: string;
  /** cách đọc, vd. "bờ" */
  say: string;
  kind: "nguyen-am" | "phu-am" | "chu-ghep" | "van" | "thanh";
  key?: string;
  emoji?: string;
}

export interface Slide {
  title: string;
  mood?: Mood;
  /** id âm thanh đọc lời dẫn (tùy chọn) */
  voice?: string;
  /** lời dẫn đọc bằng giọng mẫu theo chữ (môn Tập đọc), không cần id */
  say?: string;
  blocks: Block[];
}

/** read: bé đọc to câu trong `answer`, máy nghe chấm (môn Tập đọc) */
/** type: bé gõ lại dòng chữ trong `answer` (môn Gõ phím), đúng từ 90% ký tự là đạt */
export type AnswerKind = "number" | "fraction" | "choice" | "pair" | "read" | "type";

export interface Question {
  id: string;
  prompt: string;
  kind: AnswerKind;
  /** đáp án chuẩn. number: "12.5"; fraction: "3/4" hoặc "-3/4"; choice: nội dung lựa chọn đúng; pair: "q;r" */
  answer: string;
  choices?: string[];
  /** fraction: bắt buộc tối giản */
  reduced?: boolean;
  /** number: sai số cho phép */
  tolerance?: number;
  /** nhãn ô nhập cho kind "pair" */
  pairLabels?: [string, string];
  unit?: string;
  hint?: string;
  /** chuỗi phím giải trên máy */
  keys?: string[];
  explain?: string;
  topic: string;
  /** đọc to đề bài cho bé nghe (chữ cần đọc). Có thì hiện nút loa và tự phát. */
  say?: string;
  /** các câu đọc lần lượt khi hiện câu hỏi (lời dẫn + chữ cần đọc), cho bé chưa tự đọc được đề */
  voice?: string[];
  /** lựa chọn là chữ cái/vần: hiện chữ thật to */
  big?: boolean;
  /** kind "read": false = sai thanh vẫn tính đạt (âm, vần lẻ) */
  strict?: boolean;
}

export type QuestionGen = (rng: Rng) => Question;

/** Môn Gõ phím: dữ liệu cho trò chơi cá mập của một bài */
export interface TypingSpec {
  /** các phím bài này được dùng (chữ thường) */
  keys: string;
  /** phím mới của bài: hay xuất hiện hơn, sáng trên bàn phím */
  focus?: string;
  /** "key": mỗi con cá mang 1-3 ký tự sinh từ `keys`; "word": mỗi con cá một từ trong `words` */
  unit: "key" | "word";
  words?: string[];
  /** số cá trong một lượt luyện tập */
  count?: number;
  /** tốc độ cá (1 = chậm nhất) */
  speed?: number;
}

/** Môn Lập trình khối lệnh: các màn chơi của một bài */
export interface CodeSpec {
  /** màn làm sẵn, chơi lần lượt */
  levels: Level[];
  /** thêm màn sinh ngẫu nhiên (có kiểm tra giải được) sau các màn làm sẵn */
  gen?: LevelGen;
  genCount?: number;
}

export interface Lesson {
  id: string;
  title: string;
  short: string;
  emoji: string;
  /** id ảnh bìa trong danh mục asset */
  cover: string;
  /** môn chữ: hiện chữ to thay cho ảnh bìa trên bản đồ, vd. "an ăn ân" */
  glyph?: string;
  minutes: number;
  slides: Slide[];
  /** các dạng bài luyện tập của bài này */
  practice: QuestionGen[];
  /** môn Gõ phím: luyện tập là trò chơi cá mập thay cho câu hỏi */
  typing?: TypingSpec;
  /** môn Lập trình: luyện tập là các màn kéo khối lệnh thay cho câu hỏi */
  code?: CodeSpec;
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

/**
 * Trình độ (chặng lớn) trong một môn: vd. "Lớp 6", "Lớp 7" của môn Máy tính,
 * hay "Vỡ lòng", "Vần" của môn Tập đọc. Muốn học vượt: làm thử thách của
 * trình độ trước (câu trộn từ mọi bài của trình độ đó), đạt thì mở khóa.
 */
export interface Tier {
  id: string;
  /** tên ngắn hiện trên tab, vd. "Lớp 7" */
  name: string;
  /** mô tả một dòng */
  short: string;
  emoji: string;
  /** id ảnh biểu tượng trình độ (không đặt thì dùng ảnh mặc định theo thứ tự: hạt mầm, chồi, cây, hoa) */
  icon?: string;
  /** rỗng = đang soạn */
  units: Unit[];
  /** thử thách vượt cấp lấy từ trình độ này: số câu và số câu đúng để đạt */
  challenge?: { count: number; pass: number };
  /** nhân vật dẫn chuyện riêng của trình độ này (không đặt thì theo môn) */
  mascot?: "mochi" | "bit";
}

export interface Subject {
  id: string;
  name: string;
  /** khoảng trình độ, vd. "Lớp 6 → 9" */
  levelsLabel: string;
  tagline: string;
  emoji: string;
  /** màu chủ đạo (hex) */
  color: string;
  cover: string;
  /** thiết bị ảo dùng trong bài (vd. bàn phím máy tính) */
  device?: "fx580" | "keyboard";
  /** nhân vật dẫn chuyện (mặc định Mochi) */
  mascot?: "mochi" | "bit";
  /** cảnh nền riêng của môn; "cyber" = tông tối, neon (môn cho bé lớn) */
  /** calm: ảnh nền bản đồ nhiều chi tiết thì làm mờ, tối bớt cho thẻ bài nổi lên */
  look?: { theme?: "cyber"; map?: string; lesson?: string; calm?: boolean };
  /** chế độ chơi thêm hiện trên đầu bản đồ (vd. sinh tồn, bài gõ hay) */
  modes?: { id: string; name: string; short: string; emoji: string; href: string; icon?: string }[];
  tiers: Tier[];
  ready: boolean;
  /** false = môn không có thi đấu trực tiếp (vd. Tập đọc), ẩn khỏi trang Thi đấu */
  arena?: boolean;
  /** cấp học, để trang chủ xếp môn theo nhóm tuổi (xem STAGES) */
  stage: StageId;
}

export type StageId = "primary" | "secondary" | "high" | "all";
