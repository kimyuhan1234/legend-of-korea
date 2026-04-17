export interface RetroFilter {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  icon: string
  cssFilter: string
  overlay?: { color: string; opacity: number; blendMode: GlobalCompositeOperation }
  vignette?: boolean
  grain?: boolean
}

export const RETRO_FILTERS: RetroFilter[] = [
  {
    id: 'original',
    name: { ko: '원본', en: 'Original', ja: 'オリジナル', 'zh-CN': '原图', 'zh-TW': '原圖' },
    description: { ko: '필터 없음', en: 'No filter', ja: 'フィルターなし', 'zh-CN': '无滤镜', 'zh-TW': '無濾鏡' },
    icon: '📷',
    cssFilter: 'none',
  },
  {
    id: 'hanbok',
    name: { ko: '한복', en: 'Hanbok', ja: '韓服', 'zh-CN': '韩服', 'zh-TW': '韓服' },
    description: { ko: '따뜻한 한국 전통 색감', en: 'Warm Korean traditional tone', ja: '温かい韓国伝統色', 'zh-CN': '温暖的韩国传统色调', 'zh-TW': '溫暖的韓國傳統色調' },
    icon: '🎎',
    cssFilter: 'saturate(1.3) contrast(1.1) brightness(1.05) sepia(0.15)',
    overlay: { color: '#D4A574', opacity: 0.08, blendMode: 'overlay' },
    vignette: true,
  },
  {
    id: 'joseon',
    name: { ko: '조선시대', en: 'Joseon Era', ja: '朝鮮時代', 'zh-CN': '朝鲜时代', 'zh-TW': '朝鮮時代' },
    description: { ko: '고전적인 세피아 톤', en: 'Classic sepia tone', ja: 'クラシックなセピアトーン', 'zh-CN': '经典怀旧色调', 'zh-TW': '經典懷舊色調' },
    icon: '📜',
    cssFilter: 'sepia(0.6) contrast(1.15) brightness(0.95) saturate(0.8)',
    vignette: true,
    grain: true,
  },
  {
    id: 'dokkaebi',
    name: { ko: '도깨비', en: 'Dokkaebi', ja: 'トッケビ', 'zh-CN': '独角鬼', 'zh-TW': '獨角鬼' },
    description: { ko: '신비로운 청록 톤', en: 'Mystical teal tone', ja: '神秘的なティールトーン', 'zh-CN': '神秘青色调', 'zh-TW': '神秘青色調' },
    icon: '👹',
    cssFilter: 'saturate(1.2) contrast(1.1) hue-rotate(-10deg) brightness(1.05)',
    overlay: { color: '#2DD4BF', opacity: 0.06, blendMode: 'soft-light' },
    vignette: true,
  },
  {
    id: 'film',
    name: { ko: '필름', en: 'Film', ja: 'フィルム', 'zh-CN': '胶片', 'zh-TW': '底片' },
    description: { ko: '90년대 필름 카메라 느낌', en: '90s film camera look', ja: '90年代フィルムカメラ風', 'zh-CN': '90年代胶片相机感', 'zh-TW': '90年代底片相機感' },
    icon: '🎞️',
    cssFilter: 'contrast(1.2) brightness(1.05) saturate(0.85)',
    overlay: { color: '#FFA500', opacity: 0.05, blendMode: 'overlay' },
    vignette: true,
    grain: true,
  },
]

/** Canvas에 필터��� 적용하여 그린다 */
export function applyFilterToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  filter: RetroFilter,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  // 1) CSS 필터
  ctx.filter = filter.cssFilter
  ctx.drawImage(image, 0, 0)
  ctx.filter = 'none'

  // 2) 컬러 오버레이
  if (filter.overlay) {
    ctx.globalCompositeOperation = filter.overlay.blendMode
    ctx.fillStyle = filter.overlay.color
    ctx.globalAlpha = filter.overlay.opacity
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }

  // 3) 비네팅
  if (filter.vignette) {
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = Math.max(canvas.width, canvas.height) * 0.5
    const gradient = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.35)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // 4) 필름 그레인
  if (filter.grain) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const d = imageData.data
    for (let i = 0; i < d.length; i += 16) {
      const noise = (Math.random() - 0.5) * 25
      d[i] += noise
      d[i + 1] += noise
      d[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)
  }
}

/** Canvas → JPEG Blob */
export function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      quality,
    )
  })
}

/** File에 필터를 적용하여 새 File 반환 */
export async function applyFilterToFile(file: File, filter: RetroFilter): Promise<File> {
  if (filter.id === 'original') return file

  const img = new globalThis.Image()
  const url = URL.createObjectURL(file)
  img.src = url

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Image load failed'))
  })

  const canvas = document.createElement('canvas')
  applyFilterToCanvas(canvas, img, filter)
  URL.revokeObjectURL(url)

  const blob = await canvasToBlob(canvas)
  const name = file.name.replace(/\.[^.]+$/, '.jpg')
  return new File([blob], name, { type: 'image/jpeg' })
}
