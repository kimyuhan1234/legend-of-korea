import { getTranslations } from 'next-intl/server'

interface SkipLinkProps {
  locale: string
  /** target main element id — default 'main-content' */
  targetId?: string
}

/**
 * P3C-1: Skip to main content 링크 (WCAG 2.4.1).
 *
 * 키보드 / 스크린리더 사용자가 반복되는 헤더 / 네비게이션을 건너뛰고
 * 본문으로 즉시 이동할 수 있도록 페이지 최상단에 노출.
 * 평소엔 화면 밖에 숨김 (sr-only), Tab 포커스 시 시각적으로 등장.
 *
 * 5 로케일 i18n — common.skipToContent 키 사용.
 */
export async function SkipLink({ locale, targetId = 'main-content' }: SkipLinkProps) {
  const t = await getTranslations({ locale, namespace: 'common' })
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100]
                 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-mint-deep focus:text-white
                 focus:font-bold focus:text-sm focus:shadow-lg focus:outline-none
                 focus:ring-2 focus:ring-mint-deep focus:ring-offset-2"
    >
      {t('skipToContent')}
    </a>
  )
}
