'use client'

interface VerificationNoticeProps {
  locale?: string
  variant?: 'banner' | 'inline'
}

const LABEL = {
  ko: {
    title: '본인인증 안내',
    body: '안전한 동행을 위해 참여 전 본인인증이 필요합니다. 모든 참여자의 신원이 검증됩니다.',
    cta: '인증하기',
    pending: '인증 준비 중',
  },
  ja: {
    title: '本人確認のご案内',
    body: '安全な同行のために、参加前に本人確認が必要です。すべての参加者の身元が確認されます。',
    cta: '認証する',
    pending: '認証準備中',
  },
  en: {
    title: 'Identity Verification',
    body: 'For a safe adventure together, identity verification is required before joining. All participants are verified.',
    cta: 'Verify now',
    pending: 'Coming soon',
  },
}

export function VerificationNotice({ locale = 'ko', variant = 'banner' }: VerificationNoticeProps) {
  const t = LABEL[locale as keyof typeof LABEL] ?? LABEL.ko

  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2 text-xs text-slate bg-blue-50 rounded-xl px-3 py-2.5">
        <span className="mt-0.5">🔐</span>
        <p>{t.body}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 flex items-start gap-3">
      <div className="text-2xl mt-0.5">🔐</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-blue-900 mb-0.5">{t.title}</p>
        <p className="text-xs text-blue-700 leading-relaxed">{t.body}</p>
      </div>
      <button
        disabled
        className="shrink-0 text-xs font-bold text-blue-400 border border-blue-200 rounded-lg px-3 py-1.5 cursor-not-allowed"
        title={t.pending}
      >
        {t.pending}
      </button>
    </div>
  )
}
