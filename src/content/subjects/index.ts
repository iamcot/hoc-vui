import type { Lesson, Subject } from "@/content/types";
import { fx580Lop6 } from "./fx580-lop6";

/**
 * Danh mục môn học. Thêm môn mới: tạo thư mục trong src/content/subjects/<id>/
 * xuất một Subject rồi thêm vào mảng dưới đây. Các màn hình, tiến trình, kiểm tra,
 * thi đấu, xếp hạng đều chạy theo subject.id nên không phải sửa gì thêm.
 */
export const SUBJECTS: Subject[] = [
  fx580Lop6,
  // Các môn sắp có: hiện trên trang chủ dạng "sắp ra mắt".
  { id: "toan-lop1", name: "Toán vui", grade: 1, tagline: "Đếm, cộng trừ trong phạm vi 100", emoji: "🍎", color: "#ff9fb2", cover: "subject-soon", units: [], ready: false },
  { id: "tieng-viet-lop2", name: "Tiếng Việt", grade: 2, tagline: "Đọc hiểu và chính tả", emoji: "📖", color: "#8fd3b6", cover: "subject-soon", units: [], ready: false },
  { id: "tieng-anh-lop6", name: "Tiếng Anh", grade: 6, tagline: "Từ vựng và ngữ pháp", emoji: "🌏", color: "#ffc978", cover: "subject-soon", units: [], ready: false },
];

export const getSubject = (id: string) => SUBJECTS.find((s) => s.id === id);

export const allLessons = (s: Subject): Lesson[] => s.units.flatMap((u) => u.lessons);

export function getLesson(subjectId: string, lessonId: string) {
  const s = getSubject(subjectId);
  if (!s) return undefined;
  const lessons = allLessons(s);
  const idx = lessons.findIndex((l) => l.id === lessonId);
  if (idx < 0) return undefined;
  return { subject: s, lesson: lessons[idx], index: idx, next: lessons[idx + 1], total: lessons.length };
}
