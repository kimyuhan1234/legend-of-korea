'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { TRANSPORT_ROUTES, type TransportRoute } from '@/lib/data/transport-routes'
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

const TYPE_ICON: Record<string, string> = { ktx: '🚄', bus: '🚌', flight: '✈️' }
const TYPE_LABEL: Record<string, { ko: string; en: string; ja: string }> = {
  ktx: { ko: 'KTX', en: 'KTX', ja: 'KTX' },
  bus: { ko: '고속버스', en: 'Express Bus', ja: '高速バス' },
  flight: { ko: '항공', en: 'Flight', ja: '航空' },
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
}

export default function TrafficPage() {
  const t = useTranslations('traffic')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [selectedCity, setSelectedCity] = useState('jeonju')
  const route: TransportRoute | undefined = TRANSPORT_ROUTES.find((r) => r.cityId === selectedCity)
  const cityLabel = CITIES.find((c) => c.code === selectedCity)

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
        {/* 출발/도착 선택 */}
        <div className="flex items-center gap-4 mb-8 flex-wrap justify-center">
          <div>
            <label className="text-xs font-bold text-stone block mb-1">{t('from')}</label>
            <div className="px-5 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm">
              {locale === 'ko' ? '서울' : locale === 'ja' ? 'ソウル' : 'Seoul'}
            </div>
          </div>
          <span className="text-2xl text-mint-deep font-bold mt-5">→</span>
          <div>
            <label className="text-xs font-bold text-stone block mb-1">{t('to')}</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-5 py-2.5 rounded-xl border border-mist bg-white text-ink font-bold text-sm focus:outline-none focus:border-mint-deep"
            >
              {CITIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {getL(c.name, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {route ? (
          <div className="space-y-5">
            {/* 교통 카드 */}
            {route.options.map((opt) => (
              <div
                key={opt.type}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  opt.available ? 'border-mist hover:border-mint hover:shadow-md' : 'border-mist opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{TYPE_ICON[opt.type]}</span>
                  <h3 className="font-bold text-ink text-lg">{getL(TYPE_LABEL[opt.type], locale)}</h3>
                  {!opt.available && (
                    <span className="text-xs bg-mist text-stone rounded-full px-2.5 py-0.5 font-bold">
                      {t('unavailable')}
                    </span>
                  )}
                </div>

                {opt.available && (
                  <>
                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-slate">
                        {locale === 'ko' ? '서울' : locale === 'ja' ? 'ソウル' : 'Seoul'} → {getL(opt.station, locale)}
                      </p>
                      <p className="text-slate">
                        {t('duration')}: <span className="font-bold text-ink">{t('approx')} {opt.duration}</span>
                      </p>
                      {opt.fixedPrice && (
                        <p className="text-ink font-bold">{t('fare')}: {opt.fixedPrice}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <a
                        href={opt.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8E8E0] to-[#F5D0D0] text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition"
                      >
                        {t('book')}
                      </a>
                      <AddToPlannerButton
                        itemType="transport"
                        itemData={{
                          type: opt.type,
                          from: { ko: '서울', en: 'Seoul', ja: 'ソウル' },
                          to: cityLabel?.name ?? { ko: selectedCity, en: selectedCity, ja: selectedCity },
                          duration: opt.duration,
                          price: opt.fixedPrice ?? '',
                        }}
                        cityId={selectedCity}
                        size="sm"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* 라스트마일 */}
            <div className="bg-mint-light/30 rounded-2xl border border-mint-light p-5">
              <h3 className="font-bold text-ink mb-3">🚕 {t('lastMile')}</h3>
              <div className="space-y-2 text-sm text-slate">
                <p>🚕 {t('approx')} {t('taxi')} {route.lastMile.taxi.minutes}{locale === 'ko' ? '분' : locale === 'ja' ? '分' : 'min'}</p>
                {route.lastMile.bus && (
                  <p>🚌 {t('approx')} {t('bus')} {route.lastMile.bus.minutes}{locale === 'ko' ? '분' : locale === 'ja' ? '分' : 'min'} ({getL(route.lastMile.bus.route, locale)}, {getL(route.lastMile.bus.stop, locale)})</p>
                )}
                {route.lastMile.walk && (
                  <p>🚶 {t('approx')} {t('walk')} {route.lastMile.walk.minutes}{locale === 'ko' ? '분' : locale === 'ja' ? '分' : 'min'}</p>
                )}
              </div>
              <p className="text-xs text-stone mt-3">⚠ {t('taxiNote')}</p>
            </div>

            {/* 면책 */}
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
