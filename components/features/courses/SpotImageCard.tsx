'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ImageIcon, Utensils, Loader2 } from 'lucide-react'
import type { Locale, SpotKind } from '@/lib/data/parseRouteSpots'
import type { RegionId } from '@/lib/data/spotMatchingPolicy'

interface Props {
  spotName: string
  regionId: RegionId | string
  locale: Locale
  kind: SpotKind
}

type FetchState =
  | { status: 'loading' }
  | { status: 'matched'; firstimage: string }
  | { status: 'unmatched' }
  | { status: 'error' }

/**
 * spot 단위 이미지 카드 — 3 분기:
 *  1. kind === 'food' : 이미지 호출 X, 텍스트 카드 (Utensils 아이콘 + foodSpotLabel)
 *  2. kind === 'attraction' + matched : next/image + spot 명 + 출처
 *  3. kind === 'attraction' + unmatched/error : placeholder + "사진 준비 중"
 *
 * 매칭은 /api/spots/match-image (STEP 2-A) 호출. 1시간 캐싱 (Cache-Control + fetch
 * revalidate 이중 캐싱). AbortController 로 unmount cleanup.
 */
export function SpotImageCard({ spotName, regionId, locale, kind }: Props) {
  const t = useTranslations('courses.highlights')
  const tSpots = useTranslations('spots')

  const [state, setState] = useState<FetchState>({ status: 'loading' })

  useEffect(() => {
    if (kind === 'food') return

    const controller = new AbortController()
    const url = new URL('/api/spots/match-image', window.location.origin)
    url.searchParams.set('keyword', spotName)
    url.searchParams.set('regionId', regionId)
    url.searchParams.set('locale', locale)

    fetch(url.toString(), { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          setState({ status: 'error' })
          return
        }
        const data = (await res.json()) as
          | { matched: true; firstimage: string }
          | { matched: false }
        if (data.matched && data.firstimage) {
          setState({ status: 'matched', firstimage: data.firstimage })
        } else {
          setState({ status: 'unmatched' })
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setState({ status: 'error' })
      })

    return () => controller.abort()
  }, [spotName, regionId, locale, kind])

  // 1. 음식 카드 (텍스트 fallback — 이미지 호출 X)
  if (kind === 'food') {
    return (
      <div className="rounded-2xl bg-blossom-light/40 border border-blossom/30 p-5 flex flex-col gap-2 min-h-[180px] justify-center">
        <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mb-1">
          <Utensils className="w-6 h-6 text-blossom-deep" />
        </div>
        <p className="text-[10px] font-bold text-blossom-deep uppercase tracking-wide">
          {t('foodSpotLabel')}
        </p>
        <p className="text-sm font-bold text-slate-800 leading-snug">{spotName}</p>
      </div>
    )
  }

  // 2. attraction — 상태별 렌더
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-mist hover:shadow-md transition-shadow">
      <div className="relative aspect-[16/9] bg-cloud">
        {state.status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center text-mint-deep">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="sr-only">{t('imageLoading')}</span>
          </div>
        )}
        {state.status === 'matched' && (
          <Image
            src={state.firstimage}
            alt={spotName}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
            unoptimized
          />
        )}
        {state.status === 'unmatched' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone bg-gradient-to-br from-cloud to-mist/40">
            <ImageIcon className="w-8 h-8" />
            <span className="text-[11px] font-bold">{t('imageNotAvailable')}</span>
          </div>
        )}
        {state.status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone bg-gradient-to-br from-cloud to-mist/40">
            <ImageIcon className="w-8 h-8 opacity-50" />
            <span className="text-[11px] font-bold">{t('imageError')}</span>
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{spotName}</p>
        {state.status === 'matched' && (
          <p className="text-[10px] text-stone/70">{tSpots('source')}</p>
        )}
      </div>
    </div>
  )
}
