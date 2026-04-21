'use client'

interface FoodImagePlaceholderProps {
  name: string
  tags?: string[]
  placeholderEmoji?: string
}

interface CategoryStyle {
  gradient: string
  emoji: string
}

function detectCategory(name: string, tags: string[] = []): CategoryStyle {
  const joined = [name, ...tags].join(' ')
  if (/찌개|탕|국|전골|샤브|뚝배기|지리/.test(joined))
    return { gradient: 'from-orange-400 via-orange-500 to-red-500', emoji: '🍲' }
  if (/면|국수|라면|냉면|수제비|칼국수/.test(joined))
    return { gradient: 'from-yellow-300 via-amber-400 to-orange-400', emoji: '🍜' }
  if (/해산물|생선|굴|조개|낙지|오징어|게|새우|회|전복|홍합|미역|다시마/.test(joined))
    return { gradient: 'from-blue-400 via-teal-400 to-cyan-500', emoji: '🦞' }
  if (/고기|삼겹|갈비|불고기|돼지|소고기|닭|오리|육|수육/.test(joined))
    return { gradient: 'from-red-400 via-rose-500 to-pink-500', emoji: '🥩' }
  if (/밥|비빔|덮밥|볶음밥|솥밥|주먹밥|김밥/.test(joined))
    return { gradient: 'from-lime-400 via-green-500 to-emerald-500', emoji: '🍚' }
  if (/전|부침|파전|해물전|김치전|빈대떡/.test(joined))
    return { gradient: 'from-amber-300 via-yellow-400 to-amber-500', emoji: '🥞' }
  if (/술|막걸리|동동주|소주|맥주/.test(joined))
    return { gradient: 'from-purple-300 via-violet-400 to-indigo-500', emoji: '🍶' }
  if (/떡|한과|강정|찹쌀|경단|송편/.test(joined))
    return { gradient: 'from-pink-300 via-rose-300 to-fuchsia-400', emoji: '🍡' }
  return { gradient: 'from-stone-300 via-stone-400 to-stone-500', emoji: '🍽️' }
}

export function FoodImagePlaceholder({ name, tags = [], placeholderEmoji }: FoodImagePlaceholderProps) {
  const { gradient, emoji } = detectCategory(name, tags)
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
      <span className="text-4xl select-none">{placeholderEmoji ?? emoji}</span>
    </div>
  )
}
