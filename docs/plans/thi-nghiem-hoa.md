# Môn Thí nghiệm hóa (`hoa-hoc`)

**Mục tiêu**: thích khoa học nhờ **phòng thí nghiệm ảo nhiều hiệu ứng**, hiểu bản chất phản ứng; cùng một thí nghiệm nhưng **giải thích sâu dần theo lớp**, từ lớp 1 đến lớp 12.
**Nhóm tuổi**: Mọi lứa tuổi (`stage: "all"`). Theo chương trình Khoa học (lớp 4–5), Khoa học tự nhiên (6–9), Hóa học (10–12).
**Nhân vật**: Mochi đeo kính bảo hộ, áo blouse (nhí). Từ lớp 7: phòng lab neon, bạn teen + Mochi bản ngầu.

## Hiệu ứng là trọng tâm
Vẽ bằng **canvas 2D + hệ hạt** (không cần thư viện 3D, nhẹ trên iPad):
- Dung dịch đổi màu dần, chất chỉ thị (quỳ tím, phenolphtalein, nước bắp cải tím).
- Bọt khí nổi lên, sủi tràn ống nghiệm.
- Kết tủa lắng xuống (vàng, trắng, xanh lam, nâu đỏ).
- Khói, hơi nước, lửa màu (thử màu ngọn lửa: Na vàng, K tím, Cu xanh lục), tia lửa.
- Nhiệt kế, cân, pH kế hiện số.
- "Nổ nhẹ" an toàn có rung màn hình, kèm thẻ **An toàn**: cái gì không được tự làm ở nhà.

## Giải thích theo cấp
Mỗi phản ứng có 4 lớp lời giải thích, app chọn theo trình độ con đang học (con có thể bấm "giải thích sâu hơn"):
| Cấp | Ví dụ giấm + baking soda |
|-----|--------------------------|
| Nhí (1–3) | Hai bạn gặp nhau, sinh ra rất nhiều bong bóng khí! |
| Khoa học (4–6) | Đã tạo ra chất mới là khí CO₂. Que đóm đang cháy đưa vào thì tắt. |
| THCS (7–9) | Axit axetic + natri hiđrocacbonat → natri axetat + nước + CO₂. Viết phương trình. |
| THPT (10–12) | Cân bằng phương trình, tính số mol khí, thể tích ở điều kiện chuẩn, ảnh hưởng của nồng độ tới tốc độ. |

## Trình độ và bài

### 1. Nhà khoa học nhí (lớp 1–3) · `nhi`
hh-a01 Tan hay không tan · hh-a02 Nổi hay chìm · hh-a03 Nước bắp cải đổi màu · hh-a04 Núi lửa baking soda · hh-a05 Nước đá, nước, hơi nước

### 2. Khoa học tự nhiên (lớp 4–7) · `khtn`
hh-b01 Chất và hỗn hợp · hh-b02 Tách chất (lọc, chưng cất, cô cạn) · hh-b03 Nguyên tử và phân tử · hh-b04 Bảng tuần hoàn (tương tác) · hh-b05 Oxygen và sự cháy · hh-b06 Dung dịch và nồng độ

### 3. Hóa học THCS (lớp 8–9) · `thcs`
hh-c01 Phản ứng hóa học và phương trình · hh-c02 Axit, bazơ, pH · hh-c03 Muối và kết tủa · hh-c04 Kim loại và dãy hoạt động · hh-c05 Mol và tính theo phương trình · hh-c06 Hợp chất hữu cơ đầu tiên

### 4. Hóa học THPT (lớp 10–12) · `thpt`
hh-d01 Cấu tạo nguyên tử, cấu hình electron · hh-d02 Liên kết hóa học · hh-d03 Tốc độ phản ứng · hh-d04 Cân bằng hóa học · hh-d05 Pin điện và điện phân · hh-d06 Hữu cơ: hiđrocacbon, ancol, este · hh-d07 Polime và vật liệu

## Trò chơi luyện tập
- **Đoán trước khi trộn**: chọn hiện tượng sẽ xảy ra, rồi trộn để xem.
- **Pha chế theo đề**: tạo dung dịch đúng màu/pH.
- **Cân bằng phương trình tính giờ** (thi đấu).
- **Bảng tuần hoàn**: tìm nguyên tố theo gợi ý.

## Kỹ thuật
- `src/lib/chem/`: `reactions.ts` (bảng phản ứng dạng dữ liệu: chất A + chất B + điều kiện → hiệu ứng + sản phẩm + 4 lớp giải thích), `balance.ts` (cân bằng phương trình bằng ma trận, kiểm tra đáp án), `elements.ts` (118 nguyên tố).
- `src/components/lab/`: `LabBench.tsx` (kéo thả dụng cụ, chất), `Beaker.tsx` (canvas dung dịch + hạt), `effects/` (bubbles, precipitate, smoke, flame, color-shift), `PeriodicTable.tsx`.
- Loại `Block` mới: `lab` (một thí nghiệm nhỏ ngay trong slide), `equation` (phương trình có ô điền hệ số).
- Kiểm tra hiệu năng trên iPad: giới hạn số hạt, tắt bớt hiệu ứng khi máy yếu.
- Nội dung đối chiếu SGK Kết nối tri thức / Chân trời sáng tạo để dùng đúng thuật ngữ (tên chất theo IUPAC như chương trình 2018).

## Ảnh cần tạo (khoảng 15–20)
Dụng cụ, dung dịch, hiệu ứng vẽ bằng code. Ảnh chỉ cho:
- Bìa môn, 4 huy hiệu trình độ, 4 bìa trình độ (nhí STYLE, khtn STYLE_PRETEEN, thcs/thpt STYLE_TEEN).
- Nền bàn thí nghiệm: `bg-lab-kid` (ấm áp), `bg-lab-neon` (lab tối, neon).
- Mochi nhà khoa học 3 tư thế, thẻ An toàn.

## Tiến độ
- [x] Bản thử: 1 cốc dung dịch + bọt khí + đổi màu + kết tủa (giấm + baking soda, bắp cải tím), chụp màn hình/quay video gửi duyệt
- [x] Bảng phản ứng dạng dữ liệu + 4 lớp giải thích
- [x] Bàn thí nghiệm kéo thả, bảng tuần hoàn (118 nguyên tố, nhóm có tính cách, đi săn)
- [x] Nhà khoa học nhí (5 bài), Khoa học tự nhiên (2 bài: tách hỗn hợp, dung dịch bão hoà). Còn lại: bài Sự cháy (cần nến, que đóm, đậy lọ)
- [x] Sự cố khi làm sai (trào bọt, nổ natri) + thẻ Vì sao + Sổ sự cố
- [x] Xếp lớp cho học sinh cấp 2 (bỏ qua bài dễ), Biết rồi? Thử 3 câu, Sổ tay ôn nhanh
- [x] 4 theme phòng lab (Nắng, Giả kim, Neon, Phân tử), dụng cụ kính bóng gương
- [x] Hóa THCS (lớp 8: phản ứng, cân bằng, thi cân bằng, trung hoà, 5 node luyện tập; lớp 9: kim loại + axit, kim loại đẩy kim loại, 5 node luyện tập), THPT (1 bài: cân bằng phương trình khó)
- [x] Thi đấu cân bằng phương trình (đồng hồ 30 giây, combo, kỷ lục)
- [ ] PR (mỗi trình độ một PR)
