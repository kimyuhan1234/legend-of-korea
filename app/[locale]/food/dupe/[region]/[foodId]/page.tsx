import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { FoodEmojiThumb } from "@/components/features/food/FoodEmojiThumb"
import { DupeCountrySelector } from "@/components/features/food/DupeCountrySelector"
import { HealthSection } from "@/components/features/food/HealthSection"
import { regions } from "@/lib/data/food-dupes"
import { fetchRestaurantsByArea, type Locale as TourLocale } from "@/lib/tour-api/restaurants"
import { CITY_AREA_CODES } from "@/lib/tour-api/area-codes"
import { foodHealthData } from "@/lib/data/food-health"
import { KFOOD_CITY_TO_GROUP } from "@/lib/data/regions-hierarchy"

interface Props {
  params: { locale: string; region: string; foodId: string }
}

function getL(field: { ko: string; ja: string; en: string } | null | undefined, locale: string): string {
  if (!field) return ''
  return field[locale as keyof typeof field] || field.en || field.ko || ''
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] } | null | undefined, locale: string): string[] {
  if (!field) return []
  return field[locale as keyof typeof field] || field.en || field.ko || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = regions.find((r) => r.code === params.region)
  const food = region?.foods.find((f) => f.id === params.foodId)
  if (!food) return { title: "Not Found" }
  return { title: `${getL(food.name, params.locale)} | Clouds with you` }
}

const UI = {
  ko: {
    backRegion: "← 목록으로",
    story: "이 음식 이야기",
    ingredients: "주요 재료",
    tasteProfile: "맛 프로필",
    spotsTitle: "이 음식을 맛볼 수 있는 곳",
    spotsLink: "맛집 전체 보기 →",
  },
  ja: {
    backRegion: "← 一覧に戻る",
    story: "この料理のストーリー",
    ingredients: "主な食材",
    tasteProfile: "味プロフィール",
    spotsTitle: "この料理が食べられる場所",
    spotsLink: "グルメスポット一覧 →",
  },
  en: {
    backRegion: "← Back to list",
    story: "The Story",
    ingredients: "Key Ingredients",
    tasteProfile: "Taste Profile",
    spotsTitle: "Where to taste this dish",
    spotsLink: "See all food spots →",
  },
}

export default async function FoodDetailPage({ params }: Props) {
  const { locale, region: regionCode, foodId } = params
  const region = regions.find((r) => r.code === regionCode)
  if (!region) notFound()

  const food = region.foods.find((f) => f.id === foodId)
  if (!food) notFound()

  const t = UI[locale as keyof typeof UI] || UI.en || UI.ko

  // 같은 도시의 K-Food Spot 최대 3개 — TourAPI 동적 fetch
  const cityArea = CITY_AREA_CODES[food.region]
  const tourLocale: TourLocale = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as TourLocale[]).includes(
    locale as TourLocale,
  )
    ? (locale as TourLocale)
    : 'ko'
  const relatedSpots = cityArea
    ? (await fetchRestaurantsByArea(cityArea.areaCode, {
        sigunguCode: cityArea.sigunguCode,
        numOfRows: 3,
        locale: tourLocale,
      })).slice(0, 3)
    : []

  // 건강 효능 데이터 조회
  const healthData = foodHealthData.find((h) => h.foodId === foodId)

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      <div className="max-w-4xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {/* 뒤로가기 */}
        <Link
          href={`/${locale}/food/dupe/${regionCode}`}
          className="inline-flex items-center text-sm text-stone hover:text-[#111] mb-8 transition-colors"
        >
          {t.backRegion}
        </Link>

        {/* 음식 히어로 — TourAPI 이미지 우선 + 이모지 fallback */}
        <div className="bg-white rounded-3xl overflow-hidden mb-8 border border-mist">
          <div className="relative h-56 md:h-72">
            {food.image ? (
              <Image
                src={food.image}
                alt={getL(food.name, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <FoodEmojiThumb
                food={{ name: food.name, tags: food.tags }}
                size="text-9xl"
                bordered={false}
              />
            )}
            {/* 이미지 출처 표기 (공공누리 1 유형 — 출처 표시 의무) */}
            {food.image && food.imageCredit && (
              <span className="absolute top-2 right-2 z-[6] text-[10px] md:text-xs text-white/95 bg-black/55 px-2 py-1 rounded">
                {food.imageCredit}
              </span>
            )}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {food.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-blossom-light border border-blossom-deep/40 text-xs text-blossom-deep font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#111]">{getL(food.name, locale)}</h1>
              <p className="text-stone text-sm mt-1">{region.icon} {getL(region.name, locale)}</p>
            </div>
          </div>
        </div>

        {/* 스토리텔링 */}
        <div className="bg-[#D4F0EB] border-l-4 border-blossom-deep pl-5 pr-4 py-5 rounded-r-2xl mb-8">
          <p className="text-xs font-bold text-blossom-deep uppercase tracking-wider mb-3">{t.story}</p>
          <p className="text-slate leading-relaxed text-base">{getL(food.storyDescription, locale)}</p>
        </div>

        {/* 주요 재료 */}
        <div className="bg-white rounded-3xl border border-mist p-6 mb-8">
          <p className="text-sm font-bold text-[#111] mb-5">{t.ingredients}</p>
          <div className="flex flex-wrap gap-2">
            {getLA(food.ingredients, locale).map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-full bg-cloud text-sm text-slate">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 건강 효능 섹션 */}
        {healthData && <HealthSection health={healthData} locale={locale} />}

        {/* 12개국 듀프 선택기 (레이더 차트 + 탭) */}
        <DupeCountrySelector food={food} locale={locale} />

        {/* K-Food Spot 연결 */}
        {relatedSpots.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-[#111]">🍽️ {t.spotsTitle}</h2>
              <Link
                href={`/${locale}/food/kfood-spot/${KFOOD_CITY_TO_GROUP[food.region] ?? ''}/${food.region}/local-pick`}
                className="text-sm text-blossom-deep font-bold hover:underline"
              >
                {t.spotsLink}
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedSpots.map((spot) => (
                <Link
                  key={spot.contentid}
                  href={`/${locale}/food/kfood-spot/${KFOOD_CITY_TO_GROUP[food.region] ?? ''}/${food.region}/korean/${spot.contentid}`}
                  className="bg-white rounded-2xl border border-mist p-4 hover:border-blossom-deep/50 hover:shadow-sm transition-all"
                >
                  <p className="font-bold text-[#111] text-sm mb-1 line-clamp-1">
                    {spot.title}
                  </p>
                  {spot.addr1 && (
                    <p className="text-xs text-stone line-clamp-2">
                      {spot.addr1}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}