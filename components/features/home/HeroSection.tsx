'use client'

import Link from 'next/link'

interface Props {
  cta: string
  locale: string
}

const PASS_BUTTONS = [
  { id: 'move', name: 'Move', icon: '🚗', price: '₩6,900', special: false },
  { id: 'live', name: 'Live', icon: '🍜', price: '₩6,900', special: false },
  { id: 'story', name: 'Story', icon: '📖', price: '₩9,900', special: false },
  { id: 'allinone', name: 'All in One', icon: '👑', price: '₩19,900', special: true },
]

export function HeroSection({ cta, locale }: Props) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#1F2937]">
      {/* 배경 영상 */}
      <video
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/dokkaebi-hero.png"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 어두운 오버레이 — 버튼 가독성 확보 */}
      <div className="absolute inset-0 bg-black/25" />

      {/* 데스크탑: 오른쪽 세로 패스 버튼 */}
      <div className="hidden md:flex absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 z-10 flex-col gap-3">
        {PASS_BUTTONS.map((pass) => (
          <Link
            key={pass.id}
            href={`/${locale}/pass`}
            className={[
              'flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all backdrop-blur-md border',
              pass.special
                ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 border-amber-400/40 hover:from-amber-500/35 hover:to-rose-500/35'
                : 'bg-white/15 border-white/20 hover:bg-white/25',
            ].join(' ')}
          >
            <span className="text-2xl">{pass.icon}</span>
            <div>
              <p className="text-white font-black text-sm leading-tight">{pass.name}</p>
              <p className={`text-[10px] font-bold ${pass.special ? 'text-amber-300' : 'text-white/60'}`}>
                {pass.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 모바일: 하단 2x2 패스 버튼 */}
      <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
        <div className="grid grid-cols-2 gap-2">
          {PASS_BUTTONS.map((pass) => (
            <Link
              key={pass.id}
              href={`/${locale}/pass`}
              className={[
                'flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all backdrop-blur-md border',
                pass.special
                  ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 border-amber-400/40'
                  : 'bg-white/15 border-white/20',
              ].join(' ')}
            >
              <span className="text-lg">{pass.icon}</span>
              <div>
                <p className="text-white font-black text-xs leading-tight">{pass.name}</p>
                <p className={`text-[9px] font-bold ${pass.special ? 'text-amber-300' : 'text-white/60'}`}>
                  {pass.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 자세히 알아보기 — 카테고리 섹션으로 스크롤 (기존 유지) */}
      <button
        onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors animate-bounce z-10"
        aria-label={cta}
      >
        <span className="text-sm font-medium">{cta}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </section>
  )
}
