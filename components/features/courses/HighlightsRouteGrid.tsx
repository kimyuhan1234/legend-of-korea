'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { parseRouteSpots, type Locale } from '@/lib/data/parseRouteSpots'
import type { RegionId } from '@/lib/data/spotMatchingPolicy'
import { SpotImageCard } from './SpotImageCard'

interface Props {
  courseRegionId: RegionId | string
  recommendedRouteText: string
  locale: Locale
}

/**
 * 코스 highlights 의 recommendedRoute 텍스트 → spot 그리드.
 *
 * 데이터 = 하이브리드 (운영자 결정): courses.ts 의 자유 텍스트 1줄 그대로 보존,
 * 컴포넌트 런타임에 parseRouteSpots 로 분해.
 *
 * 레이아웃: 모바일 2-col / 데스크탑 3-col. spot 사이 ChevronRight 화살표로 동선
 * 흐름 표현 (마지막 spot 제외).
 */
export function HighlightsRouteGrid({
  courseRegionId,
  recommendedRouteText,
  locale,
}: Props) {
  const t = useTranslations('courses.highlights')
  const spots = parseRouteSpots(recommendedRouteText, locale)

  if (spots.length === 0) return null

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h3 className="text-lg md:text-xl font-black text-[#111] mb-6">
          {t('routeGridTitle')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {spots.map((spot, i) => (
            <div key={`${spot.name}-${i}`} className="relative">
              <SpotImageCard
                spotName={spot.name}
                regionId={courseRegionId}
                locale={locale}
                kind={spot.kind}
              />
              {i < spots.length - 1 && (
                <ChevronRight
                  aria-hidden
                  className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-mint-deep z-10"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
