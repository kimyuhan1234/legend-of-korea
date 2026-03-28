import { Metadata } from "next"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { DupeCard } from "@/components/features/food/DupeCard"
import { dupePairs } from "@/lib/data/food-dupes"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: "맛 듀프 | Legend of Korea", desc: "좋아하는 그 맛, 한국에도 있었어요" },
  ja: { title: "味のデュープ | Legend of Korea", desc: "好きなあの味、韓国にもありました" },
  en: { title: "Taste Dupe | Legend of Korea", desc: "The flavors you love — found in Korea" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title, description: m.desc }
}

const HERO = {
  ko: {
    badge: "🔗 맛의 유사성 발견",
    title: "그 맛, 한국에도 있어요",
    subtitle: "좋아하는 맛은 이미 알고 있잖아요,\n나머지는 저희가 연결해 드려요",
    count: "쌍의 맛 연결",
  },
  ja: {
    badge: "🔗 味の類似性を発見",
    title: "その味、韓国にもあります",
    subtitle: "好きな味はもう知っている\nあとは私たちがつなぎます",
    count: "組の味つながり",
  },
  en: {
    badge: "🔗 Discover Flavor Similarities",
    title: "That flavor? Korea has it too.",
    subtitle: "You already know your favorite taste.\nWe'll connect the rest.",
    count: "flavor connections",
  },
}

export default function DupePage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      {/* 히어로 */}
      <section className="bg-[#1B2A4A] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/30 mb-5">
            <span className="text-[#D4A843] text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">{h.title}</h1>
          <p className="text-white/70 text-lg whitespace-pre-line max-w-xl mx-auto">{h.subtitle}</p>
          <p className="mt-6 text-[#D4A843] font-bold text-lg">
            {dupePairs.length} {h.count}
          </p>
        </div>
      </section>

      {/* 카드 그리드 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dupePairs.map((pair) => (
            <DupeCard key={pair.id} pair={pair} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  )
}
