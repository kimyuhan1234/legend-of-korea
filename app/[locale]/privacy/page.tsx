import { Metadata } from 'next'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '개인정보처리방침 | Legend of Korea', desc: '개인정보 보호 정책' },
  en: { title: 'Privacy Policy | Legend of Korea', desc: 'Privacy Policy' },
  ja: { title: 'プライバシーポリシー | Legend of Korea', desc: 'プライバシーポリシー' },
}

const CONTENT: Record<string, { title: string; body: string }> = {
  ko: { title: '개인정보처리방침', body: 'Legend of Korea는 이용자의 개인정보를 중요시하며, 개인정보 보호법을 준수합니다. 수집된 개인정보는 서비스 제공 목적으로만 사용되며, 이용자의 동의 없이 제3자에게 제공되지 않습니다.' },
  en: { title: 'Privacy Policy', body: 'Legend of Korea values your privacy and complies with applicable data protection laws. Personal information collected is used solely for service provision and is not shared with third parties without your consent.' },
  ja: { title: 'プライバシーポリシー', body: 'Legend of Koreaは利用者の個人情報を重要視し、個人情報保護法を遵守します。収集された個人情報はサービス提供目的にのみ使用され、利用者の同意なく第三者に提供されることはありません。' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function PrivacyPage({ params }: Props) {
  const c = CONTENT[params.locale] ?? CONTENT.ko
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#FF6B35] text-white py-20 px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black">{c.title}</h1>
      </div>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <p className="text-[#3a3028] text-lg leading-relaxed">{c.body}</p>
      </div>
    </div>
  )
}
