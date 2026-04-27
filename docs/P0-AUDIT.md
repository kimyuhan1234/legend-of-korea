# P0 베타 검증 강화 — 사전 조사 결과

**브랜치**: `feature/p0-beta-improvements`
**작성일**: 2026-04-25
**범위**: 작업 0 (사전 조사) 결과 + 사양과 실제 코드의 차이 식별

---

## 1. `app/[locale]/` 실제 라우트

존재하는 페이지: `about · admin · auth · community · courses · diy · food · goods · maintenance · memories · missions · mypage · ootd · partner · pass · planner · privacy · quest · shop · sights · stay · story · terms · traffic`

PUBLIC_PATHS 사양 후보 vs 실제:

| 사양 후보 | 실제 존재 | 비고 |
|---|---|---|
| `/` | ✅ | |
| `/about` | ✅ | |
| `/pass` | ✅ | |
| `/mission-guide` | ❌ | 실제로는 `/quest/guide` (Footer.tsx 에서 사용 중) |
| `/ootd` | ✅ | |
| `/sights` | ✅ | |
| `/traffic` | ✅ | |
| `/stay` | ✅ | |
| `/auth` | ✅ | login/signup 모두 이 prefix 아래 |
| `/login` | ❌ | 단독 라우트 없음. `/auth/login` 이며 `/auth` prefix 가 이미 커버 |
| `/signup` | ❌ | 단독 라우트 없음. `/auth/signup` 이며 `/auth` prefix 가 이미 커버 |
| `/privacy`, `/terms` | ✅ | |
| `/maintenance` | ✅ | 이미 존재. `isGateBypassPath()` 가 별도 처리 중 |
| `/beta-full` | ❌ | 신규 생성 필요 (사양에도 명시) |
| `/food`, `/courses`, `/diy`, `/memories` | ✅ | |

**현행 PUBLIC_PATHS** (middleware.ts:13):
```ts
["/", "/auth", "/login", "/signup", "/stay", "/privacy", "/terms", "/maintenance"]
```
- `/login`, `/signup` 이 이미 잔존 (실제 라우트 없는데 화이트리스트에만 있음)
- `/about`, `/pass`, `/ootd`, `/sights`, `/traffic`, `/food`, `/courses`, `/diy`, `/memories`, `/quest`, `/community`, `/planner`, `/shop`, `/quest/guide` 등 다수 누락

---

## 2. DB 스키마 — **사양과 충돌**

### `users` 테이블 (`001_initial_schema.sql`)
```sql
id, email, nickname, language, social_provider, avatar_url,
total_lp, current_tier, role, created_at, updated_at
```
- ❌ 사양 컬럼 `rank` → 실제는 `current_tier`
- ❌ 사양 컬럼 `raindrops` → 실제는 `total_lp`
- types.ts 도 `total_lp` 사용 (line 32, 45, 57)

### `community_posts` 테이블
- 현재 컬럼 `is_hidden` 존재 (CLAUDE.md RLS 원칙: `읽기: USING (is_hidden = false)`)
- 사양 P0-6 가 추가하려는 `is_public_visible` 컬럼 **부재** (마이그레이션 040 으로 추가 필요)

### `consents_public_memories`
- `users` 에 부재 (마이그레이션 040 필요)

### `birthdate` (P0-5)
- `users` 에 부재. 회원가입 폼·DB 양쪽 추가 필요

### `feedback` 테이블
- 부재 (마이그레이션 041 으로 신규 생성)

### 결제 카드 컬럼 (P0-4 보안 우려)
- `orders` 테이블에 `card_last4`, `payment_token` **부재**.
- 실제 결제 컬럼: `payment_method ('toss'|'stripe')`, `payment_status`, `tracking_number`
- 결제 미연동 상태이므로 카드 PII 컬럼 자체가 없어 P0-4 의 "결제 카드 절대 제외" 조건은 자연스럽게 충족

---

## 3. `select('*')` 전수 — 13건 + JOIN 1건

```
app/api/community/ads/route.ts:13
app/api/lp/history/route.ts:17
app/api/admin/missions/route.ts:18
app/api/party/my/route.ts:31
app/[locale]/mypage/MyPageClient.tsx:82
app/api/party/list/route.ts:17
app/api/party/join/route.ts:21
app/[locale]/missions/[courseId]/page.tsx:62
app/api/missions/complete/route.ts:17
app/api/subscription/status/route.ts:56
app/api/missions/scan/route.ts:22
app/api/shop/coupons/route.ts:15
```

JOIN 형식: `app/[locale]/missions/[courseId]/page.tsx:53` — `select('*, mission_progress!left(*)')`

---

## 4. © 표기 — 부분적으로 이미 통일됨

| 위치 | 값 |
|---|---|
| `components/shared/Footer.tsx:82` | `© 2026 Cloud with you. All rights reserved.` (이미 2026) |
| `messages/{locale}.json:194` (footerCopyright) | `"© 2026 Cloud with you"` (이미 2026) |
| `messages/{locale}.json:662` (copyright) | `"© 2025 Cloud with you. All rights reserved."` (잔존, 5개 로케일 모두) |
| `app/[locale]/auth/login/page.tsx:90` | `© 2025 Cloud with you` (잔존) |
| `app/[locale]/auth/signup/page.tsx:72` | `© 2025 Cloud with you` (잔존) |

→ **신규 Footer 생성 불필요**. 기존 Footer 에 베타 라벨만 추가 + 잔존 © 2025 3건만 정리.

---

## 5. 푸터 컴포넌트

- `components/shared/Footer.tsx` 이미 존재 (인라인 TEXT 매핑, ko/ja/en — zh-CN/zh-TW 누락)
- 사양 `components/footer.tsx` 와 위치 다름. 신규 생성하지 말고 **기존 파일에 zh-CN/zh-TW 추가 + 베타 라벨 추가**가 옳은 방향.

---

## 6. 회원가입 폼 위치

- `app/[locale]/auth/login/page.tsx`
- `app/[locale]/auth/signup/page.tsx`
- 실제 폼 컴포넌트: `components/features/auth/SignupForm.tsx` (방금 비밀번호 규칙·확인·테스트 배너 추가 작업 완료. P0-5 birthdate 추가 시 이 파일에 합칠 예정)

---

## 7. 쿠키 배너 — **사양과 구조 충돌**

`components/shared/CookieBanner.tsx` 현황:
- 단일 동의 모델 (`localStorage` 키 `lok_cookie_consent_v1`, 값 `'accepted'`)
- 5개 로케일 인라인 UI 매핑
- 메시지: 단순히 "쿠키 사용에 동의" 한 줄

사양 P0-9 가 요구하는 구조:
- 3-tier (necessary / analytics / session_replay)
- `localStorage.getItem('cookie-consent')` JSON 파싱
- `parsed.session_replay === true` 가드

→ **기존 CookieBanner 전면 재구현** 필요. 단순 키 추가로는 안 됨.

---

## 8. 마이그레이션 번호

최신: `039_post_themes.sql`
다음: `040`, `041` (P0-6, P0-8 에서 사용 예정)

---

## 9. 기타 사양 vs 실제 차이

| 항목 | 사양 | 실제 | 조치 |
|---|---|---|---|
| 쿠키 배너 import | `components/cookie-banner.tsx` 가정 | 실제 `components/shared/CookieBanner.tsx` | 경로 수정 |
| 푸터 import | `components/footer.tsx` 가정 | 실제 `components/shared/Footer.tsx` | 경로 수정 |
| 회원가입 폼 import | `app/[locale]/auth/signup/.../signup-form.tsx` | 실제 `components/features/auth/SignupForm.tsx` | 경로 수정 |
| FAB 폰트 색 | 흰 배경 + 텍스트 | 사양 `text-2xl 💧` 만 | OK |
| 메시지 키 prefix | `feedback`, `beta.*`, `cookies.*` | 모두 신규 | 추가 가능 |
| 베타 약관 (P0-6-E) | 신규 추가 | 부재 (검색 결과 0건) | 별도 PR 권고 (법률팀 검토 후) |
| 다국어 정책 | 5개국어 (ko/ja/en/zh-CN/zh-TW) | 실제 5개 모두 존재 + i18n.ts 매핑됨 | OK (CLAUDE.md outdated) |

---

## 10. 결정이 필요한 항목 (사용자 승인 대기)

### A. DB 스키마 매핑 — **HARD BLOCKER**
- 사양의 `users.rank, raindrops` 를 실제 `users.current_tier, total_lp` 로 매핑하고 진행하면 되는지?
- (사양은 추측이고 실제 스키마가 진실임. 코드는 실제 컬럼명을 사용)

### B. PUBLIC_PATHS 정리
- `/login`, `/signup` 잔존 항목 제거 (실제 라우트 없음, `/auth` 가 커버)
- `/mission-guide` 대신 `/quest/guide` 로 (또는 `/quest` 전체)?
- `/community`, `/planner`, `/shop`, `/quest`, `/missions` 추가 여부?
- `/admin` 은 명시적으로 비공개 유지 (CLAUDE.md 보안 규칙 #7)

### C. 쿠키 배너 — **HARD BLOCKER**
- 기존 단일 동의 → 3-tier 로 전면 재구현 진행해도 되는지?
- 기존 동의 사용자 (`lok_cookie_consent_v1=accepted`) 마이그레이션: 모두 necessary+analytics 동의로 변환, session_replay 는 false?

### D. RLS 정책 — `community_posts`
- CLAUDE.md: `is_hidden = false` 기반
- 사양 P0-6: `is_public_visible = true` 기반
- 옵션 1: 두 컬럼 공존 (`is_hidden = false AND is_public_visible = true` 비회원, 회원은 본인 + 공개)
- 옵션 2: `is_hidden` 폐기하고 `is_public_visible` 로 통합
- → **옵션 1 권장** (기존 모더레이션 기능 보존)

### E. 베타 약관 (P0-6-E)
- 사양도 "별도 PR 분리, 법률팀 최종 검토 후 머지 권장" 명시
- 본 P0 통합 작업에서 **제외**하고 별도 진행해도 되는지?

### F. 환율 갱신 정책
- 사양 `lib/currency.ts` 에 환율 하드코딩 (2026-04 기준). 매월 1일 수동 갱신 메모.
- 베타 기간 동안만 운영 → 그대로 진행 OK?

### G. 작업 순서 / 분할 커밋
- 사양은 9개 단계 한번에 처리 + 단계별 커밋 명시
- 컨텍스트가 큰 만큼 1~2 단계씩 나눠서 진행할지, 한번에 전부 진행할지?

---

## 11. 권장 진행 방안

다음 순서로 단계별 진행 + 단계마다 커밋·검증 (`pnpm tsc --noEmit` + `pnpm test`):

1. **P0-0** (현재) — audit 문서 + 브랜치 생성 ✅
2. **P0-2** (저위험) — © 2025 잔존 3건 정리 + 베타 라벨 추가 (Footer 5개국어 확장)
3. **P0-7** (저위험) — Founding Members 배너 + `/api/founding-members/count`
4. **P0-3** (저위험) — `lib/currency.ts` + 베타 배지 + 면책 문구 + `/pass` noindex
5. **P0-1** (중위험) — middleware PUBLIC_PATHS 정리 + 카운터 분리 + `/beta-full` 페이지 + BlurredCTAOverlay
6. **P0-5** (중위험) — 회원가입 birthdate 14세 검증 (DB users 에 birthdate 컬럼 추가 필요)
7. **P0-9** (중위험) — CookieBanner 3-tier 재구현 + Clarity 조건부
8. **P0-8** (DB) — 피드백 테이블 + 위젯 (마이그레이션 041)
9. **P0-6** (DB+RLS) — MEMORIES 동의 마이그레이션 (040, 옵션 1)
10. **P0-4** (대규모 리팩) — `select('*')` 13건 + JOIN 1건 명시 컬럼 교체

마지막에 `pnpm build` 통과 + 수동 5개국어 검증.

---

## 다음 액션

위 10번 섹션의 **A·C·G 항목** 답변 후 P0-2 부터 진행.
A·C 는 코드 동작에 직접 영향, G 는 작업 순서·범위.

---

## Phase 2 결정 사항 기록 (2026-04-25)

### 사용자 결정 사항
| 항목 | 결정 |
|---|---|
| `users.rank/raindrops` → `current_tier/total_lp` 매핑 | ✅ |
| 소셜 로그인 단일 경로 (DB birth_date 미입력 시 추가 정보 화면) | ✅ |
| 040 마이그레이션 NULL 허용 (NOT NULL 은 후속 044 PR) | ✅ |
| 의심 정황 점검 (read-only SQL 만, 격리 금지) | ✅ |
| 마케팅팀 카피 + 디자인팀 구조 채택 | ✅ |
| 디자인 시안 도착 전 로직·DB 우선 진행 (P0-5-A → P0-5-B 분할) | ✅ |

### 마이그레이션 번호 최종 확정
- `040_users_birth_date.sql` (P0-5-A 본 작업) ✅ 적용 완료
- `041_community_posts_visibility.sql` (P0-6, 후속 Phase)
- `042_users_consents_columns.sql` (P0-6, 후속 Phase)
- `043_feedback_table.sql` (P0-8 본 작업) ✅ 적용 완료
- `044_users_birth_date_not_null.sql` (별도 PR, 재인증 완료 후)
- `045_parent_consents.sql` (P0-5-C-2, 182 상담 반영) — 법정대리인 동의 최소 플로우

### Phase 2 구현 핵심 의사결정

#### 1. handle_new_user 트리거 갱신
기존 트리거가 auth.users INSERT 시 자동으로 public.users 생성하는 구조 발견.
40_users_birth_date.sql 에서 트리거 함수를 재선언 — `raw_user_meta_data->>'birth_date'`
를 안전하게 cast (실패 시 NULL fallback). 14세 미만 차단은 어플리케이션
레이어에서 `signUp()` 호출 자체를 막는 방식으로 처리.

#### 2. 14세 미만 소셜 로그인 처리
auth.users 가 OAuth 콜백에서 자동 생성되므로 callback 만으로는 차단 불가.
→ complete-profile 페이지에서 사용자 입력 후 14세 미만이면 `service-role`
클라이언트로 `auth.admin.deleteUser(user.id)` 호출 → FK CASCADE 로
public.users 도 삭제 → /auth/age-restricted 로 redirect.

이 흐름은 "14세 미만 사용자가 단 1초도 DB 에 들어가지 않게" 라는 원칙과
약간 충돌 — 소셜 로그인의 경우 OAuth 콜백 후 birth_date 입력까지
auth.users 만 존재하는 짧은 윈도우가 발생. 다만:
  - public.users (앱 데이터) 는 birth_date NULL 인 unverified 상태
  - 14세 미만 입력 즉시 admin API 로 auth.users 도 삭제 (cascade)
  - 통상 수 초 내 완료 — PIPA 준수 정신엔 부합

#### 3. CompleteProfileForm prefill
- kakao: `birthyear` (YYYY) + `birthday` (MMDD) → "YYYY-MM-DD" 조합
- google: `birthdate` (YYYY-MM-DD) — 사용자 동의 필요
- line: 미제공 — 빈 폼 표시
모든 케이스에서 사용자가 수정 가능. 디자인팀 #2 권고 반영.

#### 4. CSS --cta-height 변수
FeedbackWidget FAB 가 `bottom: calc(env(safe-area-inset-bottom) +
var(--cta-height, 0px) + 24px)` 로 Sticky CTA 위로 자동 이동.
Sticky CTA 가 있는 페이지에서 `:root { --cta-height: 64px; }` 같은 식으로
설정하면 FAB 가 그만큼 위에 표시됨.

### Phase 2 후속 작업 메모 (P0-1 처리 시 반영)
- [ ] `/api/founding-members/count` `shouldCountVisitor()` 화이트리스트 밖
- [ ] `/api/feedback` 도 동일하게 화이트리스트 밖
- [ ] `/auth/age-restricted` 와 `/auth/complete-profile` 은 `/auth/` prefix 매칭으로
  이미 게이트 바이패스 (현행 isGateBypassPath 로직 활용)

### Phase 3 (DB·정책 변경) 진입 전 결정 필요
- D 항목 RLS 정책 (is_hidden + is_public_visible 공존) 적용 시점
- P0-9 CookieBanner 3-tier 재구현 시 legacy migration 로직 반영

