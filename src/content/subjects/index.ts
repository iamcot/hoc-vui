import type { Lesson, Subject, Tier } from "@/content/types";
import { mayTinh } from "./may-tinh";

/**
 * Danh mục môn học. Thêm môn mới: tạo thư mục trong src/content/subjects/<id>/
 * xuất một Subject (môn → trình độ → chặng → bài) rồi thêm vào mảng dưới đây.
 * Các màn hình, tiến trình, kiểm tra, thử thách vượt cấp, thi đấu, xếp hạng
 * đều chạy theo subject.id nên không phải sửa gì thêm.
 */
export const SUBJECTS: Subject[] = [
  mayTinh,
  // Các môn sắp có: hiện trên trang chủ dạng "sắp ra mắt".
  { id: "toan-lop1", name: "Toán vui", levelsLabel: "Lớp 1", tagline: "Đếm, cộng trừ trong phạm vi 100", emoji: "🍎", color: "#ff9fb2", cover: "subject-soon", tiers: [], ready: false },
  { id: "tieng-viet-lop2", name: "Tiếng Việt", levelsLabel: "Lớp 2", tagline: "Đọc hiểu và chính tả", emoji: "📖", color: "#8fd3b6", cover: "subject-soon", tiers: [], ready: false },
  { id: "tieng-anh-lop6", name: "Tiếng Anh", levelsLabel: "Lớp 6", tagline: "Từ vựng và ngữ pháp", emoji: "🌏", color: "#ffc978", cover: "subject-soon", tiers: [], ready: false },
];

export const getSubject = (id: string) => SUBJECTS.find((s) => s.id === id);

export const tierLessons = (t: Tier): Lesson[] => t.units.flatMap((u) => u.lessons);

export const allLessons = (s: Subject): Lesson[] => s.tiers.flatMap(tierLessons);

export const getTier = (s: Subject, tierId: string) => s.tiers.find((t) => t.id === tierId);

export const tierOf = (s: Subject, lessonId: string) => s.tiers.find((t) => tierLessons(t).some((l) => l.id === lessonId));

export function getLesson(subjectId: string, lessonId: string) {
  const s = getSubject(subjectId);
  if (!s) return undefined;
  const tier = tierOf(s, lessonId);
  if (!tier) return undefined;
  const lessons = tierLessons(tier);
  const idx = lessons.findIndex((l) => l.id === lessonId);
  return { subject: s, tier, lesson: lessons[idx], index: idx, next: lessons[idx + 1] as Lesson | undefined, total: lessons.length };
}
