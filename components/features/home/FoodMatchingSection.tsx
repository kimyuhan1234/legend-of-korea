'use client'

import Link from 'next/link'
import Image from 'next/image'

interface FoodMatchingSectionProps {
  locale: string
  title: string
  subtitle: string
  cta: string
}

const MATCHING_IMAGES = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `/images/matching/matching${n}.png`)

export function FoodMatchingSection({ locale, title, subtitle, cta }: FoodMatchingSectionProps) {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* 좌: 텍스트 */}
          <div className="md:w-[280px] lg:w-[320px] shrink-0 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-[#2D1B69] leading-tight mb-3">
              {title}
            </h2>
            <p className="text-lg font-medium text-[#FF6B35] mb-8">
              {subtitle}
            </p>
            <Link
              href={`/${locale}/food/dupe`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D1B69] text-white font-bold hover:bg-[#3d2880] transition-colors"
            >
              {cta}
            </Link>
          </div>

          {/* 우: 4×2 이미지 그리드 */}
          <div className="flex-1 grid grid-cols-4 gap-2">
            {MATCHING_IMAGES.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-lg group"
              >
                <Image
                  src={src}
                  alt={`매칭 이미지 ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 15vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
