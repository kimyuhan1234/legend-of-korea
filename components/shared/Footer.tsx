import Link from "next/link"

interface FooterProps {
  locale: string
}

const TEXT = {
  ko: {
    description: "한국 전래동화 IP를 활용한 QR 기반 셀프 미션 여행 서비스",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    contact: "고객센터",
    copyright: "© 2025 Legend of Korea. All rights reserved.",
    nav: ["코스 탐색", "추억 남기기", "전설 상점"],
    navHref: ["/courses", "/community", "/shop"],
  },
  ja: {
    description: "韓国の昔話IPを活用したQRベースのセルフミッション旅行サービス",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    contact: "お問い合わせ",
    copyright: "© 2025 Legend of Korea. All rights reserved.",
    nav: ["コース探索", "思い出作り", "伝説商店"],
    navHref: ["/courses", "/community", "/shop"],
  },
  en: {
    description: "A QR-based self-guided mission travel service using Korean folklore IP",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    contact: "Contact Us",
    copyright: "© 2025 Legend of Korea. All rights reserved.",
    nav: ["Explore Courses", "Gallery", "Legend Shop"],
    navHref: ["/courses", "/community", "/shop"],
  },
}

export function Footer({ locale }: FooterProps) {
  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  return (
    <footer className="bg-[#F5F3EF] text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 브랜드 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4A843] flex items-center justify-center">
                <span className="text-[#111] font-black text-sm">伝</span>
              </div>
              <span className="font-bold text-lg">Legend of Korea</span>
            </div>
            <p className="text-gray-800/50 text-sm leading-relaxed">{t.description}</p>
          </div>

          {/* 네비게이션 */}
          <div>
            <h3 className="font-semibold text-sm text-gray-800/70 mb-3 uppercase tracking-wider">
              {locale === "ko" ? "서비스" : locale === "ja" ? "サービス" : "Services"}
            </h3>
            <ul className="space-y-2">
              {t.nav.map((label, i) => (
                <li key={i}>
                  <Link
                    href={`/${locale}${t.navHref[i]}`}
                    className="text-sm text-gray-800/60 hover:text-[#D4A843] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 */}
          <div>
            <h3 className="font-semibold text-sm text-gray-800/70 mb-3 uppercase tracking-wider">
              {locale === "ko" ? "정책" : locale === "ja" ? "ポリシー" : "Legal"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/terms`} className="text-sm text-gray-800/60 hover:text-[#D4A843] transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-sm text-gray-800/60 hover:text-[#D4A843] transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <a href="mailto:hello@legendofkorea.kr" className="text-sm text-gray-800/60 hover:text-[#D4A843] transition-colors">
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-800/40 text-xs">{t.copyright}</p>
          {/* 언어 전환 (푸터) */}
          <div className="flex gap-3">
            {["ko", "ja", "en"].map((lang) => (
              <Link
                key={lang}
                href={`/${lang}`}
                className={`text-xs transition-colors ${
                  locale === lang ? "text-[#D4A843]" : "text-gray-800/40 hover:text-gray-800/70"
                }`}
              >
                {lang === "ko" ? "한국어" : lang === "ja" ? "日本語" : "English"}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}