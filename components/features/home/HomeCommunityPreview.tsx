'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowRight, Sparkles, Trophy, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  locale: string
}

type FeedItem =
  | {
      kind: 'post'
      id: string
      text: string | null
      photoUrl: string | null
      likesCount: number
      createdAt: string
      userNickname: string
      userAvatar: string | null
    }
  | {
      kind: 'mission'
      id: string
      photoUrl: string
      lpEarned: number
      createdAt: string
      userNickname: string
      userAvatar: string | null
      missionTitle: Record<string, string>
      courseTitle: Record<string, string>
    }

function getI18n(field: Record<string, string> | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

export function HomeCommunityPreview({ locale }: Props) {
  const t = useTranslations('home.community')
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const postsPromise = supabase
      .from('community_posts')
      .select('id, text, photos, likes_count, created_at, user_id, users(nickname, avatar_url)')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(6)

    const missionsPromise = supabase
      .from('mission_progress')
      .select('id, photo_url, completed_at, lp_earned, user_id, missions(title, courses(title)), users(nickname, avatar_url)')
      .not('photo_url', 'is', null)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(6)

    Promise.all([postsPromise, missionsPromise])
      .then(([postsRes, missionsRes]) => {
        const postItems: FeedItem[] = (postsRes.data || []).map((p: {
          id: string
          text: string | null
          photos: string[] | null
          likes_count: number | null
          created_at: string
          users?: { nickname?: string; avatar_url?: string | null } | null
        }) => ({
          kind: 'post',
          id: p.id,
          text: p.text,
          photoUrl: p.photos?.[0] ?? null,
          likesCount: p.likes_count || 0,
          createdAt: p.created_at,
          userNickname: p.users?.nickname || 'Anonymous',
          userAvatar: p.users?.avatar_url || null,
        }))

        const missionItems: FeedItem[] = (missionsRes.data || [])
          .filter((m: { photo_url: string | null }) => !!m.photo_url)
          .map((m: {
            id: string
            photo_url: string | null
            completed_at: string | null
            lp_earned: number | null
            users?: { nickname?: string; avatar_url?: string | null } | null
            missions?: { title?: Record<string, string>; courses?: { title?: Record<string, string> } } | null
          }) => ({
            kind: 'mission',
            id: m.id,
            photoUrl: m.photo_url as string,
            lpEarned: m.lp_earned || 0,
            createdAt: m.completed_at || '',
            userNickname: m.users?.nickname || 'Anonymous',
            userAvatar: m.users?.avatar_url || null,
            missionTitle: m.missions?.title ?? {},
            courseTitle: m.missions?.courses?.title ?? {},
          }))

        const merged = [...postItems, ...missionItems]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6)

        setItems(merged)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const getHref = (item: FeedItem) =>
    item.kind === 'mission' ? `/${locale}/memories` : `/${locale}/community`

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">
              <Sparkles className="w-6 h-6 text-mint-deep" />
              {t('title')}
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-bold">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/memories`}
            className="flex items-center gap-1 text-sm font-black text-mint-deep hover:text-sky transition-colors shrink-0 mt-1"
          >
            {t('more')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 로딩 스켈레톤 */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-2xl bg-slate-50 aspect-[4/5] animate-pulse" />
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && items.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-sm font-bold text-slate-400">{t('empty')}</p>
            <p className="text-xs text-slate-300">{t('beFirst')}</p>
          </div>
        )}

        {/* 통합 피드 그리드 */}
        {!loading && items.length > 0 && (
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
            {items.map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                href={getHref(item)}
                className="group shrink-0 w-[280px] md:w-auto snap-start bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {/* 이미지 */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-mint/30 to-blossom/30">
                  {item.photoUrl ? (
                    <Image
                      src={item.photoUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 280px, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      📖
                    </div>
                  )}

                  {/* 타입 배지 */}
                  <div className="absolute top-3 left-3">
                    {item.kind === 'mission' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint-deep/90 text-white text-[10px] font-black backdrop-blur-sm">
                        <Trophy className="w-3 h-3" />
                        {t('missionTag')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky/90 text-white text-[10px] font-black backdrop-blur-sm">
                        <MessageSquare className="w-3 h-3" />
                        {t('communityTag')}
                      </span>
                    )}
                  </div>
                </div>

                {/* 하단 정보 */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
                      {item.userAvatar ? (
                        <Image
                          src={item.userAvatar}
                          alt=""
                          width={28}
                          height={28}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400">
                          {item.userNickname[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate">
                      {item.userNickname}
                    </span>
                  </div>

                  {/* 내용 — 타입별 분기 */}
                  {item.kind === 'post' && item.text && (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                  )}
                  {item.kind === 'mission' && (
                    <p className="text-sm text-slate-600 font-semibold line-clamp-2 leading-relaxed">
                      🎯 {getI18n(item.courseTitle, locale)} · {getI18n(item.missionTitle, locale)}
                    </p>
                  )}

                  {/* 하단 메타 — 타입별 */}
                  {item.kind === 'post' ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{item.likesCount}</span>
                      <span>{t('likes')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-black text-mint-deep">
                      <span>⚡</span>
                      <span>+{item.lpEarned} LP</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* "MEMORIES 더 보기" CTA */}
        {!loading && items.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link
              href={`/${locale}/memories`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border-2 border-mint-deep text-mint-deep font-black text-sm hover:bg-mint-deep hover:text-white transition-colors"
            >
              🌟 {t('viewAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
