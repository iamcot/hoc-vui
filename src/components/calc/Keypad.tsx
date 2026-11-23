"use client";
import { FX580_ROWS, type CalcKey } from "@/content/devices/fx580";

/** Máy tính fx-580VN X ảo (rút gọn). */
export function Keypad({
  screen,
  indicator,
  result,
  highlight,
  onPress,
  shakeKey,
  compact = false,
}: {
  screen: string;
  indicator?: "S" | "A" | null;
  result?: string | null;
  highlight?: string | null;
  onPress: (k: CalcKey) => void;
  shakeKey?: number;
  compact?: boolean;
}) {
  return (
    <div className={`mx-auto w-full ${compact ? "max-w-[300px]" : "max-w-[340px]"} select-none rounded-[2rem] bg-gradient-to-b from-[#2f3452] to-[#232741] p-3 pb-4 shadow-[0_18px_40px_-12px_rgba(35,39,65,0.6)]`}>
      <div className="mb-1 flex items-center justify-between px-2 text-[10px] font-bold tracking-widest text-white/60">
        <span>CASIO</span>
        <span>fx-580VN X</span>
      </div>
      {/* màn hình LCD */}
      <div key={shakeKey} className={`mb-3 rounded-xl border-4 border-[#1b1e33] bg-[#c9d6c1] px-3 py-2 font-mono text-[#1d2a1d] shadow-inner ${shakeKey ? "shake" : ""}`}>
        <div className="flex h-4 gap-2 text-[10px] font-bold">
          {indicator === "S" && <span className="rounded bg-[#1d2a1d] px-1 text-[#c9d6c1]">S</span>}
          {indicator === "A" && <span className="rounded bg-[#1d2a1d] px-1 text-[#c9d6c1]">A</span>}
          <span className="ml-auto opacity-60">Math ▲</span>
        </div>
        <div className="min-h-7 overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-7">{screen || " "}</div>
        <div className="min-h-7 text-right text-xl font-bold leading-7">{result ?? " "}</div>
      </div>
      <div className="space-y-1.5">
        {FX580_ROWS.map((row, ri) => (
          <div key={ri} className={`grid gap-1.5 ${row.length === 6 ? "grid-cols-6" : "grid-cols-5"} ${ri === 4 ? "mt-3" : ""}`}>
            {row.map((k) => (
              <KeyButton key={k.id} k={k} on={highlight === k.id} onPress={onPress} big={row.length === 5} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyButton({ k, on, onPress, big }: { k: CalcKey; on: boolean; onPress: (k: CalcKey) => void; big: boolean }) {
  const base =
    k.id === "SHIFT"
      ? "bg-shift text-white"
      : k.id === "ALPHA"
        ? "bg-alpha text-white"
        : k.kind === "num" || k.kind === "op"
          ? "bg-[#eceaf3] text-ink"
          : k.kind === "eq"
            ? "bg-[#eceaf3] text-ink"
            : k.id === "AC" || k.id === "DEL"
              ? "bg-[#ff9f6b] text-white"
              : "bg-[#454b6e] text-white";
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-3 w-full justify-between px-0.5 text-[8px] font-extrabold leading-3">
        <span className="text-[#ffc94d]">{k.shift ?? ""}</span>
        <span className="text-[#ff7b8c]">{k.alpha ?? ""}</span>
      </div>
      <button
        type="button"
        onClick={() => onPress(k)}
        aria-label={k.label}
        className={`w-full rounded-lg border-b-[3px] border-black/25 font-bold transition active:translate-y-[2px] active:border-b-0 ${base} ${big ? "h-10 text-base" : "h-8 text-[11px]"} ${
          on ? "pulse-ring ring-2 ring-sky ring-offset-1 ring-offset-[#2a2e4a]" : ""
        }`}
      >
        {k.label}
      </button>
    </div>
  );
}
