import { kfoodSpots, CITIES, CATEGORY_LABEL, type KFoodSpot } from "@/lib/data/kfood-spots"
import { getCityInfo } from "@/lib/curation/cities"
import Link from "next/link"
import { AddToPlannerButton } from "@/components/features/planner/AddToPlannerButton"

const EMPTY_LABEL: Record<string, string> = {
  ko: '준비 중입니다',
  ja: '準備中です',
  en: 'Coming soon',
  'zh-CN': '准备中',
  'zh-TW': '準備中',
}

const MUST_TRY_LABEL: Record<string, string> = {
  ko: '꼭 먹어봐야 할 것',
  ja: '必食メニュー',
  en: 'Must try',
  'zh-CN': '必吃推荐',
  'zh-TW': '必吃推薦',
}

interface KFoodSpotListProps {
  locale: string
  cityFilter: string
}

function getL(field: { ko: string; ja: string; en: string } | null | undefined, locale: string): string {
  if (!field) return ''
  return (field as Record<string, string>)[locale] || field.en || field.ko || ''
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] } | null | undefined, locale: string): string[] {
  if (!field) return []
  return (field as Record<string, string[]>)[locale] || field.en || field.ko || []
}

const PRICE_COLOR: Record<string, string> = {
  "₩": "text-mint-deep",
  "₩₩": "text-blossom-deep",
  "₩₩₩": "text-blossom-deep",
}

const CATEGORY_ICON: Record<string, string> = {
  restaurant: "🍽️",
  market: "🏪",
  street: "🛤️",
  cafe: "☕",
}

export function KFoodSpotList({ locale, cityFilter }: KFoodSpotListProps) {
  const cities = CITIES
  const catLabel = CATEGORY_LABEL[locale as keyof typeof CATEGORY_LABEL] || CATEGORY_LABEL.en || CATEGORY_LABEL.ko

  const filtered =
    cityFilter && cityFilter !== "all"
      ? kfoodSpots.filter((s) => s.cityCode === cityFilter)
      : kfoodSpots

  return (
    <div>
      {/* 도시 필터 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {cities.map((city) => {
          const isActive = (cityFilter || "all") === city.code
          const label = (city as unknown as Record<string, string>)[locale] || city.en || city.ko
          return (
            <Link
              key={city.code}
              href={`?city=${city.code}`}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-br from-mint to-blossom text-ink border-ink"
                  : "bg-white text-slate border-mist hover:border-ink/40"
              }`}
            >
              <span className="text-base leading-none">{city.emoji}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      {/* 스팟 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone">
          <p className="text-4xl mb-3">🍜</p>
          <p className="font-medium">{EMPTY_LABEL[locale] ?? EMPTY_LABEL.en}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((spot) => (
            <SpotCard key={spot.id} spot={spot} locale={locale} catLabel={catLabel} />
          ))}
        </div>
      )}
    </div>
  )
}

function SpotCard({
  spot,
  locale,
  catLabel,
}: {
  spot: KFoodSpot
  locale: string
  catLabel: Record<string, string>
}) {
  return (
    <div className="bg-white rounded-3xl border border-mist hover:border-blossom-deep/40 hover:shadow-md transition-all overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{CATEGORY_ICON[spot.category]}</span>
              <span className="text-xs text-stone">{catLabel[spot.category]}</span>
              <span className={`text-xs font-bold ${PRICE_COLOR[spot.priceRange]}`}>{spot.priceRange}</span>
            </div>
            <h3 className="font-black text-[#111] text-base">{getL(spot.name, locale)}</h3>
            <p className="text-xs text-blossom-deep font-semibold mt-0.5">{getL(spot.speciality, locale)}</p>
          </div>
          <span className="text-2xl shrink-0">
            {getCityInfo(spot.cityCode)?.emoji ?? "📍"}
          </span>
        </div>
        <p className="text-sm text-stone leading-relaxed">{getL(spot.description, locale)}</p>
      </div>

      {/* 머스트 트라이 */}
      <div className="px-6 pb-4">
        <p className="text-xs font-bold text-[#111] mb-2">
          {MUST_TRY_LABEL[locale] ?? MUST_TRY_LABEL.en}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {getLA(spot.mustTry, locale).map((item: string) => (
            <span key={item} className="px-2.5 py-1 rounded-full bg-cloud text-xs text-slate">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className="px-6 py-3 border-t border-[#F0F2F5] flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-stone truncate">📍 {spot.address}</p>
          <p className="text-xs text-stone truncate">🕐 {spot.openHours}</p>
        </div>
        <AddToPlannerButton
          itemType="food"
          cityId={spot.cityCode}
          itemData={{
            id: spot.id,
            name: spot.name,
            category: spot.category,
            priceRange: spot.priceRange,
            address: spot.address,
            speciality: spot.speciality,
          }}
          className="shrink-0"
        />
      </div>
    </div>
  )
}
