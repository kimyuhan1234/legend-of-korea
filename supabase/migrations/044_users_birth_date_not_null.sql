-- ============================================================
-- 044: users.birth_date 재인증 시스템 + 신규 INSERT 강제
-- ============================================================
-- 배경
--   - PIPA §22-2 (만 14세 미만 보호) + COPPA — birth_date 누락 차단.
--   - 040 마이그레이션 코멘트: "후속 PR (044) 에서 재인증 후 NOT NULL 전환".
--   - 본 PRD-P0-FOLLOWUP P0F-1 — 60일 grace period 부여 + 신규 가입 강제.
--
-- 정책
--   - 기존 birth_date NULL 사용자: 60일 grace period (재인증 모달 + 단계 제재
--     + Resend 이메일 자동화) — birth_date_deadline 컬럼으로 추적.
--   - 신규 가입자 (INSERT): birth_date 필수 (트리거 차단). NULL 시 EXCEPTION.
--   - 진짜 NOT NULL 제약은 별도 후속 PR — 모든 사용자 재인증 완료 후.
-- ============================================================

-- 1. birth_date_deadline 컬럼 추가 (재인증 마감일)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS birth_date_deadline TIMESTAMPTZ;

COMMENT ON COLUMN public.users.birth_date_deadline IS
  '재인증 마감일 (P0F-1, 2026-04 추가). NULL 이면 입력 완료 또는 신규 가입자.
   이 시간 이후 birth_date 미입력 시 단계 제재 (D+30 경고 / D+60 강제 차단).';

-- 2. 기존 NULL 사용자에게 60일 grace 부여 (멱등 — 이미 deadline 있으면 유지)
UPDATE public.users
   SET birth_date_deadline = NOW() + INTERVAL '60 days'
 WHERE birth_date IS NULL
   AND birth_date_deadline IS NULL;

-- 3. 단계 제재 쿼리용 인덱스 (D+30 / D+59 batch 발송 등)
CREATE INDEX IF NOT EXISTS idx_users_birth_date_deadline
  ON public.users(birth_date_deadline)
  WHERE birth_date IS NULL;

-- 4. 신규 INSERT 시 birth_date 필수 — 트리거로 차단
--    handle_new_user (040) 트리거가 auth.users → public.users 동기화 시
--    raw_user_meta_data 의 birth_date 가 NULL 이면 그대로 NULL INSERT.
--    본 트리거는 그 시점에 RAISE EXCEPTION 으로 차단 → auth.users INSERT 자체
--    rollback. 어플리케이션 레이어 (lib/auth/actions.ts) 에서도 검증되지만
--    DB 레벨 안전망 추가.
CREATE OR REPLACE FUNCTION public.enforce_birth_date_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT 시점 birth_date NULL 차단 (UPDATE 는 영향 X — 기존 NULL 유지)
  IF NEW.birth_date IS NULL THEN
    RAISE EXCEPTION '생년월일은 필수 입력 항목입니다 (PIPA §22-2)'
      USING HINT = 'auth signUp() 호출 시 raw_user_meta_data.birth_date 포함 필수';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_birth_date_on_signup_trigger ON public.users;
CREATE TRIGGER enforce_birth_date_on_signup_trigger
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_birth_date_on_signup();

-- 5. 검증 쿼리 (적용 후 수동 실행 권장)
--    SELECT
--      COUNT(*)                            AS total_users,
--      COUNT(birth_date)                   AS with_birth_date,
--      COUNT(birth_date_deadline)          AS pending_reauth,
--      COUNT(*) FILTER (WHERE birth_date IS NULL AND birth_date_deadline < NOW()
--                             + INTERVAL '30 days')  AS warning_zone_30d,
--      COUNT(*) FILTER (WHERE birth_date IS NULL AND birth_date_deadline < NOW())
--                                              AS blocked_zone
--    FROM public.users;
