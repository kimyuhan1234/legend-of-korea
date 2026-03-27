import { notFound } from "next/navigation"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { CourseHero } from "@/components/features/courses/CourseHero"
import { MissionPreview } from "@/components/features/courses/MissionPreview"
import { KitPurchaseCard } from "@/components/features/courses/KitPurchaseCard"
import { AffiliateLinks } from "@/components/features/courses/AffiliateLinks"
import { CourseReviews } from "@/components/features/courses/CourseReviews"
import type { I18nText } from "@/lib/supabase/types"

interface Props {
  params: { locale: string; courseId: string }
}

function getI18n(field: I18nText | null | undefined, locale: string): string {
  if (!field) return ""
  return (field as unknown as Record<string, string>)[locale] || field.ko || ""
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, courseId } = params
  const supabase = await createClient()
  const { data: course } = await supabase
    .from("courses")
    .select("title, description, thumbnail_url")
    .eq("id", courseId)
    .single()

  if (!course) return { title: "Not Found" }

  const title = getI18n(course.title as I18nText, locale)
  const description = getI18n(course.description as I18nText, locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofkorea.com'

  return {
    title: `${title} | Legend of Korea`,
    description: description,
    openGraph: {
      title: `${title} | Legend of Korea`,
      description: description,
      url: `${siteUrl}/${locale}/courses/${courseId}`,
      images: course.thumbnail_url ? [{ url: course.thumbnail_url }] : [],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/courses/${courseId}`,
      languages: {
        'ko-KR': `/ko/courses/${courseId}`,
        'ja-JP': `/ja/courses/${courseId}`,
        'en-US': `/en/courses/${courseId}`,
      },
    },
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, courseId } = params
  const supabase = await createClient()

  // 코스 + 키트 + 미션 + 제휴 링크 동시 조회
  const [courseRes, kitRes, missionRes, affiliateRes, reviewRes] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("is_active", true)
      .single(),
    supabase
      .from("kit_products")
      .select("*")
      .eq("course_id", courseId),
    supabase
      .from("missions")
      .select("id, sequence, type, title, location_name, lp_reward, is_hidden")
      .eq("course_id", courseId)
      .order("sequence", { ascending: true }),
    supabase
      .from("affiliate_links")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_active", true),
    supabase
      .from("community_posts")
      .select("id, content, photos, likes_count, created_at, is_spoiler, users(nickname, avatar_url, current_tier)")
      .eq("course_id", courseId)
      .order("likes_count", { ascending: false })
      .limit(6),
  ])

  if (!courseRes.data) notFound()

  const course = courseRes.data
  const kits = kitRes.data || []
  const missions = missionRes.data || []
  const affiliateLinks = affiliateRes.data || []
  const reviews = reviewRes.data || []

  const storyText = getI18n(course.description as I18nText, locale)

  const STORY_LABEL = {
    ko: "전설 이야기",
    ja: "伝説の物語",
    en: "The Legend",
  }
  const storyLabel = STORY_LABEL[locale as keyof typeof STORY_LABEL] || STORY_LABEL.ko

  return (
    <div>
      {/* 1. 히어로 섹션 */}
      <CourseHero
        course={course as any}
        missionCount={missions.length}
        locale={locale}
      />

      {/* 2. 스토리 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1B2A4A] mb-4">
            📖 {storyLabel}
          </h2>
          <div className="bg-white rounded-3xl p-8 border border-[#e8ddd0]">
            <p className="text-[#3a3028] leading-relaxed text-base whitespace-pre-wrap">
              {storyText}
            </p>
          </div>
        </div>
      </section>

      {/* 3. 미션 미리보기 */}
      <MissionPreview missions={missions as any} locale={locale} />

      {/* 4. 키트 구매 */}
      <KitPurchaseCard courseId={courseId} kits={kits as any} locale={locale} />

      {/* 5. 제휴 링크 (숙소·교통) */}
      <AffiliateLinks links={affiliateLinks as any} locale={locale} />

      {/* 6. 커뮤니티 후기 */}
      <CourseReviews posts={reviews as any} courseId={courseId} locale={locale} />

      {/* 하단 여백 */}
      <div className="h-16" />
    </div>
  )
}
