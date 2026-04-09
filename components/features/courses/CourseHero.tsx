import Image from "next/image"
import { DifficultyBadge } from "@/components/shared/DifficultyBadge"
import type { I18nText } from "@/lib/supabase/types"

interface CourseHeroProps {
  course: {
    title: I18nText
    description: I18nText
    thumbnail_url: string | null
    video_url: string | null
    difficulty: "easy" | "medium" | "hard"
    region: string
    duration_text: I18nText
    legend_type: string
  }
  missionCount: number
  locale: string
}

const LABEL = {
  ko: { missions: "개 미션", region: "지역", duration: "소요 시간", legend: "전설 유형" },
  ja: { missions: "ミッション", region: "地域", duration: "所要時間", legend: "伝説タイプ" },
  en: { missions: "missions", region: "Region", duration: "Duration", legend: "Legend Type" },
}

function getI18n(field: I18nText, locale: string): string {
  return (field as unknown as Record<string, string>)[locale] || field.ko || ""
}

export function CourseHero({ course, missionCount, locale }: CourseHeroProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko
  const title = getI18n(course.title, locale)
  const description = getI18n(course.description, locale)
  const duration = getI18n(course.duration_text, locale)

  return (
    <section className="relative bg-[#F5F3EF] text-white overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src={course.thumbnail_url || "/images/dokkaebi-hero.jpg"}
          alt={title}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1B2A4A]/80" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl">
          {/* 뱃지 */}
          <div className="flex items-center gap-3 mb-4">
            <DifficultyBadge difficulty={course.difficulty} locale={locale} size="md" />
            <span className="text-sm text-white/60">📍 {course.region}</span>
          </div>

          {/* 타이틀 */}
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
            {description}
          </p>

          {/* 스탯 */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-white/50 text-xs mb-1">{label.duration}</p>
              <p className="font-bold text-[#D4A843]">⏱ {duration}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs mb-1">{label.missions}</p>
              <p className="font-bold text-[#D4A843]">🎯 {missionCount}{label.missions}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs mb-1">{label.legend}</p>
              <p className="font-bold text-[#D4A843]">👹 {course.legend_type}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
