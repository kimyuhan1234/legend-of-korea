'use client'

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'

interface Tab {
  key: string
  label: string
  content: ReactNode
}

interface DupeSwipeContainerProps {
  tabs: Tab[]
  defaultIndex?: number
}

/**
 * Ref-based drag — zero re-renders during swipe gesture.
 * Only `setActive` (on drag end / tab click) triggers a React render.
 * This prevents 60+/sec state updates that were propagating through
 * WorldDupeMap / useTranslations and potentially triggering Next.js
 * internal router history state updates.
 */
export function DupeSwipeContainer({ tabs, defaultIndex = 0 }: DupeSwipeContainerProps) {
  const [active, setActive] = useState(defaultIndex)
  const count = tabs.length

  const draggingRef = useRef(false)
  const startXRef = useRef(0)
  const offsetRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // Direct DOM update — no setState → no re-render during drag
  const applyTransform = useCallback(
    (activeIdx: number, offset: number, animate: boolean) => {
      const cw = containerRef.current?.offsetWidth ?? 0
      const dragPct = cw > 0 ? (offset / cw) * 100 : 0
      if (sliderRef.current) {
        sliderRef.current.style.transition = animate ? 'transform 0.35s ease' : 'none'
        sliderRef.current.style.transform = `translateX(${-(activeIdx * 100) + dragPct}%)`
      }
      if (indicatorRef.current) {
        indicatorRef.current.style.transition = animate ? 'left 0.3s ease' : 'none'
        indicatorRef.current.style.left = `${(activeIdx * 100) / count + dragPct / count}%`
      }
    },
    [count],
  )

  // Keep DOM in sync whenever active changes (e.g., tab button click)
  useEffect(() => {
    applyTransform(active, 0, true)
  }, [active, applyTransform])

  const goTo = useCallback(
    (idx: number) => {
      offsetRef.current = 0
      setActive(Math.max(0, Math.min(count - 1, idx)))
    },
    [count],
  )

  const endDrag = useCallback(
    (activeIdx: number) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      const dx = offsetRef.current
      if (dx < -50 && activeIdx < count - 1) {
        goTo(activeIdx + 1)
      } else if (dx > 50 && activeIdx > 0) {
        goTo(activeIdx - 1)
      } else {
        offsetRef.current = 0
        applyTransform(activeIdx, 0, true)
      }
    },
    [count, goTo, applyTransform],
  )

  // Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    draggingRef.current = true
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return
    const dx = e.touches[0].clientX - startXRef.current
    offsetRef.current = dx
    applyTransform(active, dx, false)
  }
  const handleTouchEnd = () => endDrag(active)

  // Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX
    draggingRef.current = true
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - startXRef.current
    offsetRef.current = dx
    applyTransform(active, dx, false)
  }
  const handleMouseUp = () => endDrag(active)

  return (
    <div>
      {/* 탭 인디케이터 */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <div className="relative">
          <div className="flex">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => goTo(i)}
                className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
                  i === active ? 'text-mint-deep' : 'text-stone hover:text-slate'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* 슬라이딩 바 */}
          <div className="relative h-0.5 bg-mist rounded-full">
            <div
              ref={indicatorRef}
              className="absolute top-0 h-full bg-mint-deep rounded-full"
              style={{
                width: `${100 / count}%`,
                left: `${(active * 100) / count}%`,
                transition: 'left 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* 스와이프 영역 */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={sliderRef}
          className="flex"
          style={{
            transform: `translateX(${-(active * 100)}%)`,
            transition: 'transform 0.35s ease',
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className="w-full shrink-0"
              style={{ minHeight: '200px' }}
            >
              <div className="max-w-4xl mx-auto px-4 py-6">
                {tab.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
