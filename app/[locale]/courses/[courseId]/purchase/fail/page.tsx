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
    desc: "결제 중 문제가 발생했습니다. 다시 시도해주세요.",
    retry: "다시 시도하기",
    back: "코스로 돌아가기",
  },
  ja: {
    title: "お支払いに失敗しました",
    desc: "お支払い中に問題が発生しました。もう一度お試しください。",
    retry: "もう一度試す",
    back: "コースに戻る",
  },
  en: {
    title: "Payment Failed",
    desc: "Something went wrong during payment. Please try again.",
    retry: "Try Again",
    back: "Back to Course",
  },
}

function FailContent({ locale, courseId }: { locale: string; courseId: string }) {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || ""
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">😞</span>
        </div>

        <h1 className="text-2xl font-black text-[#1B2A4A] mb-3">{label.title}</h1>
        <p className="text-[#7a6a58] mb-2">{label.desc}</p>
        {message && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 mb-8">{message}</p>
        )}
        {!message && <div className="mb-8" />}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}/courses/${courseId}/purchase`}
            className="px-8 py-3.5 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors"
          >
            {label.retry}
          </Link>
          <Link
            href={`/${locale}/courses/${courseId}`}
            className="px-8 py-3.5 rounded-xl bg-white border border-[#e8ddd0] text-[#1B2A4A] font-semibold hover:bg-[#F5F0E8] transition-colors"
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
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E8]" />}>
      <FailContent locale={locale} courseId={courseId} />
    </Suspense>
  )
}
