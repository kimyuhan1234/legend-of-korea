import { NextRequest, NextResponse } from 'next/server'
import { getAllSpots } from '@/lib/tour-api/spots'

export const revalidate = 3600

type Locale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'
const LOCALES: readonly Locale[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get('locale')
    const locale: Locale = LOCALES.includes(raw as Locale) ? (raw as Locale) : 'ko'
    const spots = await getAllSpots(locale)
    return NextResponse.json({ spots, total: spots.length })
  } catch (error) {
    console.error('Spots API error:', error)
    return NextResponse.json({ spots: [], total: 0, error: 'Failed' }, { status: 500 })
  }
}
