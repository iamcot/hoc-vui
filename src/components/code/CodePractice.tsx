"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { makeRng, randomSeed } from "@/lib/rng";
import { genLevel } from "@/lib/code/levels";
import type { Level } from "@/lib/code/world";
import { play } from "@/lib/sound";
import { Scene } from "@/components/Scene";
import { MusicToggle } from "@/components/Music";
import { IconClose, IconStar } from "@/components/Icons";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { Ico } from "@/components/Ico";
import { LevelPlayer, type LevelResult } from "./LevelPlayer";

/** Luyện tập môn Lập trình: chơi lần lượt các màn của bài, thêm màn sinh ngẫu nhiên; sao của bài = tổng sao các màn */
export function CodePractice({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const { subject, tier, lesson, next } = getLesson(subjectId, lessonId)!;
  const spec = lesson.code!;
  const { recordPractice, setLast } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const [seed, setSeed] = useState<string | null>(null);
  useEffect(() => setSeed(randomSeed()), []);
  const levels: Level[] = useMemo(() => {
    if (!seed) return [];
    const rng = makeRng(`${lesson.id}:${seed}`);
    const extra = spec.gen ? Array.from({ length: spec.genCount ?? 1 }, (_, i) => genLevel(rng, spec.gen!, `${lesson.id}-gen-${i}`)) : [];
    return [...spec.levels, ...extra];
  }, [seed, lesson.id, spec]);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<LevelResult[]>([]);
  const [summary, setSummary] = useState<{ stars: number; xp: number } | null>(null);

  function done(r: LevelResult) {
    const all = [...results, r];
    setResults(all);
    if (i + 1 >= levels.length) {
      const got = all.reduce((a, x) => a + x.stars, 0);
      const res = recordPractice(subject.id, lesson.id, got, levels.length * 3);
      setSummary(res);
      play(res.stars >= 2 ? "levelup" : "complete");
    }
    setI((x) => x + 1);
  }

  const again = () => {
    setSeed(randomSeed());
    setI(0);
    setResults([]);
    setSummary(null);
  };

  if (!levels.length) return null;
  const back = `/hoc/${subject.id}`;

  return (
    <div className="flex h-dvh flex-col">
      <Scene image="bg-lesson" variant="desk" dim />
      <header className="z-20 shrink-0 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 sm:px-5">
          <Link href={back} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
            <IconClose className="h-5 w-5" />
          </Link>
          <span className="chip hidden bg-sky-soft text-sky sm:inline-flex">
            {lesson.emoji} {lesson.title}
          </span>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {levels.map((_, k) => (
              <span
                key={k}
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold ${k < results.length ? (results[k].stars ? "bg-mint text-white" : "bg-line text-ink-soft") : k === i ? "bg-sky text-white ring-4 ring-sky-soft" : "bg-white text-ink-soft"}`}
              >
                {k < results.length && results[k].stars ? "★" : k + 1}
              </span>
            ))}
          </div>
          <MusicToggle />
        </div>
      </header>

      {/* kéo thả cần màn rộng: điện thoại dọc thì nhắc xoay ngang */}
      <div className="fixed inset-0 z-50 grid place-items-center bg-cream p-8 text-center landscape:hidden sm:hidden">
        <div className="space-y-3">
          <Mascot mood="think" size={110} className="mx-auto" />
          <p className="font-display text-xl font-extrabold">Xoay ngang máy nhé!</p>
          <p className="text-ink-soft">Kéo khối lệnh cần màn hình rộng. Dùng iPad hoặc máy tính thì dễ nhất.</p>
        </div>
      </div>

      {!summary ? (
        <main className="mx-auto min-h-0 w-full max-w-7xl flex-1 px-3 pb-3 pt-2 sm:px-5">
          <LevelPlayer key={`${seed}-${i}`} level={levels[i]} index={i} total={levels.length} onDone={done} />
        </main>
      ) : (
        <main className="mx-auto grid w-full max-w-3xl flex-1 place-items-center overflow-y-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-lg space-y-4 p-7 text-center">
            {summary.stars >= 2 && <Confetti />}
            <Mascot mood={summary.stars >= 2 ? "cheer" : "happy"} size={110} className="floaty mx-auto" />
            <div className="flex justify-center gap-2 text-sun">
              {[1, 2, 3].map((s) => (
                <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 * s, type: "spring" }}>
                  <IconStar filled={summary.stars >= s} className={`h-12 w-12 ${summary.stars >= s ? "" : "text-line"}`} />
                </motion.span>
              ))}
            </div>
            <h1 className="font-display text-2xl font-extrabold">
              Qua {results.filter((r) => r.stars).length}/{levels.length} màn · {results.reduce((a, r) => a + r.stars, 0)} ⭐
            </h1>
            <p className="text-ink-soft">
              {summary.stars === 3 ? "Xuất sắc! Chương trình vừa đúng vừa gọn." : summary.stars === 2 ? "Giỏi lắm! Dùng ít khối hơn để được 3 sao nhé." : "Làm lại vài màn nữa là quen tay ngay."}
            </p>
            <div className="chip mx-auto bg-sun-soft text-ink">
              +{summary.xp} XP <Ico n="star" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn btn-primary" onClick={again}>
                <Ico n="retry" /> Chơi lại
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
