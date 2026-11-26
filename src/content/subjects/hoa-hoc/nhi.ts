import type { Lesson, Unit } from "@/content/types";
import type { Mission } from "@/lib/chem/types";
import { ph, type LabState } from "@/lib/chem/lab";
import type { Rng } from "@/lib/rng";
import { bank } from "./q";

/** Trình độ Nhà khoa học nhí (lớp 1–3): thí nghiệm với đồ trong bếp, chữ to, chạm/kéo là chính */

const has = (log: string[], k: string) => log.includes(k);
const W = (id: string, label?: string, n = 4): { id: string; shape: "beaker"; label?: string; contents: [string, number][] } => ({ id, shape: "beaker", label, contents: [["nuoc", n]] });

/** nhận biết: trộn chất vào các cốc A, B, C */
export function identify(rng: Rng, title: string, brief: string, pool: [string, string][], extra: [string, number][], shelf: string[], ask: string, tools: Mission["tools"]): Mission {
  const picks = rng.shuffle(pool).slice(0, 3);
  const labels = ["A", "B", "C"];
  return {
    title,
    brief,
    vessels: picks.map(([id], i) => ({ id: labels[i], label: labels[i], shape: "beaker", contents: [...extra, [id, id === "nuoc" ? 1 : 1]] })),
    shelf,
    tools,
    identify: { answers: Object.fromEntries(picks.map(([, name], i) => [labels[i], name])), options: pool.map(([, name]) => name), ask },
  };
}

const a01: Lesson = {
  id: "hh-a01",
  title: "Tan hay không tan",
  short: "Muối, đường, cát, dầu ăn vào nước",
  emoji: "🧂",
  cover: "hh-cover-a01",
  minutes: 6,
  slides: [],
  lab: {
    experiments: [
      {
        id: "tan-khong-tan",
        title: "Thả vào nước rồi khuấy",
        emoji: "🥄",
        intro: "Mochi có 4 cốc nước. Mình thả muối, đường, cát, dầu ăn vào mỗi cốc rồi khuấy xem chất nào biến mất nhé!",
        vessels: [W("A", "1"), W("B", "2"), W("C", "3"), W("D", "4")],
        shelf: ["muoi", "duong", "cat", "dau-an"],
        tools: ["stir"],
        predict: { q: "Thả muối vào nước rồi khuấy đều. Muối sẽ thế nào?", choices: [{ label: "Biến mất", emoji: "✨" }, { label: "Nằm dưới đáy", emoji: "⬇️" }, { label: "Nổi lên trên", emoji: "⬆️" }], answer: 0 },
        goal: {
          text: "Kéo từng chất vào một cốc nước, rồi chọn cốc và bấm Khuấy.",
          hint: "Chạm vào cốc để chọn, rồi bấm nút 🥄 Khuấy ở dưới.",
          steps: [
            { text: "Muối", done: (l) => has(l, "dissolve:muoi"), say: "Thả **muối** vào **cốc 1**.", chem: "muoi", vessel: "A", tool: "stir", then: "Giờ bấm **🥄 Khuấy** xem muối thế nào nhé!" },
            { text: "Đường", done: (l) => has(l, "dissolve:duong"), say: "Thả **đường** vào **cốc 2**.", chem: "duong", vessel: "B", tool: "stir", then: "Giờ bấm **🥄 Khuấy** xem đường thế nào nhé!" },
            { text: "Cát", done: (l) => has(l, "nodissolve:cat"), say: "Thả **cát** vào **cốc 3**.", chem: "cat", vessel: "C", tool: "stir", then: "Giờ bấm **🥄 Khuấy** xem cát thế nào nhé!" },
            { text: "Dầu ăn", done: (l) => has(l, "nodissolve:dau-an"), say: "Thả **dầu ăn** vào **cốc 4**.", chem: "dau-an", vessel: "D", tool: "stir", then: "Giờ bấm **🥄 Khuấy** xem dầu ăn thế nào nhé!" },
          ],
          done: (l) => ["dissolve:muoi", "dissolve:duong", "nodissolve:cat", "nodissolve:dau-an"].every((k) => has(l, k)),
        },
        observe: ["Muối và đường biến mất: chúng tan vào nước", "Cát nằm lì dưới đáy: không tan", "Dầu ăn nổi thành lớp vàng ở trên: không tan"],
        explain: {
          nhi: "Muối và đường vỡ ra thành những hạt nhỏ xíu, nhỏ tới mức mắt mình không thấy nữa. Chúng vẫn ở trong nước đó! Nếm thử nước muối sẽ thấy mặn. Cát và dầu ăn thì không tan.",
          khtn: "Muối, đường là chất tan trong nước, tạo thành dung dịch. Cát không tan nên lắng xuống. Dầu ăn không tan và nhẹ hơn nước nên nổi thành lớp riêng.",
          thcs: "Chất tan phân tán thành phân tử/ion giữa các phân tử nước, tạo hỗn hợp đồng nhất (dung dịch). Cát, dầu tạo hỗn hợp không đồng nhất: huyền phù và nhũ tương.",
        },
        remember: "Muối, đường tan trong nước. Cát, dầu ăn không tan.",
        safety: { text: "Làm ở nhà được. Đừng uống nước có cát nhé!", home: true },
        incidents: { overflow: "tran-coc" },
      },
    ],
    missions: [
      (rng) =>
        identify(
          rng,
          "Cốc nào chứa gì?",
          "Mochi đã thả 3 chất vào 3 cốc nước nhưng quên ghi tên. Khuấy từng cốc để tìm ra nhé!",
          [
            ["muoi", "Muối"],
            ["cat", "Cát"],
            ["dau-an", "Dầu ăn"],
          ],
          [["nuoc", 4]],
          [],
          "Cốc này có gì?",
          ["stir"],
        ),
    ],
  },
  practice: [
    bank("tan", [
      { prompt: "Chất nào tan trong nước?", choices: ["Đường", "Cát", "Hòn sỏi", "Dầu ăn"] },
      { prompt: "Chất nào KHÔNG tan trong nước?", choices: ["Cát", "Muối", "Đường", "Bột canh"] },
      { prompt: "Thả dầu ăn vào cốc nước, dầu ăn sẽ…", choices: ["Nổi thành lớp ở trên", "Tan biến mất", "Chìm xuống đáy", "Biến thành nước"] },
      { prompt: "Khuấy muối trong nước, muối biến mất. Muối đã đi đâu?", choices: ["Vẫn ở trong nước, nhỏ quá nên không thấy", "Bay lên trời", "Biến thành cát", "Chui ra khỏi cốc"] },
      { prompt: "Làm sao để đường tan nhanh hơn?", choices: ["Khuấy đều", "Để yên", "Thêm cát", "Đậy nắp lại"] },
      { prompt: "Cát thả vào nước rồi khuấy, để một lúc thì cát…", choices: ["Lắng xuống đáy", "Tan hết", "Nổi lên", "Đổi màu"] },
    ]),
  ],
};

const a02: Lesson = {
  id: "hh-a02",
  title: "Nổi hay chìm",
  short: "Vật nào nổi, vật nào chìm, làm trứng nổi",
  emoji: "🥚",
  cover: "hh-cover-a02",
  minutes: 6,
  slides: [],
  lab: {
    experiments: [
      {
        id: "noi-chim",
        title: "Thả đồ vật vào nước",
        emoji: "🛁",
        intro: "Thả từng đồ vật vào cốc nước to. Cái nào nổi, cái nào chìm? Rồi thử làm cho quả trứng nổi lên nhé!",
        vessels: [{ id: "A", shape: "beaker", contents: [["nuoc", 6]] }],
        shelf: ["da", "go", "dong-xu", "vit", "qua-chanh", "trung", "muoi"],
        tools: ["stir"],
        predict: { q: "Thả quả trứng vào nước, trứng sẽ…", choices: [{ label: "Chìm", emoji: "⬇️" }, { label: "Nổi", emoji: "⬆️" }, { label: "Bay lên", emoji: "🎈" }], answer: 0 },
        goal: {
          text: "Thả ít nhất 4 đồ vật vào cốc. Sau đó làm cho quả trứng nổi lên.",
          hint: "Trứng chìm trong nước lọc. Thử cho thật nhiều muối rồi khuấy xem!",
          steps: [
            { text: "Thả 4 đồ vật", done: (_, s) => s.vessels[0].objects.length >= 4, say: "Thả **4 đồ vật** vào cốc nước. Cái nào **nổi**, cái nào **chìm**?", vessel: "A" },
            { text: "Làm trứng nổi lên", done: (l) => has(l, "float:trung"), say: "Thả **quả trứng** vào cốc xem nào!", chem: "trung", vessel: "A", tool: "stir", thenChem: "muoi", then: "Trứng chìm rồi! Thêm thật nhiều **muối**, rồi bấm **🥄 Khuấy** nhé." },
          ],
          done: (l, s) => s.vessels[0].objects.length >= 4 && has(l, "float:trung"),
        },
        observe: ["Gỗ, vịt cao su, quả chanh nổi", "Đá, đồng xu chìm xuống đáy", "Trứng chìm trong nước lọc, nhưng nổi trong nước muối đậm"],
        explain: {
          nhi: "Vật nhẹ hơn nước thì nổi, vật nặng hơn nước thì chìm. Cho muối vào làm nước 'nặng' hơn, nên nước đẩy được quả trứng nổi lên!",
          khtn: "Vật nổi khi khối lượng riêng nhỏ hơn của nước. Muối tan làm khối lượng riêng của nước muối tăng lên, lớn hơn của quả trứng, nên trứng nổi.",
          thcs: "Lực đẩy Archimedes F = d·V. Nước muối có trọng lượng riêng d lớn hơn nên lực đẩy lớn hơn trọng lượng quả trứng: trứng nổi.",
        },
        remember: "Vật nhẹ hơn nước thì nổi. Nước muối đậm đẩy vật mạnh hơn nước lọc.",
        safety: { text: "Làm ở nhà được. Lau khô bàn sau khi chơi nước nhé!", home: true },
      },
    ],
    missions: [
      (rng) => {
        const others = rng.shuffle(["da", "go", "dong-xu", "vit", "qua-chanh"]).slice(0, 3);
        return {
          title: "Cứu quả trứng",
          brief: "Quả trứng đang chìm dưới đáy cốc. Dùng đồ trên kệ để làm trứng nổi lên!",
          vessels: [{ id: "A", shape: "beaker", contents: [["nuoc", 6], ["trung", 1], ...others.slice(0, 1).map((o) => [o, 1] as [string, number])] }],
          shelf: rng.shuffle(["muoi", "duong", "cat", ...others.slice(1)]),
          tools: ["stir"],
          goal: { text: "Làm cho quả trứng nổi lên mặt nước.", hint: "Chất nào tan vào nước làm nước nặng hơn?", done: (l) => has(l, "float:trung") },
        };
      },
    ],
  },
  practice: [
    bank("noi", [
      { prompt: "Vật nào nổi trên nước?", choices: ["Miếng gỗ", "Hòn đá", "Đồng xu", "Cái đinh"] },
      { prompt: "Vật nào chìm trong nước?", choices: ["Đồng xu", "Vịt cao su", "Lá cây", "Miếng xốp"] },
      { prompt: "Muốn quả trứng nổi lên, ta cho thêm gì vào nước?", choices: ["Thật nhiều muối", "Cát", "Thêm nước lọc", "Đá lạnh"] },
      { prompt: "Vì sao trứng nổi trong nước muối?", choices: ["Nước muối nặng hơn, đẩy trứng lên", "Muối làm trứng nhẹ đi", "Trứng thích muối", "Nước muối lạnh hơn"] },
      { prompt: "Vật nhẹ hơn nước thì…", choices: ["Nổi", "Chìm", "Tan", "Đổi màu"] },
    ]),
  ],
};

const a03: Lesson = {
  id: "hh-a03",
  title: "Nước bắp cải đổi màu",
  short: "Chất chỉ thị tự làm ở nhà",
  emoji: "🥬",
  cover: "hh-cover-a03",
  minutes: 7,
  slides: [],
  lab: {
    experiments: [
      {
        id: "bap-cai",
        title: "Nhỏ vào nước bắp cải tím",
        emoji: "🌈",
        intro: "Nước bắp cải tím là 'thám tử màu'. Gặp chất chua nó đổi màu này, gặp chất nhờn như xà phòng nó đổi màu khác!",
        vessels: ["A", "B", "C", "D"].map((id, i) => ({ id, label: String(i + 1), shape: "beaker" as const, contents: [["bap-cai", 3]] as [string, number][] })),
        shelf: ["chanh", "giam", "nuoc", "xa-phong", "baking-soda"],
        tools: ["stir"],
        predict: {
          q: "Mochi sắp nhỏ nước chanh vào nước bắp cải tím. Nước sẽ thành màu gì?",
          choices: [
            { label: "Hồng", color: "#ff5b9a" },
            { label: "Xanh lá", color: "#3fbf6a" },
            { label: "Không đổi", color: "#8a4fd0" },
          ],
          answer: 0,
        },
        goal: {
          text: "Nhỏ mỗi chất vào một cốc. Làm một cốc thành màu hồng và một cốc thành màu xanh.",
          hint: "Chất chua (chanh, giấm) và chất nhờn (xà phòng, baking soda) cho màu khác nhau. Baking soda là bột, nhớ khuấy cho tan.",
          steps: [
            { text: "Cốc hồng", done: (_, s) => s.vessels.some((v) => v.liquid["bap-cai"] && ph(v) < 5), say: "Nhỏ **nước chanh** vào **cốc 1** nhé!", chem: "chanh", vessel: "A" },
            { text: "Cốc xanh", done: (_, s) => s.vessels.some((v) => v.liquid["bap-cai"] && ph(v) > 8.4), say: "Giờ thử **nước xà phòng** vào **cốc 2**.", chem: "xa-phong", vessel: "B" },
          ],
          done: (_, s) => s.vessels.some((v) => ph(v) < 5) && s.vessels.some((v) => ph(v) > 8.4),
        },
        observe: ["Chanh, giấm (chua) làm nước bắp cải thành hồng đỏ", "Nước lọc: vẫn tím", "Xà phòng, baking soda làm nước thành xanh"],
        explain: {
          nhi: "Nước bắp cải tím biết 'nhìn' độ chua! Gặp chất chua nó đỏ mặt thành màu hồng, gặp chất nhờn như xà phòng thì xanh lè.",
          khtn: "Nước bắp cải là chất chỉ thị màu. Chất có tính axit (chua) làm nó hồng đỏ, chất có tính bazơ (kiềm) làm nó xanh. Nước lọc trung tính nên vẫn tím.",
          thcs: "Sắc tố anthocyanin đổi cấu trúc theo pH: pH < 7 (axit) đỏ hồng, pH ≈ 7 tím, pH > 7 (bazơ) xanh, pH rất cao thì vàng.",
        },
        remember: "Chua (axit) → hồng. Nhờn (bazơ) → xanh. Nước lọc → tím.",
        safety: { text: "Làm ở nhà được với người lớn. Không nếm xà phòng nhé!", home: true },
        incidents: { overflow: "tran-coc" },
      },
    ],
    missions: [
      (rng) =>
        identify(
          rng,
          "3 lọ mất nhãn",
          "3 cốc đựng giấm, nước lọc và nước xà phòng, nhìn thì giống nhau. Nhỏ nước bắp cải tím vào để tìm ra nhé!",
          [
            ["giam", "Giấm"],
            ["nuoc", "Nước lọc"],
            ["xa-phong", "Xà phòng"],
          ],
          [["nuoc", 2]],
          ["bap-cai"],
          "Cốc này là…",
          [],
        ),
    ],
  },
  practice: [
    bank("bap-cai", [
      { prompt: "Nhỏ nước chanh vào nước bắp cải tím, nước thành màu gì?", choices: ["Hồng", "Xanh lá", "Vẫn tím", "Đen"] },
      { prompt: "Nhỏ nước xà phòng vào nước bắp cải tím, nước thành màu gì?", choices: ["Xanh", "Hồng", "Vẫn tím", "Trắng"] },
      { prompt: "Nước lọc nhỏ vào nước bắp cải tím thì…", choices: ["Vẫn màu tím", "Thành hồng", "Thành xanh", "Thành vàng"] },
      { prompt: "Giấm có vị gì?", choices: ["Chua", "Ngọt", "Mặn", "Đắng"] },
      { prompt: "Nước bắp cải tím được gọi là gì?", choices: ["Chất chỉ thị màu", "Thuốc nhuộm tóc", "Nước ngọt", "Chất tẩy"] },
      { prompt: "Chất nào làm nước bắp cải tím chuyển màu hồng?", choices: ["Giấm", "Xà phòng", "Baking soda", "Nước lọc"] },
    ]),
  ],
};

const foamOk = (l: string[], s: LabState) => has(l, "foam-high:A") && !s.vessels[0].spilled;

const a04: Lesson = {
  id: "hh-a04",
  title: "Núi lửa baking soda",
  short: "Giấm gặp baking soda sinh ra chất khí",
  emoji: "🌋",
  cover: "hh-cover-a04",
  minutes: 6,
  slides: [],
  lab: {
    experiments: [
      {
        id: "nui-lua",
        title: "Núi lửa phun bọt",
        emoji: "🌋",
        intro: "Trong cốc có baking soda. Rót giấm vào xem chuyện gì xảy ra! Nhưng cẩn thận, đừng để bọt tràn ra nhé.",
        vessels: [{ id: "A", shape: "beaker", contents: [["baking-soda", 3], ["nuoc", 1]] }],
        shelf: ["giam"],
        tools: [],
        predict: { q: "Rót giấm vào baking soda, con đoán sẽ thấy gì?", choices: [{ label: "Sủi bọt nhiều", emoji: "🫧" }, { label: "Không có gì", emoji: "😐" }, { label: "Đổi màu tím", emoji: "🟣" }], answer: 0 },
        goal: {
          text: "Rót giấm từng chút để bọt dâng lên gần miệng cốc mà không tràn ra ngoài.",
          hint: "Rót một lần, đợi bọt xẹp bớt rồi mới rót tiếp.",
          steps: [{ text: "Bọt dâng gần miệng, không tràn", done: foamOk, say: "Rót **giấm** vào cốc. Rót **từng chút** thôi nhé!", chem: "giam", vessel: "A", then: "Bọt đang lên! Rót **thêm một chút** nữa, nhìn kỹ bọt nha." , thenChem: "giam" }],
          done: foamOk,
        },
        observe: ["Sủi bọt rất mạnh, bọt dâng lên như núi lửa", "Bọt là do chất khí mới sinh ra", "Cốc hơi lạnh đi một chút"],
        explain: {
          nhi: "Giấm và baking soda gặp nhau thì 'cãi nhau' và sinh ra rất nhiều bong bóng khí. Bong bóng dâng lên thành bọt như núi lửa phun!",
          khtn: "Giấm và baking soda phản ứng, tạo ra chất mới, trong đó có khí CO₂ (khí cacbonic). Khí thoát ra tạo bọt. Có chất mới sinh ra nên đây là phản ứng hoá học.",
          thcs: "Axit axetic + natri hiđrocacbonat → natri axetat + nước + CO₂↑. Phản ứng thu nhiệt nhẹ nên cốc lạnh đi.",
        },
        equation: ["CH₃COOH", "+", "NaHCO₃", "→", "CH₃COONa", "+", "H₂O", "+", "CO₂↑"],
        remember: "Giấm + baking soda → sủi bọt khí. Có chất mới sinh ra.",
        safety: { text: "Làm ở nhà được, đặt cốc trên khay. Không đậy kín chai khi đang sủi.", home: true },
        incidents: { overflow: "tran-bot" },
      },
    ],
    missions: [
      (rng) => {
        const soda = rng.int(3, 4);
        return {
          title: "Núi lửa vừa đẹp",
          brief: `Cốc có ${soda} thìa baking soda. Làm bọt dâng tới gần miệng cốc, không được tràn!`,
          vessels: [{ id: "A", shape: "beaker", contents: [["baking-soda", soda], ["nuoc", 1]] }],
          shelf: ["giam", "nuoc"],
          goal: { text: "Bọt dâng gần miệng cốc mà không tràn.", hint: "Rót một lần rồi chờ.", done: foamOk },
          incidents: { overflow: "tran-bot" },
        };
      },
    ],
  },
  practice: [
    bank("nui-lua", [
      { prompt: "Rót giấm vào baking soda, ta thấy gì?", choices: ["Sủi bọt rất nhiều", "Không có gì xảy ra", "Đông thành đá", "Bốc cháy"] },
      { prompt: "Bọt trong núi lửa baking soda là do đâu?", choices: ["Chất khí mới sinh ra", "Xà phòng", "Nước sôi", "Bột mì"] },
      { prompt: "Muốn bọt không trào ra ngoài, con nên…", choices: ["Rót giấm từng chút một", "Đổ cả chai giấm thật nhanh", "Đậy nắp thật chặt", "Lắc mạnh cốc"] },
      { prompt: "Khi giấm gặp baking soda, có chất mới sinh ra không?", choices: ["Có, là chất khí", "Không có gì mới", "Chỉ có nước", "Có, là cát"] },
      { prompt: "Baking soda thường dùng để làm gì trong bếp?", choices: ["Làm bánh nở xốp", "Nấu canh chua", "Pha nước chấm", "Rửa rau"] },
    ]),
  ],
};

const a05: Lesson = {
  id: "hh-a05",
  title: "Nước đá, nước, hơi nước",
  short: "Đun nóng và làm lạnh: nước đổi thể",
  emoji: "🧊",
  cover: "hh-cover-a05",
  minutes: 6,
  slides: [],
  lab: {
    experiments: [
      {
        id: "the-cua-nuoc",
        title: "Đun nóng đá lạnh",
        emoji: "♨️",
        intro: "Trong cốc có vài viên đá, trên miệng cốc đậy một đĩa kính. Bật đèn cồn lên và xem nước 'biến hình' nhé!",
        vessels: [{ id: "A", shape: "beaker", ice: 3, lid: true, temp: -5 }],
        shelf: [],
        tools: ["heat", "thermo"],
        predict: { q: "Đun nóng mấy viên đá lạnh, đá sẽ…", choices: [{ label: "Tan thành nước", emoji: "💧" }, { label: "To ra", emoji: "🧊" }, { label: "Không đổi", emoji: "😐" }], answer: 0 },
        goal: {
          text: "Bấm Đun nóng. Theo dõi nhiệt kế cho tới khi nước sôi và thấy giọt nước đọng trên đĩa kính.",
          steps: [
            { text: "Đá tan", done: (l) => has(l, "melt"), say: "Bấm **🔥 Đun nóng** để đun cốc đá. Nhìn **nhiệt kế** nhé!", tool: "heat" },
            { text: "Sôi 100°C", done: (l) => has(l, "boil"), say: "Đá tan thành **nước** rồi! Đun tiếp tới **100°C** xem sao." },
            { text: "Giọt đọng", done: (l) => has(l, "condense"), say: "Nước **sôi** rồi, hơi bay lên! Nhìn **đĩa kính** trên miệng cốc nhé." },
          ],
          done: (l) => has(l, "condense"),
        },
        observe: ["Đá tan dần thành nước, nhiệt kế đứng ở 0°C khi đá đang tan", "Đun tiếp, nước sôi ở 100°C, bốc hơi", "Hơi nước gặp đĩa kính lạnh thì đọng lại thành giọt nước"],
        explain: {
          nhi: "Nước có 3 'bộ đồ': cứng là đá, mềm là nước, bay là hơi nước. Nóng lên thì đá thành nước, nước thành hơi. Hơi gặp lạnh lại thành giọt nước!",
          khtn: "Nước có ba thể: rắn (đá), lỏng (nước), khí (hơi nước). Nóng chảy ở 0°C, sôi ở 100°C. Hơi nước gặp lạnh thì ngưng tụ thành nước lỏng. Đây là thay đổi vật lý, không có chất mới.",
          thcs: "Khi đá đang nóng chảy hay nước đang sôi, nhiệt cung cấp dùng để chuyển thể nên nhiệt độ đứng yên (0°C, 100°C). Ngưng tụ là quá trình ngược của bay hơi.",
        },
        remember: "Đá (rắn) → nước (lỏng) → hơi nước (khí). Hơi gặp lạnh thành giọt nước.",
        safety: { text: "Đun nóng phải có người lớn. Hơi nước rất nóng, đừng đưa tay lên miệng cốc!", home: false },
      },
    ],
    missions: [
      (rng) => {
        const ice = rng.int(2, 4);
        return {
          title: "Làm mưa trong cốc",
          brief: `Cốc có ${ice} viên đá và đậy đĩa kính. Hãy làm cho 'mưa' xuất hiện trên đĩa kính!`,
          vessels: [{ id: "A", shape: "beaker", ice, lid: true, temp: -4 }],
          shelf: [],
          tools: ["heat", "thermo"],
          goal: { text: "Đun cho hơi nước đọng thành giọt trên đĩa kính.", done: (l) => has(l, "condense") },
        };
      },
    ],
  },
  practice: [
    bank("the", [
      { prompt: "Nước đá là nước ở thể gì?", choices: ["Rắn", "Lỏng", "Khí", "Bột"] },
      { prompt: "Nước sôi ở bao nhiêu độ C?", choices: ["100°C", "0°C", "50°C", "25°C"] },
      { prompt: "Đá bắt đầu tan ở bao nhiêu độ C?", choices: ["0°C", "100°C", "37°C", "10°C"] },
      { prompt: "Hơi nước gặp đĩa kính lạnh thì…", choices: ["Đọng lại thành giọt nước", "Biến thành đá ngay", "Biến mất", "Bốc cháy"] },
      { prompt: "Mây trên trời được tạo thành từ gì?", choices: ["Hơi nước gặp lạnh ngưng tụ lại", "Khói xe", "Bông gòn", "Cát bay lên"] },
      { prompt: "Đun nóng nước đá, đá sẽ…", choices: ["Tan thành nước", "Cứng hơn", "Đổi màu", "To lên"] },
    ]),
  ],
};

export const unitsNhi: Unit[] = [{ id: "hh-nhi-1", title: "Phòng lab nhà mình", lessons: [a01, a02, a03, a04, a05] }];
