"use client"

import { formatPriceParts } from '@/lib/currency'

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

const DIGITAL_FEATURES = [
  { icon: '📱', label: { ko: 'GPS 미션 해금', en: 'GPS Mission Unlock', ja: 'GPSミッション解除' } },
  { icon: '📸', label: { ko: '레트로 카메라 필터', en: 'Retro Camera Filter', ja: 'レトロカメラフィルター' } },
  { icon: '🛂', label: { ko: '디지털 여권 스탬프', en: 'Digital Passport Stamp', ja: 'デジタルパスポート' } },
  { icon: '🎖️', label: { ko: '프로필 훈장', en: 'Profile Badge', ja: 'プロフィール勲章' } },
  { icon: '🏆', label: { ko: '월간 우승 실물 상품', en: 'Monthly Winner Prize', ja: '月間優勝賞品' } },
]

const PLAN_LABEL = {
  ko: { title: '구독 플랜 확인', plan: 'Legend of Korea 패스', desc: '모든 미션 해금 + 디지털 혜택' },
  en: { title: 'Confirm Plan', plan: 'Legend of Korea Pass', desc: 'Unlock all missions + digital perks' },
  ja: { title: 'プラン確認', plan: 'Legend of Korea パス', desc: '全ミッション解除＋デジタル特典' },
  'zh-CN': { title: '确认订阅', plan: 'Legend of Korea 通行证', desc: '解锁所有任务 + 数字特权' },
  'zh-TW': { title: '確認訂閱', plan: 'Legend of Korea 通行證', desc: '解鎖所有任務 + 數位特權' },
}

const PRICE_KRW = 6900
const MONTH_SUFFIX: Record<string, string> = {
  ko: '/월',
  ja: '/月',
  en: '/month',
  'zh-CN': '/月',
  'zh-TW': '/月',
}

export function Step1KitSelect({ kits, coupons, data, onChange, onNext, t, locale }: Step1Props) {
  const lk = (locale || 'ko') as string
  const plan = PLAN_LABEL[lk as keyof typeof PLAN_LABEL] || PLAN_LABEL.en || PLAN_LABEL.ko

  const { primary, secondary } = formatPriceParts(PRICE_KRW, lk)
  const monthSuffix = MONTH_SUFFIX[lk] || MONTH_SUFFIX.en
  const priceDisplay = secondary
    ? `${primary}${monthSuffix} (${secondary}${monthSuffix})`
    : `${primary}${monthSuffix}`

  // 첫 kit을 자동 선택 (상위 호환)
  const firstKit = kits[0]
  if (firstKit && !data.kitId) {
    onChange({ ...data, kitId: firstKit.id, quantity: 1 })
  }

  const selectedCoupon = coupons.find((c) => c.id === data.couponId)
  const basePrice = PRICE_KRW
  const discount = selectedCoupon ? Math.floor(basePrice * (selectedCoupon.discount_rate / 100)) : 0
  const total = basePrice - discount

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#111]">{plan.title}</h2>

      {/* 구독 플랜 카드 */}
      <div className="border-2 border-mint-deep rounded-2xl p-6 bg-gradient-to-br from-mint-light/30 to-white">
        <div className="text-center mb-5">
          <p className="text-sm font-bold text-mint-deep uppercase tracking-widest mb-1">LEGEND OF KOREA PASS</p>
          <p className="text-4xl font-black text-[#111]">{priceDisplay}</p>
          <p className="text-sm text-stone mt-1">{plan.desc}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DIGITAL_FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-mist">
              <span className="text-lg">{f.icon}</span>
              <span className="text-xs font-medium text-[#111]">{(f.label as Record<string, string>)[lk] || f.label.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 쿠폰 */}
      {coupons.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">{t.applyCoupon}</label>
          <select
            value={data.couponId}
            onChange={(e) => onChange({ ...data, couponId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-mist bg-white text-[#111] text-sm focus:outline-none focus:border-mint-deep transition-colors"
          >
            <option value="">{t.selectCoupon}</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.discount_rate}% {t.discount} ({coupon.code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 금액 요약 */}
      <div className="bg-cloud rounded-2xl p-5 space-y-2">
        <div className="flex justify-between text-sm text-stone">
          <span>{plan.plan}</span>
          <span>₩{basePrice.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>{t.discount} ({selectedCoupon?.discount_rate}%)</span>
            <span>-₩{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="h-px bg-mist my-2" />
        <div className="flex justify-between font-black text-[#111] text-lg">
          <span>{t.finalPrice}</span>
          <span>₩{total.toLocaleString()}</span>
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-mint to-mint-deep text-white font-bold text-lg hover:opacity-90 transition-colors"
      >
        {t.next} →
      </button>
    </div>
  )
}
