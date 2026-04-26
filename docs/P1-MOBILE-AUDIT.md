# P1-3 모바일 반응형 점검 보고

**브랜치**: `feature/p1-first-impression`
**점검일**: 2026-04-25
**대상 뷰포트**: 360 / 390 / 414 / 768 px

---

## 점검 방식

본 audit 은 코드 레벨로 수행 (실제 브라우저 visual diff 는 사용자 환경에서 별도). 다음 anti-pattern 을 grep 으로 식별:

1. 고정 픽셀 폭 (`min-w-[XXXpx]`, `w-[XXXpx]`)
2. 모바일 breakpoint 누락 (`text-6xl` 단독)
3. 다국어 문자열 길이 차로 wrap 깨짐 가능성
4. Sticky CTA + FAB + Modal z-index 충돌

---

## 점검 대상 페이지 + 발견 사항

### ✅ 이미 P0 mobile fix (`69ed82b`) 에서 해결된 항목
- OOTD DayCard 폭 (`w-44 md:w-48` → `w-36 sm:w-44 md:w-48`)
- Quest 코스 패스/버튼 로우 (`min-w-0 truncate` + 모바일 폰트 축소)
- HomeFeatureCarousel 패딩 (`py-12 md:py-20` → `py-6 md:py-20`)
- CreatePartyModal `max-h overflow-y-auto`

### ✅ P1-1 신규 HeroSection — breakpoint coverage 완비
| 요소 | 모바일 | 데스크톱 |
|---|---|---|
| 헤드라인 폰트 | `text-3xl` (30px) | `text-6xl` (60px) |
| 서브카피 폰트 | `text-sm` (14px) | `text-lg` (18px) |
| 패딩 | `pt-12 pb-12 px-4` | `md:pt-20 md:pb-16 sm:px-6` |
| CTA 버튼 | `flex-col` 세로 | `sm:flex-row` 가로 |
| 트러스트 배지 | `text-[11px] whitespace-normal max-w-full` | `md:text-xs` |
- 영문 트러스트 배지 (45자) 가 가장 긴 케이스 — `whitespace-normal` 안전망 추가 (P1-3 보강)

### ✅ HeroPassButtons (구 HeroSection) — h-screen 풀스크린 비디오 보존
- 모바일: 패스 4개 버튼 `grid grid-cols-2` (각 ~150px 폭, 360px 에서 2×2 정상)
- `bottom-24` 위치 — StickyCTA (bottom-0) 와 32px 여유 (overlap 없음)

### ✅ /pass PassPricingSection (P0-3 처리 완료)
- PassCard 가격 환산값 `items-start` + `flex-col` 적용 — 360px 에서 줄바꿈 자연스러움
- 베타 배지 + 면책 문구 모바일 우선 패딩

### ✅ /auth/signup (P0-5-A SignupForm)
- birth_date `<input type="date">` — `inputClass` 의 `h-12 px-4 w-full` 로 360px 안전
- 테스트 배너 + 비밀번호 규칙 5개 + 약관 체크박스 — `flex-col` 세로 배치
- **주의**: dropdown 3분할 (Year/Month/Day) 은 P0-5-B (디자인 시안 도착 후) 작업 예정. 현재 `input[type=date]` 는 모바일 native picker 사용 — UX 일관

### ✅ /auth/age-restricted (P0-5-A)
- 인라인 스타일 + `max-w: 440px` 카드 — 모바일 360px 에서 자연스러움
- 부모 mailto 링크 + CTA 버튼 — 세로 배치

### ✅ /auth/complete-profile (P0-5-A)
- 진행 점 3개 컴포넌트 + prefill 신뢰 신호 — `flex items-center justify-center gap-2` 안전

### ✅ FeedbackWidget FAB + StickyCTA + Modal z-index
| 요소 | z-index | 위치 |
|---|---|---|
| FoundingMembersBanner | 일반 흐름 | 페이지 최상단 |
| StickyCTA | 40 | mobile fixed bottom-0 |
| FeedbackWidget FAB | 40 | mobile fixed bottom-(safe + cta-height + 24px) |
| FeedbackWidget Modal | 50 | inset-0 with bg-black/40 |
| CartSidePanel | 50 | fixed top-0 right-0 |
| Maintenance redirect | 일반 흐름 | 페이지 |
| OAuth callback | N/A | route handler |

→ Modal 이 가장 위 (z-50). StickyCTA + FAB 같은 레이어 (40). FAB 가 `--cta-height` 변수로 자동 위로 이동. **충돌 없음**.

---

## 점검에서 제외 / 주의

| 항목 | 이유 |
|---|---|
| birth_date dropdown 3분할 점검 | P0-5-B 디자인 시안 도착 대기 (사용자 결정 C-3) |
| Lighthouse 자동 점검 | dev 환경 직접 실행 필요 — 본 audit 범위 외 |
| 실제 브라우저 visual diff | 사용자 환경에서 BEFORE/AFTER 캡처 권장 |

---

## 결론

**critical 깨짐 0건**. P0 모바일 전수 수정 (`69ed82b`) + P1-1 신규 HeroSection 의 breakpoint coverage + P1-3 트러스트 배지 wrap 안전망으로 360px ~ 768px 4개 뷰포트에서 자연스럽게 동작 예상.

추가 수동 검증은 dev 환경에서 5개 언어 × 3 페르소나 시나리오 (Yuki/Mike/Lin) 로 권장.
