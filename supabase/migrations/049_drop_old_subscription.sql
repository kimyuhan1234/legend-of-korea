-- ============================================================
-- 049: 기존 구독 시스템 완전 폐기 (PRD-PRICING-2026-001)
-- ============================================================
-- 배경
--   - 베타 사용자 0 명 → 데이터 마이그레이션 불필요
--   - 신규 passes 테이블 (047) 로 모델 교체
--   - 015 / 017 / 025 에서 정의된 subscription_plans / user_subscriptions /
--     관련 함수 모두 DROP (CASCADE 로 의존성 자동 처리)
--
-- 함께 사라지는 컬럼 (user_subscriptions DROP 으로 자동 제거):
--   - credits_remaining (017)
--   - credits_reset_at (017)
--   - 모든 plan_id FK 참조
-- ============================================================

-- 1. user_subscriptions DROP — credits_remaining / credits_reset_at 함께 제거
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;

-- 2. subscription_plans DROP — 시드 데이터 (free / move / live / story / allinone) 함께 제거
DROP TABLE IF EXISTS public.subscription_plans CASCADE;

-- 3. 패스 관련 헬퍼 함수가 정의되어 있다면 정리 (멱등)
DROP FUNCTION IF EXISTS public.check_subscription_status() CASCADE;
DROP FUNCTION IF EXISTS public.deduct_credits(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.reset_monthly_credits() CASCADE;

-- 4. 검증
--   SELECT tablename FROM pg_tables
--    WHERE schemaname = 'public'
--      AND tablename IN ('subscription_plans', 'user_subscriptions');
--   -- 예상: 0 행

COMMENT ON SCHEMA public IS
  '요금제 모델 전환 완료 — 4 패스 구독 → 3 패스 1 회 구매 (PRD-PRICING-2026-001).';
