'use client'

import { useState } from 'react'
import { Navigation, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Props {
  missionId: string
  missionLat: number
  missionLng: number
  onVerified: () => void
  locale: string
}

const IS_DEV = process.env.NODE_ENV === 'development'

/** Haversine 공식 — 두 좌표 간 거리 (미터) */
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.round(meters)}m`
}

const RADIUS_METERS = 200

const TEXTS: Record<string, Record<string, string>> = {
  ko: {
    title: '📍 미션 장소에 도착했나요?',
    checkLocation: '현재 위치 확인',
    checking: '위치 확인 중...',
    success: '도착 확인! 미션을 시작하세요!',
    tooFar: '아직 미션 장소에 도착하지 않았어요',
    distance: '현재 거리: {dist}',
    noGps: '위치 정보를 사용할 수 없습니다',
    denied: '위치 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.',
    skip: '위치 확인 건너뛰기',
  },
  en: {
    title: '📍 Have you arrived at the mission location?',
    checkLocation: 'Check My Location',
    checking: 'Checking location...',
    success: 'Arrival confirmed! Start the mission!',
    tooFar: "You haven't arrived at the mission location yet",
    distance: 'Current distance: {dist}',
    noGps: 'Location service is not available',
    denied: 'Location permission denied. Please allow it in browser settings.',
    skip: 'Skip location check',
  },
  ja: {
    title: '📍 ミッション場所に到着しましたか？',
    checkLocation: '現在位置を確認',
    checking: '位置確認中...',
    success: '到着確認！ミッションを始めましょう！',
    tooFar: 'まだミッション場所に到着していません',
    distance: '現在の距離: {dist}',
    noGps: '位置情報が利用できません',
    denied: '位置情報の権限が拒否されました。ブラウザの設定で許可してください。',
    skip: '位置確認をスキップ',
  },
  'zh-CN': {
    title: '📍 你到达任务地点了吗？',
    checkLocation: '确认当前位置',
    checking: '正在确认位置...',
    success: '到达确认！开始任务吧！',
    tooFar: '你还没有到达任务地点',
    distance: '当前距离: {dist}',
    noGps: '无法使用位置信息',
    denied: '位置权限被拒绝，请在浏览器设置中允许。',
    skip: '跳过位置确认',
  },
  'zh-TW': {
    title: '📍 你到達任務地點了嗎？',
    checkLocation: '確認當前位置',
    checking: '正在確認位置...',
    success: '到達確認！開始任務吧！',
    tooFar: '你還沒有到達任務地點',
    distance: '當前距離: {dist}',
    noGps: '無法使用位置資訊',
    denied: '位置權限被拒絕，請在瀏覽器設定中允許。',
    skip: '跳過位置確認',
  },
}

type Status = 'idle' | 'checking' | 'success' | 'too_far' | 'error' | 'denied'

export function GpsVerification({ missionId, missionLat, missionLng, onVerified, locale }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [distance, setDistance] = useState<number | null>(null)

  const tx = TEXTS[locale] ?? TEXTS.ko

  const handleCheck = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      return
    }

    setStatus('checking')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude
        const userLng = pos.coords.longitude
        const dist = getDistanceMeters(userLat, userLng, missionLat, missionLng)
        setDistance(dist)

        if (dist > RADIUS_METERS) {
          setStatus('too_far')
          return
        }

        // 클라이언트 거리 OK → 서버 재검증 (Haversine + DB 업데이트)
        try {
          const res = await fetch('/api/missions/verify-gps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ missionId, userLat, userLng }),
          })
          const data = await res.json()
          if (res.ok && data.verified) {
            setStatus('success')
            setTimeout(() => onVerified(), 1200)
          } else {
            setDistance(typeof data.distance === 'number' ? data.distance : dist)
            setStatus('too_far')
          }
        } catch {
          setStatus('error')
        }
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div className="rounded-3xl border border-mist bg-white p-6 md:p-8 space-y-5 shadow-sm">
      <h3 className="text-lg font-black text-[#111]">{tx.title}</h3>

      {/* 성공 */}
      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {tx.success}
        </div>
      )}

      {/* 거리 초과 */}
      {status === 'too_far' && distance !== null && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{tx.tooFar}</p>
            <p className="text-sm mt-1">{tx.distance.replace('{dist}', formatDistance(distance))}</p>
          </div>
        </div>
      )}

      {/* GPS 오류 */}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {tx.noGps}
        </div>
      )}

      {/* 권한 거부 */}
      {status === 'denied' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {tx.denied}
        </div>
      )}

      {/* 위치 확인 버튼 (성공 제외) */}
      {status !== 'success' && (
        <button
          onClick={handleCheck}
          disabled={status === 'checking'}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-mint text-ink font-black text-base hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === 'checking' ? (
            <><Loader2 className="w-5 h-5 animate-spin" />{tx.checking}</>
          ) : (
            <><Navigation className="w-5 h-5" />{tx.checkLocation}</>
          )}
        </button>
      )}

      {/* 건너뛰기 — 개발 환경에서만 노출 (프로덕션에서는 GPS 필수) */}
      {IS_DEV && status !== 'success' && (
        <div className="text-center">
          <button
            onClick={onVerified}
            className="text-sm text-stone hover:text-[#111] underline underline-offset-2 transition-colors"
          >
            {tx.skip} (dev only)
          </button>
        </div>
      )}
    </div>
  )
}
