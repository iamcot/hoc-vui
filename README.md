# Học Vui

App học tập cho con, lớp 1 đến 12, bám chương trình GDPT 2018. Môn đầu tiên: **dùng máy tính Casio fx-580VN X cho Toán 6**.

Luồng học: **Bài học** (slide có mèo Mochi dẫn chuyện, máy tính ảo để bấm theo) → **Luyện tập** (đề sinh ngẫu nhiên, chấm sao) → **Kiểm tra trình độ** → **Thi đấu** theo mã phòng → **Bảng xếp hạng**.

Xem kế hoạch và tiến độ ở [PLAN.md](PLAN.md).

## Chạy thử trên máy

```bash
npm install
npm run dev        # mở http://localhost:3000
npm test           # kiểm tra nội dung bài và bộ sinh đề
```

Không cần Supabase vẫn chạy được (chế độ khách, tiến trình lưu trên trình duyệt).

## Deploy: Supabase + Vercel

### 1. Supabase (đăng nhập, lưu tiến trình, thi đấu, xếp hạng)
1. Tạo project tại [supabase.com](https://supabase.com) (region Singapore cho nhanh).
2. Vào **SQL Editor**, dán toàn bộ [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) rồi **Run**.
3. **Authentication > Providers > Email**: bật Email. Nếu muốn con đăng ký xong dùng ngay, tắt **Confirm email**.
4. **Authentication > URL Configuration**: đặt **Site URL** là địa chỉ Vercel của app (làm sau bước 2).
5. **Project Settings > API**: chép `Project URL` và `anon public key`.

### 2. Vercel
1. Vào [vercel.com/new](https://vercel.com/new), chọn repo `hoc-vui`. Vercel tự nhận Next.js.
2. Thêm biến môi trường:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
3. Deploy. Mỗi lần đẩy code lên `main`, Vercel tự deploy lại.

### 3. Cài như app trên iPad
Mở địa chỉ app bằng Safari → nút Chia sẻ → **Thêm vào Màn hình chính**. App mở toàn màn hình, không có thanh địa chỉ.

## Ảnh và âm thanh

Danh sách đầy đủ kèm prompt: [docs/ASSET_PROMPTS.md](docs/ASSET_PROMPTS.md). Tạo xong, đặt file đúng tên vào `public/assets/img`, `public/assets/sfx`, `public/assets/voice` rồi đẩy lên. File nào chưa có thì app hiện hình thay thế.

Muốn thêm ảnh mới: thêm mục vào `src/content/assets.ts` rồi chạy `npm run prompts` để in lại danh sách.

## Cấu trúc

```
src/
  app/                     # các màn hình (Next.js App Router)
    page.tsx               # Học: trang chủ, chọn môn
    hoc/[subject]/         # bản đồ bài, bài học, luyện tập, kiểm tra trình độ
    thi-dau/               # đấu trường, phòng thi theo mã
    xep-hang/              # bảng xếp hạng
    toi/                   # hồ sơ, đăng nhập, cài đặt
  content/
    subjects/              # nội dung từng môn (mỗi môn một thư mục)
    devices/fx580.ts       # bàn phím fx-580VN X
    assets.ts              # danh mục ảnh/âm thanh + prompt
  components/              # máy tính ảo, thẻ câu hỏi, mascot...
  lib/                     # tiến trình, chấm điểm, sinh đề, thi đấu, Supabase
supabase/migrations/       # SQL tạo bảng
```

### Thêm môn học mới
1. Tạo `src/content/subjects/<id-mon>/` với danh sách bài (`Lesson[]`) và bộ sinh bài tập (`QuestionGen`).
2. Xuất một `Subject` và thêm vào `SUBJECTS` trong `src/content/subjects/index.ts`.
3. Chạy `npm test` để kiểm tra đáp án tự sinh.

Màn hình, tiến trình, kiểm tra, thi đấu và xếp hạng tự chạy theo môn mới.
