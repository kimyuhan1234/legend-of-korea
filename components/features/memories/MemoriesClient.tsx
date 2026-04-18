'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Image as ImageIcon, Award, Share2, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MissionDashboard } from '@/components/features/missions/MissionDashboard'
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges'
import { DigitalPassport } from '@/components/features/mypage/DigitalPassport'

interface Props {
  locale: string
}

interface PhotoItem {
  photoUrl: string
  completedAt: string
  missionTitle: Record<string, string>
  courseTitle: Record<string, string>
}

type Tab = 'dashboard' | 'photos' | 'achievements'

function getI18n(field: Record<string, string> | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

export function MemoriesClient({ locale }: Props) {
  const t = useTranslations('memories')
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!userId || tab !== 'photos') return
    setPhotosLoading(true)
    const supabase = createClient()
    supabase
      .from('mission_progress')
      .select('photo_url, completed_at, missions(title, courses(title))')
      .eq('user_id', userId)
      .not('photo_url', 'is', null)
      .order('completed_at', { ascending: false })
      .then(({ data }) => {
        const items: PhotoItem[] = (data || [])
          .filter((p: { photo_url: string | null }) => !!p.photo_url)
          .map((p: {
            photo_url: string | null
            completed_at: string | null
            missions?: { title?: Record<string, string>; courses?: { title?: Record<string, string> } } | null
          }) => ({
            photoUrl: p.photo_url as string,
            completedAt: p.completed_at || '',
            missionTitle: p.missions?.title ?? {},
            courseTitle: p.missions?.courses?.title ?? {},
          }))
        setPhotos(items)
        setPhotosLoading(false)
      })
  }, [userId, tab])

  const handleShare = async (item: PhotoItem) => {
    const text = `${getI18n(item.courseTitle, locale)} - ${getI18n(item.missionTitle, locale)}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Legend of Korea', text })
      } else {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // user cancelled
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center space-y-6">
        <div className="text-6xl">📖</div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 font-bold">{t('login.message')}</p>
        <Link href={`/${locale}/auth/login?next=/${locale}/memories`}>
          <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-br from-mint-deep to-sky text-white font-black hover:opacity-90 transition-opacity">
            Log In →
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      {/* 헤더 */}
      <div className="text-center mb-10">
        <div className="text-4xl mb-3">✨</div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-3">
          {t('title')}
        </h1>
        <p className="text-slate-500 font-bold">{t('subtitle')}</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 border-b border-slate-100 mb-8 overflow-x-auto scrollbar-hide">
        {([
          { id: 'dashboard' as Tab, Icon: LayoutDashboard, label: t('tab.dashboard') },
          { id: 'photos' as Tab, Icon: ImageIcon, label: t('tab.photos') },
          { id: 'achievements' as Tab, Icon: Award, label: t('tab.achievements') },
        ]).map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${
              tab === id
                ? 'border-mint-deep text-mint-deep'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* 대시보드 탭 */}
      {tab === 'dashboard' && <MissionDashboard userId={userId} locale={locale} />}

      {/* 포토갤러리 탭 */}
      {tab === 'photos' && (
        <div>
          {photosLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-bold">
              {t('photos.empty')}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(item)}
                  className="relative aspect-square rounded-2xl overflow-hidden group bg-slate-100"
                >
                  <Image
                    src={item.photoUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div className="text-white text-left">
                      <p className="text-xs font-black truncate">
                        {getI18n(item.courseTitle, locale)}
                      </p>
                      <p className="text-[10px] opacity-80">
                        {item.completedAt && new Date(item.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 업적 탭 */}
      {tab === 'achievements' && (
        <div className="space-y-6">
          <ProfileBadges userId={userId} />
          <DigitalPassport userId={userId} locale={locale} />
        </div>
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-2xl w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src={lightbox.photoUrl}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex items-center justify-between text-white gap-4">
              <div className="min-w-0">
                <p className="font-black truncate">{getI18n(lightbox.missionTitle, locale)}</p>
                <p className="text-sm opacity-80 truncate">
                  {getI18n(lightbox.courseTitle, locale)}
                  {lightbox.completedAt && ' · ' + new Date(lightbox.completedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleShare(lightbox)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mint-deep text-white font-bold text-sm shrink-0 hover:opacity-90"
              >
                <Share2 className="w-4 h-4" /> {t('photos.share')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
