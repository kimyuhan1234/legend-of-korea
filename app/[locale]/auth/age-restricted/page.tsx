import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: { locale: string }
}

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LANGS: readonly Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

const TEXT: Record<Lang, {
  title: string
  headline: string
  body: string
  parentLabel: string
  parentConsentCta: string
  parentSubject: string
  cta: string
}> = {
  // 마케팅팀 채택안 + 디자인팀 구조 결합 + P0-5-C-2 부모 동의 옵션 추가
  ko: {
    title: '14세 미만 안내 | Clouds with you',
    headline: '더 자라서 만나요!',
    body: 'Clouds with you는 만 14세부터 함께할 수 있어요. 한국의 전설을 함께 탐험할 날을 기다릴게요.',
    parentLabel: '부모님과 함께 가입하고 싶으세요?',
    parentConsentCta: '부모님 동의 요청하기',
    parentSubject: '[Clouds with you] 부모 동반 가입 문의',
    cta: '홈으로 돌아가기',
  },
  ja: {
    title: '14歳未満のご案内 | Clouds with you',
    headline: 'もう少し大きくなったら会おうね',
    body: 'Clouds with youは14歳から一緒に旅できます。韓国の伝説を一緒に探検する日を待っています。',
    parentLabel: '保護者の方と一緒に登録しますか？',
    parentConsentCta: '保護者の同意を依頼する',
    parentSubject: '[Clouds with you] 保護者同伴での登録について',
    cta: 'ホームに戻る',
  },
  en: {
    title: 'Age Restriction | Clouds with you',
    headline: "Let's meet again when you're a little older",
    body: "Clouds with you is for travelers age 14 and up. We'll be here to explore Korean legends with you.",
    parentLabel: 'Want to sign up with a parent?',
    parentConsentCta: 'Request parental consent',
    parentSubject: '[Clouds with you] Sign-up with a parent',
    cta: 'Back to home',
  },
  'zh-CN': {
    title: '年龄限制 | Clouds with you',
    headline: '等你再长大一点，我们再见面吧',
    body: 'Clouds with you 是为14岁及以上的旅行者准备的。期待和你一起探索韩国传说的那天。',
    parentLabel: '想和家长一起注册吗？',
    parentConsentCta: '请求家长同意',
    parentSubject: '[Clouds with you] 与家长共同注册咨询',
    cta: '返回首页',
  },
  'zh-TW': {
    title: '年齡限制 | Clouds with you',
    headline: '等你再長大一點，我們再見面吧',
    body: 'Clouds with you 是為14歲以上的旅行者準備的。期待和你一起探索韓國傳說的那天。',
    parentLabel: '想和家長一起註冊嗎？',
    parentConsentCta: '請求家長同意',
    parentSubject: '[Clouds with you] 與家長共同註冊諮詢',
    cta: '返回首頁',
  },
}

const PARENT_EMAIL = 'hello@cloudwithyou.com'

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
 * /auth/age-restricted
 *
 * 만 14세 미만 사용자에게 노출되는 안내 페이지.
 * 디자인팀 권고 #5 — 본 페이지 도달 시점에 users 테이블에 row 가
 * 절대 생성되어선 안 된다. 가입 흐름:
 *   - SignupForm: 클라/서버 양쪽 isAtLeastMinimumAge() 검증 후
 *     supabase.auth.signUp() 호출 자체를 차단하고 여기로 redirect
 *   - 소셜 로그인: callback 에서 birth_date 미입력 시 complete-profile
 *     로 보내고, 거기서 14세 미만 입력 시 admin API 로 auth.users 삭제
 *     (cascade) 후 여기로 redirect
 *
 * 본 페이지 자체는 정적 — DB 호출 / 사용자 row 조회 없음.
 */
export default function AgeRestrictedPage({ params }: Props) {
  const t = TEXT[resolveLang(params.locale)]

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-mist shadow-lg shadow-slate-200/50 p-10">
        {/* 일러스트 */}
        <div className="text-6xl mb-6" aria-hidden>
          🌱
        </div>

        {/* 헤드라인 */}
        <h1 className="text-2xl font-black text-slate-800 mb-4 leading-tight">
          {t.headline}
        </h1>

        {/* 본문 */}
        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          {t.body}
        </p>

        {/* 부모 가입 안내 — P0-5-C-2: 동의 폼 링크 추가 (기존 mailto 유지) */}
        <div className="border-t border-mist pt-6 mb-6 space-y-3">
          <p className="text-xs text-stone">{t.parentLabel}</p>
          <Link
            href={`/${params.locale}/auth/parent-consent`}
            className="block w-full py-2.5 rounded-lg bg-blossom-deep text-white font-semibold text-sm hover:bg-blossom-deep/90 transition-colors"
          >
            {t.parentConsentCta}
          </Link>
          <a
            href={`mailto:${PARENT_EMAIL}?subject=${encodeURIComponent(t.parentSubject)}`}
            className="block text-xs text-stone underline hover:text-stone/80"
          >
            {PARENT_EMAIL}
          </a>
        </div>

        {/* CTA */}
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
