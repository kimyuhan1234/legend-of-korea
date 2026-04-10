// ─────────────────────────────────────────────
//  lib/data/ootd.ts
//  날씨 코디 추천 데이터 모델 + 목업 데이터
// ─────────────────────────────────────────────

export type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'snowy'

export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export interface DailyWeather {
  date: string        // 'YYYY-MM-DD'
  dayOfWeek: DayOfWeek
  condition: WeatherCondition
  highTemp: number    // °C
  lowTemp: number
  humidity: number    // %
}

// cold: ~14°C / mild: 15~22°C / hot: 23°C~
export type TempRange = 'cold' | 'mild' | 'hot'

export interface OutfitItem {
  nameKey: string   // next-intl 키 (예: 'ootd.items.trenchCoat')
  icon: string      // 이모지
}

export interface OutfitRecommendation {
  gender: 'male' | 'female'
  tempRange: TempRange
  items: OutfitItem[]   // 3~4개 조합
  tipKey: string        // 한줄 팁 다국어 키
}

export interface CityTheme {
  cityId: string
  nameKey: string
  theme: string           // 영문 테마명
  descriptionKey: string
  outfits: OutfitRecommendation[]  // 6개 (gender 2 × tempRange 3)
}

/** highTemp 기준으로 기온 구간 반환 */
export function getTempRange(highTemp: number): TempRange {
  if (highTemp <= 14) return 'cold'
  if (highTemp >= 23) return 'hot'
  return 'mild'
}

/** WeatherCondition → 이모지 */
export const WEATHER_EMOJI: Record<WeatherCondition, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
}

// ─────────────────────────────────────────────
//  8개 도시 × 7일 날씨 (2026-04-10 ~ 04-16)
// ─────────────────────────────────────────────
export const CITY_WEATHER: Record<string, DailyWeather[]> = {
  seoul: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'partly_cloudy', highTemp: 17, lowTemp: 9,  humidity: 55 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 19, lowTemp: 10, humidity: 45 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'sunny',         highTemp: 20, lowTemp: 11, humidity: 42 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'cloudy',        highTemp: 15, lowTemp: 9,  humidity: 65 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 13, lowTemp: 8,  humidity: 80 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 16, lowTemp: 9,  humidity: 58 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 18, lowTemp: 10, humidity: 48 },
  ],
  busan: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'sunny',         highTemp: 18, lowTemp: 12, humidity: 58 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 20, lowTemp: 13, humidity: 50 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'partly_cloudy', highTemp: 19, lowTemp: 12, humidity: 55 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'cloudy',        highTemp: 16, lowTemp: 11, humidity: 68 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 14, lowTemp: 10, humidity: 82 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 17, lowTemp: 11, humidity: 62 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 19, lowTemp: 12, humidity: 52 },
  ],
  jeju: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'partly_cloudy', highTemp: 19, lowTemp: 13, humidity: 70 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 21, lowTemp: 14, humidity: 60 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'sunny',         highTemp: 22, lowTemp: 15, humidity: 55 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'partly_cloudy', highTemp: 18, lowTemp: 13, humidity: 72 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 16, lowTemp: 12, humidity: 88 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'cloudy',        highTemp: 17, lowTemp: 12, humidity: 75 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 20, lowTemp: 13, humidity: 62 },
  ],
  gyeongju: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'sunny',         highTemp: 18, lowTemp: 8,  humidity: 45 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 19, lowTemp: 9,  humidity: 40 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'partly_cloudy', highTemp: 18, lowTemp: 9,  humidity: 48 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'cloudy',        highTemp: 14, lowTemp: 8,  humidity: 62 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 12, lowTemp: 7,  humidity: 78 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 15, lowTemp: 8,  humidity: 55 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 17, lowTemp: 9,  humidity: 45 },
  ],
  tongyeong: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'sunny',         highTemp: 19, lowTemp: 13, humidity: 60 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 21, lowTemp: 14, humidity: 52 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'partly_cloudy', highTemp: 20, lowTemp: 13, humidity: 58 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'cloudy',        highTemp: 17, lowTemp: 12, humidity: 70 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 15, lowTemp: 11, humidity: 85 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 18, lowTemp: 12, humidity: 65 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 20, lowTemp: 13, humidity: 55 },
  ],
  cheonan: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'partly_cloudy', highTemp: 16, lowTemp: 7,  humidity: 52 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 18, lowTemp: 8,  humidity: 44 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'sunny',         highTemp: 19, lowTemp: 9,  humidity: 42 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'cloudy',        highTemp: 14, lowTemp: 8,  humidity: 62 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 12, lowTemp: 7,  humidity: 78 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 15, lowTemp: 8,  humidity: 55 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 17, lowTemp: 9,  humidity: 48 },
  ],
  yongin: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'partly_cloudy', highTemp: 17, lowTemp: 8,  humidity: 50 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 18, lowTemp: 9,  humidity: 44 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'sunny',         highTemp: 19, lowTemp: 9,  humidity: 42 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'cloudy',        highTemp: 14, lowTemp: 8,  humidity: 62 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'rainy',         highTemp: 12, lowTemp: 7,  humidity: 78 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 15, lowTemp: 8,  humidity: 55 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 17, lowTemp: 9,  humidity: 48 },
  ],
  icheon: [
    { date: '2026-04-10', dayOfWeek: 'FRI', condition: 'partly_cloudy', highTemp: 17, lowTemp: 8,  humidity: 50 },
    { date: '2026-04-11', dayOfWeek: 'SAT', condition: 'sunny',         highTemp: 18, lowTemp: 9,  humidity: 44 },
    { date: '2026-04-12', dayOfWeek: 'SUN', condition: 'sunny',         highTemp: 19, lowTemp: 9,  humidity: 42 },
    { date: '2026-04-13', dayOfWeek: 'MON', condition: 'partly_cloudy', highTemp: 15, lowTemp: 8,  humidity: 58 },
    { date: '2026-04-14', dayOfWeek: 'TUE', condition: 'cloudy',        highTemp: 13, lowTemp: 7,  humidity: 70 },
    { date: '2026-04-15', dayOfWeek: 'WED', condition: 'partly_cloudy', highTemp: 15, lowTemp: 8,  humidity: 56 },
    { date: '2026-04-16', dayOfWeek: 'THU', condition: 'sunny',         highTemp: 17, lowTemp: 9,  humidity: 48 },
  ],
}

// ─────────────────────────────────────────────
//  8개 도시 테마 & 옷차림 추천
// ─────────────────────────────────────────────
export const CITY_THEMES: CityTheme[] = [
  // ── 서울 (Trendy & Urban) ──────────────────
  {
    cityId: 'seoul', nameKey: 'ootd.cities.seoul.name',
    theme: 'Trendy & Urban', descriptionKey: 'ootd.cities.seoul.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.overcoat',     icon: '🧥' }, { nameKey: 'ootd.items.turtleneck',  icon: '👕' },
                { nameKey: 'ootd.items.slimPants',    icon: '👖' }, { nameKey: 'ootd.items.ankleBoots',  icon: '👞' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.longCoat',     icon: '🧥' }, { nameKey: 'ootd.items.knitDress',   icon: '👗' },
                { nameKey: 'ootd.items.tights',       icon: '🧦' }, { nameKey: 'ootd.items.chelseaBoots',icon: '👢' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.indoorCool',
        items: [{ nameKey: 'ootd.items.trenchCoat',   icon: '🧥' }, { nameKey: 'ootd.items.crewneckKnit',icon: '👕' },
                { nameKey: 'ootd.items.widePants',    icon: '👖' }, { nameKey: 'ootd.items.sneakers',    icon: '👟' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.indoorCool',
        items: [{ nameKey: 'ootd.items.blazer',       icon: '🧥' }, { nameKey: 'ootd.items.midiSkirt',   icon: '👗' },
                { nameKey: 'ootd.items.loafer',       icon: '👠' }, { nameKey: 'ootd.items.crossbag',    icon: '👜' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.linenShirt',   icon: '👔' }, { nameKey: 'ootd.items.shorts',      icon: '🩳' },
                { nameKey: 'ootd.items.slipOn',       icon: '👟' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.linenDress',   icon: '👗' }, { nameKey: 'ootd.items.flatSandal',  icon: '🩴' },
                { nameKey: 'ootd.items.sunglasses',   icon: '🕶️' }] },
    ],
  },

  // ── 부산 (Marine & Chill) ──────────────────
  {
    cityId: 'busan', nameKey: 'ootd.cities.busan.name',
    theme: 'Marine & Chill', descriptionKey: 'ootd.cities.busan.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.windprotect',
        items: [{ nameKey: 'ootd.items.bomberJacket', icon: '🧥' }, { nameKey: 'ootd.items.hoodie',      icon: '👕' },
                { nameKey: 'ootd.items.cargoPants',   icon: '👖' }, { nameKey: 'ootd.items.hikingShoes', icon: '👟' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.windprotect',
        items: [{ nameKey: 'ootd.items.bomberJacket', icon: '🧥' }, { nameKey: 'ootd.items.leggings',    icon: '🧦' },
                { nameKey: 'ootd.items.hikingShoes',  icon: '👟' }, { nameKey: 'ootd.items.beanie',      icon: '🧢' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.stripedShirt', icon: '👔' }, { nameKey: 'ootd.items.denim',       icon: '👖' },
                { nameKey: 'ootd.items.canvasShoes',  icon: '👟' }, { nameKey: 'ootd.items.sunglasses',  icon: '🕶️' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.marineDress',  icon: '👗' }, { nameKey: 'ootd.items.espadrilles', icon: '👡' },
                { nameKey: 'ootd.items.toteBag',      icon: '👜' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.linenShirt',   icon: '👔' }, { nameKey: 'ootd.items.boardShorts', icon: '🩳' },
                { nameKey: 'ootd.items.slider',       icon: '🩴' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.halterTop',    icon: '👚' }, { nameKey: 'ootd.items.floralSkirt', icon: '👗' },
                { nameKey: 'ootd.items.slider',       icon: '🩴' }] },
    ],
  },

  // ── 제주 (Nature & Relax) ──────────────────
  {
    cityId: 'jeju', nameKey: 'ootd.cities.jeju.name',
    theme: 'Nature & Relax', descriptionKey: 'ootd.cities.jeju.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.windprotect',
        items: [{ nameKey: 'ootd.items.windbreaker',  icon: '🧥' }, { nameKey: 'ootd.items.fleece',      icon: '🧶' },
                { nameKey: 'ootd.items.trekkingPants',icon: '👖' }, { nameKey: 'ootd.items.hikingBoots', icon: '🥾' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.windprotect',
        items: [{ nameKey: 'ootd.items.windbreaker',  icon: '🧥' }, { nameKey: 'ootd.items.fleece',      icon: '🧶' },
                { nameKey: 'ootd.items.joggerPants',  icon: '👖' }, { nameKey: 'ootd.items.sneakers',    icon: '👟' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.umbrella',
        items: [{ nameKey: 'ootd.items.lightOuterwear',icon: '🧥' }, { nameKey: 'ootd.items.cottonTee',  icon: '👕' },
                { nameKey: 'ootd.items.chinoPants',   icon: '👖' }, { nameKey: 'ootd.items.sneakers',    icon: '👟' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.umbrella',
        items: [{ nameKey: 'ootd.items.floralDress',  icon: '👗' }, { nameKey: 'ootd.items.denimJacket', icon: '🧥' },
                { nameKey: 'ootd.items.sneakers',     icon: '👟' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.cottonTee',    icon: '👕' }, { nameKey: 'ootd.items.shorts',      icon: '🩳' },
                { nameKey: 'ootd.items.sandals',      icon: '🩴' }, { nameKey: 'ootd.items.hat',         icon: '🧢' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.sleevelessDress',icon: '👗' }, { nameKey: 'ootd.items.strawHat',  icon: '👒' },
                { nameKey: 'ootd.items.sandals',      icon: '🩴' }] },
    ],
  },

  // ── 경주 (Retro & Elegant) ──────────────────
  {
    cityId: 'gyeongju', nameKey: 'ootd.cities.gyeongju.name',
    theme: 'Retro & Elegant', descriptionKey: 'ootd.cities.gyeongju.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.woolCoat',     icon: '🧥' }, { nameKey: 'ootd.items.turtleneck',  icon: '👕' },
                { nameKey: 'ootd.items.slimPants',    icon: '👖' }, { nameKey: 'ootd.items.derbyShoes',  icon: '👞' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.woolCoat',     icon: '🧥' }, { nameKey: 'ootd.items.knit',        icon: '🧶' },
                { nameKey: 'ootd.items.midiSkirt',    icon: '👗' }, { nameKey: 'ootd.items.ankleBoots',  icon: '👢' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.checkShirt',   icon: '👔' }, { nameKey: 'ootd.items.cardigan',    icon: '🧥' },
                { nameKey: 'ootd.items.chinoPants',   icon: '👖' }, { nameKey: 'ootd.items.loafer',      icon: '👞' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.floralDress',  icon: '👗' }, { nameKey: 'ootd.items.cardigan',    icon: '🧥' },
                { nameKey: 'ootd.items.maryJane',     icon: '👠' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.linenShirt',   icon: '👔' }, { nameKey: 'ootd.items.cottonPants', icon: '👖' },
                { nameKey: 'ootd.items.loafer',       icon: '👞' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.maxiDress',    icon: '👗' }, { nameKey: 'ootd.items.sunglasses',  icon: '🕶️' },
                { nameKey: 'ootd.items.bucketBag',    icon: '👜' }] },
    ],
  },

  // ── 통영 (Romantic & Coastal) ──────────────
  {
    cityId: 'tongyeong', nameKey: 'ootd.cities.tongyeong.name',
    theme: 'Romantic & Coastal', descriptionKey: 'ootd.cities.tongyeong.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.windprotect',
        items: [{ nameKey: 'ootd.items.navalCoat',    icon: '🧥' }, { nameKey: 'ootd.items.cardigan',    icon: '🧶' },
                { nameKey: 'ootd.items.jeans',        icon: '👖' }, { nameKey: 'ootd.items.boatShoes',   icon: '👞' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.windprotect',
        items: [{ nameKey: 'ootd.items.frillCoat',    icon: '🧥' }, { nameKey: 'ootd.items.knitDress',   icon: '👗' },
                { nameKey: 'ootd.items.ankleBoots',   icon: '👢' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.quitedVest',   icon: '🧥' }, { nameKey: 'ootd.items.checkShirt',  icon: '👔' },
                { nameKey: 'ootd.items.slacks',       icon: '👖' }, { nameKey: 'ootd.items.boatShoes',   icon: '👞' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.pastelBlouse', icon: '👚' }, { nameKey: 'ootd.items.widePants',   icon: '👖' },
                { nameKey: 'ootd.items.flatShoes',    icon: '👡' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.linenShirt',   icon: '👔' }, { nameKey: 'ootd.items.shorts',      icon: '🩳' },
                { nameKey: 'ootd.items.espadrilles',  icon: '👡' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.offShoulderTop',icon: '👚' }, { nameKey: 'ootd.items.floralSkirt', icon: '👗' },
                { nameKey: 'ootd.items.espadrilles',  icon: '👡' }] },
    ],
  },

  // ── 천안 (Casual & Active) ──────────────────
  {
    cityId: 'cheonan', nameKey: 'ootd.cities.cheonan.name',
    theme: 'Casual & Active', descriptionKey: 'ootd.cities.cheonan.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.paddedJacket', icon: '🧥' }, { nameKey: 'ootd.items.hoodie',      icon: '👕' },
                { nameKey: 'ootd.items.cargoPants',   icon: '👖' }, { nameKey: 'ootd.items.sneakers',    icon: '👟' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.longPadding',  icon: '🧥' }, { nameKey: 'ootd.items.cottonTee',   icon: '👕' },
                { nameKey: 'ootd.items.joggerPants',  icon: '👖' }, { nameKey: 'ootd.items.sneakers',    icon: '👟' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.sweatshirt',   icon: '👕' }, { nameKey: 'ootd.items.jeans',       icon: '👖' },
                { nameKey: 'ootd.items.sneakers',     icon: '👟' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.sweatshirt',   icon: '👕' }, { nameKey: 'ootd.items.joggerPants', icon: '👖' },
                { nameKey: 'ootd.items.sneakers',     icon: '👟' }, { nameKey: 'ootd.items.cap',         icon: '🧢' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.indoorCool',
        items: [{ nameKey: 'ootd.items.cottonTee',    icon: '👕' }, { nameKey: 'ootd.items.shorts',      icon: '🩳' },
                { nameKey: 'ootd.items.runningShoes', icon: '👟' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.indoorCool',
        items: [{ nameKey: 'ootd.items.sleevelessTop',icon: '👚' }, { nameKey: 'ootd.items.shorts',      icon: '🩳' },
                { nameKey: 'ootd.items.sneakers',     icon: '👟' }] },
    ],
  },

  // ── 용인 (Theme Park & Vintage) ────────────
  {
    cityId: 'yongin', nameKey: 'ootd.cities.yongin.name',
    theme: 'Theme Park & Vintage', descriptionKey: 'ootd.cities.yongin.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.vintageBlouson',icon: '🧥' }, { nameKey: 'ootd.items.hoodie',     icon: '👕' },
                { nameKey: 'ootd.items.corduroyPants', icon: '👖' }, { nameKey: 'ootd.items.sneakers',   icon: '👟' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.vintageCoat',  icon: '🧥' }, { nameKey: 'ootd.items.sweater',     icon: '🧶' },
                { nameKey: 'ootd.items.flaredSkirt',  icon: '👗' }, { nameKey: 'ootd.items.ankleBoots',  icon: '👢' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.graphicTee',   icon: '👕' }, { nameKey: 'ootd.items.denimJacket', icon: '🧥' },
                { nameKey: 'ootd.items.jeans',        icon: '👖' }, { nameKey: 'ootd.items.oldSchoolSneakers', icon: '👟' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.comfyShoes',
        items: [{ nameKey: 'ootd.items.retroDress',   icon: '👗' }, { nameKey: 'ootd.items.denimJacket', icon: '🧥' },
                { nameKey: 'ootd.items.chunkySneakers',icon: '👟' }, { nameKey: 'ootd.items.crossbag',   icon: '👜' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.printTee',     icon: '👕' }, { nameKey: 'ootd.items.wideShorts',  icon: '🩳' },
                { nameKey: 'ootd.items.slipOn',       icon: '👟' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.sunscreen',
        items: [{ nameKey: 'ootd.items.stripedDress', icon: '👗' }, { nameKey: 'ootd.items.sunglasses',  icon: '🕶️' },
                { nameKey: 'ootd.items.platformSandals', icon: '👡' }] },
    ],
  },

  // ── 이천 (Cozy & Classic) ──────────────────
  {
    cityId: 'icheon', nameKey: 'ootd.cities.icheon.name',
    theme: 'Cozy & Classic', descriptionKey: 'ootd.cities.icheon.description',
    outfits: [
      { gender: 'male',   tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.herringboneCoat', icon: '🧥' }, { nameKey: 'ootd.items.turtleneck', icon: '👕' },
                { nameKey: 'ootd.items.corduroyPants', icon: '👖' }, { nameKey: 'ootd.items.derbyShoes',  icon: '👞' }] },
      { gender: 'female', tempRange: 'cold', tipKey: 'ootd.tips.springLayering',
        items: [{ nameKey: 'ootd.items.longWoolCoat',  icon: '🧥' }, { nameKey: 'ootd.items.cableKnit',   icon: '🧶' },
                { nameKey: 'ootd.items.midiSkirt',     icon: '👗' }, { nameKey: 'ootd.items.loafer',      icon: '👠' }] },
      { gender: 'male',   tempRange: 'mild', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.tweedJacket',   icon: '🧥' }, { nameKey: 'ootd.items.oxfordShirt', icon: '👔' },
                { nameKey: 'ootd.items.slacks',        icon: '👖' }, { nameKey: 'ootd.items.derbyShoes',  icon: '👞' }] },
      { gender: 'female', tempRange: 'mild', tipKey: 'ootd.tips.photoReady',
        items: [{ nameKey: 'ootd.items.tweedJacket',   icon: '🧥' }, { nameKey: 'ootd.items.blouse',      icon: '👚' },
                { nameKey: 'ootd.items.slacks',        icon: '👖' }, { nameKey: 'ootd.items.bucketBag',   icon: '👜' }] },
      { gender: 'male',   tempRange: 'hot',  tipKey: 'ootd.tips.indoorCool',
        items: [{ nameKey: 'ootd.items.linenJacket',   icon: '🧥' }, { nameKey: 'ootd.items.cottonTee',   icon: '👕' },
                { nameKey: 'ootd.items.cottonPants',   icon: '👖' }, { nameKey: 'ootd.items.loafer',      icon: '👞' }] },
      { gender: 'female', tempRange: 'hot',  tipKey: 'ootd.tips.indoorCool',
        items: [{ nameKey: 'ootd.items.linenDress',    icon: '👗' }, { nameKey: 'ootd.items.strawHat',    icon: '👒' },
                { nameKey: 'ootd.items.bucketBag',     icon: '👜' }] },
    ],
  },
]
