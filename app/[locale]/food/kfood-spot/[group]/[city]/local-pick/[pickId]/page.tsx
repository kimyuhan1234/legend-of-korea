import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodSpotDetail } from '@/components/features/food/KFoodSpotDetail'
import {
  fetchRestaurantDetail,
  fetchRestaurantImages,
  type Locale,
} from '@/lib/tour-api/restaurants'
import { findLocalPick } from '@/lib/data/local-picks'

interface Props {
  params: { locale: string; group: string; city: string; pickId: string }
}

function asLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pick = findLocalPick(params.city, params.pickId)
  if (!pick) return { title: 'Not Found' }
  return { title: `${pick.searchName} | Cloud with you` }
}

export default async function LocalPickDetailPage({ params }: Props) {
  const lk = asLocale(params.locale)
  const pick = findLocalPick(params.city, params.pickId)
  if (!pick || !pick.contentid) notFound()

  const [detail, images] = await Promise.all([
    fetchRestaurantDetail(pick.contentid, lk),
    fetchRestaurantImages(pick.contentid, lk),
  ])
  if (!detail) notFound()

  // local-pick curation → KFoodSpotDetail 의 curation prop 형식으로 변환
  const curation = pick.curation
    ? {
        mustTry: undefined,
        tags: pick.curation.tags,
        priceRange: undefined,
        customNote: pick.curation.tagline
          ? {
              ko: pick.curation.tagline.ko || '',
              ja: pick.curation.tagline.ja,
              en: pick.curation.tagline.en,
            }
          : undefined,
      }
    : undefined

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
