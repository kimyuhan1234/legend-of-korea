// ─────────────────────────────────────────────
//  lib/data/city-weather-mock.ts
//  9개 도시 14일치 날씨 목업 데이터
//
//  ⚠️ 나중에 실제 API(OpenWeatherMap 등)로 교체할 때:
//  1. lib/api/weather.ts 생성 후 fetchCityWeather() 구현
//  2. 아래 getCityWeather() 내부만 API 호출로 교체
//  3. NEXT_PUBLIC_WEATHER_API_KEY 환경 변수 추가
//  컴포넌트는 데이터 소스를 모르므로 변경 불필요
// ─────────────────────────────────────────────

export type WeatherCondition =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rainy'
  | 'thunderstorm'
  | 'snowy'
  | 'foggy'
  | 'windy'

export const WEATHER_ICON: Record<WeatherCondition, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  thunderstorm: '⛈️',
  snowy: '❄️',
  foggy: '🌫️',
  windy: '💨',
}

export interface CityWeatherDay {
  date: string            // YYYY-MM-DD
  condition: WeatherCondition
  icon: string
  highTemp: number
  lowTemp: number
  humidity: number
}

interface CityProfile {
  highMin: number
  highMax: number
  lowMin: number
  lowMax: number
  humidityMin: number
  humidityMax: number
  conditions: WeatherCondition[]      // 등장 가능한 날씨 (가중치 반영해 중복 허용)
}

// 4월 중순 기준 도시별 현실적 프로필
const CITY_PROFILES: Record<string, CityProfile> = {
  jeonju: {
    highMin: 18, highMax: 23, lowMin: 7, lowMax: 12, humidityMin: 40, humidityMax: 65,
    conditions: ['sunny', 'sunny', 'partly_cloudy', 'cloudy'],
  },
  seoul: {
    highMin: 17, highMax: 22, lowMin: 6, lowMax: 11, humidityMin: 40, humidityMax: 70,
    conditions: ['sunny', 'partly_cloudy', 'partly_cloudy', 'cloudy', 'rainy'],
  },
  busan: {
    highMin: 18, highMax: 23, lowMin: 10, lowMax: 15, humidityMin: 55, humidityMax: 75,
    conditions: ['sunny', 'sunny', 'partly_cloudy', 'cloudy', 'windy'],
  },
  jeju: {
    highMin: 16, highMax: 21, lowMin: 10, lowMax: 14, humidityMin: 60, humidityMax: 85,
    conditions: ['cloudy', 'rainy', 'partly_cloudy', 'rainy', 'windy'],
  },
  gyeongju: {
    highMin: 17, highMax: 23, lowMin: 7, lowMax: 12, humidityMin: 45, humidityMax: 75,
    conditions: ['sunny', 'sunny', 'partly_cloudy', 'foggy'],
  },
  tongyeong: {
    highMin: 17, highMax: 22, lowMin: 10, lowMax: 14, humidityMin: 55, humidityMax: 80,
    conditions: ['sunny', 'partly_cloudy', 'cloudy', 'windy'],
  },
  cheonan: {
    highMin: 16, highMax: 22, lowMin: 5, lowMax: 10, humidityMin: 40, humidityMax: 65,
    conditions: ['sunny', 'partly_cloudy', 'windy', 'cloudy'],
  },
  yongin: {
    highMin: 16, highMax: 22, lowMin: 5, lowMax: 10, humidityMin: 40, humidityMax: 65,
    conditions: ['sunny', 'partly_cloudy', 'partly_cloudy', 'cloudy'],
  },
  icheon: {
    highMin: 15, highMax: 21, lowMin: 4, lowMax: 9, humidityMin: 45, humidityMax: 75,
    conditions: ['sunny', 'partly_cloudy', 'foggy', 'cloudy'],
  },
}

// 결정적 시드 해시 — 같은 도시/날짜는 항상 같은 날씨
function seedHash(input: string): number {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i)
  }
  return Math.abs(h)
}

function pickInRange(min: number, max: number, seed: number): number {
  const range = max - min + 1
  return min + (seed % range)
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 도시의 지정 기간 날씨 목업 반환.
 * 실제 API로 교체 시 이 함수 내부만 바꾸면 됨.
 */
export function getCityWeather(
  cityId: string,
  startDate: string,
  days: number
): CityWeatherDay[] {
  const profile = CITY_PROFILES[cityId] ?? CITY_PROFILES.seoul
  const start = new Date(startDate)

  const result: CityWeatherDay[] = []
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i)
    const dateStr = formatDate(d)
    const seed = seedHash(`${cityId}-${dateStr}`)

    const condIdx = seed % profile.conditions.length
    const condition = profile.conditions[condIdx]
    const highTemp = pickInRange(profile.highMin, profile.highMax, seed >> 3)
    const lowTemp = pickInRange(profile.lowMin, Math.min(profile.lowMax, highTemp - 4), seed >> 5)
    const humidity = pickInRange(profile.humidityMin, profile.humidityMax, seed >> 7)

    result.push({
      date: dateStr,
      condition,
      icon: WEATHER_ICON[condition],
      highTemp,
      lowTemp,
      humidity,
    })
  }

  return result
}
