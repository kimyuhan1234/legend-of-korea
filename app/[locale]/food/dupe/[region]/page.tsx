import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { regions } from "@/lib/data/food-dupes"

interface Props {
  params: { locale: string; region: string }
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = regions.find((r) => r.code === params.region)
  if (!region) return { title: "Not Found" }
  return { title: `${getL(region.name, params.locale)} ${params.locale === "ko" ? "음식" : params.locale === "ja" ? "料理" : "Food"} | Legend of Korea` }
}

const UI = {
  ko: { back: "← 지역 선택", subtitle: "대표 음식", dupeCount: "개의 유사 외국 음식", viewDetail: "자세히 보기 →", comingSoon: "콘텐츠 준비 중" },
  ja: { back: "← 地域選択", subtitle: "代表料理", dupeCount: "個の類似外国料理", viewDetail: "詳しく見る →", comingSoon: "コンテンツ準備中" },
  en: { back: "← All Regions", subtitle: "Regional Dishes", dupeCount: "flavor dupes", viewDetail: "Explore →", comingSoon: "Content coming soon" },
}

// 맛 프로필에서 가장 강한 맛 2개 반환
function topFlavors(profile: { sweet: number; salty: number; spicy: number; umami: number; sour: number }, locale: string): string {
  const LABELS = {
    ko: { sweet: "달콤", salty: "짭짤", spicy: "매콤", umami: "감칠맛", sour: "새콤" },
    ja: { sweet: "甘め", salty: "塩気", spicy: "辛め", umami: "旨味", sour: "酸味" },
    en: { sweet: "Sweet", salty: "Salty", spicy: "Spicy", umami: "Umami", sour: "Sour" },
  }
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.ko
  const entries = Object.entries(profile) as [keyof typeof profile, number][]
  const top = entries.sort((a, b) => b[1] - a[1]).slice(0, 2)
  return top.map(([k]) => labels[k]).join(" · ")
}

export default function RegionFoodsPage({ params }: Props) {
  const { locale, region: regionCode } = params
  const region = regions.find((r) => r.code === regionCode)
  if (!region) notFound()

  const t = UI[locale as keyof typeof UI] || UI.ko

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      {/* 지역 히어로 */}
      <section className="bg-gradient-to-br from-mint to-blossom text-ink py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-8 md:px-10">
          <Link
            href={`/${locale}/food/dupe`}
            className="inline-flex items-center text-sm text-white/50 hover:text-white mb-6 transition-colors"
          >
            {t.back}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{region.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{getL(region.name, locale)}</h1>
              <p className="text-slate mt-1">{getL(region.description, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 음식 그리드 */}
      <section className="max-w-6xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {region.foods.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="font-bold text-[#111] text-lg mb-2">{t.comingSoon}</p>
            <Link href={`/${locale}/food/dupe`} className="mt-4 inline-block text-sm text-blossom-deep hover:underline">
              {t.back}
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {region.foods.map((food) => (
              <Link
                key={food.id}
                href={`/${locale}/food/dupe/${regionCode}/${food.id}`}
                className="group bg-white rounded-3xl border border-mist hover:border-blossom-deep/50 hover:shadow-md transition-all overflow-hidden"
              >
                {/* 이미지 */}
                <div className="relative h-44 bg-gradient-to-br from-cloud to-blossom-light overflow-hidden">
                  <Image
                    src={food.image}
                    alt={getL(food.name, locale)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* 맛 강도 오버레이 */}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                    {food.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <h3 className="font-black text-[#111] mb-1">{getL(food.name, locale)}</h3>
                  <p className="text-xs text-blossom-deep font-semibold mb-3">{topFlavors(food.tasteProfile, locale)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone">
                      {Object.keys(food.dupes).length} {t.dupeCount}
                    </span>
                    <span className="text-xs text-blossom-deep group-hover:translate-x-0.5 transition-transform">
                      {t.viewDetail}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
