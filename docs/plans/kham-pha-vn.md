# Môn Khám phá Việt Nam (`viet-nam`)

**Mục tiêu**: thuộc bản đồ, tỉnh thành, vùng miền, đặc sản, di sản và lịch sử một cách vui, bằng cách **đi du lịch trên bản đồ và sưu tập thẻ**.
**Nhóm tuổi**: Tiểu học → THCS (`stage: "primary"`, có trình độ cho THCS), bám môn Lịch sử và Địa lý lớp 4–9.
**Nhân vật**: Mochi đeo ba lô du lịch, cầm cờ đỏ sao vàng nhỏ.

## Cách học
- Bản đồ chính của môn là **bản đồ Việt Nam thật** (SVG), mỗi vùng là một chặng. Tỉnh đã mở thì tô màu, có cờ cắm.
- Vào một tỉnh: 3–4 slide ngắn (vị trí, danh thắng, món ăn, lễ hội hoặc nhân vật lịch sử), câu đố nhỏ, mở **thẻ sưu tập**.
- Thẻ có 3 độ hiếm (thường, hiếm, huyền thoại). Làm luyện tập 3 sao mới mở thẻ hiếm. Album thẻ xem ở trang riêng.
- Lưu ý: dùng **34 tỉnh thành sau sáp nhập (từ 1/7/2025)**. Hiện thêm "trước đây gồm tỉnh…" để bố mẹ quen tên cũ vẫn theo được. Luôn có Hoàng Sa, Trường Sa.

## Trình độ
1. **Ba miền** (lớp 1–3) · `ba-mien`: Bắc, Trung, Nam; thủ đô Hà Nội; biển đảo; quốc kỳ, quốc ca; món ăn mỗi miền.
2. **34 tỉnh thành** (lớp 3–6) · `tinh-thanh`: chia 6 chặng theo vùng (Trung du miền núi phía Bắc, Đồng bằng sông Hồng, Bắc Trung Bộ, Duyên hải Nam Trung Bộ + Tây Nguyên, Đông Nam Bộ, Đồng bằng sông Cửu Long).
3. **Di sản và thiên nhiên** (lớp 5–8) · `di-san`: di sản UNESCO (Vịnh Hạ Long, Phong Nha, Hội An, Mỹ Sơn, Huế, Tràng An, Hoàng thành Thăng Long, nhã nhạc, cồng chiêng...), sông núi, khí hậu.
4. **Dòng thời gian lịch sử** (lớp 4–9) · `lich-su`: Văn Lang, Bắc thuộc, Ngô Quyền, Lý, Trần (3 lần thắng Nguyên Mông), Lê, Tây Sơn, Nguyễn, 1945, 1975. Trò kéo sự kiện vào đúng chỗ trên dòng thời gian.

## Trò chơi luyện tập
- **Đặt tỉnh vào đúng chỗ** trên bản đồ (kéo thả hoặc chạm).
- **Đoán tỉnh** qua đặc sản, danh thắng.
- **Đố nhanh** trắc nghiệm (dùng cho thi đấu).
- **Xếp dòng thời gian**.

## Kỹ thuật
- `public/maps/vn-34.svg`: bản đồ 34 tỉnh thành (đường viền đơn giản hóa, mỗi tỉnh một `path` có `id`). Cần tìm nguồn dữ liệu ranh giới mới có giấy phép mở, hoặc vẽ đơn giản hóa từ dữ liệu OSM (ODbL, ghi nguồn). Hoàng Sa, Trường Sa vẽ trong khung riêng.
- `src/content/subjects/viet-nam/provinces.ts`: dữ liệu từng tỉnh (tên, vùng, tỉnh cũ gộp vào, 3–5 điểm nổi bật, món ăn, câu đố).
- `src/components/vn/`: `VnMap.tsx` (phóng to theo vùng, tô màu), `CardFlip.tsx`, `Album.tsx`, `Timeline.tsx`.
- Bản đồ bài của môn này dùng `VnMap` thay cho `SubjectMap` thường (thêm `Subject.look.map = "vn"` hoặc trang riêng).
- Lưu thẻ đã mở trong tiến trình (`progress.cards`).

## Ảnh cần tạo (nhiều nhất, trên 100, làm dần theo vùng)
- Bìa môn, 4 huy hiệu trình độ, Mochi du lịch 3 tư thế, mặt sau thẻ.
- Mỗi tỉnh 1 thẻ chính (danh thắng tiêu biểu) + 1 thẻ món ăn: khoảng 68 ảnh.
- Di sản: khoảng 15 ảnh. Lịch sử: khoảng 12 ảnh nhân vật/sự kiện (vẽ trang trọng, không hoạt hình hóa quá đà).

## Tiến độ
- [ ] Bản thử: bản đồ SVG + 1 vùng (Đồng bằng sông Hồng) + 1 thẻ, chụp màn hình gửi duyệt
- [ ] Dữ liệu 34 tỉnh (kiểm tra kỹ thông tin sau sáp nhập)
- [ ] Trình độ Ba miền
- [ ] 34 tỉnh thành theo 6 vùng
- [ ] Di sản, Dòng thời gian
- [ ] Album thẻ + độ hiếm
- [ ] PR (mỗi vùng hoặc trình độ một PR)
