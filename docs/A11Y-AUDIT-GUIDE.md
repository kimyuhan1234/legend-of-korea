# 접근성 자동 점검 가이드 (P3C-8)

**작성일**: 2026-04-27
**근거**: PRD-3C 작업 8 — axe-core 도입.
**상태**: 가이드 문서 (자동 테스트 인프라는 후속 PR).

---

## 배경

- 본 프로젝트는 외국인 대상 서비스 — 일부 국가 (미국 ADA, EU EAA) 접근성 법령 영향.
- WCAG 2.2 AA 풀스펙 대응 (P3C-1~4 적용 완료).
- 자동 점검으로 회귀 방지 + 접근성 위반 조기 발견.

---

## 1. axe-core devtools (Chrome 확장 — 즉시 사용 가능)

### 설치

[axe DevTools (Chrome Web Store)](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)

### 사용 절차

1. production 사이트 접속 → Chrome DevTools 열기 (F12)
2. axe DevTools 탭 → "Scan all of my page" 버튼
3. 결과 분류:
   - **Critical** — 즉시 수정 (legal risk)
   - **Serious** — 빠른 수정 권장
   - **Moderate / Minor** — 후속 검토

### 5 핵심 페이지 점검 대상

| URL | 우선순위 |
|---|---|
| `https://legend-of-korea.vercel.app/ko` | 🔴 최고 (메인) |
| `https://legend-of-korea.vercel.app/ko/discover` | 🔴 최고 |
| `https://legend-of-korea.vercel.app/ko/auth/login` | 🟡 중간 (폼) |
| `https://legend-of-korea.vercel.app/ko/auth/signup` | 🟡 중간 (폼) |
| `https://legend-of-korea.vercel.app/ko/community` | 🟡 중간 |

### 5 로케일 점검

각 페이지를 5 로케일 (ko/ja/en/zh-CN/zh-TW) 모두 확인:
- 텍스트 길이 차이로 layout 깨짐 / contrast 위반 발생 가능
- 영어가 보통 가장 짧음 → 빈 공간 / 의도 어긋남 점검

---

## 2. 후속 PR — vitest + jest-axe 자동 테스트

본 PR (P3C-8) 에는 자동 테스트 인프라 미포함 — 의존성 / 설정 변경이 큼.
정식 출시 전 별도 PR (`feature/p3c-9-axe-auto`) 로 진행 권장.

### 필요 의존성

```bash
pnpm add -D \
  @testing-library/react \
  @testing-library/jest-dom \
  jest-axe \
  jsdom
```

### vitest 설정 변경

**`vitest.config.ts`** — `environment: 'jsdom'` 추가:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

**`tests/setup.ts`** — axe matcher extend:

```ts
import { expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

expect.extend({ toHaveNoViolations })
```

### 5 페이지 axe 테스트 (예시)

```ts
// tests/a11y/main.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
// async server component 는 vitest 에서 직접 렌더 불가 — 별도 처리 필요:
// 옵션 1: server component 의 client 부분만 분리해 테스트
// 옵션 2: Playwright + axe-playwright e2e 환경 사용 (권장)

it.skip('main page has no a11y violations (TODO: server component 처리)', async () => {
  // const { container } = render(<HomePage />)
  // const results = await axe(container)
  // expect(results).toHaveNoViolations()
})
```

### 권장 — Playwright + axe-playwright (e2e)

server component 가 많은 Next.js App Router 환경에서는
**Playwright e2e 환경 + axe-playwright** 가 더 적합:

```bash
pnpm add -D @playwright/test axe-playwright
```

```ts
// tests/e2e/a11y.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('main page a11y', async ({ page }) => {
  await page.goto('/ko')
  await injectAxe(page)
  await checkA11y(page, undefined, { detailedReport: true })
})
```

이 방식은:
- 실제 production-like 환경에서 검사 (server + client 통합)
- 5 로케일 × 5 페이지 = 25 테스트 자동화 가능
- 이미지 / 폰트 / Skip Link 등 실제 렌더 결과 검증

---

## 3. WCAG 2.2 핵심 점검 항목 (수동)

axe 가 못 잡는 항목은 사람이 직접 확인:

### 키보드 only 탐색
- [ ] Tab 키만으로 모든 인터랙티브 요소 도달
- [ ] Skip Link 가 첫 Tab 시 노출 + Enter 시 main 으로 점프
- [ ] 모달은 Esc 로 닫힘 + focus trap (모달 안 Tab 순환)
- [ ] 헤더 sticky 가 focus 요소 가리지 않음

### 스크린리더 (NVDA / VoiceOver)
- [ ] 페이지 제목 정확 (5 로케일)
- [ ] 헤딩 구조 h1 → h2 → h3 (skip 없음)
- [ ] 폼 input 의 label / autocomplete 인식
- [ ] 이미지 alt 적절 (장식용은 alt="")

### 모션 / 색상
- [ ] OS 'Reduce Motion' 활성 시 애니메이션 정지 (P3C-4 적용)
- [ ] 모든 텍스트 contrast 4.5:1+ (P3C-2 적용)
- [ ] 색상만으로 정보 전달 X (예: 에러 + 빨간색 + ⚠️ 아이콘)

### 모바일 / 터치
- [ ] 모든 버튼 24x24 CSS px 이상 (P3C-4 적용)
- [ ] 더블 탭 / 줌 기능 정상
- [ ] 가로 화면 회전 시 레이아웃 정상

---

## 4. 회귀 방지 - 코드 리뷰 체크리스트

신규 PR 시 다음 항목 확인:

- [ ] 새 input 요소: `<label htmlFor>` + `id` + `autoComplete`
- [ ] 새 button 요소: 텍스트 또는 `aria-label` 명시
- [ ] 새 image 요소: `next/image` + `alt` (장식용은 빈 문자열)
- [ ] 새 모달: `role='dialog'` + `aria-modal='true'` + Esc 처리
- [ ] 새 색상: `text-gray-400` / `text-slate-300` 사용 X (4.5:1 미달)
- [ ] 새 애니메이션: `motion-reduce:` variant 또는 globals.css 의 미디어
      쿼리 자동 적용 확인
- [ ] 새 페이지: `<main id='main-content'>` 시맨틱 + h1 정의

---

## 5. P3C-1~7 적용 자산 빠른 참조

| 자산 | 위치 | 효과 |
|---|---|---|
| Skip Link | `components/shared/SkipLink.tsx` | WCAG 2.4.1 |
| 글로벌 focus-visible | `app/globals.css` (mint-deep 2px outline) | WCAG 2.4.13 |
| scroll-padding-top | `app/globals.css` (80px) | WCAG 2.4.11 |
| prefers-reduced-motion | `app/globals.css` 미디어 쿼리 | WCAG 2.3.3 |
| Target Size 24px | `app/globals.css` :where() | WCAG 2.5.8 |
| 색상 대비 | text-slate-400 → 500 일괄 (40 파일) | WCAG 1.4.3 |
| 폼 a11y | LoginForm / SignupForm autocomplete + role=alert | WCAG 1.3.1 / 3.3.1 / 3.3.8 |
| next/image | Affiliate / CourseReviews / PlannerFinalPlan | LCP + WebP/AVIF |
| next/font | Noto Sans KR/JP self-host | LCP (render-blocking 제거) |
| removeConsole | next.config.mjs production | 보안 / 번들 절감 |

---

## 6. 후속 PR 체크리스트

- [ ] @next/bundle-analyzer 설치 + ANALYZE=true 빌드
- [ ] dynamic import 추가 (mypage / 모달 / 차트 영역)
- [ ] vitest jsdom + @testing-library/react + jest-axe 인프라
- [ ] Playwright + axe-playwright e2e 자동 (5 페이지 × 5 로케일)
- [ ] Lighthouse CI integration (GitHub Actions)
