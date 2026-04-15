'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import type { QuestParty } from '@/lib/supabase/types'

interface Props {
  party: QuestParty
  isLoggedIn: boolean
  locale: string
  onJoined: () => void
  onClose: () => void
}

export function JoinPartyConfirmModal({ party, isLoggedIn, locale, onJoined, onClose }: Props) {
  const t = useTranslations('quest.party')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    if (!isLoggedIn) {
      router.push(`/${locale}/auth`)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/party/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyId: party.id }),
      })
      if (res.ok) {
        onJoined()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to join')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-base font-black text-ink mb-2">🎉 {t('confirmJoin')}</h3>
        <p className="text-sm text-slate mb-1 font-semibold">{party.title}</p>
        <p className="text-xs text-stone mb-4">{t('confirmJoinDesc')}</p>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate border border-mist hover:bg-snow transition"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-mint to-blossom text-ink hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? '...' : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
