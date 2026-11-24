/**
 * Đăng nhập bằng tên đăng nhập thay cho email (trẻ con thường chưa có email).
 * Supabase Auth cần email, nên tên đăng nhập được đổi thành một email nội bộ
 * `<tên>@<miền>` không có thật. Phải TẮT "Confirm email" trong Supabase (không gửi mail nào).
 * Nhập chuỗi có "@" thì vẫn dùng như email thật (cho bố mẹ).
 */
export const USERNAME_DOMAIN = process.env.NEXT_PUBLIC_USERNAME_EMAIL_DOMAIN || "hocvui.local";

/** "Bé Na 2015" → "bena2015". Bỏ dấu, chữ thường, chỉ giữ a-z 0-9 . _ */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9._]/g, "");
}

export function usernameError(u: string): string | null {
  if (u.length < 3) return "Tên đăng nhập cần ít nhất 3 ký tự (chữ không dấu, số, dấu chấm, gạch dưới).";
  if (u.length > 20) return "Tên đăng nhập dài tối đa 20 ký tự.";
  return null;
}

/** Tên đăng nhập hoặc email → email gửi cho Supabase */
export function loginToEmail(input: string): string {
  const s = input.trim();
  return s.includes("@") ? s.toLowerCase() : `${normalizeUsername(s)}@${USERNAME_DOMAIN}`;
}

/** Email nội bộ → tên đăng nhập để hiển thị */
export function emailToLogin(email: string): string {
  const suffix = `@${USERNAME_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email;
}
