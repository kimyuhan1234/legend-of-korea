import { NextResponse } from 'next/server'
import { fetchAllCityWeather } from '@/lib/weather/open-meteo'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const weather = await fetchAllCityWeather()
    return NextResponse.json(weather)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
