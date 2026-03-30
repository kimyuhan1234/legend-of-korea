import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { CourseHero } from "@/components/features/courses/CourseHero"
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

const STORY_LABEL = {
  ko: "전설 이야기",
  ja: "伝説の物語",
  en: "The Legend",
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, courseId } = params
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: "course" })

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
  const durationText = getI18n(course.duration_text as I18nText, locale)
  const storyLabel = STORY_LABEL[locale as keyof typeof STORY_LABEL] || STORY_LABEL.ko

  return (
    <div>
      {/* 1. 히어로 섹션 */}
      <CourseHero
        course={course as any}
        missionCount={missions.length}
        locale={locale}
      />

      {/* 2. 전설 이야기 (2컬럼: 스토리+정보 | 영상) */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-bold text-[#1B2A4A] mb-8">
          📖 {storyLabel}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* 왼쪽: 설명 + 인용구 + 정보 카드 */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#e8ddd0]">
              <p className="text-[#3a3028] leading-relaxed text-base whitespace-pre-wrap mb-6">
                {storyText}
              </p>
              <div className="bg-[#FFF8EC] border-l-4 border-[#D4A843] pl-4 pr-3 py-4 rounded-r-xl">
                <p className="text-sm text-[#7a6a58] italic leading-relaxed">
                  &ldquo;{t("storyIntro")}&rdquo;
                </p>
              </div>
            </div>

            {/* 코스 정보 요약 카드 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center border border-[#e8ddd0] shadow-sm">
                <span className="text-2xl">📍</span>
                <p className="text-xs text-[#7a6a58] mt-1">{t("infoRegion")}</p>
                <p className="font-bold text-[#1B2A4A] text-sm mt-0.5">{course.region || "-"}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-[#e8ddd0] shadow-sm">
                <span className="text-2xl">⏱️</span>
                <p className="text-xs text-[#7a6a58] mt-1">{t("infoDuration")}</p>
                <p className="font-bold text-[#1B2A4A] text-sm mt-0.5">{durationText || "-"}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-[#e8ddd0] shadow-sm">
                <span className="text-2xl">🎯</span>
                <p className="text-xs text-[#7a6a58] mt-1">{t("infoMissions")}</p>
                <p className="font-bold text-[#1B2A4A] text-sm mt-0.5">{missions.length}</p>
              </div>
            </div>
          </div>

          {/* 오른쪽: 소개 영상 또는 플레이스홀더 */}
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
              {(course as any).video_url ? (
                <iframe
                  src={(course as any).video_url}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1B2A4A] to-[#2a3f6e] text-white">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold">{t("videoPlaceholder")}</p>
                  <p className="text-sm text-white/70 mt-1">{t("videoPlaceholderDesc")}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-[#7a6a58] text-center">🎬 {t("videoCaption")}</p>
          </div>
        </div>
      </section>

      {/* 3. 미션 키트 소개 + 여행 준비 (2컬럼, 높이 동일) */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col h-full">
            <KitPurchaseCard courseId={courseId} kits={kits as any} locale={locale} className="flex-1" />
          </div>
          <div className="flex flex-col h-full">
            <AffiliateLinks links={affiliateLinks as any} locale={locale} className="flex-1" />
          </div>
        </div>
      </section>

      {/* 5. 모험가들의 후기 */}
      <CourseReviews posts={reviews as any} courseId={courseId} locale={locale} />

      <div className="h-16" />
    </div>
  )
}
