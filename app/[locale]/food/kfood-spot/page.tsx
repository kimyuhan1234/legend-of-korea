import { Metadata } from "next"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { KFoodSpotList } from "@/components/features/food/KFoodSpotList"

interface Props {
  params: { locale: string }
  searchParams: { city?: string }
}

const META = {
  ko: { title: "K-Food Spot | Legend of Korea", desc: "한국 현지 맛집 & 시장 가이드" },
  ja: { title: "K-Food Spot | Legend of Korea", desc: "韓国現地のグルメ＆市場ガイド" },
  en: { title: "K-Food Spot | Legend of Korea", desc: "Korea local food & market guide" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title, description: m.desc }
}

const HERO = {
  ko: {
    badge: "📍 K-Food Spot",
    title: "현지인이 사랑하는\n그 맛집으로",
    subtitle: "전주·서울·부산·경주·제주 — 진짜 한국 맛을 찾아서",
  },
  ja: {
    badge: "📍 K-Food Spot",
    title: "地元が愛する\nあのお店へ",
    subtitle: "全州・ソウル・釜山・慶州・済州 — 本物の韓国の味を求めて",
  },
  en: {
    badge: "📍 K-Food Spot",
    title: "Where locals go\nto eat",
    subtitle: "Jeonju · Seoul · Busan · Gyeongju · Jeju — chasing real Korean flavor",
  },
}

export default function KFoodSpotPage({ params, searchParams }: Props) {
  const { locale } = params
  const cityFilter = searchParams.city || "all"
  const h = HERO[locale as keyof typeof HERO] || HERO.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="kfood-spot" />

      {/* 히어로 */}
      <section className="bg-cloud py-14 border-b border-mist">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F2937]/10 border border-ink/20 mb-5">
            <span className="text-ink text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-ink mb-4 whitespace-pre-line">{h.title}</h1>
          <p className="text-stone text-lg">{h.subtitle}</p>
        </div>
      </section>

      {/* 스팟 목록 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <KFoodSpotList locale={locale} cityFilter={cityFilter} />
      </section>
    </div>
  )
}
