'use client'

import Link from 'next/link'
import Image from 'next/image'

interface SlideFeatureDupeProps {
  locale: string
  title: string
  subtitle: string
  cta: string
}

export function SlideFeatureDupe({ locale, title, subtitle, cta }: SlideFeatureDupeProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center">
      {/* 좌: 텍스트 */}
      <div className="md:w-[280px] lg:w-[320px] shrink-0 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-black text-ink leading-tight mb-2 md:mb-3">
          {title}
        </h2>
        <p className="text-base md:text-lg font-medium text-mint-deep mb-4 md:mb-8">
          {subtitle}
        </p>
        <Link
          href={`/${locale}/food/dupe`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-bold hover:bg-[#374151] transition-colors"
        >
          {cta}
        </Link>
      </div>

      {/* 우: DUPE 대표 이미지 */}
      <div className="flex-1 relative aspect-[4/3] overflow-hidden rounded-2xl group">
        <Image
          src="/images/matching/dupe-hero.png"
          alt="Food Dupe Matching"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          quality={90}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  )
}
