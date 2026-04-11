-- =============================================
-- 015: 여행 플래너 시스템
-- subscription_plans / user_subscriptions / travel_plans / plan_items
-- =============================================

-- ─── 1. 구독 플랜 테이블 ──────────────────────
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name JSONB NOT NULL,
  price INTEGER NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'explorer', 'legend')),
  features JSONB NOT NULL,
  kit_discount_rate INTEGER DEFAULT 0,
  tier_levelup BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "구독 플랜 공개 조회" ON subscription_plans;
CREATE POLICY "구독 플랜 공개 조회" ON subscription_plans FOR SELECT USING (true);

INSERT INTO subscription_plans (name, price, plan_type, features, kit_discount_rate, tier_levelup) VALUES
(
  '{"ko":"무료 체험","en":"Free Trial","ja":"無料体験"}',
  0, 'free',
  '{"ko":["플래너에 담기","크로스 탭 추천","1개 도시 미리보기"],"en":["Add to planner","Cross-tab recommendations","1 city preview"],"ja":["プランナーに追加","クロスタブ推薦","1都市プレビュー"]}',
  0, false
),
(
  '{"ko":"탐험가 플랜","en":"Explorer Plan","ja":"探検家プラン"}',
  9900, 'explorer',
  '{"ko":["전체 도시 무제한","교통 경로 안내","서프라이즈 제안","미션키트 코스 통합","자율 코스 생성","PDF 다운로드","미션키트 5% 추가 할인"],"en":["All cities unlimited","Transport routes","Surprise suggestions","Mission kit integration","Custom course creation","PDF download","Mission kit 5% extra discount"],"ja":["全都市無制限","交通ルート案内","サプライズ提案","ミッションキット統合","自由コース作成","PDFダウンロード","ミッションキット5%追加割引"]}',
  5, false
),
(
  '{"ko":"전설 플랜","en":"Legend Plan","ja":"伝説プラン"}',
  19900, 'legend',
  '{"ko":["탐험가 플랜 전체 포함","AI 맞춤 큐레이션","실시간 일정 변경","동행자 공유","우선 고객지원","미션키트 5% 추가 할인","즉시 1랭크 티어 레벨업 (1회)"],"en":["All Explorer features","AI custom curation","Real-time schedule changes","Companion sharing","Priority support","Mission kit 5% extra discount","Instant 1-rank tier level-up (once)"],"ja":["探検家プラン全機能","AIカスタムキュレーション","リアルタイム変更","同行者共有","優先サポート","ミッションキット5%追加割引","即時1ランクティアレベルアップ(1回)"]}',
  5, true
)
ON CONFLICT DO NOTHING;

-- ─── 2. 유저 구독 테이블 ──────────────────────
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
  payment_provider TEXT,
  payment_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  tier_levelup_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 구독만 조회" ON user_subscriptions;
CREATE POLICY "본인 구독만 조회" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 구독만 수정" ON user_subscriptions;
CREATE POLICY "본인 구독만 수정" ON user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "구독 생성" ON user_subscriptions;
CREATE POLICY "구독 생성" ON user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── 3. 여행 플랜 테이블 ──────────────────────
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title JSONB,
  city_id TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  has_mission_kit BOOLEAN DEFAULT false,
  kit_course_id UUID REFERENCES courses(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 플랜만 조회" ON travel_plans;
CREATE POLICY "본인 플랜만 조회" ON travel_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 플랜만 수정" ON travel_plans;
CREATE POLICY "본인 플랜만 수정" ON travel_plans FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 플랜만 삭제" ON travel_plans;
CREATE POLICY "본인 플랜만 삭제" ON travel_plans FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "플랜 생성" ON travel_plans;
CREATE POLICY "플랜 생성" ON travel_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── 4. 플랜 아이템 테이블 ────────────────────
CREATE TABLE IF NOT EXISTS plan_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('food', 'stay', 'diy', 'quest', 'ootd', 'goods', 'transport', 'surprise')),
  item_data JSONB NOT NULL,
  day_number INTEGER,
  time_slot TEXT CHECK (time_slot IN ('morning', 'afternoon', 'evening', 'anytime')),
  sort_order INTEGER DEFAULT 0,
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "플랜 아이템 조회" ON plan_items;
CREATE POLICY "플랜 아이템 조회" ON plan_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM travel_plans WHERE id = plan_items.plan_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "플랜 아이템 생성" ON plan_items;
CREATE POLICY "플랜 아이템 생성" ON plan_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM travel_plans WHERE id = plan_items.plan_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "플랜 아이템 수정" ON plan_items;
CREATE POLICY "플랜 아이템 수정" ON plan_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM travel_plans WHERE id = plan_items.plan_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "플랜 아이템 삭제" ON plan_items;
CREATE POLICY "플랜 아이템 삭제" ON plan_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM travel_plans WHERE id = plan_items.plan_id AND user_id = auth.uid()));

-- ─── 인덱스 ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_travel_plans_user ON travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_status ON travel_plans(status);
CREATE INDEX IF NOT EXISTS idx_plan_items_plan ON plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_type ON plan_items(item_type);
