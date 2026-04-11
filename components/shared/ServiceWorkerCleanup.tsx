'use client'

import { useEffect } from 'react'

// 과거에 next-pwa 로 등록됐던 service worker 와 workbox 캐시를 깨끗이 제거한다.
// PWA 를 재활성화할 땐 이 컴포넌트를 layout 에서 빼고 next-pwa 설정을 복구하면 된다.
export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) {
        reg.unregister().catch(() => {})
      }
    }).catch(() => {})

    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {})
        }
      }).catch(() => {})
    }
  }, [])

  return null
}
