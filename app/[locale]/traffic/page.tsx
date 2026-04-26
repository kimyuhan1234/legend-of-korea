'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { TRANSPORT_ROUTES } from '@/lib/data/transport-routes'
import { getTransferInfo } from '@/lib/data/transport-transfers'
import { getDepartureRoutes } from '@/lib/data/departure-routes'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

type I18n5 = { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }

// ── 출발지 5개 ──
const DEPARTURES: { code: string; name: I18n5; icon: string }[] = [
  { code: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル', 'zh-CN': '首尔', 'zh-TW': '首爾' }, icon: '🏙️' },
  { code: 'incheon-airport', name: { ko: '인천국제공항', en: "Incheon Int'l Airport", ja: '仁川国際空港', 'zh-CN': '仁川国际机场', 'zh-TW': '仁川國際機場' }, icon: '✈️' },
  { code: 'gimpo-airport', name: { ko: '김포국제공항', en: "Gimpo Int'l Airport", ja: '金浦国際空港', 'zh-CN': '金浦国际机场', 'zh-TW': '金浦國際機場' }, icon: '✈️' },
  { code: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山', 'zh-CN': '釜山', 'zh-TW': '釜山' }, icon: '🌊' },
  { code: 'gimhae-airport', name: { ko: '김해국제공항', en: "Gimhae Int'l Airport", ja: '金海国際空港', 'zh-CN': '金海国际机场', 'zh-TW': '金海國際機場' }, icon: '✈️' },
]

// ── 도착지 (17개 광역시도 + 주요 도시) ──
const CITIES: { code: string; name: I18n5 }[] = [
  // 기존 9개 (레거시 + 광역시)
  { code: 'seoul',     name: { ko: '서울',   en: 'Seoul',     ja: 'ソウル', 'zh-CN': '首尔',     'zh-TW': '首爾' } },
  { code: 'busan',     name: { ko: '부산',   en: 'Busan',     ja: '釜山',   'zh-CN': '釜山',     'zh-TW': '釜山' } },
  { code: 'jeju',      name: { ko: '제주',   en: 'Jeju',      ja: '済州',   'zh-CN': '济州',     'zh-TW': '濟州' } },
  { code: 'jeonju',    name: { ko: '전주',   en: 'Jeonju',    ja: '全州',   'zh-CN': '全州',     'zh-TW': '全州' } },
  { code: 'gyeongju',  name: { ko: '경주',   en: 'Gyeongju',  ja: '慶州',   'zh-CN': '庆州',     'zh-TW': '慶州' } },
  { code: 'tongyeong', name: { ko: '통영',   en: 'Tongyeong', ja: '統営',   'zh-CN': '统营',     'zh-TW': '統營' } },
  { code: 'cheonan',   name: { ko: '천안',   en: 'Cheonan',   ja: '天安',   'zh-CN': '天安',     'zh-TW': '天安' } },
  { code: 'yongin',    name: { ko: '용인',   en: 'Yongin',    ja: '龍仁',   'zh-CN': '龙仁',     'zh-TW': '龍仁' } },
  { code: 'icheon',    name: { ko: '이천',   en: 'Icheon',    ja: '利川',   'zh-CN': '利川',     'zh-TW': '利川' } },
  // 신규 광역시 (7개)
  { code: 'incheon',   name: { ko: '인천',   en: 'Incheon',   ja: '仁川',   'zh-CN': '仁川',     'zh-TW': '仁川' } },
  { code: 'daejeon',   name: { ko: '대전',   en: 'Daejeon',   ja: '大田',   'zh-CN': '大田',     'zh-TW': '大田' } },
  { code: 'daegu',     name: { ko: '대구',   en: 'Daegu',     ja: '大邱',   'zh-CN': '大邱',     'zh-TW': '大邱' } },
  { code: 'gwangju',   name: { ko: '광주',   en: 'Gwangju',   ja: '光州',   'zh-CN': '光州',     'zh-TW': '光州' } },
  { code: 'ulsan',     name: { ko: '울산',   en: 'Ulsan',     ja: '蔚山',   'zh-CN': '蔚山',     'zh-TW': '蔚山' } },
  { code: 'sejong',    name: { ko: '세종',   en: 'Sejong',    ja: '世宗',   'zh-CN': '世宗',     'zh-TW': '世宗' } },
  // 신규 주요 도시 (6개)
  { code: 'suwon',     name: { ko: '수원',   en: 'Suwon',     ja: '水原',   'zh-CN': '水原',     'zh-TW': '水原' } },
  { code: 'gangneung', name: { ko: '강릉',   en: 'Gangneung', ja: '江陵',   'zh-CN': '江陵',     'zh-TW': '江陵' } },
  { code: 'chuncheon', name: { ko: '춘천',   en: 'Chuncheon', ja: '春川',   'zh-CN': '春川',     'zh-TW': '春川' } },
  { code: 'yeosu',     name: { ko: '여수',   en: 'Yeosu',     ja: '麗水',   'zh-CN': '丽水',     'zh-TW': '麗水' } },
  { code: 'andong',    name: { ko: '안동',   en: 'Andong',    ja: '安東',   'zh-CN': '安东',     'zh-TW': '安東' } },
  { code: 'sokcho',    name: { ko: '속초',   en: 'Sokcho',    ja: '束草',   'zh-CN': '束草',     'zh-TW': '束草' } },
]

// ── 출발지별 도착지 필터 + 추천 ──
const ROUTES: Record<string, string[]> = {
  'seoul': [
    'jeonju', 'busan', 'jeju', 'gyeongju', 'tongyeong', 'cheonan', 'yongin', 'icheon',
    'incheon', 'daejeon', 'daegu', 'gwangju', 'ulsan', 'sejong',
    'suwon', 'gangneung', 'chuncheon', 'yeosu', 'andong', 'sokcho',
  ],
  'incheon-airport': ['seoul', 'cheonan', 'yongin', 'icheon', 'jeonju', 'busan', 'jeju', 'daejeon', 'daegu', 'gwangju'],
  'gimpo-airport': ['seoul', 'cheonan', 'yongin', 'icheon', 'jeonju', 'jeju', 'gwangju', 'ulsan', 'yeosu'],
  'busan': ['gyeongju', 'tongyeong', 'seoul', 'jeonju', 'daegu', 'ulsan'],
  'gimhae-airport': ['busan', 'gyeongju', 'tongyeong', 'daegu', 'ulsan'],
}

const RECOMMENDED: Record<string, string[]> = {
  'gimhae-airport': ['busan', 'gyeongju', 'tongyeong'],
  'incheon-airport': ['seoul', 'jeju'],
  'gimpo-airport': ['seoul', 'jeju'],
}

const TYPE_ICON: Record<string, string> = { ktx: '🚄', bus: '🚌', flight: '✈️', arex: '🚈', limousine: '🚐' }
const TYPE_LABEL: Record<string, { ko: string; en: string; ja: string }> = {
  ktx: { ko: 'KTX', en: 'KTX', ja: 'KTX' },
  bus: { ko: '고속버스', en: 'Express Bus', ja: '高速バス' },
  flight: { ko: '항공', en: 'Flight', ja: '航空' },
}

function getL(field: Record<string, string> | null | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

function minLabel(locale: string): string {
  return locale === 'ko' ? '분' : locale === 'ja' ? '分' : 'min'
}

function parseDurationMinutes(dur: string): number {
  const match = dur.match(/([\d.]+)/)
  return match ? Math.round(parseFloat(match[1]) * 60) : 120
}

function calculateArrival(departTime: string, durationMinutes: number): string {
  const [h, m] = departTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''
  const total = h * 60 + m + durationMinutes
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

type Direction = 'going' | 'returning'

export default function TrafficPage() {
  const t = useTranslations('traffic')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [departure, setDeparture] = useState('seoul')
  const [selectedCity, setSelectedCity] = useState('jeonju')
  const [direction, setDirection] = useState<Direction>('going')
  const [cardDates, setCardDates] = useState<Record<string, string>>({})
  const [cardTimes, setCardTimes] = useState<Record<string, string>>({})

  const isGoing = direction === 'going'

  // 실제 출발/도착 (방향 고려)
  const effectiveDep = isGoing ? departure : selectedCity
  const effectiveDest = isGoing ? selectedCity : departure

  const depName = DEPARTURES.find((d) => d.code === effectiveDep)?.name
    ?? CITIES.find((c) => c.code === effectiveDep)?.name
    ?? { ko: effectiveDep, en: effectiveDep, ja: effectiveDep }
  const destName = DEPARTURES.find((d) => d.code === effectiveDest)?.name
    ?? CITIES.find((c) => c.code === effectiveDest)?.name
    ?? { ko: effectiveDest, en: effectiveDest, ja: effectiveDest }

  // 도착지 목록 (출발지에 따라 필터)
  const availableCities = useMemo(() => {
    const available = ROUTES[departure] ?? CITIES.map((c) => c.code)
    return CITIES.filter((c) => available.includes(c.code))
  }, [departure])

  const isRecommended = (cityCode: string) =>
    (RECOMMENDED[departure] ?? []).includes(cityCode)

  // 서울 출발 → transport-routes.ts, 그 외 → departure-routes.ts
  // 데이터는 방향과 무관하게 (departure, selectedCity) 쌍으로 조회하고,
  // 렌더링 단계에서 isGoing 에 따라 from/to 레이블을 스왑한다.
  const seoulRoute = departure === 'seoul' ? TRANSPORT_ROUTES.find((r) => r.cityId === selectedCity) : null
  const depRoute = departure !== 'seoul' ? getDepartureRoutes(departure, selectedCity) : null

  const getDate = (key: string) => cardDates[key] ?? ''
  const getTime = (key: string) => cardTimes[key] ?? ''

  return (
    <div className="min-h-screen bg-snow">
      {/* 히어로 — P1-5: 강함 → Tier 2 (정보 페이지) */}
      <section className="bg-tier-soft py-16 md:py-20 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/50 text-ink text-xs font-black uppercase tracking-widest mb-4">
          TRAFFIC
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-ink mb-3">{t('title')}</h1>
        <p className="text-slate text-base">{t('subtitle')}</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        {/* 가는편/오는편 */}
        <div className="flex gap-2 justify-center mb-6">
          {(['going', 'returning'] as Direction[]).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => setDirection(dir)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                direction === dir
                  ? 'bg-gradient-to-r from-mint to-blossom text-ink'
                  : 'bg-white text-slate border border-mist hover:bg-cloud'
              }`}
            >
              {t(dir)}
            </button>
          ))}
        </div>

        {/* 출발지 / 도착지 */}
        <div className="flex items-end gap-3 mb-8 flex-wrap justify-center">
          <div>
            <label className="text-xs font-bold text-stone block mb-1">{t('from')}</label>
            {isGoing ? (
              <select
                value={departure}
                onChange={(e) => { setDeparture(e.target.value); setSelectedCity('') }}
                className="px-4 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
              >
                {DEPARTURES.map((d) => (
                  <option key={d.code} value={d.code}>{d.icon} {getL(d.name, locale)}</option>
                ))}
              </select>
            ) : (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
              >
                {availableCities.map((c) => (
                  <option key={c.code} value={c.code}>{getL(c.name, locale)}</option>
                ))}
              </select>
            )}
          </div>

          <span className="text-2xl text-mint-deep font-bold pb-1">→</span>

          <div>
            <label className="text-xs font-bold text-stone block mb-1">{t('to')}</label>
            {isGoing ? (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
              >
                <option value="">{t('selectCity')}</option>
                {availableCities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {getL(c.name, locale)}{isRecommended(c.code) ? ' ⭐' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
              >
                {DEPARTURES.map((d) => (
                  <option key={d.code} value={d.code}>{d.icon} {getL(d.name, locale)}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* 경로 요약 */}
        {selectedCity && (
          <p className="text-center text-sm text-slate mb-6">
            {getL(depName, locale)} → {getL(destName, locale)}
          </p>
        )}

        {(seoulRoute || depRoute) && selectedCity ? (
          <div className="space-y-6">
            {/* 서울 출발: 기존 transport-routes 카드 */}
            {seoulRoute && seoulRoute.options.map((opt) => {
              const cardKey = `${direction}-${opt.type}`
              const date = getDate(cardKey)
              const time = getTime(cardKey)
              const durMin = parseDurationMinutes(opt.duration)
              const arrival = time ? calculateArrival(time, durMin) : ''
              const transfer = getTransferInfo(departure, selectedCity, opt.type)
              const fromStation = isGoing ? getL(depName, locale) : getL(opt.station, locale)
              const toStation = isGoing ? getL(opt.station, locale) : getL(destName, locale)

              return (
                <div
                  key={cardKey}
                  className={`bg-white rounded-2xl border p-6 transition-all ${
                    opt.available ? 'border-mist hover:border-mint hover:shadow-md' : 'border-mist opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-2xl">{TYPE_ICON[opt.type]}</span>
                    <h3 className="font-bold text-ink text-lg">{getL(TYPE_LABEL[opt.type], locale)}</h3>
                    {!opt.available && (
                      <span className="text-xs bg-mist text-stone rounded-full px-2.5 py-0.5 font-bold">{t('unavailable')}</span>
                    )}
                    {opt.available && !transfer && (
                      <span className="text-xs bg-mint-light text-mint-deep rounded-full px-2.5 py-0.5 font-bold">{t('direct')}</span>
                    )}
                    {opt.available && transfer && transfer.transfers.length > 0 && (
                      <span className="text-xs bg-peach text-ink rounded-full px-2.5 py-0.5 font-bold">
                        {t('transfer', { count: transfer.transfers.length })}
                      </span>
                    )}
                  </div>

                  {opt.available && (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_220px] gap-5">
                      <div>
                        <div className="space-y-2.5 mb-5">
                          <p className="text-base text-ink font-medium">{fromStation} → {toStation}</p>
                          <p className="text-base text-slate">
                            {t('duration')}: <span className="font-bold text-ink">{t('approx')} {opt.duration}</span>
                          </p>
                          {opt.fixedPrice && (
                            <p className="text-ink font-bold text-lg">{t('fare')}: {opt.fixedPrice}</p>
                          )}
                        </div>

                        {transfer && transfer.transfers.length > 0 && (
                          <div className="p-3 bg-peach/20 rounded-xl mb-4">
                            <p className="text-xs font-bold text-ink mb-2">{t('transferInfo')}</p>
                            {transfer.transfers.map((step) => (
                              <div key={step.step} className="text-xs text-slate ml-2 mb-1">
                                <p>• {getL(step.from, locale)} → {getL(step.to, locale)} ({getL(step.method, locale)}, {t('approx')} {step.duration})</p>
                                {step.note && <p className="text-stone ml-3">{getL(step.note, locale)}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        <a
                          href={opt.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-4 py-2 text-sm hover:opacity-90 transition"
                        >
                          {t('book')}
                        </a>
                      </div>

                      {/* 가운데: 경로 시각화 (데스크톱만) */}
                      <div className="hidden md:flex flex-col items-center justify-between py-4">
                        <div className="text-center">
                          <div className="w-4 h-4 bg-mint-deep rounded-full mx-auto mb-1.5" />
                          <span className="text-sm font-bold text-ink leading-tight block max-w-[160px]">{fromStation}</span>
                        </div>
                        <div className="relative flex-1 w-px my-3 min-h-[120px]">
                          <div className="absolute inset-0 border-l-[3px] border-dashed border-mint/40 left-1/2" />
                          <div className={`absolute left-1/2 -translate-x-1/2 ${opt.type === 'flight' ? 'animate-travel-flight' : 'animate-travel'}`}>
                            <span className="text-4xl drop-shadow-sm">{TYPE_ICON[opt.type]}</span>
                          </div>
                          {transfer && transfer.transfers.length > 0 && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                              <span className="text-xs bg-peach text-ink rounded-full px-2 py-0.5 font-bold whitespace-nowrap">
                                🔄 {transfer.transfers.length}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="w-4 h-4 bg-blossom-deep rounded-full mx-auto mb-1.5" />
                          <span className="text-sm font-bold text-ink leading-tight block max-w-[160px]">{toStation}</span>
                        </div>
                        <div className="mt-3">
                          <span className="text-sm text-mint-deep font-bold bg-mint-light/50 rounded-full px-4 py-1.5">
                            {t('approx')} {opt.duration}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 p-4 bg-snow rounded-xl border border-mist">
                        <div>
                          <label className="text-xs text-stone mb-1 block">{t('departDate')}</label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setCardDates((p) => ({ ...p, [cardKey]: e.target.value }))}
                            className="w-full bg-white border border-mist rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-mint-light focus:border-mint-deep"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-stone mb-1 block">{t('departTime')}</label>
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setCardTimes((p) => ({ ...p, [cardKey]: e.target.value }))}
                            className="w-full bg-white border border-mist rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-mint-light focus:border-mint-deep"
                          />
                        </div>
                        {arrival && (
                          <p className="text-xs text-mint-deep font-bold">
                            🕐 {t('arrivalEstimate', { time: arrival })}
                          </p>
                        )}
                        <AddToPlannerButton
                          itemType="transport"
                          itemData={{
                            direction,
                            type: opt.type,
                            name: {
                              ko: `${isGoing ? '가는편' : '오는편'} ${getL(TYPE_LABEL[opt.type], 'ko')}`,
                              en: `${isGoing ? 'Outbound' : 'Return'} ${getL(TYPE_LABEL[opt.type], 'en')}`,
                              ja: `${isGoing ? '往路' : '復路'} ${getL(TYPE_LABEL[opt.type], 'ja')}`,
                            },
                            from: depName,
                            to: destName,
                            date: date || null,
                            departureTime: time || null,
                            arrivalTime: arrival || null,
                            duration: opt.duration,
                            price: opt.fixedPrice ?? '',
                          }}
                          cityId={selectedCity || departure}
                          size="md"
                          className="w-full justify-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 비서울 출발: departure-routes 카드 */}
            {depRoute && depRoute.options.map((dopt) => {
              const cardKey = `${direction}-dep-${dopt.type}-${dopt.name.en}`
              const date = getDate(cardKey)
              const time = getTime(cardKey)
              const durMin = dopt.durationMinutes
              const arrival = time ? calculateArrival(time, durMin) : ''
              const fromStation = isGoing ? getL(dopt.from, locale) : getL(dopt.to, locale)
              const toStation = isGoing ? getL(dopt.to, locale) : getL(dopt.from, locale)

              return (
                <div key={cardKey} className={`bg-white rounded-2xl border p-6 transition-all ${dopt.available ? 'border-mist hover:border-mint hover:shadow-md' : 'border-mist opacity-60'}`}>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-2xl">{TYPE_ICON[dopt.type] ?? '🚌'}</span>
                    <h3 className="font-bold text-ink text-lg">{getL(dopt.name, locale)}</h3>
                    {!dopt.available && <span className="text-xs bg-mist text-stone rounded-full px-2.5 py-0.5 font-bold">{t('unavailable')}</span>}
                  </div>
                  {dopt.available && (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_220px] gap-5">
                      <div>
                        <div className="space-y-2.5 mb-5">
                          <p className="text-base text-ink font-medium">{fromStation} → {toStation}</p>
                          <p className="text-base text-slate">{t('duration')}: <span className="font-bold text-ink">{t('approx')} {dopt.duration}</span></p>
                          {dopt.fixedPrice && <p className="text-ink font-bold text-lg">{t('fare')}: {dopt.fixedPrice}</p>}
                          {dopt.note && <p className="text-xs text-stone mt-1">💡 {getL(dopt.note, locale)}</p>}
                        </div>
                        {dopt.bookingUrl && (
                          <a href={dopt.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-4 py-2 text-sm hover:opacity-90 transition">{t('book')}</a>
                        )}
                      </div>
                      <div className="hidden md:flex flex-col items-center justify-between py-4">
                        <div className="text-center"><div className="w-4 h-4 bg-mint-deep rounded-full mx-auto mb-1.5" /><span className="text-sm font-bold text-ink leading-tight block max-w-[160px]">{fromStation}</span></div>
                        <div className="relative flex-1 w-px my-3 min-h-[120px]">
                          <div className="absolute inset-0 border-l-[3px] border-dashed border-mint/40 left-1/2" />
                          <div className={`absolute left-1/2 -translate-x-1/2 ${dopt.type === 'flight' ? 'animate-travel-flight' : 'animate-travel'}`}><span className="text-4xl drop-shadow-sm">{TYPE_ICON[dopt.type] ?? '🚌'}</span></div>
                        </div>
                        <div className="text-center"><div className="w-4 h-4 bg-blossom-deep rounded-full mx-auto mb-1.5" /><span className="text-sm font-bold text-ink leading-tight block max-w-[160px]">{toStation}</span></div>
                        <div className="mt-3"><span className="text-sm text-mint-deep font-bold bg-mint-light/50 rounded-full px-4 py-1.5">{t('approx')} {dopt.duration}</span></div>
                      </div>
                      <div className="space-y-3 p-4 bg-snow rounded-xl border border-mist">
                        <div><label className="text-xs text-stone mb-1 block">{t('departDate')}</label><input type="date" value={date} onChange={(e) => setCardDates((p) => ({ ...p, [cardKey]: e.target.value }))} className="w-full bg-white border border-mist rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-mint-light focus:border-mint-deep" /></div>
                        <div><label className="text-xs text-stone mb-1 block">{t('departTime')}</label><input type="time" value={time} onChange={(e) => setCardTimes((p) => ({ ...p, [cardKey]: e.target.value }))} className="w-full bg-white border border-mist rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-mint-light focus:border-mint-deep" /></div>
                        {arrival && <p className="text-xs text-mint-deep font-bold">🕐 {t('arrivalEstimate', { time: arrival })}</p>}
                        <AddToPlannerButton itemType="transport" itemData={{ direction, type: dopt.type, name: dopt.name, from: isGoing ? dopt.from : dopt.to, to: isGoing ? dopt.to : dopt.from, date: date || null, departureTime: time || null, arrivalTime: arrival || null, duration: dopt.duration, price: dopt.fixedPrice ?? '' }} cityId={selectedCity || departure} size="md" className="w-full justify-center" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 라스트마일 — 서울 출발 가는편만 */}
            {isGoing && seoulRoute?.lastMile && (
              <div className="bg-mint-light/30 rounded-2xl border border-mint-light p-5">
                <h3 className="font-bold text-ink mb-3">🚕 {t('lastMile')}</h3>
                <div className="space-y-2 text-sm text-slate">
                  <p>🚕 {t('approx')} {t('taxi')} {seoulRoute.lastMile.taxi.minutes}{minLabel(locale)}</p>
                  {seoulRoute.lastMile.bus && (
                    <p>🚌 {t('approx')} {t('bus')} {seoulRoute.lastMile.bus.minutes}{minLabel(locale)} ({getL(seoulRoute.lastMile.bus.route, locale)}, {getL(seoulRoute.lastMile.bus.stop, locale)})</p>
                  )}
                  {seoulRoute.lastMile.walk && (
                    <p>🚶 {t('approx')} {t('walk')} {seoulRoute.lastMile.walk.minutes}{minLabel(locale)}</p>
                  )}
                </div>
                <p className="text-xs text-stone mt-3">⚠ {t('taxiNote')}</p>
              </div>
            )}

            <p className="text-xs text-stone text-center">⚠ {t('disclaimer')}</p>
          </div>
        ) : (
          <div className="text-center py-16 text-stone">
            <p className="text-3xl mb-3">🚄</p>
            <p className="text-sm">{selectedCity ? t('selectRoute') : t('selectCity')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
