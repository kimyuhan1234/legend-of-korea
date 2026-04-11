'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { getRouteByCity } from '@/lib/data/transport-routes'

interface PlannerTransportProps {
  cityId: string
  locale: string
}

const TYPE_EMOJI = { ktx: '🚄', bus: '🚌', flight: '✈️' } as const

export function PlannerTransport({ cityId, locale }: PlannerTransportProps) {
  const t = useTranslations('planner')
  const [copied, setCopied] = useState(false)

  const route = getRouteByCity(cityId)

  if (!route || route.options.length === 0) return null

  const taxiAddr = route.lastMile.taxi.koreanAddress[locale as 'ko' | 'ja' | 'en'] || route.lastMile.taxi.koreanAddress.ko

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(route.lastMile.taxi.koreanAddress.ko)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-black text-[#111] mb-2">
        🚄 {t('transport.title')}
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">
        {t('transport.subtitle')} · {t('transport.fromSeoul')}
      </p>

      {/* 서울 → 목적지 옵션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {route.options.map((opt) => {
          const stationName = opt.station[locale as 'ko' | 'ja' | 'en'] || opt.station.ko
          return (
            <div
              key={opt.type}
              className="bg-white rounded-2xl p-5 border border-[#e8ddd0]/60 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{TYPE_EMOJI[opt.type]}</span>
                <span className="text-sm font-black text-[#111]">{t(`transport.${opt.type}` as Parameters<typeof t>[0])}</span>
              </div>
              <p className="text-xs text-[#6B7280] mb-1">{stationName}</p>
              <p className="text-xs text-[#6B7280] mb-3">
                {t('transport.duration')}: <span className="font-bold text-[#111]">{opt.duration}</span>
              </p>
              <p className="text-base font-black text-[#111] mb-3">{opt.estimatedCost}</p>
              <a
                href={opt.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 rounded-full bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E55A2B] transition-colors"
              >
                {t('transport.booking')} ↗
              </a>
            </div>
          )
        })}
      </div>

      {/* 라스트마일 */}
      <div className="bg-[#F5F3EF] rounded-2xl p-5">
        <p className="text-xs font-black text-[#FF6B35] uppercase tracking-widest mb-3">
          {t('transport.lastMile')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 택시 카드 */}
          <div className="bg-white rounded-xl p-4 border border-[#e8ddd0]/40">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🚕</span>
              <span className="text-sm font-bold text-[#111]">{t('transport.taxi')}</span>
              <span className="text-xs text-[#6B7280] ml-auto">{route.lastMile.taxi.estimatedCost}</span>
            </div>
            <div className="bg-[#F5F3EF] rounded-lg p-3 mb-2">
              <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">
                {t('transport.addressCard')}
              </p>
              <p className="text-sm text-[#111] font-semibold">{taxiAddr}</p>
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-1.5 rounded-full bg-neutral-100 text-xs font-bold text-[#374151] hover:bg-neutral-200"
            >
              {copied ? t('transport.copied') : `📋 ${t('transport.copy')}`}
            </button>
          </div>

          {/* 대중교통 카드 */}
          {route.lastMile.bus && (
            <div className="bg-white rounded-xl p-4 border border-[#e8ddd0]/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🚌</span>
                <span className="text-sm font-bold text-[#111]">{t('transport.publicBus')}</span>
                <span className="text-xs text-[#6B7280] ml-auto">{route.lastMile.bus.duration}</span>
              </div>
              <p className="text-xs text-[#374151] mb-1">
                {route.lastMile.bus.route[locale as 'ko' | 'ja' | 'en'] || route.lastMile.bus.route.ko}
              </p>
              <p className="text-xs text-[#6B7280]">
                → {route.lastMile.bus.stop[locale as 'ko' | 'ja' | 'en'] || route.lastMile.bus.stop.ko}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
