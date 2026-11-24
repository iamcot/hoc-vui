"use client";
import type React from "react";
import { useState } from "react";
import type { Block } from "@/content/types";
import { RichText } from "@/components/RichText";
import { Art } from "@/components/Art";
import { KeySeq } from "@/components/calc/Keys";
import { TryIt } from "@/components/calc/TryIt";
import { FreeCalc } from "@/components/calc/FreeCalc";
import { sendToAnswer } from "@/components/calc/CalcDock";
import { useProgress } from "@/lib/store";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { LettersRow, SayRow } from "@/components/reading/Glyph";
import { Blend } from "@/components/reading/Blend";
import { ReadAloud } from "@/components/reading/ReadAloud";
import { Keyboard } from "@/components/typing/Keyboard";
import { TypeLine } from "@/components/typing/TypeLine";
import { Ico } from "@/components/Ico";
import { CodeDemo } from "@/components/code/CodeDemo";

export function BlockView({ b, device, lead }: { b: Block; device?: "fx580" | "keyboard"; lead?: React.ReactNode }) {
  switch (b.type) {
    case "text":
      return <RichText text={b.text} className="text-lg text-ink-soft sm:text-xl" />;
    case "image":
      return (
        <figure>
          {/* ảnh co theo chiều cao màn hình để cả slide vừa một khung nhìn */}
          <Art id={b.asset} emoji="🖼️" className="mx-auto aspect-[3/2] w-full max-w-[max(280px,calc((100dvh-300px)*1.5))]" />
          {b.caption && <figcaption className="mt-2 text-center text-sm text-ink-soft">{b.caption}</figcaption>}
        </figure>
      );
    case "keys":
      if (b.tryIt && device) return <TryIt keys={b.keys} result={b.result} label={b.label} lead={lead} />;
      return (
        <div className="rounded-3xl bg-sky-soft/50 p-4">
          {b.label && <div className="mb-2 font-bold">{b.label}</div>}
          <div className="flex flex-wrap items-end gap-3">
            <KeySeq keys={b.keys} />
            {b.result && <span className="rounded-xl bg-[#c9d6c1] px-3 py-1.5 font-mono text-lg font-bold text-[#1d2a1d]">{b.result}</span>}
          </div>
        </div>
      );
    case "keyboard":
      return (
        <figure className="space-y-2">
          <Keyboard keys={b.keys} focus={b.focus} />
          {b.label && <figcaption className="text-center text-sm font-semibold text-ink-soft">{b.label}</figcaption>}
        </figure>
      );
    case "drill":
      return <TypeLine text={b.text} label={b.label ?? "Gõ thử dòng này"} keys={b.keys} focus={b.focus} />;
    case "tip":
      return (
        <div className={`flex gap-3 rounded-3xl p-4 ${b.tone === "warn" ? "bg-peach-soft" : "bg-sun-soft"}`}>
          <span className="text-2xl"><Ico n={b.tone === "warn" ? "warn" : "hint"} /></span>
          <RichText text={b.text} />
        </div>
      );
    case "example":
      return (
        <div className="grid gap-x-6 gap-y-3 rounded-3xl border-2 border-dashed border-sky/40 bg-sky-soft/40 p-4 sm:p-5 md:grid-cols-2">
          <div className="space-y-3">
            <div className="chip bg-sky text-white">Ví dụ</div>
            <RichText text={b.problem} className="text-lg font-bold" />
            <ol className="list-inside list-decimal space-y-1 text-ink-soft">
              {b.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="space-y-3 md:self-end">
            {b.keys && device && (
              <div>
                <div className="mb-1 text-sm font-bold text-ink-soft">Bấm máy:</div>
                <KeySeq keys={b.keys} />
              </div>
            )}
            <div className="font-display text-lg font-extrabold text-mint">Đáp số: {b.answer}</div>
          </div>
        </div>
      );
    case "check":
      return <InlineCheck q={b.question} device={device} />;
    case "letters":
      return <LettersRow items={b.items} />;
    case "blend":
      return <Blend word={b.word} emoji={b.emoji} phrase={b.phrase} />;
    case "say":
      return <SayRow items={b.items} label={b.label} />;
    case "read":
      return <ReadAloud text={b.text} strict={b.strict} label={b.label} />;
    case "code":
      return <CodeDemo map={b.map} dir={b.dir} program={b.program} label={b.label} draw={b.draw} />;
  }
}

function InlineCheck({ q, device }: { q: Extract<Block, { type: "check" }>["question"]; device?: "fx580" | "keyboard" }) {
  const [done, setDone] = useState(false);
  const [guided, setGuided] = useState(false);
  const { data } = useProgress();
  // máy ảo hiện sẵn bên cạnh câu hỏi (bấm = là điền đáp án); mở "Xem cách bấm" thì dùng máy của phần hướng dẫn
  const calc = device === "fx580" && data.calcMode === "virtual" && !done && !guided;
  return (
    <div className="rounded-3xl bg-lilac/10 p-4 sm:p-5">
      <div className="chip mb-3 bg-lilac/20 text-lilac"><Ico n="pencil" /> Thử nhanh</div>
      <div className={calc ? "grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_280px]" : ""}>
        <div className="min-w-0">
          {done ? <p className="font-bold text-mint">Xong rồi! Bấm Tiếp để đi tiếp nhé.</p> : <QuestionCard q={q} device={device} onNext={() => setDone(true)} onGuide={() => setGuided(true)} />}
        </div>
        {calc && (
          <div>
            <p className="mb-1 text-center text-xs font-bold text-ink-soft">Bấm = là điền vào ô đáp án</p>
            <FreeCalc onResult={sendToAnswer} />
          </div>
        )}
      </div>
    </div>
  );
}
