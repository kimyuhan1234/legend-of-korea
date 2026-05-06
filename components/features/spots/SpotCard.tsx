'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'
import type { NormalizedSpot } from '@/lib/tour-api/types'

interface Props {
  spot: NormalizedSpot
  locale: string
  matchPercent?: number
  onClick?: (spot: NormalizedSpot) => void
}

const CATEGORY_EMOJI: Record<string, string> = {
  hotspot: '🔥',
  landmark: '🏛️',
  festival: '🎊',
}

function getI18n(field: { [k: string]: string } | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

export function SpotCard({ spot, locale, matchPercent, onClick }: Props) {
  const t = useTranslations('spots')
  const tSights = useTranslations('sights')

  const name = getI18n(spot.name, locale)
  const description = getI18n(spot.description, locale)
  const categoryLabel = tSights(spot.category)

  const hasRealImage =
    !!spot.image && !spot.image.includes('placeholder') && spot.image !== ''

  // 카드 상단(이미지+제목+주소) 만 detail 모달 트리거. AddToPlannerButton 은
  // 자체 onClick 이 있어 nested <button> 금지 → sibling 로 분리.
  const handleCardClick = onClick ? () => onClick(spot) : undefined

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-mist shadow-sm hover:shadow-md transition-all group">
      <button
        type="button"
        onClick={handleCardClick}
        disabled={!onClick}
        className="block w-full text-left disabled:cursor-default"
        aria-label={onClick ? `${name} ${t('detail.openDetail')}` : undefined}
      >
        <div className="relative aspect-[4/3] bg-cloud">
          {hasRealImage ? (
            <Image
              src={spot.image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized={spot.source === 'tourapi'}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-mint/25 to-blossom/25">
              <span className="text-4xl mb-1">{CATEGORY_EMOJI[spot.category]}</span>
              <span className="text-[10px] font-bold text-slate-500">
                {t('imagePreparing')}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-ink">
              {CATEGORY_EMOJI[spot.category]} {categoryLabel}
            </span>
            {matchPercent !== undefined && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-mint-deep text-white shadow-sm">
                {matchPercent}% {t('result.match', { n: matchPercent })}
              </span>
            )}
          </div>
        </div>
        <div className="p-5 pb-2 space-y-3">
          <h3 className="font-black text-[#111] line-clamp-1">{name}</h3>
          {spot.address && (
            <p className="text-xs text-stone flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3 h-3 shrink-0" /> {spot.address}
            </p>
          )}
          {!spot.address && description && (
            <p className="text-sm text-stone line-clamp-2">{description}</p>
          )}
        </div>
      </button>
      {/* button 바깥 — AddToPlannerButton 의 nested <button> 회피 */}
      <div className="px-5 pb-5 space-y-3">
        {(() => {
          // 자동 태그 chip — 한글 태그만 노출 (영문 scoring tag 는 비표시)
          const KO_TAGS = ['야간', '꽃', '온천', '시장', '바다', '자연', '역사', '체험', '가족']
          const visibleTags = spot.tags.filter((tag) => KO_TAGS.includes(tag))
          if (visibleTags.length === 0) return null
          return (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-mint-light/40 text-mint-deep text-[10px] font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )
        })()}
        <AddToPlannerButton
          itemType="food"
          cityId={spot.region}
          itemData={{
            id: spot.id,
            name,
            description,
            category: spot.category,
            region: spot.region,
            kind: 'sight',
          }}
          className="w-full"
        />
        {spot.source === 'tourapi' && (
          <p className="text-[9px] text-stone/60 text-right">{t('source')}</p>
        )}
      </div>
    </div>
  )
}
