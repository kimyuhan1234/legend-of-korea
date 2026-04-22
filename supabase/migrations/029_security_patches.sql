-- ============================================================
--  029_security_patches.sql
--  2026-04-22 Supabase RLS 전수 감사 결과에 따른 보안 패치
--  상세 보고서: supabase/SECURITY_AUDIT.md
-- ============================================================

-- ============================================================
-- [🔴 Critical] Phase 1 — blacklist SELECT 정책 축소
--
-- 문제: 기존 정책 "blacklist_select"가 USING (true)로 설정되어 있어
--       로그인한 누구나 모든 차단 사용자의 user_id / reason(사유) /
--       total_reports(신고 수) / blocked_until(차단 기간)을 열람 가능.
--       → 개인정보 노출, 명예훼손 우려, GDPR·개인정보보호법 저촉 위험
--
-- 해결: 본인 자신의 차단 상태만 조회 가능하도록 축소.
--       관리자 조회는 API 라우트에서 service_role로 우회 수행.
-- ============================================================

DROP POLICY IF EXISTS "blacklist_select" ON public.blacklist;

CREATE POLICY "blacklist_select_own" ON public.blacklist
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- [🟡 Medium] Phase 2 — participant_reviews 본인 UPDATE/DELETE 허용
--
-- 문제: 기존에 INSERT + SELECT 정책만 존재. 본인이 실수로 남긴 리뷰도
--       수정/삭제 불가 → UX 제약
--
-- 해결: reviewer_id = auth.uid() 일 때 UPDATE/DELETE 허용.
--       다른 사람은 불가 (RLS 기본 deny).
-- ============================================================

DROP POLICY IF EXISTS "reviews_update_own" ON public.participant_reviews;
CREATE POLICY "reviews_update_own" ON public.participant_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON public.participant_reviews;
CREATE POLICY "reviews_delete_own" ON public.participant_reviews
  FOR DELETE USING (auth.uid() = reviewer_id);

-- ============================================================
-- [🟡 Medium] Phase 3 — community_likes/comments 001 중복 정책 정리
--
-- 문제: 001_initial_schema.sql 에서 만든 정책("likes_select_all",
--       "comments_select_all" 등)이 011_community_interactions.sql
--       에서 덮어쓰기 없이 동일 테이블에 새 정책을 추가 → 같은 권한의
--       정책이 2벌 공존 (PostgreSQL은 OR 결합하므로 기능 영향은 없으나
--       관리 복잡도 증가 및 변경 추적 어려움)
--
-- 해결: 011이 의도했던 대로 001 구버전 정책 제거.
--       (011의 새 정책만 남김 — 이름: community_likes_*, community_comments_*)
-- ============================================================

DROP POLICY IF EXISTS "likes_select_all"    ON public.community_likes;
DROP POLICY IF EXISTS "likes_insert_own"    ON public.community_likes;
DROP POLICY IF EXISTS "likes_delete_own"    ON public.community_likes;

DROP POLICY IF EXISTS "comments_select_all" ON public.community_comments;
DROP POLICY IF EXISTS "comments_insert_own" ON public.community_comments;
DROP POLICY IF EXISTS "comments_delete_own" ON public.community_comments;

-- ============================================================
-- [🟡 Medium] Phase 4 — quest_party_members SELECT 범위 (선택 적용)
--
-- 현재: "party_members_select" 이 USING (true) → 누구나 모든 파티의
--        멤버 user_id 리스트 열람 가능.
--
-- 기획 의도 확인 필요:
--   (a) 파티 모집이 완전 공개 — 현재 정책 유지
--   (b) 같은 파티 멤버끼리만 조회 — 아래 정책으로 교체
--
-- 옵션 (b)를 원할 때만 아래 주석 해제 후 적용:
-- ------------------------------------------------------------
-- DROP POLICY IF EXISTS "party_members_select" ON public.quest_party_members;
-- CREATE POLICY "party_members_select_same_party" ON public.quest_party_members
--   FOR SELECT USING (
--     party_id IN (
--       SELECT party_id FROM public.quest_party_members
--       WHERE user_id = auth.uid()
--     )
--   );
-- ------------------------------------------------------------

-- ============================================================
-- 마이그레이션 적용 후 확인 권장
--
--   -- 1) blacklist 본인만 조회되는지 (anon 키로 실행)
--   SELECT * FROM public.blacklist;
--   -- → 로그인 사용자 본인 기록만 보이거나 0 rows
--
--   -- 2) 정책 중복 제거 확인
--   SELECT schemaname, tablename, policyname
--   FROM pg_policies
--   WHERE tablename IN ('community_likes', 'community_comments')
--   ORDER BY tablename, policyname;
--   -- → "community_likes_*", "community_comments_*" 만 남아야 함
-- ============================================================
