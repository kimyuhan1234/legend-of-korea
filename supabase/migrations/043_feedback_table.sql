-- ============================================================
-- 043: feedback 테이블
-- ============================================================
-- 베타 기간 사용자 피드백 자체 수집.
-- 비로그인도 인서트 가능 (PIPA: 닉네임/이메일 수집 X, IP 해시화).
-- 관리자만 SELECT 가능.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.feedback (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  page_path   TEXT        NOT NULL,
  locale      TEXT        NOT NULL,
  rating      INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT        CHECK (char_length(comment) <= 1000),
  user_agent  TEXT        CHECK (char_length(user_agent) <= 200),
  ip_hash     TEXT        CHECK (char_length(ip_hash) <= 32),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 누구나 INSERT (비로그인 포함). 다른 사용자 데이터 조회는 불가.
CREATE POLICY "anyone can insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- 관리자만 SELECT (users.role = 'admin').
-- 일반 사용자는 자신의 피드백조차 조회 불가 (필요 시 후속 PR 에서 정책 추가).
CREATE POLICY "admins can read feedback"
  ON public.feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 관리자 보고서용 인덱스
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_page_path ON public.feedback(page_path);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
