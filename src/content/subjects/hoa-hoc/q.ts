import type { Question, QuestionGen } from "@/content/types";
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
