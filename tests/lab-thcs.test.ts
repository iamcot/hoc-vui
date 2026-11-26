import test from "node:test";
import assert from "node:assert/strict";
import { addChem, initLab, splint } from "../src/lib/chem/lab";
import { l8Neutral, l9Acid, l9Displace } from "../src/content/subjects/hoa-hoc/lab-thcs";

const run = (lesson: typeof l8Neutral, adds: [string, string][], tool?: string) => {
  const ex = lesson.lab!.experiments[0];
  let s = initLab(ex.vessels);
  for (const [v, c] of adds) s = addChem(s, v, c);
  if (tool) s = splint(s, tool);
  return { ex, s };
};

test("trung hoà: vừa đủ rồi dư NaOH thì hồng, goal đạt", () => {
  const { ex, s } = run(l8Neutral, [["A", "naoh"], ["A", "naoh"], ["A", "naoh"], ["A", "naoh"]]);
  assert.ok(s.log.includes("neutral:A") && s.log.includes("pink:A"));
  assert.ok(ex.goal.done(s.log, s));
});

test("kẽm sủi H₂, đồng không, que đóm nổ", () => {
  const { ex, s } = run(l9Acid, [["A", "zn"], ["B", "cu"]], "A");
  assert.ok(s.log.includes("h2:A:zn") && s.log.includes("add:B:cu") && !s.log.includes("h2:B:cu"));
  assert.ok(s.log.includes("splint-pop"));
  void ex;
});

test("sắt và kẽm đẩy đồng, đồng thì không", () => {
  const { ex, s } = run(l9Displace, [["A", "fe"], ["B", "cu"], ["C", "zn"]]);
  assert.ok(ex.goal.done(s.log, s));
  assert.equal(s.vessels[1].ppt, null);
  assert.ok(s.vessels[0].ppt);
});

import { filterPour, stir, tick } from "../src/lib/chem/lab";
import { unitsKhtn } from "../src/content/subjects/hoa-hoc/khtn";

test("KHTN: lọc giữ cát, muối lọt qua; đun cạn thì muối kết tinh", () => {
  const [k01] = unitsKhtn[0].lessons;
  const [loc, bay] = k01.lab!.experiments;
  let s = initLab(loc.vessels);
  s = filterPour(stir(s, "A"), "A");
  assert.ok(loc.goal.done(s.log, s));
  assert.ok(s.vessels[0].grains.cat > 0);
  let h = stir(initLab(bay.vessels), "A");
  h.vessels[0].heating = true;
  for (let i = 0; i < 400; i++) h = tick(h, 0.1);
  assert.ok(bay.goal.done(h.log, h));
  assert.ok(h.vessels[0].grains.muoi > 0.5);
});

test("KHTN: muối bão hoà, đường nóng tan thêm", () => {
  const [, k02] = unitsKhtn[0].lessons;
  const [bh, nong] = k02.lab!.experiments;
  let s = initLab(bh.vessels);
  for (let i = 0; i < 2; i++) s = stir(addChem(s, "A", "muoi"), "A");
  assert.ok(bh.goal.done(s.log, s));
  let d = stir(initLab(nong.vessels), "A");
  assert.ok(d.log.includes("saturated:duong"));
  d.vessels[0].heating = true;
  for (let i = 0; i < 60; i++) d = tick(d, 0.1);
  assert.ok(nong.goal.done(d.log, d));
});
