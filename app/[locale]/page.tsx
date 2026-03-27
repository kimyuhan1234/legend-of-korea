import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Metadata } from "next"

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "common" })
  return {
    title: `${t("siteName")} | ${t("siteDescription")}`,
  }
}

export default function HomePage({ params }: Props) {
  const locale = params.locale
  return <HomeContent locale={locale} />
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("home")
  const tc = useTranslations("common")

  const steps = [
    { icon: "📦", title: t("step1Title"), desc: t("step1Desc"), step: "01" },
    { icon: "🗺️", title: t("step2Title"), desc: t("step2Desc"), step: "02" },
    { icon: "📱", title: t("step3Title"), desc: t("step3Desc"), step: "03" },
    { icon: "⚡", title: t("step4Title"), desc: t("step4Desc"), step: "04" },
  ]

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-[#1B2A4A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#D4A843]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D4A843] -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/30 mb-6">
            <span className="text-[#D4A843] text-sm font-medium">{t("openBadge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight whitespace-pre-line mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
            {t("heroSubtitle")}
          </p>

          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#D4A843] text-[#1B2A4A] font-bold text-lg hover:bg-[#e0b84e] transition-colors shadow-lg shadow-[#D4A843]/30"
          >
            {t("ctaButton")} →
          </Link>
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-4">
          {t("howItWorks")}
        </h2>
        <p className="text-center text-[#7a6a58] mb-12">
          {t("heroSubtitle")}
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-6 shadow-sm border border-[#e8ddd0] text-center hover:shadow-md hover:border-[#D4A843]/40 transition-all"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-[#D4A843] mb-2 tracking-wider">STEP {item.step}</div>
              <h3 className="text-base font-bold text-[#1B2A4A] mb-2">{item.title}</h3>
              <p className="text-sm text-[#7a6a58] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA 배너 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative bg-[#1B2A4A] rounded-3xl px-8 py-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#D4A843]/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#D4A843]/10 translate-y-1/2 -translate-x-1/2" />
          <h2 className="relative text-2xl md:text-3xl font-black text-white mb-4">
            {t("startAdventure")}
          </h2>
          <p className="relative text-white/60 mb-8">{t("heroSubtitle")}</p>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/courses`}
              className="px-8 py-3.5 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors"
            >
              {tc("courses")} →
            </Link>
            <Link
              href={`/${locale}/auth/signup`}
              className="px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              {tc("signup")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
