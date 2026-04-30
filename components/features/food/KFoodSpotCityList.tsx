import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronRight } from 'lucide-react'
import type { TourRestaurant } from '@/lib/tour-api/restaurants'
import { FOOD_CATEGORY_LABELS } from '@/lib/tour-api/categories'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'
type CategorySlug = 'korean' | 'exotic' | 'cafe'

const LOCALE_TEXT: Record<Locale, { back: string; empty: string; noImage: string }> = {
  ko: { back: '← 도시 선택', empty: '등록된 식당이 없어요', noImage: '사진 준비 중' },
  ja: { back: '← 都市選択', empty: '登録された店舗がありません', noImage: '写真準備中' },
  en: { back: '← Pick a city', empty: 'No restaurants found', noImage: 'No image' },
  'zh-CN': { back: '← 选择城市', empty: '暂无餐厅信息', noImage: '暂无图片' },
  'zh-TW': { back: '← 選擇城市', empty: '尚無餐廳資訊', noImage: '尚無圖片' },
}

interface Props {
  restaurants: TourRestaurant[]
  cityId: string
  cityName: string
  /** 라우트 prefix — /[city]/[category]/[contentid] 링크 생성용 */
  category: CategorySlug
  locale: string
  /** true 면 헤더(back/cityName/count) 생략 — 부모 페이지가 처리. */
  embedded?: boolean
}

export function KFoodSpotCityList({
  restaurants,
  cityId,
  cityName,
  category,
  locale,
  embedded = false,
}: Props) {
  const lk: Locale = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(locale as Locale)
    ? (locale as Locale)
    : 'ko'
  const t = LOCALE_TEXT[lk]

  const grid = restaurants.length === 0 ? (
    <div className="rounded-2xl border border-mist bg-white p-10 text-center text-stone">
      {t.empty}
    </div>
  ) : (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r) => (
        <Link
          key={r.contentid}
          href={`/${locale}/food/kfood-spot/${cityId}/${category}/${r.contentid}`}
          className="group bg-white rounded-2xl border border-mist overflow-hidden hover:border-mint-deep hover:shadow-md transition-all"
        >
          <div className="relative aspect-[4/3] bg-cloud">
            {r.firstimage ? (
              <Image
                src={r.firstimage}
                alt={r.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-stone text-sm">
                {t.noImage}
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-bold text-ink text-sm line-clamp-1 min-w-0">{r.title}</p>
              {r.cat3 && FOOD_CATEGORY_LABELS[r.cat3] && (
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-mint-light/40 text-mint-deep text-[10px] font-bold">
                  {FOOD_CATEGORY_LABELS[r.cat3][lk]}
                </span>
              )}
            </div>
            {r.addr1 && (
              <p className="flex items-start gap-1.5 text-xs text-stone line-clamp-2">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                <span>{r.addr1}</span>
              </p>
            )}
            <div className="flex items-center justify-end mt-3 text-xs text-mint-deep font-bold">
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )

  if (embedded) return grid

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href={`/${locale}/food/kfood-spot`}
        className="inline-flex items-center text-sm text-stone hover:text-ink transition-colors mb-6"
      >
        {t.back}
      </Link>
      <h2 className="text-2xl font-black text-ink mb-2">{cityName}</h2>
      <p className="text-sm text-stone mb-6">{restaurants.length}</p>
      {grid}
    </div>
  )
}
