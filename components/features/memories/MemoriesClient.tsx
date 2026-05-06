'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Loader2, Share2, X, Trash2, Heart, MessageCircle, Camera, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { CommunityFeed } from '@/components/features/community/CommunityFeed'
import { MissionDashboard } from '@/components/features/missions/MissionDashboard'
import { Leaderboard } from '@/components/features/community/Leaderboard'
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges'
import { DigitalPassport } from '@/components/features/mypage/DigitalPassport'
import { LegendShop } from './LegendShop'
import { useModalA11y } from '@/hooks/useModalA11y'
import { RetroFilterCanvas } from '@/components/features/camera/RetroFilterCanvas'
import { RETRO_FILTERS, applyFilterToFile } from '@/lib/camera/filters'

interface Props {
  locale: string
}

interface PhotoItem {
  postId: string
  photoUrl: string
  caption: string
  createdAt: string
  likesCount: number
  commentsCount: number
  liked: boolean
  missionTitle: Record<string, string> | null
  courseTitle: Record<string, string> | null
}

interface CommentItem {
  id: string
  text: string
  created_at: string
  user?: { nickname?: string; avatar_url?: string | null }
}

const PHOTO_UI: Record<string, {
  upload: string
  delete: string
  deleteConfirm: string
  deleted: string
  failed: string
  uploaded: string
  caption: string
  captionPlaceholder: string
  upload_cta: string
  commentPlaceholder: string
  commentEmpty: string
  commentSend: string
  likes: string
  comments: string
}> = {
  ko: {
    upload: '📸 사진 올리기',  delete: '삭제',  deleteConfirm: '이 사진을 삭제할까요?',  deleted: '사진이 삭제되었습니다',  failed: '처리 실패',
    uploaded: '사진이 올라갔습니다',  caption: '캡션 (선택)',  captionPlaceholder: '사진에 대한 이야기를 들려주세요…',
    upload_cta: '올리기',  commentPlaceholder: '댓글을 남겨주세요',  commentEmpty: '아직 댓글이 없어요',  commentSend: '전송',
    likes: '좋아요',  comments: '댓글',
  },
  ja: {
    upload: '📸 写真を投稿',  delete: '削除',  deleteConfirm: 'この写真を削除しますか?',  deleted: '写真を削除しました',  failed: '処理に失敗しました',
    uploaded: '写真を投稿しました',  caption: 'キャプション (任意)',  captionPlaceholder: '写真についてのストーリーを…',
    upload_cta: '投稿',  commentPlaceholder: 'コメントを残す',  commentEmpty: 'まだコメントがありません',  commentSend: '送信',
    likes: 'いいね',  comments: 'コメント',
  },
  en: {
    upload: '📸 Upload Photo',  delete: 'Delete',  deleteConfirm: 'Delete this photo?',  deleted: 'Photo deleted',  failed: 'Action failed',
    uploaded: 'Photo uploaded',  caption: 'Caption (optional)',  captionPlaceholder: 'Share the story behind this photo…',
    upload_cta: 'Upload',  commentPlaceholder: 'Leave a comment',  commentEmpty: 'No comments yet',  commentSend: 'Send',
    likes: 'Likes',  comments: 'Comments',
  },
  'zh-CN': {
    upload: '📸 上传照片',  delete: '删除',  deleteConfirm: '确定删除此照片?',  deleted: '照片已删除',  failed: '操作失败',
    uploaded: '照片已上传',  caption: '标题 (可选)',  captionPlaceholder: '分享这张照片背后的故事…',
    upload_cta: '上传',  commentPlaceholder: '留下评论',  commentEmpty: '暂无评论',  commentSend: '发送',
    likes: '点赞',  comments: '评论',
  },
  'zh-TW': {
    upload: '📸 上傳照片',  delete: '刪除',  deleteConfirm: '確定刪除此照片?',  deleted: '照片已刪除',  failed: '操作失敗',
    uploaded: '照片已上傳',  caption: '標題 (可選)',  captionPlaceholder: '分享這張照片背後的故事…',
    upload_cta: '上傳',  commentPlaceholder: '留下評論',  commentEmpty: '暫無評論',  commentSend: '發送',
    likes: '點讚',  comments: '評論',
  },
}

type Tab = 'feed' | 'dashboard' | 'ranking' | 'achievements' | 'photos' | 'shop'

const VALID_TABS: readonly Tab[] = ['feed', 'dashboard', 'ranking', 'achievements', 'photos', 'shop'] as const

function parseTabParam(raw: string | null): Tab {
  if (raw && (VALID_TABS as readonly string[]).includes(raw)) return raw as Tab
  return 'feed'
}

function getI18n(field: Record<string, string> | null | undefined, locale: string): string {
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
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  // ?tab=shop 등 URL query 로 초기 탭 결정 — /shop 라우트가 /memories?tab=shop 로 redirect
  const [tab, setTab] = useState<Tab>(() => parseTabParam(searchParams.get('tab')))
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [lightbox, setLightbox] = useState<PhotoItem | null>(null)
  // [E] 카드 댓글 아이콘 클릭 시 lightbox 열린 후 입력란 자동 포커스 트리거
  const [pendingFocusComment, setPendingFocusComment] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthLoading(false)
    })
  }, [])

  const photoUi = PHOTO_UI[locale] ?? PHOTO_UI.ko

  // ── 포토 목록 로드 (/api/memories/photos) ────────────────
  const loadPhotos = useCallback(async () => {
    setPhotosLoading(true)
    try {
      const res = await fetch('/api/memories/photos')
      const data = await res.json()
      if (res.ok) setPhotos((data.photos ?? []) as PhotoItem[])
    } finally {
      setPhotosLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!userId || tab !== 'photos') return
    loadPhotos()
  }, [userId, tab, loadPhotos])

  // ── Photo 액션 상태 ──────────────────────────────────────
  const [photoMutating, setPhotoMutating] = useState(false)
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null)
  const [uploadCaption, setUploadCaption] = useState('')
  const uploadInputRef = useRef<HTMLInputElement>(null)

  // a11y: ESC + focus trap + previous active 복원 (업로드 필터 / lightbox)
  const uploadModalRef = useModalA11y<HTMLDivElement>(
    pendingUploadFile !== null,
    () => setPendingUploadFile(null),
  )
  const lightboxRef = useModalA11y<HTMLDivElement>(
    lightbox !== null,
    () => setLightbox(null),
  )

  // 댓글
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')
  const [sendingComment, setSendingComment] = useState(false)

  // 라이트박스 열릴 때 댓글 로드
  useEffect(() => {
    if (!lightbox) {
      setComments([])
      setNewCommentText('')
      return
    }
    let cancelled = false
    setCommentsLoading(true)
    fetch(`/api/community/posts/${lightbox.postId}/comments`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (cancelled) return
        // [A] API 응답이 { success, comments: [...] } 객체 — data.comments 추출 (직전 버그 fix)
        const list = Array.isArray(data?.comments) ? data.comments : Array.isArray(data) ? data : []
        setComments(list)
      })
      .catch(() => { if (!cancelled) setComments([]) })
      .finally(() => { if (!cancelled) setCommentsLoading(false) })
    return () => { cancelled = true }
    // [B] 의존성을 postId 만 — lightbox.commentsCount / liked 등 변경 시 refetch 안 함
    //     (방금 추가한 댓글이 빈 list 로 덮어써지는 현상 차단)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox?.postId])

  // [E] lightbox 열린 후 댓글 입력란 자동 포커스 (카드 댓글 아이콘 클릭 시 트리거)
  useEffect(() => {
    if (!pendingFocusComment || !lightbox) return
    // setTimeout 0 — DOM 렌더 완료 후 focus
    const id = setTimeout(() => {
      commentInputRef.current?.focus()
      setPendingFocusComment(false)
    }, 50)
    return () => clearTimeout(id)
  }, [pendingFocusComment, lightbox])

  // 업로드 버튼 클릭 → 파일 선택 → 필터 단계
  const handleUploadClick = () => uploadInputRef.current?.click()

  const handleUploadPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPendingUploadFile(file)
    setUploadCaption('')
  }

  const submitUpload = async (filteredFile: File) => {
    setPhotoMutating(true)
    try {
      const fd = new FormData()
      fd.append('file', filteredFile)
      fd.append('caption', uploadCaption.trim())
      const res = await fetch('/api/memories/photos', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.postId) throw new Error('upload_failed')
      toast({ title: photoUi.uploaded })
      setPendingUploadFile(null)
      setUploadCaption('')
      await loadPhotos()
    } catch {
      toast({ variant: 'destructive', title: photoUi.failed })
    } finally {
      setPhotoMutating(false)
    }
  }

  const handleFilterApply = async (filterId: string) => {
    if (!pendingUploadFile) return
    try {
      const filter = RETRO_FILTERS.find((f) => f.id === filterId) ?? RETRO_FILTERS[0]
      const processed = await applyFilterToFile(pendingUploadFile, filter)
      await submitUpload(processed)
    } catch {
      await submitUpload(pendingUploadFile) // 필터 실패 시 원본
    }
  }

  const handleFilterSkip = async () => {
    if (!pendingUploadFile) return
    await submitUpload(pendingUploadFile)
  }

  const handleFilterCancel = () => {
    setPendingUploadFile(null)
    setUploadCaption('')
  }

  // 삭제 (community post 삭제)
  const handleDelete = async (item: PhotoItem) => {
    if (!window.confirm(photoUi.deleteConfirm)) return
    setPhotoMutating(true)
    try {
      const res = await fetch(`/api/community/posts/${item.postId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete_failed')
      setPhotos((prev) => prev.filter((p) => p.postId !== item.postId))
      setLightbox(null)
      toast({ title: photoUi.deleted })
    } catch {
      toast({ variant: 'destructive', title: photoUi.failed })
    } finally {
      setPhotoMutating(false)
    }
  }

  // 좋아요 토글 — optimistic 후 server-truth 로 보정 (카운트 무한 증가 차단).
  const handleLike = async (item: PhotoItem) => {
    const wasLiked = item.liked
    const optimistic = (p: PhotoItem) =>
      p.postId === item.postId
        ? { ...p, liked: !wasLiked, likesCount: p.likesCount + (wasLiked ? -1 : 1) }
        : p
    setPhotos((prev) => prev.map(optimistic))
    if (lightbox?.postId === item.postId) setLightbox(optimistic(lightbox))
    try {
      const res = await fetch(`/api/community/posts/${item.postId}/like`, { method: 'POST' })
      if (!res.ok) throw new Error('like_failed')
      const data = await res.json() as { action?: 'liked' | 'unliked'; likes_count?: number }
      // server-truth 적용 — 트리거가 동기화한 likes_count + action 으로 정정
      const truth = (p: PhotoItem) =>
        p.postId === item.postId
          ? {
              ...p,
              liked: data.action === 'liked',
              likesCount: typeof data.likes_count === 'number' ? data.likes_count : p.likesCount,
            }
          : p
      setPhotos((prev) => prev.map(truth))
      if (lightbox?.postId === item.postId) setLightbox((prev) => (prev ? truth(prev) : prev))
    } catch {
      // 롤백
      const rollback = (p: PhotoItem) =>
        p.postId === item.postId
          ? { ...p, liked: wasLiked, likesCount: p.likesCount + (wasLiked ? 1 : -1) }
          : p
      setPhotos((prev) => prev.map(rollback))
      if (lightbox?.postId === item.postId) setLightbox((prev) => (prev ? rollback(prev) : prev))
      toast({ variant: 'destructive', title: photoUi.failed })
    }
  }

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!lightbox || !newCommentText.trim() || sendingComment) return
    setSendingComment(true)
    try {
      const res = await fetch(`/api/community/posts/${lightbox.postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newCommentText.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error('comment_failed')
      const newItem = (data?.comment ?? data) as CommentItem
      setComments((prev) => [...prev, newItem])
      setNewCommentText('')
      // 카운트 업데이트
      setPhotos((prev) => prev.map((p) =>
        p.postId === lightbox.postId ? { ...p, commentsCount: p.commentsCount + 1 } : p,
      ))
      setLightbox({ ...lightbox, commentsCount: lightbox.commentsCount + 1 })
    } catch {
      toast({ variant: 'destructive', title: photoUi.failed })
    } finally {
      setSendingComment(false)
    }
  }

  const handleShare = async (item: PhotoItem) => {
    const text = `${getI18n(item.courseTitle, locale)} - ${getI18n(item.missionTitle, locale)}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Clouds with you', text })
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
                : 'border-transparent text-slate-500 hover:text-slate-600'
            }`}
          >
            <span className="text-base">{tb.icon}</span>
            <span>{t(tb.labelKey)}</span>
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
          {/* 상단: 업로드 버튼 */}
          <div className="flex justify-end mb-5">
            <button
              onClick={handleUploadClick}
              disabled={photoMutating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-mint-deep text-white font-black text-sm hover:opacity-90 disabled:opacity-50 shadow-md"
            >
              <Camera className="w-4 h-4" />
              {photoUi.upload}
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={handleUploadPick}
            />
          </div>

          {photosLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold">
              {t('photos.empty')}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((item) => (
                <button
                  key={item.postId}
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
                  {/* 하단 좋아요/댓글 카운트 오버레이 — [D]/[E] 인스타 패턴: 각 아이콘이 독립 button.
                      e.stopPropagation() 으로 부모 button (lightbox 열기) 차단. */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-10 p-2 flex items-end justify-between text-white">
                    <div className="flex gap-3 text-xs font-black drop-shadow">
                      {/* [D] 카드 안 좋아요 직접 토글 */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleLike(item) }}
                        aria-label={photoUi.likes}
                        className="inline-flex items-center gap-1 hover:scale-110 transition-transform"
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.liked ? 'fill-red-500 text-red-500' : ''}`} />
                        {item.likesCount}
                      </button>
                      {/* [E] 카드 안 댓글 → lightbox 열고 입력란 포커스 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLightbox(item)
                          setPendingFocusComment(true)
                        }}
                        aria-label={photoUi.comments}
                        className="inline-flex items-center gap-1 hover:scale-110 transition-transform"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {item.commentsCount}
                      </button>
                    </div>
                    <span className="text-[10px] opacity-70">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 업로드 필터 모달 */}
      {pendingUploadFile && (
        <div
          ref={uploadModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="memories-upload-title"
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 my-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 id="memories-upload-title" className="text-lg font-black text-slate-800">{photoUi.upload}</h3>
              <button onClick={handleFilterCancel} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <RetroFilterCanvas
              imageFile={pendingUploadFile}
              onApply={handleFilterApply}
              onSkip={handleFilterSkip}
              onCancel={handleFilterCancel}
              locale={locale}
            />

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{photoUi.caption}</label>
              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value.slice(0, 500))}
                placeholder={photoUi.captionPlaceholder}
                rows={2}
                maxLength={500}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-mint-deep"
              />
            </div>

            {photoMutating && (
              <div className="flex items-center justify-center text-mint-deep text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {photoUi.upload_cta}…
              </div>
            )}
          </div>
        </div>
      )}

      {/* 탭 6: 전설 상점 (Day 4 디자인 B) */}
      {!needsAuth && tab === 'shop' && userId && (
        <LegendShop locale={locale} />
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="photo viewer"
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
            {/* 캡션 + 미션 메타 */}
            <div className="text-white space-y-1">
              {lightbox.caption && lightbox.caption !== '📸' && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{lightbox.caption}</p>
              )}
              {(lightbox.missionTitle || lightbox.courseTitle) && (
                <p className="text-xs opacity-70">
                  {getI18n(lightbox.courseTitle, locale)}
                  {lightbox.missionTitle && ' · ' + getI18n(lightbox.missionTitle, locale)}
                </p>
              )}
              <p className="text-[11px] opacity-50">
                {new Date(lightbox.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 액션 바: 좋아요 / 댓글 수 / 공유 / 삭제 */}
            <div className="flex items-center justify-between gap-3 border-y border-white/10 py-3">
              <div className="flex items-center gap-4 text-white">
                <button
                  onClick={() => handleLike(lightbox)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold hover:opacity-80"
                  aria-label={photoUi.likes}
                >
                  <Heart className={`w-5 h-5 ${lightbox.liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {lightbox.likesCount}
                </button>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold">
                  <MessageCircle className="w-5 h-5" />
                  {lightbox.commentsCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(lightbox)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold"
                  aria-label={t('photos.share')}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(lightbox)}
                  disabled={photoMutating}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/70 hover:bg-red-500 text-white text-sm font-bold disabled:opacity-50"
                  aria-label={photoUi.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 댓글 */}
            <div className="bg-white/5 rounded-2xl p-3 max-h-60 overflow-y-auto space-y-2">
              {commentsLoading ? (
                <div className="flex items-center justify-center py-4 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-white/50 text-center py-2">{photoUi.commentEmpty}</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="text-xs text-white">
                    <span className="font-black">{c.user?.nickname ?? 'User'}</span>
                    <span className="ml-2 opacity-80 whitespace-pre-wrap">{c.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* 댓글 입력 */}
            <div className="flex items-center gap-2">
              <input
                ref={commentInputRef}
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value.slice(0, 300))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleCommentSubmit()
                  }
                }}
                placeholder={photoUi.commentPlaceholder}
                maxLength={300}
                className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15"
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newCommentText.trim() || sendingComment}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-mint-deep text-white hover:opacity-90 disabled:opacity-50"
                aria-label={photoUi.commentSend}
              >
                {sendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
