import type { Block, FakeScreen, Lesson, Question, QuestionGen, ScreenLine, Slide } from "@/content/types";
import { makeRng, type Rng } from "@/lib/rng";

/** một dòng trên màn hình giả. Chữ có thể chứa [[đoạn đáng ngờ|vì sao]] */
export const L = (text: string, x: Partial<ScreenLine> = {}): ScreenLine => ({ text, ...x });
/** dòng do em (người dùng) nói */
export const ME = (text: string): ScreenLine => ({ from: "me", text });

export function S(app: FakeScreen["app"], title: string, o: Omit<FakeScreen, "app" | "title" | "lines">, ...lines: (string | ScreenLine)[]): FakeScreen {
  return { app, title, ...o, lines: lines.map((l) => (typeof l === "string" ? L(l) : l)) };
}

/** câu luyện tập "Em sẽ làm gì?": một cách đúng, vài cách sai */
export interface Drill {
  screen: FakeScreen;
  ask: string;
  good: string;
  bad: string[];
  why: string;
}
/** câu "An toàn hay không ổn?" (dùng cả cho trò Thật hay giả) */
export interface Verdict {
  screen: FakeScreen;
  scam: boolean;
  why: string;
}

export const D = (screen: FakeScreen, ask: string, good: string, bad: string[], why: string): Drill => ({ screen, ask, good, bad, why });
export const F = (screen: FakeScreen, scam: boolean, why: string): Verdict => ({ screen, scam, why });

export const SAFE = "An toàn 👍";
export const SCAM = "Không ổn 🚩";

export interface DigitalLesson {
  id: string;
  title: string;
  short: string;
  emoji: string;
  /** câu dẫn ngắn ở slide đầu */
  intro: string;
  /** id giọng chào ở slide đầu (chỉ tự phát khi đã có file) */
  voice?: string;
  scenario: Omit<Extract<Block, { type: "scenario" }>, "type">;
  spot: FakeScreen;
  spotLabel?: string;
  /** giải thích (slide Ghi nhớ) */
  learn: string;
  /** câu mẹo dễ nhớ */
  remember: string;
  /** slide thêm, chèn trước slide Ghi nhớ (vd. phòng thử mật khẩu) */
  extra?: Slide[];
  drills: Drill[];
  verdicts: Verdict[];
}

const drillQ =
  (lessonId: string, d: Drill, i: number): QuestionGen =>
  (rng: Rng): Question => ({
    id: `${lessonId}-d${i}`,
    prompt: d.ask,
    kind: "choice",
    answer: d.good,
    choices: rng.shuffle([d.good, ...d.bad]),
    explain: d.why,
    topic: lessonId,
    screen: d.screen,
  });

const verdictQ =
  (lessonId: string, v: Verdict, i: number): QuestionGen =>
  (): Question => ({
    id: `${lessonId}-v${i}`,
    prompt: "Tin này an toàn hay không ổn?",
    kind: "choice",
    answer: v.scam ? SCAM : SAFE,
    choices: [SAFE, SCAM],
    explain: v.why,
    topic: lessonId,
    screen: v.screen,
  });

/** dựng bài học chuẩn: Tình huống → Soi dấu hiệu → (thêm) → Ghi nhớ → Thử nhanh */
export function buildLesson(l: DigitalLesson, cover: string, villain: "kid" | "teen" = "kid"): Lesson {
  const first = l.drills[0];
  const slides: Slide[] = [
    { title: l.title, mood: "think", voice: l.voice, blocks: [{ type: "scenario", ...l.scenario, intro: l.intro, villain }] },
    { title: "Soi dấu hiệu", mood: "wow", blocks: [{ type: "spot", screen: l.spot, label: l.spotLabel }] },
    ...(l.extra ?? []),
    {
      title: "Ghi nhớ",
      mood: "happy",
      blocks: [{ type: "image", asset: cover }, { type: "text", text: l.learn }, { type: "tip", text: `**Mẹo nhớ:** ${l.remember}` }],
    },
    { title: "Thử nhanh", mood: "think", blocks: [{ type: "check", question: drillQ(l.id, first, 0)(makeRng(l.id)) }] },
  ];
  return {
    id: l.id,
    title: l.title,
    short: l.short,
    emoji: l.emoji,
    cover,
    minutes: 6,
    slides,
    practice: [...l.drills.map((d, i) => drillQ(l.id, d, i)), ...l.verdicts.map((v, i) => verdictQ(l.id, v, i))],
  };
}
