"use client";
import type { CalcKey, KeyStep } from "@/content/devices/fx580";
import { parseKeys } from "@/content/devices/fx580";

const KIND_STYLE: Record<CalcKey["kind"], string> = {
  mod: "bg-white text-ink border-line",
  fn: "bg-key-fn text-white border-key-fn",
  num: "bg-[#f4f2f8] text-ink border-[#dcd8e6]",
  op: "bg-[#f4f2f8] text-ink border-[#dcd8e6]",
  ctl: "bg-[#ffd6a8] text-ink border-[#f2bd84]",
  eq: "bg-sky text-white border-sky",
};

function modStyle(id: string) {
  if (id === "SHIFT") return "bg-shift text-white border-shift";
  if (id === "ALPHA") return "bg-alpha text-white border-alpha";
  return "";
}

/** Một phím dạng "viên kẹo" để hiển thị trong chuỗi phím */
export function KeyChip({ step, active, done, index }: { step: KeyStep; active?: boolean; done?: boolean; index?: number }) {
  const { key, as, layer } = step;
  const cls = modStyle(key.id) || KIND_STYLE[key.kind];
  return (
    <span className="relative inline-flex flex-col items-center">
      {as && (
        <span className={`mb-0.5 text-[10px] font-extrabold leading-none ${layer === "alpha" ? "text-alpha" : "text-shift"}`}>{as}</span>
      )}
      <span
        className={`inline-flex min-w-10 items-center justify-center rounded-xl border-b-4 px-2.5 py-1.5 font-display text-sm font-bold transition ${cls} ${
          active ? "pulse-ring scale-110" : ""
        } ${done ? "opacity-40" : ""}`}
      >
        {key.label}
      </span>
      {index !== undefined && <span className="mt-0.5 text-[10px] text-ink-soft">{index + 1}</span>}
    </span>
  );
}

/** Chuỗi phím đầy đủ, có thể đánh dấu bước đang bấm */
export function KeySeq({ keys, current = -1, numbered = false }: { keys: string[]; current?: number; numbered?: boolean }) {
  const steps = parseKeys(keys);
  return (
    <div className="flex flex-wrap items-end gap-1.5">
      {steps.map((s, i) => (
        <KeyChip key={i} step={s} active={i === current} done={current >= 0 && i < current} index={numbered ? i : undefined} />
      ))}
    </div>
  );
}
