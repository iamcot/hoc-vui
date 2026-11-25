import type { Lesson, Unit } from "@/content/types";
import { ph } from "@/lib/chem/lab";
import { identify } from "./nhi";
import { balanceBank, bank } from "./q";
import { l8Class, l8Conc, l8Conserve, l8Mol, l9Organic, l9Series, l9Stoich } from "./luyen";

/** Hoá học THCS (lớp 8–9): phản ứng, phương trình, axit bazơ. Giao diện Lab neon, Bit dẫn chuyện */

const has = (log: string[], k: string) => log.includes(k);

const c01: Lesson = {
  id: "hh-c01",
  title: "Phản ứng hoá học",
  short: "Dấu hiệu có chất mới, viết phương trình",
  emoji: "⚗️",
  cover: "hh-cover-c01",
  minutes: 10,
  slides: [],
  lab: {
    experiments: [
      {
        id: "giam-soda",
        title: "Giấm gặp baking soda",
        emoji: "🫧",
        intro: "Rót giấm vào bình có baking soda. Rồi đưa que đóm đang cháy vào miệng bình để thử khí sinh ra.",
        vessels: [{ id: "A", shape: "erlen", contents: [["baking-soda", 2], ["nuoc", 1]] }],
        shelf: ["giam"],
        tools: ["splint", "thermo"],
        predict: { q: "Khí sinh ra khi giấm gặp baking soda làm que đóm đang cháy…", choices: [{ label: "Tắt ngay", emoji: "💨" }, { label: "Cháy sáng hơn", emoji: "🔥" }, { label: "Nổ lách tách", emoji: "💥" }], answer: 0 },
        goal: {
          text: "Rót giấm vào bình, rồi bấm Que đóm khi bình đang sủi bọt.",
          steps: [
            { text: "Sủi bọt", done: (l) => has(l, "fizz"), say: "Rót **giấm** vào bình có **NaHCO₃**. Quan sát hiện tượng.", chem: "giam", vessel: "A" },
            { text: "Thử que đóm", done: (l) => has(l, "splint-out"), say: "Có **khí** thoát ra! Bấm **🪵 Que đóm** để thử xem là khí gì.", tool: "splint" },
          ],
          done: (l) => has(l, "splint-out"),
        },
        observe: ["Sủi bọt khí mạnh", "Que đóm đang cháy bị tắt", "Bình lạnh đi một chút (phản ứng thu nhiệt)"],
        explain: {
          nhi: "Hai bạn gặp nhau sinh ra rất nhiều bong bóng khí. Khí này dập tắt lửa!",
          khtn: "Đã tạo ra chất mới là khí CO₂. Khí CO₂ không duy trì sự cháy nên que đóm tắt.",
          thcs: "Axit axetic trong giấm tác dụng với natri hiđrocacbonat, tạo ra chất mới: muối natri axetat, nước và khí CO₂. Dấu hiệu nhận biết phản ứng: có chất khí thoát ra, nhiệt độ thay đổi.",
          thpt: "Phản ứng axit – bazơ (Brønsted): HCO₃⁻ nhận H⁺ tạo H₂CO₃ kém bền, phân huỷ thành CO₂ và H₂O. 0,42 g NaHCO₃ (0,005 mol) cho tối đa 0,005 mol CO₂ ≈ 0,124 L ở 25°C, 1 bar.",
        },
        equation: ["CH₃COOH", "+", "NaHCO₃", "→", "CH₃COONa", "+", "H₂O", "+", "CO₂↑"],
        remember: "Dấu hiệu có phản ứng hoá học: tạo khí, đổi màu, kết tủa, toả hoặc thu nhiệt.",
        safety: { text: "Làm ở nhà được nếu có người lớn. Không đậy kín chai khi đang sủi.", home: true },
        incidents: { overflow: "tran-bot" },
      },
      {
        id: "natri-nuoc",
        title: "Natri gặp nước",
        emoji: "⚡",
        intro: "Cốc nước đã nhỏ sẵn phenolphtalein. Thả một mẩu natri vào. Nhớ chọn đúng cỡ mẩu natri nhé!",
        vessels: [{ id: "A", shape: "beaker", contents: [["nuoc", 5], ["phenol", 1]] }],
        shelf: ["natri", "natri-to"],
        tools: ["thermo", "ph"],
        predict: {
          q: "Natri phản ứng với nước tạo ra bazơ. Dung dịch có phenolphtalein sẽ thành màu gì?",
          choices: [
            { label: "Hồng", color: "#ff4fa8" },
            { label: "Không màu", color: "#eef3ff" },
            { label: "Xanh lam", color: "#3f7bff" },
          ],
          answer: 0,
        },
        goal: {
          text: "Thả natri vào cốc để dung dịch chuyển màu hồng.",
          hint: "Natri phản ứng rất mạnh, chỉ cần mẩu nhỏ.",
          steps: [{ text: "Dung dịch hồng", done: (l, s) => has(l, "natri") && ph(s.vessels[0]) > 8.2, say: "Thả **natri** vào cốc nước. Chọn đúng **cỡ mẩu** nhé!", vessel: "A" }],
          done: (l, s) => has(l, "natri") && ph(s.vessels[0]) > 8.2,
        },
        observe: ["Mẩu natri chạy trên mặt nước, xèo xèo", "Có khí thoát ra, cốc nóng lên", "Dung dịch chuyển hồng: đã tạo ra bazơ NaOH"],
        explain: {
          khtn: "Natri là kim loại rất hoạt động. Gặp nước, nó tạo ra chất mới có tính bazơ, làm phenolphtalein hoá hồng, và giải phóng khí hiđro.",
          thcs: "Natri tác dụng với nước tạo natri hiđroxit (bazơ, làm phenolphtalein hoá hồng) và khí hiđro. Phản ứng toả nhiều nhiệt.",
          thpt: "Na là chất khử mạnh (E° = −2,71 V), khử H₂O thành H₂. Phản ứng toả nhiệt mạnh; với mẩu lớn, nhiệt tích tụ làm H₂ tự bốc cháy.",
        },
        equation: ["2Na", "+", "2H₂O", "→", "2NaOH", "+", "H₂↑"],
        remember: "2Na + 2H₂O → 2NaOH + H₂↑. Chỉ dùng mẩu natri nhỏ.",
        safety: { text: "Không làm ở nhà. Natri chỉ dùng trong phòng thí nghiệm có thầy cô, đeo kính bảo hộ.", home: false },
        incidents: { boom: "natri-to" },
      },
    ],
    missions: [
      (rng) =>
        identify(
          rng,
          "Nhận biết 3 dung dịch",
          "3 cốc đựng giấm, nước và dung dịch NaOH. Dùng hoá chất trên kệ để nhận biết từng cốc.",
          [
            ["giam", "Giấm (axit)"],
            ["nuoc", "Nước"],
            ["naoh", "NaOH (bazơ)"],
          ],
          [["nuoc", 2]],
          ["phenol", "baking-soda"],
          "Cốc này là…",
          ["ph"],
        ),
    ],
  },
  practice: [
    bank("phan-ung", [
      { prompt: "Dấu hiệu nào cho biết có phản ứng hoá học?", choices: ["Có chất khí mới thoát ra", "Nước đá tan thành nước", "Muối tan vào nước", "Cát lắng xuống đáy"] },
      { prompt: "Hiện tượng nào là thay đổi VẬT LÝ (không có chất mới)?", choices: ["Nước đá tan", "Giấm gặp baking soda sủi bọt", "Sắt bị gỉ", "Đốt cháy giấy"] },
      { prompt: "Khí sinh ra khi giấm tác dụng với baking soda là", choices: ["CO₂", "O₂", "H₂", "N₂"] },
      { prompt: "Khí CO₂ làm que đóm đang cháy", choices: ["Tắt", "Bùng cháy sáng", "Nổ lách tách", "Không đổi"] },
      { prompt: "Natri tác dụng với nước sinh ra khí gì?", choices: ["H₂", "CO₂", "O₂", "Cl₂"] },
      { prompt: "Phenolphtalein chuyển màu hồng khi gặp", choices: ["Dung dịch bazơ", "Dung dịch axit", "Nước cất", "Nước muối"] },
      { prompt: "Hệ số đúng: _Na + 2H₂O → 2NaOH + H₂", choices: ["2", "1", "3", "4"], explain: "2Na + 2H₂O → 2NaOH + H₂: mỗi vế có 2 Na, 4 H, 2 O." },
      { prompt: "Vì sao chỉ dùng mẩu natri nhỏ bằng hạt đậu xanh?", choices: ["Phản ứng toả nhiều nhiệt, mẩu to dễ gây nổ", "Natri rất đắt", "Mẩu to không tan", "Mẩu nhỏ dễ nhìn hơn"] },
    ]),
  ],
};

/** Bài cân bằng phương trình (THCS): từ dễ đến vừa, mỗi vòng một phương trình */
const c02: Lesson = {
  id: "hh-c02",
  title: "Cân bằng phương trình",
  short: "Hai vế phải có số nguyên tử bằng nhau",
  emoji: "⚖️",
  cover: "hh-cover-c02",
  minutes: 8,
  slides: [],
  balance: {
    intro: "Trong phản ứng, **nguyên tử không tự mất đi hay sinh ra**. Nên số nguyên tử mỗi nguyên tố ở hai vế phải **bằng nhau**. Con chỉnh **hệ số** trước mỗi chất nhé!",
    rounds: [
      { eq: "Na + H₂O → NaOH + H₂", name: "Natri gặp nước", hint: "Bắt đầu từ H: vế phải có 3 H nhưng vế trái có 2.", why: "2Na + 2H₂O → 2NaOH + H₂. Mỗi vế có 2 Na, 4 H, 2 O." },
      { eq: "Fe + O₂ → Fe₂O₃", name: "Sắt bị gỉ", hint: "Số O chẵn bên trái (O₂), lẻ bên phải (O₃): thử hệ số 2 cho Fe₂O₃ rồi 3 cho O₂.", why: "4Fe + 3O₂ → 2Fe₂O₃. Mỗi vế có 4 Fe và 6 O." },
      { eq: "H₂ + O₂ → H₂O", name: "Hiđro cháy tạo nước", why: "2H₂ + O₂ → 2H₂O. Mỗi vế có 4 H và 2 O." },
      { eq: "CH₄ + O₂ → CO₂ + H₂O", name: "Khí metan cháy", hint: "Cân bằng C, rồi H, cuối cùng mới tới O.", why: "CH₄ + 2O₂ → CO₂ + 2H₂O. Mỗi vế có 1 C, 4 H, 4 O." },
      { eq: "Al + HCl → AlCl₃ + H₂", name: "Nhôm tan trong axit", hint: "Cl: vế phải có 3, nên HCl cần hệ số 3 hoặc 6.", why: "2Al + 6HCl → 2AlCl₃ + 3H₂. Mỗi vế có 2 Al, 6 H, 6 Cl." },
    ],
    remember: "Cân bằng phương trình: chỉnh hệ số (không đổi chỉ số trong công thức) cho số nguyên tử mỗi nguyên tố hai vế bằng nhau.",
  },
  practice: [balanceBank("can-bang", ["Na + H₂O → NaOH + H₂", "Fe + O₂ → Fe₂O₃", "H₂ + O₂ → H₂O", "CH₄ + O₂ → CO₂ + H₂O", "Al + HCl → AlCl₃ + H₂", "Mg + O₂ → MgO", "P + O₂ → P₂O₅", "Zn + HCl → ZnCl₂ + H₂"])],
};

export const unitsThcs: Unit[] = [
  { id: "hh-thcs-l8a", title: "Lớp 8 · Phản ứng hoá học", lessons: [c01, c02, l8Conserve, l8Mol, l8Conc] },
  { id: "hh-thcs-l8b", title: "Lớp 8 · Axit, bazơ, muối", lessons: [l8Class] },
  { id: "hh-thcs-l9a", title: "Lớp 9 · Kim loại", lessons: [l9Series, l9Stoich] },
  { id: "hh-thcs-l9b", title: "Lớp 9 · Hợp chất hữu cơ", lessons: [l9Organic] },
];
