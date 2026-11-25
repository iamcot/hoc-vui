"use client";
import { useId } from "react";
import type { Shape } from "@/lib/chem/lab";
import "./lab.css";

/**
 * Dụng cụ thuỷ tinh vẽ bằng SVG: thành kính có độ dày, vệt sáng gương, phản chiếu cửa sổ/đèn (env),
 * mặt nước khum, mép dung dịch tối hơn như bị khúc xạ, bóng màu hắt xuống bàn.
 * Ảnh phản chiếu dưới mặt bàn làm bằng -webkit-box-reflect ở lớp bọc (.lab-reflect).
 */

interface ShapeDef {
  vb: [number, number, number, number];
  body: string;
  top: number;
  bot: number;
  rim: [number, number];
  ticks?: boolean;
  foot?: boolean;
  lid?: boolean;
}

const SHAPES: Record<Shape, ShapeDef> = {
  beaker: { vb: [0, -10, 100, 134], body: "M6 -4 V106 Q6 120 20 120 H80 Q94 120 94 106 V-4 Z", top: -4, bot: 120, rim: [6, 94], ticks: true },
  erlen: { vb: [0, -10, 100, 134], body: "M38 -4 V40 L8 106 Q2 120 16 120 H84 Q98 120 92 106 L62 40 V-4 Z", top: -4, bot: 120, rim: [38, 62] },
  flask: { vb: [0, -10, 100, 134], body: "M40 -4 V44 A38 38 0 1 0 60 44 V-4 Z", top: -4, bot: 120, rim: [40, 60] },
  tube: { vb: [0, -6, 40, 166], body: "M4 -2 V140 A16 16 0 0 0 36 140 V-2 Z", top: -2, bot: 156, rim: [4, 36] },
  cyl: { vb: [-10, -10, 80, 184], body: "M14 -4 V152 H46 V-4 Z", top: -4, bot: 152, rim: [14, 46], foot: true, ticks: true },
  jar: { vb: [0, -14, 100, 138], body: "M14 6 Q10 6 10 14 V110 Q10 120 22 120 H78 Q90 120 90 110 V14 Q90 6 86 6 Z", top: 6, bot: 120, rim: [16, 84], lid: true },
};

/** tỉ lệ cao/rộng của khung vẽ, để bàn thí nghiệm xếp chỗ */
export const shapeAspect = (s: Shape) => (SHAPES[s].vb[3] + 16) / (SHAPES[s].vb[2] + 16);

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k)));
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((x) => f(x).toString(16).padStart(2, "0")).join("");
}

export interface GlassProps {
  shape: Shape;
  /** màu dung dịch, null = rỗng */
  liquid?: string | null;
  /** mực nước 0..1 */
  level?: number;
  /** bề dày lớp dầu (0..1 so với chiều cao) */
  oil?: number;
  bubbles?: number;
  /** bọt dâng trên mặt nước (0..1 so với chiều cao) */
  foam?: number;
  spilled?: boolean;
  grains?: { color: string; n: number }[];
  ppt?: string | null;
  objects?: { emoji: string; float: boolean }[];
  ice?: number;
  sparks?: boolean;
  steam?: boolean;
  lid?: boolean;
  condense?: number;
  swirl?: boolean;
  env?: string;
  dark?: boolean;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Glass({
  shape,
  liquid = null,
  level = 0,
  oil = 0,
  bubbles = 0,
  foam = 0,
  spilled = false,
  grains = [],
  ppt = null,
  objects = [],
  ice = 0,
  sparks = false,
  steam = false,
  lid = false,
  condense = 0,
  swirl = false,
  env = "#ffffff",
  dark = false,
  glow = false,
  className = "",
  style,
}: GlassProps) {
  const S = SHAPES[shape];
  const id = useId().replace(/[^a-z0-9]/gi, "");
  const [vx, vy, vw, vh] = S.vb;
  const H = S.bot - S.top;
  const lvl = Math.max(0, Math.min(1, level));
  const ly = S.bot - lvl * H;
  const has = !!liquid && lvl > 0.005;
  const col = liquid ?? "#bfe0ff";
  const l1 = shade(col, 0.35);
  const l2 = shade(col, -0.38);
  const rimW = S.rim[1] - S.rim[0];
  const rimC = (S.rim[0] + S.rim[1]) / 2;
  const outline = dark ? "#d8ecff" : "#ffffff";
  const inner = dark ? "#6fb6ff" : "#7a86b8";
  const nb = Math.round(Math.min(1, bubbles) * 20);
  const oilH = Math.min(lvl, oil) * H;
  const foamH = Math.max(0, foam) * H;
  const width = S.rim[1] - S.rim[0];

  return (
    <svg viewBox={`${vx - 8} ${vy - 8} ${vw + 16} ${vh + 16}`} className={`block overflow-visible ${className}`} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${id}gl`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".42" />
          <stop offset=".12" stopColor={env} stopOpacity=".1" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".03" />
          <stop offset=".86" stopColor={env} stopOpacity=".1" />
          <stop offset="1" stopColor="#fff" stopOpacity=".38" />
        </linearGradient>
        <linearGradient id={`${id}lq`} x1="0" x2="1">
          <stop offset="0" className="lab-stop" style={{ stopColor: l2 }} />
          <stop offset=".18" className="lab-stop" style={{ stopColor: col }} />
          <stop offset=".42" className="lab-stop" style={{ stopColor: l1 }} />
          <stop offset=".7" className="lab-stop" style={{ stopColor: col }} />
          <stop offset="1" className="lab-stop" style={{ stopColor: l2 }} />
        </linearGradient>
        <linearGradient id={`${id}lv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".25" />
          <stop offset=".25" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <radialGradient id={`${id}fo`} cx=".35" cy=".3">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor={liquid ? shade(col, 0.75) : "#e6ecf5"} />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <path d={S.body} />
        </clipPath>
        <filter id={`${id}b`}>
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id={`${id}b2`}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {glow && has && <ellipse cx={vx + vw / 2} cy={(ly + S.bot) / 2} rx={vw * 0.7} ry={(S.bot - ly) * 0.9 + 10} fill={col} opacity=".28" filter={`url(#${id}b2)`} />}
      {/* bóng dưới đáy + màu dung dịch hắt xuống bàn */}
      <ellipse cx={vx + vw / 2} cy={S.bot + (S.foot ? 10 : 3)} rx={vw * 0.46} ry="4" fill="#000" opacity={dark ? 0.5 : 0.22} filter={`url(#${id}b)`} />
      {has && <ellipse cx={vx + vw / 2 + 6} cy={S.bot + (S.foot ? 10 : 4)} rx={vw * 0.5} ry="5" fill={col} opacity=".35" filter={`url(#${id}b)`} />}
      {spilled && (
        <ellipse cx={vx + vw / 2} cy={S.bot + 4} rx={vw * 0.85} ry="7" fill={liquid ? shade(col, 0.6) : "#fff"} opacity=".85" />
      )}
      {S.foot && <path d="M2 152 H58 Q62 152 62 156 V160 H-2 V156 Q-2 152 2 152Z" fill={`url(#${id}gl)`} stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" />}

      <g clipPath={`url(#${id}c)`}>
        <path d={S.body} fill={dark ? "#9fc3ff" : "#dfeaff"} fillOpacity={dark ? 0.08 : 0.22} />
        {/* dung dịch: dịch lên xuống bằng transform để có chuyển động mượt */}
        <g className="lab-liquid" style={{ transform: `translateY(${has ? ly : S.bot + 4}px)` }}>
          <rect x={vx - 10} y={0} width={vw + 20} height={vh + 20} fill={`url(#${id}lq)`} opacity=".93" />
          <rect x={vx - 10} y={0} width={vw + 20} height={vh + 20} fill={`url(#${id}lv)`} />
          {oilH > 0 && <rect x={vx - 10} y={0} width={vw + 20} height={oilH} fill="#ffd23f" opacity=".85" />}
          {oilH > 0 && <rect x={vx - 10} y={oilH - 1.5} width={vw + 20} height={3} fill="#fff3b0" opacity=".7" />}
          <ellipse cx={vx + vw / 2} cy={0} rx={vw * 0.6} ry={2.6} fill={oilH > 0 ? "#fff3b0" : l1} opacity=".9" />
          <path d={`M${vx} 0.5 Q${vx + vw / 2} 3.2 ${vx + vw} 0.5`} stroke="#fff" strokeOpacity=".75" strokeWidth="1" fill="none" />
          {/* bọt khí nổi lên */}
          {Array.from({ length: nb }, (_, i) => {
            const x = S.rim[0] + width * 0.12 + ((i * 37) % (width * 0.76));
            const y = S.bot - ly - 4 - ((i * 13) % 10);
            const r = 1 + (i % 4) * 0.7;
            return (
              <g key={i} className="lab-bubble" style={{ ["--rise" as string]: `${-y + 2}px`, animationDelay: `${(i * 0.17) % 1.6}s`, animationDuration: `${1.1 + (i % 5) * 0.25}s` } as React.CSSProperties}>
                <circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth=".7" />
                <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" />
              </g>
            );
          })}
        </g>
        {/* kết tủa lắng đáy */}
        {ppt && (
          <g>
            {Array.from({ length: 36 }, (_, i) => (
              <circle key={i} cx={vx + vw * 0.15 + ((i * 29) % (vw * 0.7))} cy={S.bot - 2 - ((i * 7) % 10)} r={1.2 + (i % 3) * 0.7} fill={ppt} />
            ))}
            <rect x={vx} y={S.bot - 6} width={vw} height={10} fill={ppt} />
          </g>
        )}
        {/* hạt chất rắn chưa tan */}
        <g className={swirl ? "lab-swirl" : ""} style={{ transformOrigin: `${rimC}px ${S.bot - 8}px` }}>
          {grains.flatMap((g, gi) =>
            Array.from({ length: Math.min(40, Math.round(g.n * 14)) }, (_, i) => {
              const k = i + gi * 41;
              return <circle key={`${gi}-${i}`} cx={S.rim[0] + width * 0.1 + ((k * 23) % (width * 0.8))} cy={S.bot - 3 - ((k * 7) % 9)} r={1.3 + (k % 3) * 0.6} fill={g.color} stroke="#0002" strokeWidth=".4" />;
            }),
          )}
        </g>
        {/* phản chiếu cửa sổ/đèn trên thành kính */}
        <rect x={vx + vw * 0.62} y={S.top + 8} width={vw * 0.14} height={H * 0.55} rx="3" fill={env} opacity=".16" />
        <rect x={vx + vw * 0.62} y={S.top + 8 + H * 0.58} width={vw * 0.14} height={H * 0.12} rx="3" fill={env} opacity=".12" />
        <path d={S.body} fill={`url(#${id}gl)`} />
        <rect x={S.rim[0] + rimW * 0.09} y={S.top + 6} width={Math.max(2.5, rimW * 0.07)} height={H * 0.82} rx="2" fill="#fff" opacity=".82" filter={`url(#${id}b)`} />
        <rect x={S.rim[0] + rimW * 0.2} y={S.top + 10} width={Math.max(1.2, rimW * 0.025)} height={H * 0.55} rx="1" fill="#fff" opacity=".5" />
        <rect x={vx + vw * 0.8} y={S.top + H * 0.15} width={Math.max(1.5, vw * 0.035)} height={H * 0.7} rx="1" fill="#fff" opacity=".45" filter={`url(#${id}b)`} />
        <ellipse cx={vx + vw * 0.5} cy={S.bot - 3} rx={vw * 0.36} ry="2.2" fill="#fff" opacity=".45" />
      </g>

      {/* vật nổi/chìm và đá lạnh */}
      {objects.map((o, i) => {
        const x = S.rim[0] + width * (0.25 + ((i * 0.37) % 0.55));
        const y = o.float && has ? ly - 2 : S.bot - 6;
        return (
          <g key={o.emoji + i} className="lab-obj" style={{ transform: `translate(${x}px, ${y}px)` }}>
            <text x={0} y={0} fontSize={Math.min(30, width * 0.34)} textAnchor="middle" dominantBaseline={o.float ? "middle" : "auto"}>
              {o.emoji}
            </text>
          </g>
        );
      })}
      {Array.from({ length: Math.ceil(ice) }, (_, i) => {
        const s = Math.min(22, width * 0.24) * (i === Math.ceil(ice) - 1 && ice % 1 ? Math.max(0.4, ice % 1) : 1);
        const x = S.rim[0] + width * 0.15 + ((i * 29) % (width * 0.6));
        const y = (has ? ly : S.bot) - s * 0.7 - (i % 2) * 4;
        return <rect key={i} x={x} y={y} width={s} height={s} rx={s * 0.22} fill="#eaf7ff" fillOpacity=".75" stroke="#fff" strokeWidth="1.4" transform={`rotate(${(i * 23) % 30 - 15} ${x + s / 2} ${y + s / 2})`} />;
      })}

      {/* natri chạy xèo xèo trên mặt nước */}
      {sparks && has && (
        <g className="lab-dart" style={{ transform: `translate(${rimC}px, ${ly - 2}px)` }}>
          <ellipse cx={0} cy={0} rx={5} ry={3.5} fill="#f1f3f8" stroke="#9aa3b8" strokeWidth=".8" />
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1={0} y1={0} x2={Math.cos(i) * 10} y2={-Math.abs(Math.sin(i)) * 10} stroke="#ffd24a" strokeWidth="1.4" className="lab-spark" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </g>
      )}

      {/* bọt dâng lên, tràn ra ngoài */}
      {foamH > 0.5 && (
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const x = S.rim[0] + 3 + i * ((width - 6) / 15);
            const top = Math.max(spilled ? S.top - 10 : S.top + 2, ly - foamH);
            return (
              <g key={i}>
                <rect x={x - 4} y={top} width={8} height={Math.max(0, ly - top)} fill={`url(#${id}fo)`} clipPath={`url(#${id}c)`} />
                <circle cx={x} cy={top - (i % 3) * 2} r={4 + (i % 3) * 1.4} fill={`url(#${id}fo)`} />
              </g>
            );
          })}
        </g>
      )}
      {spilled && foamH > 0.5 && (
        <g fill={`url(#${id}fo)`}>
          <path d={`M${S.rim[0]} ${S.top} q-8 20 -6 ${S.bot - S.top} h-8 q-6 -${(S.bot - S.top) * 0.7} 14 -${S.bot - S.top}z`} />
          <path d={`M${S.rim[1]} ${S.top} q8 26 6 ${S.bot - S.top} h8 q4 -${(S.bot - S.top) * 0.6} -14 -${S.bot - S.top}z`} />
        </g>
      )}

      <path d={S.body} fill="none" stroke={outline} strokeOpacity=".95" strokeWidth="2.4" strokeLinejoin="round" />
      <path d={S.body} fill="none" stroke={inner} strokeOpacity=".55" strokeWidth=".8" strokeLinejoin="round" />
      <ellipse cx={rimC} cy={S.top} rx={rimW / 2 + 1.5} ry={Math.max(2, rimW * 0.06)} fill="none" stroke="#fff" strokeWidth="2.2" opacity=".95" />
      <ellipse cx={rimC} cy={S.top} rx={rimW / 2 + 1.5} ry={Math.max(2, rimW * 0.06)} fill="none" stroke={inner} strokeWidth=".7" opacity=".6" />
      {S.lid && (
        <g>
          <rect x="8" y="-6" width="84" height="12" rx="3" fill="#c9a24a" stroke="#8a6a24" />
          <rect x="12" y="-4" width="40" height="3" rx="1.5" fill="#fff" opacity=".5" />
        </g>
      )}
      {S.ticks &&
        Array.from({ length: 6 }, (_, i) => {
          const y = S.bot - 12 - i * ((S.bot - S.top - 24) / 6);
          return <line key={i} x1={S.rim[1] - (i % 2 ? 12 : 16)} x2={S.rim[1] - 4} y1={y} y2={y} stroke={dark ? "#cfe6ff" : "#5d6283"} strokeOpacity=".55" strokeWidth="1" />;
        })}
      {/* đĩa kính đậy miệng cốc: hơi nước đọng thành giọt */}
      {lid && (
        <g>
          <rect x={S.rim[0] - 8} y={S.top - 7} width={rimW + 16} height={5} rx={2} fill="#e6f3ff" fillOpacity=".55" stroke="#fff" strokeWidth="1.2" />
          {Array.from({ length: Math.round(condense * 12) }, (_, i) => (
            <ellipse key={i} cx={S.rim[0] + 4 + ((i * 17) % (rimW - 8))} cy={S.top - 1 + (i % 3)} rx={1.6} ry={2.2} fill="#cfe9ff" stroke="#fff" strokeWidth=".6" />
          ))}
        </g>
      )}
      {steam &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${rimC - 10 + i * 10} ${S.top - (lid ? 10 : 6)} q-6 -10 0 -18 q6 -8 0 -18`}
            stroke="#fff"
            strokeOpacity=".55"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            filter={`url(#${id}b)`}
            className="lab-steam"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
    </svg>
  );
}
