'use client'

import Link from 'next/link'
import { CommunityFeed } from '@/components/features/community/CommunityFeed'

interface MemoriesTabProps {
  locale: string
}

export function MemoriesTab({ locale }: MemoriesTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#111]">📸 추억남기기</h2>
        <Link
          href={`/${locale}/community/write`}
          className="px-4 py-2 bg-[#FF6B35] text-white rounded-full text-sm font-bold hover:bg-[#E55A2B] transition-colors"
        >
          ✏️ 기록 남기기
        </Link>
      </div>
      <CommunityFeed locale={locale} />
    </div>
  )
}
