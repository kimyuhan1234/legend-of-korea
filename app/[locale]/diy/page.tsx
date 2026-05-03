import { Metadata } from 'next'
import { DiyWorkshopDirectory } from '@/components/diy/DiyWorkshopDirectory'
import { buildOgUrl } from '@/lib/seo/og-url'

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; description: string }> = {
  ko: {
    title: 'DIY 공방 체험 | Clouds with you',
    description: '한국 8개 도시의 특별한 공방 체험을 예약하세요. 도자기, 향수, 가죽, 캔들 등 다양한 핸드메이드 클래스.',
  },
  en: {
    title: 'DIY Workshop | Clouds with you',
    description: 'Book unique craft workshops across 8 Korean cities. Pottery, perfume, leather, candle and more.',
  },
  ja: {
    title: 'DIY工房体験 | Clouds with you',
    description: '韓国8都市の特別な工房体験を予約。陶芸、香水、レザー、キャンドルなど多彩なハンドメイドクラス。',
  },
  'zh-CN': {
    title: 'DIY工坊体验 | Clouds with you',
    description: '预订韩国8座城市的特色工坊体验。陶艺、香水、皮革、蜡烛等多样手作课程。',
  },
  'zh-TW': {
    title: 'DIY工坊體驗 | Clouds with you',
    description: '預訂韓國8座城市的特色工坊體驗。陶藝、香水、皮革、蠟燭等多樣手作課程。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.en ?? META.ko
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: m.title.split(' | ')[0],
    subtitle: m.description,
    tier: 'soft',
    category: 'DIY',
    imagePath: '/images/category-create.png',
  })
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: m.title }],
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.description, images: [ogImage] },
  }
}

export default function DiyPage() {
  return <DiyWorkshopDirectory />
}
