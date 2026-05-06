/**
 * TourAPI overview/program 필드 HTML sanitize.
 *
 * TourAPI (한국관광공사) 응답의 overview/program 필드는 HTML 태그 일부를 포함한다.
 * 정부 API 라 위험 태그(script/iframe/onclick) 발생 가능성은 낮지만, 외부 입력은
 * 무조건 신뢰하지 않는다 (CLAUDE.md 보안 원칙).
 *
 * 외부 deps(isomorphic-dompurify) 추가 회피 — 정부 API 의 제한된 HTML 표면적
 * 한정 화이트리스트로 충분. 향후 더 풍부한 HTML 지원 필요 시 dompurify 로 교체 가능.
 *
 * 허용 태그: br, p, strong, em, b, i, ul, ol, li
 * 차단: script, iframe, style, on* 속성, javascript: URL
 */

const ALLOWED_TAGS = new Set(['br', 'p', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li'])

/**
 * 입력 HTML 에서 허용 태그만 남기고, 나머지는 텍스트로 escape.
 * 모든 속성 제거 (가장 안전한 정책 — 링크/이미지 등은 별도 필드로 분리 처리).
 */
export function sanitizeTourHTML(input: string | undefined | null): string {
  if (!input) return ''
  let html = String(input)

  // 1) script/style/iframe 블록 통째로 제거 (내용 포함)
  html = html.replace(/<(script|style|iframe)\b[\s\S]*?<\/\1\s*>/gi, '')
  // 2) self-closing 위험 태그 제거
  html = html.replace(/<(script|style|iframe|object|embed|link|meta)\b[^>]*\/?>/gi, '')

  // 3) 모든 태그 처리 — 허용 태그면 속성 제거 후 유지, 그 외엔 escape
  html = html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, slash, tagName: string) => {
    const name = tagName.toLowerCase()
    if (ALLOWED_TAGS.has(name)) {
      return `<${slash}${name}>`
    }
    // 비허용 태그 — 텍스트로 escape (꺾쇠 노출)
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  })

  // 4) javascript: / data:text/html: 등 위험 URL 패턴은 발생할 일 없지만, 혹시 모를 경우 대비
  //    (현재 모든 속성 제거 정책이라 도달할 수 없으나 방어 한 겹 더)
  html = html.replace(/javascript\s*:/gi, '')

  return html
}

/**
 * HTML → plain text (요약 출력용). overview 가 길 때 미리보기에 사용 가능.
 */
export function stripHTML(input: string | undefined | null): string {
  if (!input) return ''
  return String(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}
