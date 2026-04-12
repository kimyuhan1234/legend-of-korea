'use client'

import { useTranslations } from 'next-intl'

export function GoodsHero() {
  const t = useTranslations('goods')

  return (
    <section className="bg-gradient-to-br from-[#9DD8CE] to-[#7BC8BC] text-white py-16 md:py-20 px-6 md:px-10 text-center">
      <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-4">
        GOODS
      </span>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">
        {t('title')}
      </h1>
      <p className="mt-3 text-white/80 text-sm md:text-base">{t('subtitle')}</p>
    </section>
  )
}
