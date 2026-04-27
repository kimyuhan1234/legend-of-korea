# Deployment Guide (Vercel & Supabase)

Follow this guide to transition Legend of Korea from development to production.

## 1. Vercel Configuration
- **GitHub Connection**: Set up a continuous and automatic deployment via GitHub.
- **Environment Variables**: Add all variables from `.env.example` in the Vercel dashboard.
- **Regions**: Defaults to `icn1` (Seoul) as per `vercel.json`.

## 2. Supabase Production Checklist
- **RLS Policies**: Ensure all tables have Row Level Security enabled.

### courses 테이블 RLS 설정 (배포 전 반드시 실행)
개발 중 RLS를 비활성화한 경우, 배포 전 아래 SQL을 Supabase SQL Editor에서 실행하세요:

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 모든 코스를 공개 조회 가능 (is_active 필터링은 앱 코드에서 처리)
CREATE POLICY "Public read all courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Admins full access"
  ON courses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
```

> **변경 이유**: `USING (is_active = true)` 정책은 비활성 코스(준비 중)를 완전히 차단하여
> 프론트엔드에서 "준비 중" 상태를 표시할 수 없는 문제가 있었습니다.
> `USING (true)`로 변경 후 앱 코드에서 `is_active` 기준으로 구분하여 처리합니다.
- **Authentication**: Update 카카오, 구글, LINE providers with the production domain (`https://legend-of-korea.vercel.app/auth/callback`).
  > **현재**: `https://legend-of-korea.vercel.app/auth/callback` (Vercel preview/베타 도메인)
  > **향후**: 운영 도메인 구매 시 `https://legendofkorea.com/auth/callback` 으로 변경
- **Storage CORS**: Configure allowed origins to include the production domain.
- **Bucket Creation**: Create public buckets `mission-photos` and `community-photos`.

## 3. Payment Integration (Live)
- **Toss Payments**: Swap the `NEXT_PUBLIC_TOSS_CLIENT_KEY` and `TOSS_SECRET_KEY` with live keys.
- **Stripe**: Swap the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`. Set up a Live Webhook URL in Stripe pointing to `/api/webhooks/stripe`.

## 4. Custom Domain
- **현재**: `legend-of-korea.vercel.app` (Vercel 자동 도메인 — 베타 단계 사용)
- **향후 운영 도메인 구매 시**: `legendofkorea.com` 을 registrar 에서 Vercel 로 연결 (CNAME/A records).
  도메인 연결 후 `NEXT_PUBLIC_SITE_URL` 환경변수 갱신 + OAuth provider callback URL 도 함께 변경.

## 5. SEO & Indexing
- Submit the generated `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Monitor `robots.txt` compliance.
