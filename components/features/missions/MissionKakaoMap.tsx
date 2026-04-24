'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { KakaoMap, type KakaoMapMarker, type KakaoMarkerColor } from '@/components/shared/KakaoMap'

export interface MissionMapItem {
  id: string
  sequence: number
  title: Record<string, string>
  latitude: number | null
  longitude: number | null
  is_hidden: boolean
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed' | string
}

interface Props {
  missions: MissionMapItem[]
  courseId: string
  locale: string
  /** 마커 클릭 시 미션 페이지로 이동할지 (true) 프리뷰 모드(false) */
  clickableNavigation?: boolean
  className?: string
}

const LOCALE_FALLBACK = ['ko', 'en', 'ja'] as const

function pickTitle(title: Record<string, string>, locale: string): string {
  return title[locale] ?? title[LOCALE_FALLBACK[0]] ?? title[LOCALE_FALLBACK[1]] ?? title[LOCALE_FALLBACK[2]] ?? ''
}

function centerOf(missions: MissionMapItem[]): { lat: number; lng: number } | null {
  const withCoords = missions.filter(m => m.latitude != null && m.longitude != null)
  if (withCoords.length === 0) return null
  const sumLat = withCoords.reduce((s, m) => s + Number(m.latitude), 0)
  const sumLng = withCoords.reduce((s, m) => s + Number(m.longitude), 0)
  return { lat: sumLat / withCoords.length, lng: sumLng / withCoords.length }
}

export function MissionKakaoMap({
  missions,
  courseId,
  locale,
  clickableNavigation = true,
  className,
}: Props) {
  const router = useRouter()

  const visibleMissions = useMemo(
    () => missions.filter(m =>
      m.latitude != null && m.longitude != null &&
      !(m.is_hidden && m.status === 'locked'),
    ),
    [missions],
  )

  const center = useMemo(() => centerOf(visibleMissions), [visibleMissions])

  // 현재 미션: 첫 미완료(히든 제외)
  const firstIncompleteIndex = useMemo(() => {
    return visibleMissions.findIndex(m => !m.is_hidden && m.status !== 'completed')
  }, [visibleMissions])

  const markers = useMemo<KakaoMapMarker[]>(() => {
    return visibleMissions.map((m, i) => {
      let color: KakaoMarkerColor = 'gray'
      if (m.status === 'completed') color = 'green'
      else if (i === firstIncompleteIndex) color = 'orange'
      else if (m.is_hidden) color = 'red'

      const title = `${m.sequence}. ${pickTitle(m.title, locale)}`
      const onClick = clickableNavigation
        ? () => {
            if (m.status === 'completed' || i === firstIncompleteIndex || m.is_hidden) {
              router.push(`/${locale}/missions/${courseId}/${m.id}`)
            }
          }
        : undefined

      return {
        lat: Number(m.latitude),
        lng: Number(m.longitude),
        title,
        color,
        onClick,
      }
    })
  }, [visibleMissions, firstIncompleteIndex, locale, courseId, router, clickableNavigation])

  if (!center) {
    return (
      <div className={`${className ?? 'w-full h-80'} flex items-center justify-center rounded-2xl bg-slate-50 border border-mist text-stone text-sm`}>
        📍 위치 정보가 있는 미션이 없습니다
      </div>
    )
  }

  return (
    <KakaoMap
      centerLat={center.lat}
      centerLng={center.lng}
      level={6}
      markers={markers}
      className={className}
    />
  )
}
