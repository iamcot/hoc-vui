"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Subject } from "@/content/types";
import { useProgress } from "@/lib/store";
import { tierUnlocked } from "@/lib/tiers";
import { LAB_THEMES, THEME_ORDER, loadCalm, loadThemeChoice, pickTheme, saveCalm, saveThemeChoice, themeForTier, type LabThemeId } from "@/lib/chem/themes";
import { IconClose, IconSound } from "@/components/Icons";
import { MusicToggle } from "@/components/Music";
import { LabScene } from "./LabScene";
import "./lab.css";

/** theme phòng lab đang dùng + "giảm hiệu ứng": nhớ trong máy, theme chỉ chọn được khi đã mở trình độ tương ứng */
export function useLabPrefs(subject: Subject, tierId: string) {
  const { lesson, data } = useProgress();
  const open = useCallback(
    (t: string) => {
      const i = subject.tiers.findIndex((x) => x.id === t);
      return i >= 0 && tierUnlocked(subject, i, lesson, data.unlocks);
    },
    [subject, lesson, data.unlocks],
  );
  const [theme, setThemeState] = useState<LabThemeId>(themeForTier(tierId));
  const [calm, setCalmState] = useState(false);
  useEffect(() => {
    setThemeState(pickTheme(loadThemeChoice(), tierId, open));
    setCalmState(loadCalm());
  }, [tierId, open]);
  const setTheme = (id: LabThemeId | null) => {
    saveThemeChoice(id);
    setThemeState(id ?? themeForTier(tierId));
  };
  const setCalm = (on: boolean) => {
    saveCalm(on);
    setCalmState(on);
  };
  return { theme, setTheme, calm, setCalm, open };
}

/** thanh trên cùng: đóng, tiến độ, theme, âm thanh */
export function LabTopBar({ href, title, progress, children, onTheme }: { href: string; title: string; progress?: number; children?: React.ReactNode; onTheme: () => void }) {
  const { data, setSound } = useProgress();
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-2 p-3">
      <Link href={href} className="lab-chip grid h-10 w-10 shrink-0 place-items-center rounded-full" aria-label="Đóng">
        <IconClose className="h-5 w-5" />
      </Link>
      <div className="lab-panel flex min-w-0 flex-1 items-center gap-3 rounded-full px-4 py-1.5">
        <b className="truncate font-display text-sm sm:text-base">{title}</b>
        {progress !== undefined && (
          <div className="hidden h-2 min-w-16 flex-1 overflow-hidden rounded-full sm:block" style={{ background: "var(--lab-line)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(progress * 100)}%`, background: "var(--lab-accent)" }} />
          </div>
        )}
        {children}
      </div>
      <button onClick={onTheme} className="lab-chip flex h-10 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm font-extrabold" aria-label="Đổi phòng lab">
        🎨<span className="hidden whitespace-nowrap sm:inline"> Phòng lab</span>
      </button>
      <button onClick={() => setSound(!data.sound)} className="lab-chip grid h-10 w-10 shrink-0 place-items-center rounded-full" aria-label={data.sound ? "Tắt tiếng" : "Bật tiếng"}>
        <IconSound className="h-5 w-5" off={!data.sound} />
      </button>
      <div className="hidden sm:block">
        <MusicToggle />
      </div>
    </div>
  );
}

/** chọn phòng lab: 4 theme, theme của trình độ chưa mở thì khoá */
export function LabThemePicker({ prefs, onClose }: { prefs: ReturnType<typeof useLabPrefs>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-3 backdrop-blur-[2px]" onClick={onClose}>
      <div className="lab-pop-in max-h-[96dvh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-4 text-ink shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="flex-1 font-display text-2xl font-extrabold">Chọn phòng lab</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-black/5" aria-label="Đóng">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {THEME_ORDER.map((id) => {
            const t = LAB_THEMES[id];
            const ok = prefs.open(t.tier);
            const on = prefs.theme === id;
            return (
              <button
                key={id}
                disabled={!ok}
                onClick={() => {
                  prefs.setTheme(id);
                  onClose();
                }}
                className={`relative overflow-hidden rounded-2xl text-left transition ${on ? "ring-4 ring-lilac" : "ring-1 ring-black/10"} ${ok ? "hover:-translate-y-0.5" : "cursor-not-allowed"}`}
              >
                <div className="pointer-events-none relative aspect-[16/8] overflow-hidden">
                  <LabScene theme={id} />
                </div>
                <div className="p-2.5">
                  <b className="font-display text-base">{t.name}</b>
                  <div className="text-xs text-ink-soft">{t.desc}</div>
                </div>
                {!ok && <div className="absolute inset-0 grid place-items-center bg-white/70 text-center text-sm font-extrabold">🔒 Mở khi tới trình độ {t.tier.toUpperCase()}</div>}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={prefs.calm} onChange={(e) => prefs.setCalm(e.target.checked)} className="h-5 w-5 accent-lilac" />
            Giảm hiệu ứng (không rung, không chớp khi nổ)
          </label>
          <span className="flex-1" />
          <button className="text-sm font-bold text-ink-soft underline" onClick={() => { prefs.setTheme(null); onClose(); }}>
            Tự đổi theo trình độ
          </button>
        </div>
      </div>
    </div>
  );
}
