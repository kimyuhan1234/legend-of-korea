import Link from "next/link"

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
}

const LABEL = {
  ko: {
    title: "미션 키트 구매",
    subtitle: "키트를 받고 전설 속으로 떠나세요",
    solo: "1인 키트",
    couple: "2인 키트",
    includes: "포함 사항",
    includeItems: ["인쇄된 미션 카드", "전설 스토리북", "도장 스탬프", "비밀 봉투"],
    delivery: "예약 숙소로 무료 배송",
    outOfStock: "품절",
    restock: "재입고 알림",
    buyNow: "지금 구매하기",
    perPerson: "/ 인",
  },
  ja: {
    title: "ミッションキット購入",
    subtitle: "キットを受け取って伝説の旅へ",
    solo: "1人キット",
    couple: "2人キット",
    includes: "含まれるもの",
    includeItems: ["印刷されたミッションカード", "伝説ストーリーブック", "スタンプ", "秘密封筒"],
    delivery: "ご予約の宿泊施設へ無料配送",
    outOfStock: "品切れ",
    restock: "再入荷通知",
    buyNow: "今すぐ購入",
    perPerson: "/ 人",
  },
  en: {
    title: "Mission Kit Purchase",
    subtitle: "Get your kit and step into the legend",
    solo: "Solo Kit",
    couple: "Couple Kit",
    includes: "What's included",
    includeItems: ["Printed mission cards", "Legend storybook", "Stamp seal", "Secret envelope"],
    delivery: "Free delivery to your accommodation",
    outOfStock: "Out of Stock",
    restock: "Notify me",
    buyNow: "Buy Now",
    perPerson: "/ person",
  },
}

export function KitPurchaseCard({ courseId, kits, locale }: KitPurchaseCardProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko
  const soloKit = kits.find((k) => k.option_type === "solo")
  const coupleKit = kits.find((k) => k.option_type === "couple")

  const hasKits = soloKit || coupleKit

  return (
    <div className="bg-white rounded-3xl border border-[#e8ddd0] overflow-hidden shadow-sm">
      <div className={hasKits ? "grid md:grid-cols-2 gap-0" : ""}>
        {/* 왼쪽: 설명 */}
        <div className="p-8 bg-[#1B2A4A] text-white">
          <h2 className="text-2xl font-black mb-2">📦 {label.title}</h2>
          <p className="text-white/70 mb-8">{label.subtitle}</p>

          <div>
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider mb-3">
              {label.includes}
            </p>
            <ul className="space-y-2">
              {label.includeItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-[#D4A843]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
            <span>🚚</span>
            <span>{label.delivery}</span>
          </div>
        </div>

        {/* 오른쪽: 구매 옵션 (kit이 있을 때만 렌더링) */}
        {hasKits && (
          <div className="p-8 flex flex-col gap-4 justify-center">
            {soloKit && (
              <KitOption
                kit={soloKit}
                label={label}
                optionLabel={label.solo}
                courseId={courseId}
                locale={locale}
              />
            )}
            {coupleKit && (
              <KitOption
                kit={coupleKit}
                label={label}
                optionLabel={label.couple}
                courseId={courseId}
                locale={locale}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function KitOption({
  kit,
  label,
  optionLabel,
  courseId,
  locale,
}: {
  kit: KitProduct
  label: (typeof LABEL)["ko"]
  optionLabel: string
  courseId: string
  locale: string
}) {
  const inStock = kit.stock > 0 && kit.is_active

  return (
    <div className="rounded-2xl border border-[#e8ddd0] p-5 hover:border-[#D4A843]/60 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-[#1B2A4A]">{optionLabel}</span>
        {!inStock && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
            {label.outOfStock}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[#1B2A4A] mb-4">
        ₩{kit.price.toLocaleString()}
        <span className="text-sm font-normal text-[#7a6a58] ml-1">{label.perPerson}</span>
      </p>

      {inStock ? (
        <Link
          href={`/${locale}/courses/${courseId}/order?kit=${kit.id}`}
          className="block w-full text-center px-6 py-3 rounded-xl bg-[#D4A843] text-[#1B2A4A] font-bold hover:bg-[#e0b84e] transition-colors"
        >
          {label.buyNow}
        </Link>
      ) : (
        <button className="w-full px-6 py-3 rounded-xl bg-[#F5F0E8] text-[#7a6a58] font-medium border border-[#e8ddd0] hover:bg-[#eee5d8] transition-colors">
          {label.restock}
        </button>
      )}
    </div>
  )
}
