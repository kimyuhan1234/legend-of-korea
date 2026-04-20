'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'
import { PassBlurOverlay } from '@/components/shared/PassBlurOverlay'
import { usePassStatus } from '@/hooks/usePassStatus'
import type { CountryDupeResult } from '@/lib/utils/country-dupe-aggregator'

interface CountryDupeListProps {
  countryCode: string
  data: CountryDupeResult
  locale: string
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as string] || field.en || field.ko
}

const INITIAL_SHOW = 5

export function CountryDupeList({ countryCode, data, locale }: CountryDupeListProps) {
  const t = useTranslations('dupe')
  const [showAll, setShowAll] = useState(false)
  const { hasPass } = usePassStatus()
  const unlocked = hasPass('live')

  if (data.dupes.length === 0) return null

  // 무료 유저: 1개만 보이고, 나머지는 블러 오버레이
  const visibleRaw = showAll ? data.dupes : data.dupes.slice(0, INITIAL_SHOW)
  const freeFirst = visibleRaw.slice(0, 1)
  const blurredRest = visibleRaw.slice(1)
  const hasMore = data.dupes.length > INITIAL_SHOW

  return (
    <div className="mt-8">
      {/* 헤더 */}
      <h3 className="text-lg font-black text-ink mb-4 text-center">
        {data.country.flag}{' '}
        {t('world.matches', {
          country: getL(data.country.name, locale),
          count: data.totalMatches,
        })}
      </h3>

      {/* 리스트 — 첫 1개 공개, 나머지는 블러 (live 패스 필요) */}
      <div className="space-y-3 max-w-2xl mx-auto">
        {freeFirst.map((item) => renderDupeItem(item, countryCode, locale, t))}

        {blurredRest.length > 0 && (
          <PassBlurOverlay requiredPass="live" blur={!unlocked}>
            <div className="space-y-3">
              {blurredRest.map((item) => renderDupeItem(item, countryCode, locale, t))}
            </div>
          </PassBlurOverlay>
        )}
      </div>

      {/* 더보기 — 패스 보유 유저에게만 노출 */}
      {unlocked && hasMore && !showAll && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-sm font-bold text-mint-deep hover:underline"
          >
            {t('world.more')} ({data.dupes.length - INITIAL_SHOW})
          </button>
        </div>
      )}
    </div>
  )
}

type DupeItem = CountryDupeResult['dupes'][number]
type TranslateFn = ReturnType<typeof useTranslations>

function renderDupeItem(item: DupeItem, countryCode: string, locale: string, t: TranslateFn) {
  const foreign = item.foreignFood
  const korean = item.koreanFood
  return (
    <div
      key={`${countryCode}-${korean.id}`}
      className="bg-white rounded-xl p-4 border border-mist hover:border-mint transition-colors"
    >
      <div className="flex gap-3">
        {/* 한국 음식 이미지 */}
        {korean.image && (
          <Link
            href={`/${locale}/food/dupe/${item.regionCode}/${korean.id}`}
            className="shrink-0"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={korean.image}
                alt={getL(korean.name, locale)}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          </Link>
        )}

        <div className="flex-1 min-w-0">
          {/* 외국 → 한국 */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-slate">
              {getL(foreign.name, locale)}
            </span>
            <span className="text-mint-deep font-black">→</span>
            <span className="text-sm font-black text-ink">
              {getL(korean.name, locale)}
            </span>
          </div>

          {/* 도시 뱃지 + 유사도 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-blossom-light text-blossom-deep text-[10px] font-bold">
              {getL(item.regionName, locale)}
            </span>
            <span className="text-xs text-stone">
              {t('world.similarity')} {foreign.similarityPercent}%
            </span>
          </div>

          {/* 유사도 바 */}
          <div className="h-1.5 bg-mist rounded-full mb-2">
            <div
              className="h-full bg-mint-deep rounded-full transition-all"
              style={{ width: `${foreign.similarityPercent}%` }}
            />
          </div>

          {/* 이유 */}
          <p className="text-[11px] text-slate mb-2 line-clamp-1">
            {getL(foreign.matchReason, locale)}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/food/dupe/${item.regionCode}/${korean.id}`}
              className="text-[11px] font-bold text-mint-deep hover:text-[#7BC8BC]"
            >
              {t('world.detail')}
            </Link>
            <AddToPlannerButton
              itemType="food"
              itemData={{
                name: korean.name,
                foodId: korean.id,
                region: item.regionCode,
                source: 'world-map',
              }}
              cityId={item.regionCode}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
