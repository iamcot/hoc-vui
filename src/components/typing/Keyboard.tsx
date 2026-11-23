"use client";
import { FINGER_COLOR, FINGER_NAME, ROWS, fingerOf, keyOf, needsShift, shiftSide, type KeyCap } from "@/lib/typing/keyboard";

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

  return (
    <div className={`select-none ${className}`} aria-hidden>
      <div className={`mx-auto flex w-full max-w-3xl flex-col rounded-[1.4rem] border border-cyan-300/25 bg-[#0b1233]/85 p-2 shadow-[0_0_40px_-10px_rgba(47,211,255,0.5)] backdrop-blur ${compact ? "gap-1" : "gap-1.5 sm:p-3"}`}>
        {ROWS.map((r, ri) => (
          <div key={ri} className={`flex ${compact ? "gap-1" : "gap-1.5"} ${ri === 4 ? "justify-center" : ""}`}>
            {r.map((c, ci) => {
              const ch = c.k;
              const isShift = c.fn === "Shift";
              const isNext = (nextCap && c === nextCap) || (isShift && ((shift === "L" && ci === 0) || (shift === "R" && ci > 0)));
              const on = all || (ch && (lit.has(ch) || (ch === " " && keys.includes(" "))));
              const isHot = ch && hot.has(ch);
              const bad = pressed && !pressed.ok && keyOf(pressed.ch) === c;
              return <Cap key={ci} c={c} on={!!on || !!isNext} hot={!!isHot} next={!!isNext} bad={!!bad} compact={compact} />;
            })}
          </div>
        ))}
      </div>
      {next !== undefined && (
        <p className="mt-2 text-center text-sm font-bold text-cyan-100/90">
          {next === " " ? "Ngón cái: phím cách" : (
            <>
              Ngón <span style={{ color: FINGER_COLOR[fingerOf(next) ?? "T"] }}>{FINGER_NAME[fingerOf(next) ?? "T"]}</span>
              {needsShift(next) && <> + Shift bằng ngón út {shift === "L" ? "trái" : "phải"}</>}
            </>
          )}
        </p>
      )}
    </div>
  );
}

function Cap({ c, on, hot, next, bad, compact }: { c: KeyCap; on: boolean; hot: boolean; next: boolean; bad: boolean; compact: boolean }) {
  const color = FINGER_COLOR[c.f];
  const label = c.fn !== undefined ? c.fn : c.k === ";" ? ";" : c.k.toUpperCase();
  const bump = c.k === "f" || c.k === "j";
  return (
    <div
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
