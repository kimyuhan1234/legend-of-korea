import { Metadata } from "next"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { DupeModeTabs } from "@/components/features/food/DupeModeTabs"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: "지역별 맛 듀프 | Legend of Korea", desc: "지역을 선택하고 한국 음식의 맛 유사성을 발견하세요" },
  ja: { title: "地域別味デュープ | Legend of Korea", desc: "地域を選んで韓国料理の味の類似性を発見しよう" },
  en: { title: "Regional Taste Dupe | Legend of Korea", desc: "Pick a region and discover Korean food flavor connections" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title, description: m.desc }
}

const HERO = {
  ko: {
    badge: "🔗 맛의 유사성 발견",
    title: "엄선된 각 지역의\n스페셜 요리를",
    subtitle: "당신이 알고 있는 맛 으로\n연결해 드려요",
  },
  ja: {
    badge: "🔗 味の類似性を発見",
    title: "どの地域の味が\n気になりますか？",
    subtitle: "好きな味はもう知っている\nあとは私たちがつなぎます",
  },
  en: {
    badge: "🔗 Discover Flavor Similarities",
    title: "Which region's flavors\ncall to you?",
    subtitle: "You already know your favorite taste.\nWe'll connect the rest.",
  },
}

export default function DupePage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      {/* 히어로 */}
      <section className="bg-[#1F2937] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0B8B8]/20 border border-[#F0B8B8]/30 mb-5">
            <span className="text-[#F0B8B8] text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 whitespace-pre-line">{h.title}</h1>
          <p className="text-white/70 text-lg whitespace-pre-line max-w-xl mx-auto">{h.subtitle}</p>
        </div>
      </section>

      {/* 4모드 스와이프 탭 (도시별 / AI 매칭 / 취향 / 세계지도) */}
      <DupeModeTabs locale={locale} />
    </div>
  )
}
