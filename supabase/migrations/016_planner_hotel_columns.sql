-- =============================================
-- 016: travel_plans에 호텔 정보 컬럼 추가
-- (제휴 호텔 담기 + 직접 입력 + 거리 계산용 좌표)
-- =============================================

ALTER TABLE travel_plans
  ADD COLUMN IF NOT EXISTS hotel_name TEXT,
  ADD COLUMN IF NOT EXISTS hotel_address TEXT,
  ADD COLUMN IF NOT EXISTS hotel_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS hotel_lng DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS hotel_source TEXT;

-- hotel_source 제약 (nullable)
ALTER TABLE travel_plans DROP CONSTRAINT IF EXISTS travel_plans_hotel_source_check;
ALTER TABLE travel_plans ADD CONSTRAINT travel_plans_hotel_source_check
  CHECK (hotel_source IS NULL OR hotel_source IN ('curated', 'manual'));
