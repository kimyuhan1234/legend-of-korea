'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'

interface HomeFeatureCarouselProps {
  children: ReactNode[]
}

export function HomeFeatureCarousel({ children }: HomeFeatureCarouselProps) {
  const count = children.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count])

  // 5초 자동 전환 — 호버 시 일시 정지
  useEffect(() => {
    if (paused || count <= 1) return
    const timer = setInterval(next, 5000)
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
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-12 md:py-20 relative">
        {/* 슬라이드 영역 */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-600 ease-in-out"
            style={{
              transform: `translateX(-${active * 100}%)`,
              transitionDuration: '600ms',
            }}
          >
            {children.map((child, i) => (
              <div key={i} className="w-full shrink-0">
                {child}
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
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/10 text-slate hover:bg-black/30 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* 하단 점 인디케이터 */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === active
                    ? 'bg-[#1F2937]'
                    : 'bg-[#D1D5DB] hover:bg-[#9CA3AF]'
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
