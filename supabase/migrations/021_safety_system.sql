-- ============================================================
--  021_safety_system.sql
--  안전 시스템 — 참여자 상호 별점 + 신고 + 블랙리스트 자동 차단
-- ============================================================

-- 참여자 상호 별점 테이블
CREATE TABLE participant_reviews (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type      TEXT NOT NULL CHECK (event_type IN ('quest_party', 'gyeongdo')),
  event_id        TEXT NOT NULL,
  reviewer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, reviewer_id, reviewee_id),
  CHECK (reviewer_id <> reviewee_id)
);

-- 신고 테이블
CREATE TABLE user_reports (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL CHECK (event_type IN ('quest_party', 'gyeongdo')),
  event_id     TEXT NOT NULL,
  reason       TEXT NOT NULL CHECK (reason IN (
    'no_show', 'harassment', 'fraud', 'violence', 'inappropriate', 'other'
  )),
  detail       TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, reporter_id, reported_id),
  CHECK (reporter_id <> reported_id)
);

-- 블랙리스트 테이블
CREATE TABLE blacklist (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  reason          TEXT NOT NULL CHECK (reason IN ('low_rating', 'admin_ban', 'reports')),
  average_rating  NUMERIC(3,1),
  total_reports   INTEGER NOT NULL DEFAULT 0,
  blocked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until   TIMESTAMPTZ,          -- NULL = 영구 차단
  is_active       BOOLEAN NOT NULL DEFAULT true
);

-- RLS
ALTER TABLE participant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;

-- participant_reviews 정책
CREATE POLICY "reviews_insert" ON participant_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "reviews_select" ON participant_reviews
  FOR SELECT USING (auth.uid() = reviewer_id OR auth.uid() = reviewee_id);

-- user_reports 정책
CREATE POLICY "reports_insert" ON user_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select" ON user_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- blacklist 정책 (차단 여부 확인이 필요하므로 누구나 조회 가능)
CREATE POLICY "blacklist_select" ON blacklist
  FOR SELECT USING (true);

-- 인덱스
CREATE INDEX idx_reviews_reviewee  ON participant_reviews(reviewee_id);
CREATE INDEX idx_reviews_event     ON participant_reviews(event_id);
CREATE INDEX idx_reports_reported  ON user_reports(reported_id);
CREATE INDEX idx_reports_status    ON user_reports(status);
CREATE INDEX idx_blacklist_user    ON blacklist(user_id);
CREATE INDEX idx_blacklist_active  ON blacklist(is_active);
