/**
 * 회원가입 시 비밀번호 규칙. 클라이언트·서버 양쪽에서 재사용.
 */
export const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
} as const

export type PasswordRuleKey = 'minLength' | 'hasUppercase' | 'hasLowercase' | 'hasNumber' | 'hasSpecial'

/** 각 규칙별 충족 여부 — 실시간 UI 피드백용 */
export function checkPasswordRules(pw: string): Record<PasswordRuleKey, boolean> {
  return {
    minLength: pw.length >= PASSWORD_RULES.minLength,
    hasUppercase: PASSWORD_RULES.hasUppercase.test(pw),
    hasLowercase: PASSWORD_RULES.hasLowercase.test(pw),
    hasNumber: PASSWORD_RULES.hasNumber.test(pw),
    hasSpecial: PASSWORD_RULES.hasSpecial.test(pw),
  }
}

export function isPasswordValid(pw: string): boolean {
  const r = checkPasswordRules(pw)
  return r.minLength && r.hasUppercase && r.hasLowercase && r.hasNumber && r.hasSpecial
}
