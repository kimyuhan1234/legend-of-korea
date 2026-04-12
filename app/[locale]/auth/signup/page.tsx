export const dynamic = 'force-dynamic'

import { Metadata } from "next"
import { SignupForm } from "@/components/features/auth/SignupForm"
import { SocialLoginButtons } from "@/components/features/auth/SocialLoginButtons"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: "회원가입 | Legend of Korea" },
  ja: { title: "新規登録 | Legend of Korea" },
  en: { title: "Sign Up | Legend of Korea" },
}

const TEXT = {
  ko: { title: "전설의 여정을\n시작하세요", subtitle: "지금 가입하고 첫 번째 코스에 도전하세요", divider: "또는 이메일로 가입" },
  ja: { title: "伝説の旅を\n始めましょう", subtitle: "今すぐ登録して最初のコースに挑戦", divider: "またはメールで登録" },
  en: { title: "Start Your\nLegendary Journey", subtitle: "Sign up now and tackle your first course", divider: "or sign up with email" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title }
}

export default function SignupPage({ params }: Props) {
  const locale = params.locale || "ko"
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 py-20 md:py-28">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg shadow-[#1F2937]/10 overflow-hidden">
          {/* 헤더 */}
          <div className="relative bg-[#F0F2F5] px-8 pt-10 pb-8 text-center">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#F0B8B8]/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#F0B8B8]/10 translate-y-1/2 -translate-x-1/2" />

            <div className="relative inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F0B8B8] flex items-center justify-center">
                <span className="text-[#111] font-black text-lg">伝</span>
              </div>
              <span className="text-white font-bold text-xl tracking-wide">Legend of Korea</span>
            </div>

            <h1 className="text-white font-bold text-2xl leading-tight whitespace-pre-line">
              {t.title}
            </h1>
            <p className="text-[#F0B8B8]/80 text-sm mt-2">{t.subtitle}</p>
          </div>

          {/* 폼 */}
          <div className="px-8 py-20 md:py-28 flex flex-col gap-6">
            {/* 소셜 로그인 */}
            <SocialLoginButtons locale={locale} mode="signup" />

            {/* 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E4E7EB]" />
              <span className="text-xs text-[#9CA3AF] font-medium">{t.divider}</span>
              <div className="flex-1 h-px bg-[#E4E7EB]" />
            </div>

            {/* 이메일 회원가입 */}
            <SignupForm locale={locale} />
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          © 2025 Legend of Korea
        </p>
      </div>
    </div>
  )
}
