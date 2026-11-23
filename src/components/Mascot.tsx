"use client";
import { useState } from "react";
import type { Mood } from "@/content/types";
import { hasFile, resolveFile } from "@/content/assets";

/**
 * Nhân vật dẫn chuyện. Mochi (mèo, mặc định) hoặc thỏ Bit (môn Gõ phím, tông công nghệ).
 * Dùng ảnh /assets/img/<mochi|bit>-<mood>.webp nếu có, không thì vẽ bằng SVG.
 */
export function Mascot({ mood = "happy", size = 96, className = "", who = "mochi" }: { mood?: Mood; size?: number; className?: string; who?: "mochi" | "bit" }) {
  const [failed, setFailed] = useState(false);
  const file = `/assets/img/${who}-${mood}.webp`;
  if (!failed && hasFile(file)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolveFile(file)}
        width={size}
        height={size}
        alt={who === "bit" ? "Bit" : "Mochi"}
        className={`select-none ${className}`}
        style={{ width: size, height: size, objectFit: "contain" }}
        onError={() => setFailed(true)}
        draggable={false}
      />
    );
  }
  if (who === "bit") return <BitSvg mood={mood} size={size} className={className} />;
  return <MochiSvg mood={mood} size={size} className={className} />;
}

/** Thỏ Bit: thỏ trắng bạc, tai có đèn LED, kính visor neon, áo khoác kỹ thuật */
function BitSvg({ mood, size, className }: { mood: Mood; size: number; className: string }) {
  const visor = mood === "oops" ? "#ffb020" : mood === "cheer" || mood === "wow" ? "#ff4fa3" : "#2fd3ff";
  const mouth =
    mood === "wow" ? <ellipse cx="60" cy="80" rx="4" ry="5" fill="#0b1233" /> : mood === "oops" ? <path d="M53 81 q7 -5 14 0" stroke="#0b1233" strokeWidth="3" fill="none" strokeLinecap="round" /> : <path d="M52 78 q8 7 16 0" stroke="#0b1233" strokeWidth="3" fill="none" strokeLinecap="round" />;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label="Bit">
      <path d="M40 46 C 28 4, 46 -2, 52 40" fill="#eef2fb" stroke="#0b1233" strokeWidth="2.5" />
      <path d="M70 40 C 76 -2, 96 4, 82 46" fill="#eef2fb" stroke="#0b1233" strokeWidth="2.5" />
      <path d="M42 38 C 36 14, 46 10, 49 38" fill="#ff9ccf" />
      <path d="M73 38 C 76 10, 88 14, 80 38" fill="#ff9ccf" />
      <circle cx="38" cy="10" r="4" fill="#2fd3ff" className="blink" />
      <circle cx="86" cy="10" r="4" fill="#ff4fa3" className="blink" />
      <path d="M24 112 Q 28 92 60 92 Q 92 92 96 112 Z" fill="#141d52" stroke="#2fd3ff" strokeWidth="2" />
      <path d="M48 96 L 60 108 L 72 96" stroke="#2fd3ff" strokeWidth="2" fill="none" />
      <ellipse cx="60" cy="66" rx="32" ry="29" fill="#eef2fb" stroke="#0b1233" strokeWidth="2.5" />
      <rect x="32" y="54" width="56" height="16" rx="8" fill="#0b1233" />
      <rect x="36" y="58" width="48" height="6" rx="3" fill={visor} />
      {mood === "think" && <rect x="36" y="58" width="20" height="6" rx="3" fill="#fff" opacity="0.6" />}
      <path d="M57 74 l3 3 l3 -3 z" fill="#ff7aa8" />
      {mouth}
      <ellipse cx="36" cy="78" rx="5" ry="3" fill="#ffb3d1" opacity="0.7" />
      <ellipse cx="84" cy="78" rx="5" ry="3" fill="#ffb3d1" opacity="0.7" />
      {mood === "cheer" && <path d="M100 30 l4 8 l8 1 l-6 6 l2 8 l-8 -4 l-8 4 l2 -8 l-6 -6 l8 -1 z" fill="#ffb020" />}
    </svg>
  );
}

function MochiSvg({ mood, size, className }: { mood: Mood; size: number; className: string }) {
  const eyes =
    mood === "happy" || mood === "cheer" ? (
      <>
        <path d="M38 52 q6 -7 12 0" stroke="#2d3047" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M70 52 q6 -7 12 0" stroke="#2d3047" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>
    ) : mood === "oops" ? (
      <>
        <path d="M38 50 l10 4 M38 56 l10 -4" stroke="#2d3047" strokeWidth="3" strokeLinecap="round" />
        <path d="M72 54 l10 -4 M72 50 l10 4" stroke="#2d3047" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 30 q4 8 0 12 q-4 -4 0 -12" fill="#9ad8ff" />
      </>
    ) : (
      <>
        <ellipse cx="44" cy="52" rx="7" ry={mood === "wow" ? 9 : 8} fill="#2d3047" />
        <ellipse cx="76" cy="52" rx="7" ry={mood === "wow" ? 9 : 8} fill="#2d3047" />
        <circle cx="46.5" cy="48.5" r="2.6" fill="#fff" />
        <circle cx="78.5" cy="48.5" r="2.6" fill="#fff" />
        <ellipse cx="44" cy="55" rx="4" ry="3" fill="#5fcfae" opacity="0.6" />
        <ellipse cx="76" cy="55" rx="4" ry="3" fill="#5fcfae" opacity="0.6" />
      </>
    );
  const mouth =
    mood === "wow" ? <ellipse cx="60" cy="68" rx="4" ry="5" fill="#ff7a9a" /> : mood === "think" ? <path d="M54 68 h12" stroke="#2d3047" strokeWidth="3" strokeLinecap="round" /> : <path d="M52 65 q4 5 8 0 q4 5 8 0" stroke="#2d3047" strokeWidth="3" fill="none" strokeLinecap="round" />;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label="Mochi">
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#2d3047" opacity="0.08" />
      <path d="M24 40 L30 10 L50 28 Z" fill="#fff" stroke="#e6e1ef" strokeWidth="2" />
      <path d="M96 40 L90 10 L70 28 Z" fill="#fff" stroke="#e6e1ef" strokeWidth="2" />
      <path d="M30 34 L33 18 L44 28 Z" fill="#ffc6d3" />
      <path d="M90 34 L87 18 L76 28 Z" fill="#ffc6d3" />
      <ellipse cx="60" cy="62" rx="42" ry="38" fill="#fff" stroke="#e6e1ef" strokeWidth="2" />
      {eyes}
      <path d="M57 60 l3 3 l3 -3 z" fill="#ff9fb2" />
      {mouth}
      <ellipse cx="32" cy="64" rx="7" ry="4" fill="#ffc6d3" opacity="0.7" />
      <ellipse cx="88" cy="64" rx="7" ry="4" fill="#ffc6d3" opacity="0.7" />
      <path d="M26 88 q34 16 68 0 l-4 10 q-30 12 -60 0 z" fill="#7c9cff" />
      <rect x="78" y="92" width="10" height="16" rx="3" fill="#7c9cff" />
      {mood === "cheer" && (
        <>
          <circle cx="14" cy="24" r="3" fill="#ffcf5c" />
          <circle cx="106" cy="18" r="3" fill="#ff7a9a" />
          <circle cx="110" cy="44" r="2.5" fill="#5fcfae" />
        </>
      )}
      {mood === "think" && <text x="96" y="22" fontSize="18" fill="#b49cff" fontWeight="bold">?</text>}
    </svg>
  );
}
