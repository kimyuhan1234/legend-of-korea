# Auth 플로우 전수 점검 — 2026-05

작성: 2026-05-04 / 코드 기반 / commit `0fe725d` 기준

---

## 요약 매트릭스 (10 영역 × Pass/Warning/Critical)

| 영역 | 상태 | 발견 이슈 | 즉시 수정 | 보고만 |
|---|---|---|---|---|
| [1] 인증 방식 | ✅ Pass | 4종 (이메일+Google+Kakao + LINE TODO) | — | LINE 정식 활성화 결정 |
| [2] ENV | ✅ Pass | 22개 모두 정의·사용 일치 | — | — |
| [3] 회원가입 | ⚠️ Warning | captcha/rate-limit 0건, 가입 화면 PUBLIC | — | 정식 오픈 전 captcha + 가입 차단 결정 |
| [4] 로그인 | ✅ Pass | 이메일 / 2 OAuth + birth_date 게이트 | — | — |
| [5] 세션 | ⚠️ Warning | 이중 미들웨어 (lib redirect dead code 의심) | — | middleware 단일화 결정 |
| [6] 로그아웃 | ✅ Pass | server action signOut + redirect | — | — |
| [7] 권한 | ⚠️ Warning | mypage hasPurchased=true 하드코딩 | — | ZEP audit 우선순위 3 통합 |
| [8] i18n | ✅ Pass | auth namespace 30 키 × 5 locale 모두 채움 | — | — |
| [9] 보안/컴플라이언스 | 🔴 Critical | captcha 0 / 이메일 verify 옵션화 / GDPR 미정 | — | 정식 오픈 전 GDPR + captcha 필수 |
| [10] 보고서 | ✅ Pass | 본 파일 | — | — |

---

## [1] 인증 방식 전수

**활성 (3종)**:
1. **이메일 + 비밀번호** — Supabase Auth `signInWithPassword` / `signUp`
2. **Google OAuth** — `signInWithOAuth({ provider: 'google' })`
3. **Kakao OAuth** — `signInWithOAuth({ provider: 'kakao' })` + scope 강제 (KOE205 회피)

**비활성 (TODO)**:
4. **LINE OAuth** — `lib/auth/actions.ts:88` provider type 타입은 `'kakao' | 'google' | 'line'`으로 보존, [SocialLoginButtons.tsx:41-60](components/features/auth/SocialLoginButtons.tsx#L41) 객체 주석 처리. Supabase 기본 미지원 → Custom OAuth Provider 등록 필요.

**미지원**: Apple / Magic link / Phone OTP / SAML / SSO

**관련 파일** (25 파일):
```
app/[locale]/auth/
├── login/page.tsx
├── signup/page.tsx
├── complete-profile/page.tsx     — OAuth 후 birth_date 입력
├── age-restricted/page.tsx       — 14세 미만 차단
├── parent-consent/page.tsx       — 보호자 동의 요청
├── parent-consent/[token]/page.tsx
└── callback/route.ts             — OAuth callback handler

components/features/auth/
├── LoginForm.tsx / SignupForm.tsx / LogoutButton.tsx
├── SocialLoginButtons.tsx
├── BirthDateGate.tsx / BirthDatePicker.tsx
├── CompleteProfileForm.tsx
├── ParentConsentForm.tsx
└── ReauthBirthDateModal.tsx      — 재인증 모달

lib/auth/
├── actions.ts                    — server actions
├── admin.ts                      — ADMIN_EMAILS 화이트리스트
├── pass.ts                       — hasActivePass() + TEST_MODE 우회
└── password-rules.ts             — 8자+대소문자+숫자+특수문자

lib/supabase/
├── client.ts                     — createBrowserClient
├── server.ts                     — createServerClient
├── middleware.ts                 — updateSession (이중 보호 의심)
├── middleware-user.ts            — getSessionEmail (관리자 바이패스)
└── types.ts                      — DB 타입 정의

app/api/auth/
├── complete-profile/route.ts
├── parent-consent/request/route.ts
└── reauth-birth-date/route.ts

app/api/cron/
└── reauth-reminders/route.ts     — Vercel Cron (재인증 알림)
```

---

## [2] ENV 정합성

**인증 관련 ENV (10개) — 모두 .env.example 정의 + 코드 사용 일치**:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` / `RESEND_FROM` (재인증 메일)
- `CRON_SECRET` (Vercel Cron 인증)
- `ADMIN_EMAILS` (관리자 화이트리스트)
- `TEST_MODE` (모든 사용자 풀 액세스)
- `NEXT_PUBLIC_TEST_MODE` (회원가입 안내 배너)
- `MAX_DAILY_VISITORS` (일일 방문자 게이트)

**OAuth client id/secret**: **코드에 직접 사용 X** — Supabase Dashboard에서 관리 (Google / Kakao). LINE은 미설정. NextAuth 미사용.

→ Pass. Stripe ENV 3종은 dead (직전 site-audit 보고).

---

## [3] 회원가입 플로우

### 3-1. 페이지: [/auth/signup](app/[locale]/auth/signup/page.tsx)
- **PUBLIC_PATHS 포함** ([middleware.ts:20](middleware.ts#L20)) — **누구나 접근 가능**
- 운영자 발언 ("법률 자문 후 정식 회원가입 오픈") 고려 시 **잠재적 차단 필요 영역**

### 3-2. 입력 검증 ([actions.ts:33-83](lib/auth/actions.ts#L33))
- 필수 필드: email / password / nickname / birthDate
- nickname 길이 ≤ 20
- 비밀번호 규칙 ([password-rules.ts](lib/auth/password-rules.ts)): 8자 + 대문자 + 소문자 + 숫자 + 특수문자 — **5종 모두 강제** (강력)
- 만 14세 미만 차단 (PIPA §22-2) — `auth.users` INSERT **전** 차단 (사후 삭제 X, 사전 차단 ✅)

### 3-3. 에러 처리
- `MISSING_FIELDS` / `NICKNAME_TOO_LONG` / `PASSWORD_RULES` / `UNDER_14` / `EMAIL_TAKEN` / 일반
- ⚠️ **`EMAIL_TAKEN` 감지**: `error.message.includes('already registered')` — Supabase 영문 메시지 문자열 매칭. 메시지 변경 시 fragile.

### 3-4. 가입 후 흐름
- `supabase.auth.signUp({ data: { nickname, language, birth_date }, emailRedirectTo })`
- raw_user_meta_data 로 birth_date 전달 → 040 migration 트리거가 `public.users` INSERT 시 자동 저장
- `signInWithPassword` 즉시 시도 → 성공 시 `SIGNED_IN` / 실패(이메일 미인증) 시 `EMAIL_CONFIRM_REQUIRED`
- ⚠️ Supabase project 설정에 따라 이메일 confirm 필수/선택

### 3-5. 회원가입 차단 옵션 (현재 없음)
- `NEXT_PUBLIC_TEST_MODE` env는 **회원가입 안내 배너 표시용**, 가입 자체 차단 X
- 가입 차단 필요 시 신규 ENV (예: `NEXT_PUBLIC_SIGNUP_OPEN=false`) + signup page에서 `notFound()` 또는 maintenance redirect 패턴 권장

### 3-6. 보안
- **captcha / hCaptcha / Turnstile / reCAPTCHA: 0건** — 스팸 가입 위험
- **server action 호출**: API route가 아니라 middleware의 rate limit 적용 X — 동일 IP에서 무제한 가입 시도 가능
- 환영 이메일: Supabase의 emailRedirectTo (default 인증 메일). Resend로 별도 환영 메일 X.

---

## [4] 로그인 플로우

### 4-1. 페이지: [/auth/login](app/[locale]/auth/login/page.tsx)
- PUBLIC_PATHS 포함
- 입력: email / password
- "비밀번호 찾기" 링크: **확인 필요** (LoginForm read 시점에 명시적 추출 X)

### 4-2. 흐름 ([actions.ts:11-28](lib/auth/actions.ts#L11))
- `signInWithPassword({ email, password })`
- 실패 시 `error.message` 그대로 반환 (Supabase 영문 메시지 → ko 사용자에 영문 노출)
- 성공 시 `next` 파라미터 또는 `/{locale}` 홈으로 redirect

### 4-3. OAuth 콜백 ([callback/route.ts](app/[locale]/auth/callback/route.ts))
- `exchangeCodeForSession(code)` → 세션 발급
- `public.users.birth_date` 확인:
  - 있음 → 정상 진입
  - 없음 → `/auth/complete-profile?next=...`
- 14세 검증은 complete-profile 단계로 위임

### 4-4. Redirect URI
- `${NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`
- 5 locale 각각 등록 필요 (Supabase Dashboard + Google/Kakao 콘솔)
- runtime 검증 필요 (운영자 결정 시 별도)

### 4-5. Supabase Auth Helpers 일관성
- 클라이언트: `createClient()` from `lib/supabase/client.ts` (browser)
- 서버: `createClient()` from `lib/supabase/server.ts` (RSC)
- 미들웨어: `updateSession()` from `lib/supabase/middleware.ts`
- 일관성 ✅

---

## [5] 세션 관리

### 5-1. 미들웨어 구조 (이중 보호)

**Top-level [middleware.ts](middleware.ts)** — 진실의 source:
- PUBLIC_PATHS (`/`, `/auth`, `/discover`, `/community`, `/story`, `/pass`, `/courses`, `/stay`, `/privacy`, `/terms`, `/maintenance`)
- 그 외 전부 로그인 요구 → `/auth/login?next=...` redirect
- 인식 쿠키: `sb-{ref}-auth-token` + `.0`/`.1` 분할 토큰 (hotfix line 207, 무한 redirect 회귀 회피)

**lib/supabase/middleware.ts** `updateSession`:
- `["/mypage", "/missions"]` + `/admin` 보호
- redirect 로직 있으나 **top-level이 결과를 반환하지 않음** (line 191 intl response 우선) → **lib redirect는 실질적으로 dead code**
- 단, `await supabase.auth.getUser()` 호출은 세션 갱신 효과 있음

**판정**: 이중 보호 코드는 잠재 위험. lib redirect 제거하면 코드 정리되지만 변경 risky → **보고만**.

### 5-2. 쿠키 설정
- Supabase가 자동 처리: `httpOnly` / `secure` (HTTPS) / `SameSite=Lax`
- 운영자 직접 설정 X — Supabase SSR 표준

### 5-3. localStorage / sessionStorage 민감 정보
- Supabase는 기본적으로 쿠키 기반 (httpOnly) 사용 — XSS 격리 ✅
- 직접 localStorage에 토큰 저장하는 코드 0건

### 5-4. 세션 만료 / 갱신
- `updateSession`이 미들웨어마다 호출 → 자동 refresh
- 강제 로그아웃 메커니즘 없음 (관리자가 Supabase Dashboard에서 직접 revoke 필요)

---

## [6] 로그아웃

### 6-1. 위치
- 헤더 우측 [Navbar.tsx 사용자 드롭다운](components/shared/Navbar.tsx) → `LogoutButton`
- 마이페이지 ([components/features/auth/LogoutButton.tsx](components/features/auth/LogoutButton.tsx))

### 6-2. 흐름 ([actions.ts:129-133](lib/auth/actions.ts#L129))
- `supabase.auth.signOut()` → 세션·쿠키 정리 (Supabase 자동)
- `redirect('/{locale}')` 홈으로

### 6-3. 다중 탭 동기화
- Supabase Auth는 BroadcastChannel을 사용해 자동 동기화 (Supabase JS 기본)
- 별도 onAuthStateChange 리스너 운영자 코드 미작성 — Supabase 기본 동작 의존

---

## [7] 권한 / 역할

### 7-1. admin 권한
- **이중 검증**:
  1. **화이트리스트** ([lib/auth/admin.ts](lib/auth/admin.ts)): `process.env.ADMIN_EMAILS` (콤마 구분) — `requireAdmin()` / `requireAdminPage()` / `isAdminEmail()` 헬퍼
  2. **DB role 컬럼** ([lib/supabase/middleware.ts:50](lib/supabase/middleware.ts)): `users.role === 'admin'`
- 두 방식 혼재 — 운영 시점에 단일화 권장

### 7-2. PASS 권한 ([lib/auth/pass.ts](lib/auth/pass.ts))
- `hasActivePass(userId)` — `passes.status='active' AND expires_at > now()`
- `TEST_MODE=true` 우회 (베타 단계) — 모든 사용자에게 풀 액세스

### 7-3. mypage 하드코딩 위험
- [MyPageClient.tsx:316](app/[locale]/mypage/MyPageClient.tsx#L316) `hasPurchased={true}` — 실제 패스 검증 없이 무조건 ZEP 버튼 표시
- 동일 [purchase/success/page.tsx:123](app/[locale]/courses/[courseId]/purchase/success/page.tsx#L123) `hasPurchased={true}`
- → ZEP audit 보고서의 우선순위 3 작업과 통합 권장

### 7-4. ZEP 권한
- 평문 password 클라이언트 노출 (보안 X) — ZEP audit 우선순위 2 작업 대기 중

---

## [8] i18n / 카피

### 8-1. auth namespace
- 5 locale 모두 30 키 (ko/ja/en/zh-CN/zh-TW)
- 차이 0 — 잘 채워짐

### 8-2. 약관 / 개인정보처리방침
- [/terms](app/[locale]/terms/page.tsx) / [/privacy](app/[locale]/privacy/page.tsx) / [/location-terms](app/[locale]/location-terms/page.tsx)
- 5 locale 본문 작성됨
- 단, terms 본문에 `Move/Live/Story/All-in-One` 구버전 키트 표기 잔존 (PRD-PRICING-2026-001 후 Toss 단일화로 변경됐는데 약관 본문 미수정)

### 8-3. 에러 메시지
- Supabase 영문 에러 (`error.message`) 그대로 노출 — ko 사용자에게 영문 노출
- 회원가입 에러 코드(`MISSING_FIELDS`/`UNDER_14`/...) 5개국어 번역은 frontend가 처리하는지 확인 필요 (signup 폼 구현 의존)

---

## [9] 보안 / 컴플라이언스

### 9-1. 비밀번호 평문 로깅
- console.log에서 password / email / token 노출: **0건** ✅
- next.config의 `removeConsole` (production) 자동 제거

### 9-2. captcha / 봇 보호
- **captcha 0건** 🔴
- signup은 server action (`use server`) — middleware rate limit 미적용
- → 정식 오픈 전 hCaptcha / Turnstile 적용 필수

### 9-3. 이메일 인증
- `supabase.auth.signUp({ emailRedirectTo })` — Supabase project 설정 의존
- "Email confirmations" 옵션 ON 시 이메일 confirm 후 로그인 가능
- 코드는 OFF 가정으로 즉시 `signInWithPassword` 호출 → confirm 미설정 환경에서도 작동

### 9-4. GDPR / PIPA 대응
- **약관 동의 흐름**: signup 폼에서 약관 체크 (확인 필요)
- **개인정보 삭제 권리**: [/api/account/delete](app/api/account/delete) 라우트 존재 ✅
- **데이터 이동권** (GDPR Article 20): 미구현
- **Cookie consent banner**: 미구현 (외국인 EU 사용자 GDPR 위반 위험)
- **만 14세 미만**: 사전 차단 + parent-consent 흐름 ✅

### 9-5. 정식 배포 전 필수 항목
- [ ] captcha 적용 (signup + login)
- [ ] cookie consent banner (EU GDPR)
- [ ] 약관 본문 PRD-PRICING-2026-001 반영 (구 키트 명칭 정리)
- [ ] LINE OAuth 활성화 또는 명시적 비활성 표시
- [ ] mypage / purchase-success의 `hasPurchased` 하드코딩 → 실 패스 검증
- [ ] ZEP password 환경변수 분리 (ZEP audit 우선순위 2)

---

## [10] 보고서

본 파일.

---

## 즉시 수정 변경 사항 (0건)

본 점검에서 발견된 모든 이슈는 **운영자 결정이 필요한 사항** 또는 **다른 audit과 통합 처리 권장**. 단발 1줄 수정 대상 없음.

---

## 운영자 결정 대기 항목

### 정식 오픈 전 **반드시** 해결 (5건)
1. **captcha 적용** — hCaptcha / Cloudflare Turnstile / reCAPTCHA 중 선택. signup + login 폼에 적용. 단발 작업 ~2시간.
2. **cookie consent banner** — GDPR 대응. EU 사용자 첫 방문 시 동의 배너. ~2시간.
3. **회원가입 차단 옵션** — `NEXT_PUBLIC_SIGNUP_OPEN=false` env + signup page 분기. 30분.
4. **mypage / purchase-success `hasPurchased={true}` 제거** — 실 `hasActivePass()` 검증으로 변경. ZEP audit 우선순위 3 통합. 30분.
5. **ZEP password 환경변수 분리** — ZEP audit 우선순위 2 작업. ~1시간.

### 정식 오픈 후 단계적 (4건)
6. **LINE OAuth 활성화** — Supabase Custom OAuth Provider 설정 + 코드 주석 해제.
7. **에러 메시지 다국어화** — Supabase 영문 에러를 사용자 locale로 번역.
8. **GDPR 데이터 이동권** — `/api/account/export` route 추가.
9. **약관 본문 PRD 반영** — terms/page.tsx의 구 키트 명칭(Move/Live/Story/All-in-One) 정리.

### 선택 사항 (2건)
10. **lib/supabase/middleware.ts dead code 정리** — redirect 로직 제거 또는 명시적 비활성 코멘트.
11. **admin 권한 단일화** — ADMIN_EMAILS 화이트리스트 vs `users.role` 둘 중 하나로 통합.

---

## 다음 의사결정 필요 항목 (Top 3)

1. **회원가입 차단 정책** — 운영자 발언 "법률 자문 후 정식 오픈"과 코드 상태 불일치. 즉시 차단할지, 베타 가입 허용할지 결정 필요.
2. **GDPR 대응 범위** — EU 사용자 비율 추정. cookie consent banner 우선순위.
3. **OAuth provider 추가** — Apple OAuth는 외국인 타겟에 영향 있음 (특히 일본/미국). 추가 여부.

---

**보고서 끝.**
