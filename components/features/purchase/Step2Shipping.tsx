"use client"

import { useEffect } from "react"

interface ShippingInfo {
  name: string
  phone: string
  zipcode: string
  address: string
  addressDetail: string
}

interface Step2Props {
  data: ShippingInfo
  prevAddress: ShippingInfo | null
  onChange: (data: ShippingInfo) => void
  onNext: () => void
  onPrev: () => void
  t: Record<string, string>
}

export function Step2Shipping({ data, prevAddress, onChange, onNext, onPrev, t }: Step2Props) {
  // 다음 우편번호 스크립트 로드
  useEffect(() => {
    if (document.getElementById("daum-postcode-script")) return
    const script = document.createElement("script")
    script.id = "daum-postcode-script"
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    document.head.appendChild(script)
  }, [])

  const handleFindZipcode = () => {
    if (typeof window === "undefined") return
    const daum = (window as any).daum
    if (!daum?.Postcode) {
      alert("우편번호 찾기 로드 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }
    new daum.Postcode({
      oncomplete: (result: any) => {
        onChange({
          ...data,
          zipcode: result.zonecode,
          address: result.roadAddress || result.jibunAddress,
        })
      },
    }).open()
  }

  const usePrevAddress = () => {
    if (prevAddress) onChange(prevAddress)
  }

  const isValid =
    data.name.trim() &&
    data.phone.trim() &&
    data.zipcode.trim() &&
    data.address.trim()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#111]">{t.stepShipping}</h2>
        {prevAddress && (
          <button
            onClick={usePrevAddress}
            className="text-sm text-[#F0B8B8] hover:underline font-medium"
          >
            {t.usePrevAddress}
          </button>
        )}
      </div>

      {/* 배송 팁 */}
      <div className="flex items-center gap-2 bg-[#F0B8B8]/10 border border-[#F0B8B8]/30 rounded-xl px-4 py-3 text-sm text-[#111] font-medium">
        <span>🏨</span>
        <span>{t.shippingTip}</span>
      </div>

      {/* 이름 */}
      <FormField label={t.shippingName} required>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder={t.shippingName}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E7EB] bg-white text-[#111] text-sm focus:outline-none focus:border-[#F0B8B8] transition-colors"
        />
      </FormField>

      {/* 전화번호 */}
      <FormField label={t.shippingPhone} required>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="010-0000-0000"
          className="w-full px-4 py-3 rounded-xl border border-[#E4E7EB] bg-white text-[#111] text-sm focus:outline-none focus:border-[#F0B8B8] transition-colors"
        />
      </FormField>

      {/* 우편번호 */}
      <FormField label={t.shippingZipcode} required>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.zipcode}
            readOnly
            placeholder="00000"
            className="flex-1 px-4 py-3 rounded-xl border border-[#E4E7EB] bg-[#F0F2F5] text-[#111] text-sm"
          />
          <button
            onClick={handleFindZipcode}
            className="px-4 py-3 rounded-xl bg-[#F0F2F5] text-white text-sm font-semibold hover:bg-[#243a63] transition-colors whitespace-nowrap"
          >
            {t.findZipcode}
          </button>
        </div>
      </FormField>

      {/* 주소 */}
      <FormField label={t.shippingAddress} required>
        <input
          type="text"
          value={data.address}
          readOnly
          placeholder={t.shippingAddress}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E7EB] bg-[#F0F2F5] text-[#111] text-sm"
        />
      </FormField>

      {/* 상세주소 */}
      <FormField label={t.shippingDetail}>
        <input
          type="text"
          value={data.addressDetail}
          onChange={(e) => onChange({ ...data, addressDetail: e.target.value })}
          placeholder={t.shippingDetail}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E7EB] bg-white text-[#111] text-sm focus:outline-none focus:border-[#F0B8B8] transition-colors"
        />
      </FormField>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onPrev}
          className="flex-1 py-4 rounded-2xl border border-[#E4E7EB] bg-white text-[#111] font-semibold hover:bg-[#F0F2F5] transition-colors"
        >
          ← {t.prev}
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-[2] py-4 rounded-2xl bg-[#F0F2F5] text-white font-bold hover:bg-[#243a63] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.next} →
        </button>
      </div>
    </div>
  )
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#111] mb-2">
        {label} {required && <span className="text-[#F0B8B8]">*</span>}
      </label>
      {children}
    </div>
  )
}
