"use client";
import { useState } from "react";
import type { Mood } from "@/content/types";
import { hasFile } from "@/content/assets";

/** Mochi. Dùng ảnh /assets/img/mochi-<mood>.webp nếu có, không thì vẽ bằng SVG. */
export function Mascot({ mood = "happy", size = 96, className = "" }: { mood?: Mood; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!failed && hasFile(`/assets/img/mochi-${mood}.webp`)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/assets/img/mochi-${mood}.webp`}
        width={size}
        height={size}
        alt="Mochi"
        className={`select-none ${className}`}
        style={{ width: size, height: size, objectFit: "contain" }}
        onError={() => setFailed(true)}
        draggable={false}
      />
    );
  }
  return <MochiSvg mood={mood} size={size} className={className} />;
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
