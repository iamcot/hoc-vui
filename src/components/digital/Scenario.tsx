"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Block } from "@/content/types";
import { FakeScreenView } from "./FakeScreen";
import { Mascot } from "@/components/Mascot";
import { RichText } from "@/components/RichText";
import { play } from "@/lib/sound";

type Props = Extract<Block, { type: "scenario" }>;

/** Tình huống: màn hình giả bên trái, "Em sẽ làm gì?" bên phải. Chọn xong thấy chuyện gì xảy ra, thử lựa chọn khác cũng được. */
export function Scenario({ screen, ask, options, intro }: Props) {
  const [pick, setPick] = useState<number | null>(null);
  const [tried, setTried] = useState<Set<number>>(new Set());
  const o = pick === null ? null : options[pick];
  const choose = (i: number) => {
    setPick(i);
    setTried((t) => new Set(t).add(i));
    play(options[i].good ? "correct" : "wrong", 0.6);
  };
  return (
    <div className="grid items-start gap-5 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <FakeScreenView screen={screen} mode={o ? "reveal" : "plain"} />
      <div className="space-y-3">
        {intro && <RichText text={intro} className="text-base text-ink-soft sm:text-lg" />}
        <div className="font-display text-xl font-extrabold sm:text-2xl">{ask}</div>
        <div className="grid gap-2.5">
          {options.map((x, i) => (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-base font-bold transition active:scale-[0.98] sm:text-lg ${
                pick === i ? (x.good ? "border-mint bg-mint-soft" : "border-berry bg-berry-soft") : tried.has(i) ? (x.good ? "border-mint/50 bg-white/80" : "border-berry/40 bg-white/80") : "border-line bg-white/90 hover:border-sky"
              }`}
            >
              {tried.has(i) && <span className="mr-1">{x.good ? "✅" : "❌"}</span>}
              {x.text}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {o && (
            <motion.div key={pick} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex items-start gap-3 rounded-3xl p-4 ${o.good ? "bg-mint-soft" : "bg-berry-soft"}`}>
              <Mascot mood={o.good ? "cheer" : "oops"} size={56} className="shrink-0" />
              <div className="space-y-1">
                <div className="font-display text-lg font-extrabold">{o.good ? "Chuẩn luôn!" : "Ôi, chuyện gì đã xảy ra…"}</div>
                <RichText text={o.then} className="text-[15px]" />
                {!o.good && <div className="text-sm font-bold text-ink-soft">Thử chọn cách khác xem nhé.</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
