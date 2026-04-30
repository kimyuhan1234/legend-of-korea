import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { KFoodCategoryTabs } from '@/components/features/food/KFoodCategoryTabs'
import { LocalPickCard } from '@/components/features/food/LocalPickCard'
import { CITY_AREA_CODES } from '@/lib/tour-api/area-codes'
import { fetchRestaurantDetail, type Locale } from '@/lib/tour-api/restaurants'
import { getLocalPicks } from '@/lib/data/local-picks'
import { PROVINCES } from '@/lib/data/regions-hierarchy'

interface Props {
  params: { locale: string; city: string }
}

const COPY: Record<Locale, { back: string; title: string; subtitle: string; empty: string }> = {
  ko: {
    back: '← 도시 선택',
    title: '🔥 로컬 픽',
    subtitle: '외지인이 가장 많이 찾는 식당 — 한국관광 데이터랩 (Tmap 빅데이터)',
    empty: '이 지역의 로컬 픽이 아직 준비되지 않았습니다.',
  },
  ja: {
    back: '← 都市選択',
    title: '🔥 ローカルピック',
    subtitle: '地元外の人が最もよく訪れるお店 — 韓国観光データラボ (Tmap ビッグデータ)',
    empty: 'この地域のローカルピックは準備中です。',
  },
  en: {
    back: '← Pick a city',
    title: '🔥 Local Picks',
    subtitle: 'Top spots visited by out-of-town travelers — KTO data lab (Tmap bigdata)',
    empty: 'No local picks ready for this region yet.',
  },
  'zh-CN': {
    back: '← 选择城市',
    title: '🔥 当地推荐',
    subtitle: '外地游客最常造访的餐厅 — 韩国观光数据室 (Tmap 大数据)',
    empty: '本地区当地推荐尚在准备中。',
  },
  'zh-TW': {
    back: '← 選擇城市',
    title: '🔥 當地推薦',
    subtitle: '外地遊客最常造訪的餐廳 — 韓國觀光資料室 (Tmap 大數據)',
    empty: '本地區當地推薦尚在準備中。',
  },
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

export default async function LocalPickPage({ params }: Props) {
  const { locale, city } = params
  if (!CITY_AREA_CODES[city]) notFound()

  const lk = asLocale(locale)
  const t = COPY[lk]
  const cityName = findCityName(city, lk)
  const picks = getLocalPicks(city)

  // contentid 있는 픽만 TourAPI 데이터 fetch (병렬)
  const enriched = await Promise.all(
    picks
      .filter((p) => p.contentid)
      .map(async (pick) => ({
        pick,
        detail: await fetchRestaurantDetail(pick.contentid as string, lk),
      })),
  )
  // detail 있는 것만 (TourAPI 응답 실패 픽 제외)
  const displayed = enriched.filter((e) => e.detail !== null)

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
        <KFoodCategoryTabs city={city} currentTab="local-pick" locale={locale} />

        <div className="mt-6 mb-6">
          <h2 className="text-xl font-black text-ink mb-1">{t.title}</h2>
          <p className="text-sm text-stone">{t.subtitle}</p>
        </div>

        {displayed.length === 0 ? (
          <div className="rounded-2xl border border-mist bg-white p-10 text-center text-stone">
            {t.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map(({ pick, detail }) => (
              <LocalPickCard
                key={pick.id}
                pick={pick}
                detail={detail!}
                city={city}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
