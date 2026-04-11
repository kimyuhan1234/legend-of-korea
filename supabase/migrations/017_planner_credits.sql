-- =============================================
-- 017: 플래너 크레딧 시스템 + travel_style 영속화
-- v1.2 스펙 반영 — 기존 015/016 건드리지 않고 증분으로만 적용
--
-- 변경 사항:
--   1. subscription_plans.monthly_credits 컬럼 추가 (free=0/explorer=30/legend=100)
--   2. user_subscriptions.credits_remaining + credits_reset_at 컬럼 추가
--   3. travel_plans.travel_style 컬럼 추가 (relaxed/active/full)
--   4. credit_purchases 테이블 신규 (크레딧 추가 구매 이력)
--   5. credit_usage 테이블 신규 (feature 별 크레딧 사용 기록)
-- =============================================

-- ─── 1. subscription_plans.monthly_credits ─────────────
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS monthly_credits INTEGER NOT NULL DEFAULT 0;

-- 기존 플랜의 monthly_credits 값 세팅 (멱등)
UPDATE subscription_plans
SET monthly_credits = 0
WHERE plan_type = 'free' AND monthly_credits <> 0;

UPDATE subscription_plans
SET monthly_credits = 30
WHERE plan_type = 'explorer' AND monthly_credits <> 30;

UPDATE subscription_plans
SET monthly_credits = 100
WHERE plan_type = 'legend' AND monthly_credits <> 100;

-- ─── 2. user_subscriptions 크레딧 컬럼 ────────────────
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS credits_remaining INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_reset_at TIMESTAMPTZ;

-- 기존 구독자는 한 번 monthly_credits 만큼 채워준다 (초기 백필)
UPDATE user_subscriptions us
SET credits_remaining = sp.monthly_credits,
    credits_reset_at = us.current_period_end
FROM subscription_plans sp
WHERE us.plan_id = sp.id
  AND us.credits_remaining = 0
  AND us.credits_reset_at IS NULL
  AND us.status = 'active';

-- ─── 3. travel_plans.travel_style ─────────────────────
ALTER TABLE travel_plans
  ADD COLUMN IF NOT EXISTS travel_style TEXT NOT NULL DEFAULT 'active';

ALTER TABLE travel_plans DROP CONSTRAINT IF EXISTS travel_plans_travel_style_check;
ALTER TABLE travel_plans ADD CONSTRAINT travel_plans_travel_style_check
  CHECK (travel_style IN ('relaxed', 'active', 'full'));

-- ─── 4. credit_purchases — 크레딧 추가 구매 이력 ──────
CREATE TABLE IF NOT EXISTS credit_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL CHECK (credits > 0),
  price INTEGER NOT NULL CHECK (price >= 0),
  payment_provider TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 크레딧 구매만 조회" ON credit_purchases;
CREATE POLICY "본인 크레딧 구매만 조회" ON credit_purchases
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 크레딧 구매 생성" ON credit_purchases;
CREATE POLICY "본인 크레딧 구매 생성" ON credit_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_purchases_user ON credit_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_created ON credit_purchases(created_at DESC);

-- ─── 5. credit_usage — 크레딧 사용 이력 ──────────────
CREATE TABLE IF NOT EXISTS credit_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  credits_used INTEGER NOT NULL CHECK (credits_used > 0),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE credit_usage DROP CONSTRAINT IF EXISTS credit_usage_feature_check;
ALTER TABLE credit_usage ADD CONSTRAINT credit_usage_feature_check
  CHECK (feature IN ('weather', 'distance', 'ai_curation', 'pdf', 'schedule_change', 'companion_share'));

ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 크레딧 사용만 조회" ON credit_usage;
CREATE POLICY "본인 크레딧 사용만 조회" ON credit_usage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 크레딧 사용 생성" ON credit_usage;
CREATE POLICY "본인 크레딧 사용 생성" ON credit_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_usage_user ON credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_feature ON credit_usage(feature);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created ON credit_usage(created_at DESC);
