import Link from 'next/link'
import { KFOOD_CITY_TO_GROUP } from '@/lib/data/regions-hierarchy'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'
type TabId = 'local-pick' | 'korean' | 'exotic' | 'cafe'

const TABS: { id: TabId; label: Record<Locale, string> }[] = [
  { id: 'local-pick', label: { ko: '🔥 로컬 픽', ja: '🔥 ローカルピック', en: '🔥 Local Picks', 'zh-CN': '🔥 当地推荐', 'zh-TW': '🔥 當地推薦' } },
  { id: 'korean',     label: { ko: '한식',       ja: '韓食',           en: 'Korean',          'zh-CN': '韩食',         'zh-TW': '韓食' } },
  { id: 'exotic',     label: { ko: '이색음식',   ja: '異色料理',       en: 'Fusion',          'zh-CN': '特色',         'zh-TW': '特色' } },
  { id: 'cafe',       label: { ko: '카페/찻집',  ja: 'カフェ',         en: 'Cafe',            'zh-CN': '咖啡',         'zh-TW': '咖啡' } },
]

interface Props {
  city: string
  currentTab: TabId
  locale: string
}

/**
 * /[city] 의 4 탭 — 로컬 픽 / 한식 / 이색 / 카페.
 * 서버 컴포넌트 — 단순 link list, JS 인터랙션 없음.
 */
export function KFoodCategoryTabs({ city, currentTab, locale }: Props) {
  const lk: Locale = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(locale as Locale)
    ? (locale as Locale)
    : 'ko'
  const group = KFOOD_CITY_TO_GROUP[city]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {TABS.map((tab) => {
        const isActive = tab.id === currentTab
        return (
          <Link
            key={tab.id}
            href={`/${locale}/food/kfood-spot/${group}/${city}/${tab.id}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-mint-deep text-white'
                : 'bg-white text-stone border border-mist hover:border-mint-deep hover:text-mint-deep'
            }`}
          >
            {tab.label[lk]}
          </Link>
        )
      })}
    </div>
  )
}
