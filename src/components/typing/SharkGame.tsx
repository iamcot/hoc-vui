"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { TypingSpec } from "@/content/types";
import { keyChunk } from "@/content/subjects/go-phim/lessons";
import { makeRng, randomSeed } from "@/lib/rng";
import { renderTyped, telexKeys } from "@/lib/typing/telex";
import { play } from "@/lib/sound";
import { hasFile, resolveFile } from "@/content/assets";
import { IconClose } from "@/components/Icons";
import { Keyboard } from "./Keyboard";
import { ImeWarning } from "./TypeLine";
import { typingStats, useKeyInput } from "./useKeyInput";
import { Diver, FishSprite, type FishKind } from "./Sprites";

export interface GameResult {
  kills: number;
  total: number;
  escaped: number;
  errors: number;
  correctKeys: number;
  wpm: number;
  acc: number;
  score: number;
  wave: number;
}

interface Fish {
  id: number;
  text: string;
  keys: string;
  /** số phím đã gõ đúng */
  hit: number;
  /** 0..1, 1 = mép phải, 0 = chạm thợ lặn */
  x: number;
  lane: number;
  /** phần quãng đường mỗi giây */
  v: number;
  kind: FishKind;
  dead?: number;
}

const LANES = 5;
const DIVER_X = 0.12;

/**
 * Trò chơi "Thợ lặn và cá mập": cá lao từ phải sang, trên mình có chữ.
 * Gõ đúng chữ cái đầu là khóa mục tiêu con cá đó, gõ hết chữ là bắn hạ.
 * mode "practice": đủ `spec.count` con thì xong. mode "survival": 3 mạng, cá đến mãi, nhanh dần.
 */
export function SharkGame({
  spec,
  mode = "practice",
  onFinish,
  exitHref,
  title,
}: {
  spec: TypingSpec;
  mode?: "practice" | "survival";
  onFinish: (r: GameResult) => void;
  exitHref: string;
  title: string;
}) {
  const [phase, setPhase] = useState<"ready" | "run" | "over">("ready");
  const [, setTick] = useState(0);
  const [showKb, setShowKb] = useState(true);
  const [flash, setFlash] = useState<{ ch: string; ok: boolean } | null>(null);
  const [shots, setShots] = useState<{ id: number; y: number; x: number }[]>([]);
  const [hurt, setHurt] = useState(0);
  const g = useRef({
    fish: [] as Fish[],
    target: -1,
    spawned: 0,
    kills: 0,
    escaped: 0,
    errors: 0,
    correctKeys: 0,
    score: 0,
    combo: 0,
    lives: 3,
    wave: 1,
    nextSpawn: 0,
    last: 0,
    start: 0,
    seq: 0,
    rng: makeRng(randomSeed()),
  });
  const total = mode === "survival" ? Infinity : spec.count ?? 16;
  const raf = useRef(0);

  const makeText = useCallback(() => {
    const s = g.current;
    if (spec.unit === "word" && spec.words?.length) return s.rng.pick(spec.words);
    return keyChunk(s.rng, spec.keys, spec.focus, s.wave > 3 ? 4 : 3);
  }, [spec]);

  const finish = useCallback(() => {
    const s = g.current;
    cancelAnimationFrame(raf.current);
    const ms = Date.now() - s.start;
    const st = typingStats(s.correctKeys, s.errors, ms);
    setPhase("over");
    play(mode === "survival" || s.kills >= (spec.count ?? 16) * 0.7 ? "levelup" : "complete");
    onFinish({ kills: s.kills, total: mode === "survival" ? s.kills + s.escaped : s.spawned, escaped: s.escaped, errors: s.errors, correctKeys: s.correctKeys, score: s.score, wave: s.wave, ...st });
  }, [mode, onFinish, spec.count]);

  const loop = useCallback(
    (now: number) => {
      const s = g.current;
      const dt = Math.min(0.05, (now - (s.last || now)) / 1000);
      s.last = now;
      const speed = (spec.speed ?? 1) * (mode === "survival" ? 1 + (s.wave - 1) * 0.09 : 1);
      // thả cá
      const alive = s.fish.filter((f) => !f.dead);
      const maxAlive = mode === "survival" ? Math.min(2 + Math.floor(s.wave / 2), 6) : spec.unit === "word" ? 3 : 4;
      if (s.spawned < total && now >= s.nextSpawn && alive.length < maxAlive) {
        const text = makeText();
        const keys = telexKeys(text);
        const used = new Set(alive.map((f) => f.lane));
        const free = Array.from({ length: LANES }, (_, i) => i).filter((i) => !used.has(i));
        const lane = free.length ? s.rng.pick(free) : s.rng.int(0, LANES - 1);
        // chữ dài thì cá bơi chậm hơn để kịp gõ
        const secs = (7.5 + keys.length * 0.55) / speed;
        const kind: FishKind = keys.length >= 8 ? "boss" : keys.length >= 4 ? "shark" : s.rng.next() < 0.3 ? "jelly" : "fish";
        s.fish.push({ id: ++s.seq, text, keys, hit: 0, x: 1.05, lane, v: (1.05 - DIVER_X) / secs, kind });
        s.spawned++;
        s.nextSpawn = now + (spec.unit === "word" ? 2300 : 1500) / speed;
      }
      // bơi
      for (const f of s.fish) {
        if (f.dead) continue;
        f.x -= f.v * dt;
        if (f.x <= DIVER_X + 0.02) {
          f.dead = -now; // âm = cá thoát (cắn thợ lặn)
          s.escaped++;
          s.combo = 0;
          if (s.target === f.id) s.target = -1;
          play("gp-bite", 0.5);
          setHurt(now);
          if (mode === "survival") s.lives--;
        }
      }
      s.fish = s.fish.filter((f) => !f.dead || now - Math.abs(f.dead) < 600);
      const left = s.fish.some((f) => !f.dead);
      if ((mode === "survival" && s.lives <= 0) || (s.spawned >= total && !left)) {
        finish();
        setTick((t) => t + 1);
        return;
      }
      setTick((t) => t + 1);
      raf.current = requestAnimationFrame(loop);
    },
    [finish, makeText, mode, spec.speed, spec.unit, total],
  );

  const begin = () => {
    const s = g.current;
    Object.assign(s, { fish: [], target: -1, spawned: 0, kills: 0, escaped: 0, errors: 0, correctKeys: 0, score: 0, combo: 0, lives: 3, wave: 1, nextSpawn: 0, last: 0, start: Date.now(), rng: makeRng(randomSeed()) });
    setPhase("run");
    play("gp-wave", 0.5);
    raf.current = requestAnimationFrame(loop);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const { imeOn } = useKeyInput((ch) => {
    if (phase === "ready") {
      if (ch === " ") begin();
      return;
    }
    if (phase !== "run") return;
    const s = g.current;
    let t = s.fish.find((f) => f.id === s.target);
    if (!t || t.dead) {
      // chọn con gần thợ lặn nhất có phím đầu trùng
      const cands = s.fish.filter((f) => !f.dead && f.keys[0] === ch).sort((a, b) => a.x - b.x);
      if (cands.length) {
        t = cands[0];
        s.target = t.id;
      } else {
        if (ch === " ") return; // phím cách thừa giữa hai con cá: bỏ qua
        miss(ch);
        return;
      }
    }
    if (t.keys[t.hit] === ch) {
      t.hit++;
      s.correctKeys++;
      setFlash({ ch, ok: true });
      play("gp-key", 0.25);
      if (t.hit >= t.keys.length) {
        t.dead = performance.now();
        s.kills++;
        s.combo++;
        s.score += 10 * t.keys.length + Math.min(s.combo, 10) * 5;
        s.target = -1;
        const y = laneY(t.lane);
        setShots((sh) => [...sh.slice(-4), { id: t!.id, y, x: t!.x }]);
        play("gp-hit", 0.5);
        if (mode === "survival" && s.kills % 10 === 0) {
          s.wave++;
          play("gp-wave", 0.5);
        }
      }
    } else miss(ch);
  }, phase !== "over");

  function miss(ch: string) {
    const s = g.current;
    s.errors++;
    s.combo = 0;
    setFlash({ ch, ok: false });
    play("gp-miss", 0.35);
  }

  const s = g.current;
  const target = s.fish.find((f) => f.id === s.target);
  const nextKey = target && !target.dead ? target.keys[target.hit] : nearest(s.fish)?.keys[0];
  const elapsed = phase === "run" ? Date.now() - s.start : 0;
  const live = typingStats(s.correctKeys, s.errors, elapsed);
  const bg = hasFile("/assets/img/bg-gp-deep.webp") ? resolveFile("/assets/img/bg-gp-deep.webp") : undefined;

  return (
    <div className="deep-sea fixed inset-0 overflow-hidden text-white">
      {bg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
      )}
      <div className="light-rays pointer-events-none absolute inset-0" />
      <Bubbles />

      {/* HUD */}
      <header className="relative z-20 flex items-center gap-3 px-4 py-3 sm:px-6">
        <Link href={exitHref} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-cyan-300/40 backdrop-blur hover:bg-white/20" aria-label="Thoát">
          <IconClose className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-extrabold leading-tight text-cyan-100 sm:text-xl">{title}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-300/80">{mode === "survival" ? `Sinh tồn · Đợt ${s.wave}` : `Cá ${Math.min(s.kills + s.escaped, total)}/${total}`}</div>
        </div>
        <div className="ml-auto flex items-center gap-2 font-mono text-sm font-bold sm:gap-3 sm:text-base">
          <Hud label="Điểm" value={s.score} />
          <Hud label="WPM" value={live.wpm} />
          <Hud label="Chính xác" value={`${live.acc}%`} />
          {mode === "survival" ? (
            <span className="hud-chip text-lg tracking-tight">{"♥".repeat(Math.max(0, s.lives))}<span className="text-white/25">{"♥".repeat(3 - Math.max(0, s.lives))}</span></span>
          ) : (
            s.combo >= 3 && <span className="hud-chip text-amber-300">x{s.combo} combo</span>
          )}
        </div>
      </header>

      {/* biển */}
      <div className="absolute inset-x-0 bottom-0 top-16" style={{ bottom: showKb ? "clamp(150px, 26vh, 230px)" : 40 }}>
        <motion.div className="absolute" style={{ left: `${DIVER_X * 100 - 9}%`, top: "50%", width: "min(18vw, 200px)" }} animate={{ y: ["-55%", "-45%", "-55%"], rotate: hurt && performance.now() - hurt < 400 ? [0, -8, 6, 0] : 0 }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <Diver />
        </motion.div>

        {s.fish.map((f) => {
          const isT = target === f;
          const done = renderTyped(f.text, f.hit);
          const killed = f.dead && f.dead > 0;
          const escaped = f.dead && f.dead < 0;
          const viet = f.keys !== f.text;
          return (
            <div
              key={f.id}
              className="absolute -translate-y-1/2 transition-opacity duration-500"
              style={{ left: `${f.x * 100}%`, top: `${laneY(f.lane)}%`, opacity: killed ? 0 : escaped ? 0.2 : 1, width: f.kind === "boss" ? "min(30vw, 300px)" : f.kind === "shark" ? "min(22vw, 220px)" : "min(14vw, 140px)" }}
            >
              <div className={`relative ${killed ? "scale-125 blur-sm" : ""} transition-all`}>
                <FishSprite kind={f.kind} locked={isT} />
                {isT && <span className="reticle" />}
              </div>
              <div className={`absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl px-2.5 py-1 font-mono text-lg font-extrabold sm:text-2xl ${isT ? "bg-[#06102e]/90 ring-2 ring-cyan-300" : "bg-[#06102e]/75 ring-1 ring-white/20"}`}>
                <span className="text-cyan-300 [text-shadow:0_0_8px_#2fd3ff]">{done}</span>
                <span>{f.text.slice(done.length)}</span>
                {viet && <span className="block text-center text-[11px] font-semibold tracking-wider text-cyan-100/55">{f.keys}</span>}
              </div>
            </div>
          );
        })}

        <AnimatePresence>
          {shots.map((sh) => (
            <motion.div
              key={sh.id}
              className="laser pointer-events-none absolute h-1.5 origin-left rounded-full"
              style={{ left: `${DIVER_X * 100 + 4}%`, top: `${sh.y}%`, width: `${Math.max(5, (sh.x - DIVER_X - 0.04) * 100)}%` }}
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onAnimationComplete={() => setShots((x) => x.filter((y) => y.id !== sh.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* bàn phím gợi ý */}
      <footer className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-6">
        {imeOn && <div className="mx-auto mb-2 max-w-3xl"><ImeWarning /></div>}
        <div className="mb-1 flex justify-end">
          <button className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-100 ring-1 ring-cyan-300/30 hover:bg-white/20" onClick={() => setShowKb((v) => !v)}>
            {showKb ? "Ẩn bàn phím" : "Hiện bàn phím"}
          </button>
        </div>
        {showKb && <Keyboard keys={spec.unit === "key" ? spec.keys : ""} focus={spec.focus} next={phase === "run" ? nextKey : undefined} pressed={flash} compact />}
      </footer>

      {/* màn bắt đầu */}
      {phase === "ready" && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-[#030a24]/55 backdrop-blur-[2px]">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="cyber-panel mx-4 max-w-md space-y-4 rounded-[2rem] p-7 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">{mode === "survival" ? "Chế độ sinh tồn" : "Nhiệm vụ lặn"}</div>
            <h2 className="font-display text-3xl font-extrabold">{title}</h2>
            <p className="text-cyan-50/85">
              {mode === "survival" ? "Cá đến mãi và nhanh dần. Để cá chạm vào em 3 lần là hết lượt." : `Bắn hạ ${total} con cá bằng cách gõ đúng chữ trên mình chúng.`} Gõ chữ đầu là khóa mục tiêu.
            </p>
            <p className="font-bold text-white">Đặt tay lên hàng phím nhà rồi bấm <kbd className="rounded-md bg-cyan-400 px-2 py-0.5 font-mono text-[#04102c]">Phím cách</kbd></p>
            <button onClick={begin} className="btn btn-primary w-full">Lặn xuống ▶</button>
          </motion.div>
        </div>
      )}
      {hurt > 0 && performance.now() - hurt < 300 && <div className="pointer-events-none absolute inset-0 z-10 bg-red-500/25" />}
    </div>
  );
}

const laneY = (lane: number) => 14 + lane * (72 / (LANES - 1));
const nearest = (fish: Fish[]) => fish.filter((f) => !f.dead).sort((a, b) => a.x - b.x)[0];

function Hud({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="hud-chip hidden flex-col items-center leading-none sm:flex">
      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300/80">{label}</span>
      <span className="text-lg">{value}</span>
    </span>
  );
}

function Bubbles() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="bubble-up" style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i * 0.9) % 7}s`, animationDuration: `${6 + (i % 5)}s`, width: 6 + (i % 4) * 4, height: 6 + (i % 4) * 4 }} />
      ))}
    </div>
  );
}
