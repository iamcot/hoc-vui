# Học Vui · Wishlist môn mới

5 môn bạn chốt ngày 24/11/2026. Làm dần từng môn, môn nào xong phần khung mới sang môn tiếp.
**Plan chi tiết từng môn** (bài, kỹ thuật, ảnh cần tạo, tiến độ): `docs/plans/`.

Mỗi môn vẫn theo luật chung của app: **một bản đồ liền mạch** kiểu Duolingo, trình độ bị khóa thì mờ + ổ khóa, học vượt bằng **thử thách 10 câu**, **đấu trường** chia Khởi đầu / Trung cấp / Cao cấp theo % bài đã xong, **style ảnh theo tuổi** (Mochi dễ thương cho tiểu học, anime neon công nghệ từ lớp 7). Ảnh bạn tạo từ prompt trong `docs/ASSET_PROMPTS.md`, nội dung bài mình viết.

## Thứ tự đề xuất

| # | Môn | Vì sao ở vị trí này | Độ khó làm |
|---|-----|--------------------|------------|
| 1 | **Kỹ năng số** | Gần như chỉ là nội dung + màn chọn tình huống. Làm nhanh, có ích ngay, dựng sẵn "bộ máy tình huống" dùng lại cho Thám tử | Thấp |
| 2 | **Thám tử logic** | Dùng lại bộ máy tình huống, thêm bộ sinh câu đố có kiểm tra đáp án duy nhất | Vừa |
| 3 | **Lập trình khối lệnh** | Giá trị cao nhất nhưng nhiều logic nhất (Blockly + trình chạy an toàn + màn chơi) | Cao |
| 4 | **Khám phá Việt Nam** | Cần bản đồ 34 tỉnh (sau sáp nhập 2025) + nhiều ảnh thẻ sưu tập | Vừa, nặng ảnh |
| 5 | **Thí nghiệm hóa** | Nặng hiệu ứng nhất, nội dung trải từ lớp 1 đến 12 | Cao |

---

## 1. Kỹ năng số (Mọi lứa tuổi)

**Cách học**: mỗi bài là một chuỗi tình huống giả lập (tin nhắn Zalo, email, bài đăng, trang web giả). Con chọn phải làm gì, app phản hồi ngay chuyện gì xảy ra tiếp theo (bị lừa mất nick, hay chặn được kẻ gian), rồi Mochi giải thích dấu hiệu nhận biết.

Lộ trình:
- **Nhí** (lớp 1–3): không nói chuyện với người lạ trên mạng, không cho mật khẩu, hỏi bố mẹ trước khi bấm, thời gian dùng màn hình.
- **Thiếu niên** (lớp 4–6): mật khẩu mạnh (game chấm điểm mật khẩu), tin nhắn trúng thưởng, link lạ, quyền riêng tư khi đăng ảnh.
- **Teen** (lớp 7–9): tin giả (kiểm tra nguồn, ảnh cắt ghép, tiêu đề câu view), lừa đảo nạp game, bắt nạt qua mạng, 2 lớp bảo mật.
- **Lớn** (lớp 10–12): deepfake, lừa đảo việc nhẹ lương cao, dấu chân số, bản quyền, dùng AI có trách nhiệm.

Kế hoạch:
- [ ] Bộ máy tình huống: khung giả điện thoại/tin nhắn/email/web, rẽ nhánh theo lựa chọn, màn "chuyện gì xảy ra"
- [ ] Game chấm mật khẩu (đếm thời gian dò ra mật khẩu, chạy trong máy, không gửi đi đâu)
- [ ] Trò "Thật hay giả": vuốt trái/phải các tin, đếm giờ (dùng làm luyện tập + thi đấu)
- [ ] Nội dung 4 trình độ × 5–6 bài
- [ ] Prompt ảnh (khung điện thoại, nhân vật kẻ gian dạng mèo đen đeo mặt nạ cho nhí, hacker neon cho teen)

## 2. Thám tử logic (Tiểu học → THPT)

**Học như thế nào**: không học thuộc, mà học **một kỹ năng suy luận mỗi bài**, rồi áp dụng vào vụ án.
Mỗi bài có 4 bước:
1. **Hồ sơ mở đầu** (1–2 slide): một vụ án ngắn, Mochi thám tử nêu câu hỏi.
2. **Dạy mẹo** (2–3 slide): một kỹ năng cụ thể, ví dụ "loại trừ bằng bảng", "nếu A thì B", "ai nói thật ai nói dối", minh họa từng bước, con bấm theo.
3. **Phá án cùng Mochi**: một vụ giải chung, app gợi ý từng bước khi con kẹt.
4. **Hồ sơ luyện tập**: vụ án sinh ngẫu nhiên (máy tự tạo câu đố và kiểm tra chỉ có đúng một đáp án), làm bao nhiêu lần cũng được, chấm sao theo số lần dùng gợi ý.

Cuối mỗi trình độ là **vụ án lớn** (thử thách vượt cấp), cần dùng gộp nhiều mẹo.

Lộ trình kỹ năng:
- **Thám tử tập sự** (lớp 1–3): tìm điểm khác, quy luật dãy hình, cái nào không cùng nhóm, xếp thứ tự (ai cao hơn ai), so sánh bằng hình.
- **Thám tử** (lớp 4–6): bảng loại trừ 3×3 rồi 4×4, ai nói thật ai nói dối, nếu…thì, sudoku nhỏ, đếm khả năng.
- **Thám tử chính** (lớp 7–9): câu đố kiểu Einstein 5 nhà, mệnh đề và phủ định, phản ví dụ, suy luận ngược từ hiện trường, mật mã đơn giản.
- **Thanh tra** (lớp 10–12): logic mệnh đề (và/hoặc/kéo theo), lượng từ "mọi/tồn tại", ngụy biện thường gặp, xác suất có điều kiện trong điều tra, thiên kiến nhận thức.

Kế hoạch:
- [ ] Màn "bảng loại trừ" (bấm ô đánh ✓/✗, tự gạch hàng cột)
- [ ] Bộ sinh câu đố + bộ giải kiểm tra đáp án duy nhất (bảng loại trừ, nói thật/nói dối, dãy quy luật)
- [ ] Màn vụ án dùng lại bộ máy tình huống của Kỹ năng số (ghi chú manh mối, chọn thủ phạm, giải thích vì sao)
- [ ] Nội dung 4 trình độ, mỗi trình độ 6 bài + 1 vụ án lớn
- [ ] Thi đấu: cả phòng cùng một vụ, ai phá xong nhanh và ít gợi ý nhất thắng

## 3. Lập trình khối lệnh (Lớp 1 → 12, sau sang Python thật)

**Giả lập được không?** Được, và chạy hoàn toàn trên trình duyệt, không cần máy chủ:
- **Blockly** (thư viện của Google, miễn phí): kéo thả khối lệnh, tự đổi giao diện khối theo theme Mochi/Neon, khóa bớt khối ở bài đầu.
- **Trình chạy từng bước có sandbox** (JS-Interpreter): chạy chương trình của con từng lệnh một, sáng khối đang chạy, nhân vật đi theo, chặn vòng lặp vô tận, không đụng được vào app.
- **Chấm bài**: không so code, mà kiểm tra kết quả (nhân vật tới đích chưa, nhặt đủ sao chưa, chạy với vài bộ dữ liệu ẩn có ra đúng không). Thêm sao nếu dùng ít khối.
- **Python sau này**: **Pyodide** (Python thật chạy trong trình duyệt, chạy trong Web Worker có giới hạn thời gian). Giai đoạn chuyển tiếp: kéo khối xong bấm "xem dạng Python" để thấy code tương ứng, rồi mới tự gõ.

Phần nhiều logic nhất là thiết kế màn chơi + bộ chấm, chứ phần chạy code thì đã có thư viện vững.

Lộ trình:
- **Vỡ lòng** (lớp 1–3): Mochi đi trên lưới, chỉ có khối Đi / Rẽ trái / Rẽ phải → chuỗi lệnh, gỡ lỗi (tìm khối sai).
- **Cơ bản** (lớp 3–5): lặp lại N lần, nếu/thì (có tường thì rẽ), lặp cho tới khi, vẽ hình bằng bút (rùa).
- **Trung cấp** (lớp 6–8): biến, đếm điểm, hàm tự đặt tên, sự kiện (khi bấm phím), làm mini game của riêng mình (lưu, chia sẻ cho bạn).
- **Nâng cao** (lớp 8–10): danh sách, vòng lặp lồng nhau, thuật toán tìm kiếm/sắp xếp có hoạt họa, đệ quy nhẹ.
- **Python** (lớp 9–12): khối ↔ Python, rồi gõ Python thật, bài tập có test tự chấm, chuẩn bị cho Tin học THPT.

Kế hoạch:
- [ ] Thử nghiệm nhỏ: Blockly + JS-Interpreter + lưới 5×5, Mochi đi theo từng khối (chụp ảnh cho bạn xem trước)
- [ ] Bộ màn chơi dạng dữ liệu (lưới, tường, sao, khối được phép dùng, số khối tối ưu)
- [ ] Bộ chấm theo kết quả + sao theo số khối
- [ ] Trình độ Vỡ lòng + Cơ bản (khoảng 30 màn)
- [ ] Sân chơi tự do (làm game riêng) + chia sẻ bằng mã
- [ ] Trình độ Trung cấp, Nâng cao
- [ ] Pyodide + trình độ Python
- [ ] Thi đấu: cùng một màn, ai giải đúng với ít khối và nhanh nhất

## 4. Khám phá Việt Nam (Tiểu học → THCS)

**Cách học**: bản đồ Việt Nam tương tác, mỗi vùng là một chặng. Vào tỉnh nào thì nghe kể ngắn (đặc sản, danh thắng, lễ hội, nhân vật lịch sử), làm câu đố nhỏ, mở khóa **thẻ sưu tập** (thẻ tỉnh, thẻ món ăn, thẻ di sản). Thẻ có độ hiếm, xem lại trong album.

Lộ trình: Vùng miền và thủ đô → 34 tỉnh thành (theo đơn vị hành chính sau sáp nhập 2025) → Di sản UNESCO, sông núi biển đảo (có Hoàng Sa, Trường Sa) → Lịch sử theo dòng thời gian (lớp 4–9, bám môn Lịch sử và Địa lý).

Kế hoạch:
- [ ] Bản đồ SVG 34 tỉnh thành, phóng to theo vùng, tô màu tỉnh đã mở
- [ ] Màn thẻ sưu tập + album
- [ ] Trò chơi: đặt tỉnh vào đúng chỗ, đoán tỉnh qua đặc sản, đố nhanh
- [ ] Nội dung vùng đầu tiên (Bắc Bộ), rồi Trung Bộ, Nam Bộ
- [ ] Prompt ảnh thẻ (nhiều ảnh nhất trong 5 môn, nên làm dần theo vùng)

## 5. Thí nghiệm hóa (Lớp 1 → 12)

**Trọng tâm là hiệu ứng**: phòng thí nghiệm ảo, kéo ống nghiệm, nhỏ giọt, đun nóng. Phản ứng có bọt khí, đổi màu, kết tủa rơi xuống, khói, lửa màu, nổ nhẹ (an toàn, chỉ trên màn hình). Làm bằng canvas + hạt (particles) và chuyển màu dung dịch, không cần thư viện 3D.

**Giải thích tăng dần theo cấp**: cùng một thí nghiệm, lời giải thích đổi theo trình độ của con. Ví dụ giấm + baking soda:
- Lớp 1–3: "Hai bạn gặp nhau sinh ra rất nhiều bong bóng khí."
- Lớp 4–6: chất mới được tạo ra, khí CO₂, nhận biết bằng que đóm tắt.
- Lớp 8–9: phương trình chữ, rồi phương trình hóa học, axit + muối cacbonat.
- Lớp 10–12: cân bằng phương trình, tính mol, tốc độ phản ứng, cân bằng hóa học.

Lộ trình: Nhà khoa học nhí (tan/không tan, nổi/chìm, đổi màu bắp cải tím) → Khoa học tự nhiên 6–7 (chất, hỗn hợp, tách chất, nguyên tử, bảng tuần hoàn) → Hóa 8–9 (phản ứng, axit bazơ muối, kim loại) → Hóa 10–12 (liên kết, tốc độ phản ứng, điện hóa, hữu cơ). Luôn có thẻ **An toàn** (cái gì không được làm ở nhà).

Kế hoạch:
- [ ] Bộ hiệu ứng: dung dịch đổi màu, bọt khí, kết tủa, khói, lửa màu, nhiệt kế (thử nghiệm 1 thí nghiệm, chụp cho bạn xem trước)
- [ ] Mô tả phản ứng dạng dữ liệu (chất vào → hiệu ứng → lời giải thích theo từng cấp)
- [ ] Bàn thí nghiệm kéo thả + bảng tuần hoàn tương tác
- [ ] Nội dung Nhà khoa học nhí, rồi lần lượt các cấp
- [ ] Trò chơi: đoán hiện tượng trước khi trộn, cân bằng phương trình tính giờ (thi đấu)
