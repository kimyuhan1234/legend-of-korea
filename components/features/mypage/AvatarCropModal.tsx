'use client'

import { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'

interface Props {
  imageSrc: string
  onCancel: () => void
  onConfirm: (croppedBlob: Blob) => void
  locale?: string
}

type ModalLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const UI: Record<ModalLocale, { title: string; zoom: string; cancel: string; apply: string; processing: string }> = {
  ko: { title: '프로필 사진 자르기', zoom: '확대/축소', cancel: '취소', apply: '적용', processing: '처리 중...' },
  en: { title: 'Crop profile photo', zoom: 'Zoom', cancel: 'Cancel', apply: 'Apply', processing: 'Processing...' },
  ja: { title: 'プロフィール写真を切り抜く', zoom: 'ズーム', cancel: 'キャンセル', apply: '適用', processing: '処理中...' },
  'zh-CN': { title: '裁剪头像', zoom: '缩放', cancel: '取消', apply: '应用', processing: '处理中...' },
  'zh-TW': { title: '裁剪頭像', zoom: '縮放', cancel: '取消', apply: '套用', processing: '處理中...' },
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (e) => reject(e))
    img.crossOrigin = 'anonymous'
    img.src = url
  })
}

async function cropToBlob(imageSrc: string, crop: Area, outputSize = 400): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No canvas context')

  canvas.width = outputSize
  canvas.height = outputSize

  ctx.drawImage(
    image,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, outputSize, outputSize
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      0.85
    )
  })
}

export function AvatarCropModal({ imageSrc, onCancel, onConfirm, locale = 'ko' }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixelArea, setPixelArea] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const lc = (['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const).includes(locale as ModalLocale) ? (locale as ModalLocale) : 'en'
  const t = UI[lc]

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setPixelArea(areaPx)
  }, [])

  const handleApply = async () => {
    if (!pixelArea || processing) return
    setProcessing(true)
    try {
      const blob = await cropToBlob(imageSrc, pixelArea, 400)
      onConfirm(blob)
    } catch (err) {
      console.error('Crop failed:', err)
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-mist">
          <h3 className="text-base font-black text-[#111]">{t.title}</h3>
        </div>

        {/* 크롭 영역 */}
        <div className="relative bg-slate-900 aspect-square">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* 줌 슬라이더 */}
        <div className="px-5 py-4 border-t border-mist">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone shrink-0">{t.zoom}</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-mint-deep"
            />
            <span className="text-xs font-mono text-mint-deep w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t border-mist bg-cloud/30">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 py-2.5 rounded-full bg-white border border-mist text-slate font-bold text-sm hover:bg-cloud transition-colors disabled:opacity-60"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={processing || !pixelArea}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-br from-mint to-blossom text-ink font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {processing ? t.processing : t.apply}
          </button>
        </div>
      </div>
    </div>
  )
}
