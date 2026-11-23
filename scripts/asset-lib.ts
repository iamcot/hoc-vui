// Hàm dùng chung cho gen-assets.ts và asset-helper.ts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { basename, extname, join } from "node:path";
import type { ImageAsset } from "@/content/assets";

export const SRC = "assets-src";
export const PUB = "public";

export function loadEnv(...files: string[]) {
  for (const file of files) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

/** đọc tham số dòng lệnh */
export function cli(argv = process.argv.slice(2)) {
  const flag = (n: string) => argv.includes(`--${n}`);
  const opt = (n: string) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const only = opt("only")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"));
  return { flag, opt, only };
}

/** đã có file (ở public/assets hoặc assets-src, đuôi bất kỳ)? */
const dirCache = new Map<string, Set<string>>();
const names = (d: string) => {
  if (!dirCache.has(d)) dirCache.set(d, new Set(existsSync(d) ? readdirSync(d).map((f) => basename(f, extname(f))) : []));
  return dirCache.get(d)!;
};
export function exists(file: string, id: string) {
  const dir = join(PUB, file.split("/").slice(0, -1).join("/"));
  return names(dir).has(id) || names(SRC).has(id);
}

/** lọc theo --only, bỏ mục đã có file (trừ khi force) */
export function pick<T extends { id: string; file: string }>(list: T[], only?: RegExp[], force = false) {
  return list.filter((a) => (only ? only.some((r) => r.test(a.id)) : true)).filter((a) => force || !exists(a.file, a.id));
}

export function findImage(id: string) {
  for (const d of [SRC, join(PUB, "assets/img")]) {
    if (!existsSync(d)) continue;
    const f = readdirSync(d).find((f) => basename(f, extname(f)) === id && /\.(png|webp|jpe?g)$/i.test(f));
    if (f) return join(d, f);
  }
}

/** ảnh tham chiếu để giữ nhân vật và nét vẽ đồng bộ */
export function refsFor(a: ImageAsset, noRef = false): string[] {
  if (noRef || a.id === "mochi-happy" || a.id === "bit-happy") return [];
  const ids: string[] = [];
  // môn Gõ phím (tông công nghệ, cho bé lớn): tham chiếu thỏ Bit và cảnh biển sâu, không lấy nét Mochi
  if (isCyber(a.id)) {
    if (a.prompt.includes("Bit:") || a.id.startsWith("bit-") || a.transparent) ids.push("bit-happy");
    if (!a.transparent && a.id !== "bg-gp-deep") ids.push("bg-gp-deep");
    return [...new Set(ids)].filter((id) => id !== a.id).map(findImage).filter((f): f is string => !!f);
  }
  if (a.prompt.includes("Mochi:") || a.id.startsWith("mochi-")) ids.push("mochi-happy");
  if (a.prompt.includes("Xi Xi:") && a.id !== "xixi") ids.push("xixi");
  if (!a.transparent) ids.push("bg-home"); // giữ tông màu, nét vẽ của cảnh
  else if (!ids.length) ids.push("mochi-happy"); // huy hiệu, avatar: lấy nét vẽ của Mochi
  return [...new Set(ids)].filter((id) => id !== a.id).map(findImage).filter((f): f is string => !!f);
}

export const REF_INTRO =
  "Use the attached images only as reference for character design and art style: same characters, same line art, same colors and shading. Create a brand-new image: ";

const isCyber = (id: string) => /^(gp-|bit-|bg-gp-|subject-gophim)/.test(id);
const anchor = (id: string) => (id === "mochi-happy" || id === "bit-happy" ? 2 : id === "bg-gp-deep" ? 1 : 0);
/** mochi-happy, bit-happy (rồi bg-gp-deep) lên đầu vì các ảnh khác cần chúng làm tham chiếu */
export const mochiFirst = (a: { id: string }, b: { id: string }) => anchor(b.id) - anchor(a.id);

/** các file đang có của một mục (để báo vì sao bị bỏ qua) */
export function whereIs(file: string, id: string) {
  const dirs = [join(PUB, file.split("/").slice(0, -1).join("/")), SRC];
  return dirs.flatMap((d) => (existsSync(d) ? readdirSync(d).filter((f) => basename(f, extname(f)) === id).map((f) => join(d, f)) : []));
}

/** assets-src → public/assets (WebP), cập nhật available.json và docs/ASSET_PROMPTS.md */
export function finalize() {
  // execSync chạy qua shell nên dùng được cả trên Windows (npm.cmd)
  execSync("node scripts/convert-assets.mjs", { stdio: "inherit" });
  execSync("node scripts/scan-assets.mjs", { stdio: "inherit" });
  execSync("npm run -s prompts", { stdio: "inherit" });
}
