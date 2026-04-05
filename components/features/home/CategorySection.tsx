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
    <section id="categories" className="bg-[#FFF8F0] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <p className="text-center text-[#7a6a58] text-sm md:text-base mb-6">
          {heading}
        </p>

        {/* 데스크톱: 커스텀 비율 grid (스토리 카드 강조) */}
        <div className="hidden lg:flex gap-2 h-[480px]">
          {categories.map((cat) => {
            const isStory = cat.id === 'story'
            return (
              <Link
                key={cat.id}
                href={`/${locale}${cat.href}`}
                className={`group relative overflow-hidden rounded-2xl flex-shrink-0 ${isStory ? 'flex-[1.5]' : 'flex-1'}`}
              >
                <div className={`absolute inset-0 ${cat.gradient}`} />
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 1280px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                  <p className={`text-white font-black leading-tight ${isStory ? 'text-2xl' : 'text-xl'}`}>
                    {cat.label}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 태블릿: 3+2 레이아웃 */}
        <div className="hidden md:grid lg:hidden grid-cols-3 gap-2">
          {categories.slice(0, 3).map((cat) => (
            <Link key={cat.id} href={`/${locale}${cat.href}`} className="group relative overflow-hidden rounded-2xl h-72">
              <div className={`absolute inset-0 ${cat.gradient}`} />
              <Image src={cat.image} alt={cat.label} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                <p className="text-white font-black text-lg">{cat.label}</p>
              </div>
            </Link>
          ))}
          {categories.slice(3).map((cat) => (
            <Link key={cat.id} href={`/${locale}${cat.href}`} className="group relative overflow-hidden rounded-2xl h-72">
              <div className={`absolute inset-0 ${cat.gradient}`} />
              <Image src={cat.image} alt={cat.label} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                <p className="text-white font-black text-lg">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* 모바일: 2열 grid */}
        <div className="grid md:hidden grid-cols-2 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}${cat.href}`}
              className={`group relative overflow-hidden rounded-xl h-52 ${cat.id === 'story' ? 'col-span-2 h-64' : ''}`}
            >
              <div className={`absolute inset-0 ${cat.gradient}`} />
              <Image src={cat.image} alt={cat.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                <p className="text-white font-black text-lg">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
