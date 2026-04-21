import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { FoodImageWithFallback } from "@/components/features/food/FoodImageWithFallback"
import { DupeCountrySelector } from "@/components/features/food/DupeCountrySelector"
import { regions } from "@/lib/data/food-dupes"
import { kfoodSpots } from "@/lib/data/kfood-spots"

interface Props {
  params: { locale: string; region: string; foodId: string }
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as string] || field.en || field.ko
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] }, locale: string): string[] {
  return field[locale as string] || field.en || field.ko
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = regions.find((r) => r.code === params.region)
  const food = region?.foods.find((f) => f.id === params.foodId)
  if (!food) return { title: "Not Found" }
  return { title: `${getL(food.name, params.locale)} | Cloud with you` }
}

const UI = {
  ko: {
    backRegion: "← 목록으로",
    story: "이 음식 이야기",
    ingredients: "주요 재료",
    tasteProfile: "맛 프로필",
    spotsTitle: "이 음식을 맛볼 수 있는 곳",
    spotsLink: "맛집 전체 보기 →",
    tryCta: (city: string) => `${city}에서 직접 맛보기 →`,
    tryDesc: (city: string) => `${city}에서 한국 음식의 진짜 맛을 경험해보세요`,
    courseLink: (city: string) => `${city} 코스 보러가기 →`,
  },
  ja: {
    backRegion: "← 一覧に戻る",
    story: "この料理のストーリー",
    ingredients: "主な食材",
    tasteProfile: "味プロフィール",
    spotsTitle: "この料理が食べられる場所",
    spotsLink: "グルメスポット一覧 →",
    tryCta: (city: string) => `${city}で実際に味わう →`,
    tryDesc: (city: string) => `${city}で韓国料理の本当の味を体験してください`,
    courseLink: (city: string) => `${city}コースを見る →`,
  },
  en: {
    backRegion: "← Back to list",
    story: "The Story",
    ingredients: "Key Ingredients",
    tasteProfile: "Taste Profile",
    spotsTitle: "Where to taste this dish",
    spotsLink: "See all food spots →",
    tryCta: (city: string) => `Taste it in ${city} →`,
    tryDesc: (city: string) => `Experience authentic Korean flavors in ${city}`,
    courseLink: (city: string) => `See ${city} Course →`,
  },
}

export default function FoodDetailPage({ params }: Props) {
  const { locale, region: regionCode, foodId } = params
  const region = regions.find((r) => r.code === regionCode)
  if (!region) notFound()

  const food = region.foods.find((f) => f.id === foodId)
  if (!food) notFound()

  const t = UI[locale as keyof typeof UI] || UI.en || UI.ko

  // 같은 도시의 K-Food Spot 최대 3개
  const relatedSpots = kfoodSpots.filter((s) => s.cityCode === food.region).slice(0, 3)

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      <div className="max-w-4xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {/* 뒤로가기 */}
        <Link
          href={`/${locale}/food/dupe/${regionCode}`}
          className="inline-flex items-center text-sm text-stone hover:text-[#111] mb-8 transition-colors"
        >
          {t.backRegion}
        </Link>

        {/* 음식 히어로 */}
        <div className="bg-cloud rounded-3xl overflow-hidden mb-8">
          <div className="relative h-56 md:h-72">
            <FoodImageWithFallback
              foodNameKo={food.name.ko}
              tags={food.tags}
              fallbackUrl={food.image}
              alt={getL(food.name, locale)}
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-[#1F2937]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {food.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-[#F0B8B8]/20 border border-blossom-deep/40 text-xs text-blossom-deep font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">{getL(food.name, locale)}</h1>
              <p className="text-slate text-sm mt-1">{region.icon} {getL(region.name, locale)}</p>
            </div>
          </div>
        </div>

        {/* 스토리텔링 */}
        <div className="bg-[#D4F0EB] border-l-4 border-blossom-deep pl-5 pr-4 py-5 rounded-r-2xl mb-8">
          <p className="text-xs font-bold text-blossom-deep uppercase tracking-wider mb-3">{t.story}</p>
          <p className="text-slate leading-relaxed text-base">{getL(food.storyDescription, locale)}</p>
        </div>

        {/* 주요 재료 */}
        <div className="bg-white rounded-3xl border border-mist p-6 mb-8">
          <p className="text-sm font-bold text-[#111] mb-5">{t.ingredients}</p>
          <div className="flex flex-wrap gap-2">
            {getLA(food.ingredients, locale).map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-full bg-cloud text-sm text-slate">
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
                className="text-sm text-blossom-deep font-bold hover:underline"
              >
                {t.spotsLink}
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-2xl border border-mist p-4 hover:border-blossom-deep/50 hover:shadow-sm transition-all"
                >
                  <p className="font-bold text-[#111] text-sm mb-1">
                    {getL(spot.name, locale)}
                  </p>
                  <p className="text-xs text-stone line-clamp-2">
                    {getL(spot.speciality, locale)}
                  </p>
                  <p className="text-xs text-stone mt-2">{spot.priceRange} · {spot.openHours}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-mint to-blossom rounded-3xl p-8 text-center">
          <p className="text-xl font-black text-ink mb-2">{t.tryCta(getL(region.name, locale))}</p>
          <p className="text-slate text-sm mb-6">{t.tryDesc(getL(region.name, locale))}</p>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-mint-deep text-white font-bold hover:bg-[#7BC8BC] transition-colors"
          >
            {t.courseLink(getL(region.name, locale))}
          </Link>
        </div>
      </div>
    </div>
  )
}