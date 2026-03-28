"use client"

import { useState } from "react"
import { flagCountries, type FlagCountry } from "@/lib/data/flag-cooking"

interface FlagCookingSelectorProps {
  locale: string
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

const UI = {
  ko: {
    title: "어느 나라 음식을 좋아하세요?",
    subtitle: "국기를 선택하면, 비슷한 한국 음식을 연결해드려요",
    result: "이런 한국 음식이 잘 맞을 거예요",
    because: "왜냐면...",
    tryIt: "전주에서 맛보기 →",
  },
  ja: {
    title: "どの国の料理が好きですか？",
    subtitle: "国旗を選ぶと、似た韓国料理をご紹介します",
    result: "あなたにぴったりの韓国料理はこちら",
    because: "なぜかというと…",
    tryIt: "全州で試してみる →",
  },
  en: {
    title: "Which country's food do you love?",
    subtitle: "Pick a flag and we'll match you to Korean food",
    result: "Korean food you'll probably love",
    because: "Because...",
    tryIt: "Try it in Jeonju →",
  },
}

export function FlagCookingSelector({ locale }: FlagCookingSelectorProps) {
  const [selected, setSelected] = useState<FlagCountry | null>(null)
  const t = UI[locale as keyof typeof UI] || UI.ko

  return (
    <div className="space-y-8">
      {/* 국기 그리드 */}
      <div>
        <h2 className="text-xl font-bold text-[#1B2A4A] mb-2">{t.title}</h2>
        <p className="text-[#7a6a58] text-sm mb-6">{t.subtitle}</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {flagCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelected(country.code === selected?.code ? null : country)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selected?.code === country.code
                  ? "border-[#D4A843] bg-[#FFF8EC] shadow-sm"
                  : "border-[#e8ddd0] bg-white hover:border-[#D4A843]/50 hover:bg-[#FFF8EC]/50"
              }`}
            >
              <span className="text-3xl">{country.flag}</span>
              <span className="text-xs font-medium text-[#1B2A4A]">{getL(country.name, locale)}</span>
              <span className="text-xs text-[#7a6a58] text-center leading-tight">{getL(country.cuisineStyle, locale)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {selected && (
        <div className="bg-white rounded-3xl border border-[#D4A843]/30 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{selected.flag}</span>
            <div>
              <h3 className="font-black text-[#1B2A4A] text-lg">{t.result}</h3>
              <p className="text-sm text-[#7a6a58]">{getL(selected.name, locale)} → 한국</p>
            </div>
          </div>

          <div className="space-y-4">
            {selected.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#F5F0E8] hover:bg-[#FFF8EC] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1B2A4A]">{getL(rec.koreanFoodName, locale)}</p>
                  <p className="text-xs text-[#7a6a58] mt-1 leading-relaxed">
                    {t.because} {getL(rec.reason, locale)}
                  </p>
                </div>
                <span className="text-2xl shrink-0">🇰🇷</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[#e8ddd0] text-center">
            <a
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors text-sm"
            >
              {t.tryIt}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
