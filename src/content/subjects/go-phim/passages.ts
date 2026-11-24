/**
 * Bài gõ hay: đoạn văn, ca dao, chuyện vui để gõ, có đủ đoạn ngắn, vừa, dài để đo WPM.
 * Ba loại: tiếng Việt không dấu (cho bé mới tập), tiếng Việt có dấu (gõ Telex trong app), tiếng Anh.
 * Ca dao, tục ngữ là văn học dân gian; các đoạn còn lại tự viết.
 */
export type PassageKind = "co-dau" | "khong-dau" | "en";
export interface Passage {
  id: string;
  title: string;
  emoji: string;
  kind: PassageKind;
  text: string;
}

export const PASSAGE_KINDS: { id: PassageKind; name: string; hint: string }[] = [
  { id: "co-dau", name: "Tiếng Việt có dấu", hint: "Gõ Telex (học xong trình độ Telex)" },
  { id: "khong-dau", name: "Tiếng Việt không dấu", hint: "Cho bạn mới tập, chưa cần bỏ dấu" },
  { id: "en", name: "Tiếng Anh", hint: "Đoạn văn tiếng Anh dễ đọc" },
];

export type PassageLength = "ngan" | "vua" | "dai";
export const LENGTH_NAME: Record<PassageLength, string> = { ngan: "Ngắn", vua: "Vừa", dai: "Dài" };
/** ngắn dưới 150 ký tự, vừa tới 350, dài hơn nữa */
export const lengthOf = (p: Passage): PassageLength => (p.text.length < 150 ? "ngan" : p.text.length <= 350 ? "vua" : "dai");
/** đoạn đủ dài thì WPM mới đáng tin, mới tính kỷ lục */
export const RECORD_MIN_CHARS = 120;
export const RECORD_MIN_ACC = 85;

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
  // ── tiếng Việt có dấu: vừa và dài ──
  { id: "bh-13", title: "Bầu trời đêm", emoji: "🌌", kind: "co-dau", text: "Khi trời tối hẳn, em ngước lên và thấy hàng nghìn ngôi sao nhỏ. Có ngôi sao sáng rực, có ngôi sao chỉ lấp lánh rất khẽ. Ánh sáng của chúng phải đi qua một quãng đường rất xa, rất lâu mới tới được mắt em." },
  { id: "bh-14", title: "Chú mèo hay ngủ", emoji: "🐱", kind: "co-dau", text: "Nhà em có một chú mèo lông vàng tên là Bông. Buổi sáng, Bông nằm phơi nắng trên bậu cửa sổ. Buổi trưa, Bông cuộn tròn trong chiếc giỏ mây. Đến tối, Bông mới tỉnh táo, chạy khắp nhà đuổi theo cái bóng của chính mình." },
  { id: "bh-15", title: "Cây xoài của ông", emoji: "🥭", kind: "co-dau", text: "Ông em trồng một cây xoài ở góc vườn từ khi bố em còn nhỏ. Mùa hè năm nào cây cũng sai trĩu quả. Ông bảo: muốn ăn quả ngọt thì phải chăm cây từ lúc nó còn bé, tưới nước đều, nhổ cỏ và kiên nhẫn chờ đợi." },
  { id: "bh-16", title: "Ngày đầu đến lớp", emoji: "🎒", kind: "co-dau", text: "Sáng hôm ấy, mẹ dắt em đến trường. Sân trường rộng, cờ đỏ bay phấp phới. Em hơi run, tay nắm chặt quai cặp. Cô giáo mỉm cười, cúi xuống hỏi tên em. Chỉ một lúc sau, em đã có người bạn đầu tiên ngồi cùng bàn, bạn ấy cho em mượn bút chì màu xanh." },
  { id: "bh-17", title: "Chuyến đi biển", emoji: "🏖️", kind: "co-dau", text: "Mùa hè vừa rồi, cả nhà em đi biển. Nước biển trong xanh, sóng vỗ rì rào vào bờ cát trắng. Em và anh trai xây một lâu đài cát thật to, có tường thành, có tháp canh và cả một con hào nhỏ. Đến chiều, thủy triều lên, sóng cuốn lâu đài đi mất. Anh trai cười bảo: không sao, ngày mai mình xây cái to hơn. Buổi tối, cả nhà ngồi ăn hải sản, nghe gió biển thổi mát rượi. Em mong mùa hè năm sau lại được quay về đây." },
  { id: "bh-18", title: "Con đường đến trường", emoji: "🚲", kind: "co-dau", text: "Con đường từ nhà em đến trường dài chừng hai cây số. Hai bên đường có hàng cây bàng tỏa bóng mát. Mùa xuân, lá bàng non xanh mướt như những ngọn nến nhỏ. Mùa hè, tán bàng xòe rộng che nắng cho chúng em. Mùa thu, lá chuyển sang màu đỏ cam rất đẹp. Còn mùa đông, cây trút hết lá, chỉ còn những cành khẳng khiu chờ đến ngày nảy lộc. Ngày nào em cũng đạp xe qua con đường ấy và thấy nó đổi khác một chút." },
  { id: "bh-19", title: "Robot nhỏ biết lắng nghe", emoji: "🤖", kind: "co-dau", text: "Trong phòng thí nghiệm của trường có một chú robot nhỏ. Chú không biết bay, cũng không biết nói nhiều. Nhưng mỗi khi có bạn nào buồn, chú lại lăn đến gần, bật đèn xanh và kiên nhẫn chờ bạn kể chuyện. Các bạn bảo nhau: robot ấy được lập trình để lắng nghe. Thầy giáo cười và nói rằng lắng nghe là một việc mà con người cũng cần học mỗi ngày. Từ đó, cả lớp thi nhau làm người bạn biết lắng nghe giống chú robot nhỏ." },
  { id: "bh-20", title: "Ăn quả nhớ kẻ trồng cây", emoji: "🌳", kind: "co-dau", text: "Ăn quả nhớ kẻ trồng cây. Uống nước nhớ nguồn." },
  // ── tiếng Việt không dấu: vừa và dài ──
  { id: "bh-21", title: "Ban phim than ky", emoji: "⌨️", kind: "khong-dau", text: "Ban phim co rat nhieu phim. Hang tren cung la cac so. Hang giua la hang phim co so, noi tam ngon tay nghi ngoi. Phim cach dai nhat nam o duoi cung, ngon cai bam vao no moi khi go xong mot tu." },
  { id: "bh-22", title: "Ca heo thong minh", emoji: "🐬", kind: "khong-dau", text: "Ca heo la loai vat rat thong minh. Chung song thanh dan, goi nhau bang tieng huyt sao va biet giup do nhau khi gap nguy hiem. Co nhung chu ca heo con biet choi dua voi song bien, nhay vot len khoi mat nuoc roi lan xuong that sau." },
  { id: "bh-23", title: "Buoi sang o nong trai", emoji: "🐓", kind: "khong-dau", text: "Troi vua hung sang, chu ga trong da gay o o o. Bac nong dan mo cua chuong cho dan bo ra dong. Dan vit lach bach xuong ao tam. Chu cho vang chay quanh san, vay duoi chao moi nguoi. Mot ngay moi o nong trai bat dau that ron rang. Ai cung co mot viec rieng, nhung tat ca cung lam cho nong trai tro nen vui ve va am no." },
  { id: "bh-24", title: "Hanh tinh do", emoji: "🪐", kind: "khong-dau", text: "Sao Hoa duoc goi la hanh tinh do vi mat dat cua no phu mot lop bui mau do cam. Tren Sao Hoa co nui lua rat cao va nhung hem nui rat sau. Cac nha khoa hoc da gui nhieu robot len do de chup anh, khoan dat va tim hieu xem ngay xua noi day co nuoc hay khong. Biet dau mai sau, mot ban nho hom nay se tro thanh nguoi dau tien dat chan len hanh tinh do." },
  { id: "bh-25", title: "Bi quyet go nhanh", emoji: "🏎️", kind: "khong-dau", text: "Muon go nhanh, truoc het phai go dung. Moi ngon tay chi phu trach mot vai phim. Mat nhin man hinh, khong nhin ban phim. Luc dau se cham, nhung neu tap deu moi ngay muoi lam phut, ngon tay se tu nho duong di. Sau vai tuan, em se thay minh go nhanh hon ma khong can co gang. Dieu quan trong nhat la kien nhan va giu tu the ngoi dung de lung khong bi moi." },
  // ── tiếng Anh ──
  { id: "en-01", title: "My cat", emoji: "🐈", kind: "en", text: "I have a little cat. She likes to sleep in the sun and play with a ball of yarn." },
  { id: "en-02", title: "The rainbow", emoji: "🌈", kind: "en", text: "After the rain, a rainbow came out. It had red, orange, yellow, green, blue and purple. We ran outside to see it before it was gone." },
  { id: "en-03", title: "A busy bee", emoji: "🐝", kind: "en", text: "The bee flies from flower to flower all day long. It drinks sweet nectar and carries yellow pollen on its legs. Back at the hive, the bees work together to make honey for the cold winter." },
  { id: "en-04", title: "The robot friend", emoji: "🤖", kind: "en", text: "Tom built a small robot out of old boxes, bottle caps and a few wires. The robot could not talk, but it could blink its lights and roll across the floor. Every morning, Tom said hello, and the robot blinked twice to say hello back." },
  { id: "en-05", title: "Under the sea", emoji: "🐠", kind: "en", text: "Deep under the sea, there is a quiet world full of color. Bright fish swim between the corals, a turtle glides slowly past, and a shy octopus hides inside a rock. Some fish make their own light so they can find their way in the dark water far below the waves." },
  { id: "en-06", title: "Learning to type", emoji: "⌨️", kind: "en", text: "When you learn to type, start with your fingers on the home row. Your left hand rests on A, S, D and F, and your right hand rests on J, K, L and the semicolon. Keep your eyes on the screen, not on your hands. At first it feels slow, but if you practice a little every day, your fingers will learn the way by themselves. Soon you will type faster than you can write with a pencil, and you will make fewer mistakes too." },
  { id: "en-07", title: "A trip to the moon", emoji: "🚀", kind: "en", text: "One night, Lily dreamed that she flew to the moon in a silver rocket. The ground was gray and dusty, and every step made her bounce high into the air. She looked back and saw the Earth, a bright blue ball floating in the dark sky. It looked so small and so beautiful. Lily picked up a small moon rock, put it in her pocket and waved goodbye to the stars. When she woke up, she looked in her pocket, but all she found was a little gray button." },
  { id: "en-08", title: "The four seasons", emoji: "🍂", kind: "en", text: "In spring, new leaves grow and flowers open in the warm sun. In summer, the days are long and we swim in the cool river. In autumn, the leaves turn red and gold and fall softly to the ground. In winter, the air is cold, the trees are bare and we drink hot milk at home. Every season has something special, and each one teaches us that change can be beautiful." },
];
