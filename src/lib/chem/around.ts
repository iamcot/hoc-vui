/** Nguyên tố quanh ta: đồ vật quen thuộc làm từ nguyên tố nào (số hiệu nguyên tử) */
export interface Thing {
  id: string;
  emoji: string;
  name: string;
  /** số hiệu các nguyên tố chính; chạm một trong số đó là đúng */
  els: number[];
  /** lời Bit nói khi chạm vật */
  say: string;
  /** gợi ý khi đố (không nhắc tên nguyên tố) */
  hint: string;
}

export const THINGS: Thing[] = [
  { id: "lon", emoji: "🥫", name: "Lon nước ngọt", els: [13], say: "Làm từ **Nhôm (Al)**: nhẹ, màu bạc, không gỉ nên tái chế được nhiều lần.", hint: "Kim loại nhẹ, màu bạc, không gỉ." },
  { id: "muoi", emoji: "🧂", name: "Muối ăn", els: [11, 17], say: "Là **Natri (Na)** kết hợp **Clo (Cl)**. Một kim loại nổ và một khí độc hợp lại thành thứ ăn được!", hint: "Gồm một kim loại kiềm và một halogen." },
  { id: "den", emoji: "💡", name: "Bóng đèn sợi đốt", els: [74], say: "Dây tóc làm từ **Vonfram (W)**: nóng chảy ở hơn 3400°C nên sáng rực mà không chảy.", hint: "Kim loại chịu nóng nhất, hơn 3400°C mới chảy." },
  { id: "diem", emoji: "🔥", name: "Que diêm", els: [15], say: "Hộp quẹt có **Photpho (P)**. Quẹt mạnh, ma sát làm photpho bắt lửa.", hint: "Phi kim, nhóm 15, ma sát là bắt lửa." },
  { id: "phaohoa", emoji: "🎆", name: "Pháo hoa", els: [12, 11, 29], say: "**Magie (Mg)** cháy trắng chói, **Natri (Na)** cho màu vàng, **Đồng (Cu)** cho màu xanh lục.", hint: "Kim loại cháy sáng chói, nhóm kiềm thổ." },
  { id: "day", emoji: "🔌", name: "Dây điện", els: [29], say: "Lõi dây là **Đồng (Cu)**: dẫn điện rất tốt, màu cam đỏ.", hint: "Kim loại màu cam đỏ, dẫn điện tốt." },
  { id: "nhan", emoji: "💍", name: "Nhẫn vàng", els: [79], say: "Là **Vàng (Au)**: không gỉ, không xỉn, nên đẹp mãi.", hint: "Kim loại quý, màu vàng óng, không bao giờ gỉ." },
  { id: "nhietke", emoji: "🌡️", name: "Nhiệt kế thuỷ ngân", els: [80], say: "Cột bạc là **Thuỷ ngân (Hg)**, kim loại duy nhất lỏng ở nhiệt độ phòng. Vỡ thì rất độc!", hint: "Kim loại lỏng duy nhất ở nhiệt độ phòng." },
  { id: "kem", emoji: "🪥", name: "Kem đánh răng", els: [9], say: "Có **Flo (F)** giúp men răng chắc hơn, chống sâu răng.", hint: "Halogen đứng đầu nhóm, giúp răng chắc." },
  { id: "bong", emoji: "🎈", name: "Bóng bay bay lên", els: [2], say: "Bơm **Heli (He)**: nhẹ gần bằng không khí một nửa, lại không cháy nên an toàn.", hint: "Khí hiếm nhẹ nhất, hít vào giọng the thé." },
  { id: "chuoi", emoji: "🍌", name: "Quả chuối", els: [19], say: "Có nhiều **Kali (K)**, giúp cơ bắp và tim hoạt động. Nguyên tố này nổ khi gặp nước nhưng trong chuối thì hiền lành!", hint: "Kim loại kiềm, có nhiều trong chuối." },
  { id: "pin", emoji: "🔋", name: "Pin điện thoại", els: [3], say: "Pin sạc dùng **Liti (Li)**: kim loại nhẹ nhất, chứa được rất nhiều điện.", hint: "Kim loại nhẹ nhất, đứng đầu nhóm kiềm sau hiđro." },
];
