"use client";
import { startRecording, type Recording, type RecorderHandle } from "./recorder";
import { duckMusic } from "@/lib/sound";

/**
 * Nghe bé đọc. Ba cách, tự chọn theo thứ tự:
 * 1. "cloud": máy chủ có khóa dịch vụ nhận dạng (Google Speech-to-Text hoặc OpenAI), xem /api/nghe.
 *    Chạy đều trên mọi máy, kể cả Safari iPad, có gợi ý câu cần đọc nên chấm chuẩn hơn.
 * 2. "browser": Web Speech API của trình duyệt (Chrome, Edge trên laptop). Miễn phí.
 * 3. "self": không nhận dạng được, ghi âm cho bé nghe lại giọng mình cạnh giọng mẫu và tự chấm (hoặc bố mẹ chấm).
 */
export type Engine = "cloud" | "browser" | "self";

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const SRClass = () =>
  typeof window === "undefined"
    ? undefined
    : ((window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition);

const isIOS = () => typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

let engineP: Promise<Engine> | null = null;
let browserBroken = false;

export function detectEngine(): Promise<Engine> {
  if (!engineP)
    engineP = fetch("/api/nghe")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .catch(() => ({ enabled: false }))
      // Safari trên iPad/iPhone gần như không nhận được tiếng Việt (trả rỗng) và không ghi âm song song được,
      // nên ở đó không dùng nhận dạng của trình duyệt: ghi âm để bé nghe lại và tự chấm (hoặc dùng "cloud" nếu máy chủ có khóa)
      .then((j: { enabled?: boolean }) => (j.enabled ? "cloud" : SRClass() && !browserBroken && !isIOS() ? "browser" : "self"));
  return engineP;
}

export const canRecord = () => typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

export interface Heard {
  engine: Engine;
  /** các cách nghe được (tốt nhất trước) */
  alts: string[];
  recording: Recording | null;
}

export interface Session {
  stop(): void;
  result: Promise<Heard>;
}

/** Bắt đầu nghe. `hint` là chữ bé cần đọc (gửi kèm để dịch vụ đoán đúng tiếng hơn). */
export async function listen(hint: string, opts: { onLevel?: (v: number) => void; maxSeconds?: number } = {}): Promise<Session> {
  const engine = await detectEngine();
  const maxSeconds = opts.maxSeconds ?? Math.min(20, 4 + hint.split(/\s+/).length * 0.9);

  if (engine === "browser" && SRClass()) {
    const sr = new (SRClass()!)();
    sr.lang = "vi-VN";
    sr.continuous = false;
    // Safari (iPad) hay chỉ trả kết quả tạm rồi kết thúc, nên nhận cả kết quả tạm và lấy bản mới nhất
    sr.interimResults = true;
    sr.maxAlternatives = 5;
    // trên iPad, ghi âm song song có thể giành micro của nhận dạng nên bỏ qua
    // ghi âm song song để bé nghe lại, và để biết lúc bé ngừng đọc thì dừng nghe luôn
    let rec: RecorderHandle | null = null;
    if (isIOS()) duckMusic(true);
    else rec = await startRecording({ onLevel: opts.onLevel, maxSeconds, autoStop: false, onSilence: () => sr.stop() }).catch(() => null);
    const result = new Promise<Heard>((resolve) => {
      let finals: string[] = [];
      let interim: string[] = [];
      let settled = false;
      const finish = async (eng: Engine) => {
        if (settled) return;
        settled = true;
        rec?.stop();
        if (isIOS()) duckMusic(false);
        const alts = [...new Set([...finals, ...interim].map((t) => t.trim()).filter(Boolean))];
        resolve({ engine: eng, alts, recording: rec ? await rec.done : null });
      };
      sr.onresult = (e) => {
        // ghép các đoạn thành câu (cách tốt nhất), cộng thêm các cách nghe khác của từng đoạn
        const res = Array.from(e.results);
        const joined = res.map((r) => r[0]?.transcript ?? "").join(" ");
        const others = res.flatMap((r) => Array.from(r).slice(1).map((a) => a.transcript));
        if (res.every((r) => r.isFinal)) finals = [joined, ...others];
        else interim = [joined, ...others];
      };
      sr.onerror = (e) => {
        if (["language-not-supported", "service-not-allowed", "not-allowed", "network"].includes(e.error)) {
          browserBroken = true;
          engineP = null;
          void finish("self");
        }
      };
      sr.onend = () => void finish("browser");
      setTimeout(() => sr.stop(), maxSeconds * 1000);
    });
    sr.start();
    return { stop: () => sr.stop(), result };
  }

  const rec = await startRecording({ onLevel: opts.onLevel, maxSeconds, silenceMs: hint.length < 12 ? 800 : 1200 });
  const result = rec.done.then(async (recording): Promise<Heard> => {
    if (!recording) return { engine, alts: [], recording: null };
    if (engine !== "cloud") return { engine, alts: [], recording };
    try {
      const r = await fetch("/api/nghe", { method: "POST", body: recording.wav, headers: { "content-type": "audio/wav", "x-hint": encodeURIComponent(hint) } });
      const j = (await r.json()) as { alts?: string[] };
      return { engine, alts: j.alts ?? [], recording };
    } catch {
      return { engine: "self", alts: [], recording };
    }
  });
  return { stop: rec.stop, result };
}
