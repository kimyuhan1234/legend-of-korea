import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotList } from '@/components/features/food/KFoodSpotList'
import { buildOgUrl } from '@/lib/seo/og-url'
import { CategorySchema } from '@/components/seo'

interface Props {
  params: { locale: string }
  searchParams: { city?: string }
}

const META = {
  ko: { title: 'K-FOOD | Cloud with you', desc: '지역별 K-Food Spot 큐레이션' },
  ja: { title: 'K-FOOD | Cloud with you', desc: '地域別K-Foodスポットキュレーション' },
  en: { title: 'K-FOOD | Cloud with you', desc: 'Regional K-Food Spot curation' },
}

const HERO = {
  ko: { badge: 'K-FOOD', title: 'K-FOOD', subtitle: '지역별 맛집 스팟 · 음식 듀프 · 플래그 쿠킹' },
  ja: { badge: 'K-FOOD', title: 'K-FOOD', subtitle: '地域別グルメスポット · 食べ物デュープ · フラッグ料理' },
  en: { badge: 'K-FOOD', title: 'K-FOOD', subtitle: 'Regional spots · Food dupes · Flag cooking' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] ?? META.ko
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: m.title.split(' | ')[0],
    subtitle: m.desc,
    tier: 'soft',
    category: 'K-FOOD',
    imagePath: '/images/category-food.png',
  })
  return {
    title: m.title,
    description: m.desc,
    openGraph: {
      title: m.title,
      description: m.desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: m.title }],
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.desc, images: [ogImage] },
  }
}

export default function FoodPage({ params, searchParams }: Props) {
  const { locale } = params
  const cityFilter = searchParams.city ?? 'all'
  const h = HERO[locale as keyof typeof HERO] ?? HERO.ko
  const m = META[locale as keyof typeof META] ?? META.ko
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'

  return (
    <div className="min-h-screen bg-snow">
      <CategorySchema
        type="food"
        name={m.title}
        description={m.desc}
        url={`${siteUrl}/${locale}/food`}
        image={`${siteUrl}/images/category-food.png`}
      />

      {/* ── 히어로 헤더 — P1-5: 단색 → Tier 2 (정보 페이지) ── */}
      <div className="bg-tier-soft border-b border-mint py-20 md:py-28 px-6 md:px-10 text-center">
        {/* 배지 */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-mint-deep
                         text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          {h.badge}
        </span>
        {/* 제목 */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
          {h.title}
        </h1>
        {/* 서브타이틀 */}
        <p className="text-stone text-base md:text-lg font-medium max-w-xl mx-auto">
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