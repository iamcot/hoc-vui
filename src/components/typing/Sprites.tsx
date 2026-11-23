"use client";
import { hasFile, resolveFile } from "@/content/assets";

export type FishKind = "fish" | "jelly" | "shark" | "boss";

const IMG: Record<FishKind, string> = { fish: "gp-fish", jelly: "gp-jelly", shark: "gp-shark", boss: "gp-boss" };

function Img({ id, className = "" }: { id: string; className?: string }) {
  const f = `/assets/img/${id}.webp`;
  if (!hasFile(f)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolveFile(f)} alt="" draggable={false} className={`h-auto w-full select-none ${className}`} />;
}

/** Thỏ Bit trong bộ đồ lặn neon, cầm súng laser hình bàn phím. Có ảnh gp-bit-diver thì dùng ảnh. */
export function Diver() {
  if (hasFile("/assets/img/gp-bit-diver.webp")) return <Img id="gp-bit-diver" className="drop-shadow-[0_0_24px_rgba(47,211,255,0.55)]" />;
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full drop-shadow-[0_0_22px_rgba(47,211,255,0.6)]">
      {/* bình dưỡng khí */}
      <rect x="40" y="92" width="26" height="62" rx="12" fill="#1b2560" stroke="#2fd3ff" strokeWidth="2" />
      {/* tai thỏ, đầu tai đèn LED */}
      <path d="M86 52 C 74 10, 92 4, 98 48" fill="#e9eef9" stroke="#0b1233" strokeWidth="3" />
      <path d="M112 50 C 120 6, 140 10, 124 54" fill="#e9eef9" stroke="#0b1233" strokeWidth="3" />
      <path d="M88 44 C 82 18, 92 14, 95 44" fill="#ff9ccf" />
      <path d="M115 44 C 121 16, 132 20, 122 46" fill="#ff9ccf" />
      <circle cx="84" cy="16" r="4" fill="#2fd3ff" className="blink" />
      <circle cx="134" cy="18" r="4" fill="#ff4fa3" className="blink" />
      {/* thân bộ đồ lặn */}
      <path d="M62 112 Q 64 92 100 92 Q 138 92 140 116 L 136 160 Q 100 176 66 160 Z" fill="#141d52" stroke="#2fd3ff" strokeWidth="2.5" />
      <path d="M74 120 L 128 120 M 80 140 L 124 140" stroke="#2fd3ff" strokeWidth="2" opacity="0.7" />
      <path d="M100 96 L 100 166" stroke="#ff4fa3" strokeWidth="2" opacity="0.6" />
      {/* đầu + mũ kính */}
      <circle cx="104" cy="70" r="30" fill="#e9eef9" stroke="#0b1233" strokeWidth="3" />
      <circle cx="104" cy="70" r="38" fill="#7fe8ff" opacity="0.14" stroke="#9ff0ff" strokeWidth="3" />
      <path d="M78 52 Q 86 40 100 38" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" fill="none" />
      {/* kính visor ngầu */}
      <rect x="86" y="60" width="44" height="14" rx="7" fill="#0b1233" />
      <rect x="90" y="63" width="36" height="5" rx="2.5" fill="#2fd3ff" opacity="0.9" />
      <path d="M100 84 q 5 4 10 0" stroke="#0b1233" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* súng laser bàn phím */}
      <rect x="120" y="118" width="62" height="22" rx="6" fill="#0b1233" stroke="#2fd3ff" strokeWidth="2.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={126 + i * 10} y="123" width="7" height="5" rx="1.5" fill="#2fd3ff" opacity={0.5 + (i % 2) * 0.4} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={130 + i * 10} y="131" width="7" height="5" rx="1.5" fill="#7c6bff" />
      ))}
      <circle cx="186" cy="129" r="5" fill="#2fd3ff" className="blink" />
      <path d="M120 128 Q 108 134 112 146" stroke="#e9eef9" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* chân vịt */}
      <path d="M72 160 L 58 186 L 84 182 Z M 118 162 L 116 190 L 140 182 Z" fill="#7c6bff" stroke="#0b1233" strokeWidth="2" />
    </svg>
  );
}

/** Cá neon bơi sang trái. Có ảnh gp-fish/gp-shark/gp-boss/gp-jelly thì dùng ảnh. */
export function FishSprite({ kind, locked }: { kind: FishKind; locked?: boolean }) {
  const glow = locked ? "drop-shadow-[0_0_18px_rgba(255,79,163,0.9)]" : "drop-shadow-[0_0_12px_rgba(47,211,255,0.45)]";
  if (hasFile(`/assets/img/${IMG[kind]}.webp`)) return <Img id={IMG[kind]} className={glow} />;
  if (kind === "jelly")
    return (
      <svg viewBox="0 0 120 120" className={`swim h-auto w-full ${glow}`}>
        <path d="M20 60 Q 20 18 60 18 Q 100 18 100 60 Z" fill="#7c6bff" opacity="0.85" stroke="#d7ccff" strokeWidth="3" />
        {[30, 45, 60, 75, 90].map((x) => (
          <path key={x} d={`M${x} 60 q -6 14 0 28 q 6 14 0 26`} stroke="#ff9ccf" strokeWidth="3" fill="none" opacity="0.8" />
        ))}
        <circle cx="46" cy="44" r="5" fill="#0b1233" />
        <circle cx="74" cy="44" r="5" fill="#0b1233" />
      </svg>
    );
  if (kind === "fish")
    return (
      <svg viewBox="0 0 140 90" className={`swim h-auto w-full ${glow}`}>
        <path d="M14 45 Q 50 6 104 40 L 134 18 L 128 45 L 134 72 L 104 50 Q 50 84 14 45 Z" fill="#ffb020" stroke="#fff2c4" strokeWidth="3" />
        <path d="M60 22 L 70 45 L 60 68" stroke="#ff7a00" strokeWidth="4" fill="none" />
        <circle cx="34" cy="40" r="6" fill="#0b1233" />
        <circle cx="32" cy="38" r="2" fill="#fff" />
      </svg>
    );
  const boss = kind === "boss";
  return (
    <svg viewBox="0 0 260 130" className={`swim h-auto w-full ${glow}`}>
      {/* vây lưng, đuôi */}
      <path d="M118 30 L 140 -2 L 158 34 Z" fill={boss ? "#3a1550" : "#1b2a66"} stroke={boss ? "#ff4fa3" : "#2fd3ff"} strokeWidth="3" />
      <path d="M214 62 L 256 18 L 244 66 L 258 112 Z" fill={boss ? "#3a1550" : "#1b2a66"} stroke={boss ? "#ff4fa3" : "#2fd3ff"} strokeWidth="3" />
      {/* thân cá mập máy */}
      <path d="M6 70 Q 40 26 120 30 Q 190 34 222 64 Q 190 100 120 104 Q 46 106 6 70 Z" fill={boss ? "#2a0f3d" : "#16224f"} stroke={boss ? "#ff4fa3" : "#2fd3ff"} strokeWidth="3.5" />
      <path d="M6 70 Q 60 96 150 92" fill="none" stroke="#c7d2ff" strokeWidth="2" opacity="0.4" />
      {/* răng */}
      <path d="M14 76 l 6 6 l 4 -7 l 5 7 l 4 -7 l 5 6" stroke="#fff" strokeWidth="2.5" fill="none" />
      {/* mắt đèn */}
      <circle cx="44" cy="56" r="8" fill={boss ? "#ff4fa3" : "#ff3d6e"} className="blink" />
      <path d="M36 46 L 56 50" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* mang dạng mạch điện */}
      <path d="M78 52 v 28 M 88 50 v 32 M 98 52 v 28" stroke={boss ? "#ff4fa3" : "#2fd3ff"} strokeWidth="3" opacity="0.8" />
      <path d="M100 104 L 118 124 L 126 102" fill={boss ? "#3a1550" : "#1b2a66"} stroke={boss ? "#ff4fa3" : "#2fd3ff"} strokeWidth="3" />
    </svg>
  );
}
