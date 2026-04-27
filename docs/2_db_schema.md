# Legend of Korea — DB Schema (Supabase PostgreSQL)

> 최종 수정: 2026-04-15  
> DB: Supabase (PostgreSQL 15+), Auth: Supabase Auth (OAuth: 카카오, 구글, LINE)

---

## 1. 테이블 목록

| 테이블명 | 설명 |
|----------|------|
| `users` | 회원 프로필 (Supabase Auth 연동) |
| `courses` | 미션 코스 정보 |
| `kit_products` | 판매 키트 상품 |
| `orders` | 주문 내역 |
| `missions` | 개별 미션 항목 |
| `mission_progress` | 사용자별 미션 진행 상태 |
| `lp_transactions` | LP 포인트 적립/사용 내역 |
| `tiers` | 티어 등급 정의 |
| `community_posts` | 커뮤니티 기록관 게시글 |
| `community_comments` | 게시글 댓글 |
| `affiliate_links` | 제휴 링크 (숙소, 교통 등) |
| `affiliate_clicks` | 제휴 링크 클릭 로그 |
| `b2b_orders` | B2B 단체 주문 |
| `quest_parties` | Quest Party 매칭 — 파티 정보 (migration 020) |
| `quest_party_members` | Quest Party 멤버 목록 (migration 020) |
| `participant_reviews` | 참여자 상호 별점 평가 (migration 021) |
| `user_reports` | 참여자 신고 접수 (migration 021) |
| `blacklist` | 블랙리스트 — 저평점/신고 자동 차단 (migration 021) |
| `party_chat` | 파티 실시간 채팅 메시지 (migration 024) |

---

## 2. 테이블 상세 스키마

### 2.1 users

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE,
  nickname      TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user',  -- 'user' | 'admin'
  locale        TEXT NOT NULL DEFAULT 'ko',    -- 'ko' | 'ja' | 'en'
  total_lp      INTEGER NOT NULL DEFAULT 0,
  tier_id       INTEGER REFERENCES tiers(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

> `role = 'admin'`인 경우 관리자 기능 접근 가능  
> `total_lp`는 `lp_transactions` 합산값으로 동기화

---

### 2.2 courses

```sql
CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,           -- 표시용 제목 (ko 기준)
  description     TEXT,
  region          TEXT NOT NULL,           -- 'jeonju', 'busan', 등
  difficulty      TEXT,                    -- 'easy' | 'medium' | 'hard'
  duration_text   TEXT,                    -- '약 3시간'
  thumbnail_url   TEXT,
  price_1p        INTEGER NOT NULL DEFAULT 0,   -- 1인 가격 (원)
  price_2p        INTEGER NOT NULL DEFAULT 0,   -- 2인 가격 (원)
  is_active       BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

> **RLS 정책**: `USING (true)` — 모든 코스 공개 조회 허용  
> `is_active` 필터링은 **앱 코드에서 처리** (프론트에서 준비 중 배지 표시)

---

### 2.3 kit_products

```sql
CREATE TABLE kit_products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID REFERENCES courses(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  price           INTEGER NOT NULL,        -- 원 단위
  stock           INTEGER NOT NULL DEFAULT 0,
  image_url       TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.4 orders

```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  kit_product_id  UUID REFERENCES kit_products(id),
  quantity        INTEGER NOT NULL DEFAULT 1,
  total_price     INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',
  -- 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  payment_method  TEXT,                    -- 'toss' | 'stripe'
  payment_id      TEXT,                    -- PG사 트랜잭션 ID
  shipping_name   TEXT,
  shipping_phone  TEXT,
  shipping_address TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.5 missions

```sql
CREATE TABLE missions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID REFERENCES courses(id) ON DELETE CASCADE,
  order_index     INTEGER NOT NULL DEFAULT 0,  -- 코스 내 순서
  title           TEXT NOT NULL,
  description     TEXT,
  mission_type    TEXT NOT NULL DEFAULT 'quiz',
  -- 'quiz' | 'photo' | 'location' | 'stamp'
  answer          TEXT,                    -- quiz 정답 (암호화 권장)
  hint            TEXT,
  location_lat    NUMERIC(10, 7),
  location_lng    NUMERIC(10, 7),
  lp_reward       INTEGER NOT NULL DEFAULT 50,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.6 mission_progress

```sql
CREATE TABLE mission_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id      UUID REFERENCES missions(id) ON DELETE CASCADE,
  course_id       UUID REFERENCES courses(id),
  status          TEXT NOT NULL DEFAULT 'not_started',
  -- 'not_started' | 'in_progress' | 'completed'
  answer_given    TEXT,
  photo_url       TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);
```

---

### 2.7 lp_transactions

```sql
CREATE TABLE lp_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL,        -- 양수: 적립, 음수: 사용
  reason          TEXT NOT NULL,
  -- 'mission_complete' | 'community_post' | 'coupon_redeem' | 'admin_grant'
  reference_id    UUID,                    -- mission_id 또는 community_post_id
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.8 tiers

```sql
CREATE TABLE tiers (
  level           INTEGER PRIMARY KEY,
  name            JSONB NOT NULL,    -- {"ko":"...", "ja":"...", "en":"..."}
  min_lp          INTEGER NOT NULL,
  discount_rate   INTEGER NOT NULL DEFAULT 0,
  badge_url       TEXT
);

-- 6단계 티어 (014_tier_system_unify.sql)
INSERT INTO tiers (level, name, min_lp, discount_rate) VALUES
  (1, '{"ko":"마을 주민", "ja":"村の住民", "en":"Villager"}',      0,     0),
  (2, '{"ko":"여행자",   "ja":"旅行者",   "en":"Traveler"}',      500,   3),
  (3, '{"ko":"모험가",   "ja":"冒険家",   "en":"Adventurer"}',    2000,  5),
  (4, '{"ko":"영웅",     "ja":"英雄",     "en":"Hero"}',          5000,  8),
  (5, '{"ko":"전설",     "ja":"伝説",     "en":"Legend"}',        10000, 12),
  (6, '{"ko":"신화",     "ja":"神話",     "en":"Myth"}',          20000, 15);
```

---

### 2.9 community_posts

```sql
CREATE TABLE community_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  course_id       UUID REFERENCES courses(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  image_urls      TEXT[],                  -- Supabase Storage URL 배열
  likes_count     INTEGER NOT NULL DEFAULT 0,
  is_hidden       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.10 community_comments (API 라우트 확인됨)

```sql
CREATE TABLE community_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  content         TEXT NOT NULL,
  is_hidden       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

> API 라우트: `app/api/community/posts/[postId]/comments/route.ts`

---

### 2.11 affiliate_links

```sql
CREATE TABLE affiliate_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID REFERENCES courses(id) ON DELETE SET NULL,
  category        TEXT NOT NULL,  -- 'stay' | 'transport' | 'food' | 'etc'
  name            TEXT NOT NULL,
  url             TEXT NOT NULL,
  description     TEXT,
  commission_rate NUMERIC(5,2),   -- %
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.12 affiliate_clicks

```sql
CREATE TABLE affiliate_clicks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id         UUID REFERENCES affiliate_links(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.13 b2b_orders

```sql
CREATE TABLE b2b_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    TEXT NOT NULL,
  contact_name    TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  contact_phone   TEXT,
  course_id       UUID REFERENCES courses(id),
  quantity        INTEGER NOT NULL,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  -- 'pending' | 'reviewing' | 'confirmed' | 'rejected'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 3. RLS (Row Level Security) 정책

### 원칙
- 모든 테이블에 RLS 활성화
- 민감 데이터(orders, lp_transactions, mission_progress)는 본인만 접근
- 공개 데이터(courses, community_posts)는 전체 조회 허용

### 주요 정책

```sql
-- courses: 전체 공개 (is_active 필터는 앱에서)
CREATE POLICY "Public read all courses"
  ON courses FOR SELECT USING (true);

-- users: 본인만 조회/수정
CREATE POLICY "Users read own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

-- orders: 본인 주문만
CREATE POLICY "Users read own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- mission_progress: 본인 진행상황만
CREATE POLICY "Users read own progress"
  ON mission_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
  ON mission_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- community_posts: 전체 조회, 본인 글만 수정/삭제
CREATE POLICY "Public read posts"
  ON community_posts FOR SELECT USING (is_hidden = false);

CREATE POLICY "Auth users insert posts"
  ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 관리자: 모든 테이블 전체 권한
CREATE POLICY "Admins full access"
  ON courses FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
```

---

## 4. Storage Buckets

| 버킷명 | 접근 | 용도 |
|--------|------|------|
| `mission-photos` | public | 미션 완료 사진 업로드 |
| `community-photos` | public | 커뮤니티 게시글 이미지 |

---

## 5. Auth Provider 설정

| Provider | 콜백 URL (현재) | 향후 운영 도메인 |
|----------|-----------------|------------------|
| 카카오 | `https://legend-of-korea.vercel.app/auth/callback` | `https://legendofkorea.com/auth/callback` |
| 구글 | `https://legend-of-korea.vercel.app/auth/callback` | `https://legendofkorea.com/auth/callback` |
| LINE | `https://legend-of-korea.vercel.app/auth/callback` | `https://legendofkorea.com/auth/callback` |

> **운영 도메인 구매 시**: 위 3 개 provider 콘솔에서 callback URL 을 향후 도메인으로
> 갱신해야 함. `NEXT_PUBLIC_SITE_URL` 환경변수 변경과 동시에 진행.

---

## 6. Supabase 클라이언트 사용 규칙

```typescript
// 서버 컴포넌트 (app/ 내부)
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// 클라이언트 컴포넌트 ("use client")
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// API Route / Server Action
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
```

> **주의**: `service_role` 키는 절대 클라이언트에 노출 금지. API Route에서만 사용.

---

### 2.15 subscription_plans (015 추가, 017 수정)

```sql
CREATE TABLE subscription_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              JSONB NOT NULL,          -- { ko, ja, en }
  price             INTEGER NOT NULL,        -- 월 구독료 (원)
  plan_type         TEXT CHECK (plan_type IN ('free','explorer','legend')),
  features          JSONB NOT NULL,          -- { ko: [...], ja: [...], en: [...] }
  kit_discount_rate INTEGER DEFAULT 0,       -- 키트 추가 할인율 (%)
  tier_levelup      BOOLEAN DEFAULT false,   -- 즉시 레벨업 혜택 여부
  monthly_credits   INTEGER NOT NULL DEFAULT 0,  -- 월 지급 크레딧 (017)
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

초기 데이터 (3개):
- free (0원, 0크레딧)
- explorer (9,900원, 5%, 30크레딧/월)
- legend (19,900원, 5% + 티어업, 100크레딧/월)

---

### 2.16 user_subscriptions (015 추가, 017 수정)

```sql
CREATE TABLE user_subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id                  UUID REFERENCES subscription_plans(id),
  status                   TEXT CHECK (status IN ('active','canceled','expired','trial')),
  payment_provider         TEXT,
  payment_subscription_id  TEXT,
  current_period_start     TIMESTAMPTZ NOT NULL,
  current_period_end       TIMESTAMPTZ NOT NULL,
  tier_levelup_used        BOOLEAN DEFAULT false,  -- 전설 플랜 1회 제한
  credits_remaining        INTEGER NOT NULL DEFAULT 0,  -- 잔여 크레딧 (017)
  credits_reset_at         TIMESTAMPTZ,                 -- 다음 갱신일 (017)
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
```

RLS: 본인만 조회/수정/생성 (`auth.uid() = user_id`)

---

### 2.17 travel_plans (015 추가, 016/017 수정)

```sql
CREATE TABLE travel_plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title            JSONB,
  city_id          TEXT NOT NULL,
  start_date       DATE,
  end_date         DATE,
  travel_style     TEXT NOT NULL DEFAULT 'active'
                   CHECK (travel_style IN ('relaxed','active','full')),  -- 017
  has_mission_kit  BOOLEAN DEFAULT false,
  kit_course_id    UUID REFERENCES courses(id),
  hotel_name       TEXT,                 -- 016
  hotel_address    TEXT,                 -- 016
  hotel_lat        DOUBLE PRECISION,     -- 016
  hotel_lng        DOUBLE PRECISION,     -- 016
  hotel_source     TEXT CHECK (hotel_source IS NULL OR hotel_source IN ('curated','manual')),  -- 016
  status           TEXT CHECK (status IN ('draft','confirmed','completed')),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);
```

RLS: 본인만 모든 권한

---

### 2.18 credit_purchases (017 추가)

```sql
CREATE TABLE credit_purchases (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits           INTEGER NOT NULL CHECK (credits > 0),
  price             INTEGER NOT NULL CHECK (price >= 0),
  payment_provider  TEXT,
  payment_id        TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

패키지: 10개/₩1,900 · 30개/₩4,900 · 100개/₩12,900 (서버 고정, 클라이언트 값 무시)

RLS: 본인만 조회/생성

---

### 2.19 credit_usage (017 추가)

```sql
CREATE TABLE credit_usage (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature       TEXT NOT NULL CHECK (feature IN ('weather','distance','ai_curation','pdf','schedule_change','companion_share')),
  credits_used  INTEGER NOT NULL CHECK (credits_used > 0),
  metadata      JSONB,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

feature 단가 (서버 고정): weather=1, distance=1, ai_curation=3, pdf=2, schedule_change=2, companion_share=1

RLS: 본인만 조회/생성

---

### 2.20 plan_items (015 추가)

```sql
CREATE TABLE plan_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       UUID REFERENCES travel_plans(id) ON DELETE CASCADE,
  item_type     TEXT CHECK (item_type IN ('food','stay','diy','quest','ootd','goods','transport','surprise')),
  item_data     JSONB NOT NULL,
  day_number    INTEGER,
  time_slot     TEXT CHECK (time_slot IN ('morning','afternoon','evening','anytime')),
  sort_order    INTEGER DEFAULT 0,
  is_confirmed  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

RLS: travel_plans.user_id 기반 서브쿼리 검증 (본인 플랜의 아이템만 접근)


---

### 2.21 participant_reviews (021 추가)

```sql
CREATE TABLE participant_reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type   TEXT NOT NULL CHECK (event_type IN ('quest_party', 'gyeongdo')),
  event_id     TEXT NOT NULL,
  reviewer_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, reviewer_id, reviewee_id),
  CHECK (reviewer_id <> reviewee_id)
);
```

RLS: INSERT with CHECK(auth.uid()=reviewer_id) / SELECT USING(auth.uid()=reviewer_id OR auth.uid()=reviewee_id)

자동 블랙리스트 트리거: 리뷰 등록 시 reviewee의 평균 별점 재계산 → ≥3건 AND avg ≤1.0 이면 blacklist upsert

---

### 2.22 user_reports (021 추가)

```sql
CREATE TABLE user_reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL CHECK (event_type IN ('quest_party', 'gyeongdo')),
  event_id    TEXT NOT NULL,
  reason      TEXT NOT NULL CHECK (reason IN ('no_show','harassment','fraud','violence','inappropriate','other')),
  detail      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, reporter_id, reported_id),
  CHECK (reporter_id <> reported_id)
);
```

RLS: INSERT with CHECK(auth.uid()=reporter_id) / SELECT USING(auth.uid()=reporter_id)

자동 블랙리스트 트리거: dismissed 제외 신고 ≥3건 시 blacklist upsert (reason='reports')

---

### 2.23 blacklist (021 추가)

```sql
CREATE TABLE blacklist (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  reason         TEXT NOT NULL CHECK (reason IN ('low_rating','admin_ban','reports')),
  average_rating NUMERIC(3,1),
  total_reports  INTEGER NOT NULL DEFAULT 0,
  blocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until  TIMESTAMPTZ,   -- NULL = 영구 차단
  is_active      BOOLEAN NOT NULL DEFAULT true
);
```

RLS: SELECT USING(true) — 참여 허용 여부 확인을 위해 누구나 조회 가능

API: GET /api/review/check?userId=... → isBlacklisted, reviewCount, averageRating 반환
