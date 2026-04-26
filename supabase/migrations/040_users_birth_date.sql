-- ============================================================
-- 040: users.birth_date + birth_date_verified_at 컬럼 추가
-- ============================================================
-- 배경: 만 14세 미만 가입 차단 (PIPA §22-2)
-- 정책: 본 마이그레이션은 NULL 허용 — 기존 사용자(birth_date NULL)는
--       후속 PR (044) 에서 재인증 후 NOT NULL 전환
-- ============================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS birth_date_verified_at TIMESTAMPTZ;

-- birth_date 미입력 사용자 빠른 조회 (후속 재인증 PR 에서 사용)
CREATE INDEX IF NOT EXISTS idx_users_birth_date_null
  ON public.users(id)
  WHERE birth_date IS NULL;

-- ============================================================
-- handle_new_user 트리거 업데이트
-- ============================================================
-- auth.users INSERT 시 raw_user_meta_data 의 birth_date 를 함께 INSERT.
-- 14세 미만 검증은 어플리케이션 레이어 (lib/auth/actions.ts) 에서 처리.
-- 트리거는 단순히 메타데이터를 그대로 옮겨담기만 한다.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  bd DATE;
BEGIN
  -- raw_user_meta_data->>'birth_date' 는 ISO 'YYYY-MM-DD' 문자열 또는 NULL
  BEGIN
    bd := (NEW.raw_user_meta_data->>'birth_date')::DATE;
  EXCEPTION WHEN OTHERS THEN
    bd := NULL;
  END;

  INSERT INTO public.users (
    id, email, nickname, language, social_provider, avatar_url,
    birth_date, birth_date_verified_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'language', 'ko'),
    NEW.raw_app_meta_data->>'provider',
    NEW.raw_user_meta_data->>'avatar_url',
    bd,
    CASE WHEN bd IS NOT NULL THEN NOW() ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거는 기존과 동일 (재선언 불필요) — 함수만 갱신
