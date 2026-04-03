import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { GoodsNotifyForm } from "@/components/features/goods/GoodsNotifyForm"

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "goods" })
  const tc = await getTranslations({ locale: params.locale, namespace: "common" })
  return {
    title: `${t("title")} | ${tc("siteName")}`,
    description: t("subtitle"),
  }
}

export default async function GoodsPage({ params }: Props) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: "goods" })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2A4A]/5 to-[#D4A843]/5">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">

        {/* 히어로 */}
        <div className="text-center mb-14">
          <div className="text-6xl mb-6">🛍️</div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1B2A4A] mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-[#7a6a58] max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Coming Soon 카드 */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#e8ddd0] shadow-sm px-8 py-10">
          {/* 배지 */}
          <div className="flex justify-center mb-8">
            <span className="px-5 py-1.5 rounded-full bg-[#D4A843] text-[#1B2A4A] text-sm font-black tracking-widest">
              {t("comingSoon")}
            </span>
          </div>

          {/* 설명 */}
          <p className="text-[#7a6a58] text-center leading-relaxed text-base mb-8">
            {t("description")}
          </p>

          {/* 구분선 */}
          <div className="border-t border-dashed border-[#e8ddd0] my-8" />

          {/* 알림 신청 */}
          <div>
            <h2 className="text-base font-bold text-[#1B2A4A] mb-5 text-center">
              {t("notifyTitle")}
            </h2>
            <GoodsNotifyForm
              placeholder={t("notifyPlaceholder")}
              buttonLabel={t("notifyButton")}
              successMsg={t("notifySuccess")}
              errorMsg={t("notifyError")}
              locale={locale}
            />
            <p className="text-xs text-[#7a6a58] mt-4 text-center leading-relaxed">
              {t("notifyDisclaimer")}
            </p>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1B2A4A] text-white font-semibold hover:bg-[#243a63] transition-colors"
          >
            {t("backToCourses")} →
          </Link>
        </div>
      </div>
    </div>
  )
}
