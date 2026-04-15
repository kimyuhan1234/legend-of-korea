'use client'

import { useEffect, useState } from 'react'

interface SafetyBadgeProps {
  userId: string
  locale?: string
  size?: 'sm' | 'md'
}

interface TrustData {
  isBlacklisted: boolean
  reviewCount: number
  averageRating: number | null
}

const LABEL = {
  ko: {
    trusted: '신뢰도 높음',
    new: '신규 참여자',
    blocked: '이용 제한',
    reviews: (n: number) => `${n}개 평가`,
  },
  ja: {
    trusted: '信頼度高',
    new: '新規参加者',
    blocked: '利用制限',
    reviews: (n: number) => `${n}件の評価`,
  },
  en: {
    trusted: 'Trusted',
    new: 'New user',
    blocked: 'Restricted',
    reviews: (n: number) => `${n} reviews`,
  },
}

export function SafetyBadge({ userId, locale = 'ko', size = 'sm' }: SafetyBadgeProps) {
  const [data, setData] = useState<TrustData | null>(null)

  useEffect(() => {
    if (!userId) return
    fetch(`/api/review/check?userId=${userId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => null)
  }, [userId])

  const t = LABEL[locale as keyof typeof LABEL] ?? LABEL.ko
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  if (!data) return null

  if (data.isBlacklisted) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold ${textSize}`}>
        🚫 {t.blocked}
      </span>
    )
  }

  if (data.reviewCount === 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium ${textSize}`}>
        🌱 {t.new}
      </span>
    )
  }

  const avg = data.averageRating ?? 0
  const color =
    avg >= 4.0 ? 'bg-emerald-100 text-emerald-700' :
    avg >= 3.0 ? 'bg-yellow-100 text-yellow-700' :
    'bg-orange-100 text-orange-700'

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${color} ${textSize}`}>
      ⭐ {avg.toFixed(1)} · {t.reviews(data.reviewCount)}
    </span>
  )
}
