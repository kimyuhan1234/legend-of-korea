-- ============================================================
-- 050: Credits 시스템 완전 폐기 (PRD-PRICING-2026-001)
-- ============================================================
-- 배경
--   - 1 회 구매 모델은 credits 시스템과 호환 X
--   - 017_planner_credits 의 credit_purchases / credit_usage DROP
--   - travel_plans / plan_items 은 유지 (Planner 자체는 베타 무료 유지)
--   - 정식 출시 시 Planner 가격 정책 재논의 (PRD §13)
-- ============================================================

-- 1. credit_purchases (017) — 크레딧 추가 구매 이력
DROP TABLE IF EXISTS public.credit_purchases CASCADE;

-- 2. credit_usage (017) — feature 별 크레딧 사용 기록
DROP TABLE IF EXISTS public.credit_usage CASCADE;

-- 3. 검증
--   SELECT tablename FROM pg_tables
--    WHERE schemaname = 'public'
--      AND tablename IN ('credit_purchases', 'credit_usage');
--   -- 예상: 0 행
--
--   SELECT tablename FROM pg_tables
--    WHERE schemaname = 'public'
--      AND tablename IN ('travel_plans', 'plan_items');
--   -- 예상: 2 행 (유지됨)
