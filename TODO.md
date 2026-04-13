# Legend of Korea — TODO

> 기준일: 2026-04-07  
> 참조 문서: `docs/1_prd.md` (PRD), `docs/2_db_schema.md` (DB), `docs/3_ui_ux.md` (UI/UX)  
> 우선순위: 🔴 P0 오늘 / 🟠 P1 이번 주 / 🟡 P2 다음 주 / ⚪ P3 2차

---

## 🔴 P0 — 오늘 바로 처리 (서비스 동작에 직결)

- [ ] **[DB] `increment_user_lp` RPC 함수 Supabase에 생성**
  - Supabase SQL Editor에서 아래 SQL 실행 (실행 전까지 LP 적립 API 500 오류 발생)
  ```sql
  CREATE OR REPLACE FUNCTION increment_user_lp(uid uuid, delta integer)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    UPDATE users SET total_lp = total_lp + delta WHERE id = uid;
  END;
  $$;
  ```

- [x] **[DB] 모든 테이블 RLS 활성화 확인**
  - `DEPLOYMENT.md`의 RLS 정책 SQL을 Supabase SQL Editor에서 전체 실행
  - 확인 대상: `orders`, `mission_progress`, `lp_transactions`, `community_posts`, `community_comments`, `users`
  - 검증: `anon` 키로 직접 접근 시 빈 배열 반환되는지 테스트

- [x] **[DB] `lp_transactions` 테이블에 `applied` / `applied_at` 컬럼 존재 여부 확인**
  - 없으면 `ALTER TABLE lp_transactions ADD COLUMN applied boolean DEFAULT false, ADD COLUMN applied_at timestamptz;`

---

## 🟠 P1 — 이번 주 (MVP 완성)

### M2: 결제 플로우 검증
- [ ] **[결제] Toss Payments 테스트 환경 end-to-end 실행**
  - 주문 생성 → Toss 위젯 → 결제 승인 → `orders.payment_status = 'paid'` 확인
  - 중복 결제 방지 동작 확인 (`payment_status = 'paid'` 재시도 시 409 반환)
- [ ] **[결제] 결제 실패 시 `/courses/[courseId]/purchase/fail` 리다이렉트 동작 확인**
- [ ] **[결제] 재고 차감 원자성 확인** (`kit_products.stock` race condition 가능성 점검)

### M3: QR 미션 엔진 실전 테스트
- [ ] **[미션] 전주 도깨비 코스 QR 카드 인쇄 후 실제 스캔 테스트**
  - `app/api/missions/scan/route.ts` → `verify/route.ts` → LP 적립 전체 플로우
- [ ] **[미션] 미션 완료 후 `mission_progress` 테이블 중복 방지 확인**
  - `UNIQUE (user_id, mission_id)` 제약 DB에 적용되어 있는지 확인
- [ ] **[미션] 사진 업로드 미션 (`PhotoMission.tsx`) Supabase Storage `mission-photos` 버킷 설정 확인**

### M4: LP·티어 시스템
- [ ] **[LP] LP 적립 후 티어 자동 업그레이드 로직 구현 또는 확인**
  - `app/api/shop/tier-upgrade/route.ts` 호출 시점 명확화
- [ ] **[LP] 마이페이지에서 `lp_transactions.applied = false` 항목 "적립 신청" 버튼 동작 확인**

### M5: 커뮤니티
- [ ] **[커뮤니티] 게시글 작성 시 이미지 업로드 → Supabase Storage `community-photos` 버킷 연동 확인**
- [ ] **[커뮤니티] 댓글 작성 후 실시간 반영 (낙관적 업데이트 또는 revalidate) 확인**

---

## 🟡 P2 — 다음 주 (품질 향상)

### 마이페이지 상세
- [ ] **[마이페이지] 주문 상세 모달 또는 페이지 구현** (현재 주문 목록만 표시)
- [ ] **[마이페이지] 배송 추적번호 표시 UI** (`shipping_status`, `tracking_number`)
- [ ] **[마이페이지] 프로필 편집 기능** (`app/api/profile/route.ts` 연동)

### 해외 결제 (Stripe)
- [ ] **[결제] Stripe Checkout 해외 카드 테스트** (Stripe 테스트 카드 사용)
- [ ] **[결제] Stripe Webhook `/api/payments/stripe/webhook` 서명 검증 실전 테스트**
- [ ] **[결제] Stripe 결제 완료 후 `orders` 상태 업데이트 확인**

### 다국어 완성도
- [ ] **[i18n] `/messages/ja.json` 누락 키 점검 및 번역 완성**
- [ ] **[i18n] `/messages/en.json` 누락 키 점검 및 번역 완성**
- [ ] **[i18n] 음식/코스 정적 데이터의 `ja`, `en` 텍스트 품질 검토**

### SEO / 메타데이터
- [ ] **[SEO] 각 페이지 `generateMetadata()` 함수 추가** (courses, community, food/dupe 등)
- [ ] **[SEO] OG 이미지 설정** (SNS 공유 시 미리보기)
- [ ] **[SEO] `sitemap.ts` 동적 코스 URL 포함 여부 확인**

---

## ⚪ P3 — 2차 출시 (Should/Could)

### S1: 전설 상점
- [ ] **[상점] LP → 쿠폰 교환 후 쿠폰 코드 복사 UX 개선**
- [ ] **[상점] 쿠폰 만료일 자동 설정 로직 확인** (`expires_at` 기본값)

### S2: B2B 주문
- [ ] **[B2B] B2B 견적 요청 페이지 구현** (현재 API만 존재, UI 없음)
- [ ] **[B2B] 단체 주문 이메일 알림 연동** (Resend or SendGrid)

### S3: 관리자 대시보드
- [ ] **[관리자] 주문 목록 검색 및 배송 상태 일괄 업데이트 UI 완성**
- [ ] **[관리자] 미션 등록 현황 통계 차트 추가**
- [ ] **[관리자] 커뮤니티 신고 글 숨김 처리 기능**

### 기타
- [ ] **[보안] Stripe Webhook 서명 검증 누락 여부 최종 점검**
- [ ] **[성능] 코스 목록 페이지 이미지 `priority` 및 `sizes` 최적화**
- [ ] **[테스트] Vitest 테스트 커버리지 확대** (API 라우트 통합 테스트)
