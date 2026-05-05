import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { hasActivePass } from '@/lib/auth/pass'
import { GYEONGDO_EVENTS, resolveEventStatus } from '@/lib/data/gyeongdo-events'
import { GyeongdoEventDetail } from '@/components/features/quest/GyeongdoEventDetail'
import { GyeongdoSharedInfo } from '@/components/features/quest/GyeongdoSharedInfo'
import { ZepMeetingButton } from '@/components/features/quest/ZepMeetingButton'
import { ZepBanner } from '@/components/features/quest/ZepBanner'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'quest.gyeongdo' })
  return {
    title: `${t('title')} | Clouds with you`,
    description: t('subtitle'),
  }
}

export default async function GyeongdoPage({ params }: Props) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'quest.gyeongdo' })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  // 경도 이벤트는 일반 Pass 모델 공유 (GyeongdoEventDetail.tsx PASS_INCLUDED)
  // → ZEP 입장 권한도 hasActivePass 로 일관 검증
  const hasPass = await hasActivePass(user?.id ?? null)

  const today = new Date().toISOString().split('T')[0]
  const activeEvents = GYEONGDO_EVENTS.filter(
    (e) => resolveEventStatus(e, today) === 'upcoming'
  ).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="min-h-screen bg-snow">
      {/* 페이지 히어로 */}
      <div className="bg-gradient-to-r from-[#1a4fd6] via-[#7c3aed] to-[#dc2626] text-white py-14 px-6 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-3">
          🚔 {t('badge')}
        </span>
        <h1 className="text-3xl md:text-4xl font-black">{t('title')}</h1>
        <p className="text-white/80 mt-2 text-base">{t('subtitle')}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        {activeEvents.length === 0 ? (
          /* 이벤트 없을 때 */
          <div className="text-center py-20 bg-white rounded-2xl border border-mist">
            <div className="text-5xl mb-4">🚔</div>
            <h2 className="text-lg font-black text-ink mb-2">{t('noEvents')}</h2>
            <p className="text-sm text-slate mb-6">{t('comingSoon')}</p>
            {/* 알림 신청 — UI만, 기능은 추후 구현 */}
            <div className="max-w-xs mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-1 border border-mist rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5BBDAD]"
                />
                <button className="bg-gradient-to-r from-mint to-blossom text-ink font-bold text-sm px-4 py-2.5 rounded-xl whitespace-nowrap">
                  {locale === 'ko' ? '알림 받기' : locale === 'ja' ? '通知を受ける' : 'Notify me'}
                </button>
              </div>
              <p className="text-xs text-stone mt-2">
                {locale === 'ko' ? '새 이벤트가 등록되면 알려드립니다' : locale === 'ja' ? '新しいイベントが登録されたらお知らせします' : "We'll notify you when new events are posted"}
              </p>
            </div>
          </div>
        ) : (
          /* 이벤트 목록 + 공유 정보 */
          <div className="flex flex-col gap-8">
            {/* 경도 설명 + 키트 구성 + 참여 흐름 + 주의사항 (1번만) */}
            <GyeongdoSharedInfo locale={locale} />

            {/* 이벤트별 카드 (날짜/장소/인원/구매 버튼만) */}
            <div>
              <h3 className="text-base font-black text-ink mb-3">📅 {locale === 'ko' ? '예정된 이벤트' : locale === 'ja' ? '予定イベント' : 'Upcoming Events'}</h3>
              <div className="flex flex-col gap-4">
                {activeEvents.map((event) => (
                  <GyeongdoEventDetail
                    key={event.id}
                    event={event}
                    locale={locale}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </div>

            {/* ZEP 가상 사전 작전 모임 — 활성 패스 보유자만 입장. 비보유 / 비로그인은 ZepBanner. */}
            {isLoggedIn && hasPass ? (
              <ZepMeetingButton
                courseId="gyeongdo-seoul"
                hasPurchased={true}
                locale={locale}
              />
            ) : (
              <ZepBanner locale={locale} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
