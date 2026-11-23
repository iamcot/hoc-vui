"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { TONE_GLYPH, TONE_SAY, blendParts, spellSyllable } from "@/lib/viet";
import { speakSeq } from "@/lib/speech/tts";
import { KIND_COLOR } from "./Glyph";

function Tile({ text, color, active, big, sub }: { text: string; color: string; active: boolean; big?: boolean; sub?: string }) {
  return (
    <motion.span
      layout
      animate={{ scale: active ? 1.12 : 1, y: active ? -6 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative inline-flex flex-col items-center justify-center rounded-3xl bg-white px-4 font-display font-extrabold leading-none ${big ? "min-w-[6rem] py-3 text-[clamp(3rem,11vh,5.5rem)]" : "min-w-[4rem] py-2 text-[clamp(2rem,7vh,3.5rem)]"}`}
      style={{ color, boxShadow: `0 5px 0 0 ${color}${active ? "" : "66"}, 0 12px 24px -14px rgba(40,40,120,.5)` }}
    >
      {text}
      {sub && <span className="mt-1 text-xs font-bold text-ink-soft">{sub}</span>}
    </motion.span>
  );
}

const Op = ({ c }: { c: string }) => <span className="font-display text-3xl font-extrabold text-ink-soft/60">{c}</span>;

/**
 * Ghép tiếng: [âm đầu] + [vần] → [tiếng không dấu] + [dấu] → [tiếng].
 * Bấm "Đánh vần" thì Mochi đọc từng bước, thẻ đang đọc nhảy lên.
 */
export function Blend({ word, emoji, phrase }: { word: string; emoji?: string; phrase?: string }) {
  const p = blendParts(word);
  const seq = spellSyllable(word);
  const [step, setStep] = useState(-1);
  const [busy, setBusy] = useState(false);
  // vị trí từng thẻ trong chuỗi đánh vần
  const idx = p.onset ? { onset: 0, rime: 1, bare: 2, tone: 3, full: 4 } : { onset: -9, rime: -9, bare: 0, tone: 1, full: 2 };
  const on = (k: keyof typeof idx) => step === idx[k];
  const toned = p.tone !== "ngang";

  async function play() {
    if (busy) return;
    setBusy(true);
    await speakSeq(seq, setStep);
    setTimeout(() => {
      setStep(-1);
      setBusy(false);
    }, 500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
        {p.onset && (
          <>
            <Tile text={p.onset} color={KIND_COLOR["phu-am"].fg} active={on("onset")} sub="âm đầu" />
            <Op c="+" />
            <Tile text={p.rime} color={KIND_COLOR.van.fg} active={on("rime")} sub="vần" />
            <Op c="→" />
          </>
        )}
        <Tile text={p.bare} color="var(--color-ink)" active={on("bare")} />
        {toned && (
          <>
            <Op c="+" />
            <Tile text={TONE_GLYPH[p.tone]} color={KIND_COLOR.thanh.fg} active={on("tone")} sub={`dấu ${TONE_SAY[p.tone]}`} />
            <Op c="→" />
            <Tile text={p.full} color="var(--color-ink)" active={on("full")} big />
          </>
        )}
        {emoji && <span className="text-[clamp(2.5rem,9vh,4.5rem)] drop-shadow">{emoji}</span>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button className="btn btn-peach" onClick={play} disabled={busy}>
          🔊 Đánh vần
        </button>
        <span className="rounded-full bg-white/80 px-4 py-2 font-bold text-ink-soft">
          {seq.map((x, i) => (
            <span key={i} className={i === step ? "text-peach" : ""}>
              {i > 0 && " – "}
              {x}
            </span>
          ))}
        </span>
        {phrase && phrase !== word && <span className="font-display text-2xl font-extrabold text-ink">{phrase}</span>}
      </div>
    </div>
  );
}
