'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface PointsTabProps {
  locale: string
  user: { id: string; nickname?: string | null; total_lp?: number | null; current_tier?: number | null } | null
}

// TODO: 마이페이지 구현 시 실제 쿠폰 목록 연결
export function PointsTab({ locale, user }: PointsTabProps) {
  const t = useTranslations('story')

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚡</div>
        <p className="text-[#7a6a58] mb-6">{t('loginRequired')}</p>
        <Link
          href={`/${locale}/auth/login`}
          className="px-6 py-3 bg-[#2D1B69] text-white rounded-full font-bold hover:bg-[#3d2880] transition-colors"
        >
          {t('loginBtn')}
        </Link>
      </div>
    )
  }

  const tier = user.current_tier ?? 1
  const lp = user.total_lp ?? 0

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-black text-[#2D1B69] mb-6">{t('pointsTitle')}</h2>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-[#e8ddd0]">
          <span className="text-sm text-[#7a6a58]">{t('currentLP')}</span>
          <span className="font-black text-[#2D1B69] text-xl">⚡ {lp.toLocaleString()} LP</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-[#7a6a58]">{t('currentTier')}</span>
          <span className="font-bold text-[#FF6B35]">Lv.{tier}</span>
        </div>
      </div>

      {/* TODO: 쿠폰 목록 — 마이페이지 구현 시 연결 */}
      <Link
        href={`/${locale}/mypage`}
        className="mt-6 block text-center px-6 py-3 bg-[#FF6B35] text-white rounded-full font-bold hover:bg-[#E55A2B] transition-colors"
      >
        마이페이지에서 자세히 보기 →
      </Link>
    </div>
  )
}
