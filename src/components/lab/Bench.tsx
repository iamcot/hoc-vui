"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { chem } from "@/lib/chem/chemicals";
import { addChem, colorName, floats, level, liquidColor, ph, splint, stir, stopDanger, tick, toggleHeat, vesselTags, volume, type LabEvent, type LabState, type Vessel } from "@/lib/chem/lab";
import type { Tool } from "@/lib/chem/types";
import { LAB_THEMES, type LabThemeId } from "@/lib/chem/themes";
import { sfx } from "@/lib/chem/sfx";
import { Glass, shapeAspect } from "./Glass";
import { LabScene } from "./LabScene";

const SIZE: Record<Vessel["shape"], number> = { beaker: 36, erlen: 36, flask: 34, jar: 32, tube: 34, cyl: 34 };

/** ống nhỏ giọt / lọ trên kệ */
function Bottle({ color, kind }: { color: string; kind: string }) {
  if (kind === "solid")
    return (
      <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0">
        <path d="M6 18 Q6 34 20 34 Q34 34 34 18 Z" fill="#ffffff55" stroke="#cfd6ff" strokeWidth="1.5" />
        <ellipse cx="20" cy="18" rx="14" ry="4" fill="#ffffff66" stroke="#cfd6ff" strokeWidth="1.5" />
        <path d="M11 22 Q20 14 29 22 Q28 30 20 31 Q12 30 11 22Z" fill={color} stroke="#0002" />
      </svg>
    );
  return (
    <svg viewBox="0 0 40 60" className="h-8 w-6 shrink-0">
      <rect x="13" y="2" width="14" height="10" rx="2" fill="#5d6283" />
      <path d="M10 14 H30 L34 22 V54 Q34 58 30 58 H10 Q6 58 6 54 V22 Z" fill="#ffffff33" stroke="#cfd6ff" strokeWidth="1.5" />
      <path d="M7 30 H33 V54 Q33 57 30 57 H10 Q7 57 7 54Z" fill={color} opacity=".92" />
      <rect x="9" y="22" width="3.5" height="30" rx="1.5" fill="#fff" opacity=".55" />
    </svg>
  );
}

function Burner({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 60 64" className="mx-auto block w-[42%] max-w-24 overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="lab-fl" cx=".5" cy=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lab-br" x1="0" x2="1">
          <stop offset="0" stopColor="#6b4a1a" />
          <stop offset=".35" stopColor="#f0cf7a" />
          <stop offset=".6" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#5a3c12" />
        </linearGradient>
      </defs>
      {on && (
        <g className="lab-spark" style={{ animationDuration: "0.9s" }}>
          <ellipse cx="30" cy="-2" rx="15" ry="22" fill="url(#lab-fl)" opacity=".95" />
          <path d="M30 -18 Q37 -2 30 12 Q23 -2 30 -18Z" fill="#fff4c2" />
          <path d="M30 -8 Q33 2 30 10 Q27 2 30 -8Z" fill="#7ab8ff" />
        </g>
      )}
      <rect x="26" y="12" width="8" height="10" fill="#555" />
      <path d="M8 26 Q30 18 52 26 V54 Q52 62 30 62 Q8 62 8 54Z" fill="url(#lab-br)" stroke="#5a3c12" />
      <rect x="13" y="30" width="5" height="24" rx="2" fill="#fff" opacity=".55" />
    </svg>
  );
}

/** que đóm: đưa vào miệng ống rồi tắt / bùng cháy / nổ lách tách */
function Splint({ result }: { result: "splint-out" | "splint-relight" | "splint-pop" | "splint-none" }) {
  const lit = result === "splint-relight" || result === "splint-none";
  return (
    <div className="lab-pop-in pointer-events-none absolute -top-[18%] left-1/2 z-10 w-[40%] -translate-x-1/2" aria-hidden>
      <svg viewBox="0 0 60 80" className="w-full overflow-visible" style={{ transform: "rotate(28deg)" }}>
        <rect x="27" y="10" width="6" height="70" rx="2" fill="#c98a4b" stroke="#8a5a2b" />
        <rect x="27" y="6" width="6" height="8" rx="2" fill={result === "splint-out" ? "#333" : "#ff6a2e"} />
        {lit && <path d="M30 -16 Q40 0 30 10 Q20 0 30 -16Z" fill={result === "splint-relight" ? "#fff2b0" : "#ffb347"} style={{ filter: "drop-shadow(0 0 8px #ffb347)" }} transform={result === "splint-relight" ? "scale(1.5) translate(-10 -4)" : ""} />}
        {result === "splint-out" && <path d="M30 4 q-8 -10 0 -18 q8 -8 0 -18" stroke="#9aa0ad" strokeWidth="3" fill="none" className="lab-steam" />}
        {result === "splint-pop" && <circle cx="30" cy="4" r="14" fill="#fff6b0" opacity=".9" className="lab-flash" />}
      </svg>
    </div>
  );
}

export interface BenchProps {
  state: LabState;
  setState: React.Dispatch<React.SetStateAction<LabState>>;
  shelf: string[];
  tools?: Tool[];
  theme: LabThemeId;
  /** hiện công thức hoá học trên nhãn (từ Hoá THCS) */
  formulas?: boolean;
  /** chừa chỗ bên phải cho khung chữ (css, vd. "24rem") */
  rightPad?: string;
  onEvent?: (e: LabEvent, s: LabState) => void;
  /** khoá thao tác (đang xem kết quả) */
  locked?: boolean;
  onReset?: () => void;
}

export function Bench({ state, setState, shelf, tools = [], theme, formulas, rightPad = "0px", onEvent, locked, onReset }: BenchProps) {
  const t = LAB_THEMES[theme];
  const [pick, setPick] = useState<string | null>(null);
  const [sel, setSel] = useState<string>(state.vessels[0]?.id ?? "");
  const [drops, setDrops] = useState<{ k: number; vessel: string; icon: string }[]>([]);
  const [splints, setSplints] = useState<Record<string, { k: number; type: "splint-out" | "splint-relight" | "splint-pop" | "splint-none" }>>({});
  const [phShow, setPhShow] = useState(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; moved: boolean } | null>(null);
  const kRef = useRef(0);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  // thời gian chạy: đun, nguội, bọt xẹp
  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      setState((s) => tick(s, dt));
    }, 100);
    return () => window.clearInterval(id);
  }, [setState]);

  // âm thanh + hiệu ứng theo sự kiện
  useEffect(() => {
    for (const e of state.events) {
      const map: Partial<Record<LabEvent["type"], Parameters<typeof sfx>[0]>> = {
        drop: "drop",
        pour: "pour",
        solid: "solid",
        object: "plop",
        fizz: "fizz",
        sizzle: "sizzle",
        stir: "stir",
        overflow: "foam",
        danger: "warn",
        boom: "boom",
        "splint-pop": "pop",
        "splint-relight": "flame",
        heat: "flame",
      };
      const id = map[e.type];
      if (id) sfx(id);
      if (e.type === "boom") window.setTimeout(() => sfx("glass"), 120);
      if (e.type.startsWith("splint") && e.vessel) {
        const k = ++kRef.current;
        setSplints((m) => ({ ...m, [e.vessel!]: { k, type: e.type as "splint-out" } }));
        window.setTimeout(() => setSplints((m) => (m[e.vessel!]?.k === k ? Object.fromEntries(Object.entries(m).filter(([v]) => v !== e.vessel)) : m)), 2200);
      }
      onEventRef.current?.(e, state);
    }
  }, [state]);

  const add = useCallback(
    (vesselId: string, chemId: string) => {
      if (locked) return;
      const c = chem(chemId);
      const k = ++kRef.current;
      setDrops((d) => [...d, { k, vessel: vesselId, icon: c?.emoji ?? (c?.kind === "solid" ? "🥄" : "💧") }]);
      window.setTimeout(() => setDrops((d) => d.filter((x) => x.k !== k)), 600);
      window.setTimeout(() => setState((s) => addChem(s, vesselId, chemId)), 300);
      setSel(vesselId);
    },
    [locked, setState],
  );

  const tool = (x: Tool) => {
    if (locked) return;
    const v = sel || state.vessels[0]?.id;
    if (!v) return;
    if (x === "stir") setState((s) => stir(s, v));
    if (x === "heat") setState((s) => toggleHeat(s, v));
    if (x === "splint") setState((s) => splint(s, v));
    if (x === "ph") setPhShow((p) => !p);
  };

  // kéo thả từ kệ vào dụng cụ
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY, moved: d.moved || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 } : d));
    const up = (e: PointerEvent) => {
      const d = drag;
      setDrag(null);
      if (!d) return;
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-vessel]") as HTMLElement | null;
      if (el && d.moved) add(el.dataset.vessel!, d.id);
      else if (!d.moved) setPick((p) => (p === d.id ? null : d.id));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, add]);

  // phím tắt: số 1-9 chọn chất trên kệ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= shelf.length) setPick((p) => (p === shelf[n - 1] ? null : shelf[n - 1]));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shelf]);

  const n = state.vessels.length;
  const showTemp = tools.includes("thermo") || tools.includes("heat");
  const danger = state.danger;
  const left = danger ? Math.max(0, danger.at - state.t) : 0;

  return (
    <div className="lab-bench absolute inset-0 overflow-hidden select-none">
      <LabScene theme={theme} />
      {danger && <div className="lab-pulse-red pointer-events-none absolute inset-0 z-30" />}
      {/* kệ chất */}
      <div className="absolute left-3 top-[4.6rem] z-10 flex flex-wrap gap-2 sm:left-5" style={{ right: `calc(${rightPad} + 1rem)` }}>
        {shelf.map((id, i) => {
          const c = chem(id);
          if (!c) return null;
          return (
            <button
              key={id}
              onPointerDown={(e) => {
                if (locked) return;
                e.preventDefault();
                setDrag({ id, x: e.clientX, y: e.clientY, moved: false });
              }}
              className={`lab-chip lab-pick flex touch-none items-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-left text-sm font-bold ${pick === id ? "on" : ""}`}
              aria-pressed={pick === id}
              disabled={locked}
            >
              {c.kind === "object" ? <span className="text-2xl leading-none">{c.emoji}</span> : <Bottle color={c.color} kind={c.kind} />}
              <span className="leading-tight">
                {c.name}
                {formulas && c.formula && <span className="lab-mono block text-[0.7rem] opacity-75">{c.formula}</span>}
              </span>
              <span className="hidden text-[0.65rem] opacity-50 md:inline">{i + 1}</span>
            </button>
          );
        })}
        {pick && <span className="lab-accent self-center rounded-full px-3 py-1 text-xs font-extrabold">Chạm vào dụng cụ để thả {chem(pick)?.name.toLowerCase()}</span>}
      </div>

      {/* dụng cụ trên bàn */}
      <div className="absolute bottom-[21%] left-0 z-[5] flex items-end justify-center gap-[3cqw] px-4" style={{ right: rightPad }}>
        {state.vessels.map((v) => {
          const asp = shapeAspect(v.shape);
          const w = `min(${SIZE[v.shape] / asp / (n > 3 ? 1.25 : 1)}cqh, calc((100cqw - ${rightPad}) * ${n > 2 ? 0.8 : 0.6} / ${n}))`;
          const lq = liquidColor(v);
          const tags = vesselTags(v);
          const sp = splints[v.id];
          const grains = Object.entries(v.grains)
            .filter(([, k]) => k > 0)
            .map(([id, k]) => ({ color: chem(id)?.color ?? "#fff", n: k }));
          const isSel = sel === v.id && n > 1;
          return (
            <div key={v.id} className="relative flex flex-col items-center" style={{ width: w }}>
              {/* nhãn trạng thái */}
              <div className="pointer-events-none absolute -top-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1">
                {tags.map((x) => (
                  <span key={x} className="lab-accent lab-pop-in whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-extrabold">
                    {x}
                  </span>
                ))}
                {sp && (
                  <span className="lab-pop-in whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-ink">
                    {sp.type === "splint-out" ? "Que đóm tắt!" : sp.type === "splint-relight" ? "Bùng cháy sáng!" : sp.type === "splint-pop" ? "Lách tách, nổ nhẹ!" : "Que đóm vẫn cháy bình thường"}
                  </span>
                )}
              </div>
              {sp && <Splint key={sp.k} result={sp.type} />}
              {drops
                .filter((d) => d.vessel === v.id)
                .map((d) => (
                  <span key={d.k} className="lab-drop pointer-events-none absolute -top-10 left-1/2 z-10 -ml-3 text-2xl">
                    {d.icon}
                  </span>
                ))}
              <button
                data-vessel={v.id}
                onClick={() => (pick ? add(v.id, pick) : setSel(v.id))}
                className={`lab-reflect relative block w-full ${danger?.vessel === v.id ? "lab-shake" : ""}`}
                style={{ filter: isSel ? `drop-shadow(0 0 10px ${t.vars.accent})` : undefined }}
                aria-label={`Dụng cụ ${v.label ?? v.id}`}
              >
                <Glass
                  shape={v.shape}
                  liquid={lq}
                  level={level(v)}
                  oil={volume(v) > 0 ? ((v.liquid["dau-an"] ?? 0) / v.cap) * 0.92 : 0}
                  bubbles={v.bubbles}
                  foam={v.foam / v.cap}
                  spilled={v.spilled}
                  grains={grains}
                  ppt={v.ppt}
                  objects={v.objects.map((o) => ({ emoji: chem(o)?.emoji ?? "•", float: floats(v, o) }))}
                  ice={v.ice}
                  sparks={v.sparks > 0}
                  steam={(v.temp >= 99.5 && volume(v) > 0) || v.sparks > 0}
                  lid={v.lid}
                  condense={v.condense}
                  swirl={v.swirl > 0}
                  env={t.env}
                  dark={t.dark}
                  glow={t.dark}
                  className="w-full"
                />
                {tools.includes("heat") && <Burner on={v.heating} />}
              </button>
              <div className="mt-1 flex items-center gap-1">
                {v.label && <span className="lab-chip rounded-full px-2 py-0.5 font-display text-sm font-extrabold">{v.label}</span>}
                {showTemp && <span className="lab-mono rounded-md bg-[#1d2a1d] px-1.5 py-0.5 text-xs font-bold text-[#9dff8a]">{Math.round(v.temp)}°C</span>}
                {phShow && volume(v) > 0 && <span className="lab-mono rounded-md bg-[#1d2a1d] px-1.5 py-0.5 text-xs font-bold text-[#7fe7ff]">pH {ph(v).toFixed(1)}</span>}
              </div>
              <span className="sr-only">{colorName(v)}</span>
            </div>
          );
        })}
      </div>

      {/* nút dụng cụ */}
      {(tools.some((x) => x !== "thermo") || onReset) && (
        <div className="absolute bottom-3 left-0 z-10 flex flex-wrap justify-center gap-2 px-3" style={{ right: rightPad }}>
          {tools.includes("stir") && (
            <button className="lab-chip rounded-2xl px-3 py-2 text-sm font-extrabold" onClick={() => tool("stir")} disabled={locked}>
              🥄 Khuấy
            </button>
          )}
          {tools.includes("heat") && (
            <button className={`${state.vessels.find((v) => v.id === (sel || state.vessels[0]?.id))?.heating ? "lab-accent" : "lab-chip"} rounded-2xl px-3 py-2 text-sm font-extrabold`} onClick={() => tool("heat")} disabled={locked}>
              🔥 {state.vessels.find((v) => v.id === (sel || state.vessels[0]?.id))?.heating ? "Tắt lửa" : "Đun nóng"}
            </button>
          )}
          {tools.includes("splint") && (
            <button className="lab-chip rounded-2xl px-3 py-2 text-sm font-extrabold" onClick={() => tool("splint")} disabled={locked}>
              🪵 Que đóm
            </button>
          )}
          {tools.includes("ph") && (
            <button className={`${phShow ? "lab-accent" : "lab-chip"} rounded-2xl px-3 py-2 text-sm font-extrabold`} onClick={() => tool("ph")}>
              📟 Đo pH
            </button>
          )}
          {onReset && (
            <button className="lab-chip rounded-2xl px-3 py-2 text-sm font-extrabold" onClick={onReset}>
              ↺ Làm lại
            </button>
          )}
        </div>
      )}

      {/* natri mẩu to: còn chút thời gian để dừng */}
      {danger && (
        <div className="absolute left-0 top-[34%] z-20 flex flex-col items-center gap-2 px-4 text-center" style={{ right: rightPad }}>
          <div className="font-display text-3xl font-extrabold text-[#ff4f6e] drop-shadow-[0_0_14px_#ff3b5c] sm:text-4xl">⚠ NÓNG LÊN QUÁ NHANH!</div>
          <button className="lab-btn bg-[#ff3b5c] text-lg text-white shadow-[0_0_24px_#ff3b5c]" onClick={() => setState((s) => stopDanger(s))}>
            ✋ Dừng lại! <span className="lab-mono text-sm">{left.toFixed(1)}s</span>
          </button>
        </div>
      )}

      {drag?.moved && (
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 text-3xl drop-shadow-lg" style={{ left: drag.x, top: drag.y }}>
          {chem(drag.id)?.emoji ?? "💧"}
        </div>
      )}
    </div>
  );
}
