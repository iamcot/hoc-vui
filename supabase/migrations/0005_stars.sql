-- Sao tuần: bảng xếp hạng tính bằng sao, reset 0 giờ thứ Hai (giờ Việt Nam).
-- Sao chỉ ghi qua hàm award_stars (máy chủ kiểm trần mỗi ngày, mỗi thử thách một lần, thưởng chuỗi ngày),
-- máy của bé không insert thẳng vào bảng nên không tự cộng sao được.
-- Phần thưởng do SuGaMi trao cho top tuần / tháng dựa trên các bảng này.

create table if not exists public.star_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  subject_id text not null,
  rank text not null default 'start',
  amount int not null check (amount between 1 and 10),
  reason text not null,
  created_at timestamptz not null default now()
);
create index if not exists star_events_time on public.star_events (created_at);
create index if not exists star_events_user on public.star_events (user_id, created_at);
alter table public.star_events enable row level security;
create policy "stars: xem của mình" on public.star_events for select to authenticated using (user_id = auth.uid());
grant select on public.star_events to authenticated;

-- mốc đầu tuần / đầu tháng theo giờ Việt Nam
create or replace function public.vn_week_start() returns timestamptz
language sql stable as $$ select date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh' $$;
create or replace function public.vn_month_start() returns timestamptz
language sql stable as $$ select date_trunc('month', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh' $$;
create or replace function public.vn_day_start() returns timestamptz
language sql stable as $$ select date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh' $$;

-- Ghi sao. p_reason: lesson-new | lesson | practice | test:<tier> | arena
create or replace function public.award_stars(p_subject text, p_rank text, p_amount int, p_reason text)
returns int
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  base text := split_part(p_reason, ':', 1);
  got int := 0;
  today_sum int;
  days_in_week int;
begin
  if uid is null then return 0; end if;
  if p_rank not in ('start', 'mid', 'high') then p_rank := 'start'; end if;
  p_amount := least(greatest(p_amount, 0), 5);
  if p_amount = 0 then return 0; end if;

  if base = 'lesson-new' then
    p_amount := least(p_amount, 3);
    select coalesce(sum(amount), 0) into today_sum from star_events where user_id = uid and created_at >= vn_day_start() and reason in ('lesson-new', 'lesson');
    if today_sum >= 60 then return 0; end if;
    -- mỗi bài chỉ tính "mới" một lần: reason đầy đủ lesson-new:<bài>
    if exists (select 1 from star_events where user_id = uid and reason = p_reason) then return 0; end if;
  elsif base = 'lesson' then
    p_amount := least(p_amount, 2);
    select coalesce(sum(amount), 0) into today_sum from star_events where user_id = uid and created_at >= vn_day_start() and reason in ('lesson-new', 'lesson');
    if today_sum >= 60 then return 0; end if;
  elsif base = 'practice' then
    p_amount := 1;
    select coalesce(sum(amount), 0) into today_sum from star_events where user_id = uid and created_at >= vn_day_start() and reason = 'practice';
    if today_sum >= 5 then return 0; end if;
  elsif base = 'test' then
    p_amount := 5;
    if exists (select 1 from star_events where user_id = uid and reason = p_reason) then return 0; end if;
  elsif base = 'arena' then
    p_amount := least(p_amount, 3);
    select count(*) into today_sum from star_events where user_id = uid and created_at >= vn_day_start() and reason = 'arena';
    if today_sum >= 5 then return 0; end if;
  else
    return 0;
  end if;

  insert into star_events (user_id, subject_id, rank, amount, reason) values (uid, p_subject, p_rank, p_amount, p_reason);
  got := p_amount;

  -- thưởng chuỗi ngày trong tuần: học đủ 3 / 5 ngày, mỗi mốc một lần mỗi tuần
  select count(distinct (created_at at time zone 'Asia/Ho_Chi_Minh')::date) into days_in_week
    from star_events where user_id = uid and created_at >= vn_week_start() and reason not like 'streak%';
  if days_in_week >= 3 and not exists (select 1 from star_events where user_id = uid and created_at >= vn_week_start() and reason = 'streak3') then
    insert into star_events (user_id, subject_id, rank, amount, reason) values (uid, 'tong-hop', p_rank, 3, 'streak3');
    got := got + 3;
  end if;
  if days_in_week >= 5 and not exists (select 1 from star_events where user_id = uid and created_at >= vn_week_start() and reason = 'streak5') then
    insert into star_events (user_id, subject_id, rank, amount, reason) values (uid, 'tong-hop', p_rank, 5, 'streak5');
    got := got + 5;
  end if;
  return got;
end $$;

-- Bảng xếp hạng sao. p_period: week | month | all. p_subject / p_rank null = tất cả.
-- p_kind: 'stars' (tổng sao) hoặc 'progress' (số bài mới học xong). Luôn kèm dòng của người xem nếu ngoài top.
create or replace function public.star_board(p_period text default 'week', p_subject text default null, p_rank text default null, p_kind text default 'stars', p_limit int default 50)
returns table (pos bigint, user_id uuid, display_name text, avatar text, stars bigint)
language sql stable security definer set search_path = public as $$
  with agg as (
    select p.id as uid, p.display_name, p.avatar,
           case when p_kind = 'progress' then count(*) filter (where e.reason like 'lesson-new:%')
                else sum(e.amount) end as total
    from public.star_events e join public.profiles p on p.id = e.user_id
    where (p_subject is null or e.subject_id = p_subject)
      and (p_rank is null or e.rank = p_rank)
      and (case p_period when 'week' then e.created_at >= vn_week_start()
                         when 'month' then e.created_at >= vn_month_start()
                         else true end)
    group by p.id, p.display_name, p.avatar
  ), ranked as (
    select rank() over (order by total desc) as pos, * from agg where total > 0
  )
  select pos, uid, display_name, avatar, total from ranked
  where pos <= least(p_limit, 100) or uid = auth.uid()
  order by pos, display_name;
$$;

grant execute on function public.award_stars(text, text, int, text) to authenticated;
grant execute on function public.star_board(text, text, text, text, int) to authenticated;
