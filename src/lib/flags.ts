import type { FakeScreen } from "@/content/types";

/**
 * Môn Kỹ năng số: đoạn [[chữ|giải thích]] trong chữ của màn hình giả là một dấu hiệu đáng ngờ.
 * Thứ tự dấu hiệu theo đúng thứ tự vẽ: title, sub, heading, rồi từng dòng (chữ, nút).
 */
export const FLAG_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

export interface Flag {
  text: string;
  why: string;
}

export const screenFields = (s: FakeScreen): [string, string][] => [
  ["title", s.title],
  ["sub", s.sub ?? ""],
  ["heading", s.heading ?? ""],
  ...s.lines.flatMap((l, i): [string, string][] => [
    [`t${i}`, l.text],
    [`b${i}`, l.button ?? ""],
  ]),
];

export function flagsOf(s: FakeScreen): Flag[] {
  const out: Flag[] = [];
  for (const [, str] of screenFields(s)) for (const m of str.matchAll(FLAG_RE)) out.push({ text: m[1], why: m[2] });
  return out;
}

/** bỏ ký hiệu [[...|...]], giữ lại chữ */
export const plainText = (str: string) => str.replace(FLAG_RE, "$1");
