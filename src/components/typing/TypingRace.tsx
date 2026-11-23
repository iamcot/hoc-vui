"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { getSubject, getTier, tierLessons, allLessons } from "@/content/subjects";
import { lineFor } from "@/content/subjects/go-phim/lessons";
import { makeRng } from "@/lib/rng";
import { getSupabase } from "@/lib/supabase";
import { roomBoard, submitEntry, type Entry, type Room } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { play } from "@/lib/sound";
import { hasFile, resolveFile } from "@/content/assets";
import { Avatar } from "@/components/Avatar";
import { IconClose } from "@/components/Icons";
import { Keyboard } from "./Keyboard";
import { ImeWarning, useTypist, type TypeResult } from "./TypeLine";
import { typingStats } from "./useKeyInput";

const COLORS = ["#2fd3ff", "#ff4fa3", "#3ee08f", "#ffb020", "#7c6bff", "#ff7a3d"];

interface Racer {
  id: string;
  name: string;
  avatar: string;
  /** 0..1 */
  p: number;
  wpm: number;
  done?: boolean;
  bot?: boolean;
}

/** Điểm đua: WPM nhân độ chính xác (gõ ẩu thì xe chậm lại) */
export const raceScore = (wpm: number, acc: number) => Math.round(wpm * (acc / 100) * 10);

/** Đoạn đua lấy theo mã phòng: cả phòng cùng một đoạn. Dùng từ của trình độ đã chọn. */
function raceText(room: Room): string {
  const s = getSubject("go-phim")!;
  const tier = room.tier_id ? getTier(s, room.tier_id) : undefined;
  const lessons = (tier ? tierLessons(tier) : allLessons(s)).filter((l) => l.typing);
  const rng = makeRng(`race:${room.code}`);
  const parts: string[] = [];
  while (parts.join(" ").length < 90) parts.push(lineFor(rng.pick(lessons).typing!, rng));
  return parts.join(" ").slice(0, 120).replace(/\s+\S*$/, "");
}

/**
 * Đua xe gõ phím trong phòng thi đấu: mỗi bạn một chiếc xe, gõ tới đâu xe chạy tới đó.
 * Có Supabase: thấy xe của bạn bè chạy trực tiếp (Realtime broadcast), ai bấm "Xuất phát" thì cả phòng đếm ngược.
 * Không có ai cùng đua: đua với hai xe máy (tốc độ cố định) cho vui.
 */
export function TypingRace({ room }: { room: Room }) {
  const { data, session, addXp } = useProgress();
  const text = useMemo(() => raceText(room), [room]);
  const me = useMemo(() => ({ id: session?.user.id ?? `khach-${Math.random().toString(36).slice(2, 7)}`, name: data.profile.name || "Em", avatar: data.profile.avatar }), [session, data.profile]);
  const [phase, setPhase] = useState<"lobby" | "count" | "run" | "done">("lobby");
  const [count, setCount] = useState(3);
  const [others, setOthers] = useState<Record<string, Racer>>({});
  const [bots, setBots] = useState<Racer[]>([]);
  const [result, setResult] = useState<(TypeResult & { score: number }) | null>(null);
  const [board, setBoard] = useState<Entry[]>([]);
  const [copied, setCopied] = useState(false);
  const chan = useRef<ReturnType<NonNullable<ReturnType<typeof getSupabase>>["channel"]> | null>(null);
  const t0 = useRef(0);

  const refresh = useCallback(() => roomBoard(room.code).then(setBoard), [room.code]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const startCount = useCallback(() => {
    if (phaseRef.current !== "lobby") return;
    setPhase("count");
    setCount(3);
    play("gp-go", 0.5);
  }, []);

  // kênh trực tiếp của phòng
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const c = sb.channel(`race:${room.code}`, { config: { broadcast: { self: false } } });
    c.on("broadcast", { event: "p" }, ({ payload }) => setOthers((o) => ({ ...o, [payload.id]: payload as Racer })))
      .on("broadcast", { event: "go" }, () => startCount())
      .subscribe((st) => {
        if (st === "SUBSCRIBED") void c.send({ type: "broadcast", event: "p", payload: { ...me, p: 0, wpm: 0 } });
      });
    chan.current = c;
    return () => {
      void sb.removeChannel(c);
      chan.current = null;
    };
  }, [room.code, me, startCount]);

  // đếm ngược 3-2-1
  useEffect(() => {
    if (phase !== "count") return;
    if (count <= 0) {
      setPhase("run");
      t0.current = Date.now();
      // không có bạn nào trong phòng thì thêm hai xe máy
      if (Object.keys(others).length === 0)
        setBots([
          { id: "bot-1", name: "Cá mập máy", avatar: "", p: 0, wpm: 14, bot: true },
          { id: "bot-2", name: "Sứa điện", avatar: "", p: 0, wpm: 22, bot: true },
        ]);
      return;
    }
    const i = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(i);
  }, [phase, count, others]);

  // xe máy chạy đều
  useEffect(() => {
    if (phase !== "run" || !bots.length) return;
    const i = setInterval(() => {
      const min = (Date.now() - t0.current) / 60000;
      setBots((bs) => bs.map((b) => ({ ...b, p: Math.min(1, (b.wpm * 5 * min) / text.length) })));
    }, 200);
    return () => clearInterval(i);
  }, [phase, bots.length, text.length]);

  const t = useTypist(
    text,
    async (r) => {
      const score = raceScore(r.wpm, r.acc);
      setResult({ ...r, score });
      setPhase("done");
      play(r.acc >= 90 ? "levelup" : "complete");
      void chan.current?.send({ type: "broadcast", event: "p", payload: { ...me, p: 1, wpm: r.wpm, done: true } });
      addXp("go-phim", Math.min(40, Math.round(r.wpm / 2) + (r.acc >= 90 ? 10 : 0)), `dua:${room.code}`);
      try {
        await submitEntry(room, { score, correct: r.wpm, time_ms: r.ms }, { name: data.profile.name, avatar: data.profile.avatar });
      } finally {
        refresh();
      }
    },
    phase === "run",
    (ok, pos) => {
      if (!ok || pos % 3) return;
      const ms = Date.now() - t0.current;
      void chan.current?.send({ type: "broadcast", event: "p", payload: { ...me, p: pos / t.keys.length, wpm: typingStats(pos, 0, ms).wpm } });
    },
  );

  const myP = t.pos / t.keys.length;
  const live = typingStats(t.pos, t.errors, phase === "run" ? Date.now() - t0.current : 0);
  const racers: Racer[] = [{ ...me, p: phase === "lobby" ? 0 : myP, wpm: result?.wpm ?? live.wpm, done: phase === "done" }, ...Object.values(others), ...bots];

  function go() {
    void chan.current?.send({ type: "broadcast", event: "go", payload: {} });
    startCount();
  }

  async function share() {
    const link = `${location.origin}/thi-dau/${room.code}?mon=go-phim${room.tier_id ? `&cap=${room.tier_id}` : ""}`;
    const msg = `Vào Học Vui đua gõ phím với tớ! Mã phòng: ${room.code}`;
    try {
      if (navigator.share) await navigator.share({ title: "Học Vui", text: msg, url: link });
      else {
        await navigator.clipboard.writeText(`${msg}\n${link}`);
        setCopied(true);
      }
    } catch {
      /* huỷ */
    }
  }

  const bg = hasFile("/assets/img/bg-gp-race.webp") ? resolveFile("/assets/img/bg-gp-race.webp") : undefined;
  return (
    <div className="deep-sea fixed inset-0 flex flex-col overflow-y-auto text-white">
      {bg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
      )}
      <header className="relative z-10 flex items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/thi-dau?mon=go-phim" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-cyan-300/40" aria-label="Thoát">
          <IconClose className="h-5 w-5" />
        </Link>
        <div>
          <div className="font-display text-xl font-extrabold">🏎️ Đua xe gõ phím</div>
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-300/80">Phòng {room.code}</div>
        </div>
        <div className="ml-auto flex gap-2 font-mono font-bold">
          <span className="hud-chip">{result?.wpm ?? live.wpm} WPM</span>
          <span className="hud-chip">{result?.acc ?? live.acc}%</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 space-y-4 px-4 pb-6 sm:px-6">
        {/* đường đua */}
        <div className="cyber-panel space-y-2 rounded-3xl p-3 sm:p-4">
          {racers.map((r, i) => (
            <div key={r.id} className="relative h-14 overflow-hidden rounded-2xl bg-[#060d2e] ring-1 ring-white/5">
              <div className="race-lane absolute inset-0" />
              <div className="absolute inset-y-0 right-3 w-3 bg-[repeating-linear-gradient(0deg,#fff_0_6px,#0b1233_6px_12px)] opacity-70" />
              <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1.5 text-xs font-bold text-white/70">
                {r.bot ? <span className="text-lg">🤖</span> : <Avatar id={r.avatar} size={22} />}
                <span className="hidden max-w-20 truncate sm:inline">{i === 0 ? "Em" : r.name}</span>
              </div>
              <motion.div className="absolute top-1/2 w-24 -translate-y-1/2 sm:w-28" animate={{ left: `calc(${r.p * 100}% * 0.74 + 12%)` }} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
                <Car color={COLORS[i % COLORS.length]} />
              </motion.div>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-white/60">{r.done ? `🏁 ${r.wpm}` : r.wpm ? `${r.wpm} wpm` : ""}</span>
            </div>
          ))}
        </div>

        {phase === "lobby" && (
          <div className="cyber-panel space-y-3 rounded-3xl p-6 text-center">
            <p className="text-cyan-50/90">
              Cả phòng gõ cùng một đoạn. Xe chạy theo số phím em gõ đúng; về đích xếp hạng theo <b>WPM × độ chính xác</b>. Gõ sai phải gõ lại phím đó.
            </p>
            <p className="text-sm text-cyan-100/70">{Object.keys(others).length ? `${Object.keys(others).length} bạn đang trong phòng.` : "Chưa có bạn nào vào phòng: em sẽ đua với hai xe máy."}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn btn-ghost" onClick={share}>
                {copied ? "Đã chép link ✓" : "📨 Mời bạn"}
              </button>
              <button className="btn btn-primary" onClick={go}>
                Xuất phát ▶
              </button>
            </div>
          </div>
        )}
        {phase === "count" && <div className="py-6 text-center font-display text-8xl font-extrabold text-cyan-300 [text-shadow:0_0_30px_#2fd3ff]">{count || "GO!"}</div>}
        {(phase === "run" || phase === "done") && (
          <div className="cyber-panel rounded-3xl p-5 font-mono text-xl font-bold leading-relaxed sm:text-2xl">
            <span className="text-cyan-300 [text-shadow:0_0_10px_rgba(47,211,255,0.7)]">{t.rendered}</span>
            <span className="caret" />
            <span className="text-white/80">{text.slice(t.rendered.length)}</span>
          </div>
        )}
        {t.imeOn && <ImeWarning />}
        {phase === "run" && <Keyboard next={t.next} pressed={t.flash} compact />}

        {phase === "done" && result && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="cyber-panel space-y-2 rounded-3xl p-6 text-center">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Điểm đua</div>
              <div className="font-display text-6xl font-extrabold">{result.score}</div>
              <div className="text-cyan-100/85">
                {result.wpm} WPM · chính xác {result.acc}% · {Math.round(result.ms / 1000)} giây
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button className="btn btn-ghost" onClick={share}>
                  📨 Rủ thêm bạn
                </button>
                <Link href="/thi-dau?mon=go-phim" className="btn btn-primary">
                  Phòng mới
                </Link>
              </div>
            </div>
            <div className="cyber-panel rounded-3xl p-5">
              <h2 className="mb-3 font-display text-xl font-extrabold">🏆 Bảng điểm phòng</h2>
              <ol className="space-y-2">
                {board.map((e, k) => (
                  <li key={e.user_id} className={`flex items-center gap-3 rounded-2xl p-2 ${e.me ? "bg-cyan-400/20" : "bg-white/5"}`}>
                    <span className="w-7 text-center font-bold">{["🥇", "🥈", "🥉"][k] ?? k + 1}</span>
                    <Avatar id={e.avatar} size={30} />
                    <span className="flex-1 truncate font-bold">{e.display_name}</span>
                    <span className="text-sm text-cyan-100/70">{e.correct} WPM</span>
                    <span className="font-display text-lg font-extrabold">{e.score}</span>
                  </li>
                ))}
              </ol>
              {!session && <p className="mt-3 text-xs text-cyan-100/60">Chưa đăng nhập nên bảng chỉ có điểm trên máy này.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/** Xe đua lướt (ảnh gp-car nếu có, đổi màu theo người chơi) */
function Car({ color }: { color: string }) {
  if (hasFile("/assets/img/gp-car.webp"))
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolveFile("/assets/img/gp-car.webp")} alt="" className="h-auto w-full" style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 4px 0 ${color})` }} />
    );
  return (
    <svg viewBox="0 0 120 44" className="h-auto w-full" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      <path d="M4 30 Q 8 18 30 16 L 52 6 Q 70 2 82 12 L 108 18 Q 118 22 116 30 Q 112 36 100 36 L 16 36 Q 4 36 4 30 Z" fill="#e9eef9" stroke={color} strokeWidth="2.5" />
      <path d="M54 10 Q 68 6 78 14 L 56 16 Z" fill={color} opacity="0.8" />
      <path d="M14 26 L 104 26" stroke={color} strokeWidth="3" />
      <ellipse cx="34" cy="38" rx="14" ry="3" fill={color} opacity="0.9" />
      <ellipse cx="90" cy="38" rx="14" ry="3" fill={color} opacity="0.9" />
      <path d="M0 24 L -14 22 M 0 30 L -18 30" stroke={color} strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
