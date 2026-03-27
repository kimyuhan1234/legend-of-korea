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

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, thumbnail_url, difficulty, region, duration_text, price_1p")
    .eq("is_active", true)
    .limit(3)

  const { data: posts } = await supabase
    .from("community_posts")
    .select("id, content, photos, likes_count, created_at, users(nickname, current_tier)")
    .order("created_at", { ascending: false })
    .limit(3)

  return <HomeContent locale={locale} courses={courses || []} posts={posts || []} />
}

const COMING_SOON = {
  ko: [
    { title: "별주부전 코스", region: "통영·거제", date: "2027년 상반기 예정", img: "/images/byeoljubu-coming.jpg", alt: "별주부전 코스 - 곧 공개됩니다" },
    { title: "세 번째 전설", region: "준비 중", date: "미정", img: "/images/third-legend-coming.jpg", alt: "세 번째 전설 - 곧 공개됩니다" },
  ],
  ja: [
    { title: "別主簿伝コース", region: "統営・巨済", date: "2027年上半期予定", img: "/images/byeoljubu-coming.jpg", alt: "鼈主簿伝コース - 近日公開" },
    { title: "第三の伝説", region: "準備中", date: "未定", img: "/images/third-legend-coming.jpg", alt: "第三の伝説 - 近日公開" },
  ],
  en: [
    { title: "Tale of Byeoljubu Course", region: "Tongyeong·Geoje", date: "Coming in early 2027", img: "/images/byeoljubu-coming.jpg", alt: "Byeoljubu Course - Coming Soon" },
    { title: "The Third Legend", region: "In preparation", date: "TBD", img: "/images/third-legend-coming.jpg", alt: "The Third Legend - Coming Soon" },
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
    { icon: "📦", title: t("step1Title"), desc: t("step1Desc"), step: "01", img: "/images/step1-kit-delivery.jpg", alt: "미션 키트 수령" },
    { icon: "🗺️", title: t("step2Title"), desc: t("step2Desc"), step: "02", img: "/images/step2-adventure-start.jpg", alt: "전설의 장소로 출발" },
    { icon: "📱", title: t("step3Title"), desc: t("step3Desc"), step: "03", img: "/images/step3-mission.jpg", alt: "QR 미션 수행" },
    { icon: "⚡", title: t("step4Title"), desc: t("step4Desc"), step: "04", img: "/images/step4-hero.jpg", alt: "전설의 영웅 등극" },
  ]

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ]

  const whyCards = [
    { icon: t("why1Icon"), title: t("why1Title"), desc: t("why1Desc") },
    { icon: t("why2Icon"), title: t("why2Title"), desc: t("why2Desc") },
    { icon: t("why3Icon"), title: t("why3Title"), desc: t("why3Desc") },
  ]

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
  ]

  return (
    <div>
      {/* ── 1. 히어로 섹션 ── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-[#1B2A4A] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/dokkaebi-hero.jpg"
            alt="전주 한옥마을에서 도깨비 모험을 즐기는 여행자들"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#1B2A4A]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-32 md:py-44 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/40 mb-8">
            <span className="text-[#D4A843] text-sm font-medium">{t("openBadge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight whitespace-pre-line mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#D4A843] text-[#1B2A4A] font-bold text-lg hover:bg-[#e0b84e] transition-colors shadow-lg shadow-[#D4A843]/30"
            >
              {t("ctaButton")} →
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-colors border border-white/30 backdrop-blur-sm"
            >
              {t("learnMore")}
            </a>
          </div>
        </div>

        {/* 통계 바 */}
        <div className="relative bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-[#D4A843]">{s.value}</p>
                <p className="text-sm text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Why us ── */}
      <section className="bg-[#F5F0E8] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-[#1B2A4A] mb-3">
              {t("whyTitle")}
            </h2>
            <p className="text-[#7a6a58] text-lg">{t("whySubtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-8 border border-[#e8ddd0] hover:shadow-md hover:border-[#D4A843]/40 transition-all"
              >
                <div className="text-4xl mb-5">{card.icon}</div>
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-3">{card.title}</h3>
                <p className="text-sm text-[#7a6a58] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 이용 방법 ── */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-black text-[#1B2A4A] mb-4">
            {t("howItWorks")}
          </h2>
          <p className="text-center text-[#7a6a58] mb-12">{t("heroSubtitle")}</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl border border-[#e8ddd0] hover:border-[#D4A843]/40 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-[#1B2A4A]/10">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#D4A843] text-[#1B2A4A] text-xs font-bold px-3 py-1 rounded-full">
                    STEP {item.step}
                  </span>
                  <span className="absolute bottom-3 right-3 text-2xl">{item.icon}</span>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-base font-bold text-[#1B2A4A] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#7a6a58] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 추천 코스 ── */}
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

            {comingSoon.map((item, i) => (
              <div
                key={i}
                className="relative bg-white rounded-3xl overflow-hidden border border-[#e8ddd0]/60 shadow-sm opacity-80 cursor-not-allowed"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#1B2A4A] text-white">
                      {tCourse("comingSoon")}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
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

      {/* ── 5. 최근 모험 기록 ── */}
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

      {/* ── 6. FAQ ── */}
      <section className="bg-[#F5F0E8] py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-[#1B2A4A] text-center mb-10">
            {t("faqTitle")}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-[#1B2A4A] list-none select-none hover:text-[#D4A843] transition-colors">
                  <span>{faq.q}</span>
                  <span className="ml-4 shrink-0 text-[#D4A843] transition-transform group-open:rotate-180 text-lg">▾</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-[#7a6a58] leading-relaxed border-t border-[#e8ddd0] pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. 파이널 CTA ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="relative bg-[#1B2A4A] rounded-3xl px-8 py-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#D4A843]/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-[#D4A843]/10 translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-[#D4A843]/5 -translate-x-1/2 -translate-y-1/2" />
          <h2 className="relative text-2xl md:text-4xl font-black text-white mb-4">
            {t("startAdventure")}
          </h2>
          <p className="relative text-white/60 mb-10 text-lg">{t("heroSubtitle")}</p>
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/courses`}
              className="px-10 py-4 rounded-2xl bg-[#D4A843] text-[#1B2A4A] font-bold text-lg hover:bg-[#e0b84e] transition-colors shadow-lg shadow-[#D4A843]/30"
            >
              {tc("courses")} →
            </Link>
            <Link
              href={`/${locale}/auth/signup`}
              className="px-10 py-4 rounded-2xl bg-white/10 text-white font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              {tc("signup")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
