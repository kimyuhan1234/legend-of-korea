export const dynamic = 'force-dynamic'

import { Metadata } from "next"
import Image from "next/image"
import { LoginForm } from "@/components/features/auth/LoginForm"
import { SocialLoginButtons } from "@/components/features/auth/SocialLoginButtons"

interface Props {
  params: { locale: string }
  searchParams: { error?: string }
}

const META = {
  ko: { title: "로그인 | Legend of Korea", description: "전설의 세계로 입장하세요" },
  ja: { title: "ログイン | Legend of Korea", description: "伝説の世界へようこそ" },
  en: { title: "Sign In | Legend of Korea", description: "Enter the world of legends" },
}

const TEXT = {
  ko: { title: "전설의 세계로\n입장하세요", subtitle: "한국 전래동화 속 주인공이 되어보세요", divider: "또는" },
  ja: { title: "伝説の世界へ\nようこそ", subtitle: "韓国の昔話の主人公になってみましょう", divider: "または" },
  en: { title: "Enter the World\nof Legends", subtitle: "Become the hero of Korean folklore", divider: "or" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title, description: m.description }
}

export default function LoginPage({ params, searchParams }: Props) {
  const locale = params.locale || "ko"
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 카드 */}
        <div className="bg-white rounded-3xl shadow-lg shadow-[#1B2A4A]/10 overflow-hidden">
          {/* 헤더 배너 */}
          <div className="relative bg-[#1B2A4A] px-8 pt-10 pb-8 text-center">
            {/* 장식용 원형 패턴 */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#D4A843]/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#D4A843]/10 translate-y-1/2 -translate-x-1/2" />

            {/* 로고 */}
            <div className="relative inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4A843] flex items-center justify-center">
                <span className="text-[#1B2A4A] font-black text-lg">伝</span>
              </div>
              <span className="text-white font-bold text-xl tracking-wide">Legend of Korea</span>
            </div>

            <h1 className="text-white font-bold text-2xl leading-tight whitespace-pre-line">
              {t.title}
            </h1>
            <p className="text-[#D4A843]/80 text-sm mt-2">{t.subtitle}</p>
          </div>

          {/* 폼 영역 */}
          <div className="px-8 py-8 flex flex-col gap-6">
            {/* 에러 파라미터 */}
            {searchParams.error === "auth_failed" && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {locale === "ko" ? "로그인에 실패했습니다. 다시 시도해주세요." :
                 locale === "ja" ? "ログインに失敗しました。もう一度お試しください。" :
                 "Login failed. Please try again."}
              </div>
            )}

            {/* 소셜 로그인 */}
            <SocialLoginButtons locale={locale} mode="login" />

            {/* 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e8ddd0]" />
              <span className="text-xs text-[#b0a090] font-medium">{t.divider}</span>
              <div className="flex-1 h-px bg-[#e8ddd0]" />
            </div>

            {/* 이메일 로그인 */}
            <LoginForm locale={locale} />
          </div>
        </div>

        {/* 하단 장식 */}
        <p className="text-center text-xs text-[#b0a090] mt-6">
          © 2025 Legend of Korea
        </p>
      </div>
    </div>
  )
}
