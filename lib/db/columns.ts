/**
 * 공용 컬럼 셋 상수 — `select('*')` 대체용.
 *
 * 가이드:
 *  - users 테이블은 email/role 등 민감 필드를 포함하므로 PUBLIC 셋 (다른 사용자 노출용)
 *    과 PRIVATE 셋 (본인용) 을 분리한다.
 *  - 결제 카드 PII 컬럼은 현재 스키마에 부재 (결제 미연동) — 필요 시 결제 활성화 시점에
 *    EXCLUDED 셋 정의.
 *  - 자주 쓰지 않는 테이블은 inline 명시로 충분 — 본 파일은 재사용 빈도 높은 셋만.
 */

// ─── users ─────────────────────────────────────────────────────
// 다른 사용자에게 노출 가능한 공용 프로필. 닉네임·아바타·등급·LP 만.
// email/role/birth_date/social_provider 등은 절대 포함 X.
export const USER_PUBLIC_COLUMNS =
  'id, nickname, avatar_url, current_level, total_lp' as const

// 본인 마이페이지용. 모든 비-민감 필드 포함 (birth_date 본인은 조회 가능).
// password_hash 는 auth.users 에 있어 public.users 에 없음.
export const USER_PRIVATE_COLUMNS =
  'id, nickname, email, language, social_provider, avatar_url, total_lp, current_level, role, birth_date, birth_date_verified_at, created_at, updated_at' as const

// JOIN 시 사용자 정보 — 'users(...)' 형식. 게시물 작성자 노출 등.
export const USER_PUBLIC_RELATION =
  'users(nickname, avatar_url, current_level)' as const
