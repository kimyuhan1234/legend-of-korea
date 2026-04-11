'use client'

import { useState, useMemo } from 'react'
import { StayHero } from './StayHero'
import { StayCitySelector } from './StayCitySelector'
import { StayTypeFilter } from './StayTypeFilter'
import { StayGrid } from './StayGrid'
import { StayBookingTip } from './StayBookingTip'
import { StayPlatformLinks } from './StayPlatformLinks'
import {
  STAY_RECOMMENDATIONS,
  type StayType,
  type VibeTag,
} from '@/lib/data/stay-recommendations'

interface StayPageClientProps {
  locale: string
}

export function StayPageClient({ locale }: StayPageClientProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<StayType | 'all'>('all')
  const [selectedVibes, setSelectedVibes] = useState<VibeTag[]>([])

  const toggleVibe = (v: VibeTag) => {
    setSelectedVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  const filtered = useMemo(() => {
    return STAY_RECOMMENDATIONS.filter((s) => {
      if (selectedCity !== 'all' && s.cityId !== selectedCity) return false
      if (selectedType !== 'all' && s.type !== selectedType) return false
      if (selectedVibes.length > 0 && !selectedVibes.some((v) => s.vibe.includes(v))) return false
      return true
    })
  }, [selectedCity, selectedType, selectedVibes])

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <StayHero />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <StayCitySelector selected={selectedCity} onSelect={setSelectedCity} />

        <StayTypeFilter
          selectedType={selectedType}
          selectedVibes={selectedVibes}
          onTypeChange={setSelectedType}
          onVibeToggle={toggleVibe}
        />

        <StayGrid stays={filtered} locale={locale} />

        <StayBookingTip />

        <StayPlatformLinks />
      </main>

      <div className="h-16" />
    </div>
  )
}
