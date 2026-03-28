import Link from "next/link"

interface FoodTabNavProps {
  locale: string
  activeTab: "dupe" | "flag-cooking" | "kfood-spot"
}

const TABS = {
  ko: [
    { key: "dupe" as const, label: "🔗 듀프", href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 플래그 쿠킹", href: "/food/flag-cooking" },
    { key: "kfood-spot" as const, label: "📍 K-Food Spot", href: "/food/kfood-spot" },
  ],
  ja: [
    { key: "dupe" as const, label: "🔗 デュープ", href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 フラッグ料理", href: "/food/flag-cooking" },
    { key: "kfood-spot" as const, label: "📍 K-Food Spot", href: "/food/kfood-spot" },
  ],
  en: [
    { key: "dupe" as const, label: "🔗 Dupe", href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 Flag Cooking", href: "/food/flag-cooking" },
    { key: "kfood-spot" as const, label: "📍 K-Food Spot", href: "/food/kfood-spot" },
  ],
}

export function FoodTabNav({ locale, activeTab }: FoodTabNavProps) {
  const tabs = TABS[locale as keyof typeof TABS] || TABS.ko

  return (
    <div className="bg-white border-b border-[#e8ddd0] sticky top-16 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#D4A843] text-[#1B2A4A]"
                  : "border-transparent text-[#7a6a58] hover:text-[#1B2A4A] hover:border-[#e8ddd0]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
