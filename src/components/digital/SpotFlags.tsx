"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { FakeScreen } from "@/content/types";
import { FakeScreenView } from "./FakeScreen";
import { flagsOf } from "@/lib/flags";
import { play } from "@/lib/sound";
import { Confetti } from "@/components/Confetti";

/** Soi dấu hiệu: chạm vào những chỗ đáng ngờ trên màn hình giả cho tới khi tìm đủ. */
export function SpotFlags({ screen, label }: { screen: FakeScreen; label?: string }) {
  const flags = useMemo(() => flagsOf(screen), [screen]);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [all, setAll] = useState(false);
  const done = all || found.size === flags.length;
  const order = [...found];
  const tap = (i: number) => {
    if (found.has(i)) return;
    const next = new Set(found).add(i);
    setFound(next);
    play(next.size === flags.length ? "complete" : "correct", 0.6);
  };
  return (
    <div className="grid items-start gap-5 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <FakeScreenView screen={screen} mode={all ? "reveal" : "spot"} found={found} onFlag={tap} />
      <div className="space-y-3">
        <div className="font-display text-xl font-extrabold sm:text-2xl">{label ?? "Chạm vào những chỗ đáng ngờ"}</div>
        <div className="flex items-center gap-2">
          {flags.map((_, i) => (
            <span key={i} className={`grid h-9 w-9 place-items-center rounded-full text-lg transition ${i < found.size || all ? "bg-sun text-white shadow" : "bg-line/70"}`}>
              🚩
            </span>
          ))}
          <span className="ml-1 font-bold text-ink-soft">
            {all ? flags.length : found.size}/{flags.length}
          </span>
        </div>
        <ol className="space-y-2">
          {(all ? flags.map((_, i) => i) : order).map((i) => (
            <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-sun-soft px-3 py-2 text-[15px]">
              <b>“{flags[i].text}”</b>: {flags[i].why}
            </motion.li>
          ))}
        </ol>
        {done ? (
          <div className="relative font-bold text-mint">
            {!all && <Confetti />}
            {all ? "Đây là tất cả dấu hiệu. Lần sau em sẽ tự tìm ra!" : "Giỏi quá, em tìm đủ hết rồi!"}
          </div>
        ) : (
          found.size > 0 && (
            <button className="chip bg-white/80 text-ink-soft" onClick={() => setAll(true)}>
              Xem hết dấu hiệu
            </button>
          )
        )}
      </div>
    </div>
  );
}
