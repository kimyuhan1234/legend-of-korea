import { Metadata } from 'next'
import { FoodTabNav } from '@/components/features/food/FoodTabNav'
import { BeautyFoodTab } from '@/components/features/food/BeautyFoodTab'
import { foodHealthData } from '@/lib/data/food-health'

interface Props {
  params: { locale: string }
}

const META = {
  ko: { title: 'K-FOOD 뷰티 푸드 | Cloud with you', desc: '한국 음식의 건강·미용 효능을 레이더 그래프로 확인하세요' },
  ja: { title: 'K-FOOD ビューティーフード | Cloud with you', desc: '韓国料理の健康・美容効果をレーダーチャートで確認' },
  en: { title: 'K-FOOD Beauty Food | Cloud with you', desc: 'Discover the health & beauty benefits of Korean food' },
  'zh-CN': { title: 'K-FOOD 美容美食 | Cloud with you', desc: '通过雷达图了解韩国美食的健康与美容功效' },
  'zh-TW': { title: 'K-FOOD 美容美食 | Cloud with you', desc: '透過雷達圖了解韓國美食的健康與美容功效' },
}

const HERO = {
  ko:     { badge: '🌿 뷰티 푸드', title: '먹으면 예뻐지는 K-Food', subtitle: '81가지 한국 음식의 건강 효능을 레이더 그래프로 한눈에 확인하세요.' },
  ja:     { badge: '🌿 ビューティーフード', title: '食べて美しくなるK-Food', subtitle: '81品の韓国料理の健康効果をレーダーチャートで一目で確認できます。' },
  en:     { badge: '🌿 Beauty Food', title: 'K-Food That Makes You Glow', subtitle: 'Discover health benefits of 81 Korean dishes visualized with radar charts.' },
  'zh-CN': { badge: '🌿 美容美食', title: '吃出美丽的K-Food', subtitle: '通过雷达图一目了然地查看81种韩国美食的健康功效。' },
  'zh-TW': { badge: '🌿 美容美食', title: '吃出美麗的K-Food', subtitle: '透過雷達圖一目瞭然地查看81種韓國美食的健康功效。' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale as keyof typeof META] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function BeautyFoodPage({ params }: Props) {
  const { locale } = params
  const h = HERO[locale as keyof typeof HERO] ?? HERO.ko

  return (
    <div className="min-h-screen bg-snow">
      {/* Hero */}
      <div className="bg-gradient-to-br from-mint-light via-peach to-blossom border-b border-mist py-20 md:py-28 px-6 md:px-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white text-mint-deep text-xs font-bold uppercase tracking-widest mb-5 shadow-sm">
          {h.badge}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#111] mb-4 leading-tight">
          {h.title}
        </h1>
        <p className="text-stone text-base md:text-lg font-medium max-w-xl mx-auto">
          {h.subtitle}
        </p>
      </div>

      {/* Tab Nav */}
      <FoodTabNav locale={locale} activeTab="beauty" />

      {/* Beauty food filter + grid */}
      <BeautyFoodTab locale={locale} data={foodHealthData} />
    </div>
  )
}
