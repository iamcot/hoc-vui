import type { Lesson } from "@/content/types";
import { PRACTICE } from "./practice";

/**
 * Trình độ lớp 7: dùng Casio fx-580VN X cho Toán 7 (GDPT 2018).
 * Bám các chủ đề: số hữu tỉ, lũy thừa, căn bậc hai và số thực, tỉ lệ thức,
 * đại lượng tỉ lệ, thống kê. Mochi và Xi Xi tiếp tục dẫn chuyện.
 */
export const LESSONS: Lesson[] = [
  {
    id: "l7-huu-ti",
    title: "Số hữu tỉ",
    short: "Phân số âm, trộn phân số với số thập phân, so sánh",
    emoji: "🧊",
    cover: "fx7-l01-cover",
    minutes: 7,
    practice: PRACTICE["l7-huu-ti"],
    slides: [
      {
        title: "Chào mừng lên lớp 7!",
        mood: "cheer",
        blocks: [
          { type: "image", asset: "fx7-l01-cover" },
          { type: "text", text: "Lên lớp 7, em gặp **số hữu tỉ**: những số viết được dạng phân số a/b, kể cả số âm như **−3/4** hay số thập phân như **0,25**. Xi Xi xử lý hết, miễn em nhập đúng dấu." },
        ],
      },
      {
        title: "Phân số âm",
        mood: "think",
        blocks: [
          { type: "text", text: "Số âm thì bấm phím **(−)** trước, rồi mới gõ tử số, phím **▯/▯**, mẫu số. Bấm **▶** để ra khỏi phân số." },
          { type: "keys", keys: ["NEG", "3", "FRAC", "4", "RIGHT", "ADD", "5", "FRAC", "6", "RIGHT", "EQ"], result: "1/12", label: "−3/4 + 5/6", tryIt: true },
          { type: "tip", tone: "warn", text: "Phím **(−)** (dấu âm) khác phím **−** (phép trừ). Bấm nhầm máy sẽ báo lỗi cú pháp." },
        ],
      },
      {
        title: "Trộn phân số với số thập phân",
        mood: "wow",
        blocks: [
          { type: "text", text: "Đề cho lẫn lộn 0,75 và 2/3? Cứ nhập nguyên như vậy. Xi Xi ra kết quả phân số, muốn xem số thập phân thì bấm **S⇔D**." },
          { type: "keys", keys: ["0", "DOT", "7", "5", "SUB", "2", "FRAC", "3", "RIGHT", "EQ"], result: "1/12", label: "0,75 − 2/3" },
          { type: "keys", keys: ["SD"], result: "0.08333333333", label: "Đổi sang số thập phân" },
        ],
      },
      {
        title: "So sánh hai số hữu tỉ",
        mood: "happy",
        blocks: [
          { type: "text", text: "Muốn biết 5/7 hay 7/10 lớn hơn? Đổi cả hai ra số thập phân bằng **S⇔D** rồi so sánh, hoặc bấm hiệu của chúng: hiệu dương thì số trước lớn hơn." },
          { type: "example", problem: "So sánh 5/7 và 7/10", steps: ["5/7 = 0,714...", "7/10 = 0,7", "0,714 > 0,7"], keys: ["5", "FRAC", "7", "RIGHT", "SUB", "7", "FRAC", "1", "0", "RIGHT", "EQ"], answer: "5/7 > 7/10 (hiệu là 1/70, dương)" },
          { type: "check", question: { id: "l7-01-c1", topic: "l7-huu-ti", kind: "fraction", reduced: true, prompt: "Tính −2/3 + 1/4 (phân số tối giản)", answer: "-5/12", keys: ["NEG", "2", "FRAC", "3", "RIGHT", "ADD", "1", "FRAC", "4", "RIGHT", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l7-luy-thua",
    title: "Lũy thừa số hữu tỉ",
    short: "Cơ số âm, cơ số phân số, nhân chia lũy thừa",
    emoji: "🚀",
    cover: "fx7-l02-cover",
    minutes: 7,
    practice: PRACTICE["l7-luy-thua"],
    slides: [
      {
        title: "Cái bẫy dấu ngoặc",
        mood: "oops",
        blocks: [
          { type: "image", asset: "fx7-l02-cover" },
          { type: "text", text: "**(−2)⁴** và **−2⁴** trông giống nhau nhưng khác hẳn! (−2)⁴ = 16, còn −2⁴ = −(2⁴) = −16. Máy cũng hiểu như vậy, nên cơ số âm **luôn phải có ngoặc**." },
        ],
      },
      {
        title: "Bấm lũy thừa có ngoặc",
        mood: "think",
        blocks: [
          { type: "text", text: "Mở ngoặc, bấm (−), gõ cơ số, đóng ngoặc, bấm **x^▯**, gõ số mũ. Bấm **▶** để ra khỏi ô số mũ." },
          { type: "keys", keys: ["LP", "NEG", "2", "RP", "POW", "4", "RIGHT", "EQ"], result: "16", label: "(−2)⁴", tryIt: true },
          { type: "keys", keys: ["NEG", "2", "POW", "4", "RIGHT", "EQ"], result: "-16", label: "−2⁴ (không ngoặc)" },
        ],
      },
      {
        title: "Lũy thừa của phân số",
        mood: "wow",
        blocks: [
          { type: "text", text: "(a/b)ⁿ = aⁿ/bⁿ. Trên máy: mở ngoặc, nhập phân số, đóng ngoặc rồi mũ." },
          { type: "keys", keys: ["LP", "2", "FRAC", "3", "RIGHT", "RP", "POW", "3", "RIGHT", "EQ"], result: "8/27", label: "(2/3)³", tryIt: true },
          { type: "tip", text: "Nhân hai lũy thừa cùng cơ số thì **cộng** số mũ, chia thì **trừ** số mũ. Bấm máy để kiểm tra lại cho chắc." },
          { type: "check", question: { id: "l7-02-c1", topic: "l7-luy-thua", kind: "number", prompt: "Tính (−3)³", answer: "-27", keys: ["LP", "NEG", "3", "RP", "POW", "3", "RIGHT", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l7-can-bac-hai",
    title: "Căn bậc hai và làm tròn",
    short: "Phím √, đổi sang thập phân, làm tròn kết quả",
    emoji: "🌱",
    cover: "fx7-l03-cover",
    minutes: 8,
    practice: PRACTICE["l7-can-bac-hai"],
    slides: [
      {
        title: "Căn bậc hai là gì?",
        mood: "think",
        blocks: [
          { type: "image", asset: "fx7-l03-cover" },
          { type: "text", text: "**√a** là số không âm mà bình phương lên bằng a. Ví dụ √49 = 7 vì 7² = 49. Mảnh vườn vuông rộng 49 m² thì cạnh dài 7 m." },
        ],
      },
      {
        title: "Phím √",
        mood: "happy",
        blocks: [
          { type: "text", text: "Bấm **√▯**, gõ số, bấm **=**." },
          { type: "keys", keys: ["SQRT", "1", "6", "9", "EQ"], result: "13", label: "√169", tryIt: true },
        ],
      },
      {
        title: "Số vô tỉ và nút S⇔D",
        mood: "wow",
        blocks: [
          { type: "text", text: "√2, √7... không viết được dạng phân số: đó là **số vô tỉ**, phần thập phân kéo dài mãi không lặp lại. Xi Xi để nguyên dạng căn như **√7** hay rút gọn như **2√3**. Muốn ra số thập phân, bấm **S⇔D**." },
          { type: "keys", keys: ["SQRT", "7", "EQ", "SD"], result: "2.645751311", label: "√7 ra số thập phân", tryIt: true },
        ],
      },
      {
        title: "Làm tròn kết quả",
        mood: "think",
        blocks: [
          { type: "text", text: "Làm tròn đến **hàng phần trăm** thì giữ 2 chữ số sau dấu phẩy, nhìn chữ số thứ ba: từ 5 trở lên thì cộng 1." },
          { type: "example", problem: "Làm tròn √7 đến hàng phần trăm", steps: ["Máy cho 2,645751...", "Chữ số thứ ba sau dấu phẩy là 5", "Tăng hàng phần trăm: 2,64 → 2,65"], keys: ["SQRT", "7", "EQ", "SD"], answer: "2,65" },
          { type: "check", question: { id: "l7-03-c1", topic: "l7-can-bac-hai", kind: "number", prompt: "Tính √50, làm tròn đến hàng phần trăm", answer: "7.07", keys: ["SQRT", "5", "0", "EQ", "SD"] } },
        ],
      },
    ],
  },
  {
    id: "l7-ti-le-thuc",
    title: "Tỉ lệ thức",
    short: "Tìm x bằng nhân chéo, dãy tỉ số bằng nhau",
    emoji: "⚖️",
    cover: "fx7-l04-cover",
    minutes: 8,
    practice: PRACTICE["l7-ti-le-thuc"],
    slides: [
      {
        title: "Hai tỉ số bằng nhau",
        mood: "happy",
        blocks: [
          { type: "image", asset: "fx7-l04-cover" },
          { type: "text", text: "**a/b = c/d** gọi là tỉ lệ thức. Tính chất quan trọng nhất: **tích chéo bằng nhau**, a × d = b × c." },
        ],
      },
      {
        title: "Tìm x bằng nhân chéo",
        mood: "think",
        blocks: [
          { type: "text", text: "Biết 12/8 = x/6 thì x = 12 × 6 : 8. Bấm một mạch trên máy." },
          { type: "keys", keys: ["1", "2", "MUL", "6", "DIV", "8", "EQ"], result: "9", label: "x = 12 × 6 : 8", tryIt: true },
        ],
      },
      {
        title: "Dãy tỉ số bằng nhau",
        mood: "wow",
        blocks: [
          { type: "text", text: "Nếu x/2 = y/3 và x + y = 40 thì mỗi tỉ số bằng **(x + y) : (2 + 3)**. Tính giá trị chung trước, rồi nhân lại." },
          { type: "example", problem: "x/2 = y/3, x + y = 40. Tìm x, y.", steps: ["Giá trị chung: 40 : (2 + 3) = 8", "x = 2 × 8 = 16", "y = 3 × 8 = 24"], keys: ["4", "0", "DIV", "LP", "2", "ADD", "3", "RP", "EQ"], answer: "x = 16, y = 24" },
          { type: "check", question: { id: "l7-04-c1", topic: "l7-ti-le-thuc", kind: "number", prompt: "Tìm x biết 15/4 = x/12", answer: "45", keys: ["1", "5", "MUL", "1", "2", "DIV", "4", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l7-ti-le",
    title: "Đại lượng tỉ lệ",
    short: "Tỉ lệ thuận, tỉ lệ nghịch, chia theo tỉ lệ",
    emoji: "🍰",
    cover: "fx7-l05-cover",
    minutes: 8,
    practice: PRACTICE["l7-ti-le"],
    slides: [
      {
        title: "Cùng tăng hay ngược chiều?",
        mood: "think",
        blocks: [
          { type: "image", asset: "fx7-l05-cover" },
          { type: "text", text: "**Tỉ lệ thuận**: mua gấp đôi số vở thì trả gấp đôi tiền, thương y/x không đổi. **Tỉ lệ nghịch**: gấp đôi số bạn cùng làm thì số ngày giảm một nửa, tích x × y không đổi." },
        ],
      },
      {
        title: "Tỉ lệ thuận",
        mood: "happy",
        blocks: [
          { type: "text", text: "3 quyển vở giá 45 000 đồng. 7 quyển giá bao nhiêu? Tìm giá 1 quyển rồi nhân 7." },
          { type: "keys", keys: ["4", "5", "0", "0", "0", "DIV", "3", "MUL", "7", "EQ"], result: "105000", label: "45 000 : 3 × 7", tryIt: true },
        ],
      },
      {
        title: "Tỉ lệ nghịch",
        mood: "wow",
        blocks: [
          { type: "text", text: "6 bạn dọn vườn hết 8 ngày. 12 bạn thì sao? Tích không đổi: 6 × 8 = 12 × ? nên ? = 6 × 8 : 12." },
          { type: "keys", keys: ["6", "MUL", "8", "DIV", "1", "2", "EQ"], result: "4", label: "6 × 8 : 12" },
          { type: "tip", text: "Chia một số theo tỉ lệ 2 : 3 : 5 thì **một phần = tổng : (2 + 3 + 5)**. Bạn nào được mấy phần thì nhân lên." },
          { type: "check", question: { id: "l7-05-c1", topic: "l7-ti-le", kind: "number", unit: "ngày", prompt: "4 bạn làm xong việc trong 15 ngày. 10 bạn (làm như nhau) xong trong mấy ngày?", answer: "6", keys: ["4", "MUL", "1", "5", "DIV", "1", "0", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l7-trung-binh",
    title: "Số trung bình và biểu đồ",
    short: "Trung bình cộng, trung bình có tần số, phần trăm trên biểu đồ quạt",
    emoji: "📊",
    cover: "fx7-l06-cover",
    minutes: 8,
    practice: PRACTICE["l7-trung-binh"],
    slides: [
      {
        title: "Điểm trung bình",
        mood: "happy",
        blocks: [
          { type: "image", asset: "fx7-l06-cover" },
          { type: "text", text: "**Trung bình cộng** = tổng các giá trị : số giá trị. Nhớ **đóng ngoặc** cả tổng trước khi chia, không thì máy chỉ chia số cuối." },
          { type: "keys", keys: ["LP", "8", "ADD", "9", "ADD", "7", "ADD", "1", "0", "RP", "DIV", "4", "EQ"], result: "17/2", label: "(8 + 9 + 7 + 10) : 4", tryIt: true },
        ],
      },
      {
        title: "Khi có nhiều bạn cùng điểm",
        mood: "think",
        blocks: [
          { type: "text", text: "5 bạn được 7 điểm, 8 bạn được 8 điểm, 3 bạn được 10 điểm. Nhân mỗi điểm với số bạn, cộng lại, chia cho tổng số bạn (16)." },
          { type: "example", problem: "Điểm trung bình của 16 bạn", steps: ["7 × 5 + 8 × 8 + 10 × 3 = 129", "129 : 16 = 8,0625", "Làm tròn: 8,06"], keys: ["LP", "7", "MUL", "5", "ADD", "8", "MUL", "8", "ADD", "1", "0", "MUL", "3", "RP", "DIV", "1", "6", "EQ"], answer: "≈ 8,06" },
        ],
      },
      {
        title: "Biểu đồ hình quạt",
        mood: "wow",
        blocks: [
          { type: "text", text: "Biểu đồ hình quạt cho biết mỗi phần chiếm bao nhiêu phần trăm cả hình tròn. 12 trong 40 bạn thích bóng đá thì chiếm **12 : 40 × 100 = 30%**." },
          { type: "keys", keys: ["1", "2", "DIV", "4", "0", "MUL", "1", "0", "0", "EQ"], result: "30", label: "12 : 40 × 100", tryIt: true },
          { type: "check", question: { id: "l7-06-c1", topic: "l7-trung-binh", kind: "number", unit: "%", prompt: "9 trong 36 bạn thích cầu lông. Phần cầu lông chiếm bao nhiêu phần trăm?", answer: "25", keys: ["9", "DIV", "3", "6", "MUL", "1", "0", "0", "EQ"] } },
        ],
      },
    ],
  },
];
