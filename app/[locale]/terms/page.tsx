import { Metadata } from 'next'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '이용약관 | Cloud with you', desc: '서비스 이용약관' },
  en: { title: 'Terms of Service | Cloud with you', desc: 'Terms of Service' },
  ja: { title: '利用規約 | Cloud with you', desc: 'サービス利用規約' },
}

const CONTENT: Record<string, { title: string; body: string }> = {
  ko: { title: '이용약관', body: '본 약관은 Cloud with you(이하 "서비스")가 제공하는 모든 서비스의 이용 조건 및 절차에 관한 사항을 규정합니다. 서비스를 이용하시면 본 약관에 동의하는 것으로 간주됩니다.' },
  en: { title: 'Terms of Service', body: 'These Terms of Service govern your use of the Cloud with you service. By accessing or using the service, you agree to be bound by these terms.' },
  ja: { title: '利用規約', body: 'この利用規約は、Cloud with you（以下「サービス」）が提供するすべてのサービスの利用条件および手続きに関する事項を規定します。サービスをご利用になると、本規約に同意したものとみなされます。' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function TermsPage({ params }: Props) {
  const c = CONTENT[params.locale] ?? CONTENT.ko
  return (
    <div className="min-h-screen bg-snow">
      <div className="bg-gradient-to-br from-mint to-blossom text-ink py-20 px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black">{c.title}</h1>
      </div>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <p className="text-slate text-lg leading-relaxed">{c.body}</p>
      </div>
    </div>
  )
}
