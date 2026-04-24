-- Migration 039: community_posts 에 theme 컬럼 추가
-- 피드 필터를 도시(region) → 테마(theme)로 전환.
-- 기존 region 컬럼은 보존 (레거시 데이터 유지).
-- theme NULL = 전체에 노출 (마이그레이션 직후 기존 글은 NULL).

ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS theme TEXT;

-- 빠른 테마별 필터링을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_community_posts_theme
  ON public.community_posts (theme)
  WHERE theme IS NOT NULL;

-- 허용 값 제약 (신규 삽입·업데이트 시)
ALTER TABLE public.community_posts
  DROP CONSTRAINT IF EXISTS community_posts_theme_check;
ALTER TABLE public.community_posts
  ADD CONSTRAINT community_posts_theme_check
  CHECK (theme IS NULL OR theme IN ('food','spot','stay','mission','culture','shopping','tip'));

-- 기존 데이터는 NULL 유지 — 새 글만 테마 지정.
-- 선택 사항: 원할 경우 아래로 기존 글을 'tip' 으로 일괄 설정 가능:
-- UPDATE public.community_posts SET theme = 'tip' WHERE theme IS NULL;
