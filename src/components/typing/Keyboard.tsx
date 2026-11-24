"use client";
import { useEffect, useRef, useState } from "react";
import { FINGER_COLOR, FINGER_NAME, HOME, ROWS, fingerOf, keyOf, needsShift, shiftSide, type Finger, type KeyCap } from "@/lib/typing/keyboard";

type Guide = "hand" | "text";
const GUIDE_KEY = "hocvui:gp-guide";
/** cách hướng dẫn ngón: ngón tay ảo (mặc định) hay bằng chữ; nhớ trên máy */
function useGuide(): [Guide, (g: Guide) => void] {
  const [g, setG] = useState<Guide>("hand");
  useEffect(() => {
    try {
      if (localStorage.getItem(GUIDE_KEY) === "text") setG("text");
    } catch {
      /* bỏ qua */
    }
  }, []);
  return [
    g,
    (v) => {
      setG(v);
      try {
        localStorage.setItem(GUIDE_KEY, v);
      } catch {
        /* bỏ qua */
      }
    },
  ];
}

const capId = (c: KeyCap, ci: number) => (c.fn === "Shift" ? (ci === 0 ? "ShiftL" : "ShiftR") : c.k === " " ? "space" : c.fn ? c.fn : c.k);

/**
 * Bàn phím neon: mỗi ngón một màu. `keys` = phím của bài (sáng), `focus` = phím mới (phát sáng mạnh),
 * `next` = ký tự cần gõ tiếp (nhấp nháy, kèm Shift nếu cần).
 */
export function Keyboard({
  keys = "",
  focus = "",
  next,
  pressed,
  compact = false,
  className = "",
}: {
  keys?: string;
  focus?: string;
  next?: string;
  /** phím vừa bấm sai (đỏ thoáng qua) */
  pressed?: { ch: string; ok: boolean } | null;
  compact?: boolean;
  className?: string;
}) {
  const lit = new Set([...keys.toLowerCase()]);
  const hot = new Set([...focus.toLowerCase()]);
  const nextCap = next ? keyOf(next) : undefined;
  const shift = next ? shiftSide(next) : undefined;
  const all = !keys && !focus;
  const [guide, setGuide] = useGuide();
  const board = useRef<HTMLDivElement>(null);
  const showHands = next !== undefined && guide === "hand";
  const [extra, setExtra] = useState(0);

  return (
    <div className={`select-none ${className}`}>
      <div ref={board} aria-hidden style={{ marginBottom: showHands ? extra : undefined }} className={`relative mx-auto flex w-full max-w-3xl flex-col rounded-[1.4rem] border border-cyan-300/25 bg-[#0b1233]/85 p-2 shadow-[0_0_40px_-10px_rgba(47,211,255,0.5)] backdrop-blur ${compact ? "gap-1" : "gap-1.5 sm:p-3"}`}>
        {ROWS.map((r, ri) => (
          <div key={ri} className={`flex ${compact ? "gap-1" : "gap-1.5"} ${ri === 4 ? "justify-center" : ""}`}>
            {r.map((c, ci) => {
              const ch = c.k;
              const isShift = c.fn === "Shift";
              const isNext = (nextCap && c === nextCap) || (isShift && ((shift === "L" && ci === 0) || (shift === "R" && ci > 0)));
              const on = all || (ch && (lit.has(ch) || (ch === " " && keys.includes(" "))));
              const isHot = ch && hot.has(ch);
              const bad = pressed && !pressed.ok && keyOf(pressed.ch) === c;
              return <Cap key={ci} id={capId(c, ci)} c={c} on={!!on || !!isNext} hot={!!isHot} next={!!isNext} bad={!!bad} compact={compact} />;
            })}
          </div>
        ))}
        {showHands && <Hands board={board} next={next} onExtra={setExtra} />}
      </div>
      {next !== undefined && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {guide === "text" && <GuideText next={next} shift={shift} />}
          <div className="flex rounded-full bg-white/10 p-0.5 text-xs font-bold ring-1 ring-cyan-300/30" role="group" aria-label="Cách hướng dẫn ngón">
            {(["hand", "text"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGuide(g)}
                className={`rounded-full px-3 py-1 transition ${guide === g ? "bg-cyan-400 text-[#04102c]" : "text-cyan-100/80 hover:text-white"}`}
                aria-pressed={guide === g}
              >
                {g === "hand" ? "✋ Ngón tay ảo" : "Aa Bằng chữ"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GuideText({ next, shift }: { next: string; shift?: "L" | "R" }) {
  return (
        <p className="text-center text-lg font-bold text-cyan-50 sm:text-xl">
          {next === " " ? "Ngón cái: phím cách" : (
            <>
              Ngón <span style={{ color: FINGER_COLOR[fingerOf(next) ?? "T"] }}>{FINGER_NAME[fingerOf(next) ?? "T"]}</span>
              {needsShift(next) && <> + Shift bằng ngón út {shift === "L" ? "trái" : "phải"}</>}
            </>
          )}
        </p>
  );
}

type Pt = { x: number; y: number; w: number; h: number };
const LEFT: Finger[] = ["L5", "L4", "L3", "L2"];
const RIGHT: Finger[] = ["R2", "R3", "R4", "R5"];

/**
 * Hai bàn tay ảo vẽ nét mảnh đè lên bàn phím: tám ngón đặt trên hàng nhà, ngón cái trên phím cách.
 * Ngón cần dùng được tô màu trong suốt và duỗi tới phím cần gõ (kèm ngón út giữ Shift nếu cần).
 */
function Hands({ board, next, onExtra }: { board: React.RefObject<HTMLDivElement | null>; next: string; onExtra: (px: number) => void }) {
  const [pos, setPos] = useState<Record<string, Pt> | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const measure = () => {
      const b = el.getBoundingClientRect();
      const out: Record<string, Pt> = {};
      el.querySelectorAll<HTMLElement>("[data-k]").forEach((k) => {
        const r = k.getBoundingClientRect();
        out[k.dataset.k!] = { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2, w: r.width, h: r.height };
      });
      setPos(out);
      if (out.a) onExtra(Math.round(out.a.h * 3.1));
      setSize({ w: b.width, h: b.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  if (!pos || !pos.a || !pos.space) return null;
  const kw = pos.a.w;
  const kh = pos.a.h;
  const bottom = size.h;
  const target = keyOf(next);
  const active = fingerOf(next);
  const sh = shiftSide(next);
  const targetId = next === " " ? "space" : target ? (target.fn ? target.fn : target.k) : undefined;

  const hand = (side: "L" | "R") => {
    const fingers = side === "L" ? LEFT : RIGHT;
    const home = fingers.map((f) => pos[HOME[f as keyof typeof HOME]]);
    const px = (home[0].x + home[3].x) / 2 + (side === "L" ? kw * 0.3 : -kw * 0.3);
    const py = bottom + kh * 1.8;
    const thumbTip = { x: home[3].x + (side === "L" ? kw * 1.3 : -kw * 1.3), y: pos.space.y };
    const items = [
      ...fingers.map((f, i) => {
        let tip = { x: home[i].x, y: home[i].y - kh * 0.2 };
        const isActive = f === active || (sh === side && f === (side === "L" ? "L5" : "R5"));
        if (f === active && targetId && pos[targetId]) tip = { x: pos[targetId].x, y: pos[targetId].y - kh * 0.2 };
        const shiftKey = pos[side === "L" ? "ShiftL" : "ShiftR"];
        if (sh === side && f === (side === "L" ? "L5" : "R5") && shiftKey) tip = { x: shiftKey.x + (side === "L" ? kw * 0.3 : -kw * 0.3), y: shiftKey.y - kh * 0.1 };
        const base = { x: px + (home[i].x - px) * 0.6, y: py - kh * 0.9 };
        return { f, tip, base, isActive, wid: kw * (f.endsWith("5") ? 0.5 : 0.6) };
      }),
      { f: "T" as Finger, tip: thumbTip, base: { x: px + (side === "L" ? kw * 1.3 : -kw * 1.3), y: py - kh * 0.2 }, isActive: active === "T" && side === "R", wid: kw * 0.66 },
    ];
    return { px, py, items };
  };

  return (
    <svg className="pointer-events-none absolute left-0 top-0 w-full overflow-visible" style={{ height: size.h + kh * 3.2 }} viewBox={`0 0 ${size.w} ${size.h + kh * 3.2}`} aria-hidden>
      {(["L", "R"] as const).map((side) => {
        const { px, py, items } = hand(side);
        return (
          <g key={side}>
            {items.map(({ f, tip, base, isActive, wid }) => {
              const len = Math.hypot(tip.x - base.x, tip.y - base.y) + wid / 2;
              const ang = (Math.atan2(tip.x - base.x, -(tip.y - base.y)) * 180) / Math.PI;
              const color = FINGER_COLOR[f];
              return (
                <rect
                  key={f}
                  x={-wid / 2}
                  y={-len}
                  width={wid}
                  height={len}
                  rx={wid / 2}
                  transform={`translate(${base.x} ${base.y}) rotate(${ang})`}
                  fill={isActive ? color : "rgb(255 255 255 / 0.04)"}
                  fillOpacity={isActive ? 0.35 : 1}
                  stroke={isActive ? color : "rgb(255 255 255 / 0.55)"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ transition: "all 0.15s ease-out" }}
                />
              );
            })}
            <ellipse cx={px} cy={py} rx={kw * 2.1} ry={kh * 1.1} fill="rgb(11 18 51 / 0.6)" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
}

function Cap({ id, c, on, hot, next, bad, compact }: { id: string; c: KeyCap; on: boolean; hot: boolean; next: boolean; bad: boolean; compact: boolean }) {
  const color = FINGER_COLOR[c.f];
  const label = c.fn !== undefined ? c.fn : c.k === ";" ? ";" : c.k.toUpperCase();
  const bump = c.k === "f" || c.k === "j";
  return (
    <div
      data-k={id}
      className={`relative grid place-items-center rounded-lg font-mono font-bold transition-all duration-150 ${compact ? "h-7 text-[11px] sm:h-8 sm:text-xs" : "h-9 text-xs sm:h-11 sm:text-sm"} ${next ? "key-next" : ""}`}
      style={{
        flex: `${c.w ?? 1} 1 0`,
        minWidth: 0,
        color: on ? "#fff" : "rgb(160 175 220 / 0.45)",
        background: bad ? "#ff3d6e" : next ? color : on ? `color-mix(in srgb, ${color} ${hot ? 55 : 28}%, #0d1640)` : "#121a45",
        boxShadow: next ? `0 0 18px 2px ${color}` : hot ? `0 0 12px -2px ${color}, inset 0 0 0 1.5px ${color}` : on ? `inset 0 0 0 1px color-mix(in srgb, ${color} 60%, transparent)` : "inset 0 0 0 1px rgb(120 140 210 / 0.15)",
        textShadow: next ? "0 1px 2px rgb(0 0 0 / 0.5)" : undefined,
      }}
    >
      {label}
      {bump && <span className="absolute bottom-1 h-0.5 w-2.5 rounded-full bg-white/70" />}
    </div>
  );
}
