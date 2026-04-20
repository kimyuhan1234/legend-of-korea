'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { RefreshCw, Sparkles, ChevronDown, ChevronUp, Quote, BarChart3 } from 'lucide-react'
import { SpotCard } from './SpotCard'
import { RadarChart } from './RadarChart'
import { PassBlurOverlay } from '@/components/shared/PassBlurOverlay'
import { usePassStatus } from '@/hooks/usePassStatus'
import { scoreSpots } from '@/lib/curation/scoring'
import { CITY_STORIES, generateReasons, getTopMatchedTags, getTagLabel } from '@/lib/curation/city-stories'
import { preferenceToRadar, cityToRadar, type RadarLabels } from '@/lib/curation/radar'
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

/**
 * 도시 대표 이미지 우선순위:
 * 1) 해당 도시의 TourAPI 스팟 중 유효 firstimage 있는 것
 * 2) 정적 데이터 스팟(SIGHTS) 이미지 (placeholder 아닌 것)
 * 3) courses 썸네일
 */
function getCityHeroImage(city: string, spots: NormalizedSpot[]): string {
  // 1순위: TourAPI firstimage (source === 'tourapi')
  const fromTour = spots.find(
    s => s.region === city
      && s.source === 'tourapi'
      && s.image
      && !s.image.includes('placeholder'),
  )
  if (fromTour) return fromTour.image

  // 2순위: 아무 스팟이든 이미지 있고 로컬 옛날 사진(sights/courses)이 아닌 것
  const anySpot = spots.find(
    s => s.region === city
      && s.image
      && !s.image.includes('placeholder')
      && !s.image.includes('/images/sights/')
      && !s.image.includes('/images/courses/'),
  )
  if (anySpot) return anySpot.image

  // 최후 fallback: courses 썸네일 (옛날 사진이지만 이미지가 있는 것이 없음보다 나음)
  return cityThumbnail(city)
}

function cityCourseId(code: string): string | null {
  const c = courses.find(x => x.region === code)
  return c?.id ?? null
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

/**
 * 도시 스토리 상세 카드 — TOP 1 + 펼친 TOP 2 모두 사용
 */
function CityDetailCard({
  city,
  matchPercent,
  spots,
  preference,
  locale,
  radarLabels,
}: {
  city: string
  matchPercent: number
  spots: NormalizedSpot[]
  preference: UserPreference
  locale: string
  radarLabels: RadarLabels
}) {
  const t = useTranslations('spots')

  const story = CITY_STORIES.find(s => s.region === city)
  const topTags = getTopMatchedTags(city, preference)
  const reasons = generateReasons(city, topTags, locale)

  const userRadar = useMemo(() => preferenceToRadar(preference, radarLabels), [preference, radarLabels])
  const cityRadar = useMemo(() => cityToRadar(city, radarLabels), [city, radarLabels])

  const citySpots = useMemo(
    () => scoreSpots(spots.filter(s => s.region === city), preference),
    [spots, city, preference],
  )
  const festivals = citySpots.filter(s => s.category === 'festival').slice(0, 2)
  const landmarks = citySpots.filter(s => s.category === 'landmark').slice(0, 3)
  const hotspots = citySpots.filter(s => s.category === 'hotspot').slice(0, 2)

  const courseId = cityCourseId(city)
  const vibe = story ? getI18n(story.vibe, locale) : ''
  const name = cityName(city, locale)

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl">
      {/* 헤더 이미지 + 도시명 + 매치% */}
      <div className="relative aspect-[16/9]">
        <Image
          src={getCityHeroImage(city, spots)}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-ink font-black text-xs shadow-lg">
            ⭐ {matchPercent}% {t('result.match', { n: matchPercent })}
          </span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{story?.emoji || '📍'}</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow">
              {name}
            </h2>
          </div>
          {vibe && (
            <p className="text-sm md:text-base font-bold text-white/90 italic drop-shadow">
              &ldquo;{vibe}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="p-5 md:p-7 space-y-7">
        {/* 왜 추천? */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-black text-slate-700">
            <Quote className="w-4 h-4 text-mint-deep" />
            {t('result.whyRecommend', { city: name })}
          </h3>
          <div className="space-y-3">
            {reasons.map((r, i) => {
              const tag = topTags[i]
              return (
                <div
                  key={i}
                  className="flex gap-3 items-start bg-gradient-to-r from-mint-deep/5 to-sky/5 rounded-2xl p-4 border border-mint-deep/10"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-mint-deep/30 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-xs font-black text-mint-deep">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">{r}</p>
                    {tag && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-mint-deep bg-mint-deep/10 px-2 py-0.5 rounded">
                        #{getTagLabel(tag, locale)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 레이더 차트 — 나의 스타일 vs 도시 특성 */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-black text-slate-700 mb-3">
            <BarChart3 className="w-4 h-4 text-mint-deep" />
            {t('radar.matchChart')}
          </h3>
          <div className="flex justify-center bg-slate-50/60 rounded-2xl py-5 border border-slate-100">
            <RadarChart
              axes={userRadar}
              overlayAxes={cityRadar}
              size={280}
              showLabels
              legend={{
                primary: t('radar.myStyle'),
                overlay: t('radar.cityStyle', { city: cityName(city, locale) }),
              }}
            />
          </div>
        </div>

        {/* 🔥 핫플레이스 */}
        {hotspots.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-3">🔥 {t('category.hotspot')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotspots.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {/* 🏛️ 추천 명소 */}
        {landmarks.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-3">🏛️ {t('category.landmark')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {landmarks.map(s => <SpotCard key={s.id} spot={s} locale={locale} />)}
            </div>
          </div>
        )}

        {/* 🎊 축제 & 이벤트 */}
        {festivals.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-3">🎊 {t('category.festival')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {festivals.map(f => <SpotCard key={f.id} spot={f} locale={locale} />)}
            </div>
          </div>
        )}

        {/* 3개 모두 비었을 때만 안내 */}
        {festivals.length === 0 && landmarks.length === 0 && hotspots.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 font-bold">
            {t('result.noCitySpots')}
          </div>
        )}

        {/* 미션 도전 CTA */}
        <Link
          href={courseId ? `/${locale}/courses/${courseId}` : `/${locale}/story`}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-br from-mint-deep to-sky text-white font-black text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          {t('result.startMission', { city: name })}
        </Link>
      </div>
    </div>
  )
}

export function CurationResult({ cityScores, spots, preference, locale, onRetry }: Props) {
  const t = useTranslations('spots')

  const radarLabels: RadarLabels = {
    tradition: t('radar.tradition'),
    nature: t('radar.nature'),
    experience: t('radar.experience'),
    active: t('radar.active'),
    nightlife: t('radar.nightlife'),
  }

  const top1 = cityScores[0]
  const top2 = cityScores[1]

  const [showSecond, setShowSecond] = useState(false)
  const { hasPass } = usePassStatus()
  const unlocked = hasPass('move')

  if (!top1) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-400 font-bold">{t('result.noCitySpots')}</p>
        <button onClick={onRetry} className="mt-4 px-6 py-3 rounded-full bg-mint-deep text-white font-black text-sm">
          <RefreshCw className="inline w-4 h-4 mr-1.5" /> {t('result.retry')}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
      {/* 헤더 */}
      <div className="text-center">
        <div className="text-4xl mb-3">✨</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          {t('result.bestMatch')}
        </h1>
      </div>

      {/* TOP 1 — 풀 카드 */}
      <CityDetailCard
        city={top1.city}
        matchPercent={top1.matchPercent}
        spots={spots}
        preference={preference}
        locale={locale}
        radarLabels={radarLabels}
      />

      {/* TOP 2 — 아코디언 (move 패스 필요) */}
      {top2 && (
        <PassBlurOverlay requiredPass="move" blur={!unlocked}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
              💡 {t('result.alsoCheck')}
            </p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={() => setShowSecond(v => !v)}
            className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[5/2]">
              <Image
                src={getCityHeroImage(top2.city, spots)}
                alt={cityName(top2.city, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-ink font-black text-[10px] shadow-sm">
                  🥈 {top2.matchPercent}% {t('result.match', { n: top2.matchPercent })}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div className="text-white text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{CITY_STORIES.find(s => s.region === top2.city)?.emoji || '📍'}</span>
                    <span className="text-xl font-black tracking-tight drop-shadow">
                      {cityName(top2.city, locale)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white/80 italic line-clamp-1">
                    {getI18n(CITY_STORIES.find(s => s.region === top2.city)?.vibe, locale)}
                  </p>
                </div>
                <span className="p-1.5 rounded-full bg-white/90 text-slate-700">
                  {showSecond ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </div>
            </div>
          </button>

          {showSecond && (
            <CityDetailCard
              city={top2.city}
              matchPercent={top2.matchPercent}
              spots={spots}
              preference={preference}
              locale={locale}
              radarLabels={radarLabels}
            />
          )}
        </div>
        </PassBlurOverlay>
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
