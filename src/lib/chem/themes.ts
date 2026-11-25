/**
 * Giao diện phòng thí nghiệm của môn Hoá. Mỗi trình độ mở thêm một giao diện, bé tự chọn lại được.
 *   Nhí: Phòng lab nắng · KHTN: Xưởng giả kim · THCS: Lab neon · THPT: Viện phân tử
 * Cảnh nền vẽ bằng code (components/lab/LabScene.tsx); có ảnh `bg-hh-<id>` thì dùng ảnh.
 */

export type LabThemeId = "nang" | "giakim" | "neon" | "phantu";

export interface LabTheme {
  id: LabThemeId;
  name: string;
  desc: string;
  /** khi làm sai thì trông thế nào */
  fail: string;
  /** trình độ mở khóa */
  tier: string;
  dark: boolean;
  /** màu phản chiếu trên thành kính (cửa sổ, đèn) */
  env: string;
  vars: {
    panel: string;
    text: string;
    soft: string;
    line: string;
    accent: string;
    accentInk: string;
    chip: string;
  };
  /** chữ viết tay trong sổ (giả kim) */
  hand?: boolean;
  mascot: "mochi" | "bit";
}

export const LAB_THEMES: Record<LabThemeId, LabTheme> = {
  nang: {
    id: "nang",
    name: "Phòng lab nắng",
    desc: "Gỗ ấm, cây xanh, đồ bếp quen thuộc",
    fail: "Làm sai: bọt trào, bột màu bắn",
    tier: "nhi",
    dark: false,
    env: "#ffe9a8",
    vars: { panel: "rgba(255,255,255,.93)", text: "#252845", soft: "#5d6283", line: "#e6dcef", accent: "#4f72ff", accentInk: "#ffffff", chip: "#ffffff" },
    mascot: "mochi",
  },
  giakim: {
    id: "giakim",
    name: "Xưởng giả kim",
    desc: "Đồng thau, nến, bình cổ cong, sách da",
    fail: "Làm sai: khói tím cuộn, tia lửa vàng",
    tier: "khtn",
    dark: true,
    env: "#ffcf6a",
    vars: { panel: "rgba(243,226,191,.96)", text: "#3d2512", soft: "#7a5a2e", line: "#a7773f", accent: "#e0a84a", accentInk: "#2c1a0e", chip: "#3d2512" },
    hand: true,
    mascot: "mochi",
  },
  neon: {
    id: "neon",
    name: "Lab neon",
    desc: "Phòng tối, ánh cyan, đồng hồ đo kiểu HUD",
    fail: "Làm sai: nổ neon, màn hình nhiễu",
    tier: "thcs",
    dark: true,
    env: "#2fd3ff",
    vars: { panel: "rgba(10,16,51,.94)", text: "#e8ecff", soft: "#9aa6d8", line: "#2a3a85", accent: "#2fd3ff", accentInk: "#061032", chip: "#141d4d" },
    mascot: "bit",
  },
  phantu: {
    id: "phantu",
    name: "Viện phân tử",
    desc: "Trắng kính, mô hình phân tử, số liệu chính xác",
    fail: "Làm sai: còi báo động, phân tử vỡ tung",
    tier: "thpt",
    dark: false,
    env: "#bfe0ff",
    vars: { panel: "rgba(255,255,255,.95)", text: "#16233f", soft: "#5a6b8c", line: "#c9d8f2", accent: "#3a7bff", accentInk: "#ffffff", chip: "#ffffff" },
    mascot: "bit",
  },
};

export const THEME_ORDER: LabThemeId[] = ["nang", "giakim", "neon", "phantu"];
const BY_TIER: Record<string, LabThemeId> = { nhi: "nang", khtn: "giakim", thcs: "neon", thpt: "phantu" };
export const themeForTier = (tierId: string): LabThemeId => BY_TIER[tierId] ?? "nang";

export function pickTheme(chosen: string | null, lessonTier: string, open: (tierId: string) => boolean): LabThemeId {
  if (chosen && chosen in LAB_THEMES && open(LAB_THEMES[chosen as LabThemeId].tier)) return chosen as LabThemeId;
  return themeForTier(lessonTier);
}

const KEY = "hocvui:hh-theme";
const FX = "hocvui:hh-calm";
export function loadThemeChoice(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
export function saveThemeChoice(id: LabThemeId | null) {
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
  } catch {
    /* bỏ qua */
  }
}
/** giảm hiệu ứng: không rung, không chớp (cho bé nhạy cảm ánh sáng) */
export function loadCalm(): boolean {
  try {
    if (localStorage.getItem(FX) === "1") return true;
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
export function saveCalm(on: boolean) {
  try {
    if (on) localStorage.setItem(FX, "1");
    else localStorage.removeItem(FX);
  } catch {
    /* bỏ qua */
  }
}
