'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import type { Region } from '@/lib/data/food-dupes'

interface KoreaMapCitySelectorProps {
  regions: Region[]
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
}

// 도시별 이미지 경로
const CITY_IMAGE: Record<string, string> = {
  jeonju: '/images/village/jeonju.jpg',
  seoul: '/images/village/seoul.jpg',
  busan: '/images/village/busan.jpg',
  jeju: '/images/village/jeju.jpg',
  gyeongju: '/images/village/gyeongju.jpg',
  tongyeong: '/images/village/tongyeong.jpg',
  cheonan: '/images/village/cheonan.png',
  yongin: '/images/village/yongin.png',
  icheon: '/images/village/icheon.png',
}

// 초기 좌표 — 드래그로 조정 후 콘솔에서 확정
const INITIAL_POS: Record<string, { top: number; left: number }> = {
  seoul: { top: 23, left: 43 },
  yongin: { top: 27, left: 46 },
  icheon: { top: 26, left: 53 },
  cheonan: { top: 33, left: 38 },
  jeonju: { top: 48, left: 30 },
  gyeongju: { top: 46, left: 67 },
  tongyeong: { top: 60, left: 47 },
  busan: { top: 56, left: 67 },
  jeju: { top: 80, left: 33 },
}

export function KoreaMapCitySelector({ regions }: KoreaMapCitySelectorProps) {
  const t = useTranslations('dupe')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [selected, setSelected] = useState<string | null>(null)
  const selectedRegion = selected ? regions.find((r) => r.code === selected) : null

  // ── 개발 도구: 드래그 좌표 조정 (좌표 확정 후 제거) ──
  const [positions, setPositions] = useState<Record<string, { top: number; left: number }>>({ ...INITIAL_POS })
  const [dragging, setDragging] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const updatePos = (clientX: number, clientY: number) => {
    if (!dragging || !mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const top = Math.round(((clientY - rect.top) / rect.height) * 1000) / 10
    const left = Math.round(((clientX - rect.left) / rect.width) * 1000) / 10
    setPositions((prev) => ({ ...prev, [dragging]: { top, left } }))
  }

  const handleMouseDown = (code: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(code)
  }

  const handleMouseMove = (e: React.MouseEvent) => updatePos(e.clientX, e.clientY)

  const handleMouseUp = () => {
    if (dragging) {
      console.log('=== 도시 좌표 ===')
      Object.entries(positions).forEach(([code, pos]) => {
        console.log(`  ${code}: { top: '${pos.top}%', left: '${pos.left}%' },`)
      })
      setDragging(null)
    }
  }

  const handleTouchStart = (code: string) => (e: React.TouchEvent) => {
    e.stopPropagation()
    setDragging(code)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return
    const touch = e.touches[0]
    updatePos(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => handleMouseUp()

  const copyPositions = () => {
    const text = Object.entries(positions)
      .map(([code, pos]) => `  ${code}: { top: '${pos.top}%', left: '${pos.left}%' },`)
      .join('\n')
    navigator.clipboard.writeText(text).catch(() => {})
    alert('좌표가 클립보드에 복사되었습니다!')
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('map.korea.title')}
        </h2>
        <p className="text-sm text-stone">{t('map.korea.subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* 지도 이미지 + 드래그 가능 마커 */}
        <div className="flex-1 w-full md:w-auto">
          <div
            ref={mapRef}
            className="relative w-full max-w-[500px] mx-auto select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src="/images/korea-map.png"
              alt="Korea Map"
              width={500}
              height={600}
              className="w-full h-auto rounded-2xl"
              priority
              draggable={false}
            />

            {/* 도시 마커 */}
            {regions.map((region) => {
              const pos = positions[region.code]
              if (!pos) return null
              const isSelected = selected === region.code
              const isDraggingThis = dragging === region.code

              return (
                <button
                  key={region.code}
                  type="button"
                  onClick={(e) => {
                    if (!dragging) {
                      e.stopPropagation()
                      setSelected(isSelected ? null : region.code)
                    }
                  }}
                  onMouseDown={handleMouseDown(region.code)}
                  onTouchStart={handleTouchStart(region.code)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-0.5 z-10 ${
                    isDraggingThis
                      ? 'cursor-grabbing scale-150'
                      : isSelected
                        ? 'scale-125'
                        : 'hover:scale-125 cursor-grab'
                  } transition-transform duration-200`}
                  style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                  title={getL(region.name, locale)}
                >
                  <div className={`rounded-full border-2 border-white shadow-lg transition-all ${
                    isSelected
                      ? 'w-6 h-6 bg-blossom-deep ring-4 ring-blossom/30 animate-pulse'
                      : 'w-4 h-4 bg-mint-deep'
                  }`} />
                  <span className={`text-[9px] md:text-[10px] font-black px-1 py-0.5 rounded bg-white/80 shadow-sm whitespace-nowrap ${
                    isSelected ? 'text-blossom-deep' : 'text-ink'
                  }`}>
                    {getL(region.name, locale)}
                  </span>
                  {/* 개발도구: 좌표 표시 */}
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] bg-black/80 text-white px-1 rounded whitespace-nowrap">
                    {pos.top}%, {pos.left}%
                  </span>
                  {/* 호버 툴팁 */}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-white bg-ink/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {t('map.foods', { count: region.foods.length })}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 개발 도구 — 좌표 확정 후 이 블록 전체 삭제 */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-xs font-mono">
            <p className="font-bold mb-2">🛠️ 개발 도구: 마커를 드래그해서 위치 조정</p>
            {Object.entries(positions).map(([code, pos]) => (
              <div key={code}>
                {code}: top: {pos.top}%, left: {pos.left}%
              </div>
            ))}
            <button
              type="button"
              onClick={copyPositions}
              className="mt-2 px-3 py-1 bg-mint-deep text-white rounded text-xs font-bold"
            >
              📋 좌표 복사
            </button>
          </div>
        </div>

        {/* 도시 정보 패널 */}
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          {selectedRegion ? (
            <div
              key={selectedRegion.code}
              className="bg-white rounded-2xl shadow-lg border border-mist overflow-hidden"
              style={{ animation: 'fadeSlideLeft 0.3s ease-out' }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {CITY_IMAGE[selectedRegion.code] ? (
                  <Image
                    src={CITY_IMAGE[selectedRegion.code]}
                    alt={getL(selectedRegion.name, locale)}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-mint-light flex items-center justify-center">
                    <span className="text-5xl">{selectedRegion.icon}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-2xl">{selectedRegion.icon}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-black text-ink mb-1">
                  {getL(selectedRegion.name, locale)}
                </h3>
                <p className="text-xs text-stone mb-1">
                  {t('map.foods', { count: selectedRegion.foods.length })}
                </p>
                <p className="text-sm text-slate mb-4 leading-relaxed">
                  {getL(selectedRegion.description, locale)}
                </p>

                <div className="space-y-2 mb-5">
                  {selectedRegion.foods.slice(0, 5).map((food) => (
                    <div key={food.id} className="flex items-center gap-2 text-sm">
                      <span>🍜</span>
                      <span className="text-ink font-medium truncate">{getL(food.name, locale)}</span>
                    </div>
                  ))}
                  {selectedRegion.foods.length > 5 && (
                    <p className="text-xs text-stone pl-6">
                      +{selectedRegion.foods.length - 5} more
                    </p>
                  )}
                </div>

                <Link
                  href={`/${locale}/food/dupe/${selectedRegion.code}`}
                  className="block w-full text-center px-6 py-3 rounded-xl bg-mint-deep text-white font-bold text-sm hover:bg-[#7BC8BC] transition-colors"
                >
                  {t('map.explore')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-cloud rounded-2xl border border-mist p-8 text-center">
              <p className="text-4xl mb-3">📍</p>
              <p className="text-sm text-stone">{t('map.korea.subtitle')}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(15px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
