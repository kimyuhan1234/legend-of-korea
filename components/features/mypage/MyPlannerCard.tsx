'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type PlannerLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<PlannerLocale, {
  title: string
  emptyTitle: string
  emptyDesc: string
  createBtn: string
  viewBtn: string
  itemCount: (n: number) => string
  status: { draft: string; confirmed: string; completed: string }
}> = {
  ko: {
    title: '🗓️ 내 플래너',
    emptyTitle: '아직 플래너에 담은 여행이 없어요',
    emptyDesc: '여행 계획을 만들고 원하는 장소를 모아보세요',
    createBtn: '플래너 만들기',
    viewBtn: '보러가기 →',
    itemCount: (n) => `${n}개 아이템`,
    status: { draft: '작성 중', confirmed: '확정', completed: '완료' },
  },
  en: {
    title: '🗓️ My Planner',
    emptyTitle: "No trip in your planner yet",
    emptyDesc: 'Create a trip plan and collect places you like',
    createBtn: 'Create Planner',
    viewBtn: 'View →',
    itemCount: (n) => `${n} items`,
    status: { draft: 'Draft', confirmed: 'Confirmed', completed: 'Completed' },
  },
  ja: {
    title: '🗓️ マイプランナー',
    emptyTitle: 'まだプランナーに旅行がありません',
    emptyDesc: '旅行計画を作成してお気に入りの場所を集めましょう',
    createBtn: 'プランナーを作る',
    viewBtn: '見る →',
    itemCount: (n) => `${n}件`,
    status: { draft: '作成中', confirmed: '確定', completed: '完了' },
  },
  'zh-CN': {
    title: '🗓️ 我的行程规划',
    emptyTitle: '暂无行程计划',
    emptyDesc: '创建行程并收藏喜欢的地点',
    createBtn: '创建行程',
    viewBtn: '查看 →',
    itemCount: (n) => `${n} 项`,
    status: { draft: '草稿', confirmed: '已确认', completed: '已完成' },
  },
  'zh-TW': {
    title: '🗓️ 我的行程規劃',
    emptyTitle: '暫無行程計畫',
    emptyDesc: '建立行程並收藏喜歡的地點',
    createBtn: '建立行程',
    viewBtn: '查看 →',
    itemCount: (n) => `${n} 項`,
    status: { draft: '草稿', confirmed: '已確認', completed: '已完成' },
  },
}

interface PlanRow {
  id: string
  title: Record<string, string> | null
  city_id: string
  status: 'draft' | 'confirmed' | 'completed'
  plan_items: { count: number }[]
}

interface Props {
  userId: string | null
  locale: string
}

export function MyPlannerCard({ userId, locale }: Props) {
  const [plan, setPlan] = useState<(PlanRow & { itemCount: number }) | null>(null)
  const [loading, setLoading] = useState(true)

  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as PlannerLocale)
    ? (locale as PlannerLocale)
    : 'en'
  const t = UI[lc]

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase
      .from('travel_plans')
      .select('id, title, city_id, status, plan_items(count)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .returns<PlanRow[]>()
      .then(({ data }) => {
        const row = data?.[0]
        if (row) {
          const itemCount = row.plan_items?.[0]?.count ?? 0
          setPlan({ ...row, itemCount })
        }
        setLoading(false)
      })
  }, [userId])

  if (loading) {
    return <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
  }

  const title = plan?.title
    ? plan.title[lc] || plan.title.en || plan.title.ko || ''
    : ''

  const href = `/${locale}/planner`

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-light to-lavender border border-mist overflow-hidden">
      <div className="p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-sky">{t.title}</p>

        {plan ? (
          <>
            <h3 className="text-lg font-black text-[#111] mt-2 mb-1 truncate">
              {title || plan.city_id}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black text-white bg-sky px-2 py-0.5 rounded-full">
                {t.status[plan.status]}
              </span>
              <span className="text-xs font-bold text-slate">{t.itemCount(plan.itemCount)}</span>
            </div>
            <Link
              href={href}
              className="inline-block w-full text-center py-3 rounded-full bg-white text-sky font-black text-sm hover:bg-cloud transition-colors"
            >
              {t.viewBtn}
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-[#111] mt-2">{t.emptyTitle}</p>
            <p className="text-xs text-slate mt-1 mb-4">{t.emptyDesc}</p>
            <Link
              href={href}
              className="inline-block w-full text-center py-3 rounded-full bg-gradient-to-r from-sky to-mint-deep text-white font-black text-sm hover:opacity-90 transition-opacity"
            >
              {t.createBtn}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
