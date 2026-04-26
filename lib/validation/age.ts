/**
 * 만 14세 검증 유틸 (PIPA §22-2 준수).
 *
 * 클라이언트·서버 양쪽에서 동일 함수를 호출해
 * "14세 미만 user 가 단 1초도 DB 에 들어가지 않게"
 * signUp 호출 직전에 차단한다.
 */

export const MINIMUM_AGE_YEARS = 14

/** 오늘 기준 가입 가능한 가장 늦은 생년월일 (만 14세 미만 컷오프). */
export function getMaxAllowedBirthDate(today: Date = new Date()): Date {
  return new Date(
    today.getFullYear() - MINIMUM_AGE_YEARS,
    today.getMonth(),
    today.getDate(),
  )
}

/** ISO 'YYYY-MM-DD' 문자열을 정상 Date 로 파싱. 실패 시 null. */
export function parseBirthDate(input: string | null | undefined): Date | null {
  if (!input || typeof input !== 'string') return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return null
  // UTC 자정으로 강제 — 타임존 차이로 하루 어긋나는 케이스 방지
  const d = new Date(`${input}T00:00:00Z`)
  if (isNaN(d.getTime())) return null
  return d
}

/** 만 14세 이상이면 true. 입력이 잘못되거나 미래 날짜면 false. */
export function isAtLeastMinimumAge(input: string | null | undefined, today: Date = new Date()): boolean {
  const bd = parseBirthDate(input)
  if (!bd) return false
  const max = getMaxAllowedBirthDate(today)
  // bd <= max  → 만 14세 이상
  // 미래 날짜면 max 보다 큼 → false
  return bd.getTime() <= max.getTime()
}

/** 사람이 읽는 형식의 max date (input[type=date] max 속성용 — 'YYYY-MM-DD'). */
export function getMaxBirthDateString(today: Date = new Date()): string {
  const d = getMaxAllowedBirthDate(today)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
