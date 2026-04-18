'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { RefreshCw, Trophy, Sparkles } from 'lucide-react'
import { SpotCard } from './SpotCard'
import { scoreSpots } from '@/lib/curation/scoring'
import type { NormalizedSpot } from '@/lib/tour-api/types'
import type { CityScore, UserPreference } from '@/lib/curation/types'
import { courses } from '@/lib/data/courses'

interface Props {
  cityScores: CityScore[]
  spots: NormalizedSpot[]
  preference: UserPreference
  locale: string
  onRetry: () => void
}

const CITY_NAMES: Record<string, Record<string, string>> = {
  jeonju:    { ko: '전주', en: 'Jeonju', ja: '全州', 'zh-CN': '全州', 'zh-TW': '全州' },
  gyeongju:  { ko: '경주', en: 'Gyeongju', ja: '慶州', 'zh-CN': '庆州', 'zh-TW': '慶州' },
  busan:     { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' },
  seoul:     { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' },
  jeju:      { ko: '제주', en: 'Jeju', ja: '済州', 'zh-CN': '济州', 'zh-TW': '濟州' },
  tongyeong: { ko: '통영', en: 'Tongyeong', ja: '統営', 'zh-CN': '统营', 'zh-TW': '統營' },
  cheonan:   { ko: '천안', en: 'Cheonan', ja: '天安', 'zh-CN': '天安', 'zh-TW': '天安' },
  yongin:    { ko: '용인', en: 'Yongin', ja: '龍仁', 'zh-CN': '龙仁', 'zh-TW': '龍仁' },
  icheon:    { ko: '이천', en: 'Icheon', ja: '利川', 'zh-CN': '利川', 'zh-TW': '利川' },
}

function cityName(code: string, locale: string): string {
  return CITY_NAMES[code]?.[locale] || CITY_NAMES[code]?.ko || code
}

function cityThumbnail(code: string): string {
  const c = courses.find(x => x.region === code)
  return c?.thumbnail || '/images/placeholder-city.jpg'
}

function cityCourseId(code: string): string | null {
  const c = courses.find(x => x.region === code)
  return c?.id ?? null
}

export function CurationResult({ cityScores, spots, preference, locale, onRetry }: Props) {
  const t = useTranslations('spots')

  const top3 = cityScores.slice(0, 3)
  const top1 = top3[0]
  const other = top3.slice(1)

  // 선택된 도시 (기본: 1위)
  const [selectedCity, setSelectedCity] = useState<string>(top1?.city ?? '')

  // 선택된 도시 스팟만 필터 → 점수순
  const citySpots = useMemo(
    () => scoreSpots(spots.filter(s => s.region === selectedCity), preference),
    [spots, selectedCity, preference],
  )

  const recommendedSpots = citySpots.filter(s => s.category !== 'festival').slice(0, 8)
  const festivals = citySpots.filter(s => s.category === 'festival').slice(0, 4)

  const medal = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* 헤더 */}
      <div className="text-center">
        <div className="text-4xl mb-3">✨</div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          {t('result.title')}
        </h1>
      </div>

      {/* TOP 3 도시 */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-black text-slate-700 mb-5">
          <Trophy className="w-5 h-5 text-amber-500" />
          {t('result.cityTop')}
        </h2>

        {top1 && (
          <div
            className={`bg-gradient-to-br from-mint-deep/10 to-sky/10 rounded-3xl overflow-hidden border-2 shadow-lg transition-all ${
              selectedCity === top1.city ? 'border-mint-deep shadow-mint/40' : 'border-mint-deep/20'
            }`}
          >
            <button
              onClick={() => setSelectedCity(top1.city)}
              className="block w-full text-left cursor-pointer"
            >
              <div className="relative aspect-[5/3] overflow-hidden">
                <Image
                  src={cityThumbnail(top1.city)}
                  alt={cityName(top1.city, locale)}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-ink font-black text-xs shadow-lg">
                    {medal[0]} {top1.matchPercent}% {t('result.match', { n: top1.matchPercent })}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-lg">
                    {cityName(top1.city, locale)}
                  </p>
                </div>
              </div>
            </button>
            <div className="p-5 flex items-center justify-between">
              <p className="text-sm text-slate-500 font-bold">
                {t('result.cityTopDesc')}
              </p>
              <Link
                href={cityCourseId(top1.city) ? `/${locale}/courses/${cityCourseId(top1.city)}` : `/${locale}/story`}
                className="inline-flex items-center gap-1 bg-mint-deep text-white px-4 py-2 rounded-full text-xs font-black hover:opacity-90 transition-opacity shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" /> {t('result.missionCta')}
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {other.map((c, i) => (
            <button
              key={c.city}
              onClick={() => setSelectedCity(c.city)}
              className={`block bg-white rounded-2xl overflow-hidden border-2 shadow-sm hover:shadow-md transition-all text-left ${
                selectedCity === c.city ? 'border-mint-deep shadow-mint/30' : 'border-slate-100'
              }`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={cityThumbnail(c.city)}
                  alt={cityName(c.city, locale)}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-ink font-black text-[10px] shadow-sm">
                    {medal[i + 1]} {c.matchPercent}%
                  </span>
                </div>
                <p className="absolute bottom-2 left-3 text-white font-black text-lg drop-shadow">
                  {cityName(c.city, locale)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 선택 도시 안내 */}
      {selectedCity && (
        <div className="bg-mint-deep/5 border border-mint-deep/20 rounded-2xl px-5 py-3 text-sm text-slate-600 font-bold">
          📍 <span className="text-mint-deep">{cityName(selectedCity, locale)}</span>{t('result.citySpotsHint')}
        </div>
      )}

      {/* 추천 스팟 (선택 도시만) */}
      {recommendedSpots.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-slate-700 mb-5">📍 {t('result.recommended')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedSpots.map((s, i) => (
              <SpotCard
                key={s.id}
                spot={s}
                locale={locale}
                matchPercent={
                  i < 4 && s.matchScore > 0 ? Math.min(99, 60 + Math.round(s.matchScore * 8)) : undefined
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* 축제 (선택 도시만) */}
      {festivals.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-slate-700 mb-5">🎊 {t('result.festivals')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {festivals.map(f => (
              <SpotCard key={f.id} spot={f} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* 선택 도시에 스팟이 없을 때 */}
      {recommendedSpots.length === 0 && festivals.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-400 font-bold">
          {t('result.noCitySpots')}
        </div>
      )}

      {/* 다시 테스트 */}
      <div className="text-center pt-4">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-mint-deep text-mint-deep font-black text-sm hover:bg-mint-deep hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> {t('result.retry')}
        </button>
      </div>
    </div>
  )
}
