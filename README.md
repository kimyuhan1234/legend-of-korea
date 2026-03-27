# Legend of Korea (전설의 한국)

"Follow the Legends, Become the Hero." — Explore Korean folklore through an immersive mission adventure.

Legend of Korea is a premium PWA-based adventure platform that combines offline exploration (Mission Kits) with online mission-solving (QR-based engine).

## 🚀 Built With
- **Framework**: [Next.js 14 App Router](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, DB, Storage)
- **Localizaton**: [next-intl](https://next-intl-docs.vercel.app/) (KO, JA, EN)
- **Payments**: [Toss Payments](https://toss.im/payments) & [Stripe](https://stripe.com/)
- **Charts**: [Recharts](https://recharts.org/)

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+
- pnpm

### 2. Environment Setup
```bash
cp .env.example .env.local
```
Fill in the Supabase and Payment gateway credentials.

### 3. Execution
```bash
pnpm install
pnpm dev
```

## 📦 Supabase Setup
- Run the SQL migrations found in the `/supabase/migrations` folder.
- Enable RLS on all tables as documented in `DEPLOYMENT.md`.
- Create Storage buckets: `mission-photos`, `community-photos`.

## ✨ Core Features
- **PWA Support**: Full mobile-first experience with offline capabilities.
- **Multilingual Support**: Fully localized in Korean, English, and Japanese.
- **QR Mission Engine**: Scoped mission progress tracking and hint systems.
- **Admin Dashboard**: Real-time sales analytics, B2B order management, and community moderation.
- **Progression System**: LP (Legend Points) earning and Tier-based status upgrades.

## 📄 License
MIT License. © 2025 Legend of Korea.
