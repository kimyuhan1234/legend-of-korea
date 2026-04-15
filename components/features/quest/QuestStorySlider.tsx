'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface StoryCard {
  image: string
  textKey: string
}

interface QuestStorySliderProps {
  storyCards: StoryCard[]
}

export function QuestStorySlider({ storyCards }: QuestStorySliderProps) {
  const t = useTranslations('quest')
  const [current, setCurrent] = useState(0)
  const touchStart = useRef(0)

  const cards = [
    ...storyCards,
    { image: '', textKey: 'story.ctaCard' },
  ]

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : cards.length - 1))
  const next = () => setCurrent((c) => (c < cards.length - 1 ? c + 1 : 0))

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  const scrollToKit = () => {
    document.getElementById('kit-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isLast = current === cards.length - 1

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-10">
          {t('story.title')}
        </h2>

        <div
          className="relative overflow-hidden rounded-3xl bg-cloud shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {isLast ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="text-6xl mb-6">🏰</div>
              <h3 className="text-2xl font-black text-[#111] mb-3">
                {t('story.ctaCard')}
              </h3>
              <button
                onClick={scrollToKit}
                className="mt-4 px-8 py-3 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-bold hover:bg-[#7BC8BC] transition-colors"
              >
                {t('story.cta')}
              </button>
            </div>
          ) : (
            <div className="md:flex">
              <div className="relative w-full md:w-1/2 aspect-[4/3]">
                <Image
                  src={cards[current].image}
                  alt={`Story ${current + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 flex items-center">
                <p className="text-base md:text-lg text-[#374151] leading-relaxed">
                  {t(cards[current].textKey as Parameters<typeof t>[0])}
                </p>
              </div>
            </div>
          )}

          {/* 좌우 화살표 */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow text-[#111] font-bold hover:bg-white transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow text-[#111] font-bold hover:bg-white transition-colors"
          >
            ›
          </button>
        </div>

        {/* 점 인디케이터 */}
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? 'bg-mint-deep w-6' : 'bg-[#D1D5DB]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
