'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import type { FoodHealthData, HealthTag } from '@/lib/data/food-health'

interface BeautyFoodCardProps {
  food: FoodHealthData
  locale: string
}

const TAG_COLORS: Record<HealthTag, { bg: string; text: string; gradient: string }> = {
  skin:      { bg: 'bg-pink-100',   text: 'text-pink-700',   gradient: 'from-pink-50 to-rose-100' },
  diet:      { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-50 to-green-100' },
  immunity:  { bg: 'bg-blue-100',   text: 'text-blue-700',   gradient: 'from-blue-50 to-cyan-100' },
  energy:    { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-50 to-amber-100' },
  digestion: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-50 to-violet-100' },
  antiAging: { bg: 'bg-indigo-100', text: 'text-indigo-700', gradient: 'from-indigo-50 to-purple-100' },
  hair:      { bg: 'bg-teal-100',   text: 'text-teal-700',   gradient: 'from-teal-50 to-cyan-100' },
  bone:      { bg: 'bg-slate-100',  text: 'text-slate-700',  gradient: 'from-slate-50 to-gray-100' },
  eye:       { bg: 'bg-violet-100', text: 'text-violet-700', gradient: 'from-violet-50 to-purple-100' },
  heart:     { bg: 'bg-red-100',    text: 'text-red-700',    gradient: 'from-red-50 to-rose-100' },
}

const TAG_LABELS: Record<string, Record<HealthTag, string>> = {
  ko: { skin: '🧴 피부 미용', diet: '🏋️ 다이어트', immunity: '🛡️ 면역력', energy: '⚡ 활력', digestion: '🫄 소화', antiAging: '✨ 항산화', hair: '💇 모발', bone: '🦴 뼈/관절', eye: '👁️ 눈 건강', heart: '❤️ 심혈관' },
  ja: { skin: '🧴 美肌', diet: '🏋️ ダイエット', immunity: '🛡️ 免疫力', energy: '⚡ 活力', digestion: '🫄 消化', antiAging: '✨ 抗酸化', hair: '💇 髪の毛', bone: '🦴 骨・関節', eye: '👁️ 目の健康', heart: '❤️ 心血管' },
  en: { skin: '🧴 Skin Care', diet: '🏋️ Diet', immunity: '🛡️ Immunity', energy: '⚡ Energy', digestion: '🫄 Digestion', antiAging: '✨ Anti-aging', hair: '💇 Hair', bone: '🦴 Bone & Joint', eye: '👁️ Eye Health', heart: '❤️ Heart' },
  'zh-CN': { skin: '🧴 护肤', diet: '🏋️ 减脂', immunity: '🛡️ 免疫力', energy: '⚡ 活力', digestion: '🫄 消化', antiAging: '✨ 抗氧化', hair: '💇 发质', bone: '🦴 骨骼', eye: '👁️ 眼健康', heart: '❤️ 心血管' },
  'zh-TW': { skin: '🧴 護膚', diet: '🏋️ 減脂', immunity: '🛡️ 免疫力', energy: '⚡ 活力', digestion: '🫄 消化', antiAging: '✨ 抗氧化', hair: '💇 髮質', bone: '🦴 骨骼', eye: '👁️ 眼健康', heart: '❤️ 心血管' },
}

const RADAR_LABELS: Record<string, Record<string, string>> = {
  ko:     { skin: '피부', diet: '다이어트', immunity: '면역', energy: '활력', digestion: '소화', antiAging: '항산화' },
  ja:     { skin: '肌', diet: 'ダイエット', immunity: '免疫', energy: '活力', digestion: '消化', antiAging: '抗酸化' },
  en:     { skin: 'Skin', diet: 'Diet', immunity: 'Immunity', energy: 'Energy', digestion: 'Digestion', antiAging: 'Anti-aging' },
  'zh-CN': { skin: '护肤', diet: '减脂', immunity: '免疫', energy: '活力', digestion: '消化', antiAging: '抗氧化' },
  'zh-TW': { skin: '護膚', diet: '減脂', immunity: '免疫', energy: '活力', digestion: '消化', antiAging: '抗氧化' },
}

function getTagLabels(locale: string): Record<HealthTag, string> {
  return TAG_LABELS[locale] ?? TAG_LABELS.en
}

function getRadarLabels(locale: string): Record<string, string> {
  return RADAR_LABELS[locale] ?? RADAR_LABELS.en
}

function getName(food: FoodHealthData, locale: string): string {
  if (!food?.name) return ''
  return food.name[locale as keyof typeof food.name] || food.name.en || food.name.ko || ''
}

function getDesc(food: FoodHealthData, locale: string): string {
  const d = food?.healthDescription
  if (!d) return ''
  return d[locale as keyof typeof d] || d.en || d.ko || ''
}

export function BeautyFoodCard({ food, locale }: BeautyFoodCardProps) {
  const primaryTag = food.healthTags[0]
  const colors = TAG_COLORS[primaryTag] ?? TAG_COLORS.skin
  const tagLabels = getTagLabels(locale)
  const radarLabels = getRadarLabels(locale)

  const radarData = [
    { subject: radarLabels.skin,      value: food.healthRadar.skin },
    { subject: radarLabels.diet,      value: food.healthRadar.diet },
    { subject: radarLabels.immunity,  value: food.healthRadar.immunity },
    { subject: radarLabels.energy,    value: food.healthRadar.energy },
    { subject: radarLabels.digestion, value: food.healthRadar.digestion },
    { subject: radarLabels.antiAging, value: food.healthRadar.antiAging },
  ]

  return (
    <div className={`bg-gradient-to-br ${colors.gradient} rounded-3xl overflow-hidden border border-white/60 shadow-sm hover:shadow-md transition-all group`}>
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {food.healthTags.slice(0, 3).map((tag) => {
            const c = TAG_COLORS[tag]
            return (
              <span
                key={tag}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${c.bg} ${c.text}`}
              >
                {tagLabels[tag]}
              </span>
            )
          })}
        </div>
        <h3 className="text-sm font-black text-[#111] leading-tight group-hover:text-mint-deep transition-colors">
          {getName(food, locale)}
        </h3>
      </div>

      {/* Radar Chart */}
      <div className="px-2 h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
            <PolarGrid stroke="#d1d5db" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 9, fontWeight: 700, fill: '#374151' }}
            />
            <Radar
              dataKey="value"
              stroke="#5BBCAD"
              fill="#5BBCAD"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Nutrients + Description */}
      <div className="px-4 pb-4 pt-1 space-y-2">
        <div className="flex flex-wrap gap-1">
          {food.keyNutrients.slice(0, 3).map((n) => (
            <span key={n} className="text-[10px] bg-white/70 text-slate-600 rounded-full px-2 py-0.5 font-medium">
              {n}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
          {getDesc(food, locale)}
        </p>
      </div>
    </div>
  )
}
