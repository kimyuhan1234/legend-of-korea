import Link from 'next/link'
import Image from 'next/image'

interface FoodMatchingSectionProps {
  locale: string
  title: string
  subtitle: string
  cta: string
}

export function FoodMatchingSection({ locale, title, subtitle, cta }: FoodMatchingSectionProps) {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* 좌: 텍스트 */}
          <div className="flex-1 flex items-center px-8 md:px-16 py-16 md:py-24 order-2 md:order-1">
            <div className="max-w-md">
              <h2 className="text-2xl md:text-4xl font-black text-[#2D1B69] leading-tight mb-3">
                {title}
              </h2>
              <p className="text-lg md:text-2xl font-medium text-[#FF6B35] mb-8">
                {subtitle}
              </p>
              <Link
                href={`/${locale}/food/dupe`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D1B69] text-white font-bold hover:bg-[#3d2880] transition-colors"
              >
                {cta}
              </Link>
            </div>
          </div>

          {/* 우: 이미지 */}
          <div className="flex-1 relative min-h-[300px] md:min-h-[500px] order-1 md:order-2 bg-[#FFF8F0]">
            {/* TODO: /images/food/bibimbap-compare.jpg */}
            <Image
              src="/images/food/bibimbap-compare.jpg"
              alt="비빔밥 vs 외국 음식 비교"
              fill
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {/* fallback gradient */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🍱</div>
                <p className="text-[#7a6a58] text-sm">비빔밥 × 세계 음식</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
