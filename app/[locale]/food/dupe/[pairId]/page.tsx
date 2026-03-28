import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { TasteRadarChart } from "@/components/features/food/TasteRadarChart"
import { dupePairs } from "@/lib/data/food-dupes"

interface Props {
  params: { locale: string; pairId: string }
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] }, locale: string): string[] {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pair = dupePairs.find((p) => p.id === params.pairId)
  if (!pair) return { title: "Not Found" }
  const kName = getL(pair.koreanFood.name, params.locale)
  const fName = getL(pair.foreignFood.name, params.locale)
  return { title: `${kName} × ${fName} | Legend of Korea` }
}

const UI = {
  ko: {
    back: "← 듀프 목록",
    similarity: "맛 유사도",
    why: "왜 닮았을까?",
    ingredients: "재료 비교",
    taste: "맛 프로필",
    tryInJeonju: "전주에서 직접 맛보기",
    tryCta: "전주 코스 보러가기 →",
  },
  ja: {
    back: "← デュープ一覧",
    similarity: "味の類似度",
    why: "なぜ似ているの？",
    ingredients: "食材の比較",
    taste: "味プロフィール",
    tryInJeonju: "全州で実際に味わう",
    tryCta: "全州コースを見る →",
  },
  en: {
    back: "← Back to Dupes",
    similarity: "Flavor Similarity",
    why: "Why are they alike?",
    ingredients: "Ingredient Comparison",
    taste: "Taste Profile",
    tryInJeonju: "Taste it in Jeonju",
    tryCta: "See Jeonju Course →",
  },
}

export default function DupeDetailPage({ params }: Props) {
  const { locale, pairId } = params
  const pair = dupePairs.find((p) => p.id === pairId)
  if (!pair) notFound()

  const t = UI[locale as keyof typeof UI] || UI.ko
  const { koreanFood, foreignFood, similarityPercent, matchReason, tags } = pair

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="dupe" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 뒤로 */}
        <Link
          href={`/${locale}/food/dupe`}
          className="inline-flex items-center text-sm text-[#7a6a58] hover:text-[#1B2A4A] mb-8 transition-colors"
        >
          {t.back}
        </Link>

        {/* 유사도 헤더 */}
        <div className="bg-[#1B2A4A] rounded-3xl p-8 text-white mb-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl mb-2">{koreanFood.countryFlag}</div>
              <p className="font-black text-xl">{getL(koreanFood.name, locale)}</p>
              <p className="text-white/60 text-sm">{getL(koreanFood.countryName, locale)}</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-[#D4A843] flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-[#1B2A4A] text-2xl font-black leading-none">{similarityPercent}%</p>
                </div>
              </div>
              <p className="text-white/50 text-xs">{t.similarity}</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-2">{foreignFood.countryFlag}</div>
              <p className="font-black text-xl">{getL(foreignFood.name, locale)}</p>
              <p className="text-white/60 text-sm">{getL(foreignFood.countryName, locale)}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 왜 닮았나 */}
        <div className="bg-[#FFF8EC] border-l-4 border-[#D4A843] pl-5 pr-4 py-5 rounded-r-2xl mb-8">
          <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider mb-2">{t.why}</p>
          <p className="text-[#3a3028] leading-relaxed">{getL(matchReason, locale)}</p>
        </div>

        {/* 맛 프로필 & 재료 비교 (2컬럼) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 한국 음식 */}
          <div className="bg-white rounded-3xl border border-[#e8ddd0] p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{koreanFood.countryFlag}</span>
              <div>
                <p className="font-black text-[#1B2A4A]">{getL(koreanFood.name, locale)}</p>
                <p className="text-xs text-[#7a6a58]">{getL(koreanFood.description, locale)}</p>
              </div>
            </div>

            <div className="flex justify-center mb-5">
              <TasteRadarChart profile={koreanFood.tasteProfile} locale={locale} color="#D4A843" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#1B2A4A] mb-2">{t.ingredients}</p>
              <div className="flex flex-wrap gap-1.5">
                {getLA(koreanFood.ingredients, locale).map((item: string) => (
                  <span key={item} className="px-2.5 py-1 rounded-full bg-[#F5F0E8] text-xs text-[#3a3028]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 해외 음식 */}
          <div className="bg-white rounded-3xl border border-[#e8ddd0] p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{foreignFood.countryFlag}</span>
              <div>
                <p className="font-black text-[#1B2A4A]">{getL(foreignFood.name, locale)}</p>
                <p className="text-xs text-[#7a6a58]">{getL(foreignFood.description, locale)}</p>
              </div>
            </div>

            <div className="flex justify-center mb-5">
              <TasteRadarChart profile={foreignFood.tasteProfile} locale={locale} color="#7a6a58" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#1B2A4A] mb-2">{t.ingredients}</p>
              <div className="flex flex-wrap gap-1.5">
                {getLA(foreignFood.ingredients, locale).map((item: string) => (
                  <span key={item} className="px-2.5 py-1 rounded-full bg-[#F5F0E8] text-xs text-[#3a3028]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 전주에서 맛보기 CTA */}
        <div className="bg-[#1B2A4A] rounded-3xl p-8 text-center text-white">
          <p className="text-xl font-black mb-2">{t.tryInJeonju}</p>
          <p className="text-white/60 text-sm mb-6">
            {locale === "ko"
              ? "전주 도깨비 코스에서 한국 음식의 진짜 맛을 경험해보세요"
              : locale === "ja"
              ? "全州トッケビコースで韓国料理の本当の味を体験してみてください"
              : "Experience authentic Korean flavors on the Jeonju Dokkaebi Course"}
          </p>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors"
          >
            {t.tryCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
