/**
 * 환율 / 가격 포맷 유틸.
 *
 * 베타 단계: EXCHANGE_RATES 하드코딩 fallback 으로 다수 컴포넌트가 동기 호출 (formatPriceParts).
 * 정식 출시 전: getExchangeRates() 비동기 API 연동 인프라가 본 모듈에 추가됨 —
 * 사용처 마이그레이션은 후속 PR (점진 교체 — server component 에서 fetch 해
 * formatPricePartsWithRates 로 전달).
 *
 * API: open.er-api.com/v6/latest/KRW (무료, API key 불필요, 1500 req/month 제한).
 * Next.js fetch revalidate 1 시간 → 720 req/month 수준이라 한도 충분.
 */

// ────────────────────────────────────────────────
// Fallback (동기 사용처 + API 실패 케이스)
// ────────────────────────────────────────────────

/**
 * ⚠️ 베타 fallback 하드코딩 환율 (1 KRW = X 외화).
 * - getExchangeRates() 가 API 호출 실패 시 본 값 반환
 * - 동기 함수 formatPriceParts 가 사용 (점진 교체 예정)
 * - 매월 1일 수동 갱신 권장 (현재값: 2026-04-26 기준)
 */
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

// ────────────────────────────────────────────────
// 동기 포맷 — 기존 사용처 (호환성 유지)
// ────────────────────────────────────────────────

/**
 * 가격 카드용 분리 표시 (KRW 강조 + 환산값 작게). 디자인팀 스펙.
 * EXCHANGE_RATES 하드코딩 사용. 동기 — server / client 양쪽 호출 가능.
 *
 * @returns primary = "₩29,000",  secondary = "≈ $20.88" | null (ko 면 null)
 */
export function formatPriceParts(
  krw: number,
  locale: string,
): { primary: string; secondary: string | null } {
  return formatPricePartsWithRates(krw, locale, EXCHANGE_RATES)
}

/**
 * formatPriceParts 의 동적 환율 변종 — server component 에서
 * getExchangeRates() 결과를 prop 으로 전달받은 client 에 사용.
 *
 * 본 함수는 후속 PR 점진 마이그레이션 진입점.
 */
export function formatPricePartsWithRates(
  krw: number,
  locale: string,
  rates: Pick<ExchangeRates['rates'], 'USD' | 'JPY' | 'CNY' | 'TWD'>,
): { primary: string; secondary: string | null } {
  const primary = `₩${krw.toLocaleString()}`

  if (locale === 'ko' || !CURRENCY_BY_LOCALE[locale]) {
    return { primary, secondary: null }
  }

  const [code, symbol] = CURRENCY_BY_LOCALE[locale]
  const converted = krw * rates[code]

  // JPY · TWD 는 정수, USD · CNY 는 소수점 둘째자리
  const formatted = code === 'JPY' || code === 'TWD'
    ? `${symbol}${Math.round(converted).toLocaleString()}`
    : `${symbol}${converted.toFixed(2)}`

  return { primary, secondary: `≈ ${formatted}` }
}

// ────────────────────────────────────────────────
// 비동기 API 연동 — 후속 PR 마이그레이션용
// ────────────────────────────────────────────────

export type SupportedCurrency = 'KRW' | 'USD' | 'JPY' | 'CNY' | 'TWD'

export interface ExchangeRates {
  base: 'KRW'
  rates: Record<SupportedCurrency, number>
  fetchedAt: number
}

/**
 * KRW 기준 환율 fetch (Next.js revalidate 1 시간 캐싱).
 *
 * 실패 / 응답 이상 시 EXCHANGE_RATES 하드코딩 fallback 반환 — 항상 정상 응답 보장.
 * server component / API route 에서만 호출 권장 (client 에서 호출하면 무료 한도 빠르게 소진).
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/KRW', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return getFallbackRates()

    const data = (await res.json()) as { result?: string; rates?: Partial<Record<SupportedCurrency, number>> }
    if (data.result !== 'success' || !data.rates) return getFallbackRates()

    return {
      base: 'KRW',
      rates: {
        KRW: 1,
        USD: data.rates.USD ?? EXCHANGE_RATES.USD,
        JPY: data.rates.JPY ?? EXCHANGE_RATES.JPY,
        CNY: data.rates.CNY ?? EXCHANGE_RATES.CNY,
        TWD: data.rates.TWD ?? EXCHANGE_RATES.TWD,
      },
      fetchedAt: Date.now(),
    }
  } catch {
    return getFallbackRates()
  }
}

function getFallbackRates(): ExchangeRates {
  return {
    base: 'KRW',
    rates: { KRW: 1, ...EXCHANGE_RATES },
    fetchedAt: Date.now(),
  }
}

/**
 * KRW → 다른 통화 변환. JPY / TWD 는 정수, USD / CNY 는 소수점 둘째자리 반올림.
 */
export async function convertPrice(
  amountKRW: number,
  toCurrency: SupportedCurrency,
): Promise<number> {
  if (toCurrency === 'KRW') return amountKRW
  const { rates } = await getExchangeRates()
  const converted = amountKRW * rates[toCurrency]
  return toCurrency === 'JPY' || toCurrency === 'TWD'
    ? Math.round(converted)
    : Math.round(converted * 100) / 100
}

/**
 * Intl.NumberFormat 기반 통화 포맷. 예: 1234.5 → "$1,234.50" (USD, en-US).
 * KRW / JPY 는 소수점 0 자리, 그 외 2 자리.
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  locale: string = 'ko-KR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
  }).format(amount)
}
