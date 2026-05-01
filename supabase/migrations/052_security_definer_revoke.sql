-- ============================================================
--  052_security_definer_revoke.sql
--  Supabase Security Advisor: Public Can Execute SECURITY DEFINER Function
--  2026-05-01
-- ============================================================
--  분류:
--    A. 트리거 only (4): REVOKE FROM public, anon, authenticated
--       (트리거는 함수 권한 우회 — 동작 영향 X)
--    B. service_role 만 사용 (3): REVOKE FROM authenticated
--       (코드는 이미 createServiceClient 사용, 단 GRANT TO authenticated 잔존했음)
--    C. anon/authenticated 호출 (1): REVOKE FROM authenticated, GRANT TO service_role only
--       (코드 변경 동반 — increment_user_lp 호출 3 곳을 service_role 로)
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────
-- A. 트리거 only — REVOKE FROM public roles
-- ────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_like_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_birth_date_on_signup() FROM PUBLIC, anon, authenticated;

-- ────────────────────────────────────────────────
-- B. service_role 만 사용하는 RPC — REVOKE FROM authenticated
--    코드 (createServiceClient) 는 이미 service_role bearer key 사용 중
-- ────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.create_order_with_inventory(
  uuid, uuid, integer, integer, text, text, text, text, text, uuid
) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.confirm_order_with_coupon(
  uuid, integer
) FROM PUBLIC, anon, authenticated;

-- increment_likes — 코드 호출 0 (dead). 안전 회수.
REVOKE EXECUTE ON FUNCTION public.increment_likes(uuid) FROM PUBLIC, anon, authenticated;

-- ────────────────────────────────────────────────
-- C. increment_user_lp — anon/authenticated 호출 차단
--    코드 변경 동반 (createClient → createServiceClient) — 053_lp_route_service_role_patch
-- ────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.increment_user_lp(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.increment_user_lp(uuid, integer) TO service_role;

-- ────────────────────────────────────────────────
-- rls_auto_enable — 존재 시만
-- ────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated';
  END IF;
END $$;

COMMIT;
