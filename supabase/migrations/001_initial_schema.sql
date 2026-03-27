-- ============================================================
-- Legend of Korea — Initial Schema
-- 001_initial_schema.sql
-- ============================================================

-- ──────────────────────────────────────────
-- 1. users
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  nickname        TEXT        NOT NULL CHECK (char_length(nickname) <= 20),
  language        TEXT        NOT NULL DEFAULT 'ko' CHECK (language IN ('ko', 'ja', 'en')),
  social_provider TEXT,
  avatar_url      TEXT,
  total_lp        INTEGER     NOT NULL DEFAULT 0,
  current_tier    INTEGER     NOT NULL DEFAULT 1 CHECK (current_tier BETWEEN 1 AND 6),
  role            TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 2. courses
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  legend_type    TEXT        NOT NULL,
  region         TEXT        NOT NULL,
  difficulty     TEXT        NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_text  JSONB       NOT NULL DEFAULT '{}',
  title          JSONB       NOT NULL DEFAULT '{}',
  description    JSONB       NOT NULL DEFAULT '{}',
  thumbnail_url  TEXT,
  video_url      TEXT,
  price_1p       INTEGER     NOT NULL DEFAULT 29000,
  price_2p       INTEGER     NOT NULL DEFAULT 39000,
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  season         TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 3. kit_products
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kit_products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  option_type TEXT        NOT NULL CHECK (option_type IN ('solo', 'couple')),
  price       INTEGER     NOT NULL,
  stock       INTEGER     NOT NULL DEFAULT 100,
  is_active   BOOLEAN     NOT NULL DEFAULT true
);

-- ──────────────────────────────────────────
-- 4. orders
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  kit_id                UUID        REFERENCES public.kit_products(id) ON DELETE SET NULL,
  quantity              INTEGER     NOT NULL DEFAULT 1,
  total_price           INTEGER     NOT NULL,
  payment_method        TEXT        CHECK (payment_method IN ('toss', 'stripe')),
  payment_status        TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_name         TEXT        NOT NULL,
  shipping_phone        TEXT        NOT NULL,
  shipping_address      TEXT        NOT NULL,
  shipping_address_detail TEXT,
  shipping_zipcode      TEXT,
  shipping_status       TEXT        NOT NULL DEFAULT 'preparing'
                                    CHECK (shipping_status IN ('preparing', 'shipped', 'delivered')),
  tracking_number       TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 5. missions
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.missions (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id            UUID        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  sequence             INTEGER     NOT NULL,
  type                 TEXT        NOT NULL CHECK (type IN ('quiz', 'photo', 'open', 'boss', 'hidden')),
  title                JSONB       NOT NULL DEFAULT '{}',
  description          JSONB       NOT NULL DEFAULT '{}',
  hint_1               JSONB,
  hint_2               JSONB,
  hint_3               JSONB,
  correct_answer       TEXT,
  lp_reward            INTEGER     NOT NULL DEFAULT 100,
  is_hidden            BOOLEAN     NOT NULL DEFAULT false,
  location_name        JSONB,
  location_description JSONB,
  latitude             DECIMAL(10,8),
  longitude            DECIMAL(11,8),
  qr_code              TEXT        UNIQUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, sequence)
);

-- ──────────────────────────────────────────
-- 6. mission_progress
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mission_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mission_id   UUID        NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'locked'
                           CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
  answer_text  TEXT,
  photo_url    TEXT,
  lp_earned    INTEGER     NOT NULL DEFAULT 0,
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, mission_id)
);

-- ──────────────────────────────────────────
-- 7. lp_transactions
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lp_transactions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount       INTEGER     NOT NULL,
  type         TEXT        NOT NULL
               CHECK (type IN ('mission', 'photo_upload', 'review', 'referral', 'coupon_exchange', 'admin')),
  reference_id UUID,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 8. tiers
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tiers (
  level         INTEGER PRIMARY KEY CHECK (level BETWEEN 1 AND 6),
  name          JSONB   NOT NULL DEFAULT '{}',
  min_lp        INTEGER NOT NULL DEFAULT 0,
  discount_rate INTEGER NOT NULL DEFAULT 0,
  badge_url     TEXT
);

-- ──────────────────────────────────────────
-- 9. community_posts
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_posts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   UUID        REFERENCES public.courses(id) ON DELETE SET NULL,
  mission_id  UUID        REFERENCES public.missions(id) ON DELETE SET NULL,
  photos      JSONB       NOT NULL DEFAULT '[]',
  text        TEXT        CHECK (char_length(text) <= 500),
  likes_count INTEGER     NOT NULL DEFAULT 0,
  is_spoiler  BOOLEAN     NOT NULL DEFAULT false,
  is_hidden   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 10. community_likes
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_likes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- ──────────────────────────────────────────
-- 11. community_comments
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text       TEXT        NOT NULL CHECK (char_length(text) <= 300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 12. coupons
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code          TEXT        NOT NULL UNIQUE,
  discount_rate INTEGER     NOT NULL,
  lp_cost       INTEGER     NOT NULL,
  is_used       BOOLEAN     NOT NULL DEFAULT false,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────
-- 13. affiliate_links
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id      UUID    REFERENCES public.courses(id) ON DELETE SET NULL,
  platform       TEXT    NOT NULL,
  category       TEXT    NOT NULL CHECK (category IN ('accommodation', 'transport', 'activity')),
  title          JSONB   NOT NULL DEFAULT '{}',
  target_url     TEXT    NOT NULL,
  display_order  INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true
);

-- ──────────────────────────────────────────
-- 14. affiliate_clicks
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id    UUID        NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  user_id    UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted  BOOLEAN     NOT NULL DEFAULT false
);

-- ──────────────────────────────────────────
-- 15. b2b_orders
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.b2b_orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name     TEXT        NOT NULL,
  agency_contact  TEXT,
  course_id       UUID        REFERENCES public.courses(id) ON DELETE SET NULL,
  kit_quantity    INTEGER     NOT NULL,
  unit_price      INTEGER     NOT NULL,
  total_price     INTEGER     NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

CREATE INDEX IF NOT EXISTS idx_mission_progress_user_id    ON public.mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_mission_id ON public.mission_progress(mission_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_course      ON public.community_posts(course_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lp_transactions_user        ON public.lp_transactions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_missions_course_seq         ON public.missions(course_id, sequence);

-- ============================================================
-- updated_at 자동 갱신 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- auth.users → public.users 자동 연동 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname, language, social_provider, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'language', 'ko'),
    NEW.raw_app_meta_data->>'provider',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- likes_count 동기화 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_community_likes_count
  AFTER INSERT OR DELETE ON public.community_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_count();

-- ============================================================
-- RLS 활성화
-- ============================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lp_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_orders        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS 정책
-- ============================================================

-- users: 본인만 읽기/수정, admin은 전체
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- courses: 누구나 읽기, admin만 쓰기
CREATE POLICY "courses_select_all" ON public.courses
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
CREATE POLICY "courses_admin_all" ON public.courses
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- kit_products: 누구나 읽기
CREATE POLICY "kit_products_select_all" ON public.kit_products
  FOR SELECT USING (is_active = true);
CREATE POLICY "kit_products_admin_all" ON public.kit_products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- orders: 본인만 읽기, admin은 전체
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- missions: 누구나 읽기
CREATE POLICY "missions_select_all" ON public.missions
  FOR SELECT USING (true);
CREATE POLICY "missions_admin_all" ON public.missions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- mission_progress: 본인만 읽기/쓰기
CREATE POLICY "progress_select_own" ON public.mission_progress
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "progress_insert_own" ON public.mission_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "progress_update_own" ON public.mission_progress
  FOR UPDATE USING (user_id = auth.uid());

-- lp_transactions: 본인만 읽기
CREATE POLICY "lp_tx_select_own" ON public.lp_transactions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "lp_tx_insert_service" ON public.lp_transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- tiers: 누구나 읽기
CREATE POLICY "tiers_select_all" ON public.tiers
  FOR SELECT USING (true);

-- community_posts: 누구나 읽기, 본인만 쓰기/삭제
CREATE POLICY "posts_select_all" ON public.community_posts
  FOR SELECT USING (is_hidden = false OR user_id = auth.uid());
CREATE POLICY "posts_insert_own" ON public.community_posts
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "posts_update_own" ON public.community_posts
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "posts_delete_own" ON public.community_posts
  FOR DELETE USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- community_likes: 누구나 읽기, 본인만 쓰기/삭제
CREATE POLICY "likes_select_all" ON public.community_likes
  FOR SELECT USING (true);
CREATE POLICY "likes_insert_own" ON public.community_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "likes_delete_own" ON public.community_likes
  FOR DELETE USING (user_id = auth.uid());

-- community_comments: 누구나 읽기, 본인만 쓰기/삭제
CREATE POLICY "comments_select_all" ON public.community_comments
  FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.community_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comments_delete_own" ON public.community_comments
  FOR DELETE USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- coupons: 본인만 읽기
CREATE POLICY "coupons_select_own" ON public.coupons
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "coupons_insert_own" ON public.coupons
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "coupons_update_own" ON public.coupons
  FOR UPDATE USING (user_id = auth.uid());

-- affiliate_links: 누구나 읽기
CREATE POLICY "affiliate_links_select_all" ON public.affiliate_links
  FOR SELECT USING (is_active = true);
CREATE POLICY "affiliate_links_admin_all" ON public.affiliate_links
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- affiliate_clicks: 본인만 쓰기
CREATE POLICY "affiliate_clicks_insert" ON public.affiliate_clicks
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "affiliate_clicks_admin_select" ON public.affiliate_clicks
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- b2b_orders: admin만
CREATE POLICY "b2b_orders_admin_all" ON public.b2b_orders
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- ============================================================
-- 초기 데이터: tiers
-- ============================================================
INSERT INTO public.tiers (level, name, min_lp, discount_rate) VALUES
  (1, '{"ko":"마을 주민","ja":"村の住民","en":"Villager"}',         0,     0),
  (2, '{"ko":"나그네","ja":"旅人","en":"Traveler"}',               1000,  5),
  (3, '{"ko":"풍류객","ja":"風流人","en":"Wanderer"}',             3000,  8),
  (4, '{"ko":"산신령","ja":"山神霊","en":"Mountain Spirit"}',      7000,  10),
  (5, '{"ko":"도깨비왕","ja":"トッケビ王","en":"Dokkaebi King"}',  15000, 12),
  (6, '{"ko":"전설의 영웅","ja":"伝説の英雄","en":"Legendary Hero"}', 30000, 15)
ON CONFLICT (level) DO NOTHING;

-- ============================================================
-- 샘플 데이터: 전주 도깨비 코스 (개발·테스트용)
-- ============================================================
INSERT INTO public.courses (
  id, legend_type, region, difficulty,
  duration_text, title, description,
  price_1p, price_2p, is_active, season
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'dokkaebi',
  'jeonju',
  'easy',
  '{"ko":"4~5시간","ja":"4〜5時間","en":"4-5 hours"}',
  '{"ko":"전주 도깨비 코스","ja":"全州トッケビコース","en":"Jeonju Dokkaebi Course"}',
  '{"ko":"전주 한옥마을을 배경으로 펼쳐지는 도깨비 전설 탐험. 도깨비 방망이의 비밀을 찾아라!","ja":"全州韓屋村を舞台に広がるトッケビ伝説の探検。トッケビの棒の秘密を探せ！","en":"Explore the Dokkaebi legend set in Jeonju Hanok Village. Find the secret of the Dokkaebi club!"}',
  29000,
  39000,
  true,
  '2024-spring'
) ON CONFLICT (id) DO NOTHING;

-- 도깨비 코스 키트 상품
INSERT INTO public.kit_products (course_id, option_type, price, stock) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'solo',   29000, 50),
  ('a1b2c3d4-0000-0000-0000-000000000001', 'couple', 39000, 50)
ON CONFLICT DO NOTHING;

-- 도깨비 코스 미션 (6개)
INSERT INTO public.missions (
  course_id, sequence, type,
  title, description,
  hint_1, hint_2, hint_3,
  lp_reward, is_hidden, qr_code,
  location_name, location_description,
  latitude, longitude
) VALUES
-- 미션 1: 도깨비 방망이 발견
(
  'a1b2c3d4-0000-0000-0000-000000000001', 1, 'open',
  '{"ko":"도깨비 방망이를 찾아라","ja":"トッケビの棒を探せ","en":"Find the Dokkaebi Club"}',
  '{"ko":"한옥마을 입구에 숨겨진 도깨비 방망이 문양을 찾아 사진을 찍어주세요.","ja":"韓屋村の入口に隠されたトッケビの棒の紋様を見つけて写真を撮ってください。","en":"Find the hidden Dokkaebi club pattern at the entrance of Hanok Village and take a photo."}',
  '{"ko":"대문 근처를 살펴보세요.","ja":"門の近くを見てください。","en":"Look near the main gate."}',
  '{"ko":"기와지붕 아래 돌기둥을 확인하세요.","ja":"瓦屋根の下の石柱を確認してください。","en":"Check the stone pillar under the tiled roof."}',
  '{"ko":"입구 왼쪽 돌기둥에 새겨져 있습니다.","ja":"入口左側の石柱に刻まれています。","en":"It is carved on the left stone pillar at the entrance."}',
  100, false, 'DOK001',
  '{"ko":"전주 한옥마을 입구","ja":"全州韓屋村入口","en":"Jeonju Hanok Village Entrance"}',
  '{"ko":"경기전 방향 정문","ja":"慶基殿方向の正門","en":"Main gate towards Gyeonggijeon"}',
  35.81447, 127.15291
),
-- 미션 2: 도깨비 장터
(
  'a1b2c3d4-0000-0000-0000-000000000001', 2, 'quiz',
  '{"ko":"도깨비 장터의 비밀","ja":"トッケビ市場の秘密","en":"Secret of the Dokkaebi Market"}',
  '{"ko":"전통 장터에서 도깨비가 가장 좋아한다는 물건은 무엇일까요?","ja":"伝統市場でトッケビが最も好きなものは何でしょう？","en":"What is the thing that Dokkaebi loves most in the traditional market?"}',
  '{"ko":"전래동화 속 도깨비를 떠올려보세요.","ja":"昔話のトッケビを思い出してください。","en":"Think about the Dokkaebi from folklore."}',
  '{"ko":"방망이로 두드리면 나오는 것...","ja":"棒で叩くと出てくるもの…","en":"Something that comes out when you hit it with a club..."}',
  '{"ko":"정답은 도깨비방망이로 원하는 것을 만드는 이야기에서 찾을 수 있어요.","ja":"答えはトッケビの棒で欲しいものを作る話の中に見つかります。","en":"The answer can be found in stories about creating things with the Dokkaebi club."}',
  100, false, 'DOK002',
  '{"ko":"남부시장","ja":"南部市場","en":"Nambu Market"}',
  '{"ko":"전주 전통 재래시장","ja":"全州伝統在来市場","en":"Jeonju Traditional Market"}',
  35.81920, 127.14810
),
-- 미션 3: 경기전 탐험
(
  'a1b2c3d4-0000-0000-0000-000000000001', 3, 'photo',
  '{"ko":"경기전의 수호신","ja":"慶基殿の守護神","en":"Guardian of Gyeonggijeon"}',
  '{"ko":"경기전 내부에서 도깨비를 닮은 조형물이나 문양을 찾아 함께 사진을 찍어주세요.","ja":"慶基殿の内部でトッケビに似た造形物や紋様を見つけて一緒に写真を撮ってください。","en":"Find a sculpture or pattern resembling a Dokkaebi inside Gyeonggijeon and take a photo together."}',
  '{"ko":"담장을 따라 걸어보세요.","ja":"塀に沿って歩いてみてください。","en":"Walk along the wall."}',
  '{"ko":"정전 입구 쪽 기둥을 살펴보세요.","ja":"正殿入口側の柱を見てください。","en":"Look at the pillars near the main hall entrance."}',
  '{"ko":"기둥의 장식 문양 중 괴수 모양을 찾으세요.","ja":"柱の装飾紋様の中から怪物の形を探してください。","en":"Find the monster-shaped pattern among the decorative patterns on the pillars."}',
  150, false, 'DOK003',
  '{"ko":"경기전","ja":"慶基殿","en":"Gyeonggijeon Shrine"}',
  '{"ko":"조선 태조 이성계의 어진을 모신 곳","ja":"朝鮮太祖李成桂の肖像画を祀る場所","en":"Shrine housing the portrait of Joseon founder Yi Seonggye"}',
  35.81496, 127.15356
),
-- 미션 4: 오목대 (보스 미션)
(
  'a1b2c3d4-0000-0000-0000-000000000001', 4, 'boss',
  '{"ko":"[보스] 오목대 도깨비왕과의 대결","ja":"【ボス】梧木台トッケビ王との対決","en":"[BOSS] Showdown with the Dokkaebi King at Omokdae"}',
  '{"ko":"오목대에 오르면 도깨비왕이 나타납니다. 전주 한옥마을이 한눈에 내려다보이는 이곳에서 도깨비왕의 퀴즈 3개를 모두 맞춰야 합니다.\n\n퀴즈: 전주 한옥마을에는 몇 채의 한옥이 있을까요?\nA) 300채 B) 700채 C) 1,000채 D) 2,000채","ja":"梧木台に登るとトッケビ王が現れます。全州韓屋村を一望できるこの場所でトッケビ王の3つのクイズすべてに正解しなければなりません。\n\nクイズ：全州韓屋村には何棟の韓屋があるでしょう？\nA) 300棟 B) 700棟 C) 1,000棟 D) 2,000棟","en":"Climb Omokdae and the Dokkaebi King appears. You must answer all 3 of the Dokkaebi King''s quizzes at this place overlooking Jeonju Hanok Village.\n\nQuiz: How many hanok houses are there in Jeonju Hanok Village?\nA) 300 B) 700 C) 1,000 D) 2,000"}',
  '{"ko":"전주시 공식 관광 안내를 참고하세요.","ja":"全州市公式観光案内を参考にしてください。","en":"Refer to Jeonju City official tourism information."}',
  '{"ko":"한옥마을 보존 정책과 관련이 있습니다.","ja":"韓屋村保存政策と関連があります。","en":"It is related to the Hanok Village preservation policy."}',
  '{"ko":"정답은 700채 이상입니다.","ja":"正解は700棟以上です。","en":"The answer is more than 700."}',
  300, false, 'DOK004',
  '{"ko":"오목대","ja":"梧木台","en":"Omokdae"}',
  '{"ko":"한옥마을이 내려다보이는 언덕","ja":"韓屋村を見下ろす丘","en":"Hill overlooking Hanok Village"}',
  35.81780, 127.15450
),
-- 미션 5: 전동성당 (히든)
(
  'a1b2c3d4-0000-0000-0000-000000000001', 5, 'hidden',
  '{"ko":"[히든] 동서양이 만나는 비밀","ja":"【隠し】東西が出会う秘密","en":"[HIDDEN] Secret Where East Meets West"}',
  '{"ko":"한국에서 가장 아름다운 성당 중 하나인 전동성당. 도깨비 전설과 서양 건축이 만나는 이 장소에서 숨겨진 문양을 찾아보세요.","ja":"韓国で最も美しい聖堂の一つ、全州殿洞聖堂。トッケビ伝説と西洋建築が出会うこの場所で隠された紋様を探してください。","en":"Jeondong Cathedral, one of the most beautiful cathedrals in Korea. Find the hidden pattern where Dokkaebi legend meets Western architecture."}',
  '{"ko":"정문이 아닌 측면을 살펴보세요.","ja":"正門ではなく側面を見てください。","en":"Look at the side, not the main gate."}',
  '{"ko":"벽돌과 벽돌 사이 틈새를 확인하세요.","ja":"レンガとレンガの隙間を確認してください。","en":"Check the gaps between bricks."}',
  '{"ko":"북쪽 측면 벽 하단부에 있습니다.","ja":"北側側面壁の下部にあります。","en":"It is at the bottom of the north side wall."}',
  500, true, 'DOK005',
  '{"ko":"전동성당","ja":"殿洞聖堂","en":"Jeondong Cathedral"}',
  '{"ko":"1914년 완공된 호남 최초의 서양식 건축물","ja":"1914年完成した湖南初の西洋式建築物","en":"The first Western-style building in Honam, completed in 1914"}',
  35.81562, 127.15133
),
-- 미션 6: 코스 완주 (포토존)
(
  'a1b2c3d4-0000-0000-0000-000000000001', 6, 'photo',
  '{"ko":"전설의 주인공 인증샷","ja":"伝説の主人公認証ショット","en":"Legendary Hero Certification Shot"}',
  '{"ko":"도깨비 전설 코스를 완주했습니다! 한복 포토존에서 인증샷을 찍고 커뮤니티에 공유해주세요.","ja":"トッケビ伝説コースを完走しました！韓服フォトゾーンで認証ショットを撮ってコミュニティでシェアしてください。","en":"You have completed the Dokkaebi Legend Course! Take a certification shot at the hanbok photo zone and share it with the community."}',
  '{"ko":"한복 대여점이 근처에 있습니다.","ja":"韓服レンタルショップが近くにあります。","en":"Hanbok rental shops are nearby."}',
  '{"ko":"경기전 앞 포토존을 이용하세요.","ja":"慶基殿前のフォトゾーンをご利用ください。","en":"Use the photo zone in front of Gyeonggijeon."}',
  '{"ko":"경기전 정문 앞 전통 문양 바닥이 포토존입니다.","ja":"慶基殿正門前の伝統紋様の床がフォトゾーンです。","en":"The traditional pattern floor in front of Gyeonggijeon main gate is the photo zone."}',
  200, false, 'DOK006',
  '{"ko":"경기전 포토존","ja":"慶基殿フォトゾーン","en":"Gyeonggijeon Photo Zone"}',
  '{"ko":"코스 완주 기념 포토존","ja":"コース完走記念フォトゾーン","en":"Course completion commemorative photo zone"}',
  35.81496, 127.15356
)
ON CONFLICT (qr_code) DO NOTHING;

-- 제휴 링크 (전주 도깨비 코스)
INSERT INTO public.affiliate_links (course_id, platform, category, title, target_url, display_order) VALUES
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'airbnb', 'accommodation',
    '{"ko":"전주 한옥마을 숙소","ja":"全州韓屋村の宿","en":"Jeonju Hanok Village Stay"}',
    'https://www.airbnb.co.kr/s/전주시/homes',
    1
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'ktx', 'transport',
    '{"ko":"서울↔전주 KTX","ja":"ソウル↔全州KTX","en":"Seoul↔Jeonju KTX"}',
    'https://www.letskorail.com',
    2
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'klook', 'activity',
    '{"ko":"전주 한복 체험","ja":"全州韓服体験","en":"Jeonju Hanbok Experience"}',
    'https://www.klook.com/ko/city/23-jeonju-activities/',
    3
  )
ON CONFLICT DO NOTHING;
