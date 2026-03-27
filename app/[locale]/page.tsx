export const dynamic = 'force-dynamic'

import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DifficultyBadge } from "@/components/shared/DifficultyBadge"
import type { I18nText } from "@/lib/supabase/types"

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "common" })
  return {
    title: `${t("siteName")} | ${t("siteDescription")}`,
  }
}

function getI18n(field: I18nText, locale: string): string {
  return (field as unknown as Record<string, string>)[locale] || field.ko || ""
}

export default async function HomePage({ params }: Props) {
  const { locale } = params
  const supabase = await createClient()

  // 추천 코스 (최대 3개)
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, thumbnail_url, difficulty, region, duration_text, price_1p")
    .eq("is_active", true)
    .limit(3)

  // 최근 커뮤니티 포스트 (최대 3개)
  const { data: posts } = await supabase
    .from("community_posts")
    .select("id, content, photos, likes_count, created_at, users(nickname, current_tier)")
    .order("created_at", { ascending: false })
    .limit(3)

  return <HomeContent locale={locale} courses={courses || []} posts={posts || []} />
}

const COMING_SOON = {
  ko: [
    { title: "별주부전 코스", region: "통영·거제", date: "2027년 상반기 예정", emoji: "🐢" },
    { title: "세 번째 전설", region: "준비 중", date: "미정", emoji: "🌙" },
  ],
  ja: [
    { title: "別主簿伝コース", region: "統営・巨済", date: "2027年上半期予定", emoji: "🐢" },
    { title: "第三の伝説", region: "準備中", date: "未定", emoji: "🌙" },
  ],
  en: [
    { title: "Tale of Byeoljubu Course", region: "Tongyeong·Geoje", date: "Coming in early 2027", emoji: "🐢" },
    { title: "The Third Legend", region: "In preparation", date: "TBD", emoji: "🌙" },
  ],
}

function HomeContent({
  locale,
  courses,
  posts,
}: {
  locale: string
  courses: any[]
  posts: any[]
}) {
  const t = useTranslations("home")
  const tc = useTranslations("common")
  const tCourse = useTranslations("course")
  const comingSoon = COMING_SOON[locale as keyof typeof COMING_SOON] || COMING_SOON.ko

  const steps = [
    { icon: "📦", title: t("step1Title"), desc: t("step1Desc"), step: "01" },
    { icon: "🗺️", title: t("step2Title"), desc: t("step2Desc"), step: "02" },
    { icon: "📱", title: t("step3Title"), desc: t("step3Desc"), step: "03" },
    { icon: "⚡", title: t("step4Title"), desc: t("step4Desc"), step: "04" },
  ]

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-[#1B2A4A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#D4A843]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D4A843] -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/30 mb-6">
            <span className="text-[#D4A843] text-sm font-medium">{t("openBadge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight whitespace-pre-line mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
            {t("heroSubtitle")}
          </p>

          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#D4A843] text-[#1B2A4A] font-bold text-lg hover:bg-[#e0b84e] transition-colors shadow-lg shadow-[#D4A843]/30"
          >
            {t("ctaButton")} →
          </Link>
        </div>
      </section>

      {/* 추천 코스 */}
      {courses.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A]">
              {t("featuredCourse")}
            </h2>
            <Link
              href={`/${locale}/courses`}
              className="text-sm text-[#D4A843] hover:underline font-medium"
            >
              {tc("viewMore")} →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/${locale}/courses/${course.id}`}
                className="group block bg-white rounded-3xl overflow-hidden border border-[#e8ddd0] shadow-sm hover:shadow-md hover:border-[#D4A843]/40 transition-all"
              >
                <div className="relative h-48 bg-[#1B2A4A]/10">
                  {course.thumbnail_url ? (
                    <Image
                      src={course.thumbnail_url}
                      alt={getI18n(course.title, locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">
                      👹
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <DifficultyBadge difficulty={course.difficulty} locale={locale} />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#7a6a58] mb-2">📍 {course.region}</p>
                  <h3 className="font-bold text-[#1B2A4A] mb-1">
                    {getI18n(course.title, locale)}
                  </h3>
                  <p className="text-sm text-[#7a6a58] line-clamp-2">
                    {getI18n(course.description, locale)}
                  </p>
                  <p className="mt-3 text-sm font-bold text-[#1B2A4A]">
                    ₩{course.price_1p?.toLocaleString()}~
                  </p>
                </div>
              </Link>
            ))}

            {/* Coming Soon 카드 */}
            {comingSoon.map((item, i) => (
              <div
                key={i}
                className="relative block bg-white/60 rounded-3xl overflow-hidden border border-[#e8ddd0]/60 shadow-sm opacity-70 backdrop-blur-sm cursor-not-allowed"
              >
                <div className="relative h-48 bg-[#1B2A4A]/5 flex items-center justify-center">
                  <span className="text-6xl grayscale">{item.emoji}</span>
                  {/* 자물쇠 오버레이 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1B2A4A]/10">
                    <div className="bg-white/90 rounded-full p-3 shadow-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1B2A4A]">
                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  {/* Coming Soon 배지 */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#1B2A4A] text-white">
                      {tCourse("comingSoon")}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#7a6a58] mb-2">📍 {item.region}</p>
                  <h3 className="font-bold text-[#1B2A4A] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#D4A843] font-medium">{item.date}</p>
                  <p className="mt-3 text-sm text-[#7a6a58]">{tCourse("comingSoonDesc")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 이용 방법 */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-4">
            {t("howItWorks")}
          </h2>
          <p className="text-center text-[#7a6a58] mb-12">
            {t("heroSubtitle")}
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-[#F5F0E8] rounded-3xl p-6 text-center hover:shadow-md hover:border-[#D4A843]/40 border border-[#e8ddd0] transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-[#D4A843] mb-2 tracking-wider">
                  STEP {item.step}
                </div>
                <h3 className="text-base font-bold text-[#1B2A4A] mb-2">{item.title}</h3>
                <p className="text-sm text-[#7a6a58] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 모험 기록 */}
      {posts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A]">
              {t("recentPosts")}
            </h2>
            <Link
              href={`/${locale}/community`}
              className="text-sm text-[#D4A843] hover:underline font-medium"
            >
              {tc("viewMore")} →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden hover:shadow-sm transition-shadow"
              >
                {post.photos?.[0] && (
                  <div className="h-36 bg-[#F5F0E8] overflow-hidden">
                    <img
                      src={post.photos[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-[#D4A843] font-semibold mb-1">
                    {post.users?.nickname || "모험가"}
                  </p>
                  <p className="text-sm text-[#3a3028] line-clamp-3">{post.content}</p>
                  <p className="text-xs text-[#7a6a58] mt-2">👏 {post.likes_count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA 배너 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative bg-[#1B2A4A] rounded-3xl px-8 py-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#D4A843]/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#D4A843]/10 translate-y-1/2 -translate-x-1/2" />
          <h2 className="relative text-2xl md:text-3xl font-black text-white mb-4">
            {t("startAdventure")}
          </h2>
          <p className="relative text-white/60 mb-8">{t("heroSubtitle")}</p>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/courses`}
              className="px-8 py-3.5 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors"
            >
              {tc("courses")} →
            </Link>
            <Link
              href={`/${locale}/auth/signup`}
              className="px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              {tc("signup")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
