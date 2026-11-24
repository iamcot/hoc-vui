# Môn Thám tử logic (`tham-tu`)

**Mục tiêu**: rèn suy luận: quan sát, loại trừ, "nếu… thì…", phát hiện mâu thuẫn, không vội kết luận.
**Nhóm tuổi**: Mọi lứa tuổi (`stage: "all"`), 4 trình độ lớp 1 → 12.
**Nhân vật**: Mochi thám tử (mũ, kính lúp). Lớp 7 trở lên: thám tử teen + Mochi bản ngầu, tông đêm thành phố neon.

## Cách học một bài (mỗi bài đúng một mẹo suy luận)
1. **Hồ sơ mở đầu** (1–2 slide): vụ án ngắn, câu hỏi cần trả lời.
2. **Dạy mẹo** (2–3 slide): mẹo cụ thể, minh họa từng bước, con bấm theo.
3. **Phá án cùng Mochi**: vụ giải chung, kẹt thì bấm gợi ý từng bước.
4. **Hồ sơ luyện tập**: vụ án **sinh ngẫu nhiên** bằng bộ sinh có kiểm tra **chỉ đúng một đáp án**. Sao tính theo số gợi ý đã dùng.
Cuối mỗi trình độ là **vụ án lớn** (thử thách vượt cấp), gộp nhiều mẹo.

## Trình độ và bài

### 1. Thám tử tập sự (lớp 1–3) · `tap-su`
tt-a01 Tìm điểm khác · tt-a02 Quy luật dãy hình · tt-a03 Cái nào khác nhóm · tt-a04 Ai cao hơn ai (xếp thứ tự) · tt-a05 Đếm hình · tt-a06 Theo dấu chân (đường đi trên lưới)

### 2. Thám tử (lớp 4–6) · `tham-tu`
tt-b01 Bảng loại trừ 3×3 · tt-b02 Bảng loại trừ 4×4 · tt-b03 Ai nói thật, ai nói dối · tt-b04 Nếu… thì… · tt-b05 Sudoku nhỏ 4×4 · tt-b06 Đếm mọi khả năng

### 3. Thám tử chính (lớp 7–9) · `chinh`
tt-c01 Câu đố 5 ngôi nhà · tt-c02 Mệnh đề và phủ định · tt-c03 Phản ví dụ · tt-c04 Suy luận ngược từ hiện trường · tt-c05 Mật mã dịch chữ · tt-c06 Lịch trình và chứng cứ ngoại phạm

### 4. Thanh tra (lớp 10–12) · `thanh-tra`
tt-d01 Và, hoặc, kéo theo · tt-d02 "Mọi" và "có ít nhất một" · tt-d03 Ngụy biện thường gặp · tt-d04 Xác suất trong điều tra · tt-d05 Thiên kiến xác nhận · tt-d06 Lập luận chặt chẽ

## Kỹ thuật
- `src/lib/logic/`: bộ sinh + bộ giải cho từng dạng (bảng loại trừ, nói thật/nói dối, dãy quy luật, sudoku 4×4, 5 ngôi nhà, mật mã). Bộ giải duyệt hết khả năng (nhỏ nên nhanh), chỉ giữ đề có đúng 1 lời giải. Có test trong `tests/`.
- Loại `Block` mới: `grid` (bảng loại trừ chạm ✓/✗, tự gạch hàng cột), `clues` (danh sách manh mối, chạm để gạch), `suspects` (chọn thủ phạm và lý do).
- Câu luyện tập: `kind: "choice"` cho dạng ngắn; dạng bảng dùng loại câu mới `kind: "grid"` (cần thêm vào `QuestionCard` và `src/lib/check.ts`).
- Nếu môn Kỹ năng số đã có `FakeScreen` thì dùng lại để hiện tin nhắn, lời khai.
- Thi đấu: cả phòng cùng một vụ (cùng seed), điểm = đúng + thời gian, trừ điểm khi dùng gợi ý.

## Ảnh cần tạo (khoảng 30)
- Bìa môn, 4 huy hiệu trình độ, 4 bìa trình độ, nền bản đồ (thành phố thám tử, ban ngày cho nhí, đêm neon cho lớn).
- Mochi thám tử 3 tư thế (soi kính lúp, suy nghĩ, chỉ tay "là bạn!").
- Bộ nghi phạm động vật dùng lại nhiều vụ (cáo, thỏ, gấu trúc, cú, gấu, chim cánh cụt, khoảng 8), mỗi con một ảnh nền trong.
- Khoảng 10 cảnh hiện trường dùng chung (bếp, lớp học, công viên, thư viện, bảo tàng...).

## Tiến độ
- [ ] Bản thử: bộ sinh bảng loại trừ 3×3 + màn bảng chạm ✓/✗ + 1 bài, chụp màn hình gửi duyệt
- [ ] Bộ sinh, bộ giải các dạng còn lại + test
- [ ] Nội dung 4 trình độ (24 bài) + 4 vụ án lớn
- [ ] Prompt ảnh
- [ ] Thi đấu phá án
- [ ] PR
