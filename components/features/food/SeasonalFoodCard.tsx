'use client'

import Link from 'next/link'
import type { SeasonalFood } from '@/lib/data/food-seasonal'
import { SEASON_META } from '@/lib/data/food-seasonal'

interface SeasonalFoodCardProps {
  food: SeasonalFood
  locale: string
}

const HEALTH_TAG_LABELS: Record<string, Record<string, string>> = {
  ko: { skin: '🧴 피부', diet: '🏋️ 다이어트', immunity: '🛡️ 면역', energy: '⚡ 활력', digestion: '🫄 소화', antiAging: '✨ 항산화', hair: '💇 모발', bone: '🦴 뼈', eye: '👁️ 눈', heart: '❤️ 심혈관' },
  ja: { skin: '🧴 美肌', diet: '🏋️ ダイエット', immunity: '🛡️ 免疫', energy: '⚡ 活力', digestion: '🫄 消化', antiAging: '✨ 抗酸化', hair: '💇 髪', bone: '🦴 骨', eye: '👁️ 目', heart: '❤️ 心血管' },
  en: { skin: '🧴 Skin', diet: '🏋️ Diet', immunity: '🛡️ Immunity', energy: '⚡ Energy', digestion: '🫄 Digestion', antiAging: '✨ Anti-age', hair: '💇 Hair', bone: '🦴 Bone', eye: '👁️ Eye', heart: '❤️ Heart' },
  'zh-CN': { skin: '🧴 护肤', diet: '🏋️ 减脂', immunity: '🛡️ 免疫', energy: '⚡ 活力', digestion: '🫄 消化', antiAging: '✨ 抗氧化', hair: '💇 发质', bone: '🦴 骨骼', eye: '👁️ 眼', heart: '❤️ 心血管' },
  'zh-TW': { skin: '🧴 護膚', diet: '🏋️ 減脂', immunity: '🛡️ 免疫', energy: '⚡ 活力', digestion: '🫄 消化', antiAging: '✨ 抗氧化', hair: '💇 髮質', bone: '🦴 骨骼', eye: '👁️ 眼', heart: '❤️ 心血管' },
}

const SECTION_LABELS: Record<string, {
  why: string
  ingredients: string
  price: string
  where: string
  insta: string
  dupe: string
  detail: string
  monthsLabel: (months: string) => string
}> = {
  ko: {
    why: '왜 지금?',
    ingredients: '제철 재료',
    price: '가격대',
    where: '먹을 수 있는 곳',
    insta: '📸 인스타 포인트',
    dupe: '🔗 비슷한 외국 음식',
    detail: '자세히 보기 →',
    monthsLabel: (m) => `${m}월`,
  },
  ja: {
    why: '今が旬の理由',
    ingredients: '旬の食材',
    price: '価格帯',
    where: '食べられる場所',
    insta: '📸 インスタポイント',
    dupe: '🔗 似た海外料理',
    detail: '詳しく見る →',
    monthsLabel: (m) => `${m}月`,
  },
  en: {
    why: 'Why now?',
    ingredients: 'Seasonal Ingredients',
    price: 'Price',
    where: 'Where to eat',
    insta: '📸 Insta moment',
    dupe: '🔗 Similar dish abroad',
    detail: 'See details →',
    monthsLabel: (m) => `${m}`,
  },
  'zh-CN': {
    why: '为什么是现在？',
    ingredients: '当季食材',
    price: '价格',
    where: '去哪里吃',
    insta: '📸 拍照打卡',
    dupe: '🔗 类似海外料理',
    detail: '查看详情 →',
    monthsLabel: (m) => `${m}月`,
  },
  'zh-TW': {
    why: '為什麼是現在？',
    ingredients: '當季食材',
    price: '價格',
    where: '去哪裡吃',
    insta: '📸 拍照打卡',
    dupe: '🔗 類似海外料理',
    detail: '查看詳情 →',
    monthsLabel: (m) => `${m}月`,
  },
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as keyof typeof field] || field.en || field.ko
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] }, locale: string): string[] {
  return field[locale as keyof typeof field] || field.en || field.ko
}

function formatMonths(months: number[], labelFn: (m: string) => string): string {
  if (months.length === 0) return ''
  const sorted = [...months].sort((a, b) => a - b)
  return labelFn(sorted.join('·'))
}

export function SeasonalFoodCard({ food, locale }: SeasonalFoodCardProps) {
  const seasonMeta = SEASON_META[food.season]
  const ui = SECTION_LABELS[locale] ?? SECTION_LABELS.en
  const healthTagLabels = HEALTH_TAG_LABELS[locale] ?? HEALTH_TAG_LABELS.en

  const detailHref = food.foodId
    ? `/${locale}/food/dupe/${food.foodId.split('-')[0]}/${food.foodId}`
    : null

  return (
    <div className={`bg-gradient-to-br ${seasonMeta.gradientFrom} ${seasonMeta.gradientTo} rounded-3xl overflow-hidden border border-white/60 shadow-sm hover:shadow-md transition-all group`}>
      <div className="p-5 space-y-3">
        {/* 계절 배지 + 월 */}
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/80 text-[11px] font-black ${seasonMeta.color}`}>
            {seasonMeta.label[locale as keyof typeof seasonMeta.label] ?? seasonMeta.label.en}
          </span>
          <span className="text-[11px] font-bold text-slate-600">
            {formatMonths(food.months, ui.monthsLabel)}
          </span>
        </div>

        {/* 음식명 */}
        <h3 className="text-base font-black text-[#111] leading-tight group-hover:text-mint-deep transition-colors">
          {getL(food.name, locale)}
        </h3>

        {/* 왜 지금? */}
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[11px] font-bold text-slate-700 mb-1">⏰ {ui.why}</p>
          <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{getL(food.whySeasonal, locale)}</p>
        </div>

        {/* 제철 재료 */}
        <div>
          <p className="text-[11px] font-bold text-slate-600 mb-1.5">🌱 {ui.ingredients}</p>
          <div className="flex flex-wrap gap-1">
            {getLA(food.seasonalIngredients, locale).slice(0, 4).map((item) => (
              <span key={item} className="text-[10px] bg-white/70 text-slate-700 rounded-full px-2 py-0.5 font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 건강 효능 */}
        {food.healthTags && food.healthTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {food.healthTags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-mint-light text-mint-deep rounded-full px-2 py-0.5 font-bold">
                {healthTagLabels[tag] ?? tag}
              </span>
            ))}
          </div>
        )}

        {/* 가격 + 먹을 수 있는 곳 */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white/60 rounded-lg p-2">
            <p className="font-bold text-slate-500 mb-0.5">💰 {ui.price}</p>
            <p className="font-black text-[#111]">{food.priceRange}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2">
            <p className="font-bold text-slate-500 mb-0.5">📍 {ui.where}</p>
            <p className="text-slate-700 line-clamp-2 leading-snug">{getL(food.whereToEat, locale)}</p>
          </div>
        </div>

        {/* 인스타 포인트 */}
        <div className="bg-white/50 rounded-xl p-2.5">
          <p className="text-[11px] text-slate-700 leading-snug">
            <span className="font-bold">{ui.insta}</span>
            <br />
            <span className="italic">{getL(food.instaPoint, locale)}</span>
          </p>
        </div>

        {/* 듀프(비슷한 해외 음식) */}
        {food.dupeName && (
          <div className="border-t border-white/60 pt-2">
            <p className="text-[10px] text-slate-600">
              <span className="font-bold">{ui.dupe}</span>{' '}
              <span>{getL(food.dupeName, locale)}</span>
            </p>
          </div>
        )}

        {/* 상세 링크 (foodId 있을 때만) */}
        {detailHref && (
          <Link
            href={detailHref}
            className="block text-center text-xs font-bold text-mint-deep bg-white/70 hover:bg-white rounded-xl py-2 transition-colors"
          >
            {ui.detail}
          </Link>
        )}
      </div>
    </div>
  )
}
