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
    const amount = scrollRef.current.offsetWidth * 0.85
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const diffLabel = DIFF_LABEL[locale] || DIFF_LABEL.ko

  return (
    <div className="relative group/slider">
      {/* 좌우 화살표 */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg text-[#111] text-xl font-bold opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white -ml-4"
      >
        ‹
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg text-[#111] text-xl font-bold opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white -mr-4"
      >
        ›
      </button>

      {/* 슬라이드 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
      >
        {courses.map((course) => {
          const inner = (
            <div className="flex h-full">
              {/* 왼쪽: 이미지 */}
              <div className="relative w-[45%] shrink-0 bg-[#F5F3EF] overflow-hidden">
                <Image
                  src={course.thumbnail_url || '/images/dokkaebi-hero.png'}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 40vw, 300px"
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

              {/* 오른쪽: 스토리 + 정보 */}
              <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  {/* 메타 정보 */}
                  <div className="flex items-center gap-2 text-xs text-[#7a6a58] mb-3">
                    <span>📍 {course.regionName}</span>
                    <span>·</span>
                    <span>⏱ {course.duration}</span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg md:text-xl font-black text-[#111] mb-3 leading-tight">
                    {course.title}
                  </h3>

                  {/* 전래동화 이야기 */}
                  <p className="text-sm text-[#374151] leading-relaxed line-clamp-4 md:line-clamp-5">
                    {course.description}
                  </p>
                </div>

                {/* 하단: 가격 + 버튼 */}
                {course.isActive && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e8ddd0]/60">
                    <div>
                      <p className="text-xs text-[#7a6a58]">1인 {label.from}</p>
                      <p className="text-lg font-black text-[#111]">
                        ₩{course.price_1p.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-5 py-2.5 rounded-full bg-[#FF6B35] text-white text-sm font-bold hover:bg-[#E55A2B] transition-colors">
                      {label.detail} →
                    </span>
                  </div>
                )}
              </div>
            </div>
          )

          return (
            <div
              key={course.id}
              className={`shrink-0 w-[85vw] md:w-[600px] lg:w-[680px] snap-start ${!course.isActive ? 'opacity-70' : ''}`}
            >
              {course.isActive ? (
                <Link
                  href={`/${locale}/courses/${course.id}`}
                  className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e8ddd0]/40 h-[280px] md:h-[320px]"
                >
                  {inner}
                </Link>
              ) : (
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8ddd0]/40 cursor-not-allowed h-[280px] md:h-[320px]">
                  {inner}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
