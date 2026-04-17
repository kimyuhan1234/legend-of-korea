import { CITY_COORDS } from './cities'

export interface DailyWeather {
  date: string
  dayOfWeek: string
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'snowy'
  highTemp: number
  lowTemp: number
  humidity: number
}

/** WMO 날씨 코드 → condition 매핑 */
function wmoToCondition(code: number): DailyWeather['condition'] {
  if (code <= 1) return 'sunny'
  if (code <= 3) return 'partly_cloudy'
  if (code <= 48) return 'cloudy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 86) return 'snowy'
  return 'rainy'
}

const DAY_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/** 메모리 캐시 (1시간 TTL) */
let cache: { data: Record<string, DailyWeather[]>; timestamp: number } | null = null
const CACHE_TTL = 60 * 60 * 1000

export async function fetchAllCityWeather(): Promise<Record<string, DailyWeather[]>> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  const result: Record<string, DailyWeather[]> = {}

  const promises = CITY_COORDS.map(async (city) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=Asia/Seoul&forecast_days=7`

      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)

      const data = await res.json()

      const days: DailyWeather[] = data.daily.time.map((date: string, i: number) => ({
        date,
        dayOfWeek: DAY_OF_WEEK[new Date(date).getDay()],
        condition: wmoToCondition(data.daily.weather_code[i]),
        highTemp: Math.round(data.daily.temperature_2m_max[i]),
        lowTemp: Math.round(data.daily.temperature_2m_min[i]),
        humidity: Math.round(data.daily.relative_humidity_2m_mean?.[i] ?? 50),
      }))

      result[city.id] = days
    } catch {
      result[city.id] = []
    }
  })

  await Promise.all(promises)

  cache = { data: result, timestamp: Date.now() }
  return result
}
