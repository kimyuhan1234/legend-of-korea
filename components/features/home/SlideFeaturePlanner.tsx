'use client'

import Link from 'next/link'
import Image from 'next/image'

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
        <h2 className="text-2xl md:text-3xl font-black text-[#9DD8CE] leading-tight mb-3">
          {title}
        </h2>
        <p className="text-lg font-medium text-[#1F2937] mb-8">
          {subtitle}
        </p>
        <Link
          href={`/${locale}/planner`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9DD8CE] text-white font-bold hover:bg-[#7BC8BC] transition-colors"
        >
          {cta}
        </Link>
      </div>

      {/* 우: 플래너 대표 이미지 */}
      <div className="flex-1 relative aspect-[4/3] overflow-hidden rounded-2xl group">
        <Image
          src="/images/matching/planner-hero.png"
          alt="Travel Planner"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          quality={90}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  )
}
