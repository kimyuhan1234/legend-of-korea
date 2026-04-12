import { Metadata } from 'next'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '제휴 문의 | Legend of Korea', desc: '비즈니스 제휴 및 협력 문의' },
  en: { title: 'Partnership | Legend of Korea', desc: 'Business partnership inquiries' },
  ja: { title: '提携お問い合わせ | Legend of Korea', desc: 'ビジネス提携のお問い合わせ' },
}

const CONTENT: Record<string, { title: string; body: string; email: string }> = {
  ko: { title: '제휴 문의', body: 'Legend of Korea와의 비즈니스 제휴를 원하시면 아래 이메일로 문의해 주세요.', email: '문의: hello@legendofkorea.kr' },
  en: { title: 'Partnership', body: 'Interested in a business partnership with Legend of Korea? Contact us at the email below.', email: 'Contact: hello@legendofkorea.kr' },
  ja: { title: '提携お問い合わせ', body: 'Legend of Koreaとのビジネス提携をご希望の方は、以下のメールアドレスまでお問い合わせください。', email: 'お問い合わせ: hello@legendofkorea.kr' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function PartnerPage({ params }: Props) {
  const c = CONTENT[params.locale] ?? CONTENT.ko
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="bg-[#9DD8CE] text-white py-20 px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black">{c.title}</h1>
      </div>
      <div className="max-w-3xl mx-auto px-8 py-16 text-center">
        <p className="text-[#4B5563] text-lg leading-relaxed mb-6">{c.body}</p>
        <a href="mailto:hello@legendofkorea.kr" className="inline-block px-8 py-3 rounded-xl bg-[#9DD8CE] text-white font-bold hover:bg-[#7BC8BC] transition-colors">
          {c.email}
        </a>
      </div>
    </div>
  )
}
