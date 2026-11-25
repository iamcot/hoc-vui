import { test } from "node:test";
import assert from "node:assert/strict";
import { allLessons, getSubject } from "@/content/subjects";
import { RANKS, rankLessonIds } from "@/lib/ranks";
import { PASSAGES, PASSAGE_KINDS, lengthOf } from "@/content/subjects/go-phim/passages";

test("đề phòng theo cấp: ba đoạn lộ trình nối nhau phủ hết các bài, không trùng", () => {
  for (const id of ["may-tinh", "go-phim"]) {
    const s = getSubject(id)!;
    const parts = RANKS.map((r) => rankLessonIds(s, r.id) ?? []);
    for (const p of parts) assert.ok(p.length > 0, `${id}: cấp nào cũng có bài`);
    const flat = parts.flat();
    assert.equal(new Set(flat).size, flat.length, `${id}: không trùng bài giữa các cấp`);
    assert.deepEqual(flat, allLessons(s).map((l) => l.id), `${id}: đủ bài theo thứ tự lộ trình`);
    assert.equal(rankLessonIds(s, "free"), undefined, "phòng tự do: cả môn");
  }
});

test("bài gõ hay: đủ ba loại, mỗi loại có đoạn ngắn và đoạn dài, id không trùng", () => {
  assert.equal(new Set(PASSAGES.map((p) => p.id)).size, PASSAGES.length);
  for (const k of PASSAGE_KINDS) {
    const mine = PASSAGES.filter((p) => p.kind === k.id);
    assert.ok(mine.some((p) => lengthOf(p) === "ngan"), `${k.id}: có đoạn ngắn`);
    assert.ok(mine.some((p) => lengthOf(p) === "dai"), `${k.id}: có đoạn dài`);
  }
  for (const g of ["co-tich", "thieu-nhi", "hien-dai", "tho"]) {
    for (const k of PASSAGE_KINDS) if (k.id !== "khong-dau" || g === "co-tich") assert.ok(PASSAGES.some((p) => p.genre === g && p.kind === k.id), `${k.id}: có thể loại ${g}`);
  }
  for (const p of PASSAGES.filter((x) => x.kind !== "co-dau")) assert.match(p.text, /^[\x20-\x7e]+$/, `${p.id}: chỉ ký tự gõ thẳng được`);
});
