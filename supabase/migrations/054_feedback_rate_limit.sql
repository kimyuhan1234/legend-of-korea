-- ============================================================
--  054_feedback_rate_limit.sql
--  Supabase Security Advisor: feedback INSERT WITH CHECK (true) 보강
--  2026-05-01
-- ============================================================
--  배경:
--    feedback 정책 "anyone can insert feedback" WITH CHECK (true) 는
--    PIPA 준수 (비로그인 익명 INSERT 허용, IP 해시화) 의도. Advisor 가
--    "always-true" 로 경고 — false-positive 이지만 spam 방지 layer 부재.
--
--  해결:
--    같은 ip_hash 로 1 시간 안 5 회 제한 trigger 추가.
--    RLS 정책 자체는 그대로 (인증 사용자/비로그인 모두 INSERT 가능).
--
--  goods_notify_subscribers 는 email UNIQUE 제약으로 자연 rate-limit ✓
--  (같은 email 재제출 시 23505 conflict — 코드에서 duplicate 처리 중)
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────
-- feedback rate limit trigger
--   같은 ip_hash 가 1 시간 동안 5 건 이상 INSERT 시도하면 RAISE EXCEPTION
-- ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.feedback_rate_limit_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- ip_hash 가 NULL 이면 통과 (이론상 없음 — 코드에서 항상 채움)
  IF NEW.ip_hash IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO recent_count
  FROM public.feedback
  WHERE ip_hash = NEW.ip_hash
    AND created_at >= now() - interval '1 hour';

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'rate_limit_exceeded'
      USING HINT = '같은 IP 에서 1 시간 동안 5 건 이상 피드백을 제출할 수 없습니다.';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.feedback_rate_limit_check() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_feedback_rate_limit ON public.feedback;

CREATE TRIGGER trg_feedback_rate_limit
  BEFORE INSERT ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.feedback_rate_limit_check();

COMMENT ON FUNCTION public.feedback_rate_limit_check IS
  'feedback INSERT 시 ip_hash 기준 1 시간 5 회 제한. WITH CHECK (true) 정책의 spam 방지 보강.';

COMMIT;
