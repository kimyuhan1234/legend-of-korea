import { Metadata } from 'next'
import { DiyWorkshopDirectory } from '@/components/diy/DiyWorkshopDirectory'

interface Props {
  params: { locale: string }
}

const META: Record<string, { title: string; description: string }> = {
  ko: {
    title: 'DIY 공방 체험 | Legend of Korea',
    description: '한국 8개 도시의 특별한 공방 체험을 예약하세요. 도자기, 향수, 가죽, 캔들 등 다양한 핸드메이드 클래스.',
  },
  en: {
    title: 'DIY Workshop | Legend of Korea',
    description: 'Book unique craft workshops across 8 Korean cities. Pottery, perfume, leather, candle and more.',
  },
  ja: {
    title: 'DIY工房体験 | Legend of Korea',
    description: '韓国8都市の特別な工房体験を予約。陶芸、香水、レザー、キャンドルなど多彩なハンドメイドクラス。',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: m.title, description: m.description },
  }
}

export default function DiyPage() {
  return <DiyWorkshopDirectory />
}
