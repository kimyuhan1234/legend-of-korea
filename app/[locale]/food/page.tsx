import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { buildOgUrl } from '@/lib/seo/og-url'

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: 'K-FOOD | Clouds with you', desc: '지역별 K-Food Spot 큐레이션' },
  ja: { title: 'K-FOOD | Clouds with you', desc: '地域別K-Foodスポットキュレーション' },
  en: { title: 'K-FOOD | Clouds with you', desc: 'Regional K-Food Spot curation' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] ?? META.ko
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legend-of-korea.vercel.app'
  const ogImage = buildOgUrl({
    baseUrl: siteUrl,
    title: m.title.split(' | ')[0],
    subtitle: m.desc,
    tier: 'soft',
    category: 'K-FOOD',
    imagePath: '/images/category-food.png',
  })
  return {
    title: m.title,
    description: m.desc,
    openGraph: {
      title: m.title,
      description: m.desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: m.title }],
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.desc, images: [ogImage] },
  }
}

/** /food 진입 시 K-Food Spot 6 권역 카드(/food/kfood-spot) 로 이동. */
export default function FoodPage({ params }: Props) {
  redirect(`/${params.locale}/food/kfood-spot`)
}
