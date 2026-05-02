'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { REGION_GROUPS } from '@/lib/data/regions-hierarchy'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function resolveLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

/**
 * 6 권역 이미지 카드 그리드 — /food/dupe 의 도시 탭 진입점.
 * 스타일: DupeCountrySelector(JP/CN) 버튼과 통일 (aspect-square, rounded-2xl, opacity)
 */
export function RegionGroupGrid() {
  const locale = resolveLocale(useLocale())

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {REGION_GROUPS.map((group) => (
        <Link
          key={group.id}
          href={`/${locale}/food/dupe/${group.id}`}
          prefetch={false}
          className="group flex flex-col items-center gap-2 transition-opacity duration-200 opacity-70 hover:opacity-100"
        >
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            <Image
              src={`/images/region-card/${group.id}.png`}
              alt={group.name[locale]}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-sm font-bold text-ink">{group.name[locale]}</span>
        </Link>
      ))}
    </div>
  )
}
