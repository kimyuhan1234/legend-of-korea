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

export function SpotCard({ spot, locale, matchPercent }: Props) {
  const t = useTranslations('spots')
  const tSights = useTranslations('sights')

  const name = getI18n(spot.name, locale)
  const description = getI18n(spot.description, locale)
  const categoryLabel = tSights(spot.category)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-mist shadow-sm hover:shadow-md transition-all group">
      <div className="relative aspect-[4/3] bg-cloud">
        {spot.image ? (
          <Image
            src={spot.image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={spot.source === 'tourapi'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            {CATEGORY_EMOJI[spot.category]}
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
      <div className="p-5 space-y-3">
        <h3 className="font-black text-[#111] line-clamp-1">{name}</h3>
        {spot.address && (
          <p className="text-xs text-stone flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 shrink-0" /> {spot.address}
          </p>
        )}
        {!spot.address && description && (
          <p className="text-sm text-stone line-clamp-2">{description}</p>
        )}
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
