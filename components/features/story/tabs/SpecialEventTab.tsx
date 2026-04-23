import { getTranslations } from 'next-intl/server'
import { GyeongdoEventDetail } from '@/components/features/quest/GyeongdoEventDetail'
import { GyeongdoSharedInfo } from '@/components/features/quest/GyeongdoSharedInfo'
import { ZepBanner } from '@/components/features/quest/ZepBanner'
import { GYEONGDO_EVENTS, resolveEventStatus } from '@/lib/data/gyeongdo-events'

interface Props {
  locale: string
}

export async function SpecialEventTab({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'quest.gyeongdo' })

  const today = new Date().toISOString().split('T')[0]
  const activeEvents = GYEONGDO_EVENTS.filter(
    (e) => resolveEventStatus(e, today) === 'upcoming'
  ).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-8">
      {/* 히어로 */}
      <div className="bg-gradient-to-r from-[#1a4fd6] via-[#7c3aed] to-[#dc2626] text-white py-10 px-6 text-center rounded-3xl">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-3">
          🚔 {t('badge')}
        </span>
        <h2 className="text-2xl md:text-3xl font-black">{t('title')}</h2>
        <p className="text-sm opacity-90 mt-2">{t('subtitle')}</p>
      </div>

      {/* 공유 정보 (경도란?, 활용 팁 등) */}
      <GyeongdoSharedInfo locale={locale} />

      {/* Zep 배너 */}
      <ZepBanner locale={locale} />

      {/* 예정 이벤트 */}
      {activeEvents.length > 0 && (
        <div className="space-y-4">
          {activeEvents.map((event) => (
            <GyeongdoEventDetail key={event.id} event={event} locale={locale} isLoggedIn={false} />
          ))}
        </div>
      )}
    </div>
  )
}
