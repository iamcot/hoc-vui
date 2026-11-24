"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setMusic } from "@/lib/sound";
import { useProgress } from "@/lib/store";

/** bản nhạc nền theo màn hình */
export function trackFor(path: string): string {
  if (/^\/go-phim\/sinh-ton/.test(path) || /^\/hoc\/go-phim\/[^/]+\/luyen-tap/.test(path)) return "bgm-gp-game";
  if (/^\/hoc\/go-phim/.test(path) || /^\/go-phim\//.test(path)) return "bgm-gp";
  if (/^\/thi-dau\/[^/]+/.test(path)) return "bgm-arena";
  if (/^\/hoc\/[^/]+\/.+/.test(path)) return "bgm-learn";
  return "bgm-home";
}

/** chọn nhạc theo trang đang mở */
export function MusicDirector() {
  const path = usePathname();
  useEffect(() => setMusic(trackFor(path)), [path]);
  return null;
}

/** nút bật/tắt nhạc nền */
export function MusicToggle({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { data, setMusicPref } = useProgress();
  const on = data.music;
  return (
    <button
      onClick={() => setMusicPref(!on)}
      aria-pressed={on}
      aria-label={on ? "Tắt nhạc nền" : "Bật nhạc nền"}
      title={on ? "Tắt nhạc nền" : "Bật nhạc nền"}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:scale-110 ${dark ? "bg-[#081034]/80 text-cyan-200 ring-1 ring-cyan-300/40 backdrop-blur" : "bg-white text-sky shadow-sm"} ${on ? "" : "opacity-60"} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18V6l10-2v12" />
        <circle cx="6.5" cy="18" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="16" r="2.5" fill="currentColor" stroke="none" />
        {!on && <path d="M3 3l18 18" strokeWidth="2.4" />}
      </svg>
    </button>
  );
}
