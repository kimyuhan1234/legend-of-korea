'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import type { Region } from '@/lib/data/food-dupes'

interface KoreaMapCitySelectorProps {
  regions: Region[]
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
}

// 9개 도시 SVG 좌표 (viewBox 0 0 400 520)
const CITY_POS: Record<string, { x: number; y: number }> = {
  seoul: { x: 198, y: 78 },
  yongin: { x: 215, y: 115 },
  icheon: { x: 245, y: 128 },
  cheonan: { x: 172, y: 155 },
  jeonju: { x: 140, y: 255 },
  gyeongju: { x: 305, y: 250 },
  tongyeong: { x: 238, y: 340 },
  busan: { x: 315, y: 325 },
  jeju: { x: 135, y: 465 },
}

// 간략화된 남한 윤곽 SVG path
const KOREA_PATH = `M 160 40 C 170 30, 230 25, 250 40 C 270 55, 285 50, 300 65
  C 315 80, 320 100, 330 120 C 340 140, 345 160, 340 180
  C 335 200, 340 220, 345 240 C 350 260, 340 280, 330 300
  C 320 320, 325 340, 315 355 C 305 370, 280 380, 260 370
  C 240 360, 220 365, 200 360 C 180 355, 160 345, 145 330
  C 130 315, 125 295, 120 275 C 115 255, 110 235, 115 215
  C 120 195, 115 175, 120 155 C 125 135, 130 115, 140 95
  C 150 75, 145 55, 160 40 Z`

// 제주도 윤곽
const JEJU_PATH = `M 100 440 C 110 430, 160 428, 175 435
  C 190 442, 185 460, 170 470 C 155 480, 110 478, 100 465
  C 90 452, 90 445, 100 440 Z`

export function KoreaMapCitySelector({ regions }: KoreaMapCitySelectorProps) {
  const t = useTranslations('dupe')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [selected, setSelected] = useState<string | null>(null)
  const selectedRegion = selected ? regions.find((r) => r.code === selected) : null

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('map.korea.title')}
        </h2>
        <p className="text-sm text-stone">{t('map.korea.subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* 남한 지도 */}
        <div className="flex-1 w-full md:w-auto">
          <div className="bg-gradient-to-b from-sky-light/20 to-snow rounded-2xl p-4 md:p-6 border border-mist">
            <svg
              viewBox="0 0 400 520"
              className="w-full max-w-sm mx-auto"
              style={{ aspectRatio: '400/520' }}
            >
              {/* 남한 윤곽 */}
              <path d={KOREA_PATH} fill="#D4F0EB" fillOpacity="0.3" stroke="#9DD8CE" strokeWidth="2" />
              <path d={JEJU_PATH} fill="#D4F0EB" fillOpacity="0.3" stroke="#9DD8CE" strokeWidth="2" />

              {/* 선택된 도시 → 정보 패널 연결선 */}
              {selected && CITY_POS[selected] && (
                <path
                  d={`M ${CITY_POS[selected].x} ${CITY_POS[selected].y} Q 380 ${CITY_POS[selected].y} 395 ${CITY_POS[selected].y}`}
                  fill="none"
                  stroke="#9DD8CE"
                  strokeWidth="2"
                  strokeDasharray="5,4"
                  className="animate-dash"
                />
              )}

              {/* 9개 도시 마커 */}
              {regions.map((region) => {
                const pos = CITY_POS[region.code]
                if (!pos) return null
                const isSelected = selected === region.code

                return (
                  <g
                    key={region.code}
                    className="cursor-pointer"
                    onClick={() => setSelected(isSelected ? null : region.code)}
                  >
                    {/* pulse ring (선택 시) */}
                    {isSelected && (
                      <circle cx={pos.x} cy={pos.y} r="22" fill="none" stroke="#F0B8B8" strokeWidth="2" opacity="0.5">
                        <animate attributeName="r" from="14" to="26" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* 마커 원 */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 16 : 12}
                      fill={isSelected ? '#F0B8B8' : '#9DD8CE'}
                      stroke="white"
                      strokeWidth="2.5"
                      className="transition-all duration-200 hover:r-[16]"
                    />
                    {/* 아이콘 */}
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                    >
                      {region.icon}
                    </text>
                    {/* 도시명 */}
                    <text
                      x={pos.x}
                      y={pos.y + 28}
                      textAnchor="middle"
                      className="fill-ink text-[10px] font-bold"
                      style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
                    >
                      {getL(region.name, locale)}
                    </text>
                    {/* 음식 개수 뱃지 */}
                    <rect x={pos.x + 12} y={pos.y - 18} width="24" height="14" rx="7" fill="#F5D0D0" />
                    <text
                      x={pos.x + 24}
                      y={pos.y - 9}
                      textAnchor="middle"
                      className="fill-[#1F2937] text-[8px] font-black"
                    >
                      {region.foods.length}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* 도시 정보 패널 */}
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          {selectedRegion ? (
            <div
              key={selectedRegion.code}
              className="bg-white rounded-2xl shadow-lg border border-mist p-6"
              style={{ animation: 'fadeSlideLeft 0.3s ease-out' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedRegion.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-ink">
                    {getL(selectedRegion.name, locale)}
                  </h3>
                  <p className="text-xs text-stone">
                    {t('map.foods', { count: selectedRegion.foods.length })}
                  </p>
                </div>
              </div>

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
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        .animate-dash {
          stroke-dashoffset: 50;
          animation: dash 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
