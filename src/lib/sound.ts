"use client";
import { audioById, hasFile, resolveFile } from "@/content/assets";

const cache = new Map<string, HTMLAudioElement | null>();
let muted = false;

export const isMuted = () => muted;
export function setMuted(m: boolean) {
  muted = m;
}

/** Phát âm thanh theo id trong danh mục. Chưa có file thì im lặng. */
export function play(id: string, volume = 0.6) {
  if (muted || typeof window === "undefined") return;
  const asset = audioById(id);
  if (!asset || !hasFile(asset.file)) return;
  let a = cache.get(id);
  if (a === null) return;
  if (!a) {
    a = new Audio(resolveFile(asset.file));
    a.addEventListener("error", () => cache.set(id, null), { once: true });
    cache.set(id, a);
  }
  try {
    a.volume = volume;
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {
    /* bỏ qua */
  }
}

let voiceEl: HTMLAudioElement | null = null;
export function playVoice(id?: string) {
  stopVoice();
  if (!id || muted || typeof window === "undefined") return;
  const asset = audioById(id);
  if (!asset || !hasFile(asset.file)) return;
  voiceEl = new Audio(resolveFile(asset.file));
  void voiceEl.play().catch(() => {});
}
export function stopVoice() {
  voiceEl?.pause();
  voiceEl = null;
}

/* ---------- nhạc nền ---------- */
const MUSIC_VOL = 0.2;
let musicOn = true;
let wanted: string | undefined;
let ducked = false;
let bgm: HTMLAudioElement | null = null;
let bgmId: string | undefined;

function fade(a: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  const from = a.volume;
  const t0 = performance.now();
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    a.volume = from + (to - from) * k;
    if (k < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}

function applyMusic() {
  if (typeof window === "undefined") return;
  const asset = wanted ? audioById(wanted) : undefined;
  const id = musicOn && !ducked && asset && hasFile(asset.file) ? wanted : undefined;
  if (id === bgmId) {
    if (bgm && id && bgm.paused) void bgm.play().catch(() => {});
    return;
  }
  if (bgm) {
    const old = bgm;
    fade(old, 0, 600, () => old.pause());
  }
  bgm = null;
  bgmId = id;
  if (!id || !asset) return;
  const a = new Audio(resolveFile(asset.file));
  a.loop = true;
  a.volume = 0;
  bgm = a;
  void a.play().then(() => fade(a, MUSIC_VOL, 1200)).catch(() => {});
}

/** bật/tắt nhạc nền (cài đặt của bé) */
export function setMusicOn(on: boolean) {
  musicOn = on;
  applyMusic();
}
/** chọn bản nhạc cho màn hình hiện tại (undefined = im) */
export function setMusic(id?: string) {
  wanted = id;
  applyMusic();
}
/** tạm tắt nhạc khi ghi âm giọng bé */
export function duckMusic(on: boolean) {
  ducked = on;
  applyMusic();
}
if (typeof window !== "undefined") {
  // trình duyệt chặn tự phát nhạc tới khi bé chạm/gõ lần đầu
  const kick = () => {
    if (bgm?.paused) void bgm.play().then(() => bgm && fade(bgm, MUSIC_VOL, 1200)).catch(() => {});
  };
  window.addEventListener("pointerdown", kick);
  window.addEventListener("keydown", kick);
}
