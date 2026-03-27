-- ============================================================
-- Legend of Korea — Migration 002
-- orders 테이블에 coupon_id 컬럼 추가
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id);

-- coupon_id 인덱스
CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON public.orders(coupon_id);
