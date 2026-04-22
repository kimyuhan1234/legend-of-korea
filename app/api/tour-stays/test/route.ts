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
    let diagnosis = '알 수 없는 TourAPI 응답 코드'
    if (result.resultCode === '30') diagnosis = 'SERVICE KEY IS NOT REGISTERED — 키 미등록/오타, Decoding이 아닌 Encoding 키 사용 여부 확인'
    else if (result.resultCode === '31') diagnosis = 'DEADLINE HAS EXPIRED — 키 만료'
    else if (result.resultCode === '32') diagnosis = 'UNREGISTERED IP — 등록된 IP에서만 호출 가능'
    else if (result.resultCode === '33') diagnosis = 'UNREGISTERED DOMAIN — 등록된 도메인에서만 호출 가능'
    else if (result.resultCode === '22') diagnosis = 'LIMITED NUMBER OF SERVICE REQUESTS — 일일 호출 한도 초과'
    else if (result.resultCode === '99') diagnosis = 'UNKNOWN ERROR — 활성화 대기 중일 수 있음 (승인 후 1-2시간 소요)'
    else if (result.resultCode === 'HTTP_500') {
      // 본문에 SERVICE_KEY_NOT_REGISTERED_ERROR 등이 섞여 올 수 있음
      const body = (result.resultMsg || '').toUpperCase()
      if (body.includes('SERVICE_KEY_NOT_REGISTERED') || body.includes('SERVICEKEY')) {
        diagnosis = 'SERVICE KEY NOT REGISTERED — TOUR_API_KEY가 등록되지 않았거나 Decoding 키를 복사했을 가능성. data.go.kr 마이페이지에서 Encoding 키를 그대로 붙여넣어야 함. 승인 후 활성화까지 1-2시간 대기 필요할 수 있음.'
      } else if (body.includes('LIMITED') || body.includes('TRAFFIC')) {
        diagnosis = 'TRAFFIC LIMIT EXCEEDED — 일일 호출 한도 초과'
      } else {
        diagnosis = 'TourAPI 서버 500 — 응답 본문을 resultMsg에서 확인 (서버 일시 장애 or 키 인증 실패 가능성)'
      }
    }

    return NextResponse.json(
      {
        ok: false,
        resultCode: result.resultCode,
        resultMsg: result.resultMsg,
        diagnosis,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    areaCode: 1,
    areaName: '서울',
    count: result.stays.length,
    totalAvailable: result.totalCount,
    resultCode: result.resultCode,
    stays: result.stays,
  })
}
