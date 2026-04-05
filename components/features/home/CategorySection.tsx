'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  label: string
  href: string
  image: string
  gradient: string
}

interface CategorySectionProps {
  locale: string
  heading: string
  categories: Category[]
}

export function CategorySection({ locale, heading, categories }: CategorySectionProps) {
  return (
    <section id="categories" className="bg-[#FFF8F0] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-[#7a6a58] text-sm md:text-base mb-10 md:mb-14">
          {heading}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}${cat.href}`}
              className="group block"
            >
              {/* 4:5 비율 카드 */}
              <div className="relative w-full overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                style={{ paddingBottom: '125%' }}
              >
                <div className="absolute inset-0">
                  {/* 배경 그라데이션 (이미지 로드 실패 시 fallback) */}
                  <div className={`absolute inset-0 ${cat.gradient}`} />
                  {/* TODO: 카테고리 대표 이미지 */}
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-base md:text-lg">{cat.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
