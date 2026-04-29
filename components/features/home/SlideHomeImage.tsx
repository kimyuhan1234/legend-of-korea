import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
  title: string
  subtitle: string
  cta: string
  href: string
  image: string
}

/**
 * 메인 페이지 캐러셀 슬라이드 — 좌측 텍스트 + 우측 이미지 (HomeCommunityPreview 디자인 답습).
 *
 * 기존 SlideFeatureDupe / SlideFeaturePlanner 와 같은 호출 패턴
 * (props 로 title/subtitle/cta 받음) — HomeFeatureCarousel children 으로 균질 사용.
 */
export function SlideHomeImage({ title, subtitle, cta, href, image }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
      {/* 좌: 텍스트 */}
      <div className="md:w-[320px] lg:w-[360px] shrink-0 text-center md:text-left order-2 md:order-1">
        <h2 className="text-2xl md:text-3xl font-black text-mint-deep leading-tight mb-3">
          {title}
        </h2>
        <p className="text-base md:text-lg font-medium text-ink mb-8 leading-relaxed">
          {subtitle}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint-deep text-white font-bold hover:bg-[#7BC8BC] transition-colors"
        >
          {cta}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>

      {/* 우: 이미지 */}
      <div className="flex-1 relative aspect-[4/3] overflow-hidden rounded-2xl group order-1 md:order-2 w-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          quality={90}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  )
}
