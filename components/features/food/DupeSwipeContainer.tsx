'use client'

import { useState, useRef, useCallback, type ReactNode } from 'react'

interface Tab {
  key: string
  label: string
  content: ReactNode
}

interface DupeSwipeContainerProps {
  tabs: Tab[]
  defaultIndex?: number
}

export function DupeSwipeContainer({ tabs, defaultIndex = 0 }: DupeSwipeContainerProps) {
  const [active, setActive] = useState(defaultIndex)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const currentX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const count = tabs.length

  const goTo = useCallback((idx: number) => {
    setActive(Math.max(0, Math.min(count - 1, idx)))
    setDragOffset(0)
  }, [count])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    currentX.current = startX.current
    setDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return
    currentX.current = e.touches[0].clientX
    const dx = currentX.current - startX.current
    setDragOffset(dx)
  }

  const handleTouchEnd = () => {
    if (!dragging) return
    setDragging(false)
    const dx = currentX.current - startX.current
    if (dx < -50 && active < count - 1) goTo(active + 1)
    else if (dx > 50 && active > 0) goTo(active - 1)
    else setDragOffset(0)
  }

  // Mouse handlers (desktop drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX
    currentX.current = e.clientX
    setDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    currentX.current = e.clientX
    setDragOffset(currentX.current - startX.current)
  }

  const handleMouseUp = () => {
    if (!dragging) return
    setDragging(false)
    const dx = currentX.current - startX.current
    if (dx < -50 && active < count - 1) goTo(active + 1)
    else if (dx > 50 && active > 0) goTo(active - 1)
    else setDragOffset(0)
  }

  const containerWidth = containerRef.current?.offsetWidth ?? 0
  const dragPercent = containerWidth > 0 ? (dragOffset / containerWidth) * 100 : 0
  const translateX = -(active * 100) + (dragging ? dragPercent : 0)

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
              className="absolute top-0 h-full bg-mint-deep rounded-full transition-all duration-300"
              style={{
                width: `${100 / count}%`,
                left: `${(active * 100) / count + (dragging ? dragPercent / count : 0)}%`,
                transitionProperty: dragging ? 'none' : 'left',
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
          className="flex"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: dragging ? 'none' : 'transform 0.35s ease',
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
