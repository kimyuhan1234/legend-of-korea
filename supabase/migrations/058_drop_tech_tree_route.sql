-- ============================================================
--  058_drop_tech_tree_route.sql
--  무관/문관 분기 시스템 폐기 (성장 지도 K-콘텐츠 개편).
--
--  ⚠️ 적용 시점: v2 검증 완료 후 (commit 5 cleanup 동시).
--    - 운영자가 NEXT_PUBLIC_AVATAR_SYSTEM=v2 로 사이트 정상 동작 확인 후 적용.
--    - 적용 전이면 030 의 tech_tree_route + tier_titles 가 보존된 상태로 v1 fallback 동작.
--
--  대체: 057 의 avatar_categories + selected_avatar_image_id.
-- ============================================================

-- 1) users.tech_tree_route 컬럼 + 체크 제약 제거
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_tech_tree_route_check;

ALTER TABLE public.users
  DROP COLUMN IF EXISTS tech_tree_route;

-- 2) tier_titles 테이블 폐기
DROP TABLE IF EXISTS public.tier_titles CASCADE;

-- 적용 후 확인:
--   \d public.users
--   → tech_tree_route 컬럼 없음
--   SELECT to_regclass('public.tier_titles');
--   → NULL
