"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { hasFile, resolveFile } from "@/content/assets";
import type { Depth, Incident } from "@/lib/chem/types";
import { DEPTHS } from "@/lib/chem/types";
import { Mascot } from "@/components/Mascot";
import { Glass } from "./Glass";
import "./lab.css";

/** ảnh hiệu ứng (nếu đã tạo theo docs/ASSET_PROMPTS.md), chưa có thì vẽ bằng SVG/CSS */
const fxImg = (id: string) => {
  const f = `/assets/img/${id}.webp`;
  return hasFile(f) ? resolveFile(f) : undefined;
};

function BurstSvg() {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r = i % 2 ? 50 : 22 + ((i * 7) % 9);
    return `${60 + Math.cos(a) * r},${60 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id="lab-bg">
          <stop offset="0" stopColor="#fff8c8" />
          <stop offset=".45" stopColor="#ffb020" />
          <stop offset="1" stopColor="#ff4f2e" />
        </radialGradient>
      </defs>
      <polygon points={pts} fill="url(#lab-bg)" />
      <circle cx="60" cy="60" r="18" fill="#fffbe8" />
    </svg>
  );
}

/**
 * Hiệu ứng nổ (~1,8 giây): chớp sáng, quả nổ, khói cuộn, mảnh kính văng, màn hình rung và nứt.
 * `calm`: bỏ rung và chớp (cài đặt Giảm hiệu ứng).
 */
export function BoomFx({ onDone, calm, who = "bit" }: { onDone: () => void; calm?: boolean; who?: "mochi" | "bit" }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1900);
    return () => window.clearTimeout(t);
  }, [onDone]);
  const boom = fxImg("fx-boom");
  const smokeImg = fxImg("fx-smoke-1");
  const crack = fxImg("fx-crack");
  const victim = fxImg(`${who}-boom`);
  const smoke = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = i * 2.399;
        const r = 18 + 26 * Math.sqrt(i / 22);
        return { dx: `${Math.cos(a) * r}vmin`, dy: `${Math.sin(a) * r * 0.7 - 6}vmin`, s: 14 + (i % 4) * 5, d: (i % 5) * 0.05 };
      }),
    [],
  );
  const shards = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ dx: `${Math.cos(i * 1.9) * (20 + (i * 7) % 24)}vmin`, dy: `${Math.sin(i * 1.9) * (14 + (i * 5) % 18)}vmin`, rot: `${i * 97}deg` })), []);
  return (
    <div className={`pointer-events-none fixed inset-0 z-[60] overflow-hidden ${calm ? "" : "lab-screen-shake"}`} aria-hidden>
      {!calm && <div className="lab-flash absolute inset-0" style={{ background: "radial-gradient(circle at 50% 55%, #fffbe8 0, #ffd24acc 14%, #ff6a2e88 30%, #ff3b5c33 48%, #0000 70%)" }} />}
      <div className="absolute inset-0 bg-black/35" />
      {smoke.map((p, i) => (
        <div
          key={i}
          className="lab-smoke absolute left-1/2 top-[55%] rounded-full"
          style={
            {
              width: `${p.s}vmin`,
              height: `${p.s}vmin`,
              marginLeft: `-${p.s / 2}vmin`,
              marginTop: `-${p.s / 2}vmin`,
              background: smokeImg ? `url(${smokeImg}) center/contain no-repeat` : "radial-gradient(circle at 40% 35%, #6b6f7e, #6b6f7e00 70%)",
              animationDelay: `${p.d}s`,
              "--dx": p.dx,
              "--dy": p.dy,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="lab-burst absolute left-1/2 top-[55%] h-[62vmin] w-[62vmin]">{boom ? <img src={boom} alt="" className="h-full w-full object-contain" /> : <BurstSvg />}</div>
      {shards.map((p, i) => (
        <div
          key={i}
          className="lab-shard absolute left-1/2 top-[55%] h-3 w-4"
          style={{ background: "linear-gradient(135deg,#ffffffee,#b8d8ff88)", clipPath: "polygon(0 0,100% 30%,40% 100%)", "--dx": p.dx, "--dy": p.dy, "--rot": p.rot } as React.CSSProperties}
        />
      ))}
      <div className="absolute left-1/2 top-[16%] -translate-x-1/2 -rotate-6 font-display text-[16vmin] font-extrabold leading-none text-[#fff2b0] lab-pop-in" style={{ WebkitTextStroke: "0.06em #c4271c", textShadow: "0 .08em 0 #7a1010, 0 0 40px #ff6a2e" }}>
        BÙM!
      </div>
      <div className="lab-pop-in absolute bottom-[6%] right-[5%] w-[24vmin]" style={{ animationDelay: "0.3s" }}>
        {victim ? <img src={victim} alt="" className="w-full" /> : <Mascot who={who} mood="oops" size={200} className="h-auto w-full brightness-50 sepia" />}
        <span className="absolute -left-10 top-[20%] rounded-full bg-white px-3 py-1 text-sm font-extrabold text-ink">Khụ… khụ…</span>
      </div>
      {crack ? (
        <img src={crack} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      ) : (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <g stroke="#ffffffaa" strokeWidth=".18" fill="none">
            {[[0, 8], [18, -4], [35, 30], [60, 12], [95, 22], [100, 60], [80, 100], [45, 100], [10, 95], [-2, 55]].map(([x, y], i) => (
              <path key={i} d={`M57 52 L${57 + (x - 57) * 0.22 + 2} ${52 + (y - 52) * 0.22 - 1} L${57 + (x - 57) * 0.42} ${52 + (y - 52) * 0.42}`} />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}

/** bé nhỏ làm sai: không nổ, mà "Ối, tràn rồi!" với bọt và bột màu bắn */
export function SplatFx({ onDone, text = "Ối, tràn rồi!" }: { onDone: () => void; text?: string }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1500);
    return () => window.clearTimeout(t);
  }, [onDone]);
  const dots = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ c: ["#ffb81f", "#4f72ff", "#22b98c", "#ff4f7b", "#9b7bff"][i % 5], dx: `${Math.cos(i * 2.4) * (12 + (i % 5) * 6)}vmin`, dy: `${Math.sin(i * 2.4) * (10 + (i % 4) * 5)}vmin` })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {dots.map((d, i) => (
        <span key={i} className="lab-confetti-dot absolute left-[38%] top-[55%] h-4 w-4 rounded-full" style={{ background: d.c, "--dx": d.dx, "--dy": d.dy } as React.CSSProperties} />
      ))}
      <div className="lab-pop-in absolute left-[38%] top-[22%] -translate-x-1/2 -rotate-3 whitespace-nowrap font-display text-[9vmin] font-extrabold text-[#ff4f7b]" style={{ WebkitTextStroke: "0.05em #fff", textShadow: "0 .06em 0 #c42a52" }}>
        {text}
      </div>
    </div>
  );
}

/** Thẻ sự cố: vì sao, ngoài đời ra sao, làm thế nào cho đúng. Được cất vào Sổ sự cố. */
export function IncidentCard({ inc, depth, onRetry, count, who }: { inc: Incident; depth: Depth; onRetry: () => void; count?: string; who: "mochi" | "bit" }) {
  const avail = DEPTHS.filter((d) => inc.why[d.id]);
  const [d, setD] = useState<Depth>(inc.why[depth] ? depth : avail[avail.length - 1]?.id ?? "nhi");
  const soft = inc.level === "soft";
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px]">
      <div className="lab-panel lab-pop-in flex max-h-[96dvh] w-full max-w-3xl flex-col gap-3 overflow-y-auto rounded-3xl p-4 sm:p-6" style={{ boxShadow: `0 0 0 2px ${soft ? "#ff4f7b" : "#ffb81f"}, 0 0 40px ${soft ? "#ff4f7b44" : "#ffb81f44"}` }}>
        <div className="flex flex-wrap items-center gap-3">
          <Mascot who={who} mood="oops" size={64} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="lab-soft text-xs font-extrabold tracking-wider">{soft ? "Ối! VÌ SAO VẬY?" : "SỰ CỐ"}</div>
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {inc.emoji} {inc.title}
            </h2>
          </div>
          {avail.length > 1 && (
            <div className="flex gap-1 rounded-2xl p-1" style={{ boxShadow: "0 0 0 1px var(--lab-line)" }}>
              {avail.map((x) => (
                <button key={x.id} onClick={() => setD(x.id)} className={`rounded-xl px-2.5 py-1 text-xs font-extrabold ${d === x.id ? "lab-accent" : "lab-soft"}`}>
                  {x.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-base leading-relaxed sm:text-lg">{inc.why[d]}</p>
        {inc.equation && (d === "thcs" || d === "thpt") && <Equation parts={inc.equation} />}
        {inc.frames && (
          <div className="grid grid-cols-3 gap-2">
            {inc.frames.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-2xl p-2 text-center" style={{ boxShadow: "0 0 0 1px var(--lab-line)" }}>
                <span className="lab-soft self-start text-[0.7rem] font-extrabold">{i + 1}/3</span>
                <div className="relative w-14 sm:w-20">
                  <Glass shape="beaker" liquid="#ff6fae" level={0.5} bubbles={i === 0 ? 0.2 : 1} />
                  {i === 2 && (
                    <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 -translate-y-1/3">
                      <BurstSvg />
                    </div>
                  )}
                </div>
                <b className="text-xs sm:text-sm">{f}</b>
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl p-3 text-sm" style={{ background: "#ff4f7b1c", boxShadow: "0 0 0 1px #ff4f7b55" }}>
            <b className="text-[#ff4f7b]">{soft ? "Nếu ở ngoài đời" : "Ngoài đời"}</b>
            <br />
            {inc.real}
          </div>
          <div className="rounded-2xl p-3 text-sm" style={{ background: "#22b98c1c", boxShadow: "0 0 0 1px #22b98c66" }}>
            <b className="text-[#22b98c]">Làm đúng</b>
            <br />
            {inc.right}
          </div>
        </div>
        <div className="rounded-2xl bg-[#ffefc4] px-3 py-2 text-sm font-bold text-[#6b4a00]">🦺 {inc.home ? "Thí nghiệm này làm ở nhà được nếu có người lớn bên cạnh." : "Thí nghiệm này không làm ở nhà. Chỉ làm trong phòng thí nghiệm có thầy cô."}</div>
        <div className="flex items-center gap-3">
          {count && <span className="chip bg-sun-soft text-[#8a5a00]">📕 Đã cất vào Sổ sự cố · {count}</span>}
          <span className="flex-1" />
          <button className="lab-btn lab-btn-main" onClick={onRetry} autoFocus>
            Thử lại đúng cách ▶
          </button>
        </div>
      </div>
    </div>
  );
}

/** phương trình hoá học: từng chất là một ô, khí thoát ra tô màu */
export function Equation({ parts, onPick }: { parts: string[]; onPick?: (p: string) => void }) {
  return (
    <div className="lab-mono flex flex-wrap items-center gap-1.5 text-base font-bold sm:text-lg">
      {parts.map((p, i) =>
        p === "+" || p === "→" || p.startsWith("(") ? (
          <span key={i} className="lab-soft">
            {p}
          </span>
        ) : (
          <button key={i} onClick={() => onPick?.(p)} className="rounded-lg px-2 py-0.5" style={{ boxShadow: `0 0 0 1px ${p.includes("↑") || p.includes("↓") ? "#22b98c" : "var(--lab-line)"}`, color: p.includes("↑") || p.includes("↓") ? "#22b98c" : undefined }}>
            {p}
          </button>
        ),
      )}
    </div>
  );
}
