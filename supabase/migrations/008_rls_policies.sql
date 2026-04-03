-- ============================================================
-- RLS 정책 정의
-- 적용 전 Supabase 대시보드에서 검토 후 실행하세요.
-- ============================================================

-- ── 공개 데이터: anon + authenticated SELECT 허용 ──────────

alter table public.courses enable row level security;
create policy "public read courses"
  on public.courses for select
  to anon, authenticated
  using (is_active = true);

alter table public.missions enable row level security;
create policy "public read missions"
  on public.missions for select
  to anon, authenticated
  using (true);

alter table public.affiliate_links enable row level security;
create policy "public read affiliate_links"
  on public.affiliate_links for select
  to anon, authenticated
  using (is_active = true);

-- ── community_posts: 전체 읽기 / 본인만 쓰기 ──────────────

alter table public.community_posts enable row level security;
create policy "public read posts"
  on public.community_posts for select
  to anon, authenticated
  using (true);

create policy "auth insert posts"
  on public.community_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "owner update posts"
  on public.community_posts for update
  to authenticated
  using (auth.uid() = user_id);

create policy "owner delete posts"
  on public.community_posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── community_likes: 본인만 읽기·쓰기 ────────────────────

alter table public.community_likes enable row level security;
create policy "owner read likes"
  on public.community_likes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "owner insert likes"
  on public.community_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "owner delete likes"
  on public.community_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── orders: 본인 주문만 읽기·쓰기 ─────────────────────────

alter table public.orders enable row level security;
create policy "owner read orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "owner insert orders"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ── mission_progress: 본인 진행 데이터만 접근 ─────────────

alter table public.mission_progress enable row level security;
create policy "owner read progress"
  on public.mission_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "owner insert progress"
  on public.mission_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "owner update progress"
  on public.mission_progress for update
  to authenticated
  using (auth.uid() = user_id);

-- ── affiliate_clicks: 본인 클릭 기록 삽입만 허용 ──────────

alter table public.affiliate_clicks enable row level security;
create policy "auth insert clicks"
  on public.affiliate_clicks for insert
  to anon, authenticated
  with check (true);

-- 관리자만 집계 조회
create policy "admin read clicks"
  on public.affiliate_clicks for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );
