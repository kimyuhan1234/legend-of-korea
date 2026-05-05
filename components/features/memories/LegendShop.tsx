'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RankBadge, invalidateRankCache } from '@/components/features/rank/RankBadge'
import { RaindropIcon } from '@/components/shared/icons/RaindropIcon'

type ShopLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<ShopLocale, {
  balance: string
  unit: string
  rankUpHeading: string
  rankUpNow: string
  rankUpBtn: string
  rankUpCost: (n: number) => string
  rankUpMax: string
  insufficient: (d: number) => string
  success: (lv: number) => string
  couponsHeading: string
  buyBtn: string
  couponsMine: string
  couponsEmpty: string
  couponExpires: (d: string) => string
  couponUsed: string
}> = {
  ko: {
    balance: '내 빗방울',
    unit: '빗방울',
    rankUpHeading: '⬆️ 레벨 업',
    rankUpNow: '현재',
    rankUpBtn: '레벨 업',
    rankUpCost: (n) => `필요 ${n.toLocaleString()} 빗방울`,
    rankUpMax: '최고 레벨 도달! 🏆',
    insufficient: (d) => `빗방울이 ${d.toLocaleString()} 부족`,
    success: (lv) => `🎉 Lv ${lv} 도달!`,
    couponsHeading: '🎟️ 할인 쿠폰 교환',
    buyBtn: '구매',
    couponsMine: '📜 내 쿠폰',
    couponsEmpty: '보유 쿠폰이 없습니다',
    couponExpires: (d) => `만료 ${d}`,
    couponUsed: '사용 완료',
  },
  en: {
    balance: 'My Raindrops',
    unit: 'raindrops',
    rankUpHeading: '⬆️ Level Up',
    rankUpNow: 'Current',
    rankUpBtn: 'Level Up',
    rankUpCost: (n) => `Costs ${n.toLocaleString()} raindrops`,
    rankUpMax: 'Max level reached! 🏆',
    insufficient: (d) => `Need ${d.toLocaleString()} more raindrops`,
    success: (lv) => `🎉 Reached Lv ${lv}!`,
    couponsHeading: '🎟️ Exchange Coupons',
    buyBtn: 'Buy',
    couponsMine: '📜 My Coupons',
    couponsEmpty: 'No coupons yet',
    couponExpires: (d) => `Expires ${d}`,
    couponUsed: 'Used',
  },
  ja: {
    balance: '雨滴残高',
    unit: '雨滴',
    rankUpHeading: '⬆️ レベルアップ',
    rankUpNow: '現在',
    rankUpBtn: 'レベルアップ',
    rankUpCost: (n) => `必要 ${n.toLocaleString()} 雨滴`,
    rankUpMax: '最高レベル到達！🏆',
    insufficient: (d) => `雨滴が ${d.toLocaleString()} 不足`,
    success: (lv) => `🎉 Lv ${lv} に到達！`,
    couponsHeading: '🎟️ 割引クーポン交換',
    buyBtn: '購入',
    couponsMine: '📜 保有クーポン',
    couponsEmpty: 'クーポンがありません',
    couponExpires: (d) => `期限 ${d}`,
    couponUsed: '使用済み',
  },
  'zh-CN': {
    balance: '我的雨滴',
    unit: '雨滴',
    rankUpHeading: '⬆️ 升级',
    rankUpNow: '当前',
    rankUpBtn: '升级',
    rankUpCost: (n) => `需要 ${n.toLocaleString()} 雨滴`,
    rankUpMax: '已达最高等级！🏆',
    insufficient: (d) => `雨滴不足 ${d.toLocaleString()}`,
    success: (lv) => `🎉 达到 Lv ${lv}！`,
    couponsHeading: '🎟️ 兑换优惠券',
    buyBtn: '购买',
    couponsMine: '📜 我的优惠券',
    couponsEmpty: '暂无优惠券',
    couponExpires: (d) => `有效期至 ${d}`,
    couponUsed: '已使用',
  },
  'zh-TW': {
    balance: '我的雨滴',
    unit: '雨滴',
    rankUpHeading: '⬆️ 升級',
    rankUpNow: '當前',
    rankUpBtn: '升級',
    rankUpCost: (n) => `需要 ${n.toLocaleString()} 雨滴`,
    rankUpMax: '已達最高等級！🏆',
    insufficient: (d) => `雨滴不足 ${d.toLocaleString()}`,
    success: (lv) => `🎉 達到 Lv ${lv}！`,
    couponsHeading: '🎟️ 兌換優惠券',
    buyBtn: '購買',
    couponsMine: '📜 我的優惠券',
    couponsEmpty: '暫無優惠券',
    couponExpires: (d) => `有效期至 ${d}`,
    couponUsed: '已使用',
  },
}

const EXCHANGE_ITEMS = [
  { rate: 10, cost: 500 },
  { rate: 20, cost: 1500 },
  { rate: 30, cost: 3000 },
]

interface Coupon {
  id: string
  code: string
  discount_rate: number
  expires_at: string | null
  is_used: boolean
}

interface UserState {
  id: string
  current_level: number
  total_lp: number
}

interface RankUpCostRow {
  level: number
  raindrops_required: number
}

interface Props {
  locale: string
}

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })
}

export function LegendShop({ locale }: Props) {
  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as ShopLocale) ? (locale as ShopLocale) : 'en'
  const t = UI[lc]

  const [user, setUser] = useState<UserState | null>(null)
  const [costs, setCosts] = useState<Record<number, number>>({})
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<null | 'rank-up' | number>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  // RankBadge 재조회 트리거 — 랭크업 후 증가시키면 뱃지가 최신 값으로 갱신.
  const [rankRefresh, setRankRefresh] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      setLoading(false)
      return
    }

    const [{ data: userRow }, { data: costRows }, couponsRes] = await Promise.all([
      supabase
        .from('users')
        .select('current_level, total_lp')
        .eq('id', authUser.id)
        .maybeSingle<{ current_level: number | null; total_lp: number | null }>(),
      supabase.from('rank_up_costs').select('level, raindrops_required').returns<RankUpCostRow[]>(),
      fetch('/api/shop/coupons').then((r) => (r.ok ? r.json() : { success: false })),
    ])

    if (userRow) {
      setUser({
        id: authUser.id,
        current_level: userRow.current_level ?? 1,
        total_lp: userRow.total_lp ?? 0,
      })
    }

    const costMap: Record<number, number> = {}
    for (const row of costRows ?? []) costMap[row.level] = row.raindrops_required
    setCosts(costMap)

    if (couponsRes.success && Array.isArray(couponsRes.coupons)) {
      setCoupons(couponsRes.coupons)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleRankUp = async () => {
    if (!user || busy) return
    const targetLevel = user.current_level + 1
    if (targetLevel > 10) return

    const cost = costs[targetLevel] ?? 0
    if (user.total_lp < cost) {
      setMessage({ type: 'error', text: t.insufficient(cost - user.total_lp) })
      return
    }

    setBusy('rank-up')
    setMessage(null)
    try {
      const res = await fetch('/api/shop/rank-up', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: json.error || 'Failed' })
        return
      }
      setMessage({ type: 'success', text: t.success(json.newLevel) })
      // RankBadge 캐시 무효화 → refreshKey 증가로 useEffect 재실행 강제
      invalidateRankCache(user.id)
      setRankRefresh((k) => k + 1)

      // 레벨업 알림 — 다음 마이페이지 진입에서 1회 노출. sessionStorage 키 set.
      if (json.leveledUp && json.unlockedCategorySlug) {
        try {
          sessionStorage.setItem(
            'lok_avatar_level_up_pending',
            JSON.stringify({ newLevel: json.newLevel, slug: json.unlockedCategorySlug }),
          )
        } catch {
          // sessionStorage 차단 환경 — 조용히 무시
        }
      }

      await load()
    } finally {
      setBusy(null)
    }
  }

  const handleBuyCoupon = async (discountRate: number) => {
    if (busy) return
    setBusy(discountRate)
    setMessage(null)
    try {
      const res = await fetch('/api/shop/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountRate }),
      })
      const json = await res.json()
      if (!json.success) {
        setMessage({ type: 'error', text: json.error || 'Failed' })
        return
      }
      await load()
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone">...</div>
  }

  if (!user) {
    return <div className="text-center py-12 text-sm text-stone">Login required</div>
  }

  const isMaxLevel = user.current_level >= 10
  const nextLevel = user.current_level + 1
  const nextCost = costs[nextLevel] ?? 0
  const canAfford = user.total_lp >= nextCost

  return (
    <div className="space-y-6">
      {/* 메시지 */}
      {message && (
        <div className={`rounded-2xl p-3 text-sm font-bold text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* 빗방울 잔액 카드 */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-6 shadow-lg">
        <p className="text-xs font-black uppercase tracking-widest opacity-80 flex items-center gap-1.5">
          <RaindropIcon size={14} />
          {t.balance}
        </p>
        <p className="text-4xl md:text-5xl font-black mt-2">{user.total_lp.toLocaleString()}
          <span className="text-base font-bold opacity-80 ml-2">{t.unit}</span>
        </p>
      </div>

      {/* 랭크업 섹션 */}
      <section className="rounded-3xl border border-mist bg-white p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-base md:text-lg font-black text-[#111]">{t.rankUpHeading}</h2>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-black text-stone uppercase tracking-widest">{t.rankUpNow}</p>
            <div className="mt-2"><RankBadge userId={user.id} size="md" refreshKey={rankRefresh} /></div>
          </div>
        </div>

        {isMaxLevel ? (
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-center">
            <p className="text-sm font-black text-yellow-700">{t.rankUpMax}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-cloud/40 border border-mist p-4 space-y-3">
            <p className="text-xs text-stone">{t.rankUpCost(nextCost)}</p>
            <button
              type="button"
              onClick={handleRankUp}
              disabled={busy !== null || !canAfford}
              className="w-full py-3 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy === 'rank-up'
                ? '...'
                : canAfford
                  ? `⬆️ ${t.rankUpBtn} (Lv ${nextLevel})`
                  : t.insufficient(nextCost - user.total_lp)}
            </button>
          </div>
        )}
      </section>

      {/* 쿠폰 교환 */}
      <section className="rounded-3xl border border-mist bg-white p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-base md:text-lg font-black text-[#111]">{t.couponsHeading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EXCHANGE_ITEMS.map((item) => {
            const affordable = user.total_lp >= item.cost
            return (
              <div key={item.rate} className="rounded-2xl border border-mist p-4 text-center">
                <p className="text-3xl font-black text-blossom-deep">{item.rate}%</p>
                <p className="text-[10px] font-black text-stone uppercase tracking-wider mt-1">{item.cost.toLocaleString()} {t.unit}</p>
                <button
                  type="button"
                  onClick={() => handleBuyCoupon(item.rate)}
                  disabled={busy !== null || !affordable}
                  className="mt-3 w-full py-2 rounded-full bg-blossom-deep text-white font-black text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy === item.rate ? '...' : t.buyBtn}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* 보유 쿠폰 */}
      <section className="rounded-3xl border border-mist bg-white p-5 md:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-black text-[#111] mb-3">{t.couponsMine}</h2>
        {coupons.length === 0 ? (
          <p className="text-sm text-stone text-center py-4">{t.couponsEmpty}</p>
        ) : (
          <div className="space-y-2">
            {coupons.map((c) => (
              <div key={c.id} className={`flex items-center justify-between p-3 rounded-xl border ${c.is_used ? 'bg-cloud/50 border-mist opacity-60' : 'bg-white border-mint'}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-blossom-deep">{c.discount_rate}% OFF</p>
                  <p className="text-[10px] font-mono text-stone">{c.code}</p>
                </div>
                <div className="text-right shrink-0">
                  {c.is_used ? (
                    <span className="text-[10px] font-black text-stone">{t.couponUsed}</span>
                  ) : (
                    <span className="text-[10px] text-stone">{t.couponExpires(formatDate(c.expires_at))}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
