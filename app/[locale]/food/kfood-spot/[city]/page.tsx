import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotCityList } from '@/components/features/food/KFoodSpotCityList'
import { fetchRestaurantsByArea, type Locale, type TourRestaurant } from '@/lib/tour-api/restaurants'
import { CITY_AREA_CODES } from '@/lib/tour-api/area-codes'
import { FOOD_CATEGORIES } from '@/lib/tour-api/categories'
import { PROVINCES } from '@/lib/data/regions-hierarchy'

interface Props {
  params: { locale: string; city: string }
}

function findCity(cityId: string) {
  for (const p of PROVINCES) {
    const c = p.cities.find((x) => x.id === cityId)
    if (c) return c
  }
  return null
}

function asLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = findCity(params.city)
  if (!city) return { title: 'Not Found' }
  const lk = asLocale(params.locale)
  return { title: `${city.name[lk]} K-Food Spot | Cloud with you` }
}

export default async function KFoodSpotCityPage({ params }: Props) {
  const { locale, city: cityId } = params
  const config = CITY_AREA_CODES[cityId]
  const city = findCity(cityId)
  if (!config || !city) notFound()

  const lk = asLocale(locale)

  // 3 카테고리 병렬 fetch (한식 50 + 이색 30 + 카페 30 = 풀 110) — 인기순 + 대표이미지 보유
  const baseOpts = {
    sigunguCode: config.sigunguCode,
    arrange: 'Q',
    locale: lk,
  } as const
  const [korean, exotic, cafe] = await Promise.all([
    fetchRestaurantsByArea(config.areaCode, { ...baseOpts, numOfRows: 50, cat3: FOOD_CATEGORIES.KOREAN }),
    fetchRestaurantsByArea(config.areaCode, { ...baseOpts, numOfRows: 30, cat3: FOOD_CATEGORIES.EXOTIC }),
    fetchRestaurantsByArea(config.areaCode, { ...baseOpts, numOfRows: 30, cat3: FOOD_CATEGORIES.CAFE }),
  ])

  // 합치기 → firstimage 있는 것만 → contentid 중복 제거 → 인기순 유지하며 30 개
  const all = [...korean, ...exotic, ...cafe]
  const withImage = all.filter((r) => r.firstimage && r.firstimage.trim().length > 0)
  const unique: TourRestaurant[] = Array.from(
    new Map(withImage.map((r) => [r.contentid, r])).values(),
  )
  const restaurants = unique.slice(0, 30)

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="kfood-spot" />
      <KFoodSpotCityList
        restaurants={restaurants}
        cityId={cityId}
        cityName={city.name[lk]}
        locale={locale}
      />
    </div>
  )
}
