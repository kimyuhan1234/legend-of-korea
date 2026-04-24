'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { AddToPlannerButton } from '@/components/features/planner/AddToPlannerButton'

interface AiMatchResult {
  foodId: string
  regionCode: string
  similarityPercent: number
  matchReason: { ko: string; en: string; ja: string }
  tasteComparison: { ko: string; en: string; ja: string }
  foodName: { ko: string; en: string; ja: string }
  foodImage: string
  regionName: { ko: string; en: string; ja: string }
}

interface AiDupeSearchProps {
  locale: string
}

function getL(field: { ko: string; en: string; ja: string } | null | undefined, locale: string): string {
  if (!field) return ''
  return (field as Record<string, string>)[locale] || field.en || field.ko || ''
}

export function AiDupeSearch({ locale }: AiDupeSearchProps) {
  const t = useTranslations('dupe')
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AiMatchResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    const q = query.trim()
    if (!q || q.length < 2 || loading) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/dupe/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, locale }),
      })

      if (res.status === 401) {
        setError('loginRequired')
        return
      }
      if (res.status === 403) {
        setError('subscription')
        return
      }
      if (res.status === 503) {
        setError('notConfigured')
        return
      }
      if (!res.ok) {
        setError('aiError')
        return
      }

      const data = await res.json()
      setResults(data.matches ?? [])
    } catch {
      setError('network')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="bg-white rounded-3xl border border-mist p-6 md:p-8">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-ink mb-2">
          {t('ai.title')}
        </h2>
        <p className="text-sm text-stone">{t('ai.subtitle')}</p>
      </div>

      {/* 검색바 */}
      <div className="flex gap-2 mb-3 max-w-lg mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('ai.placeholder')}
          className="flex-1 px-4 py-3 rounded-xl border border-mist text-sm text-ink placeholder:text-stone focus:outline-none focus:border-mint-deep focus:ring-2 focus:ring-mint-light"
          disabled={loading}
          maxLength={100}
        />
        <button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="px-5 py-3 rounded-xl bg-mint-deep text-white text-sm font-bold hover:bg-[#7BC8BC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {t('ai.search')}
        </button>
      </div>

      {/* 예시 */}
      <div className="text-center mb-6">
        <p className="text-xs text-stone mb-1">
          💡 {t('ai.examples')}
        </p>
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-3 border-mint-deep border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone">{t('ai.loading')}</p>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-blossom-deep font-bold">
            {error === 'loginRequired' && t('ai.loginRequired')}
            {error === 'subscription' && t('ai.subscription')}
            {error === 'notConfigured' && t('ai.notConfigured')}
            {error === 'aiError' && t('ai.aiError')}
            {error === 'network' && t('ai.networkError')}
          </p>
        </div>
      )}

      {/* 결과 */}
      {results !== null && !loading && (
        <div className="space-y-4 mt-6">
          {results.length === 0 ? (
            <p className="text-center text-sm text-stone py-6">{t('ai.noResult')}</p>
          ) : (
            results.map((match, i) => (
              <div
                key={match.foodId}
                className="bg-snow rounded-2xl border border-mist p-5 hover:border-mint transition-colors"
              >
                <div className="flex gap-4">
                  {/* 이미지 */}
                  {match.foodImage && (
                    <Link
                      href={`/${locale}/food/dupe/${match.regionCode}/${match.foodId}`}
                      className="shrink-0"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                        <Image
                          src={match.foodImage}
                          alt={getL(match.foodName, locale)}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* 이름 + 유사도 */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-black text-ink">
                          {getL(match.foodName, locale)}
                        </p>
                        <p className="text-[10px] text-stone">
                          {getL(match.regionName, locale)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-stone">{t('ai.similarity')}</p>
                        <p className="text-lg font-black text-mint-deep">
                          {match.similarityPercent}%
                        </p>
                      </div>
                    </div>

                    {/* 유사도 바 */}
                    <div className="h-1 bg-mist rounded-full mb-3">
                      <div
                        className="h-full bg-mint-deep rounded-full transition-all"
                        style={{ width: `${match.similarityPercent}%` }}
                      />
                    </div>

                    {/* 비슷한 이유 */}
                    <p className="text-xs text-slate mb-1">
                      <span className="font-bold text-mint-deep">{t('ai.reason')}:</span>{' '}
                      {getL(match.matchReason, locale)}
                    </p>

                    {/* 맛 차이점 */}
                    <p className="text-xs text-stone mb-3">
                      <span className="font-bold">{t('ai.tasteDiff')}:</span>{' '}
                      {getL(match.tasteComparison, locale)}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/food/dupe/${match.regionCode}/${match.foodId}`}
                        className="text-xs font-bold text-mint-deep hover:text-[#7BC8BC] transition-colors"
                      >
                        {t('ai.detail')}
                      </Link>
                      <AddToPlannerButton
                        itemType="food"
                        itemData={{
                          name: match.foodName,
                          foodId: match.foodId,
                          region: match.regionCode,
                          source: 'ai-dupe',
                        }}
                        cityId={match.regionCode}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
