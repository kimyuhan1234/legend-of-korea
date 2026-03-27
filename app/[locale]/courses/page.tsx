export const dynamic = 'force-dynamic'

import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { CourseCard } from "@/components/features/courses/CourseCard"

const COMING_SOON_COURSES = {
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

interface Props {
  params: { locale: string }
  searchParams: { difficulty?: string; region?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "course" })
  const tc = await getTranslations({ locale: params.locale, namespace: "common" })
  return {
    title: `${t("exploreCourses")} | ${tc("siteName")}`,
  }
}

const DIFFICULTY_OPTIONS = [
  { value: "", ko: "전체", ja: "すべて", en: "All" },
  { value: "easy", ko: "초급", ja: "初級", en: "Easy" },
  { value: "medium", ko: "중급", ja: "中級", en: "Medium" },
  { value: "hard", ko: "고급", ja: "上級", en: "Hard" },
]

const REGIONS = [
  { code: "jeonju", ko: "전주", ja: "全州", en: "Jeonju" },
  { code: "tongyeong", ko: "통영", ja: "統営", en: "Tongyeong" },
  { code: "gyeongju", ko: "경주", ja: "慶州", en: "Gyeongju" },
  { code: "seoul", ko: "서울", ja: "ソウル", en: "Seoul" },
  { code: "busan", ko: "부산", ja: "釜山", en: "Busan" },
  { code: "jeju", ko: "제주", ja: "済州", en: "Jeju" },
]

const LABEL = {
  ko: {
    title: "코스 탐색",
    subtitle: "전설이 깃든 장소로 떠날 준비가 되셨나요?",
    allDifficulty: "전체 난이도",
    allRegion: "전체 지역",
    filterLabel: "필터",
    count: "개 코스",
    empty: "현재 활성화된 코스가 없습니다",
    emptyDesc: "곧 새로운 전설이 열립니다",
  },
  ja: {
    title: "コース探索",
    subtitle: "伝説の場所へ旅立つ準備はできていますか？",
    allDifficulty: "全難易度",
    allRegion: "全地域",
    filterLabel: "フィルター",
    count: "コース",
    empty: "現在アクティブなコースはありません",
    emptyDesc: "まもなく新しい伝説が開きます",
  },
  en: {
    title: "Explore Courses",
    subtitle: "Ready to journey to legendary places?",
    allDifficulty: "All Difficulties",
    allRegion: "All Regions",
    filterLabel: "Filter",
    count: "courses",
    empty: "No active courses at the moment",
    emptyDesc: "New legends coming soon",
  },
}

export default async function CoursesPage({ params, searchParams }: Props) {
  const { locale } = params
  const { difficulty = "", region = "" } = searchParams
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko
  const t = await getTranslations({ locale, namespace: "course" })
  const comingSoon = COMING_SOON_COURSES[locale as keyof typeof COMING_SOON_COURSES] || COMING_SOON_COURSES.ko

  const supabase = await createClient()

  let query = supabase
    .from("courses")
    .select("id, title, description, thumbnail_url, difficulty, region, duration_text, price_1p, price_2p")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (difficulty) query = query.eq("difficulty", difficulty)
  if (region) query = query.eq("region", region)

  const { data: courses } = await query

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-[#1B2A4A] mb-2">
          🗺️ {label.title}
        </h1>
        <p className="text-[#7a6a58]">{label.subtitle}</p>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* 난이도 필터 */}
        <div className="flex gap-2 flex-wrap">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isActive = difficulty === opt.value
            const optLabel = opt[locale as "ko" | "ja" | "en"] || opt.ko
            return (
              <a
                key={opt.value}
                href={`/${locale}/courses?difficulty=${opt.value}${region ? `&region=${region}` : ""}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                    : "bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#1B2A4A]/40"
                }`}
              >
                {optLabel}
              </a>
            )
          })}
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 flex-wrap">
          <a
            href={`/${locale}/courses?${difficulty ? `difficulty=${difficulty}` : ""}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              !region
                ? "bg-[#D4A843] text-[#1B2A4A] border-[#D4A843]"
                : "bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#D4A843]/40"
            }`}
          >
            {label.allRegion}
          </a>
          {REGIONS.map((r) => {
            const isActive = region === r.code
            const rLabel = r[locale as "ko" | "ja" | "en"] || r.ko
            return (
              <a
                key={r.code}
                href={`/${locale}/courses?${difficulty ? `difficulty=${difficulty}&` : ""}region=${r.code}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-[#D4A843] text-[#1B2A4A] border-[#D4A843]"
                    : "bg-white text-[#3a3028] border-[#e8ddd0] hover:border-[#D4A843]/40"
                }`}
              >
                📍 {rLabel}
              </a>
            )
          })}
        </div>
      </div>

      {/* 결과 수 */}
      <p className="text-sm text-[#7a6a58] mb-6">
        {courses?.length || 0} {label.count}
      </p>

      {/* 코스 목록 */}
      {!courses || courses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🌙</div>
          <p className="font-bold text-[#1B2A4A] text-lg mb-2">{label.empty}</p>
          <p className="text-[#7a6a58]">{label.emptyDesc}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course as any} locale={locale} />
          ))}

          {/* Coming Soon 카드 */}
          {comingSoon.map((item, i) => (
            <div
              key={i}
              className="relative bg-white/60 rounded-3xl overflow-hidden border border-[#e8ddd0]/60 shadow-sm opacity-70 backdrop-blur-sm cursor-not-allowed"
            >
              <div className="relative h-48 bg-[#1B2A4A]/5 flex items-center justify-center">
                <span className="text-6xl grayscale">{item.emoji}</span>
                <div className="absolute inset-0 flex items-center justify-center bg-[#1B2A4A]/10">
                  <div className="bg-white/90 rounded-full p-3 shadow-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1B2A4A]">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#1B2A4A] text-white">
                    {t("comingSoon")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#7a6a58] mb-2">📍 {item.region}</p>
                <h3 className="font-bold text-[#1B2A4A] mb-1">{item.title}</h3>
                <p className="text-sm text-[#D4A843] font-medium">{item.date}</p>
                <p className="mt-3 text-sm text-[#7a6a58]">{t("comingSoonDesc")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
