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
2. Vào **SQL Editor**, chạy lần lượt từng file trong [`supabase/migrations/`](supabase/migrations) theo thứ tự số (`0001_init.sql`, rồi `0002_tiers.sql`, ...): dán toàn bộ nội dung file rồi **Run**.
3. **Authentication > Providers > Email**: bật Email và **tắt Confirm email** (bắt buộc). Con đăng nhập bằng tên đăng nhập + mật khẩu, không cần email: app tự đổi tên thành email nội bộ `<tên>@hocvui.local` nên không có mail nào được gửi. Quên mật khẩu thì bố mẹ vào **Authentication > Users**, tìm `<tên>@hocvui.local` để đặt lại.
4. **Authentication > URL Configuration**: đặt **Site URL** là địa chỉ Vercel của app (làm sau bước 2).
5. **Project Settings > API**: chép `Project URL` và `anon public key`.

### 2. Vercel
1. Vào [vercel.com/new](https://vercel.com/new), chọn repo `hoc-vui`. Vercel tự nhận Next.js.
2. Thêm biến môi trường:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
3. Deploy. Mỗi lần đẩy code lên `main`, Vercel tự deploy lại.

### Chạy trên server riêng (sau này)
App không dùng tính năng riêng của Vercel hay Supabase cloud. Có sẵn `Dockerfile`, `docker-compose.yml` và hướng dẫn chuyển cả web lẫn Supabase sang server riêng ở [docs/SELF_HOST.md](docs/SELF_HOST.md).

### 3. Cài như app trên iPad
Mở địa chỉ app bằng Safari → nút Chia sẻ → **Thêm vào Màn hình chính**. App mở toàn màn hình, không có thanh địa chỉ.

### 4. Chấm giọng đọc (môn Tập đọc, tùy chọn)
App ghi âm bé đọc rồi gửi lên dịch vụ nhận dạng giọng nói qua `/api/nghe` (âm thanh không được lưu lại). Dùng Azure Speech:
1. Azure Portal → resource **Speech** của bạn → **Keys and Endpoint**: chép **Key 1** và **Location/Region** (vd. `southeastasia`).
2. Vercel → Settings → Environment Variables, thêm:
   - `STT_PROVIDER` = `azure`
   - `AZURE_SPEECH_KEY` = Key 1
   - `AZURE_SPEECH_REGION` = region ở trên
3. Deploy lại. Mở `https://<app>/api/nghe` thấy `"enabled":true` là xong.

Không đặt gì thì app dùng nhận dạng của trình duyệt (Chrome laptop) hoặc cho bé nghe lại và tự chấm. Cũng hỗ trợ AWS Transcribe (`STT_PROVIDER=aws`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`), Google (`STT_PROVIDER=google`, `GOOGLE_STT_KEY`) và OpenAI (`STT_PROVIDER=openai`, `OPENAI_API_KEY`).

## Ảnh và âm thanh

Danh sách đầy đủ kèm prompt: [docs/ASSET_PROMPTS.md](docs/ASSET_PROMPTS.md). Tạo xong, đặt file đúng tên vào `public/assets/img`, `public/assets/sfx`, `public/assets/voice` rồi đẩy lên. File nào chưa có thì app hiện hình thay thế.

### Tạo tự động bằng tool

Chạy trên máy của bạn (cần Node 20+, `npm install` một lần).

**Âm thanh, tự động hoàn toàn bằng tài khoản ElevenLabs:** API dùng chung credit hằng tháng của gói bạn đang trả, không mua thêm.
1. Lấy key ở ElevenLabs > Developers > API Keys. Lấy Voice ID của giọng đã dùng cho 4 file giọng đọc đầu (Voices > bấm vào giọng > Copy ID) để giọng đồng nhất.
2. Tạo file `.env.local` ở thư mục gốc (đã có trong .gitignore, không lên git):
   ```
   ELEVENLABS_API_KEY=...
   ELEVENLABS_VOICE_ID=...          # giọng Mochi môn Máy tính (giọng Nam)
   ELEVENLABS_TAPDOC_VOICE_ID=...   # giọng Tập đọc, chuẩn miền Bắc (thiếu thì dùng ELEVENLABS_VOICE_ID)
   # tùy chọn, mặc định eleven_multilingual_v2 (đọc được tiếng Việt). Có thể đổi sang eleven_v3 hoặc eleven_flash_v2_5
   ELEVENLABS_MODEL=eleven_multilingual_v2
   ```
3. `npm run gen-assets -- --audio --dry-run` để xem danh sách, rồi `npm run gen-assets -- --audio` để tạo. Giọng đọc mẫu môn Tập đọc (khoảng 1.100 âm, vần, tiếng) chạy riêng bằng `npm run gen-assets -- --tapdoc` (đọc chậm hơn, ổn định hơn để không đọc sai âm đứng một mình).

**Ảnh, bán tự động bằng tài khoản ChatGPT:** `npm run asset-helper`. Tool mở ChatGPT, chép sẵn prompt vào clipboard và mở thư mục ảnh tham chiếu (mochi-happy, bg-home...). Bạn kéo ảnh tham chiếu vào, dán prompt, gửi, rồi bấm tải ảnh về. Tool thấy file mới trong Downloads sẽ tự đổi đúng tên và sang ảnh kế tiếp. Phím: `c` chép lại prompt, `s` bỏ qua, `b` quay lại, `q` thoát. Thoát xong tool tự chuyển ảnh sang WebP. Trình duyệt lưu file ở chỗ khác thì thêm `-- --downloads <thư mục>`.

**Ảnh, tự động hoàn toàn bằng OpenAI API (tốn phí riêng, khác gói ChatGPT Plus, khoảng 0,04 đến 0,06 USD/ảnh):** thêm `OPENAI_API_KEY=...` vào `.env.local`, rồi `npm run gen-assets -- --images`.

Tùy chọn chung: `--dry-run` (chỉ xem, không gọi API), `--only fx-l05-*,vo-l02-s1` (chỉ các mục này), `--force` (làm lại file đã có), `--limit 3`, `--quality high`. Mặc định tool chỉ tạo file còn thiếu. File tạo ra vào `assets-src/`, sau đó tool tự chuyển sang `public/assets/...` và cập nhật `docs/ASSET_PROMPTS.md`. Xem lại rồi commit các file trong `public/assets`.

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
