import { NextRequest, NextResponse } from 'next/server'
import { fetchStaysByArea } from '@/lib/tour-api/stays'
import { getStaysWithCache } from '@/lib/tour-api/stays-cache'

export const dynamic = 'force-dynamic'

/**
 * 테스트 엔드포인트.
 * GET /api/tour-stays/test           → 서울(areaCode=1) 직접 조회 5개
 * GET /api/tour-stays/test?area=6    → 부산 직접 조회 5개
 * GET /api/tour-stays/test?cache=true → 캐시 read-through 경유 (전체 결과)
 * GET /api/tour-stays/test?area=6&cache=true → 부산 캐시 경유
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const areaParam = url.searchParams.get('area')
  const useCache = url.searchParams.get('cache') === 'true'
  const areaCode = areaParam ? parseInt(areaParam, 10) : 1

  if (Number.isNaN(areaCode)) {
    return NextResponse.json(
      { ok: false, error: `Invalid area param: ${areaParam}` },
      { status: 400 }
    )
  }

  // 캐시 경로 — getStaysWithCache 사용
  if (useCache) {
    const cached = await getStaysWithCache(areaCode)
    return NextResponse.json({
      ok: cached.source !== 'empty',
      endpoint: 'KorService2/searchStay2',
      cache: true,
      areaCode,
      source: cached.source,
      count: cached.count,
      stays: cached.stays.slice(0, 5),
      note: cached.note,
    })
  }

  const result = await fetchStaysByArea(areaCode, { numOfRows: 5, pageNo: 1 })

  if (result.resultCode === 'NO_KEY') {
    return NextResponse.json(
      {
        ok: false,
        resultCode: result.resultCode,
        resultMsg: result.resultMsg,
        diagnosis: 'TOUR_API_KEY 환경변수 누락 — .env.local 확인 필요',
      },
      { status: 500 }
    )
  }

  if (result.resultCode === 'NETWORK_ERROR') {
    return NextResponse.json(
      {
        ok: false,
        resultCode: result.resultCode,
        resultMsg: result.resultMsg,
        diagnosis: '네트워크 오류 — TourAPI 서버 접속 실패',
      },
      { status: 500 }
    )
  }

  if (result.resultCode !== '0000') {
    const bodyUpper = (result.resultMsg || '').toUpperCase()
    let diagnosis = '알 수 없는 TourAPI 응답 코드'

    if (result.resultCode === '30') diagnosis = 'SERVICE KEY IS NOT REGISTERED — 키 미등록/오타, Decoding이 아닌 Encoding 키 사용 여부 확인'
    else if (result.resultCode === '31') diagnosis = 'DEADLINE HAS EXPIRED — 키 만료'
    else if (result.resultCode === '32') diagnosis = 'UNREGISTERED IP — 등록된 IP에서만 호출 가능'
    else if (result.resultCode === '33') diagnosis = 'UNREGISTERED DOMAIN — 등록된 도메인에서만 호출 가능'
    else if (result.resultCode === '22') diagnosis = 'LIMITED NUMBER OF SERVICE REQUESTS — 일일 호출 한도 초과'
    else if (result.resultCode === '99') diagnosis = 'UNKNOWN ERROR — 활성화 대기 중일 수 있음 (승인 후 1-2시간 소요)'
    else if (bodyUpper.includes('SERVICE_KEY_IS_NOT_REGISTERED')) {
      diagnosis = 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR — TOUR_API_KEY 미등록/오타/Decoding 키 사용 가능성. data.go.kr에서 Encoding 키를 그대로 복사'
    } else if (bodyUpper.includes('NO_OPENAPI_SERVICE')) {
      diagnosis = 'NO_OPENAPI_SERVICE_ERROR — API 메서드 이름이 잘못됨 (엔드포인트 경로 문제 가능성)'
    } else if (bodyUpper.includes('LIMITED_NUMBER_OF_SERVICE') || bodyUpper.includes('TRAFFIC')) {
      diagnosis = 'LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR — 일일 호출 한도(1000건) 초과'
    } else if (bodyUpper.includes('SERVICETYPE_IS_NOT_REGISTERED')) {
      diagnosis = 'SERVICETYPE_IS_NOT_REGISTERED_ERROR — 이 serviceKey로 신청한 API가 아님'
    } else if (result.resultCode === 'HTTP_500') {
      diagnosis = 'TourAPI 서버 500 — rawSnippet을 확인해 구체적 에러 파악 필요'
    } else if (result.resultCode === 'NON_JSON') {
      diagnosis = 'TourAPI가 JSON이 아닌 응답을 반환 (XML 에러 본문 가능성) — rawSnippet 확인'
    }

    return NextResponse.json(
      {
        ok: false,
        endpoint: 'KorService2/searchStay2',
        resultCode: result.resultCode,
        resultMsg: result.resultMsg,
        diagnosis,
        debug: {
          requestUrl: result.requestUrl,
          rawSnippet: result.rawSnippet,
        },
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    endpoint: 'KorService2/searchStay2',
    cache: false,
    areaCode,
    count: result.stays.length,
    totalAvailable: result.totalCount,
    resultCode: result.resultCode,
    stays: result.stays,
    debug: {
      requestUrl: result.requestUrl,
      rawSnippetHead: result.rawSnippet?.slice(0, 500),
    },
  })
}
