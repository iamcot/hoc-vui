"use client";
import { useMemo } from "react";

const COLORS = ["#7c9cff", "#ffad8a", "#5fcfae", "#ffcf5c", "#ff7a9a", "#b49cff"];

export function Confetti({ count = 40 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.6,
        dx: `${(Math.random() - 0.5) * 30}vw`,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        round: Math.random() > 0.5,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * (b.round ? 1 : 0.5),
            background: b.color,
            borderRadius: b.round ? "999px" : "2px",
            animation: `confetti-fall ${b.dur}s ${b.delay}s ease-in forwards`,
            ["--dx" as string]: b.dx,
          }}
        />
      ))}
    </div>
  );
}
