/**
 * 개인정보 마스킹 유틸 — PIPA(개인정보보호법) 준수용.
 * 관리자 페이지·운영 로그 등에서 평문 대신 사용.
 *
 * 사용처: 관리자 주문관리, 회원 관리, 운영 툴 등
 * 예외: 본인 확인된 사용자의 자기 정보 표시는 마스킹 불필요
 */

/** 이름 마스킹 — 홍길동 → 홍*동, 홍길 → 홍*, 김 → 김 */
export function maskName(name: string | null | undefined): string {
  if (!name) return ''
  const trimmed = name.trim()
  if (trimmed.length <= 1) return trimmed
  if (trimmed.length === 2) return trimmed[0] + '*'
  return trimmed[0] + '*'.repeat(trimmed.length - 2) + trimmed[trimmed.length - 1]
}

/** 이메일 마스킹 — abcdef@gmail.com → ab***@gmail.com */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return ''
  const at = email.indexOf('@')
  if (at < 0) return email
  const id = email.slice(0, at)
  const domain = email.slice(at + 1)
  const visible = id.slice(0, Math.min(2, id.length))
  return `${visible}***@${domain}`
}

/** 전화번호 마스킹 — 010-1234-5678 → 010-****-5678 (국내·국제 숫자 11~15자리 지원) */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8) return phone
  const head = digits.slice(0, 3)
  const tail = digits.slice(-4)
  return `${head}-****-${tail}`
}

/** 배송 주소 마스킹 — "서울시 강남구 역삼동 123-45 3층" → "서울시 강남구 역삼동 ****" */
export function maskAddress(address: string | null | undefined): string {
  if (!address) return ''
  const trimmed = address.trim()
  // 첫 3개 토큰(광역/시/동)만 노출, 나머지는 ****
  const tokens = trimmed.split(/\s+/)
  if (tokens.length <= 3) return trimmed
  return tokens.slice(0, 3).join(' ') + ' ****'
}
