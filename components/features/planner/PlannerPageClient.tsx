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

  // 초기 데이터 로드
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [plannerRes, statusRes, plansRes] = await Promise.all([
          fetch('/api/planner/items'),
          fetch('/api/subscription/status'),
          fetch('/api/subscription/status'),
        ])

        if (plannerRes.ok && mounted) {
          const d = await plannerRes.json()
          setPlans(d.plans || [])
          setTotalItems(d.totalItems || 0)
        }

        if (statusRes.ok && mounted) {
          const s = await statusRes.json()
          setIsSubscribed(!!s.subscribed)
        }

        // subscription_plans 목록은 Supabase public 테이블에서 직접 조회
        // 여기선 status API가 free plan만 반환하므로, 별도 엔드포인트 없어도 무방
        // 임시로 RLS=public인 테이블에서 pulled 한다면 별도 API 필요
        void plansRes
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // 구독 플랜 목록 로드 (공개 조회)
  useEffect(() => {
    let mounted = true
    fetch('/api/subscription/status')
      .then((r) => r.ok ? r.json() : null)
      .then(() => {
        // 임시: 하드코딩된 UI용 플랜 3개를 가져오는 대신
        // subscription_plans 테이블을 직접 조회하는 API가 별도 필요
        // 여기서는 PlannerSubscriptionWall에 직접 쿼리를 시도
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  // 플랜 목록 직접 조회 (Supabase 공개 테이블)
  useEffect(() => {
    let mounted = true
    fetch('/api/subscription/plans')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (mounted && data?.plans) {
          setSubscriptionPlans(data.plans)
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/planner/items?itemId=${itemId}`, { method: 'DELETE' })
      if (res.ok) {
        setPlans((prev) =>
          prev.map((p) => ({
            ...p,
            plan_items: p.plan_items.filter((i) => i.id !== itemId),
          }))
        )
        setTotalItems((n) => Math.max(0, n - 1))
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
  const handleHotelSaved = async () => {
    const res = await fetch('/api/planner/items')
    if (res.ok) {
      const d = await res.json()
      setPlans(d.plans || [])
    }
  }

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
            <PlannerCuration itemTypesInPlan={itemTypes} />
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
            />
          </>
        )}
      </main>

      <div className="h-16" />
    </div>
  )
}
