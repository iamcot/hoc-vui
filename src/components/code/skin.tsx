"use client";
import { createContext, useContext, type CSSProperties } from "react";
import { JetBrains_Mono, Space_Grotesk, VT323 } from "next/font/google";
import { Mascot } from "@/components/Mascot";
import type { Mood } from "@/content/types";
import { SKINS, type Skin } from "@/lib/code/skins";

/**
 * Giao diện của môn Lập trình: ngữ cảnh + hình vẽ từng giao diện (nhân vật, ô sân, sao, cờ).
 * Mặc định là Neon để các chỗ dùng Stage ngoài bài học (nếu có) vẫn như cũ.
 */

const pixel = VT323({ subsets: ["latin", "vietnamese"], weight: "400", variable: "--font-pixel", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin", "vietnamese"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono-hud", display: "swap" });
export const skinFonts = `${pixel.variable} ${grotesk.variable} ${mono.variable}`;

const Ctx = createContext<Skin>(SKINS.neon);
export const SkinProvider = Ctx.Provider;
export const useSkin = () => useContext(Ctx);

/* ───────── nhân vật ───────── */

const PIXEL_CAT = ["..x......x..", ".xxx....xxx.", ".xxxxxxxxxx.", "xxxxxxxxxxxx", "xxkxxxxxkxxx", "xxkxxxxxkxxx", "xxxxxppxxxxx", "xxxxxxxxxxxx", ".xxxxxxxxxx.", "..xx....xx.."];
const PIXEL_CHEER = ["..x......x..", ".xxx....xxx.", ".xxxxxxxxxx.", "xxxxxxxxxxxx", "xkxkxxxxkxkx", "xxkxxxxxxkxx", "xxxxxppxxxxx", "xxxxkkkkxxxx", ".xxxxxxxxxx.", "..xx....xx.."];
const PIXEL_OOPS = ["..x......x..", ".xxx....xxx.", ".xxxxxxxxxx.", "xxxxxxxxxxxx", "xkxkxxxkxkxx", "xxkxxxxxkxxx", "xkxkxpxkxkxx", "xxxxxxxxxxxx", ".xxxxkkxxxx.", "..xx....xx.."];

function PixelCat({ size, mood }: { size: number; mood: Mood }) {
  const rows = mood === "cheer" ? PIXEL_CHEER : mood === "oops" ? PIXEL_OOPS : PIXEL_CAT;
  const fill = { x: "#ffffff", k: "#1d1033", p: "#ff77a8" } as const;
  return (
    <svg width={size} height={size} viewBox="-1 -1 14 14" shapeRendering="crispEdges" aria-hidden>
      {/* viền đen kiểu sprite */}
      {rows.map((r, y) => [...r].map((ch, x) => (ch === "." ? null : <rect key={`o${x}-${y}`} x={x - 0.5} y={y + 1.5} width={2} height={2} fill="#000" />)))}
      {rows.map((r, y) => [...r].map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y + 2} width={1} height={1} fill={fill[ch as keyof typeof fill]} />)))}
      <rect x={5} y={0.5} width={2} height={1} fill="#ffec27" />
      <rect x={4} y={1.5} width={4} height={0.6} fill="#ffa300" />
    </svg>
  );
}

function RobotCat({ size, mood }: { size: number; mood: Mood }) {
  const eye = "#2fd9a0";
  const eyes =
    mood === "cheer" ? (
      <g stroke={eye} strokeWidth={2.4} fill="none" strokeLinecap="round">
        <path d="M12.5 21 q2.5 -3 5 0" />
        <path d="M22.5 21 q2.5 -3 5 0" />
      </g>
    ) : mood === "oops" ? (
      <g stroke="#ff5a7a" strokeWidth={2.2} strokeLinecap="round">
        <path d="M13 17.5 l4 4 M17 17.5 l-4 4 M23 17.5 l4 4 M27 17.5 l-4 4" />
      </g>
    ) : mood === "think" ? (
      <g fill={eye}>
        <rect x={13} y={18} width={4.5} height={4.5} rx={2.2} />
        <rect x={22.5} y={19.5} width={4.5} height={2} rx={1} />
      </g>
    ) : (
      <g fill={eye}>
        <rect x={13} y={17} width={4.5} height={5.5} rx={2.2} />
        <rect x={22.5} y={17} width={4.5} height={5.5} rx={2.2} />
      </g>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <line x1={20} y1={7} x2={20} y2={2.5} stroke="#2b2f55" strokeWidth={2} />
      <circle cx={20} cy={2.6} r={2.4} fill="#ff5a7a" />
      {/* tai mèo */}
      <path d="M7 14 L9 4.5 L15.5 9.5 Z M33 14 L31 4.5 L24.5 9.5 Z" fill="#ffffff" stroke="#2b2f55" strokeWidth={2} strokeLinejoin="round" />
      <path d="M9.6 8.4 L10.4 11 L12.6 9.6 Z M30.4 8.4 L29.6 11 L27.4 9.6 Z" fill="#ffb3c4" />
      <rect x={5} y={8} width={30} height={24} rx={10} fill="#ffffff" stroke="#2b2f55" strokeWidth={2.4} />
      <rect x={9} y={12.5} width={22} height={14} rx={6} fill="#2b2f55" />
      {eyes}
      <circle cx={9.5} cy={28.5} r={1.8} fill="#ffb3c4" />
      <circle cx={30.5} cy={28.5} r={1.8} fill="#ffb3c4" />
      <rect x={11} y={32} width={6.5} height={5.5} rx={2.4} fill="#5b7cff" stroke="#2b2f55" strokeWidth={1.6} />
      <rect x={22.5} y={32} width={6.5} height={5.5} rx={2.4} fill="#5b7cff" stroke="#2b2f55" strokeWidth={1.6} />
    </svg>
  );
}

/** Mochi hologram: khung dây phát sáng, có vạch quét. `beam` thêm bệ chiếu và tia sáng (dùng trên sân 3D) */
export function HoloCat({ size, mood, beam }: { size: number; mood: Mood; beam?: boolean }) {
  const h = beam ? size * 1.28 : size;
  return (
    <svg width={size} height={h} viewBox={beam ? "0 0 58 74" : "4 4 50 46"} style={{ overflow: "visible" }} aria-hidden>
      <defs>
        <linearGradient id="lt-holo-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4ff0ff" stopOpacity=".55" />
          <stop offset="1" stopColor="#4ff0ff" stopOpacity="0" />
        </linearGradient>
        <pattern id="lt-holo-lines" width="4" height="3" patternUnits="userSpaceOnUse">
          <rect width="4" height="1.2" fill="#bffbff" opacity=".5" />
        </pattern>
      </defs>
      {beam && <path d="M6 72 L29 22 L52 72Z" fill="url(#lt-holo-beam)" />}
      <g style={{ filter: "drop-shadow(0 0 5px #4ff0ff)" }}>
        <path d="M14 22 L17 6 L26 15 Z M44 22 L41 6 L32 15 Z" fill="#4ff0ff30" stroke="#bffbff" strokeWidth={1.6} strokeLinejoin="round" />
        <ellipse cx={29} cy={30} rx={19} ry={17} fill="#4ff0ff28" stroke="#bffbff" strokeWidth={1.8} />
        <ellipse cx={29} cy={30} rx={19} ry={17} fill="url(#lt-holo-lines)" />
        <path d="M12 30 Q29 22 46 30 M14 38 Q29 32 44 38" stroke="#4ff0ff" strokeWidth={0.7} fill="none" opacity={0.7} />
        {mood === "cheer" ? (
          <path d="M19 30 q3 -4 6 0 M33 30 q3 -4 6 0" stroke="#eaffff" strokeWidth={2} fill="none" strokeLinecap="round" />
        ) : mood === "oops" ? (
          <path d="M19.5 26.5 l5 5 M24.5 26.5 l-5 5 M33.5 26.5 l5 5 M38.5 26.5 l-5 5" stroke="#ff5fa8" strokeWidth={2} strokeLinecap="round" />
        ) : (
          <>
            <circle cx={22} cy={29} r={2.8} fill="#eaffff" />
            <circle cx={36} cy={29} r={2.8} fill="#eaffff" />
          </>
        )}
        <path d="M26 36 q3 3 6 0" stroke="#eaffff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
      {beam && <ellipse cx={29} cy={72} rx={20} ry={5} fill="none" stroke="#4ff0ff" strokeWidth={1.5} />}
    </svg>
  );
}

/** nhân vật theo giao diện */
export function Hero({ skin, size, mood = "happy" }: { skin: Skin; size: number; mood?: Mood }) {
  if (skin.id === "pixel") return <PixelCat size={size} mood={mood} />;
  if (skin.id === "robot") return <RobotCat size={size} mood={mood} />;
  if (skin.id === "holo") return <HoloCat size={size} mood={mood} />;
  return <Mascot mood={mood} size={size} />;
}

/* ───────── ô sân, sao, cờ ───────── */

export function Floor({ skin, x, y }: { skin: Skin; x: number; y: number }) {
  const light = (x + y) % 2 === 0;
  if (skin.id === "pixel")
    return (
      <div className="h-full w-full" style={{ background: light ? "#3a8f2f" : "#46a83a" }}>
        <svg viewBox="0 0 8 8" className="h-full w-full" shapeRendering="crispEdges">
          <rect x={(x * 3 + y) % 5} y={2} width={1} height={1} fill="#2a6b22" />
          <rect x={((x + y * 2) % 4) + 3} y={5} width={1} height={1} fill="#2a6b22" />
        </svg>
      </div>
    );
  if (skin.id === "robot") return <div className="h-full w-full rounded-[22%] bg-white" style={{ boxShadow: "0 4px 0 #d3dbf7" }} />;
  return (
    <div
      className="h-full w-full"
      style={{
        background: light ? "#0c1a55" : "#0a1647",
        boxShadow: "inset 0 0 0 0.5px rgb(47 211 255 / 0.22)",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgb(47 211 255 / 0.28) 0 1.5px, transparent 2px)",
      }}
    />
  );
}

export function Wall({ skin }: { skin: Skin }) {
  if (skin.id === "pixel")
    return (
      <svg viewBox="0 0 8 8" className="h-full w-full" shapeRendering="crispEdges">
        <rect width={8} height={8} fill="#7a4a24" />
        <rect width={8} height={1} fill="#a8693a" />
        <rect width={1} height={8} fill="#a8693a" />
        <rect y={7} width={8} height={1} fill="#4b2c13" />
        <rect x={7} width={1} height={8} fill="#4b2c13" />
        <rect x={1} y={3.5} width={6} height={0.6} fill="#4b2c13" />
        <rect x={3.5} y={1} width={0.6} height={2.5} fill="#4b2c13" />
        <rect x={2} y={4.1} width={0.6} height={2.9} fill="#4b2c13" />
        <rect x={5.4} y={4.1} width={0.6} height={2.9} fill="#4b2c13" />
      </svg>
    );
  if (skin.id === "robot")
    return (
      <div className="grid h-full w-full -translate-y-[6%] place-items-center rounded-[22%]" style={{ background: "#8f9bd6", boxShadow: "0 6px 0 #6571b4" }}>
        <div className="h-[24%] w-[24%] rounded-full" style={{ background: "#ffcf4a", boxShadow: "0 0 0 4px #ffffff60" }} />
      </div>
    );
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <defs>
        <linearGradient id="lt-rock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2a8f" />
          <stop offset="1" stopColor="#1a1250" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="34" height="34" rx="7" fill="url(#lt-rock)" stroke="#9b7bff" strokeWidth="1.6" style={{ filter: "drop-shadow(0 0 3px #7c4dff)" }} />
      <path d="M9 14 h10 v6 h8" stroke="#c9b5ff" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <circle cx="27" cy="20" r="1.8" fill="#ff4fa3" />
      <circle cx="12" cy="28" r="1.4" fill="#2fd3ff" />
    </svg>
  );
}

export function Water({ skin }: { skin: Skin }) {
  if (skin.id === "pixel")
    return (
      <svg viewBox="0 0 8 8" className="h-full w-full" shapeRendering="crispEdges">
        <rect width={8} height={8} fill="#1d5bd8" />
        <rect x={1} y={2} width={3} height={1} fill="#6fb6ff" />
        <rect x={4} y={5} width={3} height={1} fill="#6fb6ff" />
      </svg>
    );
  if (skin.id === "robot")
    return (
      <div className="h-full w-full rounded-[22%]" style={{ background: "linear-gradient(#7fc4ff,#4f8dff)", boxShadow: "0 4px 0 #3a6ad6" }}>
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <path d="M8 16 q4 -4 8 0 t8 0 t8 0 M8 26 q4 -4 8 0 t8 0 t8 0" stroke="#ffffffa0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  return <div className="h-full w-full" style={{ background: "linear-gradient(160deg,#003a66,#001a3d)", boxShadow: "inset 0 0 12px rgb(47 211 255 / 0.6)" }} />;
}

export function StarArt({ skin, size }: { skin: Skin; size: number }) {
  if (skin.id === "pixel")
    return (
      <svg width={size} height={size} viewBox="-0.5 -0.5 9 9" shapeRendering="crispEdges">
        <path d="M3 0h2v2h3v2h-1v1h1v3h-2v-1h-2v1h-2v-3h1v-1h-1v-2h3z" fill="#ffec27" stroke="#000" strokeWidth={0.5} />
        <rect x={3} y={2} width={1} height={1} fill="#fff" />
      </svg>
    );
  if (skin.id === "robot")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <ellipse cx="20" cy="35" rx="11" ry="3" fill="#2b2f5520" />
        <circle cx="20" cy="18" r="14" fill="#ffcf4a" stroke="#e0a91c" strokeWidth="3" />
        <path d="M20 9 l2.6 5.4 5.9 .8 -4.3 4.1 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.1 5.9 -.8z" fill="#fff" />
      </svg>
    );
  if (skin.id === "holo")
    return (
      <svg width={size * 0.7} height={size} viewBox="0 0 30 46" style={{ filter: "drop-shadow(0 0 8px #ffb547)" }}>
        <path d="M15 2 L27 16 L15 34 L3 16Z" fill="#ffb54755" stroke="#ffd79b" strokeWidth="1.5" />
        <path d="M15 2 L15 34 M3 16 L27 16" stroke="#ffe8c4" strokeWidth=".8" opacity=".8" />
        <path d="M15 2 L9 16 L15 34" fill="#ffffff30" />
        <ellipse cx="15" cy="44" rx="8" ry="2" fill="#ffb54770" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <path
        d="M20 3 l5 10.5 11.5 1.6 -8.3 8 2 11.4 -10.2 -5.4 -10.2 5.4 2 -11.4 -8.3 -8 11.5 -1.6z"
        fill="#ffd23f"
        stroke="#fff3b0"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 6px #ffb020)" }}
      />
    </svg>
  );
}

export function FlagArt({ skin, size }: { skin: Skin; size: number }) {
  if (skin.id === "pixel")
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges">
        <rect x={1.5} y={9} width={3} height={1} fill="#000" />
        <rect x={2} y={1} width={1} height={8.5} fill="#fff" />
        <rect x={3} y={1} width={5} height={4} fill="#ff004d" />
        <rect x={3} y={2} width={1} height={1} fill="#fff" />
        <rect x={5} y={2} width={1} height={1} fill="#fff" />
        <rect x={4} y={3} width={1} height={1} fill="#fff" />
        <rect x={6} y={3} width={1} height={1} fill="#fff" />
      </svg>
    );
  if (skin.id === "robot")
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect x="6" y="28" width="28" height="9" rx="4" fill="#2fd9a0" stroke="#1ca57a" strokeWidth="2" />
        <rect x="17.5" y="5" width="3" height="24" rx="1.5" fill="#2b2f55" />
        <path d="M20.5 5 h13 l-4 5 4 5 h-13z" fill="#ff5a7a" stroke="#d93a5a" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    );
  if (skin.id === "holo")
    return (
      <svg width={size * 0.7} height={size} viewBox="0 0 56 80" style={{ filter: "drop-shadow(0 0 8px #7dffb0)" }}>
        <defs>
          <linearGradient id="lt-holo-portal" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#7dffb0" stopOpacity=".6" />
            <stop offset="1" stopColor="#7dffb0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="14" y="4" width="28" height="72" fill="url(#lt-holo-portal)" />
        <ellipse cx="28" cy="76" rx="20" ry="5" fill="#7dffb030" stroke="#7dffb0" strokeWidth="2" />
        <ellipse cx="28" cy="40" rx="15" ry="22" fill="none" stroke="#c9ffe0" strokeWidth="2" strokeDasharray="5 4" />
        <ellipse cx="28" cy="40" rx="9" ry="14" fill="#7dffb025" stroke="#7dffb0" strokeWidth="1.5" />
        <path d="M24 34 l4 -5 4 5 M28 29 v16" stroke="#eaffff" strokeWidth="2" fill="none" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <ellipse cx="14" cy="36" rx="10" ry="3" fill="#ff4fa3" opacity="0.35" />
      <rect x="11" y="4" width="3" height="32" rx="1.5" fill="#cfe9ff" />
      <path d="M14 5 h18 l-5 7 l5 7 h-18 z" fill="#ff4fa3" stroke="#ffc2df" strokeWidth="1.2" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px #ff4fa3)" }} />
    </svg>
  );
}

/** khung sân 2D: khoảng cách giữa ô, viền, màu nét bút */
export function frameOf(skin: Skin): { gap: number; pad: number; style: CSSProperties; arrow: string; target: string; ok: string; bad: string } {
  if (skin.id === "pixel")
    return { gap: 0, pad: 6, style: { background: "#000", borderRadius: 0, boxShadow: "6px 6px 0 #000, 0 0 0 4px #5f3dc4" }, arrow: "#ffec27", target: "#ffffff", ok: "#ffec27", bad: "#ff004d" };
  if (skin.id === "robot")
    return { gap: 5, pad: 10, style: { background: "#c9d3f5", borderRadius: "1.4rem", boxShadow: "0 10px 0 #a9b6e6" }, arrow: "#ff9f43", target: "#5b7cff", ok: "#5b7cff", bad: "#ff5a7a" };
  return {
    gap: 0,
    pad: 8,
    style: {
      background: "linear-gradient(160deg,#0d1d5c,#060d2e)",
      borderRadius: "1.4rem",
      boxShadow: "0 0 0 1.5px rgb(47 211 255 / 0.55), 0 0 36px -6px rgb(47 211 255 / 0.6), inset 0 0 24px rgb(47 211 255 / 0.12)",
    },
    arrow: "#2fd3ff",
    target: "#9fe9ff",
    ok: "#2fd3ff",
    bad: "#ff4fa3",
  };
}

/* ───────── nền trang ───────── */

export function SkinBackdrop({ skin }: { skin: Skin }) {
  if (skin.id === "pixel")
    return (
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden style={{ background: "#1d1033" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#ffffff55 1px, transparent 1.5px), radial-gradient(#ffec2740 1px, transparent 1.5px)",
            backgroundSize: "64px 64px, 112px 112px",
            backgroundPosition: "0 0, 30px 50px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "repeating-linear-gradient(90deg,#2b1855 0 32px,#24124a 32px 64px)", boxShadow: "0 -4px 0 #000" }} />
        <div className="lt-scan absolute inset-0" />
      </div>
    );
  if (skin.id === "robot")
    return (
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden style={{ background: "linear-gradient(160deg,#eef3ff,#dfe8ff)" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(#c9d3f5 1.5px, transparent 2px)", backgroundSize: "26px 26px" }} />
      </div>
    );
  if (skin.id === "holo")
    return (
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden style={{ background: "radial-gradient(ellipse 70% 60% at 30% 55%,#0d4152 0,#061c26 55%,#020a10 100%)" }}>
        <div className="lt-hex absolute inset-0 opacity-[0.16]" />
        <div className="lt-scan lt-scan-holo absolute inset-0" />
        <div className="lt-sweep absolute inset-x-0 h-20" />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 140px #000c" }} />
      </div>
    );
  return null;
}

/** dải màu kính cho khối ở giao diện Hologram (khối Blockly dùng fill:url(#...)) */
export function HoloDefs() {
  const g = (id: string, top: string, mid: string, dark: string, deep: string, cut = 0.18) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={top} stopOpacity=".78" />
      <stop offset={cut} stopColor={mid} stopOpacity=".46" />
      <stop offset={cut + 0.02} stopColor={dark} stopOpacity=".46" />
      <stop offset="1" stopColor={deep} stopOpacity=".62" />
    </linearGradient>
  );
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        {g("lt-g-event", "#ffe2b0", "#ffb547", "#b8741c", "#5c3608")}
        {g("lt-g-move", "#9ff7ff", "#4ff0ff", "#1a8fa8", "#0b4a5c")}
        {g("lt-g-turn", "#e2d4ff", "#b28cff", "#6a4bb8", "#2e2260")}
        {g("lt-g-loop", "#c8ffdf", "#7dffb0", "#2a9a68", "#0d4a34", 0.07)}
        {g("lt-g-logic", "#ffd0e6", "#ff5fa8", "#b8306e", "#5c0f33", 0.07)}
      </defs>
    </svg>
  );
}
