'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Camera } from 'lucide-react'
import { LEVEL_THRESHOLDS } from '@/lib/tiers/levels'
import { RaindropIcon } from '@/components/shared/icons/RaindropIcon'
import { resolveRankImageSrc, hasRankImage, AVATAR_PLACEHOLDER_SRC } from '@/lib/avatar/resolve'

interface Props {
  locale: string
  level: number
  raindrops: number
  isMaxLevel: boolean
  /** 다음 레벨에서 해금되는 카테고리 slug (avatar.category.{slug} 키) */
  nextCategorySlug?: string | null
  /** 사용자 선택 랭크 사진 — selected_avatar_image_id 의 join 결과 */
  rankImageFilename?: string | null
  rankImageSlug?: string | null
  /** 랭크 사진 카메라 클릭 시 부모가 AvatarSelectModal 열기 */
  onChangeRank?: () => void
}

/**
 * 레벨 카드 — 좌측 랭크 사진 + 우측 레벨 정보.
 * 랭크 사진 = selected_avatar_image_id (카테고리 해금 사진), 카메라 → AvatarSelectModal.
 * 레벨 정보 영역 = /mypage/tech-tree (성장 지도) 로 이동.
 */
export function LevelCard({
  locale,
  level,
  raindrops,
  isMaxLevel,
  nextCategorySlug,
  rankImageFilename = null,
  rankImageSlug = null,
  onChangeRank,
}: Props) {
  const t = useTranslations('avatar')

  const currThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = isMaxLevel ? currThreshold : (LEVEL_THRESHOLDS[level] ?? currThreshold)
  const span = Math.max(1, nextThreshold - currThreshold)
  const earned = Math.max(0, raindrops - currThreshold)
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.round((earned / span) * 100))
  const raindropsToNext = isMaxLevel ? 0 : Math.max(0, nextThreshold - raindrops)

  const rankSrc = hasRankImage({ selected_avatar_filename: rankImageFilename, selected_avatar_slug: rankImageSlug })
    ? resolveRankImageSrc({ selected_avatar_filename: rankImageFilename, selected_avatar_slug: rankImageSlug })
    : AVATAR_PLACEHOLDER_SRC

  return (
    <div className="bg-white border border-mist rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:border-mint transition-all flex items-center gap-4">
      {/* 좌: 랭크 사진 + 카메라 트리거 */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-cloud border border-mist">
          <Image
            src={rankSrc}
            alt={t('level') + ' ' + level}
            width={96}
            height={96}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        {onChangeRank && (
          <button
            type="button"
            onClick={onChangeRank}
            aria-label={t('changeRank')}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-mint-deep text-white shadow-md hover:bg-mint hover:scale-110 active:scale-95 transition-all flex items-center justify-center ring-2 ring-white"
          >
            <Camera className="w-3 h-3" aria-hidden />
          </button>
        )}
      </div>

      {/* 우: 레벨 정보 (Link) */}
      <Link href={`/${locale}/mypage/tech-tree`} className="flex-1 min-w-0 block">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone uppercase tracking-wider">{t('level')}</span>
            <span className="text-2xl md:text-3xl font-black text-ink tabular-nums">{level}</span>
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
          <p className="text-[11px] md:text-xs text-stone mt-2 font-bold leading-snug truncate">
            <span className="text-mint-deep">+{raindropsToNext.toLocaleString()}</span>
            {' '}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            → {t(`category.${nextCategorySlug}` as any)}
          </p>
        )}
        {isMaxLevel && (
          <p className="text-[11px] md:text-xs text-mint-deep mt-2 font-black">✨ MAX</p>
        )}
      </Link>
    </div>
  )
}
