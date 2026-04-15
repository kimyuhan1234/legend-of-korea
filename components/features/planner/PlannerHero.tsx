'use client'

import { useTranslations } from 'next-intl'

interface PlannerHeroProps {
  itemCount: number
}

export function PlannerHero({ itemCount }: PlannerHeroProps) {
  const t = useTranslations('planner')

  return (
    <section className="bg-gradient-to-br from-mint to-blossom text-ink py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-4">
          📋 MY PLANNER
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-white/80 text-base md:text-lg">
          {t('hero.subtitle')}
        </p>
        <p className="mt-3 text-sm text-mint-deep font-bold">
          {t('hero.itemCount', { count: itemCount })}
        </p>
      </div>
    </section>
  )
}
