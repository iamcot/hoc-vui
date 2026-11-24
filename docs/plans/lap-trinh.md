# Môn Lập trình khối lệnh (`lap-trinh`)

**Mục tiêu**: tư duy máy tính từ vỡ lòng (chuỗi lệnh) đến nâng cao (thuật toán), cuối cùng chuyển sang **Python thật**.
**Nhóm tuổi**: Mọi lứa tuổi (`stage: "all"`), lớp 1 → 12.
**Nhân vật**: Mochi đi trên lưới (nhí). Từ trình độ Trung cấp: robot nhỏ + giao diện neon (STYLE_TEEN).

## Có giả lập nổi không
Được, chạy hết trên trình duyệt, không cần máy chủ:
- **Blockly** (Google, Apache 2.0): kéo thả khối. Tự làm theme khối cho Mochi/Neon, mỗi màn giới hạn khối được dùng.
- **JS-Interpreter** (sandbox, chạy từng bước): khối → JavaScript → chạy từng lệnh, sáng khối đang chạy, nhân vật di chuyển theo. Giới hạn số bước để chặn vòng lặp vô tận. Code không chạm được vào app.
- **Chấm theo kết quả**, không so code: tới đích chưa, nhặt đủ sao chưa, vẽ đúng hình chưa, chạy đúng với các bộ dữ liệu ẩn. Sao thêm khi dùng ít khối hơn hoặc bằng số khối tối ưu.
- **Python**: **Pyodide** chạy trong Web Worker (có giới hạn thời gian, tải lười khi vào trình độ Python, khoảng 10 MB). Bước chuyển: nút "xem dạng Python" cho chương trình khối.

## Cách học một bài
1. Slide ngắn giới thiệu khối mới (có ảnh động nhân vật).
2. 5–8 **màn chơi** tăng dần, màn đầu có tay chỉ hướng dẫn kéo khối.
3. Luyện tập = màn chơi sinh ngẫu nhiên (vị trí tường, sao, đích) có kiểm tra giải được bằng bộ tìm đường.
4. Bài cuối trình độ: **màn trùm** (thử thách vượt cấp).

## Trình độ và bài

### 1. Vỡ lòng (lớp 1–3) · `vo-long`
lt-a01 Đi thẳng · lt-a02 Rẽ trái, rẽ phải · lt-a03 Nhặt sao · lt-a04 Tìm khối sai (gỡ lỗi) · lt-a05 Đường ngắn nhất

### 2. Cơ bản (lớp 3–5) · `co-ban`
lt-b01 Lặp lại N lần · lt-b02 Lặp trong lặp · lt-b03 Nếu có tường thì… · lt-b04 Lặp cho tới khi · lt-b05 Bút vẽ (rùa vẽ hình) · lt-b06 Vẽ hoa văn bằng lặp

### 3. Trung cấp (lớp 6–8) · `trung-cap`
lt-c01 Biến và đếm điểm · lt-c02 Hàm tự đặt tên · lt-c03 Hàm có tham số · lt-c04 Sự kiện (khi bấm phím) · lt-c05 Làm mini game · lt-c06 Số ngẫu nhiên

### 4. Nâng cao (lớp 8–10) · `nang-cao`
lt-d01 Danh sách · lt-d02 Tìm lớn nhất, nhỏ nhất · lt-d03 Tìm kiếm tuần tự và nhị phân · lt-d04 Sắp xếp nổi bọt (có hoạt họa) · lt-d05 Đệ quy nhẹ · lt-d06 Mê cung với thuật toán bám tường

### 5. Python (lớp 9–12) · `python`
lt-p01 Từ khối sang Python · lt-p02 print, biến, input · lt-p03 if/else · lt-p04 for, while · lt-p05 list, string · lt-p06 Hàm · lt-p07 Bài tập theo đề Tin học THPT (chấm bằng test)

## Đã làm (Vỡ lòng)
- Không dùng JS-Interpreter: khối được đọc thành cây lệnh (`src/lib/code/program.ts`), chạy bằng generator từng bước (`run.ts`), không có eval, giới hạn 400 bước. Đủ cho bộ khối hạn chế; khi sang biến/hàm sẽ cân nhắc lại.
- Blockly 12 (`blockly/core`, renderer `zelos`, theme Mochi), ảnh giao diện Blockly tự host ở `public/blockly/`.
- Một bài là **một luồng liền**: vào bài thì xem 1-2 slide hướng dẫn rồi chơi luôn các màn, cùng một trang, không tách Bài học / Luyện tập. Bài đã đọc hướng dẫn thì vào thẳng màn chơi (nút 📖 trên thanh tiến độ để xem lại). Dữ liệu: `Lesson.code` (`CodeSpec`), trang bài và trang `luyen-tap` đều dùng `CodePractice`. Slide có khối `code` (lưới nhỏ + nút Xem chạy).
- Sao của màn: qua màn 1 sao, thừa tối đa 2 khối 2 sao, bằng số khối tối ưu 3 sao. Sao của bài = tổng sao các màn / (số màn × 3). Sau 3 lần chạy sai hiện nút Bỏ qua màn.
- Thử thách, kiểm tra trình độ, đấu trường dùng câu trắc nghiệm sinh ngẫu nhiên (`lap-trinh/questions.ts`): hướng nhìn sau khi rẽ, chương trình nào đúng, khối nào sai, chương trình nào ít khối nhất.

## Kỹ thuật
- Gói: `blockly`, `js-interpreter` (hoặc tự viết interpreter nhỏ cho bộ khối hạn chế), `pyodide` (tải từ CDN, chỉ ở trình độ Python).
- `src/lib/code/`: `world.ts` (lưới, tường, sao, rùa vẽ), `run.ts` (chạy từng bước, giới hạn bước), `grade.ts` (chấm), `levels.ts` (sinh màn + kiểm tra giải được bằng BFS).
- `src/components/code/`: `Workspace.tsx` (Blockly), `Stage.tsx` (canvas/SVG nhân vật), `Controls.tsx` (Chạy, Từng bước, Chậm/Nhanh, Làm lại).
- Màn chơi là dữ liệu: `{ grid, start, goal, stars, allowedBlocks, optimalBlocks }`.
- Loại `Lesson` mới hoặc `practice` riêng như môn Gõ phím (`Lesson.typing`): thêm `Lesson.code?: CodeSpec`, trang luyện tập hiện màn chơi thay cho câu hỏi.
- Chỉ hỗ trợ iPad + laptop (kéo thả cần màn rộng), điện thoại hiện thông báo xoay ngang.
- Lưu chương trình của con và chia sẻ màn tự làm bằng mã 6 ký tự (dùng bảng mới trên Supabase).
- Thi đấu: cùng một màn, điểm = đúng + ít khối + nhanh.

## Ảnh cần tạo (khoảng 15)
- Bìa môn, 5 huy hiệu trình độ, nền bản đồ.
- Mochi nhìn từ trên xuống 4 hướng (hoặc 1 ảnh, app tự xoay), robot neon 4 hướng.
- Bộ ô lưới: cỏ, tường đá, nước, sao, cờ đích (nền trong, nhìn từ trên xuống).

## Tiến độ
- [x] Bản thử: Blockly + chạy từng bước + lưới, Mochi đi theo khối (chờ bạn duyệt ảnh chụp)
- [x] Bộ màn chơi dạng dữ liệu, sinh màn ngẫu nhiên có kiểm tra (BFS)
- [x] Bộ chấm + sao theo số khối
- [x] Vỡ lòng: 5 bài, 26 màn làm sẵn + màn sinh ngẫu nhiên, câu trắc nghiệm cho thử thách/đấu trường
- [x] Cơ bản: 6 bài, 30 màn (Lặp N lần, Lặp trong lặp, Nếu có tường/đường, Lặp cho tới khi, Bút vẽ, Hoa văn). Bài Nếu và Lặp tới khi có **sân ẩn**: qua sân 1 thì cùng chương trình tự chạy sân 2, 3 (chấm theo bộ dữ liệu ẩn). Bút vẽ so nét vẽ với hình mẫu.
- [ ] Tạo ảnh `lt-*` (prompt đã có trong `docs/ASSET_PROMPTS.md`), giọng `vo-lt-a01`
- [ ] Sân chơi tự do + chia sẻ bằng mã
- [ ] Trung cấp, Nâng cao
- [ ] Pyodide + trình độ Python
- [ ] Thi đấu
- [ ] PR (mỗi trình độ một PR)
