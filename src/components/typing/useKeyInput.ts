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
