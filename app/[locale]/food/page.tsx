import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotList } from '@/components/features/food/KFoodSpotList'

interface Props {
  params: { locale: string }
  searchParams: { city?: string }
}

const META = {
  ko: { title: '음식 | Legend of Korea', desc: '지역별 K-Food Spot 큐레이션' },
  ja: { title: 'グルメ | Legend of Korea', desc: '地域別K-Foodスポットキュレーション' },
  en: { title: 'Food | Legend of Korea', desc: 'Regional K-Food Spot curation' },
}

const HERO = {
  ko: { badge: 'K-FOOD', title: '음식', subtitle: '지역별 맛집 스팟 · 음식 듀프 · 플래그 쿠킹' },
  ja: { badge: 'K-FOOD', title: 'グルメ', subtitle: '地域別グルメスポット · 食べ物デュープ · フラッグ料理' },
  en: { badge: 'K-FOOD', title: 'Food', subtitle: 'Regional spots · Food dupes · Flag cooking' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function FoodPage({ params, searchParams }: Props) {
  const { locale } = params
  const cityFilter = searchParams.city ?? 'all'
  const h = HERO[locale as keyof typeof HERO] ?? HERO.ko

  return (
    <div className="min-h-screen bg-white">

      {/* ── 히어로 헤더 ──────────────────────────── */}
      <div className="bg-[#FFF7F4] border-b border-orange-100 py-20 md:py-28 px-6 md:px-10 text-center">
        {/* 배지 */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#FF6B35]
                         text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          {h.badge}
        </span>
        {/* 제목 */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
          {h.title}
        </h1>
        {/* 서브타이틀 */}
        <p className="text-gray-500 text-base md:text-lg font-medium max-w-xl mx-auto">
          {h.subtitle}
        </p>
      </div>

      {/* ── 탭 네비게이션 ───────────────────────── */}
      <FoodTabNav locale={locale} activeTab="kfood-spot" />

      {/* ── K-Food Spot 목록 ─────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <KFoodSpotList locale={locale} cityFilter={cityFilter} />
      </div>
    </div>
  )
}