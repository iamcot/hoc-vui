import type { Lesson } from "@/content/types";
import { PRACTICE } from "./practice";

/**
 * Trình độ lớp 9: dùng Casio fx-580VN X cho Toán 9 (GDPT 2018).
 * Chủ đề: căn bậc hai và căn bậc ba, hệ phương trình bậc nhất hai ẩn,
 * phương trình bậc hai, tỉ số lượng giác, đường tròn, hình trụ, nón, cầu.
 */
export const LESSONS: Lesson[] = [
  {
    id: "l9-can",
    title: "Căn bậc hai, căn bậc ba",
    short: "Phím ∛, nhân các căn, dạng a√b và S⇔D",
    emoji: "🌳",
    cover: "fx9-l01-cover",
    minutes: 7,
    practice: PRACTICE["l9-can"],
    slides: [
      {
        title: "Chào mừng lên lớp 9!",
        mood: "cheer",
        voice: "vo9-l01",
        blocks: [
          { type: "image", asset: "fx9-l01-cover" },
          { type: "text", text: "Lớp 9 gặp lại căn bậc hai và thêm **căn bậc ba**: ∛a là số mà lập phương lên bằng a. Ví dụ ∛125 = 5 vì 5³ = 125. Căn bậc ba của số âm vẫn có: ∛(−8) = −2." },
        ],
      },
      {
        title: "Phím căn bậc ba",
        mood: "happy",
        blocks: [
          { type: "text", text: "∛ là chữ vàng trên phím **√▯**: bấm **SHIFT** rồi **√▯**." },
          { type: "keys", keys: ["SHIFT", "SQRT:∛▯", "1", "2", "5", "EQ"], result: "5", label: "∛125", tryIt: true },
        ],
      },
      {
        title: "Nhân căn và dạng a√b",
        mood: "wow",
        blocks: [
          { type: "text", text: "√a · √b = √(a·b). Nhớ bấm **▶** để ra khỏi căn thứ nhất. Kết quả không tròn thì Xi Xi viết gọn kiểu **2√3**, bấm **S⇔D** để ra số thập phân." },
          { type: "keys", keys: ["SQRT", "8", "RIGHT", "MUL", "SQRT", "2", "EQ"], result: "4", label: "√8 · √2", tryIt: true },
          { type: "keys", keys: ["SQRT", "1", "2", "EQ", "SD"], result: "3.464101615", label: "√12 = 2√3, bấm S⇔D" },
          { type: "check", question: { id: "l9-01-c1", topic: "l9-can", kind: "number", prompt: "Tính ∛(−64)", answer: "-4", keys: ["SHIFT", "SQRT:∛▯", "NEG", "6", "4", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l9-he-pt",
    title: "Hệ hai phương trình",
    short: "Hệ bậc nhất hai ẩn, công thức tính nhanh x và y",
    emoji: "🧩",
    cover: "fx9-l02-cover",
    minutes: 9,
    practice: PRACTICE["l9-he-pt"],
    slides: [
      {
        title: "Hai manh mối, hai ẩn số",
        mood: "think",
        voice: "vo9-l02",
        blocks: [
          { type: "image", asset: "fx9-l02-cover" },
          { type: "text", text: "Hệ **a₁x + b₁y = c₁** và **a₂x + b₂y = c₂** giống hai manh mối cùng chỉ về một cặp (x; y). Ở lớp em sẽ học cách thế và cách cộng đại số. Xi Xi giúp tính nhanh và kiểm tra." },
        ],
      },
      {
        title: "Công thức tính x",
        mood: "happy",
        blocks: [
          { type: "text", text: "**x = (c₁b₂ − c₂b₁) : (a₁b₂ − a₂b₁)**. Có x rồi thay vào một phương trình để tìm y. Số âm nhớ để trong ngoặc." },
          { type: "example", problem: "Giải hệ 2x + y = 7 và x − y = −1", steps: ["x = (7·(−1) − (−1)·1) : (2·(−1) − 1·1)", "x = (−6) : (−3) = 2", "Thay vào 2x + y = 7: y = 3"], answer: "(x; y) = (2; 3)" },
          { type: "keys", keys: ["LP", "7", "MUL", "LP", "NEG", "1", "RP", "SUB", "LP", "NEG", "1", "RP", "MUL", "1", "RP", "DIV", "LP", "2", "MUL", "LP", "NEG", "1", "RP", "SUB", "1", "MUL", "1", "RP", "EQ"], result: "2", label: "Tính x", tryIt: true },
        ],
      },
      {
        title: "Thử lại cho chắc",
        mood: "wow",
        blocks: [
          { type: "tip", text: "Thay (x; y) vào **cả hai** phương trình. Đúng cả hai mới là nghiệm. Nếu a₁b₂ − a₂b₁ = 0 thì hệ vô nghiệm hoặc vô số nghiệm." },
          { type: "check", question: { id: "l9-02-c1", topic: "l9-he-pt", kind: "pair", pairLabels: ["x", "y"], prompt: "Giải hệ: x + y = 10 và x − y = 4", answer: "7;3", keys: ["LP", "1", "0", "MUL", "LP", "NEG", "1", "RP", "SUB", "4", "MUL", "1", "RP", "DIV", "LP", "1", "MUL", "LP", "NEG", "1", "RP", "SUB", "1", "MUL", "1", "RP", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l9-pt-bac-hai",
    title: "Phương trình bậc hai",
    short: "Biệt thức Δ, công thức nghiệm, hệ thức Vi-ét",
    emoji: "🎢",
    cover: "fx9-l03-cover",
    minutes: 9,
    practice: PRACTICE["l9-pt-bac-hai"],
    slides: [
      {
        title: "Delta quyết định tất cả",
        mood: "think",
        voice: "vo9-l03",
        blocks: [
          { type: "image", asset: "fx9-l03-cover" },
          { type: "text", text: "Với **ax² + bx + c = 0**, tính **Δ = b² − 4ac**. Δ > 0: hai nghiệm phân biệt. Δ = 0: nghiệm kép. Δ < 0: vô nghiệm." },
          { type: "keys", keys: ["3", "POW2", "SUB", "4", "MUL", "2", "MUL", "LP", "NEG", "5", "RP", "EQ"], result: "49", label: "Δ của 2x² + 3x − 5 = 0", tryIt: true },
        ],
      },
      {
        title: "Công thức nghiệm",
        mood: "happy",
        blocks: [
          { type: "text", text: "**x₁ = (−b + √Δ) : 2a**, **x₂ = (−b − √Δ) : 2a**. Bấm cả biểu thức một lần, nhớ ▶ để ra khỏi căn trước khi đóng ngoặc." },
          { type: "keys", keys: ["LP", "5", "ADD", "SQRT", "LP", "NEG", "5", "RP", "POW2", "SUB", "4", "MUL", "6", "RIGHT", "RP", "DIV", "2", "EQ"], result: "3", label: "x² − 5x + 6 = 0: x₁ = (5 + √Δ) : 2", tryIt: true },
        ],
      },
      {
        title: "Vi-ét: nhẩm nghiệm",
        mood: "wow",
        blocks: [
          { type: "text", text: "Nếu có hai nghiệm: **x₁ + x₂ = −b/a** và **x₁ · x₂ = c/a**. Với x² − 5x + 6 = 0: tổng 5, tích 6, nên hai nghiệm là 2 và 3." },
          { type: "check", question: { id: "l9-03-c1", topic: "l9-pt-bac-hai", kind: "pair", pairLabels: ["x₁ (lớn hơn)", "x₂"], prompt: "Giải phương trình x² − 2x − 8 = 0", answer: "4;-2", keys: ["LP", "2", "ADD", "SQRT", "LP", "NEG", "2", "RP", "POW2", "SUB", "4", "MUL", "LP", "NEG", "8", "RP", "RIGHT", "RP", "DIV", "2", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l9-luong-giac",
    title: "Tỉ số lượng giác",
    short: "sin, cos, tan của góc nhọn, tính cạnh và góc",
    emoji: "🪜",
    cover: "fx9-l04-cover",
    minutes: 9,
    practice: PRACTICE["l9-luong-giac"],
    slides: [
      {
        title: "Đối, kề, huyền",
        mood: "think",
        voice: "vo9-l04",
        blocks: [
          { type: "image", asset: "fx9-l04-cover" },
          { type: "text", text: "Trong tam giác vuông, với góc nhọn α: **sin α = đối : huyền**, **cos α = kề : huyền**, **tan α = đối : kề**. Mẹo nhớ: \"Sin đi học, Cos không hư, Tan đoàn kết\"." },
        ],
      },
      {
        title: "Tính sin, cos, tan",
        mood: "happy",
        blocks: [
          { type: "text", text: "Kiểm tra máy đang ở đơn vị **độ**: góc trên màn hình có chữ **D** nhỏ. Bấm **sin**, gõ góc, đóng ngoặc." },
          { type: "keys", keys: ["SIN", "3", "0", "RP", "EQ"], result: "1/2", label: "sin 30°", tryIt: true },
          { type: "keys", keys: ["6", "MUL", "SIN", "6", "0", "RP", "EQ", "SD"], result: "5.196152423", label: "Thang 6 m nghiêng 60°: đầu thang cao 6 · sin 60°" },
        ],
      },
      {
        title: "Tìm góc khi biết cạnh",
        mood: "wow",
        blocks: [
          { type: "text", text: "Biết sin α thì tìm α bằng **sin⁻¹**: chữ vàng trên phím sin, bấm **SHIFT** rồi **sin**." },
          { type: "keys", keys: ["SHIFT", "SIN:sin⁻¹", "3", "DIV", "5", "RP", "EQ"], result: "36.86989765", label: "sin α = 3/5 thì α ≈ 37°", tryIt: true },
          { type: "check", question: { id: "l9-04-c1", topic: "l9-luong-giac", kind: "number", tolerance: 0.006, prompt: "Tính cos 40° (làm tròn đến hàng phần trăm)", answer: "0.77", keys: ["COS", "4", "0", "RP", "EQ"] } },
        ],
      },
    ],
  },
  {
    id: "l9-duong-tron",
    title: "Đường tròn",
    short: "Phím π, chu vi, diện tích, cung và hình quạt",
    emoji: "🍕",
    cover: "fx9-l05-cover",
    minutes: 8,
    practice: PRACTICE["l9-duong-tron"],
    slides: [
      {
        title: "Số π thần kỳ",
        mood: "wow",
        voice: "vo9-l05",
        blocks: [
          { type: "image", asset: "fx9-l05-cover" },
          { type: "text", text: "Chu vi đường tròn chia cho đường kính luôn ra **π ≈ 3,14159...** Trên Xi Xi, π là chữ vàng trên phím **×10ˣ**: bấm **SHIFT** rồi **×10ˣ**." },
        ],
      },
      {
        title: "Chu vi và diện tích",
        mood: "happy",
        blocks: [
          { type: "text", text: "**C = 2πR**, **S = πR²**. Máy giữ kết quả dạng 10π cho chính xác, bấm **S⇔D** để ra số thập phân." },
          { type: "keys", keys: ["2", "SHIFT", "EXP:π", "MUL", "5", "EQ", "SD"], result: "31.41592654", label: "Chu vi, R = 5 cm", tryIt: true },
          { type: "keys", keys: ["SHIFT", "EXP:π", "MUL", "5", "POW2", "EQ", "SD"], result: "78.53981634", label: "Diện tích, R = 5 cm" },
        ],
      },
      {
        title: "Cung tròn và hình quạt",
        mood: "think",
        blocks: [
          { type: "text", text: "Cung n°: **l = πRn : 180**. Hình quạt n°: **S = πR²n : 360**. Một miếng pizza 60° là 1/6 cái bánh." },
          { type: "check", question: { id: "l9-05-c1", topic: "l9-duong-tron", kind: "number", unit: "cm", tolerance: 0.006, prompt: "Độ dài cung 60° của đường tròn bán kính 6 cm (làm tròn đến hàng phần trăm)", answer: "6.28", keys: ["SHIFT", "EXP:π", "MUL", "6", "MUL", "6", "0", "DIV", "1", "8", "0", "EQ", "SD"] } },
        ],
      },
    ],
  },
  {
    id: "l9-hinh-khoi",
    title: "Hình trụ, hình nón, hình cầu",
    short: "Thể tích và diện tích các hình khối tròn",
    emoji: "🥫",
    cover: "fx9-l06-cover",
    minutes: 8,
    practice: PRACTICE["l9-hinh-khoi"],
    slides: [
      {
        title: "Lon nước, que kem, quả bóng",
        mood: "happy",
        voice: "vo9-l06",
        blocks: [
          { type: "image", asset: "fx9-l06-cover" },
          { type: "text", text: "**Hình trụ** V = πr²h. **Hình nón** V = πr²h : 3, đúng một phần ba hình trụ cùng đáy, cùng cao. **Hình cầu** V = 4/3·πr³, diện tích mặt cầu S = 4πr²." },
        ],
      },
      {
        title: "Bấm thể tích hình trụ",
        mood: "think",
        blocks: [
          { type: "keys", keys: ["SHIFT", "EXP:π", "MUL", "3", "POW2", "MUL", "1", "0", "EQ", "SD"], result: "282.7433388", label: "Lon nước r = 3 cm, h = 10 cm", tryIt: true },
          { type: "tip", text: "Lập phương r³ là chữ vàng trên phím x²: bấm **SHIFT** rồi **x²**." },
        ],
      },
      {
        title: "Quả bóng hình cầu",
        mood: "wow",
        blocks: [
          { type: "keys", keys: ["4", "FRAC", "3", "RIGHT", "SHIFT", "EXP:π", "MUL", "3", "SHIFT", "POW2:x³", "EQ", "SD"], result: "113.0973355", label: "Quả bóng r = 3 cm: 4/3·π·3³", tryIt: true },
          { type: "check", question: { id: "l9-06-c1", topic: "l9-hinh-khoi", kind: "number", unit: "cm³", tolerance: 0.006, prompt: "Thể tích hình nón bán kính đáy 3 cm, cao 10 cm (làm tròn đến hàng phần trăm)", answer: "94.25", keys: ["SHIFT", "EXP:π", "MUL", "3", "POW2", "MUL", "1", "0", "DIV", "3", "EQ", "SD"] } },
        ],
      },
    ],
  },
];
