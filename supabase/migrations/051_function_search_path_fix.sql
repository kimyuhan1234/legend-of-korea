-- ============================================================
--  051_function_search_path_fix.sql
--  Supabase Security Advisor: Function Search Path Mutable
--  2026-05-01
-- ============================================================
--  대상: public schema 의 SECURITY DEFINER + Search Path Mutable 경고 11 함수
--  목적: search_path = public, pg_temp 고정 (search_path injection 차단)
--  영향: 함수 동작 변경 X (search_path 명시만)
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────
-- 트리거 함수 (4)
-- ────────────────────────────────────────────────

ALTER FUNCTION public.handle_new_user()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.handle_updated_at()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.handle_like_count()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.enforce_birth_date_on_signup()
  SET search_path = public, pg_temp;

-- ────────────────────────────────────────────────
-- RPC 함수 (4)
-- ────────────────────────────────────────────────

ALTER FUNCTION public.increment_user_lp(uid uuid, delta integer)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.increment_likes(post_id uuid)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.create_order_with_inventory(
  p_user_id uuid,
  p_kit_id uuid,
  p_quantity integer,
  p_total_price integer,
  p_shipping_name text,
  p_shipping_phone text,
  p_shipping_address text,
  p_shipping_address_detail text,
  p_shipping_zipcode text,
  p_coupon_id uuid
) SET search_path = public, pg_temp;

ALTER FUNCTION public.confirm_order_with_coupon(
  p_order_id uuid,
  p_amount integer
) SET search_path = public, pg_temp;

-- ────────────────────────────────────────────────
-- rls_auto_enable — 존재 시만 (DB 확인 후 실 정의 위치 식별 가능)
-- ────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    EXECUTE 'ALTER FUNCTION public.rls_auto_enable() SET search_path = public, pg_temp';
  END IF;
END $$;

-- ────────────────────────────────────────────────
-- 검증 — proconfig 가 search_path 포함하는지
-- ────────────────────────────────────────────────
-- 적용 후 실행:
--   SELECT proname, proconfig FROM pg_proc p
--   JOIN pg_namespace n ON n.oid = p.pronamespace
--   WHERE n.nspname = 'public' AND p.prosecdef = true;

COMMIT;
