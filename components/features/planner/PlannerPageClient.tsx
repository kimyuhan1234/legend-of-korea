'use client'

import { useState, useEffect, useMemo } from 'react'
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

type ItemType = 'food' | 'stay' | 'diy' | 'quest' | 'ootd' | 'goods' | 'transport' | 'surprise'

interface PlanItem {
  id: string
  item_type: ItemType
  item_data: Record<string, unknown>
}

interface Plan {
  id: string
  city_id: string
  has_mission_kit: boolean
  hotel_name: string | null
  hotel_address: string | null
  hotel_lat: number | null
  hotel_lng: number | null
  hotel_source: 'curated' | 'manual' | null
  plan_items: PlanItem[]
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

  // 여행 기간/스타일 (localStorage 보존)
  const [tripStart, setTripStart] = useState<string>('')
  const [tripEnd, setTripEnd] = useState<string>('')
  const [tripStyle, setTripStyle] = useState<TripStyle>('active')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('planner:trip')
      if (saved) {
        const parsed = JSON.parse(saved) as {
          start?: string; end?: string; style?: TripStyle
        }
        if (parsed.start) setTripStart(parsed.start)
        if (parsed.end) setTripEnd(parsed.end)
        if (parsed.style) setTripStyle(parsed.style)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'planner:trip',
        JSON.stringify({ start: tripStart, end: tripEnd, style: tripStyle })
      )
    } catch {}
  }, [tripStart, tripEnd, tripStyle])

  // 담긴 아이템 다시 불러오기 (공개 재사용 함수)
  const refreshPlans = async () => {
    const res = await fetch('/api/planner/items')
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
          setIsSubscribed(!!s.subscribed)
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

  // 전체 초기화 — 아이템 삭제 후 서버 상태 재조회 + 프론트 여행 설정도 리셋
  const handleResetAll = async () => {
    setTripStart('')
    setTripEnd('')
    setTripStyle('active')
    try {
      window.localStorage.removeItem('planner:trip')
    } catch {}
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
    <div className="bg-[#FAFAF9] min-h-screen">
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

        {isSubscribed && mainPlan && (
          <>
            <PlannerTripSetup
              cityId={mainPlan.city_id}
              startDate={tripStart}
              endDate={tripEnd}
              style={tripStyle}
              onChangeStart={setTripStart}
              onChangeEnd={setTripEnd}
              onChangeStyle={setTripStyle}
            />
            <PlannerCuration itemTypesInPlan={itemTypes} cityId={mainPlan.city_id} />
            <PlannerTransport cityId={mainPlan.city_id} locale={locale} />
            <PlannerSpotDistance
              hotelLat={mainPlan.hotel_lat}
              hotelLng={mainPlan.hotel_lng}
              spots={spotsForDistance}
            />
            <PlannerFinalPlan
              items={allItems}
              locale={locale}
              hasMissionKit={mainPlan.has_mission_kit}
              cityId={mainPlan.city_id}
              tripStartDate={tripStart}
              tripEndDate={tripEnd}
              tripStyle={tripStyle}
              ootdSlot={
                <PlannerOotd
                  cityId={mainPlan.city_id}
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
