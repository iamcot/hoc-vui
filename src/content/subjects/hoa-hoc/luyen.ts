import type { Lesson, Question, QuestionGen, Slide } from "@/content/types";
import type { Rng } from "@/lib/rng";
import { parseFormula } from "@/lib/chem/balance";
import { balanceBank, bank } from "./q";

/**
 * Các node luyện tập "vấn đề hay gặp" của Hoá THCS: mỗi node có một thẻ Nhớ nhanh (công thức) rồi luyện bằng đề sinh ngẫu nhiên.
 * Khối lượng nguyên tử làm tròn như SGK: H=1, C=12, N=14, O=16, Na=23, Mg=24, Al=27, S=32, Cl=35,5, K=39, Ca=40, Fe=56, Cu=64, Zn=65, Ag=108.
 * Thể tích mol khí ở điều kiện chuẩn (25°C, 1 bar): 24,79 L.
 */

const AR: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 64, Zn: 65, Ag: 108 };
export const molarMass = (f: string) => Object.entries(parseFormula(f)).reduce((s, [e, n]) => s + AR[e] * n, 0);
const VM = 24.79;
const fmt = (x: number) => String(Math.round(x * 1000) / 1000);
const vn = (x: number) => fmt(x).replace(".", ",");

let n = 0;
const num = (topic: string, prompt: string, answer: number, opts: { unit?: string; tolerance?: number; hint?: string; explain?: string } = {}): Question => ({
  id: `hh-${topic}-${n++}`,
  prompt,
  kind: "number",
  answer: fmt(answer),
  tolerance: opts.tolerance ?? Math.max(0.01, Math.abs(answer) * 0.005),
  unit: opts.unit,
  hint: opts.hint,
  explain: opts.explain,
  topic,
});
const choice = (topic: string, prompt: string, right: string, wrong: string[], rng: Rng, explain?: string, hint?: string): Question => ({
  id: `hh-${topic}-${n++}`,
  prompt,
  kind: "choice",
  answer: right,
  choices: rng.shuffle([right, ...wrong]),
  explain,
  hint,
  topic,
});

const SUBST = ["NaCl", "H₂O", "CO₂", "CaCO₃", "NaOH", "H₂SO₄", "Fe", "O₂", "HCl", "MgO", "Zn", "Al", "CuSO₄", "KOH"];
const MOLES = [0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 3];
const GAS = ["H₂", "O₂", "CO₂", "N₂", "CH₄"];

/** ── Lớp 8: mol và khối lượng ── */
const molQ: QuestionGen = (rng) => {
  const kind = rng.int(0, 4);
  const f = rng.pick(SUBST);
  const M = molarMass(f);
  const nn = rng.pick(MOLES);
  const m = nn * M;
  if (kind === 0) return choice("mol", `Khối lượng mol của ${f} là bao nhiêu (g/mol)?`, fmt(M), [fmt(M + 2), fmt(M * 2), fmt(M - 4 > 0 ? M - 4 : M + 6)].filter((x, i, a) => a.indexOf(x) === i && x !== fmt(M)), rng, `M(${f}) = cộng khối lượng các nguyên tử: ${fmt(M)} g/mol.`, "Cộng khối lượng nguyên tử của mọi nguyên tử trong công thức.");
  if (kind === 1) return num("mol", `${vn(m)} g ${f} (M = ${vn(M)} g/mol) có bao nhiêu mol?`, nn, { unit: "mol", hint: "n = m : M", explain: `n = ${vn(m)} : ${vn(M)} = ${vn(nn)} mol.` });
  if (kind === 2) return num("mol", `${vn(nn)} mol ${f} (M = ${vn(M)} g/mol) nặng bao nhiêu gam?`, m, { unit: "g", hint: "m = n × M", explain: `m = ${vn(nn)} × ${vn(M)} = ${vn(m)} g.` });
  const g = rng.pick(GAS);
  if (kind === 3) return num("mol", `${vn(nn)} mol khí ${g} ở điều kiện chuẩn (1 mol khí = 24,79 L) chiếm thể tích bao nhiêu lít?`, nn * VM, { unit: "L", hint: "V = n × 24,79", explain: `V = ${vn(nn)} × 24,79 = ${vn(nn * VM)} L.` });
  return num("mol", `${vn(nn * VM)} L khí ${g} ở điều kiện chuẩn (24,79 L/mol) có bao nhiêu mol?`, nn, { unit: "mol", hint: "n = V : 24,79", explain: `n = ${vn(nn * VM)} : 24,79 = ${vn(nn)} mol.` });
};

/** ── Lớp 8: nồng độ dung dịch ── */
const concQ: QuestionGen = (rng) => {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const ct = rng.pick([5, 10, 15, 20, 25, 30]);
    const dm = rng.pick([40, 90, 80, 70, 100, 120]);
    const dd = ct + dm;
    return num("nong-do", `Hoà tan ${ct} g muối vào ${dm} g nước. Nồng độ phần trăm (C%) của dung dịch là bao nhiêu %?`, (ct / dd) * 100, { unit: "%", tolerance: 0.1, hint: "mdd = mct + mdm; C% = mct : mdd × 100", explain: `mdd = ${ct} + ${dm} = ${dd} g; C% = ${ct} : ${dd} × 100 = ${vn((ct / dd) * 100)}%.` });
  }
  if (kind === 1) {
    const dd = rng.pick([50, 100, 200, 250, 400, 500]);
    const c = rng.pick([5, 10, 15, 20, 25]);
    return num("nong-do", `Cần bao nhiêu gam chất tan để pha ${dd} g dung dịch có nồng độ ${c}%?`, (dd * c) / 100, { unit: "g", tolerance: 0.01, hint: "mct = C% × mdd : 100", explain: `mct = ${c} × ${dd} : 100 = ${vn((dd * c) / 100)} g.` });
  }
  if (kind === 2) {
    const f = rng.pick(["NaOH", "NaCl", "KOH", "HCl"]);
    const nn = rng.pick([0.1, 0.2, 0.25, 0.5, 1, 2]);
    const V = rng.pick([0.1, 0.2, 0.25, 0.5, 1, 2]);
    return num("nong-do", `Hoà tan ${vn(nn)} mol ${f} vào nước thành ${vn(V)} lít dung dịch. Nồng độ mol (CM) là bao nhiêu mol/L?`, nn / V, { unit: "mol/L", tolerance: 0.01, hint: "CM = n : V (V tính bằng lít)", explain: `CM = ${vn(nn)} : ${vn(V)} = ${vn(nn / V)} mol/L.` });
  }
  const cm = rng.pick([0.1, 0.2, 0.5, 1, 2]);
  const V = rng.pick([0.1, 0.25, 0.5, 1, 2]);
  return num("nong-do", `Trong ${vn(V)} lít dung dịch NaCl ${vn(cm)} M có bao nhiêu mol NaCl?`, cm * V, { unit: "mol", tolerance: 0.005, hint: "n = CM × V", explain: `n = ${vn(cm)} × ${vn(V)} = ${vn(cm * V)} mol.` });
};

/** ── Lớp 8: bảo toàn khối lượng ── */
const conservQ: QuestionGen = (rng) => {
  const a = rng.int(2, 20) * 2;
  const b = rng.int(2, 15) * 2;
  const c = rng.int(1, 8) * 2;
  const form = rng.int(0, 2);
  if (form === 0) return num("bao-toan", `Phản ứng: A + B → C + D. Biết mA = ${a} g, mB = ${b} g, mC = ${c} g. Khối lượng D là bao nhiêu gam?`, a + b - c, { unit: "g", hint: "Tổng khối lượng chất tham gia = tổng khối lượng sản phẩm", explain: `mD = ${a} + ${b} − ${c} = ${a + b - c} g.` });
  if (form === 1) return num("bao-toan", `Đốt ${a} g magie trong oxi, thu được ${a + b} g magie oxit. Khối lượng oxi đã phản ứng là bao nhiêu gam?`, b, { unit: "g", hint: "m magie + m oxi = m magie oxit", explain: `m oxi = ${a + b} − ${a} = ${b} g.` });
  return num("bao-toan", `Nung ${a + b} g đá vôi, thu được ${a} g vôi sống và khí CO₂. Khối lượng CO₂ là bao nhiêu gam?`, b, { unit: "g", hint: "m đá vôi = m vôi sống + m CO₂", explain: `m CO₂ = ${a + b} − ${a} = ${b} g.` });
};

/** ── Lớp 8: phân loại hợp chất vô cơ ── */
const CLASSES = ["Oxit axit", "Oxit bazơ", "Axit", "Bazơ", "Muối"];
const COMPOUNDS: [string, string][] = [
  ["CO₂", "Oxit axit"], ["SO₂", "Oxit axit"], ["P₂O₅", "Oxit axit"], ["SO₃", "Oxit axit"],
  ["CaO", "Oxit bazơ"], ["Na₂O", "Oxit bazơ"], ["Fe₂O₃", "Oxit bazơ"], ["CuO", "Oxit bazơ"], ["MgO", "Oxit bazơ"],
  ["HCl", "Axit"], ["H₂SO₄", "Axit"], ["HNO₃", "Axit"], ["H₃PO₄", "Axit"],
  ["NaOH", "Bazơ"], ["Ca(OH)₂", "Bazơ"], ["KOH", "Bazơ"], ["Cu(OH)₂", "Bazơ"], ["Fe(OH)₃", "Bazơ"],
  ["NaCl", "Muối"], ["CaCO₃", "Muối"], ["CuSO₄", "Muối"], ["KNO₃", "Muối"], ["Na₂SO₄", "Muối"], ["FeCl₃", "Muối"],
];
const classQ: QuestionGen = (rng) => {
  const [f, c] = rng.pick(COMPOUNDS);
  const why: Record<string, string> = {
    "Oxit axit": "Oxit của phi kim (và thường tạo axit khi tan trong nước).",
    "Oxit bazơ": "Oxit của kim loại (và thường tạo bazơ khi tan trong nước).",
    Axit: "Phân tử có nguyên tử H liên kết với gốc axit.",
    Bazơ: "Kim loại liên kết với nhóm hiđroxit –OH.",
    Muối: "Kim loại (hoặc NH₄) liên kết với gốc axit.",
  };
  return choice("phan-loai", `${f} thuộc loại hợp chất nào?`, c, CLASSES.filter((x) => x !== c), rng, `${f}: ${why[c]}`, "Nhìn nguyên tố đứng đầu và nhóm –OH, gốc axit.");
};

/** ── Lớp 9: dãy hoạt động hoá học của kim loại ── */
const SERIES = ["K", "Na", "Mg", "Al", "Zn", "Fe", "Pb", "H", "Cu", "Ag", "Au"];
const NAME: Record<string, string> = { K: "Kali", Na: "Natri", Mg: "Magie", Al: "Nhôm", Zn: "Kẽm", Fe: "Sắt", Pb: "Chì", Cu: "Đồng", Ag: "Bạc", Au: "Vàng" };
const SALT: Record<string, string> = { Mg: "MgSO₄", Al: "Al₂(SO₄)₃", Zn: "ZnSO₄", Fe: "FeSO₄", Pb: "Pb(NO₃)₂", Cu: "CuSO₄", Ag: "AgNO₃" };
const displaceQ: QuestionGen = (rng) => {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    // kim loại A vào muối của B (không dùng K, Na vì chúng phản ứng với nước trước)
    const pool = ["Mg", "Al", "Zn", "Fe", "Pb", "Cu", "Ag"];
    const [a, b] = rng.shuffle(pool).slice(0, 2);
    const ok = SERIES.indexOf(a) < SERIES.indexOf(b);
    return choice("day-hoat-dong", `Cho ${NAME[a]} vào dung dịch ${SALT[b]}. Có phản ứng xảy ra không?`, ok ? "Có" : "Không", [ok ? "Không" : "Có"], rng, ok ? `${NAME[a]} đứng trước ${NAME[b]} trong dãy hoạt động nên đẩy được ${NAME[b]} ra khỏi muối.` : `${NAME[a]} đứng sau ${NAME[b]} nên không đẩy được ${NAME[b]} ra khỏi muối.`, "Kim loại đứng trước đẩy được kim loại đứng sau ra khỏi dung dịch muối.");
  }
  if (kind === 1) {
    const m = rng.pick(["Mg", "Al", "Zn", "Fe", "Pb", "Cu", "Ag", "Au"]);
    const ok = SERIES.indexOf(m) < SERIES.indexOf("H");
    return choice("day-hoat-dong", `Cho ${NAME[m]} vào dung dịch axit HCl loãng. Có khí H₂ thoát ra không?`, ok ? "Có" : "Không", [ok ? "Không" : "Có"], rng, ok ? `${NAME[m]} đứng trước H trong dãy hoạt động nên đẩy được H₂ ra khỏi axit.` : `${NAME[m]} đứng sau H nên không tác dụng với HCl loãng.`, "Chỉ kim loại đứng trước H mới đẩy được hiđro.");
  }
  const [a, b, c] = rng.shuffle(["Mg", "Al", "Zn", "Fe", "Cu", "Ag"]).slice(0, 3);
  const sorted = [a, b, c].sort((x, y) => SERIES.indexOf(x) - SERIES.indexOf(y));
  return choice("day-hoat-dong", `Trong ba kim loại ${NAME[a]}, ${NAME[b]}, ${NAME[c]}, kim loại hoạt động hoá học mạnh nhất là`, NAME[sorted[0]], [NAME[sorted[1]], NAME[sorted[2]]], rng, `Dãy hoạt động: K, Na, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au. ${NAME[sorted[0]]} đứng đầu.`);
};

/** ── Lớp 9: tính theo phương trình hoá học ── */
const stoichQ: QuestionGen = (rng) => {
  const nn = rng.pick([0.1, 0.2, 0.25, 0.5, 1, 2]);
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const [metal, k, eq] = rng.pick<[string, number, string]>([["Zn", 1, "Zn + 2HCl → ZnCl₂ + H₂"], ["Mg", 1, "Mg + 2HCl → MgCl₂ + H₂"], ["Fe", 1, "Fe + 2HCl → FeCl₂ + H₂"], ["Al", 1.5, "2Al + 6HCl → 2AlCl₃ + 3H₂"]]);
    const m = nn * molarMass(metal);
    return num("tinh-pthh", `Cho ${vn(m)} g ${metal} tác dụng hết với dung dịch HCl dư (${eq}). Thể tích khí H₂ thu được ở điều kiện chuẩn là bao nhiêu lít? (1 mol khí = 24,79 L)`, nn * k * VM, { unit: "L", tolerance: 0.05, hint: "Tính n kim loại, đổi sang n H₂ theo hệ số, rồi nhân 24,79", explain: `n ${metal} = ${vn(m)} : ${vn(molarMass(metal))} = ${vn(nn)} mol; n H₂ = ${vn(nn * k)} mol; V = ${vn(nn * k)} × 24,79 = ${vn(nn * k * VM)} L.` });
  }
  if (kind === 1) {
    const m = nn * molarMass("Mg");
    return num("tinh-pthh", `Đốt cháy hoàn toàn ${vn(m)} g magie trong oxi (2Mg + O₂ → 2MgO). Khối lượng magie oxit (MgO, M = 40 g/mol) thu được là bao nhiêu gam?`, nn * molarMass("MgO"), { unit: "g", tolerance: 0.01, hint: "2 mol Mg cho 2 mol MgO: n MgO = n Mg", explain: `n Mg = ${vn(nn)} mol = n MgO; m MgO = ${vn(nn)} × 40 = ${vn(nn * 40)} g.` });
  }
  if (kind === 2) {
    const m = nn * molarMass("CaCO₃");
    return num("tinh-pthh", `Cho ${vn(m)} g CaCO₃ tác dụng hết với HCl dư (CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂). Thể tích CO₂ ở điều kiện chuẩn là bao nhiêu lít? (1 mol khí = 24,79 L)`, nn * VM, { unit: "L", tolerance: 0.05, hint: "1 mol CaCO₃ cho 1 mol CO₂", explain: `n CaCO₃ = ${vn(m)} : 100 = ${vn(nn)} mol = n CO₂; V = ${vn(nn)} × 24,79 = ${vn(nn * VM)} L.` });
  }
  const m = nn * molarMass("NaOH");
  return num("tinh-pthh", `Trung hoà hết ${vn(m)} g NaOH bằng dung dịch HCl (NaOH + HCl → NaCl + H₂O). Cần bao nhiêu mol HCl?`, nn, { unit: "mol", tolerance: 0.005, hint: "Tỉ lệ NaOH : HCl là 1 : 1", explain: `n NaOH = ${vn(m)} : 40 = ${vn(nn)} mol = n HCl.` });
};

const slide = (title: string, lines: string[], tip?: string): Slide => ({
  title,
  mood: "think",
  blocks: [...lines.map((text) => ({ type: "text" as const, text })), ...(tip ? [{ type: "tip" as const, text: tip }] : [])],
});

const node = (id: string, title: string, short: string, emoji: string, cover: string, slides: Slide[], practice: QuestionGen[]): Lesson => ({ id, title, short, emoji, cover, minutes: 8, slides, practice });

/* ───── Lớp 8 ───── */
export const l8Mol = node("hh-l8-mol", "Mol và khối lượng", "Luyện tập: n = m : M, thể tích khí 24,79 L", "⚖️", "hh-cover-l8-mol", [
  slide("Nhớ nhanh về mol", ["**1 mol** là một nhóm rất nhiều hạt (6,02 × 10²³ hạt). **M** là khối lượng của 1 mol, tính bằng g/mol.", "**n = m : M**, suy ra **m = n × M**.", "Chất khí ở điều kiện chuẩn: **V = n × 24,79** (lít)."], "Khối lượng mol của hợp chất = tổng khối lượng nguyên tử. Ví dụ H₂O: 2 × 1 + 16 = 18 g/mol."),
], [molQ]);

export const l8Conc = node("hh-l8-nd", "Nồng độ dung dịch", "Luyện tập: C%, CM, khối lượng chất tan", "🧪", "hh-cover-l8-nd", [
  slide("Nhớ nhanh về nồng độ", ["**C% = mct : mdd × 100**, trong đó mdd = mct + mdm (chất tan + dung môi).", "**CM = n : V** (n tính bằng mol, V tính bằng lít).", "Hay nhầm: đổi **mL ra lít** (chia 1000) trước khi tính CM."]),
], [concQ]);

export const l8Conserve = node("hh-l8-btkl", "Bảo toàn khối lượng", "Luyện tập: Tổng chất tham gia = tổng sản phẩm", "🧱", "hh-cover-l8-btkl", [
  slide("Định luật bảo toàn khối lượng", ["Trong phản ứng hoá học, **tổng khối lượng chất tham gia bằng tổng khối lượng sản phẩm**.", "A + B → C + D thì **mA + mB = mC + mD**.", "Nhờ đó, biết ba chất là tính được chất còn lại, kể cả chất khí bay mất."]),
], [conservQ]);

export const l8Class = node("hh-l8-loai", "Phân loại hợp chất", "Luyện tập: oxit, axit, bazơ, muối", "🗂️", "hh-cover-l8-loai", [
  slide("Bốn loại hợp chất vô cơ", ["**Oxit**: nguyên tố + oxi. Oxit của phi kim là **oxit axit** (CO₂, SO₂), oxit của kim loại là **oxit bazơ** (CaO, Fe₂O₃).", "**Axit**: có H đứng đầu (HCl, H₂SO₄).", "**Bazơ**: kim loại + nhóm –OH (NaOH, Ca(OH)₂).", "**Muối**: kim loại + gốc axit (NaCl, CuSO₄)."]),
], [classQ, bank("ph", [
  { prompt: "Dung dịch có pH nhỏ hơn 7 làm quỳ tím chuyển sang màu", choices: ["Đỏ", "Xanh", "Không đổi màu", "Vàng"] },
  { prompt: "Dung dịch có pH lớn hơn 7 làm quỳ tím chuyển sang màu", choices: ["Xanh", "Đỏ", "Không đổi màu", "Vàng"] },
  { prompt: "Phenolphtalein chuyển sang màu hồng trong môi trường", choices: ["Bazơ", "Axit", "Trung tính", "Nước cất"] },
  { prompt: "Dung dịch nào có tính axit mạnh nhất?", choices: ["pH = 1", "pH = 5", "pH = 7", "pH = 9"], explain: "pH càng nhỏ, axit càng mạnh." },
  { prompt: "Phản ứng giữa axit và bazơ tạo muối và nước gọi là phản ứng", choices: ["Trung hoà", "Phân huỷ", "Hoá hợp", "Oxi hoá"] },
])]);

/* ───── Lớp 9 ───── */
export const l9Series = node("hh-l9-dayhd", "Dãy hoạt động kim loại", "Luyện tập: Kim loại nào đẩy được kim loại nào", "🔗", "hh-cover-l9-dayhd", [
  slide("Dãy hoạt động hoá học", ["**K, Na, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au**: mạnh dần về phía trái.", "Kim loại **đứng trước** đẩy được kim loại **đứng sau** ra khỏi dung dịch muối.", "Kim loại **đứng trước H** đẩy được H₂ ra khỏi axit loãng (HCl, H₂SO₄ loãng)."], "Mẹo nhớ: Không Nên Mang Áo Zàng Phải Hôm Cuối Tuần Ăn Uống (K, Na, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au)."),
], [displaceQ]);

export const l9Stoich = node("hh-l9-pthh", "Tính theo PTHH", "Luyện tập: Từ khối lượng ra thể tích khí, khối lượng sản phẩm", "🧮", "hh-cover-l9-pthh", [
  slide("Ba bước tính theo phương trình", ["**1.** Tính số mol chất đã biết (n = m : M).", "**2.** Dùng **hệ số** của phương trình để suy ra số mol chất cần tìm.", "**3.** Đổi về khối lượng (m = n × M) hoặc thể tích khí (V = n × 24,79)."], "Hay nhầm: quên cân bằng phương trình trước khi lấy tỉ lệ hệ số."),
], [stoichQ, balanceBank("can-bang-l9", ["Zn + HCl → ZnCl₂ + H₂", "Mg + O₂ → MgO", "CaCO₃ + HCl → CaCl₂ + H₂O + CO₂", "Al + O₂ → Al₂O₃", "Fe + Cl₂ → FeCl₃", "Cu + O₂ → CuO"])]);

export const l9Organic = node("hh-l9-hcht", "Hữu cơ cơ bản", "Luyện tập: Metan, etilen, rượu etylic, axit axetic", "🧬", "hh-cover-l9-hcht", [
  slide("Bốn chất hữu cơ quen thuộc", ["**Metan CH₄**: khí gas tự nhiên, cháy tạo CO₂ và H₂O.", "**Etilen C₂H₄**: có liên kết đôi, làm mất màu dung dịch brom, làm chín trái cây.", "**Rượu etylic C₂H₅OH**: cồn, tan vô hạn trong nước.", "**Axit axetic CH₃COOH**: có trong giấm ăn, làm quỳ tím hoá đỏ nhẹ."]),
], [bank("huu-co", [
  { prompt: "Khí chính trong khí thiên nhiên và khí biogas là", choices: ["Metan CH₄", "Etilen C₂H₄", "Axetilen C₂H₂", "Hiđro H₂"] },
  { prompt: "Chất làm mất màu dung dịch brom là", choices: ["Etilen C₂H₄", "Metan CH₄", "Etan C₂H₆", "Khí CO₂"], explain: "Etilen có liên kết đôi nên cộng được với brom." },
  { prompt: "Giấm ăn chứa chất nào?", choices: ["Axit axetic", "Rượu etylic", "Glucozơ", "Muối ăn"] },
  { prompt: "Công thức hoá học của rượu etylic là", choices: ["C₂H₅OH", "CH₃COOH", "C₂H₄", "CH₄"] },
  { prompt: "Sản phẩm khi đốt cháy hoàn toàn metan là", choices: ["CO₂ và H₂O", "CO và H₂", "C và H₂O", "CO₂ và H₂"] },
  { prompt: "Chất nào sau đây là hiđrocacbon (chỉ gồm C và H)?", choices: ["CH₄", "C₂H₅OH", "CH₃COOH", "CO₂"], explain: "Hiđrocacbon chỉ có hai nguyên tố C và H." },
  { prompt: "Chất nào được dùng làm nhiên liệu cồn và sát khuẩn?", choices: ["Rượu etylic", "Axit axetic", "Metan", "Etilen"] },
]), balanceBank("huu-co-chay", ["CH₄ + O₂ → CO₂ + H₂O", "C₂H₄ + O₂ → CO₂ + H₂O", "C₂H₅OH + O₂ → CO₂ + H₂O", "C₂H₆ + O₂ → CO₂ + H₂O"])]);
