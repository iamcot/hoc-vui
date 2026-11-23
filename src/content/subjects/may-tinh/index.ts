import type { Subject } from "@/content/types";
import { LESSONS as L6 } from "./lop6/lessons";
import { LESSONS as L7 } from "./lop7/lessons";
import { LESSONS as L8 } from "./lop8/lessons";
import { LESSONS as L9 } from "./lop9/lessons";

/** Môn Máy tính Casio fx-580VN X: chia trình độ theo lớp, bám chương trình Toán GDPT 2018. */
export const mayTinh: Subject = {
  id: "may-tinh",
  name: "Máy tính Casio",
  levelsLabel: "Lớp 6 → 9",
  tagline: "Bấm fx-580VN X thật giỏi, tính nhanh môn Toán",
  emoji: "🧮",
  color: "#7c9cff",
  cover: "subject-fx580-cover",
  device: "fx580",
  ready: true,
  tiers: [
    {
      id: "lop6",
      name: "Lớp 6",
      short: "Làm quen máy, số tự nhiên, ƯCLN, BCNN, phân số, phần trăm",
      emoji: "🌱",
      units: [
        { id: "co-ban", title: "Chặng 1 · Làm quen và phép tính", lessons: L6.slice(0, 3) },
        { id: "so-hoc", title: "Chặng 2 · Chia hết, số nguyên tố, ƯCLN, BCNN", lessons: L6.slice(3, 6) },
        { id: "so-moi", title: "Chặng 3 · Số nguyên, phân số, phần trăm", lessons: L6.slice(6, 9) },
        { id: "hinh", title: "Chặng 4 · Hình học thực tế", lessons: L6.slice(9) },
      ],
    },
    {
      id: "lop7",
      name: "Lớp 7",
      short: "Số hữu tỉ, căn bậc hai, tỉ lệ thức, đại lượng tỉ lệ, thống kê",
      emoji: "🌿",
      units: L7.length
        ? [
            { id: "l7-huu-ti", title: "Chặng 1 · Số hữu tỉ và lũy thừa", lessons: L7.slice(0, 2) },
            { id: "l7-so-thuc", title: "Chặng 2 · Căn bậc hai và số thực", lessons: L7.slice(2, 3) },
            { id: "l7-ti-le", title: "Chặng 3 · Tỉ lệ thức và đại lượng tỉ lệ", lessons: L7.slice(3, 5) },
            { id: "l7-thong-ke", title: "Chặng 4 · Thống kê", lessons: L7.slice(5) },
          ]
        : [],
    },
    {
      id: "lop8",
      name: "Lớp 8",
      short: "Đa thức, hằng đẳng thức, phương trình, Pythagore, hàm số, xác suất",
      emoji: "🌳",
      units: [
        { id: "l8-dai-so", title: "Chặng 1 · Đa thức và hằng đẳng thức", lessons: L8.slice(0, 2) },
        { id: "l8-pt", title: "Chặng 2 · Phương trình và hàm số", lessons: [L8[2], L8[4]] },
        { id: "l8-hinh-xs", title: "Chặng 3 · Pythagore và xác suất", lessons: [L8[3], L8[5]] },
      ],
    },
    {
      id: "lop9",
      name: "Lớp 9",
      short: "Căn thức, hệ phương trình, phương trình bậc hai, lượng giác, hình tròn và khối tròn",
      emoji: "🌸",
      units: [
        { id: "l9-dai-so", title: "Chặng 1 · Căn thức và hệ phương trình", lessons: L9.slice(0, 2) },
        { id: "l9-bac-hai", title: "Chặng 2 · Phương trình bậc hai", lessons: L9.slice(2, 3) },
        { id: "l9-hinh", title: "Chặng 3 · Lượng giác, đường tròn, hình khối", lessons: L9.slice(3) },
      ],
    },
  ],
};
