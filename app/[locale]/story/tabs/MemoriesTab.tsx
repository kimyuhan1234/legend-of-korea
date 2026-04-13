'use client'

import { CommunityFeed } from '@/components/features/community/CommunityFeed'

interface MemoriesTabProps {
  locale: string
}

export function MemoriesTab({ locale }: MemoriesTabProps) {
  return (
    <div>
      <CommunityFeed locale={locale} />
    </div>
  )
}
