export const dynamic = 'force-dynamic'

import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LoginForm } from "@/components/features/auth/LoginForm"
import { SocialLoginButtons } from "@/components/features/auth/SocialLoginButtons"

// P0F-3: birth_date deadline 초과로 강제 sign out 된 사용자에게 표시되는 안내.
// reauth.blockedTitle / reauth.blockedBody i18n 사용.
async function BirthDateBlockedNotice({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'reauth' })
  return (
    <div
      role="alert"
      className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-sm"
    >
      <p className="font-bold mb-1">{t('blockedTitle')}</p>
      <p className="text-xs leading-relaxed">{t('blockedBody')}</p>
    </div>
  )
}

/**
 * 이메일 인증 콜백 후 (재방문 / 다른 브라우저 / cookie race 등으로
 * 즉시 자동 로그인 안 된 경우) 표시되는 안내.
 * auth.emailVerifiedNotice i18n 사용.
 */
async function EmailVerifiedNotice({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'auth' })
  return (
    <div
      role="status"
      className="px-4 py-3 rounded-lg bg-mint-light border border-mint text-mint-deep text-sm font-bold"
    >
      ✅ {t('emailVerifiedNotice')}
    </div>
  )
}

interface Props {
  params: { locale: string }
  searchParams: { error?: string; next?: string; reason?: string }
}

const META = {
  ko:      { title: "로그인 | Clouds with you",    description: "전설의 세계로 입장하세요" },
  ja:      { title: "ログイン | Clouds with you",  description: "伝説の世界へようこそ" },
  en:      { title: "Sign In | Clouds with you",    description: "Enter the world of legends" },
  'zh-CN': { title: "登录 | Clouds with you",       description: "进入传说的世界" },
  'zh-TW': { title: "登入 | Clouds with you",       description: "進入傳說的世界" },
}

const TEXT = {
  ko:      { title: "전설의 세계로\n입장하세요",           subtitle: "한국 전래동화 속 주인공이 되어보세요",  divider: "또는",    loginFailed: "로그인에 실패했습니다. 다시 시도해주세요." },
  ja:      { title: "伝説の世界へ\nようこそ",               subtitle: "韓国の昔話の主人公になってみましょう",    divider: "または",  loginFailed: "ログインに失敗しました。もう一度お試しください。" },
  en:      { title: "Enter the World\nof Legends",         subtitle: "Become the hero of Korean folklore",      divider: "or",      loginFailed: "Login failed. Please try again." },
  'zh-CN': { title: "进入传说的\n世界",                     subtitle: "成为韩国民间故事的主角",                   divider: "或",      loginFailed: "登录失败，请重试。" },
  'zh-TW': { title: "進入傳說的\n世界",                     subtitle: "成為韓國民間故事的主角",                   divider: "或",      loginFailed: "登入失敗，請重試。" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.en || META.ko
  return { title: m.title, description: m.description }
}

export default function LoginPage({ params, searchParams }: Props) {
  const locale = params.locale || "ko"
  const next = searchParams.next || ""
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 카드 */}
        <div className="bg-white rounded-3xl shadow-lg shadow-[#1F2937]/10 overflow-hidden">
          {/* 헤더 배너 */}
          <div className="relative bg-cloud px-8 pt-10 pb-8 text-center">
            {/* 장식용 원형 패턴 */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#F0B8B8]/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#F0B8B8]/10 translate-y-1/2 -translate-x-1/2" />

            {/* 로고 */}
            <div className="relative inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F0B8B8] flex items-center justify-center">
                <span className="text-[#111] font-black text-lg">伝</span>
              </div>
              <span className="text-white font-bold text-xl tracking-wide">Clouds with you</span>
            </div>

            <h1 className="text-white font-bold text-2xl leading-tight whitespace-pre-line">
              {t.title}
            </h1>
            <p className="text-blossom-deep/80 text-sm mt-2">{t.subtitle}</p>
          </div>

          {/* 폼 영역 */}
          <div className="px-8 py-20 md:py-28 flex flex-col gap-6">
            {/* 에러 파라미터 */}
            {searchParams.error === "auth_failed" && (
              <div className="px-8 md:px-10 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {t.loginFailed}
              </div>
            )}

            {/* P0F-3: birth_date deadline 초과로 강제 sign out 된 경우 안내 */}
            {searchParams.reason === "birthDateBlocked" && (
              <BirthDateBlockedNotice locale={locale} />
            )}

            {/* 이메일 인증 콜백 후 즉시 자동 로그인 안 된 경우 안내 */}
            {searchParams.reason === "emailVerified" && (
              <EmailVerifiedNotice locale={locale} />
            )}

            {/* 소셜 로그인 */}
            <SocialLoginButtons locale={locale} mode="login" />

            {/* 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-mist" />
              <span className="text-xs text-stone font-medium">{t.divider}</span>
              <div className="flex-1 h-px bg-mist" />
            </div>

            {/* 이메일 로그인 */}
            <LoginForm locale={locale} next={next} />
          </div>
        </div>

      </div>
    </div>
  )
}
