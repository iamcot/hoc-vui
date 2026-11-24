/**
 * Ước lượng độ mạnh mật khẩu cho môn Kỹ năng số. Chạy hoàn toàn trong máy, không lưu, không gửi đi.
 * Cách tính đơn giản, dễ giải thích cho trẻ: số khả năng = (số loại ký tự)^(độ dài),
 * trừ mạnh khi mật khẩu nằm trong danh sách hay dùng hoặc có mẫu dễ đoán.
 * Giả định kẻ gian thử 10 tỉ mật khẩu mỗi giây (máy mạnh, dò offline).
 */

const COMMON = [
  "123456", "1234567", "12345678", "123456789", "1234567890", "111111", "000000", "123123", "654321", "112233",
  "password", "matkhau", "qwerty", "qwerty123", "abc123", "iloveyou", "anhyeuem", "emyeuanh", "admin", "welcome",
  "football", "dragon", "monkey", "superman", "pokemon", "minecraft", "roblox", "freefire", "lienquan", "zxcvbn",
  "asdfgh", "1q2w3e", "aaaaaa", "hello", "hocvui", "vietnam", "hanoi", "saigon", "conmeo", "concho",
];

const GUESSES_PER_SECOND = 1e10;

export interface PasswordCheck {
  /** 0 rất yếu → 4 rất mạnh */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  /** thời gian máy dò ra, viết cho trẻ đọc */
  crack: string;
  seconds: number;
  checks: { ok: boolean; text: string }[];
  /** lời khuyên quan trọng nhất */
  tip: string;
}

function pool(pw: string) {
  let n = 0;
  if (/[a-z]/.test(pw)) n += 26;
  if (/[A-Z]/.test(pw)) n += 26;
  if (/\d/.test(pw)) n += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33;
  return Math.max(n, 1);
}

/** các mẫu dễ đoán làm giảm số khả năng thật sự */
function patterns(pw: string): string[] {
  const p: string[] = [];
  const low = pw.toLowerCase();
  if (COMMON.some((c) => low.includes(c))) p.push("có cụm mật khẩu rất hay bị dùng");
  if (/(.)\1{2,}/.test(pw)) p.push("lặp một ký tự nhiều lần");
  if (/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|qwer|asdf|zxcv)/i.test(pw)) p.push("có dãy liền nhau như 1234, abcd, qwer");
  if (/(19|20)\d\d/.test(pw) || /\d{1,2}[./-]?\d{1,2}[./-]?(19|20)?\d\d/.test(pw)) p.push("giống ngày sinh hoặc năm sinh");
  if (/^[a-zA-Z]+\d{1,4}$/.test(pw)) p.push("kiểu chữ + vài số ở cuối, máy hay thử trước");
  return p;
}

export function human(sec: number): string {
  if (sec < 1) return "chưa tới 1 giây";
  const units: [number, string][] = [
    [60, "giây"],
    [60, "phút"],
    [24, "giờ"],
    [30, "ngày"],
    [12, "tháng"],
    [100, "năm"],
    [1000, "thế kỷ"],
  ];
  let v = sec;
  for (const [k, name] of units) {
    if (v < k) return `khoảng ${Math.max(1, Math.round(v))} ${name}`;
    v /= k;
  }
  return "hơn 1000 thế kỷ";
}

export function checkPassword(pw: string): PasswordCheck {
  const bad = patterns(pw);
  let bits = pw.length * Math.log2(pool(pw));
  // mỗi mẫu dễ đoán làm mất nhiều khả năng; nằm hẳn trong danh sách hay dùng thì coi như dò ra ngay
  if (COMMON.includes(pw.toLowerCase())) bits = 4;
  else bits -= bad.length * 14;
  bits = Math.max(0, bits);
  const seconds = Math.pow(2, bits) / 2 / GUESSES_PER_SECOND;
  const score = (seconds < 60 ? 0 : seconds < 86400 * 30 ? 1 : seconds < 3.15e7 * 100 ? 2 : seconds < 3.15e7 * 1e6 ? 3 : 4) as PasswordCheck["score"];
  const checks = [
    { ok: pw.length >= 12, text: "Dài từ 12 ký tự trở lên" },
    { ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw), text: "Có cả chữ thường và chữ HOA" },
    { ok: /\d/.test(pw), text: "Có số" },
    { ok: /[^a-zA-Z0-9]/.test(pw), text: "Có ký hiệu như ! - _ @" },
    { ok: pw.length > 0 && bad.length === 0, text: "Không có mẫu dễ đoán (123456, ngày sinh, tên phổ biến)" },
  ];
  const tip = !pw
    ? "Gõ thử một mật khẩu bịa ra, đừng gõ mật khẩu thật của em nhé."
    : bad.length
      ? `Máy dò rất nhanh vì mật khẩu ${bad[0]}.`
      : pw.length < 12
        ? "Dài hơn là cách mạnh nhất: thêm vài từ nữa thành một cụm dễ nhớ."
        : score >= 3
          ? "Tuyệt! Nhớ dùng mật khẩu khác nhau cho từng tài khoản quan trọng."
          : "Thêm chữ HOA, số hoặc ký hiệu xen giữa các từ.";
  return { score, label: ["Rất yếu", "Yếu", "Tạm được", "Mạnh", "Rất mạnh"][score], crack: human(seconds), seconds, checks, tip };
}

const WORDS = [
  "Meo", "Cho", "Ca", "Chim", "Tho", "Gau", "Voi", "Rua", "Ech", "Cu", "Sao", "Trang", "May", "Gio", "Mua", "Nui", "Song", "Bien",
  "Hoa", "La", "Cay", "Banh", "Keo", "Kem", "Xoai", "Dua", "Cam", "Bong", "Xe", "Tau", "Dien", "Den", "Sach", "But", "Mu", "Giay",
];
const SEPS = ["-", "_", ".", "!", "@", "+"];

/** cụm mật khẩu: 4 từ ngẫu nhiên không dấu + số + ký hiệu, dài mà dễ nhớ */
export function passphrase(rand: () => number = Math.random): string {
  const w = () => WORDS[Math.floor(rand() * WORDS.length)];
  const sep = SEPS[Math.floor(rand() * SEPS.length)];
  return [w(), w(), `${w()}${Math.floor(rand() * 90 + 10)}`, w()].join(sep);
}
