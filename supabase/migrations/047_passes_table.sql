-- ============================================================
-- 047: passes 테이블 — 3 패스 1 회 구매 모델 (PRD-PRICING-2026-001)
-- ============================================================
-- 배경
--   - 기존 subscription_plans / user_subscriptions 폐기 (049 에서 DROP)
--   - 단발 구매 모델: type (short/standard/long) + duration_days (7/15/30)
--   - 결제: Toss 일반 결제 paymentKey 직접 저장
-- ============================================================

CREATE TABLE IF NOT EXISTS public.passes (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            VARCHAR(20) NOT NULL CHECK (type IN ('short', 'standard', 'long')),
  price_krw       INTEGER     NOT NULL CHECK (price_krw > 0),
  duration_days   INTEGER     NOT NULL CHECK (duration_days IN (7, 15, 30)),
  purchased_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  payment_id      VARCHAR(100),                     -- Toss paymentKey
  status          VARCHAR(20) NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'expired', 'refunded')),
  refunded_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 활성 패스 조회 (가장 빈번 — getActivePass)
CREATE INDEX IF NOT EXISTS idx_passes_user_active
  ON public.passes(user_id, status, expires_at)
  WHERE status = 'active';

-- 만료 cron 용 (정식 출시 후 추가 예정)
CREATE INDEX IF NOT EXISTS idx_passes_expires
  ON public.passes(expires_at)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_passes_payment
  ON public.passes(payment_id)
  WHERE payment_id IS NOT NULL;

-- RLS
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 패스 조회" ON public.passes;
CREATE POLICY "본인 패스 조회" ON public.passes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 패스 생성" ON public.passes;
CREATE POLICY "본인 패스 생성" ON public.passes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- updated_at 자동 갱신 (001_initial_schema.sql 의 handle_updated_at 함수 재사용)
DROP TRIGGER IF EXISTS trg_passes_updated_at ON public.passes;
CREATE TRIGGER trg_passes_updated_at
  BEFORE UPDATE ON public.passes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.passes IS '3 패스 1 회 구매 (PRD-PRICING-2026-001) — short/standard/long';
COMMENT ON COLUMN public.passes.type IS 'short=7일 / standard=15일 / long=30일';
COMMENT ON COLUMN public.passes.payment_id IS 'Toss paymentKey (Billing X, 일반 결제)';
