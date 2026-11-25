"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { IconStar } from "@/components/Icons";
import { Ico } from "@/components/Ico";
import { play } from "@/lib/sound";
import { audioById, hasFile } from "@/content/assets";
import { allStmts, countBlocks, KEY_LABEL, LIST_CONDS, parseProgram, pythonLines, type Cond, type Key, type Stmt } from "@/lib/code/program";
import { initState, run, OUTCOME_TEXT, type Outcome, type State, type Step } from "@/lib/code/run";
import { BUMP_LIST, GOAL_TEXT, initList, LIST_FAIL, runList, type ListState } from "@/lib/code/list";
import { handlersOf, isList, optimalOf, presetOf, starsFor, worldsOf, type AnyWorld } from "@/lib/code/grade";
import type { Level } from "@/lib/code/world";
import { Stage } from "./Stage";
import { ListStage } from "./ListStage";
import { Workspace, type WorkspaceHandle } from "./Workspace";
import { Hero, useGuide, useSkin } from "./skin";

/** edit: đang ghép · running/paused: đang chạy · play: màn phím, đang chờ bé bấm phím · win/fail: xong */
type Status = "edit" | "running" | "paused" | "play" | "win" | "fail";

export interface LevelResult {
  stars: number;
  blocks: number;
  optimal: number;
  /** bỏ qua màn (sau nhiều lần chưa được) */
  skipped?: boolean;
}

const SPEED = { slow: 650, fast: 260 };

type AnyState = State | ListState;
const startOf = (w: AnyWorld): AnyState => (isList(w) ? initList(w) : initState(w));

/** phát âm thanh riêng của môn nếu đã có file, chưa có thì dùng âm chung */
const sfx = (id: string, fallback: string | null) => {
  const a = audioById(id);
  if (a && hasFile(a.file)) play(id);
  else if (fallback) play(fallback);
};

const KEY_OF: Record<string, Key> = { ArrowUp: "u", ArrowLeft: "l", ArrowRight: "r", " ": "s" };

/**
 * Một màn chơi: bàn ghép khối bên trái, sân bên phải.
 * Chạy = tự chạy hết; Từng bước = mỗi lần bấm một lệnh; Làm lại = về chỗ cũ (giữ nguyên khối).
 * Màn có sân ẩn (bài Nếu, Lặp tới khi, kho hàng): qua sân 1 thì cùng chương trình tự chạy tiếp ở sân 2, 3…
 * Màn phím (mini game): bấm Chơi rồi bé tự bấm phím, mỗi phím chạy khối Khi bấm phím đó.
 */
export function LevelPlayer({ level, index, total, onDone }: { level: Level; index: number; total: number; onDone: (r: LevelResult) => void }) {
  const worlds = useMemo(() => {
    const all = worldsOf(level);
    if (!level.pick || level.pick >= all.length) return all;
    // sân ngẫu nhiên: mỗi lần vào màn bốc vài sân khác nhau
    const bag = [...all];
    for (let k = bag.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [bag[k], bag[j]] = [bag[j], bag[k]];
    }
    return bag.slice(0, level.pick);
  }, [level]);
  /** đang chạy ở sân thứ mấy (ref để bước chạy luôn đọc đúng sân, kể cả ngay sau khi đổi) */
  const [wi, setWi] = useState(0);
  const wiRef = useRef(0);
  const world = worlds[wi];
  const cur = () => worlds[wiRef.current];
  const goWorld = (k: number) => {
    wiRef.current = k;
    setWi(k);
  };
  const keyMode = !!level.keys;
  const [autoNext, setAutoNext] = useState(false);
  const optimal = useMemo(() => optimalOf(level), [level]);
  const preset = useMemo(() => presetOf(level), [level]);
  /** điều kiện cho khối Nếu/Lặp tới khi của kho hàng: chỉ hiện những điều kiện màn này cần */
  const conds = useMemo<Cond[] | undefined>(() => {
    if (!level.list || !level.solution) return undefined;
    const used = allStmts(parseProgram(level.solution)).flatMap((s) => ("cond" in s ? [s.cond] : []));
    return LIST_CONDS.filter((c) => used.includes(c) || (c === "E" && used.length > 0));
  }, [level]);
  const [program, setProgram] = useState<Stmt[]>(preset);
  const [state, setStateRaw] = useState<AnyState>(() => startOf(world));
  const stRef = useRef<AnyState>(state);
  const setState = (s: AnyState) => {
    stRef.current = s;
    setStateRaw(s);
  };
  const [n, setN] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("edit");
  const [bump, setBump] = useState(0);
  /** tăng mỗi lệnh, để nhịp tự chạy chạy tiếp cả khi trạng thái không đổi (đụng tường) */
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [fails, setFails] = useState(0);
  const [speed, setSpeed] = useState<keyof typeof SPEED>(keyMode ? "fast" : "slow");
  /** màn phím: số lần đã bấm */
  const [presses, setPresses] = useState(0);
  const gen = useRef<Generator<Step<AnyState>, Outcome> | null>(null);
  const wsRef = useRef<WorkspaceHandle>(null);
  const skin = useSkin();
  const guide = useGuide();
  /** khối đang chạy (tô sáng dòng code xem trước) */
  const [curId, setCurId] = useState<string | null>(null);
  const blocks = countBlocks(program);
  const stars = starsFor(blocks, optimal);
  const usesN = level.blocks.includes("set") || level.blocks.includes("calln");
  /** lời nhắc viết sẵn gọi tên Mochi: trình độ có Bit dẫn thì đổi tên */
  const say = (t: string) => (guide === "bit" ? t.replace(/Mochi/g, "Bit") : t);

  function reset(k = 0) {
    gen.current = null;
    goWorld(k);
    setState(startOf(worlds[k]));
    setBump(0);
    setMsg(null);
    setN(null);
    setPresses(0);
    setStatus("edit");
    setCurId(null);
    wsRef.current?.highlight(null);
    wsRef.current?.setLocked(false);
  }

  function failText(o: Exclude<Outcome, "win">) {
    if (level.list && o === "wrong") return LIST_FAIL[level.list.goal];
    if (level.list && o === "bump") return BUMP_LIST;
    return OUTCOME_TEXT[o];
  }

  function finish(o: Outcome) {
    gen.current = null;
    if (keyMode && (o === "short" || o === "stars")) {
      // màn phím: chạy xong một phím mà chưa thắng thì chờ phím tiếp
      if (presses >= level.keys!.presses) {
        setStatus("fail");
        setFails((f) => f + 1);
        setMsg("Hết pin rồi! Thử cho mỗi phím làm được nhiều việc hơn để bấm ít lần hơn nhé.");
        play("wrong");
        wsRef.current?.setLocked(false);
      } else setStatus("play");
      wsRef.current?.highlight(null);
      return;
    }
    wsRef.current?.setLocked(false);
    if (o === "win" && wiRef.current + 1 < worlds.length) {
      // qua sân này rồi: thử tiếp sân ẩn với đúng chương trình đó
      play("correct");
      const k = wiRef.current + 1;
      goWorld(k);
      setState(startOf(worlds[k]));
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
      setMsg(failText(o));
      play("wrong");
    }
  }

  const makeGen = (w: AnyWorld, entry?: Stmt[]): Generator<Step<AnyState>, Outcome> =>
    isList(w) ? runList(w, program) : (run(w, program, { from: entry ? (stRef.current as State) : undefined, entry }) as Generator<Step<AnyState>, Outcome>);

  /** chạy một lệnh; trả về false nếu đã hết */
  function stepOnce(): boolean {
    if (!gen.current) {
      const hs = handlersOf(program);
      if (keyMode ? !hs.size : !program.some((s) => s.op !== "def")) {
        setMsg(keyMode ? "Chưa có khối ⌨️ Khi bấm phím nào. Kéo khối đó ra rồi gắn lệnh vào trong nhé!" : "Chưa có khối nào gắn dưới ▶ Khi bấm Chạy. Kéo khối từ cột bên trái vào nhé!");
        setStatus("fail");
        return false;
      }
      gen.current = makeGen(cur());
      setState(startOf(cur()));
      setBump(0);
      if (wiRef.current === 0) setMsg(keyMode ? "Bấm phím để chơi!" : null);
      wsRef.current?.setLocked(true);
      sfx("lt-run", null);
    }
    const r = gen.current.next();
    if (r.done) {
      finish(r.value);
      return false;
    }
    applyStep(r.value);
    return true;
  }

  function applyStep(st: Step<AnyState>) {
    setState(st.state);
    setTick((t) => t + 1);
    setN(st.n);
    wsRef.current?.highlight(st.blockId ?? null);
    setCurId(st.blockId ?? null);
    if (st.kind === "bump") {
      setBump((b) => b + 1);
      sfx("lt-bump", null);
    } else if (st.kind === "star") play("correct");
    else if (st.kind === "swap") sfx("lt-swap", "tap");
    else if (st.kind === "turn") sfx("lt-turn", "tap");
    else if (st.kind === "move") sfx("lt-step", "tap");
    else play("tap");
  }

  /** màn phím: bấm một phím thì chạy khối của phím đó tiếp từ chỗ đang đứng */
  function press(k: Key) {
    if (status !== "play") return;
    const body = handlersOf(program).get(k);
    sfx("lt-key", "tap");
    if (!body) {
      setMsg(`Phím ${KEY_LABEL[k]} chưa có lệnh nào. Thêm khối ⌨️ Khi bấm phím ${KEY_LABEL[k]} nhé.`);
      return;
    }
    setPresses((p) => p + 1);
    setMsg(null);
    gen.current = makeGen(world, body);
    setStatus("running");
  }

  // tự chạy: mỗi nhịp một lệnh
  useEffect(() => {
    if (status !== "running") return;
    const t = setTimeout(stepOnce, keyMode ? 140 : SPEED[speed]);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tick, speed]);

  // bàn phím thật cho màn phím
  useEffect(() => {
    if (!keyMode || status !== "play") return;
    const on = (e: KeyboardEvent) => {
      const k = KEY_OF[e.key];
      if (!k || !level.keys!.pad.includes(k)) return;
      e.preventDefault();
      press(k);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyMode, status, program, presses]);

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
    if (keyMode) {
      if (status === "play" || status === "running") return reset();
      reset();
      if (stepOnce()) setStatus("running");
      return;
    }
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
  const busy = status === "running" || status === "paused" || status === "play";
  const runLabel = keyMode ? (status === "play" || status === "running" ? "⏹ Dừng" : "🎮 Chơi") : status === "running" ? "⏸ Dừng" : status === "paused" ? "▶ Chạy tiếp" : "▶ Chạy";

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row">
      {/* bàn ghép khối */}
      <div className="lt-board relative min-h-[260px] flex-[1.15] overflow-hidden rounded-[1.6rem]">
        {/* đổi giao diện thì dựng lại bàn khối, giữ nguyên chương trình bé đang ghép */}
        <Workspace key={`${level.id}-${skin.id}`} ref={wsRef} blocks={level.blocks} preset={program} skin={skin} conds={conds} onChange={(p) => !busy && setProgram(p)} />
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
            <Hero skin={skin} guide={guide} mood={mood} size={skin.id === "neon" ? 52 : 46} />
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
            {say(msg ?? level.hint ?? (level.list ? GOAL_TEXT[level.list.goal] : "Dẫn Mochi tới lá cờ nhé!"))}
          </motion.div>
        </div>
        <div className="lt-stage-box relative min-h-[180px] flex-1">
          {skin.id === "holo" && <Brackets />}
          <button
            className={`btn btn-ghost absolute right-1 top-1 z-10 px-3! py-1.5! text-sm! ${keyMode ? "hidden!" : ""}`}
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
          {isList(world) ? (
            <ListStage world={world} state={state as ListState} bump={bump > 0 && status === "fail"} key={`${level.id}-${wi}`} mood={mood} speed={speed === "fast" ? 2.2 : 1} />
          ) : (
            <Stage world={world} state={state as State} bump={bump > 0 && status === "fail"} key={`${level.id}-${wi}-${bump}`} mood={mood} max={104} speed={keyMode ? 3 : speed === "fast" ? 2.2 : 1} />
          )}
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
          {(usesN || keyMode) && (
            <div className="flex gap-1">
              {usesN && <span className="lt-var rounded-full px-2.5 py-1.5 text-sm font-extrabold shadow-sm">📦 n = {n ?? "?"}</span>}
              {keyMode && (
                <span className={`lt-var rounded-full px-2.5 py-1.5 text-sm font-extrabold shadow-sm ${presses >= level.keys!.presses ? "lt-over" : ""}`}>
                  🔋 {level.keys!.presses - presses}/{level.keys!.presses}
                </span>
              )}
            </div>
          )}
          <button className="btn btn-primary min-w-28 px-5! py-2.5!" onClick={runAllClick}>
            {runLabel}
          </button>
          {keyMode && (status === "play" || status === "running") ? (
            <div className="flex gap-1.5" aria-label="Bàn phím điều khiển">
              {level.keys!.pad.map((k) => (
                <button key={k} className={`lt-pad btn btn-ghost py-2.5! ${k === "s" ? "px-5!" : "px-3.5!"}`} onClick={() => press(k)} disabled={status !== "play"} aria-label={`Phím ${KEY_LABEL[k]}`}>
                  {k === "s" ? "␣" : KEY_LABEL[k]}
                </button>
              ))}
            </div>
          ) : (
            !keyMode && (
              <button className="btn btn-ghost px-4! py-2.5!" onClick={stepClick}>
                👣 Từng bước
              </button>
            )
          )}
          <button className={`btn btn-ghost px-4! py-2.5! ${keyMode && busy ? "hidden!" : ""}`} onClick={() => reset()} disabled={status === "edit"}>
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
      {text.split(/(\bfor\b|\bin\b|\bwhile\b|\bnot\b|\bif\b|\belse\b|\bdef\b|\bpass\b|\d+)/).map((t, i) =>
        /^(for|in|while|not|if|else|def|pass)$/.test(t) ? (
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
