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
    <div className="bg-white border-b border-cloud sticky top-16 z-40">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#9DD8CE] text-[#9DD8CE]"
                  : "border-transparent text-stone hover:text-[#111] hover:border-mist"
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
