import { Metadata } from "next"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { FlagCookingSelector } from "@/components/features/food/FlagCookingSelector"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: "플래그 쿠킹 | Legend of Korea", desc: "내 나라 음식과 닮은 한국 음식 찾기" },
  ja: { title: "フラッグ料理 | Legend of Korea", desc: "自国料理に似た韓国料理を見つける" },
  en: { title: "Flag Cooking | Legend of Korea", desc: "Find Korean food similar to your home cuisine" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.ko
  return { title: m.title, description: m.desc }
}

const HERO = {
  ko: {
    badge: "🚩 플래그 쿠킹",
    title: "당신의 나라 맛,\n한국에서 찾아드려요",
    subtitle: "국기를 선택하면 비슷한 한국 음식을 연결해드립니다",
  },
  ja: {
    badge: "🚩 フラッグ料理",
    title: "あなたの国の味を\n韓国で見つけます",
    subtitle: "国旗を選ぶと、似た韓国料理をご紹介します",
  },
  en: {
    badge: "🚩 Flag Cooking",
    title: "Your country's flavors,\nfound in Korea",
    subtitle: "Pick your flag and we'll match you to Korean food",
  },
}

export default function FlagCookingPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="flag-cooking" />

      {/* 히어로 */}
      <section className="bg-gradient-to-br from-[#1B2A4A] to-[#2a3f6e] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/30 mb-5">
            <span className="text-[#D4A843] text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 whitespace-pre-line">{h.title}</h1>
          <p className="text-white/70 text-lg">{h.subtitle}</p>
        </div>
      </section>

      {/* 셀렉터 (클라이언트 컴포넌트) */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <FlagCookingSelector locale={locale} />
      </section>
    </div>
  )
}
