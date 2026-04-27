import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: { locale: string; token: string }
}

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LANGS: readonly Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

const TEXT: Record<Lang, {
  title: string
  headline: string
  body: string
  betaNotice: string
  cta: string
}> = {
  ko: {
    title: '동의 절차 안내 | Cloud with you',
    headline: '동의 절차 안내',
    body: '법정대리인 동의 절차는 정식 출시 시점에 활성화됩니다. 베타 기간 중에는 만 14세 이상 사용자만 가입 가능합니다.',
    betaNotice: '정식 출시 알림을 원하시면 hello@cloudwithyou.com 으로 문의해주세요.',
    cta: '홈으로 돌아가기',
  },
  ja: {
    title: '同意手続きのご案内 | Cloud with you',
    headline: '同意手続きのご案内',
    body: '保護者同意の手続きは正式リリース時に有効化されます。ベータ期間中は14歳以上のユーザーのみ登録可能です。',
    betaNotice: '正式リリースのお知らせをご希望の方は hello@cloudwithyou.com までお問い合わせください。',
    cta: 'ホームに戻る',
  },
  en: {
    title: 'Consent Procedure Notice | Cloud with you',
    headline: 'Consent Procedure Notice',
    body: 'The parental consent procedure will be activated at official launch. During the beta period, only users aged 14 and over can register.',
    betaNotice: 'For launch notifications, please contact hello@cloudwithyou.com.',
    cta: 'Back to home',
  },
  'zh-CN': {
    title: '同意流程说明 | Cloud with you',
    headline: '同意流程说明',
    body: '家长同意流程将于正式发布时启用。测试期间仅限14岁及以上用户注册。',
    betaNotice: '如需正式发布通知，请联系 hello@cloudwithyou.com。',
    cta: '返回首页',
  },
  'zh-TW': {
    title: '同意流程說明 | Cloud with you',
    headline: '同意流程說明',
    body: '家長同意流程將於正式發布時啟用。測試期間僅限14歲以上使用者註冊。',
    betaNotice: '如需正式發布通知，請聯絡 hello@cloudwithyou.com。',
    cta: '返回首頁',
  },
}

function resolveLang(raw: string): Lang {
  return (LANGS as readonly string[]).includes(raw) ? (raw as Lang) : 'ko'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = TEXT[resolveLang(params.locale)]
  return {
    title: t.title,
    robots: { index: false, follow: false },
  }
}

/**
 * /auth/parent-consent/[token]
 *
 * 부모가 메일 링크 클릭 시 진입하는 페이지.
 * 베타 단계: 단순 안내만 (실제 동의 처리는 정식 출시 시점에 활성화).
 *
 * 토큰 검증·동의 처리·users.parent_consent_id 갱신은 정식 출시 시 추가.
 */
export default function ParentConsentConfirmPage({ params }: Props) {
  const t = TEXT[resolveLang(params.locale)]

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-mist shadow-lg shadow-slate-200/50 p-10">
        <div className="text-5xl mb-6" aria-hidden>🔒</div>
        <h1 className="text-2xl font-black text-slate-800 mb-4 leading-tight">
          {t.headline}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {t.body}
        </p>
        <p className="text-xs text-stone leading-relaxed mb-8">
          {t.betaNotice}
        </p>
        <Link
          href={`/${params.locale}`}
          className="inline-block w-full py-3 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-bold text-sm hover:opacity-90 transition-opacity"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  )
}
