"use client";
import { imageById, resolveFile } from "@/content/assets";
import { useProgress } from "@/lib/store";

type Variant = "meadow" | "map" | "arena" | "desk" | "night" | "deep";

const PAL: Record<Exclude<Variant, "deep">, { sky: [string, string]; hills: string[]; sun: string }> = {
  meadow: { sky: ["#8fd0ff", "#fff1dc"], hills: ["#b8e8b0", "#86d39a", "#5fc28a"], sun: "#ffd966" },
  map: { sky: ["#a7e2ff", "#e9fbe6"], hills: ["#c9efb9", "#9fdea0", "#78cc90"], sun: "#ffe08a" },
  arena: { sky: ["#7fb6ff", "#ffe2c7"], hills: ["#ffd0a8", "#ffb48a", "#ff9a7a"], sun: "#fff2a8" },
  desk: { sky: ["#cfe1ff", "#fff3e3"], hills: ["#e9e0ff", "#dcd0ff", "#cdbfff"], sun: "#ffe7a3" },
  night: { sky: ["#6a7cff", "#c8b6ff"], hills: ["#9d8cff", "#8775f0", "#6f5fd8"], sun: "#fff6c9" },
};

/**
 * Cảnh nền tràn màn hình. Có ảnh thật (vd. bg-home) thì dùng ảnh,
 * chưa có thì vẽ đồi, mây, mặt trời bằng SVG cùng tông màu.
 */
export function Scene({ image, variant: wanted = "meadow", fixed = true, dim = false }: { image?: string; variant?: Variant; fixed?: boolean; dim?: boolean }) {
  const { data } = useProgress();
  // theme Neon: mọi cảnh sáng đổi sang biển tối; dùng ảnh <tên>-neon nếu đã có, không thì gradient neon
  const neon = data.theme === "neon" && wanted !== "deep";
  const variant: Variant = neon ? "deep" : wanted;
  if (neon) image = image ? `${image}-neon` : undefined;
  const asset = image ? imageById(image) : undefined;
  const src = asset ? resolveFile(asset.file) : undefined;
  if (variant === "deep") {
    // môn cho bé lớn: biển sâu neon (ảnh thật nếu có, không thì gradient + tia sáng)
    return (
      <div className={`${fixed ? "fixed left-0 top-0 h-lvh w-full" : "absolute inset-0"} deep-sea -z-10 overflow-hidden`} aria-hidden>
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="block h-full w-full object-cover" />
        )}
        <div className="light-rays absolute inset-0" />
        <div className="cyber-grid absolute inset-x-0 bottom-0 h-1/3" />
        {dim && <div className="absolute inset-0 bg-[#030a24]/40" />}
      </div>
    );
  }
  const p = PAL[variant];
  return (
    <div className={`${fixed ? "fixed left-0 top-0 h-lvh w-full" : "absolute inset-0"} -z-10 overflow-hidden`} aria-hidden>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="block h-full w-full object-cover" />
      ) : (
        <svg className="block h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={p.sky[0]} />
              <stop offset="1" stopColor={p.sky[1]} />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill={`url(#sky-${variant})`} />
          <circle cx="980" cy="150" r="70" fill={p.sun} opacity="0.9" />
          <circle cx="980" cy="150" r="110" fill={p.sun} opacity="0.25" />
          <g fill="#fff" opacity="0.85">
            <g className="cloud-a">
              <ellipse cx="200" cy="140" rx="90" ry="30" />
              <ellipse cx="250" cy="120" rx="60" ry="34" />
              <ellipse cx="160" cy="125" rx="45" ry="26" />
            </g>
            <g className="cloud-b">
              <ellipse cx="640" cy="90" rx="70" ry="22" />
              <ellipse cx="680" cy="75" rx="45" ry="26" />
            </g>
            <g className="cloud-a" opacity="0.7">
              <ellipse cx="1080" cy="300" rx="80" ry="24" />
              <ellipse cx="1040" cy="288" rx="45" ry="22" />
            </g>
          </g>
          <path d="M0 560 C 200 470 380 520 560 480 S 900 420 1200 500 L1200 800 L0 800 Z" fill={p.hills[0]} />
          <path d="M0 640 C 220 570 420 620 640 590 S 1000 540 1200 610 L1200 800 L0 800 Z" fill={p.hills[1]} />
          <path d="M0 720 C 260 670 520 710 760 690 S 1080 660 1200 700 L1200 800 L0 800 Z" fill={p.hills[2]} />
          <g fill={p.hills[2]} opacity="0.9">
            <circle cx="140" cy="560" r="22" />
            <rect x="136" y="572" width="8" height="24" rx="3" fill="#8a6a4a" />
            <circle cx="1060" cy="520" r="18" />
            <rect x="1056" y="530" width="7" height="20" rx="3" fill="#8a6a4a" />
          </g>
        </svg>
      )}
      {dim && <div className="absolute inset-0 bg-white/45" />}
    </div>
  );
}
