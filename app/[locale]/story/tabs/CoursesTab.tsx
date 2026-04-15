import { createClient } from '@/lib/supabase/server'
import { CourseSlider } from '@/components/features/courses/CourseSlider'
import { GyeongdoEventBanner } from '@/components/features/quest/GyeongdoEventBanner'
import { getRegionName } from '@/lib/constants/regions'
import type { I18nText } from '@/lib/supabase/types'

interface CoursesTabProps {
  locale: string
}

const COMING_SOON_BADGE: Record<string, string> = {
  ko: '준비 중',
  ja: '準備中',
  en: 'Coming Soon',
}

const LABEL = {
  ko: { heading: '🗺️ 미션 키트', from: '부터', detail: '자세히 보기', empty: '곧 새로운 전설이 열립니다' },
  ja: { heading: '🗺️ ミッションキット', from: 'から', detail: '詳しく見る', empty: 'まもなく新しい伝説が始まります' },
  en: { heading: '🗺️ Mission Kits', from: 'from', detail: 'View details', empty: 'New legends are coming soon' },
}

function getI18n(field: I18nText | null, locale: string): string {
  if (!field) return ''
  return (field as unknown as Record<string, string>)[locale] || field.ko || ''
}

export async function CoursesTab({ locale }: CoursesTabProps) {
  const supabase = await createClient()

  const { data: allCourses } = await supabase
    .from('courses')
    .select('id, title, description, thumbnail_url, difficulty, region, duration_text, price_1p, price_2p, is_active')
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: true })

  const courses = allCourses ?? []
  const badge = COMING_SOON_BADGE[locale] ?? COMING_SOON_BADGE.ko
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 text-stone">
        <div className="text-5xl mb-4">🌙</div>
        <p>{label.empty}</p>
      </div>
    )
  }

  const sliderItems = courses.map((course) => ({
    id: course.id,
    title: getI18n(course.title as I18nText, locale),
    description: getI18n(course.description as I18nText, locale),
    thumbnail_url: course.thumbnail_url,
    difficulty: course.difficulty || 'easy',
    region: course.region,
    regionName: getRegionName(course.region, locale),
    duration: getI18n(course.duration_text as I18nText, locale),
    price_1p: course.price_1p || 0,
    isActive: course.is_active ?? false,
    comingSoonBadge: badge,
  }))

  return (
    <div>
      {/* 경도 스페셜 이벤트 배너 — 활성 이벤트 있을 때만 표시 */}
      <GyeongdoEventBanner locale={locale} />

      <h2 className="text-xl font-black text-[#111] mb-6">{label.heading}</h2>
      <CourseSlider
        courses={sliderItems}
        locale={locale}
        label={{ from: label.from, detail: label.detail }}
      />
    </div>
  )
}
