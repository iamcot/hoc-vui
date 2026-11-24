import type { Subject } from "@/content/types";
import { unitsNha, unitsPhoiHop, unitsTay, unitsTelex } from "./lessons";

export const goPhim: Subject = {
  id: "go-phim",
  name: "Gõ phím",
  levelsLabel: "10 ngón · Telex",
  tagline: "Lặn biển bắn cá mập bằng bàn phím",
  emoji: "⌨️",
  color: "#2fd3ff",
  cover: "subject-gophim-cover",
  device: "keyboard",
  mascot: "bit",
  look: { theme: "cyber", map: "bg-gp-map", lesson: "bg-gp-lesson" },
  modes: [
    { id: "song-sot", name: "Sinh tồn", short: "Cá đến mãi, giữ 3 mạng", emoji: "🦈", href: "/go-phim/sinh-ton", icon: "gp-mode-survival" },
    { id: "bai-hay", name: "Bài gõ hay", short: "Đoạn văn, ca dao", emoji: "📜", href: "/go-phim/bai-hay", icon: "gp-mode-passage" },
    { id: "dua-xe", name: "Đua xe", short: "Gõ nhanh, xe về trước", emoji: "🏎️", href: "/thi-dau?mon=go-phim", icon: "gp-mode-race" },
  ],
  tiers: [
    { id: "nha", name: "Hàng phím cơ sở", short: "A S D F · J K L ; là chỗ đặt sẵn 8 ngón", emoji: "🏠", icon: "gp-tier-1", units: unitsNha },
    { id: "tay", name: "Từng bàn tay", short: "Hàng trên, hàng dưới, đủ chữ cái", emoji: "🖐️", icon: "gp-tier-2", units: unitsTay },
    { id: "phoi", name: "Phối hợp", short: "Hai tay, chữ hoa, dấu câu, số", emoji: "🤝", icon: "gp-tier-3", units: unitsPhoiHop },
    { id: "telex", name: "Telex", short: "Gõ tiếng Việt có dấu", emoji: "🇻🇳", icon: "gp-tier-4", units: unitsTelex },
  ],
  ready: true,
  stage: "all",
};
