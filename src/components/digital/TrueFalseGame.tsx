"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Verdict } from "@/content/subjects/ky-nang-so/builder";
import { FakeScreenView } from "./FakeScreen";
import { Scene } from "@/components/Scene";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconClose } from "@/components/Icons";
import { MusicToggle } from "@/components/Music";
import { Ico } from "@/components/Ico";
import { play } from "@/lib/sound";

const SECONDS = 60;
const BEST_KEY = "hocvui:kns-truefalse-best";

export interface TFResult {
  score: number;
  correct: number;
  total: number;
  best: number;
  missed: Verdict[];
}

/**
 * Thật hay giả: tin hiện lần lượt, bấm An toàn (←) hay Không ổn (→). 60 giây, đúng liên tiếp được thưởng thêm.
 * Trả lời sai thì dừng đồng hồ một chút để đọc vì sao.
 */
export function TrueFalseGame({ pool, onFinish, exitHref }: { pool: Verdict[]; onFinish: (r: TFResult) => void; exitHref: string }) {
  const deck = useMemo(() => [...pool].sort(() => Math.random() - 0.5), [pool]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState<Verdict | null>(null);
  const [flash, setFlash] = useState<null | "ok" | "no">(null);
  const missed = useRef<Verdict[]>([]);
  const over = left <= 0 || i >= deck.length;
  const finished = useRef(false);
  const cur = deck[i % deck.length];

  // đồng hồ dừng khi đang đọc giải thích câu sai
  useEffect(() => {
    if (over || wrong) return;
    const t = setInterval(() => setLeft((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [over, wrong]);

  useEffect(() => {
    if (!over || finished.current) return;
    finished.current = true;
    let best = 0;
    try {
      best = Number(localStorage.getItem(BEST_KEY) ?? 0);
      if (score > best) localStorage.setItem(BEST_KEY, String(score));
    } catch {
      /* chế độ riêng tư */
    }
    play(correct >= 8 ? "levelup" : "complete");
    onFinish({ score, correct, total: i, best, missed: missed.current });
  }, [over, score, correct, i, onFinish]);

  const answer = useCallback(
    (scam: boolean) => {
      if (over || wrong) return;
      const ok = scam === cur.scam;
      play(ok ? "correct" : "wrong", 0.5);
      setFlash(ok ? "ok" : "no");
      setTimeout(() => setFlash(null), 250);
      if (ok) {
        setScore((s) => s + 100 + Math.min(streak, 10) * 20);
        setStreak((s) => s + 1);
        setCorrect((c) => c + 1);
        setI((x) => x + 1);
      } else {
        setStreak(0);
        missed.current.push(cur);
        setWrong(cur);
      }
    },
    [over, wrong, cur, streak],
  );

  const next = () => {
    setWrong(null);
    setI((x) => x + 1);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (wrong && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") answer(false);
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") answer(true);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <Scene image="bg-lesson" variant="desk" dim />
      <header className="sticky top-0 z-20 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href={exitHref} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
            <IconClose className="h-5 w-5" />
          </Link>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
            <div className={`h-full rounded-full transition-all duration-1000 ${left <= 10 ? "bg-berry" : "bg-mint"}`} style={{ width: `${(Math.max(0, left) / SECONDS) * 100}%` }} />
          </div>
          <span className={`min-w-12 text-right font-display text-lg font-extrabold ${left <= 10 ? "text-berry" : "text-ink"}`}>{Math.max(0, left)}s</span>
          <span className="chip bg-sun-soft text-ink">⭐ {score}</span>
          {streak >= 2 && <span className="chip bg-peach text-white">🔥 x{streak}</span>}
          <MusicToggle />
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-6 px-4 py-4 sm:px-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 20, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, x: 60, rotate: 6 }} transition={{ duration: 0.2 }} className={flash === "no" ? "shake" : ""}>
            <FakeScreenView screen={cur.screen} mode={wrong ? "reveal" : "plain"} />
          </motion.div>
        </AnimatePresence>
        <div className="space-y-4">
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">An toàn hay không ổn?</h1>
          {wrong ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-3xl bg-berry-soft p-4">
              <div className="flex items-center gap-3">
                <Mascot mood="oops" size={56} />
                <div className="font-display text-lg font-extrabold">Tin này {wrong.scam ? "không ổn 🚩" : "an toàn 👍"}</div>
              </div>
              <p>{wrong.why}</p>
              <button className="btn btn-primary" autoFocus onClick={next}>
                Tiếp tục <kbd className="ml-1 rounded border border-current px-1.5 font-mono text-xs">Enter</kbd>
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => answer(false)} className="rounded-3xl bg-mint px-4 py-6 font-display text-2xl font-extrabold text-white shadow-[var(--shadow-pop)] transition active:translate-y-1">
                👍 An toàn
                <div className="mt-1 text-xs font-bold opacity-80">phím ←</div>
              </button>
              <button onClick={() => answer(true)} className="rounded-3xl bg-berry px-4 py-6 font-display text-2xl font-extrabold text-white shadow-[var(--shadow-pop)] transition active:translate-y-1">
                🚩 Không ổn
                <div className="mt-1 text-xs font-bold opacity-80">phím →</div>
              </button>
            </div>
          )}
          <p className="text-sm text-ink-soft">Đúng liên tiếp được thưởng thêm điểm. Trả lời sai, đồng hồ dừng để em đọc vì sao.</p>
        </div>
      </main>
    </div>
  );
}

export function TrueFalseResult({ r, xp, onReplay, exitHref }: { r: TFResult; xp: number; onReplay: () => void; exitHref: string }) {
  const good = r.correct >= 8;
  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-[#1b1f3b]/50 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card w-full max-w-lg space-y-4 p-6 text-center sm:p-8">
        {good && <Confetti />}
        <Mascot mood={good ? "cheer" : "happy"} size={110} className="floaty mx-auto" />
        <h2 className="font-display text-3xl font-extrabold">{r.score} điểm</h2>
        <p className="text-ink-soft">
          Đúng {r.correct}/{r.total} tin{r.score > r.best ? " · Kỷ lục mới!" : r.best ? ` · Kỷ lục: ${r.best}` : ""}
        </p>
        <div className="chip mx-auto bg-sun-soft text-ink">+{xp} XP <Ico n="star" /></div>
        {r.missed.length > 0 && (
          <div className="max-h-48 space-y-2 overflow-y-auto text-left">
            <div className="text-sm font-bold text-ink-soft">Xem lại các tin trả lời sai:</div>
            {r.missed.map((v, k) => (
              <div key={k} className="rounded-2xl bg-berry-soft/70 px-3 py-2 text-sm">
                <b>{v.scam ? "🚩 Không ổn" : "👍 An toàn"}:</b> {v.why}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={onReplay}>
            <Ico n="retry" /> Chơi lại
          </button>
          <Link href={exitHref} className="btn btn-ghost">
            Bản đồ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
