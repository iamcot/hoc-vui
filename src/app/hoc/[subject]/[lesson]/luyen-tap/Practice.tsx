"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getLesson } from "@/content/subjects";
import type { Question } from "@/content/types";
import { practiceSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { useProgress } from "@/lib/store";
import { QuestionCard, type AnswerResult } from "@/components/quiz/QuestionCard";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { CalcLayout, CalcToggle, useCalcDock } from "@/components/calc/CalcDock";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconStar } from "@/components/Icons";
import { play } from "@/lib/sound";
import { Ico } from "@/components/Ico";

const COUNT = 8;

export function Practice({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const { subject, tier, lesson, next } = getLesson(subjectId, lessonId)!;
  const { recordPractice, setLast } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [summary, setSummary] = useState<{ stars: number; xp: number } | null>(null);
  const dock = useCalcDock(subject.device);

  const start = () => {
    setQs(practiceSet(subject, lesson.id, randomSeed(), COUNT));
    setI(0);
    setAnswers([]);
    setSummary(null);
  };
  useEffect(start, [subject, lesson.id]);

  function onNext(r: AnswerResult) {
    const all = [...answers, r];
    setAnswers(all);
    if (i + 1 >= qs.length) {
      // câu dùng gợi ý vẫn tính đúng, nhưng không cộng XP cho câu đó
      const correct = all.filter((a) => a.correct).length;
      const hintedCorrect = all.filter((a) => a.correct && a.hinted).length;
      const res = recordPractice(subject.id, lesson.id, correct, qs.length, hintedCorrect);
      setSummary(res);
      play(res.stars >= 2 ? "levelup" : "complete");
    }
    setI((x) => x + 1);
  }

  if (!qs.length) return null;
  const correct = answers.filter((a) => a.correct).length;

  return (
    <div className="lesson-light min-h-dvh">
      <QuizHeader closeHref={`/hoc/${subject.id}`} done={answers.length} total={qs.length} wide={dock.open && !summary} right={!summary && <CalcToggle dock={dock} />} />
      {!summary ? (
        <CalcLayout dock={dock}>
          <div className="card p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-ink-soft">
              <span className="chip bg-sky-soft text-sky">
                {lesson.emoji} Luyện tập: {lesson.title}
              </span>
              <span className="ml-auto">✅ {correct}</span>
            </div>
            <QuestionCard q={qs[i]} onNext={onNext} device={subject.device} />
          </div>
        </CalcLayout>
      ) : (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-lg space-y-5 p-8 text-center">
            {summary.stars >= 2 && <Confetti />}
            <Mascot mood={summary.stars >= 2 ? "cheer" : summary.stars === 1 ? "happy" : "oops"} size={130} className="floaty mx-auto" />
            <div className="flex justify-center gap-2 text-sun">
              {[1, 2, 3].map((s) => (
                <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 * s, type: "spring" }}>
                  <IconStar filled={summary.stars >= s} className={`h-14 w-14 ${summary.stars >= s ? "" : "text-line"}`} />
                </motion.span>
              ))}
            </div>
            <h1 className="font-display text-3xl font-extrabold">
              Đúng {correct}/{qs.length} câu
            </h1>
            <p className="text-ink-soft">
              {summary.stars === 3 ? "Xuất sắc! Em đã thành thạo bài này." : summary.stars === 2 ? "Tốt lắm! Làm thêm lần nữa để được 3 sao nhé." : summary.stars === 1 ? "Khá rồi, xem lại bài học rồi thử lại nhé." : "Không sao cả, xem lại bài học rồi thử lại nhé."}
            </p>
            <div className="chip mx-auto bg-sun-soft text-ink">+{summary.xp} XP <Ico n="star" /></div>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn btn-primary" onClick={start}>
                <Ico n="retry" /> Làm đề khác
              </button>
              {summary.stars < 2 ? (
                <Link href={`/hoc/${subject.id}/${lesson.id}`} className="btn btn-ghost">
                  Xem lại bài
                </Link>
              ) : next ? (
                <Link href={`/hoc/${subject.id}/${next.id}`} className="btn btn-mint">
                  Bài tiếp ▶
                </Link>
              ) : (
                <Link href={`/hoc/${subject.id}/kiem-tra/${tier.id}`} className="btn btn-mint">
                  Kiểm tra trình độ
                </Link>
              )}
            </div>
          </motion.div>
      </main>
      )}
    </div>
  );
}
