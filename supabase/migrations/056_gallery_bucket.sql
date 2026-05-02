-- Gallery Storage bucket (private, PASS 구독자 전용)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- PASS 구독자 읽기 (passes 테이블 기준: status='active' AND expires_at > now())
CREATE POLICY "gallery: pass subscribers can read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'gallery'
  AND EXISTS (
    SELECT 1 FROM public.passes
    WHERE user_id = auth.uid()
      AND status = 'active'
      AND expires_at > now()
  )
);

-- service_role 전체 접근 (운영자 업로드 / 삭제)
CREATE POLICY "gallery: service_role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');
