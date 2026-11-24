"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { TypingSpec } from "@/content/types";
import { keyChunk } from "@/content/subjects/go-phim/lessons";
import { makeRng, randomSeed } from "@/lib/rng";
import { renderTyped, telexKeys } from "@/lib/typing/telex";
import { play } from "@/lib/sound";
import { hasFile, resolveFile } from "@/content/assets";
import { IconClose } from "@/components/Icons";
import { Keyboard } from "./Keyboard";
import { ImeWarning } from "./TypeLine";
import { typingStats, useHotkeys, useKeyInput } from "./useKeyInput";
import { Kbd } from "./Kbd";
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
  /** 0..1 theo chiều ngang vùng biển (1 = mép phải) */
  x: number;
  /** 0..1 theo chiều dọc vùng biển */
  y: number;
  lane: number;
  /** cá: phần quãng đường ngang mỗi giây (bơi sang trái); sứa: tốc độ trồi lên */
  v: number;
  kind: FishKind;
  /** sứa thưởng: chỉ có ở lượt bonus, trồi từ dưới lên, hụt không mất mạng */
  bonus?: boolean;
  dead?: number;
}

const LANES = 5;
const DIVER_X = 0.12;
/** lượt bonus: sau mỗi chừng này cá bị hạ (luyện tập) hoặc mỗi đợt mới (sinh tồn) */
const BONUS_EVERY = 6;
const BONUS_JELLIES = 4;

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
  const [phase, setPhase] = useState<"ready" | "run" | "pause" | "over">("ready");
  const router = useRouter();
  const sea = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1000, h: 500 });
  const [, setTick] = useState(0);
  const [showKb, setShowKb] = useState(true);
  const [flash, setFlash] = useState<{ ch: string; ok: boolean } | null>(null);
  const [shots, setShots] = useState<{ id: number; y: number; x: number; bonus?: boolean }[]>([]);
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
    bonus: 0,
    bonusUntil: 0,
    bonusLeft: 0,
    /** chờ cá trên màn hình hết rồi mới thả sứa */
    bonusPending: false,
    nextBonusAt: BONUS_EVERY,
    pausedAt: 0,
    rng: makeRng(randomSeed()),
  });
  const total = mode === "survival" ? Infinity : spec.count ?? 16;
  const raf = useRef(0);

  const makeText = useCallback(() => {
    const s = g.current;
    if (spec.unit === "word" && spec.words?.length) return s.rng.pick(spec.words);
    return keyChunk(s.rng, spec.keys, spec.focus, s.wave > 3 ? 4 : 3);
  }, [spec]);

  /** chữ ngắn cho sứa thưởng: 1-2 phím dễ */
  const bonusText = useCallback(() => {
    const s = g.current;
    const pool = spec.keys.replace(/[^a-z;,.]/g, "") || [...new Set((spec.words ?? []).join("").toLowerCase().replace(/[^a-z]/g, ""))].join("") || "fj";
    return keyChunk(s.rng, pool, "", 1); // sứa thưởng: chỉ 1 chữ
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
      // lượt bonus: đợi hết cá trên màn hình, rồi chỉ có sứa trồi từ dưới lên
      if (s.bonusPending && !s.fish.some((f) => !f.dead)) {
        s.bonusPending = false;
        s.bonusLeft = BONUS_JELLIES;
        s.nextSpawn = now + 300;
        play("gp-wave", 0.5);
      }
      if (s.bonusLeft > 0 && now >= s.nextSpawn) {
        const text = bonusText();
        s.fish.push({ id: ++s.seq, text, keys: telexKeys(text), hit: 0, x: 0.3 + s.rng.next() * 0.55, y: 1.12, lane: -1, v: 0.32 + s.rng.next() * 0.08, kind: "jelly", bonus: true });
        s.bonusLeft--;
        s.nextSpawn = now + 650;
      }
      const inBonus = s.bonusPending || s.bonusLeft > 0 || s.fish.some((f) => f.bonus && !f.dead);
      // thả cá
      const alive = s.fish.filter((f) => !f.dead);
      const maxAlive = mode === "survival" ? Math.min(2 + Math.floor(s.wave / 2), 6) : spec.unit === "word" ? 3 : 4;
      if (!inBonus && s.spawned < total && now >= s.nextSpawn && alive.length < maxAlive) {
        const text = makeText();
        const keys = telexKeys(text);
        const used = new Set(alive.map((f) => f.lane));
        const free = Array.from({ length: LANES }, (_, i) => i).filter((i) => !used.has(i));
        const lane = free.length ? s.rng.pick(free) : s.rng.int(0, LANES - 1);
        // chữ dài thì cá bơi chậm hơn để kịp gõ
        const secs = (7.5 + keys.length * 0.55) / speed;
        const kind: FishKind = keys.length >= 8 ? "boss" : keys.length >= 4 ? "shark" : "fish";
        s.fish.push({ id: ++s.seq, text, keys, hit: 0, x: 1.05, y: laneY(lane) / 100, lane, v: (1.05 - DIVER_X) / secs, kind });
        s.spawned++;
        s.nextSpawn = now + (spec.unit === "word" ? 2300 : 1500) / speed;
      }
      // bơi
      for (const f of s.fish) {
        if (f.dead) continue;
        if (f.bonus) {
          f.y -= f.v * dt;
          if (f.y < -0.15) f.dead = -now; // sứa trôi mất: không sao cả
          continue;
        }
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
      if ((mode === "survival" && s.lives <= 0) || (s.spawned >= total && !left && s.bonusLeft === 0)) {
        finish();
        setTick((t) => t + 1);
        return;
      }
      setTick((t) => t + 1);
      raf.current = requestAnimationFrame(loop);
    },
    [finish, makeText, bonusText, mode, spec.speed, spec.unit, total],
  );

  const begin = () => {
    const s = g.current;
    Object.assign(s, { fish: [], target: -1, spawned: 0, kills: 0, escaped: 0, errors: 0, correctKeys: 0, score: 0, combo: 0, lives: 3, wave: 1, nextSpawn: 0, last: 0, start: Date.now(), bonus: 0, bonusUntil: 0, bonusLeft: 0, bonusPending: false, nextBonusAt: BONUS_EVERY, rng: makeRng(randomSeed()) });
    setPhase("run");
    play("gp-wave", 0.5);
    raf.current = requestAnimationFrame(loop);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const pause = () => {
    cancelAnimationFrame(raf.current);
    g.current.pausedAt = Date.now();
    setPhase("pause");
  };
  const resume = () => {
    const s = g.current;
    s.start += Date.now() - s.pausedAt; // không tính giờ tạm dừng vào WPM
    s.last = 0;
    setPhase("run");
    raf.current = requestAnimationFrame(loop);
  };
  const startBonus = () => {
    const s = g.current;
    s.bonusPending = true; // không thả thêm cá; hết cá thì sứa lên
  };

  // phím tắt: Space bắt đầu/tiếp tục, Esc tạm dừng/thoát
  useHotkeys(
    phase === "ready"
      ? { Escape: () => router.push(exitHref) }
      : phase === "run"
        ? { Escape: pause }
        : phase === "pause"
          ? { " ": resume, Enter: resume, Escape: () => router.push(exitHref) }
          : {},
    phase !== "over",
  );

  // đo vùng biển để tia laser bắn đúng góc
  useEffect(() => {
    const el = sea.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      // sứa thưởng ưu tiên (sắp trôi mất), rồi tới cá gần thợ lặn nhất
      const cands = s.fish.filter((f) => !f.dead && f.keys[0] === ch).sort((a, b) => Number(!!b.bonus) - Number(!!a.bonus) || a.x - b.x);
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
        s.target = -1;
        setShots((sh) => [...sh.slice(-4), { id: t!.id, y: t!.y, x: t!.x, bonus: t!.bonus }]);
        play("gp-hit", 0.5);
        if (t.bonus) {
          s.bonus++;
          s.score += 50;
          return;
        }
        s.kills++;
        s.combo++;
        s.score += 10 * t.keys.length + Math.min(s.combo, 10) * 5;
        if (mode === "survival" && s.kills % 10 === 0) {
          s.wave++;
          startBonus();
        } else if (mode === "practice" && s.kills >= s.nextBonusAt) {
          s.nextBonusAt += BONUS_EVERY;
          startBonus();
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
  const inBonus = phase === "run" && (s.bonusLeft > 0 || s.fish.some((f) => f.bonus && !f.dead));
  // nòng súng của thợ lặn (tính theo % vùng biển) và góc ngắm tới mục tiêu
  const dw = Math.min((typeof window !== "undefined" ? window.innerWidth : box.w) * 0.18, 200); // = min(18vw, 200px)
  const gunX = ((DIVER_X - 0.09) * box.w + dw * 0.9) / box.w;
  // ảnh gp-bit-diver: nòng súng hơi cao hơn giữa hình; hình vẽ tạm: thấp hơn giữa
  const gunY = 0.5 + (dw * (hasFile("/assets/img/gp-bit-diver.webp") ? -0.11 : 0.145)) / box.h;
  // ngắm theo con đang khóa, vừa bắn xong thì giữ hướng con vừa hạ
  const lastShot = shots[shots.length - 1];
  const aimAt = target && !target.dead ? target : lastShot ? { x: lastShot.x, y: lastShot.y } : undefined;
  const aim = aimAt ? Math.max(-28, Math.min(28, (Math.atan2((aimAt.y - gunY) * box.h, (aimAt.x + 0.04 - gunX) * box.w) * 180) / Math.PI)) : 0;
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
        <button
          onClick={() => (phase === "run" ? pause() : router.push(exitHref))}
          className="flex h-11 items-center gap-1 rounded-full bg-white/10 px-3 ring-1 ring-cyan-300/40 backdrop-blur hover:bg-white/20"
          aria-label={phase === "run" ? "Tạm dừng" : "Thoát"}
        >
          <IconClose className="h-5 w-5" />
          <Kbd k="Escape" className="hidden sm:inline-flex" />
        </button>
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
      <div ref={sea} className="absolute inset-x-0 bottom-0 top-16" style={{ bottom: showKb ? "clamp(150px, 26vh, 230px)" : 40 }}>
        {inBonus && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full bg-[#ff4fa3]/90 px-5 py-1.5 font-display text-xl font-extrabold tracking-wide shadow-[0_0_30px_#ff4fa3]">
            ⚡ BONUS · gõ nhanh hạ sứa +50
          </motion.div>
        )}
        <div className="absolute" style={{ left: `${DIVER_X * 100 - 9}%`, top: "50%", width: "min(18vw, 200px)", transform: `translateY(-50%) rotate(${aim}deg)`, transformOrigin: "40% 55%", transition: "transform 0.15s ease-out" }}>
          <motion.div animate={{ y: ["-5%", "5%", "-5%"], rotate: hurt && performance.now() - hurt < 400 ? [0, -8, 6, 0] : 0 }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <Diver />
          </motion.div>
        </div>

        {s.fish.map((f) => {
          const isT = target === f;
          const done = renderTyped(f.text, f.hit);
          const killed = f.dead && f.dead > 0;
          const escaped = f.dead && f.dead < 0;
          const viet = f.keys !== f.text;
          return (
            <div
              key={f.id}
              className={`absolute -translate-y-1/2 transition-opacity duration-500 ${f.bonus ? "-translate-x-1/2" : ""}`}
              style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%`, opacity: killed ? 0 : escaped ? 0.2 : 1, width: f.bonus ? "min(8vw, 84px)" : f.kind === "boss" ? "min(30vw, 300px)" : f.kind === "shark" ? "min(22vw, 220px)" : "min(14vw, 140px)" }}
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

        {/* đạn laser: một đoạn ngắn bay từ nòng súng tới con cá, chạm thì lóe sáng */}
        {shots.map((sh) => {
          const gx = gunX * box.w;
          const gy = gunY * box.h;
          const tx = (sh.bonus ? sh.x : sh.x + 0.05) * box.w;
          const ty = sh.y * box.h;
          const ang = (Math.atan2(ty - gy, tx - gx) * 180) / Math.PI;
          const dur = Math.max(0.12, Math.hypot(tx - gx, ty - gy) / 2200);
          const color = sh.bonus ? "#ff4fa3" : "#2fd3ff";
          return (
            <div key={sh.id} className="pointer-events-none absolute left-0 top-0">
              <motion.div
                className="absolute h-1.5 w-12 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${color} 40%, #fff)`, boxShadow: `0 0 12px 3px ${color}`, rotate: ang, originX: 1, originY: 0.5 }}
                initial={{ x: gx - 48, y: gy - 3 }}
                animate={{ x: tx - 48, y: ty - 3 }}
                transition={{ duration: dur, ease: "linear" }}
              />
              <motion.div
                className="absolute h-14 w-14 rounded-full"
                style={{ left: tx - 28, top: ty - 28, background: `radial-gradient(circle, #fff 0%, ${color} 35%, transparent 70%)` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1.8], opacity: [0, 1, 0] }}
                transition={{ delay: dur, duration: 0.35 }}
                onAnimationComplete={() => setShots((x) => x.filter((y) => y.id !== sh.id))}
              />
            </div>
          );
        })}
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
            <button onClick={begin} className="btn btn-primary w-full">
              Lặn xuống ▶ <Kbd k=" " />
            </button>
            <Link href={exitHref} className="btn btn-ghost w-full">
              Quay lại <Kbd k="Escape" />
            </Link>
          </motion.div>
        </div>
      )}
      {phase === "pause" && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-[#030a24]/65 backdrop-blur-sm">
          <div className="cyber-panel mx-4 w-full max-w-sm space-y-3 rounded-[2rem] p-7 text-center">
            <h2 className="font-display text-3xl font-extrabold">Tạm dừng</h2>
            <button onClick={resume} className="btn btn-primary w-full">
              Lặn tiếp ▶ <Kbd k=" " />
            </button>
            <Link href={exitHref} className="btn btn-ghost w-full">
              Thoát ra bản đồ <Kbd k="Escape" />
            </Link>
          </div>
        </div>
      )}
      {hurt > 0 && performance.now() - hurt < 300 && <div className="pointer-events-none absolute inset-0 z-10 bg-red-500/25" />}
    </div>
  );
}

const laneY = (lane: number) => 14 + lane * (72 / (LANES - 1));
const nearest = (fish: Fish[]) => fish.filter((f) => !f.dead).sort((a, b) => Number(!!b.bonus) - Number(!!a.bonus) || a.x - b.x)[0];

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
