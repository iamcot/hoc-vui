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
  const P = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  type V = { x: number; y: number };
  const add = (p: V, q: V, k = 1): V => ({ x: p.x + q.x * k, y: p.y + q.y * k });

  /** một ngón: từ khớp K tới đầu ngón T, trả về 2 mép và tâm cung đầu ngón */
  const digit = (K: V, T: V, w: number, sg: number) => {
    const len = Math.hypot(T.x - K.x, T.y - K.y) || 1;
    const u = { x: (T.x - K.x) / len, y: (T.y - K.y) / len };
    const n = { x: -u.y * sg, y: u.x * sg }; // hướng về phía ngón cái
    const hb = w / 2, ht = w * 0.43;
    const c = add(T, u, -ht);
    return { aB: add(K, n, -hb), aT: add(c, n, -ht), bT: add(c, n, ht), bB: add(K, n, hb), ht };
  };
  const capsule = (d: ReturnType<typeof digit>, sweep: number) =>
    `M${P(d.aB.x, d.aB.y)} L${P(d.aT.x, d.aT.y)} A${d.ht} ${d.ht} 0 0 ${sweep} ${P(d.bT.x, d.bT.y)} L${P(d.bB.x, d.bB.y)} Z`;

  const hand = (side: "L" | "R") => {
    const fingers = side === "L" ? LEFT : RIGHT;
    const sg = side === "L" ? 1 : -1; // hướng về phía ngón cái
    const sweep = side === "L" ? 1 : 0;
    const home = fingers.map((f) => pos[HOME[f as keyof typeof HOME]]);
    const px = (home[0].x + home[3].x) / 2 + sg * kw * 0.25;
    const knuckleY = bottom + kh * 0.55;
    const ds = fingers.map((f, i) => {
      const pinky = f.endsWith("5");
      const T = { x: home[i].x, y: home[i].y - kh * 0.1 };
      const K = { x: px + (home[i].x - px) * 0.82, y: knuckleY + (pinky ? kh * 0.35 : i === 1 ? kh * 0.05 : 0) };
      const w = kw * (pinky ? 0.6 : f.endsWith("4") ? 0.68 : f.endsWith("3") ? 0.72 : 0.72);
      return { f, d: digit(K, T, w, sg), on: f === active || (sh === side && pinky) };
    });
    // ngón cái: gốc ở mô ngón cái, đầu ngón trên phím cách
    const tRoot = { x: px + sg * kw * 1.6, y: knuckleY + kh * 1.8 };
    const tTip = { x: home[3].x + sg * kw * 1.0, y: pos.space.y + kh * 0.15 };
    const th = digit(tRoot, tTip, kw * 0.8, sg);
    const thumbOn = active === "T" && side === "R";

    const web = (p: V, q: V) => ` Q${P((p.x + q.x) / 2, Math.max(p.y, q.y) + kh * 0.3)} ${P(q.x, q.y)}`;
    const wristIn = { x: px + sg * kw * 0.95, y: H + 4 };
    const wristOut = { x: px - sg * kw * 1.25, y: H + 4 };
    let d = `M${P(wristOut.x, wristOut.y)} C${P(wristOut.x - sg * kw * 0.2, bottom + kh * 1.9)} ${P(ds[0].d.aB.x - sg * kw * 0.15, ds[0].d.aB.y + kh * 0.7)} ${P(ds[0].d.aB.x, ds[0].d.aB.y)}`;
    ds.forEach(({ d: g }, i) => {
      if (i > 0) d += web(ds[i - 1].d.bB, g.aB);
      d += ` L${P(g.aT.x, g.aT.y)} A${g.ht} ${g.ht} 0 0 ${sweep} ${P(g.bT.x, g.bT.y)} L${P(g.bB.x, g.bB.y)}`;
    });
    // từ ngón trỏ vòng xuống kẽ ngón cái rồi ra ngón cái
    const tl = Math.hypot(th.aB.x - th.aT.x, th.aB.y - th.aT.y) || 1;
    const c2 = add(th.aB, { x: (th.aB.x - th.aT.x) / tl, y: (th.aB.y - th.aT.y) / tl }, kh * 0.45);
    d += ` C${P(ds[3].d.bB.x, ds[3].d.bB.y + kh * 0.6)} ${P(c2.x, c2.y)} ${P(th.aB.x, th.aB.y)}`;
    d += ` L${P(th.aT.x, th.aT.y)} A${th.ht} ${th.ht} 0 0 ${sweep} ${P(th.bT.x, th.bT.y)} L${P(th.bB.x, th.bB.y)}`;
    d += ` Q${P(th.bB.x, wristIn.y - kh * 0.6)} ${P(wristIn.x, wristIn.y)} Z`;

    const lit = [...ds.filter((x) => x.on).map((x) => ({ f: x.f, p: capsule(x.d, sweep) })), ...(thumbOn ? [{ f: "T" as Finger, p: capsule(th, sweep) }] : [])];
    return { d, lit };
  };
  const hands = [hand("L"), hand("R")];

  return (
    <svg className="pointer-events-none absolute left-0 top-0 w-full overflow-visible" style={{ height: H }} viewBox={`0 0 ${size.w} ${H}`} aria-hidden>
      <defs>
        <linearGradient id={`${fid}-g`} gradientUnits="userSpaceOnUse" x1="0" y1={bottom + kh * 1.2} x2="0" y2={H}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${fid}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={size.w} height={H}>
          <rect width={size.w} height={H} fill={`url(#${fid}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${fid}-m)`}>
        {hands.flatMap((h) => h.lit).map((q) => (
          <path key={q.f} d={q.p} fill={FINGER_COLOR[q.f]} fillOpacity={0.42} style={{ filter: `drop-shadow(0 0 8px ${FINGER_COLOR[q.f]})` }} />
        ))}
        {hands.map((h, i) => (
          <path key={i} d={h.d} fill="rgb(190 230 255 / 0.07)" stroke="rgb(223 246 255 / 0.8)" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
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
