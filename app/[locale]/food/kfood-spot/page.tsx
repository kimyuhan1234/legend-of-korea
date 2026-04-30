import { Metadata } from "next"
import { MapPin } from "lucide-react"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { KFoodCityGrid } from "@/components/features/food/KFoodCityGrid"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: "K-Food Spot | Cloud with you", desc: "한국 현지 맛집 가이드 (한국관광공사 공식 데이터)" },
  ja: { title: "K-Food Spot | Cloud with you", desc: "韓国現地のグルメガイド (韓国観光公社 公式)" },
  en: { title: "K-Food Spot | Cloud with you", desc: "Korea local food guide (KTO official data)" },
  'zh-CN': { title: "K-Food Spot | Cloud with you", desc: "韩国当地美食指南（韩国观光公社官方）" },
  'zh-TW': { title: "K-Food Spot | Cloud with you", desc: "韓國在地美食指南（韓國觀光公社官方）" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.en || META.ko
  return { title: m.title, description: m.desc }
}

const HERO = {
  ko: {
    badge: "K-Food Spot",
    title: "현지인이 사랑하는\n그 맛집으로",
    subtitle: "도시를 선택해 보세요 — 한국관광공사 공식 데이터",
  },
  ja: {
    badge: "K-Food Spot",
    title: "地元が愛する\nあのお店へ",
    subtitle: "都市を選んでください — 韓国観光公社の公式データ",
  },
  en: {
    badge: "K-Food Spot",
    title: "Where locals go\nto eat",
    subtitle: "Pick a city — official data from the Korea Tourism Organization",
  },
  'zh-CN': {
    badge: "K-Food Spot",
    title: "当地人爱去的\n那家餐厅",
    subtitle: "请选择城市 — 韩国观光公社官方数据",
  },
  'zh-TW': {
    badge: "K-Food Spot",
    title: "在地人愛去的\n那家餐廳",
    subtitle: "請選擇城市 — 韓國觀光公社官方資料",
  },
}

export default function KFoodSpotPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.en || HERO.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="kfood-spot" />

      {/* 히어로 */}
      <section className="bg-cloud py-14 border-b border-mist">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F2937]/10 border border-ink/20 mb-5">
            <MapPin className="w-3.5 h-3.5 text-ink" strokeWidth={2} aria-hidden />
            <span className="text-ink text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-ink mb-4 whitespace-pre-line">{h.title}</h1>
          <p className="text-stone text-lg">{h.subtitle}</p>
        </div>
      </section>

      {/* 도시 그리드 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <KFoodCityGrid locale={locale} />
      </section>
    </div>
  )
}
