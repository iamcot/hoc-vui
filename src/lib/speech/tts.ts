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
export function speak(text: string, opts: { rate?: number; id?: string; fileOnly?: boolean } = {}): Promise<void> {
  stopSpeak();
  if (typeof window === "undefined" || isMuted()) return Promise.resolve();
  const file = `/assets/voice/${opts.id ?? voiceIdFor(text)}.mp3`;
  // file có trong danh sách lúc build, hoặc chưa biết (vd. vừa tạo khi đang chạy npm run dev): thử phát file trước
  if (hasFile(file) || !missing.has(file)) {
    const src = resolveFile(file) ?? file;
    return new Promise((res) => {
      const a = new Audio(src);
      current = a;
      a.playbackRate = opts.rate && opts.rate < 0.9 ? 0.9 : 1;
      a.onended = () => res();
      a.onerror = () => {
        missing.add(file);
        if (current === a && !opts.fileOnly) void tts(text, opts.rate).then(res);
        else res();
      };
      void a.play().catch((e: Error) => {
        // trình duyệt chặn tự phát: không đọc gì; còn lỗi tải file thì onerror lo
        if (e?.name === "NotAllowedError") res();
      });
    });
  }
  // fileOnly: chưa có file giọng thì im lặng, không dùng giọng máy
  return opts.fileOnly ? Promise.resolve() : tts(text, opts.rate);
}

const missing = new Set<string>();

function tts(text: string, rate?: number): Promise<void> {
  const v = pickVoice();
  if (!v) return Promise.resolve();
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v;
    u.lang = v.lang;
    u.rate = rate ?? 0.8;
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
