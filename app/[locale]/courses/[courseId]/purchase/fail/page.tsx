"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface Props {
  params: { locale: string; courseId: string }
}

const LABEL = {
  ko: {
    title: "결제에 실패했습니다",
    retry: "다시 시도하기",
    back: "코스로 돌아가기",
    otherMethod: "다른 결제 수단 시도",
    errors: {
      EXCEED_MAX_DAILY_PAYMENT_COUNT: "오늘 결제 한도를 초과했습니다. 내일 다시 시도해주세요.",
      EXCEED_MAX_PAYMENT_AMOUNT: "카드 한도를 초과했습니다. 다른 카드를 이용해 주세요.",
      INVALID_CARD_EXPIRATION: "카드 유효기간이 올바르지 않습니다.",
      INVALID_STOPPED_CARD: "정지된 카드입니다. 카드사에 문의해 주세요.",
      BELOW_MINIMUM_AMOUNT: "결제 금액이 최소 금액보다 적습니다.",
      CANCELED_PAYMENT: "결제가 취소되었습니다.",
      PAY_PROCESS_CANCELED: "결제를 취소하셨습니다.",
      NETWORK_ERROR: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      DEFAULT: "결제 중 문제가 발생했습니다. 다시 시도해주세요.",
    },
  },
  ja: {
    title: "お支払いに失敗しました",
    retry: "もう一度試す",
    back: "コースに戻る",
    otherMethod: "別の支払い方法を試す",
    errors: {
      EXCEED_MAX_DAILY_PAYMENT_COUNT: "本日の決済上限を超えました。明日再度お試しください。",
      EXCEED_MAX_PAYMENT_AMOUNT: "カードの限度額を超えました。別のカードをご利用ください。",
      INVALID_CARD_EXPIRATION: "カードの有効期限が正しくありません。",
      INVALID_STOPPED_CARD: "停止中のカードです。カード会社にお問い合わせください。",
      BELOW_MINIMUM_AMOUNT: "決済金額が最低金額を下回っています。",
      CANCELED_PAYMENT: "決済がキャンセルされました。",
      PAY_PROCESS_CANCELED: "決済をキャンセルされました。",
      NETWORK_ERROR: "ネットワークエラーが発生しました。しばらくしてから再度お試しください。",
      DEFAULT: "お支払い中に問題が発生しました。もう一度お試しください。",
    },
  },
  en: {
    title: "Payment Failed",
    retry: "Try Again",
    back: "Back to Course",
    otherMethod: "Try Another Payment Method",
    errors: {
      EXCEED_MAX_DAILY_PAYMENT_COUNT: "Daily payment limit exceeded. Please try again tomorrow.",
      EXCEED_MAX_PAYMENT_AMOUNT: "Card limit exceeded. Please use a different card.",
      INVALID_CARD_EXPIRATION: "Invalid card expiration date.",
      INVALID_STOPPED_CARD: "This card has been suspended. Please contact your card issuer.",
      BELOW_MINIMUM_AMOUNT: "Payment amount is below the minimum.",
      CANCELED_PAYMENT: "Payment was cancelled.",
      PAY_PROCESS_CANCELED: "You cancelled the payment.",
      NETWORK_ERROR: "A network error occurred. Please try again shortly.",
      DEFAULT: "Something went wrong during payment. Please try again.",
    },
  },
}

function FailContent({ locale, courseId }: { locale: string; courseId: string }) {
  const searchParams = useSearchParams()
  const code = searchParams.get("code") || ""
  const message = searchParams.get("message") || ""
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  const errorDesc =
    label.errors[code as keyof typeof label.errors] ||
    message ||
    label.errors.DEFAULT

  const isUserCancelled = code === "PAY_PROCESS_CANCELED" || code === "CANCELED_PAYMENT"

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-8 md:px-10">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">{isUserCancelled ? "🙅" : "😞"}</span>
        </div>

        <h1 className="text-2xl font-black text-[#111] mb-3">{label.title}</h1>
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-8 md:px-10 py-3 mb-8 leading-relaxed">
          {errorDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isUserCancelled && (
            <Link
              href={`/${locale}/courses/${courseId}/purchase`}
              className="px-8 py-3.5 rounded-xl bg-[#F0B8B8] text-[#111] font-bold hover:bg-[#F5D0D0] transition-colors"
            >
              {label.retry}
            </Link>
          )}
          <Link
            href={`/${locale}/courses/${courseId}/purchase`}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] font-bold hover:bg-[#374151] transition-colors"
          >
            {label.otherMethod}
          </Link>
          <Link
            href={`/${locale}/courses/${courseId}`}
            className="px-8 py-3.5 rounded-xl bg-white border border-[#E4E7EB] text-[#111] font-semibold hover:bg-[#F0F2F5] transition-colors"
          >
            ← {label.back}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseFailPage({ params }: Props) {
  const { locale, courseId } = params
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F2F5]" />}>
      <FailContent locale={locale} courseId={courseId} />
    </Suspense>
  )
}
