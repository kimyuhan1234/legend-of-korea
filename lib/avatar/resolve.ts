/**
 * 아바타 src 해석 헬퍼.
 *
 * 우선순위:
 *   1. 신규 시스템 (057+) — selected_avatar_filename + selected_avatar_slug 가 join 으로 채워졌으면
 *      `/images/avatar/{slug}/{filename}` 반환 (placeholder.svg 는 placeholder 경로로)
 *   2. 기존 avatar_url (Supabase / 외부 URL) — 자연 호환 fallback
 *   3. placeholder.svg
 *
 * 057 마이그레이션 적용 전 환경에서도 avatar_url 만으로 정상 동작.
 */

export interface AvatarSource {
  avatar_url?: string | null
  /** 057 적용 후 SELECT 시 join 으로 채워지는 파일명 — undefined 면 v1 fallback */
  selected_avatar_filename?: string | null
  /** 057 적용 후 SELECT 시 join 으로 채워지는 카테고리 slug */
  selected_avatar_slug?: string | null
}

export const AVATAR_PLACEHOLDER_SRC = '/images/avatar/placeholder.svg'

export function resolveAvatarSrc(src: AvatarSource | null | undefined): string {
  if (!src) return AVATAR_PLACEHOLDER_SRC

  // 1. 신규 시스템 우선
  if (src.selected_avatar_filename && src.selected_avatar_slug) {
    if (src.selected_avatar_filename === 'placeholder.svg') {
      return AVATAR_PLACEHOLDER_SRC
    }
    return `/images/avatar/${src.selected_avatar_slug}/${src.selected_avatar_filename}`
  }

  // 2. 기존 avatar_url
  const url = src.avatar_url?.trim()
  if (url) return url

  // 3. placeholder
  return AVATAR_PLACEHOLDER_SRC
}

/** 닉네임 첫 글자 fallback — 이미지 로드 실패 시 또는 placeholder 위 오버레이용 */
export function resolveAvatarInitial(name: string | null | undefined): string {
  if (!name) return '?'
  const trimmed = name.trim()
  if (!trimmed) return '?'
  return trimmed.charAt(0).toUpperCase()
}

/** 사용자가 명시적으로 설정한 아바타가 있는지 (없으면 닉네임 첫 글자 fallback 노출). */
export function hasAvatarSource(src: AvatarSource | null | undefined): boolean {
  if (!src) return false
  return !!(src.avatar_url?.trim() || src.selected_avatar_filename)
}
