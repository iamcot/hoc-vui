"use client";
import { Fragment } from "react";
import type { Mood } from "@/content/types";
import { Mascot } from "@/components/Mascot";
import "./lab.css";

/** "Thả **muối** vào cốc" → chữ đậm tô màu */
export function Say({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
export const plain = (text: string) => text.replace(/\*\*/g, "").replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, "").trim();

/** đoạn nhỏ trên đầu bong bóng: 🧪 BƯỚC 1/2 ▬▬ */
export function Tag({ children, dots, color }: { children: React.ReactNode; dots?: ("ok" | "on" | "")[]; color?: string }) {
  return (
    <div className="lab-soft mb-1 flex items-center gap-2 text-[0.55em] font-extrabold tracking-wider" style={color ? { color } : undefined}>
      {children}
      {dots && (
        <span className="flex gap-1">
          {dots.map((d, i) => (
            <i key={i} className="h-1.5 w-5 rounded-full" style={{ background: d === "ok" ? "#22b98c" : d === "on" ? "var(--lab-accent)" : "var(--lab-line)" }} />
          ))}
        </span>
      )}
    </div>
  );
}

/**
 * Mochi (hoặc Bit) đứng cạnh bàn, nói bằng bong bóng chữ to: mỗi lần một câu, ngay giữa thí nghiệm.
 * `wide`: bong bóng rộng hơn (câu hỏi có nút chọn).
 */
export function Guide({ who, mood, children, wide }: { who: "mochi" | "bit"; mood: Mood; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="lab-pop-in pointer-events-none mt-1 flex items-start gap-3" aria-live="polite">
      <div className="lab-mascot shrink-0">
        <Mascot who={who} mood={mood} size={180} className="!h-[clamp(4.5rem,21vh,11rem)] !w-[clamp(4.5rem,21vh,11rem)]" />
      </div>
      <div
        className={`lab-say pointer-events-auto mt-[2vh] px-5 py-3.5 font-display text-[clamp(1.15rem,2vh+0.7rem,2rem)] font-extrabold leading-snug sm:px-6 sm:py-4 ${wide ? "max-w-[min(44rem,100%)]" : "max-w-[min(36rem,100%)]"}`}
      >
        {children}
      </div>
    </div>
  );
}
