"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FreeCalc } from "./FreeCalc";
import { fmtDecimal, fmtResult, type CalcResult } from "@/lib/calc-eval";
import { Ico } from "@/components/Ico";

/** Kết quả máy ảo gửi sang ô đáp án: dạng hiển thị (phân số) và dạng số thập phân. */
export type FillDetail = { text: string; dec: string; q?: number; r?: number };

const KEY = "hocvui:calc-dock";
export const FILL_EVENT = "hocvui:fill-answer";

/** Bật/tắt máy ảo bấm tự do khi làm bài. Nhớ lựa chọn trên máy này. */
export function useCalcDock(device?: string) {
  const enabled = device === "fx580";
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setOpen(true);
    } catch {
      /* không có localStorage */
    }
  }, []);
  const set = (v: boolean) => {
    setOpen(v);
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      /* bỏ qua */
    }
  };
  return { enabled, open: enabled && open, toggle: () => set(!open), close: () => set(false) };
}

export function CalcToggle({ dock }: { dock: ReturnType<typeof useCalcDock> }) {
  if (!dock.enabled) return null;
  return (
    <button
      type="button"
      onClick={dock.toggle}
      aria-pressed={dock.open}
      className={`chip shrink-0 font-bold transition ${dock.open ? "bg-ink text-white" : "bg-white text-ink"}`}
    >
      <Ico n="calc" /> <span className="hidden sm:inline">Máy tính</span>
      <span className={`ml-1 inline-block h-4 w-7 rounded-full p-0.5 transition ${dock.open ? "bg-mint" : "bg-line"}`}>
        <span className={`block h-3 w-3 rounded-full bg-white transition ${dock.open ? "translate-x-3" : ""}`} />
      </span>
    </button>
  );
}

/** Khung bài làm: máy ảo nằm cạnh câu hỏi (iPad, laptop) hoặc trượt lên từ đáy (màn hẹp). */
export function CalcLayout({ dock, children }: { dock: ReturnType<typeof useCalcDock>; children: ReactNode }) {
  const open = dock.open;
  // bấm "=" là kết quả tự chép vào ô đáp án
  const onResult = useCallback((r: CalcResult | null) => {
    if (!r) return;
    const detail: FillDetail = { text: fmtResult(r, false), dec: fmtDecimal(r.value), q: r.divr?.q, r: r.divr?.r };
    window.dispatchEvent(new CustomEvent(FILL_EVENT, { detail }));
  }, []);
  return (
    <main className={`mx-auto px-4 py-8 sm:px-6 ${open ? "max-w-6xl pb-[70vh] md:pb-8" : "max-w-3xl"}`}>
      <div className={open ? "md:grid md:grid-cols-[minmax(0,1fr)_300px] md:items-start md:gap-6" : ""}>
        <div className="min-w-0">{children}</div>
        <AnimatePresence>
          {open && (
            <motion.aside
              key="calc"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed inset-x-0 bottom-0 z-30 max-h-[68vh] overflow-y-auto rounded-t-3xl bg-white/80 px-4 pb-4 pt-2 shadow-[0_-12px_30px_-10px_rgba(35,39,65,0.35)] backdrop-blur md:sticky md:inset-auto md:top-20 md:z-auto md:max-h-none md:overflow-visible md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none"
            >
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink-soft">
                <span>Bấm = là điền vào ô đáp án</span>
                <button type="button" onClick={dock.close} className="rounded-full bg-white px-3 py-1 shadow-sm" aria-label="Tắt máy tính">
                  ✕
                </button>
              </div>
              <FreeCalc onResult={onResult} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
