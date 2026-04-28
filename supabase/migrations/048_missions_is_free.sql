-- ============================================================
-- 048: missions.is_free — 무료 미션 플래그 (PRD-PRICING-2026-001)
-- ============================================================
-- 정책
--   - 서울 코스의 첫 미션 1 개만 is_free = TRUE
--   - 그 외 모든 미션은 활성 패스 필요 (canAccessMission 분기)
--   - missions schema: course_id + sequence (region 정보는 courses.region)
-- ============================================================

ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS is_free BOOLEAN NOT NULL DEFAULT FALSE;

-- 서울 코스의 sequence=1 미션 무료화 (멱등 — 이미 TRUE 면 변경 X)
UPDATE public.missions m
   SET is_free = TRUE
  FROM public.courses c
 WHERE m.course_id = c.id
   AND c.region = 'seoul'
   AND m.sequence = 1
   AND m.is_free = FALSE;

CREATE INDEX IF NOT EXISTS idx_missions_is_free
  ON public.missions(is_free)
  WHERE is_free = TRUE;

COMMENT ON COLUMN public.missions.is_free IS
  '무료 미션 플래그 (PRD-PRICING-2026-001) — 서울 첫 미션만 TRUE. canAccessMission() 분기.';

-- 검증 쿼리 (수동)
--   SELECT m.id, m.sequence, c.region
--     FROM public.missions m
--     JOIN public.courses c ON c.id = m.course_id
--    WHERE m.is_free = TRUE;
--   -- 예상: 서울 region 의 sequence=1 행 1 개 (서울 코스 1 개일 때)
