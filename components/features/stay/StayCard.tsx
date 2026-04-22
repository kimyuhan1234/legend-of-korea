'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { NormalizedStay } from '@/lib/tour-api/stays'
import type { StayTags } from '@/lib/tour-api/stay-tags'
import { BookingLinkButtons } from './BookingLinkButtons'

type CardLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

interface StayCardProps {
  stay: NormalizedStay & { matchScore?: number }
  locale: string
}

// 점수 절댓값이 큰 태그 상위 3개를 사람이 읽는 라벨로 변환
function getTopTagLabels(tags: StayTags | undefined, locale: CardLocale): string[] {
  if (!tags) return []
  const labels: Record<keyof StayTags, Record<CardLocale, [string, string]>> = {
    'busy-quiet': { ko: ['번화', '조용'], en: ['Busy', 'Quiet'], ja: ['賑やか', '静か'], 'zh-CN': ['繁华', '安静'], 'zh-TW': ['繁華', '安靜'] },
    'modern-traditional': { ko: ['모던', '전통'], en: ['Modern', 'Traditional'], ja: ['モダン', '伝統'], 'zh-CN': ['现代', '传统'], 'zh-TW': ['現代', '傳統'] },
    'budget-premium': { ko: ['경제', '프리미엄'], en: ['Budget', 'Premium'], ja: ['コスパ', 'プレミアム'], 'zh-CN': ['经济', '高端'], 'zh-TW': ['經濟', '高端'] },
    'solo-family': { ko: ['혼자', '가족'], en: ['Solo', 'Family'], ja: ['ひとり', '家族'], 'zh-CN': ['独行', '家庭'], 'zh-TW': ['獨行', '家庭'] },
    'short-long': { ko: ['단기', '장기'], en: ['Short', 'Long'], ja: ['短期', '長期'], 'zh-CN': ['短期', '长期'], 'zh-TW': ['短期', '長期'] },
    'indoor-outdoor': { ko: ['실내', '야외'], en: ['Indoor', 'Outdoor'], ja: ['室内', '野外'], 'zh-CN': ['室内', '户外'], 'zh-TW': ['室內', '戶外'] },
    'urban-nature': { ko: ['도심', '자연'], en: ['Urban', 'Nature'], ja: ['都市', '自然'], 'zh-CN': ['都市', '自然'], 'zh-TW': ['都市', '自然'] },
    'casual-luxury': { ko: ['캐주얼', '럭셔리'], en: ['Casual', 'Luxury'], ja: ['カジュアル', 'ラグジュアリー'], 'zh-CN': ['休闲', '奢华'], 'zh-TW': ['休閒', '奢華'] },
    'insta-practical': { ko: ['감성', '실용'], en: ['Insta', 'Practical'], ja: ['映え', '実用'], 'zh-CN': ['拍照', '实用'], 'zh-TW': ['拍照', '實用'] },
  }
  const entries = (Object.entries(tags) as [keyof StayTags, number][])
    .filter(([, v]) => Math.abs(v) >= 3)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3)
  return entries.map(([axis, v]) => {
    const pair = labels[axis][locale]
    return v >= 0 ? pair[1] : pair[0]
  })
}

// 시 단위만 추출 (예: "서울특별시 강남구 ..." → "서울특별시 강남구")
function shortAddress(addr: string): string {
  const parts = addr.split(' ').filter(Boolean)
  return parts.slice(0, 2).join(' ')
}

export function StayCard({ stay, locale }: StayCardProps) {
  const [showBooking, setShowBooking] = useState(false)
  const lc: CardLocale = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as CardLocale) ? (locale as CardLocale) : 'en'
  const topTags = getTopTagLabels(stay.tags, lc)

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 border border-mist/40 flex flex-col">
      {/* 이미지 또는 타입 이모지 */}
      <div className="relative h-44 bg-gradient-to-br from-mint-light/40 to-blossom-light/40 overflow-hidden">
        {stay.image ? (
          <Image
            src={stay.image}
            alt={stay.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl">🏨</div>
        )}
        {/* 타입 뱃지 */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[#111] text-[10px] font-black shadow-sm">
          {stay.stayType}
        </span>
        {/* 매칭 점수 뱃지 */}
        {typeof stay.matchScore === 'number' && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-mint-deep text-white text-[10px] font-black shadow-sm">
            {stay.matchScore}%
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-black text-[#111] mb-1 leading-tight line-clamp-2">{stay.name}</h3>
        <p className="text-xs text-stone mb-3 line-clamp-1">📍 {shortAddress(stay.address)}</p>

        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {topTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-mint-deep bg-mint-light/50 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-3">
          {!showBooking ? (
            <button
              type="button"
              onClick={() => setShowBooking(true)}
              className="w-full py-2.5 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 transition"
            >
              {lc === 'ko' ? '예약 사이트 보기' : lc === 'ja' ? '予約サイトを見る' : lc === 'zh-CN' ? '查看预订网站' : lc === 'zh-TW' ? '查看預訂網站' : 'View booking sites'}
            </button>
          ) : (
            <BookingLinkButtons
              stayName={stay.name}
              address={stay.address}
              tel={stay.tel}
              locale={locale}
              compact
            />
          )}
        </div>
      </div>
    </div>
  )
}
