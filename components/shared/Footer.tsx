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
    guide: "미션 가이드",
    betaLabel: "베타",
  },
  ja: {
    service: "コアコンテンツ: Legend of Korea（伝説旅ミッション）",
    company: "会社情報",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    partner: "パートナーお問い合わせ",
    guide: "ミッションガイド",
    betaLabel: "ベータ版",
  },
  en: {
    service: "Core Content: Legend of Korea (Legend Travel Missions)",
    company: "Company",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    partner: "Partnership",
    guide: "Mission Guide",
    betaLabel: "Beta",
  },
  "zh-CN": {
    service: "核心内容：Legend of Korea（传说旅行任务）",
    company: "公司信息",
    terms: "服务条款",
    privacy: "隐私政策",
    partner: "合作咨询",
    guide: "任务指南",
    betaLabel: "测试版",
  },
  "zh-TW": {
    service: "核心內容：Legend of Korea（傳說旅行任務）",
    company: "公司資訊",
    terms: "服務條款",
    privacy: "隱私權政策",
    partner: "合作諮詢",
    guide: "任務指南",
    betaLabel: "測試版",
  },
}

export function Footer({ locale }: FooterProps) {
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko
  const year = new Date().getFullYear()

  return (
    <footer className="bg-mist border-t border-stone/20 text-stone">
      <div className="max-w-6xl mx-auto px-4 py-14 text-center">
        {/* 브랜드 로고 */}
        <p
          style={{
            fontFamily: "Georgia, 'Palatino', 'Times New Roman', serif",
            fontStyle: 'italic',
            fontSize: '28px',
            fontWeight: 400,
            letterSpacing: '3px',
            color: '#1F2937',
          }}
          className="mb-2"
        >
          Cloud with you
        </p>
        <p className="text-xs text-stone uppercase tracking-[4px] mb-6">
          YOUR TRAVEL COMPANION
        </p>

        {/* 서비스명 */}
        <p className="text-sm text-stone mb-8">{t.service}</p>

        {/* 링크 */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-8">
          <Link href={`/${locale}/about`} className="text-stone hover:text-ink transition-colors">
            {t.company}
          </Link>
          <Link href={`/${locale}/quest/guide`} className="text-stone hover:text-ink transition-colors">
            📖 {t.guide}
          </Link>
          <Link href={`/${locale}/terms`} className="text-stone hover:text-ink transition-colors">
            {t.terms}
          </Link>
          <Link href={`/${locale}/privacy`} className="text-stone hover:text-ink transition-colors">
            {t.privacy}
          </Link>
          <Link href={`/${locale}/partner`} className="text-stone hover:text-ink transition-colors">
            {t.partner}
          </Link>
        </div>

        {/* 카피라이트 — 동적 연도 + 베타 라벨 */}
        <p className="text-xs text-stone/70">
          © {year} Cloud with you ({t.betaLabel}). All rights reserved.
        </p>
      </div>
    </footer>
  )
}