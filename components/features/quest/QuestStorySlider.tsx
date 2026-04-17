'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface StoryCard {
  image: string
  textKey: string
}

/** region별 전용 영상 맵 — 영상이 있는 코스만 등록 (yongin 제외) */
const STORY_VIDEOS: Record<string, string> = {
  jeonju: '/videos/jeonju.mp4',
  tongyeong: '/videos/tongyeong.mp4',
  gyeongju: '/videos/gyeongju.mp4',
  busan: '/videos/busan.mp4',
  seoul: '/videos/seoul.mp4',
  jeju: '/videos/jeju.mp4',
  cheonan: '/videos/cheonan.mp4',
  icheon: '/videos/icheon.mp4',
}

interface QuestStorySliderProps {
  storyCards: StoryCard[]
  region?: string
}

export function QuestStorySlider({ storyCards, region }: QuestStorySliderProps) {
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
    if (Math.abs(diff) > 50) {
      if (diff > 0) { next() } else { prev() }
    }
  }

  const scrollToKit = () => {
    document.getElementById('kit-purchase')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isLast = current === cards.length - 1

  const videoSrc = region ? STORY_VIDEOS[region] : undefined

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-10">
          {t('story.title')}
        </h2>

        {videoSrc ? (
          /* ─── 영상이 있는 코스: 비디오 플레이어 ─── */
          <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg">
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>
        ) : (
          /* ─── 기본: 이미지+텍스트 슬라이더 ─── */
          <>
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
          </>
        )}
      </div>
    </section>
  )
}
