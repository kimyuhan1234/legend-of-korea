import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotDetail } from '@/components/features/food/KFoodSpotDetail'
import {
  fetchRestaurantDetail,
  fetchRestaurantImages,
  type Locale,
} from '@/lib/tour-api/restaurants'
import { kfoodCuration } from '@/lib/data/kfood-curation'

interface Props {
  params: { locale: string; city: string; contentid: string }
}

function asLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lk = asLocale(params.locale)
  const detail = await fetchRestaurantDetail(params.contentid, lk)
  if (!detail) return { title: 'Not Found' }
  return { title: `${detail.title} | Cloud with you` }
}

export default async function KFoodSpotDetailPage({ params }: Props) {
  const lk = asLocale(params.locale)

  const [detail, images] = await Promise.all([
    fetchRestaurantDetail(params.contentid, lk),
    fetchRestaurantImages(params.contentid, lk),
  ])
  if (!detail) notFound()

  const curation = kfoodCuration[params.contentid]

  return (
    <div>
      <FoodTabNav locale={params.locale} activeTab="kfood-spot" />
      <KFoodSpotDetail
        detail={detail}
        images={images}
        curation={curation}
        cityId={params.city}
        locale={params.locale}
      />
    </div>
  )
}
