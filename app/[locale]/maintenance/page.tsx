import type { Metadata } from 'next'

interface Props {
  params: { locale: string }
}

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LANGS: readonly Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

const TEXT: Record<Lang, {
  title: string
  heading: string
  line1: string
  line2: string
  contactLabel: string
}> = {
  ko: {
    title: '테스트 중 | Clouds with you',
    heading: '현재 테스트 기간입니다',
    line1: '서비스 품질 향상을 위해 제한된 인원만 이용 가능합니다.',
    line2: '정식 오픈 시 다시 찾아주세요!',
    contactLabel: '문의',
  },
  ja: {
    title: 'テスト中 | Clouds with you',
    heading: '現在テスト期間中です',
    line1: 'サービス品質向上のため、限られた人数のみご利用いただけます。',
    line2: '正式オープンの際はまたお越しください！',
    contactLabel: 'お問い合わせ',
  },
  en: {
    title: 'Testing | Clouds with you',
    heading: 'We are in a testing period',
    line1: 'Access is limited to a small group so we can improve the service.',
    line2: 'Please come back when we officially launch!',
    contactLabel: 'Contact',
  },
  'zh-CN': {
    title: '测试中 | Clouds with you',
    heading: '目前处于测试期间',
    line1: '为提升服务质量，仅限有限人数访问。',
    line2: '正式上线时请再次光临！',
    contactLabel: '咨询',
  },
  'zh-TW': {
    title: '測試中 | Clouds with you',
    heading: '目前處於測試期間',
    line1: '為提升服務品質，僅限有限人數存取。',
    line2: '正式上線時請再次光臨！',
    contactLabel: '諮詢',
  },
}

function resolveLang(raw: string): Lang {
  return (LANGS as readonly string[]).includes(raw) ? (raw as Lang) : 'ko'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = TEXT[resolveLang(params.locale)]
  return { title: t.title, robots: { index: false, follow: false } }
}

export default function MaintenancePage({ params }: Props) {
  const t = TEXT[resolveLang(params.locale)]
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F9F8',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'white',
          borderRadius: 28,
          boxShadow: '0 12px 40px rgba(15,23,42,0.08)',
          border: '1px solid #e6eeec',
        }}
      >
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }} aria-hidden>
          ☁️
        </div>
        <div
          style={{
            fontStyle: 'italic',
            fontFamily: 'Georgia, "Palatino", "Times New Roman", serif',
            color: '#1F2937',
            fontSize: 22,
            letterSpacing: 2,
            marginBottom: 28,
          }}
        >
          Clouds with you
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#1F2937',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}
        >
          {t.heading}
        </h1>
        <p style={{ color: '#64748b', lineHeight: 1.7, margin: '0 0 10px 0', fontSize: 15 }}>
          {t.line1}
        </p>
        <p style={{ color: '#64748b', lineHeight: 1.7, margin: '0 0 28px 0', fontSize: 15 }}>
          {t.line2}
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
          {t.contactLabel}:{' '}
          <a
            href="mailto:kimyuhan1989@gmail.com"
            style={{ color: '#0d9488', textDecoration: 'underline' }}
          >
            kimyuhan1989@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
