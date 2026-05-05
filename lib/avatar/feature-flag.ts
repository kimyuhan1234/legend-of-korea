/**
 * NEXT_PUBLIC_AVATAR_SYSTEM feature flag.
 *
 * 'v2' = 신규 K-콘텐츠 카테고리 해금 시스템 (10 레벨 / 사진 선택 모달)
 * 그 외 / 미설정 = v1 (기존 무관/문관 분기 시스템) — fallback
 *
 * 운영자가 다음 절차 후 v2 활성화:
 *  1. 057_avatar_unlock_system.sql 적용
 *  2. 059_avatar_auto_mapping.sql 적용
 *  3. Vercel 환경변수 NEXT_PUBLIC_AVATAR_SYSTEM=v2 등록 + 재배포
 *  4. v2 동작 검증 후 cleanup commit (058 + commit 5) 진행
 */

export const AVATAR_SYSTEM_VERSION = 'v2' as const

export function isAvatarSystemV2(): boolean {
  return process.env.NEXT_PUBLIC_AVATAR_SYSTEM === AVATAR_SYSTEM_VERSION
}
