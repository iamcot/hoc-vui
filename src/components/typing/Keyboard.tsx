"use client";
import { useEffect, useId, useRef, useState } from "react";
import { hasFile, resolveFile } from "@/content/assets";
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
const RIGHT: Finger[] = ["R2", "R3", "R4", "R5"];
const HANDS_IMG = "/assets/img/gp-hands.webp";
/** toạ độ (tỉ lệ 0-1) đầu ngón út hai tay trong ảnh gp-hands, và tỉ lệ cao/rộng của ảnh. Chỉnh lại khi có ảnh thật. */
const HANDS_TIPS = { l5: { x: 0.12, y: 0.3 }, r5: { x: 0.88, y: 0.3 }, ratio: 1024 / 1536 };

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
      if (out.a) onExtra(hasFile(HANDS_IMG) ? Math.round(out.a.h * 2.2) : 0);
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

  // vị trí đầu ngón trên phím (ngón trỏ ở F/J, ngón cái trên phím cách)
  const tipOf = (f: Finger, side?: "L" | "R"): Pt | undefined =>
    f === "T" ? { ...pos.space, x: pos.space.x + (side === "L" ? -kw * 1.2 : kw * 1.2) } : pos[HOME[f as keyof typeof HOME]];
  const lit: { f: Finger; at: Pt }[] = [];
  if (active === "T") lit.push({ f: "T", at: tipOf("T", "R")! });
  else if (active && tipOf(active)) lit.push({ f: active, at: tipOf(active)! });
  if (sh) lit.push({ f: sh === "L" ? "L5" : "R5", at: tipOf(sh === "L" ? "L5" : "R5")! });

  // ảnh bàn tay: đặt sao cho đầu ngón út hai tay trùng phím A và ;
  const right = pos[";"];
  const img = hasFile(HANDS_IMG) && right ? (() => {
    const span = right.x - pos.a.x;
    const w = span / (HANDS_TIPS.r5.x - HANDS_TIPS.l5.x);
    const h = w * HANDS_TIPS.ratio;
    return { left: pos.a.x - HANDS_TIPS.l5.x * w, top: pos.a.y - HANDS_TIPS.l5.y * h, w, h };
  })() : null;

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* vệt sáng dọc theo ngón cần dùng, nằm dưới nét tay */}
      {lit.map(({ f, at }) => (
        <div
          key={f}
          className="absolute rounded-full"
          style={{
            left: at.x - kw * 0.42,
            top: at.y - kh * 0.45,
            width: kw * 0.84,
            height: img ? kh * 2.4 : kh * 0.9,
            background: `linear-gradient(to bottom, color-mix(in srgb, ${FINGER_COLOR[f]} 70%, transparent), transparent)`,
            boxShadow: `0 0 18px 2px color-mix(in srgb, ${FINGER_COLOR[f]} 60%, transparent)`,
            transition: "all 0.15s ease-out",
          }}
        />
      ))}
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveFile(HANDS_IMG)} alt="" draggable={false} className="absolute max-w-none select-none opacity-90" style={{ left: img.left, top: img.top, width: img.w, height: img.h }} />
      ) : (
        // chưa có ảnh: chỉ đánh dấu chỗ đặt 8 đầu ngón + ngón cái
        ([...LEFT, ...RIGHT] as Finger[]).map((f) => {
          const at = tipOf(f)!;
          return <span key={f} className="absolute rounded-full" style={{ left: at.x - kw * 0.3, top: at.y + kh * 0.05, width: kw * 0.6, height: kh * 0.42, border: "1.5px solid rgb(235 248 255 / 0.6)", borderBottom: "none" }} />;
        })
      )}
    </div>
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
