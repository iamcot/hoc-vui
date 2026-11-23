import type { Rng } from "@/lib/rng";

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
  | { type: "read"; text: string; strict?: boolean; label?: string };

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
  blocks: Block[];
}

/** read: bé đọc to câu trong `answer`, máy nghe chấm (môn Tập đọc) */
export type AnswerKind = "number" | "fraction" | "choice" | "pair" | "read";

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
  /** lựa chọn là chữ cái/vần: hiện chữ thật to */
  big?: boolean;
  /** kind "read": false = sai thanh vẫn tính đạt (âm, vần lẻ) */
  strict?: boolean;
}

export type QuestionGen = (rng: Rng) => Question;

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
  device?: "fx580";
  tiers: Tier[];
  ready: boolean;
}
