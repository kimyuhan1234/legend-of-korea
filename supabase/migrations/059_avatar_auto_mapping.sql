-- ============================================================
--  059_avatar_auto_mapping.sql
--  기존 사용자 selected_avatar_image_id 자동 매핑.
--
--  규칙: 사용자 current_level → avatar_categories.level_required = 사용자 레벨
--        의 카테고리에서 is_default = true 사진 1장
--
--  주의:
--   - 057 적용 직후 실 사진 업로드 전이면 모든 사용자가 placeholder.svg 로 매핑됨
--     (정상 — 클라이언트가 placeholder fallback UI 노출)
--   - 운영자가 실 사진 업로드 + is_default 재조정 후 본 마이그레이션 재실행 가능 (멱등 SET).
-- ============================================================

UPDATE public.users u
SET selected_avatar_image_id = (
  SELECT i.id
  FROM public.avatar_images i
  JOIN public.avatar_categories c ON c.id = i.category_id
  WHERE c.level_required = LEAST(GREATEST(COALESCE(u.current_level, 1), 1), 10)
    AND i.is_default = true
  LIMIT 1
)
WHERE u.selected_avatar_image_id IS NULL;

-- 적용 후 확인:
--   SELECT count(*) FROM users WHERE selected_avatar_image_id IS NOT NULL;
--   → 전체 사용자 수와 일치해야 함 (avatar_images seed 가 057 에서 카테고리당 1장 보장)
