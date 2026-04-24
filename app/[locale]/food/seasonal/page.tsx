import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { SeasonalFoodTab } from '@/components/features/food/SeasonalFoodTab'
import { seasonalFoods } from '@/lib/data/food-seasonal'

interface Props {
  params: { locale: string }
}

const META = {
  ko:      { title: 'K-FOOD 제철 한식 | Cloud with you', desc: '계절마다 가장 맛있는 한국 제철 음식 32가지를 월별 달력과 함께 소개합니다' },
  ja:      { title: 'K-FOOD 旬の韓食 | Cloud with you', desc: '季節ごとに最も美味しい韓国の旬料理32品を月別カレンダーと共に紹介' },
  en:      { title: 'K-FOOD Seasonal | Cloud with you', desc: 'Discover 32 Korean seasonal dishes with a 12-month ingredient calendar' },
  'zh-CN': { title: 'K-FOOD 时令韩食 | Cloud with you', desc: '介绍32道时令韩国料理及12个月食材日历' },
  'zh-TW': { title: 'K-FOOD 時令韓食 | Cloud with you', desc: '介紹32道時令韓國料理及12個月食材日曆' },
}

const HERO = {
  ko:      { badge: '🌸 제철 한식',        title: '지금 이 계절, 가장 맛있는 한 끼', subtitle: '봄·여름·가을·겨울, 각 계절에만 나는 재료로 만든 한국 전통 음식 32가지를 만나보세요.' },
  ja:      { badge: '🌸 旬の韓食',          title: '今この季節、最も美味しい一食',     subtitle: '春夏秋冬、それぞれの季節にしか採れない食材で作る韓国の伝統料理32品をご紹介。' },
  en:      { badge: '🌸 Seasonal Korean',   title: "This Season's Best Korean Meal",    subtitle: 'Discover 32 Korean traditional dishes made with ingredients harvested in each unique season.' },
  'zh-CN': { badge: '🌸 时令韩食',          title: '此时此刻，最美味的一餐',           subtitle: '春夏秋冬，每个季节独有的食材制成的32道韩国传统料理。' },
  'zh-TW': { badge: '🌸 時令韓食',          title: '此時此刻，最美味的一餐',           subtitle: '春夏秋冬，每個季節獨有的食材製成的32道韓國傳統料理。' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function SeasonalFoodPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] ?? HERO.ko

  return (
    <div className="min-h-screen bg-snow">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-50 via-amber-50 to-blue-50 border-b border-mist py-20 md:py-28 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-mint-deep text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          {h.badge}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
          {h.title}
        </h1>
        <p className="text-stone text-base md:text-lg font-medium max-w-xl mx-auto">
          {h.subtitle}
        </p>
      </div>

      {/* Tab Nav */}
      <FoodTabNav locale={locale} activeTab="seasonal" />

      {/* Seasonal filter + grid + calendar */}
      <SeasonalFoodTab locale={locale} foods={seasonalFoods} />
    </div>
  )
}
