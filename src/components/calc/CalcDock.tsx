"use client";
import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FreeCalc } from "./FreeCalc";
import { fmtDecimal, fmtResult, type CalcResult } from "@/lib/calc-eval";
import { useProgress } from "@/lib/store";

/** Kết quả máy ảo gửi sang ô đáp án: dạng hiển thị (phân số) và dạng số thập phân. */
export type FillDetail = { text: string; dec: string; q?: number; r?: number };

export const FILL_EVENT = "hocvui:fill-answer";

/** bấm "=" trên máy ảo: kết quả tự chép vào ô đáp án đang mở */
export function sendToAnswer(r: CalcResult | null) {
  if (!r) return;
  const detail: FillDetail = { text: fmtResult(r, false), dec: fmtDecimal(r.value), q: r.divr?.q, r: r.divr?.r };
  window.dispatchEvent(new CustomEvent(FILL_EVENT, { detail }));
}

/** Máy ảo khi làm bài: hiện khi chọn "Máy ảo" (một lựa chọn chung cho cả app, nút ở thanh trên). */
export function useCalcDock(device?: string) {
  const { data, setCalcMode } = useProgress();
  const enabled = device === "fx580";
  const open = enabled && data.calcMode === "virtual";
  return { enabled, open, toggle: () => setCalcMode(open ? "physical" : "virtual"), close: () => setCalcMode("physical") };
}

/** nút duy nhất chọn Máy ảo / Máy thật (thanh trên của bài học, luyện tập, kiểm tra, phòng thi) */
export function CalcModeToggle({ className = "" }: { className?: string }) {
  const { data, setCalcMode } = useProgress();
  return (
    <div className={`inline-flex shrink-0 rounded-full bg-white p-1 text-sm font-bold shadow-sm ${className}`} role="group" aria-label="Dùng máy tính">
      {(["virtual", "physical"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setCalcMode(m)}
          aria-pressed={data.calcMode === m}
          className={`rounded-full px-3 py-1 transition ${data.calcMode === m ? "bg-sky text-white" : "text-ink-soft"}`}
        >
          {m === "virtual" ? "Máy ảo" : "Máy thật"}
        </button>
      ))}
    </div>
  );
}

export function CalcToggle({ dock }: { dock: ReturnType<typeof useCalcDock> }) {
  if (!dock.enabled) return null;
  return <CalcModeToggle />;
}

/** Khung bài làm: máy ảo nằm cạnh câu hỏi (iPad, laptop) hoặc trượt lên từ đáy (màn hẹp). */
export function CalcLayout({ dock, children }: { dock: ReturnType<typeof useCalcDock>; children: ReactNode }) {
  const open = dock.open;
  const onResult = sendToAnswer;
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
