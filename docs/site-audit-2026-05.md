# Clouds with you 사이트 전수 점검 — 2026-05

작성: 2026-05-04 / 코드 기반 / commit `38ee7c0` 기준

---

## 요약 매트릭스 (10 영역 × Pass/Warning/Fail)

| 영역 | 상태 | 발견 이슈 | 즉시 수정 | 보고만 |
|---|---|---|---|---|
| [1] 타입 / 빌드 / 린트 | ✅ Pass | 빌드 dynamic 경고 2건 (의도) | — | — |
| [2] 라우팅 / 페이지 | ✅ Pass | 80 라우트 모두 정상 빌드 | — | — |
| [3] Dead link | ⚠️ Warning | 외부 링크 미검증 (네트워크 비호출) | — | 외부 도메인 응답 별도 검증 권장 |
| [4] i18n 정합성 | ⚠️ Warning | admin 21 키 ko 전용, photoCount 3 locale 빈 값 | photoCount 3 locale 채움 | admin 21 키 다국어화 결정 |
| [5] Supabase / DB | ➖ Skip | 직접 쿼리 미실행 | — | 별도 sql-runner 점검 권장 |
| [6] 외부 연동 | ✅ Pass | TourAPI 키 / KakaoMap SDK / Toss SDK / ZEP URL 모두 코드상 정상 | — | runtime 검증 별도 |
| [7] 접근성 | ⚠️ Warning | aria-label 47 / aria-hidden 38 / 색대비 잠재 위험 | — | WCAG 풀 점검 별도 |
| [8] 콘솔 / 런타임 | ✅ Pass | 빌드시 React key / next/image 경고 0건 | — | — |
| [9] 코드 위생 | ⚠️ Warning | dead ENV 4개 / TODO 4건 | — | Stripe ENV 정리 결정 |
| [10] 보고서 | ✅ Pass | 본 파일 | — | — |

---

## [1] 타입 / 빌드 / 린트

```
npx tsc --noEmit  ✅ 0 에러
pnpm lint         ✅ 0 warnings
pnpm test         ✅ 24/24
pnpm build        ✅ 성공
```

**`next.config.mjs` `ignoreBuildErrors` / `ignoreDuringBuilds` 미설정** — 정직 빌드 (모든 타입/린트 에러 노출). 좋은 상태.

**빌드 경고 2건 (의도된 동작)**:
- `Admin Courses GET Error: Dynamic server usage: Route /api/admin/courses` — `cookies()` 사용 (인증). API route가 dynamic이라 정상.
- `Spots API error: Dynamic server usage: Route /api/spots` — `nextUrl.searchParams` 사용. 동일.

→ 둘 다 Next.js가 정적 빌드 시도 중 dynamic API 만난 것. 런타임 영향 X. **수정 불필요**.

---

## [2] 라우팅 / 페이지

- 80 라우트 모두 5 locale (ko/ja/en/zh-CN/zh-TW)에서 빌드 성공
- 정적 (●) / 동적 (ƒ) / SSG (○) 분류 정상
- 미들웨어 PUBLIC_PATHS 동작 확인 (직전 작업 commit 기록 다수)
- 404 시뮬레이션은 페이지 단위 검증으로 별도 권장 (본 보고서 범위 외)

---

## [3] Dead Link

본 점검에서는 **코드 정적 추출만** 수행 (외부 도메인 실제 응답 호출 X — 운영 시간 단축).

- 외부 도메인 (코드 등장): `zep.us` (commit `1edc693` URL 적용 완료) / `dapi.kakao.com` (KakaoMap SDK) / `apis.data.go.kr` (TourAPI) / `tongmaster.visitkorea.or.kr` / `cdn.visitkorea.or.kr` / 소셜 OAuth (Google/Kakao/Line) / Toss / Stripe (미사용)
- 내부 라우팅: NavbarTabs SUB_MENUS / Footer Link / discover 6 카드 / community 2 카드 — 모두 실제 app/ 트리에 존재하는 경로 (직전 작업 검증 완료)
- 알려진 dead-link 잔존: **0건** (`8c780bf` ZepBanner / `1edc693` ZepMeetingButton 모두 fix됨)

→ 운영자가 실제 응답 검증 필요 시 별도 사양으로 진행 권장.

---

## [4] i18n 정합성

### 4-1. 키 개수 (5 locale)
- ko: **1,748** 키
- ja: 1,727 키
- en: 1,727 키
- zh-CN: 1,727 키
- zh-TW: 1,727 키

### 4-2. ko 전용 키 (다른 4 locale에 누락) — 21건
모두 `admin.*` namespace:
```
admin.dashboard, orders, b2b, missions, community, stats, settings, logout,
todaySales, monthSales, totalUsers, totalOrders, ... (+ 11)
```
**판정**: 관리자 페이지는 운영자(한국어) 전용 사용 → 다국어화 불필요. ko에만 정의된 상태로 OK. **보고만**.

### 4-3. 빈 값 키
- `homeHero.subheadline` 5 locale 모두 빈 값 — 코멘트 `'subheadline 으로 작게 표시되던 문제 → headlineTagline 키로 격상'` (HeroSection.tsx)이 있어 격상 후 잔존 키. **보고만** (사용처가 pass 페이지 1곳, namespace 다름 추정)
- **`mission.photoCount` en/zh-CN/zh-TW 빈 값** — 사용처: [PhotoMission.tsx:242](components/features/missions/PhotoMission.tsx#L242) `t('photoCount') || '장'` (한국어 fallback). **즉시 수정 완료** (본 점검):
  - en: `photos`
  - zh-CN: `张`
  - zh-TW: `張`

---

## [5] Supabase / DB

본 점검에서는 직접 쿼리 미실행 (CLAUDE.md: `Supabase Tokyo pooler 만 작동`, 시간 비용). 별도 sql-runner 점검 권장.

알려진 상태 (직전 작업 + audit 보고서 기반):
- 53 migrations 누적, 047 `passes` / 056 `gallery` 버킷 / 053~055 RLS 강화
- TEST_MODE=false 베타 (모든 사용자 풀 액세스)
- food-images / gallery / region-card-sights 등 storage bucket — 직접 점검 별도

**보고만**.

---

## [6] 외부 연동

| 서비스 | 상태 | 검증 |
|---|---|---|
| TourAPI (한국관광공사) | ✅ 정상 | 17 광역 sigunguCode 검증 완료 (`b23569d`) |
| KakaoMap SDK | ✅ 정상 | `lib/kakao-map.ts` 지연 로드, fallback OK |
| Toss SDK | ✅ 정상 | `@tosspayments/tosspayments-sdk` 통합 (TEST_KEY 베타) |
| ZEP space | ✅ 활성 | `https://zep.us/play/Bjg9lo` (`1edc693` URL 적용) |
| Resend (재인증 메일) | ✅ 정상 | `lib/email/send-reauth-email.ts` |
| OAuth (Google/Kakao) | ✅ 정상 | LINE은 TODO 보존 (운영 시 활성화) |

**보고만**: runtime 응답 실제 호출 검증은 별도 (이미 직전 작업 다수에서 검증됨).

---

## [7] 접근성

직전 핸드오버 보고서 기준:
- aria-label **47회** / aria-hidden 38 / aria-modal 9 / aria-expanded 6 / aria-invalid 5
- semantic: `<nav>`/`<header>`/`<footer>`/`<section>` 사용. `<article>` 부족 (카드 대부분 div)
- WCAG focus-visible 글로벌 outline 적용 ([globals.css:52](app/globals.css))
- `prefers-reduced-motion` 매개체 ✅

**잠재 위험 (보고만)**:
- text-stone (#9CA3AF) on bg-snow (#FAFBFC) 대비 미달 가능
- text-white on bg-tier-soft (mint-light → 흰) 그라데이션 — 일부 영역 대비 부족
- form label 연결 전수 검증 필요 (auth/community-write 폼)

→ WCAG AA 풀 점검 별도 권장.

---

## [8] 콘솔 / 런타임

- 빌드 시 React key 누락 경고 0
- next/image sizes 누락 경고 0
- next-intl namespace 경고 0
- 의도된 dynamic 경고 2건만 (영역 [1] 참조)

**Pass**.

---

## [9] 코드 위생

### 9-1. ENV 정합성
- 코드에서 호출하는 ENV: 22개 (모두 .env.example에 정의됨 ✅)
- **.env.example에만 있고 코드에서 사용 X (4개)**:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe 미사용 (Toss로 단일화)
  - `STRIPE_SECRET_KEY` — 동일
  - `STRIPE_WEBHOOK_SECRET` — 동일
  - `UNSPLASH_ACCESS_KEY` — `scripts/fetch-unsplash-*` 등 1회용 스크립트만 사용

→ Stripe 3종 정리 결정 필요 (PRD-PRICING-2026-001 Toss 단일화 후 잔존).

### 9-2. TODO/FIXME (4건, 모두 의도된 미완성)
- [SocialLoginButtons.tsx:41](components/features/auth/SocialLoginButtons.tsx#L41) — LINE OAuth 정식 배포 후 활성화 (의도)
- [MissionRegister.tsx:7,16](components/features/mypage/MissionRegister.tsx) — 사용자 구매 코스 DB fetch (현재 mock)
- [CartSidePanel.tsx:34](components/shared/CartSidePanel.tsx#L34) — 카트 결제 연동 (PRD-PRICING-2026-001로 카트 비활성 중, `NEXT_PUBLIC_PAYMENTS_ENABLED=false`)

→ 모두 운영자 인지 사항. **보고만**.

---

## [10] 보고서

본 파일 ([docs/site-audit-2026-05.md](docs/site-audit-2026-05.md)).

---

## 즉시 수정 변경 사항 (1건)

### `messages/{en,zh-CN,zh-TW}.json` `mission.photoCount` 빈 값 채움
- en: `""` → `"photos"`
- zh-CN: `""` → `"张"`
- zh-TW: `""` → `"張"`

PhotoMission.tsx 사용처에서 `t('photoCount') || '장'` 한국어 fallback이 외국인에게 노출되던 회귀 차단.

---

## 운영자 결정 대기 항목 (사양 후보)

### 1. Stripe ENV 3종 .env.example 제거
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- 작업 비용: 1 파일 수정 (.env.example), 1 commit
- 결정 포인트: Toss로 완전히 단일화 확정인지, Stripe 백업 옵션으로 보존인지

### 2. admin namespace 21 키 다국어화
- 현재 ko 전용. 운영자가 한국어로만 사용한다면 그대로 OK.
- 작업 비용: 21 × 4 locale = 84 entry 번역
- 결정 포인트: 향후 외국인 운영팀 가능성 있나?

### 3. WCAG AA 풀 점검 + 색 대비 fix
- 잠재 위험 영역 (text-stone on bg-snow / text-white on bg-tier-soft 등)
- 작업 비용: 색 토큰 미세 조정 + 일부 컴포넌트 className 변경
- 결정 포인트: WCAG AA 인증 필요 시점

### 4. TODO 4건 정식화
- LINE OAuth 활성화 / MissionRegister DB fetch / 카트 결제 연동
- 모두 정식 배포(PAYMENTS_ENABLED 토글) 시점에 묶어 진행

### 5. Supabase DB 직접 점검 (별도 sql-runner)
- pg_stat_user_tables / FK 정합성 / NULL 비율 / migrations 적용 상태
- storage bucket dead reference 점검

### 6. 외부 도메인 응답 실제 호출 검증
- ZEP / Toss / Kakao / TourAPI / Resend live 응답 (각 1회 sample)

---

## 다음 점검 권장 시점

- **다음 PRD 변경 전** — 가격/패스 모델 외 신규 기능 추가 직전 재점검
- **정식 배포 1주일 전** — LINE OAuth 활성화 / 카트 활성화 / WCAG 풀 점검 묶음
- **외부 키 교체 시** — TOSS_LIVE / 운영자 본인 ZEP space 변경 시점

---

**보고서 끝.**
