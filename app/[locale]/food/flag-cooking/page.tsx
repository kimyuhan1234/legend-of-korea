"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { flagCountries, getRecipesByCountry, getFlagCountry } from "@/lib/data/flag-cooking"
import type { FusionRecipe } from "@/lib/data/flag-cooking"

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

const DIFFICULTY_LABEL: Record<string, Record<string, string>> = {
  ko: { easy: "쉬움", medium: "보통", hard: "어려움" },
  ja: { easy: "簡単", medium: "普通", hard: "難しい" },
  en: { easy: "Easy", medium: "Medium", hard: "Hard" },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
}

const HERO = {
  ko: {
    badge: "🚩 플래그 쿠킹",
    title: "국기를 선택하고\n한국 × 세계 퓨전 레시피를 만나세요",
    subtitle: "8개국 × 한국 식재료로 만든 창작 퓨전 레시피 40가지",
  },
  ja: {
    badge: "🚩 フラッグ料理",
    title: "国旗を選んで\n韓国×世界のフュージョンレシピを発見",
    subtitle: "8カ国×韓国食材で作った創作フュージョンレシピ40種",
  },
  en: {
    badge: "🚩 Flag Cooking",
    title: "Pick a flag and discover\nKorea × World fusion recipes",
    subtitle: "40 original fusion recipes across 8 countries × Korean ingredients",
  },
}

const UI = {
  ko: {
    gridTitle: "어느 나라 음식을 좋아하세요?",
    resultHeader: (flag: string, name: string) => `🇰🇷 한국 × ${flag} ${name} 퓨전 레시피`,
    koreanBase: "한국 베이스",
    foreignElement: "외국 요소",
    cookTime: "분",
    servings: "인분",
    empty: "위에서 국기를 선택하면 퓨전 레시피가 나타납니다",
    tryIt: "전주에서 직접 맛보기 →",
  },
  ja: {
    gridTitle: "どの国の料理が好きですか？",
    resultHeader: (flag: string, name: string) => `🇰🇷 韓国 × ${flag} ${name} フュージョンレシピ`,
    koreanBase: "韓国ベース",
    foreignElement: "海外要素",
    cookTime: "分",
    servings: "人前",
    empty: "上から国旗を選ぶとフュージョンレシピが表示されます",
    tryIt: "全州で直接味わう →",
  },
  en: {
    gridTitle: "Which country's food do you love?",
    resultHeader: (flag: string, name: string) => `🇰🇷 Korea × ${flag} ${name} Fusion Recipes`,
    koreanBase: "Korean Base",
    foreignElement: "Foreign Element",
    cookTime: "min",
    servings: "servings",
    empty: "Select a flag above to reveal fusion recipes",
    tryIt: "Taste it in Jeonju →",
  },
}

function RecipeCard({
  recipe,
  index,
  countryFlag,
  locale,
}: {
  recipe: FusionRecipe
  index: number
  countryFlag: string
  locale: string
}) {
  const t = UI[locale as keyof typeof UI] || UI.ko
  const diffLabel = DIFFICULTY_LABEL[locale as keyof typeof DIFFICULTY_LABEL] || DIFFICULTY_LABEL.ko

  return (
    <div className="bg-white rounded-2xl border border-[#e8ddd0] p-5 flex flex-col gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
      {/* 상단 배지 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#D4A843]">
          {countryFlag} × 🇰🇷
        </span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
          {diffLabel[recipe.difficulty]}
        </span>
      </div>

      {/* 레시피명 + 설명 */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xl">{recipe.emoji}</span>
          <p className="text-base font-bold text-[#1B2A4A] leading-tight">
            {getL(recipe.name, locale)}
          </p>
        </div>
        <p className="text-sm text-[#7a6a58] leading-relaxed">
          {getL(recipe.description, locale)}
        </p>
      </div>

      {/* 한국 요소 / 외국 요소 2컬럼 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#F5F0E8] rounded-xl p-3">
          <p className="text-xs text-[#7a6a58] mb-1">🇰🇷 {t.koreanBase}</p>
          <p className="text-sm font-semibold text-[#1B2A4A]">{getL(recipe.koreanBase, locale)}</p>
        </div>
        <div className="bg-[#F5F0E8] rounded-xl p-3">
          <p className="text-xs text-[#7a6a58] mb-1">{countryFlag} {t.foreignElement}</p>
          <p className="text-sm font-semibold text-[#1B2A4A]">{getL(recipe.foreignElement, locale)}</p>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="flex items-center gap-3 text-xs text-[#7a6a58] pt-1 border-t border-[#f0ebe3]">
        <span>⏱ {recipe.cookTime}{t.cookTime}</span>
        <span>👤 {recipe.servings}{t.servings}</span>
        <span className="ml-auto text-[#D4A843] font-bold">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

export default function FlagCookingPage() {
  const params = useParams()
  const locale = (params?.locale as string) || "ko"
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const h = HERO[locale as keyof typeof HERO] || HERO.ko
  const t = UI[locale as keyof typeof UI] || UI.ko

  const country = selectedCountry ? getFlagCountry(selectedCountry) : null
  const recipes: FusionRecipe[] = selectedCountry ? getRecipesByCountry(selectedCountry) : []

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

      <section className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* 국기 선택 그리드 */}
        <div>
          <h2 className="text-xl font-bold text-[#1B2A4A] mb-6">{t.gridTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {flagCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code === selectedCountry ? null : c.code)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-left ${
                  selectedCountry === c.code
                    ? "bg-[#FFF8EC] border-[#D4A843] shadow-sm"
                    : "bg-white border-gray-200 hover:border-[#D4A843]/50 hover:bg-[#FFF8EC]/40"
                }`}
              >
                <span className="text-3xl">{c.flag}</span>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#1B2A4A]">{getL(c.name, locale)}</p>
                  <p className="text-xs text-[#7a6a58] mt-0.5 leading-tight">{getL(c.tagline, locale)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 레시피 결과 */}
        {!selectedCountry ? (
          <div className="flex items-center justify-center py-16 text-[#7a6a58] text-sm">
            <span className="px-6 py-4 rounded-2xl bg-[#F5F0E8] border border-[#e8ddd0]">
              👆 {t.empty}
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-[#1B2A4A]">
              {country && t.resultHeader(country.flag, getL(country.name, locale))}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, i) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={i}
                  countryFlag={country?.flag ?? ""}
                  locale={locale}
                />
              ))}
            </div>

            <div className="pt-2 text-center">
              <a
                href={`/${locale}/courses`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors text-sm"
              >
                {t.tryIt}
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
