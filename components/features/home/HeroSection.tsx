'use client'

import Image from 'next/image'

interface HeroSectionProps {
  tagline: string
  title: string
  cta: string
}

export function HeroSection({ tagline, title, cta }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#2D1B69]">
      <div className="absolute inset-0">
        <Image
          src="/images/dokkaebi-hero.png"
          alt="Legend of Korea hero"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#2D1B69]/80" />
      </div>

      {/* 중앙 텍스트 */}
      <div className="relative text-center text-white px-4 flex flex-col items-center">
        <p className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-white/70 mb-4">
          {tagline}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8">
          {title}
        </h1>
        <button
          onClick={() => {
            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="px-8 py-4 rounded-full bg-[#FF6B35] text-white font-bold text-base hover:bg-[#E55A2B] transition-colors shadow-lg shadow-[#FF6B35]/30"
        >
          {cta}
        </button>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
