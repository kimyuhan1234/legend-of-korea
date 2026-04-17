'use client'

interface KitProduct {
  id: string
  option_type: "solo" | "couple"
  price: number
  stock: number
  is_active: boolean
}

interface KitPurchaseCardProps {
  courseId: string
  kits: KitProduct[]
  locale: string
  className?: string
}

const LABEL = {
  ko: {
    title: "디지털 퀘스트 패스",
    subtitle: "구독 하나로 모든 미션을 시작하세요",
    includes: "구독 혜택",
    includeItems: ["GPS 미션 해금", "레트로 카메라 필터", "디지털 여권 스탬프", "프로필 훈장"],
    instant: "즉시 이용 가능",
    subscribe: "구독 시작하기",
    price: "₩6,900/월",
  },
  ja: {
    title: "デジタルクエストパス",
    subtitle: "サブスクリプションで全ミッション開始",
    includes: "サブスク特典",
    includeItems: ["GPSミッション解除", "レトロカメラフィルター", "デジタルパスポート", "プロフィール勲章"],
    instant: "即時利用可能",
    subscribe: "サブスクリプション開始",
    price: "¥750/月",
  },
  en: {
    title: "Digital Quest Pass",
    subtitle: "One subscription to unlock all missions",
    includes: "What's included",
    includeItems: ["GPS Mission Unlock", "Retro Camera Filter", "Digital Passport Stamp", "Profile Badge"],
    instant: "Instant access",
    subscribe: "Start Subscription",
    price: "$5/month",
  },
}

interface KitPurchaseCardProps {
  courseId: string
  kits: KitProduct[]
  locale: string
  isLoggedIn: boolean
  className?: string
}

export function KitPurchaseCard({ courseId, kits: _kits, locale, isLoggedIn: _isLoggedIn, className }: KitPurchaseCardProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  return (
    <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-0 overflow-hidden h-full flex flex-col${className ? ` ${className}` : ""}`}>
      <div className="flex-1 grid md:grid-cols-2 gap-0">
        {/* 왼쪽: 설명 */}
        <div className="p-8 bg-gradient-to-br from-mint to-mint-deep text-white flex flex-col">
          <h2 className="text-2xl font-black mb-2">📱 {label.title}</h2>
          <p className="text-white/80 mb-8">{label.subtitle}</p>

          <div className="flex-1">
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
              {label.includes}
            </p>
            <ul className="space-y-2">
              {label.includeItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-white/70">
            <span>📱</span>
            <span>{label.instant}</span>
          </div>
        </div>

        {/* 오른쪽: 가격 + 구독 버튼 */}
        <div className="p-8 flex flex-col gap-4 justify-center text-center">
          <p className="text-sm font-bold text-mint-deep uppercase tracking-widest">DIGITAL QUEST PASS</p>
          <p className="text-4xl font-black text-[#111]">{label.price}</p>
          <a
            href={`/${locale}/courses/${courseId}/purchase`}
            className="block w-full text-center py-4 rounded-2xl bg-gradient-to-r from-mint to-mint-deep text-white font-bold text-lg hover:opacity-90 transition"
          >
            {label.subscribe}
          </a>
        </div>
      </div>
    </div>
  )
}

