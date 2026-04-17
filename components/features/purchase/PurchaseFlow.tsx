"use client"

import { useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { Step1KitSelect } from "./Step1KitSelect"
import { Step3Payment } from "./Step3Payment"

interface Kit {
  id: string
  option_type: "solo" | "couple"
  price: number
  stock: number
  is_active: boolean
}

interface Coupon {
  id: string
  discount_rate: number
  code: string
  expires_at: string
}

interface PurchaseFlowProps {
  kits: Kit[]
  coupons: Coupon[]
  locale: string
  courseId: string
  courseName: string
  user: { id: string; email: string } | null
  t: Record<string, string>
}

export function PurchaseFlow({
  kits,
  coupons,
  locale,
  courseId,
  courseName,
  user,
  t,
}: PurchaseFlowProps) {
  // 디지털 구독: step 1(플랜 확인) → 3(결제), Step2(배송) 스킵
  const [step, setStep] = useState(1)

  const [kitSelection, setKitSelection] = useState({
    kitId: "",
    quantity: 1,
    couponId: "",
  })

  // 배송 정보 — 디지털 구독에선 사용 안 함, Step3Payment 인터페이스 유지용
  const shipping = {
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    addressDetail: "",
  }

  // 인디케이터는 2단계(플랜 확인 → 결제)로 표시
  const stepLabels = [t.stepKit, t.stepPayment]
  const displayStep = step === 3 ? 2 : 1

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <StepIndicator currentStep={displayStep} labels={stepLabels} />

      <div className="bg-white rounded-3xl border border-mist p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <Step1KitSelect
            kits={kits}
            coupons={coupons}
            data={kitSelection}
            onChange={setKitSelection}
            onNext={() => setStep(3)}
            t={t}
            locale={locale}
          />
        )}

        {step === 3 && (
          <Step3Payment
            kitSelection={kitSelection}
            shipping={shipping}
            coupons={coupons}
            locale={locale}
            courseId={courseId}
            courseName={courseName}
            user={user}
            t={t}
            onPrev={() => setStep(1)}
          />
        )}
      </div>
    </div>
  )
}
