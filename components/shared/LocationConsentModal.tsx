'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'location_consent_v1'

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const COPY: Record<Locale, {
  title: string
  body: string
  bullet1: string
  bullet2: string
  bullet3: string
  view: string
  accept: string
  reject: string
}> = {
  ko: {
    title: '위치정보 사용 동의',
    body: 'Legend of Korea 의 일부 기능은 GPS 위치정보가 필요합니다.',
    bullet1: '미션 위치 인증 (GPS 좌표로 도착 확인)',
    bullet2: '숙소·식당 거리 기반 검색',
    bullet3: '지도 화면에서 현재 위치 표시',
    view: '위치기반 서비스 약관 보기',
    accept: '동의합니다',
    reject: '거부합니다',
  },
  ja: {
    title: '位置情報の使用に同意',
    body: 'Legend of Koreaの一部機能はGPS位置情報を必要とします。',
    bullet1: 'ミッション位置認証（GPSで到達確認）',
    bullet2: '宿泊・飲食店の距離ベース検索',
    bullet3: '地図画面での現在位置表示',
    view: '位置情報サービス規約を見る',
    accept: '同意する',
    reject: '拒否する',
  },
  en: {
    title: 'Consent to Location Use',
    body: 'Some Legend of Korea features require GPS location.',
    bullet1: 'Mission location verification (GPS arrival check)',
    bullet2: 'Distance-based search for stays and restaurants',
    bullet3: 'Current location display on maps',
    view: 'View Location-Based Service Terms',
    accept: 'I agree',
    reject: 'Decline',
  },
  'zh-CN': {
    title: '同意使用位置信息',
    body: 'Legend of Korea 的部分功能需要GPS位置信息。',
    bullet1: '任务位置验证（GPS到达确认）',
    bullet2: '基于距离的住宿/餐厅搜索',
    bullet3: '地图当前位置显示',
    view: '查看位置服务条款',
    accept: '同意',
    reject: '拒绝',
  },
  'zh-TW': {
    title: '同意使用位置資訊',
    body: 'Legend of Korea 的部分功能需要GPS位置資訊。',
    bullet1: '任務位置驗證（GPS到達確認）',
    bullet2: '基於距離的住宿/餐廳搜尋',
    bullet3: '地圖當前位置顯示',
    view: '查看位置服務條款',
    accept: '同意',
    reject: '拒絕',
  },
}

function asLocale(raw: string): Locale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Locale[]).includes(raw as Locale)
    ? (raw as Locale)
    : 'ko'
}

interface ModalProps {
  locale: string
  onAccept: () => void
  onReject: () => void
}

function LocationConsentModal({ locale, onAccept, onReject }: ModalProps) {
  const lk = asLocale(locale)
  const t = COPY[lk]

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-consent-title"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
      >
        <div className="p-6">
          <h2 id="location-consent-title" className="text-lg font-black text-ink mb-2">
            📍 {t.title}
          </h2>
          <p className="text-sm text-stone leading-relaxed mb-3">{t.body}</p>
          <ul className="text-sm text-ink space-y-1.5 mb-4 list-disc list-inside">
            <li>{t.bullet1}</li>
            <li>{t.bullet2}</li>
            <li>{t.bullet3}</li>
          </ul>
          <Link
            href={`/${locale}/location-terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-blossom-deep underline mb-5"
          >
            {t.view} ↗
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReject}
              className="flex-1 py-3 rounded-xl border border-mist text-stone font-bold text-sm hover:bg-cloud transition-colors"
            >
              {t.reject}
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 py-3 rounded-xl bg-mint-deep text-white font-bold text-sm hover:opacity-90 transition-colors"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * useLocationConsent — GPS 동의 hook + 모달 element.
 *
 * 사용:
 *   const { requestConsent, modalElement } = useLocationConsent({ locale })
 *
 *   const startGps = async () => {
 *     const ok = await requestConsent()
 *     if (!ok) return
 *     navigator.geolocation.getCurrentPosition(...)
 *   }
 *
 *   return <>...{modalElement}</>
 *
 * - 첫 호출 시 모달 표시 → 사용자 응답 후 resolve
 * - 동의 → localStorage 'location_consent_v1' = '1' 저장 → 이후 즉시 true
 * - 거부 → 즉시 false (재호출 시 모달 다시 표시)
 */
export function useLocationConsent({ locale }: { locale: string }) {
  const [hasConsent, setHasConsent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const resolverRef = useRef<((v: boolean) => void) | null>(null)

  // mount 시 localStorage 에서 동의 상태 복원
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(STORAGE_KEY) === '1') setHasConsent(true)
  }, [])

  const requestConsent = useCallback((): Promise<boolean> => {
    if (typeof window === 'undefined') return Promise.resolve(false)
    if (window.localStorage.getItem(STORAGE_KEY) === '1') {
      setHasConsent(true)
      return Promise.resolve(true)
    }
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
      setShowModal(true)
    })
  }, [])

  const handleAccept = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, '1')
    }
    setHasConsent(true)
    setShowModal(false)
    resolverRef.current?.(true)
    resolverRef.current = null
  }, [])

  const handleReject = useCallback(() => {
    setShowModal(false)
    resolverRef.current?.(false)
    resolverRef.current = null
  }, [])

  const modalElement = showModal ? (
    <LocationConsentModal locale={locale} onAccept={handleAccept} onReject={handleReject} />
  ) : null

  return { hasConsent, requestConsent, modalElement }
}
