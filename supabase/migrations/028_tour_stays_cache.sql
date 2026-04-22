-- TourAPI 숙박 데이터 캐싱 테이블
-- 매 요청마다 외부 API 호출하면 rate limit / 지연 발생 → 24시간 캐싱
-- RLS: 읽기는 모두 허용(공개 데이터), 쓰기는 service_role 전용

CREATE TABLE IF NOT EXISTS tour_stays_cache (
  id TEXT PRIMARY KEY,          -- TourAPI contentid
  data JSONB NOT NULL,          -- NormalizedStay 전체 데이터
  area_code TEXT NOT NULL,      -- 지역 코드 (1, 6, 39 등)
  stay_type TEXT,               -- 관광호텔/한옥/펜션/모텔/게스트하우스 등
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_tour_stays_area    ON tour_stays_cache(area_code);
CREATE INDEX IF NOT EXISTS idx_tour_stays_type    ON tour_stays_cache(stay_type);
CREATE INDEX IF NOT EXISTS idx_tour_stays_expires ON tour_stays_cache(expires_at);

ALTER TABLE tour_stays_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tour_stays_cache"
  ON tour_stays_cache
  FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE 정책은 의도적으로 만들지 않음 → service_role만 쓰기 가능
