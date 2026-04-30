import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PROVINCES } from '@/lib/data/regions-hierarchy'
import { CITY_AREA_CODES } from '@/lib/tour-api/area-codes'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

interface Props {
  locale: string
}

/**
 * /food/kfood-spot 의 도시 선택 그리드.
 * PROVINCES 의 cities 를 flatten — TourAPI 매칭 가능한 도시만 표시 (national fallback 제외).
 */
export function KFoodCityGrid({ locale }: Props) {
  const lk: Locale = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(locale as Locale)
    ? (locale as Locale)
    : 'ko'

  // 모든 city 펼친 후 TourAPI 매칭 가능한 것만 (national 등 fallback 은 식당 의미 없음)
  const cities = PROVINCES.flatMap((p) =>
    p.cities
      .filter((c) => c.id !== 'national' && CITY_AREA_CODES[c.id] !== undefined)
      .map((c) => ({ city: c, provinceEmoji: p.emoji, provinceName: p.name[lk] })),
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cities.map(({ city, provinceEmoji, provinceName }) => (
        <Link
          key={city.id}
          href={`/${locale}/food/kfood-spot/${city.id}`}
          className="flex items-center justify-between rounded-2xl border border-mist bg-white px-4 py-4 transition hover:border-mint-deep hover:shadow-sm active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden>
              {provinceEmoji}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink truncate">{city.name[lk]}</p>
              <p className="text-xs text-stone truncate">{provinceName}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-stone shrink-0" aria-hidden />
        </Link>
      ))}
    </div>
  )
}
