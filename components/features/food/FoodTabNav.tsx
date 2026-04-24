import Link from "next/link"

interface FoodTabNavProps {
  locale: string
  activeTab: "dupe" | "flag-cooking" | "kfood-spot" | "beauty"
}

const TABS = {
  ko: [
    { key: "dupe" as const,         label: "🔗 듀프",          href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 플래그 쿠킹",   href: "/food/flag-cooking" },
    { key: "kfood-spot" as const,   label: "📍 K-Food Spot",   href: "/food/kfood-spot" },
    { key: "beauty" as const,       label: "🌿 뷰티 푸드",     href: "/food/beauty" },
  ],
  ja: [
    { key: "dupe" as const,         label: "🔗 デュープ",      href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 フラッグ料理",  href: "/food/flag-cooking" },
    { key: "kfood-spot" as const,   label: "📍 K-Food Spot",   href: "/food/kfood-spot" },
    { key: "beauty" as const,       label: "🌿 ビューティーフード", href: "/food/beauty" },
  ],
  en: [
    { key: "dupe" as const,         label: "🔗 Dupe",          href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 Flag Cooking",  href: "/food/flag-cooking" },
    { key: "kfood-spot" as const,   label: "📍 K-Food Spot",   href: "/food/kfood-spot" },
    { key: "beauty" as const,       label: "🌿 Beauty Food",   href: "/food/beauty" },
  ],
  "zh-CN": [
    { key: "dupe" as const,         label: "🔗 美食对比",      href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 国旗料理",      href: "/food/flag-cooking" },
    { key: "kfood-spot" as const,   label: "📍 K-Food Spot",   href: "/food/kfood-spot" },
    { key: "beauty" as const,       label: "🌿 美容美食",      href: "/food/beauty" },
  ],
  "zh-TW": [
    { key: "dupe" as const,         label: "🔗 美食對比",      href: "/food/dupe" },
    { key: "flag-cooking" as const, label: "🚩 國旗料理",      href: "/food/flag-cooking" },
    { key: "kfood-spot" as const,   label: "📍 K-Food Spot",   href: "/food/kfood-spot" },
    { key: "beauty" as const,       label: "🌿 美容美食",      href: "/food/beauty" },
  ],
}

export function FoodTabNav({ locale, activeTab }: FoodTabNavProps) {
  const tabs = TABS[locale as keyof typeof TABS] ?? TABS.en

  return (
    <div className="bg-white border-b border-cloud sticky top-16 z-40">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-mint-deep text-mint-deep"
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
