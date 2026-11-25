"use client";
import { useEffect, useRef, useState } from "react";
import { FILL_EVENT, type FillDetail } from "@/components/calc/CalcDock";
import { motion } from "motion/react";
import type { Question } from "@/content/types";
import { checkAnswer } from "@/lib/check";
import { KeySeq } from "@/components/calc/Keys";
import { TryIt } from "@/components/calc/TryIt";
import { RichText } from "@/components/RichText";
import { play, playVoice } from "@/lib/sound";
import { speak, speakSeq, stopSpeak } from "@/lib/speech/tts";
import { ReadAloud } from "@/components/reading/ReadAloud";
import { TypeLine } from "@/components/typing/TypeLine";
import { Ico } from "@/components/Ico";

/** đọc đề: lời dẫn rồi tới chữ cần nghe */
function readOut(q: Question) {
  if (q.voice?.length) void speakSeq(q.voice);
  else if (q.say) void speak(q.say);
}

export interface AnswerResult {
  correct: boolean;
  input: string;
  hinted: boolean;
}

export function showAnswer(q: Question) {
  if (q.kind === "pair") {
    const [a, b] = q.answer.split(";");
    return `${q.pairLabels?.[0] ?? "a"} = ${a}, ${q.pairLabels?.[1] ?? "b"} = ${b}`;
  }
  if (q.kind === "number") {
    const n = Number(q.answer.replace(",", "."));
    return `${isNaN(n) ? q.answer : n.toLocaleString("vi-VN", { maximumFractionDigits: 6 })}${q.unit ? ` ${q.unit}` : ""}`;
  }
  return q.answer;
}

/** Màn hình máy tính hiện gì sau khi bấm "=" */
function calcShows(q: Question) {
  if (q.kind === "pair") {
    const [a, b] = q.answer.split(";");
    // chia có dư (÷R) ra cả thương và dư; các dạng khác (hệ, bậc hai) chuỗi phím chỉ tính giá trị đầu
    return isRemainder(q) ? `Q=${a}, R=${b}` : a;
  }
  return q.answer;
}
const isRemainder = (q: Question) => q.keys?.some((k) => k.endsWith(":÷R")) ?? false;

/**
 * Một câu hỏi. mode "learn": có gợi ý, giải thích, xem cách bấm.
 * mode "race": trả lời xong sang câu luôn (kiểm tra, thi đấu).
 */
export function QuestionCard({
  q,
  mode = "learn",
  onNext,
  device,
  onGuide,
}: {
  q: Question;
  mode?: "learn" | "race";
  onNext: (r: AnswerResult) => void;
  device?: "fx580" | "keyboard";
  /** báo khi bé mở "Xem cách bấm" (để ẩn máy ảo bấm tự do bên cạnh) */
  onGuide?: () => void;
}) {
  const [input, setInput] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [hinted, setHinted] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput("");
    setB("");
    setResult(null);
    setHinted(false);
    setShowKeys(false);
    if (q.kind !== "choice" && q.kind !== "read") setTimeout(() => ref.current?.focus(), 50);
    // môn Tập đọc: tự đọc đề cho bé nghe
    const tm = setTimeout(() => readOut(q), 350);
    return () => {
      clearTimeout(tm);
      stopSpeak();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id, q.kind]);

  // nút "Điền vào ô đáp án" của máy ảo bấm tự do
  useEffect(() => {
    if (result !== null || q.kind === "choice" || q.kind === "read") return;
    const h = (e: Event) => {
      const d = (e as CustomEvent<FillDetail>).detail;
      if (!d) return;
      const one = d.q !== undefined ? String(d.q) : q.kind === "fraction" ? d.text : d.dec;
      if (q.kind === "pair") {
        if (d.r !== undefined) {
          setInput(String(d.q));
          setB(String(d.r));
        } else if (!input) setInput(d.dec);
        else setB(d.dec);
      } else setInput(one);
      ref.current?.focus();
    };
    window.addEventListener(FILL_EVENT, h);
    return () => window.removeEventListener(FILL_EVENT, h);
  }, [q.kind, result, input]);

  const value = q.kind === "pair" ? `${input};${b}` : input;

  function submit(v = value) {
    if (result !== null) return;
    const ok = checkAnswer(q, v);
    play(ok ? "correct" : "wrong");
    if (mode === "race") {
      onNext({ correct: ok, input: v, hinted });
      return;
    }
    // thỉnh thoảng Mochi khen một câu ngắn, không khen mọi câu cho đỡ mệt tai
    if (ok && Math.random() < 0.3) playVoice(`vo-correct-${1 + Math.floor(Math.random() * 3)}`);
    setResult(ok);
  }

  const insert = (s: string) => {
    setInput((x) => x + s);
    ref.current?.focus();
  };

  return (
    <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
      <div className="flex items-center gap-3">
        {(q.say || q.voice) && (
          <button type="button" onClick={() => readOut(q)} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-2xl shadow-[var(--shadow-pop)] active:translate-y-0.5" aria-label="Nghe lại đề">
            <Ico n="sound" />
          </button>
        )}
        <RichText text={q.kind === "type" ? "Gõ lại dòng này, nhìn màn hình nhé" : q.prompt} className="font-display text-xl font-bold sm:text-2xl" />
      </div>

      {q.kind === "type" ? (
        <TypeLine
          key={q.id}
          text={q.answer}
          big
          onDone={(r) => {
            // gõ phải đúng từng phím mới đi tiếp, nên đạt hay không tính theo độ chính xác
            const ok = r.acc >= 90;
            play(ok ? "correct" : "wrong");
            setTimeout(() => (mode === "race" ? onNext({ correct: ok, input: `${r.wpm}wpm ${r.acc}%`, hinted }) : setResult(ok)), mode === "race" ? 350 : 0);
          }}
        />
      ) : q.kind === "read" ? (
        <div className="space-y-3">
          <ReadAloud
            key={q.id}
            text={q.answer}
            strict={q.strict}
            compact
            onResult={(ok, heard) => {
              if (!ok) return;
              if (mode === "race") onNext({ correct: true, input: heard, hinted });
              else setResult(true);
            }}
          />
          {result === null && (
            <button className="btn btn-ghost" onClick={() => (mode === "race" ? onNext({ correct: false, input: "", hinted }) : setResult(false))}>
              Bỏ qua câu này
            </button>
          )}
        </div>
      ) : q.kind === "choice" ? (
        <div className={`grid gap-3 ${q.big ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"}`}>
          {q.choices!.map((c) => {
            const picked = input === c;
            const state = result === null ? "" : c === q.answer ? "border-mint bg-mint-soft" : picked ? "border-berry bg-berry-soft" : "opacity-60";
            return (
              <button
                key={c}
                disabled={result !== null}
                onClick={() => {
                  setInput(c);
                  submit(c);
                }}
                className={`rounded-2xl border-2 border-line bg-white px-4 font-bold transition hover:border-sky active:scale-[0.98] ${q.big ? "py-5 text-center font-display text-4xl font-extrabold sm:text-5xl" : "py-3.5 text-left text-lg"} ${state}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      ) : q.kind === "pair" ? (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-bold text-ink-soft">
            {q.pairLabels?.[0] ?? "a"}
            <input
              ref={ref}
              value={input}
              disabled={result !== null}
              inputMode="numeric"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-36 rounded-2xl border-2 border-line bg-white px-4 py-3 text-xl font-bold text-ink outline-none focus:border-sky"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ink-soft">
            {q.pairLabels?.[1] ?? "b"}
            <input
              value={b}
              disabled={result !== null}
              inputMode="numeric"
              onChange={(e) => setB(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-36 rounded-2xl border-2 border-line bg-white px-4 py-3 text-xl font-bold text-ink outline-none focus:border-sky"
            />
          </label>
          <button className="btn btn-primary" onClick={() => submit()} disabled={result !== null || !input || !b}>
            Trả lời
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={ref}
              value={input}
              disabled={result !== null}
              inputMode={q.kind === "fraction" ? "text" : "decimal"}
              placeholder={q.kind === "fraction" ? "vd. 7/12" : "Nhập đáp số"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-56 rounded-2xl border-2 border-line bg-white px-4 py-3 text-2xl font-bold outline-none focus:border-sky"
            />
            {q.unit && <span className="text-lg font-bold text-ink-soft">{q.unit}</span>}
            <button className="btn btn-primary" onClick={() => submit()} disabled={result !== null || !input}>
              Trả lời
            </button>
          </div>
          {result === null && (
            <div className="flex gap-2">
              {["−", q.kind === "fraction" ? "/" : ","].map((s) => (
                <button key={s} onClick={() => insert(s === "−" ? "-" : s)} className="h-10 w-10 rounded-xl border border-line bg-white font-bold">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === "learn" && result === null && (q.hint || (q.keys && device)) && (
        <div className="flex flex-wrap gap-2 text-sm">
          {q.hint && !hinted && (
            <button className="chip bg-sun-soft text-ink" onClick={() => setHinted(true)}>
              <Ico n="hint" /> Gợi ý
            </button>
          )}
          {q.keys && !showKeys && device && (
            <button
              className="chip bg-sky-soft text-sky"
              onClick={() => {
                setHinted(true);
                setShowKeys(true);
                onGuide?.();
              }}
            >
              <Ico n="calc" /> Xem cách bấm
            </button>
          )}
        </div>
      )}
      {hinted && q.hint && result === null && <div className="rounded-2xl bg-sun-soft p-3 text-sm"><Ico n="hint" /> {q.hint}</div>}
      {showKeys && q.keys && result === null && (
        <TryIt
          keys={q.keys}
          label="Cách bấm"
          result={calcShows(q)}
          doneNote={
            q.kind === "choice"
              ? undefined
              : q.kind === "pair" && !isRemainder(q)
                ? "Đã điền giá trị đầu tiên. Em tự tính nốt ô còn lại rồi bấm “Trả lời” nhé."
                : "Kết quả đã được điền vào ô trả lời, em bấm “Trả lời” nhé."
          }
          onDone={() => {
            if (q.kind === "choice") return;
            if (q.kind === "pair") {
              const [a, c] = q.answer.split(";");
              setInput(a);
              if (isRemainder(q)) setB(c);
            } else setInput(q.answer);
          }}
        />
      )}

      {result !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`space-y-3 rounded-3xl p-4 ${result ? "bg-mint-soft" : "bg-berry-soft"}`}>
          <div className="font-display text-xl font-extrabold">{result ? <><Ico n="party" /> Chính xác!</> : "Chưa đúng rồi"}</div>
          {!result && q.kind === "type" && <div>Sai hơi nhiều phím. Gõ chậm lại một chút, đúng trước rồi mới nhanh nhé.</div>}
          {!result && q.kind !== "type" && (
            <div>
              Đáp án: <b>{showAnswer(q)}</b>
            </div>
          )}
          {q.explain && <div className="text-sm">{q.explain}</div>}
          {q.keys && device && (
            <div className="space-y-1">
              <div className="text-sm font-bold text-ink-soft">Cách bấm trên máy:</div>
              <KeySeq keys={q.keys} />
            </div>
          )}
          <button className="btn btn-primary" autoFocus onClick={() => onNext({ correct: result, input: value, hinted })}>
            Tiếp tục
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
