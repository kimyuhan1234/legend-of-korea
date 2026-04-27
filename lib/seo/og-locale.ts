/**
 * P3A-2: app locale ('ko', 'ja', 'en', 'zh-CN', 'zh-TW') → OG locale 형식 변환.
 *
 * Open Graph 의 og:locale 표준은 BCP 47 underscore 포맷 (ja_JP, ko_KR 등).
 * 우리 i18n 라우팅은 zh-CN / zh-TW 처럼 BCP 47 hyphen 포맷이라 매핑 필요.
 */
export function getOgLocale(locale: string): string {
  const map: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US',
    ja: 'ja_JP',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
  }
  return map[locale] ?? 'en_US'
}

export const ALL_OG_LOCALES = [
  'ko_KR',
  'en_US',
  'ja_JP',
  'zh_CN',
  'zh_TW',
] as const
