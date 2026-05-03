import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { REGION_GROUPS } from "@/lib/data/regions-hierarchy"

type LocaleKey = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const PROMPT: Record<LocaleKey, string> = {
  ko: '권역을 선택하세요',
  ja: 'エリアを選択してください',
  en: 'Choose a region',
  'zh-CN': '请选择区域',
  'zh-TW': '請選擇區域',
}

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
    subtitle: "권역을 선택해 보세요 — 한국관광공사 공식 데이터",
  },
  ja: {
    badge: "K-Food Spot",
    title: "地元が愛する\nあのお店へ",
    subtitle: "エリアを選んでください — 韓国観光公社の公式データ",
  },
  en: {
    badge: "K-Food Spot",
    title: "Where locals go\nto eat",
    subtitle: "Pick a region — official data from the Korea Tourism Organization",
  },
  'zh-CN': {
    badge: "K-Food Spot",
    title: "当地人爱去的\n那家餐厅",
    subtitle: "请选择区域 — 韩国观光公社官方数据",
  },
  'zh-TW': {
    badge: "K-Food Spot",
    title: "在地人愛去的\n那家餐廳",
    subtitle: "請選擇區域 — 韓國觀光公社官方資料",
  },
}

export default function KFoodSpotPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.en || HERO.ko
  const lk: LocaleKey = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as LocaleKey[]).includes(locale as LocaleKey)
    ? (locale as LocaleKey)
    : 'ko'
  const prompt = PROMPT[lk]

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

      {/* 6 권역 카드 그리드 */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <p className="text-center text-stone text-sm font-medium mb-8">{prompt}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {REGION_GROUPS.map((group) => (
            <Link
              key={group.id}
              href={`/${locale}/food/kfood-spot/${group.id}`}
              className="group block relative overflow-hidden rounded-2xl bg-white border border-mist shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-square">
                <Image
                  src={`/images/region-card/${group.id}.png`}
                  alt={group.name[lk]}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-4 px-4">
                  <span className="block text-white text-base md:text-lg font-bold">{group.name[lk]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
