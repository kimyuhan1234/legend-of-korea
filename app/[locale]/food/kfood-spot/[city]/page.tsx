import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotCityList } from '@/components/features/food/KFoodSpotCityList'
import { fetchRestaurantsByArea, type Locale } from '@/lib/tour-api/restaurants'
import { CITY_AREA_CODES } from '@/lib/tour-api/area-codes'
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
  const restaurants = await fetchRestaurantsByArea(config.areaCode, {
    sigunguCode: config.sigunguCode,
    numOfRows: 30,
    locale: lk,
  })

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
