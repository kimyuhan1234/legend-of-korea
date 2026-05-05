'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LEVEL_THRESHOLDS } from '@/lib/tiers/levels'
import { RaindropIcon } from '@/components/shared/icons/RaindropIcon'

interface Props {
  locale: string
  level: number
  raindrops: number
  isMaxLevel: boolean
  /** 다음 레벨에서 해금되는 카테고리 slug (avatar.category.{slug} 키) */
  nextCategorySlug?: string | null
}

/**
 * 레벨 카드 — 숫자 레벨 + 다음 카테고리 해금 미리보기.
 */
export function LevelCard({ locale, level, raindrops, isMaxLevel, nextCategorySlug }: Props) {
  const t = useTranslations('avatar')

  const currThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = isMaxLevel ? currThreshold : (LEVEL_THRESHOLDS[level] ?? currThreshold)
  const span = Math.max(1, nextThreshold - currThreshold)
  const earned = Math.max(0, raindrops - currThreshold)
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((earned / span) * 100))
  const raindropsToNext = isMaxLevel ? 0 : Math.max(0, nextThreshold - raindrops)

  return (
    <Link
      href={`/${locale}/mypage/tech-tree`}
      className="block bg-white border border-mist rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-mint transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone uppercase tracking-wider">
            {t('level')}
          </span>
          <span className="text-2xl md:text-3xl font-black text-ink tabular-nums">
            {level}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-mint-deep">
          <RaindropIcon className="w-3.5 h-3.5" />
          <span className="tabular-nums">{raindrops.toLocaleString()}</span>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="h-2 rounded-full bg-mist overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-mint to-blossom transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 다음 카테고리 해금 미리보기 */}
      {!isMaxLevel && nextCategorySlug && (
        <p className="text-[11px] md:text-xs text-stone mt-2.5 font-bold leading-snug">
          <span className="text-mint-deep">+{raindropsToNext.toLocaleString()}</span>
          {' '}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          → {t(`category.${nextCategorySlug}` as any)}
        </p>
      )}
      {isMaxLevel && (
        <p className="text-[11px] md:text-xs text-mint-deep mt-2.5 font-black">
          ✨ MAX
        </p>
      )}
    </Link>
  )
}
