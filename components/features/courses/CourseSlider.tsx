import Image from 'next/image'
import Link from 'next/link'
import { Ticket, MapPin, Clock } from 'lucide-react'

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

const PASS_INCLUDED: Record<string, string> = {
  ko: '패스 권에 포함',
  ja: 'パス券に含む',
  en: 'Included with Pass',
  'zh-CN': '通票包含',
  'zh-TW': '通票包含',
}

export function CourseSlider({ courses, locale, label }: CourseSliderProps) {
  const diffLabel = DIFF_LABEL[locale] || DIFF_LABEL.en || DIFF_LABEL.ko

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const inner = (
            <div className="flex h-full">
              {/* 왼쪽: 이미지 */}
              <div className="relative w-[45%] shrink-0 bg-cloud overflow-hidden">
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
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-br from-mint to-blossom text-ink">
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
                  <div className="flex items-center gap-2 text-xs text-stone mb-3">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" strokeWidth={2} aria-hidden />
                      {course.regionName}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={2} aria-hidden />
                      {course.duration}
                    </span>
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

                {/* 하단: 패스 포함 안내 + 버튼 */}
                {course.isActive && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-mist/60 gap-2 md:gap-3">
                    <p className="text-[11px] md:text-xs font-bold text-mint-deep min-w-0 truncate inline-flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 shrink-0" strokeWidth={2} aria-hidden />
                      <span className="truncate">{PASS_INCLUDED[locale] || PASS_INCLUDED.en}</span>
                    </p>
                    <span className="shrink-0 px-3.5 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-br from-mint to-blossom text-ink text-xs md:text-sm font-bold hover:bg-[#7BC8BC] transition-colors whitespace-nowrap">
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
              className={!course.isActive ? 'opacity-70' : ''}
            >
              {course.isActive ? (
                <Link
                  href={`/${locale}/courses/${course.id}`}
                  className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-mist/40 min-h-[280px] md:h-[320px]"
                >
                  {inner}
                </Link>
              ) : (
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-mist/40 cursor-not-allowed min-h-[280px] md:h-[320px]">
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
