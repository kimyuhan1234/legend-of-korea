'use client'

import { useRouter } from 'next/navigation'

interface Tab {
  id: string
  label: string
}

interface StoryTabNavProps {
  locale: string
  activeTab: string
  tabs: Tab[]
}

export function StoryTabNav({ locale, activeTab, tabs }: StoryTabNavProps) {
  const router = useRouter()
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-[#e8ddd0] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => router.push(`/${locale}/story?tab=${tab.id}`)}
            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[#2D1B69] text-[#2D1B69]'
                : 'border-transparent text-[#7a6a58] hover:text-[#2D1B69]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
