"use client";
import { hasFile, resolveFile } from "@/content/assets";
import { voiceIdFor } from "@/lib/viet";
import { isMuted } from "@/lib/sound";

export { voiceIdFor };

let current: HTMLAudioElement | null = null;
let viVoice: SpeechSynthesisVoice | null | undefined;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === "undefined") return null;
  if (viVoice) return viVoice;
  const vs = speechSynthesis.getVoices();
  viVoice = vs.find((v) => v.lang?.toLowerCase().startsWith("vi")) ?? null;
  return viVoice;
}
if (typeof window !== "undefined" && typeof speechSynthesis !== "undefined") {
  speechSynthesis.onvoiceschanged = () => {
    viVoice = undefined;
    pickVoice();
  };
}

/** Máy có giọng tiếng Việt dựng sẵn không (để báo khi chưa có file giọng mẫu) */
export const hasViVoice = () => !!pickVoice();

export function stopSpeak() {
  current?.pause();
  current = null;
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

/**
 * Đọc mẫu. Ưu tiên file giọng ElevenLabs (tv-*.mp3); chưa có thì dùng giọng tiếng Việt
 * của máy (iPad: giọng Linh). Trả về khi đọc xong.
 */
export function speak(text: string, opts: { rate?: number; id?: string } = {}): Promise<void> {
  stopSpeak();
  if (typeof window === "undefined" || isMuted()) return Promise.resolve();
  const file = `/assets/voice/${opts.id ?? voiceIdFor(text)}.mp3`;
  if (hasFile(file)) {
    return new Promise((res) => {
      const a = new Audio(resolveFile(file));
      current = a;
      a.playbackRate = opts.rate && opts.rate < 1 ? 0.9 : 1;
      a.onended = a.onerror = () => res();
      void a.play().catch(() => res());
    });
  }
  const v = pickVoice();
  if (!v) return Promise.resolve();
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v;
    u.lang = v.lang;
    u.rate = opts.rate ?? 0.8;
    u.onend = u.onerror = () => res();
    speechSynthesis.speak(u);
    // Safari đôi khi không gọi onend
    setTimeout(res, 800 + text.length * 180);
  });
}

/** Đọc lần lượt các mảnh khi đánh vần: "bờ", "an", "ban"... */
export async function speakSeq(parts: string[], onStep?: (i: number) => void) {
  for (let i = 0; i < parts.length; i++) {
    onStep?.(i);
    await speak(parts[i]);
    await new Promise((r) => setTimeout(r, 180));
  }
}
