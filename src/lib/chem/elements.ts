/** 118 nguyên tố: tên tiếng Việt (theo chương trình 2018), vị trí trên bảng, nhóm "tính cách" */

export type Cat = "kiem" | "kiemtho" | "chuyentiep" | "sau" | "akim" | "phikim" | "halogen" | "khihiem" | "lantan" | "actinit";

export interface Element {
  z: number;
  sym: string;
  name: string;
  cat: Cat;
  /** hàng (1–7, lantanit 8, actinit 9) và cột (1–18) trên bảng */
  row: number;
  col: number;
  /** câu "mình là ai" ở ngôi thứ nhất, không nhắc tên (dùng cho thẻ và trò đi săn) */
  fact?: string;
}

export const CATS: Record<Cat, { name: string; trait: string; bg: string }> = {
  kiem: { name: "Kim loại kiềm", trait: "Nhóm nghịch ngợm: mềm như bơ, thả vào nước là xèo xèo, có khi nổ!", bg: "#ff8a7a" },
  kiemtho: { name: "Kiềm thổ", trait: "Nhóm sáng chói: cháy lên rất rực, có trong xương, răng và pháo hoa.", bg: "#ffb766" },
  chuyentiep: { name: "Kim loại chuyển tiếp", trait: "Nhóm cứng cáp: làm đồ dùng, dây điện, máy móc, trang sức quanh ta.", bg: "#8fc5ff" },
  sau: { name: "Kim loại yếu", trait: "Nhóm mềm mại: dễ nóng chảy, dùng làm hộp, mối hàn, pin.", bg: "#9fe0c8" },
  akim: { name: "Á kim", trait: "Nhóm lưng chừng: nửa giống kim loại nửa giống phi kim, làm ra con chip.", bg: "#b8e06a" },
  phikim: { name: "Phi kim", trait: "Nhóm làm nên sự sống: có trong không khí, nước, cơ thể và nhiên liệu.", bg: "#ffe066" },
  halogen: { name: "Halogen", trait: "Nhóm hung dữ: phản ứng rất mạnh, diệt khuẩn nhưng độc, nhớ cẩn thận!", bg: "#ff9be0" },
  khihiem: { name: "Khí hiếm", trait: "Nhóm lười: không chịu kết bạn với ai nên gần như không phản ứng.", bg: "#c3a6ff" },
  lantan: { name: "Họ lantan (đất hiếm)", trait: "Nhóm đất hiếm: nằm trong nam châm mạnh và màn hình điện thoại.", bg: "#7fe0e8" },
  actinit: { name: "Họ actini", trait: "Nhóm phóng xạ: hạt nhân không bền, nhiều chất do con người tạo ra.", bg: "#f4a3b8" },
};

const NAMES = `Hiđro H|Heli He|Liti Li|Beri Be|Bo B|Cacbon C|Nitơ N|Oxi O|Flo F|Neon Ne|Natri Na|Magie Mg|Nhôm Al|Silic Si|Photpho P|Lưu huỳnh S|Clo Cl|Agon Ar|Kali K|Canxi Ca|Scandi Sc|Titan Ti|Vanadi V|Crom Cr|Mangan Mn|Sắt Fe|Coban Co|Niken Ni|Đồng Cu|Kẽm Zn|Gali Ga|Gecmani Ge|Asen As|Selen Se|Brom Br|Krypton Kr|Rubidi Rb|Stronti Sr|Ytri Y|Zirconi Zr|Niobi Nb|Molipđen Mo|Tecneti Tc|Ruteni Ru|Rodi Rh|Paladi Pd|Bạc Ag|Cadimi Cd|Indi In|Thiếc Sn|Antimon Sb|Telu Te|Iot I|Xenon Xe|Xesi Cs|Bari Ba|Lantan La|Xeri Ce|Praseođim Pr|Neođim Nd|Promethi Pm|Samari Sm|Europi Eu|Gađolini Gd|Terbi Tb|Đysprosi Dy|Honmi Ho|Erbi Er|Tuli Tm|Ytecbi Yb|Luteti Lu|Hafni Hf|Tantan Ta|Vonfram W|Reni Re|Osmi Os|Iriđi Ir|Platin Pt|Vàng Au|Thuỷ ngân Hg|Tali Tl|Chì Pb|Bitmut Bi|Poloni Po|Astatin At|Radon Rn|Franxi Fr|Radi Ra|Actini Ac|Thori Th|Protactini Pa|Urani U|Neptuni Np|Plutoni Pu|Americi Am|Curi Cm|Berkeli Bk|Californi Cf|Einsteini Es|Fermi Fm|Mendelevi Md|Nobeli No|Lorenxi Lr|Rutherfordi Rf|Dubni Db|Seaborgi Sg|Bohri Bh|Hassi Hs|Meitneri Mt|Darmstadti Ds|Roentgeni Rg|Copernixi Cn|Nihoni Nh|Flerovi Fl|Moscovi Mc|Livermori Lv|Tennessin Ts|Oganesson Og`.split("|");

const FACTS: Record<number, string> = {
  1: "Mình nhẹ nhất vũ trụ và là nhiên liệu của Mặt Trời.",
  2: "Mình bơm được bóng bay lên trời, hít vào còn làm giọng the thé.",
  3: "Mình nằm trong pin điện thoại của con.",
  6: "Than chì và kim cương đều là mình, chỉ khác cách xếp.",
  7: "Mình chiếm khoảng 78% không khí con đang thở.",
  8: "Con hít mình mỗi giây, lửa cũng cần mình để cháy.",
  9: "Mình có trong kem đánh răng, giúp răng chắc khoẻ.",
  10: "Mình làm đèn quảng cáo phát sáng màu đỏ cam.",
  11: "Mình ở trong muối ăn, nhưng thả mình nguyên chất vào nước là xèo xèo!",
  12: "Mình cháy sáng chói trong pháo hoa và que pháo sáng.",
  13: "Mình làm lon nước ngọt và giấy bạc, nhẹ mà không gỉ.",
  14: "Mình có trong cát và làm ra con chip máy tính.",
  15: "Mình nằm ở đầu que diêm, quẹt là bắt lửa.",
  16: "Mình có màu vàng, mùi trứng thối, hay ở gần miệng núi lửa.",
  17: "Mình có trong nước hồ bơi để diệt vi khuẩn.",
  18: "Mình là khí hiếm nhiều nhất trong không khí, rất lười phản ứng.",
  19: "Mình có nhiều trong chuối và giúp cơ bắp hoạt động.",
  20: "Mình có trong xương, răng, vỏ trứng và vỏ sò.",
  22: "Mình bền như thép nhưng nhẹ hơn, dùng làm khung xe đạp và khớp nhân tạo.",
  26: "Mình làm cây đinh, cây cầu và có trong máu của con. Để ngoài mưa thì mình gỉ.",
  29: "Mình làm dây điện và đồng xu, có màu cam đỏ.",
  30: "Mình mạ lên tôn để chống gỉ, ăn kẽm giúp con mau lớn.",
  35: "Mình là chất lỏng màu nâu đỏ, bốc khói độc, mùi rất hắc.",
  47: "Mình sáng trắng, dẫn điện nhất, dùng làm gương và đồ trang sức.",
  50: "Mình dùng để hàn mạch điện và mạ vỏ hộp đồ ăn.",
  53: "Mình tạo ra dung dịch tím sát trùng vết thương.",
  74: "Mình nóng chảy ở nhiệt độ cao nhất nên làm dây tóc bóng đèn.",
  79: "Mình màu vàng óng, không bao giờ gỉ, rất quý.",
  80: "Mình là kim loại ở thể lỏng ngay ở nhiệt độ phòng, nhưng rất độc.",
  82: "Mình rất nặng và mềm, từng dùng làm ống nước nhưng độc cho cơ thể.",
  86: "Mình là khí phóng xạ sinh ra từ lòng đất.",
  92: "Mình là nhiên liệu của nhà máy điện hạt nhân.",
  118: "Mình nặng nhất bảng tuần hoàn và chỉ do con người tạo ra.",
};

function catOf(z: number): Cat {
  if ([3, 11, 19, 37, 55, 87].includes(z)) return "kiem";
  if ([4, 12, 20, 38, 56, 88].includes(z)) return "kiemtho";
  if ([5, 14, 32, 33, 51, 52].includes(z)) return "akim";
  if ([1, 6, 7, 8, 15, 16, 34].includes(z)) return "phikim";
  if ([9, 17, 35, 53, 85, 117].includes(z)) return "halogen";
  if ([2, 10, 18, 36, 54, 86, 118].includes(z)) return "khihiem";
  if (z >= 57 && z <= 71) return "lantan";
  if (z >= 89 && z <= 103) return "actinit";
  if ([13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116].includes(z)) return "sau";
  return "chuyentiep";
}

function place(z: number): [number, number] {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 18];
  if (z <= 4) return [2, z - 2];
  if (z <= 10) return [2, z + 8];
  if (z <= 12) return [3, z - 10];
  if (z <= 18) return [3, z];
  if (z <= 36) return [4, z - 18];
  if (z <= 54) return [5, z - 36];
  if (z <= 56) return [6, z - 54];
  if (z <= 71) return [8, z - 54]; // La → cột 3
  if (z <= 86) return [6, z - 68];
  if (z <= 88) return [7, z - 86];
  if (z <= 103) return [9, z - 86]; // Ac → cột 3
  return [7, z - 100];
}

export const ELEMENTS: Element[] = NAMES.map((s, i) => {
  const z = i + 1;
  const parts = s.split(" ");
  const sym = parts.pop()!;
  const [row, col] = place(z);
  return { z, sym, name: parts.join(" "), cat: catOf(z), row, col, fact: FACTS[z] };
});

export const element = (z: number) => ELEMENTS[z - 1];
/** nguyên tố có câu "mình là ai" để chơi đi săn */
export const HUNTABLE = ELEMENTS.filter((e) => e.fact);
