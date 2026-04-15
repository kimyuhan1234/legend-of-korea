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
  const weekdays = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ja: ['日', '月', '火', '水', '木', '金', '土'] }
  const wd = weekdays[lk][dateObj.getDay()]

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
      {/* A. 히어로 */}
      <div className="bg-gradient-to-r from-[#1a4fd6] via-[#7c3aed] to-[#dc2626] text-white px-6 py-10 md:py-14 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest mb-3">
          🚔 {t('badge')}
        </span>
        <h2 className="text-2xl md:text-3xl font-black mb-2">{t('title')}</h2>
        <p className="text-white/80 text-sm">{t('subtitle')}</p>
      </div>

      <div className="p-5 md:p-7 flex flex-col gap-7">
        {/* B. 이벤트 정보 카드 */}
        <div className="bg-snow rounded-2xl p-5">
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
        </div>

        {/* C. 경도란? */}
        <div>
          <h3 className="text-base font-black text-ink mb-3">🎮 {t('whatIs')}</h3>
          <div className="bg-gradient-to-r from-[#B8E8E0]/20 to-[#F5D0D0]/20 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-slate leading-relaxed">{t('whatIsDesc')}</p>
            <div className="border-t border-mist pt-3">
              <p className="text-xs font-bold text-[#5BBDAD] mb-1">🇯🇵 {t('keydoro')}</p>
              <p className="text-xs text-slate">{t('keydoroDesc')}</p>
            </div>
            {/* 룰 요약 */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: '🚔', label: { ko: '경찰팀', en: 'Cops', ja: '警察チーム' } },
                { icon: '🏃', label: { ko: '도둑팀', en: 'Robbers', ja: '泥棒チーム' } },
                { icon: '🏛️', label: { ko: '감옥', en: 'Jail', ja: '牢屋' } },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center border border-mist">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs font-bold text-ink">{item.label[lk]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* D. 키트 구성품 */}
        <div>
          <h3 className="text-base font-black text-ink mb-3">🎁 {t('includes')}</h3>
          <div className="space-y-2">
            {GYEONGDO_KIT.includes.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-[#5BBDAD] font-bold mt-0.5">✓</span>
                <span className="text-slate">{item[lk] || item.ko}</span>
              </div>
            ))}
          </div>
        </div>

        {/* E. 참여 흐름 3단계 */}
        <div>
          <h3 className="text-base font-black text-ink mb-3">👣 {t('howTo')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🛒', step: '1', label: t('step1'), sub: GYEONGDO_KIT.price.toLocaleString() + '원' },
              { icon: '📍', step: '2', label: t('step2'), sub: event.meetingPoint[lk] || event.meetingPoint.ko },
              { icon: '🏃', step: '3', label: t('step3'), sub: '' },
            ].map((s) => (
              <div key={s.step} className="bg-snow rounded-xl p-3 text-center border border-mist">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs font-black text-[#5BBDAD] mb-0.5">Step {s.step}</div>
                <div className="text-xs font-bold text-ink leading-tight">{s.label}</div>
                {s.sub && <div className="text-xs text-slate mt-0.5 truncate">{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* F. 구매 버튼 */}
        <div>
          {status === 'upcoming' ? (
            <button
              onClick={handleBuy}
              className="w-full py-4 rounded-2xl text-base font-black bg-gradient-to-r from-[#1a4fd6] to-[#dc2626] text-white hover:opacity-90 transition"
            >
              {t('buy')} · ₩{GYEONGDO_KIT.price.toLocaleString()}
            </button>
          ) : status === 'sold-out' ? (
            <button disabled className="w-full py-4 rounded-2xl text-base font-black bg-stone/30 text-slate cursor-not-allowed">
              {t('soldOut')}
            </button>
          ) : status === 'closed' ? (
            <button disabled className="w-full py-4 rounded-2xl text-base font-black bg-stone/30 text-slate cursor-not-allowed">
              {t('closed')}
            </button>
          ) : (
            <button disabled className="w-full py-4 rounded-2xl text-base font-black bg-stone/30 text-slate cursor-not-allowed">
              {t('completed')}
            </button>
          )}
        </div>

        {/* G. 주의사항 */}
        <div className="bg-[#F5D0D0]/20 border border-[#F5D0D0] rounded-xl p-4">
          <p className="text-xs font-bold text-ink mb-2">⚠️ 주의사항</p>
          <ul className="space-y-1">
            {[t('notice1'), t('notice2'), t('notice3')].map((notice, i) => (
              <li key={i} className="text-xs text-slate flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">·</span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
