'use client'

import { useState } from 'react'
import Image from 'next/image'
import { TasteRadarChart } from './TasteRadarChart'
import type { RegionalFood, DupeCandidate, CountryCode } from '@/lib/data/food-dupes'

/**
 * Phase H — 한중일 한정. 9개국 폐기 후 JP/CN 만 노출.
 * Phase H-UI — 텍스트 버튼 → 이미지 버튼 (artique 인물 사진).
 */
const COUNTRIES_2 = [
  {
    code: 'JP',
    image: '/images/dupe-country/jp.png',
    name: { ko: '일본', ja: '日本', en: 'Japan', 'zh-CN': '日本', 'zh-TW': '日本' },
  },
  {
    code: 'CN',
    image: '/images/dupe-country/cn.png',
    name: { ko: '중국', ja: '中国', en: 'China', 'zh-CN': '中国', 'zh-TW': '中國' },
  },
]

const UI = {
  ko: {
    title: '듀프하기',
    myTaste: '내 맛 프로필',
    similarity: '유사도',
    why: '왜 닮았나요?',
    ingredients: '재료',
    strengths: '✅ 비슷한 점',
    limitations: '⚠️ 다른 점',
    tip: '💡 팁',
    candidate: '후보',
    noDataTitle: '처음 맛보는 맛',
    noDataSub: '아직 이 나라 데이터가 없어요 — 직접 경험하고 새로운 맛을 발견해 보세요!',
    challenge: '도전해 보세요 🔥',
  },
  ja: {
    title: 'デュープする',
    myTaste: '味プロフィール',
    similarity: '類似度',
    why: 'なぜ似ているの？',
    ingredients: '食材',
    strengths: '✅ 似ている点',
    limitations: '⚠️ 違う点',
    tip: '💡 ヒント',
    candidate: '候補',
    noDataTitle: '初めての味',
    noDataSub: 'まだこの国のデータがありません — ぜひ自分で体験して新しい味を発見してください！',
    challenge: '挑戦してみよう 🔥',
  },
  en: {
    title: 'Find Dupes',
    myTaste: 'Taste Profile',
    similarity: 'Similarity',
    why: 'Why are they alike?',
    ingredients: 'Ingredients',
    strengths: '✅ Strengths',
    limitations: '⚠️ Limitations',
    tip: '💡 Tip',
    candidate: 'Match',
    noDataTitle: 'Uncharted Flavor',
    noDataSub: "No data yet for this country — go explore and discover it yourself!",
    challenge: 'Take the Challenge 🔥',
  },
  'zh-CN': {
    title: '对比',
    myTaste: '我的口味档案',
    similarity: '相似度',
    why: '为什么相似？',
    ingredients: '食材',
    strengths: '✅ 相似点',
    limitations: '⚠️ 不同点',
    tip: '💡 小贴士',
    candidate: '候选',
    noDataTitle: '初次品尝的味道',
    noDataSub: '尚无此国家的数据 — 亲自体验并发现新味道吧！',
    challenge: '来挑战看看 🔥',
  },
  'zh-TW': {
    title: '對比',
    myTaste: '我的口味檔案',
    similarity: '相似度',
    why: '為什麼相似？',
    ingredients: '食材',
    strengths: '✅ 相似點',
    limitations: '⚠️ 不同點',
    tip: '💡 小撇步',
    candidate: '候選',
    noDataTitle: '初次品嘗的味道',
    noDataSub: '尚無此國家的數據 — 親自體驗並發現新風味吧！',
    challenge: '來挑戰看看 🔥',
  },
}

function similarityColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 70) return 'bg-[#F0B8B8]'
  return 'bg-[#9CA3AF]'
}

function getL(field: Record<string, string> | null | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

function getLA(field: { ko: string[]; ja: string[]; en: string[] } | null | undefined, locale: string): string[] {
  if (!field) return []
  return (field as Record<string, string[]>)[locale] || field.en || field.ko || []
}

interface Props {
  food: RegionalFood
  locale: string
}

export function DupeCountrySelector({ food, locale }: Props) {
  const [selected, setSelected] = useState<CountryCode>('JP')
  const t = UI[locale as keyof typeof UI] || UI.en || UI.ko

  const country = COUNTRIES_2.find((c) => c.code === selected)!
  const candidates: DupeCandidate[] = food.dupes[selected] ?? []

  return (
    <section className="mb-10">
      <h2 className="text-xl font-black text-[#111] mb-5">{t.title}</h2>

      <div>
          {/* 국가 이미지 버튼 — 가로 폭 균등 (grid 2 columns, aspect-square) */}
          {/* 활성/비활성 구분은 opacity 만 — ring/shadow/scale/뱃지 모두 제거 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {COUNTRIES_2.map((c) => {
              const cc = c.code as CountryCode
              const isSelected = selected === cc
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelected(cc)}
                  aria-pressed={isSelected}
                  className={`group relative flex flex-col items-center gap-2 transition-opacity duration-200 ${
                    isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={c.image}
                      alt={getL(c.name, locale)}
                      fill
                      sizes="(max-width: 768px) 50vw, 384px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-[#111]' : 'text-stone'}`}>
                    {getL(c.name, locale)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 조건 A: 후보 1개 이상 */}
          {candidates.length > 0 ? (
            <div className="space-y-4">
              {candidates.map((dupe, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-mist overflow-hidden">
                  {/* 헤더 */}
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0F2F5]">
                    <div className="w-14 h-14 rounded-xl overflow-hidden ring-1 ring-mist flex-shrink-0">
                      <Image
                        src={country.image}
                        alt={getL(country.name, locale)}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {candidates.length > 1 && (
                        <p className="text-[10px] font-bold text-blossom-deep mb-0.5">
                          {t.candidate} {idx + 1}/{candidates.length}
                        </p>
                      )}
                      <p className="font-black text-[#111] truncate">{getL(dupe.name, locale)}</p>
                      <p className="text-xs text-stone">{getL(country.name, locale)}</p>
                      <p className="text-xs text-stone mt-0.5 line-clamp-1">{getL(dupe.description, locale)}</p>
                    </div>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${similarityColor(
                          dupe.similarityPercent
                        )}`}
                      >
                        <span className="text-white text-sm font-black">{dupe.similarityPercent}%</span>
                      </div>
                      <p className="text-[10px] text-stone mt-1">{t.similarity}</p>
                    </div>
                  </div>

                  {/* 강점 / 한계 */}
                  <div className="px-6 py-4 bg-snow space-y-3">
                    {getLA(dupe.strengths, locale).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-emerald-700 mb-1">{t.strengths}</p>
                        <ul className="text-sm text-slate space-y-0.5 ml-1">
                          {getLA(dupe.strengths, locale).map((s, i) => (
                            <li key={i}>· {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {getLA(dupe.limitations, locale).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-amber-700 mb-1">{t.limitations}</p>
                        <ul className="text-sm text-slate space-y-0.5 ml-1">
                          {getLA(dupe.limitations, locale).map((s, i) => (
                            <li key={i}>· {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {dupe.tip && getL(dupe.tip, locale) && (
                      <div>
                        <p className="text-xs font-bold text-blossom-deep mb-1">{t.tip}</p>
                        <p className="text-sm text-slate ml-1">{getL(dupe.tip, locale)}</p>
                      </div>
                    )}
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
                        {getLA(dupe.ingredients, locale).map((item, i) => (
                          <span key={`${item}-${i}`} className="px-2 py-0.5 rounded-full bg-cloud text-xs text-slate">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 조건 B: 후보 0건 */
            <div className="bg-gradient-to-br from-[#1F2937] to-slate rounded-3xl p-10 text-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-5 ring-2 ring-white/30">
                <Image
                  src={country.image}
                  alt={getL(country.name, locale)}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
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