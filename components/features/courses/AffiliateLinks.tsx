import { Disclaimer } from "@/components/shared/Disclaimer"
import type { I18nText } from "@/lib/supabase/types"

interface AffiliateLink {
  id: string
  type: string
  title: I18nText
  description: I18nText | null
  url: string
  image_url: string | null
}

interface AffiliateLinksProps {
  links: AffiliateLink[]
  locale: string
}

const SECTION_LABEL = {
  ko: {
    stay: "추천 숙소",
    transport: "추천 교통",
    food: "추천 맛집",
    other: "제휴 정보",
    external: "외부 사이트로 이동",
  },
  ja: {
    stay: "おすすめ宿泊",
    transport: "おすすめ交通",
    food: "おすすめグルメ",
    other: "提携情報",
    external: "外部サイトへ",
  },
  en: {
    stay: "Recommended Stays",
    transport: "Recommended Transport",
    food: "Recommended Food",
    other: "Partner Info",
    external: "Visit external site",
  },
}

function getI18n(field: I18nText | null, locale: string): string {
  if (!field) return ""
  return (field as unknown as Record<string, string>)[locale] || field.ko || ""
}

const TYPE_ICON: Record<string, string> = {
  stay: "🏨",
  transport: "🚌",
  food: "🍜",
  other: "🔗",
}

export function AffiliateLinks({ links, locale }: AffiliateLinksProps) {
  const label = SECTION_LABEL[locale as keyof typeof SECTION_LABEL] || SECTION_LABEL.ko

  if (links.length === 0) return null

  const grouped = links.reduce<Record<string, AffiliateLink[]>>((acc, link) => {
    if (!acc[link.type]) acc[link.type] = []
    acc[link.type].push(link)
    return acc
  }, {})

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xl md:text-2xl font-bold text-[#1B2A4A] mb-2">
        🗺️ {locale === "ko" ? "여행 준비" : locale === "ja" ? "旅行準備" : "Travel Prep"}
      </h2>

      <Disclaimer locale={locale} className="mb-6" />

      <div className="space-y-8">
        {Object.entries(grouped).map(([type, items]) => {
          const sectionLabel = label[type as keyof typeof label] || label.other
          const icon = TYPE_ICON[type] || "🔗"

          return (
            <div key={type}>
              <h3 className="text-sm font-bold text-[#7a6a58] uppercase tracking-wider mb-3">
                {icon} {sectionLabel}
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {items.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 bg-white rounded-2xl p-4 border border-[#e8ddd0] hover:border-[#D4A843]/50 hover:shadow-sm transition-all"
                  >
                    {link.image_url ? (
                      <img
                        src={link.image_url}
                        alt={getI18n(link.title, locale)}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#F5F0E8] flex items-center justify-center text-2xl shrink-0">
                        {icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1B2A4A] line-clamp-1 group-hover:text-[#D4A843] transition-colors">
                        {getI18n(link.title, locale)}
                      </p>
                      {link.description && (
                        <p className="text-xs text-[#7a6a58] mt-1 line-clamp-2">
                          {getI18n(link.description, locale)}
                        </p>
                      )}
                      <p className="text-xs text-[#D4A843] mt-2 font-medium">
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
    </section>
  )
}
