# Clouds with you (Legend of Korea)

> 한국 전설 IP 기반 미션 어드벤처 플랫폼 — 외국인 관광객 대상 (5 개국어)

## 🚀 Live

- Production: https://legend-of-korea.vercel.app
- Status: **Beta** (Founding Members 모집 중, 외부 사용자 0 명)

## 📋 Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **i18n**: next-intl (5 lang: ko / ja / en / zh-CN / zh-TW)
- **Email**: Resend (재인증 알림 / 부모 동의 등 트랜잭셔널)
- **OAuth**: Google + Kakao (LINE 비활성 — 정식 배포 후 추가)
- **Hosting**: Vercel (서울 리전 `icn1`)
- **Package Manager**: pnpm
- **Tests**: Vitest

## 🏗️ Project Structure

```
legend-of-korea/
├── app/[locale]/         # 5 개국어 라우팅
│   ├── auth/             # 로그인 / 회원가입 / 부모 동의 / 재인증
│   ├── courses/          # 코스 탐색 + 키트 구매
│   ├── missions/         # QR 미션 엔진
│   ├── community/        # 기록관 (게시글 / 댓글)
│   └── api/              # API routes
├── components/
│   ├── features/         # 기능별 (auth / mission / community / planner ...)
│   └── shared/           # 공용 (Navbar / MobileHeader / Footer ...)
├── lib/                  # 비즈니스 로직 (auth / supabase / validation ...)
├── messages/             # i18n 번역 (ko, ja, en, zh-CN, zh-TW)
├── supabase/migrations/  # DB 마이그레이션 (044, 046 활성)
├── docs/                 # 운영 가이드
└── hooks/                # 공용 React hook (useModalA11y 등)
```

## 🔧 Setup

### 1. 환경변수 (.env.local 작성)

```bash
cp .env.example .env.local
```

자세한 항목은 [.env.example](./.env.example) 참고. 필수:

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase 연결 |
| `RESEND_API_KEY` / `RESEND_FROM` | 재인증 메일 발송 |
| `CRON_SECRET` | Vercel Cron 인증 (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | Kakao Maps SDK |
| `TOUR_API_KEY` | 한국관광공사 TourAPI (숙박 검색) |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` / `TOSS_SECRET_KEY` | Toss 결제 (배포 직전 활성) |
| `STRIPE_*` | Stripe 결제 (배포 직전 활성) |

### 2. 패키지 설치 + 개발 서버

```bash
pnpm install
pnpm dev:clean   # .next 캐시 청소 + dev 서버 (Tailwind v4 안정 동작 보장)
```

> ⚠️ `pnpm install` 후 반드시 `.next` 폴더를 삭제한 뒤 시작 — vendor-chunks 불일치 사고 방지. 자세한 내용은 [CLAUDE.md](./CLAUDE.md) 절대 규칙 #4 참고.

### 3. Supabase 마이그레이션 적용

Supabase Dashboard → SQL Editor 에서 순서대로 실행:

```
supabase/migrations/044_users_birth_date_not_null.sql
supabase/migrations/046_oauth_birth_date_grace.sql
```

추가로 RLS 활성화 + Storage 버킷 (`mission-photos`, `community-photos`) 생성 필요. 배포 가이드: [docs/P0F-DEPLOY-GUIDE.md](./docs/P0F-DEPLOY-GUIDE.md)

### 4. OAuth 설정 (Supabase Dashboard)

- **Google**: Google Cloud Console → OAuth 클라이언트 ID/Secret → Supabase Authentication → Providers → Google 에 입력
- **Kakao**: Kakao Developers → 내 애플리케이션 → Client ID/Secret → Supabase 에 입력. 동의항목 `profile_nickname` 만 활성화 (account_email 비즈 인증 필요)
- Supabase Authentication → URL Configuration → Site URL: `https://legend-of-korea.vercel.app`, Redirect URLs: `https://legend-of-korea.vercel.app/**`

### 5. Vercel Cron 활성

`vercel.json` 의 cron 설정으로 매일 자정 UTC 에 `/api/cron/reauth-reminders` 실행 — D-30 / D-15 / D-1 윈도우의 사용자에게 Resend 메일 자동 발송.

## 🎯 Key Features (베타)

### 인증 / 권한
- 5 개국어 i18n (ko / ja / en / zh-CN / zh-TW)
- Google + Kakao OAuth (`profile_nickname` 만 요청 — KOE205 회피)
- Email 가입 + 14 세 검증 (PIPA §22-2 준수)
- 생년월일 3 분할 select UI (모바일 1900 년대 스크롤 부담 해소)
- P0F 재인증 시스템 — 60 일 grace, D-30 / D-15 / D-1 Resend 알림, D+60 강제 차단
- 부모 동의 시스템 (만 14 세 미만 → /auth/parent-consent)

### 콘텐츠 / 운영
- Mobile / Desktop 헤더 분리 (`MobileHeader.tsx`)
- 코스 탐색 + 키트 구매 흐름 (Toss / Stripe — manual 결제 모드)
- QR 셀프 미션 엔진
- 커뮤니티 기록관 + lightbox / 댓글
- Hero 패스 4 카드 토글
- 한국관광공사 TourAPI 숙박 검색

### 접근성 / 품질
- WCAG 2.2 AA 색상 대비
- Modal ESC + focus trap + previous active 복원 (`hooks/useModalA11y.ts`)
- ESLint warnings: 0
- JSON-LD 구조화 데이터 + 5 locale sitemap

## 📦 Deploy

main 브랜치 push 시 Vercel 자동 배포.

```bash
git checkout main
git pull origin main
git push origin main
```

## 🧪 검증

```bash
pnpm tsc --noEmit  # 타입 체크 (0 오류 유지)
pnpm lint          # ESLint (0 warning 유지)
pnpm test          # Vitest — lib/data/* 무결성
pnpm build         # 빌드 검증
```

## 📚 Docs

- [docs/P0F-DEPLOY-GUIDE.md](./docs/P0F-DEPLOY-GUIDE.md) — P0F 재인증 시스템 배포 가이드 (044 / 046 마이그레이션, Cron, Resend)
- [.env.example](./.env.example) — 환경변수 전체 (각 변수 발급 경로 코멘트)
- [CLAUDE.md](./CLAUDE.md) — 작업 절대 규칙 + 보안 / 안전 가이드
- `DEPLOYMENT.md` — 배포 운영 가이드 (RLS / Storage 버킷 등)

## ⚠️ 베타 단계 주의사항

- **Toss / Stripe**: `paymentProvider='manual'` 로 DB 레코드만 생성 — 실제 결제 호출 X. 배포 직전에만 활성.
- **AI 큐레이션**: `AI_CURATION_ENABLED=false` — `/api/planner/ai-curate` 가 stub. 배포 직전에만 활성.
- **TEST_MODE**: `true` 면 `/api/passes/status` 가 모든 사용자에게 풀 액세스 반환.
- **LINE OAuth**: UI 비활성 (`SocialLoginButtons.tsx` 블록 주석). Supabase Custom OAuth Provider 설정 + Channel 등록 필요.

## 📜 License

Private — All rights reserved © 2026 Clouds with you

---

**Beta 마일스톤**: 외부 사용자 0 명, 본인 2 계정으로 검증 중. 정식 출시 시 LINE OAuth 추가 + 도메인 전환 + Toss/Stripe 결제 활성 + AI 큐레이션 활성 예정.
