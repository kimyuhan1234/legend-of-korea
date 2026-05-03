'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavLink {
  href: string
  label: string
}

interface SubMenuItem {
  href: string
  icon: string
  label: Record<string, string>
}

/**
 * 4개 탭 hover 시 표시되는 드롭다운 메뉴.
 * 각 탭의 실제 하위 페이지 구조(/discover 6 카드, /story 2 탭, /pass 3 패스, /community 2 카드)와 1:1 매칭.
 */
const SUB_MENUS: Record<string, SubMenuItem[]> = {
  '/discover': [
    { href: '/stay',    icon: '🏨', label: { ko: 'STAY',    ja: 'STAY',    en: 'STAY',    'zh-CN': 'STAY',    'zh-TW': 'STAY' } },
    { href: '/food',    icon: '🍜', label: { ko: 'K-FOOD',  ja: 'K-FOOD',  en: 'K-FOOD',  'zh-CN': 'K-FOOD',  'zh-TW': 'K-FOOD' } },
    { href: '/ootd',    icon: '👗', label: { ko: 'OOTD',    ja: 'OOTD',    en: 'OOTD',    'zh-CN': 'OOTD',    'zh-TW': 'OOTD' } },
    { href: '/traffic', icon: '🚄', label: { ko: 'TRAFFIC', ja: 'TRAFFIC', en: 'TRAFFIC', 'zh-CN': 'TRAFFIC', 'zh-TW': 'TRAFFIC' } },
    { href: '/sights',  icon: '📍', label: { ko: 'SPOT',    ja: 'SPOT',    en: 'SPOT',    'zh-CN': 'SPOT',    'zh-TW': 'SPOT' } },
    { href: '/gallery', icon: '🖼️', label: { ko: 'GALLERY', ja: 'GALLERY', en: 'GALLERY', 'zh-CN': 'GALLERY', 'zh-TW': 'GALLERY' } },
  ],
  '/story': [
    { href: '/story?tab=mission-kit', icon: '🗺️', label: { ko: '디지털 퀘스트', ja: 'デジタルクエスト', en: 'Digital Quests', 'zh-CN': '数字任务',     'zh-TW': '數位任務' } },
    { href: '/story?tab=special',     icon: '🚔', label: { ko: '스페셜 이벤트', ja: 'スペシャルイベント', en: 'Special Event', 'zh-CN': '特别活动',     'zh-TW': '特別活動' } },
  ],
  '/pass': [
    { href: '/pass#short',    icon: '🌱', label: { ko: 'Short Pass',    ja: 'Short Pass',    en: 'Short Pass',    'zh-CN': '短期通票', 'zh-TW': '短期通票' } },
    { href: '/pass#standard', icon: '⭐', label: { ko: 'Standard Pass', ja: 'Standard Pass', en: 'Standard Pass', 'zh-CN': '标准通票', 'zh-TW': '標準通票' } },
    { href: '/pass#long',     icon: '🏆', label: { ko: 'Long Pass',     ja: 'Long Pass',     en: 'Long Pass',     'zh-CN': '长期通票', 'zh-TW': '長期通票' } },
  ],
  '/community': [
    { href: '/memories', icon: '📸', label: { ko: 'MEMORIES', ja: 'MEMORIES', en: 'MEMORIES', 'zh-CN': 'MEMORIES', 'zh-TW': 'MEMORIES' } },
    { href: '/diy',      icon: '🎨', label: { ko: 'DIY',      ja: 'DIY',      en: 'DIY',      'zh-CN': 'DIY',      'zh-TW': 'DIY' } },
  ],
}

interface Props {
  locale: string
  links: NavLink[]
}

export function NavbarTabs({ locale, links }: Props) {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [dropLeft, setDropLeft] = useState(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  function openSubMenu(href: string) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    const tabEl = tabRefs.current.get(href)
    const navEl = navRef.current
    if (tabEl && navEl) {
      const tr = tabEl.getBoundingClientRect()
      const nr = navEl.getBoundingClientRect()
      setDropLeft(tr.left + tr.width / 2 - nr.left)
    }
    setOpenMenu(href)
  }

  function scheduleClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 150)
  }

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="hidden md:flex items-center flex-1 justify-center min-w-0 relative"
    >
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
          const hasSubMenu = !!SUB_MENUS[link.href]

          return (
            <div
              key={link.href}
              ref={(el) => {
                if (el) tabRefs.current.set(link.href, el)
                else tabRefs.current.delete(link.href)
              }}
              onMouseEnter={() => hasSubMenu && openSubMenu(link.href)}
              onMouseLeave={scheduleClose}
              className="shrink-0"
            >
              <Link
                href={fullHref}
                className={`block px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-mint-deep bg-mint-deep/10 font-bold'
                    : 'text-slate hover:text-mint-deep hover:bg-mint-deep/5'
                }`}
                aria-haspopup={hasSubMenu ? 'menu' : undefined}
                aria-expanded={hasSubMenu ? openMenu === link.href : undefined}
              >
                {link.label}
              </Link>
            </div>
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

      {/* 드롭다운 메뉴 — scroll container 밖 absolute (overflow 클리핑 회피).
          left: 호버된 탭 중심에 정렬. translate-x-50% 로 중심 정렬. */}
      {openMenu && SUB_MENUS[openMenu] && (
        <div
          className="absolute top-full mt-1 z-50"
          style={{ left: `${dropLeft}px`, transform: 'translateX(-50%)' }}
          onMouseEnter={() => openSubMenu(openMenu)}
          onMouseLeave={scheduleClose}
          role="menu"
        >
          <div className="bg-white rounded-2xl shadow-lg shadow-[#1F2937]/10 border border-mist py-2 min-w-[200px]">
            {SUB_MENUS[openMenu].map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate hover:bg-cloud hover:text-mint-deep transition-colors"
                onClick={() => setOpenMenu(null)}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label[locale] ?? item.label.en}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
