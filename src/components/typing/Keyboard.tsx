"use client";
import { useEffect, useId, useRef, useState } from "react";
import { hasFile, resolveFile } from "@/content/assets";
import { FINGER_COLOR, FINGER_NAME, HOME, ROWS, fingerOf, keyOf, needsShift, shiftSide, type Finger, type KeyCap } from "@/lib/typing/keyboard";

export type Guide = "hand" | "text" | "pad";
const GUIDE_KEY = "hocvui:gp-guide";
const GUIDE_EVT = "hocvui:gp-guide";
/**
 * cách hướng dẫn: ngón tay ảo (mặc định), bằng chữ, hoặc bàn phím chạm (iPad, không có bàn phím rời).
 * Nhớ trên máy; máy cảm ứng chưa chọn gì thì mặc định bàn phím chạm. Mọi nơi dùng hook này đồng bộ với nhau.
 */
export function useGuide(): [Guide, (g: Guide) => void] {
  const [g, setG] = useState<Guide>("hand");
  useEffect(() => {
    try {
      const v = localStorage.getItem(GUIDE_KEY);
      if (v === "text" || v === "pad" || v === "hand") setG(v);
      else if (matchMedia("(pointer: coarse)").matches && !matchMedia("(any-pointer: fine)").matches) setG("pad");
    } catch {
      /* bỏ qua */
    }
    const on = (e: Event) => setG((e as CustomEvent<Guide>).detail);
    window.addEventListener(GUIDE_EVT, on);
    return () => window.removeEventListener(GUIDE_EVT, on);
  }, []);
  return [
    g,
    (v) => {
      try {
        localStorage.setItem(GUIDE_KEY, v);
      } catch {
        /* bỏ qua */
      }
      window.dispatchEvent(new CustomEvent(GUIDE_EVT, { detail: v }));
    },
  ];
}

const GUIDE_LABEL: Record<Guide, string> = { hand: "✋ Ngón tay ảo", text: "Aa Bằng chữ", pad: "⌨️ Bàn phím chạm" };

/** gửi phím như bàn phím thật để useKeyInput / useHotkeys nghe được */
function sendKey(key: string, shiftKey = false) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey, bubbles: true }));
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
  const typing = next !== undefined;
  const pad = typing && guide === "pad";
  const showHands = typing && guide === "hand";
  const [extra, setExtra] = useState(0);
  // bàn phím chạm: Shift bấm một lần áp cho phím kế tiếp, Caps giữ đến khi bấm lại
  const [shiftOn, setShiftOn] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [tap, setTap] = useState<{ id: string; n: number } | null>(null);
  useEffect(() => {
    if (!tap) return;
    const t = setTimeout(() => setTap(null), 220);
    return () => clearTimeout(t);
  }, [tap]);
  useEffect(() => {
    if (!pad) return;
    const down = (e: KeyboardEvent) => {
      const c = e.key === " " ? ROWS[4][0] : keyOf(e.key);
      if (!c) return;
      ROWS.forEach((r) => r.forEach((x, ci) => x === c && setTap({ id: capId(x, ci), n: Date.now() })));
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [pad]);
  const press = (c: KeyCap, id: string) => {
    if (c.fn) setTap({ id, n: Date.now() });
    if (c.fn === "Shift") return setShiftOn((v) => !v);
    if (c.fn === "Caps") return setCapsOn((v) => !v);
    if (c.fn === "⌫") return sendKey("Backspace");
    if (c.fn === "Enter") return sendKey("Enter");
    if (c.fn === "Tab") return;
    const up = shiftOn !== (capsOn && /[a-z]/.test(c.k));
    sendKey(up ? (c.s ?? c.k.toUpperCase()) : c.k, shiftOn);
    if (shiftOn) setShiftOn(false);
  };
  // trong game: nút chọn cách hướng dẫn nằm trên bàn phím, để bàn phím sát đáy màn hình
  const toolbar = typing && (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${ghost ? "mb-1.5" : "mt-2"}`}>
      {guide === "text" && <GuideText next={next} shift={shift} />}
      <div className="flex rounded-full bg-white/10 p-0.5 text-xs font-bold ring-1 ring-cyan-300/30 backdrop-blur" role="group" aria-label="Cách hướng dẫn ngón">
        {(["hand", "text", "pad"] as const).map((g) => (
          <button
            key={g}
            onClick={(e) => {
              setGuide(g);
              e.currentTarget.blur();
            }}
            className={`rounded-full px-3 py-1 transition ${guide === g ? "bg-cyan-400 text-[#04102c]" : "text-cyan-100/80 hover:text-white"}`}
            aria-pressed={guide === g}
          >
            {GUIDE_LABEL[g]}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`select-none ${className}`}>
      {ghost && toolbar}
      <div ref={board} aria-hidden={!pad} style={{ marginBottom: showHands ? extra : undefined, touchAction: pad ? "manipulation" : undefined }} className={`relative mx-auto flex w-full ${pad ? "max-w-none" : "max-w-3xl"} flex-col rounded-[1.4rem] p-2 ${ghost ? "" : "border border-cyan-300/25 bg-[#0b1233]/85 shadow-[0_0_40px_-10px_rgba(47,211,255,0.5)] backdrop-blur"} ${compact ? "gap-1" : "gap-1.5 sm:p-3"}`}>
        {ROWS.map((r, ri) => (
          <div key={ri} className={`flex ${compact ? "gap-1" : "gap-1.5"} ${ri === 4 ? "justify-center" : ""}`}>
            {r.map((c, ci) => {
              const ch = c.k;
              const isShift = c.fn === "Shift";
              const id = capId(c, ci);
              const isNext = (nextCap && c === nextCap) || (isShift && ((shift === "L" && ci === 0) || (shift === "R" && ci > 0)));
              const on = all || (ch && (lit.has(ch) || (ch === " " && keys.includes(" "))));
              const isHot = ch && hot.has(ch);
              const bad = pressed && !pressed.ok && keyOf(pressed.ch) === c;
              const latched = pad && ((isShift && shiftOn) || (c.fn === "Caps" && capsOn));
              return (
                <Cap
                  key={ci}
                  id={id}
                  c={c}
                  on={!!on || !!isNext}
                  hot={!!isHot || !!latched}
                  next={!!isNext}
                  bad={!!bad}
                  compact={compact && !pad}
                  ghost={ghost}
                  tapped={tap?.id === id}
                  upper={pad && shiftOn !== capsOn}
                  onPress={pad ? () => press(c, id) : undefined}
                />
              );
            })}
          </div>
        ))}
        {showHands && <Hands board={board} next={next} onExtra={setExtra} />}
      </div>
      {!ghost && toolbar}
    </div>
  );
}

function GuideText({ next, shift }: { next?: string; shift?: "L" | "R" }) {
  if (next === undefined) return null;
  return <GuideLine next={next} shift={shift} />;
}

function GuideLine({ next, shift }: { next: string; shift?: "L" | "R" }) {
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
/** ảnh gp-hands (976x660); x đầu ngón út và ngón trỏ tay trái đo trên ảnh (tay phải đối xứng) */
const HANDS_W = 976;
const HANDS_H = 660;
const HANDS_MID = 488;
const TIP_X = { pinky: 100, index: 395 };
/** vùng tô màu từng ngón (gp-hand-<id>.webp, tách từ gp-hands): x0, y0, x1, y1 trên ảnh gốc */
const HAND_MASK: Record<string, [number, number, number, number]> = {
  L5: [50, 112, 142, 268], L4: [114, 67, 237, 266], L3: [193, 45, 322, 257], L2: [280, 80, 425, 285], LT: [340, 258, 462, 374],
  R5: [835, 112, 926, 268], R4: [740, 67, 863, 267], R3: [654, 45, 784, 257], R2: [551, 80, 696, 285], RT: [515, 258, 636, 374],
};
/** hàng đầu ngón trong ảnh ứng với tâm hàng phím cơ sở */
const HANDS_ROW_Y = 85;
/** chỉ giữ một đoạn cổ tay ngắn: cắt ảnh ở đây, mờ dần từ HANDS_FADE */
const HANDS_CUT = 440;
const HANDS_FADE = 360;

/**
 * Hai bàn tay ảo (viền liền khối, lòng kính mờ) đè lên bàn phím: tám ngón đặt trên hàng phím cơ sở, ngón cái trên phím cách.
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
      // chừa chỗ phía dưới bàn phím cho cẳng tay trong ảnh
      if (hasFile(HANDS_IMG) && out.a && out.f) {
        const sc = (out.f.x - out.a.x) / (TIP_X.index - TIP_X.pinky);
        onExtra(Math.max(0, Math.round(out.a.y + (HANDS_CUT - HANDS_ROW_Y) * sc - b.height)));
      } else onExtra(0);
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

  const right = pos[";"];
  const useImg = hasFile(HANDS_IMG) && right && pos.f && pos.j;
  const lit: { f: Finger; side: "L" | "R" }[] = [];
  if (active === "T") lit.push({ f: "T", side: "R" });
  else if (active) lit.push({ f: active, side: active.startsWith("L") ? "L" : "R" });
  if (sh) lit.push({ f: sh === "L" ? "L5" : "R5", side: sh });

  if (!useImg) {
    // chưa có ảnh: chỉ đánh dấu chỗ đặt 8 đầu ngón, ngón cần dùng thì sáng
    return (
      <div className="pointer-events-none absolute inset-0">
        {([...LEFT, ...RIGHT] as Finger[]).map((f) => {
          const at = pos[HOME[f as keyof typeof HOME]];
          const on = lit.some((l) => l.f === f);
          return (
            <span
              key={f}
              className="absolute rounded-full transition-all duration-150"
              style={{ left: at.x - kw * 0.3, top: at.y + kh * 0.05, width: kw * 0.6, height: kh * 0.42, border: `1.5px solid ${on ? FINGER_COLOR[f] : "rgb(235 248 255 / 0.6)"}`, borderBottom: "none", boxShadow: on ? `0 -4px 12px -2px ${FINGER_COLOR[f]}` : undefined }}
            />
          );
        })}
      </div>
    );
  }

  // mỗi bàn tay đặt riêng: đầu ngón út trùng A/;, đầu ngón trỏ trùng F/J
  const place = (side: "L" | "R") => {
    const [p5, p2] = side === "L" ? [pos.a, pos.f] : [right, pos.j];
    const x5 = side === "L" ? TIP_X.pinky : HANDS_W - TIP_X.pinky;
    const x2 = side === "L" ? TIP_X.index : HANDS_W - TIP_X.index;
    const sc = (p2.x - p5.x) / (x2 - x5);
    return { sc, tx: p5.x - x5 * sc, ty: p5.y - HANDS_ROW_Y * sc };
  };
  const H = Math.max(size.h, ...(["L", "R"] as const).map((sd) => { const q = place(sd); return q.ty + HANDS_CUT * q.sc; }));
  const src = resolveFile(HANDS_IMG);

  return (
    <svg className="pointer-events-none absolute left-0 top-0 w-full overflow-visible" style={{ height: H }} viewBox={`0 0 ${size.w} ${H}`} aria-hidden>
      <defs>
        <clipPath id={`${fid}-L`}>
          <rect x={0} y={0} width={HANDS_MID} height={HANDS_CUT} />
        </clipPath>
        <clipPath id={`${fid}-R`}>
          <rect x={HANDS_MID} y={0} width={HANDS_W - HANDS_MID} height={HANDS_CUT} />
        </clipPath>
        <linearGradient id={`${fid}-g`} gradientUnits="userSpaceOnUse" x1={0} y1={HANDS_FADE} x2={0} y2={HANDS_CUT}>
          <stop offset={0} stopColor="#fff" />
          <stop offset={1} stopColor="#000" />
        </linearGradient>
        <mask id={`${fid}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={HANDS_W} height={HANDS_CUT}>
          <rect x={0} y={0} width={HANDS_W} height={HANDS_CUT} fill={`url(#${fid}-g)`} />
        </mask>
      </defs>
      {(["L", "R"] as const).map((side) => {
        const { sc, tx, ty } = place(side);
        return (
          <g key={side} transform={`translate(${tx} ${ty}) scale(${sc})`}>
            {lit
              .filter((l) => l.side === side)
              .map(({ f }) => {
                const id = f === "T" ? `${side}T` : f;
                const [x0, y0, x1, y1] = HAND_MASK[id];
                const m = `/assets/img/gp-hand-${id}.webp`;
                if (!hasFile(m)) return null;
                return <image key={f} href={resolveFile(m)} x={x0} y={y0} width={x1 - x0} height={y1 - y0} opacity={0.55} style={{ filter: `drop-shadow(0 0 10px ${FINGER_COLOR[f]})` }} />;
              })}
            <g mask={`url(#${fid}-m)`}>
              <image href={src} width={HANDS_W} height={HANDS_H} clipPath={`url(#${fid}-${side})`} opacity={0.9} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function Cap({
  id, c, on, hot, next, bad, compact, ghost, tapped = false, upper = false, onPress,
}: {
  id: string; c: KeyCap; on: boolean; hot: boolean; next: boolean; bad: boolean; compact: boolean; ghost: boolean;
  tapped?: boolean; upper?: boolean; onPress?: () => void;
}) {
  const color = FINGER_COLOR[c.f];
  const label = c.fn !== undefined ? c.fn : onPress ? (upper ? (c.s ?? c.k.toUpperCase()) : c.k) : c.k === ";" ? ";" : c.k.toUpperCase();
  const bump = c.k === "f" || c.k === "j";
  return (
    <div
      data-k={id}
      role={onPress ? "button" : undefined}
      aria-label={onPress ? (c.k === " " ? "Phím cách" : label) : undefined}
      onPointerDown={onPress ? (e) => { e.preventDefault(); onPress(); } : undefined}
      className={`relative grid place-items-center rounded-lg font-mono font-bold transition-all duration-150 ${onPress ? "h-12 cursor-pointer text-lg sm:h-16 sm:text-xl" : compact ? "h-7 text-[11px] sm:h-8 sm:text-xs" : "h-9 text-xs sm:h-11 sm:text-sm"} ${next ? "key-next" : ""} ${tapped ? "scale-95" : ""}`}
      style={ghost ? {
        flex: `${c.w ?? 1} 1 0`,
        minWidth: 0,
        color: next ? "#fff" : on ? `color-mix(in srgb, ${color} 55%, #fff)` : onPress ? "rgb(220 235 255 / 0.9)" : "rgb(200 220 255 / 0.45)",
        background: tapped ? `color-mix(in srgb, ${color} 70%, transparent)` : bad ? "rgb(255 61 110 / 0.45)" : next ? `color-mix(in srgb, ${color} 30%, transparent)` : hot ? `color-mix(in srgb, ${color} 12%, transparent)` : onPress ? "rgb(9 20 64 / 0.62)" : "transparent",
        boxShadow: next ? `0 0 14px -2px ${color}, inset 0 0 0 2px ${color}` : on ? `inset 0 0 0 1.5px color-mix(in srgb, ${color} 75%, transparent)` : onPress ? "inset 0 0 0 1px rgb(200 220 255 / 0.4)" : "inset 0 0 0 1px rgb(200 220 255 / 0.25)",
        textShadow: "0 1px 3px rgb(0 0 0 / 0.7)",
      } : {
        flex: `${c.w ?? 1} 1 0`,
        minWidth: 0,
        color: on ? "#fff" : "rgb(160 175 220 / 0.45)",
        background: tapped ? `color-mix(in srgb, ${color} 80%, #fff)` : bad ? "#ff3d6e" : next ? color : on ? `color-mix(in srgb, ${color} ${hot ? 55 : 28}%, #0d1640)` : "#121a45",
        boxShadow: next ? `0 0 18px 2px ${color}` : hot ? `0 0 12px -2px ${color}, inset 0 0 0 1.5px ${color}` : on ? `inset 0 0 0 1px color-mix(in srgb, ${color} 60%, transparent)` : "inset 0 0 0 1px rgb(120 140 210 / 0.15)",
        textShadow: next ? "0 1px 2px rgb(0 0 0 / 0.5)" : undefined,
      }}
    >
      {label}
      {bump && <span className="absolute bottom-1 h-0.5 w-2.5 rounded-full bg-white/70" />}
    </div>
  );
}
