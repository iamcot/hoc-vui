# Plan chi tiết các môn mới

Mỗi môn một file, đủ để một luồng làm việc riêng cầm lên làm từ đầu tới cuối mà không phải hỏi lại.
Danh sách và thứ tự ưu tiên: `docs/WISHLIST.md`.

| Môn | File | id môn | Trạng thái |
|-----|------|--------|-----------|
| Kỹ năng số | [ky-nang-so.md](ky-nang-so.md) | `ky-nang-so` | Đang làm |
| Thám tử logic | [tham-tu-logic.md](tham-tu-logic.md) | `tham-tu` | Chưa bắt đầu |
| Lập trình khối lệnh | [lap-trinh.md](lap-trinh.md) | `lap-trinh` | Chưa bắt đầu |
| Khám phá Việt Nam | [kham-pha-vn.md](kham-pha-vn.md) | `viet-nam` | Chưa bắt đầu |
| Thí nghiệm hóa | [thi-nghiem-hoa.md](thi-nghiem-hoa.md) | `hoa-hoc` | Chưa bắt đầu |

## Luật chung cho mọi môn mới

**Quy trình**
- Mỗi môn làm trên nhánh riêng, mở **PR** vào `main` (main đang chạy thật, không đẩy thẳng).
- Đầu mỗi môn làm một **bản thử nhỏ** (1 bài chạy được) rồi chụp màn hình iPad (1180×820) và laptop thấp (1000×560) gửi bạn duyệt, sau đó mới làm hết nội dung.
- Cập nhật checklist trong file plan của môn và trong `PLAN.md` mỗi lần có PR.

**Cắm môn vào app** (xem `src/content/subjects/index.ts`)
- Nội dung là dữ liệu trong `src/content/subjects/<id>/`: `Subject → Tier → Unit → Lesson → Slide + practice`.
- Thêm môn vào mảng `SUBJECTS`. Bản đồ, bài học, luyện tập, kiểm tra trình độ, thử thách vượt cấp, đấu trường, xếp hạng tự chạy theo `subject.id`.
- Luyện tập là `QuestionGen` (hàm nhận `rng`, trả về `Question`). Câu trắc nghiệm dùng `kind: "choice"`. Đề phải sinh ngẫu nhiên, cùng seed ra cùng đề (để thi đấu theo mã phòng).
- Màn chơi riêng (game, mô phỏng) để ở `src/components/<id>/` và trang riêng `src/app/<id>/...`, khai báo trong `Subject.modes` để hiện trên đầu bản đồ.

**Tránh đụng nhau khi nhiều luồng làm song song**
- File dùng chung chỉ thêm, không sửa lại cái cũ: `src/content/types.ts` (thêm loại `Block`), `src/components/lesson/Blocks.tsx` (thêm `case`), `src/content/assets.ts` (thêm ảnh vào cuối nhóm của môn), `src/content/subjects/index.ts` (thêm 1 dòng).
- Mỗi lần mở PR thì cập nhật nhánh theo `main` trước.

**Giao diện**
- Không dùng khung thẻ trắng cứng. Cảnh nền minh họa, chữ để trên lớp giấy mờ khi cần đọc.
- Slide bài học phải vừa một khung nhìn ở laptop cao 560 px, không phải cuộn.
- Style ảnh theo tuổi: tiểu học dùng `STYLE` (Mochi dễ thương), lớp 6–7 `STYLE_PRETEEN`, lớp 8 trở lên `STYLE_TEEN` / `STYLE_SENIOR` (anime neon công nghệ). Prompt nằm trong `src/content/assets.ts`, chạy `npm run prompts` để in ra `docs/ASSET_PROMPTS.md`. Thiếu ảnh thì app tự hiện hình thay thế, nên không phải chờ ảnh mới làm được.
- Giọng đọc: chỉ một câu chào ngắn tự phát ở slide đầu, còn lại bấm loa mới đọc. Bé lớn càng ít đọc.

**Thi đấu**
- Đấu trường chia Khởi đầu / Trung cấp / Cao cấp theo % bài đã xong trong môn.
- Đề phòng thi lấy từ bộ sinh luyện tập (`mixedSet`), nên chỉ cần bộ sinh tốt là có thi đấu.
