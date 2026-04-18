'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowRight, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  locale: string
}

interface PostPreview {
  id: string
  text: string | null
  photos: string[]
  likesCount: number
  createdAt: string
  userNickname: string
  userAvatar: string | null
}

export function HomeCommunityPreview({ locale }: Props) {
  const t = useTranslations('home.community')
  const [posts, setPosts] = useState<PostPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('community_posts')
      .select('id, text, photos, likes_count, created_at, user_id, users(nickname, avatar_url)')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        const items: PostPreview[] = (data || []).map((p: {
          id: string
          text: string | null
          photos: string[] | null
          likes_count: number | null
          created_at: string
          users?: { nickname?: string; avatar_url?: string | null } | null
        }) => ({
          id: p.id,
          text: p.text,
          photos: p.photos || [],
          likesCount: p.likes_count || 0,
          createdAt: p.created_at,
          userNickname: p.users?.nickname || 'Anonymous',
          userAvatar: p.users?.avatar_url || null,
        }))
        setPosts(items)
        setLoading(false)
      })
  }, [])

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
            href={`/${locale}/community`}
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
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-sm font-bold text-slate-400">{t('empty')}</p>
            <p className="text-xs text-slate-300">{t('beFirst')}</p>
          </div>
        )}

        {/* 포스트 그리드 / 모바일 가로 스크롤 */}
        {!loading && posts.length > 0 && (
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/community`}
                className="group shrink-0 w-[280px] md:w-auto snap-start bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {/* 이미지 */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-mint/30 to-blossom/30">
                  {post.photos.length > 0 ? (
                    <Image
                      src={post.photos[0]}
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
                </div>

                {/* 하단 정보 */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 shrink-0">
                      {post.userAvatar ? (
                        <Image
                          src={post.userAvatar}
                          alt=""
                          width={28}
                          height={28}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400">
                          {post.userNickname[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate">
                      {post.userNickname}
                    </span>
                  </div>

                  {post.text && (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {post.text}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likesCount}</span>
                    <span>{t('likes')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* "모든 이야기 보기" CTA */}
        {!loading && posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link
              href={`/${locale}/community`}
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
