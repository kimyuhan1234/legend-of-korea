'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavLink {
  href: string
  label: string
}

interface Props {
  locale: string
  links: NavLink[]
}

export function NavbarTabs({ locale, links }: Props) {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' })
  }

  return (
    <div className="hidden md:flex items-center flex-1 justify-center min-w-0 relative">
      {/* 왼쪽 화살표 */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-mist shadow-sm hover:bg-cloud transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={14} className="text-slate" />
        </button>
      )}

      {/* 탭 목록 */}
      <div
        ref={scrollRef}
        className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide mx-8"
      >
        {links.map((link) => {
          const fullHref = `/${locale}${link.href}`
          const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/')

          return (
            <Link
              key={link.href}
              href={fullHref}
              className={`shrink-0 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'text-mint-deep bg-mint-deep/10 font-bold'
                  : 'text-slate hover:text-mint-deep hover:bg-mint-deep/5'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* 오른쪽 화살표 */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-mist shadow-sm hover:bg-cloud transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={14} className="text-slate" />
        </button>
      )}
    </div>
  )
}
