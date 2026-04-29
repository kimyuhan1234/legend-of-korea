'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { PROVINCES, type ProvinceItem } from '@/lib/data/regions-hierarchy'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

function resolveLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

/**
 * 도/시 2 단계 Accordion — 한국 행정구역 광역 → 도시 (food-dupes region).
 *
 * - 단일 도시 (서울 / 부산 / 제주 등): 즉시 link (Accordion 펼치기 X)
 * - 복수 도시 (경기도 / 경상북도): 펼치기 → 도시 list
 * - 모바일 친화 큰 터치 영역 (h-14)
 * - 라우트: /[locale]/food/dupe/{city.id}
 */
export function ProvinceAccordion() {
  const locale = resolveLocale(useLocale())
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      {PROVINCES.map((province) => (
        <ProvinceRow
          key={province.id}
          province={province}
          locale={locale}
          isOpen={openId === province.id}
          onToggle={() => setOpenId(openId === province.id ? null : province.id)}
        />
      ))}
    </div>
  )
}

interface RowProps {
  province: ProvinceItem
  locale: Locale
  isOpen: boolean
  onToggle: () => void
}

function ProvinceRow({ province, locale, isOpen, onToggle }: RowProps) {
  const isSingle = province.cities.length === 1

  // 단일 도시 — 즉시 link
  if (isSingle) {
    const city = province.cities[0]
    return (
      <Link
        href={`/${locale}/food/dupe/${city.id}`}
        className="flex items-center justify-between rounded-2xl border border-mist bg-white px-5 py-4 transition hover:border-sky hover:bg-sky/5 active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>{province.emoji}</span>
          <span className="text-base font-semibold text-ink">
            {province.name[locale]}
          </span>
        </div>
        <ChevronRight className="h-5 w-5 text-stone" aria-hidden />
      </Link>
    )
  }

  // 복수 도시 — Accordion
  return (
    <div className="rounded-2xl border border-mist bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 transition hover:bg-sky/5 active:scale-[0.99]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>{province.emoji}</span>
          <span className="text-base font-semibold text-ink">
            {province.name[locale]}
          </span>
          <span className="rounded-full bg-mist/60 px-2 py-0.5 text-xs text-stone">
            {province.cities.length}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-stone transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="border-t border-mist bg-cloud px-3 py-2">
          {province.cities.map((city) => (
            <Link
              key={city.id}
              href={`/${locale}/food/dupe/${city.id}`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-sky/10 active:scale-[0.98]"
            >
              <span className="text-stone" aria-hidden>└</span>
              <span className="text-sm font-medium text-ink">
                {city.name[locale]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
