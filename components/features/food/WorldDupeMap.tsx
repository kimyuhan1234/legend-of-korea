'use client'

import { useTranslations } from 'next-intl'
import { COUNTRIES } from '@/lib/utils/country-dupe-aggregator'

interface WorldDupeMapProps {
  onCountrySelect: (code: string) => void
  selectedCountry: string | null
  countryCounts: Record<string, number>
  locale: string
}

// 국가별 지도 위 대략적 CSS 위치 (%) — aspect-ratio 2/1 기준
const POSITIONS: Record<string, { top: string; left: string }> = {
  US: { top: '35%', left: '12%' },
  MX: { top: '50%', left: '15%' },
  FR: { top: '28%', left: '45%' },
  ES: { top: '34%', left: '42%' },
  IT: { top: '32%', left: '49%' },
  IN: { top: '48%', left: '65%' },
  TH: { top: '52%', left: '72%' },
  VN: { top: '50%', left: '76%' },
  MY: { top: '60%', left: '74%' },
  ID: { top: '68%', left: '77%' },
  CN: { top: '35%', left: '74%' },
  JP: { top: '32%', left: '83%' },
}

function getL(field: { ko: string; en: string; ja: string }, locale: string): string {
  return field[locale as 'ko' | 'en' | 'ja'] || field.ko
}

export function WorldDupeMap({ onCountrySelect, selectedCountry, countryCounts, locale }: WorldDupeMapProps) {
  const t = useTranslations('dupe')
  const codes = Object.keys(COUNTRIES)

  return (
    <div>
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('world.title')}
        </h2>
        <p className="text-sm text-stone">{t('world.subtitle')}</p>
      </div>

      {/* 데스크톱: 지도 */}
      <div className="hidden md:block relative aspect-[2/1] max-w-3xl mx-auto bg-sky-light/30 rounded-3xl border border-mist overflow-hidden mb-6">
        {/* 한국 표시 */}
        <div
          className="absolute z-10 flex flex-col items-center"
          style={{ top: '30%', left: '80%' }}
        >
          <span className="text-2xl">📍</span>
          <span className="text-[9px] font-black text-mint-deep bg-white/80 px-1.5 py-0.5 rounded">
            {t('world.korea')}
          </span>
        </div>

        {/* 12개 국가 버튼 */}
        {codes.map((code) => {
          const pos = POSITIONS[code]
          if (!pos) return null
          const meta = COUNTRIES[code]
          const count = countryCounts[code] ?? 0
          const isSelected = selectedCountry === code

          return (
            <button
              key={code}
              type="button"
              onClick={() => onCountrySelect(code)}
              className={`absolute z-20 group flex flex-col items-center transition-transform duration-200 ${
                isSelected ? 'scale-125' : 'hover:scale-125'
              }`}
              style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
              title={getL(meta.name, locale)}
            >
              <span className={`text-3xl leading-none ${isSelected ? 'drop-shadow-lg' : ''}`}>
                {meta.flag}
              </span>
              <span className={`mt-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                isSelected
                  ? 'bg-mint-deep text-white'
                  : 'bg-blossom text-blossom-deep'
              }`}>
                {count}
              </span>
              {/* 호버 툴팁 */}
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-ink bg-white/90 px-2 py-0.5 rounded shadow whitespace-nowrap">
                {getL(meta.name, locale)}
              </span>
              {/* 선택 시 ring */}
              {isSelected && (
                <span className="absolute inset-0 -m-1 rounded-full ring-2 ring-mint-deep ring-offset-2" />
              )}
            </button>
          )
        })}

        {/* 선택된 국가→한국 점선 연결 (단순 CSS) */}
        {selectedCountry && POSITIONS[selectedCountry] && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 50" preserveAspectRatio="none">
            <line
              x1={parseFloat(POSITIONS[selectedCountry].left)}
              y1={parseFloat(POSITIONS[selectedCountry].top) / 2}
              x2={80}
              y2={15}
              stroke="#9DD8CE"
              strokeWidth="0.3"
              strokeDasharray="1,1"
            />
          </svg>
        )}
      </div>

      {/* 모바일: 국기 칩 가로 스크롤 */}
      <div className="md:hidden overflow-x-auto pb-2 mb-6">
        <div className="flex gap-2 w-max px-4">
          {codes.map((code) => {
            const meta = COUNTRIES[code]
            const count = countryCounts[code] ?? 0
            const isSelected = selectedCountry === code
            return (
              <button
                key={code}
                type="button"
                onClick={() => onCountrySelect(code)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition-colors ${
                  isSelected
                    ? 'bg-mint-deep text-white'
                    : 'bg-cloud text-slate border border-mist'
                }`}
              >
                <span className="text-lg">{meta.flag}</span>
                <span>{getL(meta.name, locale)}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-blossom text-blossom-deep'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
