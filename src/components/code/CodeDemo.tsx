"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseProgram } from "@/lib/code/program";
import { initState, run, type Outcome, type State } from "@/lib/code/run";
import { parseLevel } from "@/lib/code/world";
import { Stage } from "./Stage";

const CHIP = { forward: "bg-sky text-white", left: "bg-lilac text-white", right: "bg-lilac text-white", repeat: "bg-mint text-white" } as const;
const LABEL = { forward: "👣 Đi tới", left: "↺ Rẽ trái", right: "↻ Rẽ phải" } as const;

/** Slide bài học: lưới nhỏ + dãy khối mẫu, bấm "Xem chạy" thì Mochi đi theo, khối đang chạy sáng lên */
export function CodeDemo({ map, dir, program, label }: { map: string[]; dir: 0 | 1 | 2 | 3; program: string; label?: string }) {
  const world = useMemo(() => parseLevel({ id: "demo", map, dir, blocks: [] }), [map, dir]);
  // gắn id theo vị trí để sáng đúng khối (chỉ dùng chương trình phẳng trong slide)
  const prog = useMemo(() => parseProgram(program).map((s, i) => ({ ...s, id: String(i) })), [program]);
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
      setActive(r.value.blockId ?? null);
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
              {s.op === "repeat" ? `🔁 Lặp ${s.n} lần` : LABEL[s.op]}
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
