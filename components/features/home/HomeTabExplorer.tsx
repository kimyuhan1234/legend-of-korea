'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

interface TabItem {
  key: string
  label: string
  href: string
  image: string
  descKey: string
}

const TABS: TabItem[] = [
  { key: 'ootd', label: 'OOTD', href: '/ootd', image: '/images/explore/ootd.png', descKey: 'explore.ootd' },
  { key: 'kfood', label: 'K-Food', href: '/food', image: '/images/explore/kfood.png', descKey: 'explore.kfood' },
  { key: 'stay', label: 'STAY', href: '/stay', image: '/images/explore/stay.png', descKey: 'explore.stay' },
  { key: 'quest', label: 'QUEST', href: '/story', image: '/images/explore/quest.png', descKey: 'explore.quest' },
  { key: 'spot', label: 'SPOT', href: '/sights', image: '/images/explore/spot.png', descKey: 'explore.spot' },
  { key: 'goods', label: 'GOODS', href: '/goods', image: '/images/explore/goods.png', descKey: 'explore.goods' },
  { key: 'diy', label: 'DIY', href: '/diy', image: '/images/explore/diy.png', descKey: 'explore.diy' },
]

export function HomeTabExplorer() {
  const t = useTranslations('home')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const touchStartX = useRef(0)
  const timerResetRef = useRef(0)

  const count = TABS.length
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count])

  // 자동 전환 5초 — 호버/터치 시 정지
  useEffect(() => {
    if (hovered) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [hovered, next, timerResetRef.current])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev()
      timerResetRef.current += 1
    }
  }

  const tab = TABS[active]
  const desc = t(tab.descKey as Parameters<typeof t>[0]) as string

  return (
    <section
      className="bg-[#FAFBFC] py-12 md:py-16"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-center text-xl md:text-2xl font-black text-[#1F2937] mb-8 md:mb-10">
          {t('explore.title')}
        </h2>

        {/* ─── 데스크톱: 3단 그리드 ─── */}
        <div className="hidden md:grid grid-cols-[200px_1fr_1fr] gap-6 h-[460px]">
          {/* 왼쪽 — 메뉴 */}
          <div className="flex flex-col justify-center gap-1">
            {TABS.map((item, i) => {
              const isActive = i === active
              return (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  onMouseEnter={() => setActive(i)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-bold transition-all duration-300 ${
                    isActive
                      ? 'text-[#9DD8CE] bg-[#9DD8CE]/5'
                      : 'text-[#9CA3AF] hover:text-[#6B7280]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-[#9DD8CE]" />
                  )}
                  <span className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    ►
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* 중앙 — 이미지 */}
          <Link
            href={`/${locale}${tab.href}`}
            className="relative overflow-hidden rounded-2xl"
          >
            {TABS.map((item, i) => (
              <div
                key={item.key}
                className="absolute inset-0 transition-opacity duration-400"
                style={{
                  opacity: i === active ? 1 : 0,
                  transitionDuration: '400ms',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="40vw"
                  quality={85}
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </Link>

          {/* 오른쪽 — 설명 + CTA */}
          <div className="flex flex-col justify-center px-4">
            <div
              key={active}
              className="animate-fadeSlideUp"
            >
              <p className="text-sm font-black text-[#9DD8CE] uppercase tracking-widest mb-2">
                {tab.label}
              </p>
              <h3 className="text-2xl font-black text-[#111] mb-4 leading-snug">
                {tab.label}
              </h3>
              <p className="text-base text-[#6B7280] leading-relaxed mb-6">
                {desc}
              </p>
              <Link
                href={`/${locale}${tab.href}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#9DD8CE] hover:text-[#7BC8BC] transition-colors"
              >
                {t('explore.more')}
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 모바일: 풀스크린 카드 자동 슬라이드 ─── */}
        <div
          className="md:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform ease-in-out"
              style={{
                transform: `translateX(-${active * 100}%)`,
                transitionDuration: '500ms',
              }}
            >
              {TABS.map((item) => {
                const itemDesc = t(item.descKey as Parameters<typeof t>[0]) as string
                return (
                  <div key={item.key} className="w-full shrink-0">
                    <Link href={`/${locale}${item.href}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          sizes="100vw"
                          quality={85}
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="bg-white rounded-b-2xl p-5">
                      <p className="text-xs font-black text-[#9DD8CE] uppercase tracking-widest mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm text-[#374151] leading-relaxed mb-3">
                        {itemDesc}
                      </p>
                      <Link
                        href={`/${locale}${item.href}`}
                        className="text-sm font-bold text-[#9DD8CE] hover:text-[#7BC8BC]"
                      >
                        {t('explore.more')}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 점 인디케이터 */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {TABS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); timerResetRef.current += 1 }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === active ? 'bg-[#9DD8CE]' : 'bg-[#D1D5DB]'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp { animation: fadeSlideUp 0.4s ease-out; }
      `}</style>
    </section>
  )
}
