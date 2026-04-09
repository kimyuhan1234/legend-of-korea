import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { regions } from "@/lib/data/food-dupes"

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

const COMING_SOON = {
  ko: "준비 중",
  ja: "準備中",
  en: "Coming Soon",
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

export default function DupePage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.ko
  const comingSoon = COMING_SOON[locale as keyof typeof COMING_SOON] || COMING_SOON.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      {/* 히어로 */}
      <section className="bg-[#1B2A4A] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/30 mb-5">
            <span className="text-[#D4A843] text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 whitespace-pre-line">{h.title}</h1>
          <p className="text-white/70 text-lg whitespace-pre-line max-w-xl mx-auto">{h.subtitle}</p>
        </div>
      </section>

      {/* 지역 선택 그리드 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {regions.map((region) => (
            <Link
              key={region.code}
              href={`/${locale}/food/dupe/${region.code}`}
              className="group bg-white rounded-3xl border border-[#e8ddd0] hover:border-[#D4A843]/50 hover:shadow-md transition-all overflow-hidden"
            >
              {/* 지역 이미지 */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={region.image}
                  alt={getL(region.name, locale)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A]/60 to-transparent" />
                <span className="absolute bottom-3 left-4 text-3xl">{region.icon}</span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-black text-[#1B2A4A] mb-1">
                  {getL(region.name, locale)}
                </h2>
                <p className="text-sm text-[#7a6a58] leading-relaxed mb-4">
                  {getL(region.description, locale)}
                </p>
                {region.foods.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4A843]">
                      {region.foods.length}{locale === "ko" ? "가지 음식" : locale === "ja" ? "品" : " dishes"}
                    </span>
                    <span className="text-[#D4A843] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F0E8] text-xs text-[#7a6a58] font-medium">
                    🕐 {comingSoon}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
