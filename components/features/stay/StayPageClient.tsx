'use client'

import { useState, useCallback } from 'react'
import { StayHero } from './StayHero'
import { StayCard } from './StayCard'
import { StayPreferencePanel } from './StayPreferencePanel'
import { StayFilters } from './StayFilters'
import type { NormalizedStay } from '@/lib/tour-api/stays'
import type { StayTags } from '@/lib/tour-api/stay-tags'

type CardStay = NormalizedStay & { matchScore?: number; distanceKm?: number }

const PAGE_SIZE = 30

interface StayPageClientProps {
  locale: string
  initialStays: CardStay[]
  initialTotal: number
}

type ClientLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<
  ClientLocale,
  {
    empty: string
    loading: string
    source: string
    total: (n: number, t: number) => string
    loadMore: string
    useLocation: string
    locationDenied: string
    locationLoading: string
  }
> = {
  ko: {
    empty: '조건에 맞는 숙소가 없어요',
    loading: '추천 숙소를 찾고 있어요…',
    source: '데이터: 한국관광공사',
    total: (n, t) => `${n} / ${t}개의 숙소`,
    loadMore: '더 보기',
    useLocation: '📍 내 위치 근처순',
    locationDenied: '위치 권한이 거부되었어요',
    locationLoading: '위치 확인 중…',
  },
  en: {
    empty: 'No matching stays',
    loading: 'Finding stays…',
    source: 'Data: Korea Tourism Organization',
    total: (n, t) => `${n} / ${t} stays`,
    loadMore: 'Load more',
    useLocation: '📍 Near me',
    locationDenied: 'Location permission denied',
    locationLoading: 'Getting location…',
  },
  ja: {
    empty: '該当する宿がありません',
    loading: '宿を探しています…',
    source: 'データ: 韓国観光公社',
    total: (n, t) => `${n} / ${t}件の宿`,
    loadMore: 'もっと見る',
    useLocation: '📍 現在地から近い順',
    locationDenied: '位置情報が拒否されました',
    locationLoading: '位置取得中…',
  },
  'zh-CN': {
    empty: '没有符合条件的住宿',
    loading: '正在寻找住宿…',
    source: '数据: 韩国观光公社',
    total: (n, t) => `${n} / ${t}家住宿`,
    loadMore: '加载更多',
    useLocation: '📍 附近优先',
    locationDenied: '位置权限被拒绝',
    locationLoading: '正在获取位置…',
  },
  'zh-TW': {
    empty: '沒有符合條件的住宿',
    loading: '正在尋找住宿…',
    source: '資料: 韓國觀光公社',
    total: (n, t) => `${n} / ${t}家住宿`,
    loadMore: '載入更多',
    useLocation: '📍 附近優先',
    locationDenied: '位置權限被拒絕',
    locationLoading: '正在取得位置…',
  },
}

interface BuildParams {
  prefs: StayTags | null
  area: string | null
  stayType: string | null
  offset: number
  limit: number
  userCoord: { lat: number; lng: number } | null
}

function buildRecommendUrl({ prefs, area, stayType, offset, limit, userCoord }: BuildParams): string {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  if (area) params.set('area', area)
  if (stayType) params.set('stayType', stayType)
  if (prefs) {
    for (const [axis, value] of Object.entries(prefs)) {
      if (value !== 0) params.set(axis, String(value))
    }
  }
  if (userCoord) {
    params.set('userLat', String(userCoord.lat))
    params.set('userLng', String(userCoord.lng))
    params.set('sortBy', 'distance')
  }
  return `/api/tour-stays/recommend?${params.toString()}`
}

export function StayPageClient({ locale, initialStays, initialTotal }: StayPageClientProps) {
  const [stays, setStays] = useState<CardStay[]>(initialStays)
  const [total, setTotal] = useState<number>(initialTotal)
  const [area, setArea] = useState<string | null>(null)
  const [stayType, setStayType] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<StayTags | null>(null)
  const [userCoord, setUserCoord] = useState<{ lat: number; lng: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'denied'>('idle')
  const [loading, setLoading] = useState(false)

  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as ClientLocale)
    ? (locale as ClientLocale)
    : 'en'
  const t = UI[lc]

  // 초기 offset = stays.length (서버에서 로드된 수만큼 오프셋 시작)
  const hasMore = stays.length < total

  const replaceList = useCallback(
    async (params: Omit<BuildParams, 'offset' | 'limit'>) => {
      setLoading(true)
      try {
        const url = buildRecommendUrl({ ...params, offset: 0, limit: PAGE_SIZE })
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as { results?: CardStay[]; totalMatches?: number }
        if (Array.isArray(json.results)) {
          setStays(json.results)
          setTotal(json.totalMatches ?? json.results.length)
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const url = buildRecommendUrl({
        prefs,
        area,
        stayType,
        userCoord,
        offset: stays.length,
        limit: PAGE_SIZE,
      })
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) return
      const json = (await res.json()) as { results?: CardStay[]; totalMatches?: number }
      if (Array.isArray(json.results) && json.results.length > 0) {
        setStays((prev) => [...prev, ...(json.results as CardStay[])])
        if (typeof json.totalMatches === 'number') setTotal(json.totalMatches)
      }
    } finally {
      setLoading(false)
    }
  }, [area, stayType, prefs, userCoord, stays.length, loading, hasMore])

  const handleAreaChange = (code: string | null) => {
    setArea(code)
    replaceList({ prefs, area: code, stayType, userCoord })
  }

  const handleTypeChange = (type: string | null) => {
    setStayType(type)
    replaceList({ prefs, area, stayType: type, userCoord })
  }

  const handleApplyPrefs = (newPrefs: StayTags) => {
    setPrefs(newPrefs)
    replaceList({ prefs: newPrefs, area, stayType, userCoord })
  }

  const toggleLocation = () => {
    if (userCoord) {
      setUserCoord(null)
      setLocationStatus('idle')
      replaceList({ prefs, area, stayType, userCoord: null })
      return
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus('denied')
      return
    }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserCoord(c)
        setLocationStatus('idle')
        replaceList({ prefs, area, stayType, userCoord: c })
      },
      () => setLocationStatus('denied'),
      { timeout: 8000, enableHighAccuracy: false }
    )
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

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs font-bold text-stone">
            {loading ? t.loading : t.total(stays.length, total)}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLocation}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                userCoord
                  ? 'bg-mint-deep text-white border-mint-deep'
                  : 'bg-white border-mist text-slate hover:border-mint-deep'
              }`}
            >
              {locationStatus === 'loading'
                ? t.locationLoading
                : locationStatus === 'denied'
                  ? t.locationDenied
                  : t.useLocation}
            </button>
            <p className="text-[10px] text-stone">{t.source}</p>
          </div>
        </div>

        {stays.length === 0 ? (
          <div className="text-center py-20 text-stone">
            <div className="text-5xl mb-4">🏯</div>
            <p className="text-sm">{t.empty}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stays.map((stay) => (
                <StayCard key={stay.id} stay={stay} locale={locale} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 rounded-full border-2 border-mint-deep text-mint-deep font-black text-sm hover:bg-mint-light/40 transition-colors disabled:opacity-50"
                >
                  {loading ? t.loading : `${t.loadMore} (+${Math.min(PAGE_SIZE, total - stays.length)})`}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <div className="h-16" />
    </div>
  )
}
