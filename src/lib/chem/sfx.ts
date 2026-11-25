"use client";
import { audioById, hasFile } from "@/content/assets";
import { isMuted, play } from "@/lib/sound";

/**
 * Âm thanh phòng thí nghiệm. Có file mp3 (`public/assets/sfx/hh-*.mp3`) thì phát file,
 * chưa có thì tự tạo tiếng bằng Web Audio (sủi bọt, nhỏ giọt, nổ…) để bé vẫn nghe được.
 */

export type LabSfx = "drop" | "pour" | "fizz" | "sizzle" | "pop" | "foam" | "warn" | "boom" | "glass" | "flame" | "chime" | "stir" | "solid" | "plop";

let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const A = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!A) return null;
    ctx = new A();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(c: AudioContext, dur: number) {
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = b;
  return s;
}

function env(c: AudioContext, peak: number, a: number, d: number, t0 = c.currentTime) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  g.connect(c.destination);
  return g;
}

function tone(c: AudioContext, f0: number, f1: number, dur: number, peak = 0.25, type: OscillatorType = "sine", t0 = c.currentTime) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  o.connect(env(c, peak, 0.005, dur, t0));
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function hiss(c: AudioContext, dur: number, freq: number, q: number, peak: number, kind: BiquadFilterType = "bandpass", t0 = c.currentTime) {
  const n = noise(c, dur + 0.1);
  const f = c.createBiquadFilter();
  f.type = kind;
  f.frequency.value = freq;
  f.Q.value = q;
  n.connect(f);
  f.connect(env(c, peak, 0.02, dur, t0));
  n.start(t0);
}

const SYNTH: Record<LabSfx, (c: AudioContext) => void> = {
  drop: (c) => tone(c, 1400, 500, 0.12, 0.25),
  plop: (c) => tone(c, 500, 160, 0.18, 0.3),
  solid: (c) => {
    for (let i = 0; i < 6; i++) tone(c, 2500 + Math.random() * 2000, 1800, 0.03, 0.06, "triangle", c.currentTime + i * 0.035);
  },
  pour: (c) => hiss(c, 0.7, 900, 0.8, 0.12),
  stir: (c) => {
    for (let i = 0; i < 4; i++) tone(c, 2600, 2400, 0.05, 0.05, "triangle", c.currentTime + i * 0.25);
  },
  fizz: (c) => {
    hiss(c, 1.6, 5200, 0.6, 0.12, "highpass");
    for (let i = 0; i < 14; i++) tone(c, 900 + Math.random() * 1400, 500, 0.05, 0.05, "sine", c.currentTime + Math.random() * 1.4);
  },
  sizzle: (c) => hiss(c, 1.8, 6000, 0.4, 0.16, "highpass"),
  foam: (c) => {
    for (let i = 0; i < 10; i++) tone(c, 300 + Math.random() * 300, 120, 0.12, 0.12, "sine", c.currentTime + i * 0.09);
  },
  pop: (c) => {
    tone(c, 300, 80, 0.15, 0.4);
    hiss(c, 0.12, 2000, 0.6, 0.2);
  },
  warn: (c) => {
    for (let i = 0; i < 3; i++) tone(c, 880, 880, 0.12, 0.12, "square", c.currentTime + i * 0.22);
  },
  boom: (c) => {
    tone(c, 120, 30, 1.2, 0.8);
    hiss(c, 1.4, 600, 0.4, 0.6, "lowpass");
    hiss(c, 0.5, 3000, 0.3, 0.25, "highpass", c.currentTime + 0.05);
  },
  glass: (c) => {
    for (let i = 0; i < 9; i++) tone(c, 3000 + Math.random() * 3000, 2000, 0.08, 0.07, "triangle", c.currentTime + 0.25 + Math.random() * 0.3);
  },
  flame: (c) => hiss(c, 0.6, 400, 0.5, 0.25, "lowpass"),
  chime: (c) => {
    [784, 988, 1319].forEach((f, i) => tone(c, f, f, 0.35, 0.15, "sine", c.currentTime + i * 0.09));
  },
};

export function sfx(id: LabSfx) {
  if (isMuted()) return;
  const a = audioById(`hh-${id}`);
  if (a && hasFile(a.file)) return play(`hh-${id}`);
  const c = ac();
  if (!c) return;
  try {
    SYNTH[id](c);
  } catch {
    /* trình duyệt chặn âm thanh */
  }
}
