/**
 * Xử lý tiếng Việt cho môn Tập đọc: tách thanh điệu, tách âm đầu / vần,
 * đánh vần kiểu sách Tiếng Việt 1, đặt tên file âm thanh, so khớp lời bé đọc.
 */

export type Tone = "ngang" | "huyen" | "sac" | "hoi" | "nga" | "nang";

const TONE_MARK: Record<string, Tone> = {
  "̀": "huyen",
  "́": "sac",
  "̉": "hoi",
  "̃": "nga",
  "̣": "nang",
};
const MARK_OF: Record<Tone, string> = { ngang: "", huyen: "̀", sac: "́", hoi: "̉", nga: "̃", nang: "̣" };

export const TONE_NAME: Record<Tone, string> = {
  ngang: "thanh ngang",
  huyen: "thanh huyền",
  sac: "thanh sắc",
  hoi: "thanh hỏi",
  nga: "thanh ngã",
  nang: "thanh nặng",
};
/** đọc tên dấu khi đánh vần: "bờ - a - ba - huyền - bà" */
export const TONE_SAY: Record<Tone, string> = { ngang: "", huyen: "huyền", sac: "sắc", hoi: "hỏi", nga: "ngã", nang: "nặng" };
/** ký hiệu dấu để hiện trên thẻ chữ */
export const TONE_GLYPH: Record<Tone, string> = { ngang: "", huyen: "`", sac: "´", hoi: "ˀ", nga: "~", nang: "." };

/** Bỏ dấu thanh, giữ dấu mũ/râu/trăng. "bàn" -> { base: "ban", tone: "huyen" } */
export function splitTone(syl: string): { base: string; tone: Tone } {
  let tone: Tone = "ngang";
  const base = syl
    .normalize("NFD")
    .replace(/[̣̀́̉̃]/g, (m) => {
      tone = TONE_MARK[m];
      return "";
    })
    .normalize("NFC");
  return { base, tone };
}

const VOWELS = "aăâeêioôơuưy";
/** Đặt dấu thanh vào đúng nguyên âm (kiểu mới: hoà -> hòa vẫn chấp nhận) */
export function addTone(base: string, tone: Tone): string {
  if (tone === "ngang") return base;
  const chars = [...base];
  const lower = base.toLowerCase();
  const vIdx = chars.map((c, i) => (VOWELS.includes(c.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
  // bỏ "u" sau q, "i" sau g khi còn nguyên âm khác
  let cand = vIdx;
  if (lower.startsWith("qu")) cand = cand.filter((i) => i !== 1);
  if (lower.startsWith("gi") && cand.length > 1) cand = cand.filter((i) => i !== 1);
  if (!cand.length) return base;
  let pos: number;
  const ow = cand.find((i) => chars[i].toLowerCase() === "ơ");
  const special = ow ?? cand.find((i) => "ăâêôơư".includes(chars[i].toLowerCase()));
  if (special !== undefined) pos = special;
  else if (cand.length === 1) pos = cand[0];
  else {
    const last = cand[cand.length - 1];
    const endsWithVowel = last === chars.length - 1;
    if (endsWithVowel && cand.length >= 2) pos = cand[cand.length - 2];
    else pos = last;
  }
  chars[pos] = (chars[pos].normalize("NFD") + MARK_OF[tone]).normalize("NFC");
  return chars.join("");
}

export const ONSETS = ["ngh", "ng", "gh", "gi", "kh", "nh", "ph", "th", "tr", "ch", "qu", "b", "c", "d", "đ", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "x"];

/** cách đọc âm đầu khi đánh vần */
export const ONSET_SAY: Record<string, string> = {
  b: "bờ", c: "cờ", d: "dờ", đ: "đờ", g: "gờ", gh: "gờ", h: "hờ", k: "ca", kh: "khờ", l: "lờ", m: "mờ", n: "nờ",
  ng: "ngờ", ngh: "ngờ", nh: "nhờ", p: "pờ", ph: "phờ", qu: "quờ", r: "rờ", s: "sờ", t: "tờ", th: "thờ", tr: "trờ",
  v: "vờ", x: "xờ", ch: "chờ", gi: "di",
};
const VOWEL_SAY: Record<string, string> = { a: "a", ă: "á", â: "ớ", e: "e", ê: "ê", i: "i", o: "o", ô: "ô", ơ: "ơ", u: "u", ư: "ư", y: "i" };
const FINAL_SAY: Record<string, string> = { n: "nờ", m: "mờ", p: "pờ", t: "tờ", c: "cờ", ng: "ngờ", nh: "nhờ", ch: "chờ", i: "i", y: "i", o: "o", u: "u" };
const CLUSTER_SAY: Record<string, string> = { iê: "ia", yê: "ia", uô: "ua", ươ: "ưa" };

/** Tách một tiếng: "nghé" -> { onset: "ngh", rime: "e", tone: "sac" } */
export function parseSyllable(syl: string): { onset: string; rime: string; tone: Tone } {
  const { base, tone } = splitTone(syl.toLowerCase());
  let onset = ONSETS.find((o) => base.startsWith(o) && base.length > o.length) ?? "";
  // "gì", "gìn": gi + i ; "gi" đứng trước nguyên âm khác: gi + vần
  let rime = base.slice(onset.length);
  if (onset === "gi" && rime === "") rime = "i";
  if (onset === "gi" && /^[nmpct]/.test(rime)) rime = "i" + rime;
  if (onset === "" && base.startsWith("gi")) {
    onset = "gi";
    rime = "i";
  }
  return { onset, rime, tone };
}

/** cách đọc một vần đứng riêng, vd. đánh vần "an" = a - nờ - an */
export function spellRime(rime: string): string[] {
  if (rime.length <= 1) return [VOWEL_SAY[rime] ?? rime];
  // vần có âm đệm o/u: oa, oan, uyên...
  if (/^(o[aăe]|u[âêyơ])/.test(rime) && rime.length > 2) return ["o", rime.slice(1), rime].map((x, i) => (i === 0 ? (rime[0] === "o" ? "o" : "u") : x));
  for (const [cl, say] of Object.entries(CLUSTER_SAY)) {
    if (rime.startsWith(cl)) {
      const fin = rime.slice(cl.length);
      return fin ? [say, FINAL_SAY[fin] ?? fin, rime] : [say, rime];
    }
  }
  const v = rime[0];
  const fin = rime.slice(1);
  if (FINAL_SAY[fin] && VOWEL_SAY[v]) return [VOWEL_SAY[v], FINAL_SAY[fin], rime];
  return [rime];
}

/** Đánh vần một tiếng: "bàn" -> ["bờ", "an", "ban", "huyền", "bàn"] */
export function spellSyllable(syl: string): string[] {
  const { onset, rime, tone } = parseSyllable(syl);
  const bare = onset + rime;
  const out: string[] = [];
  if (onset) out.push(ONSET_SAY[onset] ?? onset, rime, bare);
  else out.push(bare);
  if (tone !== "ngang") out.push(TONE_SAY[tone], syl.toLowerCase());
  return out;
}

/** Các mảnh để hiện thẻ ghép chữ: [âm đầu, vần, thanh] */
export function blendParts(syl: string) {
  const { onset, rime, tone } = parseSyllable(syl);
  return { onset, rime, tone, bare: onset + rime, full: syl.toLowerCase() };
}

// ---------- tên file âm thanh ----------

const TELEX: Record<string, string> = { â: "aa", ă: "aw", ê: "ee", ô: "oo", ơ: "ow", ư: "uw", đ: "dd" };
const TONE_TELEX: Record<Tone, string> = { ngang: "", huyen: "f", sac: "s", hoi: "r", nga: "x", nang: "j" };

/** "cái bàn" -> "cais_banf" (gõ kiểu Telex, mỗi tiếng một khúc) */
export function telexId(text: string): string {
  return words(text)
    .map((w) => {
      const { base, tone } = splitTone(w);
      return [...base].map((c) => TELEX[c] ?? c).join("") + TONE_TELEX[tone];
    })
    .join("_")
    .replace(/[^a-z0-9_]/g, "");
}

/** id file giọng đọc mẫu của một chữ/tiếng/câu: public/assets/voice/tv-<telex>.mp3 */
export function voiceIdFor(text: string): string {
  const id = telexId(text);
  if (id.length <= 60) return `tv-${id}`;
  // câu dài: lấy 6 tiếng đầu + mã băm ngắn
  let h = 0;
  for (const c of text) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  return `tv-${id.split("_").slice(0, 6).join("_")}-${h.toString(36).slice(0, 5)}`;
}

// ---------- so khớp lời đọc ----------

const DIGITS: Record<string, string> = { "0": "không", "1": "một", "2": "hai", "3": "ba", "4": "bốn", "5": "năm", "6": "sáu", "7": "bảy", "8": "tám", "9": "chín", "10": "mười" };

/** tách tiếng, bỏ dấu câu, chữ thường */
export function words(text: string): string[] {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[.,!?;:"“”‘’'()«»…\-–—]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((w) => (DIGITS[w] ? DIGITS[w].split(" ") : [w]))
    .map(normTone);
}

/** gom cách bỏ dấu cũ/mới: hoà = hòa, thuý = thúy */
function normTone(w: string) {
  const { base, tone } = splitTone(w);
  return addTone(base, tone);
}

export type SylMark = "ok" | "tone" | "miss";

export interface ReadResult {
  marks: SylMark[];
  /** 0..1 */
  score: number;
  heard: string;
  pass: boolean;
}

/**
 * So lời nghe được với chữ cần đọc. Gióng hàng theo tiếng (Levenshtein),
 * mỗi tiếng: đúng / sai thanh / thiếu-sai.
 * strict=false (đọc âm, vần đơn lẻ): sai thanh vẫn tính đạt.
 */
export function compareReading(expected: string, heardAlts: string[], strict = true): ReadResult {
  const exp = words(expected);
  let best: ReadResult = { marks: exp.map(() => "miss"), score: 0, heard: heardAlts[0] ?? "", pass: false };
  for (const alt of heardAlts) {
    const got = words(alt);
    const marks = align(exp, got);
    const score = marks.reduce((a, m) => a + (m === "ok" ? 1 : m === "tone" ? 0.5 : 0), 0) / Math.max(1, exp.length);
    const okish = marks.filter((m) => m === "ok" || (!strict && m === "tone")).length / Math.max(1, exp.length);
    const pass = exp.length === 1 ? okish === 1 : okish >= 0.8;
    const r = { marks, score, heard: alt, pass };
    if (r.score > best.score || (r.pass && !best.pass)) best = r;
  }
  return best;
}

function align(exp: string[], got: string[]): SylMark[] {
  const n = exp.length;
  const m = got.length;
  const cost = (a: string, b: string) => (a === b ? 0 : splitTone(a).base === splitTone(b).base ? 0.5 : 1);
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost(exp[i - 1], got[j - 1]));
  const marks: SylMark[] = Array(n).fill("miss");
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    const c = cost(exp[i - 1], got[j - 1]);
    if (d[i][j] === d[i - 1][j - 1] + c) {
      marks[i - 1] = c === 0 ? "ok" : c === 0.5 ? "tone" : "miss";
      i--;
      j--;
    } else if (d[i][j] === d[i - 1][j] + 1) i--;
    else j--;
  }
  return marks;
}
