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
  const active = fingerOf(next);
  const sh = shiftSide(next);

  const H = size.h + kh * 3.2;
  const P = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  /** ngón tay: thuôn từ gốc (cắm sâu vào lòng bàn tay) tới đầu ngón tròn */
  const fingerD = (base: { x: number; y: number }, tip: { x: number; y: number }, wb: number, wt: number, ext = 0.7) => {
    const len = Math.hypot(tip.x - base.x, tip.y - base.y) || 1;
    const ux = (tip.x - base.x) / len, uy = (tip.y - base.y) / len;
    const nx = -uy, ny = ux;
    const b0 = { x: base.x - ux * kh * ext, y: base.y - uy * kh * ext };
    const t0 = { x: tip.x - ux * wt * 0.5, y: tip.y - uy * wt * 0.5 };
    return `M${P(b0.x + nx * wb / 2, b0.y + ny * wb / 2)} L${P(t0.x + nx * wt / 2, t0.y + ny * wt / 2)} A${wt / 2} ${wt / 2} 0 0 0 ${P(t0.x - nx * wt / 2, t0.y - ny * wt / 2)} L${P(b0.x - nx * wb / 2, b0.y - ny * wb / 2)} Z`;
  };

  const hand = (side: "L" | "R") => {
    const fingers = side === "L" ? LEFT : RIGHT;
    const sg = side === "L" ? 1 : -1; // hướng về phía ngón cái
    const home = fingers.map((f) => pos[HOME[f as keyof typeof HOME]]);
    const px = (home[0].x + home[3].x) / 2 + sg * kw * 0.3;
    const py = bottom + kh * 1.7;
    const knuckleY = py - kh * 0.95;
    const shiftKey = pos[side === "L" ? "ShiftL" : "ShiftR"];
    const parts = fingers.map((f, i) => {
      const tip = { x: home[i].x, y: home[i].y - kh * 0.25 };
      const pinky = f.endsWith("5");
      const holdsShift = sh === side && pinky && !!shiftKey;
      const base = { x: px + (home[i].x - px) * 0.62, y: knuckleY + (pinky ? kh * 0.2 : 0) };
      const wb = kw * (pinky ? 0.52 : f.endsWith("4") ? 0.58 : 0.64);
      return { f, d: fingerD(base, tip, wb, wb * 0.86), lit: fingerD(base, tip, wb, wb * 0.86, 0.1), base, wb, on: f === active || holdsShift };
    });
    const tipT = { x: home[3].x + sg * kw * 1.2, y: pos.space.y };
    const tb = { x: px + sg * kw * 1.05, y: py + kh * 0.15 };
    const thumb = { f: "T" as Finger, d: fingerD(tb, tipT, kw * 0.78, kw * 0.62), lit: fingerD(tb, tipT, kw * 0.78, kw * 0.62, 0), on: active === "T" && side === "R" };
    // lòng bàn tay: mép ngón út → khớp ngón trỏ → mô ngón cái → cổ tay
    const o = parts[0], ix = parts[3];
    const out = { x: o.base.x - sg * o.wb * 0.55, y: o.base.y };
    const inn = { x: ix.base.x + sg * ix.wb * 0.55, y: ix.base.y };
    const palm = `M${P(out.x, out.y)} Q${P((out.x + inn.x) / 2, knuckleY - kh * 0.25)} ${P(inn.x, inn.y)} Q${P(px + sg * kw * 1.75, py - kh * 0.2)} ${P(px + sg * kw * 1.25, py + kh * 0.7)} L${P(px + sg * kw * 0.95, H + 2)} L${P(px - sg * kw * 1.35, H + 2)} L${P(px - sg * kw * 1.55, py + kh * 0.5)} Q${P(px - sg * kw * 1.85, py - kh * 0.3)} ${P(out.x, out.y)} Z`;
    return { shapes: [palm, ...parts.map((q) => q.d), thumb.d], lit: [...parts, thumb].filter((q) => q.on) };
  };
  const hands = [hand("L"), hand("R")];
  const all = hands.flatMap((h) => h.shapes);

  return (
    <svg className="pointer-events-none absolute left-0 top-0 w-full overflow-visible" style={{ height: H }} viewBox={`0 0 ${size.w} ${H}`} aria-hidden>
      <defs>
        <filter id={fid} filterUnits="userSpaceOnUse" x={-20} y={-20} width={size.w + 40} height={H + 40}>
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="fat" />
          <feComposite in="fat" in2="SourceAlpha" operator="out" result="edge" />
          <feFlood floodColor="#dff6ff" floodOpacity="0.85" />
          <feComposite in2="edge" operator="in" />
        </filter>
      </defs>
      {/* lòng tay kính mờ, không che chữ trên phím */}
      <g opacity={0.09}>{all.map((d, i) => <path key={i} d={d} fill="#bfe9ff" />)}</g>
      {hands.flatMap((h) => h.lit).map((q) => (
        <path key={q.f} d={q.lit} fill={FINGER_COLOR[q.f]} fillOpacity={0.4} style={{ filter: `drop-shadow(0 0 6px ${FINGER_COLOR[q.f]})` }} />
      ))}
      {/* viền ngoài liền một khối: bàn tay + ngón */}
      <g filter={`url(#${fid})`}>{all.map((d, i) => <path key={i} d={d} fill="#fff" />)}</g>
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
