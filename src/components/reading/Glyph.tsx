"use client";
import { motion } from "motion/react";
import type { LetterItem } from "@/content/types";
import { speak } from "@/lib/speech/tts";

/** màu theo loại: nguyên âm cam, phụ âm xanh, chữ ghép tím, vần xanh lá, thanh hồng */
export const KIND_COLOR: Record<LetterItem["kind"], { fg: string; bg: string; label: string }> = {
  "nguyen-am": { fg: "var(--color-peach)", bg: "var(--color-peach-soft)", label: "nguyên âm" },
  "phu-am": { fg: "var(--color-sky)", bg: "var(--color-sky-soft)", label: "phụ âm" },
  "chu-ghep": { fg: "var(--color-lilac)", bg: "#ece5ff", label: "chữ ghép" },
  van: { fg: "var(--color-mint)", bg: "var(--color-mint-soft)", label: "vần" },
  thanh: { fg: "var(--color-berry)", bg: "var(--color-berry-soft)", label: "thanh" },
};

export function SpeakButton({ text, className = "", label = "Nghe" }: { text: string; className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void speak(text);
      }}
      className={`inline-grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow-[var(--shadow-pop)] active:translate-y-0.5 ${className}`}
      aria-label={`${label}: ${text}`}
    >
      🔊
    </button>
  );
}

/** Thẻ chữ thật to. Chạm vào là nghe đọc. */
export function GlyphCard({ item, size = "lg", delay = 0 }: { item: LetterItem; size?: "md" | "lg" | "xl"; delay?: number }) {
  const c = KIND_COLOR[item.kind];
  const len = [...item.g].length;
  const font =
    size === "xl"
      ? len > 3
        ? "text-[clamp(3.5rem,13vh,7rem)]"
        : "text-[clamp(5rem,22vh,11rem)]"
      : size === "lg"
        ? len > 3
          ? "text-[clamp(2.6rem,9vh,4.5rem)]"
          : "text-[clamp(3.5rem,14vh,7rem)]"
        : "text-5xl";
  const showUpper = item.kind !== "van" && item.kind !== "thanh" && len <= 3;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24, rotate: -4 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 18 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => void speak(item.say)}
      className="group relative flex min-w-[7.5rem] flex-col items-center justify-center rounded-[2rem] bg-white px-6 pb-4 pt-3 shadow-[0_14px_30px_-16px_rgba(40,40,120,0.55)]"
      style={{ boxShadow: `0 6px 0 0 ${c.fg}, 0 18px 30px -18px rgba(40,40,120,.5)` }}
      aria-label={`Chữ ${item.g}, đọc là ${item.say}`}
    >
      {showUpper && (
        <span className="absolute left-4 top-2 font-display text-2xl font-extrabold opacity-40" style={{ color: c.fg }}>
          {item.g[0].toUpperCase() + item.g.slice(1)}
        </span>
      )}
      <span className="absolute right-3 top-3 text-base opacity-60 transition group-hover:opacity-100">🔊</span>
      <span className={`font-display font-extrabold leading-[1.15] ${font}`} style={{ color: c.fg }}>
        {item.g}
      </span>
      <span className="mt-1 rounded-full px-3 py-0.5 text-sm font-extrabold" style={{ background: c.bg, color: c.fg }}>
        đọc là “{item.say}”
      </span>
      {item.key && item.key !== item.g && (
        <span className="mt-2 text-lg font-bold text-ink-soft">
          {item.emoji} {item.key}
        </span>
      )}
    </motion.button>
  );
}

export function LettersRow({ items }: { items: LetterItem[] }) {
  const size = items.length === 1 ? "xl" : items.length <= 3 ? "lg" : "md";
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-5 py-2">
      {items.map((it, i) => (
        <GlyphCard key={it.g + i} item={it} size={size} delay={i * 0.12} />
      ))}
    </div>
  );
}

/** Dãy tiếng nhỏ: chạm để nghe */
export function SayRow({ items, label }: { items: string[]; label?: string }) {
  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-extrabold uppercase tracking-wide text-ink-soft">{label}</div>}
      <div className="flex flex-wrap gap-3">
        {items.map((w, i) => (
          <motion.button
            key={w + i}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            whileTap={{ scale: 0.92 }}
            onClick={() => void speak(w)}
            className={`rounded-2xl bg-white px-4 py-2 font-display font-extrabold text-ink shadow-[var(--shadow-pop)] ${w.includes("\n") ? "whitespace-pre-line text-left text-xl leading-snug" : "text-3xl"}`}
          >
            {w}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
