"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Nghe phím gõ trên cả trang (bàn phím rời, laptop). Bỏ qua phím tắt Ctrl/Cmd/Alt.
 * Phát hiện bộ gõ tiếng Việt của máy đang bật (phím ra "Process"/đang ghép chữ) để nhắc tắt đi,
 * vì app tự ghép Telex.
 */
export function useKeyInput(onChar: (ch: string) => void, active = true) {
  const cb = useRef(onChar);
  cb.current = onChar;
  const [imeOn, setImeOn] = useState(false);

  useEffect(() => {
    if (!active) return;
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") && !t.dataset.typing) return;
      if (e.isComposing || e.key === "Process" || e.keyCode === 229) {
        setImeOn(true);
        return;
      }
      if (e.key.length !== 1) return;
      e.preventDefault(); // phím cách không cuộn trang, "/" không mở tìm kiếm
      cb.current(e.key);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [active]);

  return { imeOn };
}

/** số từ mỗi phút (5 phím = 1 từ) và độ chính xác */
export function typingStats(correctKeys: number, errors: number, ms: number) {
  const min = Math.max(ms, 1000) / 60000;
  return {
    wpm: Math.round(correctKeys / 5 / min),
    acc: correctKeys + errors === 0 ? 100 : Math.round((correctKeys / (correctKeys + errors)) * 100),
  };
}

/**
 * Phím tắt chung của môn Gõ phím (hiện ngay trên nút bằng <Kbd>):
 *   Phím cách  bắt đầu / chơi lại (Lặn xuống, Lặn lại, Xuất phát)
 *   Enter      đi tiếp (slide sau, Bài tiếp, Hoàn thành)
 *   Esc        quay lại / thoát / tạm dừng
 *   Shift+Enter  bỏ qua hướng dẫn, vào game luôn
 * Không chạy khi đang gõ trong ô nhập.
 */
export const HOTKEY = { start: " ", next: "Enter", back: "Escape", skip: "Shift+Enter" } as const;
type Combo = "Enter" | "Escape" | " " | "Shift+Enter" | "ArrowLeft" | "ArrowRight";

export function useHotkeys(map: Partial<Record<Combo, () => void>>, active = true) {
  const ref = useRef(map);
  ref.current = map;
  useEffect(() => {
    if (!active) return;
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const combo = (e.shiftKey && e.key === "Enter" ? "Shift+Enter" : e.shiftKey ? "" : e.key) as Combo;
      const fn = ref.current[combo];
      if (!fn) return;
      e.preventDefault();
      fn();
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [active]);
}
