import Link from 'next/link'
import Image from 'next/image'
import { BeautyFoodCard } from './BeautyFoodCard'
import type { FoodHealthData, HealthTag } from '@/lib/data/food-health'

interface BeautyFoodTabProps {
  locale: string
  data: FoodHealthData[]
  category?: string
}

const VALID_CATEGORIES: HealthTag[] = ['skin', 'antiAging', 'immunity', 'digestion', 'diet', 'bone']

const CATEGORY_LABEL: Record<string, Record<HealthTag, string>> = {
  ko:      { skin: '피부 미용', antiAging: '항산화', immunity: '면역력', digestion: '소화',     diet: '다이어트',  bone: '뼈/관절' },
  ja:      { skin: '美肌',      antiAging: '抗酸化', immunity: '免疫力', digestion: '消化',     diet: 'ダイエット', bone: '骨・関節' },
  en:      { skin: 'Skin',      antiAging: 'Anti-aging', immunity: 'Immunity', digestion: 'Digestion', diet: 'Diet',  bone: 'Bone & Joint' },
  'zh-CN': { skin: '护肤',      antiAging: '抗氧化', immunity: '免疫力', digestion: '消化',     diet: '减脂',     bone: '骨骼/关节' },
  'zh-TW': { skin: '護膚',      antiAging: '抗氧化', immunity: '免疫力', digestion: '消化',     diet: '減脂',     bone: '骨骼/關節' },
}

const SELECT_PROMPT: Record<string, string> = {
  ko: '카테고리를 선택하세요',
  ja: 'カテゴリーを選択してください',
  en: 'Choose a category',
  'zh-CN': '请选择类别',
  'zh-TW': '請選擇類別',
}

const BACK_LABEL: Record<string, string> = {
  ko: '← 다른 카테고리',
  ja: '← 他のカテゴリー',
  en: '← Other categories',
  'zh-CN': '← 其他类别',
  'zh-TW': '← 其他類別',
}

const COUNT_LABEL: Record<string, (n: number) => string> = {
  ko: (n) => `${n}가지 음식`,
  ja: (n) => `${n}品`,
  en: (n) => `${n} foods`,
  'zh-CN': (n) => `${n} 种食物`,
  'zh-TW': (n) => `${n} 種食物`,
}

export function BeautyFoodTab({ locale, data, category }: BeautyFoodTabProps) {
  const labels = CATEGORY_LABEL[locale] ?? CATEGORY_LABEL.en
  const isValid = !!category && (VALID_CATEGORIES as string[]).includes(category)

  if (!isValid) {
    const prompt = SELECT_PROMPT[locale] ?? SELECT_PROMPT.en
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <p className="text-center text-stone text-sm font-medium mb-8">{prompt}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {VALID_CATEGORIES.map((id) => (
            <Link
              key={id}
              href={`/${locale}/food/beauty?category=${id}`}
              className="group block relative overflow-hidden rounded-2xl bg-white border border-mist shadow-sm hover:shadow-lg hover:border-mint transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-square">
                <Image
                  src={`/images/beauty-category/${id}.png`}
                  alt={labels[id]}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-4 px-4">
                  <span className="block text-white text-base md:text-lg font-bold">{labels[id]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const tag = category as HealthTag
  const filtered = data.filter((f) => f.healthTags.includes(tag))
  const countFn = COUNT_LABEL[locale] ?? COUNT_LABEL.en
  const backLabel = BACK_LABEL[locale] ?? BACK_LABEL.en

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#111]">{labels[tag]}</h2>
        <Link
          href={`/${locale}/food/beauty`}
          className="shrink-0 text-sm font-bold text-mint-deep hover:underline"
        >
          {backLabel}
        </Link>
      </div>
      <p className="text-xs text-stone font-medium mb-6">{countFn(filtered.length)}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((food) => (
          <BeautyFoodCard key={food.foodId} food={food} locale={locale} />
        ))}
      </div>
    </div>
  )
}
