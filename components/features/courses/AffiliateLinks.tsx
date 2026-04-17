"use client"

import { Disclaimer } from "@/components/shared/Disclaimer"
import type { I18nText } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface AffiliateLink {
  id: string
  type?: string
  category?: string
  title: I18nText
  description: I18nText | null
  url?: string
  target_url?: string
  image_url: string | null
}

interface AffiliateLinksProps {
  links: AffiliateLink[]
  locale: string
  className?: string
}

const SECTION_LABEL = {
  ko: {
    stay: "추천 숙소",
    accommodation: "추천 숙소",
    transport: "추천 교통",
    food: "추천 맛집",
    restaurant: "추천 맛집",
    other: "제휴 정보",
    external: "외부 사이트로 이동",
  },
  ja: {
    stay: "おすすめ宿泊",
    accommodation: "おすすめ宿泊",
    transport: "おすすめ交通",
    food: "おすすめグルメ",
    restaurant: "おすすめグルメ",
    other: "提携情報",
    external: "外部サイトへ",
  },
  en: {
    stay: "Recommended Stays",
    accommodation: "Recommended Stays",
    transport: "Recommended Transport",
    food: "Recommended Food",
    restaurant: "Recommended Food",
    other: "Partner Info",
    external: "Visit external site",
  },
}

function getI18n(field: I18nText | null, locale: string): string {
  if (!field) return ""
  return (field as unknown as Record<string, string>)[locale] || field.en || field.ko || ""
}

const TYPE_ICON: Record<string, string> = {
  stay: "🏨",
  accommodation: "🏨",
  transport: "🚄",
  food: "🍜",
  restaurant: "🍽️",
  other: "🔗",
}

export function AffiliateLinks({ links, locale, className }: AffiliateLinksProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [supabase])

  const label = SECTION_LABEL[locale as keyof typeof SECTION_LABEL] || SECTION_LABEL.en || SECTION_LABEL.ko

  if (links.length === 0) return null

  const grouped = links.reduce<Record<string, AffiliateLink[]>>((acc, link) => {
    const type = link.category || link.type || "other"
    if (!acc[type]) acc[type] = []
    acc[type].push(link)
    return acc
  }, {})

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      // 비동기로 클릭 로그 기록 (페이지 이동을 방해하지 않음)
      fetch("/api/affiliate/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: linkId, user_id: userId }),
      })
    } catch (error) {
      console.error("Click Tracking Error:", error)
    }
  }

  return (
    <div className={`h-full flex flex-col${className ? ` ${className}` : ""}`}>
      <h2 className="text-xl md:text-2xl font-bold text-[#111] mb-2">
        🗺️ {locale === "ko" ? "여행 준비" : locale === "ja" ? "旅行準備" : "Travel Prep"}
      </h2>

      <Disclaimer locale={locale} className="mb-6" />

      <div className="space-y-8">
        {Object.entries(grouped).map(([type, items]) => {
          const sectionLabel = label[type as keyof typeof label] || label.other
          const icon = TYPE_ICON[type] || "🔗"

          return (
            <div key={type}>
              <h3 className="text-sm font-bold text-stone uppercase tracking-wider mb-3">
                {icon} {sectionLabel}
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {items.map((link) => (
                  <a
                    key={link.id}
                    href={link.target_url || link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link.id, link.target_url || link.url || "")}
                    className="group flex items-start gap-4 bg-white rounded-2xl p-4 border border-mist hover:border-blossom-deep/50 hover:shadow-sm transition-all"
                  >
                    {link.image_url ? (
                      <img
                        src={link.image_url}
                        alt={getI18n(link.title, locale)}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-cloud flex items-center justify-center text-2xl shrink-0">
                        {icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#111] line-clamp-1 group-hover:text-blossom-deep transition-colors">
                        {getI18n(link.title, locale)}
                      </p>
                      {link.description && (
                        <p className="text-xs text-stone mt-1 line-clamp-2">
                          {getI18n(link.description, locale)}
                        </p>
                      )}
                      <p className="text-xs text-blossom-deep mt-2 font-medium">
                        {label.external} ↗
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
