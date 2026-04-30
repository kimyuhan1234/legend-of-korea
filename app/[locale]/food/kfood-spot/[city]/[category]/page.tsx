import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotCityList } from '@/components/features/food/KFoodSpotCityList'
import { KFoodCategoryTabs } from '@/components/features/food/KFoodCategoryTabs'
import { fetchRestaurantsByArea, type Locale } from '@/lib/tour-api/restaurants'
import { CITY_AREA_CODES } from '@/lib/tour-api/area-codes'
import { FOOD_CATEGORIES } from '@/lib/tour-api/categories'
import { PROVINCES } from '@/lib/data/regions-hierarchy'

type CategoryTab = 'korean' | 'exotic' | 'cafe'

const CATEGORY_TO_CAT3: Record<CategoryTab, string> = {
  korean: FOOD_CATEGORIES.KOREAN,
  exotic: FOOD_CATEGORIES.EXOTIC,
  cafe: FOOD_CATEGORIES.CAFE,
}

interface Props {
  params: { locale: string; city: string; category: string }
}

function asLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

function findCityName(cityId: string, lk: Locale): string {
  for (const p of PROVINCES) {
    const c = p.cities.find((x) => x.id === cityId)
    if (c) return c.name[lk]
  }
  return cityId
}

const COPY: Record<Locale, { back: string }> = {
  ko: { back: '← 도시 선택' },
  ja: { back: '← 都市選択' },
  en: { back: '← Pick a city' },
  'zh-CN': { back: '← 选择城市' },
  'zh-TW': { back: '← 選擇城市' },
}

export default async function CategoryPage({ params }: Props) {
  const { locale, city, category } = params
  const config = CITY_AREA_CODES[city]
  if (!config) notFound()
  if (!(category in CATEGORY_TO_CAT3)) notFound()

  const cat3 = CATEGORY_TO_CAT3[category as CategoryTab]
  const lk = asLocale(locale)
  const t = COPY[lk]
  const cityName = findCityName(city, lk)

  // 단일 카테고리 fetch — 인기순 + 대표이미지 보유 우선
  const all = await fetchRestaurantsByArea(config.areaCode, {
    sigunguCode: config.sigunguCode,
    numOfRows: 100,
    cat3,
    arrange: 'Q',
    locale: lk,
  })
  // 사진 있는 것만 + 30 개
  const restaurants = all
    .filter((r) => r.firstimage && r.firstimage.trim().length > 0)
    .slice(0, 30)

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="kfood-spot" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href={`/${locale}/food/kfood-spot`}
          className="inline-flex items-center text-sm text-stone hover:text-ink transition-colors mb-4"
        >
          {t.back}
        </Link>
        <h1 className="text-2xl font-black text-ink mb-1">{cityName}</h1>
        <KFoodCategoryTabs city={city} currentTab={category as CategoryTab} locale={locale} />

        <div className="mt-6">
          <KFoodSpotCityList
            restaurants={restaurants}
            cityId={city}
            cityName={cityName}
            category={category as CategoryTab}
            locale={locale}
            embedded
          />
        </div>
      </div>
    </div>
  )
}
