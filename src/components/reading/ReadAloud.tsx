"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { compareReading, type ReadResult } from "@/lib/viet";
import { canRecord, detectEngine, listen, type Engine, type Session } from "@/lib/speech/listen";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { play } from "@/lib/sound";
import { Mascot } from "@/components/Mascot";
import { FEEDBACK } from "./feedback";
import { Ico } from "@/components/Ico";

type State = "idle" | "listening" | "checking" | "done" | "self" | "error";

const MARK_CLS = { ok: "text-mint", tone: "text-sun underline decoration-wavy decoration-2 underline-offset-8", miss: "text-berry underline decoration-wavy decoration-2 underline-offset-8" } as const;

/**
 * Bé đọc to, máy nghe và tô màu từng tiếng: xanh đúng, vàng sai dấu, đỏ đọc sai/thiếu.
 * Máy không nhận dạng được thì cho bé nghe lại giọng mình và tự chấm.
 */
export function ReadAloud({
  text,
  strict = true,
  label,
  onResult,
  compact = false,
}: {
  text: string;
  strict?: boolean;
  label?: string;
  /** gọi khi có kết quả (đúng/sai, lời nghe được) */
  onResult?: (pass: boolean, heard: string) => void;
  compact?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const [engine, setEngine] = useState<Engine | null>(null);
  const [level, setLevel] = useState(0);
  const [res, setRes] = useState<ReadResult | null>(null);
  const [mine, setMine] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const sess = useRef<Session | null>(null);

  useEffect(() => {
    void detectEngine().then(setEngine);
    return () => {
      sess.current?.stop();
      stopSpeak();
    };
  }, []);
  useEffect(() => {
    setState("idle");
    setRes(null);
    setMine(null);
    setTries(0);
  }, [text]);

  const sylls = text.split(/(\s+)/);
  let wi = -1;

  async function start() {
    if (state === "listening") {
      sess.current?.stop();
      return;
    }
    stopSpeak();
    setRes(null);
    try {
      setState("listening");
      const s = await listen(text, { onLevel: setLevel });
      sess.current = s;
      const heard = await s.result;
      setLevel(0);
      setEngine(heard.engine);
      if (heard.recording) setMine(heard.recording.url);
      // máy không nghe ra chữ nào (hay gặp với âm lẻ như "a", "bờ"): cho bé nghe lại và tự chấm
      if (heard.engine === "self" || (!heard.alts.length && heard.recording)) {
        setState(heard.recording ? "self" : "error");
        if (heard.recording) void speak(FEEDBACK.tu);
        return;
      }
      setState("checking");
      const r = compareReading(text, heard.alts, strict);
      setRes(r);
      setTries((t) => t + 1);
      setState("done");
      play(r.pass ? "correct" : "wrong");
      setTimeout(() => void speak(r.pass ? FEEDBACK.dung : r.marks.some((m) => m === "tone") ? FEEDBACK.dau : FEEDBACK.lai), 500);
      onResult?.(r.pass, r.heard);
    } catch {
      setState("error");
    }
  }

  const big = text.length < 14 ? "text-[clamp(2.6rem,10vh,4.5rem)]" : text.length < 40 ? "text-[clamp(1.8rem,6vh,3rem)]" : "text-[clamp(1.4rem,4.2vh,2.1rem)]";

  return (
    <div className={`rounded-[2rem] bg-white/85 ${compact ? "p-4" : "p-5 sm:p-6"} shadow-[0_12px_30px_-18px_rgba(40,40,120,.5)]`}>
      {label && <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-ink-soft"><Ico n="mic" /> {label}</div>}
      <p className={`font-display font-extrabold leading-snug text-ink ${big}`}>
        {sylls.map((w, i) => {
          if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
          wi++;
          const m = res?.marks[wi];
          return (
            <motion.span key={i} animate={m ? { y: [0, -6, 0] } : {}} transition={{ delay: wi * 0.06 }} className={`inline-block ${m ? MARK_CLS[m] : ""}`}>
              {w}
            </motion.span>
          );
        })}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="btn btn-ghost" onClick={() => void speak(text)}>
          <Ico n="sound" /> Nghe mẫu
        </button>
        {canRecord() ? (
          <button
            onClick={start}
            disabled={state === "checking"}
            className={`relative inline-flex h-16 items-center gap-2 rounded-full px-6 font-display text-lg font-extrabold text-white shadow-[var(--shadow-pop)] transition active:translate-y-0.5 ${state === "listening" ? "bg-berry" : "bg-peach"}`}
          >
            {state === "listening" && (
              <span className="absolute inset-0 -z-0 rounded-full bg-berry/40" style={{ transform: `scale(${1 + level * 0.35})`, transition: "transform 80ms" }} />
            )}
            <span className="relative text-2xl">{state === "listening" ? "⏹" : <Ico n="mic" />}</span>
            <span className="relative">{state === "listening" ? "Đang nghe… chạm để dừng" : state === "checking" ? "Đang chấm…" : tries ? "Đọc lại" : "Em đọc nào"}</span>
          </button>
        ) : (
          <span className="text-sm text-ink-soft">Máy này chưa cho dùng micro, em đọc to cho bố mẹ nghe nhé.</span>
        )}
        {mine && (
          <button className="btn btn-ghost" onClick={() => new Audio(mine).play()}>
            ▶ Nghe lại giọng em
          </button>
        )}
      </div>

      <AnimatePresence>
        {state === "done" && res && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 flex items-center gap-3 rounded-3xl p-3 ${res.pass ? "bg-mint-soft" : "bg-sun-soft"}`}>
            <Mascot mood={res.pass ? "cheer" : "oops"} size={56} />
            <div>
              <div className="font-display text-xl font-extrabold">{res.pass ? FEEDBACK.dung : res.marks.some((m) => m === "tone") ? FEEDBACK.dau : FEEDBACK.lai}</div>
              {!res.pass && <div className="text-sm text-ink-soft">Mochi nghe được: “{res.heard || "…"}”. Bấm <Ico n="sound" /> nghe mẫu rồi đọc lại.</div>}
            </div>
          </motion.div>
        )}
        {state === "self" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl bg-sky-soft p-3">
            <span className="font-bold">{FEEDBACK.tu}</span>
            <button
              className="btn btn-mint"
              onClick={() => {
                setState("idle");
                play("correct");
                onResult?.(true, "__ok__");
              }}
            >
              ✓ Đúng rồi
            </button>
            <button className="btn btn-ghost" onClick={start}>
              ↻ Đọc lại
            </button>
          </motion.div>
        )}
        {state === "error" && <div className="mt-3 text-sm text-berry">Mochi chưa nghe thấy gì. Em cho phép dùng micro rồi đọc to hơn một chút nhé.</div>}
      </AnimatePresence>
      {engine === "self" && state === "idle" && <div className="mt-2 text-xs text-ink-soft">Máy này chưa tự chấm được, em đọc xong thì nghe lại và tự chấm nhé.</div>}
    </div>
  );
}
