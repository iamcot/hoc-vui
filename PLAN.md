# Học Vui · Kế hoạch

App học tập cho con, lớp 1 đến 12, bám chương trình GDPT 2018. Một khung chung, cắm nhiều môn vào.
Môn đầu tiên: **Máy tính Casio fx-580VN X cho Toán 6**.

## Kiến trúc

- **Next.js (App Router) + TypeScript + Tailwind**, chạy như app trên điện thoại (PWA, cài ra màn hình chính, thanh tab dưới đáy).
- **Supabase**: đăng nhập (email + mật khẩu), lưu tiến trình, phòng thi đấu, bảng xếp hạng. Chưa cấu hình Supabase thì app chạy ở **chế độ khách**, lưu tiến trình trên máy.
- **Deploy**: Vercel (kết nối repo, thêm 2 biến môi trường Supabase).
- **Nội dung là dữ liệu**: `src/content/subjects/<môn>/` gồm chặng → bài → slide + bộ sinh bài tập. Thêm môn mới không phải sửa màn hình.
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
- [x] Chỉnh giao diện theo góp ý: màu đậm hơn, bỏ khung thẻ, cảnh nền minh họa
- [ ] Gắn ảnh/âm thanh thật (bạn tạo theo `docs/ASSET_PROMPTS.md`): đợt 1 xong 27 ảnh + 4 giọng đọc
- [ ] Phụ huynh xem tiến trình của con
- [ ] Thử trên điện thoại thật, chỉnh hoạt họa
- [ ] Chuỗi ngày học (streak), nhắc học

### Giai đoạn 3 · Mở rộng môn
- [ ] Toán lớp 6 (lý thuyết), Toán lớp 1, Tiếng Việt, Tiếng Anh...
- [ ] Trình soạn bài cho phụ huynh

## Cần bạn kiểm tra trên máy thật
Các tổ hợp phím đã đối chiếu với hướng dẫn của Casio và bài viết hướng dẫn, nhưng hãy thử lại trên máy:
- ÷R (chia có dư): ALPHA + phím phân số ▯/▯
- GCD: ALPHA + ×, LCM: ALPHA + ÷, dấu phẩy: SHIFT + )
- FACT: SHIFT + ° ' "
- %: SHIFT + Ans
- Khôi phục: SHIFT 9, 3, =, AC
