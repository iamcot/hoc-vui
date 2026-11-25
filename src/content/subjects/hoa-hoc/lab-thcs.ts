import type { Lesson } from "@/content/types";
import { identify } from "./nhi";
import { bank } from "./q";

/** Thí nghiệm THCS: trung hoà (lớp 8), kim loại + axit và kim loại đẩy kim loại (lớp 9) */

const has = (log: string[], k: string) => log.includes(k);

export const l8Neutral: Lesson = {
  id: "hh-l8-trunghoa",
  title: "Trung hoà axit – bazơ",
  short: "Nhỏ NaOH vào axit, phenolphtalein báo hiệu",
  emoji: "🧪",
  cover: "hh-cover-l8-trunghoa",
  minutes: 8,
  slides: [],
  lab: {
    experiments: [
      {
        id: "trung-hoa",
        title: "Nhỏ NaOH vào axit HCl",
        emoji: "⚗️",
        intro: "Cốc có 3 liều axit HCl và phenolphtalein (không màu trong axit). Rót từ từ NaOH vào. Con đoán xem khi nào dung dịch đổi màu?",
        vessels: [{ id: "A", shape: "beaker", contents: [["hcl", 3], ["phenol", 1]] }],
        shelf: ["naoh", "hcl"],
        tools: ["ph", "stir"],
        predict: {
          q: "Rót dần NaOH vào axit có phenolphtalein. Dung dịch sẽ thế nào?",
          choices: [{ label: "Hồng ngay từ giọt đầu", color: "#ff4fa8" }, { label: "Không màu, tới khi dư NaOH mới hồng", color: "#eef3ff" }, { label: "Xanh lam", color: "#3f7bff" }],
          answer: 1,
        },
        goal: {
          text: "Rót NaOH vào cốc đến lúc trung hoà (pH = 7), rồi rót thêm một liều để dung dịch hoá hồng.",
          hint: "Bật thước pH để theo dõi. Khi pH = 7 thì axit và bazơ vừa đủ.",
          steps: [
            { text: "Trung hoà", done: (l) => has(l, "neutral:A"), say: "Rót **NaOH** vào cốc **HCl** từng liều một. Bấm **pH** để xem số đo giảm dần về **7**.", chem: "naoh", vessel: "A" },
            { text: "Dư bazơ", done: (l) => has(l, "pink:A"), say: "pH = **7**: vừa đủ trung hoà! Rót thêm **một liều NaOH** xem **phenolphtalein** báo gì.", chem: "naoh", vessel: "A" },
          ],
          done: (l) => has(l, "neutral:A") && has(l, "pink:A"),
        },
        observe: ["Khi còn axit dư, dung dịch không màu", "Ở pH = 7 vẫn không màu (đã vừa đủ)", "Dư một chút NaOH, phenolphtalein hoá hồng"],
        explain: {
          thcs: "Axit tác dụng với bazơ tạo muối và nước: đó là phản ứng trung hoà. 3 liều HCl cần đúng 3 liều NaOH. Còn axit dư thì không màu, dư bazơ thì phenolphtalein hoá hồng, nên màu hồng chính là tín hiệu cho biết đã quá điểm trung hoà.",
          thpt: "Bản chất: H⁺ + OH⁻ → H₂O. Phenolphtalein đổi màu trong khoảng pH 8,2–10 nên báo điểm tương đương rất sát khi chuẩn độ axit mạnh bằng bazơ mạnh.",
        },
        equation: ["HCl", "+", "NaOH", "→", "NaCl", "+", "H₂O"],
        remember: "Axit + bazơ → muối + nước. Đó là phản ứng trung hoà. Phenolphtalein hồng nghĩa là bazơ đang dư.",
        safety: { text: "Không làm ở nhà. HCl và NaOH ăn mòn da, chỉ làm trong phòng thí nghiệm, đeo kính và găng tay.", home: false },
        incidents: { overflow: "tran-coc" },
      },
    ],
    missions: [
      (rng) =>
        identify(
          rng,
          "Cốc nào chứa gì?",
          "3 cốc đựng HCl, nước và NaOH. Dùng phenolphtalein, baking soda và thước pH để biết từng cốc.",
          [["hcl", "HCl (axit)"], ["nuoc", "Nước"], ["naoh", "NaOH (bazơ)"]],
          [["nuoc", 2]],
          ["phenol", "baking-soda"],
          "Cốc này là…",
          ["ph"],
        ),
    ],
  },
  practice: [
    bank("trung-hoa", [
      { prompt: "Phản ứng giữa axit và bazơ gọi là phản ứng", choices: ["Trung hoà", "Phân huỷ", "Hoá hợp", "Thế"] },
      { prompt: "Sản phẩm của phản ứng HCl + NaOH là", choices: ["NaCl và H₂O", "NaCl và H₂", "Na và Cl₂", "NaOH và HCl"] },
      { prompt: "Dung dịch vừa đủ trung hoà (axit mạnh + bazơ mạnh) có pH khoảng", choices: ["7", "1", "13", "3"] },
      { prompt: "Phenolphtalein trong dung dịch axit có màu", choices: ["Không màu", "Hồng", "Đỏ", "Xanh"] },
      { prompt: "Nhỏ NaOH vào HCl có phenolphtalein, dung dịch hoá hồng khi", choices: ["NaOH dư", "HCl dư", "Vừa đủ", "Mới nhỏ giọt đầu tiên"] },
      { prompt: "Thuốc đau dạ dày chứa bazơ để", choices: ["Trung hoà bớt axit trong dạ dày", "Tăng axit dạ dày", "Diệt vi khuẩn trong ruột", "Làm dạ dày co bóp"], explain: "Dạ dày tiết axit HCl; thuốc có bazơ nhẹ (như Mg(OH)₂) trung hoà bớt." },
      { prompt: "Bón vôi (bazơ) vào đất chua nhằm", choices: ["Trung hoà bớt axit trong đất", "Làm đất chua thêm", "Làm đất mặn", "Giữ nước"], explain: "Vôi CaO, Ca(OH)₂ là bazơ trung hoà axit." },
      { prompt: "Cần bao nhiêu mol NaOH để trung hoà vừa đủ 2 mol HCl?", choices: ["2 mol", "1 mol", "4 mol", "0,5 mol"], explain: "HCl + NaOH → NaCl + H₂O: tỉ lệ 1 : 1." },
    ]),
  ],
};

export const l9Acid: Lesson = {
  id: "hh-l9-kl-axit",
  title: "Kim loại gặp axit",
  short: "Kẽm sủi bọt, đồng thì không",
  emoji: "🔘",
  cover: "hh-cover-l9-kl-axit",
  minutes: 8,
  slides: [],
  lab: {
    experiments: [
      {
        id: "kl-axit",
        title: "Kẽm và đồng thả vào HCl",
        emoji: "🫧",
        intro: "Hai cốc HCl giống nhau. Thả viên kẽm vào cốc A, dây đồng vào cốc B. Rồi dùng que đóm thử khí ở cốc A.",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["hcl", 3]] }, { id: "B", shape: "beaker", label: "B", contents: [["hcl", 3]] }],
        shelf: ["zn", "cu"],
        tools: ["splint"],
        predict: { q: "Thả kẽm và đồng vào axit HCl. Kim loại nào sủi bọt khí?", choices: [{ label: "Chỉ kẽm", emoji: "🔘" }, { label: "Chỉ đồng", emoji: "🟤" }, { label: "Cả hai", emoji: "✌️" }], answer: 0 },
        goal: {
          text: "Thả kẽm vào A, đồng vào B, rồi thử khí ở cốc A bằng que đóm.",
          steps: [
            { text: "Kẽm vào A", done: (l) => has(l, "h2:A:zn"), say: "Thả **viên kẽm** vào cốc **A**. Quan sát nào!", chem: "zn", vessel: "A" },
            { text: "Đồng vào B", done: (l) => has(l, "add:B:cu"), say: "Giờ thả **dây đồng** vào cốc **B**. Có sủi bọt không?", chem: "cu", vessel: "B" },
            { text: "Thử khí", done: (l) => has(l, "splint-pop"), say: "Cốc A sủi bọt khí. Chọn cốc **A** rồi bấm **🪵 Que đóm** để thử khí gì.", tool: "splint", vessel: "A" },
          ],
          done: (l) => has(l, "h2:A:zn") && has(l, "nogas:cu") && has(l, "splint-pop"),
        },
        observe: ["Kẽm sủi bọt khí mạnh trong HCl", "Đồng nằm yên, không có bọt khí", "Que đóm gặp khí ở cốc A nổ lách tách nhỏ: đó là khí hiđro"],
        explain: {
          thcs: "Kẽm đứng trước hiđro trong dãy hoạt động hoá học nên đẩy được hiđro khỏi axit, tạo muối kẽm clorua và khí H₂. Đồng đứng sau hiđro nên không phản ứng với HCl loãng.",
          thpt: "Zn bị oxi hoá thành Zn²⁺ (E° = −0,76 V) trong khi H⁺ bị khử thành H₂ (E° = 0). Cu có E° = +0,34 V lớn hơn H⁺/H₂ nên không tự khử được H⁺. Khí H₂ trộn không khí cháy nổ tạo tiếng “póp”.",
        },
        equation: ["Zn", "+", "2HCl", "→", "ZnCl₂", "+", "H₂↑"],
        remember: "Kim loại đứng trước H trong dãy hoạt động đẩy được H₂ khỏi axit. Đồng đứng sau H nên không phản ứng.",
        safety: { text: "Không làm ở nhà. Khí H₂ dễ nổ khi gặp lửa, chỉ thử với lượng rất nhỏ.", home: false },
        incidents: { overflow: "tran-bot" },
      },
    ],
    missions: [
      (rng) =>
        identify(
          rng,
          "Nhận biết bằng kẽm",
          "3 cốc đựng HCl, nước và dung dịch CuSO₄. Thả viên kẽm vào từng cốc để biết là chất nào.",
          [["hcl", "HCl"], ["nuoc", "Nước"], ["cuso4", "CuSO₄ (xanh lam)"]],
          [],
          ["zn"],
          "Cốc này là…",
          [],
        ),
    ],
  },
  practice: [
    bank("kl-axit", [
      { prompt: "Kim loại nào KHÔNG tác dụng với dung dịch HCl loãng?", choices: ["Cu", "Zn", "Fe", "Mg"] },
      { prompt: "Khí sinh ra khi kẽm tác dụng với HCl là", choices: ["H₂", "O₂", "CO₂", "Cl₂"] },
      { prompt: "Khí H₂ khi đưa que đóm đang cháy vào sẽ", choices: ["Nổ lách tách nhỏ", "Làm que đóm tắt", "Làm que đóm bùng sáng", "Không có gì"] },
      { prompt: "Zn + 2HCl → ? + H₂. Chất còn thiếu là", choices: ["ZnCl₂", "ZnCl", "Zn₂Cl", "ZnH₂"] },
      { prompt: "Vì sao đồng không phản ứng với HCl loãng?", choices: ["Đồng đứng sau hiđro trong dãy hoạt động", "Đồng quá nặng", "HCl quá yếu với mọi kim loại", "Đồng đã bị gỉ"] },
      { prompt: "Cho 6,5 g Zn (0,1 mol) tác dụng hết với HCl. Số mol H₂ sinh ra là", choices: ["0,1 mol", "0,2 mol", "0,05 mol", "6,5 mol"], explain: "Zn + 2HCl → ZnCl₂ + H₂: tỉ lệ Zn : H₂ = 1 : 1." },
      { prompt: "Dãy nào xếp đúng theo thứ tự hoạt động giảm dần?", choices: ["Mg, Zn, Fe, Cu", "Cu, Fe, Zn, Mg", "Fe, Mg, Cu, Zn", "Zn, Mg, Cu, Fe"] },
      { prompt: "Kim loại đứng trước H trong dãy hoạt động thì", choices: ["Đẩy được H₂ khỏi dung dịch axit", "Không bao giờ phản ứng", "Chỉ phản ứng với nước", "Chỉ phản ứng khi nung"] },
    ]),
  ],
};

export const l9Displace: Lesson = {
  id: "hh-l9-day-the",
  title: "Kim loại đẩy kim loại",
  short: "Đinh sắt vào dung dịch CuSO₄",
  emoji: "🔩",
  cover: "hh-cover-l9-day-the",
  minutes: 8,
  slides: [],
  lab: {
    experiments: [
      {
        id: "sat-dong-sunfat",
        title: "Sắt, đồng, kẽm vào CuSO₄",
        emoji: "🔵",
        intro: "Ba cốc dung dịch CuSO₄ xanh lam. Thả đinh sắt vào A, dây đồng vào B, viên kẽm vào C. Kim loại nào đẩy được đồng ra?",
        vessels: [
          { id: "A", shape: "beaker", label: "A", contents: [["cuso4", 3]] },
          { id: "B", shape: "beaker", label: "B", contents: [["cuso4", 3]] },
          { id: "C", shape: "beaker", label: "C", contents: [["cuso4", 3]] },
        ],
        shelf: ["fe", "cu", "zn"],
        predict: { q: "Thả đinh sắt vào dung dịch CuSO₄ xanh lam. Điều gì xảy ra?", choices: [{ label: "Có lớp đồng đỏ bám vào, nước nhạt màu", emoji: "🟤" }, { label: "Không có gì", emoji: "😴" }, { label: "Dung dịch sẫm hơn", emoji: "🌑" }], answer: 0 },
        goal: {
          text: "Thả đinh sắt vào A, dây đồng vào B, kẽm vào C.",
          steps: [
            { text: "Sắt vào A", done: (l) => has(l, "displace:A:fe"), say: "Thả **đinh sắt** vào cốc **A**. Nhìn màu dung dịch và đáy cốc!", chem: "fe", vessel: "A" },
            { text: "Đồng vào B", done: (l) => has(l, "add:B:cu"), say: "Thả **dây đồng** vào cốc **B**. Có gì thay đổi không?", chem: "cu", vessel: "B" },
            { text: "Kẽm vào C", done: (l) => has(l, "displace:C:zn"), say: "Cuối cùng thả **viên kẽm** vào cốc **C**.", chem: "zn", vessel: "C" },
          ],
          done: (l) => has(l, "displace:A:fe") && has(l, "add:B:cu") && has(l, "displace:C:zn") && !has(l, "displace:B:cu"),
        },
        observe: ["Cốc A: lớp đồng đỏ bám vào, dung dịch nhạt dần sang xanh lục (muối sắt)", "Cốc B: đồng vào dung dịch muối đồng, không có gì xảy ra", "Cốc C: kẽm cũng đẩy được đồng, dung dịch gần như hết màu xanh"],
        explain: {
          thcs: "Kim loại hoạt động mạnh hơn đẩy được kim loại yếu hơn ra khỏi dung dịch muối. Sắt và kẽm đứng trước đồng nên đẩy được đồng (màu đỏ bám vào). Đồng không tự đẩy chính nó nên cốc B không đổi.",
          thpt: "Fe + Cu²⁺ → Fe²⁺ + Cu: Fe là chất khử mạnh hơn Cu (E°Fe²⁺/Fe = −0,44 V < E°Cu²⁺/Cu = +0,34 V). Màu xanh của Cu²⁺ nhạt dần, Fe²⁺ có màu xanh lục nhạt.",
        },
        equation: ["Fe", "+", "CuSO₄", "→", "FeSO₄", "+", "Cu↓"],
        remember: "Kim loại mạnh hơn đẩy kim loại yếu hơn ra khỏi dung dịch muối: Fe + CuSO₄ → FeSO₄ + Cu.",
        safety: { text: "Làm được với người lớn: đinh sắt sạch ngâm trong dung dịch phèn xanh (CuSO₄) loãng. Không nuốt, rửa tay sau khi làm.", home: false },
        incidents: { overflow: "tran-coc" },
      },
    ],
    missions: [
      (rng) =>
        identify(
          rng,
          "Nhận biết bằng đinh sắt",
          "3 cốc đựng CuSO₄, HCl và nước. Thả đinh sắt vào từng cốc để biết là chất nào.",
          [["cuso4", "CuSO₄ (xanh lam)"], ["hcl", "HCl"], ["nuoc", "Nước"]],
          [],
          ["fe"],
          "Cốc này là…",
          [],
        ),
    ],
  },
  practice: [
    bank("day-the", [
      { prompt: "Đinh sắt vào dung dịch CuSO₄ thì trên đinh có", choices: ["Lớp đồng màu đỏ bám vào", "Lớp kẽm màu trắng", "Khí H₂ sủi lên", "Lớp than đen"] },
      { prompt: "Phản ứng Fe + CuSO₄ → FeSO₄ + Cu thuộc loại", choices: ["Phản ứng thế", "Phản ứng hoá hợp", "Phản ứng phân huỷ", "Phản ứng trung hoà"] },
      { prompt: "Kim loại nào đẩy được đồng khỏi dung dịch CuSO₄?", choices: ["Zn", "Ag", "Au", "Cu"] },
      { prompt: "Đồng có đẩy được sắt khỏi dung dịch FeSO₄ không?", choices: ["Không, đồng yếu hơn sắt", "Có, vì đồng nặng hơn", "Có, nếu đun nóng", "Chỉ khi thêm axit"] },
      { prompt: "Dung dịch CuSO₄ nhạt dần màu xanh khi thả đinh sắt vì", choices: ["Cu²⁺ bị biến thành Cu kim loại", "Nước làm loãng", "Sắt tan thành màu xanh", "Đồng bay hơi"] },
      { prompt: "Zn + CuSO₄ → ? + Cu. Chất còn thiếu là", choices: ["ZnSO₄", "ZnCu", "Zn₂SO₄", "CuZn"] },
      { prompt: "Ngâm 5,6 g Fe (0,1 mol) trong lượng dư CuSO₄. Khối lượng Cu sinh ra tối đa là", choices: ["6,4 g", "5,6 g", "3,2 g", "12,8 g"], explain: "0,1 mol Fe sinh 0,1 mol Cu, 0,1 × 64 = 6,4 g." },
      { prompt: "Ag có đẩy được Cu khỏi dung dịch CuSO₄ không?", choices: ["Không, Ag yếu hơn Cu", "Có, vì Ag nặng hơn", "Có, nếu khuấy mạnh", "Chỉ khi có axit"] },
    ]),
  ],
};
