'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Share2, X, PenLine } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CommunityFeed } from '@/components/features/community/CommunityFeed'
import { MissionDashboard } from '@/components/features/missions/MissionDashboard'
import { Leaderboard } from '@/components/features/community/Leaderboard'
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges'
import { DigitalPassport } from '@/components/features/mypage/DigitalPassport'
import { QuestPartySection } from '@/components/features/quest/QuestPartySection'
import { ZepMeetingButton } from '@/components/features/quest/ZepMeetingButton'
import { courses } from '@/lib/data/courses'

interface Props {
  locale: string
}

interface PhotoItem {
  photoUrl: string
  completedAt: string
  missionTitle: Record<string, string>
  courseTitle: Record<string, string>
}

type Tab = 'feed' | 'dashboard' | 'ranking' | 'achievements' | 'photos' | 'together'

function getI18n(field: Record<string, string> | undefined, locale: string): string {
  if (!field) return ''
  return field[locale] || field.en || field.ko || ''
}

const TABS: { id: Tab; icon: string; labelKey: string; requiresAuth: boolean }[] = [
  { id: 'feed', icon: '📸', labelKey: 'tab.feed', requiresAuth: true },
  { id: 'dashboard', icon: '🎮', labelKey: 'tab.dashboard', requiresAuth: true },
  { id: 'ranking', icon: '🏆', labelKey: 'tab.ranking', requiresAuth: true },
  { id: 'achievements', icon: '🛂', labelKey: 'tab.achievements', requiresAuth: true },
  { id: 'photos', icon: '📷', labelKey: 'tab.photos', requiresAuth: true },
  { id: 'together', icon: '👥', labelKey: 'tab.together', requiresAuth: true },
]

export function MemoriesClient({ locale }: Props) {
  const t = useTranslations('memories')
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('feed')
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

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

  const LoginPrompt = () => (
    <div className="text-center py-20 space-y-4">
      <div className="text-5xl">🔒</div>
      <p className="text-slate-500 font-bold">{t('login.message')}</p>
      <Link href={`/${locale}/auth/login?next=/${locale}/memories`}>
        <button className="px-6 py-3 rounded-2xl bg-gradient-to-br from-mint-deep to-sky text-white font-black hover:opacity-90 transition-opacity">
          Log In →
        </button>
      </Link>
    </div>
  )

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  const currentTab = TABS.find((x) => x.id === tab)
  const needsAuth = currentTab?.requiresAuth && !userId

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
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-2 px-4 md:px-5 py-3 font-bold text-sm transition-colors border-b-2 whitespace-nowrap shrink-0 ${
              tab === tb.id
                ? 'border-mint-deep text-mint-deep'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-base">{tb.icon}</span>
            <span className="hidden md:inline">{t(tb.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* 로그인 필요 탭 */}
      {needsAuth && <LoginPrompt />}

      {/* 탭 1: 피드 */}
      {!needsAuth && tab === 'feed' && (
        <div>
          <div className="flex justify-end mb-4">
            <Link
              href={`/${locale}/community/write`}
              className="inline-flex items-center gap-1.5 bg-mint-deep text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-4 h-4" /> {t('feed.write')}
            </Link>
          </div>
          <CommunityFeed locale={locale} />
        </div>
      )}

      {/* 탭 2: 대시보드 */}
      {!needsAuth && tab === 'dashboard' && userId && (
        <MissionDashboard userId={userId} locale={locale} />
      )}

      {/* 탭 3: 랭킹 */}
      {!needsAuth && tab === 'ranking' && <Leaderboard locale={locale} />}

      {/* 탭 4: 업적 */}
      {!needsAuth && tab === 'achievements' && userId && (
        <div className="space-y-6">
          <ProfileBadges userId={userId} />
          <DigitalPassport userId={userId} locale={locale} />
        </div>
      )}

      {/* 탭 5: 포토갤러리 */}
      {!needsAuth && tab === 'photos' && userId && (
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

      {/* 탭 6: 함께하기 */}
      {!needsAuth && tab === 'together' && userId && (
        <div className="space-y-8">
          {/* ZEP 메타버스 */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
            <h4 className="text-lg font-black flex items-center gap-2 mb-2">
              🌐 {t('together.zepTitle')}
            </h4>
            <p className="text-sm text-slate-500 mb-4">{t('together.zepDesc')}</p>

            {/* 코스 선택 */}
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 mb-4 text-sm font-bold text-slate-700 bg-white"
            >
              <option value="">{t('together.selectCourse')}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {getI18n(c.title, locale)}
                </option>
              ))}
            </select>

            {selectedCourseId ? (
              <ZepMeetingButton
                courseId={courses.find((c) => c.id === selectedCourseId)?.region ?? ''}
                hasPurchased={true}
                locale={locale}
              />
            ) : (
              <p className="text-center text-sm text-slate-400 py-4">
                {t('together.selectCourseHint')}
              </p>
            )}
          </div>

          {/* Quest Party */}
          <div className="bg-gradient-to-r from-mint/10 to-sky/10 rounded-2xl p-6 border border-mint/20">
            <h4 className="text-lg font-black flex items-center gap-2 mb-2">
              👥 {t('together.partyTitle')}
            </h4>
            <p className="text-sm text-slate-500 mb-4">{t('together.partyDesc')}</p>

            {selectedCourseId ? (
              <QuestPartySection
                courseId={selectedCourseId}
                isLoggedIn={!!userId}
                currentUserId={userId}
                locale={locale}
              />
            ) : (
              <p className="text-center text-sm text-slate-400 py-8">
                {t('together.selectCourseHint')}
              </p>
            )}
          </div>
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
