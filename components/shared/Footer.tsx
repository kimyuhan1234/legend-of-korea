import Link from "next/link"

interface FooterProps {
  locale: string
}

const TEXT = {
  ko: {
    service: "핵심 콘텐츠: Legend of Korea (전설 여행 미션)",
    company: "회사 정보",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    partner: "파트너 문의",
  },
  ja: {
    service: "コアコンテンツ: Legend of Korea（伝説旅ミッション）",
    company: "会社情報",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    partner: "パートナーお問い合わせ",
  },
  en: {
    service: "Core Content: Legend of Korea (Legend Travel Missions)",
    company: "Company",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    partner: "Partnership",
  },
}

export function Footer({ locale }: FooterProps) {
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko

  return (
    <footer className="bg-[#1F2937] text-white/70">
      <div className="max-w-6xl mx-auto px-4 py-14 text-center">
        {/* 브랜드 로고 */}
        <p
          style={{
            fontFamily: "Georgia, 'Palatino', 'Times New Roman', serif",
            fontStyle: 'italic',
            fontSize: '28px',
            fontWeight: 400,
            letterSpacing: '3px',
            color: 'white',
          }}
          className="mb-2"
        >
          Cloud with you
        </p>
        <p className="text-xs text-white/40 uppercase tracking-[4px] mb-6">
          YOUR TRAVEL COMPANION
        </p>

        {/* 서비스명 */}
        <p className="text-sm text-white/50 mb-8">{t.service}</p>

        {/* 링크 */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-8">
          <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
            {t.company}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
            {t.terms}
          </Link>
          <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
            {t.privacy}
          </Link>
          <Link href={`/${locale}/partner`} className="hover:text-white transition-colors">
            {t.partner}
          </Link>
        </div>

        {/* 카피라이트 */}
        <p className="text-xs text-white/30">
          © 2026 Cloud with you. All rights reserved.
        </p>
      </div>
    </footer>
  )
}