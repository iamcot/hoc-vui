import { test } from "node:test";
import assert from "node:assert/strict";
import { compareReading, parseSyllable, spellSyllable, telexId, voiceIdFor, words } from "@/lib/viet";
import { TAPDOC_VOICES } from "@/content/subjects/tap-doc/voices";

test("tách tiếng và đánh vần", () => {
  assert.deepEqual(parseSyllable("nghé"), { onset: "ngh", rime: "e", tone: "sac" });
  assert.deepEqual(parseSyllable("giường"), { onset: "gi", rime: "ương", tone: "huyen" });
  assert.deepEqual(parseSyllable("quả"), { onset: "qu", rime: "a", tone: "hoi" });
  assert.deepEqual(spellSyllable("bàn"), ["bờ", "an", "ban", "huyền", "bàn"]);
  assert.deepEqual(spellSyllable("ba"), ["bờ", "a", "ba"]);
});

test("tên file giọng đọc kiểu Telex, không trùng", () => {
  assert.equal(telexId("cái bàn"), "cais_banf");
  assert.equal(telexId("đường"), "dduwowngf");
  const ids = TAPDOC_VOICES.map((v) => v.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^tv-[a-z0-9_-]+$/);
  assert.ok(voiceIdFor("Sáng nay, Mochi dậy thật sớm. Mochi đánh răng, rửa mặt rồi ăn sáng.").length < 80);
});

test("so khớp lời đọc", () => {
  assert.deepEqual(words("Bé đi học."), ["bé", "đi", "học"]);
  assert.ok(compareReading("Bé đi học.", ["bé đi học"]).pass);
  assert.ok(compareReading("hoà", ["hòa"]).pass, "cách bỏ dấu cũ/mới");
  const r = compareReading("Mẹ nấu cơm.", ["mẹ nấu cơm"]);
  assert.deepEqual(r.marks, ["ok", "ok", "ok"]);
  const sai = compareReading("Mẹ nấu cơm.", ["mẹ nậu"]);
  assert.deepEqual(sai.marks, ["ok", "tone", "miss"]);
  assert.equal(sai.pass, false);
  assert.ok(!compareReading("bàn", ["bán"]).pass, "sai thanh là sai");
  assert.ok(compareReading("bàn", ["bán"], false).pass, "chế độ dễ: sai thanh vẫn đạt");
  assert.ok(compareReading("Bé có 2 con mèo", ["bé có hai con mèo"]).pass);
});
