# Chuyển khỏi Vercel / Supabase cloud

Tóm tắt: app **không dính chặt** vào Vercel hay Supabase cloud. Chuyển đi chủ yếu là việc vận hành, không phải sửa code.

## Rà soát (24/11/2026)

### Vercel: không dùng gì riêng của Vercel
- Không có `vercel.json`, không Edge runtime, Vercel KV/Blob/Postgres/Edge Config, Cron, `@vercel/*`, Analytics, `next/image` (nên không cần dịch vụ tối ưu ảnh của Vercel). Ảnh đã là WebP tĩnh trong `public/`.
- `/api/nghe` (chấm giọng đọc) chạy `runtime = "nodejs"` thường, gọi thẳng Azure/Google/OpenAI/AWS qua biến môi trường.
- Font `next/font/google` được tải về **lúc build** rồi tự phục vụ, chạy đâu cũng được (máy build cần Internet).
- `next.config.ts`: ngoài Vercel tự build ra `output: "standalone"` (đã thử: `node .next/standalone/server.js` chạy được trang chủ, ảnh tĩnh và `/api/nghe`). Trên Vercel giữ nguyên mặc định.
- Ghi chú: trên Vercel gói miễn phí, request gửi lên function tối đa 4,5 MB và chạy tối đa vài chục giây. Ghi âm WAV ngắn của bé nằm trong giới hạn; lên server riêng thì hết giới hạn này.

### Supabase: chỉ dùng phần mã nguồn mở, tự host được
| Dùng gì | Ở đâu | Tự host |
|---|---|---|
| Đăng nhập email + mật khẩu (GoTrue) | `src/app/toi/page.tsx`, `src/lib/store.tsx` | Có, cần tự cấu hình SMTP để gửi mail xác nhận/quên mật khẩu |
| Bảng + RLS qua PostgREST (`from()`, `rpc()`) | `src/lib/store.tsx`, `src/lib/arena.ts` | Có, cùng SQL |
| Realtime broadcast (đua xe Gõ phím) | `src/components/typing/TypingRace.tsx` | Có |
| SQL: bảng, policy, trigger trên `auth.users`, hàm `security definer` | `supabase/migrations/*.sql` | Có, Postgres thuần, không dùng extension riêng của cloud |

Không dùng Storage, Edge Functions, pg_cron, Vault. Toàn bộ code gọi Supabase gói trong 5 file trên, client tạo ở một chỗ (`src/lib/supabase.ts`) từ 2 biến `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Chuyển Supabase cloud → tự host chỉ là đổi 2 biến này rồi build lại.

Nếu sau này muốn bỏ hẳn Supabase (dùng Postgres + auth riêng) thì phải viết lại 5 file đó, dữ liệu Postgres vẫn giữ được. Hiện chưa đáng làm.

## Cách 1: chỉ chuyển web, giữ Supabase cloud
Ít việc nhất.
```bash
cp .env.example .env      # điền NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, khóa STT nếu dùng
docker compose up -d --build   # app ở cổng 3000
```
Không dùng Docker:
```bash
npm ci && npm run build        # biến NEXT_PUBLIC_* phải có sẵn lúc build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
PORT=3000 node .next/standalone/server.js    # chạy nền bằng pm2 hoặc systemd
```
Đặt Caddy hoặc Nginx phía trước để có HTTPS (bắt buộc: iPad chỉ cho ghi âm và cài PWA trên HTTPS). Với Caddy chỉ cần:
```
hocvui.example.com {
  reverse_proxy localhost:3000
}
```
Sau đó vào Supabase > Authentication > URL Configuration, đổi **Site URL** sang tên miền mới.

Lưu ý: `NEXT_PUBLIC_*` được gắn cứng vào code trình duyệt lúc build. Đổi URL/khóa Supabase là phải build lại image.

## Cách 2: tự host cả Supabase
1. Theo hướng dẫn chính thức "Self-Hosting with Docker" của Supabase: tải thư mục `docker/` từ repo `supabase/supabase`, chép `.env.example` thành `.env`, **đổi hết** mật khẩu, `JWT_SECRET`, sinh lại `ANON_KEY` và `SERVICE_ROLE_KEY`, đặt `SITE_URL` là tên miền app, cấu hình `SMTP_*`. Rồi `docker compose up -d`.
2. Chuyển dữ liệu từ cloud (lấy chuỗi kết nối ở Supabase > Project Settings > Database):
   ```bash
   # schema + dữ liệu của app và tài khoản người dùng
   pg_dump "$CLOUD_DB_URL" --data-only --schema=auth --table=auth.users --table=auth.identities > auth.sql
   pg_dump "$CLOUD_DB_URL" --schema=public --no-owner --no-privileges > public.sql
   ```
   Trên bản tự host: chạy `public.sql` (hoặc chạy lại `supabase/migrations/*.sql` rồi chỉ nạp dữ liệu), sau đó nạp `auth.sql`. Mật khẩu người dùng là hash nên đăng nhập lại được bình thường. Cách gọn hơn: dùng `supabase db dump` của Supabase CLI (có cờ `--data-only`, `--role-only`).
3. Đặt Caddy/Nginx cho API Supabase (cổng 8000 của Kong) ở tên miền riêng, vd. `api.hocvui.example.com`, có HTTPS (Realtime dùng WebSocket, reverse proxy phải cho phép).
4. Build lại app với `NEXT_PUBLIC_SUPABASE_URL=https://api.hocvui.example.com` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` mới.
5. Thử: đăng ký, đăng nhập, học một bài xem tiến trình lưu, bảng xếp hạng, tạo phòng đua xe Gõ phím với 2 máy.

## Việc vận hành khi tự host
- Sao lưu Postgres hằng ngày (`pg_dump` qua cron, chép ra nơi khác), thử khôi phục ít nhất một lần.
- HTTPS tự gia hạn (Caddy tự làm).
- Cập nhật image Supabase và Node định kỳ.
- Theo dõi server sống/chết (vd. Uptime Kuma), dung lượng đĩa.
- Server nhỏ 2 vCPU / 4 GB RAM đủ cho cả app và Supabase tự host ở quy mô gia đình, bạn bè.
