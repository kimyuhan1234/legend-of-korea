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
  skin:      { bg: 'bg-pink-100',    text: 'text-pink-700',    gradient: 'from-pink-50 to-rose-100' },
  antiAging: { bg: 'bg-indigo-100',  text: 'text-indigo-700',  gradient: 'from-indigo-50 to-purple-100' },
  immunity:  { bg: 'bg-blue-100',    text: 'text-blue-700',    gradient: 'from-blue-50 to-cyan-100' },
  digestion: { bg: 'bg-purple-100',  text: 'text-purple-700',  gradient: 'from-purple-50 to-violet-100' },
  diet:      { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-50 to-green-100' },
  bone:      { bg: 'bg-slate-100',   text: 'text-slate-700',   gradient: 'from-slate-50 to-gray-100' },
}

const TAG_LABELS: Record<string, Record<HealthTag, string>> = {
  ko: { skin: '🧴 피부 미용', antiAging: '✨ 항산화', immunity: '🛡️ 면역력', digestion: '🫄 소화', diet: '🏋️ 다이어트', bone: '🦴 뼈/관절' },
  ja: { skin: '🧴 美肌', antiAging: '✨ 抗酸化', immunity: '🛡️ 免疫力', digestion: '🫄 消化', diet: '🏋️ ダイエット', bone: '🦴 骨・関節' },
  en: { skin: '🧴 Skin Care', antiAging: '✨ Anti-aging', immunity: '🛡️ Immunity', digestion: '🫄 Digestion', diet: '🏋️ Diet', bone: '🦴 Bone & Joint' },
  'zh-CN': { skin: '🧴 护肤', antiAging: '✨ 抗氧化', immunity: '🛡️ 免疫力', digestion: '🫄 消化', diet: '🏋️ 减脂', bone: '🦴 骨骼' },
  'zh-TW': { skin: '🧴 護膚', antiAging: '✨ 抗氧化', immunity: '🛡️ 免疫力', digestion: '🫄 消化', diet: '🏋️ 減脂', bone: '🦴 骨骼' },
}

const RADAR_LABELS: Record<string, Record<string, string>> = {
  ko:     { skin: '피부', antiAging: '항산화', immunity: '면역', digestion: '소화', diet: '다이어트' },
  ja:     { skin: '肌', antiAging: '抗酸化', immunity: '免疫', digestion: '消化', diet: 'ダイエット' },
  en:     { skin: 'Skin', antiAging: 'Anti-aging', immunity: 'Immunity', digestion: 'Digestion', diet: 'Diet' },
  'zh-CN': { skin: '护肤', antiAging: '抗氧化', immunity: '免疫', digestion: '消化', diet: '减脂' },
  'zh-TW': { skin: '護膚', antiAging: '抗氧化', immunity: '免疫', digestion: '消化', diet: '減脂' },
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
    { subject: radarLabels.antiAging, value: food.healthRadar.antiAging },
    { subject: radarLabels.immunity,  value: food.healthRadar.immunity },
    { subject: radarLabels.digestion, value: food.healthRadar.digestion },
    { subject: radarLabels.diet,      value: food.healthRadar.diet },
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
