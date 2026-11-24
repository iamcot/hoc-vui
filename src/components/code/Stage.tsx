"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mascot } from "@/components/Mascot";
import { hasFile, resolveFile } from "@/content/assets";
import type { Mood } from "@/content/types";
import type { State } from "@/lib/code/run";
import type { World } from "@/lib/code/world";

/** ảnh ô lưới nếu đã có file, không thì vẽ bằng CSS/SVG */
const tileImg = (id: string) => {
  const f = `/assets/img/${id}.webp`;
  return hasFile(f) ? resolveFile(f) : null;
};

/**
 * Sân chơi: lưới nhìn từ trên xuống, Mochi đi theo trạng thái của trình chạy.
 * Tự co cỡ ô theo khung chứa (tối đa `max` px mỗi ô).
 */
export function Stage({ world, state, bump, mood = "happy", max = 84, speed = 1 }: { world: World; state: State; bump?: boolean; mood?: Mood; max?: number; speed?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(48);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setCell(Math.max(24, Math.floor(Math.min(max, (r.width - 16) / world.w, (r.height - 16) / world.h))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [world.w, world.h, max]);

  const top = tileImg("lt-mochi-top");
  const imgs = { wall: tileImg("lt-tile-wall"), water: tileImg("lt-tile-water"), star: tileImg("lt-tile-star"), flag: tileImg("lt-tile-flag"), grass: tileImg("lt-tile-grass") };
  const dur = 0.42 / speed;

  return (
    <div ref={box} className="grid h-full w-full place-items-center">
      <div
        className="relative rounded-[1.4rem] p-2 shadow-[0_10px_30px_-12px_rgba(37,40,69,0.45)]"
        style={{ background: "linear-gradient(160deg,#7fd4a6,#4fb987)", width: cell * world.w + 16, height: cell * world.h + 16 }}
      >
        {world.solid.map((row, y) =>
          row.map((solid, x) => {
            const water = world.water[y][x];
            const light = (x + y) % 2 === 0;
            return (
              <div key={`${x}-${y}`} className="absolute" style={{ left: 8 + x * cell, top: 8 + y * cell, width: cell, height: cell }}>
                {!solid &&
                  (imgs.grass ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgs.grass} alt="" className="h-full w-full" draggable={false} />
                  ) : (
                    <div className="h-full w-full" style={{ background: light ? "#bdf0cf" : "#a8e7bf" }} />
                  ))}
                {solid && water && (imgs.water ? <Img src={imgs.water} /> : <div className="h-full w-full" style={{ background: "linear-gradient(160deg,#7cc4ff,#4f9cff)" }} />)}
                {solid && !water && (imgs.wall ? <Img src={imgs.wall} /> : <Rock />)}
              </div>
            );
          }),
        )}
        {world.target && <Lines target={world.target} trail={state.trail} cell={cell} w={world.w} h={world.h} />}
        {world.goal && (
          <div className="absolute grid place-items-center" style={{ left: 8 + world.goal.x * cell, top: 8 + world.goal.y * cell, width: cell, height: cell }}>
            {imgs.flag ? <Img src={imgs.flag} /> : <Flag size={cell * 0.78} />}
          </div>
        )}
        {world.stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute grid place-items-center"
            style={{ left: 8 + s.x * cell, top: 8 + s.y * cell, width: cell, height: cell }}
            animate={state.got.includes(i) ? { scale: [1, 1.5, 0], opacity: [1, 1, 0], y: -cell * 0.4 } : { scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {imgs.star ? <Img src={imgs.star} /> : <Star size={cell * 0.7} />}
          </motion.div>
        ))}
        <motion.div
          className="absolute grid place-items-center"
          style={{ width: cell, height: cell, left: 8, top: 8 }}
          initial={false}
          animate={{ x: state.x * cell, y: state.y * cell }}
          transition={{ duration: dur, ease: "easeInOut" }}
        >
          <motion.div
            key={bump ? "bump" : "ok"}
            className="relative grid h-full w-full place-items-center"
            animate={bump ? { x: [0, [0, 1, 0, -1][state.dir] * cell * 0.22, 0], y: [0, [-1, 0, 1, 0][state.dir] * cell * 0.22, 0], rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.45 }}
          >
            {top ? (
              <motion.img src={top} alt="Mochi" className="h-[92%] w-[92%]" initial={false} animate={{ rotate: state.dir * 90 }} transition={{ duration: dur }} draggable={false} />
            ) : (
              <>
                <Mascot mood={mood} size={Math.round(cell * (world.target ? 0.62 : 0.92))} />
                {/* mũi tên hướng nhìn: quay theo Mochi */}
                <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={{ rotate: state.dir * 90 }} transition={{ duration: dur }}>
                  <svg viewBox="0 0 40 40" className="absolute left-1/2 -translate-x-1/2" style={{ width: cell * 0.42, top: -cell * 0.2 }}>
                    <path d="M20 4 L34 26 L20 20 L6 26 Z" fill="#ff8a5c" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Img({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="h-full w-full object-contain" draggable={false} />;
}

function Rock() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <rect x="2" y="3" width="36" height="35" rx="9" fill="#8a8fae" />
      <rect x="2" y="2" width="36" height="31" rx="9" fill="#b3b8d3" />
      <path d="M10 12 q6 -4 12 0" stroke="#d9dcec" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="22" r="3" fill="#9a9fbe" />
    </svg>
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className="drop-shadow-[0_2px_3px_rgba(150,90,0,0.4)]">
      <path d="M20 3 l5 10.5 11.5 1.6 -8.3 8 2 11.4 -10.2 -5.4 -10.2 5.4 2 -11.4 -8.3 -8 11.5 -1.6z" fill="#ffcf3f" stroke="#e39b00" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Flag({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <ellipse cx="14" cy="36" rx="9" ry="2.5" fill="#2d3047" opacity="0.18" />
      <rect x="11" y="4" width="3.5" height="32" rx="1.5" fill="#6b4b2a" />
      <path d="M14.5 5 h18 l-5 7 l5 7 h-18 z" fill="#ff4f7b" stroke="#c2264f" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** màn bút vẽ: hình mẫu là nét đứt mờ, nét Mochi vẽ là nét liền màu cam */
function Lines({ target, trail, cell, w, h }: { target: Set<string>; trail: string[]; cell: number; w: number; h: number }) {
  const seg = (k: string) => {
    const [a, b] = k.split("-").map((p) => p.split(",").map(Number));
    return { x1: (a[0] + 0.5) * cell, y1: (a[1] + 0.5) * cell, x2: (b[0] + 0.5) * cell, y2: (b[1] + 0.5) * cell };
  };
  const drawn = [...new Set(trail)];
  return (
    <svg className="pointer-events-none absolute" style={{ left: 8, top: 8 }} width={w * cell} height={h * cell}>
      {[...target].map((k) => (
        <line key={`t${k}`} {...seg(k)} stroke="#252845" strokeOpacity={0.28} strokeWidth={Math.max(4, cell * 0.1)} strokeDasharray={`${cell * 0.12} ${cell * 0.1}`} strokeLinecap="round" />
      ))}
      {drawn.map((k) => (
        <line key={`d${k}`} {...seg(k)} stroke={target.has(k) ? "#ff8a5c" : "#ff4f7b"} strokeWidth={Math.max(5, cell * 0.13)} strokeLinecap="round" />
      ))}
    </svg>
  );
}
