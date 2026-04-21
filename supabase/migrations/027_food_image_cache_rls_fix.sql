-- 027: food_image_cache RLS 정책 정리
-- createServiceClient가 @supabase/supabase-js 직접 사용으로 변경되어
-- service_role 키로 접속 시 RLS 자동 바이패스됨.
-- 기존 정책을 정리하고 읽기 전용 공개 정책만 유지.

DROP POLICY IF EXISTS "Public read food_image_cache" ON food_image_cache;
DROP POLICY IF EXISTS "Service role write food_image_cache" ON food_image_cache;
DROP POLICY IF EXISTS "Public read food images" ON food_image_cache;
DROP POLICY IF EXISTS "Service role manages food images" ON food_image_cache;
DROP POLICY IF EXISTS "food_image_cache_select_all" ON food_image_cache;
DROP POLICY IF EXISTS "food_image_cache_insert_service" ON food_image_cache;
DROP POLICY IF EXISTS "food_image_cache_update_service" ON food_image_cache;
DROP POLICY IF EXISTS "food_image_cache_delete_service" ON food_image_cache;

-- 읽기: 누구나 (프론트엔드 직접 조회용)
CREATE POLICY "food_image_cache_select_all" ON food_image_cache
  FOR SELECT USING (true);

-- 쓰기: service_role (auth.role() 기준)
CREATE POLICY "food_image_cache_insert_service" ON food_image_cache
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "food_image_cache_update_service" ON food_image_cache
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "food_image_cache_delete_service" ON food_image_cache
  FOR DELETE USING (auth.role() = 'service_role');
