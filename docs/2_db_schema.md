# Legend of Korea — DB Schema (Supabase PostgreSQL)

> 최종 수정: 2026-04-07  
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
  id              SERIAL PRIMARY KEY,
  name_ko         TEXT NOT NULL,   -- '씨앗', '새싹', '도깨비', '선녀', '신선'
  name_ja         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  min_lp          INTEGER NOT NULL,
  max_lp          INTEGER,         -- NULL이면 상한 없음
  badge_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 초기 데이터
INSERT INTO tiers (name_ko, name_ja, name_en, min_lp, max_lp) VALUES
  ('씨앗',   '種',     'Seed',    0,     499),
  ('새싹',   '芽',     'Sprout',  500,   1999),
  ('도깨비', '鬼',     'Goblin',  2000,  4999),
  ('선녀',   '仙女',   'Fairy',   5000,  9999),
  ('신선',   '神仙',   'Sage',    10000, NULL);
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

| Provider | 콜백 URL (프로덕션) |
|----------|-------------------|
| 카카오 | `https://legendofkorea.com/auth/callback` |
| 구글 | `https://legendofkorea.com/auth/callback` |
| LINE | `https://legendofkorea.com/auth/callback` |

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
