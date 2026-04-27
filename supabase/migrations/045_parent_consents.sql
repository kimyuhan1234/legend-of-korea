-- ============================================================
-- 045: parent_consents 테이블
-- ============================================================
-- 만 14세 미만 사용자 가입을 위한 법정대리인 동의 추적.
-- 182 상담 (2026-04-27) 권고: 법정대리인 동의 최소 플로우 즉시 구축.
--
-- 베타 단계 동작:
--   - /auth/parent-consent 폼에서 부모 이메일 입력 → pending 레코드 생성
--   - Resend 등 메일 발송 인프라는 정식 출시 시점에 연동
--   - 베타 기간은 DB 레코드만 보존 (의지 입증용)
--
-- 보안:
--   - INSERT: 비로그인 허용 (status='pending' 만, 토큰 검증은 API 레이어)
--   - SELECT: service-role 만 (anon 키로는 조회 불가)
--   - UPDATE/DELETE: service-role 만
-- ============================================================

CREATE TABLE IF NOT EXISTS public.parent_consents (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 신청자 정보 (14세 미만 사용자) — 베타는 nullable, 정식 출시 시 NOT NULL 검토
  applicant_email          TEXT,
  applicant_birth_date     DATE,
  applicant_nickname       TEXT,

  -- 법정대리인 정보
  parent_email             TEXT        NOT NULL,
  parent_consent_token     TEXT        NOT NULL UNIQUE,

  -- 상태 머신
  status                   TEXT        NOT NULL DEFAULT 'pending'
                                       CHECK (status IN ('pending', 'consented', 'rejected', 'expired')),
  consent_method           TEXT        CHECK (consent_method IN ('email_link', 'digital_signature') OR consent_method IS NULL),
  consented_at             TIMESTAMPTZ,
  expired_at               TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),

  -- 메타
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash                  TEXT        CHECK (char_length(ip_hash) <= 64)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_parent_consents_token   ON public.parent_consents(parent_consent_token);
CREATE INDEX IF NOT EXISTS idx_parent_consents_status  ON public.parent_consents(status);
CREATE INDEX IF NOT EXISTS idx_parent_consents_pending_expiry
  ON public.parent_consents(expired_at) WHERE status = 'pending';

-- RLS
ALTER TABLE public.parent_consents ENABLE ROW LEVEL SECURITY;

-- INSERT: 비로그인 허용. status='pending' 만 기록되도록 강제.
CREATE POLICY "anyone can insert pending consent"
  ON public.parent_consents FOR INSERT
  WITH CHECK (status = 'pending');

-- SELECT: service-role 전용. anon/authenticated 는 조회 불가.
-- (관리자는 service-role 클라이언트 통해서만 접근 — Admin API 라우트에서 처리)
CREATE POLICY "service-role only can read"
  ON public.parent_consents FOR SELECT
  USING (auth.role() = 'service_role');

-- UPDATE: service-role 전용 (동의 처리 = consent_method/consented_at 갱신).
CREATE POLICY "service-role only can update"
  ON public.parent_consents FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- DELETE: service-role 전용 (만료 정리 cron 용).
CREATE POLICY "service-role only can delete"
  ON public.parent_consents FOR DELETE
  USING (auth.role() = 'service_role');

-- users 테이블에 동의 추적 FK
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS parent_consent_id UUID REFERENCES public.parent_consents(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_parent_consent_id
  ON public.users(parent_consent_id) WHERE parent_consent_id IS NOT NULL;

COMMENT ON TABLE public.parent_consents IS
  'P0-5-C: 법정대리인 동의 추적 (182 상담 2026-04-27 반영). 베타는 DB 레코드만, 정식 출시 시 메일 발송 + 신분증 인증.';
