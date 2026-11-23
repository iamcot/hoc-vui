-- Học Vui: lược đồ ban đầu. Chạy trong Supabase > SQL Editor (hoặc `supabase db push`).

-- Hồ sơ người dùng (tên hiển thị trên bảng xếp hạng, ảnh đại diện)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default 'Bạn nhỏ' check (char_length(display_name) between 1 and 40),
  avatar text not null default 'fox',
  grade int,
  created_at timestamptz not null default now()
);

-- Tự tạo hồ sơ khi đăng ký
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar)
  values (new.id,
          coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), 'Bạn nhỏ'),
          coalesce(nullif(new.raw_user_meta_data->>'avatar', ''), 'fox'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tiến trình từng bài
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users on delete cascade,
  subject_id text not null,
  lesson_id text not null,
  read boolean not null default false,
  stars int not null default 0 check (stars between 0 and 3),
  best int not null default 0 check (best between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, subject_id, lesson_id)
);

-- Nhật ký điểm kinh nghiệm (để tính xếp hạng theo tuần)
create table if not exists public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  subject_id text not null,
  amount int not null check (amount between 1 and 500),
  reason text,
  created_at timestamptz not null default now()
);
create index if not exists xp_events_time on public.xp_events (created_at);
create index if not exists xp_events_user on public.xp_events (user_id);

-- Kết quả kiểm tra trình độ
create table if not exists public.level_tests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  subject_id text not null,
  pct int not null check (pct between 0 and 100),
  level text not null,
  created_at timestamptz not null default now()
);

-- Phòng thi đấu: mọi người trong phòng nhận cùng đề nhờ seed = code
create table if not exists public.challenges (
  code text primary key check (code ~ '^[A-Z0-9]{6}$'),
  subject_id text not null,
  question_count int not null default 10,
  seconds int not null default 120,
  created_by uuid not null references auth.users on delete cascade default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.challenge_entries (
  code text not null references public.challenges on delete cascade,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  score int not null check (score between 0 and 10000),
  correct int not null,
  time_ms int not null,
  created_at timestamptz not null default now(),
  primary key (code, user_id)
);

-- Quyền truy cập
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.xp_events enable row level security;
alter table public.level_tests enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_entries enable row level security;

create policy "profiles: ai đăng nhập cũng xem được" on public.profiles for select to authenticated using (true);
create policy "profiles: sửa của mình" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles: cập nhật của mình" on public.profiles for update to authenticated using (id = auth.uid());

create policy "progress: của mình" on public.lesson_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "xp: xem của mình" on public.xp_events for select to authenticated using (user_id = auth.uid());
create policy "xp: thêm của mình" on public.xp_events for insert to authenticated with check (user_id = auth.uid());

create policy "tests: của mình" on public.level_tests for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "challenges: xem" on public.challenges for select to authenticated using (true);
create policy "challenges: tạo" on public.challenges for insert to authenticated with check (created_by = auth.uid());

create policy "entries: xem" on public.challenge_entries for select to authenticated using (true);
create policy "entries: nộp bài của mình" on public.challenge_entries for insert to authenticated with check (user_id = auth.uid());

-- Tổng XP của tôi
create or replace function public.my_total_xp() returns int
language sql stable security invoker as $$
  select coalesce(sum(amount), 0)::int from public.xp_events where user_id = auth.uid();
$$;

-- Bảng xếp hạng: p_days = 7 (tuần) hoặc null (mọi lúc); p_subject null = mọi môn
create or replace function public.leaderboard(p_subject text default null, p_days int default 7, p_limit int default 50)
returns table (user_id uuid, display_name text, avatar text, xp bigint)
language sql stable security definer set search_path = public as $$
  select p.id, p.display_name, p.avatar, sum(e.amount) as xp
  from public.xp_events e join public.profiles p on p.id = e.user_id
  where (p_subject is null or e.subject_id = p_subject)
    and (p_days is null or e.created_at > now() - make_interval(days => p_days))
  group by p.id, p.display_name, p.avatar
  order by xp desc
  limit least(p_limit, 100);
$$;

-- Bảng điểm một phòng thi
create or replace function public.challenge_board(p_code text)
returns table (user_id uuid, display_name text, avatar text, score int, correct int, time_ms int)
language sql stable security definer set search_path = public as $$
  select p.id, p.display_name, p.avatar, c.score, c.correct, c.time_ms
  from public.challenge_entries c join public.profiles p on p.id = c.user_id
  where c.code = p_code
  order by c.score desc, c.time_ms asc;
$$;

grant execute on function public.leaderboard(text, int, int) to authenticated;
grant execute on function public.challenge_board(text) to authenticated;
grant execute on function public.my_total_xp() to authenticated;
