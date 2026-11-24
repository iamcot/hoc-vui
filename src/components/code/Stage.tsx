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
        className="relative rounded-[1.4rem] p-2"
        style={{
          background: "linear-gradient(160deg,#0d1d5c,#060d2e)",
          boxShadow: "0 0 0 1.5px rgb(47 211 255 / 0.55), 0 0 36px -6px rgb(47 211 255 / 0.6), inset 0 0 24px rgb(47 211 255 / 0.12)",
          width: cell * world.w + 16,
          height: cell * world.h + 16,
        }}
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
                    <div
                      className="h-full w-full"
                      style={{
                        background: light ? "#0c1a55" : "#0a1647",
                        boxShadow: "inset 0 0 0 0.5px rgb(47 211 255 / 0.22)",
                        backgroundImage: "radial-gradient(circle at 50% 50%, rgb(47 211 255 / 0.28) 0 1.5px, transparent 2px)",
                      }}
                    />
                  ))}
                {solid && water && (imgs.water ? <Img src={imgs.water} /> : <div className="h-full w-full" style={{ background: "linear-gradient(160deg,#003a66,#001a3d)", boxShadow: "inset 0 0 12px rgb(47 211 255 / 0.6)" }} />)}
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
                <div className="absolute inset-[8%] rounded-full" style={{ background: "radial-gradient(circle, rgb(47 211 255 / 0.45), transparent 70%)" }} />
                <Mascot mood={mood} size={Math.round(cell * (world.target ? 0.62 : 0.92))} />
                {/* mũi tên hướng nhìn: quay theo Mochi */}
                <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={{ rotate: state.dir * 90 }} transition={{ duration: dur }}>
                  <svg viewBox="0 0 40 40" className="absolute left-1/2 -translate-x-1/2" style={{ width: cell * 0.42, top: -cell * 0.2 }}>
                    <path d="M20 4 L34 26 L20 20 L6 26 Z" fill="#2fd3ff" stroke="#e6fbff" strokeWidth="2.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 5px #2fd3ff)" }} />
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

/** khối tường: ô kim loại tối, viền tím neon */
function Rock() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <defs>
        <linearGradient id="lt-rock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2a8f" />
          <stop offset="1" stopColor="#1a1250" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="34" height="34" rx="7" fill="url(#lt-rock)" stroke="#9b7bff" strokeWidth="1.6" style={{ filter: "drop-shadow(0 0 3px #7c4dff)" }} />
      <path d="M9 14 h10 v6 h8" stroke="#c9b5ff" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <circle cx="27" cy="20" r="1.8" fill="#ff4fa3" />
      <circle cx="12" cy="28" r="1.4" fill="#2fd3ff" />
    </svg>
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} >
      <path d="M20 3 l5 10.5 11.5 1.6 -8.3 8 2 11.4 -10.2 -5.4 -10.2 5.4 2 -11.4 -8.3 -8 11.5 -1.6z" fill="#ffd23f" stroke="#fff3b0" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px #ffb020)" }} />
    </svg>
  );
}

function Flag({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <ellipse cx="14" cy="36" rx="10" ry="3" fill="#ff4fa3" opacity="0.35" />
      <rect x="11" y="4" width="3" height="32" rx="1.5" fill="#cfe9ff" />
      <path d="M14 5 h18 l-5 7 l5 7 h-18 z" fill="#ff4fa3" stroke="#ffc2df" strokeWidth="1.2" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px #ff4fa3)" }} />
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
        <line key={`t${k}`} {...seg(k)} stroke="#9fe9ff" strokeOpacity={0.35} strokeWidth={Math.max(4, cell * 0.1)} strokeDasharray={`${cell * 0.12} ${cell * 0.1}`} strokeLinecap="round" />
      ))}
      {drawn.map((k) => (
        <line key={`d${k}`} {...seg(k)} stroke={target.has(k) ? "#2fd3ff" : "#ff4fa3"} strokeWidth={Math.max(5, cell * 0.13)} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${target.has(k) ? "#2fd3ff" : "#ff4fa3"})` }} />
      ))}
    </svg>
  );
}
