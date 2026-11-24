-- Cấp quyền bảng cho người đã đăng nhập.
-- Dự án Supabase mới không tự cấp quyền cho bảng tạo bằng SQL, nên mọi truy vấn báo
-- "permission denied for table ..." (403) dù đã có RLS. RLS vẫn giới hạn ai đọc/sửa dòng nào.
-- Chạy trong Supabase > SQL Editor. Chạy lại nhiều lần cũng không sao.

grant usage on schema public to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.lesson_progress to authenticated;
grant select, insert on public.xp_events to authenticated;
grant select, insert, update, delete on public.level_tests to authenticated;
grant select, insert on public.challenges to authenticated;
grant select, insert, update on public.challenge_entries to authenticated;
grant select, insert, update, delete on public.tier_unlocks to authenticated;

grant usage, select on all sequences in schema public to authenticated;

grant execute on function public.my_total_xp() to authenticated;
grant execute on function public.leaderboard(text, int, int) to authenticated;
grant execute on function public.challenge_board(text) to authenticated;

-- Đua xe gõ phím có "Đua lại": cho sửa bài nộp của chính mình để giữ điểm cao nhất
drop policy if exists "entries: sửa của mình" on public.challenge_entries;
create policy "entries: sửa của mình" on public.challenge_entries for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
