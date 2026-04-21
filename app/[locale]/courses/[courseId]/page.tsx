import { notFound } from "next/navigation"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AffiliateLinks } from "@/components/features/courses/AffiliateLinks"
import { QuestHero } from "@/components/features/quest/QuestHero"
import { QuestHowItWorks } from "@/components/features/quest/QuestHowItWorks"
import { QuestStorySlider } from "@/components/features/quest/QuestStorySlider"
import { QuestComparison } from "@/components/features/quest/QuestComparison"
import { QuestKitShowcase } from "@/components/features/quest/QuestKitShowcase"
import { QuestReviews } from "@/components/features/quest/QuestReviews"
import { QuestFAQ } from "@/components/features/quest/QuestFAQ"
import { QuestStickyBar } from "@/components/features/quest/QuestStickyBar"
import { QuestPartySection } from "@/components/features/quest/QuestPartySection"
import { ZepMeetingButton } from "@/components/features/quest/ZepMeetingButton"
import { ZepBanner } from "@/components/features/quest/ZepBanner"
import { getZepZoneByCourseId } from "@/lib/data/zep-spaces"
import type { I18nText } from "@/lib/supabase/types"

interface Props {
  params: { locale: string; courseId: string }
}

function getI18n(field: I18nText | null | undefined, locale: string): string {
  if (!field) return ""
  return (field as unknown as Record<string, string>)[locale] || field.en || field.ko || ""
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
    title: `${title} | Cloud with you`,
    description: description,
    openGraph: {
      title: `${title} | Cloud with you`,
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
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  // 구독 여부 확인 (ZEP 접근 권한 판단)
  let hasSubscription = false
  if (user) {
    try {
      const { data: orderRows } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("payment_status", "paid")
        .limit(1)
      hasSubscription = (orderRows?.length ?? 0) > 0
    } catch {
      hasSubscription = false
    }
  }

  const [courseRes, missionRes, affiliateRes] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("is_active", true)
      .single(),
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
  ])

  if (!courseRes.data) notFound()

  const course = courseRes.data
  const missions = missionRes.data || []
  const affiliateLinks = affiliateRes.data || []
  const durationText = getI18n(course.duration_text as I18nText, locale)

  const courseTitle = getI18n(course.title as I18nText, locale)
  const thumbnailUrl = course.thumbnail_url || '/images/dokkaebi-hero.png'
  const firstKit = null

  const storyCards = [
    { image: thumbnailUrl, textKey: 'story.card1' },
    { image: thumbnailUrl, textKey: 'story.card2' },
    { image: thumbnailUrl, textKey: 'story.card3' },
    { image: thumbnailUrl, textKey: 'story.card4' },
  ]

  return (
    <div>
      {/* 1. 몰입형 히어로 */}
      <QuestHero
        title={courseTitle}
        region={course.region || ''}
        thumbnail={thumbnailUrl}
        difficulty={course.difficulty || 'easy'}
        duration={durationText}
        missionCount={missions.length}
      />

      {/* 2. 3단계 프로세스 */}
      <QuestHowItWorks />

      {/* 3. 인터랙티브 스토리 */}
      <QuestStorySlider storyCards={storyCards} region={course.region || ''} />

      {/* 4. 일반 관광 vs 미션 여행 */}
      <QuestComparison />

      {/* 5. 키트 언박싱 & 구매 */}
      <div id="kit-purchase">
      <QuestKitShowcase
        courseId={courseId}
        kits={[]}
        locale={locale}
        region={course.region || 'jeonju'}
        isLoggedIn={isLoggedIn}
      />
      </div>

      {/* 6. Quest Party 매칭 */}
      <QuestPartySection
        courseId={courseId}
        isLoggedIn={isLoggedIn}
        currentUserId={user?.id ?? null}
        locale={locale}
      />

      {/* 6-1. ZEP 가상 모임
            - 비구매자 : ZepBanner (풀 애니메이션 + 구매 유도 CTA)
            - 구매자   : ZepMeetingButton (미니 프리뷰 + 입장 버튼)
            - 해당 코스에 ZEP 스페이스 없으면 렌더링 안 함            */}
      {getZepZoneByCourseId(course.region || '') && (
        <section className="max-w-5xl mx-auto px-8 md:px-10 py-8" id="zep-meeting">
          {hasSubscription ? (
            <ZepMeetingButton
              courseId={course.region || ''}
              hasPurchased={true}
              locale={locale}
            />
          ) : (
            <ZepBanner locale={locale} />
          )}
        </section>
      )}

      {/* 7. 여행 준비 (제휴 링크) */}
      {affiliateLinks.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 md:px-10 py-20 md:py-28">
          <AffiliateLinks links={affiliateLinks as any} locale={locale} />
        </section>
      )}

      {/* 8. 외국인 체험 후기 */}
      <QuestReviews />

      {/* 9. FAQ */}
      <QuestFAQ />

      {/* 하단 고정 구매 바 */}
      <QuestStickyBar
        courseId={courseId}
        title={courseTitle}
        price={6900}
        locale={locale}
        isLoggedIn={isLoggedIn}
        kitId={firstKit?.id}
        cityId={course.region || 'jeonju'}
      />

      <div className="h-20" />
    </div>
  )
}
