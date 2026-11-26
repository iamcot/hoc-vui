import type { Lesson, Unit } from "@/content/types";
import { bank } from "./q";

/** Bậc Khoa học tự nhiên (lớp 4–7): hỗn hợp và cách tách, dung dịch và độ tan */

const has = (log: string[], k: string) => log.includes(k);

const k01: Lesson = {
  id: "hh-k01",
  title: "Tách hỗn hợp",
  short: "Lọc để bỏ cát, đun cho muối kết tinh",
  emoji: "🧻",
  cover: "hh-cover-k01",
  minutes: 10,
  slides: [],
  lab: {
    experiments: [
      {
        id: "loc",
        title: "Lọc nước lẫn cát và muối",
        emoji: "🧻",
        intro: "Cốc A có nước, cát và một thìa muối. Mình khuấy cho muối tan, rồi đổ qua giấy lọc sang cốc B xem chất nào ở lại.",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["nuoc", 4], ["cat", 2], ["muoi", 1]], into: "B" }, { id: "B", shape: "beaker", label: "B" }],
        shelf: [],
        tools: ["stir", "filter"],
        predict: { q: "Đổ hỗn hợp nước, cát, muối (đã khuấy) qua giấy lọc. Cốc B nhận được gì?", choices: [{ label: "Chỉ nước trong", emoji: "💧" }, { label: "Nước có muối, không có cát", emoji: "🧂" }, { label: "Cả cát và muối", emoji: "🏖️" }], answer: 1 },
        goal: {
          text: "Khuấy cốc A cho muối tan, rồi bấm Lọc.",
          steps: [
            { text: "Khuấy", done: (l) => has(l, "dissolve:muoi"), say: "Chọn cốc **A** rồi bấm **🥄 Khuấy** cho **muối tan**.", tool: "stir", vessel: "A" },
            { text: "Lọc", done: (l) => has(l, "filter:A"), say: "Giờ bấm **🧻 Lọc** để đổ qua **giấy lọc** sang cốc B.", tool: "filter", vessel: "A" },
          ],
          done: (l) => has(l, "filter:A") && has(l, "residue:cat") && has(l, "passed:muoi"),
        },
        observe: ["Cát ở lại trên giấy lọc (cốc A)", "Cốc B trong, không còn cát", "Nhưng muối vẫn ở trong nước: lọc không tách được muối"],
        explain: {
          khtn: "Giấy lọc có lỗ rất nhỏ: hạt cát to bị giữ lại, còn nước và muối đã tan (hạt nhỏ li ti) lọt qua. Lọc chỉ tách được chất không tan ra khỏi chất lỏng. Muốn lấy muối ra thì phải làm cách khác.",
          thcs: "Lọc tách chất rắn không tan khỏi chất lỏng dựa vào kích thước hạt. Muối tan tạo dung dịch đồng nhất (ion Na⁺, Cl⁻) nên lọt qua giấy lọc.",
        },
        remember: "Lọc giữ lại chất không tan (cát). Chất tan (muối) vẫn lọt qua giấy lọc.",
        safety: { text: "Làm ở nhà được: dùng phễu lọc bằng giấy lọc cà phê hoặc khăn giấy.", home: true },
        incidents: { overflow: "tran-coc" },
      },
      {
        id: "bay-hoi",
        title: "Đun nước muối cho nước bay hơi",
        emoji: "🔥",
        intro: "Muối tan trong nước mà lọc không tách được. Vậy làm sao lấy lại muối? Mình đun cho nước bay hơi hết!",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["nuoc", 2], ["muoi", 1]] }],
        shelf: [],
        tools: ["stir", "heat", "thermo"],
        predict: { q: "Đun nước muối cho tới khi nước bay hơi hết. Trong cốc còn lại gì?", choices: [{ label: "Không còn gì", emoji: "🫥" }, { label: "Muối trắng", emoji: "🧂" }, { label: "Nước ngọt", emoji: "💧" }], answer: 1 },
        goal: {
          text: "Khuấy cho muối tan, rồi đun cho đến khi nước bay hơi hết.",
          steps: [
            { text: "Khuấy", done: (l) => has(l, "dissolve:muoi"), say: "Bấm **🥄 Khuấy** cho **muối tan** hết trong nước.", tool: "stir", vessel: "A" },
            { text: "Đun", done: (l) => has(l, "crystal:muoi"), say: "Bấm **🔥 Đun nóng** và chờ **nước bay hơi** nhé. Xem còn lại gì!", tool: "heat", vessel: "A" },
          ],
          done: (l) => has(l, "crystal:muoi"),
        },
        observe: ["Nước sôi và bốc hơi, mực nước giảm dần", "Nước hết thì muối trắng kết tinh ở đáy cốc"],
        explain: {
          khtn: "Khi đun, nước bay hơi thành hơi nước. Muối không bay hơi nên còn lại ở đáy cốc, đó là cách làm muối từ nước biển. Phương pháp này gọi là bay hơi (cô cạn) và dùng để lấy chất tan ra khỏi dung dịch.",
          thcs: "Cô cạn dung dịch: nước bay hơi, nồng độ tăng dần tới bão hoà rồi muối kết tinh. Muối NaCl bền nhiệt nên không bay hơi như nước.",
        },
        remember: "Muốn lấy chất tan ra khỏi dung dịch, ta cho nước bay hơi (cô cạn). Làm muối từ nước biển cũng vậy.",
        safety: { text: "Nhờ người lớn khi đun. Nước nóng và cốc nóng dễ gây bỏng.", home: false },
        incidents: { overflow: "tran-coc" },
      },
    ],
    missions: [
      () => ({
        title: "Lấy cát và muối ra khỏi nước",
        brief: "Cốc A là nước lẫn cát và muối. Hãy tách cát ra và để muối đi sang cốc B.",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["nuoc", 3], ["cat", 1], ["muoi", 1]], into: "B" }, { id: "B", shape: "beaker", label: "B" }],
        shelf: [],
        tools: ["stir", "filter"],
        goal: {
          text: "Khuấy cho muối tan rồi lọc: cát ở lại, nước muối sang cốc B.",
          hint: "Khuấy trước, lọc sau.",
          done: (l) => has(l, "dissolve:muoi") && has(l, "filter:A") && has(l, "residue:cat") && has(l, "passed:muoi"),
        },
      }),
    ],
  },
  practice: [
    bank("tach-hon-hop", [
      { prompt: "Muốn tách cát ra khỏi nước, ta dùng cách", choices: ["Lọc", "Bay hơi", "Chưng cất", "Dùng nam châm"] },
      { prompt: "Muối tan trong nước. Muốn lấy lại muối, ta", choices: ["Đun cho nước bay hơi", "Lọc qua giấy lọc", "Để yên cho lắng", "Khuấy mạnh hơn"] },
      { prompt: "Giấy lọc giữ lại chất nào?", choices: ["Chất không tan như cát", "Muối đã tan", "Đường đã tan", "Nước"] },
      { prompt: "Lọc nước muối qua giấy lọc thì muối", choices: ["Vẫn lọt qua cùng nước", "Bị giữ lại hết", "Biến thành cát", "Bay hơi"] },
      { prompt: "Làm muối từ nước biển ở ruộng muối dựa vào", choices: ["Nắng làm nước bay hơi", "Lọc bằng vải", "Dùng nam châm", "Làm lạnh nước biển"] },
      { prompt: "Hỗn hợp nào KHÔNG tách được bằng cách lọc?", choices: ["Nước muối", "Nước và cát", "Nước và bột mì", "Nước và sỏi"] },
      { prompt: "Dùng nam châm có thể tách", choices: ["Mạt sắt ra khỏi cát", "Muối ra khỏi nước", "Dầu ăn ra khỏi nước", "Đường ra khỏi nước"] },
      { prompt: "Dầu ăn nổi trên nước. Cách tách đơn giản là", choices: ["Gạn lớp dầu ra", "Đun cạn", "Lọc bằng giấy", "Khuấy đều"] },
    ]),
  ],
};

const k02: Lesson = {
  id: "hh-k02",
  title: "Dung dịch bão hoà",
  short: "Muối tan được bao nhiêu? Nóng thì tan nhiều hơn",
  emoji: "🧂",
  cover: "hh-cover-k02",
  minutes: 10,
  slides: [],
  lab: {
    experiments: [
      {
        id: "bao-hoa",
        title: "Cho muối vào nước tới khi hết tan",
        emoji: "🧂",
        intro: "Cốc nước chỉ hoà tan được một lượng muối nhất định. Mình thả từng thìa muối, khuấy, và xem tới lúc nào muối không tan thêm nữa.",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["nuoc", 2]] }],
        shelf: ["muoi"],
        tools: ["stir"],
        predict: { q: "Cứ thả thêm muối vào cốc nước rồi khuấy mãi. Điều gì xảy ra?", choices: [{ label: "Muối tan hết mãi mãi", emoji: "♾️" }, { label: "Tới lúc muối đọng lại dưới đáy", emoji: "⬇️" }, { label: "Nước biến thành muối", emoji: "🧊" }], answer: 1 },
        goal: {
          text: "Thả muối và khuấy cho tới khi muối không tan thêm (đọng dưới đáy).",
          hint: "Thả mỗi lần 1 thìa, khuấy rồi xem đáy cốc. Cốc nhỏ nên chỉ 2 thìa là đủ.",
          steps: [{ text: "Bão hoà", done: (l) => has(l, "saturated:muoi"), say: "Thả **muối** vào cốc, **khuấy**, rồi thả thêm. Làm tới khi muối **đọng dưới đáy** không tan nữa!", chem: "muoi", vessel: "A", tool: "stir" }],
          done: (l) => has(l, "saturated:muoi"),
        },
        observe: ["Những thìa muối đầu tan hết", "Tới một lúc muối đọng dưới đáy dù khuấy mạnh", "Nước lúc đó đã hoà tan đủ lượng muối tối đa: dung dịch bão hoà"],
        explain: {
          khtn: "Ở một nhiệt độ nhất định, một lượng nước chỉ hoà tan được một lượng chất tối đa. Khi đạt tới mức đó, dung dịch gọi là bão hoà, chất thêm vào không tan nữa mà lắng xuống.",
          thcs: "Độ tan của NaCl ở 25°C khoảng 36 g trong 100 g nước. Dung dịch đã hoà tan tối đa chất tan ở nhiệt độ đó gọi là dung dịch bão hoà.",
        },
        remember: "Dung dịch bão hoà là dung dịch không thể hoà tan thêm chất đó ở nhiệt độ đang xét.",
        safety: { text: "Làm ở nhà được với muối ăn.", home: true },
        incidents: { overflow: "tran-coc" },
      },
      {
        id: "nong-tan-nhieu",
        title: "Đường tan trong nước nóng",
        emoji: "🍬",
        intro: "Cốc nước lạnh đã có nhiều đường, khuấy mãi vẫn còn đường đọng đáy. Giờ thử đun nóng xem sao!",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["nuoc", 3], ["duong", 5]] }],
        shelf: [],
        tools: ["stir", "heat", "thermo"],
        predict: { q: "Cốc nước lạnh có đường đọng đáy. Đun nóng cốc lên thì đường…", choices: [{ label: "Tan thêm", emoji: "✨" }, { label: "Vẫn đọng nguyên", emoji: "⬇️" }, { label: "Biến mất hết nước", emoji: "💨" }], answer: 0 },
        goal: {
          text: "Khuấy cho thấy đường đã bão hoà, rồi đun nóng để đường tan hết.",
          steps: [
            { text: "Bão hoà", done: (l) => has(l, "saturated:duong"), say: "Bấm **🥄 Khuấy**: đường **không tan hết** vì nước lạnh đã bão hoà.", tool: "stir", vessel: "A" },
            { text: "Đun nóng", done: (l) => has(l, "dissolve-hot:duong"), say: "Giờ bấm **🔥 Đun nóng** và xem phần đường dưới đáy **tan thêm**!", tool: "heat", vessel: "A" },
          ],
          done: (l) => has(l, "saturated:duong") && has(l, "dissolve-hot:duong"),
        },
        observe: ["Nước lạnh: đường đọng đáy dù khuấy", "Đun nóng: đường dưới đáy tan dần", "Nước nóng hoà tan được nhiều đường hơn nước lạnh"],
        explain: {
          khtn: "Nhiệt độ càng cao, nước hoà tan được càng nhiều đường. Vì vậy người ta nấu nước đường nóng để làm kẹo, mứt: nấu nóng thì tan được nhiều, để nguội thì đường kết tinh lại.",
          thcs: "Độ tan của đa số chất rắn tăng khi nhiệt độ tăng. Đường (saccarozơ) tăng rất mạnh: từ khoảng 200 g/100 g nước ở 25°C lên khoảng 490 g ở 100°C. Muối ăn gần như không đổi.",
        },
        remember: "Đa số chất rắn tan nhiều hơn khi nước nóng. Để nguội, phần dư sẽ kết tinh lại.",
        safety: { text: "Nhờ người lớn khi đun nước nóng.", home: false },
        incidents: { overflow: "tran-coc" },
      },
    ],
    missions: [
      () => ({
        title: "Pha nước muối bão hoà",
        brief: "Cốc A có nước. Hãy hoà muối cho tới khi nước không nhận thêm muối được nữa.",
        vessels: [{ id: "A", shape: "beaker", label: "A", contents: [["nuoc", 2]] }],
        shelf: ["muoi"],
        tools: ["stir"],
        goal: { text: "Thả muối, khuấy, lặp lại tới khi muối đọng dưới đáy.", hint: "Cốc nhỏ nên chỉ khoảng 2 thìa là bão hoà.", done: (l) => has(l, "saturated:muoi") },
      }),
    ],
  },
  practice: [
    bank("bao-hoa", [
      { prompt: "Dung dịch bão hoà là dung dịch", choices: ["Không hoà tan thêm được chất tan ở nhiệt độ đó", "Có rất nhiều nước", "Luôn có màu", "Đang sôi"] },
      { prompt: "Thả thêm muối vào nước muối bão hoà rồi khuấy, muối sẽ", choices: ["Đọng lại dưới đáy", "Tan thêm mãi", "Bay hơi", "Biến thành đường"] },
      { prompt: "Muốn hoà tan thêm đường vào cốc nước đã bão hoà, ta nên", choices: ["Đun nóng nước", "Làm lạnh nước", "Đổ bớt nước", "Để yên"] },
      { prompt: "Đa số chất rắn khi nước nóng thì tan", choices: ["Nhiều hơn", "Ít hơn", "Như cũ", "Không tan"] },
      { prompt: "Nước đường nóng để nguội thì phần đường dư sẽ", choices: ["Kết tinh lại", "Bay hơi", "Biến mất", "Biến thành muối"] },
      { prompt: "Làm kẹo hoặc mứt, người ta nấu đường với nước nóng vì", choices: ["Nước nóng hoà tan được nhiều đường hơn", "Nước nóng ngọt hơn", "Đường không tan trong nước lạnh", "Để diệt vi khuẩn"] },
      { prompt: "Chất tan trong dung dịch là", choices: ["Chất bị hoà tan vào nước", "Nước", "Cái cốc", "Giấy lọc"] },
      { prompt: "Trong nước muối, dung môi là", choices: ["Nước", "Muối", "Không khí", "Giấy lọc"] },
    ]),
  ],
};

export const unitsKhtn: Unit[] = [{ id: "hh-khtn-1", title: "Hỗn hợp và dung dịch", lessons: [k01, k02] }];
