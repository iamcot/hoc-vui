"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { hasFile, resolveFile } from "@/content/assets";
import type { Mood } from "@/content/types";
import type { State } from "@/lib/code/run";
import type { World } from "@/lib/code/world";
import { FlagArt, Floor, frameOf, Hero, StarArt, useSkin, Wall, Water } from "./skin";
import { HoloStage } from "./HoloStage";

/** ảnh ô lưới nếu đã có file, không thì vẽ bằng CSS/SVG */
const tileImg = (id: string) => {
  const f = `/assets/img/${id}.webp`;
  return hasFile(f) ? resolveFile(f) : null;
};

/**
 * Sân chơi: lưới nhìn từ trên xuống, Mochi đi theo trạng thái của trình chạy.
 * Tự co cỡ ô theo khung chứa (tối đa `max` px mỗi ô). Hình vẽ theo giao diện đang chọn;
 * giao diện Hologram dùng sân 3D riêng.
 */
export function Stage(props: { world: World; state: State; bump?: boolean; mood?: Mood; max?: number; speed?: number }) {
  const skin = useSkin();
  if (skin.id === "holo") return <HoloStage {...props} />;
  return <FlatStage {...props} />;
}

function FlatStage({ world, state, bump, mood = "happy", max = 84, speed = 1 }: { world: World; state: State; bump?: boolean; mood?: Mood; max?: number; speed?: number }) {
  const skin = useSkin();
  const fr = frameOf(skin);
  const box = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(48);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      const room = (n: number, len: number) => (len - 2 * fr.pad - 12 - (n - 1) * fr.gap) / n;
      setCell(Math.max(22, Math.floor(Math.min(max, room(world.w, r.width), room(world.h, r.height)))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [world.w, world.h, max, fr.pad, fr.gap]);

  const neon = skin.id === "neon";
  const top = neon ? tileImg("lt-mochi-top") : null;
  const imgs = neon
    ? { wall: tileImg("lt-tile-wall"), water: tileImg("lt-tile-water"), star: tileImg("lt-tile-star"), flag: tileImg("lt-tile-flag"), grass: tileImg("lt-tile-grass") }
    : { wall: null, water: null, star: null, flag: null, grass: null };
  const dur = 0.42 / speed;
  const step = cell + fr.gap;
  const at = (x: number, y: number) => ({ left: fr.pad + x * step, top: fr.pad + y * step, width: cell, height: cell });

  return (
    <div ref={box} className="grid h-full w-full place-items-center">
      <div className="relative" style={{ ...fr.style, width: step * world.w - fr.gap + 2 * fr.pad, height: step * world.h - fr.gap + 2 * fr.pad }}>
        {world.solid.map((row, y) =>
          row.map((solid, x) => {
            const water = world.water[y][x];
            return (
              <div key={`${x}-${y}`} className="absolute" style={at(x, y)}>
                {!solid && (imgs.grass ? <Img src={imgs.grass} /> : <Floor skin={skin} x={x} y={y} />)}
                {solid && water && (imgs.water ? <Img src={imgs.water} /> : <Water skin={skin} />)}
                {solid && !water && (imgs.wall ? <Img src={imgs.wall} /> : <Wall skin={skin} />)}
              </div>
            );
          }),
        )}
        {world.target && <Lines target={world.target} trail={state.trail} step={step} cell={cell} pad={fr.pad} w={world.w} h={world.h} colors={fr} square={skin.id === "pixel"} />}
        {world.goal && (
          <div className="absolute grid place-items-center" style={at(world.goal.x, world.goal.y)}>
            {imgs.flag ? <Img src={imgs.flag} /> : <FlagArt skin={skin} size={cell * 0.78} />}
          </div>
        )}
        {world.stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute grid place-items-center"
            style={at(s.x, s.y)}
            animate={state.got.includes(i) ? { scale: [1, 1.5, 0], opacity: [1, 1, 0], y: -cell * 0.4 } : { scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {imgs.star ? <Img src={imgs.star} /> : <StarArt skin={skin} size={cell * 0.7} />}
          </motion.div>
        ))}
        <motion.div
          className="absolute grid place-items-center"
          style={{ width: cell, height: cell, left: fr.pad, top: fr.pad }}
          initial={false}
          animate={{ x: state.x * step, y: state.y * step }}
          transition={{ duration: dur, ease: skin.id === "pixel" ? "linear" : "easeInOut" }}
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
                {neon && <div className="absolute inset-[8%] rounded-full" style={{ background: "radial-gradient(circle, rgb(47 211 255 / 0.45), transparent 70%)" }} />}
                <Hero skin={skin} mood={mood} size={Math.round(cell * (world.target ? 0.62 : skin.id === "neon" ? 0.92 : 0.8))} />
                {/* mũi tên hướng nhìn: quay theo Mochi */}
                <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={{ rotate: state.dir * 90 }} transition={{ duration: dur }}>
                  <svg viewBox="0 0 40 40" className="absolute left-1/2 -translate-x-1/2" style={{ width: cell * 0.42, top: -cell * 0.2 }}>
                    {skin.id === "pixel" ? (
                      <path d="M16 6 h8 v6 h6 v6 h6 v6 h-32 v-6 h6 v-6 h6z" fill={fr.arrow} stroke="#000" strokeWidth="3" />
                    ) : (
                      <path
                        d="M20 4 L34 26 L20 20 L6 26 Z"
                        fill={fr.arrow}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        style={neon ? { filter: `drop-shadow(0 0 5px ${fr.arrow})` } : undefined}
                      />
                    )}
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

/** màn bút vẽ: hình mẫu là nét đứt mờ, nét Mochi vẽ là nét liền (sai thì màu đỏ hồng) */
export function Lines({
  target,
  trail,
  step,
  cell,
  pad,
  w,
  h,
  colors,
  square,
}: {
  target: Set<string>;
  trail: string[];
  step: number;
  cell: number;
  pad: number;
  w: number;
  h: number;
  colors: { target: string; ok: string; bad: string };
  square?: boolean;
}) {
  const c = (n: number) => n * step + cell / 2;
  const seg = (k: string) => {
    const [a, b] = k.split("-").map((p) => p.split(",").map(Number));
    return { x1: c(a[0]), y1: c(a[1]), x2: c(b[0]), y2: c(b[1]) };
  };
  const cap = square ? "square" : "round";
  const drawn = [...new Set(trail)];
  return (
    <svg className="pointer-events-none absolute" style={{ left: pad, top: pad }} width={w * step} height={h * step}>
      {[...target].map((k) => (
        <line key={`t${k}`} {...seg(k)} stroke={colors.target} strokeOpacity={0.4} strokeWidth={Math.max(4, cell * 0.1)} strokeDasharray={`${cell * 0.12} ${cell * 0.1}`} strokeLinecap={cap} />
      ))}
      {drawn.map((k) => (
        <line
          key={`d${k}`}
          {...seg(k)}
          stroke={target.has(k) ? colors.ok : colors.bad}
          strokeWidth={Math.max(5, cell * 0.13)}
          strokeLinecap={cap}
          style={{ filter: `drop-shadow(0 0 6px ${target.has(k) ? colors.ok : colors.bad})` }}
        />
      ))}
    </svg>
  );
}
