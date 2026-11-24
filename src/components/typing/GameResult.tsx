"use client";
import { motion } from "motion/react";
import { IconStar } from "@/components/Icons";
import { Confetti } from "@/components/Confetti";
import { Mascot } from "@/components/Mascot";
import type { GameResult } from "./SharkGame";
import { Ico } from "@/components/Ico";

/** Bảng kết quả sau một lượt lặn (tông neon) */
export function GameResultPanel({ r, stars, xp, best, children }: { r: GameResult; stars?: number; xp: number; best?: number; children: React.ReactNode }) {
  const good = stars === undefined ? r.score >= (best ?? 0) && r.score > 0 : stars >= 2;
  return (
    <div className="deep-sea fixed inset-0 z-40 grid place-items-center overflow-y-auto p-4 text-white">
      <div className="light-rays pointer-events-none absolute inset-0" />
      {good && <Confetti />}
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="cyber-panel relative w-full max-w-lg space-y-5 rounded-[2rem] p-7 text-center">
        <Mascot who="bit" mood={good ? "cheer" : "oops"} size={120} className="floaty mx-auto -mt-20" />
        {stars !== undefined ? (
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 * s, type: "spring" }}>
                <IconStar filled={stars >= s} className={`h-14 w-14 ${stars >= s ? "text-amber-300 drop-shadow-[0_0_10px_rgba(255,200,60,0.8)]" : "text-white/20"}`} />
              </motion.span>
            ))}
          </div>
        ) : (
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Điểm</div>
            <div className="font-display text-6xl font-extrabold">{r.score}</div>
            {best !== undefined && <div className="text-sm font-bold text-cyan-100/80">{r.score >= best && r.score > 0 ? <>Kỷ lục mới! <Ico n="trophy" /></> : `Kỷ lục: ${best}`}</div>}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          <Big label="Cá bị hạ" value={`${r.kills}${stars !== undefined ? `/${r.total}` : ""}`} />
          <Big label="WPM" value={r.wpm} />
          <Big label="Chính xác" value={`${r.acc}%`} />
        </div>
        <div className="mx-auto w-fit rounded-full bg-amber-300 px-4 py-1 font-bold text-[#1a1033]">+{xp} XP</div>
        <div className="flex flex-wrap justify-center gap-3">{children}</div>
      </motion.div>
    </div>
  );
}

function Big({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-cyan-300/25">
      <div className="font-display text-3xl font-extrabold">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider text-cyan-200/80">{label}</div>
    </div>
  );
}
