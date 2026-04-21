import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { PurchaseFlow } from "@/components/features/purchase/PurchaseFlow"
import type { I18nText } from "@/lib/supabase/types"

interface Props {
  params: { locale: string; courseId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "purchase" })
  return { title: `${t("stepKit")} | Cloud with you` }
}

function getI18n(field: I18nText, locale: string): string {
  return (field as unknown as Record<string, string>)[locale] || field.en || field.ko || ""
}

export default async function PurchasePage({ params }: Props) {
  const { locale, courseId } = params
  const supabase = await createClient()

  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/auth/login?next=/courses/${courseId}/purchase`)
  }

  // 병렬 데이터 로딩 (kit_products/배송 조회 제거 — 디지털 구독)
  const [courseRes, couponRes, profileRes] = await Promise.all([
    supabase.from("courses").select("id, title, is_active").eq("id", courseId).single(),
    supabase
      .from("coupons")
      .select("id, discount_rate, code, expires_at")
      .eq("user_id", user.id)
      .eq("is_used", false)
      .gt("expires_at", new Date().toISOString()),
    supabase.from("users").select("email").eq("id", user.id).single(),
  ])

  if (!courseRes.data || !courseRes.data.is_active) {
    redirect(`/${locale}/courses`)
  }

  // 번역 로드
  const t = await getTranslations({ locale, namespace: "purchase" })
  const tKeys = [
    "stepKit", "stepShipping", "stepPayment", "stepComplete",
    "selectKit", "soloKit", "coupleKit", "quantity",
    "applyCoupon", "selectCoupon", "noCoupon",
    "totalPrice", "discount", "finalPrice", "next", "prev",
    "shippingName", "shippingPhone", "shippingZipcode", "shippingAddress",
    "shippingDetail", "findZipcode", "shippingTip", "usePrevAddress",
    "paymentMethod", "tossPay", "orderSummary",
    "payNow", "processing", "orderComplete",
  ] as const

  const tObj = Object.fromEntries(tKeys.map((k) => [k, t(k)]))

  const courseName = getI18n(courseRes.data.title as I18nText, locale)

  return (
    <div className="min-h-screen bg-cloud">
      {/* 헤더 */}
      <div className="bg-white border-b border-mist">
        <div className="max-w-xl mx-auto px-8 md:px-10 py-4">
          <h1 className="text-lg font-bold text-[#111]">📱 {tObj.stepKit}</h1>
          <p className="text-sm text-stone">{courseName}</p>
        </div>
      </div>

      <PurchaseFlow
        kits={[]}
        coupons={couponRes.data || []}
        locale={locale}
        courseId={courseId}
        courseName={courseName}
        user={{ id: user.id, email: profileRes.data?.email || user.email || "" }}
        t={tObj}
      />
    </div>
  )
}
