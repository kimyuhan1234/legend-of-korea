-- ============================================================
--  061_recalc_post_counts.sql
--  community_posts.likes_count / comments_count 재계산.
--
--  배경: commit 036b70b 이전의 double-increment 버그로 카운트 인플레이션 발생.
--    - likes API 가 트리거 trg_community_likes_count 와 중복으로 manual UPDATE 호출
--      → 본인 글 좋아요 토글 시 +2/-2 누적
--    - comments API 의 manual UPDATE 가 다른 사용자 글에서 RLS 거부되어 stale
--
--  본 SQL: 실 community_likes / community_comments row 수 기준으로 카운트 재동기화.
--
--  멱등 보장: 재실행해도 결과 동일 (실 row 수 기준 정확한 값으로 SET).
--
--  ⚠️ 적용 절차 (운영자 수동):
--    1. Supabase Dashboard → SQL Editor
--    2. 본 파일 내용 붙여넣기 → Run
--    3. 마지막 SELECT 로 영향 정도 확인 (적용 전 한 번 / 적용 후 한 번)
-- ============================================================

-- ── 적용 전 진단: 인플레이션 정도 확인 (선택, 주석 해제하여 별도 실행 권장) ──
-- SELECT
--   count(*) AS total_posts,
--   sum(CASE WHEN likes_count != (SELECT count(*) FROM public.community_likes WHERE post_id = p.id) THEN 1 ELSE 0 END) AS likes_inflated,
--   sum(CASE WHEN comments_count != (SELECT count(*) FROM public.community_comments WHERE post_id = p.id) THEN 1 ELSE 0 END) AS comments_inflated,
--   sum(likes_count) AS sum_likes_cached,
--   (SELECT count(*) FROM public.community_likes) AS sum_likes_actual,
--   sum(comments_count) AS sum_comments_cached,
--   (SELECT count(*) FROM public.community_comments) AS sum_comments_actual
-- FROM public.community_posts p;

-- ── likes_count 재계산 ──
UPDATE public.community_posts p
SET likes_count = (
  SELECT count(*) FROM public.community_likes WHERE post_id = p.id
);

-- ── comments_count 재계산 ──
UPDATE public.community_posts p
SET comments_count = (
  SELECT count(*) FROM public.community_comments WHERE post_id = p.id
);

-- ── 적용 후 검증: 인플레이션 0 이어야 함 ──
SELECT
  count(*) AS total_posts,
  sum(CASE WHEN likes_count != (SELECT count(*) FROM public.community_likes WHERE post_id = p.id) THEN 1 ELSE 0 END) AS likes_inflated,
  sum(CASE WHEN comments_count != (SELECT count(*) FROM public.community_comments WHERE post_id = p.id) THEN 1 ELSE 0 END) AS comments_inflated
FROM public.community_posts p;
-- → likes_inflated = 0, comments_inflated = 0 이면 정상 동기화 완료.
