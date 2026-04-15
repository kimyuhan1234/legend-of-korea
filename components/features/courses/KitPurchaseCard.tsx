'use client'

import { useCart } from '@/lib/contexts/CartContext'
import { useTranslations } from 'next-intl'

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
    title: "미션 키트 소개",
    subtitle: "키트를 받고 전설 속으로 떠나세요",
    solo: "1인 키트",
    couple: "2인 키트",
    includes: "포함 사항",
    includeItems: ["인쇄된 미션 카드", "전설 스토리북", "도장 스탬프", "비밀 봉투"],
    delivery: "예약 숙소로 무료 배송",
    outOfStock: "품절",
    restock: "재입고 알림",
    buyNow: "구매하기",
    buyNowLogin: "로그인 후 구매하기",
    perPerson: "/ 인",
  },
  ja: {
    title: "ミッションキット紹介",
    subtitle: "キットを受け取って伝説の旅へ",
    solo: "1人キット",
    couple: "2人キット",
    includes: "含まれるもの",
    includeItems: ["印刷されたミッションカード", "伝説ストーリーブック", "スタンプ", "秘密封筒"],
    delivery: "ご予約の宿泊施設へ無料配送",
    outOfStock: "品切れ",
    restock: "再入荷通知",
    buyNow: "購入する",
    buyNowLogin: "ログイン後に購入",
    perPerson: "/ 人",
  },
  en: {
    title: "Mission Kit",
    subtitle: "Get your kit and step into the legend",
    solo: "Solo Kit",
    couple: "Couple Kit",
    includes: "What's included",
    includeItems: ["Printed mission cards", "Legend storybook", "Stamp seal", "Secret envelope"],
    delivery: "Free delivery to your accommodation",
    outOfStock: "Out of Stock",
    restock: "Notify me",
    buyNow: "Buy Now",
    buyNowLogin: "Sign in to Buy",
    perPerson: "/ person",
  },
}

interface KitPurchaseCardProps {
  courseId: string
  kits: KitProduct[]
  locale: string
  isLoggedIn: boolean
  className?: string
}

export function KitPurchaseCard({ courseId, kits, locale, isLoggedIn, className }: KitPurchaseCardProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko
  const soloKit = kits.find((k) => k.option_type === "solo")
  const coupleKit = kits.find((k) => k.option_type === "couple")

  return (
    <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-0 overflow-hidden shadow-sm h-full flex flex-col${className ? ` ${className}` : ""}`}>
      <div className="flex-1 grid md:grid-cols-2 gap-0">
        {/* 왼쪽: 설명 */}
        <div className="p-8 bg-gradient-to-br from-mint to-blossom text-ink flex flex-col">
          <h2 className="text-2xl font-black mb-2">📦 {label.title}</h2>
          <p className="text-slate mb-8">{label.subtitle}</p>

          <div className="flex-1">
            <p className="text-xs font-bold text-blossom-deep uppercase tracking-wider mb-3">
              {label.includes}
            </p>
            <ul className="space-y-2">
              {label.includeItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-blossom-deep">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate">
            <span>🚚</span>
            <span>{label.delivery}</span>
          </div>
        </div>

        {/* 오른쪽: 가격 + 구매 버튼 */}
        <div className="p-8 flex flex-col gap-4 justify-center">
          {soloKit && (
            <KitOption
              kit={soloKit}
              label={label}
              optionLabel={label.solo}
              courseId={courseId}
              locale={locale}
              isLoggedIn={isLoggedIn}
            />
          )}
          {coupleKit && (
            <KitOption
              kit={coupleKit}
              label={label}
              optionLabel={label.couple}
              courseId={courseId}
              locale={locale}
              isLoggedIn={isLoggedIn}
            />
          )}
          {/* kit 데이터 없을 때 — 스크롤 안내 */}
          {!soloKit && !coupleKit && (
            <p className="text-sm text-stone text-center py-4">{label.outOfStock}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function KitOption({
  kit,
  label,
  optionLabel,
  courseId,
}: {
  kit: KitProduct
  label: (typeof LABEL)["ko"]
  optionLabel: string
  courseId: string
  locale: string
  isLoggedIn: boolean
}) {
  const { addItem } = useCart()
  const tCart = useTranslations('cart')
  const inStock = kit.stock > 0 && kit.is_active

  const handleAddToCart = () => {
    addItem({
      id: `kit-${courseId}-${kit.id}`,
      type: 'kit',
      name: { ko: optionLabel, en: optionLabel, ja: optionLabel },
      price: kit.price,
      priceDisplay: `₩${kit.price.toLocaleString()}`,
      emoji: '🎁',
      metadata: { courseId, kitId: kit.id, optionType: kit.option_type },
    })
  }

  return (
    <div className="rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-0 p-5 hover:border-blossom-deep/60 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-[#111]">{optionLabel}</span>
        {!inStock && (
          <span className="text-xs px-2 py-0.5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-red-50 text-red-600 border-0 border-red-200">
            {label.outOfStock}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[#111] mb-4">
        ₩{kit.price.toLocaleString()}
        <span className="text-sm font-normal text-stone ml-1">{label.perPerson}</span>
      </p>

      {inStock ? (
        <button
          type="button"
          onClick={handleAddToCart}
          className="block w-full text-center py-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gradient-to-r from-mint to-blossom text-[#111] font-bold text-lg hover:opacity-90 transition"
        >
          🛒 {tCart('add')}
        </button>
      ) : (
        <button className="w-full px-6 py-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-cloud text-stone font-medium border-0 hover:bg-[#eee5d8] transition-colors">
          {label.restock}
        </button>
      )}
    </div>
  )
}
