import { test } from "node:test";
import assert from "node:assert/strict";
import { SUBJECTS, allLessons } from "@/content/subjects";
import { parseKeys } from "@/content/devices/fx580";
import { checkAnswer } from "@/lib/check";
import { makeRng } from "@/lib/rng";
import { mixedSet, practiceSet } from "@/lib/quiz";
import { imageById, audioById } from "@/content/assets";

const subjects = SUBJECTS.filter((s) => s.ready);

test("mọi chuỗi phím trong bài học đều hợp lệ, ảnh và giọng đọc có trong danh mục", () => {
  for (const s of subjects) {
    assert.ok(imageById(s.cover), s.cover);
    for (const l of allLessons(s)) {
      assert.ok(imageById(l.cover), `cover ${l.cover}`);
      for (const sl of l.slides) {
        if (sl.voice) assert.ok(audioById(sl.voice), `voice ${sl.voice}`);
        for (const b of sl.blocks) {
          if (b.type === "keys" || (b.type === "example" && b.keys)) parseKeys(b.keys!);
          if (b.type === "image") assert.ok(imageById(b.asset), `image ${b.asset}`);
          if (b.type === "check") {
            assert.ok(checkAnswer(b.question, b.question.answer), `${l.id}: ${b.question.prompt}`);
            if (b.question.choices) assert.ok(b.question.choices.includes(b.question.answer));
          }
        }
      }
    }
  }
});

test("bộ sinh bài tập: đáp án tự kiểm là đúng, phím hợp lệ, lựa chọn không trùng", () => {
  for (const s of subjects) {
    for (const l of allLessons(s)) {
      for (const gen of l.practice) {
        for (let seed = 0; seed < 300; seed++) {
          const q = gen(makeRng(seed));
          assert.ok(checkAnswer(q, q.answer), `${l.id} seed ${seed}: ${q.prompt} -> ${q.answer}`);
          if (q.keys) parseKeys(q.keys);
          if (q.kind === "choice") {
            assert.ok(q.choices!.includes(q.answer), q.prompt);
            assert.equal(new Set(q.choices).size, q.choices!.length, `trùng lựa chọn: ${q.prompt}`);
            assert.ok(q.choices!.length >= 2);
          }
          if (q.kind === "number") assert.ok(Number.isFinite(Number(q.answer.replace(",", "."))), q.answer);
        }
      }
    }
  }
});

test("cùng seed thì cùng đề (thi đấu)", () => {
  const s = subjects[0];
  const a = mixedSet(s, "ABC123", 10).map((q) => q.prompt);
  const b = mixedSet(s, "ABC123", 10).map((q) => q.prompt);
  assert.deepEqual(a, b);
  assert.equal(a.length, 10);
  assert.equal(practiceSet(s, "phep-tinh", "x", 8).length, 8);
});

test("chấm đáp án", () => {
  const base = { id: "t", prompt: "", topic: "t" };
  assert.ok(checkAnswer({ ...base, kind: "number", answer: "12.5" }, "12,5"));
  assert.ok(checkAnswer({ ...base, kind: "fraction", answer: "7/12", reduced: true }, "7/12"));
  assert.ok(!checkAnswer({ ...base, kind: "fraction", answer: "7/12", reduced: true }, "14/24"));
  assert.ok(checkAnswer({ ...base, kind: "fraction", answer: "7/3" }, "2 1/3"));
  assert.ok(checkAnswer({ ...base, kind: "pair", answer: "5;25" }, "5;25"));
  assert.ok(checkAnswer({ ...base, kind: "number", answer: "-75" }, "−75"));
});
