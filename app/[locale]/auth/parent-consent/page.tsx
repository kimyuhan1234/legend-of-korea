import type { Metadata } from 'next'
import Link from 'next/link'
import { ParentConsentForm } from '@/components/features/auth/ParentConsentForm'

interface Props {
  params: { locale: string }
}

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LANGS: readonly Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

const TEXT: Record<Lang, {
  title: string
  headline: string
  body: string
  parentEmailLabel: string
  parentEmailPlaceholder: string
  submit: string
  sending: string
  errorInvalidEmail: string
  errorGeneric: string
  sentHeadline: string
  sentBody: string
  disclaimer: string
  backCta: string
}> = {
  ko: {
    title: '법정대리인 동의 요청 | Clouds with you',
    headline: '법정대리인 동의 요청',
    body: '만 14세 미만 가입을 위해서는 법정대리인의 동의가 필요합니다. 부모님 이메일을 입력해주세요.',
    parentEmailLabel: '부모님 이메일',
    parentEmailPlaceholder: 'parent@example.com',
    submit: '동의 요청 보내기',
    sending: '전송 중...',
    errorInvalidEmail: '올바른 이메일 주소를 입력해주세요.',
    errorGeneric: '요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    sentHeadline: '요청이 접수되었습니다',
    sentBody: '베타 단계에서는 메일 발송이 활성화되지 않았습니다. 정식 출시 시 등록하신 부모님 이메일로 동의 안내가 전송됩니다.',
    disclaimer: '베타 단계 안내: 정식 출시 시 신분증 인증 등 추가 절차가 있을 예정입니다.',
    backCta: '돌아가기',
  },
  ja: {
    title: '保護者同意のリクエスト | Clouds with you',
    headline: '保護者同意のリクエスト',
    body: '14歳未満の登録には保護者の同意が必要です。保護者のメールアドレスを入力してください。',
    parentEmailLabel: '保護者のメールアドレス',
    parentEmailPlaceholder: 'parent@example.com',
    submit: '同意リクエストを送信',
    sending: '送信中...',
    errorInvalidEmail: '正しいメールアドレスを入力してください。',
    errorGeneric: 'リクエスト中にエラーが発生しました。しばらくしてから再度お試しください。',
    sentHeadline: 'リクエストを受け付けました',
    sentBody: 'ベータ段階ではメール送信は有効になっていません。正式リリース時に登録された保護者のメールアドレスへ同意案内が送信されます。',
    disclaimer: 'ベータ段階のご案内: 正式リリース時には身分証認証などの追加手続きを予定しています。',
    backCta: '戻る',
  },
  en: {
    title: 'Parental Consent Request | Clouds with you',
    headline: 'Parental Consent Request',
    body: 'Sign-up for users under 14 requires parental consent. Please enter a parent or guardian email address.',
    parentEmailLabel: "Parent's email address",
    parentEmailPlaceholder: 'parent@example.com',
    submit: 'Send consent request',
    sending: 'Sending...',
    errorInvalidEmail: 'Please enter a valid email address.',
    errorGeneric: 'An error occurred. Please try again later.',
    sentHeadline: 'Request received',
    sentBody: 'Email delivery is not yet active during the beta phase. Once we launch, a consent invitation will be sent to the parent email you provided.',
    disclaimer: 'Beta notice: Additional steps such as ID verification will be added at official launch.',
    backCta: 'Back',
  },
  'zh-CN': {
    title: '家长同意申请 | Clouds with you',
    headline: '家长同意申请',
    body: '未满14岁的用户注册需要家长同意。请输入家长的电子邮件地址。',
    parentEmailLabel: '家长电子邮件',
    parentEmailPlaceholder: 'parent@example.com',
    submit: '发送同意请求',
    sending: '发送中...',
    errorInvalidEmail: '请输入有效的电子邮件地址。',
    errorGeneric: '请求过程中发生错误，请稍后再试。',
    sentHeadline: '请求已接收',
    sentBody: '测试阶段尚未启用邮件发送。正式发布时，将向您填写的家长邮箱发送同意指引。',
    disclaimer: '测试阶段说明：正式发布时将增加身份证验证等其他步骤。',
    backCta: '返回',
  },
  'zh-TW': {
    title: '家長同意申請 | Clouds with you',
    headline: '家長同意申請',
    body: '未滿14歲的使用者註冊需要家長同意。請輸入家長的電子郵件地址。',
    parentEmailLabel: '家長電子郵件',
    parentEmailPlaceholder: 'parent@example.com',
    submit: '發送同意請求',
    sending: '發送中...',
    errorInvalidEmail: '請輸入有效的電子郵件地址。',
    errorGeneric: '請求過程中發生錯誤，請稍後再試。',
    sentHeadline: '請求已接收',
    sentBody: '測試階段尚未啟用郵件發送。正式發布時，將向您填寫的家長信箱寄送同意指引。',
    disclaimer: '測試階段說明：正式發布時將增加身分證驗證等其他步驟。',
    backCta: '返回',
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
 * /auth/parent-consent
 *
 * 만 14세 미만 가입 시 법정대리인(부모) 동의 요청 폼.
 * 베타 단계: DB 레코드만 생성 (Resend 등 메일 발송 인프라 미연동).
 * 정식 출시 시점: 부모 이메일로 동의 메일 발송 + 신분증 인증 절차 추가.
 *
 * 182 상담 (2026-04-27) 권고에 따라 베타 단계에 최소 플로우 즉시 구축.
 */
export default function ParentConsentPage({ params }: Props) {
  const t = TEXT[resolveLang(params.locale)]

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-mist shadow-lg shadow-slate-200/50 p-8 md:p-10">
        <h1 className="text-2xl font-black text-slate-800 mb-3 leading-tight">
          {t.headline}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {t.body}
        </p>

        <ParentConsentForm
          locale={params.locale}
          labels={{
            parentEmailLabel: t.parentEmailLabel,
            parentEmailPlaceholder: t.parentEmailPlaceholder,
            submit: t.submit,
            sending: t.sending,
            errorInvalidEmail: t.errorInvalidEmail,
            errorGeneric: t.errorGeneric,
            sentHeadline: t.sentHeadline,
            sentBody: t.sentBody,
            disclaimer: t.disclaimer,
            backCta: t.backCta,
          }}
        />

        <div className="mt-6 pt-6 border-t border-mist text-center">
          <Link
            href={`/${params.locale}`}
            className="text-xs text-stone underline hover:text-stone/80"
          >
            {t.backCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
