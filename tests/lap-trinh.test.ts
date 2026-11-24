import { test } from "node:test";
import assert from "node:assert/strict";
import { getSubject, allLessons } from "@/content/subjects";
import { parseLevel, solve } from "@/lib/code/world";
import { runAll } from "@/lib/code/run";
import { countBlocks, parseProgram, programText, pythonLines, type Stmt } from "@/lib/code/program";
import { defaultSkin, pickSkin, SKIN_ORDER, SKINS } from "@/lib/code/skins";
import { grade, optimalOf, worldsOf } from "@/lib/code/grade";
import { genLevel } from "@/lib/code/levels";
import { makeRng } from "@/lib/rng";

const lessons = allLessons(getSubject("lap-trinh")!);

test("đọc và viết lại chương trình dạng chữ", () => {
  const p = parseProgram("F 3(F L) R");
  assert.equal(programText(p), "F 3(F L) R");
  assert.equal(countBlocks(p), 5);
  const q = parseProgram("U(W?(L) A?(F) F)");
  assert.equal(programText(q), "U(W?(L) A?(F) F)");
  assert.equal(countBlocks(q), 6);
});

test("mọi màn làm sẵn đều giải được bằng đúng các khối của màn, số khối tối ưu khớp tìm đường", () => {
  for (const l of lessons) {
    assert.ok(l.code, `${l.id} thiếu màn chơi`);
    for (const lv of l.code.levels.filter((x) => !x.solution)) {
      const w = parseLevel(lv);
      const sol = solve(w);
      assert.ok(sol, `${lv.id} không giải được`);
      for (const op of sol) assert.ok((op === "F" && lv.blocks.includes("forward")) || (op === "L" && lv.blocks.includes("left")) || (op === "R" && lv.blocks.includes("right")), `${lv.id} cần khối ${op}`);
      assert.equal(new Set(lv.map.map((r) => r.length)).size, 1, `${lv.id}: các dòng bản đồ phải dài bằng nhau`);
      const best = parseProgram(sol.join(" "));
      const g = grade(lv, best);
      assert.ok(g.win && g.stars === 3, `${lv.id}: lời giải ngắn nhất phải được 3 sao`);
      assert.ok(optimalOf(lv) <= 14, `${lv.id}: màn quá dài (${optimalOf(lv)} khối)`);
      if (lv.preset) assert.notEqual(runAll(w, parseProgram(lv.preset)).outcome, "win", `${lv.id}: chương trình có sẵn của bài gỡ lỗi phải chạy sai`);
    }
  }
});

const KIND: Record<string, string> = { forward: "forward", left: "left", right: "right", repeat: "repeat", if: "if", until: "until" };
const kinds = (p: Stmt[]): string[] => p.flatMap((s) => [KIND[s.op], ...("body" in s ? kinds(s.body) : [])]);

test("màn có lời giải mẫu (lặp, nếu, bút vẽ): lời giải qua mọi sân, đúng số khối tối ưu, chỉ dùng khối của màn", () => {
  const withSol = lessons.flatMap((l) => l.code!.levels).filter((x) => x.solution);
  assert.ok(withSol.length >= 25);
  for (const lv of withSol) {
    const sol = parseProgram(lv.solution!);
    const g = grade(lv, sol);
    assert.ok(g.win && g.stars === 3, `${lv.id}: lời giải mẫu không qua màn`);
    for (const k of kinds(sol)) assert.ok(lv.blocks.includes(k as never), `${lv.id}: lời giải dùng khối ${k} không có trong màn`);
    const ws = worldsOf(lv);
    for (const w of ws) for (const row of w.solid) assert.equal(row.length, w.w);
    // màn có sân ẩn: không chương trình thẳng (không lặp/nếu) nào đi được hết các sân
    if (lv.alt?.length) {
      const straight = solve(ws[0])!;
      assert.ok(!ws.every((w) => runAll(w, parseProgram(straight.join(" "))).outcome === "win"), `${lv.id}: sân ẩn quá giống nhau`);
    }
    // màn bút vẽ: hình mẫu có nét, và chưa chạy gì thì chưa thắng
    if (lv.draw) assert.ok(ws[0].target!.size > 0 && runAll(ws[0], []).outcome === "shape", `${lv.id}: hình mẫu rỗng`);
  }
});

test("lặp tới khi: vòng lặp không bao giờ tới cờ thì bị chặn, không treo máy", () => {
  const w = parseLevel({ id: "u", map: ["S#G"], dir: 1, blocks: [] });
  assert.equal(runAll(w, parseProgram("U(L)")).outcome, "limit");
  assert.equal(runAll(w, parseProgram("U(W?(L))")).outcome, "limit");
  assert.equal(runAll(w, parseProgram("U()")).outcome, "limit");
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

test("giao diện: mặc định theo trình độ, chỉ dùng giao diện đã mở khóa", () => {
  assert.equal(defaultSkin("vo-long"), "pixel");
  assert.equal(defaultSkin("co-ban"), "robot");
  assert.equal(defaultSkin("nang-cao"), "holo");
  const open = (t: string) => t === "vo-long" || t === "co-ban";
  assert.equal(pickSkin(null, "co-ban", open), "robot");
  assert.equal(pickSkin("pixel", "co-ban", open), "pixel");
  assert.equal(pickSkin("holo", "co-ban", open), "robot", "Hologram chưa mở thì về mặc định");
  assert.equal(pickSkin("lung-tung", "vo-long", open), "pixel");
  for (const id of SKIN_ORDER) assert.ok(getSubject("lap-trinh")!.tiers.some((t) => t.id === SKINS[id].tier), `${id} mở ở trình độ có thật`);
});

test("xem trước Python: dịch khối ra code có thụt lề", () => {
  const lines = pythonLines(parseProgram("F 3(F R) U(W?(L) F)"));
  assert.deepEqual(
    lines.map((l) => "    ".repeat(l.indent) + l.text),
    ["di_toi()", "for i in range(3):", "    di_toi()", "    re_phai()", "while not toi_co():", "    if co_tuong_truoc():", "        re_trai()", "    di_toi()"],
  );
  assert.deepEqual(pythonLines(parseProgram("2()")).map((l) => l.text), ["for i in range(2):", "pass"]);
});
