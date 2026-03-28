import Link from "next/link"
import type { DupePair } from "@/lib/data/food-dupes"

interface DupeCardProps {
  pair: DupePair
  locale: string
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as "ko" | "ja" | "en"] || field.ko
}

export function DupeCard({ pair, locale }: DupeCardProps) {
  const { koreanFood, foreignFood, similarityPercent, matchReason, tags } = pair

  return (
    <Link
      href={`/${locale}/food/dupe/${pair.id}`}
      className="group block bg-white rounded-3xl border border-[#e8ddd0] hover:border-[#D4A843]/50 hover:shadow-md transition-all overflow-hidden"
    >
      {/* 음식 비교 영역 */}
      <div className="flex items-stretch">
        {/* 한국 음식 */}
        <div className="flex-1 p-5 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#F5F0E8] flex items-center justify-center text-4xl mb-3 overflow-hidden">
            <span>🇰🇷</span>
          </div>
          <p className="text-xs text-[#7a6a58] mb-1">{koreanFood.countryFlag} {getL(koreanFood.countryName, locale)}</p>
          <p className="font-bold text-[#1B2A4A] text-sm leading-tight">{getL(koreanFood.name, locale)}</p>
        </div>

        {/* 유사도 중앙 */}
        <div className="flex flex-col items-center justify-center px-2 py-4 shrink-0">
          <div className="w-14 h-14 rounded-full bg-[#1B2A4A] flex flex-col items-center justify-center shadow-sm group-hover:bg-[#D4A843] transition-colors">
            <span className="text-white text-sm font-black leading-none">{similarityPercent}%</span>
          </div>
          <div className="mt-2 flex gap-1">
            <div className="w-1 h-1 rounded-full bg-[#e8ddd0]" />
            <div className="w-1 h-1 rounded-full bg-[#D4A843]" />
            <div className="w-1 h-1 rounded-full bg-[#e8ddd0]" />
          </div>
        </div>

        {/* 해외 음식 */}
        <div className="flex-1 p-5 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#F5F0E8] flex items-center justify-center text-4xl mb-3 overflow-hidden">
            <span>{foreignFood.countryFlag}</span>
          </div>
          <p className="text-xs text-[#7a6a58] mb-1">{foreignFood.countryFlag} {getL(foreignFood.countryName, locale)}</p>
          <p className="font-bold text-[#1B2A4A] text-sm leading-tight">{getL(foreignFood.name, locale)}</p>
        </div>
      </div>

      {/* 이유 */}
      <div className="px-5 pb-4 border-t border-[#F5F0E8]">
        <p className="text-xs text-[#7a6a58] mt-3 leading-relaxed line-clamp-2">
          {getL(matchReason, locale)}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F5F0E8] text-xs text-[#7a6a58]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
