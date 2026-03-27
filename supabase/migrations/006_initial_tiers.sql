-- ============================================================
-- Legend of Korea — Migration 006
-- 초기 티어 데이터 삽입
-- ============================================================

INSERT INTO public.tiers (level, name, min_lp, discount_rate) VALUES
  (1, '{"ko":"마을 주민", "ja":"村人", "en":"Villager"}', 0, 0),
  (2, '{"ko":"나그네", "ja":"旅人", "en":"Traveler"}', 1000, 5),
  (3, '{"ko":"풍류객", "ja":"風流客", "en":"Wanderer"}', 3000, 10),
  (4, '{"ko":"산신령", "ja":"山の神", "en":"Mountain Spirit"}', 6000, 15),
  (5, '{"ko":"도깨비왕", "ja":"鬼王", "en":"Dokkaebi King"}', 10000, 20),
  (6, '{"ko":"전설의 영웅", "ja":"伝説の英雄", "en":"Legendary Hero"}', 20000, 30)
ON CONFLICT (level) DO UPDATE SET
  name = EXCLUDED.name,
  min_lp = EXCLUDED.min_lp,
  discount_rate = EXCLUDED.discount_rate;
