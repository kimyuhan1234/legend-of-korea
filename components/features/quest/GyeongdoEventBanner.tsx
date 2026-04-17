'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { GYEONGDO_EVENTS, resolveEventStatus, type GyeongdoEvent } from '@/lib/data/gyeongdo-events'

function getDDay(deadline: string, today: string): number {
  const d = new Date(deadline)
  const t = new Date(today)
  const diff = Math.ceil((d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

interface Props {
  locale: string
}

export function GyeongdoEventBanner({ locale }: Props) {
  const t = useTranslations('quest.gyeongdo')
  const router = useRouter()

  const today = new Date().toISOString().split('T')[0]

  // 가장 가까운 활성 이벤트 1개
  const activeEvent: GyeongdoEvent | null =
    GYEONGDO_EVENTS.filter((e) => resolveEventStatus(e, today) === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null

  if (!activeEvent) return null

  const dday = getDDay(activeEvent.salesDeadline, today)
  const spotsLeft = activeEvent.maxParticipants - activeEvent.currentParticipants
  const progressPct = Math.round((activeEvent.currentParticipants / activeEvent.maxParticipants) * 100)

  const localeKey = locale
  const locationText = (activeEvent.location as Record<string, string>)[localeKey] || activeEvent.location.en || activeEvent.location.ko

  // 날짜 포맷
  const dateObj = new Date(activeEvent.date)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const weekdays: Record<string, string[]> = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ja: ['日', '月', '火', '水', '木', '金', '土'], 'zh-CN': ['日', '一', '二', '三', '四', '五', '六'], 'zh-TW': ['日', '一', '二', '三', '四', '五', '六'] }
  const wd = (weekdays[localeKey] || weekdays.en)[dateObj.getDay()]

  return (
    <div
      onClick={() => router.push(`/${locale}/quest/gyeongdo`)}
      className="cursor-pointer mx-4 md:mx-0 mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a4fd6] via-[#7c3aed] to-[#dc2626] text-white p-5 md:p-6 hover:opacity-95 transition-opacity"
    >
      {/* 뱃지 */}
      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-3">
        🚔 {t('badge')}
      </span>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black mb-1">{t('title')}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-white/90 mb-3">
            <span>📅 {month}/{day}({wd}) {activeEvent.time}</span>
            <span>📍 {locationText}</span>
            <span>🎫 {t('price')}</span>
          </div>

          {/* 인원 프로그레스 */}
          <div className="mb-1 flex justify-between text-xs text-white/75">
            <span>👥 {activeEvent.currentParticipants}/{activeEvent.maxParticipants}</span>
            <span>{spotsLeft > 0 ? t('remaining', { n: spotsLeft }) : t('full')}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
            <div
              className="h-1.5 rounded-full bg-white transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/${locale}/quest/gyeongdo`) }}
            className="bg-white text-[#1a4fd6] font-black text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition whitespace-nowrap"
          >
            {t('banner.cta')} →
          </button>
          <span className="text-xs font-bold text-white/80">
            ⏰ {dday >= 0 ? t('dday', { n: dday }) : t('closed')}
          </span>
        </div>
      </div>
    </div>
  )
}
