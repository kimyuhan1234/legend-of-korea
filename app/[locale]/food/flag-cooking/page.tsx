import { Metadata } from "next"
import { FoodTabNav } from "@/components/features/food/FoodTabNav"
import { FlagCookingClient } from "@/components/features/food/FlagCookingClient"
import { flagCountries, fusionRecipes } from "@/lib/data/flag-cooking"
import type { FusionRecipe } from "@/lib/data/flag-cooking"

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: "플래그 쿠킹 | Clouds with you", desc: "12개국 × 한국 식재료로 만든 창작 퓨전 레시피 69가지" },
  ja: { title: "フラッグ料理 | Clouds with you", desc: "12カ国×韓国食材で作った創作フュージョンレシピ69種" },
  en: { title: "Flag Cooking | Clouds with you", desc: "69 original fusion recipes across 12 countries × Korean ingredients" },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] || META.en || META.ko
  return { title: m.title, description: m.desc }
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


export default function FlagCookingPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] || HERO.en || HERO.ko

  const recipesByCountry: Record<string, FusionRecipe[]> = {}
  for (const recipe of fusionRecipes) {
    if (!recipesByCountry[recipe.countryCode]) recipesByCountry[recipe.countryCode] = []
    recipesByCountry[recipe.countryCode].push(recipe)
  }

  return (
    <div>
      <FoodTabNav locale={locale} activeTab="flag-cooking" />

      {/* 히어로 */}
      <section className="bg-gradient-to-br from-mint to-blossom text-ink py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0B8B8]/20 border border-blossom-deep/30 mb-5">
            <span className="text-blossom-deep text-sm font-medium">{h.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 whitespace-pre-line">{h.title}</h1>
          <p className="text-slate text-lg">{h.subtitle}</p>
        </div>
      </section>

      <FlagCookingClient
        locale={locale}
        flagCountries={flagCountries}
        recipesByCountry={recipesByCountry}
      />
    </div>
  )
}

