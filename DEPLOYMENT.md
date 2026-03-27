# Deployment Guide (Vercel & Supabase)

Follow this guide to transition Legend of Korea from development to production.

## 1. Vercel Configuration
- **GitHub Connection**: Set up a continuous and automatic deployment via GitHub.
- **Environment Variables**: Add all variables from `.env.example` in the Vercel dashboard.
- **Regions**: Defaults to `icn1` (Seoul) as per `vercel.json`.

## 2. Supabase Production Checklist
- **RLS Policies**: Ensure all tables have Row Level Security enabled.
- **Authentication**: Update 카카오, 구글, LINE providers with the production domain (`https://legendofkorea.com/auth/callback`).
- **Storage CORS**: Configure allowed origins to include the production domain.
- **Bucket Creation**: Create public buckets `mission-photos` and `community-photos`.

## 3. Payment Integration (Live)
- **Toss Payments**: Swap the `NEXT_PUBLIC_TOSS_CLIENT_KEY` and `TOSS_SECRET_KEY` with live keys.
- **Stripe**: Swap the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`. Set up a Live Webhook URL in Stripe pointing to `/api/webhooks/stripe`.

## 4. Custom Domain
- Connect `legendofkorea.com` from your registrar to Vercel via DNS (CNAME/A records).

## 5. SEO & Indexing
- Submit the generated `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Monitor `robots.txt` compliance.
