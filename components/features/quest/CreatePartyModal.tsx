'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'other', label: 'Other' },
]

const NATIONALITIES = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'kr', label: '🇰🇷 Korea' },
  { value: 'cn', label: '🇨🇳 China' },
  { value: 'tw', label: '🇹🇼 Taiwan' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'sg', label: '🇸🇬 Singapore' },
  { value: 'hk', label: '🇭🇰 Hong Kong' },
  { value: 'th', label: '🇹🇭 Thailand' },
  { value: 'vn', label: '🇻🇳 Vietnam' },
  { value: 'ph', label: '🇵🇭 Philippines' },
  { value: 'id', label: '🇮🇩 Indonesia' },
  { value: 'my', label: '🇲🇾 Malaysia' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'other', label: '🌍 Other' },
]

interface Props {
  courseId: string
  onClose: () => void
  onCreated: () => void
}

export function CreatePartyModal({ courseId, onClose, onCreated }: Props) {
  const t = useTranslations('quest.party')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [adventureDate, setAdventureDate] = useState('')
  const [maxMembers, setMaxMembers] = useState(4)
  const [language, setLanguage] = useState('en')
  const [nationality, setNationality] = useState('other')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !adventureDate) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/party/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, title: title.trim(), description: description.trim(), adventureDate, maxMembers, language, nationality }),
      })
      if (res.ok) {
        onCreated()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create party')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-lg font-black text-ink mb-5">🎉 {t('modal.title')}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 제목 */}
          <div>
            <label className="text-xs font-bold text-stone uppercase tracking-wider mb-1 block">
              {t('modal.partyTitle')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('modal.partyTitlePlaceholder')}
              maxLength={80}
              required
              className="w-full border border-mist rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-[#5BBDAD]"
            />
          </div>

          {/* 소개글 */}
          <div>
            <label className="text-xs font-bold text-stone uppercase tracking-wider mb-1 block">
              {t('modal.desc')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('modal.descPlaceholder')}
              maxLength={200}
              rows={2}
              className="w-full border border-mist rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-[#5BBDAD] resize-none"
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="text-xs font-bold text-stone uppercase tracking-wider mb-1 block">
              {t('modal.date')} *
            </label>
            <input
              type="date"
              value={adventureDate}
              onChange={(e) => setAdventureDate(e.target.value)}
              min={today}
              required
              className="w-full border border-mist rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-[#5BBDAD]"
            />
          </div>

          {/* 최대 인원 */}
          <div>
            <label className="text-xs font-bold text-stone uppercase tracking-wider mb-2 block">
              {t('modal.maxMembers')} *
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMaxMembers(n)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    maxMembers === n
                      ? 'bg-gradient-to-r from-[#B8E8E0] to-[#F5D0D0] text-ink border border-[#B8E8E0]'
                      : 'bg-snow text-slate border border-mist hover:border-[#B8E8E0]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* 언어 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone uppercase tracking-wider mb-1 block">
                {t('modal.language')}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-mist rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-[#5BBDAD]"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* 국적 */}
            <div>
              <label className="text-xs font-bold text-stone uppercase tracking-wider mb-1 block">
                {t('modal.nationality')}
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full border border-mist rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-[#5BBDAD]"
              >
                {NATIONALITIES.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate border border-mist hover:bg-snow transition"
            >
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !adventureDate}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#B8E8E0] to-[#F5D0D0] text-ink hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? '...' : t('modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
