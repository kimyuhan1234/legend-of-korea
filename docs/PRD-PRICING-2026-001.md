# PRD-PRICING-2026-001 — 요금제 전면 개편

**작성일**: 2026-04-28
**적용일**: 2026-04-28 (베타 사용자 0 명, 데이터 마이그레이션 불필요)
**상태**: 적용 완료 (Phase A~J)

---

## 1. 배경

기존 시스템: 4 패스 구독 모델 (Move / Live / Story / All in One)
- 월간 반복 매출
- 카테고리별 기능 분리
- credits 시스템 부수 결합 (Planner 등)

문제:
- 단기 여행자 (외국인 관광객) 페르소나와 안 맞음 — 월간 구독 가입 후 1 회 사용 후 방치
- 카테고리 분리가 사용자 멘탈 모델과 불일치 — "어느 패스가 내게 맞나?" 의사결정 부담
- credits 시스템이 핵심 가치 소비를 방해

신규 시스템: **3 패스 1 회 구매 모델 (Short / Standard / Long)**
- 단발성 매출
- 기간 단위 (여행 일정과 1:1 매칭)
- 구매 후 모든 유료 콘텐츠 풀 액세스

---

## 2. 데이터 모델

### 2.1 `passes` 테이블 (신규 — 047)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK auth.users | ON DELETE CASCADE |
| `type` | VARCHAR(20) | `'short' \| 'standard' \| 'long'` |
| `price_krw` | INTEGER | 구매 시점 가격 (스냅샷) |
| `duration_days` | INTEGER | 7 / 15 / 30 |
| `purchased_at` | TIMESTAMPTZ | |
| `expires_at` | TIMESTAMPTZ | `purchased_at + duration_days` |
| `payment_id` | VARCHAR(100) | Toss paymentKey |
| `status` | VARCHAR(20) | `'active' \| 'expired' \| 'refunded'` |
| `refunded_at` | TIMESTAMPTZ | |

### 2.2 `missions.is_free` 컬럼 (신규 — 048)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `is_free` | BOOLEAN DEFAULT FALSE | 무료 미션 플래그 |

서울 코스의 첫 미션 (`courses.region='seoul' AND missions.sequence=1`) 만 TRUE.

### 2.3 폐기 — 049 / 050

- `subscription_plans` (DROP CASCADE)
- `user_subscriptions` (DROP CASCADE — credits_remaining 등 함께 제거)
- `credit_purchases` (DROP CASCADE — 017 에 정의)
- `credit_usage` (DROP CASCADE — 017 에 정의)
- `travel_plans` / `plan_items` 은 **유지** (Planner 자체는 베타 무료로 운영)

---

## 3. 요금제 (3 패스)

| 패스 | 가격 (KRW) | 기간 | 일평균 | 배지 |
|---|---|---|---|---|
| Short | 2,900 | 7 일 | ₩414 | — |
| Standard | 4,900 | 15 일 | ₩327 | most_popular |
| Long | 7,900 | 30 일 | ₩263 | — |

5 lang locale 환산은 [lib/currency.ts](../lib/currency.ts) `formatPriceParts(krw, locale)` 사용.

---

## 4. 기능 액세스 매트릭스

| 기능 | 비로그인 | 무료 회원 | 활성 패스 보유 |
|---|---|---|---|
| 서울 첫 미션 (`is_free=true`) | ✅ | ✅ | ✅ |
| 그 외 모든 미션 | ❌ → /pricing | ❌ → /pricing | ✅ |
| K-Food 듀프매칭 | ❌ → /pricing | ❌ → /pricing | ✅ |
| K-Food 뷰티푸드 | ❌ → /pricing | ❌ → /pricing | ✅ |
| K-Food 퓨전 레시피 | ❌ → /pricing | ❌ → /pricing | ✅ |
| SPOT 풀버전 | ❌ → /pricing | ❌ → /pricing | ✅ |
| Planner | ✅ (베타 무료) | ✅ (베타 무료) | ✅ |
| 커뮤니티 / 기록관 | ❌ → /auth/login | ✅ | ✅ |

> Planner 가격 정책은 정식 출시 시 재논의 (PRD 매트릭스 미명시).

---

## 5. 백엔드 인프라

### 5.1 [lib/data/passes.ts](../lib/data/passes.ts)

```ts
export type PassType = 'short' | 'standard' | 'long'
export const PASSES: Record<PassType, Pass>
export const PASS_TYPES: PassType[]
```

### 5.2 [lib/auth/pass.ts](../lib/auth/pass.ts) (신규)

| 함수 | 설명 |
|---|---|
| `getActivePass(userId): ActivePass \| null` | 활성 패스 조회 (TEST_MODE 우회 포함) |
| `hasActivePass(userId): boolean` | 활성 패스 보유 여부 |
| `canAccessMission(userId, missionId)` | `is_free` 또는 활성 패스면 true |
| `canAccessPaidContent(userId)` | 활성 패스 필요한 콘텐츠 (K-Food / SPOT) |

### 5.3 API

- `GET /api/passes/status` — 활성 패스 조회
- `POST /api/passes/purchase` — 패스 생성 (Toss 결제 검증 후)

### 5.4 Hook

- `hooks/usePassStatus.ts` — SWR 기반 클라이언트 hook

---

## 6. 잠금 화면 카피 (5 lang)

`messages.pricing.lockScreen.{type}` 6 종:

| 키 | 트리거 |
|---|---|
| `mission_second` | 두 번째 미션 진입 시 |
| `kfood_dupe_match` | 듀프매칭 페이지 |
| `kfood_beauty` | 뷰티푸드 페이지 |
| `kfood_fusion` | 퓨전 레시피 페이지 |
| `spot_full` | SPOT 풀버전 페이지 |
| `generic` | 폴백 |

CTA 텍스트는 `messages.pricing.lockScreen.cta` 단일 키.

---

## 7. 결제 흐름

기존 [components/features/purchase/TossPaymentWidget.tsx](../components/features/purchase/TossPaymentWidget.tsx) + [app/api/payments/toss/confirm/route.ts](../app/api/payments/toss/confirm/route.ts) 재활용 (이미 일반 결제 SDK).

```
1. /pricing 에서 패스 선택
2. TossPaymentWidget 으로 결제 요청
3. successUrl → /pricing/success?paymentKey=...&orderId=pass_{type}_{userId}_{ts}
4. /api/payments/toss/confirm 으로 paymentKey 검증
5. /api/passes/purchase POST (type + paymentKey) → passes 레코드 생성
6. 사용자 즉시 활성 패스 보유 — 다음 페이지부터 잠금 해제
```

베타 단계: TOSS_TEST_KEY 사용 (실 결제 X). 정식 출시 시 TOSS_LIVE_KEY 로 환경변수 교체.

---

## 8. UI 컴포넌트

### 신규
- `components/features/pricing/LockScreen.tsx` — 잠금 화면 (6 type props)
- `components/features/pricing/PassCard.tsx` — 패스 카드
- `app/[locale]/pricing/page.tsx` — 가격 페이지

### 폐기
- `components/features/pass/*` — 기존 PassCard / PassHubPage / PassPricingSection
- `components/features/mypage/SubscriptionManage.tsx` — 구독 관리
- `components/features/planner/PlannerSubscriptionWall.tsx`
- `components/features/planner/PlannerPricingCards.tsx`

### 수정 (`hasFeature` → `hasActivePass`)
- `components/features/home/HeroPassButtons.tsx`
- `components/features/spots/CurationResult.tsx`
- `components/features/food/CountryDupeList.tsx`
- `components/features/food/TasteMatchResults.tsx`
- `components/features/camera/FilterSelector.tsx`
- `components/features/planner/PlannerPageClient.tsx` — credits 분기 제거
- `components/features/planner/AddToPlannerButton.tsx` — credits 차감 제거

---

## 9. 폐기 API (DELETE)

- `app/api/subscription/status/route.ts`
- `app/api/subscription/create/route.ts`
- `app/api/subscription/cancel/route.ts`
- `app/api/subscription/plans/route.ts`
- `app/api/credits/purchase/route.ts`
- `app/api/credits/exchange/route.ts`

`app/api/account/delete/route.ts` 와 `app/api/planner/add-item/route.ts` 는 credits 차감 로직만 제거하고 라우트는 유지.

`lib/credits.ts` — 파일 자체 삭제.

---

## 10. TEST_MODE 통합

`process.env.TEST_MODE === 'true'` 면:
- `getActivePass()` 가 가짜 'long' 패스 반환 (30 일 만료)
- `canAccessMission()` 항상 true
- `canAccessPaidContent()` 항상 true

기존 `/api/passes/status` 의 `fullAccessResponse` 패턴은 폐기 — `lib/auth/pass.ts` 한 곳에서만 우회 처리.

---

## 11. CLAUDE.md 갱신

기존 "⚠️ 구독 결제 상태 (최종 배포 전까지 유지)" 섹션을 본 PRD 적용 사실로 교체. Toss 단발 결제 SDK (`@tosspayments/tosspayments-sdk`) 가 이미 사용 중이므로 Live 키 발급 시점만 환경변수 교체.

---

## 12. 사용자 작업 (머지 후)

```
1. Supabase Dashboard SQL Editor 에서 순서대로 실행:
   - 047_passes_table.sql
   - 048_missions_is_free.sql
   - 049_drop_old_subscription.sql
   - 050_drop_credits_tables.sql

2. Vercel 환경변수:
   - TOSS_LIVE_KEY (Live 키 발급 후 교체 — 베타엔 TOSS_TEST_KEY 유지)

3. 관리자 baselining:
   - 본인 2 계정 모두 패스 미보유 상태로 시작 → /pricing 진입 후 테스트 키 결제 → passes 레코드 생성 검증
```

---

## 13. 정식 출시 전 TODO

- Planner 가격 정책 재논의 (베타 무료 → 정식 시점 결정)
- 패스 자동 만료 cron (`status='active' AND expires_at < NOW()` → `status='expired'`)
- 환불 정책 + `/api/passes/refund` 엔드포인트
- 패스 구매 후 D-1 만료 알림 (Resend)
