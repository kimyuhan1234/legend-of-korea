# Legend of Korea — 프로젝트 컨텍스트 & 작업 규칙

---

## ✅ 작업 완료 후 GitHub 저장 규칙 (모든 작업의 마지막 단계)

> **모든 작업(디자인 수정, 버그 수정, 기능 추가 등)을 완료한 후 반드시 아래 순서로 GitHub에 Push한다.**
> 이 단계를 건너뛰면 작업이 완료된 것이 아니다.

1. 변경된 파일을 스테이징한다.
2. 커밋 메시지는 **한글**로 작업 내용을 구체적으로 작성한다.
3. 현재 브랜치(보통 `main`)에 Push한다.

```bash
git add .
git commit -m "feat: 작업 내용 요약"
git push origin main
```

**커밋 메시지 예시:**
- `feat: 키네틱 에디토리얼 디자인 테마 적용`
- `fix: 500 에러 및 무한 새로고침 원인 해결`
- `chore: CLAUDE.md 규칙 업데이트`

> 작업 완료 보고 마지막 줄에는 반드시 **"GitHub 저장 완료"** 를 포함한다.

---

## 🚨 절대 규칙 (모든 작업 전 반드시 읽을 것)

> **이 규칙을 어기면 Next.js dev 서버가 즉시 500 에러를 뿜으며 무한 루프에 빠진다.**

1. **`import`는 반드시 파일 최상단에.** 함수 선언이나 변수 선언 아래에 `import`를 쓰면 Next.js dev 모드 SWC 컴파일러가 즉시 500을 발생시킨다. (실제 사고 발생 이력 있음)

2. **`error.tsx`, `global-error.tsx`는 손대지 마라.** 대규모 컴포넌트 수정 시 가장 먼저 이 파일이 무너진다. 수정 후에는 이 두 파일이 살아있는지 반드시 확인한다.

3. **`error.tsx` / `global-error.tsx` / `loading.tsx` / `not-found.tsx` 에는 `next-intl`, `shadcn/ui`, 외부 컴포넌트를 절대 임포트하지 마라.** 이 파일들은 React Provider 바깥에서 렌더링될 수 있으므로, 오직 `'use client'` + 순수 React + 인라인 스타일만 허용된다.

4. **`pnpm install` 후에는 반드시 `.next` 폴더를 삭제한 뒤 `pnpm dev`를 실행한다.** pnpm이 의존성 버전을 업데이트하면 `.next/server/vendor-chunks/` 내부 파일명과 불일치가 발생하여 `Cannot find module './vendor-chunks/@supabase+auth-js@...'` 에러가 발생한다. (실제 반복 사고 발생 이력 있음)

```bash
# 작업 시작 시 또는 vendor-chunks 에러 발생 시 실행
rm -rf .next node_modules && pnpm install && pnpm dev
```

> **Claude 작업 원칙**: 코드 수정 후 dev 서버를 재시작할 때는 항상 `.next`를 삭제한 뒤 시작한다. `pnpm install`을 실행했다면 반드시 `.next`도 함께 삭제한다.

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
- 🚨 **[치명적 주의] 모든 `import` 문은 반드시 파일의 가장 최상단(어떤 함수나 변수 선언보다 위)에 작성해야 한다.** Next.js 개발 모드(dev)의 SWC 컴파일러는 `import` 호이스팅(끌어올리기)을 허용하지 않으며, 파일 중간에 `import`가 있을 경우 즉시 500 Internal Server Error를 발생시킨다.
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

### 3. 캐시 청소 규칙 (Cache Harness)

> 대규모 UI 리팩토링(코드 개선)이나 환경설정을 변경한 후에는, 낡은 캐시(임시 저장소) 때문에 에러가 날 확률이 높다. 따라서 작업 완료 보고 시 사용자에게 반드시 `pnpm dev:clean` 명령어로 서버를 켜도록 안내해라.

---

### 4. 파일 위생 규칙 (File Hygiene)

> 프로젝트에 쓰레기 파일을 남기지 않는다.

**작업 중 임시 파일 금지:**
- Python 스크립트(`.py`), 임시 텍스트(`.txt`), 로그 파일을 프로젝트 폴더 안에 생성하지 않는다.
- 데이터 생성용 스크립트가 필요하면 프로젝트 폴더 **바깥**에서 실행하고, 작업 완료 후 즉시 삭제한다.

**이미지 중복 방지:**
- 같은 음식/장소의 `.jpg`와 `.png`가 동시에 존재하면 안 된다. **`.png`만 유지**한다.
- 이미지를 교체할 때는 기존 파일을 삭제한 후 새 파일을 추가한다.

**미사용 컴포넌트 정리:**
- 새 컴포넌트를 만들어 기존 컴포넌트를 대체했으면, 기존 파일을 삭제한다.
- 판단 기준: `grep -r "import.*ComponentName" .`으로 검색해서 import가 0건이면 삭제 대상.

**프로젝트 루트에 허용되는 파일:**
- 설정 파일: `package.json`, `tsconfig.json`, `next.config.mjs`, `.eslintrc.json`, `.npmrc`, `postcss.config.mjs`, `vitest.config.ts`, `vercel.json`, `components.json`
- 문서: `CLAUDE.md`, `README.md`, `DEPLOYMENT.md`
- 환경: `.env.local`, `.env.example`, `.gitignore`
- 자동 생성: `pnpm-lock.yaml`, `next-env.d.ts`, `tsconfig.tsbuildinfo`
- **그 외 파일은 존재하면 안 된다**

---

### 5. 레고 블록 규칙 (Atomic UI Updates)

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

---

## 철통 보안 규칙 (Security First Harness)

### 1. 데이터 문지기 (RLS Strict Mode)

> RLS 없는 테이블은 배포 금지.

- **배포 전 필수**: 모든 Supabase 테이블에 `ALTER TABLE {name} ENABLE ROW LEVEL SECURITY;` 적용
- 정책 분류 기준:

| 데이터 종류 | 테이블 | 허용 정책 |
|-------------|--------|-----------|
| 공개 데이터 | `courses`, `missions`, `tiers`, `affiliate_links` | `USING (true)` — 전체 읽기 허용 |
| 사용자 개인 데이터 | `orders`, `mission_progress`, `lp_transactions` | `USING (auth.uid() = user_id)` — 본인만 |
| 커뮤니티 | `community_posts`, `community_comments` | 읽기: `USING (is_hidden = false)`, 쓰기: `WITH CHECK (auth.uid() = user_id)` |
| 관리자 전용 | 모든 테이블 | `USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))` |

- **체크리스트** (신규 테이블 생성 시 반드시 확인):
  - [ ] `ENABLE ROW LEVEL SECURITY` 적용했는가?
  - [ ] `SELECT` / `INSERT` / `UPDATE` / `DELETE` 각각의 정책을 명시했는가?
  - [ ] `service_role` 키 없이 `anon` 키로 직접 접근 테스트를 했는가?

---

### 2. 비밀 금고 분리 (Environment Variables Safety)

> `SECRET` 키는 단 한 줄도 클라이언트 코드에 들어가면 안 된다.

**분류 기준:**

| 접두사 | 노출 범위 | 허용 파일 |
|--------|-----------|-----------|
| `NEXT_PUBLIC_` | 브라우저 번들에 포함 (공개) | 모든 파일 |
| 없음 (SECRET) | 서버 전용 (비공개) | `app/api/**`, `lib/server/**`, Edge Function만 |

**절대 금지 패턴:**
```typescript
// WRONG: 클라이언트 컴포넌트에서 SECRET 키 사용
"use client"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)  // 빌드 시 번들에 포함됨

// CORRECT: API Route에서만 사용
// app/api/payment/route.ts (서버 전용)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
```

**코드 작성 전 확인 질문:**
- 이 파일에 `"use client"`가 있는가? → `SECRET` 키 사용 불가
- `NEXT_PUBLIC_` 키에 민감 정보가 담겨 있는가? → 즉시 서버 전용으로 이동

---

### 3. 영수증 이중 확인 (Server-side Validation)

> 클라이언트가 보낸 금액·포인트·쿠폰을 절대 그대로 믿지 않는다.

**결제 서버 검증 필수 항목:**
```typescript
// app/api/payment/confirm/route.ts 패턴
export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json()

  // 1. DB에서 실제 주문 금액 조회 (클라이언트 값 무시)
  const { data: order } = await supabase
    .from('orders')
    .select('total_price')
    .eq('id', orderId)
    .single()

  // 2. 금액 조작 감지
  if (order.total_price !== amount) {
    return NextResponse.json({ error: '금액 불일치' }, { status: 400 })
  }

  // 3. 중복 결제 방지 (idempotency)
  if (order.status !== 'pending') {
    return NextResponse.json({ error: '이미 처리된 주문' }, { status: 409 })
  }

  // 4. PG사 서버에서 결제 상태 재확인 (Toss/Stripe API 직접 호출)
  // ...
}
```

**LP 적립 서버 검증 필수 항목:**
- 미션 완료 여부를 `mission_progress` 테이블에서 서버에서 직접 확인
- 동일 미션 중복 적립 방지: `UNIQUE (user_id, mission_id)` 제약 활용
- LP 금액은 `missions.lp_reward`에서 서버가 직접 읽어옴 (클라이언트 전달값 무시)

---

### 4. 하드코딩 금지 (No Hardcoded Secrets)

> 코드에 프로젝트 ID, API 키, 토큰을 직접 쓰면 안 된다.

- **middleware.ts, 컴포넌트, API 라우트** 어디에서든 Supabase 프로젝트 ID(`isixbzxophgxrfgjesaa` 등)를 문자열로 직접 넣지 않는다.
- 반드시 `process.env.NEXT_PUBLIC_SUPABASE_URL`에서 동적으로 추출한다.
- **체크리스트** (코드 작성 후):
  - [ ] `grep -r "isixbzx" .` 등으로 프로젝트 ID 하드코딩이 없는지 확인
  - [ ] `grep -r "sk_live\|sk_test\|sbp_" .` 등으로 시크릿 키 하드코딩이 없는지 확인

---

### 5. 파일 업로드 보안 (Upload Validation)

> 사용자가 올린 파일을 무조건 신뢰하지 않는다.

- **허용 MIME 타입**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`만 허용
- **최대 파일 크기**: 10MB (`10 * 1024 * 1024`)
- `file.name`에서 확장자만 추출하는 것은 불충분 — 반드시 `file.type`으로 MIME 타입 검증

```typescript
// 올바른 패턴 (app/api/missions/upload/route.ts에 적용됨)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!ALLOWED_TYPES.includes(file.type)) {
  return Response.json({ error: '지원하지 않는 파일 형식' }, { status: 400 });
}
if (file.size > 10 * 1024 * 1024) {
  return Response.json({ error: '10MB 초과' }, { status: 400 });
}
```

---

### 6. console.log 금지 (No Sensitive Logging)

> API 라우트에서 이메일, 요청 본문, 결제 정보를 `console.log`로 찍지 않는다.

- 에러 핸들러의 `console.error`는 허용하되, 사용자 입력값·개인정보는 포함하지 않는다.
- 디버깅용 `console.log`는 작업 완료 전에 반드시 제거한다.
- **금지 패턴:**
  ```typescript
  console.log("request:", { email, locale })  // ← 개인정보 노출
  console.log("supabase result:", { data })   // ← 민감 데이터 노출
  ```

---

### 7. Admin 보호 (Admin Route Protection)

> `/admin` 경로는 2단계로 보호한다.

1. **middleware.ts의 `PROTECTED_PATHS`에 `/admin` 포함** — 비로그인 시 로그인 페이지로 307 리다이렉트
2. **API 라우트(`app/api/admin/**`)에서 role 체크** — `role !== 'admin'`이면 403 Forbidden

- admin layout에 `useEffect` + `useRouter`로 클라이언트 auth guard를 넣으면 **`clientModules` 에러 발생** (실제 사고 발생 이력 있음). 클라이언트 레이아웃에서 auth 체크를 하지 않는다.
- 보호는 반드시 **middleware + API 레벨**에서만 수행한다.

---

### 8. not-found.tsx 규칙 (Not Found Safety)

> `app/not-found.tsx`에는 `<html>`, `<body>` 태그를 넣지 않는다.

- `app/not-found.tsx`는 `app/layout.tsx` 안에서 렌더링되므로, `<html><body>`를 중복 선언하면 hydration 충돌 → `useContext null` 에러 발생 (실제 사고 발생 이력 있음)
- `<html><body>`는 **`app/global-error.tsx`만** 사용한다.
- `app/not-found.tsx`와 `app/[locale]/not-found.tsx` 모두 `'use client'` + 순수 인라인 스타일 + `<div>` 래퍼만 허용
