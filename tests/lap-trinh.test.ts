import { test } from "node:test";
import assert from "node:assert/strict";
import { getSubject, allLessons } from "@/content/subjects";
import { parseLevel, solve } from "@/lib/code/world";
import { runAll } from "@/lib/code/run";
import { countBlocks, parseProgram, programText } from "@/lib/code/program";
import { grade, optimalOf } from "@/lib/code/grade";
import { genLevel } from "@/lib/code/levels";
import { makeRng } from "@/lib/rng";

const lessons = allLessons(getSubject("lap-trinh")!);

test("đọc và viết lại chương trình dạng chữ", () => {
  const p = parseProgram("F 3(F L) R");
  assert.equal(programText(p), "F 3(F L) R");
  assert.equal(countBlocks(p), 5);
});

test("mọi màn làm sẵn đều giải được bằng đúng các khối của màn, số khối tối ưu khớp tìm đường", () => {
  for (const l of lessons) {
    assert.ok(l.code, `${l.id} thiếu màn chơi`);
    for (const lv of l.code.levels) {
      const w = parseLevel(lv);
      const sol = solve(w);
      assert.ok(sol, `${lv.id} không giải được`);
      for (const op of sol) assert.ok((op === "F" && lv.blocks.includes("forward")) || (op === "L" && lv.blocks.includes("left")) || (op === "R" && lv.blocks.includes("right")), `${lv.id} cần khối ${op}`);
      assert.equal(new Set(lv.map.map((r) => r.length)).size, 1, `${lv.id}: các dòng bản đồ phải dài bằng nhau`);
      const best = parseProgram(sol.join(" "));
      const g = grade(lv, best);
      assert.ok(g.win && g.stars === 3, `${lv.id}: lời giải ngắn nhất phải được 3 sao`);
      assert.ok(optimalOf(lv) <= 14, `${lv.id}: màn Vỡ lòng quá dài (${optimalOf(lv)} khối)`);
      if (lv.preset) assert.notEqual(runAll(w, parseProgram(lv.preset)).outcome, "win", `${lv.id}: chương trình có sẵn của bài gỡ lỗi phải chạy sai`);
    }
  }
});

test("bài gỡ lỗi sửa được bằng một thao tác (thêm, bớt hoặc đổi một khối)", () => {
  const ops = ["F", "L", "R"];
  for (const lv of lessons.flatMap((l) => l.code!.levels).filter((x) => x.preset)) {
    const w = parseLevel(lv);
    const p = lv.preset!.split(" ");
    const tries: string[][] = [];
    for (let i = 0; i <= p.length; i++) for (const o of ops) tries.push([...p.slice(0, i), o, ...p.slice(i)]);
    for (let i = 0; i < p.length; i++) {
      tries.push([...p.slice(0, i), ...p.slice(i + 1)]);
      for (const o of ops) tries.push([...p.slice(0, i), o, ...p.slice(i + 1)]);
    }
    assert.ok(tries.some((t) => runAll(w, parseProgram(t.join(" "))).outcome === "win"), `${lv.id}: không sửa được bằng một khối`);
  }
});

test("màn sinh ngẫu nhiên: giải được, cùng seed cùng màn", () => {
  for (const l of lessons) {
    const g = l.code!.gen;
    if (!g) continue;
    for (let seed = 0; seed < 60; seed++) {
      const a = genLevel(makeRng(seed), g);
      const b = genLevel(makeRng(seed), g);
      assert.deepEqual(a, b);
      const sol = solve(parseLevel(a));
      assert.ok(sol && sol.length === a.optimal, `${l.id} seed ${seed}`);
    }
  }
});

test("trình chạy: đụng tường thì dừng, vòng lặp dài bị chặn", () => {
  const w = parseLevel({ id: "t", map: ["S.#G"], dir: 1, blocks: [] });
  assert.equal(runAll(w, parseProgram("F F F")).outcome, "bump");
  assert.equal(runAll(w, parseProgram("F")).outcome, "short");
  const open = parseLevel({ id: "o", map: ["S.", ".G"], dir: 1, blocks: [] });
  assert.equal(runAll(open, parseProgram("21(20(L))")).outcome, "limit");
  const star = parseLevel({ id: "s", map: ["S*", "G."], dir: 2, blocks: [] });
  assert.equal(runAll(star, parseProgram("F")).outcome, "stars");
  assert.equal(runAll(star, parseProgram("L F R F R F")).outcome, "win");
});
