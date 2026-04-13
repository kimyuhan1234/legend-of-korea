'use client'

import Image from 'next/image'

interface HeroSectionProps {
  cta: string
}

export function HeroSection({ cta }: HeroSectionProps) {
  return (
    <section className="relative h-screen overflow-hidden bg-[#1F2937]">
      <Image
        src="/images/dokkaebi-hero.png"
        alt="Legend of Korea"
        fill
        sizes="100vw"
        quality={90}
        className="object-cover"
        priority
      />
      {/* 자세히 알아보기 — 카테고리 섹션으로 스크롤 */}
      <button
        onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4B5563] hover:text-white transition-colors animate-bounce"
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
