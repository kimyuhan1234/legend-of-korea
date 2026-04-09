"use client"

interface Kit {
  id: string
  option_type: "solo" | "couple"
  price: number
  stock: number
  is_active: boolean
}

interface Coupon {
  id: string
  discount_rate: number
  code: string
  expires_at: string
}

interface Step1Data {
  kitId: string
  quantity: number
  couponId: string
}

interface Step1Props {
  kits: Kit[]
  coupons: Coupon[]
  data: Step1Data
  onChange: (data: Step1Data) => void
  onNext: () => void
  t: Record<string, string>
  locale: string
}

export function Step1KitSelect({ kits, coupons, data, onChange, onNext, t }: Step1Props) {
  const selectedKit = kits.find((k) => k.id === data.kitId)
  const selectedCoupon = coupons.find((c) => c.id === data.couponId)

  const subtotal = (selectedKit?.price || 0) * data.quantity
  const discount = selectedCoupon ? Math.floor(subtotal * (selectedCoupon.discount_rate / 100)) : 0
  const total = subtotal - discount

  const soloKit = kits.find((k) => k.option_type === "solo")
  const coupleKit = kits.find((k) => k.option_type === "couple")

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#111]">{t.selectKit}</h2>

      {/* 키트 선택 */}
      <div className="grid sm:grid-cols-2 gap-4">
        {soloKit && (
          <KitCard
            kit={soloKit}
            label={t.soloKit}
            isSelected={data.kitId === soloKit.id}
            onSelect={() => onChange({ ...data, kitId: soloKit.id })}
          />
        )}
        {coupleKit && (
          <KitCard
            kit={coupleKit}
            label={t.coupleKit}
            isSelected={data.kitId === coupleKit.id}
            onSelect={() => onChange({ ...data, kitId: coupleKit.id })}
          />
        )}
      </div>

      {/* 수량 */}
      {data.kitId && (
        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">{t.quantity}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange({ ...data, quantity: Math.max(1, data.quantity - 1) })}
              className="w-10 h-10 rounded-xl border border-[#e8ddd0] bg-white text-[#111] font-bold text-lg hover:bg-[#F5F0E8] transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center font-bold text-[#111] text-lg">{data.quantity}</span>
            <button
              onClick={() => onChange({ ...data, quantity: Math.min(5, data.quantity + 1) })}
              className="w-10 h-10 rounded-xl border border-[#e8ddd0] bg-white text-[#111] font-bold text-lg hover:bg-[#F5F0E8] transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* 쿠폰 */}
      <div>
        <label className="block text-sm font-semibold text-[#111] mb-2">{t.applyCoupon}</label>
        {coupons.length === 0 ? (
          <p className="text-sm text-[#7a6a58] bg-[#F5F0E8] rounded-xl px-4 py-3">{t.noCoupon}</p>
        ) : (
          <select
            value={data.couponId}
            onChange={(e) => onChange({ ...data, couponId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#e8ddd0] bg-white text-[#111] text-sm focus:outline-none focus:border-[#D4A843] transition-colors"
          >
            <option value="">{t.selectCoupon}</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.discount_rate}% {t.discount} ({coupon.code})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 금액 요약 */}
      {data.kitId && (
        <div className="bg-[#F5F0E8] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between text-sm text-[#7a6a58]">
            <span>{t.totalPrice}</span>
            <span>₩{subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>{t.discount} ({selectedCoupon?.discount_rate}%)</span>
              <span>−₩{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="h-px bg-[#e8ddd0] my-2" />
          <div className="flex justify-between font-black text-[#111] text-lg">
            <span>{t.finalPrice}</span>
            <span>₩{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={!data.kitId}
        className="w-full py-4 rounded-2xl bg-[#F5F3EF] text-white font-bold text-lg hover:bg-[#243a63] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t.next} →
      </button>
    </div>
  )
}

function KitCard({
  kit,
  label,
  isSelected,
  onSelect,
}: {
  kit: Kit
  label: string
  isSelected: boolean
  onSelect: () => void
}) {
  const inStock = kit.stock > 0 && kit.is_active
  return (
    <button
      onClick={onSelect}
      disabled={!inStock}
      className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all ${
        isSelected
          ? "border-[#D4A843] bg-[#D4A843]/5"
          : inStock
          ? "border-[#e8ddd0] bg-white hover:border-[#D4A843]/50"
          : "border-[#e8ddd0] bg-[#F5F0E8] opacity-50 cursor-not-allowed"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D4A843] flex items-center justify-center text-white text-xs font-bold">
          ✓
        </div>
      )}
      <div className="text-2xl mb-2">📦</div>
      <p className="font-bold text-[#111] mb-1">{label}</p>
      <p className="text-xl font-black text-[#111]">₩{kit.price.toLocaleString()}</p>
      {!inStock && (
        <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
          품절
        </span>
      )}
    </button>
  )
}
