/**
 * /api/spots/match-image 보안 검증 테스트.
 *
 * vi.mock 으로 searchKeyword (외부 TourAPI 호출) 차단.
 * 각 테스트마다 unique x-forwarded-for IP 사용 — rate limit 모듈 스코프 Map 격리.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// vi.mock 은 import hoisting 우선
vi.mock('@/lib/tour-api/searchKeyword', () => ({
  searchKeyword: vi.fn(),
}))

import { GET } from '@/app/api/spots/match-image/route'
import { searchKeyword } from '@/lib/tour-api/searchKeyword'

const mockedSearch = vi.mocked(searchKeyword)

function makeRequest(qs: Record<string, string>, ip: string): NextRequest {
  const url = new URL('http://localhost/api/spots/match-image')
  for (const [k, v] of Object.entries(qs)) url.searchParams.set(k, v)
  return new NextRequest(url, {
    headers: { 'x-forwarded-for': ip },
  })
}

describe('/api/spots/match-image — 파라미터 검증', () => {
  beforeEach(() => {
    mockedSearch.mockReset()
  })

  it('빈 keyword (trim 후 0자) → 400 invalid_keyword', async () => {
    const req = makeRequest(
      { keyword: '   ', regionId: 'jeonju', locale: 'ko' },
      '10.0.0.1',
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_keyword')
    expect(mockedSearch).not.toHaveBeenCalled()
  })

  it('keyword 100자 초과 → 400 keyword_too_long', async () => {
    const longKeyword = 'a'.repeat(101)
    const req = makeRequest(
      { keyword: longKeyword, regionId: 'jeonju', locale: 'ko' },
      '10.0.0.2',
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('keyword_too_long')
    expect(mockedSearch).not.toHaveBeenCalled()
  })

  it('keyword 정확히 100자 → 통과 (경계값)', async () => {
    mockedSearch.mockResolvedValueOnce([])
    const exactly100 = 'a'.repeat(100)
    const req = makeRequest(
      { keyword: exactly100, regionId: 'jeonju', locale: 'ko' },
      '10.0.0.3',
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.matched).toBe(false)
  })

  it('잘못된 regionId (9 region 외) → 400 invalid_region', async () => {
    const req = makeRequest(
      { keyword: '경기전', regionId: 'pyongyang', locale: 'ko' },
      '10.0.0.4',
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_region')
    expect(mockedSearch).not.toHaveBeenCalled()
  })

  it('잘못된 locale (5 locale 외) → 400 invalid_locale', async () => {
    const req = makeRequest(
      { keyword: '경기전', regionId: 'jeonju', locale: 'fr' },
      '10.0.0.5',
    )
    const res = await GET(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('invalid_locale')
    expect(mockedSearch).not.toHaveBeenCalled()
  })

  it('정상 호출 + searchKeyword matched → 200 matched:true + firstimage', async () => {
    mockedSearch.mockResolvedValueOnce([
      {
        contentid: '12345',
        contenttypeid: '12',
        title: '경기전',
        firstimage: 'https://tong.visitkorea.or.kr/cms/resource/abc.jpg',
      },
    ])
    const req = makeRequest(
      { keyword: '경기전', regionId: 'jeonju', locale: 'ko' },
      '10.0.0.6',
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({
      matched: true,
      firstimage: 'https://tong.visitkorea.or.kr/cms/resource/abc.jpg',
      title: '경기전',
      contentid: '12345',
    })
    // 캐싱 헤더 확인
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=3600')
  })

  it('searchKeyword 0건 → 200 matched:false', async () => {
    mockedSearch.mockResolvedValueOnce([])
    const req = makeRequest(
      { keyword: '존재하지않는스팟xyz', regionId: 'jeonju', locale: 'ko' },
      '10.0.0.7',
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ matched: false })
  })

  it('searchKeyword firstimage 빈 문자열 → 200 matched:false', async () => {
    mockedSearch.mockResolvedValueOnce([
      {
        contentid: '99',
        contenttypeid: '12',
        title: 'image-less spot',
        firstimage: '',
      },
    ])
    const req = makeRequest(
      { keyword: '이미지없는spot', regionId: 'jeonju', locale: 'ko' },
      '10.0.0.8',
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ matched: false })
  })

  it('Tier 1 케이블카 → buildSearchKeyword 부착 후 호출 확인', async () => {
    mockedSearch.mockResolvedValueOnce([])
    const req = makeRequest(
      { keyword: '케이블카', regionId: 'tongyeong', locale: 'ko' },
      '10.0.0.9',
    )
    await GET(req)
    expect(mockedSearch).toHaveBeenCalledWith('통영 케이블카', {
      numOfRows: 1,
      locale: 'ko',
    })
  })

  it('rate limit 초과 → 429 (PUBLIC = 60 req/분/IP)', async () => {
    mockedSearch.mockResolvedValue([])
    const ip = '10.0.99.99'
    // 60 요청은 통과
    for (let i = 0; i < 60; i++) {
      const req = makeRequest(
        { keyword: '경기전', regionId: 'jeonju', locale: 'ko' },
        ip,
      )
      const res = await GET(req)
      expect(res.status).toBe(200)
    }
    // 61번째 요청은 429
    const req = makeRequest(
      { keyword: '경기전', regionId: 'jeonju', locale: 'ko' },
      ip,
    )
    const res = await GET(req)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBeTruthy()
    const data = await res.json()
    expect(data.error).toBe('Too Many Requests')
  })
})
