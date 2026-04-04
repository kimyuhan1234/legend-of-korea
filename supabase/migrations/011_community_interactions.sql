-- ============================================================
-- 011_community_interactions.sql
-- community_likes + community_comments 테이블 및 RLS 설정
-- ============================================================

-- ── community_likes ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- 인증 유저: SELECT
DROP POLICY IF EXISTS "community_likes_select" ON community_likes;
CREATE POLICY "community_likes_select"
  ON community_likes FOR SELECT
  TO authenticated
  USING (true);

-- 인증 유저: INSERT (본인만)
DROP POLICY IF EXISTS "community_likes_insert" ON community_likes;
CREATE POLICY "community_likes_insert"
  ON community_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 인증 유저: DELETE (본인만)
DROP POLICY IF EXISTS "community_likes_delete" ON community_likes;
CREATE POLICY "community_likes_delete"
  ON community_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── community_comments ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- 전체 공개 SELECT (비로그인 유저도 볼 수 있도록)
DROP POLICY IF EXISTS "community_comments_select" ON community_comments;
CREATE POLICY "community_comments_select"
  ON community_comments FOR SELECT
  USING (true);

-- 인증 유저: INSERT (본인만)
DROP POLICY IF EXISTS "community_comments_insert" ON community_comments;
CREATE POLICY "community_comments_insert"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 인증 유저: DELETE (본인만)
DROP POLICY IF EXISTS "community_comments_delete" ON community_comments;
CREATE POLICY "community_comments_delete"
  ON community_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── 인덱스 ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
