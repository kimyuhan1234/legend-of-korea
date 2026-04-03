-- goods_notify_subscribers: 굿즈샵 오픈 알림 신청 이메일 수집

create table if not exists public.goods_notify_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  locale        text not null default 'ko',
  subscribed_at timestamptz not null default now(),
  is_notified   boolean not null default false
);

alter table public.goods_notify_subscribers enable row level security;

-- anon은 INSERT만 허용 (이메일 신청)
create policy "anon can subscribe"
  on public.goods_notify_subscribers
  for insert
  to anon, authenticated
  with check (true);

-- 본인 이메일 조회는 불가 (관리자만 SELECT)
create policy "admin can read subscribers"
  on public.goods_notify_subscribers
  for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );
