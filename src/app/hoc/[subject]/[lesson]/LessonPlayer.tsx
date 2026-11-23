"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { Mascot } from "@/components/Mascot";
import { BlockView } from "@/components/lesson/Blocks";
import { Confetti } from "@/components/Confetti";
import { IconClose, IconSound } from "@/components/Icons";
import { play, playVoice, stopVoice } from "@/lib/sound";

export function LessonPlayer({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const info = getLesson(subjectId, lessonId)!;
  const { subject, lesson, index, next } = info;
  const { markRead, data, setSound } = useProgress();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const total = lesson.slides.length;
  const finished = i >= total;
  const slide = lesson.slides[Math.min(i, total - 1)];

  useEffect(() => {
    if (finished) {
      markRead(subject.id, lesson.id);
      play("complete");
      playVoice("vo-complete");
    } else playVoice(slide.voice);
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const go = (d: number) => {
    setDir(d);
    play("whoosh", 0.3);
    setI((x) => Math.max(0, Math.min(total, x + d)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href={`/hoc/${subject.id}`} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Đóng bài học">
            <IconClose className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 gap-1.5">
            {lesson.slides.map((_, k) => (
              <span key={k} className={`h-2.5 flex-1 rounded-full transition-colors ${k < i || finished ? "bg-mint" : k === i ? "bg-sky" : "bg-line"}`} />
            ))}
          </div>
          <button onClick={() => setSound(!data.sound)} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Bật tắt âm thanh">
            <IconSound off={!data.sound} className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <AnimatePresence mode="wait" custom={dir}>
          {!finished ? (
            <motion.article
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: 40 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 * dir }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 md:grid-cols-[180px_1fr]"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <Mascot mood={slide.mood} size={110} className="floaty shrink-0" />
                <div>
                  <div className="text-sm font-bold text-ink-soft">
                    Bài {index + 1} · {i + 1}/{total}
                  </div>
                  <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl md:hidden">{slide.title}</h1>
                </div>
              </div>
              <div className="space-y-5">
                <h1 className="hidden font-display text-3xl font-extrabold leading-tight md:block">{slide.title}</h1>
                {slide.blocks.map((b, k) => (
                  <BlockView key={k} b={b} device={subject.device} />
                ))}
              </div>
            </motion.article>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg space-y-5 py-10 text-center">
              <Confetti />
              <Mascot mood="cheer" size={160} className="floaty mx-auto" />
              <h1 className="font-display text-3xl font-extrabold">Hoàn thành bài học!</h1>
              <p className="text-lg text-ink-soft">
                Em vừa học xong <b>{lesson.title}</b>. +20 XP ⭐
              </p>
              <p className="text-ink-soft">Giờ luyện tập để lấy sao nhé. Đề mỗi lần một khác, làm bao nhiêu lần cũng được.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href={`/hoc/${subject.id}/${lesson.id}/luyen-tap`} className="btn btn-primary">
                  ✏️ Luyện tập ngay
                </Link>
                {next ? (
                  <Link href={`/hoc/${subject.id}/${next.id}`} className="btn btn-ghost">
                    Bài tiếp: {next.title}
                  </Link>
                ) : (
                  <Link href={`/hoc/${subject.id}/kiem-tra`} className="btn btn-ghost">
                    Kiểm tra trình độ
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!finished && (
        <footer className="sticky bottom-0 border-t border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <button className="btn btn-ghost" onClick={() => go(-1)} disabled={i === 0}>
              ◀ Trước
            </button>
            <button className="btn btn-primary min-w-36" onClick={() => go(1)}>
              {i === total - 1 ? "Hoàn thành ✓" : "Tiếp ▶"}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
