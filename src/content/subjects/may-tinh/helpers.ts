import type { Question } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { numKeys } from "@/content/devices/fx580";

/* Công cụ dùng chung cho bộ sinh bài tập môn Máy tính (mọi trình độ). */

let counter = 0;
export const qid = (topic: string) => `${topic}-${++counter}`;

/** Chuyển biểu thức dạng token thành chuỗi phím. */
export function k(...tokens: (string | number)[]): string[] {
  const out: string[] = [];
  for (const t of tokens) {
    if (typeof t === "number") out.push(...numKeys(t));
    else if (t === "+") out.push("ADD");
    else if (t === "-") out.push("SUB");
    else if (t === "×") out.push("MUL");
    else if (t === "÷") out.push("DIV");
    else if (t === "(") out.push("LP");
    else if (t === ")") out.push("RP");
    else if (t === "²") out.push("POW2");
    else if (t === "³") out.push("SHIFT", "POW2:x³");
    else if (t === "^") out.push("POW");
    else if (t === "/") out.push("FRAC");
    else if (t === "▶") out.push("RIGHT");
    else if (t === ",") out.push("SHIFT", "RP:,");
    else if (t === "%") out.push("SHIFT", "ANS:%");
    else if (t === "=") out.push("EQ");
    else if (t === "π") out.push("SHIFT", "EXP:π");
    else if (t === "√") out.push("SQRT");
    else if (t === "∛") out.push("SHIFT", "SQRT:∛▯");
    else if (t === "sin" || t === "cos" || t === "tan") out.push(t.toUpperCase());
    else if (t === "S⇔D") out.push("SD");
    else out.push(t);
  }
  return out;
}

export function choiceQ(rng: Rng, base: Omit<Question, "id" | "kind" | "choices">, wrong: string[]): Question {
  const uniq = Array.from(new Set(wrong.filter((w) => w !== base.answer))).slice(0, 3);
  return { ...base, id: qid(base.topic), kind: "choice", choices: rng.shuffle([base.answer, ...uniq]) };
}

