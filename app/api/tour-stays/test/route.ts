import { NextResponse } from 'next/server'
import { fetchStaysByArea } from '@/lib/tour-api/stays'

export const dynamic = 'force-dynamic'

/**
 * Day 1 검증용 테스트 엔드포인트.
 * GET /api/tour-stays/test → 서울(areaCode=1) 숙박 상위 5개 반환
 *
 * 성공 응답: { ok: true, count, resultCode, stays: NormalizedStay[5] }
 * 실패 응답: { ok: false, resultCode, resultMsg, diagnosis } (500)
 */
export async function GET() {
  const result = await fetchStaysByArea(1, { numOfRows: 5, pageNo: 1 })

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
    areaCode: 1,
    areaName: '서울',
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
