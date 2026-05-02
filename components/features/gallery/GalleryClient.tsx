'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Lock, X, Loader2 } from 'lucide-react'
import type { GalleryPhoto } from '@/app/api/gallery/list/route'

interface GalleryClientProps {
  locale: string
  initialHasPass: boolean
}

const UI: Record<string, {
  passRequired: string; subscribeCta: string; download: string; downloading: string
  empty: string; lockTitle: string; lockBody: string; photoCount: (n: number) => string
  close: string
}> = {
  ko: {
    passRequired: '🔒 PASS 구독 시 무료 다운로드',
    subscribeCta: 'PASS 구독하기',
    download: '다운로드',
    downloading: '다운로드 중...',
    empty: '아직 업로드된 사진이 없습니다.',
    lockTitle: 'PASS 전용',
    lockBody: 'PASS 구독 시 고화질 원본 다운로드 가능',
    photoCount: (n) => `${n}장의 사진`,
    close: '닫기',
  },
  ja: {
    passRequired: '🔒 PASSサブスクでダウンロード無料',
    subscribeCta: 'PASSを購入する',
    download: 'ダウンロード',
    downloading: 'ダウンロード中...',
    empty: 'まだ写真がありません。',
    lockTitle: 'PASS限定',
    lockBody: 'PASSに登録すると高画質オリジナルをダウンロード可能',
    photoCount: (n) => `${n}枚の写真`,
    close: '閉じる',
  },
  en: {
    passRequired: '🔒 Free download with PASS subscription',
    subscribeCta: 'Get a PASS',
    download: 'Download',
    downloading: 'Downloading...',
    empty: 'No photos uploaded yet.',
    lockTitle: 'PASS Only',
    lockBody: 'Subscribe to PASS to download high-quality originals',
    photoCount: (n) => `${n} photos`,
    close: 'Close',
  },
  'zh-CN': {
    passRequired: '🔒 PASS订阅即可免费下载',
    subscribeCta: '订阅PASS',
    download: '下载',
    downloading: '下载中...',
    empty: '暂无照片。',
    lockTitle: '仅限PASS',
    lockBody: '订阅PASS即可下载高清原图',
    photoCount: (n) => `${n}张照片`,
    close: '关闭',
  },
  'zh-TW': {
    passRequired: '🔒 訂閱PASS即可免費下載',
    subscribeCta: '訂閱PASS',
    download: '下載',
    downloading: '下載中...',
    empty: '目前尚無照片。',
    lockTitle: '僅限PASS',
    lockBody: '訂閱PASS即可下載高畫質原圖',
    photoCount: (n) => `${n}張照片`,
    close: '關閉',
  },
}

export function GalleryClient({ locale, initialHasPass }: GalleryClientProps) {
  const ui = UI[locale] ?? UI.en
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [hasPass, setHasPass] = useState(initialHasPass)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetch('/api/gallery/list')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setPhotos(data.photos ?? [])
          setHasPass(data.hasPass ?? false)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (photo: GalleryPhoto) => {
    if (!hasPass || downloading) return
    setDownloading(true)
    try {
      const res = await fetch(`/api/gallery/download?file=${encodeURIComponent(photo.name)}`)
      if (!res.ok) return
      const { url } = await res.json()
      const a = document.createElement('a')
      a.href = url
      a.download = photo.name
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  if (photos.length === 0) {
    return <p className="text-center text-stone py-20">{ui.empty}</p>
  }

  return (
    <>
      {/* 비구독자 안내 배너 */}
      {!hasPass && (
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4
                        bg-blossom-light/40 border border-blossom rounded-2xl px-6 py-4">
          <p className="font-bold text-ink text-sm">{ui.passRequired}</p>
          <Link
            href={`/${locale}/pass`}
            className="shrink-0 px-5 py-2.5 rounded-full bg-blossom-deep text-white text-sm font-bold
                       hover:opacity-90 transition-opacity"
          >
            {ui.subscribeCta}
          </Link>
        </div>
      )}

      {/* 사진 수 */}
      <p className="text-xs text-stone mb-4">{ui.photoCount(photos.length)}</p>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((photo) => (
          <div key={photo.name} className="relative group aspect-square rounded-2xl overflow-hidden bg-mist">
            {hasPass && photo.signedUrl ? (
              /* 구독자: 실제 사진 */
              <>
                <button
                  type="button"
                  onClick={() => setLightbox(photo)}
                  className="absolute inset-0 w-full h-full"
                  aria-label={photo.name}
                >
                  <Image
                    src={photo.signedUrl}
                    alt={photo.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </button>
                {/* 호버 오버레이 — 다운로드 버튼 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
                                flex items-end justify-end p-3 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDownload(photo) }}
                    disabled={downloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-ink text-xs font-bold
                               hover:bg-snow transition-colors disabled:opacity-60"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloading ? ui.downloading : ui.download}
                  </button>
                </div>
              </>
            ) : (
              /* 비구독자: 블러 플레이스홀더 */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-mist to-stone/20" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5 text-stone" />
                  </div>
                  <p className="text-xs font-bold text-ink">{ui.lockTitle}</p>
                  <p className="text-[10px] text-stone leading-snug">{ui.lockBody}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 라이트박스 (구독자 전용) */}
      {lightbox && hasPass && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                       text-white flex items-center justify-center"
            aria-label={ui.close}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-3xl w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
              {lightbox.signedUrl && (
                <Image
                  src={lightbox.signedUrl}
                  alt={lightbox.name}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-sm truncate">{lightbox.name}</p>
              <button
                type="button"
                onClick={() => handleDownload(lightbox)}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-mint-deep text-white text-sm font-bold
                           hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? ui.downloading : ui.download}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
