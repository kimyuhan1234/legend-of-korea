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
}

interface Distance {
  walkMinutes: number
  taxiMinutes: number
}

export function PlannerSpotDistance({ hotelLat, hotelLng, spots }: PlannerSpotDistanceProps) {
  const t = useTranslations('planner')
  const [distances, setDistances] = useState<Record<string, Distance>>({})

  useEffect(() => {
    if (hotelLat === null || hotelLng === null) return
    let cancelled = false

    async function compute() {
      const results: Record<string, Distance> = {}
      for (const spot of spots) {
        if (typeof spot.lat !== 'number' || typeof spot.lng !== 'number') continue
        try {
          const url = `/api/planner/distance?fromLat=${hotelLat}&fromLng=${hotelLng}&toLat=${spot.lat}&toLng=${spot.lng}`
          const res = await fetch(url)
          if (res.ok) {
            const data = await res.json()
            results[spot.id] = {
              walkMinutes: data.walkMinutes,
              taxiMinutes: data.taxiMinutes,
            }
          }
        } catch {
          // 개별 실패는 무시
        }
      }
      if (!cancelled) setDistances(results)
    }

    compute()
    return () => { cancelled = true }
  }, [hotelLat, hotelLng, spots])

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
        호텔 기준 각 장소까지의 {approx} 이동 시간
      </p>

      <ul className="space-y-2">
        {spots.map((spot) => {
          const dist = distances[spot.id]
          return (
            <li
              key={spot.id}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#e8ddd0]/40"
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
                  <p className="text-[11px] text-[#9CA3AF] mt-1">—</p>
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
