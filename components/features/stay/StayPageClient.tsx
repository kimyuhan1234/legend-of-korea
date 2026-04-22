'use client'

import { useState, useCallback } from 'react'
import { StayHero } from './StayHero'
import { StayCard } from './StayCard'
import { StayPreferencePanel } from './StayPreferencePanel'
import { StayFilters } from './StayFilters'
import type { NormalizedStay } from '@/lib/tour-api/stays'
import type { StayTags } from '@/lib/tour-api/stay-tags'

type CardStay = NormalizedStay & { matchScore?: number }

interface StayPageClientProps {
  locale: string
  initialStays: CardStay[]
}

type ClientLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<ClientLocale, { empty: string; loading: string; source: string; total: (n: number) => string }> = {
  ko: { empty: '조건에 맞는 숙소가 없어요', loading: '추천 숙소를 찾고 있어요…', source: '데이터: 한국관광공사', total: (n) => `${n}개의 숙소` },
  en: { empty: 'No matching stays', loading: 'Finding stays…', source: 'Data: Korea Tourism Organization', total: (n) => `${n} stays` },
  ja: { empty: '該当する宿がありません', loading: '宿を探しています…', source: 'データ: 韓国観光公社', total: (n) => `${n}件の宿` },
  'zh-CN': { empty: '没有符合条件的住宿', loading: '正在寻找住宿…', source: '数据: 韩国观光公社', total: (n) => `${n}家住宿` },
  'zh-TW': { empty: '沒有符合條件的住宿', loading: '正在尋找住宿…', source: '資料: 韓國觀光公社', total: (n) => `${n}家住宿` },
}

function buildRecommendUrl(prefs: StayTags | null, area: string | null, stayType: string | null, limit = 30): string {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  if (area) params.set('area', area)
  if (stayType) params.set('stayType', stayType)
  if (prefs) {
    for (const [axis, value] of Object.entries(prefs)) {
      if (value !== 0) params.set(axis, String(value))
    }
  }
  return `/api/tour-stays/recommend?${params.toString()}`
}

export function StayPageClient({ locale, initialStays }: StayPageClientProps) {
  const [stays, setStays] = useState<CardStay[]>(initialStays)
  const [area, setArea] = useState<string | null>(null)
  const [stayType, setStayType] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<StayTags | null>(null)
  const [loading, setLoading] = useState(false)

  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as ClientLocale) ? (locale as ClientLocale) : 'en'
  const t = UI[lc]

  const refetch = useCallback(
    async (nextPrefs: StayTags | null, nextArea: string | null, nextType: string | null) => {
      setLoading(true)
      try {
        const url = buildRecommendUrl(nextPrefs, nextArea, nextType, 30)
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { results?: CardStay[] }
        if (Array.isArray(json.results)) setStays(json.results)
      } catch {
        // 네트워크 오류 시 기존 리스트 유지
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleAreaChange = (code: string | null) => {
    setArea(code)
    refetch(prefs, code, stayType)
  }

  const handleTypeChange = (type: string | null) => {
    setStayType(type)
    refetch(prefs, area, type)
  }

  const handleApplyPrefs = (newPrefs: StayTags) => {
    setPrefs(newPrefs)
    refetch(newPrefs, area, stayType)
  }

  return (
    <div className="min-h-screen bg-snow">
      <StayHero />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
        <StayPreferencePanel locale={locale} onApply={handleApplyPrefs} />

        <StayFilters
          locale={locale}
          area={area}
          stayType={stayType}
          onAreaChange={handleAreaChange}
          onTypeChange={handleTypeChange}
        />

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-stone">
            {loading ? t.loading : t.total(stays.length)}
          </p>
          <p className="text-[10px] text-stone">{t.source}</p>
        </div>

        {stays.length === 0 ? (
          <div className="text-center py-20 text-stone">
            <div className="text-5xl mb-4">🏯</div>
            <p className="text-sm">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} locale={locale} />
            ))}
          </div>
        )}
      </main>

      <div className="h-16" />
    </div>
  )
}
