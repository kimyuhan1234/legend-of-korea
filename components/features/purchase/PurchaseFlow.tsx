"use client"

import { useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { Step1KitSelect } from "./Step1KitSelect"
import { Step2Shipping } from "./Step2Shipping"
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

interface PrevOrder {
  shipping_name: string
  shipping_phone: string
  shipping_zipcode: string | null
  shipping_address: string
  shipping_address_detail: string | null
}

interface PurchaseFlowProps {
  kits: Kit[]
  coupons: Coupon[]
  prevOrder: PrevOrder | null
  locale: string
  courseId: string
  courseName: string
  user: { id: string; email: string } | null
  t: Record<string, string>
}

export function PurchaseFlow({
  kits,
  coupons,
  prevOrder,
  locale,
  courseId,
  courseName,
  user,
  t,
}: PurchaseFlowProps) {
  const [step, setStep] = useState(1)

  const defaultKit = kits.find((k) => k.option_type === "solo" && k.is_active && k.stock > 0)

  const [kitSelection, setKitSelection] = useState({
    kitId: defaultKit?.id || "",
    quantity: 1,
    couponId: "",
  })

  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    addressDetail: "",
  })

  const stepLabels = [t.stepKit, t.stepShipping, t.stepPayment]

  const prevAddress = prevOrder
    ? {
        name: prevOrder.shipping_name,
        phone: prevOrder.shipping_phone,
        zipcode: prevOrder.shipping_zipcode || "",
        address: prevOrder.shipping_address,
        addressDetail: prevOrder.shipping_address_detail || "",
      }
    : null

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <StepIndicator currentStep={step} labels={stepLabels} />

      <div className="bg-white rounded-3xl border border-[#E4E7EB] p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <Step1KitSelect
            kits={kits}
            coupons={coupons}
            data={kitSelection}
            onChange={setKitSelection}
            onNext={() => setStep(2)}
            t={t}
            locale={locale}
          />
        )}

        {step === 2 && (
          <Step2Shipping
            data={shipping}
            prevAddress={prevAddress}
            onChange={setShipping}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
            t={t}
          />
        )}

        {step === 3 && (
          <Step3Payment
            kitSelection={kitSelection}
            shipping={shipping}
            kits={kits}
            coupons={coupons}
            locale={locale}
            courseId={courseId}
            courseName={courseName}
            user={user}
            t={t}
            onPrev={() => setStep(2)}
          />
        )}
      </div>
    </div>
  )
}
