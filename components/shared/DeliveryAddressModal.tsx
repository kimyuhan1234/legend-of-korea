'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

export interface DeliveryAddress {
  recipientName: string
  hotelName: string
  hotelAddress: string
  roomNumber: string
  checkInDate: string
  phone: string
  email: string
  note: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface DeliveryAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (address: DeliveryAddress) => void
  productName: string
  productPrice?: string
}

export function DeliveryAddressModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productPrice,
}: DeliveryAddressModalProps) {
  const t = useTranslations('delivery')

  const [form, setForm] = useState<DeliveryAddress>({
    recipientName: '',
    hotelName: '',
    hotelAddress: '',
    roomNumber: '',
    checkInDate: '',
    phone: '',
    email: '',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [autoFilled, setAutoFilled] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    setAutoFilled(false)

    async function fetchHotelInfo() {
      try {
        const res = await fetch('/api/planner/items', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const plans = data.plans as Array<{
          hotel_name?: string | null
          hotel_address?: string | null
        }> | undefined
        const plan = plans?.[0]
        if (plan?.hotel_name || plan?.hotel_address) {
          setForm((prev) => ({
            ...prev,
            hotelName: plan.hotel_name || prev.hotelName,
            hotelAddress: plan.hotel_address || prev.hotelAddress,
          }))
          setAutoFilled(true)
        }
      } catch {
        // ignore
      }
    }

    fetchHotelInfo()
  }, [isOpen])

  const update = (key: keyof DeliveryAddress, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const e: Record<string, boolean> = {}
    if (!form.recipientName.trim()) e.recipientName = true
    if (!form.hotelName.trim()) e.hotelName = true
    if (!form.hotelAddress.trim()) e.hotelAddress = true
    if (!form.checkInDate) e.checkInDate = true
    if (!form.phone.trim()) e.phone = true
    if (!form.email.trim() || !isValidEmail(form.email)) e.email = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleConfirm = () => {
    if (validate()) onConfirm(form)
  }

  if (!isOpen) return null

  const inputBase =
    'w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-mint/40'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-mist max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-ink">{t('title')}</h3>
          <p className="text-sm text-slate mt-1">
            {productName}
            {productPrice && ` · ${productPrice}`}
          </p>
        </div>

        <div className="space-y-4">
          {/* 수령인 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('recipient')} *</label>
            <input
              type="text"
              value={form.recipientName}
              onChange={(e) => update('recipientName', e.target.value)}
              placeholder="John Smith"
              className={`${inputBase} ${errors.recipientName ? 'border-red-400' : 'border-mist'}`}
            />
          </div>

          {/* 호텔명 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('hotelName')} *</label>
            <input
              type="text"
              value={form.hotelName}
              onChange={(e) => update('hotelName', e.target.value)}
              className={`${inputBase} ${errors.hotelName ? 'border-red-400' : 'border-mist'}`}
            />
          </div>

          {/* 호텔 주소 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('hotelAddress')} *</label>
            <input
              type="text"
              value={form.hotelAddress}
              onChange={(e) => update('hotelAddress', e.target.value)}
              className={`${inputBase} ${errors.hotelAddress ? 'border-red-400' : 'border-mist'}`}
            />
          </div>

          {/* 객실 번호 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('roomNumber')}</label>
            <input
              type="text"
              value={form.roomNumber}
              onChange={(e) => update('roomNumber', e.target.value)}
              placeholder="302"
              className={`${inputBase} border-mist`}
            />
          </div>

          {/* 체크인 날짜 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('checkInDate')} *</label>
            <input
              type="date"
              value={form.checkInDate}
              onChange={(e) => update('checkInDate', e.target.value)}
              className={`${inputBase} ${errors.checkInDate ? 'border-red-400' : 'border-mist'}`}
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('phone')} *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder={t('phonePlaceholder')}
              className={`${inputBase} ${errors.phone ? 'border-red-400' : 'border-mist'}`}
            />
            <p className="text-[10px] text-stone mt-1">{t('phoneHint')}</p>
          </div>

          {/* 이메일 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('email')} *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder={t('emailPlaceholder')}
              className={`${inputBase} ${errors.email ? 'border-red-400' : 'border-mist'}`}
            />
          </div>

          {/* 요청사항 */}
          <div>
            <label className="text-xs text-stone mb-1 block">{t('note')}</label>
            <textarea
              value={form.note}
              onChange={(e) => update('note', e.target.value)}
              rows={2}
              className={`${inputBase} border-mist resize-none`}
            />
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-4 p-3 bg-peach/30 rounded-xl">
          <p className="text-xs text-ink">{t('warning')}</p>
        </div>

        {autoFilled && (
          <div className="mt-2 p-3 bg-mint-light/30 rounded-xl">
            <p className="text-xs text-mint-deep">{t('autoFilled')}</p>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white border border-mist text-slate font-bold rounded-xl px-4 py-3 text-sm hover:bg-cloud transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-mint to-blossom text-ink font-bold rounded-xl px-4 py-3 text-sm hover:opacity-90 transition"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
