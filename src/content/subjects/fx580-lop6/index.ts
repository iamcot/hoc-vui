import type { Subject } from "@/content/types";
import { LESSONS } from "./lessons";

export const fx580Lop6: Subject = {
  id: "fx580-lop6",
  name: "Máy tính FX580",
  grade: 6,
  tagline: "Bấm máy giỏi, tính nhanh Toán 6",
  emoji: "🧮",
  color: "#7c9cff",
  cover: "subject-fx580-cover",
  device: "fx580",
  ready: true,
  units: [
    { id: "co-ban", title: "Chặng 1 · Làm quen và phép tính", lessons: LESSONS.slice(0, 3) },
    { id: "so-hoc", title: "Chặng 2 · Chia hết, số nguyên tố, ƯCLN, BCNN", lessons: LESSONS.slice(3, 6) },
    { id: "so-moi", title: "Chặng 3 · Số nguyên, phân số, phần trăm", lessons: LESSONS.slice(6, 9) },
    { id: "hinh", title: "Chặng 4 · Hình học thực tế", lessons: LESSONS.slice(9) },
  ],
};
