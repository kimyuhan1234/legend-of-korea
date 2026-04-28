-- ============================================================
-- 046: OAuth 가입자 birth_date NULL 허용 + 자동 grace
-- ============================================================
-- 배경
--   - 044 트리거 (enforce_birth_date_on_signup) 가 BEFORE INSERT 시점에
--     birth_date NULL 을 모두 차단 → OAuth 가입 흐름 (handle_new_user 트리거가
--     raw_user_meta_data 에 birth_date 없는 상태로 public.users INSERT) 에서
--     RAISE EXCEPTION → cascade rollback → auth.users 까지 무효화 → 가입 실패.
--   - PIPA §22-2 안전망은 유지하되 OAuth 호환성 확보 필요.
--
-- 정책
--   - social_provider IS NOT NULL (OAuth 가입): birth_date NULL 허용 +
--     birth_date_deadline 7 일 자동 부여. callback route 가 즉시
--     /auth/complete-profile 로 redirect 해 입력받지만, 사용자가 페이지를
--     이탈해도 7 일 grace 후 강제 차단.
--   - social_provider IS NULL (이메일 가입): birth_date 필수 유지 (RAISE EXCEPTION).
--   - 트리거는 그대로 두고 함수만 OVERRIDE.
-- ============================================================

CREATE OR REPLACE FUNCTION public.enforce_birth_date_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- birth_date 입력된 경우 통과
  IF NEW.birth_date IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- OAuth 가입 — NULL 허용 + 7 일 grace 자동 부여
  IF NEW.social_provider IS NOT NULL THEN
    IF NEW.birth_date_deadline IS NULL THEN
      NEW.birth_date_deadline := NOW() + INTERVAL '7 days';
    END IF;
    RETURN NEW;
  END IF;

  -- 이메일 가입 — birth_date NULL 차단 유지
  RAISE EXCEPTION '생년월일은 필수 입력 항목입니다 (PIPA §22-2)'
    USING HINT = 'auth signUp() 호출 시 raw_user_meta_data.birth_date 포함 필수';
END;
$$ LANGUAGE plpgsql;

-- 트리거는 044 에서 이미 생성됨 — 함수 OVERRIDE 만으로 즉시 적용

-- 검증 쿼리 (적용 후 수동 확인)
--   -- 1. 함수 정의 갱신 확인
--   SELECT prosrc FROM pg_proc WHERE proname = 'enforce_birth_date_on_signup';
--
--   -- 2. OAuth 가입 시뮬레이션 (실제 INSERT 전 트랜잭션 ROLLBACK 권장)
--   BEGIN;
--   INSERT INTO public.users (id, email, social_provider)
--   VALUES (gen_random_uuid(), 'test-oauth@example.com', 'google');
--   -- → birth_date_deadline 가 NOW() + 7 days 로 자동 설정되어야 함
--   ROLLBACK;
