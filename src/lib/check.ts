import type { Question } from "@/content/types";
import { parseFrac, parseNum, gcd } from "./math";
import { compareReading } from "./viet";

export function checkAnswer(q: Question, input: string): boolean {
  const raw = input.trim();
  if (!raw) return false;
  switch (q.kind) {
    case "choice":
      return raw === q.answer;
    case "number": {
      const v = parseNum(raw);
      const a = parseNum(q.answer);
      if (v === null || a === null) return false;
      return Math.abs(v - a) <= (q.tolerance ?? 1e-9);
    }
    case "fraction": {
      const v = parseFrac(raw);
      const a = parseFrac(q.answer);
      if (!v || !a) return false;
      if (v.n * a.d !== a.n * v.d) return false;
      if (q.reduced) {
        // chấp nhận số nguyên hoặc phân số tối giản (kể cả hỗn số)
        return Math.abs(gcd(v.n, v.d)) === 1 || v.d === 1;
      }
      return true;
    }
    case "read":
      // input là lời nghe được (hoặc "__ok__" khi bé/bố mẹ tự chấm đúng)
      return raw === "__ok__" || compareReading(q.answer, [raw], q.strict ?? true).pass;
    case "type":
      return typeAccuracy(q.answer, raw) >= 0.9;
    case "pair": {
      const [x, y] = raw.split(";");
      const [ax, ay] = q.answer.split(";");
      return parseNum(x ?? "") === parseNum(ax) && parseNum(y ?? "") === parseNum(ay);
    }
  }
}

/** tỉ lệ ký tự gõ đúng vị trí so với dòng mẫu (môn Gõ phím) */
export function typeAccuracy(target: string, typed: string): number {
  if (!target.length) return 1;
  let ok = 0;
  for (let i = 0; i < target.length; i++) if (typed[i] === target[i]) ok++;
  return ok / Math.max(target.length, typed.length);
}
