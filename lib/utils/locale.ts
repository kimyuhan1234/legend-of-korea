/**
 * 다국어 정적 데이터에서 로케일에 맞는 텍스트를 가져옴.
 * zh-CN/zh-TW 등 키가 없는 경우 en → ko 순서로 폴백.
 */
export function getLocalizedText(
  texts: Record<string, string> | null | undefined,
  locale: string
): string {
  if (!texts) return ''
  return texts[locale] || texts.en || texts.ko || ''
}
