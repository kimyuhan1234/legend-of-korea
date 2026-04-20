-- =============================================
-- 025: 패스(Pass) 구조 전환
-- 기존 subscription_plans(free/explorer/legend) → Move/Live/Story/All in One
-- 유저당 패스 여러 개 보유 가능 (UNIQUE 제약 완화)
-- 크레딧 팩 구매 이력 + LP↔크레딧 교환 이력 테이블 추가
-- =============================================

-- ─── 1. plan_type CHECK 확장 ──────────────────────
-- 기존: ('free', 'explorer', 'legend')
-- 변경: ('free', 'move', 'live', 'story', 'allinone')
ALTER TABLE subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_plan_type_check;
ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_plan_type_check
  CHECK (plan_type IN ('free', 'move', 'live', 'story', 'allinone'));

-- ─── 2. 기존 데이터 정리 ──────────────────────────
-- CASCADE 삭제: user_subscriptions.plan_id → subscription_plans.id FK
DELETE FROM user_subscriptions WHERE plan_id IN (SELECT id FROM subscription_plans);
DELETE FROM subscription_plans;

-- ─── 3. 새 패스 시드 데이터 삽입 ──────────────────
-- name/features는 JSONB — 기존 스키마 유지
INSERT INTO subscription_plans (name, price, plan_type, features, kit_discount_rate, tier_levelup, monthly_credits) VALUES
(
  '{"ko":"Free","en":"Free","ja":"Free","zh-CN":"Free","zh-TW":"Free"}'::jsonb,
  0, 'free',
  '{"preview":true,"trial_missions":1}'::jsonb,
  0, false, 0
),
(
  '{"ko":"Move","en":"Move","ja":"Move","zh-CN":"Move","zh-TW":"Move"}'::jsonb,
  6900, 'move',
  '{"traffic":true,"spot":true,"ai_curation":true}'::jsonb,
  0, false, 0
),
(
  '{"ko":"Live","en":"Live","ja":"Live","zh-CN":"Live","zh-TW":"Live"}'::jsonb,
  6900, 'live',
  '{"kfood":true,"stay":true,"ootd":true}'::jsonb,
  0, false, 0
),
(
  '{"ko":"Story","en":"Story","ja":"Story","zh-CN":"Story","zh-TW":"Story"}'::jsonb,
  9900, 'story',
  '{"quest":true,"diy":true,"memories":true}'::jsonb,
  0, false, 0
),
(
  '{"ko":"All in One","en":"All in One","ja":"All in One","zh-CN":"All in One","zh-TW":"All in One"}'::jsonb,
  19900, 'allinone',
  '{"all":true,"vip_badge":true,"lp_multiplier":2}'::jsonb,
  5, true, 100
);

-- ─── 4. user_subscriptions UNIQUE 제약 완화 ───────
-- 기존: UNIQUE(user_id) → 유저당 1개만
-- 변경: UNIQUE(user_id, plan_id) → 플랜별 1개씩 (여러 패스 동시 보유 가능)
ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_key;
ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS unique_user_subscription;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_plan'
  ) THEN
    ALTER TABLE user_subscriptions ADD CONSTRAINT unique_user_plan UNIQUE (user_id, plan_id);
  END IF;
END $$;

-- ─── 5. 크레딧 팩 구매 이력 — 기존 테이블에 pack_id 컬럼 추가 ──
-- 기존 credit_purchases 스키마: (id, user_id, credits, price, payment_provider, payment_id, created_at)
-- 기존 컬럼은 유지하고 pack_id(=CREDIT_PACKS.id) 를 추가해 어떤 팩을 샀는지 추적
ALTER TABLE credit_purchases ADD COLUMN IF NOT EXISTS pack_id TEXT;
-- 기존 RLS 정책은 그대로 유지

-- ─── 6. LP → 크레딧 교환 이력 ─────────────────────
CREATE TABLE IF NOT EXISTS lp_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lp_spent INTEGER NOT NULL,
  credits_gained INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lp_exchanges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own lp exchanges" ON lp_exchanges;
CREATE POLICY "Users can view own lp exchanges"
  ON lp_exchanges FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lp exchanges" ON lp_exchanges;
CREATE POLICY "Users can insert own lp exchanges"
  ON lp_exchanges FOR INSERT WITH CHECK (auth.uid() = user_id);
