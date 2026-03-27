-- ============================================================
-- Legend of Korea — Migration 005
-- community_posts의 좋아요 수를 원자적으로 증가시키는 RPC 함수
-- ============================================================

CREATE OR REPLACE FUNCTION increment_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
