'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ShopClient } from '@/app/[locale]/shop/ShopClient'

interface PointsTabProps {
  locale: string
  user: { id: string; nickname?: string | null; total_lp?: number | null; current_tier?: number | null } | null
}

export function PointsTab({ locale, user }: PointsTabProps) {
  const t = useTranslations('story')

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚡</div>
        <p className="text-[#9CA3AF] mb-6">{t('loginRequired')}</p>
        <Link
          href={`/${locale}/auth/login`}
          className="px-6 py-3 bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] rounded-full font-bold hover:bg-[#374151] transition-colors"
        >
          {t('loginBtn')}
        </Link>
      </div>
    )
  }

  return <ShopClient locale={locale} />
}
