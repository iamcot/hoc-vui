import { addTone, splitTone, type Tone } from "@/lib/viet";

/**
 * Gõ tiếng Việt kiểu Telex ngay trong app (không cần bộ gõ của máy).
 * Mỗi chữ có một cách gõ chuẩn: dấu mũ/móc gõ ngay sau chữ (aa, ow, dd),
 * dấu thanh gõ ở cuối tiếng (s f r x j). Bé gõ từng phím, app hiện chữ đã ghép.
 */
const MARK: Record<string, string> = { â: "aa", ă: "aw", ê: "ee", ô: "oo", ơ: "ow", ư: "uw", đ: "dd" };
const TONE_KEY: Record<Tone, string> = { ngang: "", huyen: "f", sac: "s", hoi: "r", nga: "x", nang: "j" };
const KEY_TONE: Record<string, Tone> = { f: "huyen", s: "sac", r: "hoi", x: "nga", j: "nang" };

const isViet = (w: string) => /[^\x00-\x7f]/.test(w);

/** một từ → các phím cần gõ. "đường" → "dduwowngf" */
function wordKeys(w: string): string {
  if (!isViet(w)) return w;
  const lead = w.match(/^[^\p{L}]*/u)![0];
  const tail = w.match(/[^\p{L}]*$/u)![0];
  const core = w.slice(lead.length, w.length - tail.length);
  const upper = [...core].map((c) => c !== c.toLowerCase());
  const { base, tone } = splitTone(core.toLowerCase());
  const keys = [...base]
    .map((c, i) => {
      const m = MARK[c] ?? c;
      return upper[i] ? m[0].toUpperCase() + m.slice(1) : m;
    })
    .join("");
  return lead + keys + TONE_KEY[tone] + tail;
}

/** cả dòng chữ → chuỗi phím cần gõ */
export const telexKeys = (text: string) => text.split(" ").map(wordKeys).join(" ");

/**
 * Ghép các phím đã gõ của một từ thành chữ (để hiện ra khi bé đang gõ).
 * `toneIdx`: vị trí phím dấu thanh trong cách gõ chuẩn (-1 = không có).
 */
function renderWord(keys: string, toneIdx: number): string {
  let tone: Tone = "ngang";
  let body = keys;
  let tail = "";
  if (toneIdx >= 0 && keys.length > toneIdx) {
    tone = KEY_TONE[keys[toneIdx].toLowerCase()] ?? "ngang";
    body = keys.slice(0, toneIdx);
    tail = keys.slice(toneIdx + 1);
  }
  let out = "";
  for (const ch of body) {
    const prev = out.at(-1) ?? "";
    const pl = prev.toLowerCase();
    const cl = ch.toLowerCase();
    const up = prev !== pl;
    const put = (v: string) => (out = out.slice(0, -1) + (up ? v.toUpperCase() : v));
    if (cl === "w" && pl === "a") put("ă");
    else if (cl === "w" && pl === "o") put("ơ");
    else if (cl === "w" && pl === "u") put("ư");
    else if (cl === pl && cl === "a") put("â");
    else if (cl === pl && cl === "e") put("ê");
    else if (cl === pl && cl === "o") put("ô");
    else if (cl === pl && cl === "d") put("đ");
    else out += ch;
  }
  if (tone !== "ngang") {
    const m = out.match(/^([^\p{L}]*)(.*)$/u)!;
    const core = m[2];
    const cap = core[0] !== core[0]?.toLowerCase();
    const t = addTone(core.toLowerCase(), tone);
    out = m[1] + (cap ? t[0].toUpperCase() + t.slice(1) : t);
  }
  return out + tail;
}

/** vị trí phím dấu thanh trong cách gõ chuẩn của một từ */
function toneIndex(w: string): number {
  const tail = w.match(/[^\p{L}]*$/u)![0];
  if (splitTone(w.toLowerCase()).tone === "ngang") return -1;
  return wordKeys(w).length - tail.length - 1;
}

/**
 * Hiện chữ cho `typedCount` phím đầu của dòng `target` (bé gõ đúng theo cách chuẩn).
 * Dòng không dấu thì trả nguyên chuỗi phím.
 */
export function renderTyped(target: string, typedCount: number): string {
  const words = target.split(" ");
  let left = typedCount;
  const out: string[] = [];
  for (const w of words) {
    if (left <= 0) {
      if (left === 0 && out.length) out.push("");
      break;
    }
    const keys = wordKeys(w);
    const take = keys.slice(0, left);
    out.push(isViet(w) ? renderWord(take, toneIndex(w)) : take);
    left -= keys.length + 1; // +1 cho dấu cách
  }
  return out.join(" ");
}

/** số phím phải gõ cho cả dòng */
export const keyCount = (text: string) => telexKeys(text).length;
