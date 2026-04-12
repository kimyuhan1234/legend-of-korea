'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getRouteByCity, type TransportType } from '@/lib/data/transport-routes'

interface TransportInputFormProps {
  cityId: string
  locale: string
}

const TYPE_EMOJI: Record<TransportType, string> = { ktx: '🚄', bus: '🚌', flight: '✈️' }

// "1.5~2h" → 90 분 (최대 소요시간 사용 → 도착시간 보수적 계산)
function parseDurationMaxMinutes(duration: string): number {
  // "1.5~2h", "2.5~3h", "0.5~1.5h", "1h", "4~4.5h"
  const matches = duration.match(/([\d.]+)/g)
  if (!matches || matches.length === 0) return 120
  const nums = matches.map((m) => parseFloat(m))
  const max = Math.max(...nums)
  return Math.round(max * 60)
}

function addMinutesToTime(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + minutes
  const newH = Math.floor(total / 60) % 24
  const newM = total % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

export function TransportInputForm({ cityId, locale }: TransportInputFormProps) {
  const t = useTranslations('planner')

  const route = getRouteByCity(cityId)
  const [selectedType, setSelectedType] = useState<TransportType | null>(
    route && route.options.length > 0 ? route.options[0].type : null
  )
  const [date, setDate] = useState('')
  const [departureTime, setDepartureTime] = useState('09:00')
  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'login-required'>('idle')

  const selectedOption = useMemo(
    () => route?.options.find((o) => o.type === selectedType) ?? null,
    [route, selectedType]
  )

  // 도착 시간 자동 계산
  const arrivalTime = useMemo(() => {
    if (!selectedOption) return ''
    const mins = parseDurationMaxMinutes(selectedOption.duration)
    return addMinutesToTime(departureTime, mins)
  }, [selectedOption, departureTime])

  if (!route || route.options.length === 0) return null

  const approx = t('approx')

  const handleSubmit = async () => {
    if (!date || !selectedOption || state === 'loading' || state === 'added') return

    setState('loading')
    try {
      const res = await fetch('/api/planner/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'transport',
          cityId,
          itemData: {
            date,
            method: selectedOption.type,
            from: { ko: '서울', ja: 'ソウル', en: 'Seoul' },
            to: selectedOption.station,
            departureTime,
            arrivalTime,
            duration: selectedOption.duration,
            fixedPrice: selectedOption.fixedPrice,
          },
        }),
      })

      if (res.status === 401) {
        setState('login-required')
        return
      }
      if (!res.ok) {
        setState('idle')
        return
      }
      setState('added')
      window.dispatchEvent(new Event('planner:refresh'))
    } catch {
      setState('idle')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E7EB]/40">
      <p className="text-sm font-black text-[#111] mb-4">🚄 {t('transport.title')}</p>

      {/* 우리가 제공하는 교통 옵션 (읽기 전용) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {route.options.map((opt) => {
          const active = opt.type === selectedType
          return (
            <button
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-[#9DD8CE] bg-[#FAFBFC]'
                  : 'border-[#E4E7EB]/60 hover:border-[#9DD8CE]/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{TYPE_EMOJI[opt.type]}</span>
                <span className="text-xs font-black text-[#111]">
                  {t(`transport.${opt.type}` as Parameters<typeof t>[0])}
                </span>
              </div>
              <p className="text-[10px] text-[#6B7280]">
                {approx} {opt.duration}
              </p>
              {opt.fixedPrice && (
                <p className="text-xs font-bold text-[#111] mt-1">{opt.fixedPrice}</p>
              )}
            </button>
          )
        })}
      </div>

      {selectedOption && (
        <>
          <div className="bg-[#F0F2F5] rounded-xl p-3 mb-4 text-xs text-[#374151] space-y-1">
            <p>
              <span className="text-[#6B7280]">출발지:</span> 서울
            </p>
            <p>
              <span className="text-[#6B7280]">도착지:</span>{' '}
              {selectedOption.station[locale as 'ko' | 'ja' | 'en'] || selectedOption.station.ko}
            </p>
            <p>
              <span className="text-[#6B7280]">{t('transport.duration')}:</span>{' '}
              {approx} {selectedOption.duration}
            </p>
            <a
              href={selectedOption.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 rounded-full bg-[#9DD8CE] text-white text-[10px] font-bold hover:bg-[#7BC8BC]"
            >
              {t('transport.ticket')} ↗
            </a>
          </div>

          {/* 고객 입력 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E4E7EB] text-xs focus:border-[#9DD8CE] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
                {t('transport.departure')}
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E4E7EB] text-xs focus:border-[#9DD8CE] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
                {t('transport.arrival')}
              </label>
              <div className="mt-1 px-3 py-2 rounded-xl border border-[#E4E7EB] text-xs bg-[#F0F2F5] font-bold">
                {arrivalTime}
              </div>
            </div>
          </div>

          {/* 도착 후 안내 (택시 금액 없음) */}
          <div className="bg-[#FAFBFC] border border-[#9DD8CE]/20 rounded-xl p-3 mb-4 text-xs text-[#374151]">
            🚕{' '}
            {t('transport.taxiNote', { min: route.lastMile.taxi.minutes })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!date || state === 'loading' || state === 'added'}
            className={`w-full py-2.5 rounded-full text-xs font-bold transition-colors ${
              state === 'added'
                ? 'bg-emerald-500 text-white'
                : !date
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#9DD8CE] text-white hover:bg-[#7BC8BC]'
            }`}
          >
            {state === 'added'
              ? `✓ ${t('added')}`
              : state === 'loading'
                ? t('adding')
                : state === 'login-required'
                  ? t('loginRequired')
                  : `+ ${t('addButton')}`}
          </button>
        </>
      )}
    </div>
  )
}
