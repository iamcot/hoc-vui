"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { getSubject, getTier, tierLessons } from "@/content/subjects";
import { challengeOf } from "@/lib/tiers";
import type { Question } from "@/content/types";
import { LEVELS, levelFor, mixedSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { useProgress } from "@/lib/store";
import { QuestionCard, type AnswerResult } from "@/components/quiz/QuestionCard";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { CalcLayout, CalcToggle, useCalcDock } from "@/components/calc/CalcDock";
import { Mascot } from "@/components/Mascot";
import { Art } from "@/components/Art";
import { Confetti } from "@/components/Confetti";
import { play } from "@/lib/sound";
import { Scene } from "@/components/Scene";

/**
 * Bài kiểm tra theo trình độ.
 * mode "level": kiểm tra trình độ 15 câu, ra cấp Hạt mầm → Cây nở hoa.
 * mode "challenge": thử thách vượt cấp (mặc định 10 câu, đúng 8), đạt thì mở trình độ sau.
 */
export function TierTest({ subjectId, tierId, mode }: { subjectId: string; tierId: string; mode: "level" | "challenge" }) {
  const s = getSubject(subjectId)!;
  const cyber = s.look?.theme === "cyber";
  const tier = getTier(s, tierId)!;
  const nextTier = s.tiers[s.tiers.indexOf(tier) + 1];
  const lessons = tierLessons(tier);
  const ch = challengeOf(tier);
  const COUNT = mode === "challenge" ? ch.count : 15;
  const MINUTES = mode === "challenge" ? ch.count : 12;
  const mapHref = `/hoc/${s.id}?cap=${tier.id}`;
  const { recordTest, addXp, unlockTier } = useProgress();
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [left, setLeft] = useState(MINUTES * 60);
  const dock = useCalcDock(s.device);

  useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "run" && left <= 0) finish(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  function start() {
    setQs(mixedSet(s, randomSeed(), COUNT, lessons.map((l) => l.id)));
    setI(0);
    setAnswers([]);
    setLeft(MINUTES * 60);
    setPhase("run");
  }

  function finish(all: AnswerResult[]) {
    const correct = all.filter((a) => a.correct).length;
    const pct = Math.round((correct / COUNT) * 100);
    const weak = Array.from(new Set(qs.filter((_, k) => !all[k]?.correct).map((q) => q.topic)));
    if (mode === "challenge") {
      const passed = correct >= ch.pass;
      if (passed && nextTier) unlockTier(s.id, nextTier.id);
      addXp(s.id, correct * 4 + (passed ? 50 : 0), `thu-thach:${tier.id}`);
      play(passed ? "levelup" : "wrong");
    } else {
      recordTest(`${s.id}:${tier.id}`, { pct, level: levelFor(pct).id, at: new Date().toISOString(), weak });
      addXp(s.id, correct * 4, `kiem-tra:${tier.id}`);
      play("levelup");
    }
    setPhase("done");
  }

  function onNext(r: AnswerResult) {
    const all = [...answers, r];
    setAnswers(all);
    if (i + 1 >= qs.length) finish(all);
    else setI(i + 1);
  }

  const result = useMemo(() => {
    const correct = answers.filter((a) => a.correct).length;
    const pct = Math.round((correct / COUNT) * 100);
    const byTopic = lessons.map((l) => {
      const idx = qs.map((q, k) => (q.topic === l.id ? k : -1)).filter((k) => k >= 0);
      const ok = idx.filter((k) => answers[k]?.correct).length;
      return { lesson: l, total: idx.length, ok };
    });
    return { correct, pct, level: levelFor(pct), byTopic };
  }, [answers, qs, lessons]);

  if (phase === "intro") {
    return (
      <div className={`min-h-dvh ${cyber ? "theme-cyber" : ""}`}>
        {cyber && <Scene image={s.look?.lesson} variant="deep" />}
        <QuizHeader closeHref={mapHref} done={0} total={COUNT} />
        <main className="mx-auto grid max-w-4xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2">
          <Mascot who={s.mascot} mood="think" size={220} className="floaty mx-auto" />
          <div className="space-y-4">
            {mode === "challenge" ? (
              <>
                <h1 className="font-display text-4xl font-extrabold">🚀 Thử thách lên {nextTier?.name}</h1>
                <p className="text-lg text-ink-soft">
                  {COUNT} câu trộn từ cả {lessons.length} bài của {tier.name}, làm trong {MINUTES} phút. Đúng từ <b>{ch.pass} câu</b> trở lên là mở luôn {nextTier?.name}, không cần học hết các bài.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-4xl font-extrabold">Kiểm tra {tier.name.toLowerCase()}</h1>
                <p className="text-lg text-ink-soft">
                  {COUNT} câu trộn từ cả {lessons.length} bài, làm trong {MINUTES} phút. Không có gợi ý, cứ bình tĩnh dùng máy tính nhé.
                </p>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <span key={l.id} className="chip bg-white shadow-sm">
                      {l.emoji} {l.name}
                    </span>
                  ))}
                </div>
              </>
            )}
            <button className="btn btn-peach" onClick={start}>
              Bắt đầu ▶
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "run") {
    const mm = Math.max(0, Math.floor(left / 60));
    const ss = String(Math.max(0, left % 60)).padStart(2, "0");
    return (
      <div className={`min-h-dvh ${cyber ? "theme-cyber" : ""}`}>
        {cyber && <Scene image={s.look?.lesson} variant="deep" />}
        <QuizHeader
          closeHref={mapHref}
          done={answers.length}
          total={COUNT}
          wide={dock.open}
          right={<><span className={`chip ${left < 60 ? "bg-berry-soft text-berry" : "bg-white"} font-mono`}>⏱ {mm}:{ss}</span><CalcToggle dock={dock} /></>}
        />
        <CalcLayout dock={dock}>
          <div className="card p-5 sm:p-8">{qs[i] && <QuestionCard q={qs[i]} mode="race" onNext={onNext} device={s.device} />}</div>
        </CalcLayout>
      </div>
    );
  }

  const { level, pct, correct, byTopic } = result;
  return (
    <div className="min-h-dvh">
      <Scene image="bg-lesson" variant="desk" dim />
      {(mode === "challenge" ? correct >= ch.pass : pct >= 65) && <Confetti />}
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        {mode === "challenge" ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card grid items-center gap-6 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
            <Mascot who={s.mascot} mood={correct >= ch.pass ? "cheer" : "oops"} size={180} className="floaty mx-auto" />
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-ink-soft">Thử thách lên {nextTier?.name}</p>
              <h1 className="font-display text-4xl font-extrabold">{correct >= ch.pass ? `🎉 Đã mở ${nextTier?.name}!` : correct >= ch.pass - 2 ? "Suýt nữa rồi!" : "Chưa qua lần này"}</h1>
              <p className="text-lg">
                Đúng <b>{correct}/{COUNT}</b> câu.{" "}
                {correct >= ch.pass ? `Em giỏi quá, vào học ${nextTier?.name} thôi.` : `Cần đúng ${ch.pass} câu. Ôn lại mấy bài bên dưới rồi thử lại nhé.`}
              </p>
              {correct >= ch.pass && nextTier && (
                <Link href={`/hoc/${s.id}?cap=${nextTier.id}`} className="btn btn-primary">
                  Vào học {nextTier.name} ▶
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card grid items-center gap-6 p-6 sm:grid-cols-[200px_1fr] sm:p-8">
            <Art id={`level-${level.id}`} emoji={level.emoji} rounded="rounded-full" className="mx-auto h-44 w-44" contain />
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-ink-soft">Trình độ của em</p>
              <h1 className="font-display text-4xl font-extrabold">
                {level.emoji} {level.name}
              </h1>
              <p className="text-lg">
                Đúng <b>{correct}/{COUNT}</b> câu ({pct}%). {level.note}
              </p>
            </div>
          </motion.div>
        )}

        <div className="card p-6">
          <h2 className="mb-4 font-display text-xl font-extrabold">Từng bài</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {byTopic
              .filter((t) => t.total > 0)
              .map(({ lesson, total, ok }) => (
                <li key={lesson.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                  <span className="text-2xl">{lesson.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{lesson.title}</div>
                    <div className="text-sm text-ink-soft">
                      {ok}/{total} câu đúng
                    </div>
                  </div>
                  {ok < total && (
                    <Link href={`/hoc/${s.id}/${lesson.id}`} className="chip bg-sky-soft text-sky">
                      Ôn lại
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button className={`btn ${mode === "challenge" && correct >= ch.pass ? "btn-ghost" : "btn-primary"}`} onClick={start}>
            Làm lại đề khác
          </button>
          <Link href={`/thi-dau?mon=${s.id}&cap=${tier.id}`} className="btn btn-mint">
            ⚡ Rủ bạn thi đấu
          </Link>
          <Link href={mapHref} className="btn btn-ghost">
            Về bản đồ
          </Link>
        </div>
      </main>
    </div>
  );
}
