-- Migration 037: GPS 체크인 서버 검증
-- mission_progress에 GPS 검증 상태 컬럼 추가
-- /api/missions/verify-gps 에서 Haversine 200m 반경 확인 후 true 세팅
-- /api/missions/complete 에서 mission.latitude 가 NOT NULL 이면 gps_verified 필수

ALTER TABLE public.mission_progress
  ADD COLUMN IF NOT EXISTS gps_verified BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.mission_progress
  ADD COLUMN IF NOT EXISTS gps_verified_at TIMESTAMPTZ;

-- 인덱스: 미션별 검증 상태 조회 최적화 (대시보드에서 빠르게 "체크인 완료" 뱃지 표시)
CREATE INDEX IF NOT EXISTS idx_mission_progress_user_verified
  ON public.mission_progress(user_id, gps_verified)
  WHERE gps_verified = true;
