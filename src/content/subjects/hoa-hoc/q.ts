import type { Question, QuestionGen } from "@/content/types";
import { isBalanced, parseEquation, solve } from "@/lib/chem/balance";
import type { Rng } from "@/lib/rng";

/** một câu trắc nghiệm: đáp án đúng đứng đầu `choices`, khi ra đề sẽ trộn */
export interface Q {
  prompt: string;
  choices: string[];
  explain?: string;
  hint?: string;
}

let n = 0;
/** Bộ sinh câu hỏi: mỗi lần lấy ngẫu nhiên một câu trong ngân hàng, trộn đáp án */
export function bank(topic: string, qs: Q[]): QuestionGen {
  return (rng: Rng): Question => {
    const q = rng.pick(qs);
    return {
      id: `hh-${topic}-${n++}`,
      prompt: q.prompt,
      kind: "choice",
      answer: q.choices[0],
      choices: rng.shuffle(q.choices),
      explain: q.explain,
      hint: q.hint,
      topic,
    };
  };
}

/** Câu hỏi cân bằng phương trình: đáp án là bộ hệ số nhỏ nhất, đáp án nhiễu là bộ hệ số lệch một chút */
export function balanceBank(topic: string, eqs: string[]): QuestionGen {
  return (rng: Rng): Question => {
    const text = rng.pick(eqs);
    const eq = parseEquation(text);
    const good = solve(eq);
    if (!good) throw new Error(`Không cân bằng được: ${text}`);
    const show = (c: number[]) => c.join(" : ");
    const wrong = new Set<string>();
    for (let k = 0; wrong.size < 3 && k < 60; k++) {
      const c = good.slice();
      const i = rng.int(0, c.length - 1);
      c[i] = Math.max(1, c[i] + (rng.int(0, 1) ? 1 : -1));
      if (!isBalanced(eq, c)) wrong.add(show(c));
    }
    const choices = [show(good), ...wrong];
    return {
      id: `hh-${topic}-${n++}`,
      prompt: `Hệ số để cân bằng ${text} (theo thứ tự các chất) là`,
      kind: "choice",
      answer: choices[0],
      choices: rng.shuffle(choices),
      explain: `Đếm nguyên tử mỗi nguyên tố hai vế: ${text.replace(/→/, "→")} cân bằng với hệ số ${show(good)}.`,
      hint: "Đếm nguyên tử từng nguyên tố ở hai vế rồi chỉnh hệ số.",
      topic,
    };
  };
}
