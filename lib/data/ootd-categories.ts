// 옷 아이템을 4개 카테고리로 분류 — 드롭다운 교체용
// nameKey 에서 'ootd.items.' prefix 를 제거한 key 로 매칭

export type OotdCategory = 'top' | 'bottom' | 'shoes' | 'accessory'

export interface CategoryDef {
  label: { ko: string; en: string; ja: string }
  icon: string
  items: string[] // ootd.items.XXX 의 XXX 부분
}

export const OOTD_CATEGORIES: Record<OotdCategory, CategoryDef> = {
  top: {
    label: { ko: '상의', en: 'Tops', ja: 'トップス' },
    icon: '🧥',
    items: [
      'blazer', 'cardigan', 'trenchCoat', 'windbreaker', 'hoodie', 'linenShirt',
      'cottonTee', 'stripedShirt', 'graphicTee', 'printTee', 'oxfordShirt', 'checkShirt',
      'overcoat', 'longCoat', 'woolCoat', 'herringboneCoat', 'navalCoat', 'frillCoat',
      'vintageCoat', 'vintageBlouson', 'longWoolCoat', 'paddedJacket', 'longPadding',
      'fleece', 'denimJacket', 'lightOuterwear', 'bomberJacket', 'linenJacket',
      'tweedJacket', 'quitedVest', 'turtleneck', 'crewneckKnit', 'cableKnit', 'knit',
      'sweater', 'sweatshirt', 'blouse', 'pastelBlouse', 'halterTop', 'offShoulderTop',
      'sleevelessTop', 'puffSleeve',
    ],
  },
  bottom: {
    label: { ko: '하의', en: 'Bottoms', ja: 'ボトムス' },
    icon: '👖',
    items: [
      'slimPants', 'widePants', 'shorts', 'joggerPants', 'chinoPants', 'cottonPants',
      'slacks', 'cargoPants', 'corduroyPants', 'jeans', 'denim', 'trekkingPants',
      'boardShorts', 'wideShorts', 'leggings', 'tights',
      'midiSkirt', 'flaredSkirt', 'floralSkirt', 'knitDress', 'floralDress',
      'marineDress', 'linenDress', 'stripedDress', 'retroDress', 'maxiDress',
      'sleevelessDress',
    ],
  },
  shoes: {
    label: { ko: '신발', en: 'Shoes', ja: 'シューズ' },
    icon: '👟',
    items: [
      'loafer', 'sneakers', 'ankleBoots', 'chelseaBoots', 'hikingBoots', 'hikingShoes',
      'sandals', 'espadrilles', 'canvasShoes', 'maryJane', 'boatShoes', 'derbyShoes',
      'flatShoes', 'flatSandal', 'platformSandals', 'chunkySneakers', 'oldSchoolSneakers',
      'runningShoes', 'slider', 'slipOn',
    ],
  },
  accessory: {
    label: { ko: '소품', en: 'Accessories', ja: '小物' },
    icon: '👜',
    items: [
      'crossbag', 'toteBag', 'bucketBag', 'sunglasses', 'hat', 'cap', 'beanie',
      'strawHat', 'scarf',
    ],
  },
}

/** nameKey 에서 카테고리 찾기 */
export function getItemCategory(nameKey: string): OotdCategory {
  const key = nameKey.replace('ootd.items.', '')
  for (const [cat, def] of Object.entries(OOTD_CATEGORIES)) {
    if (def.items.includes(key)) return cat as OotdCategory
  }
  return 'accessory'
}
