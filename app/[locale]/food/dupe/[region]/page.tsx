import { notFound, permanentRedirect } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { FoodEmojiThumb } from "@/components/features/food/FoodEmojiThumb"
import { regions, type RegionalFood } from "@/lib/data/food-dupes"
import {
  REGION_GROUPS,
  REGION_TO_GROUP,
  type RegionGroup,
} from "@/lib/data/regions-hierarchy"

interface Props {
  params: { locale: string; region: string }
}

function getL(field: { ko: string; ja: string; en: string } | null | undefined, locale: string): string {
  if (!field) return ''
  return field[locale as keyof typeof field] || field.en || field.ko || ''
}

function getRegionGroup(id: string): RegionGroup | undefined {
  return REGION_GROUPS.find((g) => g.id === id)
}

/**
 * 권역 진입 시 표시할 음식 목록 = 권역 도시 음식 + national 음식.
 * 권역별 음식 불균형은 의도된 상태 — national 28건 이 모든 권역에 합쳐 노출.
 */
function collectGroupFoods(group: RegionGroup): RegionalFood[] {
  const memberFoods: RegionalFood[] = []
  for (const cityCode of group.regions) {
    const city = regions.find((r) => r.code === cityCode)
    if (city) memberFoods.push(...city.foods)
  }
  const nationalFoods = regions.find((r) => r.code === 'national')?.foods ?? []
  // national 의 region 필드는 'national' — 아래에서 food.region 으로 출처 도시 식별.
  return [...memberFoods, ...nationalFoods]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const group = getRegionGroup(params.region)
  if (group) {
    return { title: `${getL(group.name, params.locale)} ${params.locale === "ko" ? "음식" : params.locale === "ja" ? "料理" : "Food"} | Cloud with you` }
  }
  return { title: "Not Found" }
}

const UI = {
  ko: { back: "← 권역 선택", subtitle: "권역 음식", dupeCount: "개의 유사 외국 음식", viewDetail: "자세히 보기 →", comingSoon: "콘텐츠 준비 중" },
  ja: { back: "← エリア選択", subtitle: "エリア料理", dupeCount: "個の類似外国料理", viewDetail: "詳しく見る →", comingSoon: "コンテンツ準備中" },
  en: { back: "← All Regions", subtitle: "Regional Dishes", dupeCount: "flavor dupes", viewDetail: "Explore →", comingSoon: "Content coming soon" },
}

function topFlavors(profile: { sweet: number; salty: number; spicy: number; umami: number; sour: number }, locale: string): string {
  const LABELS = {
    ko: { sweet: "달콤", salty: "짭짤", spicy: "매콤", umami: "감칠맛", sour: "새콤" },
    ja: { sweet: "甘め", salty: "塩気", spicy: "辛め", umami: "旨味", sour: "酸味" },
    en: { sweet: "Sweet", salty: "Salty", spicy: "Spicy", umami: "Umami", sour: "Sour" },
  }
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en || LABELS.ko
  const entries = Object.entries(profile) as [keyof typeof profile, number][]
  const top = entries.sort((a, b) => b[1] - a[1]).slice(0, 2)
  return top.map(([k]) => labels[k]).join(" · ")
}

export default function RegionGroupFoodsPage({ params }: Props) {
  const { locale, region: regionParam } = params

  // Legacy 도시 코드 (jeonju, busan, ...) 진입 시 → 권역으로 영구 리다이렉트
  const legacyGroupId = REGION_TO_GROUP[regionParam]
  if (legacyGroupId) {
    permanentRedirect(`/${locale}/food/dupe/${legacyGroupId}`)
  }

  const group = getRegionGroup(regionParam)
  if (!group) notFound()

  const t = UI[locale as keyof typeof UI] || UI.en || UI.ko
  const foods = collectGroupFoods(group)

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      {/* 권역 히어로 */}
      <section className="bg-gradient-to-br from-mint to-blossom text-ink py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-8 md:px-10">
          <Link
            href={`/${locale}/food/dupe`}
            className="inline-flex items-center text-sm text-white/50 hover:text-white mb-6 transition-colors"
          >
            {t.back}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{group.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{group.name[locale as keyof typeof group.name] || group.name.ko}</h1>
              <p className="text-slate mt-1">
                {foods.length} {locale === "ko" ? "개 음식" : locale === "ja" ? "件の料理" : "dishes"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 음식 그리드 */}
      <section className="max-w-6xl mx-auto px-8 md:px-10 py-20 md:py-28">
        {foods.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="font-bold text-[#111] text-lg mb-2">{t.comingSoon}</p>
            <Link href={`/${locale}/food/dupe`} className="mt-4 inline-block text-sm text-blossom-deep hover:underline">
              {t.back}
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods.map((food) => (
              <div
                key={food.id}
                className="group bg-white rounded-3xl border border-mist hover:border-blossom-deep/50 hover:shadow-md transition-all overflow-hidden relative"
              >
                <Link
                  href={`/${locale}/food/dupe/${food.region}/${food.id}`}
                  className="absolute inset-0 z-[1]"
                  aria-label={getL(food.name, locale)}
                />

                <div className="relative h-44 bg-white overflow-hidden border-b border-mist">
                  {food.image ? (
                    <Image
                      src={food.image}
                      alt={getL(food.name, locale)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <FoodEmojiThumb
                      food={{ name: food.name, tags: food.tags }}
                      size="text-7xl"
                      bordered={false}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {food.image && food.imageCredit && (
                    <span className="absolute top-1 right-1 z-[6] text-[8px] text-white/95 bg-black/45 px-1 py-0.5 rounded">
                      {food.imageCredit}
                    </span>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1 z-[5] flex-wrap">
                    {food.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-700/70 text-white text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-black text-[#111] mb-1">{getL(food.name, locale)}</h3>
                  <p className="text-xs text-blossom-deep font-semibold mb-3">{topFlavors(food.tasteProfile, locale)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone">
                      {Object.values(food.dupes).reduce((sum, arr) => sum + arr.length, 0)} {t.dupeCount}
                    </span>
                    <span className="text-xs text-blossom-deep group-hover:translate-x-0.5 transition-transform">
                      {t.viewDetail}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
