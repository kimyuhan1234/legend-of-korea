# PRD-P0-FOLLOWUP 배포 가이드

**작성일**: 2026-04-27
**대상**: PRD-P0-FOLLOWUP 4 단계 (P0F-1 ~ P0F-4) 머지 + 배포.
**목적**: 만 14세 미만 보호 시스템 완성 (PIPA §22-2 + COPPA).

---

## 1. 머지 전 체크리스트

### 1-A. Git 상태

```bash
git checkout feature/p0-followup-reauth
git log --oneline | head -6
# b7ef3ce feat(P0F-1): 044 마이그레이션
# d96991a feat(P0F-2): 재인증 모달 + API + 5 lang i18n
# 8f03dbc feat(P0F-3): D+60 단계 제재
# 3b87a5d feat(P0F-4): Resend 재인증 알림 + Vercel Cron
```

### 1-B. 검증

```bash
pnpm tsc --noEmit
pnpm test
pnpm build
pnpm lint
```

모두 통과 확인.

---

## 2. 머지 + 배포

```bash
git checkout main
git pull origin main
git merge --ff-only feature/p0-followup-reauth
git push origin main
```

Vercel 자동 빌드 + 배포 시작.

---

## 3. 배포 후 사용자 작업 (필수)

### 3-A. Supabase 044 마이그레이션 적용

```sql
-- Supabase Dashboard → SQL Editor → 044_users_birth_date_not_null.sql 내용 붙여넣기 → Run
```

검증 쿼리:
```sql
SELECT
  COUNT(*)                   AS total_users,
  COUNT(birth_date)          AS with_birth_date,
  COUNT(birth_date_deadline) AS pending_reauth
FROM public.users;
-- 예상: 2 / 0 / 2 (본인 2명, 모두 deadline 60일 부여)
```

### 3-B. Vercel 환경변수 추가

Vercel Dashboard → Settings → Environment Variables:

| 변수명 | 값 | 비고 |
|---|---|---|
| `RESEND_API_KEY` | `re_xxx...` | Resend Dashboard 에서 복사 |
| `RESEND_FROM` | `Cloud with you <onboarding@resend.dev>` | default 사용 (도메인 미구매) |
| `CRON_SECRET` | `<32자 랜덤>` | `openssl rand -base64 32` |

추가 후 Vercel 재배포 트리거.

### 3-C. Vercel Cron 활성 확인

Vercel Dashboard → Crons 탭:
- `/api/cron/reauth-reminders` — `0 0 * * *` (매일 자정 UTC)
- Hobby plan: 1 cron 제한 — 활성 가능 ✓

---

## 4. 동작 검증 시나리오

### 4-A. birth_date NULL 사용자 로그인 시나리오

1. 본인 계정 (birth_date IS NULL) 으로 로그인
2. 어떤 [locale] 페이지 진입 시 → ReauthBirthDateModal 강제 노출
3. ESC / backdrop 클릭으로 닫히지 않음 (인증 강제)
4. 14세 이상 입력 → router.refresh() → 모달 사라짐 + 정상 사용
5. 14세 미만 입력 → /auth/parent-consent 자동 redirect

### 4-B. D+60 강제 차단 시뮬레이션

```sql
-- 본인 계정의 deadline 을 1일 전으로 설정 (테스트)
UPDATE public.users
   SET birth_date_deadline = NOW() - INTERVAL '1 day'
 WHERE email = 'test@example.com';
```

- 페이지 진입 시 → 자동 sign out + `/auth/login?reason=birthDateBlocked` redirect
- BirthDateBlockedNotice 안내 노출 (5 lang)
- 다시 로그인 → 모달 다시 노출 (deadline 그대로 유지 — DB 에서 직접 갱신 필요)

### 4-C. Resend 메일 수동 테스트

```bash
# CRON_SECRET 으로 cron route 직접 호출
curl -H "Authorization: Bearer ${CRON_SECRET}" \
  https://legend-of-korea.vercel.app/api/cron/reauth-reminders
```

응답 예시:
```json
{
  "timestamp": "2026-04-27T09:00:00.000Z",
  "totalSent": 0,
  "successCount": 0,
  "breakdown": []
}
```

처음 호출은 deadline 윈도우 (D-30/D-15/D-1) 가 맞지 않아 0 건. 본인 계정 deadline 을
조정하면 즉시 발송 테스트 가능:

```sql
-- D-30 시뮬레이션: deadline 을 30일 후로 설정
UPDATE public.users
   SET birth_date_deadline = NOW() + INTERVAL '30 days' + INTERVAL '6 hours'
 WHERE email = 'test@example.com';
```

다시 cron route 호출 → Resend Dashboard 에서 발송 로그 확인.

---

## 5. 롤백 절차 (필요 시)

### 5-A. 코드 롤백

```bash
git revert <merge-commit-sha>
git push origin main
```

### 5-B. DB 롤백

```sql
-- 044 마이그레이션 효과 되돌리기 (필요 시만)
DROP TRIGGER IF EXISTS enforce_birth_date_on_signup_trigger ON public.users;
DROP FUNCTION IF EXISTS public.enforce_birth_date_on_signup();
DROP INDEX IF EXISTS public.idx_users_birth_date_deadline;
ALTER TABLE public.users DROP COLUMN IF EXISTS birth_date_deadline;
```

---

## 6. 후속 PR (별도 사이클)

### 6-A. 진짜 NOT NULL 제약

모든 사용자 재인증 완료 후:
```sql
ALTER TABLE public.users ALTER COLUMN birth_date SET NOT NULL;
```

### 6-B. API route 보호

결제 / 미션 진행 등 핵심 API 에 sanction helper 추가 — page-level 보호 외 추가 안전망.

### 6-C. 도메인 구매 후 Resend 도메인 인증

운영 도메인 구매 시:
1. Resend Dashboard → Domains → 운영 도메인 추가 + DNS 인증
2. RESEND_FROM 환경변수 → `Cloud with you <noreply@yourdomain.com>` 변경
3. SPF / DKIM / DMARC 레코드 등록

### 6-D. 부모 동의 메일 발송 (P0-5-C-2 후속)

현재 부모 동의 페이지는 DB 레코드 생성만. Resend 연동 후:
- POST /api/auth/parent-consent/request → 토큰 메일 발송
- 부모가 메일 링크 클릭 → /auth/parent-consent/[token] 검증

---

## 부록: 파일 변경 요약

### 신규
- `supabase/migrations/044_users_birth_date_not_null.sql`
- `app/api/auth/reauth-birth-date/route.ts`
- `app/api/cron/reauth-reminders/route.ts`
- `components/features/auth/BirthDateGate.tsx`
- `components/features/auth/ReauthBirthDateModal.tsx`
- `lib/email/send-reauth-email.ts`
- `docs/P0F-DEPLOY-GUIDE.md` (본 문서)

### 수정
- `app/[locale]/layout.tsx` (BirthDateGate 마운트)
- `app/[locale]/auth/login/page.tsx` (BirthDateBlockedNotice 추가)
- `lib/supabase/types.ts` (birth_date_deadline 컬럼 동기화)
- `messages/{ko,ja,en,zh-CN,zh-TW}.json` (reauth namespace)
- `.env.example` (RESEND_API_KEY / RESEND_FROM / CRON_SECRET)
- `vercel.json` (crons 배열)
- `package.json` / `pnpm-lock.yaml` (resend@^6.12)
