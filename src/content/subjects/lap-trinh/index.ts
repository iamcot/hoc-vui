import type { Subject } from "@/content/types";
import { unitsVoLong } from "./lessons";
import { unitsCoBan } from "./co-ban";
import { unitsTrungCap } from "./trung-cap";
import { unitsNangCao } from "./nang-cao";

/** Môn Lập trình khối lệnh: plan ở docs/plans/lap-trinh.md */
export const lapTrinh: Subject = {
  id: "lap-trinh",
  name: "Lập trình",
  levelsLabel: "Khối lệnh → Python",
  tagline: "Kéo khối lệnh, dẫn Mochi về đích",
  emoji: "🧩",
  color: "#2fd3ff",
  cover: "subject-laptrinh-cover",
  look: { theme: "cyber", map: "bg-lt-map", lesson: "bg-lt-lesson", calm: true },
  tiers: [
    { id: "vo-long", name: "Vỡ lòng", short: "Đi, rẽ, nhặt sao, sửa lỗi · lớp 1-3", emoji: "🐾", icon: "lt-tier-1", units: unitsVoLong, challenge: { count: 10, pass: 8 } },
    { id: "co-ban", name: "Cơ bản", short: "Lặp lại, nếu thì, bút vẽ · lớp 3-5", emoji: "🔁", icon: "lt-tier-2", units: unitsCoBan, challenge: { count: 10, pass: 8 } },
    { id: "trung-cap", name: "Trung cấp", short: "Biến, hàm, sự kiện, mini game · lớp 6-8", emoji: "🎮", icon: "lt-tier-3", units: unitsTrungCap, challenge: { count: 10, pass: 8 }, mascot: "bit" },
    { id: "nang-cao", name: "Nâng cao", short: "Danh sách, tìm kiếm, sắp xếp · lớp 8-10", emoji: "🧠", icon: "lt-tier-4", units: unitsNangCao, challenge: { count: 10, pass: 8 }, mascot: "bit" },
    { id: "python", name: "Python", short: "Từ khối sang code thật · lớp 9-12", emoji: "🐍", icon: "lt-tier-5", units: [], mascot: "bit" },
  ],
  ready: true,
  stage: "all",
};
