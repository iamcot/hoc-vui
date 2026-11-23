import type { Subject } from "@/content/types";
import { unitsDocCau, unitsDocTron, unitsHocVan, unitsVoLong } from "./lessons";

export const tapDoc: Subject = {
  id: "tap-doc",
  name: "Tập đọc",
  levelsLabel: "Vỡ lòng → Lớp 2",
  tagline: "Âm, chữ, vần, rồi đọc trơn cả bài",
  emoji: "🔤",
  color: "#ff8a5c",
  cover: "subject-tapdoc-cover",
  tiers: [
    { id: "vo-long", name: "Vỡ lòng", short: "Nguyên âm, phụ âm, sáu thanh, chữ ghép", emoji: "🌱", icon: "level-mam", units: unitsVoLong },
    { id: "hoc-van", name: "Học vần", short: "Từ an, am đến uyên, uych", emoji: "🌿", icon: "level-choi", units: unitsHocVan, challenge: { count: 12, pass: 10 } },
    { id: "doc-cau", name: "Đọc câu", short: "Đọc từ, câu, nghỉ đúng dấu câu", emoji: "🌳", icon: "level-cay", units: unitsDocCau },
    { id: "doc-tron", name: "Đọc trơn", short: "Đọc đoạn văn, bài thơ, hiểu bài", emoji: "🌸", icon: "level-hoa", units: unitsDocTron },
  ],
  ready: true,
};
