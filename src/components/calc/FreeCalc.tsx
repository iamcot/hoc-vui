"use client";
import { useEffect, useState } from "react";
import type { CalcKey } from "@/content/devices/fx580";
import { evaluate, fmtResult, tokText, type CalcResult, type Tok } from "@/lib/calc-eval";
import { play } from "@/lib/sound";
import { Keypad } from "./Keypad";

/** Đổi một lần bấm phím (kèm SHIFT/ALPHA đang bật) thành token. null = phím không dùng ở bản rút gọn. */
function keyToToks(id: string, mod: "S" | "A" | null): Tok[] | null {
  if (/^\d$/.test(id)) return [{ k: "num", v: id }];
  if (mod === "A") {
    if (id === "MUL") return [{ k: "fn", v: "gcd" }];
    if (id === "DIV") return [{ k: "fn", v: "lcm" }];
    if (id === "FRAC") return [{ k: "op", v: "divr" }];
  }
  if (mod === "S") {
    const m: Record<string, Tok[]> = {
      SQRT: [{ k: "fn", v: "cbrt" }],
      POW2: [{ k: "post", v: "cube" }],
      INV: [{ k: "post", v: "fact" }],
      SIN: [{ k: "fn", v: "asin" }],
      COS: [{ k: "fn", v: "acos" }],
      TAN: [{ k: "fn", v: "atan" }],
      RP: [{ k: "comma" }],
      EXP: [{ k: "const", v: "pi" }],
      ANS: [{ k: "post", v: "pct" }],
    };
    if (m[id]) return m[id];
  }
  const m: Record<string, Tok[]> = {
    DOT: [{ k: "num", v: "." }],
    ADD: [{ k: "op", v: "+" }],
    SUB: [{ k: "op", v: "-" }],
    MUL: [{ k: "op", v: "*" }],
    DIV: [{ k: "op", v: "/" }],
    FRAC: [{ k: "op", v: "frac" }],
    POW: [{ k: "op", v: "^" }],
    POW2: [{ k: "post", v: "sq" }],
    SQRT: [{ k: "fn", v: "sqrt" }],
    NEG: [{ k: "neg" }],
    INV: [{ k: "post", v: "inv" }],
    SIN: [{ k: "fn", v: "sin" }],
    COS: [{ k: "fn", v: "cos" }],
    TAN: [{ k: "fn", v: "tan" }],
    LP: [{ k: "lp" }],
    RP: [{ k: "rp" }],
    ANS: [{ k: "const", v: "ans" }],
    EXP: [{ k: "op", v: "*" }, { k: "num", v: "1" }, { k: "num", v: "0" }, { k: "op", v: "^" }],
  };
  return m[id] ?? null;
}

const openCount = (t: Tok[]) => t.reduce((n, x) => n + (x.k === "lp" || x.k === "fn" ? 1 : x.k === "rp" ? -1 : 0), 0);

/** Máy fx-580VN X ảo bấm tự do: tính thật, có Ans, S⇔D, DEL, AC. */
export function FreeCalc({ onResult }: { onResult?: (r: CalcResult | null) => void }) {
  const [toks, setToks] = useState<Tok[]>([]);
  const [mod, setMod] = useState<"S" | "A" | null>(null);
  const [res, setRes] = useState<CalcResult | null>(null);
  const [err, setErr] = useState("");
  const [dec, setDec] = useState(false);
  const [ans, setAns] = useState(0);
  const [shake, setShake] = useState(0);

  const shown = res ? fmtResult(res, dec) : "";
  useEffect(() => {
    onResult?.(res);
  }, [res, onResult]);

  function press(k: CalcKey) {
    play("tap");
    const id = k.id;
    if (id === "SHIFT" || id === "ALPHA") {
      const m = id === "SHIFT" ? "S" : "A";
      setMod((x) => (x === m ? null : m));
      return;
    }
    const m = mod;
    setMod(null);
    if (id === "AC" || id === "ON") {
      setToks([]);
      setRes(null);
      setErr("");
      return;
    }
    if (id === "DEL") {
      if (res || err) {
        setRes(null);
        setErr("");
      }
      setToks((t) => t.slice(0, -1));
      return;
    }
    if (id === "SD") {
      if (res) setDec((d) => !d);
      return;
    }
    if (id === "LEFT") return;
    if (id === "RIGHT") {
      // thoát khỏi căn/ngoặc đang mở, giống nhảy ra khỏi ô trên máy thật
      if (!res && openCount(toks) > 0) setToks((t) => [...t, { k: "rp" }]);
      return;
    }
    if (id === "EQ") {
      try {
        const r = evaluate(toks, ans);
        setRes(r);
        setErr("");
        setDec(false);
        setAns(r.divr ? r.divr.q : r.value);
      } catch (e) {
        setErr((e as Error).message);
        setRes(null);
        setShake((x) => x + 1);
        play("wrong");
      }
      return;
    }
    const add = keyToToks(id, m);
    if (!add) return;
    if (res || err) {
      // sau dấu = : bấm phép toán thì tính tiếp từ Ans, bấm số thì bắt đầu phép tính mới
      const continues = add[0].k === "op" || add[0].k === "post";
      setToks(continues ? [{ k: "const", v: "ans" }, ...add] : add);
      setRes(null);
      setErr("");
      return;
    }
    setToks((t) => [...t, ...add]);
  }

  return (
    <Keypad
      screen={toks.map(tokText).join("")}
      indicator={mod}
      result={err || (res ? shown : null)}
      highlight={null}
      onPress={press}
      shakeKey={shake}
      compact
    />
  );
}
