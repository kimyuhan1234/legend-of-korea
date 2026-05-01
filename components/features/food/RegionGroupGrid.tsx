'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { REGION_GROUPS } from '@/lib/data/regions-hierarchy'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function resolveLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

/**
 * 6 권역 그리드 — /food/dupe 의 도시 탭 진입점.
 *
 * - 권역 클릭 → /[locale]/food/dupe/{groupId} (해당 권역 음식 + national)
 * - 권역별 음식 불균형은 의도된 상태 (현재 등록된 도시 데이터 기준).
 *   national 28건 이 모든 권역에 합쳐 노출되어 최소 보장.
 */
export function RegionGroupGrid() {
  const locale = resolveLocale(useLocale())

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {REGION_GROUPS.map((group) => (
        <Link
          key={group.id}
          href={`/${locale}/food/dupe/${group.id}`}
          className="flex items-center justify-between rounded-2xl border border-mist bg-white px-5 py-5 transition hover:border-sky hover:bg-sky/5 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>{group.emoji}</span>
            <span className="text-base md:text-lg font-bold text-ink">
              {group.name[locale]}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-stone shrink-0" aria-hidden />
        </Link>
      ))}
    </div>
  )
}
