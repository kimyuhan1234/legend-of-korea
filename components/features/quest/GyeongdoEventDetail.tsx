'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { GYEONGDO_KIT, resolveEventStatus, type GyeongdoEvent } from '@/lib/data/gyeongdo-events'

function getDDay(deadline: string, today: string): number {
  const d = new Date(deadline)
  const t = new Date(today)
  return Math.ceil((d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24))
}

interface Props {
  event: GyeongdoEvent
  locale: string
  isLoggedIn: boolean
}

export function GyeongdoEventDetail({ event, locale, isLoggedIn }: Props) {
  const t = useTranslations('quest.gyeongdo')
  const router = useRouter()

  const today = new Date().toISOString().split('T')[0]
  const status = resolveEventStatus(event, today)
  const dday = getDDay(event.salesDeadline, today)
  const spotsLeft = event.maxParticipants - event.currentParticipants
  const progressPct = Math.round((event.currentParticipants / event.maxParticipants) * 100)

  const lk = locale as 'ko' | 'en' | 'ja'

  // 날짜 포맷
  const dateObj = new Date(event.date)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const weekdays: Record<string, string[]> = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ja: ['日', '月', '火', '水', '木', '金', '土'], 'zh-CN': ['日', '一', '二', '三', '四', '五', '六'], 'zh-TW': ['日', '一', '二', '三', '四', '五', '六'] }
  const wd = (weekdays[lk] || weekdays.en)[dateObj.getDay()]

  function handleBuy() {
    if (!isLoggedIn) {
      router.push(`/${locale}/auth`)
      return
    }
    // 결제 연동 금지 규칙 준수 — 현재는 플래너 담기로 대체
    router.push(`/${locale}/shop`)
  }

  return (
    <div className="bg-white rounded-2xl border border-mist overflow-hidden">
      {/* 이벤트 정보 카드 */}
      <div className="p-5">
        <h3 className="text-sm font-black text-stone uppercase tracking-wider mb-4">{t('eventInfo')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 text-center">📅</span>
            <div>
              <span className="text-xs text-slate">{t('date')}</span>
              <p className="font-bold text-ink">{month}/{day}({wd}) {event.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 text-center">📍</span>
            <div>
              <span className="text-xs text-slate">{t('location')}</span>
              <p className="font-bold text-ink">{event.location[lk] || event.location.ko}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 text-center">🚶</span>
            <div>
              <span className="text-xs text-slate">{t('meetingPoint')}</span>
              <p className="font-bold text-ink">{event.meetingPoint[lk] || event.meetingPoint.ko}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 text-center">💬</span>
            <div>
              <span className="text-xs text-slate">{t('source')}</span>
              <p className="font-bold text-ink text-sm">{event.communitySource}</p>
            </div>
          </div>
        </div>

        {/* 인원 프로그레스 */}
        <div className="mb-1 flex justify-between text-xs text-slate">
          <span>👥 {t('participants')} {event.currentParticipants}/{event.maxParticipants}</span>
          <span>{spotsLeft > 0 ? t('remaining', { n: spotsLeft }) : t('full')}</span>
        </div>
        <div className="w-full bg-white rounded-full h-2 border border-mist mb-3">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#1a4fd6] to-[#dc2626] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* 판매 마감 */}
        <div className="flex items-center gap-2 text-sm">
          <span>⏰</span>
          <span className="text-slate">{t('deadline')}</span>
          <span className="font-bold text-ink">{event.salesDeadline}</span>
          {dday >= 0 && status === 'upcoming' && (
            <span className="ml-auto text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              {t('dday', { n: dday })}
            </span>
          )}
        </div>

        {/* 구매 버튼 */}
        {/* 구독자 할인 안내 */}
        <div className="mt-3 mb-2 bg-gradient-to-r from-mint-light/50 to-sky/10 border border-mint/30 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-slate">
            <span className="line-through text-stone mr-1">₩{GYEONGDO_KIT.price.toLocaleString()}</span>
            <span className="font-black text-mint-deep">₩{GYEONGDO_KIT.subscriberPrice.toLocaleString()}</span>
          </span>
          <span className="text-[10px] font-bold text-white bg-mint-deep px-2 py-0.5 rounded-full">
            {lk === 'ko' ? '구독자 34% 할인' : lk === 'ja' ? 'サブスク34%割引' : '34% off for subscribers'}
          </span>
        </div>

        <div className="mt-2">
          {status === 'upcoming' ? (
            <button
              onClick={handleBuy}
              className="w-full py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-[#1a4fd6] to-[#dc2626] text-white hover:opacity-90 transition"
            >
              {t('buy')} · ₩{GYEONGDO_KIT.price.toLocaleString()}
            </button>
          ) : status === 'sold-out' ? (
            <button disabled className="w-full py-3.5 rounded-2xl text-sm font-black bg-stone/30 text-slate cursor-not-allowed">
              {t('soldOut')}
            </button>
          ) : status === 'closed' ? (
            <button disabled className="w-full py-3.5 rounded-2xl text-sm font-black bg-stone/30 text-slate cursor-not-allowed">
              {t('closed')}
            </button>
          ) : (
            <button disabled className="w-full py-3.5 rounded-2xl text-sm font-black bg-stone/30 text-slate cursor-not-allowed">
              {t('completed')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
