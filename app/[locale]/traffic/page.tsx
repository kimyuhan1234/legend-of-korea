'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { TRANSPORT_ROUTES } from '@/lib/data/transport-routes'
import { getTransferInfo } from '@/lib/data/transport-transfers'
import { getDepartureRoutes, type DepartureOption } from '@/lib/data/departure-routes'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

// ── 출발지 5개 ──
const DEPARTURES = [
  { code: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル' }, icon: '🏙️' },
  { code: 'incheon-airport', name: { ko: '인천국제공항', en: "Incheon Int'l Airport", ja: '仁川国際空港' }, icon: '✈️' },
  { code: 'gimpo-airport', name: { ko: '김포국제공항', en: "Gimpo Int'l Airport", ja: '金浦国際空港' }, icon: '✈️' },
  { code: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山' }, icon: '🌊' },
  { code: 'gimhae-airport', name: { ko: '김해국제공항', en: "Gimhae Int'l Airport", ja: '金海国際空港' }, icon: '✈️' },
]

// ── 도착지 9개 도시 ──
const CITIES = [
  { code: 'jeonju', name: { ko: '전주', en: 'Jeonju', ja: '全州' } },
  { code: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル' } },
  { code: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山' } },
  { code: 'jeju', name: { ko: '제주', en: 'Jeju', ja: '済州' } },
  { code: 'gyeongju', name: { ko: '경주', en: 'Gyeongju', ja: '慶州' } },
  { code: 'tongyeong', name: { ko: '통영', en: 'Tongyeong', ja: '統営' } },
  { code: 'cheonan', name: { ko: '천안', en: 'Cheonan', ja: '天安' } },
  { code: 'yongin', name: { ko: '용인', en: 'Yongin', ja: '龍仁' } },
  { code: 'icheon', name: { ko: '이천', en: 'Icheon', ja: '利川' } },
]

// ── 출발지별 도착지 필터 + 추천 ──
const ROUTES: Record<string, string[]> = {
  'seoul': ['jeonju', 'busan', 'jeju', 'gyeongju', 'tongyeong', 'cheonan', 'yongin', 'icheon'],
  'incheon-airport': ['seoul', 'cheonan', 'yongin', 'icheon', 'jeonju', 'busan', 'jeju'],
  'gimpo-airport': ['seoul', 'cheonan', 'yongin', 'icheon', 'jeonju', 'jeju'],
  'busan': ['gyeongju', 'tongyeong', 'seoul', 'jeonju'],
  'gimhae-airport': ['busan', 'gyeongju', 'tongyeong'],
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

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
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
  const seoulRoute = departure === 'seoul' ? TRANSPORT_ROUTES.find((r) => r.cityId === selectedCity) : null
  const depRoute = departure !== 'seoul' ? getDepartureRoutes(effectiveDep, isGoing ? selectedCity : departure) : null

  const getDate = (key: string) => cardDates[key] ?? ''
  const getTime = (key: string) => cardTimes[key] ?? ''

  return (
    <div className="min-h-screen bg-snow">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-mint to-blossom py-16 md:py-20 px-6 md:px-10 text-center">
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
              const transfer = getTransferInfo(effectiveDep, isGoing ? selectedCity : departure, opt.type)
              const fromStation = getL(depName, locale)
              const toStation = isGoing ? getL(opt.station, locale) : getL(depName, locale)

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
              const fromStation = getL(dopt.from, locale)
              const toStation = getL(dopt.to, locale)

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
                        <AddToPlannerButton itemType="transport" itemData={{ direction, type: dopt.type, name: dopt.name, from: dopt.from, to: dopt.to, date: date || null, departureTime: time || null, arrivalTime: arrival || null, duration: dopt.duration, price: dopt.fixedPrice ?? '' }} cityId={selectedCity || departure} size="md" className="w-full justify-center" />
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
