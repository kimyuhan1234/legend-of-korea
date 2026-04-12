-- 019: credit_usage feature에 'taste_match' 추가
ALTER TABLE credit_usage DROP CONSTRAINT IF EXISTS credit_usage_feature_check;
ALTER TABLE credit_usage ADD CONSTRAINT credit_usage_feature_check
  CHECK (feature IN ('weather', 'distance', 'ai_curation', 'pdf', 'schedule_change', 'companion_share', 'ai_dupe', 'taste_match'));
