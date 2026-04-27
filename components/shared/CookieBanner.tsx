'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cookie } from 'lucide-react'

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const STORAGE_KEY = 'lok_cookie_consent_v1'

const UI: Record<Lang, {
  message: string
  accept: string
  privacy: string
}> = {
  ko: {
    message: '이 웹사이트는 로그인 세션 유지를 위해 쿠키를 사용합니다.',
    accept: '동의',
    privacy: '개인정보처리방침',
  },
  ja: {
    message: 'このウェブサイトはログインセッション維持のためにクッキーを使用します。',
    accept: '同意する',
    privacy: 'プライバシーポリシー',
  },
  en: {
    message: 'This website uses cookies to maintain your login session.',
    accept: 'Accept',
    privacy: 'Privacy Policy',
  },
  'zh-CN': {
    message: '本网站使用 Cookie 以维持您的登录会话。',
    accept: '同意',
    privacy: '隐私政策',
  },
  'zh-TW': {
    message: '本網站使用 Cookie 以維持您的登入工作階段。',
    accept: '同意',
    privacy: '隱私權政策',
  },
}

export function CookieBanner() {
  const pathname = usePathname()
  const rawLocale = pathname.split('/')[1] || 'ko'
  const locale: Lang = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as const).includes(rawLocale as Lang)
    ? (rawLocale as Lang)
    : 'ko'
  const t = UI[locale]

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'accepted') {
        setVisible(true)
      }
    } catch {
      // localStorage 접근 실패 시 그냥 숨김 (iframe 등)
    }
  }, [])

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label={t.message}
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl bg-white/95 backdrop-blur-md border border-mist shadow-[0_-4px_24px_rgba(0,0,0,0.08)] rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <p className="text-sm text-slate leading-relaxed flex-1 flex items-start gap-2">
          <Cookie className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" strokeWidth={1.8} aria-hidden />
          <span>
            {t.message}{' '}
            <Link
              href={`/${locale}/privacy`}
              className="text-mint-deep font-semibold underline underline-offset-2 hover:text-ink"
            >
              {t.privacy}
            </Link>
          </span>
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 inline-flex items-center justify-center px-5 py-2 rounded-xl bg-mint-deep text-white text-sm font-bold hover:opacity-90 transition"
        >
          {t.accept}
        </button>
      </div>
    </div>
  )
}
