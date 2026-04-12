-- =============================================
-- 018: credit_usage feature에 'ai_dupe' 추가
-- AI 듀프 매칭 기능 (외국 음식 → 비슷한 한국 음식 검색)
-- =============================================

ALTER TABLE credit_usage DROP CONSTRAINT IF EXISTS credit_usage_feature_check;
ALTER TABLE credit_usage ADD CONSTRAINT credit_usage_feature_check
  CHECK (feature IN ('weather', 'distance', 'ai_curation', 'pdf', 'schedule_change', 'companion_share', 'ai_dupe'));
