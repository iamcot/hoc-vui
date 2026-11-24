"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PASSAGES, type Passage } from "@/content/subjects/go-phim/passages";
import { useProgress } from "@/lib/store";
import { Scene } from "@/components/Scene";
import { Mascot } from "@/components/Mascot";
import { IconBack, IconClose } from "@/components/Icons";
import { Keyboard } from "@/components/typing/Keyboard";
import { ImeWarning, useTypist, type TypeResult } from "@/components/typing/TypeLine";
import { typingStats, useHotkeys } from "@/components/typing/useKeyInput";
import { Kbd } from "@/components/typing/Kbd";
import { useRouter } from "next/navigation";
import { Confetti } from "@/components/Confetti";

const BEST = "hocvui:gp-passages";
type Best = Record<string, { wpm: number; acc: number }>;
const loadBest = (): Best => {
  try {
    return JSON.parse(localStorage.getItem(BEST) ?? "{}");
  } catch {
    return {};
  }
};

/** Bài gõ hay: chọn một đoạn văn, ca dao, chuyện vui rồi gõ hết, đo WPM và độ chính xác */
export default function PassagesPage() {
  const [pick, setPick] = useState<Passage | null>(null);
  const [best, setBest] = useState<Best>({});
  const [round, setRound] = useState(0);
  const router = useRouter();
  useEffect(() => setBest(loadBest()), [pick]);
  useHotkeys({ Escape: () => router.push("/hoc/go-phim") }, !pick);

  if (pick) return <Typing key={round} p={pick} onExit={() => setPick(null)} onAgain={() => setRound((x) => x + 1)} />;
  return (
    <div className="theme-cyber space-y-6">
      <Scene variant="deep" image="bg-gp-lesson" />
      <div className="flex items-center gap-3">
        <Link href="/hoc/go-phim" className="flex h-12 items-center gap-1 rounded-full bg-white/90 px-3" aria-label="Quay lại">
          <IconBack className="h-6 w-6" />
          <Kbd k="Escape" />
        </Link>
        <Mascot who="bit" mood="happy" size={56} />
        <h1 className="ribbon text-2xl sm:text-3xl">📜 Bài gõ hay</h1>
      </div>
      {(["khong-dau", "co-dau"] as const).map((kind) => (
        <section key={kind} className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-cyan-100">{kind === "khong-dau" ? "Không dấu · cho bạn mới tập" : "Có dấu · gõ Telex (học xong trình độ Telex)"}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PASSAGES.filter((p) => p.kind === kind).map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setPick(p)}
                className="cyber-panel flex items-start gap-3 rounded-3xl p-4 text-left transition hover:scale-[1.02]"
              >
                <span className="text-3xl">{p.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-extrabold">{p.title}</span>
                  <span className="line-clamp-2 text-sm text-cyan-100/70">{p.text}</span>
                  {best[p.id] && (
                    <span className="mt-1 inline-block rounded-full bg-amber-300/90 px-2 py-0.5 text-xs font-bold text-[#1a1033]">
                      Kỷ lục {best[p.id].wpm} WPM · {best[p.id].acc}%
                    </span>
                  )}
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Typing({ p, onExit, onAgain }: { p: Passage; onExit: () => void; onAgain: () => void }) {
  const { addXp } = useProgress();
  const [res, setRes] = useState<TypeResult | null>(null);
  const [, tick] = useState(0);
  const t = useTypist(p.text, (r) => {
    setRes(r);
    const b = loadBest();
    if (!b[p.id] || r.wpm > b[p.id].wpm) {
      b[p.id] = { wpm: r.wpm, acc: r.acc };
      try {
        localStorage.setItem(BEST, JSON.stringify(b));
      } catch {
        /* bỏ qua */
      }
    }
    addXp("go-phim", r.acc >= 90 ? 15 : 5, `bai-hay:${p.id}:${Date.now()}`);
  });
  // đồng hồ WPM chạy trực tiếp
  useEffect(() => {
    const i = setInterval(() => tick((x) => x + 1), 500);
    return () => clearInterval(i);
  }, []);
  const live = typingStats(t.pos, t.errors, t.ms);
  // đang gõ: Esc thoát; xong bài: Space gõ lại, Enter/Esc chọn bài khác
  useHotkeys(res ? { " ": onAgain, Enter: onExit, Escape: onExit } : { Escape: onExit });
  const viet = p.kind === "co-dau";

  return (
    <div className="deep-sea fixed inset-0 flex flex-col overflow-y-auto text-white">
      <div className="light-rays pointer-events-none absolute inset-0" />
      <header className="relative z-10 flex items-center gap-3 px-4 py-3 sm:px-6">
        <button onClick={onExit} className="flex h-11 items-center gap-1 rounded-full bg-white/10 px-3 ring-1 ring-cyan-300/40" aria-label="Thoát">
          <IconClose className="h-5 w-5" />
          <Kbd k="Escape" />
        </button>
        <div className="font-display text-xl font-extrabold">
          {p.emoji} {p.title}
        </div>
        <div className="ml-auto flex gap-2 font-mono font-bold">
          <span className="hud-chip">{live.wpm} WPM</span>
          <span className="hud-chip">{live.acc}%</span>
          <span className="hud-chip">{Math.round((t.pos / t.keys.length) * 100)}%</span>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 pb-6 sm:px-6">
        <div className="cyber-panel rounded-3xl p-6 font-mono text-2xl font-bold leading-relaxed sm:text-3xl">
          <span className="text-cyan-300 [text-shadow:0_0_10px_rgba(47,211,255,0.7)]">{t.rendered}</span>
          <span className="caret" />
          <span className="text-white/80">{p.text.slice(t.rendered.length)}</span>
        </div>
        {viet && !t.done && (
          <p className="text-center font-mono text-sm text-cyan-100/60">
            Phím tiếp: <span className="text-white">{t.keys.slice(t.pos, t.pos + 12)}</span>
          </p>
        )}
        {t.imeOn && <ImeWarning />}
        <Keyboard next={t.done ? undefined : t.next} pressed={t.flash} compact />
      </main>
      {res && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-[#030a24]/70 p-4">
          {res.acc >= 90 && <Confetti />}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="cyber-panel w-full max-w-md space-y-4 rounded-[2rem] p-7 text-center">
            <Mascot who="bit" mood={res.acc >= 90 ? "cheer" : "happy"} size={110} className="mx-auto" />
            <div className="font-display text-5xl font-extrabold">{res.wpm} WPM</div>
            <div className="text-cyan-100/85">
              Chính xác {res.acc}% · {Math.round(res.ms / 1000)} giây
            </div>
            <div className="flex justify-center gap-3">
              <button className="btn btn-ghost" onClick={onAgain}>
                🔁 Gõ lại <Kbd k=" " />
              </button>
              <button className="btn btn-primary" onClick={onExit}>
                Chọn bài khác <Kbd k="Enter" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
