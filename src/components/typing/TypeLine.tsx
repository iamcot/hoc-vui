"use client";
import { useEffect, useRef, useState } from "react";
import { renderTyped, telexKeys } from "@/lib/typing/telex";
import { play } from "@/lib/sound";
import { Keyboard } from "./Keyboard";
import { typingStats, useKeyInput } from "./useKeyInput";
import { Ico } from "@/components/Ico";

export interface TypeResult {
  /** chữ bé gõ ra (đã ghép Telex) */
  typed: string;
  correctKeys: number;
  errors: number;
  ms: number;
  wpm: number;
  acc: number;
}

/**
 * Gõ lại một dòng chữ. Gõ sai thì phím đỏ lên và phải gõ lại đúng phím đó mới đi tiếp
 * (tập thói quen chính xác). Chữ có dấu thì gõ Telex: app tự ghép.
 */
export function useTypist(text: string, onDone?: (r: TypeResult) => void, active = true, onKey?: (ok: boolean, pos: number) => void) {
  const keys = telexKeys(text);
  const [pos, setPos] = useState(0);
  const [errors, setErrors] = useState(0);
  const [flash, setFlash] = useState<{ ch: string; ok: boolean } | null>(null);
  const start = useRef(0);
  const st = useRef({ pos: 0, errors: 0, done: false });

  useEffect(() => {
    setPos(0);
    setErrors(0);
    st.current = { pos: 0, errors: 0, done: false };
    start.current = 0;
  }, [text]);

  const { imeOn } = useKeyInput((ch) => {
    const s = st.current;
    if (s.done) return;
    if (!start.current) start.current = Date.now();
    const want = keys[s.pos];
    if (ch === want) {
      s.pos++;
      setPos(s.pos);
      setFlash({ ch, ok: true });
      play("gp-key");
      onKey?.(true, s.pos);
      if (s.pos >= keys.length) {
        s.done = true;
        const ms = Date.now() - start.current;
        onDone?.({ typed: text, correctKeys: keys.length, errors: s.errors, ms, ...typingStats(keys.length, s.errors, ms) });
      }
    } else {
      s.errors++;
      setErrors(s.errors);
      setFlash({ ch, ok: false });
      play("gp-miss");
      onKey?.(false, s.pos);
    }
  }, active);

  const ms = start.current ? Date.now() - start.current : 0;
  return { keys, pos, errors, flash, imeOn, rendered: renderTyped(text, pos), next: keys[pos], done: pos >= keys.length, ms };
}

/** Khung gõ một dòng: chữ đã gõ sáng xanh, con trỏ nhấp nháy, bàn phím gợi ý ngón ở dưới. */
export function TypeLine({
  text,
  onDone,
  showKeyboard = true,
  label,
  big = false,
  keys,
  focus,
}: {
  text: string;
  onDone?: (r: TypeResult) => void;
  showKeyboard?: boolean;
  label?: string;
  big?: boolean;
  /** phím sáng trên bàn phím (mặc định: các chữ trong dòng) */
  keys?: string;
  focus?: string;
}) {
  const t = useTypist(text, onDone);
  const doneLen = t.rendered.length;
  const viet = /[^\x00-\x7f]/.test(text);
  return (
    <div className="space-y-3">
      {label && <div className="text-sm font-bold text-ink-soft">{label}</div>}
      <div className={`cyber-panel rounded-3xl px-5 py-4 font-mono font-bold tracking-wide ${big ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
        <span className="text-cyan-300 [text-shadow:0_0_10px_rgba(47,211,255,0.7)]">{t.rendered}</span>
        <span className="caret" />
        <span className="text-white/80">{text.slice(doneLen)}</span>
        {viet && !t.done && (
          <div className="mt-2 font-mono text-sm font-semibold text-cyan-100/60">
            Phím: <span className="text-cyan-200/50">{t.keys.slice(0, t.pos)}</span>
            <span className="text-white">{t.keys.slice(t.pos)}</span>
          </div>
        )}
      </div>
      {t.imeOn && <ImeWarning />}
      {t.done && <p className="font-bold text-mint">Xong! {t.errors === 0 ? <>Không sai phím nào <Ico n="target" /></> : `Sai ${t.errors} phím.`}</p>}
      {showKeyboard && (<Keyboard keys={keys ?? t.keys.toLowerCase()} focus={focus} next={t.done ? undefined : t.next} pressed={t.flash} compact />
      )}
    </div>
  );
}

export function ImeWarning() {
  return (
    <p className="rounded-2xl bg-berry/90 px-4 py-2 text-sm font-bold text-white">
      Máy đang bật bộ gõ tiếng Việt. Chuyển sang bàn phím tiếng Anh (Unikey/EVKey: tắt chữ V) vì Học Vui tự ghép Telex rồi.
    </p>
  );
}
