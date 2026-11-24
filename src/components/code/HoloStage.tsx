"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Mood } from "@/content/types";
import type { State } from "@/lib/code/run";
import type { World } from "@/lib/code/world";
import { SKINS } from "@/lib/code/skins";
import { FlagArt, HoloCat, StarArt } from "./skin";
import { Lines } from "./Stage";

/** góc nhìn sân 3D */
const RX = 57;
const RZ = -38;
const COS = Math.cos((-RZ * Math.PI) / 180);
const SIN = Math.sin((-RZ * Math.PI) / 180);
const FLAT = Math.cos((RX * Math.PI) / 180);

/** đặt hình đứng thẳng quay về phía người xem trên mặt sân nghiêng */
const UPRIGHT = `rotateZ(${-RZ}deg) rotateX(${-RX}deg)`;

/**
 * Sân giao diện Hologram: mặt sàn kính nghiêng 3D có phản chiếu, tường là khối kính,
 * Mochi là hình chiếu hologram. Thêm HUD: tọa độ, hướng, tinh thể và radar mini.
 */
export function HoloStage({ world, state, bump, mood = "happy", max = 84, speed = 1 }: { world: World; state: State; bump?: boolean; mood?: Mood; max?: number; speed?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(44);
  /** khung nhỏ (ảnh xem trước trong popup) thì bỏ HUD */
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setSmall(r.width < 320);
      const byW = (r.width * 0.9) / (world.w * COS + world.h * SIN);
      const byH = (r.height * 0.78) / ((world.w * SIN + world.h * COS) * FLAT + 1.4);
      setCell(Math.max(20, Math.floor(Math.min(max * 0.8, byW, byH))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [world.w, world.h, max]);

  // ô đã đi qua thì sáng lên (về chỗ cũ là xóa)
  const seen = useRef(new Set<string>());
  const fresh = state.x === world.start.x && state.y === world.start.y && state.dir === world.dir && state.trail.length === 0 && state.got.length <= 1;
  if (fresh) seen.current = new Set();
  seen.current.add(`${state.x},${state.y}`);

  const dur = 0.42 / speed;
  const s = cell;
  const wallH = s * 0.58;
  const at = (x: number, y: number) => ({ left: x * s, top: y * s, width: s, height: s });
  const arrow = ["↑", "→", "↓", "←"][state.dir];

  return (
    <div ref={box} className="lt-holo-stage relative h-full w-full overflow-hidden">
      {!small && (
        <div className="pointer-events-none absolute left-3 top-2 z-10 flex flex-col gap-0.5">
          <span className="lt-hud-k">TỌA ĐỘ</span>
          <span className="lt-hud-v">
            X:{String(state.x).padStart(2, "0")} Y:
            {String(state.y).padStart(2, "0")}
          </span>
          <span className="lt-hud-k mt-1">HƯỚNG</span>
          <span className="lt-hud-v">
            {arrow} {["LÊN", "PHẢI", "XUỐNG", "TRÁI"][state.dir]}
          </span>
          {world.stars.length > 0 && (
            <>
              <span className="lt-hud-k mt-1">TINH THỂ</span>
              <span className="lt-hud-v text-[#ffd79b]!">
                {state.got.length} / {world.stars.length}
              </span>
            </>
          )}
        </div>
      )}
      {!small && <Radar world={world} state={state} />}

      <div className="absolute inset-0 grid place-items-center" style={{ perspective: 1100 }}>
        <div style={{ WebkitBoxReflect: `below ${-Math.round(world.h * s * 0.62)}px linear-gradient(transparent 55%, rgb(255 255 255 / 0.28))` } as React.CSSProperties}>
          <div className="relative" style={{ width: world.w * s, height: world.h * s, transformStyle: "preserve-3d", transform: `rotateX(${RX}deg) rotateZ(${RZ}deg)`, marginTop: -s * 0.6 }}>
            <div className="lt-holo-floor absolute -inset-2 rounded-[10px]" />
            {world.solid.map((row, y) =>
              row.map((solid, x) => {
                const water = world.water[y][x];
                const lit = !solid && seen.current.has(`${x},${y}`);
                return (
                  <div key={`${x}-${y}`} className={`lt-holo-cell absolute ${lit ? "lt-lit" : ""} ${water && solid ? "lt-holo-water" : ""}`} style={{ ...at(x, y), transformStyle: "preserve-3d" }}>
                    {solid && !water && (
                      <div className="lt-cube absolute inset-[3px]" style={{ transformStyle: "preserve-3d", ["--h" as string]: `${wallH}px` }}>
                        <i className="n" />
                        <i className="w" />
                        <i className="s" />
                        <i className="e" />
                        <i className="t" />
                      </div>
                    )}
                  </div>
                );
              }),
            )}
            {world.target && <Lines target={world.target} trail={state.trail} step={s} cell={s} pad={0} w={world.w} h={world.h} colors={{ target: "#9ff7ff", ok: "#4ff0ff", bad: "#ff5fa8" }} />}
            {world.goal && (
              <Upright x={world.goal.x} y={world.goal.y} s={s}>
                <FlagArt skin={SKINS.holo} size={s * 1.15} />
              </Upright>
            )}
            {world.stars.map((p, i) => (
              <Upright key={i} x={p.x} y={p.y} s={s}>
                <motion.div
                  animate={state.got.includes(i) ? { scale: [1, 1.5, 0], opacity: [1, 1, 0], y: -s * 0.5 } : { y: [0, -s * 0.08, 0] }}
                  transition={state.got.includes(i) ? { duration: 0.5 } : { duration: 2, repeat: Infinity }}
                >
                  <StarArt skin={SKINS.holo} size={s * 0.8} />
                </motion.div>
              </Upright>
            ))}
            <motion.div
              className="absolute left-0 top-0"
              style={{ width: s, height: s, transformStyle: "preserve-3d" }}
              initial={false}
              animate={{ x: state.x * s, y: state.y * s }}
              transition={{ duration: dur, ease: "easeInOut" }}
            >
              <div className="absolute left-1/2 top-1/2" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute bottom-0 left-0 grid -translate-x-1/2 justify-items-center" style={{ transform: UPRIGHT, transformOrigin: "50% 100%" }}>
                  <motion.div key={bump ? "bump" : "ok"} animate={bump ? { x: [0, 6, -6, 4, 0], rotate: [0, -8, 8, 0] } : {}} transition={{ duration: 0.45 }} className="relative">
                    <HoloCat size={s * 1.05} mood={mood} beam />
                  </motion.div>
                </div>
              </div>
              {/* vòng chỉ hướng trên mặt sàn */}
              <motion.svg className="pointer-events-none absolute inset-0" viewBox="0 0 40 40" initial={false} animate={{ rotate: state.dir * 90 }} transition={{ duration: dur }}>
                <circle cx="20" cy="20" r="15" fill="none" stroke="#4ff0ff" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M20 1.5 L25 8 L15 8 Z" fill="#ffb547" style={{ filter: "drop-shadow(0 0 3px #ffb547)" }} />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Upright({ x, y, s, children }: { x: number; y: number; s: number; children: React.ReactNode }) {
  return (
    <div className="absolute" style={{ left: (x + 0.5) * s, top: (y + 0.5) * s, width: 0, height: 0, transformStyle: "preserve-3d" }}>
      <div className="absolute bottom-0 left-0 grid -translate-x-1/2 justify-items-center" style={{ transform: UPRIGHT, transformOrigin: "50% 100%" }}>
        {children}
      </div>
    </div>
  );
}

/** radar mini: chấm Mochi, tinh thể, cổng */
function Radar({ world, state }: { world: World; state: State }) {
  const R = 34;
  const n = Math.max(world.w, world.h);
  const pos = (x: number, y: number) => ({ left: R + ((x + 0.5 - world.w / 2) / n) * R * 1.6 - 2.5, top: R + ((y + 0.5 - world.h / 2) / n) * R * 1.6 - 2.5 });
  return (
    <div className="lt-radar pointer-events-none absolute bottom-3 right-3 z-10" style={{ width: R * 2, height: R * 2 }}>
      {world.stars.map((p, i) => !state.got.includes(i) && <span key={i} className="lt-blip text-[#ffb547]" style={pos(p.x, p.y)} />)}
      {world.goal && <span className="lt-blip text-[#7dffb0]" style={pos(world.goal.x, world.goal.y)} />}
      <span className="lt-blip text-[#4ff0ff]" style={pos(state.x, state.y)} />
    </div>
  );
}
