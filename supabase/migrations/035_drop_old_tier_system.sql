-- ============================================================
--  035_drop_old_tier_system.sql
--  Day 5: 구 티어 시스템(1~6) DB 완전 제거
--
--  전제: 코드 레벨 current_tier · tier_levelup · tiers 테이블 참조 전수 제거 완료 (migration 034 + 관련 커밋)
--  대체: 032_rank_system_complete_migration.sql 에서 추가한 current_level(1~10) + rank_up_costs 로 일원화.
--
--  순서 주의 — 참조 관계 없으므로 독립적으로 실행 가능.
--  실행 전 반드시 grep 검증:
--     grep -rn "current_tier\|tier_levelup\|from\.'tiers'" app/ components/ lib/ --include="*.ts" --include="*.tsx"
--     → 0 매치 확인
-- ============================================================

-- 1) users.current_tier 컬럼 DROP (구 1~6 스케일)
ALTER TABLE public.users
  DROP COLUMN IF EXISTS current_tier;

-- 2) subscription_plans.tier_levelup 컬럼 DROP (자동 승급 트리거 플래그)
ALTER TABLE public.subscription_plans
  DROP COLUMN IF EXISTS tier_levelup;

-- 3) user_subscriptions.tier_levelup_used 컬럼 DROP (자동 승급 1회 사용 플래그)
ALTER TABLE public.user_subscriptions
  DROP COLUMN IF EXISTS tier_levelup_used;

-- 4) 구 tiers 테이블 DROP (level/name/min_lp — 032 이전 스키마)
DROP TABLE IF EXISTS public.tiers CASCADE;

-- ============================================================
-- 검증 쿼리 (실행 후 수동 확인)
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name = 'users' AND column_name = 'current_tier';
--   → 0 rows
--
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name = 'subscription_plans' AND column_name = 'tier_levelup';
--   → 0 rows
--
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name = 'user_subscriptions' AND column_name = 'tier_levelup_used';
--   → 0 rows
--
--   SELECT tablename FROM pg_tables WHERE tablename = 'tiers';
--   → 0 rows
-- ============================================================
