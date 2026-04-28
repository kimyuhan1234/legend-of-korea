'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'
import { PassBlurOverlay } from '@/components/shared/PassBlurOverlay'
import { usePassStatus } from '@/hooks/usePassStatus'

interface TopFood {
  foodId: string
  foodName: { ko: string; en: string; ja: string }
  foodImage: string
  regionCode: string
  regionName: { ko: string; en: string; ja: string }
  matchScore: number
  matchReason: { ko: string; en: string; ja: string }
}

interface Surprise {
  recipeId: string
  recipeName: { ko: string; en: string; ja: string }
  recipeImage: string
  countryCode: string
  emoji: string
  koreanBase: { ko: string; en: string; ja: string }
  connectionReason: { ko: string; en: string; ja: string }
}

interface TasteMatchResultsProps {
  topFoods: TopFood[]
  surprises: Surprise[]
  locale: string
  isVisible: boolean
}

function getL(field: { ko: string; en: string; ja: string } | null | undefined, locale: string): string {
  if (!field) return ''
  return (field as Record<string, string>)[locale] || field.en || field.ko || ''
}

export function TasteMatchResults({ topFoods, surprises, locale, isVisible }: TasteMatchResultsProps) {
  const t = useTranslations('dupe')
  // PRD-PRICING-2026-001: 활성 패스 1 종 보유 시 모든 유료 콘텐츠 풀 액세스
  const { hasPass } = usePassStatus()
  const unlocked = hasPass

  if (!isVisible || topFoods.length === 0) return null

  const first = topFoods[0]
  const rest = topFoods.slice(1)

  return (
    <div className="mt-8 space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* TOP 3 헤더 */}
      <h3 className="text-xl font-black text-ink text-center">
        {t('results.top3')}
      </h3>

      {/* 1위 — 큰 카드 */}
      <div className="bg-white rounded-2xl shadow-md border-2 border-mint p-5">
        <div className="flex gap-4">
          {first.foodImage && (
            <Link href={`/${locale}/food/dupe/${first.regionCode}/${first.foodId}`} className="shrink-0">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
                <Image src={first.foodImage} alt={getL(first.foodName, locale)} fill sizes="128px" className="object-cover" />
              </div>
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-mint-deep text-white text-xs font-black flex items-center justify-center">1</span>
              <div>
                <p className="font-black text-ink">{getL(first.foodName, locale)}</p>
                <p className="text-[10px] text-stone">{getL(first.regionName, locale)}</p>
              </div>
              <p className="ml-auto text-2xl font-black text-mint-deep">{first.matchScore}%</p>
            </div>
            <div className="h-2 bg-mist rounded-full mb-3">
              <div className="h-full bg-mint-deep rounded-full" style={{ width: `${first.matchScore}%` }} />
            </div>
            <p className="text-xs text-slate mb-3">{getL(first.matchReason, locale)}</p>
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/food/dupe/${first.regionCode}/${first.foodId}`} className="text-xs font-bold text-mint-deep hover:text-[#7BC8BC]">
                {t('results.detail')}
              </Link>
              <AddToPlannerButton
                itemType="food"
                itemData={{ name: first.foodName, foodId: first.foodId, region: first.regionCode, source: 'taste-match' }}
                cityId={first.regionCode}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2~3위 — 2열 그리드 (live 패스 필요) */}
      {rest.length > 0 && (
        <PassBlurOverlay requiredPass="live" blur={!unlocked}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.map((food, i) => (
            <div key={food.foodId} className="bg-white rounded-xl shadow-sm border border-mist p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-mint text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {i + 2}
                </span>
                {food.foodImage && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={food.foodImage} alt={getL(food.foodName, locale)} fill sizes="48px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{getL(food.foodName, locale)}</p>
                  <p className="text-[10px] text-stone">{getL(food.regionName, locale)}</p>
                </div>
                <p className="text-lg font-black text-mint-deep shrink-0">{food.matchScore}%</p>
              </div>
              <div className="h-1.5 bg-mist rounded-full mb-2">
                <div className="h-full bg-mint rounded-full" style={{ width: `${food.matchScore}%` }} />
              </div>
              <p className="text-[11px] text-slate mb-3">{getL(food.matchReason, locale)}</p>
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/food/dupe/${food.regionCode}/${food.foodId}`} className="text-[11px] font-bold text-mint-deep">
                  {t('results.detail')}
                </Link>
                <AddToPlannerButton
                  itemType="food"
                  itemData={{ name: food.foodName, foodId: food.foodId, region: food.regionCode, source: 'taste-match' }}
                  cityId={food.regionCode}
                  size="sm"
                />
              </div>
            </div>
          ))}
          </div>
        </PassBlurOverlay>
      )}

      {/* 서프라이즈 플래그 쿠킹 (live 패스 필요) */}
      {surprises.length > 0 && (
        <PassBlurOverlay requiredPass="live" blur={!unlocked}>
        <div>
          <div className="border-t border-mist pt-6 mb-4">
            <h3 className="text-lg font-black text-ink text-center mb-1">{t('results.surprise.title')}</h3>
            <p className="text-xs text-stone text-center">{t('results.surprise.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {surprises.map((s) => (
              <div key={s.recipeId} className="bg-blossom-light/30 rounded-xl border border-blossom p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{getL(s.recipeName, locale)}</p>
                    <p className="text-[10px] text-stone">
                      {getL(s.koreanBase, locale)} base
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate mb-3">{getL(s.connectionReason, locale)}</p>
                <Link
                  href={`/${locale}/food/flag-cooking`}
                  className="text-[11px] font-bold text-blossom-deep hover:text-[#e0a0a0]"
                >
                  {t('results.surprise.recipe')}
                </Link>
              </div>
            ))}
          </div>
        </div>
        </PassBlurOverlay>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
