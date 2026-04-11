'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

export type TripStyle = 'relaxed' | 'active' | 'full'

interface PlannerTripSetupProps {
  cityId: string
  startDate: string
  endDate: string
  style: TripStyle
  onChangeStart: (v: string) => void
  onChangeEnd: (v: string) => void
  onChangeStyle: (s: TripStyle) => void
}

const CITY_LABEL: Record<string, { ko: string; ja: string; en: string }> = {
  jeonju: { ko: '전주', ja: '全州', en: 'Jeonju' },
  seoul: { ko: '서울', ja: 'ソウル', en: 'Seoul' },
  busan: { ko: '부산', ja: '釜山', en: 'Busan' },
  jeju: { ko: '제주', ja: '済州', en: 'Jeju' },
  gyeongju: { ko: '경주', ja: '慶州', en: 'Gyeongju' },
  tongyeong: { ko: '통영', ja: '統営', en: 'Tongyeong' },
  cheonan: { ko: '천안', ja: '天安', en: 'Cheonan' },
  yongin: { ko: '용인', ja: '龍仁', en: 'Yongin' },
  icheon: { ko: '이천', ja: '利川', en: 'Icheon' },
}

function diffDays(a: string, b: string): number {
  if (!a || !b) return 0
  const s = new Date(a)
  const e = new Date(b)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0
  const ms = e.getTime() - s.getTime()
  return Math.max(0, Math.round(ms / 86400000))
}

export function PlannerTripSetup({
  cityId,
  startDate,
  endDate,
  style,
  onChangeStart,
  onChangeEnd,
  onChangeStyle,
}: PlannerTripSetupProps) {
  const t = useTranslations('planner')
  const locale =
    typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'ko' : 'ko'

  const nights = diffDays(startDate, endDate)
  const days = nights > 0 ? nights + 1 : 0

  const cityLabel = useMemo(() => {
    const rec = CITY_LABEL[cityId]
    if (!rec) return cityId
    return rec[locale as 'ko' | 'ja' | 'en'] || rec.ko
  }, [cityId, locale])

  const styles: Array<{ key: TripStyle; emoji: string; titleKey: string; descKey: string }> = [
    { key: 'relaxed', emoji: '😌', titleKey: 'setup.styleRelaxed', descKey: 'setup.styleRelaxedDesc' },
    { key: 'active', emoji: '⚡', titleKey: 'setup.styleActive', descKey: 'setup.styleActiveDesc' },
    { key: 'full', emoji: '🔥', titleKey: 'setup.styleFull', descKey: 'setup.styleFullDesc' },
  ]

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-black text-[#111] mb-2">
        {t('setup.title')}
      </h2>
      <p className="text-sm text-[#6B7280] mb-6">{t('setup.subtitle')}</p>

      <div className="bg-white rounded-3xl p-6 border border-[#e8ddd0]/40 space-y-6">
        {/* 여행 기간 */}
        <div>
          <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest mb-3">
            📅 {t('setup.periodTitle')}
          </p>
          <div className="flex items-center gap-2 text-sm text-[#374151] mb-3">
            <span className="text-[#6B7280]">{t('setup.city')}:</span>
            <span className="font-bold text-[#111]">{cityLabel}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-bold text-[#6B7280] mb-1 block">
                {t('setup.startDate')}
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onChangeStart(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8ddd0] text-sm font-semibold text-[#111] focus:outline-none focus:border-[#FF6B35]"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-[#6B7280] mb-1 block">
                {t('setup.endDate')}
              </span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => onChangeEnd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8ddd0] text-sm font-semibold text-[#111] focus:outline-none focus:border-[#FF6B35]"
              />
            </label>
          </div>
          {days > 0 && (
            <p className="mt-3 text-sm font-bold text-[#FF6B35]">
              = {t('setup.nightsDays', { nights, days })}
            </p>
          )}
        </div>

        {/* 여행 스타일 */}
        <div>
          <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest mb-3">
            🎯 {t('setup.styleTitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {styles.map((s) => {
              const selected = style === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => onChangeStyle(s.key)}
                  className={`text-left px-4 py-4 rounded-2xl border-2 transition-colors ${
                    selected
                      ? 'border-[#FF6B35] bg-[#FFF8F0]'
                      : 'border-[#e8ddd0] bg-white hover:border-[#FFC9AA]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{s.emoji}</span>
                    <span
                      className={`text-sm font-black ${
                        selected ? 'text-[#FF6B35]' : 'text-[#111]'
                      }`}
                    >
                      {t(s.titleKey as Parameters<typeof t>[0]) as string}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    {t(s.descKey as Parameters<typeof t>[0]) as string}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
