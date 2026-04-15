-- ============================================================
--  020_quest_party.sql
--  Quest Party 매칭 시스템 — 파티 생성/참여 테이블
-- ============================================================

CREATE TABLE quest_parties (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id         TEXT NOT NULL,
  leader_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  adventure_date    DATE NOT NULL,
  max_members       INTEGER NOT NULL DEFAULT 4 CHECK (max_members BETWEEN 2 AND 6),
  current_members   INTEGER NOT NULL DEFAULT 1,
  status            TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'completed', 'cancelled')),
  language          TEXT NOT NULL DEFAULT 'en',
  leader_nationality TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quest_party_members (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id   UUID NOT NULL REFERENCES quest_parties(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (party_id, user_id)
);

-- RLS
ALTER TABLE quest_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_party_members ENABLE ROW LEVEL SECURITY;

-- quest_parties 정책
CREATE POLICY "quest_parties_select" ON quest_parties
  FOR SELECT USING (true);

CREATE POLICY "quest_parties_insert" ON quest_parties
  FOR INSERT WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "quest_parties_update" ON quest_parties
  FOR UPDATE USING (auth.uid() = leader_id);

CREATE POLICY "quest_parties_delete" ON quest_parties
  FOR DELETE USING (auth.uid() = leader_id);

-- quest_party_members 정책
CREATE POLICY "party_members_select" ON quest_party_members
  FOR SELECT USING (true);

CREATE POLICY "party_members_insert" ON quest_party_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "party_members_delete" ON quest_party_members
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX idx_quest_parties_course   ON quest_parties(course_id);
CREATE INDEX idx_quest_parties_date     ON quest_parties(adventure_date);
CREATE INDEX idx_quest_parties_status   ON quest_parties(status);
CREATE INDEX idx_party_members_party    ON quest_party_members(party_id);
CREATE INDEX idx_party_members_user     ON quest_party_members(user_id);
