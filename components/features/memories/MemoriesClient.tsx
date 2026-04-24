'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Share2, X, Trash2, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { CommunityFeed } from '@/components/features/community/CommunityFeed'
import { MissionDashboard } from '@/components/features/missions/MissionDashboard'
import { Leaderboard } from '@/components/features/community/Leaderboard'
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges'
import { DigitalPassport } from '@/components/features/mypage/DigitalPassport'
import { LegendShop } from './LegendShop'

interface Props {
  locale: string
}

interface PhotoItem {
  missionId: string
  photoUrl: string
  completedAt: string
  missionTitle: Record<string, string>
  courseTitle: Record<string, string>
}

const PHOTO_UI: Record<string, { delete: string; replace: string; deleteConfirm: string; deleted: string; replaced: string; failed: string }> = {
  ko:      { delete: '삭제',       replace: '교체',       deleteConfirm: '이 사진을 삭제할까요?',        deleted: '사진이 삭제되었습니다',       replaced: '사진이 교체되었습니다',       failed: '처리 실패' },
  ja:      { delete: '削除',       replace: '差し替え',   deleteConfirm: 'この写真を削除しますか?',      deleted: '写真を削除しました',           replaced: '写真を差し替えました',         failed: '処理に失敗しました' },
  en:      { delete: 'Delete',     replace: 'Replace',    deleteConfirm: 'Delete this photo?',           deleted: 'Photo deleted',                replaced: 'Photo replaced',               failed: 'Action failed' },
  'zh-CN': { delete: '删除',       replace: '替换',       deleteConfirm: '确定删除此照片?',              deleted: '照片已删除',                    replaced: '照片已替换',                   failed: '操作失败' },
  'zh-TW': { delete: '刪除',       replace: '替換',       deleteConfirm: '確定刪除此照片?',              deleted: '照片已刪除',                    replaced: '照片已替換',                   failed: '操作失敗' },
}

type Tab = 'feed' | 'dashboard' | 'ranking' | 'achievements' | 'photos' | 'shop'

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
  { id: 'shop', icon: '🛒', labelKey: 'tab.shop', requiresAuth: true },
]

export function MemoriesClient({ locale }: Props) {
  const t = useTranslations('memories')
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('feed')
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
      .select('mission_id, photo_url, completed_at, missions(title, courses(title))')
      .eq('user_id', userId)
      .not('photo_url', 'is', null)
      .order('completed_at', { ascending: false })
      .then(({ data }) => {
        const items: PhotoItem[] = ((data || []) as Array<{
          mission_id: string
          photo_url: string | null
          completed_at: string | null
          missions?: { title?: Record<string, string>; courses?: { title?: Record<string, string> } } | null
        }>)
          .filter((p) => !!p.photo_url)
          .map((p) => ({
            missionId: p.mission_id,
            photoUrl: p.photo_url as string,
            completedAt: p.completed_at || '',
            missionTitle: p.missions?.title ?? {},
            courseTitle: p.missions?.courses?.title ?? {},
          }))
        setPhotos(items)
        setPhotosLoading(false)
      })
  }, [userId, tab])

  // ── Photo 삭제 / 교체 ─────────────────────────────────────
  const [photoMutating, setPhotoMutating] = useState(false)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  const photoUi = PHOTO_UI[locale] ?? PHOTO_UI.ko

  const handleDelete = async (item: PhotoItem) => {
    if (!window.confirm(photoUi.deleteConfirm)) return
    setPhotoMutating(true)
    try {
      const res = await fetch('/api/memories/photo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: item.missionId }),
      })
      if (!res.ok) throw new Error('delete_failed')
      setPhotos((prev) => prev.filter((p) => p.missionId !== item.missionId))
      setLightbox(null)
      toast({ title: photoUi.deleted })
    } catch {
      toast({ variant: 'destructive', title: photoUi.failed })
    } finally {
      setPhotoMutating(false)
    }
  }

  const handleReplaceClick = () => {
    replaceInputRef.current?.click()
  }

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !lightbox) return

    setPhotoMutating(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('missionId', lightbox.missionId)
      const res = await fetch('/api/memories/photo', { method: 'PATCH', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error('replace_failed')
      setPhotos((prev) => prev.map((p) =>
        p.missionId === lightbox.missionId ? { ...p, photoUrl: data.url } : p,
      ))
      setLightbox({ ...lightbox, photoUrl: data.url })
      toast({ title: photoUi.replaced })
    } catch {
      toast({ variant: 'destructive', title: photoUi.failed })
    } finally {
      setPhotoMutating(false)
    }
  }

  const handleShare = async (item: PhotoItem) => {
    const text = `${getI18n(item.courseTitle, locale)} - ${getI18n(item.missionTitle, locale)}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Cloud with you', text })
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

      {/* 탭 1: 피드 — 글쓰기 버튼은 CommunityFeed 내부에서 렌더 (중복 제거) */}
      {!needsAuth && tab === 'feed' && (
        <CommunityFeed locale={locale} />
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

      {/* 탭 6: 전설 상점 (Day 4 디자인 B) */}
      {!needsAuth && tab === 'shop' && userId && (
        <LegendShop locale={locale} />
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
            <div className="flex items-center justify-between text-white gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <p className="font-black truncate">{getI18n(lightbox.missionTitle, locale)}</p>
                <p className="text-sm opacity-80 truncate">
                  {getI18n(lightbox.courseTitle, locale)}
                  {lightbox.completedAt && ' · ' + new Date(lightbox.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleReplaceClick}
                  disabled={photoMutating}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm disabled:opacity-50"
                  aria-label={photoUi.replace}
                >
                  <RefreshCw className="w-4 h-4" /> {photoUi.replace}
                </button>
                <button
                  onClick={() => handleDelete(lightbox)}
                  disabled={photoMutating}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-bold text-sm disabled:opacity-50"
                  aria-label={photoUi.delete}
                >
                  <Trash2 className="w-4 h-4" /> {photoUi.delete}
                </button>
                <button
                  onClick={() => handleShare(lightbox)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mint-deep text-white font-bold text-sm hover:opacity-90"
                >
                  <Share2 className="w-4 h-4" /> {t('photos.share')}
                </button>
              </div>
            </div>
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={handleReplaceFile}
            />
          </div>
        </div>
      )}
    </div>
  )
}
