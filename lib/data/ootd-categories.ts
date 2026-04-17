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

/** 아이템별 개별 아이콘 매핑 */
export const ITEM_ICONS: Record<string, string> = {
  // 상의 — 아우터
  blazer: '🧥', cardigan: '🧶', trenchCoat: '🧥', windbreaker: '🧥', hoodie: '👕',
  overcoat: '🧥', longCoat: '🧥', woolCoat: '🧥', herringboneCoat: '🧥', navalCoat: '🧥',
  frillCoat: '🧥', vintageCoat: '🧥', vintageBlouson: '🧥', longWoolCoat: '🧥',
  paddedJacket: '🧥', longPadding: '🧥', fleece: '🧥', denimJacket: '🧥',
  lightOuterwear: '🧥', bomberJacket: '🧥', linenJacket: '🧥', tweedJacket: '🧥', quitedVest: '🦺',
  // 상의 — 이너
  linenShirt: '👔', cottonTee: '👕', stripedShirt: '👔', graphicTee: '👕', printTee: '👕',
  oxfordShirt: '👔', checkShirt: '👔', turtleneck: '🧣', crewneckKnit: '🧶', cableKnit: '🧶',
  knit: '🧶', sweater: '🧶', sweatshirt: '👕', blouse: '👚', pastelBlouse: '👚',
  halterTop: '👚', offShoulderTop: '👚', sleevelessTop: '👚', puffSleeve: '👚',
  // 하의 — 바지
  slimPants: '👖', widePants: '👖', shorts: '🩳', joggerPants: '👖', chinoPants: '👖',
  cottonPants: '👖', slacks: '👖', cargoPants: '👖', corduroyPants: '👖', jeans: '👖',
  denim: '👖', trekkingPants: '👖', boardShorts: '🩳', wideShorts: '🩳',
  leggings: '👖', tights: '👖',
  // 하의 — 치마/원피스
  midiSkirt: '👗', flaredSkirt: '👗', floralSkirt: '👗', knitDress: '👗', floralDress: '👗',
  marineDress: '👗', linenDress: '👗', stripedDress: '👗', retroDress: '👗', maxiDress: '👗',
  sleevelessDress: '👗',
  // 신발
  loafer: '👞', sneakers: '👟', ankleBoots: '👢', chelseaBoots: '👢', hikingBoots: '🥾',
  hikingShoes: '🥾', sandals: '🩴', espadrilles: '🩴', canvasShoes: '👟', maryJane: '👠',
  boatShoes: '👞', derbyShoes: '👞', flatShoes: '🥿', flatSandal: '🩴',
  platformSandals: '🩴', chunkySneakers: '👟', oldSchoolSneakers: '👟',
  runningShoes: '👟', slider: '🩴', slipOn: '👟',
  // 소품
  crossbag: '👜', toteBag: '👜', bucketBag: '👜', sunglasses: '🕶️', hat: '👒',
  cap: '🧢', beanie: '🧶', strawHat: '👒', scarf: '🧣',
}

/** nameKey 또는 key에서 아이콘 가져오기 */
export function getItemIcon(nameKeyOrKey: string): string {
  const key = nameKeyOrKey.replace('ootd.items.', '')
  return ITEM_ICONS[key] || '👔'
}

/** nameKey 에서 카테고리 찾기 */
export function getItemCategory(nameKey: string): OotdCategory {
  const key = nameKey.replace('ootd.items.', '')
  for (const [cat, def] of Object.entries(OOTD_CATEGORIES)) {
    if (def.items.includes(key)) return cat as OotdCategory
  }
  return 'accessory'
}
