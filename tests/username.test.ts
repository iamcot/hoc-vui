import { test } from "node:test";
import assert from "node:assert/strict";
import { emailToLogin, loginToEmail, normalizeUsername, usernameError } from "../src/lib/username";

test("tên đăng nhập: bỏ dấu, chữ thường, bỏ ký tự lạ", () => {
  assert.equal(normalizeUsername(" Bé Na 2015 "), "bena2015");
  assert.equal(normalizeUsername("Đức_Anh.9"), "duc_anh.9");
});

test("tên đăng nhập ⇄ email nội bộ", () => {
  assert.equal(loginToEmail("BeNa"), "bena@hocvui.local");
  assert.equal(emailToLogin("bena@hocvui.local"), "bena");
  assert.equal(loginToEmail("Me@Gmail.com"), "me@gmail.com");
  assert.equal(emailToLogin("me@gmail.com"), "me@gmail.com");
});

test("kiểm tra độ dài", () => {
  assert.ok(usernameError("ab"));
  assert.equal(usernameError("bena"), null);
});
