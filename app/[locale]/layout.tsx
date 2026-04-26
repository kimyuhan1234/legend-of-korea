import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/contexts/CartContext"
import { CartSidePanel } from "@/components/shared/CartSidePanel"
import { CookieBanner } from "@/components/shared/CookieBanner"
import { FoundingMembersBanner } from "@/components/shared/FoundingMembersBanner"
import { FeedbackWidget } from "@/components/shared/FeedbackWidget"
import { StickyCTA } from "@/components/shared/StickyCTA"
import { locales } from "@/i18n"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#9DD8CE',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params

  const titles: Record<string, string> = {
    ko: "Cloud with you - 한국 전설을 따라가는 미션 어드벤처",
    en: "Cloud with you - Mission Adventure following Korean Legends",
    ja: "Cloud with you - 韓国の伝説を辿るミッションアドベンチャー",
  }

  const descriptions: Record<string, string> = {
    ko: "한국의 전설 속 장소를 직접 탐험하며 미션을 해결하는 프리미엄 어드벤처 서비스입니다.",
    en: "A premium adventure service where you explore legendary places in Korea and solve missions.",
    ja: "韓国の伝説的な場所を探索し、ミッションを解決するプレミアムアドベンチャーサービスです。",
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://legendofkorea.com"

  return {
    title: {
      default: titles[locale] || titles.en || titles.ko,
      template: "%s | Cloud with you",
    },
    description: descriptions[locale] || descriptions.en || descriptions.ko,
    formatDetection: { telephone: false },
    openGraph: {
      type: "website",
      siteName: "Cloud with you",
      title: titles[locale] || titles.en || titles.ko,
      description: descriptions[locale] || descriptions.en || descriptions.ko,
      url: `${siteUrl}/${locale}`,
      images: [{ url: "/images/dokkaebi-hero.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.en || titles.ko,
      description: descriptions[locale] || descriptions.en || descriptions.ko,
      images: ["/images/dokkaebi-hero.jpg"],
    },
    alternates: {
      languages: {
        "ko-KR": "/ko",
        "ja-JP": "/ja",
        "en-US": "/en",
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params

  if (!locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <div className="min-h-screen bg-snow flex flex-col">
      <NextIntlClientProvider messages={messages} locale={locale}>
        <CartProvider>
          <Navbar locale={locale} />
          <FoundingMembersBanner />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
          <Toaster />
          <CartSidePanel />
          <CookieBanner />
          {/* P1-2: 모바일 전용 Sticky CTA (auth/mypage/checkout 페이지에서는 자동 숨김) */}
          <StickyCTA />
          {/* 베타 피드백 — Sticky CTA 충돌 페이지에서는 hideOn 추가 */}
          <FeedbackWidget hideOn={["/*/auth/*"]} />
        </CartProvider>
      </NextIntlClientProvider>
    </div>
  )
}