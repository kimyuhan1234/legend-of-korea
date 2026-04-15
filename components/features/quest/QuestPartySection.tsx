'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { PartyCard } from '@/components/features/quest/PartyCard'
import { CreatePartyModal } from '@/components/features/quest/CreatePartyModal'
import { JoinPartyConfirmModal } from '@/components/features/quest/JoinPartyButton'
import type { QuestParty } from '@/lib/supabase/types'

interface Props {
  courseId: string
  isLoggedIn: boolean
  currentUserId: string | null
  locale: string
}

export function QuestPartySection({ courseId, isLoggedIn, currentUserId, locale }: Props) {
  const t = useTranslations('quest.party')
  const router = useRouter()
  const [parties, setParties] = useState<QuestParty[]>([])
  const [myPartyIds, setMyPartyIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [joinTarget, setJoinTarget] = useState<QuestParty | null>(null)
  const [toast, setToast] = useState('')

  const fetchParties = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/party/list?courseId=${encodeURIComponent(courseId)}`)
      if (res.ok) {
        const data = await res.json()
        setParties(data.parties || [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [courseId])

  const fetchMyParties = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const res = await fetch('/api/party/my')
      if (res.ok) {
        const data = await res.json()
        setMyPartyIds((data.parties || []).map((p: QuestParty) => p.id))
      }
    } catch {
      // silent
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchParties()
    fetchMyParties()
  }, [fetchParties, fetchMyParties])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleCreateClick() {
    if (!isLoggedIn) {
      router.push(`/${locale}/auth`)
      return
    }
    setShowCreateModal(true)
  }

  function handleJoinClick(party: QuestParty) {
    if (!isLoggedIn) {
      router.push(`/${locale}/auth`)
      return
    }
    setJoinTarget(party)
  }

  async function handleJoined() {
    setJoinTarget(null)
    await fetchParties()
    await fetchMyParties()
    showToast(t('joinedToast'))
  }

  async function handleCreated() {
    setShowCreateModal(false)
    await fetchParties()
    await fetchMyParties()
    showToast(t('created'))
  }

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
      {/* 섹션 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-mint/40 to-blossom/40 text-xs font-black uppercase tracking-widest text-ink mb-2">
            🎉 {t('title')}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-ink">{t('subtitle')}</h2>
          <p className="text-sm text-slate mt-1">{t('desc')}</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition"
        >
          + {t('create')}
        </button>
      </div>

      {/* 파티 목록 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-mist animate-pulse" />
          ))}
        </div>
      ) : parties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-mist">
          <p className="text-3xl mb-3">🏕️</p>
          <p className="text-sm text-slate mb-4">{t('empty')}</p>
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-5 py-2.5 text-sm hover:opacity-90 transition"
          >
            + {t('create')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {parties.map((party) => (
              <PartyCard
                key={party.id}
                party={party}
                currentUserId={currentUserId}
                myPartyIds={myPartyIds}
                onJoin={handleJoinClick}
              />
            ))}
          </div>
          <div className="mt-6 text-center text-sm text-slate">
            {t('emptyCreate')}{' '}
            <button onClick={handleCreateClick} className="text-[#5BBDAD] font-bold hover:underline">
              + {t('create')}
            </button>
          </div>
        </>
      )}

      {/* 파티 생성 모달 */}
      {showCreateModal && (
        <CreatePartyModal
          courseId={courseId}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* 참여 확인 모달 */}
      {joinTarget && (
        <JoinPartyConfirmModal
          party={joinTarget}
          isLoggedIn={isLoggedIn}
          locale={locale}
          onJoined={handleJoined}
          onClose={() => setJoinTarget(null)}
        />
      )}

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </section>
  )
}
