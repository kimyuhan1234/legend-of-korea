-- ============================================================
--  032_rank_system_complete_migration.sql
--  Day 4: 신 랭크 시스템 완전 이행 (디자인 B — 빗방울 완전 화폐화)
--
--  - users.current_level 컬럼 추가 (tier_titles 의 1~10 스케일)
--  - rank_up_costs 테이블 신규 (상점 수동 랭크업 비용)
--  - 기존 users.current_tier(1~6) 는 보존만 (deprecated, 삭제 X)
-- ============================================================

-- 1) users.current_level 컬럼 (없으면 추가)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS current_level INT DEFAULT 1;

ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_current_level_check;

ALTER TABLE public.users
ADD CONSTRAINT users_current_level_check
CHECK (current_level BETWEEN 1 AND 10);

COMMENT ON COLUMN public.users.current_level IS
  '신 10단계 랭크 (tier_titles 참조). 빗방울 충분해도 상점에서 수동 구매해야 상승.';

-- 2) rank_up_costs 테이블
CREATE TABLE IF NOT EXISTS public.rank_up_costs (
  level              INT PRIMARY KEY CHECK (level BETWEEN 2 AND 10),
  raindrops_required INT NOT NULL CHECK (raindrops_required >= 0),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 누구나 읽기
ALTER TABLE public.rank_up_costs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rank_up_costs_read_all" ON public.rank_up_costs;
CREATE POLICY "rank_up_costs_read_all"
  ON public.rank_up_costs FOR SELECT
  USING (true);

-- 3) 초기 비용 데이터 (Lv 2~10)
INSERT INTO public.rank_up_costs (level, raindrops_required) VALUES
  (2,    100),
  (3,    300),
  (4,    600),
  (5,  1_000),
  (6,  2_000),
  (7,  4_000),
  (8,  8_000),
  (9, 16_000),
  (10, 32_000)
ON CONFLICT (level) DO NOTHING;

-- 4) 기존 사용자의 current_level 초기화 (기존 current_tier 를 시작점으로, 없으면 1)
UPDATE public.users
SET current_level = GREATEST(COALESCE(current_tier, 1), 1)
WHERE current_level IS NULL OR current_level = 1;

-- 적용 후 확인:
--   SELECT level, raindrops_required FROM public.rank_up_costs ORDER BY level;
--   → 9 rows (Lv 2~10)
--
--   SELECT nickname, current_level, current_tier, total_lp FROM public.users LIMIT 5;
--   → current_level 이 채워져 있어야 함
