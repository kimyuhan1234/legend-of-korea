-- ============================================================
--  055_rls_with_check_strengthen.sql
--  Phase 2F — Supabase Security Advisor "RLS Policy Always True" 2건 해결
--  2026-05-01
-- ============================================================
--  배경:
--    feedback / goods_notify_subscribers INSERT 정책이 WITH CHECK (true)
--    Advisor 가 always-true 로 경고 (silence 기능 부재).
--
--  해결:
--    각 정책의 WITH CHECK 표현식을 강화 — rating 범위 / email 형식 등
--    실제 입력 검증을 정책 레벨에 추가. 코드 변경 동반 X
--    (기존 호출이 이미 보내는 값들이 자연스럽게 조건 통과).
--
--  보존:
--    - feedback: trg_feedback_rate_limit (054) 그대로 — 정책 통과 후 trigger 로 ip_hash 1h/5건 제한
--    - goods_notify_subscribers: email UNIQUE 제약 그대로 — 중복 시 23505
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────
-- 1. feedback "anyone can insert feedback"
--    rating: 1~5 (UI star rating 그대로)
--    comment: 5000자 이하
--    ip_hash: 코드에서 항상 채움 — NOT NULL 강제
-- ────────────────────────────────────────────────

DROP POLICY IF EXISTS "anyone can insert feedback" ON public.feedback;

CREATE POLICY "anyone can insert feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (
    rating BETWEEN 1 AND 5
    AND length(coalesce(comment, '')) <= 5000
    AND ip_hash IS NOT NULL
  );

-- ────────────────────────────────────────────────
-- 2. goods_notify_subscribers "Anyone can subscribe"
--    email: 단순 정규식 + 254자 (RFC 5321 max)
-- ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.goods_notify_subscribers;

CREATE POLICY "Anyone can subscribe"
  ON public.goods_notify_subscribers
  FOR INSERT
  WITH CHECK (
    email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND length(email) <= 254
  );

COMMIT;
