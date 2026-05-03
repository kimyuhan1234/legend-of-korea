import { permanentRedirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import {
  REGION_GROUPS,
  KFOOD_CITY_TO_GROUP,
  KFOOD_GROUP_TO_CITIES,
  PROVINCES,
  type RegionGroupId,
} from '@/lib/data/regions-hierarchy'

type LocaleKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

interface Props {
  params: { locale: string; group: string }
}

const COPY: Record<LocaleKey, { back: string; pickCity: string }> = {
  ko: { back: '← 권역 선택', pickCity: '도시를 선택하세요' },
  ja: { back: '← エリア選択', pickCity: '都市を選んでください' },
  en: { back: '← Pick a region', pickCity: 'Choose a city' },
  'zh-CN': { back: '← 选择区域', pickCity: '请选择城市' },
  'zh-TW': { back: '← 選擇區域', pickCity: '請選擇城市' },
}

function asLocale(raw: string): LocaleKey {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as LocaleKey[]).includes(raw as LocaleKey)
    ? (raw as LocaleKey)
    : 'ko'
}

function findCityName(cityId: string, lk: LocaleKey): string {
  for (const p of PROVINCES) {
    const c = p.cities.find((x) => x.id === cityId)
    if (c) return c.name[lk]
  }
  return cityId
}

function findCityProvince(cityId: string): { emoji: string; name: { ko: string; ja: string; en: string; 'zh-CN': string; 'zh-TW': string } } | null {
  for (const p of PROVINCES) {
    if (p.cities.some((x) => x.id === cityId)) {
      return { emoji: p.emoji, name: p.name }
    }
  }
  return null
}

function isValidGroup(slug: string): slug is RegionGroupId {
  return REGION_GROUPS.some((g) => g.id === slug)
}

export default function KFoodGroupPage({ params }: Props) {
  const { locale, group: slug } = params
  const lk = asLocale(locale)

  // 그룹 ID 가 아니면 — 레거시 도시 URL → 새 URL 로 redirect (자기 참조 방지)
  if (!isValidGroup(slug)) {
    const target = KFOOD_CITY_TO_GROUP[slug]
    if (target && target !== slug) {
      permanentRedirect(`/${locale}/food/kfood-spot/${target}/${slug}/local-pick`)
    }
    notFound()
  }

  const groupId = slug
  const groupMeta = REGION_GROUPS.find((g) => g.id === groupId)!
  const cities = KFOOD_GROUP_TO_CITIES[groupId]
  const t = COPY[lk]

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="kfood-spot" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href={`/${locale}/food/kfood-spot`}
          className="inline-flex items-center text-sm text-stone hover:text-ink transition-colors mb-4"
        >
          {t.back}
        </Link>
        <h1 className="text-2xl font-black text-ink mb-1">
          {groupMeta.emoji} {groupMeta.name[lk]}
        </h1>
        <p className="text-sm text-stone mb-6">{t.pickCity}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cities.map((cityId) => {
            const province = findCityProvince(cityId)
            const cityName = findCityName(cityId, lk)
            return (
              <Link
                key={cityId}
                href={`/${locale}/food/kfood-spot/${groupId}/${cityId}/local-pick`}
                className="flex items-center justify-between rounded-2xl border border-mist bg-white px-4 py-4 transition hover:border-mint-deep hover:shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0" aria-hidden>
                    {province?.emoji ?? '📍'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{cityName}</p>
                    {province && (
                      <p className="text-xs text-stone truncate">{province.name[lk]}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-stone shrink-0" aria-hidden />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
