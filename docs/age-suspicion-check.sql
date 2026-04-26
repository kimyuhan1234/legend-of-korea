-- ============================================================
-- 14세 미만 의심 정황 점검 SQL (READ-ONLY)
-- ============================================================
-- 사용 시점: 법률팀 보고용 — 수치만 추출, 격리/정지 X
-- 안전 원칙:
--   * SELECT 만. UPDATE/DELETE/INSERT 금지
--   * 결과는 사용자 ID 가 아닌 정황 카운트로만 보고
--   * MEMORIES 사진 분석 절대 금지 (PIPA 민감정보)
--   * 학교 시간 활동은 방학·재택수업·자유직업 등 가능성 있음 — 한계 명시
-- ============================================================

-- ── 1) 닉네임 패턴 의심: 학년/연도/생년/나이 단서 ──────────────
-- 정규식: 초/중/고 + 학년, 'XX살', YYYY 4자리 (2010~2024 범위만), 'YYYY년생' 등
WITH nickname_suspicion AS (
  SELECT id, nickname, created_at
  FROM public.users
  WHERE birth_date IS NULL
    AND (
      nickname ~ '(초[1-6]|중[1-3]|고[1-3])'                    -- '초3', '중2'
      OR nickname ~ '\d{1,2}\s*(살|세|歳|岁|歲)'                 -- '13살', '12세'
      OR nickname ~ '(20(1[5-9]|2[0-4])|24)생'                   -- '2015생', '2020생'
      OR nickname ~ '20(1[5-9]|2[0-4])년'                        -- '2015년'
      OR nickname ~ '(elementary|middle\s*school|jr\.?\s*high)'  -- 영문
    )
)
SELECT 'nickname_pattern' AS suspicion_type, COUNT(*) AS count
FROM nickname_suspicion;

-- ── 2) 미션 진행 시간대 의심: 평일 학교 시간(09-15시 KST) 외 활동 ──
-- 한계: 방학·재택수업·자유직업 가능성 → 보조 지표로만
WITH mission_school_hours AS (
  SELECT mp.user_id
  FROM public.mission_progress mp
  JOIN public.users u ON u.id = mp.user_id
  WHERE u.birth_date IS NULL
    AND mp.completed_at IS NOT NULL
    -- KST(UTC+9) 기준 평일 09-15시 활동
    AND EXTRACT(DOW FROM mp.completed_at AT TIME ZONE 'Asia/Seoul') BETWEEN 1 AND 5
    AND EXTRACT(HOUR FROM mp.completed_at AT TIME ZONE 'Asia/Seoul') BETWEEN 9 AND 14
  GROUP BY mp.user_id
  HAVING COUNT(*) >= 3  -- 3회 이상이면 정황 카운트
)
SELECT 'school_hours_mission' AS suspicion_type, COUNT(*) AS count
FROM mission_school_hours;

-- ── 3) 양쪽 모두 (닉네임 패턴 + 학교 시간 미션) ──────────────
WITH nickname_suspicion AS (
  SELECT id FROM public.users
  WHERE birth_date IS NULL
    AND (
      nickname ~ '(초[1-6]|중[1-3]|고[1-3])'
      OR nickname ~ '\d{1,2}\s*(살|세|歳|岁|歲)'
      OR nickname ~ '(20(1[5-9]|2[0-4])|24)생'
      OR nickname ~ '20(1[5-9]|2[0-4])년'
      OR nickname ~ '(elementary|middle\s*school|jr\.?\s*high)'
    )
),
school_hours_users AS (
  SELECT mp.user_id
  FROM public.mission_progress mp
  JOIN public.users u ON u.id = mp.user_id
  WHERE u.birth_date IS NULL
    AND mp.completed_at IS NOT NULL
    AND EXTRACT(DOW FROM mp.completed_at AT TIME ZONE 'Asia/Seoul') BETWEEN 1 AND 5
    AND EXTRACT(HOUR FROM mp.completed_at AT TIME ZONE 'Asia/Seoul') BETWEEN 9 AND 14
  GROUP BY mp.user_id
  HAVING COUNT(*) >= 3
)
SELECT 'both_signals' AS suspicion_type, COUNT(*) AS count
FROM nickname_suspicion ns
WHERE ns.id IN (SELECT user_id FROM school_hours_users);

-- ── 4) 점검 대상 모집단 (참고용) ──────────────────────────────
SELECT 'total_users_birth_date_null' AS metric, COUNT(*) AS count
FROM public.users WHERE birth_date IS NULL;

SELECT 'total_users_all' AS metric, COUNT(*) AS count
FROM public.users;
