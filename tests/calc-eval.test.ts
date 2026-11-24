import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, fmtResult, type Tok } from "@/lib/calc-eval";

/** viết nhanh token: "2 + 3 * ( 4 )" */
function T(s: string): Tok[] {
  return s.split(" ").filter(Boolean).map((w): Tok => {
    if (/^[\d.]+$/.test(w)) return { k: "num", v: w };
    const ops: Record<string, Tok> = { "+": { k: "op", v: "+" }, "-": { k: "op", v: "-" }, "*": { k: "op", v: "*" }, "/": { k: "op", v: "/" }, F: { k: "op", v: "frac" }, "^": { k: "op", v: "^" }, R: { k: "op", v: "divr" }, N: { k: "neg" }, "(": { k: "lp" }, ")": { k: "rp" }, ",": { k: "comma" }, "²": { k: "post", v: "sq" }, "³": { k: "post", v: "cube" }, "%": { k: "post", v: "pct" }, pi: { k: "const", v: "pi" } };
    if (ops[w]) return ops[w];
    return { k: "fn", v: w as "sqrt" };
  });
}
const show = (s: string, dec = false) => fmtResult(evaluate(T(s)), dec);

test("máy ảo tự do: phép tính cơ bản và thứ tự", () => {
  assert.equal(show("2 + 3 * 4"), "14");
  assert.equal(show("( 2 + 3 ) * 4"), "20");
  assert.equal(show("2 F 3 + 1 F 4"), "11/12");
  assert.equal(show("2 F 3 + 1 F 4", true), "0.9166666667");
  assert.equal(show("N 2 ^ 4"), "-16");
  assert.equal(show("( N 2 ) ^ 4"), "16");
  assert.equal(show("100 R 7"), "Q=14, R=2");
  assert.equal(show("gcd 12 , 18 )"), "6");
  assert.equal(show("lcm 4 , 6"), "12");
  assert.equal(show("240 * 15 %"), "36");
  assert.equal(show("sqrt 169"), "13");
  assert.equal(show("sqrt 7"), "2.645751311");
  assert.equal(show("cbrt N 64"), "-4");
  assert.equal(show("2 pi * 5"), "31.41592654");
  assert.equal(show("sin 30 )"), "0.5");
  assert.equal(show("sqrt 6 ² + 8 ²"), "10");
  assert.equal(show("0.75 - 2 F 3"), "1/12");
  assert.throws(() => evaluate(T("5 / 0")));
  assert.throws(() => evaluate(T("2 + * 3")));
});
