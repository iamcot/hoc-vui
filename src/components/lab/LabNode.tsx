"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLesson } from "@/content/subjects";
import type { Block, Question } from "@/content/types";
import { practiceSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { useProgress } from "@/lib/store";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { sfx } from "@/lib/chem/sfx";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconStar } from "@/components/Icons";
import { QuestionCard, type AnswerResult } from "@/components/quiz/QuestionCard";
import { LabScene, LabShell } from "./LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "./LabChrome";
import { Guide, LAB_RATE, Say, Tag, plain } from "./Guide";

const COUNT = 8;

function BlockView({ b }: { b: Block }) {
  if (b.type === "text") return <p className="mt-1"><Say text={b.text} /></p>;
  if (b.type === "tip")
    return (
      <div className={`mt-2 rounded-xl px-3 py-2 text-[0.62em] font-bold ${b.tone === "warn" ? "bg-[#ffe1e6] text-[#7a1230]" : "bg-[#ffefc4] text-[#6b4a00]"}`}>
        {b.tone === "warn" ? "⚠ " : "💡 "}
        <Say text={b.text} />
      </div>
    );
  if (b.type === "example")
    return (
      <div className="mt-2 rounded-xl bg-[#6e5cff22] px-3 py-2 text-[0.62em] font-bold leading-snug">
        <div>Ví dụ: <Say text={b.problem} /></div>
        {b.steps.map((s, i) => <div key={i} className="lab-soft">{i + 1}. {s}</div>)}
        <div className="lab-accent-text">Đáp số: {b.answer}</div>
      </div>
    );
  return null;
}

/**
 * Node luyện tập của môn Hoá (không có thí nghiệm): "Nhớ nhanh" là bong bóng Bit nói trên nền phòng lab,
 * rồi luyện bằng đề sinh ngẫu nhiên đặt trong tấm bảng lab.
 */
export function LabNode({ subjectId, lessonId, mode }: { subjectId: string; lessonId: string; mode: "hoc" | "luyen" }) {
  const { subject, tier, lesson, next } = getLesson(subjectId, lessonId)!;
  const { markRead, recordPractice, setLast, data } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const prefs = useLabPrefs(subject, tier.id);
  const who = tier.mascot ?? subject.mascot ?? "mochi";
  const [picker, setPicker] = useState(false);

  // ── học: các thẻ Nhớ nhanh ──
  const [si, setSi] = useState(0);
  const slides = lesson.slides;
  const slide = slides[Math.min(si, slides.length - 1)];
  const readAll = mode === "hoc" && si >= slides.length - 1;
  useEffect(() => {
    if (readAll) markRead(subject.id, lesson.id);
  }, [readAll, subject.id, lesson.id, markRead]);

  // ── luyện ──
  const [qs, setQs] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [summary, setSummary] = useState<{ stars: number; xp: number } | null>(null);
  const start = () => {
    setQs(practiceSet(subject, lesson.id, randomSeed(), COUNT));
    setQi(0);
    setAnswers([]);
    setSummary(null);
  };
  useEffect(() => {
    if (mode === "luyen") start();
  }, [mode, subject, lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const onNext = (r: AnswerResult) => {
    const all = [...answers, r];
    setAnswers(all);
    if (qi + 1 >= qs.length) {
      const correct = all.filter((a) => a.correct).length;
      const hinted = all.filter((a) => a.correct && a.hinted).length;
      const res = recordPractice(subject.id, lesson.id, correct, qs.length, hinted);
      setSummary(res);
      sfx("chime");
    }
    setQi((x) => x + 1);
  };
  const correct = answers.filter((a) => a.correct).length;

  const spoken = mode === "hoc" && slide ? plain([slide.title, ...slide.blocks.filter((b) => b.type === "text").map((b) => (b as { text: string }).text)].join(". ")) : "";
  useEffect(() => {
    if (!data.sound || !spoken) return;
    const t = window.setTimeout(() => void speak(spoken, { rate: LAB_RATE, fileOnly: true }), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [spoken, data.sound]);

  const progress = mode === "hoc" ? (slides.length ? (si + 1) / slides.length : 1) : qs.length ? Math.min(1, answers.length / qs.length) : 0;

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="fixed inset-0 overflow-hidden">
      <LabScene theme={prefs.theme} />
      <LabTopBar href={`/hoc/${subject.id}`} title={`${lesson.emoji} ${mode === "hoc" ? lesson.title : `Luyện tập: ${lesson.title}`}`} progress={progress} onTheme={() => setPicker(true)} />

      {mode === "hoc" && slide && (
        <div className="absolute inset-0 z-20 overflow-y-auto px-3 pb-4 pt-[4.4rem]">
          <Guide key={si} who={who} mood={slide.mood ?? "think"} wide>
            <Tag dots={slides.map((_, i) => (i < si ? "ok" : i === si ? "on" : ""))}>🧠 NHỚ NHANH</Tag>
            <b>{slide.title}</b>
            <div className="text-[0.72em] font-bold leading-snug">
              {slide.blocks.map((b, i) => (
                <BlockView key={i} b={b} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[0.72em]">
              {si > 0 && (
                <button className="lab-btn lab-btn-ghost" onClick={() => setSi(si - 1)}>
                  ◀ Trước
                </button>
              )}
              {!readAll ? (
                <button className="lab-btn lab-btn-main" onClick={() => setSi(si + 1)} autoFocus>
                  Tiếp ▶
                </button>
              ) : (
                <>
                  <Link href={`/hoc/${subject.id}/${lesson.id}/luyen-tap`} className="lab-btn lab-btn-main" autoFocus>
                    🎯 Luyện tập
                  </Link>
                  {next && (
                    <Link href={`/hoc/${subject.id}/${next.id}`} className="lab-btn lab-btn-ghost">
                      Bài tiếp ▶
                    </Link>
                  )}
                </>
              )}
            </div>
          </Guide>
        </div>
      )}

      {mode === "luyen" && qs.length > 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-3 pt-[4.4rem]">
          {!summary ? (
            <div className="lab-sheet lab-pop-in flex max-h-full w-full max-w-2xl flex-col gap-2 overflow-y-auto rounded-3xl p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Mascot who={who} mood="think" size={64} className="!h-14 !w-14 shrink-0" />
                <div className="font-display text-lg font-extrabold sm:text-xl">
                  Câu {Math.min(qi + 1, qs.length)}/{qs.length}
                  <span className="lab-soft ml-3 text-base">✅ {correct}</span>
                </div>
              </div>
              <div className="lab-q p-1">
                <QuestionCard key={qs[qi].id} q={qs[qi]} onNext={onNext} device={subject.device} noMinus />
              </div>
            </div>
          ) : (
            <div className="lab-sheet lab-pop-in flex max-h-full w-full max-w-xl flex-col items-center gap-3 overflow-y-auto rounded-3xl p-5 text-center sm:p-6">
              {summary.stars >= 2 && <Confetti />}
              <Mascot who={who} mood={summary.stars >= 2 ? "cheer" : summary.stars === 1 ? "happy" : "oops"} size={110} />
              <div className="flex justify-center gap-2 text-sun">
                {[1, 2, 3].map((s) => (
                  <IconStar key={s} filled={summary.stars >= s} className={`h-12 w-12 ${summary.stars >= s ? "" : "opacity-30"}`} />
                ))}
              </div>
              <h2 className="font-display text-3xl font-extrabold">
                Đúng {correct}/{qs.length} câu
              </h2>
              <p className="text-base opacity-80">{summary.stars === 3 ? "Xuất sắc! Con thành thạo dạng này rồi." : summary.stars === 2 ? "Tốt lắm! Làm thêm lần nữa để được 3 sao nhé." : "Xem lại phần Nhớ nhanh rồi thử lại nhé."}</p>
              <div className="flex w-full flex-wrap gap-2">
                <button className="lab-btn lab-btn-main flex-1" onClick={start}>
                  🔁 Làm đề khác
                </button>
                {summary.stars < 2 ? (
                  <Link href={`/hoc/${subject.id}/${lesson.id}`} className="lab-btn lab-btn-ghost flex-1">
                    Xem lại bài
                  </Link>
                ) : next ? (
                  <Link href={`/hoc/${subject.id}/${next.id}`} className="lab-btn lab-btn-ghost flex-1">
                    Bài tiếp ▶
                  </Link>
                ) : (
                  <Link href={`/hoc/${subject.id}/kiem-tra/${tier.id}`} className="lab-btn lab-btn-ghost flex-1">
                    Kiểm tra trình độ
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}
