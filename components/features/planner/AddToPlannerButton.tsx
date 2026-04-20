'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CrossTabToast } from './CrossTabToast'
import type { TabId } from '@/lib/data/cross-tab-recommendations'

interface AddToPlannerButtonProps {
  itemType: TabId | 'transport' | 'surprise'
  itemData: Record<string, unknown>
  cityId: string
  className?: string
  size?: 'sm' | 'md'
}

interface Warning {
  type: 'city_mismatch' | 'duplicate' | 'transport_conflict'
  message: string
  onConfirm: () => void
}

// 아이템 → 필요 패스 매핑 (서버와 동기화)
// surprise, goods 는 누락(패스 불필요)
const ITEM_PASS_MAP: Record<string, string> = {
  food: 'live',
  stay: 'live',
  ootd: 'live',
  quest: 'story',
  diy: 'story',
  transport: 'move',
}

const PASS_NAMES: Record<string, string> = {
  move: 'Move',
  live: 'Live',
  story: 'Story',
}

type PassModalLocale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

const PASS_MODAL_TEXT: Record<PassModalLocale, { title: string; desc: string; cta: string; cancel: string }> = {
  ko: { title: '패스가 필요해요', desc: '이 기능을 사용하려면 {pass} 패스가 필요합니다', cta: '패스 보러가기', cancel: '닫기' },
  en: { title: 'Pass Required', desc: 'You need a {pass} pass to use this feature', cta: 'View Passes', cancel: 'Close' },
  ja: { title: 'パスが必要です', desc: 'この機能を使うには{pass}パスが必要です', cta: 'パスを見る', cancel: '閉じる' },
  'zh-CN': { title: '需要通行证', desc: '使用此功能需要{pass}通行证', cta: '查看通行证', cancel: '关闭' },
  'zh-TW': { title: '需要通行證', desc: '使用此功能需要{pass}通行證', cta: '查看通行證', cancel: '關閉' },
}

const CITY_NAMES: Record<string, { ko: string; en: string; ja: string }> = {
  jeonju: { ko: '전주', en: 'Jeonju', ja: '全州' },
  seoul: { ko: '서울', en: 'Seoul', ja: 'ソウル' },
  busan: { ko: '부산', en: 'Busan', ja: '釜山' },
  jeju: { ko: '제주', en: 'Jeju', ja: '済州' },
  gyeongju: { ko: '경주', en: 'Gyeongju', ja: '慶州' },
  tongyeong: { ko: '통영', en: 'Tongyeong', ja: '統営' },
  cheonan: { ko: '천안', en: 'Cheonan', ja: '天安' },
  yongin: { ko: '용인', en: 'Yongin', ja: '龍仁' },
  icheon: { ko: '이천', en: 'Icheon', ja: '利川' },
}

function getCityName(cityId: string, locale: string): string {
  return CITY_NAMES[cityId]?.[locale as string] || cityId
}

function extractName(data: Record<string, unknown>): string {
  const n = data.name ?? data.foodName ?? ''
  if (typeof n === 'string') return n
  if (n && typeof n === 'object') return (n as Record<string, string>).ko || ''
  return ''
}

export function AddToPlannerButton({
  itemType,
  itemData,
  cityId,
  className = '',
  size = 'sm',
}: AddToPlannerButtonProps) {
  const t = useTranslations('planner')
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'ko'

  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'removing' | 'login-required'>('idle')
  const [showToast, setShowToast] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [itemId, setItemId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [warning, setWarning] = useState<Warning | null>(null)
  const [showPassModal, setShowPassModal] = useState(false)
  const [requiredPassId, setRequiredPassId] = useState<string | null>(null)

  // 굿즈는 플래너에 담을 수 없음 (hooks 이후 early return)
  if (itemType === 'goods') return null

  // 실제 담기 실행
  const doAdd = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/planner/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemData, cityId }),
      })

      if (res.status === 401) {
        setState('login-required')
        setTimeout(() => {
          router.push(`/${locale}/auth/login?next=${pathname}`)
        }, 1200)
        return
      }

      // 서버 측 패스 게이팅 — 클라이언트 우회 방어
      if (res.status === 403) {
        const data = (await res.json().catch(() => null)) as { error?: string; requiredPass?: string } | null
        if (data?.error === 'pass_required' && data.requiredPass) {
          setRequiredPassId(data.requiredPass)
          setShowPassModal(true)
        }
        setState('idle')
        return
      }

      if (!res.ok) {
        setState('idle')
        return
      }

      const data = (await res.json().catch(() => null)) as { itemId?: string } | null
      if (data?.itemId) setItemId(data.itemId)

      setState('added')
      window.dispatchEvent(new Event('planner:refresh'))
      if (['food', 'stay', 'diy', 'quest', 'ootd', 'goods'].includes(itemType)) {
        setShowToast(true)
      }
    } catch {
      setState('idle')
    }
  }

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (state === 'loading' || state === 'removing') return

    // 담김 상태에서 클릭 → 취소 확인 모달
    if (state === 'added') {
      setShowConfirm(true)
      return
    }

    // 패스 체크 — 필요 패스 미보유 시 구매 유도 모달 (서버에서 재검증됨)
    const requiredPass = ITEM_PASS_MAP[itemType]
    if (requiredPass) {
      try {
        const passRes = await fetch('/api/passes/status')
        if (passRes.ok) {
          const passData = await passRes.json()
          const hasPass =
            passData.hasAllInOne || (Array.isArray(passData.passes) && passData.passes.includes(requiredPass))
          if (!hasPass) {
            setRequiredPassId(requiredPass)
            setShowPassModal(true)
            return
          }
        }
        // passRes.ok 가 아니어도 일단 진행 — 서버에서 403 으로 막힘
      } catch {
        // 네트워크 오류 시에도 진행 — 서버가 최종 게이트키퍼
      }
    }

    // 기존 플랜 정보를 가져와서 검증
    let planCityId: string | undefined
    let existingItems: Array<{ item_type: string; item_data: Record<string, unknown> }> = []
    try {
      const planRes = await fetch('/api/planner/items', { cache: 'no-store' })
      if (planRes.ok) {
        const planData = await planRes.json()
        const plans = planData.plans as Array<{ city_id: string; plan_items: Array<{ item_type: string; item_data: Record<string, unknown> }> }> | undefined
        if (plans && plans.length > 0) {
          planCityId = plans[0].city_id
          existingItems = plans[0].plan_items ?? []
        }
      }
    } catch {
      // 검증 실패해도 담기는 진행
    }

    const itemCityId = (itemData?.cityId ?? itemData?.city_id ?? itemData?.regionCode ?? itemData?.region) as string | undefined

    // 검증 1: 도시 불일치
    if (
      planCityId && itemCityId &&
      planCityId !== itemCityId &&
      !['transport', 'ootd'].includes(itemType)
    ) {
      setWarning({
        type: 'city_mismatch',
        message: t('warn.cityMismatch', {
          planCity: getCityName(planCityId, locale),
          itemCity: getCityName(itemCityId, locale),
        }),
        onConfirm: () => { setWarning(null); doAdd() },
      })
      return
    }

    // 검증 2: 중복 아이템
    const newName = extractName(itemData)
    if (newName && existingItems.length > 0) {
      const isDuplicate = existingItems.some((ex) => {
        if (ex.item_type !== itemType) return false
        return extractName(ex.item_data) === newName
      })
      if (isDuplicate) {
        setWarning({
          type: 'duplicate',
          message: t('warn.duplicate'),
          onConfirm: () => { setWarning(null); doAdd() },
        })
        return
      }
    }

    // 검증 3: 교통편 충돌
    if (itemType === 'transport' && itemData?.direction) {
      const dir = itemData.direction as string
      const conflict = existingItems.find(
        (ex) => ex.item_type === 'transport' && ex.item_data?.direction === dir
      )
      if (conflict) {
        const dirLabel = dir === 'going' ? t('warn.going') : t('warn.returning')
        setWarning({
          type: 'transport_conflict',
          message: t('warn.transportConflict', { direction: dirLabel }),
          onConfirm: () => { setWarning(null); doAdd() },
        })
        return
      }
    }

    // 검증 통과 → 바로 담기
    doAdd()
  }

  const handleRemove = async () => {
    if (!itemId) {
      // itemId 없으면 그냥 idle 로 복귀 (UI 리셋)
      setState('idle')
      setShowConfirm(false)
      return
    }

    setState('removing')
    setShowConfirm(false)
    try {
      const res = await fetch(`/api/planner/items?itemId=${itemId}`, { method: 'DELETE' })
      if (res.ok) {
        setState('idle')
        setItemId(null)
        window.dispatchEvent(new Event('planner:refresh'))
      } else {
        setState('added')
      }
    } catch {
      setState('added')
    }
  }

  const baseClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs font-bold rounded-full'
      : 'px-4 py-2 text-sm font-bold rounded-full'

  const stateClasses = {
    idle: 'bg-mint-deep text-white hover:bg-[#7BC8BC]',
    loading: 'bg-mint text-white cursor-wait',
    added: hovered
      ? 'bg-blossom-light text-blossom-deep border border-blossom-deep'
      : 'bg-mint-light text-mint-deep border border-mint',
    removing: 'bg-mist text-stone cursor-wait',
    'login-required': 'bg-stone text-white',
  }

  const label = {
    idle: `+ ${t('addButton')}`,
    loading: t('adding'),
    added: hovered ? t('remove') : t('added'),
    removing: '...',
    'login-required': t('loginRequired'),
  }[state]

  return (
    <>
      <button
        onClick={handleAdd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={state === 'loading' || state === 'removing'}
        className={`${baseClasses} ${stateClasses[state]} transition-colors ${className}`}
      >
        {label}
      </button>

      {/* 취소 확인 모달 */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-xs w-full p-5 border border-mist">
            <p className="text-sm font-bold text-ink text-center mb-4">
              {t('removeConfirm')}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-mist text-sm font-bold text-slate hover:bg-cloud transition-colors"
              >
                {t('removeNo')}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-colors"
              >
                {t('removeYes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && itemType !== 'transport' && itemType !== 'surprise' && (
        <CrossTabToast
          currentTab={itemType as TabId}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* 패스 필요 모달 */}
      {showPassModal && requiredPassId && (() => {
        const modalText = PASS_MODAL_TEXT[locale as PassModalLocale] ?? PASS_MODAL_TEXT.en
        const passName = PASS_NAMES[requiredPassId] ?? requiredPassId
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50"
            onClick={() => setShowPassModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <span className="text-4xl mb-2 block">🎫</span>
                <h3 className="font-black text-slate-800 text-lg">{modalText.title}</h3>
                <p className="text-sm text-slate-500 mt-2">
                  {modalText.desc.replace('{pass}', passName)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  {modalText.cancel}
                </button>
                <Link
                  href={`/${locale}/pass/${requiredPassId}`}
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-2.5 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-black text-sm text-center hover:opacity-90 transition-opacity"
                >
                  {modalText.cta}
                </Link>
              </div>
            </div>
          </div>
        )
      })()}

      {/* 경고 모달 */}
      {warning && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setWarning(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-mist"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="text-center mb-4">
              <span className="text-4xl">
                {warning.type === 'city_mismatch' && '⚠️'}
                {warning.type === 'duplicate' && '📋'}
                {warning.type === 'transport_conflict' && '🚄'}
              </span>
            </div>
            <p className="text-sm text-ink text-center mb-6 leading-relaxed">
              {warning.message}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setWarning(null)}
                className="flex-1 bg-white border border-mist text-slate font-bold rounded-xl px-4 py-2.5 text-sm hover:bg-cloud transition-colors"
              >
                {t('warn.cancel')}
              </button>
              <button
                type="button"
                onClick={warning.onConfirm}
                className="flex-1 bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-4 py-2.5 text-sm hover:opacity-90 transition"
              >
                {warning.type === 'transport_conflict'
                  ? t('warn.replace')
                  : t('warn.addAnyway')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
