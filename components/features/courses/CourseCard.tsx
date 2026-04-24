import Link from "next/link"
import Image from "next/image"
import { DifficultyBadge } from "@/components/shared/DifficultyBadge"
import type { I18nText } from "@/lib/supabase/types"
import { getRegionName } from "@/lib/constants/regions"

interface CourseCardProps {
  course: {
    id: string
    title: I18nText
    description: I18nText
    thumbnail_url: string | null
    difficulty: "easy" | "medium" | "hard"
    region: string
    duration_text: I18nText
    price_1p: number
    price_2p: number
  }
  locale: string
}

const LABEL = {
  ko: { from: "부터", region: "지역", duration: "소요 시간", detail: "자세히 보기" },
  ja: { from: "から", region: "地域", duration: "所要時間", detail: "詳しく見る" },
  en: { from: "from", region: "Region", duration: "Duration", detail: "View details" },
}

function getI18n(field: I18nText | null | undefined, locale: string): string {
  if (!field) return ""
  return (field as unknown as Record<string, string>)[locale] || field.en || field.ko || ""
}

export function CourseCard({ course, locale }: CourseCardProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.en || LABEL.ko
  const title = getI18n(course.title, locale)
  const description = getI18n(course.description, locale)
  const duration = getI18n(course.duration_text, locale)

  return (
    <Link
      href={`/${locale}/courses/${course.id}`}
      className="group block bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border-0 shadow-sm hover:shadow-md hover:border-blossom-deep/40 transition-all duration-200"
    >
      {/* 썸네일 */}
      <div className="relative aspect-[4/3] bg-cloud overflow-hidden">
        <Image
          src={course.thumbnail_url || "/images/dokkaebi-hero.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {/* 난이도 뱃지 */}
        <div className="absolute top-3 left-3">
          <DifficultyBadge difficulty={course.difficulty} locale={locale} />
        </div>
      </div>

      {/* 내용 */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-stone mb-2">
          <span>📍 {getRegionName(course.region, locale)}</span>
          <span>·</span>
          <span>⏱ {duration}</span>
        </div>

        <h3 className="text-base font-bold text-[#111] mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-stone leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-stone">1인 {label.from}</p>
            <p className="text-base font-black text-[#111]">
              ₩{course.price_1p.toLocaleString()}
            </p>
          </div>
          <span className="text-sm font-semibold text-blossom-deep group-hover:underline">
            {label.detail} →
          </span>
        </div>
      </div>
    </Link>
  )
}
