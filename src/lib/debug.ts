/**
 * Chế độ xem thử: thêm ?debug=1 vào địa chỉ bất kỳ để mở khóa toàn bộ lộ trình (xem hình, nội dung).
 * Nhớ trên máy cho tới khi vào ?debug=0. Không đổi tiến trình thật của bé.
 */
const KEY = "hocvui:debug";

function read(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("debug");
    if (q === "1") localStorage.setItem(KEY, "1");
    if (q === "0") localStorage.removeItem(KEY);
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export const isDebug = () => read();
