-- lp_transactions 테이블에 적용 상태 컬럼 추가
ALTER TABLE lp_transactions
ADD COLUMN IF NOT EXISTS applied BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_lp_transactions_applied
ON lp_transactions (user_id, applied);
