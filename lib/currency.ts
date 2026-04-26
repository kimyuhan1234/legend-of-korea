/**
 * ⚠️ 베타 단계 한정 하드코딩 환율
 * - 정식 출시 전 exchangerate-api.com 또는 Open Exchange Rates API 연동 필요
 * - 매월 1일 수동 갱신 (현재값: 2026-04-26 기준)
 * - 갱신 시 git blame 으로 마지막 업데이트 추적
 */

// 1 KRW = X 외화. 디자인팀 스펙대로 이 dict 만 갱신하면 모든 가격 카드에 반영.
export const EXCHANGE_RATES = {
  USD: 0.00072,
  JPY: 0.110,
  CNY: 0.0052,
  TWD: 0.023,
} as const

const CURRENCY_BY_LOCALE: Record<string, [keyof typeof EXCHANGE_RATES, string]> = {
  en: ['USD', '$'],
  ja: ['JPY', '¥'],
  'zh-CN': ['CNY', '¥'],
  'zh-TW': ['TWD', 'NT$'],
}

/**
 * 가격 카드용 분리 표시 (KRW 강조 + 환산값 작게).
 * 디자인팀 스펙: KRW 는 기존 크기, 환산값은 작은 글씨로.
 *
 * @returns primary = "₩29,000",  secondary = "≈ $20.88" | null (ko 면 null)
 */
export function formatPriceParts(
  krw: number,
  locale: string,
): { primary: string; secondary: string | null } {
  const primary = `₩${krw.toLocaleString()}`

  if (locale === 'ko' || !CURRENCY_BY_LOCALE[locale]) {
    return { primary, secondary: null }
  }

  const [code, symbol] = CURRENCY_BY_LOCALE[locale]
  const converted = krw * EXCHANGE_RATES[code]

  // JPY · TWD 는 정수, USD · CNY 는 소수점 둘째자리
  const formatted = code === 'JPY' || code === 'TWD'
    ? `${symbol}${Math.round(converted).toLocaleString()}`
    : `${symbol}${converted.toFixed(2)}`

  return { primary, secondary: `≈ ${formatted}` }
}
