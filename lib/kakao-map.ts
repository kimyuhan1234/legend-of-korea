// Kakao Maps JavaScript SDK 지연 로더
// - 클라이언트 전용
// - 중복 로드 방지 (단일 Promise 캐시)
// - 키 미설정 시 reject → 호출자에서 텍스트 폴백 가능

declare global {
  interface Window {
    kakao?: {
      maps?: {
        load: (cb: () => void) => void
        LatLng: new (lat: number, lng: number) => unknown
        Map: new (container: HTMLElement, options: unknown) => unknown
        Marker: new (options: unknown) => unknown
        Circle: new (options: unknown) => unknown
        MarkerImage: new (src: string, size: unknown, options?: unknown) => unknown
        Size: new (w: number, h: number) => unknown
        Point: new (x: number, y: number) => unknown
        InfoWindow: new (options: unknown) => unknown
        services?: unknown
      }
    }
  }
}

let loaderPromise: Promise<void> | null = null

export function kakaoKey(): string | null {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
  return key && key.trim().length > 0 ? key : null
}

export function isKakaoMapReady(): boolean {
  return typeof window !== 'undefined' && !!window.kakao?.maps?.Map
}

export function loadKakaoMapSDK(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('kakao-map: window unavailable (SSR)'))
  }

  if (isKakaoMapReady()) {
    return Promise.resolve()
  }

  if (loaderPromise) return loaderPromise

  const key = kakaoKey()
  if (!key) {
    return Promise.reject(new Error('kakao-map: NEXT_PUBLIC_KAKAO_JS_KEY missing'))
  }

  loaderPromise = new Promise<void>((resolve, reject) => {
    // 이미 script 태그가 있으면 onload만 대기
    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-maps-sdk="1"]')
    if (existing) {
      existing.addEventListener('load', () => window.kakao?.maps?.load(() => resolve()))
      existing.addEventListener('error', () => reject(new Error('kakao-map: script error')))
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`
    script.async = true
    script.defer = true
    script.setAttribute('data-kakao-maps-sdk', '1')
    script.onload = () => {
      if (!window.kakao?.maps?.load) {
        reject(new Error('kakao-map: SDK load callback missing'))
        return
      }
      window.kakao.maps.load(() => resolve())
    }
    script.onerror = () => {
      loaderPromise = null // 재시도 허용
      reject(new Error('kakao-map: script load failed'))
    }
    document.head.appendChild(script)
  })

  return loaderPromise
}
