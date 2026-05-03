import { Metadata } from 'next'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '회사 소개 | Clouds with you', desc: 'Clouds with you 서비스 소개' },
  en: { title: 'About | Clouds with you', desc: 'About Clouds with you' },
  ja: { title: '会社紹介 | Clouds with you', desc: 'Clouds with youについて' },
}

const CONTENT: Record<string, { title: string; body: string }> = {
  ko: { title: '회사 소개', body: 'Clouds with you는 한국 전래동화 IP를 활용한 QR 기반 셀프 미션 여행 서비스입니다. 한국의 전설 속 장소를 직접 탐험하며 미션을 해결하는 프리미엄 어드벤처를 제공합니다.' },
  en: { title: 'About Us', body: 'Clouds with you is a QR-based self-guided mission travel service using Korean folklore IP. We offer premium adventures where you explore legendary places in Korea and solve missions.' },
  ja: { title: '会社紹介', body: 'Clouds with youは韓国の昔話IPを活用したQRベースのセルフミッション旅行サービスです。韓国の伝説の地を探検し、ミッションを解決するプレミアムアドベンチャーを提供します。' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function AboutPage({ params }: Props) {
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
