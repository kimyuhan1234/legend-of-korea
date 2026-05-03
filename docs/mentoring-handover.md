# Clouds with you — 멘토링 핸드오버 (전수조사)

작성: 2026-05-04 / 코드 기반 / commit `265a850` 기준

---

## 1. 프로젝트 메타

### 1-1. 기본 정보
- **이름**: legend-of-korea (코드네임) / **표기**: Clouds with you
- **버전**: 0.1.0 (private)
- **런타임**: Node 24.14 / 패키지 매니저 pnpm
- **빌드 결과**: `.next` **665 MB** (개발용 cache 포함, production 산출물은 더 작음)
- **총 라우트**: 80개 (정적 ●, 동적 ƒ, SSG ○ 혼합)
- **`'use client'` 파일**: components 141 / app 9

### 1-2. dependencies (production)
```
@radix-ui/* (avatar/checkbox/dialog/dropdown-menu/label/progress/select/slot/tabs/toast)
@supabase/ssr ^0.9.0, @supabase/supabase-js ^2.100.1
@tailwindcss/postcss ^4.2.2, tailwindcss ^4.2.2
@tosspayments/tosspayments-sdk ^2.6.0
class-variance-authority ^0.7.1, clsx ^2.1.1, tailwind-merge ^3.5.0
html5-qrcode ^2.3.8 (QR 미션 인증)
lucide-react ^1.7.0 (아이콘)
next 14.2.35, react ^18, react-dom ^18
next-intl ^4.8.3 (i18n)
react-easy-crop ^5.5.7 (아바타)
recharts ^3.8.1 (TasteRadar 차트)
resend ^6.12.2 (재인증 메일)
```

### 1-3. devDependencies (요점)
- typescript ^5, eslint ^8 + eslint-config-next 14.2.35
- vitest ^4.1.2 + @vitejs/plugin-react ^6.0.1 (단위 테스트 24개)
- pg ^8.20.0 + @types/pg (DB migration 직접 실행)
- xlsx ^0.18.5 (한식 데이터 import)
- tsx ^4.21.0 (TypeScript 스크립트)

### 1-4. next.config.mjs (전문)

`staticPageGenerationTimeout: 180` (28KB+ 모듈 페이지 SSG 여유). 보안 헤더 6종(`X-Content-Type-Options`, `X-Frame-Options DENY`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy camera=()/microphone=()/geolocation=(self)`, `CSP upgrade-insecure-requests`).

`images.remotePatterns`: Supabase Storage(`isixbzx...supabase.co`), 소셜 아바타(lh3.googleusercontent / k.kakaocdn / profile.line-scdn), unsplash, **TourAPI(http+https tong/cdn.visitkorea)**.

`compiler.removeConsole.exclude: ['error', 'warn']` (production만, 디버그 로그 외국인 콘솔 노출 차단).

`experimental.optimizePackageImports: ['lucide-react', 'next-intl']` (tree-shake).

### 1-5. tsconfig.json 핵심
- `strict: true` / `moduleResolution: bundler` / `resolveJsonModule: true` / `isolatedModules: true`
- `paths: { "@/*": ["./*"] }` — 절대 import 표준
- `incremental: true` + `.next/types` 포함

### 1-6. middleware.ts (요약)
- **5개 locale**: ko(default) / ja / en / zh-CN / zh-TW. `localePrefix: "always"` (`/ko/...` 강제).
- **PUBLIC_PATHS** (비로그인 허용): `/`, `/auth/*`, `/login`, `/signup`, `/stay`, `/discover`, `/community`, `/story`, `/pass`, `/courses`, `/privacy`, `/terms`, `/maintenance` — 헤더 4메뉴 + 코스 상세 + 정적 페이지
- **로그인 게이트**: PUBLIC 외 전부 `auth/login?next=...`로 redirect. Supabase auth 쿠키 `sb-{ref}-auth-token` + `.0`/`.1` 분할 토큰 모두 인식 (분할 토큰 미감지 시 무한 redirect 회귀 이력 있음 — line 207 hotfix 코멘트).
- **일일 접속자 게이트**: `MAX_DAILY_VISITORS=50` (env). 초과 시 `/maintenance` redirect. `ADMIN_EMAILS` 우회.
- **유지보수 모드**: `NEXT_PUBLIC_MAINTENANCE_MODE=true` 시 관리자 외 차단.
- **Rate limit 4종**: `NONE`(결제/주문/구독/웹훅), `ADMIN`(`/api/admin/*` + tour-stays refresh/tag), `PUBLIC`(tour-stays recommend/test, community ads, lp leaderboard), `USER`(나머지).
- `/og`, `/sitemap.xml`, `/robots.txt`, `_next/*`, 정적 자산(.svg/.png/.woff2 등)은 패스스루.

### 1-7. 환경변수 키 (.env.example 기반)
```
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_TOSS_CLIENT_KEY / TOSS_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY / STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
RESEND_API_KEY / RESEND_FROM (재인증 메일)
CRON_SECRET (Vercel Cron)
UNSPLASH_ACCESS_KEY (음식 이미지 자동 매칭)
NEXT_PUBLIC_KAKAO_JS_KEY (지도)
TOUR_API_KEY (한국관광공사 — 절대 NEXT_PUBLIC_ 금지)
MAX_DAILY_VISITORS / NEXT_PUBLIC_MAINTENANCE_MODE / ADMIN_EMAILS
NEXT_PUBLIC_TEST_MODE / NEXT_PUBLIC_PAYMENTS_ENABLED / TEST_MODE
AI_CURATION_ENABLED / ANTHROPIC_API_KEY / OPENAI_API_KEY / AI_MODEL (현재 STUB)
```

### 1-8. 라우트 사이즈 (First Load JS, top 10 무거운 페이지)
| 라우트 | size | First Load JS |
|---|---|---|
| `/[locale]/missions/scan` | 113 kB | 231 kB (QR 스캐너 html5-qrcode) |
| `/[locale]/memories` | 25.6 kB | 226 kB |
| `/[locale]/admin/stats` | 39.7 kB | 225 kB (recharts) |
| `/[locale]/mypage` | 20.9 kB | 222 kB |
| `/[locale]/courses/[courseId]` | 13.8 kB | 207 kB |
| `/[locale]/missions/[courseId]/[missionId]` | 25.1 kB | 170 kB |
| `/[locale]/sights` | 47.7 kB | **168 kB** |
| `/[locale]/missions/[courseId]` | 9.45 kB | 193 kB |
| `/[locale]/food/dupe/[region]/[foodId]` | 5.47 kB | 195 kB (recharts radar) |
| `/[locale]/food/beauty` | 2.42 kB | 192 kB (radar) |

평균 First Load JS 87.6 kB shared. 가벼운 정적 페이지(about/terms/privacy/etc) 87.7 kB.

---

## 2. 사이트 맵 전체

표기: 로그인 ✓=필수 / ✗=공개 / SSR(server) / CSR(client) / dyn(force-dynamic)

| 경로 | 파일 | 로그인 | SSR/CSR | 한 줄 역할 | i18n 키 출처 |
|---|---|---|---|---|---|
| `/` | `app/[locale]/page.tsx` | ✗ | dyn | 홈 — 가치 제안 hero + 패스 버튼 + 4슬라이드 캐러셀 | `home`, `metadata.home`, `common` |
| `/discover` | `app/[locale]/discover/page.tsx` | ✗ | server | 6 카드 허브 (STAY 큰 / K-FOOD·OOTD 중간 / TRAFFIC·SPOT·GALLERY 작은) | `discover`, `common` |
| `/stay` | `app/[locale]/stay/page.tsx` | ✗ | dyn | 숙박 추천 (TourAPI tour-stays 기반, 17 광역) | inline + `metadata.stay` |
| `/food` | `app/[locale]/food/page.tsx` | ✓ | static | redirect → `/food/kfood-spot` | inline |
| `/food/dupe` | `app/[locale]/food/dupe/page.tsx` | ✓ | static | 6권역 카드 (food-dupes 듀프 페이지 진입) | inline |
| `/food/dupe/[region]` | `app/[locale]/food/dupe/[region]/page.tsx` | ✓ | dyn | 권역 내 도시 → 음식 list | inline |
| `/food/dupe/[region]/[foodId]` | `app/[locale]/food/dupe/[region]/[foodId]/page.tsx` | ✓ | dyn | 음식 상세 (스토리/재료/타스트프로필/JP·CN 듀프/맛집 3건) | inline |
| `/food/kfood-spot` | `app/[locale]/food/kfood-spot/page.tsx` | ✓ | server | 6권역 이미지 카드 | inline |
| `/food/kfood-spot/[group]` | `[group]/page.tsx` | ✓ | dyn | 권역 → 도시 list (KFOOD_CITY_TO_GROUP) | inline |
| `/food/kfood-spot/[group]/[city]` | `[city]/page.tsx` | ✓ | dyn | redirect → `/[city]/local-pick` | — |
| `/food/kfood-spot/[group]/[city]/local-pick` | `local-pick/page.tsx` | ✓ | dyn | 외지인 랭킹 TOP 10 (티맵 빅데이터) | inline |
| `/food/kfood-spot/[group]/[city]/local-pick/[pickId]` | `[pickId]/page.tsx` | ✓ | dyn | 픽 상세 (TourAPI detailCommon2) | inline |
| `/food/kfood-spot/[group]/[city]/[category]` | `[category]/page.tsx` | ✓ | dyn | 한식/이색/카페 30건 (cat3 필터) | inline |
| `/food/kfood-spot/[group]/[city]/[category]/[contentid]` | `[contentid]/page.tsx` | ✓ | dyn | 식당 상세 (KFoodSpotDetail) | inline |
| `/food/beauty` | `app/[locale]/food/beauty/page.tsx` | ✓ | server | 6 카테고리 이미지 카드 → ?category 음식 list (radar) | inline |
| `/food/seasonal` | `app/[locale]/food/seasonal/page.tsx` | ✓ | server | 4계절 이미지 카드 → ?season 음식 list + 12개월 달력 | inline |
| `/food/flag-cooking` | `app/[locale]/food/flag-cooking/page.tsx` | ✓ | static | 12개국 fusion 레시피 (flag-cooking.ts 68 entries) | inline |
| `/ootd` | `app/[locale]/ootd/page.tsx` | ✓ | static | 주간 OOTD 보드 (날씨 기반 데일리 코디) | inline |
| `/traffic` | `app/[locale]/traffic/page.tsx` | ✓ | static | 공항→도시 이동 가이드 (애니메이션 경로 시각화) | inline |
| `/sights` | `app/[locale]/sights/page.tsx` | ✗ | dyn | 5 탭 (큐레이션/지도/축제/카테고리/도시), TourAPI ~2,040 spot + 자동 태그 9종 | `sights`, `spots`, `common` |
| `/gallery` | `app/[locale]/gallery/page.tsx` | ✗ | server | PASS 전용 사진 gallery (Supabase Storage `gallery` 버킷) | `gallery` |
| `/story` | `app/[locale]/story/page.tsx` | ✗ | dyn | 2 탭 (디지털 퀘스트 카드 그리드 / 스페셜 이벤트) | `story`, `quest` |
| `/courses/[courseId]` | `app/[locale]/courses/[courseId]/page.tsx` | ✗ | dyn | 코스 상세 (히어로/3단계/미션지도/스토리/패스/Quest Party/ZEP/제휴/리뷰/FAQ) | `course`, `quest` |
| `/courses/[courseId]/purchase` | `purchase/page.tsx` | ✓ | dyn | Toss 결제 위젯 | inline |
| `/courses/[courseId]/purchase/success` | `success/page.tsx` | ✓ | dyn | 결제 성공 | inline |
| `/courses/[courseId]/purchase/fail` | `fail/page.tsx` | ✓ | dyn | 결제 실패 | inline |
| `/quest` | `app/[locale]/quest/page.tsx` | ✗ | static | 퀘스트 진입 안내 | inline |
| `/quest/guide` | `app/[locale]/quest/guide/page.tsx` | ✗ | static | quest-guide.ts 기반 가이드 | inline |
| `/quest/gyeongdo` | `app/[locale]/quest/gyeongdo/page.tsx` | ✗ | static | 경찰과 도둑 이벤트 페이지 | `quest.gyeongdo` |
| `/pass` | `app/[locale]/pass/page.tsx` | ✗ | static | 3 패스(Short/Standard/Long) 비교 카드 + robots noindex | `pricing`, `metadata.pass` |
| `/pass/checkout` | `pass/checkout/page.tsx` | ✓ | dyn | Toss 패스 결제 | inline |
| `/pass/success` / `/pass/fail` | (각각) | ✓ | static | 결제 결과 | inline |
| `/community` | `app/[locale]/community/page.tsx` | ✗ | server | 2 카드 (MEMORIES 큰 + DIY 보조) | `community` |
| `/community/write` | `community/write/page.tsx` | ✓ | static | 게시글 작성 (multipart/photo) | inline |
| `/community/recipe/write` | `recipe/write/page.tsx` | ✓ | static | 레시피 작성 | inline |
| `/memories` | `app/[locale]/memories/page.tsx` | ✓ | static | 디지털 패스포트 + 미션 인증샷 + 전설 상점 + 랭킹 | `memories` |
| `/diy` | `app/[locale]/diy/page.tsx` | ✓ | static | DIY 워크숍 디렉토리 (diy-workshops.ts) | inline |
| `/planner` | `app/[locale]/planner/page.tsx` | ✓ | static | 여행 플래너 (TripSetup → 큐레이션 → FinalPlan + 호텔) | inline |
| `/missions` | `app/[locale]/missions/page.tsx` | ✓ | static | 진행 중인 코스 list (Mission 대시보드) | inline |
| `/missions/[courseId]` | `[courseId]/page.tsx` | ✓ | dyn | 코스 미션 진행 (지도 + 미션 카드) | inline |
| `/missions/[courseId]/[missionId]` | `[missionId]/page.tsx` | ✓ | dyn | 미션 실행 (Boss/Open/Photo/Quiz 4종) | inline |
| `/missions/scan` | `missions/scan/page.tsx` | ✓ | static | QR 스캐너 (html5-qrcode) | inline |
| `/mypage` | `app/[locale]/mypage/page.tsx` | ✓ | static | 프로필 + 디지털 패스포트 + 설정 + 위험구역 | `mypage` |
| `/mypage/tech-tree` | `tech-tree/page.tsx` | ✓ | static | 4-스타일 진로 분기 트리 (scholar/warrior/explorer/diplomat) | inline |
| `/mypage/mission-register/[courseId]` | (위) | ✓ | dyn | 코스 인증샷 일괄 등록 | inline |
| `/auth/login` | `app/[locale]/auth/login/page.tsx` | ✗ | static | OAuth(Google/Kakao/Line) + 이메일 | inline |
| `/auth/signup` | `auth/signup/page.tsx` | ✗ | static | 이메일 가입 + 생년월일 + 약관 | inline |
| `/auth/complete-profile` | `complete-profile/page.tsx` | ✗ | static | OAuth 후 닉네임/생년월일 보완 | inline |
| `/auth/age-restricted` | (위) | ✗ | static | 14세 미만 차단 | inline |
| `/auth/parent-consent` | `parent-consent/page.tsx` | ✗ | static | 미성년자 보호자 동의 요청 | inline |
| `/auth/parent-consent/[token]` | `[token]/page.tsx` | ✗ | dyn | 보호자 동의 폼 (이메일 토큰) | inline |
| `/admin` | `admin/page.tsx` | ✓+admin role | static | 관리자 대시보드 | inline |
| `/admin/b2b` `/admin/community` `/admin/missions` `/admin/orders` `/admin/stats` `/admin/tour-stays` | (각각) | admin | static | 관리자 페이지 | inline |
| `/shop` | `shop/page.tsx` | ✓ | static | 전설 상점 (LP → 쿠폰 교환) | inline |
| `/goods` | `goods/page.tsx` | ✗ | static | 굿즈 카테고리 그리드 | inline |
| `/about` `/partner` `/terms` `/privacy` `/location-terms` | (각각) | ✗ | static | 회사/제휴/약관/개인정보/위치 | inline |
| `/maintenance` | (위) | ✗ | static | 유지보수 모드 표시 페이지 | inline |
| **공통 layout/loading/error** | | | | | |
| `/[locale]/layout.tsx` | (위) | — | server | Navbar + Footer + StickyCTA + ServiceWorkerCleanup + Toast | — |
| `/[locale]/loading.tsx` | | — | server | 글로벌 로딩 (mint 스피너) | — |
| `/[locale]/error.tsx` | | — | client | 글로벌 에러 (인라인 스타일만) | — |
| `/[locale]/not-found.tsx` | | — | client | 404 (인라인 스타일만) | — |
| 페이지별 loading.tsx | community/courses/diy/food/missions/ootd/story | | | | |

---

## 3. 페이지별 디자인 구조

### 3-1. `/` — 홈 (외국인 첫 진입점)

- **파일**: [app/[locale]/page.tsx](app/[locale]/page.tsx) → 4 컴포넌트 조립
- **컴포넌트 트리**:
  ```
  HomePage (server, force-dynamic)
   ├ HeroSection         — 가치 제안 (도깨비 hero 이미지)
   ├ HeroPassButtons     — 패스 3종 버튼 + 비디오
   └ HomeFeatureCarousel — 자동 슬라이드 캐러셀 (4 슬라이드)
       ├ SlideFeatureDupe       — 음식 듀프 미리보기
       ├ SlideFeaturePlanner    — 플래너 미리보기
       ├ SlideHomeImage         — Memorise/한복 이미지
       └ SlideHomeImage         — Discover 카드 강조
  ```
- **레이아웃**: 풀폭 hero (`bg-snow has-sticky-cta`) → 패스 버튼 섹션 → 가운데 정렬 캐러셀
- **정보 위계**: h1 hero title (`home.heroTitle`), h2 caraousel slide titles
- **이미지**: `/images/dokkaebi-hero.png` (도깨비 일러스트, 한국적 무드 핵심)
- **인터랙션**: HeroPassButtons 3개 패스 카드 (`Short/Standard/Long`, ⚡ Short는 의미상 보존), 자동 캐러셀 (제어 버튼 X — 자동만)
- **반응형**: md 분기 위주 (홈은 lg 분기 거의 없음)
- **다국어 깨짐 위험**: 패스 카드 가격(₩2,900 등) 고정 폭 — 영어/일본어 라벨 길어질 시 잘림 가능
- **한국적 무드**: 도깨비 hero 이미지 (강함). 캐러셀 슬라이드 한복/구름 이미지

### 3-2. `/discover` — 6 카드 허브 (P1-5 톤 시스템)

- **파일**: [app/[locale]/discover/page.tsx](app/[locale]/discover/page.tsx)
- **레이아웃 — 3-tier 위계**:
  - Row 1: STAY 풀폭 큰 카드 (`bg-tier-strong-stay` mint→blossom 그라데이션, 흰 글씨)
  - Row 2: K-FOOD / OOTD 2-col 흰 카드 (border-mist → hover border-mint/blossom)
  - Row 3: TRAFFIC / SPOT / GALLERY 3-col 컴팩트 흰 카드
- **헤더**: `bg-tier-soft border-b border-mint py-20 md:py-28` (Tier 2 정보 페이지 톤)
- **정보 위계**: h1 페이지 제목, h2 STAY title, h3 K-FOOD/OOTD, h4 TRAFFIC/SPOT/GALLERY (계단식 강조)
- **인터랙션**: 6 카드 모두 `<Link>`, hover `shadow-md→shadow-xl + -translate-y-1`
- **사용 클래스**: `rounded-3xl` / `rounded-2xl`, lucide 아이콘(`UtensilsCrossed Shirt Train MapPin Images`), `text-stone text-base md:text-lg`
- **다국어**: 라벨/제목/설명 5개국어 (`food.label/title/description` 등 nested keys)
- **한국적 무드**: 카드 배경은 미니멀 흰색 — 중립. STAY 그라데이션이 유일한 액센트. 한복/도깨비 이미지 X.
- **BreadcrumbSchema** 포함 (SEO).

### 3-3. `/sights` — 5 탭 정보 집약 페이지

- **파일**: [app/[locale]/sights/page.tsx](app/[locale]/sights/page.tsx) + [SpotsClient.tsx](components/features/spots/SpotsClient.tsx)
- **컴포넌트 트리**:
  ```
  SightsPage (server, force-dynamic)
   └ SpotsClient (client)
       ├ Hero  (bg-tier-soft text-ink py-12 md:py-16)
       ├ TabNav (sticky top-0 z-20 backdrop-blur, 5 tabs)
       └ TabContent
           ├ curation: StyleSlider(swipe) → CurationResult
           ├ map: SpotMapView (KakaoMap + 선호도 점수)
           ├ festival: FestivalCalendar (월별 그리드)
           ├ category: SpotCategoryView (3 카테고리 필터)
           └ city: SpotCityView (17 광역 그리드)
  ```
- **5 탭**: curation(Sparkles) / map(Map) / festival(Calendar) / category(Folder) / city(Building2) — 가로 스크롤 가능
- **데이터**: TourAPI 17 광역 × 4 contentTypeId(12/14/25/28) × numOfRows 30 + 축제(15) ≈ **2,040 spot**. 정적 SIGHTS 추가.
- **자동 태그 9종**: `#야간 #꽃 #온천 #시장 #바다 #자연 #역사 #체험 #가족` (키워드 + cat3 fallback)
- **SpotCard 디자인**: `aspect-[4/3]` 이미지 + `rounded-2xl` + 카테고리 emoji chip(`🔥/🏛️/🎊`) + 한글 태그 chip + AddToPlannerButton + TourAPI 출처
- **반응형**: 카드 그리드 1col → 2col(sm) → 3col(lg)
- **퍼포먼스 이슈**: 첫 SSR 3-5초 (85 fetch 병렬, revalidate=3600s 캐싱)
- **다국어 깨짐 위험**: 카테고리 emoji chip 폭 고정, label 길어지면 줄바꿈

### 3-4. `/food/dupe/[region]/[foodId]` — 음식 상세 (가장 정교한 페이지)

- **파일**: [foodId/page.tsx](app/[locale]/food/dupe/[region]/[foodId]/page.tsx) (290줄)
- **섹션 구조**:
  1. FoodTabNav (food 4 탭 — kfood-spot/dupe/beauty/seasonal)
  2. 뒤로가기 링크
  3. **음식 hero** — 이미지 또는 FoodEmojiThumb fallback / 우측 상단 `imageCredit` (공공누리 1유형 출처)
  4. **스토리텔링** — `bg-[#D4F0EB] border-l-4 border-blossom-deep` (브랜드 컬러 강조)
  5. 주요 재료 chip
  6. **HealthSection** (radar chart, foodHealthData 매칭)
  7. **DupeCountrySelector** — JP/CN 듀프 (12개국에서 2국으로 축소된 이력)
  8. K-Food Spot 연결 (TourAPI 3건)
- **타스트프로필**: recharts radar chart (단/짠/매/감/시 5축, 0-100)
- **이미지 출처 표기**: `imageCredit` 필드 — 한국관광공사 공공누리 1유형 의무
- **한국적 무드**: 음식 사진 (실사) + emoji fallback + 도시 emoji(`region.icon`)
- **다국어 깨짐 위험**: 재료 chip 가변 폭 OK, 스토리 텍스트 길이 차이 큼

### 3-5. `/courses/[courseId]` — 코스 상세 (가장 풍부한 섹션)

- **파일**: [courseId/page.tsx](app/[locale]/courses/[courseId]/page.tsx) (~270줄)
- **섹션 구조** (10 섹션):
  1. **QuestHero** — 몰입형 hero (썸네일 + 난이도/지속시간/미션수 메타)
  2. AddToPlannerButton (CTA)
  3. **QuestHowItWorks** — 3단계 프로세스
  4. **QuestMissionGuide** — GPS 미션 진행법
  5. **MissionKakaoMap** — 미션 지도 프리뷰 (Kakao SDK, CustomOverlay 마커)
  6. **QuestStorySlider** — 4 스토리 카드 인터랙티브
  7. **LockScreen** (패스 미보유 시) — 6종 패턴 중 'generic'
  8. **QuestPartySection** — 파티 매칭 (api/party/list)
  9. **ZEP 가상 모임** — 패스 보유: ZepMeetingButton(미니 프리뷰+입장) / 미보유: ZepBanner(애니메이션+/pass CTA)
  10. **AffiliateLinks** — 제휴 (숙박/교통/맛집), AffiliateLink type별 그룹
  11. **QuestReviews** — 외국인 후기
  12. **QuestFAQ** — 아코디언
- **퍼포먼스**: 207 kB First Load JS (recharts/Kakao SDK 큰 번들)
- **다국어 깨짐 위험**: QuestHero 메타 chip 가변 폭, `course.title` 영어 길이

### 3-6. `/pass` — 3 패스 비교

- **파일**: [pass/page.tsx](app/[locale]/pass/page.tsx) + PassCard.tsx
- **레이아웃**: `bg-tier-strong` 그라데이션 hero + 3-col PassCard 그리드
- **PassCard**: 패스명 + 가격 + 혜택 list + CTA (`/pass/checkout?type=...`)
- **robots noindex**: `metadata.robots: { index: false, follow: false }` (Vercel Hobby 상업 회피 + 베타 가격 SEO 차단)

### 3-7. `/community` — 2 카드 (MEMORIES 큰 / DIY 보조)

- **파일**: [community/page.tsx](app/[locale]/community/page.tsx)
- **레이아웃**: `grid grid-cols-1 md:grid-cols-3` (MEMORIES md:col-span-2, DIY md:col-span-1)
- **카드**: 흰 배경 + lucide 아이콘(Camera/Palette) + label/title/description + → 화살표 hover gap 변화
- **단순함**: discover 6 카드와 동일 패턴 (디자인 일관성 확보)

### 3-8. `/memories` — 디지털 패스포트 (가장 무거운 사용자 페이지)

- **파일**: [memories/page.tsx](app/[locale]/memories/page.tsx) → MemoriesClient
- **First Load JS**: 226 kB (사이트 최대급)
- **컴포넌트**: DigitalPassport(/api/user/rank 연동) + 사진 갤러리 + LegendShop(LP→쿠폰) + Leaderboard
- **탭**: 사진 / 패스포트 / 상점 / 랭킹 (탭 라벨 항상 노출 — 모바일 반응형)
- **한국적 무드**: 패스포트 도장 디자인(PassportStamp), 디지털 티어(scholar/warrior 한자 명칭)

### 3-9. `/auth/login` — OAuth + 이메일

- **파일**: [auth/login/page.tsx](app/[locale]/auth/login/page.tsx)
- **레이아웃**: 좌측 컬럼 (LoginForm) + 우측 (SocialLoginButtons Google/Kakao/Line)
- **카피 톤**: "전설의 세계로 입장하세요" 류 (한국 IP 컨셉 강조)

### 3-10. `/story` — 2 탭 (mission-kit / special)

- **파일**: [story/page.tsx](app/[locale]/story/page.tsx) + [tabs/CoursesTab.tsx](app/[locale]/story/tabs/CoursesTab.tsx) + [SpecialEventTab.tsx](components/features/story/tabs/SpecialEventTab.tsx)
- **mission-kit 탭**: 코스 카드 그리드 (이전 슬라이드 → grid-cols-1 md:grid-cols-2 변경 이력)
- **special 탭**: 경찰과 도둑 이벤트 (`bg-gradient-to-br from-mint to-blossom` 파스텔 hero)

### 3-11. 기타 페이지 (요약)
- `/stay` — TourAPI tour-stays-cache 17광역 풀폭 그리드
- `/ootd` — WeeklyOotdBoard 7일 카드 (오늘=mint→blue 하이라이트)
- `/traffic` — 4교통 옵션(공항버스/택시/KTX/렌트) 애니메이션 경로 (`@keyframes travel/travelFlight`)
- `/gallery` — PASS 게이팅, 비구독자 lock placeholder + 다운로드 API
- `/diy` — DiyWorkshopDirectory 4 워크숍 카드
- `/planner` — 4단계(setup → 호텔 → 큐레이션 → final plan) 멀티스텝
- `/food/beauty` — 6 카테고리 카드 → ?category 음식 list (radar)
- `/food/seasonal` — 4계절 카드 → ?season 음식 list + 12개월 달력 토글
- `/food/flag-cooking` — 12개국 fusion 레시피 그리드
- `/quest/gyeongdo` — 경찰과 도둑 SPECIAL EVENT 페이지

---

## 4. 컴포넌트 라이브러리

### 4-1. 디렉토리 구조 (총 192 .tsx)
```
components/
├── ui/                    — shadcn/ui 원시 (Button/Card/Badge/Input/Modal 등)
├── shared/                — Navbar/Footer/MobileHeader/StickyCTA/Disclaimer/...
│   └── icons/             — RaindropIcon (브랜드 SVG)
├── seo/                   — CategorySchema/OrganizationSchema/WebSiteSchema/BreadcrumbSchema
├── ootd/                  — WeeklyOotdBoard
├── diy/                   — DiyWorkshopDirectory
└── features/              — 기능별
    ├── admin/             — 관리자 (1 file)
    ├── auth/              — 로그인/가입/생년월일/소셜 (10 files)
    ├── camera/            — 레트로 필터 (FilterSelector, RetroFilterCanvas)
    ├── community/         — 피드/포스트/레시피/광고 (10 files)
    ├── courses/           — AffiliateLinks, CourseSlider (코스→그리드 변경 이력)
    ├── dashboard/         — RankCard, TechTreeView (4-style 분기)
    ├── food/              — DupeMode/Beauty/Seasonal/FlagCooking 컴포넌트 다수 (~25 files)
    ├── gallery/           — GalleryClient (PASS 게이팅 client)
    ├── goods/             — GoodsCard/Grid/Hero/CategoryFilter
    ├── home/              — HeroSection/HeroPassButtons/HomeFeatureCarousel/Slide* (6 files)
    ├── memories/          — MemoriesClient/LegendShop
    ├── missions/          — Boss/Open/Photo/Quiz 4 mission types + GPS/QR/Party (~15 files)
    ├── mypage/            — DigitalPassport/PassportStamp/MissionRegister/Settings (~10 files)
    ├── planner/           — TripSetup/Curation/FinalPlan/HotelInputForm/Weather (~10 files)
    ├── pricing/           — PassCard, LockScreen 6종, CheckoutClient
    ├── purchase/          — PurchaseFlow + Step1KitSelect/Step2/Step3Payment + TossPaymentWidget
    ├── quest/             — QuestHero/HowItWorks/StorySlider/MissionGuide/PartySection/Reviews/FAQ (~15 files)
    ├── rank/              — 티어 표시
    ├── spots/             — SpotsClient/SpotCard/SpotMapView/SpotCategoryView/SpotCityView/FestivalCalendar
    ├── stay/              — StayPageClient/StayCard
    └── story/tabs/        — SpecialEventTab
```

### 4-2. shadcn/ui 사용
`components/ui/` 디렉토리에 shadcn/ui 컴포넌트들이 위치 (radix 기반). 사용처 분포는 컴포넌트별로 다름. 가장 많이 import되는 패턴: Button(class-variance-authority 기반), Card 류는 페이지마다 인라인 div + 자체 className으로 더 많이 작성됨 (디자인 일관성보다 페이지별 자율성 우선).

### 4-3. 디자인 시스템 후보 — 현황
| 컴포넌트 | 통일 상태 |
|---|---|
| Button | shadcn ui/Button 있으나 페이지마다 인라인 `<button className="...">` 더 많음 — **인라인 우세** |
| Card | shadcn Card 거의 미사용. 페이지별 `<div className="bg-white rounded-3xl p-X border border-mist shadow-sm hover:shadow-lg ...">` 패턴 반복 |
| Badge | 인라인 `<span className="px-2 py-0.5 rounded-full bg-X-light/40 text-X-deep text-[10px] font-bold">` |
| Modal | radix Dialog (기본 컴포넌트) + custom modal (PassRequiredModal/AvatarCropModal/BranchSelectionModal/ZepAccessModal) 혼재 |
| Tabs | radix Tabs (일부) + 자체 탭 (NavbarTabs/FoodTabNav/StoryTabNav/KFoodCategoryTabs/SpotsClient TABS 등 10+) |
| Input | Form input 인라인 className 위주 — auth/community write 폼이 각자 처리 |

**진단**: 디자인 토큰(색상/간격)은 CSS 변수로 통일되어 있으나, 컴포넌트 추상화 수준은 낮음. 페이지별 `<div>` 인라인 패턴이 우세 — 변경 시 검색·치환 비용 큼.

### 4-4. lucide-react 사용
- **import 빈도**: 거의 모든 page/feature에서 import. 트리쉐이크는 `optimizePackageImports` 설정으로 처리.
- **자주 쓰는 아이콘**: `MapPin/Lock/ChevronRight/ChevronLeft/Camera/Palette/Trophy/Sparkles/Map/Calendar/Folder/Building2/Train/Shirt/UtensilsCrossed/Images`
- **브랜드 아이콘**: `RaindropIcon` (자체 SVG, components/shared/icons/) — 빗방울(LP/크레딧) 통일 작업으로 9곳 일관 적용

---

## 5. 디자인 토큰 / 스타일 시스템

### 5-1. 색상 토큰 (globals.css `@theme`)
| 토큰 | 값 | 용도 |
|---|---|---|
| **mint** | `#B8E8E0` | Primary 기본 |
| **mint-deep** | `#9DD8CE` | Primary 강조 (LP/CTA) |
| **mint-light** | `#D4F0EB` | Primary 배경 |
| **blossom** | `#F5D0D0` | Secondary 벚꽃 |
| **blossom-deep** | `#F0B8B8` | Secondary 강조 |
| **blossom-light** | `#FAE8E8` | Secondary 배경 |
| **sky** | `#A8D4F0` | Accent (오늘/포인트) |
| **sky-light** | `#C8E4F8` | Accent 배경 |
| **lavender** | `#E8C8D8` | 그라데이션 중간 stop |
| **peach** | `#F8E8D0` | Warm 액센트 |
| **snow** | `#FAFBFC` | 페이지 배경 |
| **cloud** | `#F0F2F5` | Subtle 배경 |
| **mist** | `#E4E7EB` | Border 기본 |
| **stone** | `#9CA3AF` | Subtle text |
| **slate** | `#4B5563` | Body text |
| **ink** | `#1F2937` | Headline text |
| lok-success | `#10B981` | 에러 빨강 유지 |
| lok-error | `#EF4444` | |

추가로 shadcn 호환 변수(`--color-background/foreground/primary/secondary/muted/accent/border/input/ring`) + `--radius: 0.75rem`.

### 5-2. 색상 사용 빈도 (top 30, grep)
1. text-slate 581 / 2. text-stone 358 / 3. text-ink 276 / 4. border-mist 272
5. text-mint-deep 190 / 6. bg-slate 126 / 7. border-slate 118 / 8. bg-cloud 101
9. bg-mint-deep 97 / 10. border-mint-deep 94 / 11. from-mint 92 / 12. to-blossom 89
13. text-blossom-deep 74 / 14. bg-snow 55 / 15. bg-mint-light 50 / 16. bg-mist 37
17. border-mint 35 / 18. text-sky 27 / 19. bg-peach 24 / 20. bg-blossom 23
21~30. bg-blossom-deep / border-blossom-deep / bg-mint / border-blossom / bg-stone / to-sky / from-mint-deep / border-sky / border-cloud / bg-sky

**진단**: text-slate(581) > text-stone(358) > text-ink(276) — 텍스트 위계 3단계 정착. mint/blossom 그라데이션이 핵심 액센트 (`from-mint(92) → to-blossom(89)` 짝). sky/peach/lavender는 보조.

### 5-3. 반응형 분기점 사용 빈도
- `md:` **487회** — 압도적 다수 (768px breakpoint 위주)
- `sm:` 83회
- `lg:` 39회
- `xl:` **1회**
- **결론**: 사실상 2-breakpoint 시스템(모바일 / md+). lg+ 분기 거의 없음 → 데스크톱 1280px+ 미세 조정 약함.

### 5-4. typography
- `--font-family-sans`: next/font Inter + Noto Sans KR/JP fallback
- `--font-family-serif`: next/font Playfair Display + Noto Serif KR/JP
- `--font-family-logo`: Georgia/Palatino (브랜드 wordmark 전용)
- `font-display` 클래스 — 큰 타이틀에 사용 (h1/h2)
- 언어별 폰트 자동 전환: `:lang(ko)` Noto Sans KR / `:lang(ja)` Noto Sans JP / `:lang(en)` Inter

### 5-5. radius / shadow
- `--radius: 0.75rem` (12px). 인라인 `rounded-2xl(16px)/rounded-3xl(24px)` 카드에 더 많이 사용.
- 커스텀 shadow 유틸리티 3종 (globals.css):
  - `.shadow-card` — `0 4px 24px rgba(0,0,0,0.06)` 카드 기본
  - `.shadow-card-hover` — `0 12px 40px rgba(0,0,0,0.12)` hover
  - `.shadow-mint` — `0 8px 30px rgba(157,216,206,0.35)` mint glow

### 5-6. 그라데이션 시스템 (P1-4 3-tier)
```
.bg-tier-strong       — mint → lavender → blossom (가치 영역, hero)
.bg-tier-strong-stay  — mint → blossom 2-stop (STAY 전용)
.bg-tier-soft         — mint-light → 흰색 (정보 페이지 hero)
.bg-tier-plain        — 흰색 (사용자 영역)
```

### 5-7. 글로벌 a11y 규칙 (WCAG)
- `*:focus-visible`: 2px solid mint-deep + 2px offset (WCAG 2.4.13)
- `html { scroll-padding-top: 80px }` — sticky 헤더 가림 방지 (WCAG 2.4.11)
- `@media (prefers-reduced-motion)` — 모든 animation 0.01ms (WCAG 2.3.3)
- `:where(button, [role='button'], input[type=checkbox/radio])` 최소 24×24 (WCAG 2.5.8)

### 5-8. Sticky CTA 변수
```css
:root { --cta-height: 0px }
.has-sticky-cta { --cta-height: 64px; padding-bottom: ... env(safe-area-inset-bottom) }
@media (min-width: 768px) { .has-sticky-cta { --cta-height: 0; padding-bottom: 0 }}  /* 데스크톱 미노출 */
```

### 5-9. 다크모드: **미지원**

---

## 6. 다국어 (i18n) 현황

### 6-1. next-intl 설정
- `i18n.ts`: locales `['ko','ja','en','zh-CN','zh-TW']`, default `ko`
- `middleware.ts`: `localePrefix: 'always'` (모든 URL `/{locale}/...` 강제)

### 6-2. messages 파일 통계
| 파일 | 줄수 | 최상위 키 |
|---|---|---|
| ko.json | 2,180 | 43 |
| ja.json | 2,155 | 42 |
| en.json | 2,155 | 42 |
| zh-CN.json | 2,155 | 42 |
| zh-TW.json | 2,155 | 42 |

ko가 1키 더 많음 — ko 우선 추가 후 동기화 누락된 키 1개 가능성.

### 6-3. 다국어 분기 코드
- `:lang(ko/ja/en)` CSS 자동 폰트 전환 (globals.css)
- 컴포넌트 레벨: `LABEL[locale as keyof typeof LABEL] || LABEL.en || LABEL.ko` 패턴 다수 (인라인 i18n)
- food-dupes.ts / regions-hierarchy.ts: `{ ko, ja, en, 'zh-CN', 'zh-TW' }` 5개국어 풀 지원
- 일부 정적 데이터 (zep-spaces.ts 등)는 `{ ko, ja, en }`만 — 중국어 fallback 시 영어 사용

### 6-4. truncate / line-clamp 사용
- `truncate` 46회 / `line-clamp-1` 12 / `line-clamp-2` 15 / `line-clamp-3` 2 / `line-clamp-4` 2 / `line-clamp-5` 1
- 카드 제목/주소/설명에 주로 사용 — **다국어 길이 차이 흡수 핵심 메커니즘**
- 그러나 chip/badge/메타정보(가격/시간/난이도)는 truncate 거의 없음 → **다국어 깨짐 위험 영역**

### 6-5. 다국어 깨짐 위험 영역 (실측)
- HeroPassButtons 패스 카드 가격 — 고정 폭에 ₩2,900 / $5 / ¥350 들어감
- DifficultyBadge / 카테고리 chip — `🌱 쉬움` vs `🌱 Easy` vs `🌱 簡単` 폭 차이
- FoodTabNav / SpotsClient TabNav — 가로 스크롤로 흡수 (아이콘+라벨)
- Course duration_text — `당일치기` vs `Day trip` (영어 더 길음)

---

## 7. 데이터 / API 구조

### 7-1. lib/tour-api/ (TourAPI 추상화)
| 파일 | 역할 |
|---|---|
| client.ts | `callTourApi<T>()` — 5개 locale별 endpoint 자동 라우팅 (Kor/Jpn/Eng/Chs/Cht Service2). `next: { revalidate: 3600 }` 캐싱 |
| area-codes.ts | 17 광역(`PROVINCE_AREA_CODES`) + 26개 시군구(`CITY_AREA_CODES`) 매핑 + `CONTENT_TYPES` (tourist 12 / culture 14 / festival 15 / course 25 / leisure 28 / stay 32) |
| spots.ts | `getAllSpots(locale)` — 17 광역 × 4 type × 30 + 축제 + 정적 SIGHTS, **자동 태그 9종** (`TAG_PATTERNS` + `CAT3_PREFIX_TAG`) |
| restaurants.ts | `fetchRestaurantsByArea/Detail/Images` — 식당 (contentTypeId=39) |
| categories.ts | 음식 cat3 코드 매핑 (한식/이색/카페) |
| stays.ts / stays-cache.ts | 숙박 (contentTypeId=32) — 17 광역 캐싱 + 추천 점수 |
| stay-recommend.ts / stay-tags.ts | 숙박 추천 + 태그 |
| searchKeyword.ts | searchKeyword2 — 키워드 매칭 (local-pick contentid 자동 매칭용) |

### 7-2. Supabase migrations (53개 누적)
주요:
- 035 drop old tier system / 036 withdrawal_requests / 037 gps_verification
- 040 users.birth_date / 044 not_null / 045 parent_consents / 046 oauth grace
- 047 **passes 테이블** (PRD-PRICING-2026-001 — 구독 → 1회 구매 전환)
- 048 missions.is_free (서울 첫 미션 무료)
- 049 drop old subscription / 050 drop credits — 구버전 제거
- 051 search_path / 052 SECURITY DEFINER revoke / 053 mission_photos / 054 feedback rate / 055 RLS WITH CHECK / 056 **gallery 버킷**

### 7-3. lib/data/ (정적 데이터, 크기 top 10)
| 파일 | 크기 | 내용 |
|---|---|---|
| food-dupes.ts | 1.5 MB | 9 도시 × 음식 ~205 entries (5개국어, JP/CN dupes, tasteProfile) |
| hansik-enriched.json | 354 KB | 한식진흥원 데이터 enrichment |
| flag-cooking.ts | 256 KB | 12개국 × fusion 레시피 68 entries |
| food-health.ts | 102 KB | 76 음식 health radar 데이터 |
| pexels-map.json | 95 KB | 음식 → Pexels 이미지 매핑 |
| food-seasonal.ts | 58 KB | 32 제철 음식 (4계절, healthTags) |
| local-picks.ts | 55 KB | 33 도시 외지인 랭킹 (광역 17 + 시 16) |
| sights.ts | 39 KB | 정적 SIGHTS (큐레이션 spot) |
| missions.ts | 30 KB | 코스별 미션 메타 |
| quest-guide.ts | 30 KB | 퀘스트 가이드 prose |

### 7-4. API routes (74개)
주요 카테고리:
- **결제**: `payments/toss/confirm`, `passes/purchase`, `passes/status`, `orders`
- **미션**: `missions/{complete,verify,verify-gps,scan,upload,hint,stats}`
- **커뮤니티**: `community/posts/[postId]/{like,comments}`, `posts`, `recipes`, `upload`, `ads`
- **플래너**: `planner/{add-item,course-missions,distance,hotel,items,trip-setup,ai-curate}`
- **파티**: `party/{create,join,list,my,chat}`
- **숙박**: `tour-stays/{recommend,refresh,tag,test}`
- **LP/티어**: `lp/{apply,history,leaderboard}`, `user/rank`, `user/select-route`
- **상점**: `shop/{coupons,exchange,rank-up}`
- **갤러리**: `gallery/{list,download}` (PASS 게이팅)
- **인증**: `auth/{complete-profile,parent-consent/request,reauth-birth-date}`, `account/delete`
- **관리자**: `admin/{b2b,community,courses,missions,orders,stats,stats/full}`
- **인프라**: `health`, `cron/reauth-reminders`, `affiliate/click`, `feedback`, `report`, `weather`, `spots`, `dupe/{ai-match,taste-match}`, `memories/{photo,photos}`, `goods-notify`, `founding-members/count`, `mission-register`, `review/{check,submit}`, `profile`, `upload/recipe-photo`

---

## 8. 로딩 / 빈 상태 / 에러 / 인증 게이트

### 8-1. loading.tsx 위치
- `/[locale]/loading.tsx` (글로벌)
- `/[locale]/community/loading.tsx`
- `/[locale]/courses/loading.tsx`
- `/[locale]/diy/loading.tsx`
- `/[locale]/food/loading.tsx`
- `/[locale]/missions/loading.tsx`
- `/[locale]/ootd/loading.tsx`
- `/[locale]/story/loading.tsx`

총 **8개**. 페이지별 카피는 통일성 약함 (각 페이지가 자체 카피).

### 8-2. error.tsx / not-found.tsx
- `/[locale]/error.tsx` — `'use client'` + 인라인 스타일만 (CLAUDE.md rule #3 강제)
- `/[locale]/not-found.tsx` — `'use client'` + 인라인 스타일만 (rule #8 — `<html><body>` 금지)
- 404 페이지 디자인: 단순 메시지 + 홈으로 링크 (외부 컴포넌트 import 0)

### 8-3. 미들웨어 redirect 경로
- 비공개 경로 + 비로그인 → `/{locale}/auth/login?next={원경로}`
- 일일 정원 초과 또는 maintenance mode → `/{locale}/maintenance`
- 14세 미만 → `/{locale}/auth/age-restricted`
- OAuth 로그인 후 birth_date 미입력 → `/{locale}/auth/complete-profile`

### 8-4. PASS 게이팅
- `lib/auth/pass.ts` `hasActivePass()` + `TEST_MODE=true` 우회
- 게이팅 적용 페이지: `/gallery` (다운로드), `/courses/[id]` (LockScreen 6종), `/missions/*` (활성 패스 검사)

### 8-5. 카피 톤
- 로그인 화면: "전설의 세계로 입장하세요" 류 (한국 IP 컨셉 강조)
- 빈 상태: 페이지마다 다름 (통일 약함). MEMORIES 빈 상태 / FAQ 검색 결과 0 / 갤러리 빈 등 각자 카피
- "구름이 ..." 류 캐릭터 카피는 없음 (브랜드는 "Clouds with you"이나 캐릭터 voice는 미정착)

---

## 9. 이미지 / 에셋 관리

### 9-1. public/images/ 디렉토리
```
public/
├── icons/
├── images/
│   ├── beauty-category/   — 6장 (피부/항산화/면역/소화/다이어트/뼈관절)
│   ├── courses/           — 코스 썸네일
│   ├── dupe-country/      — JP/CN 국가 카드
│   ├── explore/           — 탐험 이미지
│   ├── flagfd/            — 12개국 fusion 레시피
│   ├── food/              — 음식 사진 (도시별)
│   ├── home/              — 홈 hero/슬라이드
│   ├── kits/              — 키트 (제주/전주 등)
│   ├── matching/          — 매칭 이미지
│   ├── pass/              — 패스 카드
│   ├── region-card/       — 6 권역 카드 (서울경기/충청도/강원도/전라도/경상도/제주도)
│   ├── season-card/       — 봄/여름/가을/겨울 4장
│   └── village/           — 도시 대표 이미지
├── videos/                — 홈 hero 비디오
└── (top-level)
    ├── category-{create/fashion/food/sights/stay/story/style}.png  — OG 카테고리 7장
    ├── dokkaebi-hero.png  — 홈 hero 도깨비 (브랜드 핵심 이미지)
    ├── korea-map.png
    └── world-map-legend.png
```

총 **288 이미지** (.png/.jpg/.jpeg/.webp/.svg).

### 9-2. Supabase Storage 버킷
- **food-images** (food-dupes 음식 사진 일부)
- **gallery** (056 migration — PASS 전용, RLS: passes.status='active' AND expires_at > now())

### 9-3. next/image 사용
- 거의 모든 카드/hero에서 사용
- `unoptimized={spot.source === 'tourapi'}` — 외부 URL은 프록시 우회
- TourAPI 이미지(`tong.visitkorea.or.kr` http+https) — Mixed Content는 CSP `upgrade-insecure-requests`로 silently 처리
- 카드별 sizes 명시 (`(max-width: 768px) 100vw, 33vw`) — 반응형 최적화

### 9-4. 한국적 무드 이미지 매핑
| 영역 | 이미지 | 무드 강도 |
|---|---|---|
| 홈 hero | dokkaebi-hero.png | ★★★★★ (도깨비 일러스트, 핵심 IP) |
| beauty-category | 한복 컨셉 일러스트 6장 | ★★★★ |
| season-card | 한복 컨셉 사계절 4장 | ★★★★ |
| region-card | 6 권역 풍경 사진 | ★★★ |
| courses 썸네일 | 코스별 (전주 한옥/경주 등) | ★★★★ |
| food | 한식 실사 사진 | ★★ (실용 위주) |
| sights | TourAPI 외부 사진 | ★ (관광 일반) |
| dupe-country | JP/CN 캐릭터 일러스트 | ★★ |

### 9-5. alt 텍스트
- 거의 모든 `<Image>` 에 alt 명시 (lucide-react 아이콘은 `aria-hidden` 다수)
- 누락 잠재 영역: 인라인 emoji는 텍스트로 처리되어 alt 무관

---

## 10. 인터랙션 / 애니메이션

### 10-1. transition / animate 클래스
- `transition-all duration-300` / `transition-colors` / `transition-transform` / `transition-opacity` — 카드 hover 표준
- `hover:-translate-y-1` + `hover:shadow-lg` — 카드 들어올림 패턴 (discover/community/food/seasonal/beauty 통일)
- `group-hover:scale-105` — 이미지 zoom on hover

### 10-2. 외부 애니메이션 라이브러리
- **framer-motion 미사용** (package.json에 없음)
- 모든 애니메이션 CSS keyframes 또는 Tailwind transition
- globals.css 커스텀 keyframes 5종:
  - `@keyframes travel/travelFlight` — 교통 경로 (TRAFFIC 페이지)
  - `@keyframes lineAppear` — 플래너 타임라인 (7 라인)
  - `@keyframes shimmer` — skeleton 로딩
- ZepBanner / ZepMeetingButton inline `<style jsx>` keyframes (zepFloat/zepDrift/zepChat/zepIcon/zmbRight/zmbLeft/zmbBubble)

### 10-3. 슬라이더/캐러셀
- 외부 라이브러리 미사용 (embla/swiper/keen-slider 모두 미사용)
- 자체 구현:
  - HomeFeatureCarousel — 자동 슬라이드 (홈)
  - QuestStorySlider — 4 카드 (코스 상세)
  - CourseSlider → grid로 변경 이력 (스토리 탭)
  - DupeSwipeContainer — Tinder 식 스와이프 (food/dupe — 비활성화 이력)

### 10-4. 모달 / 드롭다운
- radix Dialog 기반 모달: PassRequiredModal, AvatarCropModal, BranchSelectionModal, ZepAccessModal, CreatePartyModal, CourseCompletionModal
- 자체 구현 모달: ReauthBirthDateModal
- 드롭다운: NavbarTabs (4탭 hover dropdown — 신규 작업), Navbar 사용자 드롭다운 (group-hover)

---

## 11. 접근성 (a11y)

### 11-1. aria 속성 빈도
- aria-label 47회 / aria-hidden 38회 / aria-modal 9회 / aria-expanded 6회 / aria-invalid 5회 / aria-labelledby 4회 / aria-describedby 4회 / aria-pressed 2 / aria-live 2 / aria-controls 2

### 11-2. semantic HTML
- `<nav>` (Navbar/MobileHeader/NavbarTabs)
- `<header>` `<footer>` (layout 단)
- `<section>` 페이지 섹션 구분 다수 (특히 courses/[id])
- `<article>` 사용 적음 — 카드 대부분 `<div>` 또는 `<Link>` (article 누락)

### 11-3. 키보드 네비게이션
- `*:focus-visible` 글로벌 outline (mint-deep 2px)
- 대부분 `<button>` `<Link>` `<input>` 표준 요소 사용 → 자연 키보드 지원
- NavbarTabs 드롭다운 — `aria-haspopup` / `aria-expanded`만 추가, 화살표 키 네비게이션 미구현

### 11-4. 색 대비 잠재 이슈
- text-stone (`#9CA3AF`) on bg-snow (`#FAFBFC`) — WCAG AA 비대비 4.5:1 미달 가능
- text-white on `bg-tier-soft` (mint-light → 흰색 그라데이션) — 대비 부족 위험
- text-mint-deep (`#9DD8CE`) on white — 강조 텍스트로는 대비 부족

### 11-5. form label 연결
- LoginForm/SignupForm/CommunityWriteForm 등 — `<label htmlFor="...">` + `<input id="...">` 패턴 일부 사용. 전수 검증 필요.

---

## 12. 모바일 대응

### 12-1. 분기점 (재게)
md: 487 / sm: 83 / lg: 39 / xl: 1 — **사실상 2-breakpoint** 시스템

### 12-2. 모바일 전용 컴포넌트
- `components/shared/MobileHeader.tsx` — 햄버거 메뉴 (md 미만 노출)
- `components/shared/StickyCTA.tsx` — 모바일 하단 sticky CTA (md 이상 미노출)

### 12-3. 데스크톱 / 모바일 분기
- Navbar.tsx: `hidden md:block` (데스크톱) / `<MobileHeader />` (모바일)
- 카트/플래너/유저드롭다운: `hidden md:flex` 또는 `hidden md:block`
- 안전망 globals.css line 28-40: Tailwind 빌드 누락 회귀 방지용 `.md\:flex/block/hidden` 직접 정의

### 12-4. 햄버거 / 하단 네비
- 햄버거: MobileHeader 우상단 — 클릭 시 사이드 패널
- 하단 네비: 별도 BottomNav 컴포넌트 없음 (홈 base가 sticky CTA 차지)

### 12-5. 터치 인터랙션
- WCAG 2.5.8 — `:where(button, [role='button'], input[checkbox/radio])` 최소 24×24
- DupeSwipeContainer 식 swipe 인터랙션 1곳 (현재 비활성화)
- 카드 클릭 영역 충분 (전체 카드 `<Link>` wrap)

---

## 13. 디자인 일관성 / 무드 분석

### 13-1. 페이지 무드 분류표
| 페이지 | 무드 | 주조색 | 이미지 톤 |
|---|---|---|---|
| `/` 홈 | 정보집약 + 한국 IP 강조 | mint→lavender→blossom (tier-strong) | 도깨비 일러스트 (강함) |
| `/discover` | 미니멀 정보 허브 | mint border + 흰 카드 | 이미지 X (lucide 아이콘만) |
| `/stay` | 정보집약 | 흰 + mint 액센트 | TourAPI 외부 사진 |
| `/food/dupe` | 정보집약 | 흰 + 도시 emoji + mint | 음식 실사 |
| `/food/dupe/[foodId]` | 정보집약 + 시각화 | mint-light 스토리 박스 + radar | 음식 실사 |
| `/food/beauty` | 한국 IP 강조 | 카드: mint hover | 한복 일러스트 (강함) |
| `/food/seasonal` | 한국 IP 강조 | 4계절 그라데이션 + mint | 한복 일러스트 (강함) |
| `/food/kfood-spot` | 정보집약 | 흰 + 도시 emoji | TourAPI 외부 사진 |
| `/food/flag-cooking` | 정보집약 | 12개국 국기 컬러 | flagfd 이미지 |
| `/ootd` | 정보집약 | 흰 + 오늘=mint→sky 하이라이트 | OOTD 사진 |
| `/traffic` | 정보집약 + 애니메이션 | mint 경로 애니 | 일러스트 |
| `/sights` | 정보집약 | 흰 + tier-soft hero | TourAPI 외부 (혼재) |
| `/gallery` | 미니멀 | 흰 + lock 회색 | 사이트 자체 사진 |
| `/courses/[id]` | 한국 IP + 정보 | tier-strong-stay hero | 코스 썸네일 (한옥/궁) |
| `/pass` | 가치 영역 강조 | tier-strong (3 stop) | 패스 일러스트 |
| `/community` | 미니멀 정보 허브 | 흰 + mint/blossom 액센트 | 이미지 X (lucide 아이콘) |
| `/memories` | 정보집약 + 패스포트 | mint + 도장 | 사용자 사진 + 패스포트 stamp |
| `/auth/login` | 한국 IP 강조 ("전설") | tier-soft | 로그인 일러스트 |
| `/story` | 정보집약 | tier-soft + mint→blossom (special) | 코스 썸네일 |

### 13-2. 톤 일관성 평가
**일관 영역**:
- 색상 토큰 통일 (mint/blossom/sky/peach + ink 4단계 textsystem)
- 카드 패턴 통일 (`bg-white rounded-3xl/2xl border border-mist shadow-sm hover:shadow-lg hover:-translate-y-1`)
- 아이콘 lucide-react 단일화
- 그라데이션 3-tier 시스템 (`bg-tier-strong/-stay/-soft/-plain`)

**충돌 영역**:
- 홈 hero 도깨비 일러스트(★★★★★ 강함) vs Discover 미니멀 흰 카드 + 아이콘만(★) — **무드 갭 큼**
- food/beauty + food/seasonal 한복 일러스트(★★★★) vs sights TourAPI 외부 사진(★) — 외국인이 같은 사이트로 인지하기 어려울 수 있음
- 5개 locale 간 디자인 차이 없음 (텍스트만 변경)

### 13-3. 외국인 타겟 관점 "한국적 무드" 강도 매핑
| 강도 | 페이지/컴포넌트 |
|---|---|
| ★★★★★ | 홈 hero (도깨비), `/courses/[id]` (전래동화 IP) |
| ★★★★ | `/food/beauty` (한복), `/food/seasonal` (한복), `/auth/login` (전설 카피), `/memories` (디지털 패스포트 도장) |
| ★★★ | `/food/flag-cooking` (12개국 국기), `/food/dupe/[foodId]` (음식 스토리), `/region-card` (한국 풍경) |
| ★★ | `/food/dupe` 도시 emoji, `/food/kfood-spot` |
| ★ | `/discover`, `/sights`, `/community`, `/gallery`, `/pass` |

**진단**: 한국 IP 강도가 영역마다 큰 편차. 외국인에게는 홈 → discover 진입 시 "한국다움"이 갑자기 사라지는 인상.

---

## 14. 퍼포먼스 / 알려진 이슈

### 14-1. /sights 첫 SSR 3-5초
- 원인: [lib/tour-api/spots.ts:155-192](lib/tour-api/spots.ts) `getAllSpots()`
  - 17 광역 × Promise.all([4 type fetch + festival fetch]) = **85 fetch 동시**
  - TourAPI revalidate=3600s 캐싱(`callTourApi` 내부) → 첫 방문은 비캐시
- 캐싱 후 ~50-200ms

### 14-2. 페이지네이션 / 가상 스크롤
- **미적용** — `/sights` ~2,040 spot 한 번에 client에 전달
- `/food/dupe/[region]` 음식 list, `/food/seasonal` 32 음식, `/community` 피드 모두 페이지네이션 없음
- 프로덕션 적용 시 가상 스크롤 권장 (특히 sights, memories)

### 14-3. 이미지 lazy loading
- next/image 기본 lazy loading 적용
- 명시적 `priority` 적용: 홈 hero 등 LCP 후보
- `loading="lazy"`/`eager` 명시는 거의 없음 — next/image가 자동 처리

### 14-4. bundle size top 5
1. `/missions/scan` 113 kB(라우트) + 231 kB First Load — html5-qrcode SDK
2. `/admin/stats` 39.7 kB + 225 kB — recharts + 통계
3. `/sights` 47.7 kB + 168 kB — SpotsClient 전체
4. `/memories` 25.6 kB + 226 kB — DigitalPassport + LegendShop + 갤러리
5. `/missions/[id]/[mid]` 25.1 kB + 170 kB — 4 미션 타입 코드

### 14-5. RSC vs Client 분포
- `'use client'`: components 141개 / app 9개 (page 단)
- 페이지 RSC 우세 (대부분 page.tsx는 server). interactivity 컴포넌트만 client.
- 일부 페이지는 client 페이지 (예: `/[locale]/missions/scan`은 QR 스캐너로 인해 client)

---

## 15. 멘토 핵심 화면 추천

### 15-1. 디자인 관점 가장 잘 만들어진 페이지 3
1. **`/discover`** — 3-tier 위계(STAY 큰 / K-FOOD·OOTD 중간 / TRAFFIC·SPOT·GALLERY 작은) 카드 시스템이 명확. 정보 가중치 시각화 모범.
2. **`/food/dupe/[region]/[foodId]`** — 음식 스토리 + 재료 + radar 차트 + 듀프 + 맛집 연결. 단일 페이지 안에 5개 정보 레이어 정돈.
3. **`/food/seasonal`** — 4계절 카드 → 12개월 달력 토글 → 음식 그리드 2단계 네비. 한복 일러스트 + 그라데이션이 한국적 무드 살림.

### 15-2. 디자인 관점 개선 시급한 페이지 3
1. **`/sights`** — 5탭/2,040 spot/SSR 3-5초/페이지네이션 X. 가장 무거운 정보 페이지인데 정보 위계 약하고 사용자 인지 부담 큼.
2. **`/memories`** — 226 kB First Load JS, 4 영역(사진/패스포트/상점/랭킹) 한 페이지에 압축. 분리 또는 lazy 권장.
3. **홈 ↔ /discover 무드 갭** — 홈 도깨비 hero(★★★★★) 후 discover 흰 카드(★)로 떨어짐. 외국인 첫 인상 일관성 부족.

### 15-3. 멘토에게 처음 보여줄 페이지 1
**`/courses/[courseId]`** (예: `/ko/courses/11111111-1111-1111-1111-000000000001` 전주 도깨비 코스)
- 이유: 사이트의 핵심 가치(전래동화 IP + GPS 미션 + 패스 결제 + 커뮤니티 파티 + ZEP 가상 모임 + 제휴)가 모두 보임. 기획·개발·디자인 의사결정의 결정체.
- 멘토 즉시 파악 포인트: QuestHero(IP 톤), MissionKakaoMap(인터랙션), LockScreen(결제 게이팅), AffiliateLinks(B2B), 207 kB First Load(번들 비용).

---

## 부록 A. 컴포넌트 카운트 요약

총 192 .tsx (components/). 디렉토리별:
- features/food: ~25
- features/quest: ~15
- features/missions: ~15
- features/community: 10
- features/auth: 10
- features/planner: ~10
- features/mypage: ~10
- features/spots: 6
- features/home: 6
- features/courses: 2
- features/dashboard: 3
- features/gallery: 1
- features/goods: 4
- features/memories: 2
- features/pricing: 3
- features/purchase: 4
- features/admin: 1
- features/rank: (소수)
- features/stay: 2
- features/story/tabs: 1
- features/camera: 2
- ui (shadcn): ~10-15
- shared: ~15
- shared/icons: 1 (RaindropIcon)
- seo: 4
- ootd: 1
- diy: 1

---

## 부록 B. 데이터 흐름 핵심 다이어그램 (텍스트)

```
사용자 → middleware (locale + auth + visitor gate + rate limit)
  ├ PUBLIC: /, /discover, /community, /story, /pass, /courses, /stay, /sights
  └ AUTH 필요: 그 외 + admin (admin는 role 추가)

서버 컴포넌트 page.tsx
  ├ Supabase (createServerClient) — users/courses/missions/passes/affiliate_links/...
  ├ TourAPI (callTourApi → revalidate 3600s) — spots/restaurants/festivals/stays
  ├ 정적 데이터 (lib/data/*.ts) — food-dupes/seasonal/health/local-picks/sights
  └ getTranslations (next-intl/server) — messages/{locale}.json

클라이언트 컴포넌트
  ├ Supabase (createClient) — auth getUser/profile, 일부 fetch
  ├ /api/* fetch — party/planner/missions/lp/...
  ├ Kakao Map SDK (script tag, 지연 로드)
  ├ Toss SDK (결제 위젯)
  └ html5-qrcode (QR 스캐너)
```

---

**보고서 끝.**
