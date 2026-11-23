import type { Lesson } from "@/content/types";
import { PRACTICE } from "./practice";

/**
 * Nội dung 10 bài: dùng máy tính Casio fx-580VN X cho Toán 6 (GDPT 2018).
 * Nhân vật dẫn chuyện: Mochi (mèo trắng nhỏ) và cây máy tính "Xi Xi".
 * Ảnh: mỗi id (vd. "fx-l01-s1") có prompt trong src/content/assets.ts.
 */
export const LESSONS: Lesson[] = [
  {
    id: "lam-quen",
    title: "Làm quen với Xi Xi",
    short: "Bật máy, các vùng phím, SHIFT và ALPHA",
    emoji: "👋",
    cover: "fx-l01-cover",
    minutes: 6,
    practice: PRACTICE["lam-quen"],
    slides: [
      {
        title: "Chào em, tớ là Mochi!",
        mood: "happy",
        voice: "vo-l01-s1",
        blocks: [
          { type: "image", asset: "fx-l01-s1" },
          { type: "text", text: "Đây là bạn đồng hành mới của chúng mình: máy tính **Casio fx-580VN X**. Tớ gọi bạn ấy là **Xi Xi**. Xi Xi tính rất nhanh, nhưng chỉ làm đúng khi **em bấm đúng**. Cùng làm quen nhé!" },
        ],
      },
      {
        title: "Bật, tắt và xóa",
        mood: "think",
        voice: "vo-l01-s2",
        blocks: [
          { type: "keys", keys: ["ON"], label: "Bật máy" },
          { type: "keys", keys: ["SHIFT", "AC:OFF"], label: "Tắt máy" },
          { type: "text", text: "**AC** xóa hết để làm phép tính mới. **DEL** chỉ xóa một ký tự ngay trước con trỏ, dùng khi em lỡ gõ sai một chữ số." },
          { type: "tip", text: "Nếu để yên vài phút, Xi Xi tự tắt để tiết kiệm pin. Bấm ON là bật lại, không mất gì đâu." },
        ],
      },
      {
        title: "Chữ vàng, chữ đỏ",
        mood: "wow",
        voice: "vo-l01-s3",
        blocks: [
          { type: "image", asset: "fx-l01-s3" },
          { type: "text", text: "Nhìn kỹ, phía trên nhiều phím có chữ nhỏ màu **vàng** và màu **đỏ**. Đó là chức năng thứ hai và thứ ba của phím." },
          { type: "text", text: "Muốn dùng chữ vàng: bấm **SHIFT** trước. Muốn dùng chữ đỏ: bấm **ALPHA** trước. Ví dụ phím **×** có chữ đỏ **GCD** (tìm ƯCLN), em sẽ học ở bài 6." },
          { type: "keys", keys: ["ANS:%"], label: "Phím Ans có chữ vàng % ở trên" },
        ],
      },
      {
        title: "Đưa Xi Xi về như mới",
        mood: "think",
        voice: "vo-l01-s4",
        blocks: [
          { type: "text", text: "Nếu máy đang hiện chữ lạ, kết quả ra kiểu khác thường (do ai đó đổi cài đặt), em có thể đưa máy về cài đặt gốc:" },
          { type: "keys", keys: ["SHIFT", "9:RESET", "3", "EQ", "AC"], label: "Khôi phục cài đặt gốc (Initialize All)" },
          { type: "tip", tone: "warn", text: "Thao tác này xóa cả số đã lưu trong bộ nhớ. Chỉ làm khi cần nhé." },
          { type: "text", text: "Sau khi khôi phục, máy ở chế độ **Tính toán** (Calculate) và hiển thị kiểu sách giáo khoa (phân số, căn, lũy thừa hiện đúng như viết tay). Đây là chế độ mình dùng cho cả khóa học." },
        ],
      },
      {
        title: "Phép tính đầu tiên",
        mood: "cheer",
        voice: "vo-l01-s5",
        blocks: [
          { type: "text", text: "Thử bấm theo tớ nhé: **125 + 378**. Em chạm vào các phím trên Xi Xi ảo theo đúng thứ tự (phím cần bấm sẽ sáng lên), hoặc chọn “Máy thật” để bấm trên máy của em." },
          { type: "keys", keys: ["125", "ADD", "378", "EQ"], result: "503", tryIt: true },
          { type: "text", text: "Phím **=** cho ra kết quả. Kết quả vừa tính được Xi Xi nhớ trong phím **Ans**, dùng tiếp được cho phép tính sau." },
          { type: "check", question: { id: "l01-c1", topic: "lam-quen", kind: "choice", prompt: "Em lỡ gõ 1258 thay vì 125. Cách sửa nhanh nhất?", answer: "Bấm DEL một lần", choices: ["Bấm DEL một lần", "Bấm AC rồi gõ lại cả phép tính", "Tắt máy rồi bật lại"] } },
        ],
      },
    ],
  },
  {
    id: "phep-tinh",
    title: "Thứ tự phép tính",
    short: "Nhân chia trước, cộng trừ sau, ngoặc trước tiên",
    emoji: "🧮",
    cover: "fx-l02-cover",
    minutes: 7,
    practice: PRACTICE["phep-tinh"],
    slides: [
      {
        title: "Ai được tính trước?",
        mood: "think",
        voice: "vo-l02-s1",
        blocks: [
          { type: "image", asset: "fx-l02-s1" },
          { type: "text", text: "Trong một biểu thức, các phép tính xếp hàng theo luật:\n1. Trong **ngoặc** trước.\n2. Rồi đến **lũy thừa**.\n3. Rồi **nhân, chia** (từ trái sang phải).\n4. Cuối cùng **cộng, trừ** (từ trái sang phải)." },
          { type: "tip", text: "Xi Xi đã thuộc luật này. Em chỉ cần gõ đúng y như đề bài, kể cả dấu ngoặc." },
        ],
      },
      {
        title: "Không có ngoặc",
        mood: "happy",
        blocks: [
          { type: "example", problem: "Tính 20 + 5 × 4", steps: ["Nhân trước: 5 × 4 = 20", "Cộng sau: 20 + 20 = 40"], keys: ["20", "ADD", "5", "MUL", "4", "EQ"], answer: "40" },
          { type: "tip", tone: "warn", text: "Nhiều bạn tính nhẩm 20 + 5 = 25 rồi × 4 = 100. Sai rồi! Máy tính sẽ cho 40, và máy đúng." },
        ],
      },
      {
        title: "Có ngoặc",
        mood: "wow",
        blocks: [
          { type: "example", problem: "Tính (20 + 5) × 4", steps: ["Trong ngoặc trước: 20 + 5 = 25", "Rồi nhân: 25 × 4 = 100"], keys: ["LP", "20", "ADD", "5", "RP", "MUL", "4", "EQ"], answer: "100" },
          { type: "keys", keys: ["LP", "20", "ADD", "5", "RP", "MUL", "4", "EQ"], result: "100", tryIt: true, label: "Bấm thử" },
        ],
      },
      {
        title: "Bài toán đi chợ",
        mood: "cheer",
        voice: "vo-l02-s4",
        blocks: [
          { type: "image", asset: "fx-l02-s4" },
          { type: "text", text: "Mẹ mua 3 kg cam, mỗi kg 25 000 đồng và 2 bó rau, mỗi bó 8 000 đồng. Mẹ trả bao nhiêu tiền?" },
          { type: "example", problem: "3 × 25 000 + 2 × 8 000", steps: ["Viết thành một biểu thức", "Gõ liền vào máy, không cần tính từng phần"], keys: ["3", "MUL", "25000", "ADD", "2", "MUL", "8000", "EQ"], answer: "91 000 đồng" },
          { type: "check", question: { id: "l02-c1", topic: "phep-tinh", kind: "number", prompt: "Tính 100 − 36 ÷ 4", answer: "91", keys: ["100", "SUB", "36", "DIV", "4", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "luy-thua",
    title: "Lũy thừa thần tốc",
    short: "Bình phương, lập phương, lũy thừa bậc n",
    emoji: "🚀",
    cover: "fx-l03-cover",
    minutes: 6,
    practice: PRACTICE["luy-thua"],
    slides: [
      {
        title: "Lũy thừa là gì?",
        mood: "think",
        voice: "vo-l03-s1",
        blocks: [
          { type: "image", asset: "fx-l03-s1" },
          { type: "text", text: "**aⁿ** là tích của **n** thừa số **a**. Ví dụ 2⁵ = 2 × 2 × 2 × 2 × 2 = 32. Số **a** là cơ số, số **n** là số mũ." },
          { type: "text", text: "a² đọc là **a bình phương**, a³ đọc là **a lập phương**." },
        ],
      },
      {
        title: "Ba phím lũy thừa",
        mood: "happy",
        blocks: [
          { type: "keys", keys: ["17", "POW2", "EQ"], result: "289", label: "17² dùng phím x²" },
          { type: "keys", keys: ["6", "SHIFT", "POW2:x³", "EQ"], result: "216", label: "6³ dùng SHIFT x² (chữ vàng x³)" },
          { type: "keys", keys: ["2", "POW", "10", "RIGHT", "EQ"], result: "1024", label: "2¹⁰ dùng phím x^▯" },
          { type: "tip", text: "Với x^▯, sau khi gõ số mũ em bấm ▶ để con trỏ ra khỏi ô số mũ, rồi mới gõ tiếp phép tính khác." },
        ],
      },
      {
        title: "Lũy thừa trong biểu thức",
        mood: "wow",
        blocks: [
          { type: "example", problem: "Tính 3⁴ − 2³ × 5", steps: ["Lũy thừa trước: 3⁴ = 81, 2³ = 8", "Nhân: 8 × 5 = 40", "Trừ: 81 − 40 = 41"], keys: ["3", "POW", "4", "RIGHT", "SUB", "2", "SHIFT", "POW2:x³", "MUL", "5", "EQ"], answer: "41" },
          { type: "keys", keys: ["3", "POW", "4", "RIGHT", "SUB", "2", "SHIFT", "POW2:x³", "MUL", "5", "EQ"], result: "41", tryIt: true },
        ],
      },
      {
        title: "Đố vui",
        mood: "cheer",
        blocks: [
          { type: "text", text: "Một tờ giấy gấp đôi 1 lần được 2 lớp, gấp đôi 2 lần được 4 lớp. Gấp đôi 8 lần được bao nhiêu lớp?" },
          { type: "check", question: { id: "l03-c1", topic: "luy-thua", kind: "number", prompt: "Gấp đôi 8 lần được bao nhiêu lớp giấy?", answer: "256", keys: ["2", "POW", "8", "RIGHT", "EQ"], explain: "2⁸ = 256" } },
        ],
      },
    ],
  },
  {
    id: "chia-du",
    title: "Chia có dư và chia hết",
    short: "Phép ÷R cho thương và số dư cùng lúc",
    emoji: "🍬",
    cover: "fx-l04-cover",
    minutes: 7,
    practice: PRACTICE["chia-du"],
    slides: [
      {
        title: "Chia kẹo cho cả lớp",
        mood: "think",
        voice: "vo-l04-s1",
        blocks: [
          { type: "image", asset: "fx-l04-s1" },
          { type: "text", text: "Có 100 cái kẹo chia đều cho 7 bạn. Mỗi bạn được mấy cái, còn thừa mấy cái?" },
          { type: "text", text: "Ta viết **100 = 7 × 14 + 2**. Thương là **14**, số dư là **2**. Số dư luôn nhỏ hơn số chia." },
        ],
      },
      {
        title: "Phép chia ÷R",
        mood: "wow",
        blocks: [
          { type: "text", text: "Phím **phân số ▯/▯** có chữ đỏ **÷R** (R là viết tắt của remainder, nghĩa là số dư). Bấm **ALPHA** rồi phím đó để dùng." },
          { type: "keys", keys: ["100", "ALPHA", "FRAC:÷R", "7", "EQ"], result: "Q=14  R=2", tryIt: true },
          { type: "tip", text: "Màn hình hiện Q là thương, R là số dư." },
        ],
      },
      {
        title: "Kiểm tra chia hết",
        mood: "happy",
        blocks: [
          { type: "text", text: "a **chia hết** cho b khi số dư bằng **0**. Dùng ÷R là biết ngay!" },
          { type: "example", problem: "4 725 có chia hết cho 9 không?", steps: ["Bấm 4725 ÷R 9 =", "Màn hình: Q=525, R=0", "Số dư 0 nên 4 725 chia hết cho 9"], keys: ["4725", "ALPHA", "FRAC:÷R", "9", "EQ"], answer: "Có" },
          { type: "tip", text: "Nhớ cả dấu hiệu chia hết nhé: chia hết cho 2 khi tận cùng chẵn, cho 5 khi tận cùng 0 hoặc 5, cho 3 (hoặc 9) khi tổng các chữ số chia hết cho 3 (hoặc 9). Dùng máy để kiểm tra lại." },
        ],
      },
      {
        title: "Thử ngay",
        mood: "cheer",
        blocks: [
          { type: "check", question: { id: "l04-c1", topic: "chia-du", kind: "pair", pairLabels: ["Thương", "Số dư"], prompt: "Xếp 250 học sinh lên các xe 45 chỗ. Đầy được mấy xe, còn lại mấy bạn?", answer: "5;25", keys: ["250", "ALPHA", "FRAC:÷R", "45", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "thua-so",
    title: "Thám tử số nguyên tố",
    short: "Phân tích ra thừa số nguyên tố với FACT",
    emoji: "🔍",
    cover: "fx-l05-cover",
    minutes: 7,
    practice: PRACTICE["thua-so"],
    slides: [
      {
        title: "Số nguyên tố là gì?",
        mood: "think",
        voice: "vo-l05-s1",
        blocks: [
          { type: "image", asset: "fx-l05-s1" },
          { type: "text", text: "**Số nguyên tố** là số tự nhiên lớn hơn 1, chỉ có hai ước là **1** và **chính nó**. Ví dụ: 2, 3, 5, 7, 11, 13..." },
          { type: "text", text: "Số lớn hơn 1 có nhiều hơn hai ước gọi là **hợp số**, ví dụ 4, 6, 9, 12. Số 0 và 1 không phải số nguyên tố, cũng không phải hợp số." },
        ],
      },
      {
        title: "Phép thuật FACT",
        mood: "wow",
        blocks: [
          { type: "text", text: "Mọi hợp số đều viết được thành tích các số nguyên tố. Xi Xi làm việc này bằng **FACT** (chữ vàng trên phím ° ' \")." },
          { type: "keys", keys: ["360", "EQ", "SHIFT", "DEG:FACT"], result: "2³ × 3² × 5", tryIt: true },
          { type: "tip", text: "Phải bấm = trước để số hiện thành kết quả, sau đó mới bấm SHIFT và phím FACT." },
        ],
      },
      {
        title: "Kiểm tra số nguyên tố",
        mood: "happy",
        blocks: [
          { type: "example", problem: "143 có phải số nguyên tố không?", steps: ["Bấm 143 = rồi SHIFT FACT", "Màn hình: 11 × 13", "143 có thêm ước 11 và 13, nên là hợp số"], keys: ["143", "EQ", "SHIFT", "DEG:FACT"], answer: "Không, 143 là hợp số" },
          { type: "tip", text: "Nếu FACT chỉ hiện lại đúng số đó, thì đó là số nguyên tố." },
          { type: "check", question: { id: "l05-c1", topic: "thua-so", kind: "choice", prompt: "Phân tích 84 ra thừa số nguyên tố", answer: "2² × 3 × 7", choices: ["2² × 3 × 7", "2 × 42", "4 × 3 × 7", "2³ × 7"], keys: ["84", "EQ", "SHIFT", "DEG:FACT"] } },
        ],
      },
    ],
  },
  {
    id: "ucln-bcnn",
    title: "ƯCLN và BCNN",
    short: "GCD, LCM và các bài toán chia quà, hẹn giờ",
    emoji: "🎁",
    cover: "fx-l06-cover",
    minutes: 8,
    practice: PRACTICE["ucln-bcnn"],
    slides: [
      {
        title: "Hai người bạn GCD và LCM",
        mood: "happy",
        voice: "vo-l06-s1",
        blocks: [
          { type: "image", asset: "fx-l06-s1" },
          { type: "text", text: "**ƯCLN** (ước chung lớn nhất), tiếng Anh là **GCD**. **BCNN** (bội chung nhỏ nhất), tiếng Anh là **LCM**." },
          { type: "text", text: "Trên Xi Xi: **GCD** là chữ đỏ trên phím **×**, **LCM** là chữ đỏ trên phím **÷**. Dấu phẩy ngăn hai số là chữ vàng trên phím **)**." },
        ],
      },
      {
        title: "Tìm ƯCLN",
        mood: "think",
        blocks: [
          { type: "keys", keys: ["ALPHA", "MUL:GCD", "24", "SHIFT", "RP:,", "36", "RP", "EQ"], result: "12", label: "ƯCLN(24, 36)", tryIt: true },
        ],
      },
      {
        title: "Tìm BCNN",
        mood: "think",
        blocks: [
          { type: "keys", keys: ["ALPHA", "DIV:LCM", "12", "SHIFT", "RP:,", "18", "RP", "EQ"], result: "36", label: "BCNN(12, 18)", tryIt: true },
          { type: "tip", text: "Ba số? Lồng vào nhau: ƯCLN(a, b, c) = ƯCLN(ƯCLN(a, b), c). BCNN cũng vậy." },
        ],
      },
      {
        title: "Khi nào dùng cái nào?",
        mood: "wow",
        voice: "vo-l06-s4",
        blocks: [
          { type: "image", asset: "fx-l06-s4" },
          { type: "text", text: "**Chia đều, nhiều phần nhất, lớn nhất** → nghĩ đến **ƯCLN**.\n**Cùng lặp lại, gặp nhau lần tới, ít nhất** → nghĩ đến **BCNN**." },
          { type: "example", problem: "Có 48 quả cam và 60 quả quýt, chia đều vào các giỏ, mỗi giỏ có cả cam và quýt. Nhiều nhất bao nhiêu giỏ?", steps: ["Số giỏ chia hết cả 48 và 60, lớn nhất", "ƯCLN(48, 60) = 12"], keys: ["ALPHA", "MUL:GCD", "48", "SHIFT", "RP:,", "60", "RP", "EQ"], answer: "12 giỏ" },
          { type: "example", problem: "Hai đèn nháy: đèn xanh 4 giây nháy một lần, đèn đỏ 6 giây. Cùng nháy lúc đầu, sau ít nhất mấy giây lại cùng nháy?", steps: ["Thời gian là bội chung của 4 và 6, nhỏ nhất", "BCNN(4, 6) = 12"], keys: ["ALPHA", "DIV:LCM", "4", "SHIFT", "RP:,", "6", "RP", "EQ"], answer: "12 giây" },
        ],
      },
    ],
  },
  {
    id: "so-nguyen",
    title: "Thế giới số âm",
    short: "Phím (−), cộng trừ nhân chia số nguyên",
    emoji: "🌡️",
    cover: "fx-l07-cover",
    minutes: 6,
    practice: PRACTICE["so-nguyen"],
    slides: [
      {
        title: "Số âm ở quanh ta",
        mood: "think",
        voice: "vo-l07-s1",
        blocks: [
          { type: "image", asset: "fx-l07-s1" },
          { type: "text", text: "Nhiệt độ dưới 0°C, độ sâu dưới mực nước biển, số tiền nợ... đều dùng **số nguyên âm** như −3, −15." },
        ],
      },
      {
        title: "Hai dấu trừ khác nhau",
        mood: "wow",
        blocks: [
          { type: "text", text: "Xi Xi có **hai** phím trông giống dấu trừ:\n• **(−)**: dấu âm, đứng trước một số, như −5.\n• **−**: phép trừ, đứng giữa hai số, như 8 − 5." },
          { type: "keys", keys: ["NEG", "8", "ADD", "3", "EQ"], result: "−5", label: "(−8) + 3", tryIt: true },
          { type: "tip", tone: "warn", text: "Nếu bấm phép trừ ở đầu, máy hiểu là lấy kết quả trước (Ans) trừ đi. Số âm thì luôn dùng (−)." },
        ],
      },
      {
        title: "Quy tắc dấu",
        mood: "happy",
        blocks: [
          { type: "text", text: "Nhân, chia hai số **cùng dấu** → kết quả **dương**.\nNhân, chia hai số **khác dấu** → kết quả **âm**." },
          { type: "keys", keys: ["NEG", "6", "MUL", "NEG", "7", "EQ"], result: "42", label: "(−6) × (−7)" },
          { type: "check", question: { id: "l07-c1", topic: "so-nguyen", kind: "number", prompt: "Một tàu ngầm đang ở độ sâu −120 m, nổi lên thêm 45 m. Tàu ở độ cao nào?", answer: "-75", unit: "m", keys: ["NEG", "120", "ADD", "45", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "phan-so",
    title: "Phân số dễ ợt",
    short: "Nhập phân số, rút gọn, hỗn số, đổi sang thập phân",
    emoji: "🍕",
    cover: "fx-l08-cover",
    minutes: 8,
    practice: PRACTICE["phan-so"],
    slides: [
      {
        title: "Chiếc bánh pizza",
        mood: "happy",
        voice: "vo-l08-s1",
        blocks: [
          { type: "image", asset: "fx-l08-s1" },
          { type: "text", text: "Bánh cắt thành 8 miếng, em ăn 3 miếng: em ăn **3/8** cái bánh. Số trên là **tử số**, số dưới là **mẫu số**." },
        ],
      },
      {
        title: "Nhập phân số",
        mood: "think",
        blocks: [
          { type: "text", text: "Gõ tử số, bấm phím **▯/▯**, gõ mẫu số. Bấm **▶** để ra khỏi phân số trước khi gõ tiếp." },
          { type: "keys", keys: ["2", "FRAC", "3", "RIGHT", "ADD", "1", "FRAC", "4", "EQ"], result: "11/12", label: "2/3 + 1/4", tryIt: true },
          { type: "tip", text: "Kết quả luôn được Xi Xi rút gọn về phân số tối giản." },
        ],
      },
      {
        title: "Rút gọn và đổi sang thập phân",
        mood: "wow",
        blocks: [
          { type: "keys", keys: ["18", "FRAC", "24", "EQ"], result: "3/4", label: "Rút gọn 18/24" },
          { type: "keys", keys: ["SD"], result: "0,75", label: "Bấm S⇔D để đổi qua lại phân số và số thập phân" },
        ],
      },
      {
        title: "Hỗn số",
        mood: "think",
        blocks: [
          { type: "text", text: "Hỗn số **2 1/3** nghĩa là 2 + 1/3. Nhập hỗn số bằng **SHIFT** rồi phím **▯/▯** (chữ vàng ▯▯/▯), dùng ▶ để nhảy qua từng ô." },
          { type: "keys", keys: ["SHIFT", "FRAC:▯▯/▯", "2", "RIGHT", "1", "RIGHT", "3", "EQ"], result: "7/3", label: "2 1/3 = 7/3" },
          { type: "keys", keys: ["SHIFT", "SD:a b/c⇔d/c"], result: "2 1/3", label: "Đổi kết quả về hỗn số" },
          { type: "check", question: { id: "l08-c1", topic: "phan-so", kind: "fraction", reduced: true, prompt: "Tính 5/6 − 1/4 (phân số tối giản)", answer: "7/12", keys: ["5", "FRAC", "6", "RIGHT", "SUB", "1", "FRAC", "4", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "phan-tram",
    title: "Thập phân và phần trăm",
    short: "Phép tính số thập phân, làm tròn, tỉ số phần trăm",
    emoji: "🏷️",
    cover: "fx-l09-cover",
    minutes: 8,
    practice: PRACTICE["phan-tram"],
    slides: [
      {
        title: "Dấu chấm hay dấu phẩy?",
        mood: "think",
        voice: "vo-l09-s1",
        blocks: [
          { type: "text", text: "Ở Việt Nam ta viết **3,5** nhưng trên Xi Xi em bấm dấu **.** (chấm). Kết quả máy hiện 3.5 cũng là 3,5 đó." },
          { type: "keys", keys: ["2", "DOT", "5", "MUL", "1", "DOT", "2", "EQ"], result: "3", label: "2,5 × 1,2", tryIt: true },
          { type: "text", text: "Trong app này em gõ dấu phẩy hay dấu chấm đều được." },
        ],
      },
      {
        title: "Làm tròn số",
        mood: "happy",
        blocks: [
          { type: "image", asset: "fx-l09-s2" },
          { type: "text", text: "Làm tròn đến hàng nào, em nhìn chữ số **ngay sau** hàng đó: **từ 5 trở lên** thì cộng 1 vào hàng làm tròn, **nhỏ hơn 5** thì giữ nguyên, rồi bỏ các chữ số phía sau." },
          { type: "example", problem: "Làm tròn 7,863 đến hàng phần mười", steps: ["Hàng phần mười là 8", "Chữ số sau nó là 6 ≥ 5", "Tăng 8 lên 9"], answer: "7,9" },
        ],
      },
      {
        title: "Phím phần trăm",
        mood: "wow",
        blocks: [
          { type: "text", text: "**%** là chữ vàng trên phím **Ans**. Bấm SHIFT rồi Ans." },
          { type: "keys", keys: ["240", "MUL", "15", "SHIFT", "ANS:%", "EQ"], result: "36", label: "15% của 240", tryIt: true },
          { type: "keys", keys: ["12", "DIV", "48", "SHIFT", "ANS:%", "EQ"], result: "25", label: "12 là bao nhiêu phần trăm của 48?" },
        ],
      },
      {
        title: "Đi mua sắm",
        mood: "cheer",
        voice: "vo-l09-s4",
        blocks: [
          { type: "image", asset: "fx-l09-s4" },
          { type: "example", problem: "Đôi giày giá 350 000 đồng, giảm 20%. Giá còn lại bao nhiêu?", steps: ["Số tiền giảm: 350 000 × 20% = 70 000", "Giá còn lại: 350 000 − 70 000 = 280 000", "Hoặc bấm gọn: 350 000 − 350 000 × 20%"], keys: ["350000", "SUB", "350000", "MUL", "20", "SHIFT", "ANS:%", "EQ"], answer: "280 000 đồng" },
          { type: "check", question: { id: "l09-c1", topic: "phan-tram", kind: "number", prompt: "Tính 35% của 600", answer: "210", keys: ["600", "MUL", "35", "SHIFT", "ANS:%", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "hinh-hoc",
    title: "Chu vi và diện tích",
    short: "Hình chữ nhật, vuông, thoi, bình hành, thang",
    emoji: "📐",
    cover: "fx-l10-cover",
    minutes: 9,
    practice: PRACTICE["hinh-hoc"],
    slides: [
      {
        title: "Bảng công thức",
        mood: "think",
        voice: "vo-l10-s1",
        blocks: [
          { type: "image", asset: "fx-l10-s1" },
          { type: "text", text: "• **Hình chữ nhật** dài a, rộng b: chu vi 2 × (a + b), diện tích a × b.\n• **Hình vuông** cạnh a: chu vi 4 × a, diện tích a².\n• **Hình thoi** hai đường chéo m, n: diện tích m × n ÷ 2.\n• **Hình bình hành** đáy a, cao h: diện tích a × h.\n• **Hình thang** hai đáy a, b, cao h: diện tích (a + b) × h ÷ 2." },
        ],
      },
      {
        title: "Gõ cả công thức một lần",
        mood: "happy",
        blocks: [
          { type: "example", problem: "Hình thang có hai đáy 12 m và 8 m, cao 5 m. Tính diện tích.", steps: ["(12 + 8) × 5 ÷ 2", "= 20 × 5 ÷ 2 = 50"], keys: ["LP", "12", "ADD", "8", "RP", "MUL", "5", "DIV", "2", "EQ"], answer: "50 m²" },
          { type: "keys", keys: ["LP", "12", "ADD", "8", "RP", "MUL", "5", "DIV", "2", "EQ"], result: "50", tryIt: true },
        ],
      },
      {
        title: "Bài toán thực tế",
        mood: "wow",
        voice: "vo-l10-s3",
        blocks: [
          { type: "image", asset: "fx-l10-s3" },
          { type: "example", problem: "Sân hình chữ nhật dài 15 m, rộng 8 m. Rào xung quanh, mỗi mét rào giá 120 000 đồng. Hết bao nhiêu tiền?", steps: ["Chu vi: 2 × (15 + 8) = 46 m", "Tiền rào: 46 × 120 000 = 5 520 000 đồng"], keys: ["2", "MUL", "LP", "15", "ADD", "8", "RP", "MUL", "120000", "EQ"], answer: "5 520 000 đồng" },
          { type: "tip", tone: "warn", text: "Đọc kỹ đề: rào xung quanh là **chu vi**, lát nền hay trồng cỏ là **diện tích**. Nhớ ghi đơn vị (m, m²)." },
          { type: "check", question: { id: "l10-c1", topic: "hinh-hoc", kind: "number", prompt: "Hình vuông cạnh 13 cm. Tính diện tích.", answer: "169", unit: "cm²", keys: ["13", "POW2", "EQ"] } },
        ],
      },
    ],
  },
];
