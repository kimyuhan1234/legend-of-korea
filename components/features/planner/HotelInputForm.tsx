'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface HotelInputFormProps {
  planId: string
  initialName?: string
  initialAddress?: string
  onSaved?: () => void
}

export function HotelInputForm({ planId, initialName, initialAddress, onSaved }: HotelInputFormProps) {
  const t = useTranslations('planner')
  const [name, setName] = useState(initialName ?? '')
  const [address, setAddress] = useState(initialAddress ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !address.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/planner/hotel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, name, address, source: 'manual' }),
      })
      if (res.ok) {
        setSaved(true)
        onSaved?.()
        window.dispatchEvent(new Event('planner:refresh'))
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4E7EB]/40">
      <p className="text-sm font-black text-[#111] mb-3">🏨 {t('hotel.manual')}</p>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
            {t('hotel.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            placeholder="한옥스테이 사로"
            className="w-full mt-1 px-4 py-2 rounded-xl border border-[#E4E7EB] text-sm focus:border-[#9DD8CE] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">
            {t('hotel.address')}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={500}
            placeholder="전라북도 전주시 완산구 ..."
            className="w-full mt-1 px-4 py-2 rounded-xl border border-[#E4E7EB] text-sm focus:border-[#9DD8CE] focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !name.trim() || !address.trim()}
        className="w-full mt-4 py-2.5 rounded-full bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] text-sm font-bold hover:bg-[#7BC8BC] transition-colors disabled:bg-neutral-200 disabled:text-neutral-400"
      >
        {saved ? '✓ ' + t('added') : saving ? t('adding') : t('addButton')}
      </button>
    </div>
  )
}
