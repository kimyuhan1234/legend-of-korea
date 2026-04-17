'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import type { Region } from '@/lib/data/food-dupes'

interface KoreaMapCitySelectorProps {
  regions: Region[]
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as string] || field.en || field.ko
}

// 확정 좌표 (드래그 도구로 실측)
const CITY_POS: Record<string, { top: string; left: string }> = {
  seoul: { top: '27.4%', left: '40.6%' },
  yongin: { top: '34.6%', left: '43.8%' },
  icheon: { top: '34%', left: '48.4%' },
  cheonan: { top: '40.8%', left: '42.4%' },
  jeonju: { top: '56.4%', left: '43.4%' },
  gyeongju: { top: '58.2%', left: '76%' },
  tongyeong: { top: '73.6%', left: '60.6%' },
  busan: { top: '67.4%', left: '72.2%' },
  jeju: { top: '96%', left: '35.8%' },
}

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
        {/* 지도 이미지 + 도시 마커 */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative w-full max-w-[500px] mx-auto">
            <Image
              src="/images/korea-map.png"
              alt="Korea Map"
              width={500}
              height={600}
              className="w-full h-auto rounded-2xl"
              priority
            />

            {regions.map((region) => {
              const pos = CITY_POS[region.code]
              if (!pos) return null
              const isSelected = selected === region.code

              return (
                <button
                  key={region.code}
                  type="button"
                  onClick={() => setSelected(isSelected ? null : region.code)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-0.5 transition-transform duration-200 z-10 ${
                    isSelected ? 'scale-125' : 'hover:scale-125'
                  }`}
                  style={{ top: pos.top, left: pos.left }}
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
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold text-white bg-ink/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {t('map.foods', { count: region.foods.length })}
                  </span>
                </button>
              )
            })}
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
