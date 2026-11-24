"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { makeRng, randomSeed } from "@/lib/rng";
import { genLevel } from "@/lib/code/levels";
import type { Level } from "@/lib/code/world";
import type { Slide } from "@/content/types";
import { BlockView } from "@/components/lesson/Blocks";
import { playVoice, stopVoice } from "@/lib/sound";
import { play } from "@/lib/sound";
import { Scene } from "@/components/Scene";
import { MusicToggle } from "@/components/Music";
import { IconClose, IconStar } from "@/components/Icons";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { Ico } from "@/components/Ico";
import { LevelPlayer, type LevelResult } from "./LevelPlayer";
import { HoloDefs, SkinBackdrop, SkinProvider, skinFonts } from "./skin";
import { ThemePicker } from "./ThemePicker";
import { loadSkinChoice, pickSkin, saveSkinChoice, SKINS, type SkinId } from "@/lib/code/skins";
import { tierUnlocked } from "@/lib/tiers";

/**
 * Bài học môn Lập trình, một luồng liền: vài slide hướng dẫn ngắn → các màn chơi → kết quả.
 * Bài đã đọc hướng dẫn rồi thì vào thẳng màn chơi (bấm 📖 để xem lại).
 * Sao của bài = tổng sao các màn; có thêm màn sinh ngẫu nhiên nên chơi lại mỗi lần một khác.
 */
export function CodePractice({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const { subject, tier, lesson, next } = getLesson(subjectId, lessonId)!;
  const spec = lesson.code!;
  const { recordPractice, setLast, markRead, data, ready, lesson: lessonState } = useProgress();
  // giao diện: bé đã chọn thì theo bé (nếu đã mở khóa), không thì theo trình độ của bài
  const [chosen, setChosen] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  useEffect(() => setChosen(loadSkinChoice()), []);
  const tierOpen = (tierId: string) =>
    tierUnlocked(
      subject,
      subject.tiers.findIndex((t) => t.id === tierId),
      lessonState,
      data.unlocks,
    );
  const skin = SKINS[pickSkin(chosen, tier.id, tierOpen)];
  const choose = (id: SkinId) => {
    saveSkinChoice(id);
    setChosen(id);
    setPicking(false);
  };
  /** đang xem slide hướng dẫn thứ mấy (null = đang chơi) */
  const [slide, setSlide] = useState<number | null>(null);
  const [introChecked, setIntroChecked] = useState(false);
  useEffect(() => {
    if (!ready || introChecked) return;
    setIntroChecked(true);
    if (!data.lessons[`${subject.id}/${lesson.id}`]?.read) setSlide(0);
  }, [ready, introChecked, data.lessons, subject.id, lesson.id]);
  const nextSlide = () => {
    if (slide === null) return;
    if (slide + 1 < lesson.slides.length) return setSlide(slide + 1);
    markRead(subject.id, lesson.id);
    setSlide(null);
  };
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

  if (!levels.length || !introChecked) return null;
  const back = `/hoc/${subject.id}`;

  return (
    <SkinProvider value={skin}>
      <div className={`flex h-dvh flex-col ${skinFonts} lt-skin-${skin.id} ${skin.dark ? "theme-cyber" : ""}`}>
        {skin.id === "neon" ? <Scene image={subject.look?.lesson ?? "bg-lesson"} variant="deep" /> : <SkinBackdrop skin={skin} />}
        {skin.id === "holo" && <HoloDefs />}
        <header className="lt-header z-20 shrink-0 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 sm:px-5">
            <Link href={back} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
              <IconClose className="h-5 w-5" />
            </Link>
            <span className="chip hidden bg-sky-soft text-sky sm:inline-flex">
              {lesson.emoji} {lesson.title}
            </span>
            <div className="flex flex-1 items-center justify-center gap-1.5">
              <button
                onClick={() => setSlide(slide === null ? 0 : null)}
                className={`grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-xs font-extrabold ${slide !== null ? "bg-sky text-white ring-4 ring-sky-soft" : "bg-white text-ink-soft"}`}
                aria-label="Hướng dẫn"
                title="Xem hướng dẫn"
              >
                📖
              </button>
              <span className="h-0.5 w-3 rounded bg-line" />
              {levels.map((_, k) => (
                <span
                  key={k}
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold ${k < results.length ? (results[k].stars ? "bg-mint text-white" : "bg-line text-ink-soft") : k === i && slide === null ? "bg-sky text-white ring-4 ring-sky-soft" : "bg-white text-ink-soft"}`}
                >
                  {k < results.length && results[k].stars ? "★" : k + 1}
                </span>
              ))}
            </div>
            <button
              onClick={() => setPicking(true)}
              className="lt-theme-btn flex h-10 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-extrabold shadow-sm"
              title="Đổi giao diện"
              aria-label="Đổi giao diện"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="7" cy="8" r="1.6" fill="#ffb547" />
                <circle cx="12" cy="6.5" r="1.6" fill="#2fd9a0" />
                <circle cx="14" cy="11" r="1.6" fill="#a66bff" />
                <circle cx="8" cy="13" r="2.4" fill="#4fa8ff" />
              </svg>
              <span className="hidden sm:inline">Giao diện</span>
            </button>
            <MusicToggle />
          </div>
        </header>
        {picking && <ThemePicker subject={subject} current={skin.id} open={tierOpen} onPick={choose} onClose={() => setPicking(false)} />}

        {/* kéo thả cần màn rộng: điện thoại dọc thì nhắc xoay ngang */}
        <div className="fixed inset-0 z-50 grid place-items-center bg-cream p-8 text-center landscape:hidden sm:hidden">
          <div className="space-y-3">
            <Mascot mood="think" size={110} className="mx-auto" />
            <p className="font-display text-xl font-extrabold">Xoay ngang máy nhé!</p>
            <p className="text-ink-soft">Kéo khối lệnh cần màn hình rộng. Dùng iPad hoặc máy tính thì dễ nhất.</p>
          </div>
        </div>

        {slide !== null ? (
          <Intro slides={lesson.slides} i={slide} lessonNo={allLessonsIndex(subject.id, lesson.id)} onPrev={() => setSlide(Math.max(0, slide - 1))} onNext={nextSlide} />
        ) : !summary ? (
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
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      again();
                      setSlide(0);
                    }}
                  >
                    📖 Xem lại hướng dẫn
                  </button>
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
    </SkinProvider>
  );
}

const allLessonsIndex = (subjectId: string, lessonId: string) => (getLesson(subjectId, lessonId)?.index ?? 0) + 1;

/** slide hướng dẫn đầu bài, cùng khung với màn chơi để không phải chuyển trang */
function Intro({ slides, i, lessonNo, onPrev, onNext }: { slides: Slide[]; i: number; lessonNo: number; onPrev: () => void; onNext: () => void }) {
  const s = slides[i];
  useEffect(() => {
    if (i === 0) playVoice(s.voice);
    return () => stopVoice();
  }, [i, s.voice]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const last = i === slides.length - 1;
  return (
    <>
      <main className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-4 py-3 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.article key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }} className="space-y-3">
            <div className="flex items-center gap-3">
              <Mascot mood={s.mood} size={64} className="floaty shrink-0 [@media(max-height:620px)]:hidden" />
              <div>
                <div className="text-sm font-bold text-ink-soft">
                  Bài {lessonNo} · Hướng dẫn {i + 1}/{slides.length}
                </div>
                <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{s.title}</h1>
              </div>
            </div>
            <div className="card space-y-4 p-5 sm:p-6 [@media(max-height:620px)]:space-y-3 [@media(max-height:620px)]:p-4">
              {s.blocks.map((b, k) => (
                <BlockView key={k} b={b} />
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
      </main>
      <footer className="shrink-0 bg-white/60 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <button className="btn btn-ghost" onClick={onPrev} disabled={i === 0}>
            ◀ Trước
          </button>
          <button className="btn btn-primary min-w-40" onClick={onNext}>
            {last ? "Bắt đầu chơi ▶" : "Tiếp ▶"}
          </button>
        </div>
      </footer>
    </>
  );
}
