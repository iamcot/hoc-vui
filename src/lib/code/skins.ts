/**
 * Giao diện (theme) của môn Lập trình. Mỗi trình độ có một giao diện mặc định,
 * lên trình độ mới thì mở khóa thêm giao diện để bé tự chọn trong bài.
 *   Vỡ lòng: Pixel · Cơ bản: Xưởng robot · Trung cấp: mở thêm Neon · Nâng cao, Python: Hologram
 */

export type SkinId = "pixel" | "robot" | "neon" | "holo";

/** màu khối: [chính, phụ, viền] */
type Trio = [string, string, string];

export interface Skin {
  id: SkinId;
  name: string;
  desc: string;
  /** trình độ mở khóa giao diện này */
  tier: string;
  /** nền tối (dùng chung lớp theme-cyber cho thẻ, chữ) */
  dark: boolean;
  blockly: {
    renderer: "zelos" | "thrasos";
    font: { family: string; size: number; weight: string };
    styles: { event: Trio; move: Trio; turn: Trio; loop: Trio; logic: Trio };
    bg: string;
    flyout: string;
    flyoutOpacity: number;
    accent: string;
  };
}

export const SKINS: Record<SkinId, Skin> = {
  pixel: {
    id: "pixel",
    name: "Pixel arcade",
    desc: "Game 8-bit, chữ pixel",
    tier: "vo-long",
    dark: true,
    blockly: {
      renderer: "thrasos",
      font: { family: "var(--font-pixel), ui-monospace, monospace", size: 19, weight: "400" },
      styles: {
        event: ["#ffa300", "#ffcc66", "#000000"],
        move: ["#29adff", "#80d0ff", "#000000"],
        turn: ["#ff77a8", "#ffb0cc", "#000000"],
        loop: ["#00b46a", "#00e436", "#000000"],
        logic: ["#ff004d", "#ff6b8f", "#000000"],
      },
      bg: "#120a24",
      flyout: "#1d1033",
      flyoutOpacity: 1,
      accent: "#ffec27",
    },
  },
  robot: {
    id: "robot",
    name: "Xưởng robot",
    desc: "Khối nổi 3D, sáng sủa",
    tier: "co-ban",
    dark: false,
    blockly: {
      renderer: "zelos",
      font: { family: "var(--font-baloo), ui-rounded, system-ui, sans-serif", size: 15, weight: "800" },
      styles: {
        event: ["#ff9f43", "#ffc48a", "#d97a1f"],
        move: ["#5b7cff", "#93a8ff", "#3a55cc"],
        turn: ["#a66bff", "#c9a4ff", "#7d44d6"],
        loop: ["#2fd9a0", "#86ecc8", "#1ca57a"],
        logic: ["#ff5a7a", "#ff9bb0", "#d93a5a"],
      },
      bg: "#ffffff",
      flyout: "#eef2ff",
      flyoutOpacity: 1,
      accent: "#5b7cff",
    },
  },
  neon: {
    id: "neon",
    name: "Neon",
    desc: "Bảng mạch tối, khối phát sáng",
    tier: "trung-cap",
    dark: true,
    blockly: {
      renderer: "zelos",
      font: { family: "var(--font-nunito), ui-rounded, system-ui, sans-serif", size: 14, weight: "800" },
      styles: {
        event: ["#ffb020", "#ffd27a", "#ffe6a8"],
        move: ["#1a8cff", "#5fb2ff", "#2fd3ff"],
        turn: ["#7c4dff", "#a587ff", "#c9b5ff"],
        loop: ["#00c08b", "#43e0b0", "#7dffd9"],
        logic: ["#ff3d8f", "#ff7ab2", "#ffb3d3"],
      },
      bg: "#060d2e",
      flyout: "#0b1648",
      flyoutOpacity: 1,
      accent: "#2fd3ff",
    },
  },
  holo: {
    id: "holo",
    name: "Hologram",
    desc: "Sân 3D, kính trong, HUD",
    tier: "nang-cao",
    dark: true,
    blockly: {
      renderer: "zelos",
      font: { family: "var(--font-grotesk), system-ui, sans-serif", size: 14, weight: "500" },
      styles: {
        event: ["#ffb547", "#ffd79b", "#ffcf87"],
        move: ["#4ff0ff", "#9ff7ff", "#9ff7ff"],
        turn: ["#b28cff", "#dccbff", "#d4c0ff"],
        loop: ["#7dffb0", "#c9ffe0", "#b5ffd2"],
        logic: ["#ff5fa8", "#ffa8d0", "#ffb8d8"],
      },
      bg: "#04161e",
      flyout: "#03141b",
      flyoutOpacity: 0.7,
      accent: "#4ff0ff",
    },
  },
};

export const SKIN_ORDER: SkinId[] = ["pixel", "robot", "neon", "holo"];

/** giao diện mặc định của từng trình độ (Neon chỉ là lựa chọn thêm, không là mặc định) */
const DEFAULT_BY_TIER: Record<string, SkinId> = { "vo-long": "pixel", "co-ban": "robot", "trung-cap": "robot", "nang-cao": "holo", python: "holo" };
export const defaultSkin = (tierId: string): SkinId => DEFAULT_BY_TIER[tierId] ?? "robot";

/**
 * Giao diện đang dùng: bé đã chọn (và đã mở khóa) thì theo bé, không thì theo trình độ của bài.
 * `open(tierId)` cho biết trình độ đó đã mở chưa.
 */
export function pickSkin(chosen: string | null, lessonTier: string, open: (tierId: string) => boolean): SkinId {
  if (chosen && chosen in SKINS && open(SKINS[chosen as SkinId].tier)) return chosen as SkinId;
  return defaultSkin(lessonTier);
}

const KEY = "hocvui:lt-skin";
export function loadSkinChoice(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
export function saveSkinChoice(id: SkinId) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* trình duyệt chặn lưu: vẫn đổi được trong lần học này */
  }
}
