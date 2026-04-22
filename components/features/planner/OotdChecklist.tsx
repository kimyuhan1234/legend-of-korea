'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { PassRequiredModal } from '@/components/shared/PassRequiredModal'

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
  const [showPassModal, setShowPassModal] = useState(false)

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSubmit = async () => {
    if (checked.size === 0 || state === 'loading' || state === 'added' || showPassModal) return

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

      if (res.status === 403) {
        setState('idle')
        setShowPassModal(true)
        return
      }

      if (!res.ok) {
        setState('idle')
        return
      }

      setState('added')
      window.dispatchEvent(new Event('planner:refresh'))
    } catch {
      setState('idle')
    }
  }

  return (
    <>
      {showPassModal && (
        <PassRequiredModal
          locale={locale}
          passId="live"
          onClose={() => setShowPassModal(false)}
        />
      )}
      <div className="border-t border-mist/40 mt-4 pt-4">
      <p className="text-[10px] font-black text-mint-deep uppercase tracking-widest mb-2">
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
                  className="w-4 h-4 accent-[#9DD8CE]"
                />
                <span className="text-base leading-none">{item.icon}</span>
                <span className="text-neutral-700">{ot(shortKey)}</span>
              </label>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={checked.size === 0 || state === 'loading' || state === 'added' || showPassModal}
        className={`w-full py-2 rounded-full text-xs font-bold transition-colors ${
          state === 'added'
            ? 'bg-emerald-500 text-white'
            : checked.size === 0
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-mint to-blossom text-ink hover:bg-[#7BC8BC]'
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
    </>
  )
}
