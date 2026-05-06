'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react'
import { CITIES, getCityName } from '@/lib/curation/cities'
import { PROVINCES } from '@/lib/data/regions-hierarchy'
import type { NormalizedSpot } from '@/lib/tour-api/types'

/** 17 광역만 chip 노출 — 2026-05-04 */
const PROVINCE_CODES = [
  'seoul', 'incheon', 'daejeon', 'daegu', 'gwangju', 'busan', 'ulsan', 'sejong',
  'gyeonggi', 'gangwon', 'chungbuk', 'chungnam', 'gyeongbuk', 'gyeongnam',
  'jeonbuk', 'jeonnam', 'jeju',
] as const

const CITY_TO_PROVINCE: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const p of PROVINCES) {
    for (const c of p.cities) map[c.id] = p.id
  }
  return map
})()

function getProvinceFor(region: string): string {
  if ((PROVINCE_CODES as readonly string[]).includes(region)) return region
  return CITY_TO_PROVINCE[region] ?? region
}

const PROVINCE_CITIES = CITIES.filter((c) => (PROVINCE_CODES as readonly string[]).includes(c.code))

interface Props {
  spots: NormalizedSpot[]
  locale: string
  onSpotClick?: (spot: NormalizedSpot) => void
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

/** YYYYMMDD 또는 YYYY-MM-DD → Date */
function parseSpotDate(v: string | undefined): Date | null {
  if (!v) return null
  const clean = v.replace(/-/g, '')
  if (clean.length !== 8) return null
  const y = parseInt(clean.slice(0, 4), 10)
  const m = parseInt(clean.slice(4, 6), 10) - 1
  const d = parseInt(clean.slice(6, 8), 10)
  const dt = new Date(y, m, d)
  return isNaN(dt.getTime()) ? null : dt
}

type FestivalStatus = 'ongoing' | 'upcoming' | 'ended'

function getStatus(start: Date, end: Date, today: Date): FestivalStatus {
  if (today < start) return 'upcoming'
  if (today > end) return 'ended'
  return 'ongoing'
}

export function FestivalCalendar({ spots, locale, onSpotClick }: Props) {
  const t = useTranslations('spots')

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [region, setRegion] = useState<string>('')

  const monthStart = useMemo(() => new Date(year, month - 1, 1), [year, month])
  const monthEnd = useMemo(() => new Date(year, month, 0, 23, 59, 59), [year, month])

  const festivals = useMemo(() => {
    const items = spots
      .filter(s => s.category === 'festival')
      .filter(s => !region || getProvinceFor(s.region) === region)
      .map(s => {
        const start = parseSpotDate(s.startDate)
        const end = parseSpotDate(s.endDate) || start
        return { spot: s, start, end }
      })
      .filter((x): x is { spot: NormalizedSpot; start: Date; end: Date } => !!x.start && !!x.end)
      // 해당 월과 겹치는 축제만
      .filter(x => x.end >= monthStart && x.start <= monthEnd)
      .sort((a, b) => a.start.getTime() - b.start.getTime())

    return items
  }, [spots, region, monthStart, monthEnd])

  const goPrev = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) } else setMonth(m => m - 1)
  }
  const goNext = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) } else setMonth(m => m + 1)
  }

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : locale === 'zh-CN' ? 'zh-CN' : locale === 'zh-TW' ? 'zh-TW' : 'en-US',
    { year: 'numeric', month: 'long' },
  )

  const STATUS_LABEL: Record<FestivalStatus, string> = {
    ongoing: t('festival.ongoing'),
    upcoming: t('festival.upcoming'),
    ended: t('festival.ended'),
  }

  // 진행 상태 배지 — 이미지 우상단 absolute 배치용 컬러 스타일 (도시별 탭 톤과 호환)
  const STATUS_STYLE: Record<FestivalStatus, string> = {
    ongoing: 'bg-mint-deep text-white',
    upcoming: 'bg-blossom-light text-blossom-deep',
    ended: 'bg-slate-200 text-slate-500',
  }

  // 이미지 fallback emoji — spot.id 해시로 안정적 분포 (3종 cycle)
  const FALLBACK_EMOJIS = ['🎆', '🎵', '🏮']
  const fallbackEmoji = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
    return FALLBACK_EMOJIS[Math.abs(h) % FALLBACK_EMOJIS.length]
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
          📅 {t('festival.title')}
        </h2>
      </div>

      {/* 월 네비게이션 */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button onClick={goPrev} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-black text-slate-800 min-w-[140px] text-center">
          {monthLabel}
        </span>
        <button onClick={goNext} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 도시 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => setRegion('')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            !region ? 'bg-mint-deep text-white border-mint-deep' : 'bg-white text-slate-500 border-slate-200 hover:border-mint-deep/40'
          }`}
        >
          {t('category.all')}
        </button>
        {PROVINCE_CITIES.map(c => {
          const isActive = region === c.code
          return (
            <button
              key={c.code}
              onClick={() => setRegion(c.code)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isActive ? 'bg-mint-deep text-white border-mint-deep' : 'bg-white text-slate-500 border-slate-200 hover:border-mint-deep/40'
              }`}
            >
              {c.emoji} {getCityName(c.code, locale)}
            </button>
          )
        })}
      </div>

      {/* 축제 그리드 — 정사각형 카드 (모바일 2-col / 데스크톱 3-col, 도시별 탭과 시각적 일관성) */}
      {festivals.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <div className="text-5xl mb-2">📭</div>
          <p className="text-sm font-bold text-slate-500">{t('festival.noFestival')}</p>
          <p className="text-xs text-slate-500">{t('festival.tourApiHint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {festivals.map(({ spot, start, end }) => {
            const status = getStatus(start, end, now)
            const startLabel = start.toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale, { month: 'short', day: 'numeric' })
            const endLabel = end.toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale, { month: 'short', day: 'numeric' })
            const dateRange = startLabel === endLabel ? startLabel : `${startLabel} ~ ${endLabel}`
            const festivalName = getI18n(spot.name, locale)
            const hasImage = !!spot.image && !spot.image.includes('placeholder') && spot.image !== ''

            return (
              <button
                key={spot.id}
                type="button"
                onClick={onSpotClick ? () => onSpotClick(spot) : undefined}
                disabled={!onSpotClick}
                className="group block relative overflow-hidden rounded-2xl bg-white border border-mist shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1 text-left disabled:cursor-default w-full"
                aria-label={onSpotClick ? `${festivalName} ${t('detail.openDetail')}` : undefined}
              >
                {/* 상단: 정사각형 이미지 */}
                <div className="relative aspect-square bg-gradient-to-br from-mint-light to-blossom-light">
                  {hasImage ? (
                    <Image
                      src={spot.image}
                      alt={festivalName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={spot.source === 'tourapi'}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl" aria-hidden>
                      {fallbackEmoji(spot.id)}
                    </div>
                  )}

                  {/* 진행 상태 배지 — 우상단 absolute */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm ${STATUS_STYLE[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                </div>

                {/* 하단: 정보 영역 */}
                <div className="p-3 md:p-3.5 space-y-1.5">
                  <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug line-clamp-2">
                    {festivalName}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] md:text-xs text-stone font-bold">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden />
                    <span className="truncate">{getCityName(spot.region, locale)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] md:text-xs text-stone font-bold">
                    <Calendar className="w-3 h-3 shrink-0" aria-hidden />
                    <span className="truncate">{dateRange}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
