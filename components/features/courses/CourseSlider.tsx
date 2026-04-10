'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CourseSliderItem {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  difficulty: string
  region: string
  regionName: string
  duration: string
  price_1p: number
  isActive: boolean
  comingSoonBadge: string
}

interface CourseSliderProps {
  courses: CourseSliderItem[]
  locale: string
  label: { from: string; detail: string }
}

const DIFF_LABEL: Record<string, Record<string, string>> = {
  ko: { easy: '쉬움', medium: '보통', hard: '어려움' },
  ja: { easy: '簡単', medium: '普通', hard: '難しい' },
  en: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
}

export function CourseSlider({ courses, locale, label }: CourseSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const diffLabel = DIFF_LABEL[locale] || DIFF_LABEL.ko

  return (
    <div className="relative group/slider">
      {/* 좌우 화살표 */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg text-[#111] font-bold opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white -ml-3"
      >
        ‹
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg text-[#111] font-bold opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white -mr-3"
      >
        ›
      </button>

      {/* 슬라이드 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
      >
        {courses.map((course) => (
          <div
            key={course.id}
            className={`shrink-0 w-[280px] md:w-[320px] snap-start ${!course.isActive ? 'opacity-70' : ''}`}
          >
            {course.isActive ? (
              <Link
                href={`/${locale}/courses/${course.id}`}
                className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e8ddd0]/40"
              >
                <CardContent course={course} locale={locale} label={label} diffLabel={diffLabel} />
              </Link>
            ) : (
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8ddd0]/40 cursor-not-allowed">
                <CardContent course={course} locale={locale} label={label} diffLabel={diffLabel} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CardContent({
  course,
  locale,
  label,
  diffLabel,
}: {
  course: CourseSliderItem
  locale: string
  label: { from: string; detail: string }
  diffLabel: Record<string, string>
}) {
  return (
    <>
      {/* 이미지 */}
      <div className="relative aspect-[4/3] bg-[#F5F3EF] overflow-hidden">
        <Image
          src={course.thumbnail_url || '/images/dokkaebi-hero.png'}
          alt={course.title}
          fill
          sizes="320px"
          quality={90}
          className="object-contain"
        />
        {!course.isActive && (
          <>
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF6B35] text-white">
              {course.comingSoonBadge}
            </span>
          </>
        )}
        {course.isActive && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#111] shadow-sm">
            {diffLabel[course.difficulty] || course.difficulty}
          </span>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-[#7a6a58] mb-2">
          <span>📍 {course.regionName}</span>
          <span>·</span>
          <span>⏱ {course.duration}</span>
        </div>
        <h3 className="text-sm font-bold text-[#111] mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-xs text-[#7a6a58] line-clamp-2 mb-3">{course.description}</p>

        {course.isActive && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-[#111]">
              ₩{course.price_1p.toLocaleString()}
              <span className="text-xs font-normal text-[#7a6a58] ml-1">{label.from}</span>
            </p>
            <span className="text-xs font-semibold text-[#FF6B35]">{label.detail} →</span>
          </div>
        )}
      </div>
    </>
  )
}
