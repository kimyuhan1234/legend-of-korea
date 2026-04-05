import { Metadata } from 'next'
import { KFoodSpotList } from '@/components/features/food/KFoodSpotList'

interface Props {
  params: { locale: string }
  searchParams: { city?: string }
}

const META = {
  ko: { title: '음식 | Legend of Korea', desc: '지역별 제휴 맛집 큐레이션' },
  ja: { title: 'グルメ | Legend of Korea', desc: '地域別提携グルメキュレーション' },
  en: { title: 'Food | Legend of Korea', desc: 'Regional restaurant curation' },
}

const HERO = {
  ko: { title: '음식', subtitle: '지역별 제휴 맛집 큐레이션 · K-Food Spot' },
  ja: { title: 'グルメ', subtitle: '地域別提携グルメキュレーション · K-Food Spot' },
  en: { title: 'Food', subtitle: 'Regional restaurant curation · K-Food Spot' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title, description: m.desc }
}

export default function FoodPage({ params, searchParams }: Props) {
  const { locale } = params
  const cityFilter = searchParams.city || 'all'
  const h = HERO[locale as keyof typeof HERO] || HERO.ko

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 */}
      <div className="bg-[#2D1B69] text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{h.title}</h1>
        <p className="text-white/70">{h.subtitle}</p>
      </div>

      {/* K-Food Spot 목록 (기존 컴포넌트 재사용) */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <KFoodSpotList locale={locale} cityFilter={cityFilter} />
      </div>
    </div>
  )
}
