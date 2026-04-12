import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { DupeCountrySelector } from "@/components/features/food/DupeCountrySelector"
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
    spotsTitle: "Where to taste this dish",
    spotsLink: "See all food spots →",
    tryCta: "Taste it in Jeonju →",
    tryDesc: "Experience authentic Korean flavors on the Jeonju Dokkaebi Course",
  },
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

      <div className="max-w-4xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {/* 뒤로가기 */}
        <Link
          href={`/${locale}/food/dupe/${regionCode}`}
          className="inline-flex items-center text-sm text-[#9CA3AF] hover:text-[#111] mb-8 transition-colors"
        >
          {t.backRegion}
        </Link>

        {/* 음식 히어로 */}
        <div className="bg-[#F0F2F5] rounded-3xl overflow-hidden mb-8">
          <div className="relative h-56 md:h-72">
            <Image
              src={food.image}
              alt={getL(food.name, locale)}
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-[#1F2937]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {food.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-[#F0B8B8]/20 border border-[#F0B8B8]/40 text-xs text-[#F0B8B8] font-medium">
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
        <div className="bg-[#D4F0EB] border-l-4 border-[#F0B8B8] pl-5 pr-4 py-5 rounded-r-2xl mb-8">
          <p className="text-xs font-bold text-[#F0B8B8] uppercase tracking-wider mb-3">{t.story}</p>
          <p className="text-[#4B5563] leading-relaxed text-base">{getL(food.storyDescription, locale)}</p>
        </div>

        {/* 주요 재료 */}
        <div className="bg-white rounded-3xl border border-[#E4E7EB] p-6 mb-8">
          <p className="text-sm font-bold text-[#111] mb-5">{t.ingredients}</p>
          <div className="flex flex-wrap gap-2">
            {getLA(food.ingredients, locale).map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-full bg-[#F0F2F5] text-sm text-[#4B5563]">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 12개국 듀프 선택기 (레이더 차트 + 탭) */}
        <DupeCountrySelector food={food} locale={locale} />

        {/* K-Food Spot 연결 */}
        {relatedSpots.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-[#111]">🍽️ {t.spotsTitle}</h2>
              <Link
                href={`/${locale}/food/kfood-spot?city=${food.region}`}
                className="text-sm text-[#F0B8B8] font-bold hover:underline"
              >
                {t.spotsLink}
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-2xl border border-[#E4E7EB] p-4 hover:border-[#F0B8B8]/50 hover:shadow-sm transition-all"
                >
                  <p className="font-bold text-[#111] text-sm mb-1">
                    {getL(spot.name, locale)}
                  </p>
                  <p className="text-xs text-[#9CA3AF] line-clamp-2">
                    {getL(spot.speciality, locale)}
                  </p>
                  <p className="text-xs text-[#b0a090] mt-2">{spot.priceRange} · {spot.openHours}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#1F2937] rounded-3xl p-8 text-center">
          <p className="text-xl font-black text-white mb-2">{t.tryCta}</p>
          <p className="text-white/60 text-sm mb-6">{t.tryDesc}</p>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#F0B8B8] text-[#111] font-bold hover:bg-[#F5D0D0] transition-colors"
          >
            {locale === "ko" ? "전주 코스 보러가기 →" : locale === "ja" ? "全州コースを見る →" : "See Jeonju Course →"}
          </Link>
        </div>
      </div>
    </div>
  )
}