'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Cookie, X } from 'lucide-react'

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const STORAGE_KEY = 'lok_cookie_consent_v2'
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000 // 1 year

type ConsentState = {
  essential: true
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const UI: Record<Lang, {
  title: string
  description: string
  acceptAll: string
  rejectAll: string
  customize: string
  save: string
  essential: string
  essentialDesc: string
  analytics: string
  analyticsDesc: string
  marketing: string
  marketingDesc: string
  privacy: string
  close: string
}> = {
  ko: {
    title: '쿠키 사용 안내',
    description: '본 사이트는 로그인 세션 유지와 서비스 개선을 위해 쿠키를 사용합니다. 분석·마케팅 쿠키는 동의 시에만 활성화됩니다.',
    acceptAll: '모두 허용',
    rejectAll: '필수만 허용',
    customize: '세부 설정',
    save: '저장',
    essential: '필수 쿠키 (항상 활성)',
    essentialDesc: '로그인 세션·CSRF·언어 설정 등 서비스 작동에 반드시 필요합니다.',
    analytics: '분석 쿠키',
    analyticsDesc: '이용 패턴 분석에 사용 (현재 활용 시 토글).',
    marketing: '마케팅 쿠키',
    marketingDesc: '광고 픽셀·추적 (현재 미사용).',
    privacy: '개인정보처리방침',
    close: '닫기',
  },
  ja: {
    title: 'Cookieの使用について',
    description: '本サイトはログインセッションの維持およびサービス改善のためにCookieを使用します。分析・マーケティングCookieは同意時にのみ有効化されます。',
    acceptAll: 'すべて許可',
    rejectAll: '必須のみ許可',
    customize: '詳細設定',
    save: '保存',
    essential: '必須Cookie（常に有効）',
    essentialDesc: 'ログインセッション・CSRF・言語設定などサービス動作に必要です。',
    analytics: '分析Cookie',
    analyticsDesc: '利用パターン分析に使用（現在使用時はトグル）。',
    marketing: 'マーケティングCookie',
    marketingDesc: '広告ピクセル・トラッキング（現在未使用）。',
    privacy: 'プライバシーポリシー',
    close: '閉じる',
  },
  en: {
    title: 'Cookie Notice',
    description: 'This site uses cookies to maintain your login session and improve our service. Analytics and marketing cookies are only enabled with your consent.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject Non-Essential',
    customize: 'Customize',
    save: 'Save',
    essential: 'Essential cookies (always on)',
    essentialDesc: 'Required for login sessions, CSRF protection, and language settings.',
    analytics: 'Analytics cookies',
    analyticsDesc: 'Used for usage pattern analysis (toggle when in use).',
    marketing: 'Marketing cookies',
    marketingDesc: 'Ad pixels and tracking (not currently in use).',
    privacy: 'Privacy Policy',
    close: 'Close',
  },
  'zh-CN': {
    title: 'Cookie 使用通知',
    description: '本网站使用 Cookie 以维持登录会话并改进服务。分析和营销 Cookie 仅在您同意时启用。',
    acceptAll: '全部接受',
    rejectAll: '仅必要',
    customize: '自定义',
    save: '保存',
    essential: '必要 Cookie（始终启用）',
    essentialDesc: '登录会话、CSRF 防护、语言设置等服务运行所必需。',
    analytics: '分析 Cookie',
    analyticsDesc: '用于使用模式分析（如启用则切换）。',
    marketing: '营销 Cookie',
    marketingDesc: '广告像素和跟踪（当前未使用）。',
    privacy: '隐私政策',
    close: '关闭',
  },
  'zh-TW': {
    title: 'Cookie 使用通知',
    description: '本網站使用 Cookie 以維持登入工作階段並改善服務。分析及行銷 Cookie 僅在您同意時啟用。',
    acceptAll: '全部接受',
    rejectAll: '僅必要',
    customize: '自訂',
    save: '儲存',
    essential: '必要 Cookie（永遠啟用）',
    essentialDesc: '登入工作階段、CSRF 防護、語言設定等服務運行所必需。',
    analytics: '分析 Cookie',
    analyticsDesc: '用於使用模式分析（如啟用則切換）。',
    marketing: '行銷 Cookie',
    marketingDesc: '廣告像素及追蹤（目前未使用）。',
    privacy: '隱私權政策',
    close: '關閉',
  },
}

function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    // 1년 경과 시 재요청
    if (typeof parsed.timestamp !== 'number' || Date.now() - parsed.timestamp > CONSENT_TTL_MS) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveConsent(state: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function CookieBanner() {
  const pathname = usePathname()
  const rawLocale = pathname.split('/')[1] || 'ko'
  const locale: Lang = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as const).includes(rawLocale as Lang)
    ? (rawLocale as Lang)
    : 'ko'
  const t = UI[locale]

  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (!readConsent()) setVisible(true)
  }, [])

  function persistAndClose(next: ConsentState) {
    saveConsent(next)
    setVisible(false)
    setShowCustomize(false)
  }

  function handleAcceptAll() {
    persistAndClose({ essential: true, analytics: true, marketing: true, timestamp: Date.now() })
  }

  function handleRejectAll() {
    persistAndClose({ essential: true, analytics: false, marketing: false, timestamp: Date.now() })
  }

  function handleSaveCustom() {
    persistAndClose({ essential: true, analytics, marketing, timestamp: Date.now() })
  }

  if (!visible) return null

  return (
    <>
      {/* 메인 배너 */}
      {!showCustomize && (
        <div
          role="dialog"
          aria-label={t.title}
          className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl bg-white/95 backdrop-blur-md border border-mist shadow-[0_-4px_24px_rgba(0,0,0,0.08)] rounded-2xl p-4 md:p-5">
            <div className="flex items-start gap-3 mb-3">
              <Cookie className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" strokeWidth={1.8} aria-hidden />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink leading-snug">{t.title}</p>
                <p className="text-sm text-slate leading-relaxed mt-1">
                  {t.description}{' '}
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-mint-deep font-semibold underline underline-offset-2 hover:text-ink"
                  >
                    {t.privacy}
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-mint-deep text-white text-sm font-bold hover:opacity-90 transition"
              >
                {t.acceptAll}
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-cloud border border-mist text-ink text-sm font-bold hover:bg-mist transition"
              >
                {t.rejectAll}
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-mist text-stone text-sm font-bold hover:text-ink hover:border-stone transition"
              >
                {t.customize}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 세부 설정 모달 */}
      {showCustomize && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.customize}
          className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowCustomize(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-ink text-lg">{t.customize}</h3>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                aria-label={t.close}
                className="p-1 rounded-lg text-stone hover:bg-mist hover:text-ink transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Essential */}
              <div className="border border-mist rounded-xl p-3 bg-cloud/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">{t.essential}</span>
                  <span className="text-xs font-bold text-mint-deep">ON</span>
                </div>
                <p className="text-xs text-slate leading-relaxed mt-1">{t.essentialDesc}</p>
              </div>

              {/* Analytics */}
              <label className="border border-mist rounded-xl p-3 block cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">{t.analytics}</span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="w-4 h-4 accent-mint-deep"
                  />
                </div>
                <p className="text-xs text-slate leading-relaxed mt-1">{t.analyticsDesc}</p>
              </label>

              {/* Marketing */}
              <label className="border border-mist rounded-xl p-3 block cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">{t.marketing}</span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="w-4 h-4 accent-mint-deep"
                  />
                </div>
                <p className="text-xs text-slate leading-relaxed mt-1">{t.marketingDesc}</p>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 bg-mint-deep text-white rounded-xl font-bold text-sm hover:opacity-90 transition"
              >
                {t.save}
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 py-2.5 bg-cloud border border-mist text-ink rounded-xl font-bold text-sm hover:bg-mist transition"
              >
                {t.rejectAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
