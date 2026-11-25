-- Bảng xếp hạng mới: chỉ còn bảng tuần và bảng tổng, chia hai loại:
--   1. Sao (star_events, đã có từ 0005)
--   2. Kỷ lục đặc thù của từng môn: Gõ phím có điểm Sinh tồn cao nhất và WPM gõ đoạn văn cao nhất.
-- Thi đấu: phòng công khai (ai cũng vào được khi chủ phòng chưa bắt đầu) và chế độ gõ của đua xe.
-- Chạy trong Supabase > SQL Editor. Chạy lại nhiều lần cũng không sao.

-- ───────── Kỷ lục ─────────
create table if not exists public.record_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  -- 'survival' = điểm Sinh tồn, 'wpm' = WPM gõ đoạn văn
  kind text not null check (kind in ('survival', 'wpm')),
  value int not null check (value > 0),
  created_at timestamptz not null default now()
);
create index if not exists record_events_kind_time on public.record_events (kind, created_at);
create index if not exists record_events_user on public.record_events (user_id, kind);
alter table public.record_events enable row level security;
drop policy if exists "records: xem của mình" on public.record_events;
create policy "records: xem của mình" on public.record_events for select to authenticated using (user_id = auth.uid());
grant select on public.record_events to authenticated;

-- Ghi kỷ lục qua hàm (máy chủ kiểm trần, chỉ ghi khi vượt kỷ lục tuần của chính mình để bảng gọn)
create or replace function public.submit_record(p_kind text, p_value int)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  cap int := case p_kind when 'survival' then 200000 when 'wpm' then 220 else 0 end;
  week_best int;
begin
  if uid is null or cap = 0 or p_value is null or p_value <= 0 or p_value > cap then return false; end if;
  select max(value) into week_best from record_events where user_id = uid and kind = p_kind and created_at >= vn_week_start();
  if week_best is not null and week_best >= p_value then return false; end if;
  insert into record_events (user_id, kind, value) values (uid, p_kind, p_value);
  return true;
end $$;

-- Bảng kỷ lục: mỗi bạn một dòng là kỷ lục cao nhất trong kỳ. p_period: week | all.
-- Luôn kèm dòng của người xem nếu ngoài top.
create or replace function public.record_board(p_kind text, p_period text default 'week', p_limit int default 100)
returns table (pos bigint, user_id uuid, display_name text, avatar text, value int)
language sql stable security definer set search_path = public as $$
  with agg as (
    select p.id as uid, p.display_name, p.avatar, max(e.value) as best
    from public.record_events e join public.profiles p on p.id = e.user_id
    where e.kind = p_kind
      and (p_period <> 'week' or e.created_at >= vn_week_start())
    group by p.id, p.display_name, p.avatar
  ), ranked as (
    select rank() over (order by best desc) as pos, * from agg
  )
  select pos, uid, display_name, avatar, best from ranked
  where pos <= least(p_limit, 100) or uid = auth.uid()
  order by pos, display_name;
$$;

grant execute on function public.submit_record(text, int) to authenticated;
grant execute on function public.record_board(text, text, int) to authenticated;

-- ───────── Phòng công khai ─────────
alter table public.challenges add column if not exists is_public boolean not null default false;
alter table public.challenges add column if not exists started_at timestamptz;
-- đua xe gõ phím: 'random' | 'vi' | 'en' (null = mặc định 'vi')
alter table public.challenges add column if not exists mode text;
create index if not exists challenges_open on public.challenges (created_at) where is_public and started_at is null;

-- Chủ phòng bấm bắt đầu: phòng công khai đóng cửa với bạn mới
create or replace function public.start_room(p_code text)
returns void
language sql security definer set search_path = public as $$
  update public.challenges set started_at = now()
  where code = p_code and created_by = auth.uid() and started_at is null;
$$;

-- Các phòng công khai đang chờ (tạo trong 20 phút gần đây, chủ phòng chưa bắt đầu)
create or replace function public.open_rooms(p_limit int default 12)
returns table (code text, subject_id text, rank text, mode text, created_at timestamptz, host_name text, host_avatar text, mine boolean)
language sql stable security definer set search_path = public as $$
  select c.code, c.subject_id, c.rank, c.mode, c.created_at, p.display_name, p.avatar, c.created_by = auth.uid()
  from public.challenges c join public.profiles p on p.id = c.created_by
  where c.is_public and c.started_at is null and c.created_at > now() - interval '20 minutes'
  order by c.created_at desc
  limit least(p_limit, 30);
$$;

grant execute on function public.start_room(text) to authenticated;
grant execute on function public.open_rooms(int) to authenticated;
