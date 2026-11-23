-- Môn "Máy tính" chia trình độ (lớp 6, 7, 8...), học vượt bằng thử thách.
-- Môn cũ "fx580-lop6" nay là trình độ "lop6" của môn "may-tinh".

update public.lesson_progress set subject_id = 'may-tinh' where subject_id = 'fx580-lop6';
update public.xp_events set subject_id = 'may-tinh' where subject_id = 'fx580-lop6';
update public.level_tests set subject_id = 'may-tinh:lop6' where subject_id = 'fx580-lop6';
update public.challenges set subject_id = 'may-tinh' where subject_id = 'fx580-lop6';

-- Trình độ đã mở khóa nhờ vượt thử thách
create table if not exists public.tier_unlocks (
  user_id uuid not null references auth.users on delete cascade,
  subject_id text not null,
  tier_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, subject_id, tier_id)
);
alter table public.tier_unlocks enable row level security;
create policy "unlocks: của mình" on public.tier_unlocks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Phòng thi đấu chọn trình độ (null = trộn cả môn)
alter table public.challenges add column if not exists tier_id text;
