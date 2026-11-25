"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { Art } from "@/components/Art";
import { Mascot } from "@/components/Mascot";
import { BlockView } from "@/components/lesson/Blocks";
import { Confetti } from "@/components/Confetti";
import { IconClose, IconSound } from "@/components/Icons";
import { play, playVoice, stopVoice } from "@/lib/sound";
import { audioById, hasFile } from "@/content/assets";

const voiceReady = (id: string) => {
  const a = audioById(id);
  return !!a && hasFile(a.file);
};
import { speak, stopSpeak } from "@/lib/speech/tts";
import { Kbd } from "@/components/typing/Kbd";
import { MusicToggle } from "@/components/Music";
import { CalcModeToggle } from "@/components/calc/CalcDock";
import { Scene } from "@/components/Scene";
import { Ico } from "@/components/Ico";

export function LessonPlayer({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const info = getLesson(subjectId, lessonId)!;
  const { subject, tier, lesson, index, next } = info;
  const { markRead, data, setSound, setLast } = useProgress();
  // nhớ bài đang học: thoát ra rồi vào lại bản đồ thì tới đúng bài này
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const total = lesson.slides.length;
  /** môn Gõ phím: hiện phím tắt ngay trên nút */
  const keys = subject.device === "keyboard";
  const finished = i >= total;
  const raw = lesson.slides[Math.min(i, total - 1)];
  // môn Gõ phím: slide có ô gõ thử thì bàn phím đi kèm ô gõ (sáng phím cần gõ tiếp), không vẽ hai bàn phím
  const slide = (() => {
    const kb = raw.blocks.find((b) => b.type === "keyboard");
    if (!kb || !raw.blocks.some((b) => b.type === "drill")) return raw;
    return {
      ...raw,
      blocks: raw.blocks
        .filter((b) => b !== kb)
        .map((b) => (b.type === "drill" ? { ...b, keys: b.keys ?? kb.keys, focus: b.focus ?? kb.focus, label: b.label ?? kb.label } : b)),
    };
  })();

  useEffect(() => {
    if (finished) {
      markRead(subject.id, lesson.id);
      play("complete");
      playVoice("vo-complete");
    } else if (slide.say) void speak(slide.say);
    else if (i === 0) playVoice(slide.voice); // chỉ tự đọc câu chào ở slide đầu, slide khác bấm loa mới đọc
    return () => {
      stopVoice();
      stopSpeak();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const go = (d: number) => {
    setDir(d);
    play("whoosh");
    setI((x) => Math.max(0, Math.min(total, x + d)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // phím tắt: Enter / → sang slide sau, Esc / ← quay lại. Ở màn hoàn thành, Enter vào luyện tập.
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      // Shift+Enter: bỏ qua hướng dẫn, vào luyện tập (game) luôn
      if (e.shiftKey) {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(`/hoc/${subject.id}/${lesson.id}/luyen-tap`);
        }
        return;
      }
      if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        if (finished) {
          if (e.key === "Enter") router.push(`/hoc/${subject.id}/${lesson.id}/luyen-tap`);
        } else go(1);
      } else if (e.key === "Escape" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (i > 0) go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className={`flex min-h-dvh flex-col ${subject.look?.theme === "cyber" ? "theme-cyber" : "lesson-light"}`}>
      <Scene image={subject.look?.lesson ?? "bg-lesson"} variant={subject.look?.theme === "cyber" ? "deep" : "desk"} dim={subject.look?.theme !== "cyber"} />
      <header className="sticky top-0 z-20 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href={`/hoc/${subject.id}`} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Đóng bài học">
            <IconClose className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 gap-1.5">
            {lesson.slides.map((_, k) => (
              <span key={k} className={`h-2.5 flex-1 rounded-full transition-colors ${k < i || finished ? "bg-mint" : k === i ? "bg-sky" : "bg-line"}`} />
            ))}
          </div>
          {subject.device === "fx580" && <CalcModeToggle />}
          <MusicToggle />
          <button onClick={() => setSound(!data.sound)} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Bật tắt âm thanh">
            <IconSound off={!data.sound} className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-6 [@media(max-height:700px)]:py-2">
        <AnimatePresence mode="wait" custom={dir}>
          {!finished ? (
            <motion.article
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: 40 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 * dir }}
              transition={{ duration: 0.25 }}
              className="space-y-4 [@media(max-height:700px)]:space-y-2"
            >
              <div className="flex items-center gap-3">
                <Mascot who={subject.mascot} mood={slide.mood} size={72} className="floaty shrink-0 [@media(max-height:700px)]:hidden" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink-soft">
                    Bài {index + 1} · {i + 1}/{total}
                  </div>
                  <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl [@media(max-height:700px)]:text-2xl">
                    {slide.title}
                    {slide.voice && voiceReady(slide.voice) && (
                      <button
                        onClick={() => playVoice(slide.voice)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-sky shadow-sm transition hover:scale-110"
                        aria-label="Nghe Mochi đọc"
                      >
                        <IconSound className="h-5 w-5" />
                      </button>
                    )}
                  </h1>
                </div>
              </div>
              {(() => {
                const img = slide.blocks.find((b) => b.type === "image");
                const rest = slide.blocks.filter((b) => b !== img);
                const hasCalc = rest.some((b) => b.type === "keys" && b.tryIt);
                const side = img && !hasCalc;
                // slide có máy bấm: ảnh chỉ là hình nhỏ bên trái, nhường chỗ cho phần máy khỏi phải cuộn
                const thumb = img && hasCalc && img.type === "image" ? img : null;
                // môn Tập đọc: khung "em đọc to" đặt cột phải cạnh phần ghép chữ, đỡ phải cuộn
                const read = slide.blocks.find((b) => b.type === "read");
                if (read && !img && slide.blocks.length > 1) {
                  const others = slide.blocks.filter((b) => b !== read);
                  return (
                    <div className="card grid items-center gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] [@media(max-height:700px)]:p-4">
                      <div className="space-y-5">
                        {others.map((b, k) => (
                          <BlockView key={k} b={b} device={subject.device} />
                        ))}
                      </div>
                      <BlockView b={read} device={subject.device} />
                    </div>
                  );
                }
                return (
                  <div className={`card p-5 sm:p-6 [@media(max-height:700px)]:p-4 ${side ? "grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" : thumb ? "grid items-start gap-5 md:grid-cols-[170px_minmax(0,1fr)]" : ""}`}>
                    {thumb && <Art id={thumb.asset} emoji="🖼️" className="mx-auto aspect-[3/2] w-full max-w-[170px] rounded-2xl md:sticky md:top-24" />}
                    {side && (
                      <div className="md:sticky md:top-24">
                        <BlockView b={img} device={subject.device} />
                      </div>
                    )}
                    <div className="space-y-5">
                      {(() => {
                        const list = side || thumb ? rest : slide.blocks;
                        // chữ đứng trước máy ảo được đưa vào cột trái, cạnh máy, cho đỡ phải cuộn
                        const ci = list.findIndex((b) => b.type === "keys" && b.tryIt);
                        const pre = ci > 0 && list.slice(0, ci).every((b) => b.type === "text" || b.type === "tip") ? ci : 0;
                        return list.slice(pre).map((b, k) => (
                          <BlockView
                            key={k}
                            b={b}
                            device={subject.device}
                            lead={k === 0 && pre ? list.slice(0, pre).map((x, j) => <BlockView key={j} b={x} device={subject.device} />) : undefined}
                          />
                        ));
                      })()}
                    </div>
                  </div>
                );
              })()}
            </motion.article>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-lg space-y-5 p-8 text-center">
              <Confetti />
              <Mascot who={subject.mascot} mood="cheer" size={160} className="floaty mx-auto" />
              <h1 className="font-display text-3xl font-extrabold">Hoàn thành bài học!</h1>
              <p className="text-lg text-ink-soft">
                Em vừa học xong <b>{lesson.title}</b>. +20 XP <Ico n="star" />
              </p>
              <p className="text-ink-soft">Giờ luyện tập để lấy sao nhé. Đề mỗi lần một khác, làm bao nhiêu lần cũng được.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href={`/hoc/${subject.id}/${lesson.id}/luyen-tap`} className="btn btn-primary">
                  {keys ? <><Ico n="shark" /> Vào game</> : <><Ico n="pencil" /> Luyện tập ngay</>}
                  {keys && <Kbd k="Enter" />}
                </Link>
                {next ? (
                  <Link href={`/hoc/${subject.id}/${next.id}`} className="btn btn-ghost">
                    Bài tiếp: {next.title}
                  </Link>
                ) : (
                  <Link href={`/hoc/${subject.id}/kiem-tra/${tier.id}`} className="btn btn-ghost">
                    Kiểm tra trình độ
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!finished && (
        <footer className="sticky bottom-0 bg-white/60 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <button className="btn btn-ghost" onClick={() => go(-1)} disabled={i === 0}>
              ◀ Trước{keys && <Kbd k="Escape" />}
            </button>
            {keys ? (
              <Link href={`/hoc/${subject.id}/${lesson.id}/luyen-tap`} className="btn btn-ghost">
                Bỏ qua, vào game <Kbd k="Shift+Enter" />
              </Link>
            ) : (
            <span className="hidden text-xs font-bold text-ink-soft md:block">
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono">Esc</kbd> / <kbd className="rounded border border-current px-1.5 py-0.5 font-mono">←</kbd> quay lại ·{" "}
              <kbd className="rounded border border-current px-1.5 py-0.5 font-mono">Enter</kbd> / <kbd className="rounded border border-current px-1.5 py-0.5 font-mono">→</kbd> đi tiếp
            </span>
            )}
            <button className="btn btn-primary min-w-36" onClick={() => go(1)}>
              {i === total - 1 ? "Hoàn thành ✓" : "Tiếp ▶"}
              {keys && <Kbd k="Enter" />}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
