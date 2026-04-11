'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

interface OutfitItem {
  nameKey: string
  icon: string
}

interface OotdChecklistProps {
  date: string
  cityId: string
  cityName: { ko: string; ja: string; en: string }
  items: OutfitItem[]
}

export function OotdChecklist({ date, cityId, cityName, items }: OotdChecklistProps) {
  const t = useTranslations('planner')
  const ot = useTranslations('ootd')
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'login-required'>('idle')

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSubmit = async () => {
    if (checked.size === 0 || state === 'loading' || state === 'added') return

    // 체크된 아이템만 수집 — 자동 선택 절대 금지
    const checkedItems = items
      .filter((i) => checked.has(i.nameKey))
      .map((i) => {
        // nameKey는 "ootd.items.xyz" 형태 → translation 시 namespace 제외
        const shortKey = i.nameKey.replace('ootd.', '') as Parameters<typeof ot>[0]
        return {
          nameKey: i.nameKey,
          name: ot(shortKey),
          icon: i.icon,
        }
      })

    setState('loading')
    try {
      const res = await fetch('/api/planner/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: 'ootd',
          cityId,
          itemData: {
            date,
            cityId,
            cityName,
            checkedItems,
          },
        }),
      })

      if (res.status === 401) {
        setState('login-required')
        setTimeout(() => router.push(`/${locale}/auth/login?next=${pathname}`), 1000)
        return
      }

      if (!res.ok) {
        setState('idle')
        return
      }

      setState('added')
    } catch {
      setState('idle')
    }
  }

  return (
    <div className="border-t border-[#e8ddd0]/40 mt-4 pt-4">
      <p className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest mb-2">
        {t('ootd.check')}
      </p>

      <ul className="space-y-1.5 mb-3">
        {items.map((item) => {
          const shortKey = item.nameKey.replace('ootd.', '') as Parameters<typeof ot>[0]
          return (
            <li key={item.nameKey}>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checked.has(item.nameKey)}
                  onChange={() => toggle(item.nameKey)}
                  className="w-4 h-4 accent-[#FF6B35]"
                />
                <span className="text-base leading-none">{item.icon}</span>
                <span className="text-neutral-700">{ot(shortKey)}</span>
              </label>
            </li>
          )
        })}
      </ul>

      <button
        onClick={handleSubmit}
        disabled={checked.size === 0 || state === 'loading' || state === 'added'}
        className={`w-full py-2 rounded-full text-xs font-bold transition-colors ${
          state === 'added'
            ? 'bg-emerald-500 text-white'
            : checked.size === 0
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-[#FF6B35] text-white hover:bg-[#E55A2B]'
        }`}
      >
        {state === 'added'
          ? `✓ ${t('added')}`
          : state === 'loading'
            ? t('adding')
            : state === 'login-required'
              ? t('loginRequired')
              : `+ ${t('ootd.addChecked')} (${checked.size})`}
      </button>
    </div>
  )
}
