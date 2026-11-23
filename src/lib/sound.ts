"use client";
import { audioById, hasFile } from "@/content/assets";

const cache = new Map<string, HTMLAudioElement | null>();
let muted = false;

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
    a = new Audio(asset.file);
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
  voiceEl = new Audio(asset.file);
  void voiceEl.play().catch(() => {});
}
export function stopVoice() {
  voiceEl?.pause();
  voiceEl = null;
}
