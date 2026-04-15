'use client'

import { useTranslations } from 'next-intl'

export function StayHero() {
  const t = useTranslations('stay')

  return (
    <section className="relative bg-gradient-to-br from-mint to-blossom text-ink py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-4">
          STAY
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          {t('hero.headline')}
        </h1>
        <p className="mt-4 text-white/80 text-base md:text-lg max-w-2xl mx-auto">
          {t('hero.subline')}
        </p>

        {/* 차별점 배너 */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            🗺️ {t('hero.badge1')}
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            🌍 {t('hero.badge2')}
          </span>
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            💰 {t('hero.badge3')}
          </span>
        </div>
      </div>
    </section>
  )
}
