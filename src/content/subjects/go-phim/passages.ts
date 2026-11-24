/**
 * Bài gõ hay: đoạn văn, ca dao, chuyện vui để gõ. Bài không dấu cho bé mới tập,
 * bài có dấu (gõ Telex trong app) sau khi học trình độ Telex.
 * Ca dao, tục ngữ là văn học dân gian; các đoạn còn lại tự viết.
 */
export interface Passage {
  id: string;
  title: string;
  emoji: string;
  /** "khong-dau" | "co-dau" */
  kind: "khong-dau" | "co-dau";
  text: string;
}

export const PASSAGES: Passage[] = [
  { id: "bh-01", title: "Mười người bạn", emoji: "🖐️", kind: "khong-dau", text: "Em co muoi ngon tay. Moi ngon co mot nhiem vu rieng. Khi ca muoi ngon cung lam viec, em go nhanh nhu gio." },
  { id: "bh-02", title: "Cá mập đói bụng", emoji: "🦈", kind: "khong-dau", text: "Con ca map boi qua rang san ho. No tim thay mot chiec ban phim cu. No can thu mot phim va keu: that kho an!" },
  { id: "bh-03", title: "Thỏ Bit lặn biển", emoji: "🐰", kind: "khong-dau", text: "Tho Bit doi mu lan, bat den xanh va lan xuong bien sau. Duoi day bien co mot thanh pho phat sang. Bit go mat khau de mo cong." },
  { id: "bh-04", title: "Bí mật hàng phím cơ sở", emoji: "🏠", kind: "khong-dau", text: "asdf jkl; la hang phim co so. Ngon tay di dau roi cung ve nha. Go xong mot phim, ngon tay lai nam yen tren hang phim co so." },
  { id: "bh-05", title: "Có công mài sắt", emoji: "⚒️", kind: "co-dau", text: "Có công mài sắt, có ngày nên kim." },
  { id: "bh-06", title: "Công cha nghĩa mẹ", emoji: "⛰️", kind: "co-dau", text: "Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra." },
  { id: "bh-07", title: "Bầu ơi thương lấy bí cùng", emoji: "🎃", kind: "co-dau", text: "Bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một giàn." },
  { id: "bh-08", title: "Biển sâu bí ẩn", emoji: "🌊", kind: "co-dau", text: "Ở nơi sâu nhất của đại dương, ánh sáng mặt trời không chiếu tới. Nhiều loài cá tự phát sáng để tìm đường và tìm bạn." },
  { id: "bh-09", title: "Cá mập có răng mới", emoji: "🦷", kind: "co-dau", text: "Cá mập thay răng suốt đời. Một chiếc răng rụng, chiếc răng mới ở hàng sau sẽ tiến lên thay ngay." },
  { id: "bh-10", title: "Máy tính đầu tiên", emoji: "🖥️", kind: "co-dau", text: "Những chiếc máy tính đầu tiên to bằng cả căn phòng. Ngày nay, chiếc điện thoại trong túi em còn mạnh hơn chúng rất nhiều lần." },
  { id: "bh-11", title: "Đi một ngày đàng", emoji: "🧭", kind: "co-dau", text: "Đi một ngày đàng, học một sàng khôn." },
  { id: "bh-12", title: "Gõ phím đúng cách", emoji: "⌨️", kind: "co-dau", text: "Ngồi thẳng lưng, mắt nhìn màn hình, tay đặt trên hàng phím cơ sở. Gõ đúng trước, rồi tốc độ sẽ tự đến." },
];
