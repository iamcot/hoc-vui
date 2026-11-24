"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Mood } from "@/content/types";
import type { ListState, ListWorld } from "@/lib/code/list";
import { GOAL_TEXT } from "@/lib/code/list";
import { Hero, useGuide, useSkin } from "./skin";

/**
 * Sân kho hàng: một hàng hộp, mỗi hộp là một cột cao theo số của nó (nhìn là thấy lớn nhỏ),
 * robot đứng trên hộp đang xét. Đổi chỗ thì hai hộp trượt qua nhau. Hộp đang nhớ có dấu 🧠.
 */
export function ListStage({ world, state, bump, mood = "happy", speed = 1 }: { world: ListWorld; state: ListState; bump?: boolean; mood?: Mood; speed?: number }) {
  const skin = useSkin();
  const guide = useGuide();
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 480, h: 300 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = state.crates.length;
  const gap = Math.max(4, Math.min(10, size.w / n / 8));
  const cw = Math.max(26, Math.min(72, (size.w - 28 - gap * (n - 1)) / n));
  const step = cw + gap;
  const left0 = (size.w - (step * n - gap)) / 2;
  const top = 70;
  const hero = Math.round(Math.min(cw * 0.95, 56));
  const base = size.h - 26;
  const maxV = Math.max(...world.arr, 1);
  const barMax = Math.max(40, base - top - hero - 22);
  const barH = (v: number) => Math.round(18 + (Math.max(0, v) / maxV) * (barMax - 18));
  const dur = 0.36 / speed;
  const done = state.crates.every((c, k) => k === 0 || state.crates[k - 1].v <= c.v);
  const heroTop = Math.max(top, base - barH(state.crates[state.i].v) - hero - 6);

  return (
    <div ref={box} className={`lt-store relative h-full w-full overflow-hidden ${world.goal === "sort" && done ? "lt-store-done" : ""}`}>
      <div className="pointer-events-none absolute left-2 top-10 z-10 flex flex-wrap items-center gap-1.5 pr-2">
        <span className="lt-var rounded-full px-2.5 py-1 text-xs font-extrabold">🎯 {GOAL_TEXT[world.goal]}</span>
        {world.find !== undefined && <span className="lt-var rounded-full px-2.5 py-1 text-xs font-extrabold">🔎 Số cần tìm: {world.find}</span>}
        {state.mem !== null && <span className="lt-var rounded-full px-2.5 py-1 text-xs font-extrabold">🧠 Đang nhớ: {state.crates[state.mem].v}</span>}
      </div>
      {/* sàn kho */}
      <div className="lt-store-floor absolute" style={{ left: left0 - 10, width: step * n - gap + 20, top: base, height: 6 }} />
      {state.crates.map((c, k) => {
        const h = barH(c.v);
        const here = k === state.i;
        const mem = k === state.mem;
        return (
          <motion.div
            key={c.id}
            className={`lt-crate absolute grid place-items-start justify-center ${here ? "lt-crate-here" : ""} ${mem ? "lt-crate-mem" : ""} ${world.find !== undefined && c.v === world.find && here ? "lt-crate-hit" : ""}`}
            initial={false}
            animate={{ left: left0 + k * step, top: base - h, height: h }}
            transition={{ duration: dur, ease: "easeInOut" }}
            style={{ width: cw }}
          >
            <span className="lt-crate-num mt-1 font-extrabold" style={{ fontSize: Math.max(13, Math.min(22, cw * 0.38)) }}>
              {c.v}
            </span>
            {mem && <span className="absolute -top-3 right-[-6px] text-base">🧠</span>}
          </motion.div>
        );
      })}
      {/* số vị trí dưới sàn (đếm từ 0 như trong Python) */}
      {state.crates.map((_, k) => (
        <span key={k} className={`lt-crate-idx absolute text-center text-[11px] font-bold ${world.at === k ? "lt-crate-at" : ""}`} style={{ left: left0 + k * step, width: cw, top: base + 8 }}>
          {world.at === k ? `🚩${k}` : k}
        </span>
      ))}
      <motion.div
        className="pointer-events-none absolute grid place-items-center"
        style={{ width: cw, height: hero }}
        initial={false}
        animate={{ left: left0 + state.i * step, top: heroTop }}
        transition={{ duration: dur, ease: "easeInOut" }}
      >
        <motion.div key={bump ? "bump" : "ok"} animate={bump ? { x: [0, 8, -6, 4, 0], rotate: [0, 8, -8, 0] } : {}} transition={{ duration: 0.45 }}>
          <Hero skin={skin} guide={guide} mood={mood} size={hero} />
        </motion.div>
      </motion.div>
    </div>
  );
}
