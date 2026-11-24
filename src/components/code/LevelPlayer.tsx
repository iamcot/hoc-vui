"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { IconStar } from "@/components/Icons";
import { Ico } from "@/components/Ico";
import { play } from "@/lib/sound";
import { countBlocks, pythonLines, type Stmt } from "@/lib/code/program";
import { initState, run, OUTCOME_TEXT, type Outcome, type State, type Step } from "@/lib/code/run";
import { optimalOf, presetOf, starsFor, worldsOf } from "@/lib/code/grade";
import type { Level } from "@/lib/code/world";
import { Stage } from "./Stage";
import { Workspace, type WorkspaceHandle } from "./Workspace";
import { Hero, useSkin } from "./skin";

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
 * Màn có sân ẩn (bài Nếu, Lặp tới khi): qua sân 1 thì cùng chương trình tự chạy tiếp ở sân 2, 3…
 */
export function LevelPlayer({ level, index, total, onDone }: { level: Level; index: number; total: number; onDone: (r: LevelResult) => void }) {
  const worlds = useMemo(() => worldsOf(level), [level]);
  /** đang chạy ở sân thứ mấy (ref để bước chạy luôn đọc đúng sân, kể cả ngay sau khi đổi) */
  const [wi, setWi] = useState(0);
  const wiRef = useRef(0);
  const world = worlds[wi];
  const cur = () => worlds[wiRef.current];
  const goWorld = (k: number) => {
    wiRef.current = k;
    setWi(k);
  };
  const [autoNext, setAutoNext] = useState(false);
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
  const skin = useSkin();
  /** khối đang chạy (tô sáng dòng code xem trước) */
  const [curId, setCurId] = useState<string | null>(null);
  const blocks = countBlocks(program);
  const stars = starsFor(blocks, optimal);

  function reset(k = 0) {
    gen.current = null;
    goWorld(k);
    setState(initState(worlds[k]));
    setBump(0);
    setMsg(null);
    setStatus("edit");
    setCurId(null);
    wsRef.current?.highlight(null);
    wsRef.current?.setLocked(false);
  }

  function finish(o: Outcome) {
    gen.current = null;
    wsRef.current?.setLocked(false);
    if (o === "win" && wiRef.current + 1 < worlds.length) {
      // qua sân này rồi: thử tiếp sân ẩn với đúng chương trình đó
      play("correct", 0.4);
      const k = wiRef.current + 1;
      goWorld(k);
      setState(initState(worlds[k]));
      setStatus("edit");
      setMsg(`Đúng rồi! Giờ chạy cùng chương trình ở sân ${k + 1}/${worlds.length} xem có đúng không…`);
      setAutoNext(true);
      return;
    }
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
      gen.current = run(cur(), program);
      setState(initState(cur()));
      setBump(0);
      if (wiRef.current === 0) setMsg(null);
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
    setCurId(r.value.blockId ?? null);
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

  // sân kế tiếp: đợi một nhịp cho bé nhìn sân mới rồi tự chạy
  useEffect(() => {
    if (!autoNext) return;
    const t = setTimeout(() => {
      setAutoNext(false);
      if (stepOnce()) setStatus("running");
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoNext]);

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
      <div className="lt-board relative min-h-[260px] flex-[1.15] overflow-hidden rounded-[1.6rem]">
        {/* đổi giao diện thì dựng lại bàn khối, giữ nguyên chương trình bé đang ghép */}
        <Workspace key={`${level.id}-${skin.id}`} ref={wsRef} blocks={level.blocks} preset={program} skin={skin} onChange={(p) => !busy && setProgram(p)} />
        <div className="hud-chip lt-count pointer-events-none absolute right-3 top-3 text-sm font-extrabold">
          Khối: <span className={blocks > optimal ? "lt-over" : "lt-ok"}>{blocks}</span> · tối ưu {optimal}
        </div>
        {skin.id === "holo" && <PyPreview program={program} cur={curId} />}
        {skin.id === "holo" && <Brackets />}
      </div>

      {/* sân chơi */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="lt-hero-chip grid shrink-0 place-items-center">
            <Hero skin={skin} mood={mood} size={skin.id === "neon" ? 52 : 46} />
          </div>
          <motion.div
            key={msg ?? level.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl rounded-tl-sm px-3 py-2 text-[0.95rem] font-bold leading-snug shadow-sm ${status === "fail" ? "bg-peach-soft text-ink" : "bg-white/80 text-ink-soft"}`}
          >
            <span className="lt-level-tag mr-1 text-xs font-extrabold uppercase tracking-wider">
              Màn {index + 1}/{total}
            </span>{" "}
            {msg ?? level.hint ?? "Dẫn Mochi tới lá cờ nhé!"}
          </motion.div>
        </div>
        <div className="lt-stage-box relative min-h-[180px] flex-1">
          {skin.id === "holo" && <Brackets />}
          <button
            className="btn btn-ghost absolute right-1 top-1 z-10 px-3! py-1.5! text-sm!"
            onClick={() => setSpeed((s) => (s === "slow" ? "fast" : "slow"))}
            title="Đổi tốc độ"
            aria-label={speed === "slow" ? "Đang chạy chậm, bấm để chạy nhanh" : "Đang chạy nhanh, bấm để chạy chậm"}
          >
            {speed === "slow" ? "🐢 Chậm" : "🐇 Nhanh"}
          </button>
          {worlds.length > 1 && (
            <div className="absolute left-1 top-1 z-10 flex gap-1">
              {worlds.map((_, k) => (
                <span
                  key={k}
                  className={`rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm ${k < wi || status === "win" ? "bg-mint text-white" : k === wi ? "bg-sky text-white" : "bg-white/80 text-ink-soft"}`}
                >
                  Sân {k + 1}
                </span>
              ))}
            </div>
          )}
          <Stage world={world} state={state} bump={bump > 0 && status === "fail"} key={`${level.id}-${wi}-${bump}`} mood={mood} max={104} speed={speed === "fast" ? 2.2 : 1} />
          {status === "win" && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 grid place-items-center">
              <div className="cyber-panel space-y-3 rounded-[1.6rem] px-6 py-5 text-center">
                <div className="flex justify-center gap-1 text-sun">
                  {[1, 2, 3].map((s) => (
                    <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 * s, type: "spring" }}>
                      <IconStar filled={stars >= s} className={`h-11 w-11 ${stars >= s ? "text-amber-300 drop-shadow-[0_0_10px_rgba(255,200,60,0.8)]" : "text-white/20"}`} />
                    </motion.span>
                  ))}
                </div>
                <div className="font-display text-2xl font-extrabold">Qua màn!</div>
                <p className="max-w-60 text-sm font-bold text-ink-soft">{stars === 3 ? `Dùng ${blocks} khối, gọn nhất rồi!` : `Dùng ${blocks} khối. Thử còn ${optimal} khối để được 3 sao nhé.`}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {stars < 3 && (
                    <button className="btn btn-ghost" onClick={() => reset()}>
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
          <button className="btn btn-ghost px-4! py-2.5!" onClick={() => reset()} disabled={status === "edit"}>
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

/** bảng "PREVIEW.PY": chương trình khối dịch sang Python, dòng đang chạy sáng lên */
function PyPreview({ program, cur }: { program: Stmt[]; cur: string | null }) {
  const lines = pythonLines(program);
  return (
    <div className="lt-py pointer-events-none absolute bottom-3 right-3 max-h-[45%] w-48 overflow-hidden" aria-label="Chương trình viết bằng Python">
      <div className="mb-1 flex justify-between text-[9px] tracking-[0.2em] text-[#4ff0ff99]">
        <span>PREVIEW.PY</span>
        <span>●</span>
      </div>
      {lines.length ? (
        lines.map((l, i) => (
          <div key={i} className={l.id && l.id === cur ? "lt-py-cur" : ""} style={{ paddingLeft: l.indent * 14 }}>
            <PyTok text={l.text} />
          </div>
        ))
      ) : (
        <div className="text-[#4a6a70]"># gắn khối dưới ▶ để viết code</div>
      )}
    </div>
  );
}

function PyTok({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\bfor\b|\bin\b|\bwhile\b|\bnot\b|\bif\b|\bpass\b|\d+)/).map((t, i) =>
        /^(for|in|while|not|if|pass)$/.test(t) ? (
          <span key={i} className="text-[#ff79c6]">
            {t}
          </span>
        ) : /^\d+$/.test(t) ? (
          <span key={i} className="text-[#ffb547]">
            {t}
          </span>
        ) : (
          <span key={i} className="text-[#4ff0ff]">
            {t}
          </span>
        ),
      )}
    </>
  );
}

/** góc khung phát sáng kiểu HUD */
function Brackets() {
  return (
    <>
      <span className="lt-br lt-br-tl" />
      <span className="lt-br lt-br-tr" />
      <span className="lt-br lt-br-bl" />
      <span className="lt-br lt-br-brr" />
    </>
  );
}
