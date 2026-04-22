# Supabase RLS 전수 보안 감사

**감사 일자**: 2026-04-22
**감사 대상**: `supabase/migrations/001_initial_schema.sql` ~ `028_tour_stays_cache.sql` (30개 파일)
**수정 SQL**: [`029_security_patches.sql`](migrations/029_security_patches.sql)

---

## 종합 요약

| 구분 | 건수 |
|------|------|
| 점검한 테이블 | **33개** |
| RLS 활성화 | **33 / 33 (100%)** ✓ |
| 🔴 Critical (배포 차단) | **1** |
| 🟡 Medium (개선 권장) | **4** |
| 🟢 Low (참고) | **2** |

**배포 차단 요소 1건**: `blacklist` 테이블 전체 공개 조회.

---

## 🔴 Critical — 배포 전 반드시 수정

### 1. `blacklist` — 모든 차단 사용자 개인정보 전체 공개

- **파일**: `021_safety_system.sql:69-70`
- **현재 정책**: `CREATE POLICY "blacklist_select" FOR SELECT USING (true);`
- **문제**: 로그인한 누구나 **모든** 차단 사용자의 `user_id`, `reason`(사유), `total_reports`(총 신고 수), `blocked_until`을 조회 가능.
  - 개인정보(user_id) 노출
  - 명예훼손 우려 (특정 사용자의 차단 사유/이력이 공개됨)
  - GDPR·개인정보보호법 저촉 위험
- **수정 방침**: 본인 자신의 차단 상태만 조회. 관리자는 `service_role` 우회.
- **수정 SQL**: `029` Phase 1

---

## 🟡 Medium — 개선 권장

### M1. `participant_reviews` — 본인 리뷰 UPDATE/DELETE 정책 부재

- **파일**: `021_safety_system.sql:55-60`
- **현재**: INSERT + SELECT만 있음
- **문제**: 본인이 작성한 별점 리뷰라도 수정·삭제 불가. 실수 리뷰 영구 고정.
- **수정 SQL**: `029` Phase 2

### M2. `quest_party_members` — 모든 파티 멤버 공개 조회

- **파일**: `020_quest_party.sql:49-50`
- **현재**: `SELECT USING (true)` — 누구나 모든 파티의 멤버 user_id 리스트 열람
- **판단 필요**: "파티 모집이 완전 공개 컨셉"이면 현재 정책 유지 OK. "같은 파티 멤버끼리만"이면 수정 필요.
- **수정 SQL**: `029` 주석으로 선택 가능한 대안 제공 (기본은 무변경)

### M3. `community_likes`·`community_comments` 중복 정책

- **파일**: `001_initial_schema.sql:421-435` + `011_community_interactions.sql:15-68`
- **현재**: 같은 테이블에 유사한 정책이 이름만 다르게 2벌 존재 (`likes_select_all` + `community_likes_select`).
- **영향**: 기능 문제 없음 (PostgreSQL은 OR로 결합). 관리 복잡도 증가.
- **수정 SQL**: `029` Phase 3 — 011이 의도했던 대로 001 구버전 정책 DROP

### M4. `tour-stays/recommend` API — 불필요한 service_role 사용

- **파일**: `app/api/tour-stays/recommend/route.ts:30`
- **현재**: 단순 SELECT만 수행하는데 `createServiceClient()` 사용 → RLS 우회
- **영향**: RLS 정책 검증이 실행되지 않아, 정책이 실수로 변경돼도 API는 계속 동작 → 회귀 감지 실패
- **수정 방침**: `createClient()` (anon/user)로 교체. `tour_stays_cache` RLS가 `USING (true)` SELECT라 문제없이 작동.
- **수정 SQL**: SQL 변경 불필요. 코드 수정만 필요 (이번 감사 범위 밖, 별도 티켓)

---

## 🟢 Low — 참고

### L1. Write 정책 누락 테이블 (의도된 설계)

아래 테이블들은 **INSERT/UPDATE/DELETE 정책이 없음** → anon·authenticated 클라이언트 쓰기 차단. `service_role`만 쓰기. 의도된 설계이므로 그대로 유지.

- `food_image_cache` (026/027) — 서버가 외부 API 결과 캐싱
- `tour_stays_cache` (028) — 서버가 TourAPI 결과 캐싱
- `mission_logs` (003) — 서버가 미션 활동 로그 기록
- `blacklist` (021) — 시스템/관리자만 차단 등록·해제

### L2. Public SELECT 테이블 (의도)

- `missions`, `tiers`, `subscription_plans` — 공개 정적 데이터
- `courses`, `affiliate_links` — 공개 콘텐츠
- `food_image_cache`, `tour_stays_cache` — 공개 캐시
- `community_likes`, `community_comments`, `community_posts`, `community_recipes` — 커뮤니티 공개 읽기

---

## 테이블별 빠른 조회

| 테이블 | RLS | SELECT | INSERT | UPDATE | DELETE | 비고 |
|--------|-----|--------|--------|--------|--------|------|
| users | ✓ | own | — | own | — | |
| courses | ✓ | public | admin | admin | admin | |
| kit_products | ✓ | public | admin | admin | admin | |
| orders | ✓ | own | own | admin | — | |
| missions | ✓ | public | admin | admin | admin | |
| mission_progress | ✓ | own | own | own | — | |
| lp_transactions | ✓ | own | service | — | — | |
| tiers | ✓ | public | — | — | — | |
| community_posts | ✓ | public | own | own | own | |
| community_likes | ✓ | public | own | — | own | 중복 정책 (M3) |
| community_comments | ✓ | public | own | — | own | 중복 정책 (M3) |
| coupons | ✓ | own | own | own | — | |
| affiliate_links | ✓ | public | admin | admin | admin | |
| affiliate_clicks | ✓ | admin | any | — | — | |
| b2b_orders | ✓ | admin | admin | admin | admin | |
| mission_logs | ✓ | own | — | — | — | service insert |
| ad_banners | ✓ | public | admin | admin | admin | |
| community_recipes | ✓ | public | own | own | own | |
| subscription_plans | ✓ | public | — | — | — | |
| user_subscriptions | ✓ | own | own | own | — | |
| travel_plans | ✓ | own | own | own | own | |
| plan_items | ✓ | via plan | via plan | via plan | via plan | |
| credit_purchases | ✓ | own | own | — | — | |
| credit_usage | ✓ | own | own | — | — | |
| quest_parties | ✓ | public | own | own | own | |
| quest_party_members | ✓ | **public** | own | — | own | **M2** |
| participant_reviews | ✓ | own | own | — | — | **M1** |
| user_reports | ✓ | own | own | — | — | |
| blacklist | ✓ | **public** | — | — | — | **🔴 Critical** |
| party_chat | ✓ | member | member | — | — | |
| lp_exchanges | ✓ | own | own | — | — | |
| food_image_cache | ✓ | public | — | — | — | service write |
| tour_stays_cache | ✓ | public | — | — | — | service write |

---

## Service Role (RLS 우회) 사용처 점검

총 16개 파일에서 `createServiceClient()` 호출. 대부분 정당한 사용:

| 파일 | 사용 목적 | 평가 |
|------|-----------|------|
| app/api/payments/toss/confirm | 결제 검증/기록 | ✓ 정당 |
| app/api/passes/purchase | 패스 구매 DB 쓰기 | ✓ 정당 |
| app/api/subscription/create·cancel | 구독 관리 | ✓ 정당 |
| app/api/orders | 주문 생성 | ✓ 정당 |
| app/api/account/delete | 계정 삭제 (cascade) | ✓ 정당 |
| app/api/credits/exchange | LP ↔ 크레딧 | ✓ 정당 |
| app/api/lp/leaderboard | 전체 집계 SELECT | ⚠ 공개 SELECT 가능 (RLS로도 됨) |
| app/api/mission-register·missions/upload | 미션 쓰기 | ✓ 정당 |
| app/api/goods-notify | 알림 구독 쓰기 | ✓ 정당 |
| app/api/food-image | 이미지 캐시 쓰기 | ✓ 정당 |
| app/api/tour-stays/recommend | 단순 SELECT | ⚠ **M4** |
| app/api/tour-stays/tag | 캐시 UPDATE | ✓ 정당 |
| lib/tour-api/stays-cache | 읽기+쓰기 | ✓ 정당 |

---

## 다음 단계

1. 사용자가 [`029_security_patches.sql`](migrations/029_security_patches.sql) 내용 검토
2. Supabase 대시보드 → SQL Editor에서 실행
3. 재배포 전 체크리스트:
   - [ ] 029 실행 완료 (blacklist SELECT 정책 교체 확인)
   - [ ] `SELECT * FROM blacklist;` 을 anon 키로 호출 시 본인 레코드만 나오는지 직접 확인
   - [ ] M4(tour-stays/recommend) 코드 수정 필요 여부 결정 후 별도 작업
