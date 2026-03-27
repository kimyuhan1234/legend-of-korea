import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { locales } from "@/i18n"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

import { Toaster } from "@/components/ui/toaster"
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  
  const titles: Record<string, string> = {
    ko: "Legend of Korea - 한국 전설을 따라가는 미션 어드벤처",
    en: "Legend of Korea - Mission Adventure following Korean Legends",
    ja: "Legend of Korea - 韓国の伝説を辿るミッションアドベンチャー"
  }
  
  const descriptions: Record<string, string> = {
    ko: "한국의 전설 속 장소를 직접 탐험하며 미션을 해결하는 프리미엄 어드벤처 서비스입니다.",
    en: "A premium adventure service where you explore legendary places in Korea and solve missions.",
    ja: "韓国の伝説的な場所を探索し、ミッションを解決するプレミアムアドベンチャーサービスです。"
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

  return {
    title: {
      default: titles[locale] || titles.ko,
      template: `%s | Legend of Korea`
    },
    description: descriptions[locale] || descriptions.ko,
    manifest: "/manifest.json",
    themeColor: "#1B2A4A",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "LegendKR",
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: "Legend of Korea",
      title: titles[locale] || titles.ko,
      description: descriptions[locale] || descriptions.ko,
      url: `${siteUrl}/${locale}`,
      images: [
        {
          url: "/icons/icon-512x512.png",
          width: 512,
          height: 512,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.ko,
      description: descriptions[locale] || descriptions.ko,
      images: ["/icons/icon-512x512.png"],
    },
    alternates: {
      languages: {
        'ko-KR': '/ko',
        'ja-JP': '/ja',
        'en-US': '/en',
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params

  if (!locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col" lang={locale}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <Toaster />
      </NextIntlClientProvider>
    </div>
  )
}
