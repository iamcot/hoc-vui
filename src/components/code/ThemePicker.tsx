"use client";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { Subject } from "@/content/types";
import { initState } from "@/lib/code/run";
import { SKIN_ORDER, SKINS, type SkinId } from "@/lib/code/skins";
import { parseLevel } from "@/lib/code/world";
import { SkinProvider } from "./skin";
import { Stage } from "./Stage";

const SAMPLE = parseLevel({ id: "skin-sample", dir: 1, blocks: [], map: ["S.*.", ".##.", "...G"] });

/**
 * Popup chọn giao diện: mỗi thẻ là một sân nhỏ vẽ bằng đúng giao diện đó.
 * Giao diện của trình độ chưa mở thì khóa, ghi rõ mở khi tới trình độ nào.
 */
export function ThemePicker({ subject, current, open, onPick, onClose }: { subject: Subject; current: SkinId; open: (tierId: string) => boolean; onPick: (id: SkinId) => void; onClose: () => void }) {
  const start = useMemo(() => initState(SAMPLE), []);
  const tierName = (id: string) => subject.tiers.find((t) => t.id === id)?.name ?? id;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4 backdrop-blur-[3px]" onClick={onClose} role="dialog" aria-modal="true" aria-label="Chọn giao diện">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="lt-picker relative max-h-full w-full max-w-3xl overflow-y-auto rounded-[1.4rem] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="lt-picker-x absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
        <h2 className="font-display text-xl font-extrabold tracking-wide">Chọn giao diện</h2>
        <p className="mt-1 text-sm opacity-80">Lên trình độ mới là mở khóa thêm giao diện. Đổi lúc nào cũng được, bài đang làm không bị mất.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SKIN_ORDER.map((id) => {
            const k = SKINS[id];
            const unlocked = open(k.tier);
            const sel = id === current;
            return (
              <button
                key={id}
                disabled={!unlocked}
                onClick={() => onPick(id)}
                className={`lt-pick-card relative overflow-hidden rounded-2xl text-left transition ${sel ? "lt-pick-sel" : ""} ${unlocked ? "hover:-translate-y-0.5" : "cursor-not-allowed"}`}
                aria-pressed={sel}
              >
                <div className={`lt-skin-${id} lt-pick-thumb relative h-28 sm:h-32`}>
                  <SkinProvider value={k}>
                    <div className="pointer-events-none absolute inset-1">
                      <Stage world={SAMPLE} state={start} max={30} />
                    </div>
                  </SkinProvider>
                  {!unlocked && (
                    <div className="absolute inset-0 grid place-items-center content-center gap-1 bg-[#020a0ecc] text-center text-xs font-bold text-white/85">
                      <span className="text-2xl">🔒</span>
                      Mở khi tới {tierName(k.tier)}
                    </div>
                  )}
                  {sel && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[#4ff0ff] text-sm font-extrabold text-[#022]">✓</span>}
                </div>
                <div className="px-3 pb-3 pt-2">
                  <div className="font-extrabold">{k.name}</div>
                  <div className="text-xs opacity-70">{unlocked ? k.desc : `Trình độ ${tierName(k.tier)}`}</div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
