-- Migration 036: 탈퇴 요청 기록 테이블 + lp_transactions 익명화 지원
-- PIPA 제21조·전자상거래법 제6조 준수:
--   거래 기록은 5년 익명 보관, 탈퇴 요청은 3년 보관.

-- 1. lp_transactions.user_id를 nullable로 변경 (탈퇴 시 익명화)
ALTER TABLE lp_transactions ALTER COLUMN user_id DROP NOT NULL;

-- Update type 수정: Update 정책을 별도로 추가하지 않아도 service_role에서 직접 UPDATE 가능

-- 2. withdrawal_requests 테이블 생성
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid NOT NULL,           -- 실제 탈퇴 전 ID (참조 불가 후에도 기록)
  email_hash    text NOT NULL,           -- SHA-256 해시값 (원문 복원 불가)
  requested_at  timestamptz DEFAULT now() NOT NULL,
  reason        text,                   -- 선택: 탈퇴 사유
  completed_at  timestamptz            -- NULL이면 처리 중
);

-- RLS 활성화
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- 관리자만 조회 가능 (본인 확인 목적)
CREATE POLICY "admin_select_withdrawal_requests"
  ON withdrawal_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT는 API 서버(service_role)에서만 처리하므로 별도 정책 불필요

-- 보존 기간 자동 만료를 위한 인덱스
CREATE INDEX IF NOT EXISTS withdrawal_requests_requested_at_idx
  ON withdrawal_requests (requested_at);
