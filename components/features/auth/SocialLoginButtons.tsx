"use client"

import { useState } from "react"
import { loginWithSocial } from "@/lib/auth/actions"

interface SocialLoginButtonsProps {
  locale: string
  mode: "login" | "signup"
}

const SOCIAL_PROVIDERS = [
  {
    id: "kakao" as const,
    label: { ko: "카카오로 시작하기", ja: "カカオで始める", en: "Continue with Kakao" },
    bg: "bg-[#FEE500]",
    text: "text-[#191919]",
    border: "border-[#FEE500]",
    hover: "hover:bg-[#F0D800]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.611 1.564 4.908 3.928 6.261l-.999 3.739 4.321-2.869A11.23 11.23 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
      </svg>
    ),
  },
  {
    id: "google" as const,
    label: { ko: "Google로 시작하기", ja: "Googleで始める", en: "Continue with Google" },
    bg: "bg-white",
    text: "text-[#3c4043]",
    border: "border-[#dadce0]",
    hover: "hover:bg-gray-50",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  // TODO: 정식 배포 후 LINE OAuth 활성화 — 아래 객체 주석 해제로 즉시 복원.
  //   - Supabase 는 LINE 기본 미지원 → Custom OAuth Provider 설정 필요
  //   - LINE Developers 콘솔에서 Channel 생성 + Redirect URI 등록
  //   - lib/auth/actions.ts 의 provider 타입 / handleSocialLogin signature
  //     ('kakao' | 'google' | 'line') 는 그대로 보존 — 활성화 시 즉시 사용
  /*
  {
    id: "line" as const,
    label: { ko: "LINE으로 시작하기", ja: "LINEで始める", en: "Continue with LINE" },
    bg: "bg-[#06C755]",
    text: "text-white",
    border: "border-[#06C755]",
    hover: "hover:bg-[#05B34D]",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.631.631 0 0 1-.629-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031a.636.636 0 0 1-.533-.287L12.03 9.585v3.294a.63.63 0 1 1-1.26 0V8.108a.631.631 0 0 1 .432-.596.627.627 0 0 1 .732.287l2.314 3.831V8.108a.63.63 0 1 1 1.26 0v4.771zm-5.741 0a.63.63 0 0 1-1.261 0V8.108a.63.63 0 1 1 1.261 0v4.771zm-2.434.629H5.247a.631.631 0 0 1-.629-.629V8.108c0-.345.281-.63.63-.63a.63.63 0 0 1 .63.63v4.141h1.755a.63.63 0 1 1 0 1.259zM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314z" />
      </svg>
    ),
  },
  */
]

export function SocialLoginButtons({ locale, mode: _mode }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: "kakao" | "google" | "line") => {
    setLoading(provider)
    try {
      await loginWithSocial(provider, locale)
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {SOCIAL_PROVIDERS.map((provider) => {
        const label = provider.label[locale as keyof typeof provider.label] || provider.label.en || provider.label.ko
        return (
          <button
            key={provider.id}
            onClick={() => handleSocialLogin(provider.id)}
            disabled={loading !== null}
            className={`
              flex items-center justify-center gap-3 w-full h-12 px-4 rounded-xl
              border font-medium text-sm transition-all duration-150
              ${provider.bg} ${provider.text} ${provider.border} ${provider.hover}
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm
            `}
          >
            {loading === provider.id ? (
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              provider.icon
            )}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
