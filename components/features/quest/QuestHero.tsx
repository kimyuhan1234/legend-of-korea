'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface QuestHeroProps {
  title: string
  region: string
  thumbnail: string
  difficulty: string
  duration: string
  missionCount: number
}

export function QuestHero({ title, region, thumbnail, difficulty, duration, missionCount }: QuestHeroProps) {
  const t = useTranslations('quest')

  const scrollToKit = () => {
    document.getElementById('kit-purchase')?.scrollIntoView({ behavior: 'smooth' })
  }

  const diffLabel: Record<string, string> = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' }

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#111]">
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="100vw"
        quality={90}
        className="object-cover object-top opacity-40"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-br from-mint to-blossom text-ink text-xs font-black uppercase tracking-widest mb-4">
          🔥 {title}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight max-w-3xl leading-tight">
          {t('hero.headline')}
        </h1>
        <p className="mt-3 text-slate text-base md:text-lg max-w-xl">
          {t('hero.subline')}
        </p>

        <div className="flex gap-3 mt-8">
          <a
            href="#"
            className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-colors"
          >
            ▶ {t('hero.preview')}
          </a>
          <button
            onClick={scrollToKit}
            className="px-6 py-3 rounded-full bg-gradient-to-br from-mint to-blossom text-ink text-sm font-bold hover:bg-[#7BC8BC] transition-colors"
          >
            {t('hero.buy')}
          </button>
        </div>

        <div className="flex gap-6 mt-10 text-slate text-sm">
          <span>📍 {region}</span>
          <span>⏱️ {duration}</span>
          <span>{diffLabel[difficulty] || '⭐'} {t('hero.missions', { count: missionCount })}</span>
        </div>
      </div>
    </section>
  )
}
