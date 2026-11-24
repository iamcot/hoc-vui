import { test } from "node:test";
import assert from "node:assert/strict";
import { kyNangSo, VERDICTS } from "@/content/subjects/ky-nang-so";
import { allLessons } from "@/content/subjects";
import { practiceSet, mixedSet } from "@/lib/quiz";
import { flagsOf, plainText } from "@/lib/flags";
import { checkPassword, passphrase } from "@/lib/password";
import { checkAnswer } from "@/lib/check";

test("Kỹ năng số: 4 trình độ, 23 bài, id không trùng", () => {
  const ls = allLessons(kyNangSo);
  assert.equal(kyNangSo.tiers.length, 4);
  assert.equal(ls.length, 23);
  assert.equal(new Set(ls.map((l) => l.id)).size, ls.length);
});

test("mỗi bài: soi dấu hiệu có ít nhất 2 chỗ, tình huống có đúng và sai", () => {
  for (const l of allLessons(kyNangSo)) {
    const spot = l.slides.flatMap((s) => s.blocks).find((b) => b.type === "spot");
    assert.ok(spot && spot.type === "spot", l.id);
    assert.ok(flagsOf(spot.screen).length >= 2, `${l.id}: ít dấu hiệu`);
    const sc = l.slides.flatMap((s) => s.blocks).find((b) => b.type === "scenario");
    assert.ok(sc && sc.type === "scenario", l.id);
    assert.ok(sc.options.some((o) => o.good) && sc.options.some((o) => !o.good), l.id);
  }
});

test("luyện tập: đáp án nằm trong lựa chọn, đủ câu khác nhau", () => {
  for (const l of allLessons(kyNangSo)) {
    for (const seed of ["a", "b", "c"]) {
      const qs = practiceSet(kyNangSo, l.id, seed);
      assert.ok(qs.length >= 5, `${l.id}: chỉ có ${qs.length} câu`);
      for (const q of qs) {
        assert.ok(q.choices!.includes(q.answer), `${l.id}: ${q.prompt}`);
        assert.equal(new Set(q.choices).size, q.choices!.length, `${l.id}: lựa chọn trùng`);
        assert.ok(checkAnswer(q, q.answer));
      }
    }
  }
});

test("đề thi đấu cùng mã ra cùng đề", () => {
  const a = mixedSet(kyNangSo, "ABC123", 10).map((q) => q.prompt + q.answer);
  const b = mixedSet(kyNangSo, "ABC123", 10).map((q) => q.prompt + q.answer);
  assert.deepEqual(a, b);
  assert.equal(a.length, 10);
});

test("kho Thật hay giả có cả an toàn và không ổn ở mọi trình độ", () => {
  for (const t of [0, 1, 2, 3]) {
    const vs = VERDICTS.filter((x) => x.tier === t);
    assert.ok(vs.some((x) => x.v.scam) && vs.some((x) => !x.v.scam), `trình độ ${t}`);
  }
});

test("dấu hiệu viết đúng cú pháp (không sót [[ hay ]])", () => {
  for (const { v } of VERDICTS) for (const l of v.screen.lines) assert.ok(!/\[\[|\]\]/.test(plainText(l.text)));
  for (const l of allLessons(kyNangSo))
    for (const b of l.slides.flatMap((s) => s.blocks))
      if (b.type === "spot" || b.type === "scenario")
        for (const x of [b.screen.title, b.screen.sub ?? "", b.screen.heading ?? "", ...b.screen.lines.flatMap((y) => [y.text, y.button ?? ""])]) assert.ok(!/\[\[|\]\]/.test(plainText(x)), `${l.id}: ${x}`);
});

test("mật khẩu: dễ đoán thì yếu, cụm từ dài thì mạnh", () => {
  for (const p of ["123456", "password", "matkhau123", "Nam2014", "aaaaaaa"]) assert.ok(checkPassword(p).score <= 1, p);
  assert.ok(checkPassword("Ca-Voi-Xanh+Bay-88").score >= 3);
  for (let i = 0; i < 20; i++) assert.ok(checkPassword(passphrase()).score >= 3);
});
