-- Phòng thi đấu có hạng: 'free' = phòng tự do (không tính sao, không lên bảng xếp hạng),
-- hoặc 'start' | 'mid' | 'high' = hạng của người tạo phòng; bé chỉ vào phòng cùng hạng hoặc thấp hơn.
alter table public.challenges add column if not exists rank text not null default 'free';
