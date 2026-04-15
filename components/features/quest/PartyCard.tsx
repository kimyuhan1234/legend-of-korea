'use client'

import { useTranslations } from 'next-intl'
import type { QuestParty } from '@/lib/supabase/types'

const NATIONALITY_FLAGS: Record<string, string> = {
  us: '🇺🇸', jp: '🇯🇵', kr: '🇰🇷', cn: '🇨🇳', gb: '🇬🇧',
  fr: '🇫🇷', de: '🇩🇪', au: '🇦🇺', ca: '🇨🇦', sg: '🇸🇬',
  tw: '🇹🇼', hk: '🇭🇰', th: '🇹🇭', vn: '🇻🇳', ph: '🇵🇭',
  id: '🇮🇩', my: '🇲🇾', in: '🇮🇳', br: '🇧🇷', mx: '🇲🇽',
  other: '🌍',
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English', ko: '한국어', ja: '日本語', zh: '中文',
  fr: 'Français', de: 'Deutsch', es: 'Español', other: 'Other',
}

interface PartyCardProps {
  party: QuestParty
  currentUserId: string | null
  myPartyIds: string[]
  onJoin: (party: QuestParty) => void
}

export function PartyCard({ party, currentUserId, myPartyIds, onJoin }: PartyCardProps) {
  const t = useTranslations('quest.party')
  const isLeader = currentUserId === party.leader_id
  const isMember = myPartyIds.includes(party.id)
  const isFull = party.status === 'full'

  const flag = NATIONALITY_FLAGS[party.leader_nationality || 'other'] || '🌍'
  const langLabel = LANGUAGE_LABELS[party.language] || party.language

  const progressPct = Math.round((party.current_members / party.max_members) * 100)

  return (
    <div className="bg-white rounded-2xl border border-mist p-5 hover:border-mint hover:shadow-md transition-all flex flex-col gap-3">
      {/* 리더 정보 */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5BBDAD] uppercase tracking-wider">Leader</span>
          </div>
        </div>
        {isFull && (
          <span className="text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
            {t('full')}
          </span>
        )}
      </div>

      {/* 파티 제목 */}
      <h4 className="text-sm font-bold text-ink leading-snug line-clamp-2">{party.title}</h4>

      {/* 날짜 + 언어 */}
      <div className="flex gap-3 text-xs text-slate">
        <span>📅 {party.adventure_date}</span>
        <span>🗣️ {langLabel}</span>
      </div>

      {/* 인원 프로그레스 */}
      <div>
        <div className="flex justify-between text-xs text-slate mb-1">
          <span>👥 {t('members', { current: party.current_members, max: party.max_members })}</span>
        </div>
        <div className="w-full bg-snow rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-mint to-[#5BBDAD] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      {isLeader ? (
        <button
          disabled
          className="w-full py-2 rounded-xl text-sm font-bold bg-mint/30 text-[#5BBDAD] border border-mint cursor-default"
        >
          {t('myParty')} ✓
        </button>
      ) : isMember ? (
        <button
          disabled
          className="w-full py-2 rounded-xl text-sm font-bold bg-snow text-slate border border-mist cursor-default"
        >
          {t('joined')} ✓
        </button>
      ) : (
        <button
          onClick={() => onJoin(party)}
          disabled={isFull}
          className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${
            isFull
              ? 'bg-snow text-stone cursor-not-allowed'
              : 'bg-gradient-to-r from-mint to-blossom text-ink hover:opacity-90'
          }`}
        >
          {isFull ? t('full') : t('join')}
        </button>
      )}
    </div>
  )
}
