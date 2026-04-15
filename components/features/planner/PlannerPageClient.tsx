'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { PlannerHero } from './PlannerHero'
import { PlannerPreview } from './PlannerPreview'
import { PlannerSubscriptionWall } from './PlannerSubscriptionWall'
import { PlannerCuration } from './PlannerCuration'
import { PlannerTransport } from './PlannerTransport'
import { PlannerSpotDistance } from './PlannerSpotDistance'
import { PlannerFinalPlan } from './PlannerFinalPlan'
import { PlannerTripSetup, type TripStyle } from './PlannerTripSetup'
import { PlannerOotd } from './PlannerOotd'
import { PlannerCreditsDisplay } from './PlannerCreditsDisplay'

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlanItem {
  id: string
  item_type: ItemType
  item_data: Record<string, unknown>
}

interface Plan {
  id: string
  city_id: string
  start_date: string | null
  end_date: string | null
  travel_style: 'relaxed' | 'active' | 'full' | null
  has_mission_kit: boolean
  hotel_name: string | null
  hotel_address: string | null
  hotel_lat: number | null
  hotel_lng: number | null
  hotel_source: 'curated' | 'manual' | null
  plan_items: PlanItem[]
}

interface SubscriptionStatus {
  subscribed: boolean
  creditsRemaining: number
  monthlyCredits: number
  creditsResetAt: string | null
}

interface SubscriptionPlan {
  id: string
  plan_type: 'free' | 'explorer' | 'legend'
  price: number
  features: { ko: string[]; ja: string[]; en: string[] }
  kit_discount_rate: number
  tier_levelup: boolean
}

interface PlannerPageClientProps {
  locale: string
}

export function PlannerPageClient({ locale }: PlannerPageClientProps) {
  const t = useTranslations('planner')

  const [plans, setPlans] = useState<Plan[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    creditsRemaining: 0,
    monthlyCredits: 0,
    creditsResetAt: null,
  })

  // 구독/크레딧 상태 새로고침 — 크레딧 차감 이후 호출
  const refreshSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/status', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const sub = data.subscription
      const plan = Array.isArray(sub?.subscription_plans)
        ? sub.subscription_plans[0]
        : sub?.subscription_plans
      setSubStatus({
        subscribed: !!data.subscribed,
        creditsRemaining: sub?.credits_remaining ?? 0,
        monthlyCredits: plan?.monthly_credits ?? 0,
        creditsResetAt: sub?.credits_reset_at ?? null,
      })
      setIsSubscribed(!!data.subscribed)
    } catch {
      // ignore
    }
  }

  // 여행 기간/스타일/도시 (localStorage 보존)
  const [tripStart, setTripStart] = useState<string>('')
  const [tripEnd, setTripEnd] = useState<string>('')
  const [tripStyle, setTripStyle] = useState<TripStyle>('active')
  const [selectedCityId, setSelectedCityId] = useState<string>('jeonju')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('planner:trip')
      if (saved) {
        const parsed = JSON.parse(saved) as {
          start?: string; end?: string; style?: TripStyle; cityId?: string
        }
        if (parsed.start) setTripStart(parsed.start)
        if (parsed.end) setTripEnd(parsed.end)
        if (parsed.style) setTripStyle(parsed.style)
        if (parsed.cityId) setSelectedCityId(parsed.cityId)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'planner:trip',
        JSON.stringify({
          start: tripStart,
          end: tripEnd,
          style: tripStyle,
          cityId: selectedCityId,
        })
      )
    } catch {}
  }, [tripStart, tripEnd, tripStyle, selectedCityId])

  // 담긴 아이템 다시 불러오기 (공개 재사용 함수) — no-store 로 fetch 캐시 방지
  const refreshPlans = async () => {
    const res = await fetch('/api/planner/items', { cache: 'no-store' })
    if (!res.ok) return
    const d = await res.json()
    setPlans(d.plans || [])
    setTotalItems(d.totalItems || 0)
  }

  // 초기 데이터 로드 — 3개 API 동시 호출
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [itemsRes, statusRes, subPlansRes] = await Promise.all([
          fetch('/api/planner/items'),
          fetch('/api/subscription/status'),
          fetch('/api/subscription/plans'),
        ])

        if (mounted && itemsRes.ok) {
          const d = await itemsRes.json()
          setPlans(d.plans || [])
          setTotalItems(d.totalItems || 0)
        }

        if (mounted && statusRes.ok) {
          const s = await statusRes.json()
          const sub = s.subscription
          const plan = Array.isArray(sub?.subscription_plans)
            ? sub.subscription_plans[0]
            : sub?.subscription_plans
          setIsSubscribed(!!s.subscribed)
          setSubStatus({
            subscribed: !!s.subscribed,
            creditsRemaining: sub?.credits_remaining ?? 0,
            monthlyCredits: plan?.monthly_credits ?? 0,
            creditsResetAt: sub?.credits_reset_at ?? null,
          })
        }

        if (mounted && subPlansRes.ok) {
          const sp = await subPlansRes.json()
          setSubscriptionPlans(sp.plans || [])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // planner:refresh 이벤트 구독 (담기/삭제 시 자동 재조회)
  useEffect(() => {
    const handler = () => refreshPlans()
    window.addEventListener('planner:refresh', handler)
    return () => window.removeEventListener('planner:refresh', handler)
  }, [])

  // 전체 초기화 — 프론트 상태를 즉시 비우고(낙관적) 서버 재조회로 검증
  // 서버 DELETE 는 PlannerResetButton 이 호출 후 onReset() 으로 이 핸들러를 트리거한다.
  const handleResetAll = async () => {
    // 1) 낙관적 클리어 — refreshPlans 를 기다리지 않고 UI 즉시 비움
    setPlans([])
    setTotalItems(0)
    setTripStart('')
    setTripEnd('')
    setTripStyle('active')
    setSelectedCityId('jeonju')
    try {
      window.localStorage.removeItem('planner:trip')
    } catch {}
    // 2) 검증용 재조회 — 서버 delete 가 반영됐는지 확인
    await refreshPlans()
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/planner/items?itemId=${itemId}`, { method: 'DELETE' })
      if (res.ok) {
        await refreshPlans()
      }
    } catch {
      // ignore
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, paymentProvider: 'manual' }),
      })

      if (!res.ok) return

      const data = await res.json()
      setIsSubscribed(true)

      if (data.tierUp?.leveledUp) {
        setSuccessMessage(t('subscription.congratsTierUp'))
      } else if (data.tierUp?.bonusLp) {
        setSuccessMessage(t('subscription.bonus500'))
      } else {
        setSuccessMessage(t('subscription.success'))
      }

      setTimeout(() => setSuccessMessage(null), 4000)
    } catch {
      // ignore
    }
  }

  // 첫 번째 플랜 기준 (메인 플랜)
  const mainPlan = plans[0]

  // DB 우선 초기화: mainPlan 에 저장된 trip 값이 있으면 그걸 기준으로 state 동기화 (1회만)
  // localStorage 값이 있으면 flash 로 먼저 보이고, DB 값이 도착하면 덮어씀
  const initialDbSyncedRef = useRef(false)
  useEffect(() => {
    if (initialDbSyncedRef.current) return
    if (!mainPlan) return

    if (mainPlan.city_id) setSelectedCityId(mainPlan.city_id)
    if (mainPlan.start_date) setTripStart(mainPlan.start_date)
    if (mainPlan.end_date) setTripEnd(mainPlan.end_date)
    if (mainPlan.travel_style) setTripStyle(mainPlan.travel_style)

    initialDbSyncedRef.current = true
  }, [mainPlan])

  // Trip setup 서버 동기화 — 디바운스 800ms. 사용자가 date/style/city 변경 시 DB 영속화.
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSyncedRef = useRef<string>('')
  useEffect(() => {
    if (!isSubscribed) return
    if (!initialDbSyncedRef.current) return

    const payload = {
      cityId: selectedCityId,
      startDate: tripStart || null,
      endDate: tripEnd || null,
      travelStyle: tripStyle,
    }
    const signature = JSON.stringify(payload)
    if (signature === lastSyncedRef.current) return

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/planner/trip-setup', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: signature,
          cache: 'no-store',
        })
        if (res.ok) {
          lastSyncedRef.current = signature
        }
      } catch {
        // 네트워크 실패 시 다음 변경에서 다시 시도
      }
    }, 800)

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [selectedCityId, tripStart, tripEnd, tripStyle, isSubscribed])
  const allItems = useMemo(
    () => plans.flatMap((p) => p.plan_items),
    [plans]
  )
  const itemTypes = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.item_type))),
    [allItems]
  )

  // Spot 거리 계산용 아이템 (좌표가 있는 것만)
  const spotsForDistance = useMemo(() => {
    if (!mainPlan) return []
    return mainPlan.plan_items
      .filter((i) => ['food', 'diy', 'quest'].includes(i.item_type))
      .map((i) => {
        const data = i.item_data
        const nameField = data.name as Record<string, string> | string | undefined
        const name =
          typeof nameField === 'string'
            ? nameField
            : nameField?.[locale] || nameField?.ko || 'Item'
        return {
          id: i.id,
          name,
          lat: typeof data.lat === 'number' ? (data.lat as number) : undefined,
          lng: typeof data.lng === 'number' ? (data.lng as number) : undefined,
          emoji: i.item_type === 'food' ? '🍜' : i.item_type === 'diy' ? '🏺' : '⚔️',
        }
      })
  }, [mainPlan, locale])

  // 호텔이 저장된 후 플랜 목록을 다시 불러오기
  const handleHotelSaved = () => refreshPlans()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-[#6B7280]">...</div>
      </div>
    )
  }

  return (
    <div className="bg-snow min-h-screen">
      <PlannerHero itemCount={totalItems} />

      {/* 성공 토스트 */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold shadow-lg">
          🎉 {successMessage}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <PlannerPreview
          plans={plans}
          locale={locale}
          isSubscribed={isSubscribed}
          onRemoveItem={handleRemoveItem}
          onHotelSaved={handleHotelSaved}
          onResetAll={handleResetAll}
        />

        {!isSubscribed && subscriptionPlans.length > 0 && (
          <PlannerSubscriptionWall
            plans={subscriptionPlans}
            locale={locale}
            onSubscribe={handleSubscribe}
          />
        )}

        {/* 무료 유저: 블러 더미 플랜 + 타임라인 생성 애니메이션 */}
        {!isSubscribed && (
          <section className="relative">
            {/* 더미 블러 콘텐츠 */}
            <div className="blur-sm pointer-events-none select-none">
              <div className="bg-white rounded-3xl p-6 border border-mist mb-4">
                <p className="text-xs font-black text-mint-deep uppercase tracking-widest mb-3">📅 1일차</p>
                <div className="space-y-3">
                  {['🌅 09:00 – 12:00', '🍽️ 12:00 – 14:00', '☀️ 14:00 – 18:00', '🌆 18:00 – 20:00', '🌙 20:00 – 22:00'].map((s) => (
                    <div key={s} className="flex gap-4">
                      <span className="text-xs text-stone w-28 shrink-0">{s}</span>
                      <div className="flex-1 h-6 bg-mist/50 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-mist">
                <p className="text-xs font-black text-mint-deep uppercase tracking-widest mb-3">📅 2일차</p>
                <div className="space-y-3">
                  {['🌅 09:00 – 12:00', '🍽️ 12:00 – 14:00', '☀️ 14:00 – 18:00'].map((s) => (
                    <div key={s} className="flex gap-4">
                      <span className="text-xs text-stone w-28 shrink-0">{s}</span>
                      <div className="flex-1 h-6 bg-mist/50 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 애니메이션 + 구독 유도 오버레이 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              {/* 플랜 생성 애니메이션 */}
              <div className="w-full max-w-md mb-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-mist shadow-lg">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-lg">✨</span>
                    <span className="text-sm font-bold text-ink animate-pulse">
                      {t('locked.generating')}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 animate-line-1">
                      <div className="w-2 h-2 rounded-full bg-mint-deep" />
                      <div className="flex-1 h-px bg-gradient-to-r from-mint-deep to-transparent" />
                      <span className="text-xs text-mint-deep font-bold">🚄 {t('locked.lineDeparture')}</span>
                      <div className="h-8 w-32 bg-mint-light/50 rounded-lg animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-3 animate-line-2">
                      <div className="w-2 h-2 rounded-full bg-mint" />
                      <div className="flex-1 h-px bg-gradient-to-r from-mint to-transparent" />
                      <span className="text-xs text-slate">☀️ {t('locked.lineMorning')}</span>
                      <div className="h-8 w-28 bg-mint-light/30 rounded-lg animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-3 animate-line-3">
                      <div className="w-2 h-2 rounded-full bg-mint" />
                      <div className="flex-1 h-px bg-gradient-to-r from-mint to-transparent" />
                      <span className="text-xs text-slate">🍜 {t('locked.lineLunch')}</span>
                      <div className="h-8 w-24 bg-blossom/20 rounded-lg animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-3 animate-line-4">
                      <div className="w-2 h-2 rounded-full bg-mint" />
                      <div className="flex-1 h-px bg-gradient-to-r from-mint to-transparent" />
                      <span className="text-xs text-slate">🎯 {t('locked.lineMission')}</span>
                      <div className="h-8 w-36 bg-mint-light/30 rounded-lg animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-3 animate-line-5">
                      <div className="w-2 h-2 rounded-full bg-blossom" />
                      <div className="flex-1 h-px bg-gradient-to-r from-blossom to-transparent" />
                      <span className="text-xs text-slate">👗 OOTD</span>
                      <div className="h-8 w-20 bg-blossom/20 rounded-lg animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-3 animate-line-6">
                      <div className="w-2 h-2 rounded-full bg-mint" />
                      <div className="flex-1 h-px bg-gradient-to-r from-mint to-transparent" />
                      <span className="text-xs text-slate">📅 {t('locked.lineDay2')}</span>
                      <div className="h-8 w-32 bg-mint-light/30 rounded-lg animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-3 animate-line-7">
                      <div className="w-2 h-2 rounded-full bg-blossom-deep" />
                      <div className="flex-1 h-px bg-gradient-to-r from-blossom-deep to-transparent" />
                      <span className="text-xs text-blossom-deep font-bold">🏆 {t('locked.lineComplete')}</span>
                      <div className="h-8 w-24 bg-blossom/30 rounded-lg animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 구독 유도 카드 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center border border-mist shadow-lg max-w-sm w-full">
                <span className="text-3xl mb-3 block">🔒</span>
                <h3 className="text-base font-bold text-ink mb-1">{t('locked.title')}</h3>
                <p className="text-sm text-slate mb-5">{t('locked.desc')}</p>
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      const el = document.querySelector('[data-subscription-wall]')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition"
                  >
                    {t('locked.subscribe')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {isSubscribed && mainPlan && (
          <>
            <PlannerCreditsDisplay
              credits={subStatus.creditsRemaining}
              monthlyCredits={subStatus.monthlyCredits}
              resetAt={subStatus.creditsResetAt}
              locale={locale}
              onCreditsChanged={refreshSubscriptionStatus}
            />
            <PlannerTripSetup
              cityId={selectedCityId}
              startDate={tripStart}
              endDate={tripEnd}
              style={tripStyle}
              onChangeCity={setSelectedCityId}
              onChangeStart={setTripStart}
              onChangeEnd={setTripEnd}
              onChangeStyle={setTripStyle}
            />
            <PlannerCuration itemTypesInPlan={itemTypes} cityId={selectedCityId} />
            <PlannerTransport items={allItems} locale={locale} onRemove={handleRemoveItem} />
            <PlannerSpotDistance
              hotelLat={mainPlan.hotel_lat}
              hotelLng={mainPlan.hotel_lng}
              spots={spotsForDistance}
              onCreditsChanged={refreshSubscriptionStatus}
            />
            <PlannerFinalPlan
              items={allItems}
              locale={locale}
              hasMissionKit={mainPlan.has_mission_kit}
              cityId={selectedCityId}
              tripStartDate={tripStart}
              tripEndDate={tripEnd}
              tripStyle={tripStyle}
              onCreditsChanged={refreshSubscriptionStatus}
              ootdSlot={
                <PlannerOotd
                  cityId={selectedCityId}
                  locale={locale}
                  startDate={tripStart}
                  endDate={tripEnd}
                  existingOotd={allItems
                    .filter((i) => i.item_type === 'ootd')
                    .map((i) => ({ id: i.id, item_data: i.item_data as { date?: string; checkedItems?: { name: string; icon: string }[] } }))}
                />
              }
            />
          </>
        )}
      </main>

      <div className="h-16" />
    </div>
  )
}
