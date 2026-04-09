import { createClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/features/courses/CourseCard'
import { getRegionName } from '@/lib/constants/regions'

interface CoursesTabProps {
  locale: string
}

const COMING_SOON_BADGE: Record<string, string> = {
  ko: '준비 중',
  ja: '準備中',
  en: 'Coming Soon',
}

export async function CoursesTab({ locale }: CoursesTabProps) {
  const supabase = await createClient()

  const { data: allCourses } = await supabase
    .from('courses')
    .select('id, title, description, thumbnail_url, difficulty, region, duration_text, price_1p, price_2p, is_active')
    .order('created_at', { ascending: true })

const activeCourses = allCourses?.filter(c => c.is_active) ?? []
  const comingSoonCourses = allCourses?.filter(c => !c.is_active) ?? []

  const badge = COMING_SOON_BADGE[locale] ?? COMING_SOON_BADGE.ko

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#111]">🗺️ 미션 키트</h2>
      </div>
      {activeCourses.length === 0 && comingSoonCourses.length === 0 ? (
        <div className="text-center py-20 text-[#7a6a58]">
          <div className="text-5xl mb-4">🌙</div>
          <p>곧 새로운 전설이 열립니다</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCourses.map(course => (
            <CourseCard key={course.id} course={course as any} locale={locale} />
          ))}
          {comingSoonCourses.map(course => {
            const title =
              typeof course.title === 'object' && course.title !== null
                ? (course.title as Record<string, string>)[locale] ??
                  (course.title as Record<string, string>).ko
                : String(course.title)
            return (
              <div
                key={course.id}
                className="relative bg-white rounded-3xl overflow-hidden border border-[#e8ddd0]/60 shadow-sm opacity-80 cursor-not-allowed"
              >
                <div className="relative h-48 overflow-hidden bg-[#e8ddd0]">
                  {course.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnail_url}
                      alt={title}
                      className="w-full h-full object-cover brightness-75"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF6B35] text-white">
                      {badge}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#7a6a58] mb-2">📍 {getRegionName(course.region, locale)}</p>
                  <h3 className="font-bold text-[#111]">{title}</h3>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
