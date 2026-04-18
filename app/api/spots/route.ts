import { NextResponse } from 'next/server'
import { getAllSpots } from '@/lib/tour-api/spots'

export const revalidate = 3600

export async function GET() {
  try {
    const spots = await getAllSpots()
    return NextResponse.json({ spots, total: spots.length })
  } catch (error) {
    console.error('Spots API error:', error)
    return NextResponse.json({ spots: [], total: 0, error: 'Failed' }, { status: 500 })
  }
}
