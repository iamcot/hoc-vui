"use client";
import { useMemo, useState } from "react";
import { parseKeys, type CalcKey, type KeyStep } from "@/content/devices/fx580";
import { Keypad } from "./Keypad";
import { KeySeq } from "./Keys";
import { useProgress } from "@/lib/store";
import { play } from "@/lib/sound";

function stepText(s: KeyStep): string {
  if (s.key.id === "SHIFT" || s.key.id === "ALPHA") return "";
  if (s.as) {
    if (s.as === "GCD" || s.as === "LCM") return `${s.as}(`;
    if (s.as === "x³") return "³";
    if (s.as === ",") return ",";
    if (s.as === "%") return "%";
    if (s.as === "÷R") return "÷R";
    if (s.as === "▯▯/▯") return "▯";
    return "";
  }
  if (s.key.id === "FRAC") return "/";
  if (s.key.id === "POW") return "^";
  return s.key.out && s.key.id !== "EQ" ? s.key.out : "";
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "").replace(/,/g, ".").replace(/[−–]/g, "-").replace(/[x*]/g, "×");

/** Bấm theo: máy ảo hướng dẫn từng phím, hoặc máy thật rồi nhập kết quả. */
export function TryIt({ keys, result, label, onDone }: { keys: string[]; result?: string; label?: string; onDone?: () => void }) {
  const { data, setCalcMode } = useProgress();
  const mode = data.calcMode;
  const steps = useMemo(() => parseKeys(keys), [keys]);
  const [i, setI] = useState(0);
  const [shake, setShake] = useState(0);
  const [typed, setTyped] = useState("");
  const [physical, setPhysical] = useState<"idle" | "ok" | "no">("idle");
  const done = i >= steps.length;

  const screen = steps.slice(0, i).map(stepText).join("");
  const indicator = !done && i > 0 ? (steps[i - 1].key.id === "SHIFT" ? "S" : steps[i - 1].key.id === "ALPHA" ? "A" : null) : null;

  function press(k: CalcKey) {
    if (done) return;
    if (k.id === steps[i].key.id) {
      play("tap", 0.4);
      const n = i + 1;
      setI(n);
      if (n >= steps.length) {
        play("correct");
        onDone?.();
      }
    } else {
      play("wrong", 0.4);
      setShake((x) => x + 1);
    }
  }

  function checkPhysical() {
    if (!result) return;
    const ok = norm(typed) === norm(result) || norm(typed) === norm(result).replace(/^q=/, "").replace("r=", ";");
    setPhysical(ok ? "ok" : "no");
    play(ok ? "correct" : "wrong");
    if (ok) onDone?.();
  }

  return (
    <div className="rounded-3xl border border-line bg-cream/60 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-display font-extrabold">🎯 {label ?? "Bấm theo"}</span>
        <div className="ml-auto inline-flex rounded-full bg-white p-1 text-sm font-bold shadow-sm">
          {(["virtual", "physical"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setCalcMode(m)}
              className={`rounded-full px-3 py-1 transition ${mode === m ? "bg-sky text-white" : "text-ink-soft"}`}
            >
              {m === "virtual" ? "Máy ảo" : "Máy thật"}
            </button>
          ))}
        </div>
      </div>

      <div className={mode === "virtual" ? "grid items-start gap-4 lg:grid-cols-[1fr_auto]" : ""}>
        <div className="space-y-3">
          <KeySeq keys={keys} current={mode === "virtual" ? i : -1} numbered={mode === "physical"} />
          {mode === "virtual" ? (
            <div className="text-sm">
              {done ? (
                <div className="space-y-1">
                  <div className="font-bold text-mint">Giỏi lắm! Em bấm đúng hết rồi 🎉</div>
                  <button className="font-bold text-sky underline" onClick={() => setI(0)}>
                    Bấm lại
                  </button>
                </div>
              ) : (
                <span className="text-ink-soft">
                  Phím tiếp theo đang sáng trên máy. Bước {i + 1}/{steps.length}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-ink-soft">Lấy máy tính của em, bấm lần lượt các phím ở trên. Màn hình máy hiện gì?</p>
              {result ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    value={typed}
                    onChange={(e) => {
                      setTyped(e.target.value);
                      setPhysical("idle");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && checkPhysical()}
                    placeholder="Nhập kết quả trên máy"
                    className={`min-w-0 flex-1 rounded-2xl border-2 bg-white px-4 py-2.5 text-lg font-bold outline-none focus:border-sky ${physical === "no" ? "shake border-berry" : "border-line"}`}
                  />
                  <button onClick={checkPhysical} className="btn btn-primary">
                    Kiểm tra
                  </button>
                </div>
              ) : (
                <button onClick={() => onDone?.()} className="btn btn-primary">
                  Em bấm xong rồi
                </button>
              )}
              {physical === "ok" && <p className="font-bold text-mint">Chính xác! Máy của em ra {result} 🎉</p>}
              {physical === "no" && (
                <p className="text-sm text-berry">
                  Chưa khớp. Bấm AC rồi thử lại thật chậm nhé. Đáp án đúng là <b>{result}</b>.
                </p>
              )}
            </div>
          )}
        </div>
        {mode === "virtual" && (
          <Keypad screen={screen} indicator={indicator} result={done ? (result ?? "✓") : null} highlight={done ? null : steps[i]?.key.id} onPress={press} shakeKey={shake} compact />
        )}
      </div>
    </div>
  );
}
