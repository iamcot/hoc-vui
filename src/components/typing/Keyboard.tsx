"use client";
import { useEffect, useId, useRef, useState } from "react";
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
  ghost = false,
  className = "",
}: {
  keys?: string;
  focus?: string;
  next?: string;
  /** phím vừa bấm sai (đỏ thoáng qua) */
  pressed?: { ch: string; ok: boolean } | null;
  compact?: boolean;
  /** chỉ vẽ nét, không nền (dùng trong game để thấy cảnh phía sau) */
  ghost?: boolean;
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
      <div ref={board} aria-hidden style={{ marginBottom: showHands ? extra : undefined }} className={`relative mx-auto flex w-full max-w-3xl flex-col rounded-[1.4rem] p-2 ${ghost ? "" : "border border-cyan-300/25 bg-[#0b1233]/85 shadow-[0_0_40px_-10px_rgba(47,211,255,0.5)] backdrop-blur"} ${compact ? "gap-1" : "gap-1.5 sm:p-3"}`}>
        {ROWS.map((r, ri) => (
          <div key={ri} className={`flex ${compact ? "gap-1" : "gap-1.5"} ${ri === 4 ? "justify-center" : ""}`}>
            {r.map((c, ci) => {
              const ch = c.k;
              const isShift = c.fn === "Shift";
              const isNext = (nextCap && c === nextCap) || (isShift && ((shift === "L" && ci === 0) || (shift === "R" && ci > 0)));
              const on = all || (ch && (lit.has(ch) || (ch === " " && keys.includes(" "))));
              const isHot = ch && hot.has(ch);
              const bad = pressed && !pressed.ok && keyOf(pressed.ch) === c;
              return <Cap key={ci} id={capId(c, ci)} c={c} on={!!on || !!isNext} hot={!!isHot} next={!!isNext} bad={!!bad} compact={compact} ghost={ghost} />;
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
const RIGHT: Finger[] = ["R5", "R4", "R3", "R2"]; // út → trỏ như tay trái

/**
 * Hai bàn tay ảo (viền liền khối, lòng kính mờ) đè lên bàn phím: tám ngón đặt trên hàng nhà, ngón cái trên phím cách.
 * Ngón cần dùng được tô màu trong suốt và duỗi tới phím cần gõ (kèm ngón út giữ Shift nếu cần).
 */
function Hands({ board, next, onExtra }: { board: React.RefObject<HTMLDivElement | null>; next: string; onExtra: (px: number) => void }) {
  const [pos, setPos] = useState<Record<string, Pt> | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const fid = `hand-${useId().replace(/:/g, "")}`;

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
      if (out.a) onExtra(Math.round(out.a.h * 2.7));
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
  const active = fingerOf(next);
  const sh = shiftSide(next);

  const H = size.h + kh * 3;
  const P = (p: V) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  type V = { x: number; y: number };
  const add = (p: V, q: V, k = 1): V => ({ x: p.x + q.x * k, y: p.y + q.y * k });

  /** ngón tay nét mở (hình chữ U úp ngược): gốc K → đầu ngón T, hơi cong */
  const digit = (K: V, T: V, w: number, sg: number, bend: number) => {
    const len = Math.hypot(T.x - K.x, T.y - K.y) || 1;
    const u = { x: (T.x - K.x) / len, y: (T.y - K.y) / len };
    const n = { x: -u.y * sg, y: u.x * sg }; // hướng về phía ngón cái
    const hb = w / 2, ht = w * 0.44;
    const c = add(T, u, -ht);
    const mid = add(add(K, { x: c.x - K.x, y: c.y - K.y }, 0.5), n, bend);
    const aB = add(K, n, -hb), aT = add(c, n, -ht), bT = add(c, n, ht), bB = add(K, n, hb);
    const am = add(mid, n, -(hb + ht) / 2 - w * 0.04), bm = add(mid, n, (hb + ht) / 2 + w * 0.02);
    return { aB, aT, bT, bB, am, bm, ht };
  };
  type D = ReturnType<typeof digit>;
  const fingerPath = (g: D, sweep: number) => `M${P(g.aB)} Q${P(g.am)} ${P(g.aT)} A${g.ht} ${g.ht} 0 0 ${sweep} ${P(g.bT)} Q${P(g.bm)} ${P(g.bB)}`;

  const hand = (side: "L" | "R") => {
    const fingers = side === "L" ? LEFT : RIGHT;
    const sg = side === "L" ? 1 : -1; // hướng về phía ngón cái
    const sweep = side === "L" ? 1 : 0;
    const home = fingers.map((f) => pos[HOME[f as keyof typeof HOME]]);
    const px = (home[0].x + home[3].x) / 2;
    const zy = (pos.z ?? pos.a).y;
    const ds = fingers.map((f, i) => {
      const pinky = f.endsWith("5");
      const T = { x: home[i].x + sg * kw * 0.05, y: home[i].y - kh * 0.2 };
      const K = { x: px + (home[i].x - px) * 0.9 - sg * kw * 0.05, y: zy + kh * [0.2, 0.62, 0.78, 0.55][i] }; // độ dài: giữa > áp út ≈ trỏ > út
      const w = kw * (pinky ? 0.66 : f.endsWith("4") ? 0.74 : 0.8);
      return { f, g: digit(K, T, w, sg, -sg * kw * 0.06), on: f === active || (sh === side && pinky) };
    });
    // ngón cái nằm trên phím cách, chĩa vào giữa
    const tRoot = { x: home[3].x + sg * kw * 0.1, y: bottom + kh * 0.75 };
    const tTip = { x: home[3].x + sg * kw * 1.25, y: pos.space.y - kh * 0.05 };
    const th = digit(tRoot, tTip, kw * 0.78, sg, sg * kw * 0.12);
    const thumbOn = active === "T" && side === "R";

    const p0 = ds[0].g.aB, p3 = ds[3].g.bB;
    const outBot = { x: px - sg * kw * 1.15, y: H + 6 };
    const inBot = { x: px + sg * kw * 1.25, y: H + 6 };
    // mép ngoài: từ gốc ngón út xuống cẳng tay
    const outer = `M${P(p0)} C${P({ x: p0.x - sg * kw * 0.15, y: p0.y + kh * 0.9 })} ${P({ x: outBot.x - sg * kw * 0.05, y: outBot.y - kh * 1.2 })} ${P(outBot)}`;
    // mép trong: gốc ngón trỏ → kẽ ngón cái → ngón cái → cẳng tay
    const tl = Math.hypot(th.aB.x - th.aT.x, th.aB.y - th.aT.y) || 1;
    const c2 = add(th.aB, { x: (th.aB.x - th.aT.x) / tl, y: (th.aB.y - th.aT.y) / tl }, kh * 0.3);
    const inner = `M${P(p3)} C${P({ x: p3.x, y: p3.y + kh * 0.35 })} ${P(c2)} ${P(th.aB)} Q${P(th.am)} ${P(th.aT)} A${th.ht} ${th.ht} 0 0 ${sweep} ${P(th.bT)} Q${P(th.bm)} ${P(th.bB)} C${P({ x: th.bB.x + sg * kw * 0.1, y: th.bB.y + kh * 0.8 })} ${P({ x: inBot.x + sg * kw * 0.05, y: inBot.y - kh * 1.1 })} ${P(inBot)}`;
    return { sweep, ds, th, thumbOn, outer, inner };
  };
  const hands = [hand("L"), hand("R")];
  const line = { stroke: "rgb(235 248 255 / 0.85)", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const glass = "rgb(225 242 255 / 0.10)";

  return (
    <svg className="pointer-events-none absolute left-0 top-0 w-full overflow-visible" style={{ height: H }} viewBox={`0 0 ${size.w} ${H}`} aria-hidden>
      <defs>
        <linearGradient id={`${fid}-g`} gradientUnits="userSpaceOnUse" x1="0" y1={bottom + kh * 1.6} x2="0" y2={H}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${fid}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={size.w} height={H}>
          <rect width={size.w} height={H} fill={`url(#${fid}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${fid}-m)`}>
        {hands.map((h, i) => (
          <g key={i}>
            <path d={h.outer} fill="none" {...line} />
            <path d={h.inner} fill="none" {...line} />
            {h.thumbOn && <path d={fingerPath(h.th, h.sweep)} fill={FINGER_COLOR.T} fillOpacity={0.5} style={{ filter: `drop-shadow(0 0 8px ${FINGER_COLOR.T})` }} />}
            {h.ds.map(({ f, g, on }) => (
              <path
                key={f}
                d={fingerPath(g, h.sweep)}
                fill={on ? FINGER_COLOR[f] : glass}
                fillOpacity={on ? 0.5 : 1}
                style={on ? { filter: `drop-shadow(0 0 8px ${FINGER_COLOR[f]})` } : undefined}
                {...line}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

function Cap({ id, c, on, hot, next, bad, compact, ghost }: { id: string; c: KeyCap; on: boolean; hot: boolean; next: boolean; bad: boolean; compact: boolean; ghost: boolean }) {
  const color = FINGER_COLOR[c.f];
  const label = c.fn !== undefined ? c.fn : c.k === ";" ? ";" : c.k.toUpperCase();
  const bump = c.k === "f" || c.k === "j";
  return (
    <div
      data-k={id}
      className={`relative grid place-items-center rounded-lg font-mono font-bold transition-all duration-150 ${compact ? "h-7 text-[11px] sm:h-8 sm:text-xs" : "h-9 text-xs sm:h-11 sm:text-sm"} ${next ? "key-next" : ""}`}
      style={ghost ? {
        flex: `${c.w ?? 1} 1 0`,
        minWidth: 0,
        color: next ? "#fff" : on ? `color-mix(in srgb, ${color} 55%, #fff)` : "rgb(200 220 255 / 0.45)",
        background: bad ? "rgb(255 61 110 / 0.45)" : next ? `color-mix(in srgb, ${color} 30%, transparent)` : hot ? `color-mix(in srgb, ${color} 12%, transparent)` : "transparent",
        boxShadow: next ? `0 0 14px -2px ${color}, inset 0 0 0 2px ${color}` : on ? `inset 0 0 0 1.5px color-mix(in srgb, ${color} 75%, transparent)` : "inset 0 0 0 1px rgb(200 220 255 / 0.25)",
        textShadow: "0 1px 3px rgb(0 0 0 / 0.7)",
      } : {
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
