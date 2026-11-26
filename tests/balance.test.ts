import test from "node:test";
import assert from "node:assert/strict";
import { isBalanced, parseEquation, parseFormula, solve } from "../src/lib/chem/balance";

test("đọc công thức có ngoặc và chỉ số dưới", () => {
  assert.deepEqual(parseFormula("Ca(OH)₂"), { Ca: 1, O: 2, H: 2 });
  assert.deepEqual(parseFormula("Al2(SO4)3"), { Al: 2, S: 3, O: 12 });
  assert.deepEqual(parseFormula("H₂↑"), { H: 2 });
});

test("giải hệ số nguyên nhỏ nhất", () => {
  const cases: [string, number[]][] = [
    ["Na + H₂O → NaOH + H₂", [2, 2, 2, 1]],
    ["Fe + O₂ → Fe₂O₃", [4, 3, 2]],
    ["CH₄ + O₂ → CO₂ + H₂O", [1, 2, 1, 2]],
    ["Al + HCl → AlCl₃ + H₂", [2, 6, 2, 3]],
    ["C₂H₆ + O₂ → CO₂ + H₂O", [2, 7, 4, 6]],
    ["Al + H₂SO₄ → Al₂(SO₄)₃ + H₂", [2, 3, 1, 3]],
    ["KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂", [2, 16, 2, 2, 8, 5]],
  ];
  for (const [t, want] of cases) {
    const eq = parseEquation(t);
    const got = solve(eq);
    assert.deepEqual(got, want, t);
    assert.ok(isBalanced(eq, want), t);
  }
});

test("phương trình sai hệ số không được coi là cân bằng", () => {
  assert.equal(isBalanced(parseEquation("Fe + O₂ → Fe₂O₃"), [1, 1, 1]), false);
});

import { SUBJECTS as subjects } from "../src/content/subjects";
test("mọi vòng cân bằng trong bài học đều giải được", () => {
  for (const s of subjects) {
    for (const t of s.tiers) for (const u of t.units) for (const l of u.lessons) {
      for (const r of l.balance?.rounds ?? []) {
        const c = solve(parseEquation(r.eq));
        assert.ok(c, `${l.id}: ${r.eq}`);
        const names = parseEquation(r.eq);
        const all = [...names.left, ...names.right];
        const shown = c!.map((k, i) => (k > 1 ? k : "") + all[i]);
        for (const f of shown) assert.ok(r.why.includes(f), `${l.id} giải thích thiếu "${f}": ${r.why}`);
      }
    }
  }
});
