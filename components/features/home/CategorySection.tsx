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
    <section id="categories" className="bg-[#FFF8F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <p className="text-center text-[#7a6a58] text-sm md:text-base mb-6 md:mb-10">
          {heading}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}${cat.href}`}
              className="group block"
            >
              {/* 3:4 비율 — 이전보다 더 세로로 큰 카드 */}
              <div
                className="relative w-full overflow-hidden rounded-xl shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.03]"
                style={{ paddingBottom: '133%' }}
              >
                <div className="absolute inset-0">
                  <div className={`absolute inset-0 ${cat.gradient}`} />
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
                  <p className="text-white font-bold text-lg md:text-xl leading-tight">{cat.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
