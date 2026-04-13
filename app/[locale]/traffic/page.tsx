'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { TRANSPORT_ROUTES, type TransportOption } from '@/lib/data/transport-routes'
import { getTransferInfo, type TransferStep } from '@/lib/data/transport-transfers'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

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

const SEOUL = { ko: '서울', en: 'Seoul', ja: 'ソウル' }
const TYPE_ICON: Record<string, string> = { ktx: '🚄', bus: '🚌', flight: '✈️' }
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

// duration 문자열 → 분 변환 (예: "1.5~2h" → 105)
function parseDurationMinutes(dur: string): number {
  const match = dur.match(/([\d.]+)/)
  if (!match) return 120
  const hours = parseFloat(match[1])
  return Math.round(hours * 60)
}

function calculateArrival(departTime: string, durationMinutes: number): string {
  const [h, m] = departTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''
  const total = h * 60 + m + durationMinutes
  const arrH = Math.floor(total / 60) % 24
  const arrM = total % 60
  return `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`
}

type Direction = 'going' | 'returning'

export default function TrafficPage() {
  const t = useTranslations('traffic')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [selectedCity, setSelectedCity] = useState('jeonju')
  const [direction, setDirection] = useState<Direction>('going')

  // 각 교통 카드별 날짜/시간 상태
  const [cardDates, setCardDates] = useState<Record<string, string>>({})
  const [cardTimes, setCardTimes] = useState<Record<string, string>>({})

  const route = TRANSPORT_ROUTES.find((r) => r.cityId === selectedCity)
  const cityName = CITIES.find((c) => c.code === selectedCity)?.name ?? { ko: selectedCity, en: selectedCity, ja: selectedCity }
  const isGoing = direction === 'going'

  const getDate = (key: string) => cardDates[key] ?? ''
  const getTime = (key: string) => cardTimes[key] ?? ''
  const setDate = (key: string, val: string) => setCardDates((p) => ({ ...p, [key]: val }))
  const setTime = (key: string, val: string) => setCardTimes((p) => ({ ...p, [key]: val }))

  return (
    <div className="min-h-screen bg-snow">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] py-16 md:py-20 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/50 text-ink text-xs font-black uppercase tracking-widest mb-4">
          TRAFFIC
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-ink mb-3">{t('title')}</h1>
        <p className="text-[#4B5563] text-base">{t('subtitle')}</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        {/* 가는편 / 오는편 탭 */}
        <div className="flex gap-2 justify-center mb-6">
          {(['going', 'returning'] as Direction[]).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => setDirection(dir)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                direction === dir
                  ? 'bg-gradient-to-r from-[#B8E8E0] to-[#F5D0D0] text-ink'
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
              <div className="px-5 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm">
                {getL(SEOUL, locale)}
              </div>
            ) : (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-5 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
              >
                {CITIES.map((c) => (
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
                className="px-5 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
              >
                {CITIES.map((c) => (
                  <option key={c.code} value={c.code}>{getL(c.name, locale)}</option>
                ))}
              </select>
            ) : (
              <div className="px-5 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm">
                {getL(SEOUL, locale)}
              </div>
            )}
          </div>
        </div>

        {route ? (
          <div className="space-y-5">
            {/* 교통 카드 */}
            {route.options.map((opt) => {
              const cardKey = `${direction}-${opt.type}`
              const date = getDate(cardKey)
              const time = getTime(cardKey)
              const durMin = parseDurationMinutes(opt.duration)
              const arrival = time ? calculateArrival(time, durMin) : ''
              const transfer = getTransferInfo(selectedCity, opt.type)
              const stationFrom = isGoing ? getL(SEOUL, locale) : getL(opt.station, locale)
              const stationTo = isGoing ? getL(opt.station, locale) : getL(SEOUL, locale)

              return (
                <div
                  key={opt.type}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    opt.available ? 'border-mist hover:border-mint hover:shadow-md' : 'border-mist opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{TYPE_ICON[opt.type]}</span>
                    <h3 className="font-bold text-ink text-lg">{getL(TYPE_LABEL[opt.type], locale)}</h3>
                    {!opt.available && (
                      <span className="text-xs bg-mist text-stone rounded-full px-2.5 py-0.5 font-bold">{t('unavailable')}</span>
                    )}
                    {opt.available && !transfer && (
                      <span className="text-xs bg-mint-light text-mint-deep rounded-full px-2.5 py-0.5 font-bold">{t('direct')}</span>
                    )}
                    {opt.available && transfer && (
                      <span className="text-xs bg-peach text-ink rounded-full px-2.5 py-0.5 font-bold">
                        {t('transfer', { count: transfer.transfers.length })}
                      </span>
                    )}
                  </div>

                  {opt.available && (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
                      {/* 왼쪽: 교통 정보 */}
                      <div>
                        <div className="space-y-2 text-sm mb-4">
                          <p className="text-ink font-medium">{stationFrom} → {stationTo}</p>
                          <p className="text-slate">
                            {t('duration')}: <span className="font-bold text-ink">{t('approx')} {opt.duration}</span>
                          </p>
                          {opt.fixedPrice && (
                            <p className="text-ink font-bold text-base">{t('fare')}: {opt.fixedPrice}</p>
                          )}
                        </div>

                        {/* 환승 정보 */}
                        {transfer && (
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
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8E8E0] to-[#F5D0D0] text-ink font-bold rounded-xl px-4 py-2 text-sm hover:opacity-90 transition"
                        >
                          {t('book')}
                        </a>
                      </div>

                      {/* 오른쪽: 날짜/시간 입력 */}
                      <div className="space-y-3 p-4 bg-snow rounded-xl border border-mist">
                        <div>
                          <label className="text-xs text-stone mb-1 block">{t('departDate')}</label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(cardKey, e.target.value)}
                            className="w-full bg-white border border-mist rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-mint-light focus:border-mint-deep"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-stone mb-1 block">{t('departTime')}</label>
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(cardKey, e.target.value)}
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
                            from: isGoing ? SEOUL : cityName,
                            to: isGoing ? cityName : SEOUL,
                            date: date || null,
                            departureTime: time || null,
                            arrivalTime: arrival || null,
                            duration: opt.duration,
                            price: opt.fixedPrice ?? '',
                          }}
                          cityId={selectedCity}
                          size="md"
                          className="w-full justify-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 라스트마일 — 가는편만 */}
            {isGoing && (
              <div className="bg-mint-light/30 rounded-2xl border border-mint-light p-5">
                <h3 className="font-bold text-ink mb-3">🚕 {t('lastMile')}</h3>
                <div className="space-y-2 text-sm text-slate">
                  <p>🚕 {t('approx')} {t('taxi')} {route.lastMile.taxi.minutes}{minLabel(locale)}</p>
                  {route.lastMile.bus && (
                    <p>🚌 {t('approx')} {t('bus')} {route.lastMile.bus.minutes}{minLabel(locale)} ({getL(route.lastMile.bus.route, locale)}, {getL(route.lastMile.bus.stop, locale)})</p>
                  )}
                  {route.lastMile.walk && (
                    <p>🚶 {t('approx')} {t('walk')} {route.lastMile.walk.minutes}{minLabel(locale)}</p>
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
            <p className="text-sm">{t('selectRoute')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
