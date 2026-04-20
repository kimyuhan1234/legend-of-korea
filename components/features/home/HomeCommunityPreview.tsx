'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface Props {
  locale: string
}

interface Slide {
  id: 'memories' | 'spot'
  image: string
  titleKey: string
  subtitleKey: string
  ctaKey: string
  href: (locale: string) => string
}

const SLIDES: Slide[] = [
  {
    id: 'memories',
    image: '/images/home/memories-slide.png',
    titleKey: 'slide1Title',
    subtitleKey: 'slide1Subtitle',
    ctaKey: 'slide1Cta',
    href: (locale) => `/${locale}/memories`,
  },
  {
    id: 'spot',
    image: '/images/home/spot-slide.png',
    titleKey: 'slide2Title',
    subtitleKey: 'slide2Subtitle',
    ctaKey: 'slide2Cta',
    href: (locale) => `/${locale}/sights`,
  },
]

const AUTO_INTERVAL_MS = 5000

export function HomeCommunityPreview({ locale }: Props) {
  const t = useTranslations('home.memories')
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)
  const count = SLIDES.length

  const next = useCallback(() => setActive(i => (i + 1) % count), [count])
  const prev = useCallback(() => setActive(i => (i - 1 + count) % count), [count])

  // 자동 슬라이드
  useEffect(() => {
    if (paused || count <= 1) return
    const timer = setInterval(next, AUTO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, next, count])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0) { next() } else { prev() }
    }
  }

  return (
    <section
      className="bg-white overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-12 md:py-20 relative">
        {/* 슬라이드 영역 */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-[600ms] ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {SLIDES.map(slide => (
              <div key={slide.id} className="w-full shrink-0">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                  {/* 좌: 텍스트 */}
                  <div className="md:w-[320px] lg:w-[360px] shrink-0 text-center md:text-left order-2 md:order-1">
                    <h2 className="text-2xl md:text-3xl font-black text-mint-deep leading-tight mb-3">
                      {t(slide.titleKey)}
                    </h2>
                    <p className="text-base md:text-lg font-medium text-ink mb-8 leading-relaxed">
                      {t(slide.subtitleKey)}
                    </p>
                    <Link
                      href={slide.href(locale)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint-deep text-white font-bold hover:bg-[#7BC8BC] transition-colors"
                    >
                      {t(slide.ctaKey)}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* 우: 이미지 */}
                  <div className="flex-1 relative aspect-[4/3] overflow-hidden rounded-2xl group order-1 md:order-2 w-full">
                    <Image
                      src={slide.image}
                      alt={t(slide.titleKey)}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      quality={90}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 좌우 화살표 — 모바일 숨김 */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/10 text-slate hover:bg-black/30 hover:text-white transition-colors z-10"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/10 text-slate hover:bg-black/30 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* 하단 점 인디케이터 */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === active ? 'bg-[#1F2937]' : 'bg-[#D1D5DB] hover:bg-[#9CA3AF]'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
