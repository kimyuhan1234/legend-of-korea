import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { SeasonalFoodTab } from '@/components/features/food/SeasonalFoodTab'
import { seasonalFoods, SEASON_META, type Season } from '@/lib/data/food-seasonal'

interface Props {
  params: { locale: string }
  searchParams: { season?: string }
}

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

const SELECT_PROMPT: Record<string, string> = {
  ko: '계절을 선택하세요',
  ja: '季節を選択してください',
  en: 'Choose a season',
  'zh-CN': '请选择季节',
  'zh-TW': '請選擇季節',
}

const META = {
  ko:      { title: 'K-FOOD 제철 한식 | Clouds with you', desc: '계절마다 가장 맛있는 한국 제철 음식 32가지를 월별 달력과 함께 소개합니다' },
  ja:      { title: 'K-FOOD 旬の韓食 | Clouds with you', desc: '季節ごとに最も美味しい韓国の旬料理32品を月別カレンダーと共に紹介' },
  en:      { title: 'K-FOOD Seasonal | Clouds with you', desc: 'Discover 32 Korean seasonal dishes with a 12-month ingredient calendar' },
  'zh-CN': { title: 'K-FOOD 时令韩食 | Clouds with you', desc: '介绍32道时令韩国料理及12个月食材日历' },
  'zh-TW': { title: 'K-FOOD 時令韓食 | Clouds with you', desc: '介紹32道時令韓國料理及12個月食材日曆' },
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

export default function SeasonalFoodPage({ params, searchParams }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] ?? HERO.ko
  const seasonParam = searchParams.season
  const validSeason = (SEASONS as string[]).includes(seasonParam ?? '') ? (seasonParam as Season) : null
  const prompt = SELECT_PROMPT[locale] ?? SELECT_PROMPT.en

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

      {validSeason ? (
        /* 2단계: 음식 list + 12개월 달력 */
        <SeasonalFoodTab locale={locale} foods={seasonalFoods} season={validSeason} />
      ) : (
        /* 1단계: 4 계절 이미지 카드만 */
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
          <p className="text-center text-stone text-sm font-medium mb-8">{prompt}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {SEASONS.map((s) => {
              const meta = SEASON_META[s]
              const label = meta.label[locale as keyof typeof meta.label] ?? meta.label.en
              return (
                <Link
                  key={s}
                  href={`/${locale}/food/seasonal?season=${s}`}
                  className="group block relative overflow-hidden rounded-2xl bg-white border border-mist shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={`/images/season-card/${s}.png`}
                      alt={label}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-4 px-4">
                      <span className="block text-white text-base md:text-lg font-bold">{label}</span>
                      <span className="block text-white/80 text-xs mt-0.5">{meta.months}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
