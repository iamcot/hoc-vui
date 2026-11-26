import type { Incident } from "@/lib/chem/types";

/** Sự cố khi làm sai: hiện thẻ "Vì sao?" và cất vào Sổ sự cố để bé nhớ */
export const INCIDENTS: Record<string, Incident> = {
  "tran-bot": {
    id: "tran-bot",
    title: "Bọt trào ra ngoài",
    emoji: "🫧",
    level: "soft",
    why: {
      nhi: "Con đổ nhiều giấm quá nhanh! Giấm gặp baking soda sinh ra rất nhiều bong bóng khí, cốc không chứa nổi nên bọt tràn ra.",
      khtn: "Giấm và baking soda phản ứng sinh ra khí CO₂. Đổ nhanh thì khí sinh ra một lúc rất nhiều, bọt dâng lên quá miệng cốc.",
      thcs: "Phản ứng CH₃COOH + NaHCO₃ tạo khí CO₂ rất nhanh. Lượng axit thêm vào một lần càng nhiều, thể tích khí sinh ra cùng lúc càng lớn.",
    },
    equation: ["CH₃COOH", "+", "NaHCO₃", "→", "CH₃COONa", "+", "H₂O", "+", "CO₂↑"],
    real: "Bọt không độc nhưng làm bẩn bàn. Giấm bắn vào mắt sẽ cay.",
    right: "Nhỏ từng chút một, nhìn bọt dâng rồi mới thêm. Đặt cốc trên khay.",
    home: true,
  },
  "tran-coc": {
    id: "tran-coc",
    title: "Rót đầy tràn cốc",
    emoji: "💦",
    level: "soft",
    why: {
      nhi: "Cốc đầy rồi mà con vẫn rót thêm, nước tràn ra ngoài mất rồi!",
      khtn: "Mỗi dụng cụ chỉ chứa được một thể tích nhất định. Nhìn vạch chia trên cốc để biết còn chứa được bao nhiêu.",
    },
    real: "Hoá chất tràn ra bàn có thể dính vào tay, vào quần áo.",
    right: "Chỉ rót tới khoảng 2/3 cốc, nhìn vạch chia.",
    home: true,
  },
  "natri-to": {
    id: "natri-to",
    title: "Natri quá to",
    emoji: "💥",
    level: "boom",
    why: {
      nhi: "Kim loại natri gặp nước thì nóng lên rất nhanh. Mẩu to quá nên nóng quá, bùm!",
      khtn: "Natri phản ứng mạnh với nước, sinh ra khí hiđro và rất nhiều nhiệt. Khí hiđro gặp nhiệt thì bắt lửa và nổ.",
      thcs: "Natri phản ứng với nước rất mạnh, sinh ra khí hiđro và toả nhiều nhiệt. Mẩu càng to, nhiệt càng nhiều, hiđro bắt lửa và nổ.",
      thpt: "Phản ứng toả nhiệt mạnh (ΔH < 0). Mẩu to nên tốc độ toả nhiệt lớn hơn tốc độ nhiệt thoát ra, natri nóng chảy, H₂ tự bốc cháy trong không khí.",
    },
    equation: ["2Na", "+", "2H₂O", "→", "2NaOH", "+", "H₂↑", "(+ nhiệt 🔥)"],
    frames: ["Mẩu Na to", "Sủi mạnh, nóng 90°C", "H₂ bắt lửa"],
    real: "Bắn dung dịch kiềm NaOH gây bỏng da, mảnh thuỷ tinh văng vào mắt.",
    right: "Mẩu nhỏ bằng hạt đậu xanh, dùng kẹp, đeo kính bảo hộ, đứng xa.",
    home: false,
  },
};
