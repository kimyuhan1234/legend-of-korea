'use client'

import Link from 'next/link'

interface SlideFeaturePlannerProps {
  locale: string
  title: string
  subtitle: string
  cta: string
}

export function SlideFeaturePlanner({ locale, title, subtitle, cta }: SlideFeaturePlannerProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
      {/* 좌: 텍스트 */}
      <div className="md:w-[280px] lg:w-[320px] shrink-0 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-black text-[#FF6B35] leading-tight mb-3">
          {title}
        </h2>
        <p className="text-lg font-medium text-[#2D1B69] mb-8">
          {subtitle}
        </p>
        <Link
          href={`/${locale}/planner`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B35] text-white font-bold hover:bg-[#E55A2B] transition-colors"
        >
          {cta}
        </Link>
      </div>

      {/* 우: 플래너 비주얼 */}
      <div className="flex-1 relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="flex items-center justify-center gap-3 text-5xl md:text-6xl mb-4">
            <span>📋</span>
            <span>🗺️</span>
            <span>✈️</span>
            <span>🏯</span>
          </div>
          <p className="text-[80px] md:text-[100px] font-black text-[#FF6B35]/10 leading-none select-none">
            PLANNER
          </p>
        </div>
      </div>
    </div>
  )
}
