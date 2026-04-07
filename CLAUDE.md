# Legend of Korea — 프로젝트 컨텍스트 & 작업 규칙

---

## [문서 주도 개발 규칙] ← 반드시 준수

> **Rule**: 코드를 작성하거나 데이터베이스를 수정하기 전에,  
> 무조건 `docs/` 폴더 안의 관련 문서를 먼저 읽고(Read) 설계에 어긋나지 않는지 스스로 검증할 것.  
> 의문이 생기면 사용자에게 먼저 물어볼 것.

| 작업 유형 | 반드시 읽어야 할 문서 |
|-----------|----------------------|
| 기능 추가 / 비즈니스 로직 변경 | `docs/1_prd.md` |
| DB 테이블 생성·수정, RLS 정책 변경, Supabase 쿼리 작성 | `docs/2_db_schema.md` |
| 컴포넌트 추가, 스타일 변경, 신규 페이지 생성 | `docs/3_ui_ux.md` |

**문서와 코드가 충돌할 경우**: 문서가 우선이다. 코드를 수정하거나, 변경이 필요하면 먼저 사용자에게 확인할 것.

---

## 서비스 개요
한국 전래동화 IP를 활용한 "전설 미션 키트" 기획·판매 + QR 기반 셀프 미션 웹 서비스.
1인 창업, 자본금 1,000만원, 천안 거주, 전주 도깨비 코스 우선.

---

## 기술 스택
- **프레임워크**: Next.js 14 App Router + TypeScript
- **스타일**: Tailwind CSS 4 + shadcn/ui
- **백엔드**: Supabase (PostgreSQL + Auth + Storage)
- **배포**: Vercel (서울 리전 `icn1`)
- **패키지 매니저**: pnpm
- **테스트**: Vitest

---

## 핵심 기능 (우선순위)
1. Must: 코스 탐색 + 키트 구매 (Toss/Stripe 결제)
2. Must: QR 셀프 미션 엔진
3. Must: LP·티어 시스템
4. Must: 웹 커뮤니티 기록관
5. Must: 제휴 연결 (추천 숙소·교통 외부 링크)
6. Must: 다국어 (한국어·일본어, 이후 영어)
7. Should: 전설 상점 (LP → 쿠폰 교환)

---

## 다국어 구조
- `next-intl` 사용
- 기본 locale: `ko` / 지원: `ko`, `ja`, `en`
- 번역 파일: `/messages/ko.json`, `/messages/ja.json`, `/messages/en.json`
- **규칙**: 모든 정적 데이터 파일의 텍스트 필드는 반드시 `{ ko, ja, en }` 형태로 작성

---

## DB (Supabase)
테이블: `users`, `courses`, `kit_products`, `orders`, `missions`, `mission_progress`,
`lp_transactions`, `tiers`, `community_posts`, `affiliate_links`, `affiliate_clicks`, `b2b_orders`

### RLS 정책 원칙
- `courses` 테이블: `USING (true)` — 모든 코스 공개 조회 허용, `is_active` 필터링은 앱 코드에서 처리
- 민감 데이터(결제, 개인정보)는 반드시 RLS로 보호

---

## 디렉토리 구조
```
app/[locale]/          ← 다국어 라우팅
components/ui/         ← shadcn 컴포넌트
components/shared/     ← 공통 컴포넌트
components/features/   ← 기능별 컴포넌트
lib/data/              ← 정적 데이터 파일 (food-dupes.ts, flag-cooking.ts 등)
lib/                   ← 유틸리티, Supabase 클라이언트, 타입 정의
messages/              ← 다국어 JSON
tests/                 ← Vitest 테스트 파일
public/images/         ← 정적 이미지
  food/                ← 음식 이미지
  village/             ← 지역 대표 이미지
```

---

## 정적 데이터 파일 규칙 (`lib/data/`)

### food-dupes.ts
- `regions` 배열: 9개 도시 (jeonju, seoul, tongyeong, jeju, busan, gyeongju, cheonan, yongin, icheon)
- 전주 외 8개 도시: 음식 10개씩
- 이미지 경로: `/images/food/{도시3글자}-{음식영문}.jpg`
- 지역 이미지: `/images/village/{이름}.jpg` 또는 `.png`

### flag-cooking.ts
- `flagCountries`: 12개국 (jp, it, mx, th, us, fr, in, vn, cn, id, es, my)
- `fusionRecipes`: 총 68개 (구 8개국 × 5개, 신규 4개국(cn/id/es/my) × 7개)
- 이미지 경로: `/images/flagfd/` (구 레시피) 또는 `/images/food/` (신규 레시피)

### kfood-spots.ts
- `kfoodSpots`: 전국 맛집 스팟 목록
- `CITIES`: 10개 항목 (all 포함, code/ko/ja/en 필드)

---

## 테스트 규칙 ⚠️

### 실행 방법
```bash
pnpm test          # 1회 실행 (CI용)
pnpm test:watch    # 파일 변경 감지 모드
```

### 테스트 파일 위치
- `tests/data-food-dupes.test.ts` — food-dupes 데이터 무결성
- `tests/data-flag-cooking.test.ts` — flag-cooking 데이터 무결성
- `tests/data-kfood-spots.test.ts` — kfood-spots 데이터 무결성

### Claude 작업 원칙
> **`lib/data/` 파일을 수정한 후에는 반드시 `pnpm test`를 실행하고 결과를 보고한다.**
> 테스트가 실패하면 원인을 분석하고 수정 후 재실행한다.
> 새 데이터를 추가할 때는 테스트의 기댓값(count, length 등)도 함께 업데이트한다.

---

## 코드 작성 원칙
- 추가 기능 없이 요청된 것만 수정
- 보안: SQL Injection, XSS, 민감정보 하드코딩 금지
- 서버 컴포넌트 기본, 클라이언트 컴포넌트는 `"use client"` 명시
- Supabase 클라이언트: 서버는 `createServerComponentClient`, 클라이언트는 `createClientComponentClient`
- 이미지는 `next/image` 사용, `alt` 필수
- 삭제보다 수정을 선호, 기존 패턴 유지

---

## 심화 안전 및 개발 규칙 (Advanced Safety Harness)

### 1. 거울 규칙 (DB-Type Sync)

> DB를 만지면 타입도 반드시 같이 수정한다.

- Supabase SQL(테이블 생성·컬럼 추가·타입 변경·FK 수정)을 적용할 때는,  
  **반드시 `lib/supabase/types.ts`의 TypeScript 타입 정의를 동시에 동기화**한다.
- FK 누락, 컬럼 타입 불일치, nullable 불일치는 절대 허용하지 않는다.
- 체크리스트:
  - [ ] SQL 변경 사항이 `types.ts`의 `Row` / `Insert` / `Update` 타입에 반영되었는가?
  - [ ] 새 FK가 `types.ts`의 관계(Relations) 타입에 반영되었는가?
  - [ ] `pnpm tsc --noEmit`으로 타입 오류가 없는지 확인했는가?

---

### 2. 안전망 규칙 (Error Handling First)

> 성공 로직보다 실패 처리를 먼저 설계한다.

- API 라우트(`app/api/**`) 또는 클라이언트 액션을 작성할 때:
  1. **try-catch 블록 먼저 작성** → 성공 로직은 그 안에 삽입
  2. **에러 메시지 분기** 필수: 네트워크 오류 / 인증 오류 / 비즈니스 로직 오류를 구분
  3. **결제(Toss/Stripe) 연동**은 반드시 아래 Fallback UI를 포함:
     - 네트워크 오류 → "결제 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."
     - 결제 실패 → `/courses/[courseId]/purchase/fail` 페이지로 리다이렉트
     - 중복 결제 방지 → 버튼 `disabled` + 로딩 스피너 처리

```typescript
// 올바른 패턴 예시
try {
  // 성공 로직
} catch (error) {
  if (error instanceof NetworkError) { /* fallback */ }
  else if (error instanceof PaymentError) { /* redirect to fail */ }
  else { /* generic error */ }
} finally {
  setLoading(false)  // 반드시 로딩 상태 해제
}
```

---

### 3. 레고 블록 규칙 (Atomic UI Updates)

> page.tsx를 통째로 덮어쓰지 않는다.

- 기존 페이지를 **대규모 개편**할 때의 필수 절차:
  1. `components/features/{기능명}/` 아래에 **작은 단위 컴포넌트**를 먼저 생성
  2. 해당 컴포넌트가 독립적으로 동작하는지 확인
  3. 최종적으로 `page.tsx`에서 **조립(import)** 방식으로 완성

- **금지 행동**: `page.tsx` 전체를 새 내용으로 한 번에 교체 (`Write` 툴로 통째로 덮어쓰기)
- **허용 행동**: `Edit` 툴로 특정 섹션만 교체 / 신규 컴포넌트 파일 생성 후 import

```
# 올바른 작업 순서 예시 (코스 상세 페이지 개편)
1. Write: components/features/story/CourseHero.tsx      ← 신규 생성
2. Write: components/features/story/CourseMissionList.tsx ← 신규 생성
3. Edit:  app/[locale]/courses/[courseId]/page.tsx      ← 조립만 수정
```
