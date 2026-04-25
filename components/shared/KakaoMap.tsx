'use client'

import { useEffect, useRef, useState } from 'react'
import { loadKakaoMapSDK, kakaoKey } from '@/lib/kakao-map'

export type KakaoMarkerColor = 'green' | 'orange' | 'gray' | 'red' | 'blue'

export interface KakaoMapMarker {
  lat: number
  lng: number
  title: string
  color?: KakaoMarkerColor
  onClick?: () => void
}

interface KakaoMapProps {
  centerLat: number
  centerLng: number
  level?: number
  markers?: KakaoMapMarker[]
  /** 사용자 현재 위치 마커 (navigator.geolocation 기반, optional) */
  userLocation?: { lat: number; lng: number } | null
  /** 중심점 주변 반경 원 (미터) */
  radiusMeters?: number
  className?: string
  /** SDK 로드 실패/키 없음 시 보여줄 폴백 내용 */
  fallbackLabel?: string
}

// 색상별 이모지 마커 (간단한 SVG data URL 대신 이모지 사용)
// 실제 카카오맵 MarkerImage로 색상 구분하고 싶으면 SVG 필요.
// 여기서는 접근성/단순성 위해 `CustomOverlay` 패턴으로 HTML div 마커를 쓴다.
const COLOR_STYLES: Record<KakaoMarkerColor, { bg: string; ring: string; emoji: string }> = {
  green:  { bg: '#10B981', ring: 'rgba(16,185,129,0.3)',  emoji: '✓' },
  orange: { bg: '#F59E0B', ring: 'rgba(245,158,11,0.35)', emoji: '!' },
  gray:   { bg: '#9CA3AF', ring: 'rgba(156,163,175,0.25)', emoji: '🔒' },
  red:    { bg: '#EF4444', ring: 'rgba(239,68,68,0.3)',   emoji: '📍' },
  blue:   { bg: '#3B82F6', ring: 'rgba(59,130,246,0.3)',  emoji: '•' },
}

function buildMarkerEl(color: KakaoMarkerColor, title: string): HTMLElement {
  const wrap = document.createElement('div')
  wrap.style.position = 'relative'
  wrap.style.transform = 'translate(-50%, -100%)'
  wrap.style.cursor = 'pointer'

  const st = COLOR_STYLES[color]

  const pin = document.createElement('div')
  pin.style.cssText = `
    width: 32px; height: 32px; border-radius: 50%;
    background: ${st.bg}; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 900;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 2px solid #fff;
  `
  pin.textContent = st.emoji

  const ring = document.createElement('div')
  ring.style.cssText = `
    position: absolute; top: -4px; left: -4px;
    width: 40px; height: 40px; border-radius: 50%;
    background: ${st.ring}; z-index: -1;
    ${color === 'orange' ? 'animation: kakao-pulse 1.6s ease-out infinite;' : ''}
  `

  const label = document.createElement('div')
  label.style.cssText = `
    position: absolute; top: 36px; left: 50%; transform: translateX(-50%);
    white-space: nowrap; background: rgba(255,255,255,0.95);
    padding: 2px 8px; border-radius: 10px;
    font-size: 11px; font-weight: 700; color: #111;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
    pointer-events: none;
  `
  label.textContent = title

  wrap.appendChild(ring)
  wrap.appendChild(pin)
  wrap.appendChild(label)
  return wrap
}

export function KakaoMap({
  centerLat,
  centerLng,
  level = 5,
  markers = [],
  userLocation,
  radiusMeters,
  className = 'w-full h-80',
  fallbackLabel,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const overlayRefs = useRef<unknown[]>([])
  const circleRef = useRef<unknown>(null)
  const userOverlayRef = useRef<unknown>(null)
  const [error, setError] = useState<string | null>(null)
  // SDK 로드 + 지도 인스턴스 준비 완료 신호.
  // ref 할당만으로는 리렌더가 안 일어나 마커/원/사용자위치 effect 가
  // 비어있는 상태로 한 번만 실행되고 끝나는 race 를 막는다.
  const [mapReady, setMapReady] = useState(false)

  // SDK 로드 + 지도 초기화
  useEffect(() => {
    let disposed = false
    if (!kakaoKey()) {
      setError('지도를 표시하려면 카카오 API 키가 필요합니다')
      return
    }

    loadKakaoMapSDK()
      .then(() => {
        if (disposed || !containerRef.current || !window.kakao?.maps) return
        const maps = window.kakao.maps
        const center = new maps.LatLng(centerLat, centerLng)
        mapRef.current = new maps.Map(containerRef.current, {
          center,
          level,
        })
        setMapReady(true)
      })
      .catch((e: Error) => setError(e.message))

    return () => { disposed = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 중심/줌 변경 시 반영
  useEffect(() => {
    if (!mapReady) return
    const m = mapRef.current as { setCenter?: (c: unknown) => void; setLevel?: (n: number) => void } | null
    if (!m || !window.kakao?.maps) return
    m.setCenter?.(new window.kakao.maps.LatLng(centerLat, centerLng))
    m.setLevel?.(level)
  }, [mapReady, centerLat, centerLng, level])

  // 마커 렌더링 (CustomOverlay로 색상 구분)
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current as { getLevel?: () => number } | null
    if (!map || !window.kakao?.maps) return
    const maps = window.kakao.maps

    // 기존 오버레이 제거
    overlayRefs.current.forEach((ov) => {
      const o = ov as { setMap: (m: unknown) => void }
      o.setMap(null)
    })
    overlayRefs.current = []

    const CustomOverlay = (maps as unknown as { CustomOverlay: new (opts: unknown) => unknown }).CustomOverlay

    markers.forEach((mk) => {
      const el = buildMarkerEl(mk.color ?? 'red', mk.title)
      if (mk.onClick) {
        el.addEventListener('click', mk.onClick)
      }
      const overlay = new CustomOverlay({
        position: new maps.LatLng(mk.lat, mk.lng),
        content: el,
        yAnchor: 1,
        clickable: !!mk.onClick,
      })
      const o = overlay as { setMap: (m: unknown) => void }
      o.setMap(mapRef.current)
      overlayRefs.current.push(overlay)
    })
  }, [mapReady, markers])

  // 반경 원
  useEffect(() => {
    if (!mapReady) return
    if (!mapRef.current || !window.kakao?.maps) return
    const maps = window.kakao.maps
    if (circleRef.current) {
      const c = circleRef.current as { setMap: (m: unknown) => void }
      c.setMap(null)
      circleRef.current = null
    }
    if (radiusMeters && radiusMeters > 0) {
      const circle = new maps.Circle({
        center: new maps.LatLng(centerLat, centerLng),
        radius: radiusMeters,
        strokeWeight: 2,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeStyle: 'dashed',
        fillColor: '#3B82F6',
        fillOpacity: 0.12,
      })
      const c = circle as { setMap: (m: unknown) => void }
      c.setMap(mapRef.current)
      circleRef.current = circle
    }
  }, [mapReady, radiusMeters, centerLat, centerLng])

  // 사용자 위치 마커 (파란 점)
  useEffect(() => {
    if (!mapReady) return
    if (!mapRef.current || !window.kakao?.maps) return
    const maps = window.kakao.maps
    if (userOverlayRef.current) {
      const o = userOverlayRef.current as { setMap: (m: unknown) => void }
      o.setMap(null)
      userOverlayRef.current = null
    }
    if (!userLocation) return

    const el = buildMarkerEl('blue', '내 위치')
    const CustomOverlay = (maps as unknown as { CustomOverlay: new (opts: unknown) => unknown }).CustomOverlay
    const overlay = new CustomOverlay({
      position: new maps.LatLng(userLocation.lat, userLocation.lng),
      content: el,
      yAnchor: 1,
    })
    const o = overlay as { setMap: (m: unknown) => void }
    o.setMap(mapRef.current)
    userOverlayRef.current = overlay
  }, [mapReady, userLocation])

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-2xl bg-slate-50 border border-mist text-stone text-sm p-4 text-center`}
      >
        <span>🗺️ {fallbackLabel ?? error}</span>
      </div>
    )
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-2xl border border-mist`}>
      <div ref={containerRef} className="absolute inset-0" />
      <style jsx>{`
        @keyframes kakao-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
