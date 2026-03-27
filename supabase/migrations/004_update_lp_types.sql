-- ============================================================
-- Legend of Korea — Migration 004
-- lp_transactions 테이블의 type 체크 제약 조건 업데이트
-- ============================================================

-- 기존 제약 조건 삭제 (이름을 모를 경우를 대비해 드롭 후 재생성)
ALTER TABLE public.lp_transactions DROP CONSTRAINT IF EXISTS lp_transactions_type_check;

-- 새 제약 조건 추가
ALTER TABLE public.lp_transactions
  ADD CONSTRAINT lp_transactions_type_check 
  CHECK (type IN (
    'MISSION_QUIZ', 
    'MISSION_PHOTO', 
    'MISSION_OPEN', 
    'MISSION_BOSS', 
    'MISSION_HIDDEN', 
    'COURSE_COMPLETE', 
    'COMMUNITY_PHOTO', 
    'COMMUNITY_REVIEW', 
    'REFERRAL', 
    'HINT_2_COST', 
    'HINT_3_COST',
    'COUPON_EXCHANGE',
    'ADMIN'
  ));
