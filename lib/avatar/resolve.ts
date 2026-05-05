/**
 * 아바타 src 해석 헬퍼.
 *
 * 두 시스템 분리 (2026-05):
 *   - resolveProfileAvatarSrc: 프로필 사진 (avatar_url) — 사용자 본인 업로드 이미지.
 *     댓글 / 헤더 / 리더보드 / 프로필 카드 큰 사진 등.
 *   - resolveRankImageSrc: 랭크 사진 (selected_avatar_image_id) — 카테고리 해금 사진.
 *     LEVEL 영역 / 디지털 패스포트 RANK / 성장 지도 등.
 *
 * 두 시스템은 절대 합치지 않음 — 각자 의미 명확.
 */

export interface ProfileAvatarSource {
  avatar_url?: string | null
}

export interface RankImageSource {
  selected_avatar_filename?: string | null
  selected_avatar_slug?: string | null
}

export const AVATAR_PLACEHOLDER_SRC = '/images/avatar/placeholder.svg'

/**
 * 프로필 사진 src.
 * 우선: avatar_url (Supabase Storage / 외부 URL) → placeholder.
 * 랭크 사진 시스템과 무관.
 */
export function resolveProfileAvatarSrc(src: ProfileAvatarSource | null | undefined): string {
  const url = src?.avatar_url?.trim()
  if (url) return url
  return AVATAR_PLACEHOLDER_SRC
}

/**
 * 랭크 사진 src — 카테고리 해금 사진.
 * 우선: selected_avatar_filename + slug → /images/avatar/{slug}/{filename} → placeholder.
 * 프로필 사진 (avatar_url) 과 무관.
 */
export function resolveRankImageSrc(src: RankImageSource | null | undefined): string {
  if (!src) return AVATAR_PLACEHOLDER_SRC
  if (src.selected_avatar_filename && src.selected_avatar_slug) {
    if (src.selected_avatar_filename === 'placeholder.svg') return AVATAR_PLACEHOLDER_SRC
    return `/images/avatar/${src.selected_avatar_slug}/${src.selected_avatar_filename}`
  }
  return AVATAR_PLACEHOLDER_SRC
}

/** 닉네임 첫 글자 fallback — 프로필 사진 미설정 시 노출용. */
export function resolveAvatarInitial(name: string | null | undefined): string {
  if (!name) return '?'
  const trimmed = name.trim()
  if (!trimmed) return '?'
  return trimmed.charAt(0).toUpperCase()
}

/** 프로필 사진 보유 여부 (img 렌더 vs 닉네임 첫 글자 fallback 분기). */
export function hasProfileAvatar(src: ProfileAvatarSource | null | undefined): boolean {
  return !!src?.avatar_url?.trim()
}

/** 랭크 사진 보유 여부 (img 렌더 vs placeholder/숨김 분기). */
export function hasRankImage(src: RankImageSource | null | undefined): boolean {
  if (!src) return false
  return !!(src.selected_avatar_filename && src.selected_avatar_slug)
}
