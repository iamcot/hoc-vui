import type { Subject } from "@/content/types";
import { unitsNhi } from "./nhi";
import { unitsThcs } from "./thcs";

/** Môn Thí nghiệm hoá: plan ở docs/plans/thi-nghiem-hoa.md. Bài học, thực hành chạy trên bàn thí nghiệm ảo (components/lab) */
export const hoaHoc: Subject = {
  id: "hoa-hoc",
  name: "Thí nghiệm hoá",
  levelsLabel: "Nhí → THPT",
  tagline: "Đoán, trộn, xem phản ứng, hiểu vì sao",
  emoji: "🧪",
  color: "#9b7bff",
  cover: "subject-hoahoc-cover",
  look: { map: "bg-hh-nang", lesson: "bg-hh-nang", calm: true },
  modes: [
    { id: "hh-xep-lop", name: "Xếp lớp", short: "Học lớp 6 trở lên? Nhảy cóc bài dễ", emoji: "🎯", href: "/hoa-hoc/xep-lop" },
    { id: "hh-so-tay", name: "Sổ tay", short: "Thí nghiệm đã làm, sự cố, ôn nhanh", emoji: "📓", href: "/hoa-hoc/so-tay" },
  ],
  tiers: [
    { id: "nhi", name: "Nhí", short: "Tan, nổi chìm, đổi màu, núi lửa · lớp 1-3", emoji: "🧪", icon: "hh-tier-1", units: unitsNhi, challenge: { count: 10, pass: 8 } },
    { id: "khtn", name: "Khoa học tự nhiên", short: "Chất, tách chất, nguyên tử, sự cháy · lớp 4-7", emoji: "🔬", icon: "hh-tier-2", units: [] },
    { id: "thcs", name: "Hoá THCS", short: "Phản ứng, axit bazơ, muối, kim loại · lớp 8-9", emoji: "⚗️", icon: "hh-tier-3", units: unitsThcs, challenge: { count: 10, pass: 8 }, mascot: "bit" },
    { id: "thpt", name: "Hoá THPT", short: "Liên kết, tốc độ, cân bằng, điện hoá · lớp 10-12", emoji: "🧬", icon: "hh-tier-4", units: [], mascot: "bit" },
  ],
  ready: true,
  stage: "all",
};
