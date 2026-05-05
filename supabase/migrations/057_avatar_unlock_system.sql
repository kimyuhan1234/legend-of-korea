-- ============================================================
--  057_avatar_unlock_system.sql
--  성장 지도 K-콘텐츠 테마 + 사진 해금 시스템 (PRD 2026-05).
--
--  - avatar_categories: 10 카테고리 메타 (level_required 1~10)
--  - avatar_images: 카테고리별 사진 메타 (is_default 1장 / 카테고리 unique)
--  - users.selected_avatar_image_id FK 추가
--  - 카테고리 10개 seed (americano ~ movie)
--  - 카테고리당 placeholder.svg 1장 seed (is_default = true)
--
--  무관/scholar/warrior 분기 (030 마이그레이션) 의 후속 — 058 에서 폐기 처리.
-- ============================================================

-- 1) avatar_categories
CREATE TABLE IF NOT EXISTS public.avatar_categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_required  int NOT NULL UNIQUE CHECK (level_required BETWEEN 1 AND 10),
  slug            varchar(30) NOT NULL UNIQUE,
  display_order   int NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.avatar_categories IS
  '아바타 해금 카테고리 — level_required 도달 시 해금. slug 는 i18n 키 (avatar.category.{slug})';

-- 2) avatar_images
CREATE TABLE IF NOT EXISTS public.avatar_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid NOT NULL REFERENCES public.avatar_categories(id) ON DELETE CASCADE,
  filename      varchar(120) NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  is_default    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 카테고리당 is_default = true 1장만 허용
CREATE UNIQUE INDEX IF NOT EXISTS avatar_images_one_default_per_category
  ON public.avatar_images (category_id) WHERE is_default = true;

COMMENT ON TABLE public.avatar_images IS
  '카테고리별 아바타 사진. filename 은 /images/avatar/{slug}/{filename} 또는 Supabase Storage URL';
COMMENT ON COLUMN public.avatar_images.is_default IS
  '카테고리 자동 매핑용 기본 사진 — 카테고리당 1장만 true';

-- 3) users.selected_avatar_image_id
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS selected_avatar_image_id uuid
  REFERENCES public.avatar_images(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.users.selected_avatar_image_id IS
  '사용자가 선택한 아바타 사진. NULL = 기본 매핑 (본인 레벨 카테고리의 is_default 사진) 자동 노출';

-- 4) RLS
ALTER TABLE public.avatar_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_images     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avatar_categories_read_all" ON public.avatar_categories;
CREATE POLICY "avatar_categories_read_all"
  ON public.avatar_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "avatar_images_read_all" ON public.avatar_images;
CREATE POLICY "avatar_images_read_all"
  ON public.avatar_images FOR SELECT USING (true);

-- 5) 카테고리 10개 seed (idempotent)
INSERT INTO public.avatar_categories (level_required, slug, display_order) VALUES
  (1,  'americano',  1),
  (2,  'mugunghwa',  2),
  (3,  'tiger',      3),
  (4,  'kbeauty',    4),
  (5,  'hanbok',     5),
  (6,  'hansik',     6),
  (7,  'hanok',      7),
  (8,  'drama',      8),
  (9,  'music',      9),
  (10, 'movie',     10)
ON CONFLICT (level_required) DO NOTHING;

-- 6) 카테고리당 placeholder.svg 1장 seed (is_default = true)
--    실제 사진 업로드 후 운영자가 별도로 INSERT + is_default 조정
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT c.id, 'placeholder.svg', 0, true
FROM public.avatar_categories c
WHERE NOT EXISTS (
  SELECT 1 FROM public.avatar_images i WHERE i.category_id = c.id AND i.is_default = true
);

-- 적용 후 확인:
--   SELECT level_required, slug FROM avatar_categories ORDER BY level_required;
--   → 10 rows
--   SELECT c.slug, i.filename, i.is_default FROM avatar_images i JOIN avatar_categories c ON c.id = i.category_id ORDER BY c.level_required;
--   → 카테고리당 placeholder.svg / is_default = true
