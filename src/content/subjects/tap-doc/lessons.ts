import type { Block, Lesson, LetterItem, Question, QuestionGen, Slide, Unit } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { ONSET_SAY, TONE_NAME, TONE_SAY, addTone, parseSyllable, splitTone, type Tone } from "@/lib/viet";
import { DOC_CAU, DOC_TRON, HOC_VAN, VO_LONG, type PhonicsLesson, type ReadingLesson, type Sound } from "./data";

const ALL_PHONICS = [...VO_LONG, ...HOC_VAN].flatMap((u) => u.lessons);
const ALL_SOUNDS = ALL_PHONICS.flatMap((l) => l.sounds);
const ALL_WORDS = [...new Set(ALL_SOUNDS.flatMap((s) => s.words))];
const TONES: Tone[] = ["ngang", "huyen", "sac", "hoi", "nga", "nang"];

/** lời dẫn cố định, có file giọng riêng (xem voices.ts) */
export const SAY = {
  ngheChu: "Nghe và chọn chữ đúng.",
  ngheVan: "Nghe và chọn vần đúng.",
  ngheTieng: "Nghe và chọn tiếng đúng.",
  ngheTu: "Nghe và chọn từ đúng.",
  ngheCau: "Nghe và chọn câu đúng.",
  timCo: "Tiếng nào có",
  timVan: "Tiếng nào có vần",
  ghep: "Ghép lại thành tiếng nào?",
  dau: "Tiếng này có dấu gì?",
  docTieng: "Em đọc to tiếng này nhé.",
  docCau: "Em đọc to nhé.",
  dien: "Chọn tiếng còn thiếu trong câu.",
  thu: "Mình thử nhanh nhé!",
} as const;

const letter = (s: Sound): LetterItem => ({ g: s.g, say: s.say, kind: s.kind, key: s.key, emoji: s.emoji });
const isToneLesson = (l: PhonicsLesson) => l.id.startsWith("td-b-thanh");

/** tiếng có chứa âm/vần s không (so theo cấu tạo, không so chuỗi con) */
function hasSound(word: string, s: Sound): boolean {
  return word.split(/\s+/).some((syl) => {
    const p = parseSyllable(syl);
    const base = splitTone(syl.toLowerCase()).base;
    if (s.kind === "van") return p.rime === s.g;
    if (s.kind === "nguyen-am") return base.includes(s.g);
    return p.onset === s.g;
  });
}

// ───────── slide ─────────

function phonicsSlides(l: PhonicsLesson): Slide[] {
  const slides: Slide[] = [];
  const kindName = l.sounds[0].kind === "van" ? "vần" : l.sounds[0].kind === "chu-ghep" ? "chữ ghép" : "chữ";
  slides.push({
    title: l.sounds.length > 1 ? `Gặp ${l.sounds.length} ${kindName} mới` : `Gặp ${kindName} ${l.sounds[0].g}`,
    mood: "happy",
    say: l.intro,
    blocks: [{ type: "text", text: l.intro }, { type: "letters", items: l.sounds.map(letter) }],
  });

  if (isToneLesson(l)) {
    const tones: Tone[] = l.id.endsWith("-1") ? ["ngang", "huyen", "sac"] : ["hoi", "nga", "nang"];
    slides.push({
      title: tones.map((t) => TONE_NAME[t].replace("thanh ", "")).join(", "),
      mood: "wow",
      blocks: [
        { type: "letters", items: tones.map((t) => ({ g: addTone("ba", t), say: addTone("ba", t), kind: "thanh" as const, key: TONE_NAME[t] })) },
        ...(l.tip ? [{ type: "tip", text: l.tip } as Block] : []),
      ],
    });
  }

  for (const s of l.sounds) {
    const blocks: Block[] = [];
    if (s.kind === "nguyen-am") {
      blocks.push({ type: "letters", items: [letter(s)] });
      blocks.push({ type: "say", items: s.words, label: "Đọc với các dấu thanh" });
      blocks.push({ type: "read", text: s.g === "y" ? "i" : s.words[0], strict: false, label: "Em đọc to nhé" });
    } else {
      blocks.push({ type: "blend", word: s.key, emoji: s.emoji, phrase: s.phrase });
      blocks.push({ type: "say", items: s.words, label: s.kind === "van" ? `Các tiếng có vần ${s.g}` : `Các tiếng có ${s.g}` });
      blocks.push({ type: "read", text: s.phrase ?? s.key, strict: true, label: "Em đọc to nhé" });
    }
    if (s.note) blocks.push({ type: "tip", text: s.note });
    slides.push({ title: s.kind === "van" ? `Vần ${s.g}` : s.kind === "nguyen-am" ? `Chữ ${s.g}` : `${s.g} đọc là “${s.say}”`, mood: "think", blocks });
  }

  const last: Block[] = [];
  if (l.tip && !isToneLesson(l)) last.push({ type: "tip", text: l.tip });
  if (l.sentence) last.push({ type: "read", text: l.sentence, strict: true, label: "Đọc câu ứng dụng" });
  last.push({ type: "check", question: listenGlyph(l, l.sounds[l.sounds.length - 1], ["", "", ""]) });
  slides.push({ title: l.sentence ? "Đọc câu và thử nhanh" : "Thử nhanh", mood: "cheer", blocks: last });
  return slides;
}

function readingSlides(l: ReadingLesson): Slide[] {
  const isPoem = l.id.startsWith("td-tho");
  const isWords = l.id.startsWith("td-tu");
  const slides: Slide[] = [{ title: l.title, mood: "happy", say: l.intro, blocks: [{ type: "text", text: l.intro }, ...(l.tip ? [{ type: "tip", text: l.tip } as Block] : [])] }];
  if (isWords) {
    slides[0].blocks.push({ type: "say", items: l.lines, label: "Chạm để nghe" });
    for (let i = 0; i < l.lines.length; i += 2)
      slides.push({ title: "Đọc to từng từ", mood: "think", blocks: l.lines.slice(i, i + 2).map((t) => ({ type: "read", text: t, strict: true }) as Block) });
  } else if (isPoem) {
    slides.push({ title: "Nghe đọc mẫu", mood: "think", blocks: [{ type: "say", items: [l.lines.join("\n")], label: "Chạm để nghe cả bài" }] });
    slides.push({ title: "Em đọc cả bài", mood: "think", blocks: [{ type: "read", text: l.lines.join(" "), strict: true, label: l.title }] });
  } else {
    for (const t of l.lines) slides.push({ title: "Đọc từng câu", mood: "think", blocks: [{ type: "read", text: t, strict: true }] });
    if (l.lines.length > 2) slides.push({ title: "Đọc cả đoạn", mood: "wow", blocks: [{ type: "read", text: l.lines.join(" "), strict: true, label: l.title }] });
  }
  slides.push({ title: "Em hiểu bài chưa?", mood: "cheer", blocks: [{ type: "check", question: comprehension(l, 0, null) }] });
  return slides;
}

// ───────── bài tập ─────────

const uniq = <T,>(a: T[]) => [...new Set(a)];

function pickOthers(rng: Rng, pool: string[], not: string[], n: number) {
  return rng.shuffle(uniq(pool).filter((x) => !not.includes(x))).slice(0, n);
}

/** Nghe đọc một âm/vần, chọn chữ đúng */
function listenGlyph(l: PhonicsLesson, s: Sound, seedNote: string[] | Rng): Question {
  const rng = Array.isArray(seedNote) ? null : seedNote;
  const sameKind = ALL_SOUNDS.filter((x) => x.kind === s.kind || (s.kind === "chu-ghep" && x.kind === "phu-am")).map((x) => x.g);
  const near = l.sounds.map((x) => x.g).filter((g) => g !== s.g);
  const others = rng ? pickOthers(rng, [...near, ...rng.shuffle(sameKind)], [s.g], 3) : uniq([...near, ...sameKind]).filter((g) => g !== s.g).slice(0, 3);
  const choices = rng ? rng.shuffle([s.g, ...others]) : [others[0], s.g, ...others.slice(1)];
  return {
    id: `${l.id}-nghe-${s.g}`,
    prompt: s.kind === "van" ? "Nghe và chọn vần đúng" : "Nghe và chọn chữ đúng",
    kind: "choice",
    answer: s.g,
    choices,
    say: s.say,
    voice: [s.kind === "van" ? SAY.ngheVan : SAY.ngheChu, s.say],
    big: true,
    topic: l.title,
    explain: `“${s.say}” viết là **${s.g}**, như trong tiếng **${s.key}** ${s.emoji}`,
  };
}

function lessonGens(l: PhonicsLesson): QuestionGen[] {
  const gens: QuestionGen[] = [];
  gens.push((rng) => listenGlyph(l, rng.pick(l.sounds), rng));

  // nghe một tiếng, chọn tiếng đúng
  gens.push((rng) => {
    const s = rng.pick(l.sounds);
    const w = rng.pick(s.words);
    const { base, tone } = splitTone(w);
    const toneVariants = TONES.filter((t) => t !== tone).map((t) => addTone(base, t));
    const pool = isToneLesson(l) || s.kind === "nguyen-am" ? toneVariants : [...l.sounds.flatMap((x) => x.words), ...toneVariants.slice(0, 2)];
    const choices = rng.shuffle([w, ...pickOthers(rng, pool, [w], 3)]);
    return { id: `${l.id}-tieng-${w}`, prompt: "Nghe và chọn tiếng đúng", kind: "choice", answer: w, choices, say: w, voice: [SAY.ngheTieng, w], big: true, topic: l.title };
  });

  if (!isToneLesson(l) && l.sounds[0].kind !== "nguyen-am") {
    // tiếng nào có âm/vần ...
    gens.push((rng) => {
      const s = rng.pick(l.sounds.filter((x) => x.words.some((w) => hasSound(w, x))));
      const right = rng.pick(s.words.filter((w) => hasSound(w, s)));
      // ưu tiên tiếng của các bài đã học
      // bỏ tiếng chỉ có nguyên âm (ì, á...) cho đỡ lạ mắt
      const real = (w: string) => !hasSound(w, s) && (s.kind === "van" || parseSyllable(w).onset !== "");
      const learned = ALL_PHONICS.slice(0, ALL_PHONICS.indexOf(l) + 1).flatMap((x) => x.sounds.flatMap((y) => y.words)).filter(real);
      const wrong = pickOthers(rng, learned.length >= 6 ? learned : ALL_WORDS.filter(real), [right], 3);
      return {
        id: `${l.id}-tim-${s.g}-${right}`,
        prompt: s.kind === "van" ? `Tiếng nào có vần **${s.g}**?` : `Tiếng nào có **${s.g}**?`,
        kind: "choice",
        answer: right,
        choices: rng.shuffle([right, ...wrong]),
        voice: [s.kind === "van" ? SAY.timVan : SAY.timCo, s.say],
        big: true,
        topic: l.title,
      };
    });
    // ghép âm đầu + vần + thanh
    gens.push((rng) => {
      const cands = l.sounds.flatMap((x) => x.words).filter((x) => !x.includes(" ") && parseSyllable(x).onset);
      if (!cands.length) return listenGlyph(l, rng.pick(l.sounds), rng);
      const w = rng.pick(cands);
      const p = parseSyllable(w);
      const variants = TONES.filter((t) => t !== p.tone).map((t) => addTone(p.onset + p.rime, t));
      const choices = rng.shuffle([w, ...pickOthers(rng, variants, [w], 3)]);
      return {
        id: `${l.id}-ghep-${w}`,
        prompt: `Ghép lại: **${p.onset}** + **${p.rime}**${p.tone === "ngang" ? " (không dấu)" : ` + **${TONE_NAME[p.tone].replace("thanh ", "dấu ")}**`} = ?`,
        kind: "choice",
        answer: w,
        choices,
        big: true,
        say: w,
        // không đọc đáp án: chỉ đọc lời dẫn và từng mảnh (bờ, an, huyền)
        voice: [SAY.ghep, ONSET_SAY[p.onset] ?? p.onset, p.rime, ...(p.tone === "ngang" ? [] : [TONE_SAY[p.tone]])],
        topic: l.title,
      };
    });
  }

  if (isToneLesson(l)) {
    gens.push((rng) => {
      const w = rng.pick(l.sounds[0].words.filter((x) => splitTone(x).tone !== "ngang"));
      const t = splitTone(w).tone;
      const names = TONES.filter((x) => x !== "ngang").map((x) => TONE_NAME[x].replace("thanh ", "dấu "));
      const ans = TONE_NAME[t].replace("thanh ", "dấu ");
      return { id: `${l.id}-dau-${w}`, prompt: `Tiếng **${w}** có dấu gì?`, kind: "choice", answer: ans, choices: rng.shuffle([ans, ...pickOthers(rng, names, [ans], 3)]), say: w, voice: [SAY.dau, w], topic: l.title };
    });
  }

  // đọc to
  gens.push((rng) => {
    const s = rng.pick(l.sounds);
    const w = rng.pick(s.words);
    return { id: `${l.id}-doc-${w}`, prompt: "Em đọc to tiếng này nhé", voice: [SAY.docTieng], kind: "read", answer: w, strict: s.kind !== "nguyen-am", topic: l.title };
  });
  return gens;
}

function comprehension(l: ReadingLesson, i: number, rng: Rng | null): Question {
  const [q, right, ...wrong] = l.quiz[i];
  const choices = rng ? rng.shuffle([right, ...wrong]) : [wrong[0], right, ...wrong.slice(1)];
  return { id: `${l.id}-hieu-${i}`, prompt: q, voice: [q], kind: "choice", answer: right, choices, topic: l.title };
}

function readingGens(l: ReadingLesson): QuestionGen[] {
  const gens: QuestionGen[] = [(rng) => comprehension(l, rng.int(0, l.quiz.length - 1), rng)];
  gens.push((rng) => {
    const t = rng.pick(l.lines);
    return { id: `${l.id}-doc-${t}`, prompt: "Em đọc to nhé", voice: [SAY.docCau], kind: "read", answer: t, strict: true, topic: l.title };
  });
  // nghe câu, chọn câu đúng
  gens.push((rng) => {
    const t = rng.pick(l.lines);
    const others = pickOthers(rng, l.lines, [t], 3);
    return { id: `${l.id}-nghe-${t}`, prompt: l.id.startsWith("td-tu") ? "Nghe và chọn từ đúng" : "Nghe và chọn câu đúng", kind: "choice", answer: t, choices: rng.shuffle([t, ...others]), say: t, voice: [l.id.startsWith("td-tu") ? SAY.ngheTu : SAY.ngheCau, t], topic: l.title };
  });
  if (!l.id.startsWith("td-tu")) {
    // điền tiếng còn thiếu
    gens.push((rng) => {
      const t = rng.pick(l.lines);
      const ws = t.replace(/[.,!?]/g, "").split(" ");
      const k = rng.int(0, ws.length - 1);
      const right = ws[k].toLowerCase();
      const pool = l.lines.flatMap((x) => x.replace(/[.,!?]/g, "").toLowerCase().split(" ")).filter((x) => x !== right);
      const shown = t.split(" ").map((w, j) => (j === k ? "___" : w)).join(" ");
      return { id: `${l.id}-dien-${t}-${k}`, prompt: `Điền tiếng còn thiếu:\n**${shown}**`, kind: "choice", answer: right, choices: rng.shuffle([right, ...pickOthers(rng, pool, [right], 3)]), say: t, voice: [SAY.dien, t], topic: l.title };
    });
  }
  return gens;
}

// ───────── lắp bài ─────────

function fromPhonics(l: PhonicsLesson): Lesson {
  return {
    id: l.id,
    title: l.title,
    short: l.short,
    emoji: l.sounds[0].emoji,
    cover: "td-cover",
    glyph: l.sounds.map((s) => s.g).join(" "),
    minutes: 4 + l.sounds.length,
    slides: phonicsSlides(l),
    practice: lessonGens(l),
  };
}

function fromReading(l: ReadingLesson): Lesson {
  return { id: l.id, title: l.title, short: l.short, emoji: l.emoji, cover: "td-cover", minutes: 6, slides: readingSlides(l), practice: readingGens(l) };
}

export const unitsVoLong: Unit[] = VO_LONG.map((u) => ({ id: u.unit, title: u.title, lessons: u.lessons.map(fromPhonics) }));
export const unitsHocVan: Unit[] = HOC_VAN.map((u) => ({ id: u.unit, title: u.title, lessons: u.lessons.map(fromPhonics) }));
export const unitsDocCau: Unit[] = DOC_CAU.map((u) => ({ id: u.unit, title: u.title, lessons: u.lessons.map(fromReading) }));
export const unitsDocTron: Unit[] = DOC_TRON.map((u) => ({ id: u.unit, title: u.title, lessons: u.lessons.map(fromReading) }));
