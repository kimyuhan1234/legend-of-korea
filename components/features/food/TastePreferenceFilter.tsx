'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface TasteProfile {
  sweet: number; salty: number; spicy: number; umami: number; sour: number
}

interface TastePreferenceFilterProps {
  onSearch: (pref: TasteProfile) => void
  isLoading: boolean
}

const SLIDERS: Array<{ key: keyof TasteProfile; labelKey: string; emoji: string }> = [
  { key: 'spicy', labelKey: 'dupe.taste.spicy', emoji: '🌶️' },
  { key: 'sweet', labelKey: 'dupe.taste.sweet', emoji: '🍬' },
  { key: 'salty', labelKey: 'dupe.taste.salty', emoji: '🧂' },
  { key: 'umami', labelKey: 'dupe.taste.umami', emoji: '🍖' },
  { key: 'sour', labelKey: 'dupe.taste.sour', emoji: '🍋' },
]

const PRESETS: Array<{
  key: string; labelKey: string; profile: TasteProfile
}> = [
  { key: 'spicy', labelKey: 'dupe.taste.preset.spicy', profile: { spicy: 90, umami: 60, salty: 50, sweet: 20, sour: 30 } },
  { key: 'sweet', labelKey: 'dupe.taste.preset.sweet', profile: { sweet: 90, sour: 40, umami: 30, salty: 20, spicy: 10 } },
  { key: 'umami', labelKey: 'dupe.taste.preset.umami', profile: { umami: 90, salty: 60, sweet: 30, spicy: 40, sour: 20 } },
  { key: 'balanced', labelKey: 'dupe.taste.preset.balanced', profile: { sweet: 50, salty: 50, spicy: 50, umami: 50, sour: 50 } },
]

const DEFAULT: TasteProfile = { sweet: 50, salty: 50, spicy: 50, umami: 50, sour: 50 }

export function TastePreferenceFilter({ onSearch, isLoading }: TastePreferenceFilterProps) {
  const t = useTranslations()
  const [pref, setPref] = useState<TasteProfile>({ ...DEFAULT })
  const [activePreset, setActivePreset] = useState<string | null>('balanced')

  const handleSlider = (key: keyof TasteProfile, value: number) => {
    setPref((p) => ({ ...p, [key]: value }))
    setActivePreset(null)
  }

  const handlePreset = (preset: typeof PRESETS[number]) => {
    setPref({ ...preset.profile })
    setActivePreset(preset.key)
  }

  const handleReset = () => {
    setPref({ ...DEFAULT })
    setActivePreset('balanced')
  }

  return (
    <div className="bg-white rounded-3xl border border-mist p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('dupe.taste.title')}
        </h2>
        <p className="text-sm text-stone">{t('dupe.taste.subtitle')}</p>
      </div>

      {/* 슬라이더 */}
      <div className="space-y-5 mb-6 max-w-md mx-auto">
        {SLIDERS.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-slate">
                {s.emoji} {t(s.labelKey as Parameters<typeof t>[0]) as string}
              </span>
              <span className="text-sm font-black text-mint-deep w-8 text-right">
                {pref[s.key]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pref[s.key]}
              onChange={(e) => handleSlider(s.key, Number(e.target.value))}
              className="w-full h-2 bg-mist rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mint-deep [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
        ))}
      </div>

      {/* 프리셋 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => handlePreset(p)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activePreset === p.key
                ? 'bg-mint-light text-mint-deep border border-mint'
                : 'bg-cloud text-slate border border-mist hover:bg-mist'
            }`}
          >
            {t(p.labelKey as Parameters<typeof t>[0]) as string}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 rounded-full bg-mist text-stone font-bold text-sm hover:opacity-80 transition-opacity"
        >
          {t('dupe.taste.reset')}
        </button>
        <button
          type="button"
          onClick={() => onSearch(pref)}
          disabled={isLoading}
          className="px-6 py-3 rounded-full bg-mint-deep text-white font-bold text-sm hover:bg-[#7BC8BC] transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? '...' : t('dupe.taste.search')}
        </button>
      </div>
    </div>
  )
}
