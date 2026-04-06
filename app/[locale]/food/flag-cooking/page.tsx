"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { TasteRadarChart } from "@/components/features/food/TasteRadarChart"
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
    subtitle: "12개국 × 한국 식재료로 만든 창작 퓨전 레시피 69가지",
  },
  ja: {
    badge: "🚩 フラッグ料理",
    title: "国旗を選んで\n韓国×世界のフュージョンレシピを発見",
    subtitle: "12カ国×韓国食材で作った創作フュージョンレシピ69種",
  },
  en: {
    badge: "🚩 Flag Cooking",
    title: "Pick a flag and discover\nKorea × World fusion recipes",
    subtitle: "69 original fusion recipes across 12 countries × Korean ingredients",
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
    clickHint: "카드를 클릭하면 상세 레시피를 볼 수 있어요",
    tasteProfile: "🎯 맛 프로필",
    ingredients: "🥘 재료",
    steps: "👨‍🍳 조리 순서",
    koreanBaseLabel: "한국 베이스",
    foreignBaseLabel: "상대국 요소",
  },
  ja: {
    gridTitle: "どの国の料理が好きですか？",
    resultHeader: (flag: string, name: string) => `🇰🇷 韓国 × ${flag} ${name} フュージョンレシピ`,
    koreanBase: "韓国ベース",
    foreignElement: "海外要素",
    cookTime: "分",
    servings: "人前",
    empty: "上から国旗を選ぶとフュージョンレシピが表示されます",
    clickHint: "カードをクリックすると詳細レシピが見られます",
    tasteProfile: "🎯 味プロフィール",
    ingredients: "🥘 材料",
    steps: "👨‍🍳 調理手順",
    koreanBaseLabel: "韓国ベース",
    foreignBaseLabel: "相手国の要素",
  },
  en: {
    gridTitle: "Which country's food do you love?",
    resultHeader: (flag: string, name: string) => `🇰🇷 Korea × ${flag} ${name} Fusion Recipes`,
    koreanBase: "Korean Base",
    foreignElement: "Foreign Element",
    cookTime: "min",
    servings: "servings",
    empty: "Select a flag above to reveal fusion recipes",
    clickHint: "Click a card to view the full recipe",
    tasteProfile: "🎯 Taste Profile",
    ingredients: "🥘 Ingredients",
    steps: "👨‍🍳 Steps",
    koreanBaseLabel: "Korean Base",
    foreignBaseLabel: "Foreign Element",
  },
}

// TasteRadarChart expects 0-100; tasteProfile is 0-5 → ×20
function scaledProfile(tp: FusionRecipe["tasteProfile"]) {
  return {
    sweet: tp.sweet * 20,
    salty: tp.salty * 20,
    spicy: tp.spicy * 20,
    umami: tp.umami * 20,
    sour: tp.sour * 20,
  }
}

function RecipeCard({
  recipe,
  index,
  countryFlag,
  locale,
  onSelect,
}: {
  recipe: FusionRecipe
  index: number
  countryFlag: string
  locale: string
  onSelect: (recipe: FusionRecipe) => void
}) {
  const t = UI[locale as keyof typeof UI] || UI.ko
  const diffLabel = DIFFICULTY_LABEL[locale as keyof typeof DIFFICULTY_LABEL] || DIFFICULTY_LABEL.ko

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="cursor-pointer bg-white rounded-2xl border border-[#e8ddd0] p-5 flex flex-col gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#D4A843]">{countryFlag} × 🇰🇷</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
          {diffLabel[recipe.difficulty]}
        </span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xl">{recipe.emoji}</span>
          <p className="text-base font-bold text-[#1B2A4A] leading-tight">{getL(recipe.name, locale)}</p>
        </div>
        <p className="text-sm text-[#7a6a58] leading-relaxed line-clamp-2">
          {getL(recipe.description, locale)}
        </p>
      </div>
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
      <div className="flex items-center gap-3 text-xs text-[#7a6a58] pt-1 border-t border-[#f0ebe3]">
        <span>⏱ {recipe.cookTime}{t.cookTime}</span>
        <span>👤 {recipe.servings}{t.servings}</span>
        <span className="ml-auto text-[#D4A843] font-bold">#{String(index + 1).padStart(2, "0")}</span>
      </div>
    </div>
  )
}

export default function FlagCookingPage() {
  const params = useParams()
  const locale = (params?.locale as string) || "ko"
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<FusionRecipe | null>(null)

  const h = HERO[locale as keyof typeof HERO] || HERO.ko
  const t = UI[locale as keyof typeof UI] || UI.ko
  const diffLabel = DIFFICULTY_LABEL[locale as keyof typeof DIFFICULTY_LABEL] || DIFFICULTY_LABEL.ko

  const router = useRouter()
  const country = selectedCountry ? getFlagCountry(selectedCountry) : null
  const recipes: FusionRecipe[] = selectedCountry ? getRecipesByCountry(selectedCountry) : []
  const recipeCountry = selectedRecipe ? getFlagCountry(selectedRecipe.countryCode) : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedRecipe(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedRecipe ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [selectedRecipe])

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
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
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
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xl font-black text-[#1B2A4A]">
                {country && t.resultHeader(country.flag, getL(country.name, locale))}
              </h3>
              <p className="text-xs text-[#7a6a58]">👆 {t.clickHint}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, i) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={i}
                  countryFlag={country?.flag ?? ""}
                  locale={locale}
                  onSelect={setSelectedRecipe}
                />
              ))}
              {/* 레시피 등록 빈 카드 */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#FF6B35] hover:bg-orange-50 transition-all"
                onClick={() => router.push(`/${locale}/community/recipe/write`)}
              >
                <span className="text-4xl mb-2">✏️</span>
                <p className="font-bold text-[#2D1B69]">나만의 레시피 등록</p>
                <p className="text-sm text-gray-500 mt-1">나만의 퓨전 요리를 공유해보세요!</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 상세 모달 ── */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 md:p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center text-2xl transition-colors"
              aria-label="Close"
            >
              ×
            </button>

            {/* ① 최상단 — 요리 이름 + 메타 */}
            <div className="px-5 md:px-8 pt-5 md:pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2D1B69] pr-10">
                {selectedRecipe.emoji} {getL(selectedRecipe.name, locale)}
              </h2>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold ${DIFFICULTY_COLOR[selectedRecipe.difficulty]}`}>
                  {diffLabel[selectedRecipe.difficulty]}
                </span>
                <span className="text-gray-500 text-xs md:text-sm">⏱ {selectedRecipe.cookTime}{t.cookTime}</span>
                <span className="text-gray-500 text-xs md:text-sm">👤 {selectedRecipe.servings}{t.servings}</span>
              </div>
            </div>

            {/* ② 본문 2열 */}
            <div className="grid grid-cols-1 md:grid-cols-[45%_55%]">

              {/* ===== 왼쪽: 이미지 + 맛 레이더 ===== */}
              <div className="flex flex-col">
                {/* 이미지 */}
                <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                  {selectedRecipe.image ? (
                    <Image
                      src={selectedRecipe.image}
                      alt={getL(selectedRecipe.name, locale)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-7xl md:text-8xl">
                      {selectedRecipe.emoji}
                    </div>
                  )}
                </div>

                {/* 맛 레이더 차트 — 컴팩트하게 */}
                <div className="px-5 md:px-6 py-4 border-t border-gray-100">
                  <h3 className="text-sm md:text-base font-bold text-[#2D1B69] mb-2">
                    {t.tasteProfile}
                  </h3>
                  <div className="w-full max-w-[180px] md:max-w-[200px] mx-auto">
                    <TasteRadarChart
                      profile={scaledProfile(selectedRecipe.tasteProfile)}
                      locale={locale}
                      size={200}
                      color="#D4A843"
                    />
                  </div>
                </div>
              </div>

              {/* ===== 오른쪽: 재료 + 조리순서 ===== */}
              <div className="md:border-l border-t md:border-t-0 border-gray-100 overflow-y-auto md:max-h-[600px]">

                {/* 재료 */}
                <div className="px-5 md:px-6 pt-5 pb-4 border-b border-gray-50">
                  <h3 className="text-sm md:text-base font-bold text-[#2D1B69] mb-3">
                    <span className="border-b-2 border-[#FF6B35] pb-1">{t.ingredients}</span>
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm md:text-[15px] text-gray-700 leading-relaxed">
                        <span className="text-[#FF6B35] mt-0.5 flex-shrink-0">•</span>
                        <span className="break-words">{getL(ing, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 조리 순서 */}
                <div className="px-5 md:px-6 pt-5 pb-6">
                  <h3 className="text-sm md:text-base font-bold text-[#2D1B69] mb-4">
                    <span className="border-b-2 border-[#FF6B35] pb-1">{t.steps}</span>
                  </h3>
                  <ol className="space-y-4">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2D1B69] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed break-words whitespace-normal">
                          {getL(step, locale)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* ③ 하단 — 태그 + 한줄 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-[45%_55%] border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              {/* 왼쪽 — 베이스 태그 */}
              <div className="px-5 md:px-6 py-3 md:py-4 flex items-center flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
                  🇰🇷 {getL(selectedRecipe.koreanBase, locale)}
                </span>
                <span className="text-gray-400 text-base">×</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
                  {recipeCountry?.flag ?? "🌍"} {getL(selectedRecipe.foreignElement, locale)}
                </span>
              </div>
              {/* 오른쪽 — 한줄 요리 소개 */}
              <div className="px-5 md:px-6 py-3 md:py-4 md:border-l border-t md:border-t-0 border-gray-200 flex items-center">
                <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed break-words">
                  {getL(selectedRecipe.description, locale)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
