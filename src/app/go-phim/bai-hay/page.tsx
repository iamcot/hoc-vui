"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LENGTH_NAME, PASSAGES, PASSAGE_KINDS, RECORD_MIN_ACC, RECORD_MIN_CHARS, lengthOf, type Passage, type PassageKind } from "@/content/subjects/go-phim/passages";
import { submitRecord } from "@/lib/arena";
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
import { Ico } from "@/components/Ico";

const BEST = "hocvui:gp-passages";
type Best = Record<string, { wpm: number; acc: number }>;
const loadBest = (): Best => {
  try {
    return JSON.parse(localStorage.getItem(BEST) ?? "{}");
  } catch {
    return {};
  }
};

const KIND_KEY = "hocvui:gp-passage-kind";

/** Bài gõ hay: lọc theo loại (có dấu, không dấu, tiếng Anh), chọn một đoạn rồi gõ hết, đo WPM và độ chính xác */
export default function PassagesPage() {
  const [pick, setPick] = useState<Passage | null>(null);
  const [best, setBest] = useState<Best>({});
  const [round, setRound] = useState(0);
  const [kind, setKind] = useState<PassageKind>("co-dau");
  const router = useRouter();
  useEffect(() => setBest(loadBest()), [pick]);
  useEffect(() => {
    try {
      const k = localStorage.getItem(KIND_KEY);
      if (k && PASSAGE_KINDS.some((x) => x.id === k)) setKind(k as PassageKind);
    } catch {
      /* bỏ qua */
    }
  }, []);
  function choose(k: PassageKind) {
    setKind(k);
    try {
      localStorage.setItem(KIND_KEY, k);
    } catch {
      /* bỏ qua */
    }
  }
  useHotkeys({ Escape: () => router.push("/hoc/go-phim") }, !pick);

  if (pick) return <Typing key={round} p={pick} onExit={() => setPick(null)} onAgain={() => setRound((x) => x + 1)} />;
  const info = PASSAGE_KINDS.find((k) => k.id === kind)!;
  // ngắn trước, dài sau
  const list = PASSAGES.filter((p) => p.kind === kind).sort((a, b) => a.text.length - b.text.length);
  return (
    <div className="theme-cyber space-y-6">
      <Scene variant="deep" image="bg-gp-lesson" />
      <div className="flex items-center gap-3">
        <Link href="/hoc/go-phim" className="flex h-12 items-center gap-1 rounded-full bg-white/90 px-3" aria-label="Quay lại">
          <IconBack className="h-6 w-6" />
          <Kbd k="Escape" />
        </Link>
        <Mascot who="bit" mood="happy" size={56} />
        <h1 className="ribbon text-2xl sm:text-3xl"><Ico n="scroll" /> Bài gõ hay</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Loại đoạn văn">
        {PASSAGE_KINDS.map((k) => (
          <button
            key={k.id}
            role="tab"
            aria-selected={k.id === kind}
            onClick={() => choose(k.id)}
            className={`rounded-full px-4 py-2 font-display text-base font-extrabold ring-1 transition sm:text-lg ${k.id === kind ? "bg-cyan-400 text-[#06102e] ring-cyan-300" : "bg-white/10 text-cyan-50 ring-cyan-300/30 hover:bg-white/15"}`}
          >
            {k.name}
          </button>
        ))}
      </div>
      <p className="text-sm font-semibold text-cyan-100/80">
        {info.hint}. Đoạn từ {RECORD_MIN_CHARS} ký tự, chính xác từ {RECORD_MIN_ACC}% được tính vào <Link href="/xep-hang/wpm" className="font-bold text-cyan-300 underline">bảng xếp hạng WPM</Link>.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => setPick(p)}
            className="cyber-panel flex items-start gap-3 rounded-3xl p-4 text-left transition hover:scale-[1.02]"
          >
            <span className="text-3xl">{p.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-extrabold leading-tight">{p.title}</span>
              <span className="line-clamp-2 text-sm text-cyan-100/70">{p.text}</span>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-cyan-100/90 ring-1 ring-cyan-300/30">
                  {LENGTH_NAME[lengthOf(p)]} · {p.text.length} ký tự
                </span>
                {best[p.id] && (
                  <span className="rounded-full bg-amber-300/90 px-2 py-0.5 text-xs font-bold text-[#1a1033]">
                    Kỷ lục {best[p.id].wpm} WPM · {best[p.id].acc}%
                  </span>
                )}
              </span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Typing({ p, onExit, onAgain }: { p: Passage; onExit: () => void; onAgain: () => void }) {
  const { addXp } = useProgress();
  const [res, setRes] = useState<TypeResult | null>(null);
  const [, tick] = useState(0);
  // đoạn ngắn quá thì WPM không đáng tin, không tính kỷ lục
  const counts = p.text.length >= RECORD_MIN_CHARS;
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
    if (counts && r.acc >= RECORD_MIN_ACC) void submitRecord("wpm", r.wpm);
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
        <div className={`cyber-panel rounded-3xl p-6 font-mono font-bold leading-relaxed ${p.text.length > 300 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
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
            <div className="text-sm text-cyan-100/70">
              {!counts
                ? `Đoạn ngắn dưới ${RECORD_MIN_CHARS} ký tự nên chưa tính bảng xếp hạng WPM.`
                : res.acc >= RECORD_MIN_ACC
                  ? "Đã gửi lên bảng xếp hạng WPM (khi đã đăng nhập)."
                  : `Chính xác từ ${RECORD_MIN_ACC}% mới tính bảng xếp hạng WPM.`}
            </div>
            <div className="flex justify-center gap-3">
              <button className="btn btn-ghost" onClick={onAgain}>
                <Ico n="retry" /> Gõ lại <Kbd k=" " />
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
