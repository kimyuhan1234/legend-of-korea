import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { TasteRadarChart } from "@/components/features/food/TasteRadarChart"
import { regions } from "@/lib/data/food-dupes"
import { kfoodSpots } from "@/lib/data/kfood-spots"

interface Props {
  params: { locale: string; region: string; foodId: string }
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] }, locale: string): string[] {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = regions.find((r) => r.code === params.region)
  const food = region?.foods.find((f) => f.id === params.foodId)
  if (!food) return { title: "Not Found" }
  return { title: `${getL(food.name, params.locale)} | Legend of Korea` }
}

const UI = {
  ko: {
    backRegion: "← 목록으로",
    story: "이 음식 이야기",
    ingredients: "주요 재료",
    tasteProfile: "맛 프로필",
    dupeTitle: "비슷한 외국 음식",
    similarity: "유사도",
    why: "왜 닮았나요?",
    spotsTitle: "이 음식을 맛볼 수 있는 곳",
    spotsLink: "맛집 전체 보기 →",
    tryCta: "전주에서 직접 맛보기 →",
    tryDesc: "전주 도깨비 코스에서 한국 음식의 진짜 맛을 경험해보세요",
  },
  ja: {
    backRegion: "← 一覧に戻る",
    story: "この料理のストーリー",
    ingredients: "主な食材",
    tasteProfile: "味プロフィール",
    dupeTitle: "似ている外国料理",
    similarity: "類似度",
    why: "なぜ似ているの？",
    spotsTitle: "この料理が食べられる場所",
    spotsLink: "グルメスポット一覧 →",
    tryCta: "全州で実際に味わう →",
    tryDesc: "全州トッケビコースで韓国料理の本当の味を体験してください",
  },
  en: {
    backRegion: "← Back to list",
    story: "The Story",
    ingredients: "Key Ingredients",
    tasteProfile: "Taste Profile",
    dupeTitle: "Similar Foreign Foods",
    similarity: "Similarity",
    why: "Why are they alike?",
    spotsTitle: "Where to taste this dish",
    spotsLink: "See all food spots →",
    tryCta: "Taste it in Jeonju →",
    tryDesc: "Experience authentic Korean flavors on the Jeonju Dokkaebi Course",
  },
}

// 유사도에 따른 색상
function similarityColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500"
  if (pct >= 70) return "bg-[#D4A843]"
  return "bg-[#7a6a58]"
}

export default function FoodDetailPage({ params }: Props) {
  const { locale, region: regionCode, foodId } = params
  const region = regions.find((r) => r.code === regionCode)
  if (!region) notFound()

  const food = region.foods.find((f) => f.id === foodId)
  if (!food) notFound()

  const t = UI[locale as keyof typeof UI] || UI.ko

  // 같은 도시의 K-Food Spot 최대 3개
  const relatedSpots = kfoodSpots.filter((s) => s.cityCode === food.region).slice(0, 3)

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 뒤로가기 */}
        <Link
          href={`/${locale}/food/dupe/${regionCode}`}
          className="inline-flex items-center text-sm text-[#7a6a58] hover:text-[#1B2A4A] mb-8 transition-colors"
        >
          {t.backRegion}
        </Link>

        {/* 음식 히어로 */}
        <div className="bg-[#1B2A4A] rounded-3xl overflow-hidden mb-8">
          <div className="relative h-56 md:h-72">
            <Image
              src={food.image}
              alt={getL(food.name, locale)}
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-[#1B2A4A]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {food.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/40 text-xs text-[#D4A843] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">{getL(food.name, locale)}</h1>
              <p className="text-white/60 text-sm mt-1">{region.icon} {getL(region.name, locale)}</p>
            </div>
          </div>
        </div>

        {/* 스토리텔링 */}
        <div className="bg-[#FFF8EC] border-l-4 border-[#D4A843] pl-5 pr-4 py-5 rounded-r-2xl mb-8">
          <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider mb-3">{t.story}</p>
          <p className="text-[#3a3028] leading-relaxed text-base">{getL(food.storyDescription, locale)}</p>
        </div>

        {/* 맛 프로필 + 재료 (2컬럼) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 맛 프로필 */}
          <div className="bg-white rounded-3xl border border-[#e8ddd0] p-6">
            <p className="text-sm font-bold text-[#1B2A4A] mb-5">{t.tasteProfile}</p>
            <div className="flex justify-center">
              <TasteRadarChart profile={food.tasteProfile} locale={locale} size={180} color="#D4A843" />
            </div>
          </div>

          {/* 주요 재료 */}
          <div className="bg-white rounded-3xl border border-[#e8ddd0] p-6">
            <p className="text-sm font-bold text-[#1B2A4A] mb-5">{t.ingredients}</p>
            <div className="flex flex-wrap gap-2">
              {getLA(food.ingredients, locale).map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full bg-[#F5F0E8] text-sm text-[#3a3028]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 유사한 외국 음식 */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-[#1B2A4A] mb-5">{t.dupeTitle}</h2>
          <div className="space-y-5">
            {food.dupes.map((dupe, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#e8ddd0] overflow-hidden">
                {/* 헤더 */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F5F0E8]">
                  <span className="text-3xl">{dupe.countryFlag}</span>
                  <div className="flex-1">
                    <p className="font-black text-[#1B2A4A]">{getL(dupe.name, locale)}</p>
                    <p className="text-xs text-[#7a6a58]">{getL(dupe.countryName, locale)}</p>
                  </div>
                  {/* 유사도 배지 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${similarityColor(dupe.similarityPercent)}`}>
                      <span className="text-white text-sm font-black">{dupe.similarityPercent}%</span>
                    </div>
                    <p className="text-xs text-[#7a6a58] mt-1">{t.similarity}</p>
                  </div>
                </div>

                {/* 왜 닮았나 */}
                <div className="px-6 py-4 bg-[#FAFAF8]">
                  <p className="text-xs font-bold text-[#D4A843] mb-1">{t.why}</p>
                  <p className="text-sm text-[#7a6a58] leading-relaxed">{getL(dupe.matchReason, locale)}</p>
                </div>

                {/* 레이더 + 재료 */}
                <div className="grid grid-cols-2 gap-0 divide-x divide-[#F5F0E8]">
                  <div className="px-6 py-5 flex flex-col items-center">
                    <TasteRadarChart profile={dupe.tasteProfile} locale={locale} size={120} color="#7a6a58" />
                    <p className="text-xs text-[#7a6a58] mt-2 text-center">{getL(dupe.name, locale)}</p>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-xs font-bold text-[#1B2A4A] mb-3">{t.ingredients}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {getLA(dupe.ingredients, locale).map((item) => (
                        <span key={item} className="px-2 py-0.5 rounded-full bg-[#F5F0E8] text-xs text-[#3a3028]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* K-Food Spot 연결 */}
        {relatedSpots.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-[#1B2A4A]">🍽️ {t.spotsTitle}</h2>
              <Link
                href={`/${locale}/food/kfood-spot?city=${food.region}`}
                className="text-sm text-[#D4A843] font-bold hover:underline"
              >
                {t.spotsLink}
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-2xl border border-[#e8ddd0] p-4 hover:border-[#D4A843]/50 hover:shadow-sm transition-all"
                >
                  <p className="font-bold text-[#1B2A4A] text-sm mb-1">
                    {getL(spot.name, locale)}
                  </p>
                  <p className="text-xs text-[#7a6a58] line-clamp-2">
                    {getL(spot.speciality, locale)}
                  </p>
                  <p className="text-xs text-[#b0a090] mt-2">{spot.priceRange} · {spot.openHours}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#1B2A4A] rounded-3xl p-8 text-center text-white">
          <p className="text-xl font-black mb-2">{t.tryCta}</p>
          <p className="text-white/60 text-sm mb-6">{t.tryDesc}</p>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors"
          >
            {locale === "ko" ? "전주 코스 보러가기 →" : locale === "ja" ? "全州コースを見る →" : "See Jeonju Course →"}
          </Link>
        </div>
      </div>
    </div>
  )
}
