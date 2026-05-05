-- ============================================================
--  060_avatar_images_seed.sql
--  실 사진 73장 INSERT + 057 placeholder seed 정리 + 자동 매핑 재실행.
--
--  멱등 보장:
--   - 057 의 placeholder.svg row 는 DELETE 후 신규 73 INSERT
--     (placeholder 보존하면 카테고리당 'is_default' 조정 충돌 우려 + 데이터 군더더기)
--   - INSERT 는 (category_id, filename) 기준 멱등 — 본 SQL 재실행 시
--     중복 막기 위해 NOT EXISTS 가드.
--   - 자동 매핑은 059 와 동일 패턴 — selected_avatar_image_id 가 NULL 이거나
--     placeholder 였던 사용자에 대해 본인 레벨 default 사진 재할당.
--
--  적용 순서: 057 → (059 선택) → 060
-- ============================================================

-- 1) 057 의 placeholder.svg seed 일괄 삭제
--    (배포된 사진들로 새 default 지정 — 운영자 검증 후 선택지)
DELETE FROM public.avatar_images WHERE filename = 'placeholder.svg';

-- 2) 73장 INSERT (멱등 가드: NOT EXISTS)

-- americano (3장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'americano-1.png', 1, true FROM public.avatar_categories WHERE slug = 'americano'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'americano' AND i.filename = 'americano-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'americano-2.png', 2, false FROM public.avatar_categories WHERE slug = 'americano'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'americano' AND i.filename = 'americano-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'americano-3.png', 3, false FROM public.avatar_categories WHERE slug = 'americano'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'americano' AND i.filename = 'americano-3.png'
);

-- mugunghwa (4장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'mugunghwa-1.png', 1, true FROM public.avatar_categories WHERE slug = 'mugunghwa'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'mugunghwa' AND i.filename = 'mugunghwa-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'mugunghwa-2.png', 2, false FROM public.avatar_categories WHERE slug = 'mugunghwa'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'mugunghwa' AND i.filename = 'mugunghwa-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'mugunghwa-3.png', 3, false FROM public.avatar_categories WHERE slug = 'mugunghwa'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'mugunghwa' AND i.filename = 'mugunghwa-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'mugunghwa-4.png', 4, false FROM public.avatar_categories WHERE slug = 'mugunghwa'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'mugunghwa' AND i.filename = 'mugunghwa-4.png'
);

-- tiger (4장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'tiger-1.png', 1, true FROM public.avatar_categories WHERE slug = 'tiger'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'tiger' AND i.filename = 'tiger-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'tiger-2.png', 2, false FROM public.avatar_categories WHERE slug = 'tiger'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'tiger' AND i.filename = 'tiger-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'tiger-3.png', 3, false FROM public.avatar_categories WHERE slug = 'tiger'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'tiger' AND i.filename = 'tiger-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'tiger-4.png', 4, false FROM public.avatar_categories WHERE slug = 'tiger'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'tiger' AND i.filename = 'tiger-4.png'
);

-- kbeauty (9장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-1.png', 1, true FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-2.png', 2, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-3.png', 3, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-4.png', 4, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-4.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-5.png', 5, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-5.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-6.png', 6, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-6.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-7.png', 7, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-7.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-8.png', 8, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-8.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'kbeauty-9.png', 9, false FROM public.avatar_categories WHERE slug = 'kbeauty'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'kbeauty' AND i.filename = 'kbeauty-9.png'
);

-- hanbok (11장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-1.png', 1, true FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-2.png', 2, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-3.png', 3, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-4.png', 4, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-4.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-5.png', 5, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-5.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-6.png', 6, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-6.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-7.png', 7, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-7.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-8.png', 8, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-8.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-9.png', 9, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-9.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-10.png', 10, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-10.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanbok-11.png', 11, false FROM public.avatar_categories WHERE slug = 'hanbok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanbok' AND i.filename = 'hanbok-11.png'
);

-- hansik (11장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-1.png', 1, true FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-2.png', 2, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-3.png', 3, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-4.png', 4, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-4.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-5.png', 5, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-5.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-6.png', 6, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-6.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-7.png', 7, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-7.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-8.png', 8, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-8.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-9.png', 9, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-9.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-10.png', 10, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-10.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hansik-11.png', 11, false FROM public.avatar_categories WHERE slug = 'hansik'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hansik' AND i.filename = 'hansik-11.png'
);

-- hanok (3장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanok-1.png', 1, true FROM public.avatar_categories WHERE slug = 'hanok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanok' AND i.filename = 'hanok-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanok-2.png', 2, false FROM public.avatar_categories WHERE slug = 'hanok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanok' AND i.filename = 'hanok-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'hanok-3.png', 3, false FROM public.avatar_categories WHERE slug = 'hanok'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'hanok' AND i.filename = 'hanok-3.png'
);

-- drama (9장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-1.png', 1, true FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-2.png', 2, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-3.png', 3, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-4.png', 4, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-4.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-5.png', 5, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-5.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-6.png', 6, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-6.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-7.png', 7, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-7.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-8.png', 8, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-8.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'drama-9.png', 9, false FROM public.avatar_categories WHERE slug = 'drama'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'drama' AND i.filename = 'drama-9.png'
);

-- music (11장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-1.png', 1, true FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-2.png', 2, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-3.png', 3, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-4.png', 4, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-4.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-5.png', 5, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-5.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-6.png', 6, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-6.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-7.png', 7, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-7.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-8.png', 8, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-8.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-9.png', 9, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-9.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-10.png', 10, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-10.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'music-11.png', 11, false FROM public.avatar_categories WHERE slug = 'music'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'music' AND i.filename = 'music-11.png'
);

-- movie (8장 — 첫 번째가 is_default)
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-1.png', 1, true FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-1.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-2.png', 2, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-2.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-3.png', 3, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-3.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-4.png', 4, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-4.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-5.png', 5, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-5.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-6.png', 6, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-6.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-7.png', 7, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-7.png'
);
INSERT INTO public.avatar_images (category_id, filename, display_order, is_default)
SELECT id, 'movie-8.png', 8, false FROM public.avatar_categories WHERE slug = 'movie'
AND NOT EXISTS (
  SELECT 1 FROM public.avatar_images i JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.slug = 'movie' AND i.filename = 'movie-8.png'
);

-- 3) 자동 매핑 재실행 (059 와 동일 — placeholder 였던 사용자 재할당)
--    selected_avatar_image_id 가 NULL 이거나 폐기된 placeholder 를 가리키던 사용자에게
--    본인 레벨 카테고리의 새 is_default 사진 1장 자동 할당.
UPDATE public.users u
SET selected_avatar_image_id = (
  SELECT i.id
  FROM public.avatar_images i
  JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.level_required = LEAST(GREATEST(COALESCE(u.current_level, 1), 1), 10)
    AND i.is_default = true
  LIMIT 1
)
WHERE u.selected_avatar_image_id IS NULL
   OR NOT EXISTS (SELECT 1 FROM public.avatar_images WHERE id = u.selected_avatar_image_id);

-- 적용 후 확인:
--   SELECT count(*) FROM avatar_images;
--   → 73 (placeholder 삭제 후 실 사진만)
--   SELECT c.slug, count(*), bool_or(i.is_default) AS has_default
--   FROM avatar_images i JOIN avatar_categories c ON c.id = i.category_id
--   GROUP BY c.slug ORDER BY c.slug;
--   → 카테고리별 카운트 + 모든 카테고리에 has_default = true
--   SELECT count(*) FROM users WHERE selected_avatar_image_id IS NOT NULL;
--   → 전체 사용자 수와 일치
