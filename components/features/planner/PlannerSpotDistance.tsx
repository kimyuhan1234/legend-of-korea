'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'

interface SpotItem {
  id: string
  name: string
  lat?: number
  lng?: number
  emoji: string
}

interface PlannerSpotDistanceProps {
  hotelLat: number | null
  hotelLng: number | null
  spots: SpotItem[]
  onCreditsChanged?: () => void
}

interface Distance {
  walkMinutes: number
  taxiMinutes: number
}

type ErrorState = null | 'insufficient_credits' | 'subscription_required' | 'unknown'

export function PlannerSpotDistance({
  hotelLat,
  hotelLng,
  spots,
  onCreditsChanged,
}: PlannerSpotDistanceProps) {
  const t = useTranslations('planner')
  const [distances, setDistances] = useState<Record<string, Distance>>({})
  const [errorState, setErrorState] = useState<ErrorState>(null)
  const [computing, setComputing] = useState(false)

  useEffect(() => {
    if (hotelLat === null || hotelLng === null) return
    let cancelled = false

    async function compute() {
      setComputing(true)
      setErrorState(null)
      const results: Record<string, Distance> = {}
      let creditsChanged = false
      let hitInsufficient = false
      let hitSubRequired = false

      for (const spot of spots) {
        if (typeof spot.lat !== 'number' || typeof spot.lng !== 'number') continue
        try {
          const url = `/api/planner/distance?fromLat=${hotelLat}&fromLng=${hotelLng}&toLat=${spot.lat}&toLng=${spot.lng}`
          const res = await fetch(url, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            results[spot.id] = {
              walkMinutes: data.walkMinutes,
              taxiMinutes: data.taxiMinutes,
            }
            creditsChanged = true
          } else if (res.status === 402) {
            // 크레딧 부족 — 이후 spot 요청 중단 (동일 결과)
            hitInsufficient = true
            break
          } else if (res.status === 403) {
            hitSubRequired = true
            break
          }
        } catch {
          // 개별 네트워크 실패는 무시
        }
      }

      if (cancelled) return

      setDistances(results)
      if (hitInsufficient) setErrorState('insufficient_credits')
      else if (hitSubRequired) setErrorState('subscription_required')
      else setErrorState(null)

      setComputing(false)

      // 성공적으로 한 번이라도 차감됐으면 부모에게 잔액 갱신 알림
      if (creditsChanged && onCreditsChanged) onCreditsChanged()
    }

    compute()
    return () => { cancelled = true }
  }, [hotelLat, hotelLng, spots, onCreditsChanged])

  // 호텔 좌표나 스팟 좌표가 없으면 섹션 전체 숨김 (빈 placeholder 제거)
  const hasSpotsWithCoords = useMemo(
    () => spots.some((s) => typeof s.lat === 'number' && typeof s.lng === 'number'),
    [spots]
  )

  if (hotelLat === null || hotelLng === null || !hasSpotsWithCoords || spots.length === 0) {
    return null
  }

  const approx = t('approx')

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-black text-[#111] mb-2">
        📍 Spot 거리
      </h2>
      <p className="text-sm text-[#6B7280] mb-4">
        호텔 기준 각 장소까지의 {approx} 이동 시간 ({t('spot.creditNote')})
      </p>

      {errorState === 'insufficient_credits' && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
          <p className="text-sm font-bold text-red-700 mb-1">
            ⚠ {t('credits.insufficient')}
          </p>
          <p className="text-[11px] text-red-600">{t('spot.insufficientHint')}</p>
        </div>
      )}

      {errorState === 'subscription_required' && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <p className="text-sm font-bold text-amber-700">
            🔒 {t('credits.subRequired')}
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {spots.map((spot) => {
          const dist = distances[spot.id]
          return (
            <li
              key={spot.id}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#E4E7EB]/40"
            >
              <span className="text-2xl shrink-0">{spot.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111] truncate">{spot.name}</p>
                {dist ? (
                  <div className="flex gap-3 mt-1 text-[11px] text-[#6B7280]">
                    <span>🚶 {approx} {dist.walkMinutes}분</span>
                    <span>🚕 {approx} {dist.taxiMinutes}분</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#9CA3AF] mt-1">
                    {computing ? '...' : '—'}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-[10px] text-[#9CA3AF] mt-3 text-center">
        ※ 모든 시간은 {approx}이며 교통 상황에 따라 달라질 수 있습니다
      </p>
    </section>
  )
}
