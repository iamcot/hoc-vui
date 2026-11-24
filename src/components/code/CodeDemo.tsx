"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseProgram, sayProgram, type Stmt } from "@/lib/code/program";
import { initState, run, type Outcome, type State } from "@/lib/code/run";
import { parseLevel } from "@/lib/code/world";
import { traceTrail } from "@/lib/code/grade";
import { Stage } from "./Stage";

const CHIP = { forward: "bg-sky text-white", left: "bg-lilac text-white", right: "bg-lilac text-white", repeat: "bg-mint text-white", until: "bg-mint text-white", if: "bg-peach text-white" } as const;
const LABEL = { forward: "👣 Đi tới", left: "↺ Rẽ trái", right: "↻ Rẽ phải" } as const;

/** gắn id theo vị trí ("2", "2.0"…) để sáng đúng khối ngoài cùng đang chạy */
const withIds = (p: Stmt[], pre = ""): Stmt[] => p.map((s, i) => ({ ...s, id: pre + i, ...("body" in s ? { body: withIds(s.body, `${pre}${i}.`) } : {}) }) as Stmt);
const chipText = (s: Stmt) => (s.op === "forward" || s.op === "left" || s.op === "right" ? LABEL[s.op] : `${s.op === "if" ? "❓" : "🔁"} ${sayProgram([s])}`);

/** Slide bài học: lưới nhỏ + dãy khối mẫu, bấm "Xem chạy" thì Mochi đi theo, khối đang chạy sáng lên */
export function CodeDemo({ map, dir, program, label, draw }: { map: string[]; dir: 0 | 1 | 2 | 3; program: string; label?: string; draw?: boolean }) {
  const world = useMemo(() => {
    const w = parseLevel({ id: "demo", map, dir, blocks: [], draw: draw ? program : undefined });
    if (draw) w.target = traceTrail(w, parseProgram(program));
    return w;
  }, [map, dir, draw, program]);
  const prog = useMemo(() => withIds(parseProgram(program)), [program]);
  const [state, setState] = useState<State>(() => initState(world));
  const [active, setActive] = useState<string | null>(null);
  const [end, setEnd] = useState<Outcome | null>(null);
  const [bump, setBump] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const start = () => {
    if (timer.current) clearTimeout(timer.current);
    const g = run(world, prog);
    setState(initState(world));
    setEnd(null);
    setBump(false);
    const tick = () => {
      const r = g.next();
      if (r.done) {
        setEnd(r.value);
        setActive(null);
        return;
      }
      setState(r.value.state);
      setActive(r.value.blockId?.split(".")[0] ?? null);
      if (r.value.kind === "bump") setBump(true);
      timer.current = setTimeout(tick, 600);
    };
    timer.current = setTimeout(tick, 350);
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/60 p-2 sm:flex-row sm:gap-5 sm:px-4">
      <div className="h-[min(170px,27dvh)] w-[min(240px,100%)] shrink-0">
        <Stage world={world} state={state} bump={bump} max={60} mood={end === "win" ? "cheer" : end ? "oops" : "happy"} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-xl bg-sun px-2.5 py-1 text-sm font-extrabold text-ink">▶ Khi bấm Chạy</span>
          {prog.map((s) => (
            <span
              key={s.id}
              className={`rounded-xl px-2.5 py-1 text-sm font-extrabold transition ${CHIP[s.op]} ${active === s.id ? "scale-110 ring-4 ring-sun" : ""}`}
            >
              {chipText(s)}
            </span>
          ))}
        </div>
        {label && <p className="text-base font-bold text-ink-soft">{label}</p>}
        <button className="btn btn-primary px-5! py-2!" onClick={start}>
          ▶ Xem chạy
        </button>
      </div>
    </div>
  );
}
