"use client";

/**
 * Ghi âm giọng bé bằng Web Audio (chạy được trên Safari iPad, Chrome, Edge),
 * tự dừng khi bé ngừng nói, xuất WAV 16 kHz mono để gửi đi nhận dạng và để nghe lại.
 */
export interface Recording {
  wav: Blob;
  url: string;
  seconds: number;
}

export interface RecorderHandle {
  stop(): void;
  done: Promise<Recording | null>;
}

const RATE = 16000;

export async function startRecording(opts: { maxSeconds?: number; onLevel?: (v: number) => void; autoStop?: boolean } = {}): Promise<RecorderHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let spoke = false;
  let silentSince = 0;
  const started = performance.now();
  const max = (opts.maxSeconds ?? 8) * 1000;
  let resolve!: (r: Recording | null) => void;
  const done = new Promise<Recording | null>((r) => (resolve = r));
  let stopped = false;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    proc.disconnect();
    src.disconnect();
    stream.getTracks().forEach((t) => t.stop());
    const rate = ctx.sampleRate;
    void ctx.close();
    const pcm = merge(chunks);
    if (!spoke || pcm.length < rate * 0.25) return resolve(null);
    const down = downsample(pcm, rate, RATE);
    const wav = encodeWav(down, RATE);
    resolve({ wav, url: URL.createObjectURL(wav), seconds: down.length / RATE });
  };

  proc.onaudioprocess = (e) => {
    const data = e.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(data));
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    const rms = Math.sqrt(sum / data.length);
    opts.onLevel?.(Math.min(1, rms * 8));
    const now = performance.now();
    if (rms > 0.02) {
      spoke = true;
      silentSince = 0;
    } else if (spoke && !silentSince) silentSince = now;
    if ((opts.autoStop ?? true) && spoke && silentSince && now - silentSince > 1300) stop();
    if (now - started > max) stop();
  };
  src.connect(proc);
  proc.connect(ctx.destination);
  return { stop, done };
}

function merge(chunks: Float32Array[]) {
  const n = chunks.reduce((a, c) => a + c.length, 0);
  const out = new Float32Array(n);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

function downsample(buf: Float32Array, from: number, to: number) {
  if (from === to) return buf;
  const ratio = from / to;
  const len = Math.floor(buf.length / ratio);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const s = Math.floor(i * ratio);
    const e = Math.min(buf.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = s; j < e; j++) sum += buf[j];
    out[i] = sum / Math.max(1, e - s);
  }
  return out;
}

function encodeWav(samples: Float32Array, rate: number) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  v.setUint32(4, 36 + samples.length * 2, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  w(36, "data");
  v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const x = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, x < 0 ? x * 0x8000 : x * 0x7fff, true);
  }
  return new Blob([buf], { type: "audio/wav" });
}
