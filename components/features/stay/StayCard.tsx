'use client'

import { useTranslations } from 'next-intl'
import { STAY_TYPE_EMOJI, type StayRecommendation } from '@/lib/data/stay-recommendations'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

interface StayCardProps {
  stay: StayRecommendation
  locale: string
}

export function StayCard({ stay, locale }: StayCardProps) {
  const t = useTranslations('stay')

  const name = stay.name[locale as keyof typeof stay.name] || stay.name.ko
  const desc = stay.description[locale as keyof typeof stay.description] || stay.description.ko
  const walk = stay.walkToMission[locale as keyof typeof stay.walkToMission] || stay.walkToMission.ko

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 border border-[#E4E7EB]/40">
      {/* 상단: 타입별 색상 그라데이션 + 이모지 */}
      <div className="relative h-48 bg-gradient-to-br from-[#9DD8CE]/10 to-[#9DD8CE]/30 flex items-center justify-center">
        <span className="text-7xl">{STAY_TYPE_EMOJI[stay.type]}</span>
        {/* 타입 뱃지 */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[#111] text-xs font-black shadow-sm uppercase">
          {t(`filter.${stay.type}` as Parameters<typeof t>[0])}
        </span>
      </div>

      {/* 내용 */}
      <div className="p-6">
        <h3 className="text-lg font-black text-[#111] mb-2 leading-tight">{name}</h3>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-4 line-clamp-2">{desc}</p>

        {/* 가격 + 미션 거리 */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
          <div>
            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">
              {t('card.priceRange')}
            </p>
            <p className="text-base font-black text-[#111]">{stay.priceRange}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#9DD8CE] font-bold uppercase tracking-wider">
              🗺️ {t('card.walkToMission')}
            </p>
            <p className="text-sm font-bold text-[#111]">{walk}</p>
          </div>
        </div>

        {/* 하이라이트 */}
        <ul className="space-y-2 mb-5">
          {stay.highlights.map((h, i) => {
            const text = h[locale as keyof typeof h] || h.ko
            return (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <span className="text-[#9DD8CE] shrink-0 mt-0.5">✓</span>
                <span>{text}</span>
              </li>
            )
          })}
        </ul>

        {/* 분위기 태그 */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {stay.vibe.map((v) => (
            <span
              key={v}
              className="text-[10px] font-bold text-[#9CA3AF] bg-[#F0F2F5] px-2 py-0.5 rounded-full"
            >
              #{t(`vibe.${v}` as Parameters<typeof t>[0])}
            </span>
          ))}
        </div>

        {/* 예약 버튼 + 플래너 담기 */}
        <div className="flex gap-2">
          <a
            href={stay.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 rounded-full bg-[#9DD8CE] text-white font-bold text-sm hover:bg-[#7BC8BC] transition-colors"
          >
            {t('card.book')} ↗
          </a>
          <AddToPlannerButton
            itemType="stay"
            cityId={stay.cityId}
            itemData={{
              id: stay.id,
              name: stay.name,
              type: stay.type,
              priceRange: stay.priceRange,
              bookingUrl: stay.bookingUrl,
              platform: stay.platform,
            }}
            size="md"
            className="shrink-0"
          />
        </div>
        <p className="text-[10px] text-[#9CA3AF] text-center mt-2">
          via {stay.platform} · {t('card.external')}
        </p>
      </div>
    </div>
  )
}
