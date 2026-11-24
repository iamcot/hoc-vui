# Học Vui · Kế hoạch

App học tập cho con, lớp 1 đến 12, bám chương trình GDPT 2018. Một khung chung, cắm nhiều môn vào.
Môn đầu tiên: **Máy tính Casio fx-580VN X**, chia trình độ Lớp 6 → 9. Muốn học vượt thì làm thử thách 10 câu (đúng 8) của trình độ trước để mở khóa.

## Kiến trúc

- **Next.js (App Router) + TypeScript + Tailwind**, chạy như app trên điện thoại (PWA, cài ra màn hình chính, thanh tab dưới đáy).
- **Supabase**: đăng nhập (email + mật khẩu), lưu tiến trình, phòng thi đấu, bảng xếp hạng. Chưa cấu hình Supabase thì app chạy ở **chế độ khách**, lưu tiến trình trên máy.
- **Deploy**: Vercel (kết nối repo, thêm 2 biến môi trường Supabase). Giữ trung lập để sau chuyển lên server riêng được: không dùng tính năng riêng của Vercel, chỉ dùng phần Supabase tự host được. Có Dockerfile và hướng dẫn ở `docs/SELF_HOST.md`.
- **Nội dung là dữ liệu**: `src/content/subjects/<môn>/` gồm trình độ → chặng → bài → slide + bộ sinh bài tập. Thêm môn mới không phải sửa màn hình. Luật mở khóa ở `src/lib/tiers.ts`.
- **Ảnh/âm thanh**: danh mục ở `src/content/assets.ts`, prompt in ra `docs/ASSET_PROMPTS.md`. Chưa có file thì app tự hiện hình thay thế.

## Luồng học của con

1. **Học**: chọn môn → bản đồ các chặng → bài học dạng slide có Mochi dẫn chuyện, bàn phím FX580 ảo để bấm theo, câu hỏi nhanh.
2. **Luyện tập**: mỗi bài có bộ sinh đề ngẫu nhiên, làm bao nhiêu lần cũng được, chấm sao.
3. **Kiểm tra trình độ**: 15 câu trộn các bài, ra cấp độ (Hạt mầm → Cây nở hoa) và gợi ý bài cần ôn.
4. **Thi đấu**: tạo phòng có mã 6 ký tự, gửi link cho bạn; cả phòng cùng một đề, tính điểm theo đúng + tốc độ.
5. **Xếp hạng**: bảng xếp hạng điểm kinh nghiệm (XP) theo tuần và toàn thời gian, bảng điểm từng phòng.

## Tiến độ

### Giai đoạn 1 · Bản đầu (xong, chờ góp ý)
- [x] Khung dự án Next.js + Tailwind + Supabase client
- [x] Mô hình nội dung đa môn, đa lớp
- [x] 10 bài FX580 lớp 6 + bộ sinh bài tập cho từng bài
- [x] Danh mục ảnh/âm thanh kèm prompt
- [x] Giao diện app: thanh bên (iPad/laptop) + tab dưới (điện thoại), trang chủ, bản đồ bài học, màn hình bài học
- [x] Bàn phím FX580 ảo (bấm theo từng bước) + chế độ dùng máy thật
- [x] Luyện tập + chấm điểm + XP
- [x] Kiểm tra trình độ
- [x] Đăng nhập, hồ sơ, chế độ khách
- [x] Thi đấu theo phòng + bảng xếp hạng (Supabase)
- [x] SQL migration + hướng dẫn deploy Vercel/Supabase
- [x] PWA (manifest, icon)

### Giai đoạn 2 · Hoàn thiện
- [ ] Deploy Vercel + Supabase (bạn tạo project, mình hướng dẫn trong README)
- [x] Đăng nhập bằng tên đăng nhập + mật khẩu, không cần email (cần tắt Confirm email trong Supabase)
- [x] Rà chỗ dính chặt Vercel/Supabase cloud: không có. Thêm build standalone, Dockerfile, docker-compose, hướng dẫn chuyển server riêng và tự host Supabase (`docs/SELF_HOST.md`)
- [x] Chỉnh giao diện theo góp ý: màu đậm hơn, bỏ khung thẻ, cảnh nền minh họa
- [ ] Gắn ảnh/âm thanh thật (bạn tạo theo `docs/ASSET_PROMPTS.md`): đợt 1 xong 27 ảnh + 4 giọng đọc
- [x] Tool tạo ảnh/âm thanh: `npm run gen-assets` (ElevenLabs API, OpenAI API) và `npm run asset-helper` (ChatGPT bán tự động)
- [ ] Phụ huynh xem tiến trình của con
- [ ] Thử trên điện thoại thật, chỉnh hoạt họa
- [ ] Chuỗi ngày học (streak), nhắc học

### Giai đoạn 2b · Môn Máy tính nhiều trình độ
- [x] Môn → trình độ (Lớp 6, 7, 8, 9) → chặng → bài; tiến trình cũ tự chuyển sang
- [x] Thử thách vượt cấp 10 câu, đúng 8 là mở trình độ sau; kiểm tra theo từng trình độ
- [x] Đấu trường chọn môn + trình độ
- [x] Trình độ Lớp 7: 6 bài (số hữu tỉ, lũy thừa, căn bậc hai, tỉ lệ thức, đại lượng tỉ lệ, thống kê)
- [x] Trình độ Lớp 8: 6 bài (giá trị đa thức, hằng đẳng thức, phương trình bậc nhất, Pythagore, hàm số bậc nhất, xác suất)
- [x] Trình độ Lớp 9: 6 bài (căn bậc hai/ba, hệ phương trình, phương trình bậc hai, lượng giác, đường tròn, hình trụ/nón/cầu)
- [x] Ảnh bìa 6 bài lớp 7
- [ ] Ảnh bìa 12 bài lớp 8, 9 (prompt `fx8-l0x-cover`, `fx9-l0x-cover` trong docs/ASSET_PROMPTS.md)
- [ ] Kiểm tra trên máy thật: π (SHIFT ×10ˣ), sin⁻¹ (SHIFT sin), ∛ (SHIFT √)

### Giai đoạn 2c · Môn Tập đọc (vỡ lòng → đọc trơn)
Bám mạch Tiếng Việt 1 GDPT 2018 (âm, chữ → thanh → chữ ghép → vần → từ, câu → đoạn, thơ), từ khóa và bài đọc tự viết cho vui hơn. Chữ to là chính, emoji nhỏ thay tranh. Mỗi bài: gặp chữ → ghép tiếng (đánh vần "bờ – an – ban – huyền – bàn") → bé đọc to, máy chấm từng tiếng → thử nhanh. Luyện tập: nghe chọn chữ, tìm tiếng có vần, ghép âm + vần + dấu, đọc to, điền tiếng thiếu, đọc hiểu.
- [x] Lộ trình 4 trình độ, 58 bài: Vỡ lòng 15, Học vần 31, Đọc câu 6, Đọc trơn 6 (`src/content/subjects/tap-doc/data.ts`)
- [x] Bộ xử lý tiếng Việt: tách âm đầu/vần/thanh, đánh vần, so khớp lời đọc theo từng tiếng (`src/lib/viet.ts`)
- [x] Thẻ chữ to, ghép tiếng có hoạt họa, đọc to có tô màu đúng/sai dấu/sai, bản đồ hiện chữ thay ảnh bìa
- [x] Ghi âm WAV chạy cả Safari iPad; chấm bằng dịch vụ đám mây (`/api/nghe`, Google hoặc OpenAI) → nhận dạng của trình duyệt → tự nghe lại và tự chấm
- [x] Giọng đọc mẫu: dùng file ElevenLabs nếu có, chưa có thì dùng giọng tiếng Việt của máy; danh sách 1.126 câu/tiếng ở `docs/TAPDOC_VOICES.md`
- [ ] Bạn góp ý ảnh chụp màn hình (`mockups-tapdoc/`)
- [x] Chọn dịch vụ nhận dạng giọng nói: Azure Speech (vi-VN)
- [ ] Đặt khóa Azure trên Vercel (README mục 4)
- [ ] Tạo giọng đọc mẫu (ưu tiên âm, vần, từ khóa trước) và 3 ảnh mới
- [ ] Thử ghi âm trên iPad thật với giọng bé
- [ ] Bổ sung: tập viết chữ (vẽ theo nét), chính tả nghe viết, đo tốc độ đọc (tiếng/phút)

### Giai đoạn 2d · Môn Gõ phím 10 ngón (vừa học vừa chơi)
Tông công nghệ cho bé lớn: biển sâu neon, nhân vật **thỏ Bit** (STYLE_CYBER trong `src/content/assets.ts`). Học không dấu trước, cuối cùng mới học Telex; app tự ghép Telex nên không cần Unikey.
- [x] Bàn phím ảo mỗi ngón một màu, phím cần gõ nhấp nháy, nhắc ngón nào bấm (`src/lib/typing/keyboard.ts`)
- [x] Bộ ghép Telex trong app: aa → â, ow → ơ, dd → đ, s f r x j ở cuối tiếng (`src/lib/typing/telex.ts`)
- [x] 24 bài, 4 trình độ: Hàng nhà (từng ngón) → Từng bàn tay → Phối hợp (Shift, dấu câu, số, câu) → Telex
- [x] Luyện tập = game thợ lặn bắn cá mập: cá mang chữ, gõ chữ đầu để khóa mục tiêu, đo WPM và độ chính xác
- [x] Thử thách vượt cấp, kiểm tra trình độ: gõ lại từng dòng, đạt khi chính xác từ 90%
- [x] Chế độ Sinh tồn (3 mạng, cá nhanh dần, chữ lấy từ bài đã học), Bài gõ hay (12 đoạn văn, ca dao)
- [x] Đua xe trong phòng thi đấu: cùng một đoạn theo mã phòng, xe bạn bè chạy trực tiếp (Supabase Realtime), không có ai thì đua với xe máy; điểm = WPM × độ chính xác
- [ ] Bạn góp ý ảnh chụp (`mockups-gophim/`) và chốt nhân vật thỏ Bit
- [ ] Tạo ảnh (bắt đầu từ `bit-happy`, rồi `bg-gp-deep`) và 6 hiệu ứng `gp-*`, 4 câu chào `vo-gp-*`
- [ ] Thử trên iPad có bàn phím rời (iPad không bàn phím thì không tập 10 ngón được)
- [ ] Sau này: bài gõ theo thời gian (1 phút), bảng xếp hạng WPM riêng, nhạc nền

### Giai đoạn 3 · Mở rộng môn
- [ ] Toán lớp 6 (lý thuyết), Toán lớp 1, Tiếng Anh...
- [ ] Trình soạn bài cho phụ huynh

## Cần bạn kiểm tra trên máy thật
Các tổ hợp phím đã đối chiếu với hướng dẫn của Casio và bài viết hướng dẫn, nhưng hãy thử lại trên máy:
- ÷R (chia có dư): ALPHA + phím phân số ▯/▯
- GCD: ALPHA + ×, LCM: ALPHA + ÷, dấu phẩy: SHIFT + )
- FACT: SHIFT + ° ' "
- %: SHIFT + Ans
- Khôi phục: SHIFT 9, 3, =, AC
