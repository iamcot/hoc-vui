import { test } from "node:test";
import assert from "node:assert/strict";
import { renderTyped, telexKeys } from "../src/lib/typing/telex";

test("telexKeys: cách gõ chuẩn", () => {
  assert.equal(telexKeys("bàn"), "banf");
  assert.equal(telexKeys("đường"), "dduwowngf");
  assert.equal(telexKeys("Học vui, nhé!"), "Hocj vui, nhes!");
  assert.equal(telexKeys("hello world"), "hello world");
  assert.equal(telexKeys("Ông"), "Oong");
});

test("renderTyped: hiện chữ khi đang gõ", () => {
  const t = "Học vui, nhé!";
  const k = telexKeys(t);
  assert.equal(renderTyped(t, k.length), t);
  assert.equal(renderTyped(t, 3), "Hoc");
  assert.equal(renderTyped(t, 4), "Học");
  assert.equal(renderTyped(t, 5), "Học ");
  assert.equal(renderTyped(t, 9), "Học vui,");
  assert.equal(renderTyped("đường", 2), "đ");
  assert.equal(renderTyped("đường", 4), "đư");
  assert.equal(renderTyped("đường", 6), "đươ");
  assert.equal(renderTyped("Ông bà", telexKeys("Ông bà").length), "Ông bà");
});
