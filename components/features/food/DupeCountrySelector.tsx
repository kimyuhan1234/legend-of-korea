'use client'

import { useState } from 'react'
import { TasteRadarChart } from './TasteRadarChart'
import type { RegionalFood, DupeForeignFood } from '@/lib/data/food-dupes'

const COUNTRIES_12 = [
  { code: 'JP', flag: '🇯🇵', name: { ko: '일본', ja: '日本', en: 'Japan' } },
  { code: 'CN', flag: '🇨🇳', name: { ko: '중국', ja: '中国', en: 'China' } },
  { code: 'TH', flag: '🇹🇭', name: { ko: '태국', ja: 'タイ', en: 'Thailand' } },
  { code: 'VN', flag: '🇻🇳', name: { ko: '베트남', ja: 'ベトナム', en: 'Vietnam' } },
  { code: 'MY', flag: '🇲🇾', name: { ko: '말레이시아', ja: 'マレーシア', en: 'Malaysia' } },
  { code: 'ID', flag: '🇮🇩', name: { ko: '인도네시아', ja: 'インドネシア', en: 'Indonesia' } },
  { code: 'US', flag: '🇺🇸', name: { ko: '미국', ja: 'アメリカ', en: 'USA' } },
  { code: 'IT', flag: '🇮🇹', name: { ko: '이탈리아', ja: 'イタリア', en: 'Italy' } },
  { code: 'FR', flag: '🇫🇷', name: { ko: '프랑스', ja: 'フランス', en: 'France' } },
  { code: 'IN', flag: '🇮🇳', name: { ko: '인도', ja: 'インド', en: 'India' } },
  { code: 'ES', flag: '🇪🇸', name: { ko: '스페인', ja: 'スペイン', en: 'Spain' } },
  { code: 'MX', flag: '🇲🇽', name: { ko: '멕시코', ja: 'メキシコ', en: 'Mexico' } },
]

const UI = {
  ko: {
    title: '비슷한 외국 음식',
    myTaste: '내 맛 프로필',
    similarity: '유사도',
    why: '왜 닮았나요?',
    ingredients: '재료',
    noDataTitle: '처음 맛보는 맛',
    noDataSub: '아직 이 나라 데이터가 없어요 — 직접 경험하고 새로운 맛을 발견해 보세요!',
    challenge: '도전해 보세요 🔥',
  },
  ja: {
    title: '似ている外国料理',
    myTaste: '味プロフィール',
    similarity: '類似度',
    why: 'なぜ似ているの？',
    ingredients: '食材',
    noDataTitle: '初めての味',
    noDataSub: 'まだこの国のデータがありません — ぜひ自分で体験して新しい味を発見してください！',
    challenge: '挑戦してみよう 🔥',
  },
  en: {
    title: 'Similar Foreign Foods',
    myTaste: 'Taste Profile',
    similarity: 'Similarity',
    why: 'Why are they alike?',
    ingredients: 'Ingredients',
    noDataTitle: 'Uncharted Flavor',
    noDataSub: "No data yet for this country — go explore and discover it yourself!",
    challenge: 'Take the Challenge 🔥',
  },
}

function similarityColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 70) return 'bg-[#F0B8B8]'
  return 'bg-[#9CA3AF]'
}

function getL(field: { ko: string; ja: string; en: string }, locale: string): string {
  return field[locale as string] || field.ko
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] }, locale: string): string[] {
  return field[locale as string] || field.ko
}

interface Props {
  food: RegionalFood
  locale: string
}

export function DupeCountrySelector({ food, locale }: Props) {
  const [selected, setSelected] = useState<string>('JP')
  const t = UI[locale as keyof typeof UI] || UI.ko

  const country = COUNTRIES_12.find((c) => c.code === selected)!
  const entry = food.dupes[selected]
  const dupe: DupeForeignFood | undefined =
    entry && !('challenge' in entry) ? (entry as DupeForeignFood) : undefined

  return (
    <section className="mb-10">
      <h2 className="text-xl font-black text-[#111] mb-5">{t.title}</h2>

      {/* 국가 탭 + 콘텐츠 — 전체 너비 */}
      <div>
          {/* 가로 스크롤 국가 탭 */}
          <div className="overflow-x-auto pb-2 mb-5 -mx-1 px-1">
            <div className="flex gap-2 w-max">
              {COUNTRIES_12.map((c) => {
                const hasData = !!food.dupes[c.code]
                const isSelected = selected === c.code
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelected(c.code)}
                    className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl border transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#1F2937] border-ink text-white shadow-md'
                        : 'bg-white border-mist text-stone hover:border-blossom-deep/60 hover:bg-[#FFFBF5]'
                    }`}
                  >
                    <span className="text-xl leading-none">{c.flag}</span>
                    <span className="text-[10px] font-medium whitespace-nowrap">{getL(c.name, locale)}</span>
                    {/* 데이터 있음 표시 점 */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        hasData ? 'bg-[#F0B8B8]' : isSelected ? 'bg-white/30' : 'bg-mist'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* 조건 A: 데이터 있음 */}
          {dupe ? (
            <div className="bg-white rounded-3xl border border-mist overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0F2F5]">
                <span className="text-4xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#111] truncate">{getL(dupe.name, locale)}</p>
                  <p className="text-xs text-stone">{getL(country.name, locale)}</p>
                  <p className="text-xs text-stone mt-0.5 line-clamp-1">{getL(dupe.description, locale)}</p>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-13 h-13 w-[52px] h-[52px] rounded-full flex items-center justify-center ${similarityColor(
                      dupe.similarityPercent
                    )}`}
                  >
                    <span className="text-white text-sm font-black">{dupe.similarityPercent}%</span>
                  </div>
                  <p className="text-[10px] text-stone mt-1">{t.similarity}</p>
                </div>
              </div>

              {/* 왜 닮았나요 */}
              <div className="px-6 py-4 bg-snow">
                <p className="text-xs font-bold text-blossom-deep mb-1">{t.why}</p>
                <p className="text-sm text-stone leading-relaxed">{getL(dupe.matchReason, locale)}</p>
              </div>

              {/* 레이더 + 재료 */}
              <div className="grid grid-cols-2 divide-x divide-[#F0F2F5]">
                <div className="px-6 py-5 flex flex-col items-center">
                  <TasteRadarChart profile={dupe.tasteProfile} locale={locale} size={120} color="#9CA3AF" />
                  <p className="text-xs text-stone mt-2 text-center">{getL(dupe.name, locale)}</p>
                </div>
                <div className="px-6 py-5">
                  <p className="text-xs font-bold text-[#111] mb-3">{t.ingredients}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {getLA(dupe.ingredients, locale).map((item) => (
                      <span key={item} className="px-2 py-0.5 rounded-full bg-cloud text-xs text-slate">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 조건 B: 데이터 없음 */
            <div className="bg-gradient-to-br from-[#1F2937] to-slate rounded-3xl p-10 text-center">
              <div className="text-6xl mb-5">{country.flag}</div>
              <p className="text-2xl font-black text-white mb-2">{t.noDataTitle}</p>
              <p className="text-slate text-sm mb-7 max-w-xs mx-auto leading-relaxed">{t.noDataSub}</p>
              <span className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#F0B8B8] text-[#111] font-black text-sm">
                {t.challenge}
              </span>
            </div>
          )}
      </div>
    </section>
  )
}