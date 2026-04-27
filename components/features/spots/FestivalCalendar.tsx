'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react'
import { CITIES, getCityName } from '@/lib/curation/cities'
import type { NormalizedSpot } from '@/lib/tour-api/types'

interface Props {
  spots: NormalizedSpot[]
  locale: string
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

export function FestivalCalendar({ spots, locale }: Props) {
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
      .filter(s => !region || s.region === region)
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

  const STATUS_STYLE: Record<FestivalStatus, string> = {
    ongoing: 'bg-mint-deep text-white',
    upcoming: 'bg-sky-light text-sky',
    ended: 'bg-slate-200 text-slate-500',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
        {CITIES.map(c => {
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

      {/* 축제 목록 */}
      {festivals.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <div className="text-5xl mb-2">📭</div>
          <p className="text-sm font-bold text-slate-500">{t('festival.noFestival')}</p>
          <p className="text-xs text-slate-500">{t('festival.tourApiHint')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {festivals.map(({ spot, start, end }) => {
            const status = getStatus(start, end, now)
            const startLabel = start.toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale, { month: 'short', day: 'numeric' })
            const endLabel = end.toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale, { month: 'short', day: 'numeric' })
            const dateRange = startLabel === endLabel ? startLabel : `${startLabel} ~ ${endLabel}`

            const hasImage = spot.image && !spot.image.includes('placeholder') && spot.image !== ''

            return (
              <div key={spot.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-mint/25 to-blossom/25">
                  {hasImage ? (
                    <Image src={spot.image} alt="" fill sizes="80px" className="object-cover" unoptimized={spot.source === 'tourapi'} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎊</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-800 truncate">
                      🎊 {getI18n(spot.name, locale)}
                    </h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_STYLE[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {getCityName(spot.region, locale)}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {dateRange}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{getI18n(spot.description, locale)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
