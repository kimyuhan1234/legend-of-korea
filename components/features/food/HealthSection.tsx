'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import type { FoodHealthData, HealthTag } from '@/lib/data/food-health'

interface HealthSectionProps {
  health: FoodHealthData
  locale: string
}

const TAG_COLORS: Record<HealthTag, { bg: string; text: string }> = {
  skin:      { bg: 'bg-pink-100',    text: 'text-pink-700' },
  antiAging: { bg: 'bg-indigo-100',  text: 'text-indigo-700' },
  immunity:  { bg: 'bg-blue-100',    text: 'text-blue-700' },
  digestion: { bg: 'bg-purple-100',  text: 'text-purple-700' },
  diet:      { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  bone:      { bg: 'bg-slate-100',   text: 'text-slate-700' },
}

const TAG_LABELS: Record<string, Record<HealthTag, string>> = {
  ko: { skin: '🧴 피부 미용', antiAging: '✨ 항산화', immunity: '🛡️ 면역력', digestion: '🫄 소화', diet: '🏋️ 다이어트', bone: '🦴 뼈/관절' },
  ja: { skin: '🧴 美肌', antiAging: '✨ 抗酸化', immunity: '🛡️ 免疫力', digestion: '🫄 消化', diet: '🏋️ ダイエット', bone: '🦴 骨・関節' },
  en: { skin: '🧴 Skin Care', antiAging: '✨ Anti-aging', immunity: '🛡️ Immunity', digestion: '🫄 Digestion', diet: '🏋️ Diet', bone: '🦴 Bone & Joint' },
  'zh-CN': { skin: '🧴 护肤', antiAging: '✨ 抗氧化', immunity: '🛡️ 免疫力', digestion: '🫄 消化', diet: '🏋️ 减脂', bone: '🦴 骨骼' },
  'zh-TW': { skin: '🧴 護膚', antiAging: '✨ 抗氧化', immunity: '🛡️ 免疫力', digestion: '🫄 消化', diet: '🏋️ 減脂', bone: '🦴 骨骼' },
}

const RADAR_LABELS: Record<string, Record<string, string>> = {
  ko:      { skin: '피부', antiAging: '항산화', immunity: '면역', digestion: '소화', diet: '다이어트', bone: '뼈/관절' },
  ja:      { skin: '肌', antiAging: '抗酸化', immunity: '免疫', digestion: '消化', diet: 'ダイエット', bone: '骨・関節' },
  en:      { skin: 'Skin', antiAging: 'Anti-aging', immunity: 'Immunity', digestion: 'Digestion', diet: 'Diet', bone: 'Bone' },
  'zh-CN': { skin: '护肤', antiAging: '抗氧化', immunity: '免疫', digestion: '消化', diet: '减脂', bone: '骨骼' },
  'zh-TW': { skin: '護膚', antiAging: '抗氧化', immunity: '免疫', digestion: '消化', diet: '減脂', bone: '骨骼' },
}

const SECTION_LABELS: Record<string, { title: string; nutrients: string; desc: string }> = {
  ko:      { title: '🌿 건강 효능', nutrients: '주요 영양 성분', desc: '건강 효능 요약' },
  ja:      { title: '🌿 健康効能', nutrients: '主要栄養成分', desc: '健康効能の要約' },
  en:      { title: '🌿 Health Benefits', nutrients: 'Key Nutrients', desc: 'Health Summary' },
  'zh-CN': { title: '🌿 健康功效', nutrients: '主要营养成分', desc: '健康功效摘要' },
  'zh-TW': { title: '🌿 健康功效', nutrients: '主要營養成分', desc: '健康功效摘要' },
}

function getDesc(health: FoodHealthData, locale: string): string {
  const d = health.healthDescription
  return d[locale as keyof typeof d] || d.en || d.ko
}

export function HealthSection({ health, locale }: HealthSectionProps) {
  const tagLabels = TAG_LABELS[locale] ?? TAG_LABELS.en
  const radarLabels = RADAR_LABELS[locale] ?? RADAR_LABELS.en
  const ui = SECTION_LABELS[locale] ?? SECTION_LABELS.en

  const radarData = [
    { subject: radarLabels.skin,      value: health.healthRadar.skin },
    { subject: radarLabels.antiAging, value: health.healthRadar.antiAging },
    { subject: radarLabels.immunity,  value: health.healthRadar.immunity },
    { subject: radarLabels.digestion, value: health.healthRadar.digestion },
    { subject: radarLabels.diet,      value: health.healthRadar.diet },
    { subject: radarLabels.bone,      value: health.healthRadar.bone },
  ]

  return (
    <div className="bg-white rounded-3xl border border-mist p-6 mb-8">
      <p className="text-sm font-bold text-[#111] mb-5">{ui.title}</p>

      {/* Health tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {health.healthTags.map((tag) => {
          const c = TAG_COLORS[tag]
          return (
            <span
              key={tag}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}
            >
              {tagLabels[tag]}
            </span>
          )
        })}
      </div>

      {/* Radar + Stats side by side on md+ */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Radar Chart */}
        <div className="w-full md:w-[280px] h-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }}
              />
              <Radar
                dataKey="value"
                stroke="#5BBCAD"
                fill="#5BBCAD"
                fillOpacity={0.35}
                strokeWidth={2.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stat bars */}
        <div className="flex-1 w-full space-y-3">
          {radarData.map(({ subject, value }) => (
            <div key={subject} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 w-20 shrink-0">{subject}</span>
              <div className="flex-1 bg-cloud rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-mint-deep rounded-full transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs font-black text-mint-deep w-8 text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key nutrients */}
      <div className="mt-5">
        <p className="text-xs font-bold text-[#111] mb-2">🔑 {ui.nutrients}</p>
        <div className="flex flex-wrap gap-2">
          {health.keyNutrients.map((n) => (
            <span key={n} className="px-3 py-1.5 rounded-full bg-mint-light text-xs text-mint-deep font-medium">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 p-4 bg-mint-light rounded-2xl">
        <p className="text-xs font-bold text-mint-deep mb-1">💡 {ui.desc}</p>
        <p className="text-sm text-slate leading-relaxed">{getDesc(health, locale)}</p>
      </div>
    </div>
  )
}
