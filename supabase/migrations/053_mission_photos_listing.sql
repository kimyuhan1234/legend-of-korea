-- ============================================================
--  053_mission_photos_listing.sql
--  Supabase Security Advisor: Public Bucket Allows Listing
--  2026-05-01
-- ============================================================
--  대상: storage.mission-photos
--  현재 정책: SELECT USING (bucket_id = 'mission-photos') — LIST + READ 모두 허용
--  목적:
--    - URL 직접 접근 (READ): 본인 폴더만 + 미션 검증 후 공개 (커뮤니티 기록관)
--    - LIST (folder enumeration): 본인 폴더만
--  코드 영향: .list() 호출 0 ✓ (검증 완료) — listing 차단 안전
--  upload / getPublicUrl / remove 는 모두 supabaseAdmin (service_role) 사용 중
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────
-- 1. 기존 너무 광범위한 정책 정리
--    (정확한 정책 이름은 DB 적용 시 SELECT * FROM pg_policies WHERE tablename = 'objects' 로 확인)
-- ────────────────────────────────────────────────

-- 광범위 SELECT 정책 후보들 일괄 삭제 (있으면 drop, 없으면 skip)
DO $$
BEGIN
  -- 일반 패턴 — 'Allow public read' / 'mission-photos public' / 'Allow listing' 등
  EXECUTE 'DROP POLICY IF EXISTS "Allow public read" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Public read mission photos" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Public can list mission photos" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "Mission photos public" ON storage.objects';
  EXECUTE 'DROP POLICY IF EXISTS "mission_photos_select_all" ON storage.objects';
END $$;

-- ────────────────────────────────────────────────
-- 2. URL 직접 접근 (READ) — 본인 폴더 + service_role 만
--    Public READ 가 필요한 케이스는 Vercel/Next 가 server side 에서 service_role 로 fetch 후 streaming.
--    또는 별도 public 브릿지 endpoint (이미 app/api/memories/photo/route.ts).
-- ────────────────────────────────────────────────

CREATE POLICY "mission_photos_owner_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'mission-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ────────────────────────────────────────────────
-- 3. INSERT (upload) — 본인 폴더만
-- ────────────────────────────────────────────────

CREATE POLICY "mission_photos_owner_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'mission-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ────────────────────────────────────────────────
-- 4. DELETE — 본인 폴더만
-- ────────────────────────────────────────────────

CREATE POLICY "mission_photos_owner_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'mission-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ────────────────────────────────────────────────
-- 주의:
--   service_role (API route 의 createServiceClient) 은 RLS bypass — 모든 정책 우회
--   따라서 server-side 에서 다른 사용자 사진 읽기 / public URL 생성 / remove 모두 가능
-- ────────────────────────────────────────────────

COMMIT;
