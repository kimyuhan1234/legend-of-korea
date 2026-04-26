'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { isAtLeastMinimumAge, getMaxBirthDateString } from '@/lib/validation/age'

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

interface Props {
  locale: string
  /** OAuth provider 가 prefill 한 birth_date (있으면 표시 — 사용자 수정 가능) */
  prefillBirthDate?: string | null
  /** "🔒 카카오에서 받아온 정보" 신뢰 신호용 — 디자인팀 시안 */
  prefillProvider?: string | null
}

const TEXT: Record<Lang, {
  headline: string
  subhead: string
  birthDateLabel: string
  birthDateHint: string
  prefillNote: (provider: string) => string
  submit: string
  submitting: string
  underAgeError: string
  genericError: string
  step1: string
  step2: string
}> = {
  ko: {
    headline: '거의 다 됐어요!',
    subhead: '한 가지만 더 알려주세요',
    birthDateLabel: '생년월일',
    birthDateHint: '만 14세 이상부터 가입할 수 있어요',
    prefillNote: (p) => `🔒 ${p}에서 받아온 정보입니다. 수정할 수 있어요.`,
    submit: '가입 완료',
    submitting: '처리 중...',
    underAgeError: '만 14세 이상부터 가입할 수 있어요',
    genericError: '오류가 발생했습니다. 다시 시도해주세요.',
    step1: '로그인',
    step2: '추가 정보',
  },
  ja: {
    headline: 'もう少しで完了です！',
    subhead: 'あと一つだけ教えてください',
    birthDateLabel: '生年月日',
    birthDateHint: '14歳以上の方からご登録いただけます',
    prefillNote: (p) => `🔒 ${p} から取得した情報です。修正できます。`,
    submit: '登録完了',
    submitting: '処理中...',
    underAgeError: '14歳以上の方からご登録いただけます',
    genericError: 'エラーが発生しました。もう一度お試しください。',
    step1: 'ログイン',
    step2: '追加情報',
  },
  en: {
    headline: 'Almost there!',
    subhead: 'Just one more step',
    birthDateLabel: 'Date of birth',
    birthDateHint: 'Sign-up is available for ages 14 and older',
    prefillNote: (p) => `🔒 Imported from ${p}. You can edit this.`,
    submit: 'Complete sign-up',
    submitting: 'Processing...',
    underAgeError: 'Sign-up is available for ages 14 and older',
    genericError: 'An error occurred. Please try again.',
    step1: 'Sign-in',
    step2: 'Additional info',
  },
  'zh-CN': {
    headline: '快完成了！',
    subhead: '请再告诉我们一个信息',
    birthDateLabel: '出生日期',
    birthDateHint: '年满14岁可注册',
    prefillNote: (p) => `🔒 来自 ${p} 的信息。您可以修改。`,
    submit: '完成注册',
    submitting: '处理中...',
    underAgeError: '年满14岁可注册',
    genericError: '发生错误。请重试。',
    step1: '登录',
    step2: '补充信息',
  },
  'zh-TW': {
    headline: '快完成了！',
    subhead: '請再告訴我們一個資訊',
    birthDateLabel: '出生日期',
    birthDateHint: '年滿14歲可註冊',
    prefillNote: (p) => `🔒 來自 ${p} 的資訊。您可以修改。`,
    submit: '完成註冊',
    submitting: '處理中...',
    underAgeError: '年滿14歲可註冊',
    genericError: '發生錯誤。請重試。',
    step1: '登入',
    step2: '補充資訊',
  },
}

const PROVIDER_NAME: Record<string, Record<Lang, string>> = {
  kakao: { ko: '카카오', ja: 'カカオ', en: 'Kakao', 'zh-CN': '카카오', 'zh-TW': '카카오' },
  google: { ko: '구글', ja: 'Google', en: 'Google', 'zh-CN': 'Google', 'zh-TW': 'Google' },
  line: { ko: 'LINE', ja: 'LINE', en: 'LINE', 'zh-CN': 'LINE', 'zh-TW': 'LINE' },
}

function resolveLang(raw: string): Lang {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Lang[]).includes(raw as Lang)
    ? (raw as Lang)
    : 'ko'
}

export function CompleteProfileForm({ locale, prefillBirthDate, prefillProvider }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = resolveLang(locale)
  const t = TEXT[lang]

  const [birthDate, setBirthDate] = useState(prefillBirthDate ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const maxBirthDate = useMemo(() => getMaxBirthDateString(), [])
  const isAgeOk = birthDate.length === 0 || isAtLeastMinimumAge(birthDate)
  const showAgeError = birthDate.length > 0 && !isAgeOk
  const canSubmit = !loading && birthDate.length > 0 && isAgeOk

  const providerLabel = prefillProvider && PROVIDER_NAME[prefillProvider]
    ? PROVIDER_NAME[prefillProvider][lang]
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setLoading(true)

    const res = await fetch('/api/auth/complete-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birth_date: birthDate }),
    })

    const data = await res.json().catch(() => ({}))

    if (res.ok) {
      const next = searchParams.get('next') ?? '/'
      router.push(`/${locale}${next === '/' ? '' : next}`)
      router.refresh()
      return
    }

    if (data?.error === 'UNDER_14') {
      router.push(`/${locale}/auth/age-restricted`)
      return
    }

    setError(t.genericError)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* 진행 점 3개 — 디자인팀 Q1 컴포넌트 */}
      <div className="flex items-center justify-center gap-2 mb-2 text-xs text-stone">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-mint-deep" aria-hidden />
          <span className="text-mint-deep font-bold">{t.step1}</span>
        </span>
        <span className="text-stone">→</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-mint-deep ring-4 ring-mint-deep/20" aria-hidden />
          <span className="text-mint-deep font-bold">{t.step2}</span>
        </span>
        <span className="text-stone">→</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-stone/30" aria-hidden />
          <span className="text-stone">●</span>
        </span>
      </div>

      {/* 헤드라인 */}
      <div className="text-center mb-2">
        <h1 className="text-xl font-black text-slate-800">{t.headline}</h1>
        <p className="text-sm text-stone mt-1">{t.subhead}</p>
      </div>

      {/* prefill 신뢰 신호 */}
      {providerLabel && prefillBirthDate && (
        <p className="text-xs text-mint-deep bg-mint/10 border border-mint/20 rounded-xl px-3 py-2 text-center">
          {t.prefillNote(providerLabel)}
        </p>
      )}

      {/* 에러 */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* birth_date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate">{t.birthDateLabel}</label>
        <input
          type="date"
          name="birth_date"
          required
          value={birthDate}
          max={maxBirthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`h-12 px-4 rounded-xl border bg-white text-[#111] text-sm focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 transition-all ${
            showAgeError ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-mist focus:border-blossom-deep'
          }`}
        />
        {showAgeError ? (
          <p className="text-xs text-red-600">{t.underAgeError}</p>
        ) : (
          <p className="text-xs text-stone">{t.birthDateHint}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="h-12 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-semibold text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm mt-2"
      >
        {loading ? t.submitting : t.submit}
      </button>
    </form>
  )
}
