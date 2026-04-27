import { notFound } from "next/navigation"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AffiliateLinks } from "@/components/features/courses/AffiliateLinks"
import { QuestHero } from "@/components/features/quest/QuestHero"
import { QuestHowItWorks } from "@/components/features/quest/QuestHowItWorks"
import { QuestMissionGuide } from "@/components/features/quest/QuestMissionGuide"
import { MissionKakaoMap } from "@/components/features/missions/MissionKakaoMap"
import { QuestStorySlider } from "@/components/features/quest/QuestStorySlider"
import { QuestKitShowcase } from "@/components/features/quest/QuestKitShowcase"
import { QuestReviews } from "@/components/features/quest/QuestReviews"
import { QuestFAQ } from "@/components/features/quest/QuestFAQ"
import { QuestStickyBar } from "@/components/features/quest/QuestStickyBar"
import { QuestPartySection } from "@/components/features/quest/QuestPartySection"
import { AddToPlannerButton } from "@/components/features/planner/AddToPlannerButton"
import { ZepMeetingButton } from "@/components/features/quest/ZepMeetingButton"
import { ZepBanner } from "@/components/features/quest/ZepBanner"
import { getZepZoneByCourseId } from "@/lib/data/zep-spaces"
import type { I18nText } from "@/lib/supabase/types"
import { buildOgUrl } from "@/lib/seo/og-url"
import { CategorySchema } from "@/components/seo"

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
    .select("title, description, region, thumbnail_url")
    .eq("id", courseId)
    .single()

  if (!course) return { title: "Not Found" }

  const title = getI18n(course.title as I18nText, locale)
  const description = getI18n(course.description as I18nText, locale)
  const region = (course as { region?: string }).region ?? ""
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const fullTitle = `${title} | Cloud with you`

  // 동적 OG — 코스 제목 + 지역 (subtitle).
  // P3B-1 buildOgUrl: tier 'strong-stay' 로 STAY 톤 (코스는 보통 한 도시 깊이 탐험).
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title,
    subtitle: region || undefined,
    tier: 'strong-stay',
    category: 'COURSE',
    // 코스 자체 thumbnail 있으면 합성, 없으면 그라데이션만
    imagePath: course.thumbnail_url ?? undefined,
  })

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/${locale}/courses/${courseId}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/courses/${courseId}`,
      languages: {
        'ko-KR': `${siteUrl}/ko/courses/${courseId}`,
        'ja-JP': `${siteUrl}/ja/courses/${courseId}`,
        'en-US': `${siteUrl}/en/courses/${courseId}`,
        'zh-CN': `${siteUrl}/zh-CN/courses/${courseId}`,
        'zh-TW': `${siteUrl}/zh-TW/courses/${courseId}`,
        'x-default': `${siteUrl}/en/courses/${courseId}`,
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
      .select("id, sequence, type, title, location_name, lp_reward, is_hidden, latitude, longitude")
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

  const storyCards = [
    { image: thumbnailUrl, textKey: 'story.card1' },
    { image: thumbnailUrl, textKey: 'story.card2' },
    { image: thumbnailUrl, textKey: 'story.card3' },
    { image: thumbnailUrl, textKey: 'story.card4' },
  ]

  const courseDescription = getI18n(course.description as I18nText, locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'

  return (
    <div>
      <CategorySchema
        type="trip"
        name={courseTitle}
        description={courseDescription}
        url={`${siteUrl}/${locale}/courses/${courseId}`}
        image={thumbnailUrl.startsWith('http') ? thumbnailUrl : `${siteUrl}${thumbnailUrl}`}
        duration={durationText}
      />
      {/* 1. 몰입형 히어로 */}
      <QuestHero
        title={courseTitle}
        region={course.region || ''}
        thumbnail={thumbnailUrl}
        difficulty={course.difficulty || 'easy'}
        duration={durationText}
        missionCount={missions.length}
      />

      {/* 플래너 담기 — 코스 상세 상단 CTA */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 mb-8 flex justify-end">
        <AddToPlannerButton
          itemType="quest"
          cityId={course.region || ''}
          itemData={{
            id: course.id,
            courseId: course.id,
            name: course.title,
            region: course.region,
            difficulty: course.difficulty,
            duration: durationText,
            thumbnail: thumbnailUrl,
          }}
          size="md"
        />
      </div>

      {/* 2. 3단계 프로세스 */}
      <QuestHowItWorks />

      {/* 2-1. GPS 미션 진행 방법 */}
      <QuestMissionGuide />

      {/* 2-2. 미션 지도 프리뷰 (카카오맵) */}
      {missions.some((m) => (m as Record<string, unknown>).latitude != null) && (
        <section className="max-w-5xl mx-auto px-6 md:px-10 py-8">
          <h2 className="text-xl md:text-2xl font-black text-[#111] text-center mb-4">
            🗺️ 미션 위치 한눈에 보기
          </h2>
          <MissionKakaoMap
            missions={missions.map((m) => {
              const row = m as Record<string, unknown>
              return {
                id: row.id as string,
                sequence: row.sequence as number,
                title: row.title as Record<string, string>,
                latitude: row.latitude != null ? Number(row.latitude) : null,
                longitude: row.longitude != null ? Number(row.longitude) : null,
                is_hidden: Boolean(row.is_hidden),
                status: 'locked',
              }
            })}
            courseId={courseId}
            locale={locale}
            clickableNavigation={false}
            className="w-full h-72 md:h-96"
          />
        </section>
      )}

      {/* 3. 인터랙티브 스토리 */}
      <QuestStorySlider storyCards={storyCards} region={course.region || ''} />

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
        kitId={undefined}
        cityId={course.region || 'jeonju'}
      />

      <div className="h-20" />
    </div>
  )
}
