"use client";
import { hasFile, resolveFile } from "@/content/assets";

/** icon nhỏ trong chữ: emoji mặc định của máy -> ảnh riêng ic-<id>.webp (prompt trong assets.ts) */
export const ICONS = {
  star: { emoji: "⭐", name: "ngôi sao XP" },
  fire: { emoji: "🔥", name: "ngọn lửa chuỗi ngày" },
  trophy: { emoji: "🏆", name: "cúp" },
  "medal-1": { emoji: "🥇", name: "huy chương vàng" },
  "medal-2": { emoji: "🥈", name: "huy chương bạc" },
  "medal-3": { emoji: "🥉", name: "huy chương đồng" },
  bolt: { emoji: "⚡", name: "tia chớp thi đấu" },
  retry: { emoji: "🔁", name: "chơi lại" },
  invite: { emoji: "📨", name: "thư mời bạn" },
  party: { emoji: "🎉", name: "pháo giấy chúc mừng" },
  sound: { emoji: "🔊", name: "loa nghe" },
  hint: { emoji: "💡", name: "bóng đèn gợi ý" },
  mic: { emoji: "🎙️", name: "micro đọc to" },
  target: { emoji: "🎯", name: "hồng tâm" },
  rocket: { emoji: "🚀", name: "tên lửa thử thách" },
  flag: { emoji: "🏁", name: "cờ đích" },
  calc: { emoji: "🧮", name: "máy tính" },
  pencil: { emoji: "✏️", name: "bút chì luyện tập" },
  ticket: { emoji: "🎟️", name: "vé vào phòng" },
  scroll: { emoji: "📜", name: "cuộn giấy bài gõ" },
  lock: { emoji: "🔒", name: "ổ khóa" },
  heart: { emoji: "❤️", name: "trái tim mạng sống" },
  shark: { emoji: "🦈", name: "cá mập vào game" },
  warn: { emoji: "⚠️", name: "chú ý" },
} as const;
export type IcoId = keyof typeof ICONS;

export function Ico({ n, className = "" }: { n: IcoId; className?: string }) {
  const file = `/assets/img/ic-${n}.webp`;
  if (!hasFile(file)) return <span className={className} aria-hidden>{ICONS[n].emoji}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolveFile(file)} alt="" aria-hidden draggable={false} className={`inline-block h-[1.25em] w-[1.25em] -translate-y-[0.08em] object-contain align-middle ${className}`} />;
}
