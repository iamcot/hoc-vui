import type { Rng } from "@/lib/rng";
import type { LabState, VesselSpec } from "./lab";

/** cấp giải thích: cùng một thí nghiệm, nói nông hay sâu tuỳ trình độ */
export type Depth = "nhi" | "khtn" | "thcs" | "thpt";
export const DEPTHS: { id: Depth; name: string; emoji: string }[] = [
  { id: "nhi", name: "Nhí", emoji: "🧸" },
  { id: "khtn", name: "Khoa học", emoji: "🔬" },
  { id: "thcs", name: "THCS", emoji: "⚗️" },
  { id: "thpt", name: "THPT", emoji: "🧬" },
];

export type Tool = "stir" | "heat" | "splint" | "ph" | "thermo";

export interface Step {
  /** nhãn ngắn trên dải nhiệm vụ */
  text: string;
  done: (log: string[], s: LabState) => boolean;
  /** câu Mochi nói, **chữ đậm** */
  say?: string;
  /** lọ cần dùng (sáng viền) và cốc cần thả vào (ngón tay chỉ) */
  chem?: string;
  vessel?: string;
  /** sau khi đã thả `chem`: bấm nút này, Mochi nói `then` */
  tool?: Tool;
  then?: string;
  /** sau khi đã thả `chem`: lọ tiếp theo cần dùng */
  thenChem?: string;
}

export interface Goal {
  /** việc bé cần làm, hiện trong khung bên phải */
  text: string;
  done: (log: string[], s: LabState) => boolean;
  /** gợi ý khi bé loay hoay */
  hint?: string;
  /** các bước nhỏ (đánh dấu ✓ dần). Mochi đọc `say`, chỉ vào lọ `chem` và dụng cụ `vessel` */
  steps?: Step[];
}

export interface Experiment {
  id: string;
  title: string;
  emoji: string;
  /** lời dẫn ngắn đầu thí nghiệm */
  intro: string;
  vessels: VesselSpec[];
  /** các chất/vật trên kệ */
  shelf: string[];
  tools?: Tool[];
  goal: Goal;
  /** đoán trước khi làm */
  predict?: { q: string; choices: { label: string; color?: string; emoji?: string }[]; answer: number };
  /** điều quan sát được (hiện sau khi xong) */
  observe: string[];
  explain: Partial<Record<Depth, string>>;
  /** phương trình, từng phần tử là một chất hoặc dấu (+, →) */
  equation?: string[];
  /** câu ghi nhớ, lưu vào Sổ tay */
  remember: string;
  safety?: { text: string; home: boolean };
  /** làm sai thì ra sự cố nào */
  incidents?: { overflow?: string; boom?: string };
}

export interface Incident {
  id: string;
  title: string;
  emoji: string;
  /** soft: trào bọt, tràn (bé nhỏ) · boom: nổ */
  level: "soft" | "boom";
  why: Partial<Record<Depth, string>>;
  real: string;
  right: string;
  equation?: string[];
  /** 3 khung xem lại chậm */
  frames?: [string, string, string];
  home?: boolean;
}

/** Nhiệm vụ thực hành: sinh ngẫu nhiên mỗi lần chơi */
export interface Mission {
  title: string;
  brief: string;
  vessels: VesselSpec[];
  shelf: string[];
  tools?: Tool[];
  /** nhận biết: chọn đáp án cho từng ống */
  identify?: { answers: Record<string, string>; options: string[]; ask: string };
  /** hoặc đạt mục tiêu */
  goal?: Goal;
  incidents?: Experiment["incidents"];
}

export interface LabLesson {
  experiments: Experiment[];
  missions: ((rng: Rng) => Mission)[];
}
