import type { Lesson, Unit } from "@/content/types";
import { balanceBank } from "./q";

/** Hoá học THPT (lớp 10–12): cân bằng phương trình khó. Giao diện Lab neon, Bit dẫn chuyện */

const p01: Lesson = {
  id: "hh-p01",
  title: "Cân bằng phương trình khó",
  short: "Nhiều nguyên tố, nhiều chất, nhóm ngoặc",
  emoji: "🧬",
  cover: "hh-cover-c01",
  minutes: 10,
  slides: [],
  balance: {
    intro: "Phương trình càng nhiều chất thì càng dễ lệch. Mẹo của dân hoá: cân bằng nguyên tố **xuất hiện ở ít chất nhất** trước, nguyên tố **O và H để cuối**. Thử sức nhé!",
    rounds: [
      { eq: "C₂H₆ + O₂ → CO₂ + H₂O", name: "Etan cháy", hint: "C₂H₆ có 6 H nên H₂O cần hệ số 3. Số O sẽ ra số lẻ, nhân đôi tất cả lên.", why: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O. Mỗi vế có 4 C, 12 H, 14 O." },
      { eq: "Al + H₂SO₄ → Al₂(SO₄)₃ + H₂", name: "Nhôm tan trong axit sunfuric", hint: "Nhóm SO₄ đi nguyên khối: vế phải có 3 nhóm SO₄.", why: "2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂. Mỗi vế có 2 Al, 6 H, 3 S, 12 O." },
      { eq: "Fe + HNO₃ → Fe(NO₃)₃ + NO + H₂O", name: "Sắt tan trong axit nitric", hint: "Đếm N và H trước, O để cuối cùng.", why: "Fe + 4HNO₃ → Fe(NO₃)₃ + NO + 2H₂O. Mỗi vế có 1 Fe, 4 H, 4 N, 12 O." },
      { eq: "KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂", name: "Điều chế khí clo", hint: "Mn và K cân bằng ngay. Rồi H (chỉ ở HCl và H₂O) và O (chỉ ở KMnO₄ và H₂O).", why: "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂. Đây là phản ứng oxi hoá – khử, Mn nhận electron còn Cl nhường electron." },
    ],
    remember: "Cân bằng nguyên tố ít chất nhất trước, O và H để cuối. Nhóm nguyên tử như SO₄, NO₃ đếm nguyên khối.",
  },
  practice: [balanceBank("can-bang-kho", ["C₂H₆ + O₂ → CO₂ + H₂O", "Al + H₂SO₄ → Al₂(SO₄)₃ + H₂", "Fe + HNO₃ → Fe(NO₃)₃ + NO + H₂O", "KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂", "C₃H₈ + O₂ → CO₂ + H₂O", "Ca(OH)₂ + H₃PO₄ → Ca₃(PO₄)₂ + H₂O", "Fe₂O₃ + CO → Fe + CO₂", "Al + Fe₃O₄ → Al₂O₃ + Fe"])],
};

export const unitsThpt: Unit[] = [{ id: "hh-thpt-1", title: "Cân bằng phương trình", lessons: [p01] }];
