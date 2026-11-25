/**
 * Danh mục chất và vật dùng trong phòng thí nghiệm ảo (môn Thí nghiệm hoá).
 * Mỗi lần bé thả một chất vào cốc là thêm 1 "liều" (dose). pH, màu, phản ứng tính từ số liều.
 */

export type ChemKind = "liquid" | "solid" | "indicator" | "object" | "metal";

export interface Chem {
  id: string;
  name: string;
  /** công thức (hiện từ Hoá THCS) */
  formula?: string;
  kind: ChemKind;
  /** màu dung dịch hoặc màu hạt/vật */
  color: string;
  emoji?: string;
  /** độ axit mỗi liều (càng lớn càng chua) */
  acid?: number;
  /** độ bazơ mỗi liều */
  base?: number;
  /** pH của chính chất đó (để mép thang pH không vượt quá) */
  ph?: number;
  /** chất rắn: tan trong nước không */
  soluble?: boolean;
  /** dầu: nổi thành lớp riêng */
  oil?: boolean;
  /** vật: khối lượng riêng (nước = 1) */
  density?: number;
  /** muối cacbonat: gặp axit sinh khí CO₂ */
  carbonate?: boolean;
  /** ở đâu trong nhà / dùng làm gì (chạm vào chất để xem) */
  note?: string;
  /** ống nghiệm/kệ: viết tắt hiện trên nhãn */
  short?: string;
}

const C = (c: Chem) => c;

export const CHEMS: Record<string, Chem> = Object.fromEntries(
  [
    C({ id: "nuoc", name: "Nước", formula: "H₂O", kind: "liquid", color: "#bfe0ff", ph: 7, note: "Nước lọc, trong suốt, không màu" }),
    C({ id: "bap-cai", name: "Nước bắp cải tím", kind: "indicator", color: "#8a4fd0", ph: 7, note: "Luộc hoặc xay bắp cải tím rồi lọc lấy nước. Đổi màu theo độ chua" }),
    C({ id: "chanh", name: "Nước chanh", kind: "liquid", color: "#ffe066", acid: 1.2, ph: 2.3, emoji: "🍋", note: "Rất chua, có axit citric" }),
    C({ id: "giam", name: "Giấm", formula: "CH₃COOH", kind: "liquid", color: "#f3eed8", acid: 1, ph: 2.9, emoji: "🍶", note: "Giấm ăn trong bếp, chứa axit axetic" }),
    C({ id: "xa-phong", name: "Nước xà phòng", kind: "liquid", color: "#e9f7ff", base: 0.9, ph: 10, emoji: "🧼", note: "Hơi nhờn, có tính bazơ (kiềm)" }),
    C({ id: "baking-soda", name: "Baking soda", formula: "NaHCO₃", kind: "solid", color: "#ffffff", base: 0.35, ph: 8.3, soluble: true, carbonate: true, emoji: "🧂", note: "Bột nở làm bánh, tên hoá học natri hiđrocacbonat" }),
    C({ id: "muoi", name: "Muối ăn", formula: "NaCl", kind: "solid", color: "#ffffff", soluble: true, emoji: "🧂", note: "Muối hạt trong bếp" }),
    C({ id: "duong", name: "Đường", kind: "solid", color: "#fff8e6", soluble: true, emoji: "🍬", note: "Đường kính trắng" }),
    C({ id: "cat", name: "Cát", kind: "solid", color: "#d9b26a", soluble: false, emoji: "🏖️", note: "Cát xây nhà, không tan trong nước" }),
    C({ id: "dau-an", name: "Dầu ăn", kind: "liquid", color: "#ffd23f", oil: true, emoji: "🫒", note: "Nhẹ hơn nước và không trộn với nước" }),
    C({ id: "da", name: "Hòn đá", kind: "object", color: "#8a8fa8", density: 2.6, emoji: "🪨" }),
    C({ id: "go", name: "Miếng gỗ", kind: "object", color: "#c98a4b", density: 0.6, emoji: "🪵" }),
    C({ id: "dong-xu", name: "Đồng xu", kind: "object", color: "#e0a84a", density: 8.9, emoji: "🪙" }),
    C({ id: "qua-chanh", name: "Quả chanh", kind: "object", color: "#9be15d", density: 0.9, emoji: "🍋" }),
    C({ id: "trung", name: "Quả trứng", kind: "object", color: "#fff1d6", density: 1.05, emoji: "🥚" }),
    C({ id: "vit", name: "Vịt cao su", kind: "object", color: "#ffd23f", density: 0.2, emoji: "🐤" }),
    C({ id: "phenol", name: "Phenolphtalein", kind: "indicator", color: "#f4f0ff", ph: 7, note: "Chất chỉ thị: không màu trong axit và nước, hồng trong bazơ" }),
    C({ id: "naoh", name: "Natri hiđroxit", formula: "NaOH", kind: "liquid", color: "#e9f4ff", base: 1.5, ph: 13, note: "Bazơ mạnh, ăn da. Sinh ra khi natri gặp nước" }),
    C({ id: "natri", name: "Natri (mẩu nhỏ)", formula: "Na", kind: "metal", color: "#d9dce6", note: "Kim loại mềm, phản ứng mạnh với nước. Chỉ dùng mẩu bằng hạt đậu xanh" }),
    C({ id: "hcl", name: "Axit clohiđric", formula: "HCl", kind: "liquid", color: "#eef6ff", acid: 1.5, ph: 1.5, emoji: "🧪", note: "Axit mạnh trong phòng thí nghiệm, loãng. Làm đỏ giấy quỳ, ăn mòn tay" }),
    C({ id: "cuso4", name: "Đồng sunfat", formula: "CuSO₄", kind: "liquid", color: "#2f8fe8", emoji: "🔵", note: "Dung dịch màu xanh lam đặc trưng của muối đồng" }),
    C({ id: "feso4", name: "Sắt(II) sunfat", formula: "FeSO₄", kind: "liquid", color: "#a9d8b8", note: "Dung dịch xanh lục nhạt, sinh ra khi sắt đẩy đồng" }),
    C({ id: "znso4", name: "Kẽm sunfat", formula: "ZnSO₄", kind: "liquid", color: "#eaf4ff", note: "Dung dịch không màu" }),
    C({ id: "zn", name: "Viên kẽm", formula: "Zn", kind: "object", color: "#b9c2d4", density: 7.1, emoji: "🔘", note: "Kim loại xám bạc, đứng trước hiđro trong dãy hoạt động" }),
    C({ id: "fe", name: "Đinh sắt", formula: "Fe", kind: "object", color: "#8d95a8", density: 7.9, emoji: "🔩", note: "Đinh sắt sạch, đứng trước đồng trong dãy hoạt động" }),
    C({ id: "cu", name: "Dây đồng", formula: "Cu", kind: "object", color: "#c9743a", density: 8.9, emoji: "🟤", note: "Kim loại màu đỏ, đứng sau hiđro trong dãy hoạt động" }),
    C({ id: "natri-to", name: "Natri (mẩu to)", formula: "Na", kind: "metal", color: "#d9dce6", note: "Mẩu to bằng viên kẹo… có an toàn không?" }),
  ].map((c) => [c.id, c]),
);

export const chem = (id: string) => CHEMS[id];
