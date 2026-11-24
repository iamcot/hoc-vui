"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mascot } from "@/components/Mascot";
import { IconStar } from "@/components/Icons";
import { Ico } from "@/components/Ico";
import { play } from "@/lib/sound";
import { countBlocks, type Stmt } from "@/lib/code/program";
import { initState, run, OUTCOME_TEXT, type Outcome, type State, type Step } from "@/lib/code/run";
import { optimalOf, presetOf } from "@/lib/code/grade";
import { parseLevel, type Level } from "@/lib/code/world";
import { Stage } from "./Stage";
import { Workspace, type WorkspaceHandle } from "./Workspace";

type Status = "edit" | "running" | "paused" | "win" | "fail";

export interface LevelResult {
  stars: number;
  blocks: number;
  optimal: number;
  /** bỏ qua màn (sau nhiều lần chưa được) */
  skipped?: boolean;
}

const SPEED = { slow: 650, fast: 260 };

/**
 * Một màn chơi: bàn ghép khối bên trái, sân của Mochi bên phải.
 * Chạy = tự chạy hết; Từng bước = mỗi lần bấm một lệnh; Làm lại = Mochi về chỗ cũ (giữ nguyên khối).
 */
export function LevelPlayer({ level, index, total, onDone }: { level: Level; index: number; total: number; onDone: (r: LevelResult) => void }) {
  const world = useMemo(() => parseLevel(level), [level]);
  const optimal = useMemo(() => optimalOf(level), [level]);
  const preset = useMemo(() => presetOf(level), [level]);
  const [program, setProgram] = useState<Stmt[]>(preset);
  const [state, setState] = useState<State>(() => initState(world));
  const [status, setStatus] = useState<Status>("edit");
  const [bump, setBump] = useState(0);
  /** tăng mỗi lệnh, để nhịp tự chạy chạy tiếp cả khi trạng thái không đổi (đụng tường) */
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [fails, setFails] = useState(0);
  const [speed, setSpeed] = useState<keyof typeof SPEED>("slow");
  const gen = useRef<Generator<Step, Outcome> | null>(null);
  const wsRef = useRef<WorkspaceHandle>(null);
  const blocks = countBlocks(program);
  const stars = blocks <= optimal ? 3 : blocks <= optimal + 2 ? 2 : 1;

  function reset() {
    gen.current = null;
    setState(initState(world));
    setBump(0);
    setMsg(null);
    setStatus("edit");
    wsRef.current?.highlight(null);
    wsRef.current?.setLocked(false);
  }

  function finish(o: Outcome) {
    gen.current = null;
    wsRef.current?.setLocked(false);
    if (o === "win") {
      setStatus("win");
      wsRef.current?.highlight(null);
      play("levelup");
    } else {
      setStatus("fail");
      setFails((f) => f + 1);
      setMsg(OUTCOME_TEXT[o]);
      play("wrong", 0.4);
    }
  }

  /** chạy một lệnh; trả về false nếu đã hết */
  function stepOnce(): boolean {
    if (!gen.current) {
      if (!program.length) {
        setMsg("Chưa có khối nào gắn dưới ▶ Khi bấm Chạy. Kéo khối từ cột bên trái vào nhé!");
        setStatus("fail");
        return false;
      }
      gen.current = run(world, program);
      setState(initState(world));
      setBump(0);
      setMsg(null);
      wsRef.current?.setLocked(true);
    }
    const r = gen.current.next();
    if (r.done) {
      finish(r.value);
      return false;
    }
    setState(r.value.state);
    setTick((t) => t + 1);
    wsRef.current?.highlight(r.value.blockId ?? null);
    if (r.value.kind === "bump") setBump((b) => b + 1);
    if (r.value.kind === "star") play("correct", 0.35);
    else play("tap", 0.25);
    return true;
  }

  // tự chạy: mỗi nhịp một lệnh
  useEffect(() => {
    if (status !== "running") return;
    const t = setTimeout(stepOnce, SPEED[speed]);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tick, speed]);

  const runAllClick = () => {
    if (status === "running") return setStatus("paused");
    if (status === "paused") return setStatus("running");
    reset();
    if (stepOnce()) setStatus("running");
  };
  const stepClick = () => {
    if (status === "running") return setStatus("paused");
    if (status === "paused") return void stepOnce();
    reset();
    if (stepOnce()) setStatus("paused");
  };

  const mood = status === "win" ? "cheer" : status === "fail" ? "oops" : status === "running" ? "think" : "happy";
  const busy = status === "running" || status === "paused";

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row">
      {/* bàn ghép khối */}
      <div className="relative min-h-[260px] flex-[1.15] overflow-hidden rounded-[1.6rem] bg-white shadow-[0_8px_24px_-14px_rgba(37,40,69,0.5)] ring-1 ring-line">
        <Workspace key={level.id} ref={wsRef} blocks={level.blocks} preset={preset} onChange={(p) => !busy && setProgram(p)} />
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-ink-soft shadow-sm ring-1 ring-line">
          Khối: <span className={blocks > optimal ? "text-peach" : "text-mint"}>{blocks}</span> · tối ưu {optimal}
        </div>
      </div>

      {/* sân chơi */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-start gap-2">
          <Mascot mood={mood} size={52} className="shrink-0" />
          <motion.div key={msg ?? level.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl rounded-tl-sm px-3 py-2 text-[0.95rem] font-bold leading-snug shadow-sm ${status === "fail" ? "bg-peach-soft text-ink" : "bg-white/85 text-ink-soft"}`}>
            <span className="mr-1 text-xs font-extrabold uppercase tracking-wider text-sky">
              Màn {index + 1}/{total}
            </span>{" "}
            {msg ?? level.hint ?? "Dẫn Mochi tới lá cờ nhé!"}
          </motion.div>
        </div>
        <div className="relative min-h-[180px] flex-1">
          <button className="btn btn-ghost absolute right-1 top-1 z-10 px-3! py-1.5! text-sm!" onClick={() => setSpeed((s) => (s === "slow" ? "fast" : "slow"))} title="Đổi tốc độ" aria-label={speed === "slow" ? "Đang chạy chậm, bấm để chạy nhanh" : "Đang chạy nhanh, bấm để chạy chậm"}>
            {speed === "slow" ? "🐢 Chậm" : "🐇 Nhanh"}
          </button>
          <Stage world={world} state={state} bump={bump > 0 && status === "fail"} key={`${level.id}-${bump}`} mood={mood} max={104} speed={speed === "fast" ? 2.2 : 1} />
          {status === "win" && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 grid place-items-center">
              <div className="space-y-3 rounded-[1.6rem] bg-white/92 px-6 py-5 text-center shadow-xl ring-1 ring-line backdrop-blur">
                <div className="flex justify-center gap-1 text-sun">
                  {[1, 2, 3].map((s) => (
                    <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 * s, type: "spring" }}>
                      <IconStar filled={stars >= s} className={`h-11 w-11 ${stars >= s ? "" : "text-line"}`} />
                    </motion.span>
                  ))}
                </div>
                <div className="font-display text-2xl font-extrabold">Qua màn!</div>
                <p className="max-w-60 text-sm font-bold text-ink-soft">
                  {stars === 3 ? `Dùng ${blocks} khối, gọn nhất rồi!` : `Dùng ${blocks} khối. Thử còn ${optimal} khối để được 3 sao nhé.`}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {stars < 3 && (
                    <button className="btn btn-ghost" onClick={reset}>
                      <Ico n="retry" /> Thử gọn hơn
                    </button>
                  )}
                  <button className="btn btn-mint" onClick={() => onDone({ stars, blocks, optimal })}>
                    {index + 1 < total ? "Màn tiếp ▶" : "Xong ▶"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button className="btn btn-primary min-w-28 px-5! py-2.5!" onClick={runAllClick}>
            {status === "running" ? "⏸ Dừng" : status === "paused" ? "▶ Chạy tiếp" : "▶ Chạy"}
          </button>
          <button className="btn btn-ghost px-4! py-2.5!" onClick={stepClick}>
            👣 Từng bước
          </button>
          <button className="btn btn-ghost px-4! py-2.5!" onClick={reset} disabled={status === "edit"}>
            <Ico n="retry" /> Làm lại
          </button>
          {fails >= 3 && status !== "win" && (
            <button className="btn btn-ghost px-4! py-2.5! text-ink-soft" onClick={() => onDone({ stars: 0, blocks, optimal, skipped: true })}>
              Bỏ qua màn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
