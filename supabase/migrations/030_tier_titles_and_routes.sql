-- ============================================================
--  030_tier_titles_and_routes.sql
--  조선 직업 랭크 시스템 — 공통 3 / 문관 7 / 무관 7
--
--  기존 tiers(1~6) 테이블은 유지 (쿠폰/할인율 등 운영용).
--  이 마이그레이션은 UI 표시용 "직책 이름" + 분기(scholar/warrior) 추가.
-- ============================================================

-- 1) users 테이블에 tech_tree_route 컬럼 추가
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS tech_tree_route VARCHAR(20) DEFAULT NULL;

COMMENT ON COLUMN public.users.tech_tree_route IS
  'NULL = 미선택 (Lv 3 이하 또는 미분기), scholar = 문관, warrior = 무관';

-- 허용값 체크 제약 (NULL + 두 개 루트)
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_tech_tree_route_check;

ALTER TABLE public.users
ADD CONSTRAINT users_tech_tree_route_check
CHECK (tech_tree_route IS NULL OR tech_tree_route IN ('scholar', 'warrior'));

-- 2) tier_titles 테이블
CREATE TABLE IF NOT EXISTS public.tier_titles (
  id         SERIAL PRIMARY KEY,
  level      INT NOT NULL,
  route      VARCHAR(20) NOT NULL,        -- 'common' | 'scholar' | 'warrior'
  name_ko    VARCHAR(50) NOT NULL,
  name_en    VARCHAR(50) NOT NULL,
  name_ja    VARCHAR(50) NOT NULL,
  name_zh_cn VARCHAR(50) NOT NULL,
  name_zh_tw VARCHAR(50) NOT NULL,
  emoji      VARCHAR(10) NOT NULL,
  is_special BOOLEAN DEFAULT FALSE,       -- 특수직 (암행어사/왕실근위대)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (level, route)
);

-- RLS: 누구나 읽기 가능 (공개 참조 데이터)
ALTER TABLE public.tier_titles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tier_titles_read_all" ON public.tier_titles;
CREATE POLICY "tier_titles_read_all"
  ON public.tier_titles FOR SELECT
  USING (true);

-- 3) 초기 17개 데이터 INSERT (idempotent via ON CONFLICT)
INSERT INTO public.tier_titles (level, route, name_ko, name_en, name_ja, name_zh_cn, name_zh_tw, emoji, is_special) VALUES
  -- 공통 3개
  (1, 'common',  '초급 농민',  'Beginner Farmer',      '初級農民',       '初级农民',   '初級農民',   '🌱', FALSE),
  (2, 'common',  '중급 농민',  'Intermediate Farmer',  '中級農民',       '中级农民',   '中級農民',   '🌾', FALSE),
  (3, 'common',  '고급 농민',  'Senior Farmer',        '上級農民',       '高级农民',   '高級農民',   '🧑‍🌾', FALSE),
  -- 문관 7개
  (4, 'scholar', '마을 유생',  'Village Student',      '村の書生',       '乡村书生',   '鄉村書生',   '📖', FALSE),
  (5, 'scholar', '선비',       'Scholar',              '士',             '士',         '士',         '🖌️', FALSE),
  (6, 'scholar', '초급 문관',  'Junior Official',      '下級官僚',       '初级官员',   '初級官員',   '📜', FALSE),
  (7, 'scholar', '중급 문관',  'Mid Official',         '中級官僚',       '中级官员',   '中級官員',   '🎓', FALSE),
  (8, 'scholar', '암행어사',   'Royal Inspector',      '暗行御史',       '暗行御史',   '暗行御史',   '🕵️', TRUE),
  (9, 'scholar', '고급 문관',  'Senior Official',      '上級官僚',       '高级官员',   '高級官員',   '🎩', FALSE),
  (10, 'scholar', '영의정',    'Prime Minister',       '領議政',         '领议政',     '領議政',     '👑', FALSE),
  -- 무관 7개
  (4, 'warrior', '마을 무도인','Village Martial Artist','村の武道家',    '乡村武道家', '鄉村武道家', '🥋', FALSE),
  (5, 'warrior', '병사',       'Soldier',              '兵士',           '士兵',       '士兵',       '🗡️', FALSE),
  (6, 'warrior', '초급 무관',  'Junior Officer',       '下級武官',       '初级武官',   '初級武官',   '🛡️', FALSE),
  (7, 'warrior', '중급 무관',  'Mid Officer',          '中級武官',       '中级武官',   '中級武官',   '🏹', FALSE),
  (8, 'warrior', '왕실 근위대','Royal Guard',          '王室近衛隊',     '王室近卫',   '王室近衛',   '🎖️', TRUE),
  (9, 'warrior', '고급 무관',  'Senior Officer',       '上級武官',       '高级武官',   '高級武官',   '⚜️', FALSE),
  (10, 'warrior','대장군',     'Great General',        '大将軍',         '大将军',     '大將軍',     '⚔️', FALSE)
ON CONFLICT (level, route) DO NOTHING;

-- 적용 후 확인 쿼리:
--   SELECT level, route, name_ko, emoji, is_special
--   FROM tier_titles
--   ORDER BY route, level;
--   → 17 rows. Lv 8의 is_special 만 TRUE.
