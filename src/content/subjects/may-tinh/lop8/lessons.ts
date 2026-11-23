import type { Lesson } from "@/content/types";
import { PRACTICE } from "./practice";

/**
 * Trình độ lớp 8: dùng Casio fx-580VN X cho Toán 8 (GDPT 2018).
 * Chủ đề: giá trị đa thức, hằng đẳng thức, phương trình bậc nhất,
 * định lí Pythagore, hàm số bậc nhất, xác suất của biến cố.
 */
export const LESSONS: Lesson[] = [
  {
    id: "l8-gia-tri",
    title: "Giá trị của đa thức",
    short: "Thay số vào biểu thức, ngoặc cho số âm",
    emoji: "🧪",
    cover: "fx8-l01-cover",
    minutes: 7,
    practice: PRACTICE["l8-gia-tri"],
    slides: [
      {
        title: "Chào mừng lên lớp 8!",
        mood: "cheer",
        blocks: [
          { type: "image", asset: "fx8-l01-cover" },
          { type: "text", text: "Lớp 8 có nhiều **đa thức** như P = 2x² − 3x + 1. Muốn biết P bằng bao nhiêu khi x = −2, em **thay x bằng −2** rồi để Xi Xi tính." },
        ],
      },
      {
        title: "Số âm nhớ đặt trong ngoặc",
        mood: "think",
        blocks: [
          { type: "text", text: "Thay x = −2 vào 2x²: phải bấm **2 × (−2)²**, có ngoặc. Không có ngoặc, máy hiểu là 2 × −(2²) và ra sai dấu." },
          { type: "keys", keys: ["2", "MUL", "LP", "NEG", "2", "RP", "POW2", "SUB", "3", "MUL", "LP", "NEG", "2", "RP", "ADD", "1", "EQ"], result: "15", label: "P = 2x² − 3x + 1 tại x = −2", tryIt: true },
          { type: "check", question: { id: "l8-01-c1", topic: "l8-gia-tri", kind: "number", prompt: "Tính Q = x² + 4x − 5 tại x = −3", answer: "-8", keys: ["LP", "NEG", "3", "RP", "POW2", "ADD", "4", "MUL", "LP", "NEG", "3", "RP", "SUB", "5", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l8-hang-dang-thuc",
    title: "Hằng đẳng thức đáng nhớ",
    short: "Bảy hằng đẳng thức, tính nhanh và kiểm tra bằng máy",
    emoji: "🪄",
    cover: "fx8-l02-cover",
    minutes: 8,
    practice: PRACTICE["l8-hang-dang-thuc"],
    slides: [
      {
        title: "Bảy câu thần chú",
        mood: "wow",
        blocks: [
          { type: "image", asset: "fx8-l02-cover" },
          { type: "text", text: "(a + b)² = a² + 2ab + b²\n(a − b)² = a² − 2ab + b²\na² − b² = (a − b)(a + b)\n(a ± b)³ = a³ ± 3a²b + 3ab² ± b³\na³ ± b³ = (a ± b)(a² ∓ ab + b²)" },
        ],
      },
      {
        title: "Tính nhẩm siêu nhanh",
        mood: "happy",
        blocks: [
          { type: "example", problem: "Tính nhanh 51 × 49", steps: ["51 × 49 = (50 + 1)(50 − 1)", "= 50² − 1²", "= 2500 − 1 = 2499"], keys: ["5", "1", "MUL", "4", "9", "EQ"], answer: "2499" },
          { type: "tip", text: "Tính nhẩm bằng hằng đẳng thức trước, rồi mới bấm máy để **kiểm tra**. Đi thi được dùng máy, nhưng nhẩm nhanh vẫn giúp em đỡ bấm nhầm." },
        ],
      },
      {
        title: "Kiểm tra một hằng đẳng thức",
        mood: "think",
        blocks: [
          { type: "text", text: "Nghi ngờ một công thức? Thử với a = 3, b = 2: hai vế ra cùng một số thì công thức (có thể) đúng, khác nhau là chắc chắn sai." },
          { type: "keys", keys: ["LP", "3", "ADD", "2", "RP", "POW2", "SUB", "LP", "3", "POW2", "ADD", "2", "MUL", "3", "MUL", "2", "ADD", "2", "POW2", "RP", "EQ"], result: "0", label: "(3 + 2)² − (3² + 2·3·2 + 2²)", tryIt: true },
          { type: "check", question: { id: "l8-02-c1", topic: "l8-hang-dang-thuc", kind: "number", prompt: "Tính nhanh 99²", answer: "9801", keys: ["9", "9", "POW2", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l8-phuong-trinh",
    title: "Phương trình bậc nhất",
    short: "Chuyển vế, tìm x, kiểm tra nghiệm bằng máy",
    emoji: "🔑",
    cover: "fx8-l03-cover",
    minutes: 8,
    practice: PRACTICE["l8-phuong-trinh"],
    slides: [
      {
        title: "Đi tìm x",
        mood: "think",
        blocks: [
          { type: "image", asset: "fx8-l03-cover" },
          { type: "text", text: "Phương trình **ax + b = cx + d**: đưa x về một vế, số về một vế. Ta được **(a − c)x = d − b**, nên **x = (d − b) : (a − c)**." },
        ],
      },
      {
        title: "Bấm một lần ra nghiệm",
        mood: "happy",
        blocks: [
          { type: "example", problem: "Giải 3x + 5 = x − 7", steps: ["(3 − 1)x = −7 − 5", "2x = −12", "x = −6"], keys: ["LP", "NEG", "7", "SUB", "5", "RP", "DIV", "LP", "3", "SUB", "1", "RP", "EQ"], answer: "x = −6" },
          { type: "keys", keys: ["LP", "NEG", "7", "SUB", "5", "RP", "DIV", "LP", "3", "SUB", "1", "RP", "EQ"], result: "-6", label: "(−7 − 5) : (3 − 1)", tryIt: true },
        ],
      },
      {
        title: "Thử lại nghiệm",
        mood: "wow",
        blocks: [
          { type: "text", text: "Thay x vừa tìm vào **cả hai vế**: hai vế bằng nhau là đúng. Với x = −6: 3·(−6) + 5 = −13 và −6 − 7 = −13. Chuẩn!" },
          { type: "tip", text: "Nghiệm ra phân số cũng không sao, Xi Xi tự rút gọn. Ví dụ 4x − 1 = x + 1 cho x = 2/3." },
          { type: "check", question: { id: "l8-03-c1", topic: "l8-phuong-trinh", kind: "fraction", reduced: true, prompt: "Giải 5x − 4 = 2x + 3 (phân số tối giản)", answer: "7/3", keys: ["LP", "3", "ADD", "4", "RP", "DIV", "LP", "5", "SUB", "2", "RP", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l8-pythagore",
    title: "Định lí Pythagore",
    short: "Tính cạnh tam giác vuông, nhận biết tam giác vuông",
    emoji: "📐",
    cover: "fx8-l04-cover",
    minutes: 8,
    practice: PRACTICE["l8-pythagore"],
    slides: [
      {
        title: "Bí mật của tam giác vuông",
        mood: "wow",
        blocks: [
          { type: "image", asset: "fx8-l04-cover" },
          { type: "text", text: "Trong tam giác vuông, **bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông**: c² = a² + b². Cạnh huyền là cạnh đối diện góc vuông, dài nhất." },
        ],
      },
      {
        title: "Tính cạnh huyền",
        mood: "happy",
        blocks: [
          { type: "text", text: "Bấm **√▯** trước, rồi gõ a² + b² ngay trong căn." },
          { type: "keys", keys: ["SQRT", "6", "POW2", "ADD", "8", "POW2", "EQ"], result: "10", label: "√(6² + 8²)", tryIt: true },
          { type: "keys", keys: ["SQRT", "5", "POW2", "ADD", "7", "POW2", "EQ", "SD"], result: "8.602325267", label: "√(5² + 7²), bấm S⇔D để ra số thập phân" },
        ],
      },
      {
        title: "Tính cạnh góc vuông",
        mood: "think",
        blocks: [
          { type: "text", text: "Biết cạnh huyền c và cạnh a, cạnh còn lại là **√(c² − a²)**. Muốn biết tam giác có vuông không: bấm a² + b² − c², ra **0** là vuông." },
          { type: "check", question: { id: "l8-04-c1", topic: "l8-pythagore", kind: "number", unit: "cm", prompt: "Tam giác vuông có cạnh huyền 13 cm, một cạnh góc vuông 5 cm. Cạnh còn lại dài bao nhiêu?", answer: "12", keys: ["SQRT", "1", "3", "POW2", "SUB", "5", "POW2", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l8-ham-so",
    title: "Hàm số bậc nhất",
    short: "Tính y từ x, tìm x từ y, đọc hệ số góc",
    emoji: "📈",
    cover: "fx8-l05-cover",
    minutes: 7,
    practice: PRACTICE["l8-ham-so"],
    slides: [
      {
        title: "Cỗ máy biến số",
        mood: "happy",
        blocks: [
          { type: "image", asset: "fx8-l05-cover" },
          { type: "text", text: "Hàm số **y = ax + b** giống một cỗ máy: bỏ x vào, ra y. Ví dụ taxi mở cửa 10 nghìn, mỗi km 12 nghìn: tiền = 12x + 10. **a** là hệ số góc, quyết định đường thẳng dốc cỡ nào." },
        ],
      },
      {
        title: "Tính y khi biết x",
        mood: "think",
        blocks: [
          { type: "keys", keys: ["1", "2", "MUL", "8", "ADD", "1", "0", "EQ"], result: "106", label: "Đi taxi 8 km: 12 × 8 + 10 (nghìn đồng)", tryIt: true },
        ],
      },
      {
        title: "Tìm x khi biết y",
        mood: "wow",
        blocks: [
          { type: "text", text: "Ngược lại, biết y thì **x = (y − b) : a**. Trả 130 nghìn thì đi được (130 − 10) : 12 = 10 km." },
          { type: "check", question: { id: "l8-05-c1", topic: "l8-ham-so", kind: "number", prompt: "Cho y = 2x − 3. Tìm x để y = 11.", answer: "7", keys: ["LP", "1", "1", "ADD", "3", "RP", "DIV", "2", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l8-xac-suat",
    title: "Xác suất của biến cố",
    short: "Kết quả thuận lợi, xác suất lý thuyết và thực nghiệm",
    emoji: "🎲",
    cover: "fx8-l06-cover",
    minutes: 7,
    practice: PRACTICE["l8-xac-suat"],
    slides: [
      {
        title: "Khả năng xảy ra",
        mood: "think",
        blocks: [
          { type: "image", asset: "fx8-l06-cover" },
          { type: "text", text: "Khi các kết quả **có khả năng như nhau**: xác suất = **số kết quả thuận lợi : tổng số kết quả**. Hộp có 3 bi đỏ trong 10 bi thì xác suất lấy được bi đỏ là 3/10." },
        ],
      },
      {
        title: "Bấm phân số cho gọn",
        mood: "happy",
        blocks: [
          { type: "text", text: "Nhập dạng phân số để Xi Xi tự rút gọn. Muốn ra phần trăm thì nhân 100." },
          { type: "keys", keys: ["3", "FRAC", "6", "EQ"], result: "1/2", label: "Xúc xắc ra số chẵn: 3/6", tryIt: true },
        ],
      },
      {
        title: "Xác suất thực nghiệm",
        mood: "wow",
        blocks: [
          { type: "text", text: "Tung đồng xu 50 lần, ra 27 lần ngửa: xác suất thực nghiệm là **27 : 50 = 0,54**. Tung càng nhiều lần, con số càng gần 0,5." },
          { type: "check", question: { id: "l8-06-c1", topic: "l8-xac-suat", kind: "fraction", reduced: true, prompt: "Hộp có 4 bi đỏ, 6 bi xanh, 2 bi vàng. Xác suất lấy được bi xanh là bao nhiêu? (phân số tối giản)", answer: "1/2", keys: ["6", "FRAC", "1", "2", "EQ"] } },
        ],
      },
    ],
  },
];
