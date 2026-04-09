import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

import { Disclaimer } from "@/components/shared/Disclaimer"

interface Props {
  params: { locale: string; courseId: string }
  searchParams: {
    paymentKey?: string
    orderId?: string
    amount?: string
    session_id?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "purchase" })
  return { title: `${t("orderComplete")} | Legend of Korea` }
}

export default async function PurchaseSuccessPage({ params, searchParams }: Props) {
  const { locale, courseId } = params
  const { paymentKey, orderId, amount, session_id } = searchParams
  const t = await getTranslations({ locale, namespace: "purchase" })

  let confirmedOrderId = orderId || session_id || ""
  let paymentConfirmed = false
  let paymentError = ""

  // Toss 결제 승인
  if (paymentKey && orderId && amount) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      const res = await fetch(`${baseUrl}/api/payments/toss/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        cache: "no-store",
      })
      const data = await res.json()
      if (res.ok) {
        paymentConfirmed = true
        confirmedOrderId = data.orderId
      } else {
        paymentError = data.error || "결제 승인 실패"
      }
    } catch {
      paymentError = "결제 확인 중 오류가 발생했습니다"
    }
  }

  // Stripe 성공 (웹훅이 처리하므로 여기서는 UI만)
  if (session_id) {
    paymentConfirmed = true
  }

  if (paymentError) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-8 md:px-10">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-black text-[#111] mb-2">{t("paymentFailed")}</h1>
          <p className="text-[#7a6a58] mb-8">{paymentError}</p>
          <Link
            href={`/${locale}/courses/${courseId}/purchase/fail?orderId=${confirmedOrderId}`}
            className="px-8 py-3.5 rounded-xl bg-[#F5F3EF] text-white font-bold hover:bg-[#243a63] transition-colors"
          >
            {t("retryPayment")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-8 md:px-10">
      <div className="text-center max-w-md">
        {/* 성공 아이콘 */}
        <div className="w-24 h-24 rounded-full bg-[#D4A843]/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🎉</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-[#111] mb-3">
          {t("orderComplete")}
        </h1>

        {confirmedOrderId && (
          <div className="bg-white rounded-2xl border border-[#e8ddd0] px-5 py-4 mb-6 inline-block">
            <p className="text-xs text-[#7a6a58] mb-1">{t("orderNumber")}</p>
            <p className="font-mono font-bold text-[#111] text-sm break-all">
              {confirmedOrderId}
            </p>
          </div>
        )}

        <p className="text-[#7a6a58] mb-10">
          {locale === "ko"
            ? "키트가 등록하신 배송지로 발송됩니다. 배송 현황은 마이페이지에서 확인하세요."
            : locale === "ja"
            ? "キットはご登録の配送先に発送されます。配送状況はマイページでご確認ください。"
            : "Your kit will be shipped to the address you provided. Track your shipment in My Page."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            href={`/${locale}/courses/${courseId}#affiliate`}
            className="px-6 py-3.5 rounded-xl bg-white border border-[#e8ddd0] text-[#111] font-semibold hover:bg-[#F5F0E8] transition-colors"
          >
            🏨 {t("viewRecommendedStay")}
          </Link>
          <Link
            href={`/${locale}/mypage`}
            className="px-6 py-3.5 rounded-xl bg-[#F5F3EF] text-white font-bold hover:bg-[#243a63] transition-colors"
          >
            {t("trackShipping")} →
          </Link>
        </div>

        <Disclaimer locale={locale} className="mb-10 text-center" />

        <div className="mt-6">
          <Link
            href={`/${locale}/courses/${courseId}`}
            className="text-sm text-[#7a6a58] hover:text-[#111] transition-colors"
          >
            ← {t("backToCourse")}
          </Link>
        </div>
      </div>
    </div>
  )
}
