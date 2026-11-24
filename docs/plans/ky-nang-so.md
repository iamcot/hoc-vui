# Môn Kỹ năng số (`ky-nang-so`)

**Mục tiêu**: con nhận ra lừa đảo, tin giả, giữ an toàn tài khoản và cư xử tử tế trên mạng. Học bằng cách **tự trải nghiệm tình huống giả lập**, không học thuộc lòng.
**Nhóm tuổi**: Mọi lứa tuổi (`stage: "all"`), 4 trình độ từ lớp 1 đến 12.
**Nhân vật**: Mochi dẫn chuyện. Kẻ gian là "mèo Mun đeo mặt nạ" ở trình độ nhí, thành hacker áo hoodie neon ở trình độ lớn.

## Cách học một bài

1. **Tình huống mở đầu**: một màn hình giả (tin nhắn, email, trang web, bài đăng, cuộc gọi, game). Con chọn "Em sẽ làm gì?".
2. **Chuyện gì xảy ra tiếp**: mỗi lựa chọn có kết cục riêng (bị lấy mất nick, hay chặn được kẻ gian). Sai cũng không bị trừ, mục đích là để con thấy hậu quả.
3. **Soi dấu hiệu**: chạm vào những chỗ đáng ngờ trên màn hình giả (tên miền lạ, giọng hối thúc, đòi mã OTP...). Tìm đủ thì Mochi tổng kết.
4. **Mẹo ghi nhớ**: 1 câu ngắn dễ nhớ.
5. **Thử nhanh**: 1 câu trắc nghiệm.

**Luyện tập**: mỗi câu là một màn hình giả + "Em sẽ làm gì?" hoặc "An toàn hay lừa đảo?". Lấy ngẫu nhiên từ kho tình huống của bài, đảo thứ tự lựa chọn.

## Màn chơi thêm (`Subject.modes`)

- **Thật hay giả** (`/ky-nang-so/that-hay-gia`): tin nhắn, bài đăng hiện lần lượt, con bấm "An toàn" hoặc "Lừa đảo" (hoặc phím ← →), 60 giây, có chuỗi đúng liên tiếp. Tin lấy từ các bài con đã học.
- **Phòng thử mật khẩu** (`/ky-nang-so/mat-khau`): gõ mật khẩu, app ước lượng thời gian máy dò ra (chạy hoàn toàn trong máy, không lưu, không gửi đi), gợi ý cách làm mạnh hơn bằng cụm từ dễ nhớ.

## Trình độ và bài

### 1. An toàn nhí (lớp 1–3) · `nhi`
| id | Bài |
|----|-----|
| kns-n01 | Người lạ trên mạng |
| kns-n02 | Mật khẩu là bí mật |
| kns-n03 | Hỏi bố mẹ trước khi bấm |
| kns-n04 | Thông tin của em là của em |
| kns-n05 | Giờ chơi, giờ nghỉ |

### 2. Thám hiểm mạng (lớp 4–6) · `tham-hiem`
| id | Bài |
|----|-----|
| kns-k01 | Mật khẩu mạnh |
| kns-k02 | Trúng thưởng? Coi chừng! |
| kns-k03 | Link lạ và trang web giả |
| kns-k04 | Đăng ảnh an toàn |
| kns-k05 | Lừa đảo trong game |
| kns-k06 | Lịch sự trên mạng |

### 3. Tỉnh táo (lớp 7–9) · `tinh-tao`
| id | Bài |
|----|-----|
| kns-t01 | Tin giả là gì |
| kns-t02 | Kiểm tra nguồn tin |
| kns-t03 | Ảnh ghép, ảnh cũ |
| kns-t04 | Bắt nạt qua mạng |
| kns-t05 | Mã OTP và bảo mật 2 lớp |
| kns-t06 | Giả danh người quen |

### 4. Công dân số (lớp 10–12) · `cong-dan`
| id | Bài |
|----|-----|
| kns-c01 | Deepfake và giọng nói giả |
| kns-c02 | Việc nhẹ lương cao |
| kns-c03 | Dấu chân số |
| kns-c04 | Bản quyền khi chia sẻ |
| kns-c05 | Dùng AI có trách nhiệm |
| kns-c06 | Bong bóng thông tin |

## Kỹ thuật

- `src/content/types.ts`: thêm `FakeScreen` (khung màn hình giả) và 2 loại `Block`:
  - `scenario`: màn hình + câu hỏi + các lựa chọn, mỗi lựa chọn có `good` và `then` (kết cục).
  - `spot`: màn hình có các đoạn đánh dấu `[[chữ|giải thích]]`, con chạm để tìm.
  - `Question.screen?`: câu luyện tập có màn hình giả ở trên.
- `src/components/digital/`: `FakeScreen.tsx` (vẽ bằng code: khung điện thoại chat, SMS, email, trình duyệt, bài đăng, cuộc gọi đến, game), `Scenario.tsx`, `SpotFlags.tsx`, `PasswordLab.tsx`, `TrueFalseGame.tsx`.
- `src/lib/password.ts`: ước lượng độ mạnh mật khẩu (độ dài, loại ký tự, mẫu dễ đoán như 123456, ngày sinh, lặp ký tự).
- `src/content/subjects/ky-nang-so/`: `index.ts` (Subject), `lessons.ts` (nội dung từng bài + kho tình huống luyện tập).
- Thi đấu: dùng câu trắc nghiệm có màn hình giả, chạy như các môn khác.

## Ảnh cần tạo (khoảng 14)
Màn hình giả vẽ bằng code nên ảnh ít.
- `subject-kns-cover`: bìa môn (Mochi cầm khiên trước màn hình điện thoại).
- 4 huy hiệu trình độ `kns-tier-1..4` (khiên nhí → khiên neon).
- 4 bìa trình độ `kns-cover-nhi`, `kns-cover-tham-hiem` (STYLE), `kns-cover-tinh-tao` (STYLE_TEEN), `kns-cover-cong-dan` (STYLE_SENIOR); các bài trong cùng trình độ dùng chung bìa.
- Kẻ gian: `kns-villain-kid` (mèo Mun đeo mặt nạ, dễ thương) và `kns-villain-teen` (hacker hoodie, không đáng sợ).
- 2 biểu tượng chế độ: `kns-mode-truefalse`, `kns-mode-password`.
- Nền bản đồ `bg-kns-map` (thành phố mạng nhỏ, đường dây như đường phố).

## Tiến độ
- [x] Plan chi tiết
- [ ] Kiểu dữ liệu + khung màn hình giả + khối tình huống, soi dấu hiệu
- [ ] Phòng thử mật khẩu, trò Thật hay giả
- [ ] Nội dung 4 trình độ (23 bài) + kho tình huống luyện tập
- [ ] Prompt ảnh, chụp màn hình gửi duyệt
- [ ] PR
