import Link from "next/link"

interface Props {
  params: { locale: string }
}

const TEXT = {
  ko: {
    hero: "전설의 주인공이\n되어보세요",
    sub: "한국 전래동화 속 미션을 직접 풀고, 지방 곳곳을 탐험하세요.",
    cta: "전주 도깨비 코스 시작",
    how1: "미션 키트 수령",
    how1d: "예약 후 숙소로 미션 키트가 배송됩니다",
    how2: "QR 미션 수행",
    how2d: "현장에서 QR을 스캔하고 스스로 미션을 해결하세요",
    how3: "LP & 티어 획득",
    how3d: "미션 완료 시 LP가 적립되고 티어가 올라갑니다",
  },
  ja: {
    hero: "伝説の主人公に\nなってみましょう",
    sub: "韓国の昔話のミッションを実際に解いて、地方各地を探検しましょう。",
    cta: "全州トッケビコースを始める",
    how1: "ミッションキット受取",
    how1d: "予約後、宿泊先にミッションキットが配送されます",
    how2: "QRミッション実行",
    how2d: "現場でQRをスキャンして自分でミッションを解決",
    how3: "LP & ティア獲得",
    how3d: "ミッション完了でLPが積まれ、ティアが上がります",
  },
  en: {
    hero: "Become the Hero\nof a Legend",
    sub: "Solve missions from Korean folklore and explore the countryside.",
    cta: "Start Jeonju Dokkaebi Course",
    how1: "Receive Mission Kit",
    how1d: "Your mission kit is delivered to your accommodation after booking",
    how2: "Complete QR Missions",
    how2d: "Scan QR codes on-site and solve missions on your own",
    how3: "Earn LP & Tier",
    how3d: "Complete missions to earn LP and level up your tier",
  },
}

export default function HomePage({ params }: Props) {
  const locale = params.locale || "ko"
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-[#1B2A4A] text-white overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#D4A843]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D4A843] -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/30 mb-6">
            <span className="text-[#D4A843] text-sm font-medium">
              {locale === "ko" ? "🎭 전주 도깨비 코스 오픈" :
               locale === "ja" ? "🎭 全州トッケビコース公開" :
               "🎭 Jeonju Dokkaebi Course Now Open"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight whitespace-pre-line mb-6">
            {t.hero}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
            {t.sub}
          </p>

          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#D4A843] text-[#1B2A4A] font-bold text-lg hover:bg-[#e0b84e] transition-colors shadow-lg shadow-[#D4A843]/30"
          >
            {t.cta} →
          </Link>
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1B2A4A] mb-12">
          {locale === "ko" ? "어떻게 진행되나요?" :
           locale === "ja" ? "どう進めるの？" :
           "How does it work?"}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: t.how1, desc: t.how1d, icon: "📦" },
            { step: "02", title: t.how2, desc: t.how2d, icon: "📱" },
            { step: "03", title: t.how3, desc: t.how3d, icon: "⚡" },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-8 shadow-sm shadow-[#1B2A4A]/5 border border-[#e8ddd0] text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-xs font-bold text-[#D4A843] mb-2">STEP {item.step}</div>
              <h3 className="text-lg font-bold text-[#1B2A4A] mb-3">{item.title}</h3>
              <p className="text-sm text-[#7a6a58] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
