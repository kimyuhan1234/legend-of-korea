"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signupWithEmail } from "@/lib/auth/actions"
import { checkPasswordRules, type PasswordRuleKey } from "@/lib/auth/password-rules"
import { isAtLeastMinimumAge, getMaxBirthDateString } from "@/lib/validation/age"
import { toast } from "@/components/ui/use-toast"

interface SignupFormProps {
  locale: string
}

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const TEXT: Record<Lang, {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  language: string
  submit: string
  submitting: string
  hasAccount: string
  login: string
  emailPlaceholder: string
  passwordPlaceholder: string
  passwordConfirmPlaceholder: string
  nicknamePlaceholder: string
  agreePrivacy: string
  agreeTerms: string
  view: string
  rules: Record<PasswordRuleKey, string>
  passwordMismatch: string
  passwordMatch: string
  successTitle: string
  successDesc: string
  emailConfirmTitle: string
  emailConfirmDesc: string
  testBannerTitle: string
  testBannerDesc: string
  birthDateLabel: string
  birthDateHint: string
  errors: {
    MISSING_FIELDS: string
    NICKNAME_TOO_LONG: string
    PASSWORD_RULES: string
    EMAIL_TAKEN: string
    UNDER_14: string
    GENERIC: string
  }
}> = {
  ko: {
    email: "이메일",
    password: "비밀번호",
    passwordConfirm: "비밀번호 확인",
    nickname: "닉네임 (최대 20자)",
    language: "서비스 언어",
    submit: "회원가입",
    submitting: "가입 중...",
    hasAccount: "이미 계정이 있으신가요?",
    login: "로그인",
    emailPlaceholder: "이메일을 입력하세요",
    passwordPlaceholder: "비밀번호를 입력하세요",
    passwordConfirmPlaceholder: "비밀번호를 다시 입력하세요",
    nicknamePlaceholder: "닉네임을 입력하세요",
    agreePrivacy: "개인정보처리방침에 동의합니다 (필수)",
    agreeTerms: "이용약관에 동의합니다 (필수)",
    view: "보기",
    rules: { minLength: "8자 이상", hasUppercase: "영문 대문자 포함", hasLowercase: "영문 소문자 포함", hasNumber: "숫자 포함", hasSpecial: "특수문자 포함 (!@#$%^&* 등)" },
    passwordMismatch: "비밀번호가 일치하지 않습니다",
    passwordMatch: "비밀번호가 일치합니다",
    successTitle: "🎉 회원가입 완료!",
    successDesc: "Cloud with you에 오신 것을 환영합니다!",
    emailConfirmTitle: "이메일 확인 필요",
    emailConfirmDesc: "받은편지함에서 인증 메일을 확인해주세요.",
    testBannerTitle: "현재 테스트 기간 — 모든 기능 무료!",
    testBannerDesc: "테스트 기간이 종료되면 일부 기능은 유료 패스가 필요합니다. 지금 가입하고 모든 기능을 체험해보세요!",
    birthDateLabel: "생년월일",
    birthDateHint: "만 14세 이상부터 가입할 수 있어요",
    errors: {
      MISSING_FIELDS: "모든 필드를 입력해주세요.",
      NICKNAME_TOO_LONG: "닉네임은 20자 이하로 입력해주세요.",
      PASSWORD_RULES: "비밀번호 규칙을 확인해주세요.",
      EMAIL_TAKEN: "이미 사용 중인 이메일입니다.",
      UNDER_14: "만 14세 이상부터 가입할 수 있어요",
      GENERIC: "회원가입 중 오류가 발생했습니다.",
    },
  },
  ja: {
    email: "メールアドレス",
    password: "パスワード",
    passwordConfirm: "パスワード確認",
    nickname: "ニックネーム（20文字以内）",
    language: "言語設定",
    submit: "新規登録",
    submitting: "登録中...",
    hasAccount: "すでにアカウントをお持ちですか？",
    login: "ログイン",
    emailPlaceholder: "メールアドレスを入力",
    passwordPlaceholder: "パスワードを入力",
    passwordConfirmPlaceholder: "パスワードを再入力",
    nicknamePlaceholder: "ニックネームを入力",
    agreePrivacy: "プライバシーポリシーに同意します (必須)",
    agreeTerms: "利用規約に同意します (必須)",
    view: "見る",
    rules: { minLength: "8文字以上", hasUppercase: "英大文字を含む", hasLowercase: "英小文字を含む", hasNumber: "数字を含む", hasSpecial: "特殊文字を含む (!@#$%^&* 等)" },
    passwordMismatch: "パスワードが一致しません",
    passwordMatch: "パスワードが一致しました",
    successTitle: "🎉 新規登録完了！",
    successDesc: "Cloud with you へようこそ！",
    emailConfirmTitle: "メール確認が必要",
    emailConfirmDesc: "受信トレイで認証メールをご確認ください。",
    testBannerTitle: "ベータ期間 — 全機能無料！",
    testBannerDesc: "ベータ期間終了後、一部の機能は有料パスが必要になります。今すぐ登録して全機能をお試しください！",
    birthDateLabel: "生年月日",
    birthDateHint: "14歳以上の方からご登録いただけます",
    errors: {
      MISSING_FIELDS: "すべての項目を入力してください。",
      NICKNAME_TOO_LONG: "ニックネームは20文字以内で入力してください。",
      PASSWORD_RULES: "パスワード規則をご確認ください。",
      EMAIL_TAKEN: "すでに使用中のメールアドレスです。",
      UNDER_14: "14歳以上の方からご登録いただけます",
      GENERIC: "登録中にエラーが発生しました。",
    },
  },
  en: {
    email: "Email",
    password: "Password",
    passwordConfirm: "Confirm password",
    nickname: "Nickname (max 20 characters)",
    language: "Language",
    submit: "Sign Up",
    submitting: "Creating account...",
    hasAccount: "Already have an account?",
    login: "Sign In",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    passwordConfirmPlaceholder: "Re-enter your password",
    nicknamePlaceholder: "Enter your nickname",
    agreePrivacy: "I agree to the Privacy Policy (required)",
    agreeTerms: "I agree to the Terms of Service (required)",
    view: "View",
    rules: { minLength: "8+ characters", hasUppercase: "Uppercase letter", hasLowercase: "Lowercase letter", hasNumber: "Number", hasSpecial: "Special character (!@#$%^&* etc.)" },
    passwordMismatch: "Passwords do not match",
    passwordMatch: "Passwords match",
    successTitle: "🎉 Welcome aboard!",
    successDesc: "Welcome to Cloud with you!",
    emailConfirmTitle: "Email verification required",
    emailConfirmDesc: "Please check your inbox for the verification email.",
    testBannerTitle: "Beta Period — All features free!",
    testBannerDesc: "Some features will require a paid pass after the beta period. Sign up now and try everything for free!",
    birthDateLabel: "Date of birth",
    birthDateHint: "Sign-up is available for ages 14 and older",
    errors: {
      MISSING_FIELDS: "Please fill in all fields.",
      NICKNAME_TOO_LONG: "Nickname must be 20 characters or fewer.",
      PASSWORD_RULES: "Please check the password rules.",
      EMAIL_TAKEN: "This email is already in use.",
      UNDER_14: "Sign-up is available for ages 14 and older",
      GENERIC: "An error occurred during signup.",
    },
  },
  'zh-CN': {
    email: "电子邮件",
    password: "密码",
    passwordConfirm: "确认密码",
    nickname: "昵称 (最多20个字符)",
    language: "语言",
    submit: "注册",
    submitting: "注册中...",
    hasAccount: "已有账户?",
    login: "登录",
    emailPlaceholder: "请输入电子邮件",
    passwordPlaceholder: "请输入密码",
    passwordConfirmPlaceholder: "请再次输入密码",
    nicknamePlaceholder: "请输入昵称",
    agreePrivacy: "同意隐私政策 (必选)",
    agreeTerms: "同意服务条款 (必选)",
    view: "查看",
    rules: { minLength: "8位以上", hasUppercase: "包含大写字母", hasLowercase: "包含小写字母", hasNumber: "包含数字", hasSpecial: "包含特殊字符 (!@#$%^&* 等)" },
    passwordMismatch: "密码不一致",
    passwordMatch: "密码一致",
    successTitle: "🎉 注册成功！",
    successDesc: "欢迎来到 Cloud with you！",
    emailConfirmTitle: "需要邮箱验证",
    emailConfirmDesc: "请在收件箱查看验证邮件。",
    testBannerTitle: "测试期间 — 所有功能免费！",
    testBannerDesc: "测试期结束后，部分功能需要付费通行证。现在注册，免费体验所有功能！",
    birthDateLabel: "出生日期",
    birthDateHint: "年满14岁可注册",
    errors: {
      MISSING_FIELDS: "请填写所有字段。",
      NICKNAME_TOO_LONG: "昵称不能超过20个字符。",
      PASSWORD_RULES: "请检查密码规则。",
      EMAIL_TAKEN: "该邮箱已被使用。",
      UNDER_14: "年满14岁可注册",
      GENERIC: "注册过程中发生错误。",
    },
  },
  'zh-TW': {
    email: "電子郵件",
    password: "密碼",
    passwordConfirm: "確認密碼",
    nickname: "暱稱 (最多20個字元)",
    language: "語言",
    submit: "註冊",
    submitting: "註冊中...",
    hasAccount: "已有帳號?",
    login: "登入",
    emailPlaceholder: "請輸入電子郵件",
    passwordPlaceholder: "請輸入密碼",
    passwordConfirmPlaceholder: "請再次輸入密碼",
    nicknamePlaceholder: "請輸入暱稱",
    agreePrivacy: "同意隱私權政策 (必選)",
    agreeTerms: "同意服務條款 (必選)",
    view: "查看",
    rules: { minLength: "8位以上", hasUppercase: "包含大寫字母", hasLowercase: "包含小寫字母", hasNumber: "包含數字", hasSpecial: "包含特殊字元 (!@#$%^&* 等)" },
    passwordMismatch: "密碼不一致",
    passwordMatch: "密碼一致",
    successTitle: "🎉 註冊成功！",
    successDesc: "歡迎來到 Cloud with you！",
    emailConfirmTitle: "需要信箱驗證",
    emailConfirmDesc: "請在收件匣查看驗證信件。",
    testBannerTitle: "測試期間 — 所有功能免費！",
    testBannerDesc: "測試期結束後，部分功能需要付費通行證。現在註冊，免費體驗所有功能！",
    birthDateLabel: "出生日期",
    birthDateHint: "年滿14歲可註冊",
    errors: {
      MISSING_FIELDS: "請填寫所有欄位。",
      NICKNAME_TOO_LONG: "暱稱不能超過20個字元。",
      PASSWORD_RULES: "請檢查密碼規則。",
      EMAIL_TAKEN: "此信箱已被使用。",
      UNDER_14: "年滿14歲可註冊",
      GENERIC: "註冊過程中發生錯誤。",
    },
  },
}

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
]

const RULE_KEYS: PasswordRuleKey[] = ['minLength', 'hasUppercase', 'hasLowercase', 'hasNumber', 'hasSpecial']

function resolveLang(raw: string): Lang {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as Lang[]).includes(raw as Lang) ? (raw as Lang) : 'ko'
}

export function SignupForm({ locale }: SignupFormProps) {
  const router = useRouter()
  const lang = resolveLang(locale)
  const t = TEXT[lang]

  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)

  const ruleStatus = useMemo(() => checkPasswordRules(password), [password])
  const allRulesMet = RULE_KEYS.every((k) => ruleStatus[k])
  const passwordsMatch = password.length > 0 && password === passwordConfirm
  const showMismatchError = passwordConfirm.length > 0 && !passwordsMatch
  // 만 14세 검증 — 입력 후 미달이면 즉시 에러 노출 (디자인팀 인라인 에러)
  const isAgeOk = birthDate.length === 0 || isAtLeastMinimumAge(birthDate)
  const showAgeError = birthDate.length > 0 && !isAgeOk
  const maxBirthDate = useMemo(() => getMaxBirthDateString(), [])

  const canSubmit =
    !loading &&
    email.trim().length > 0 &&
    nickname.trim().length > 0 &&
    birthDate.length > 0 &&
    isAgeOk &&
    allRulesMet &&
    passwordsMatch &&
    agreedPrivacy &&
    agreedTerms

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("locale", locale)

    const result = await signupWithEmail(formData)

    if (result?.error) {
      // 14세 미만은 별도 안내 페이지로 (users row 생성 X — 클라/서버 양쪽 검증으로 차단된 상태)
      if (result.error === "UNDER_14") {
        router.push(`/${locale}/auth/age-restricted`)
        return
      }
      const code = result.error as keyof typeof t.errors
      setError(t.errors[code] ?? t.errors.GENERIC)
      setLoading(false)
      return
    }

    if (result?.success === "SIGNED_IN") {
      toast({ title: t.successTitle, description: t.successDesc })
      setTimeout(() => {
        router.push(`/${locale}`)
        router.refresh()
      }, 1500)
      return
    }

    if (result?.success === "EMAIL_CONFIRM_REQUIRED") {
      toast({ title: t.emailConfirmTitle, description: t.emailConfirmDesc })
      setLoading(false)
      return
    }

    // 알 수 없는 응답
    setError(t.errors.GENERIC)
    setLoading(false)
  }

  const inputClass = `
    h-12 px-4 rounded-xl border border-mist bg-white
    text-[#111] placeholder:text-stone text-sm
    focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 focus:border-blossom-deep
    transition-all w-full
  `

  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {isTestMode && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <p className="text-sm font-medium text-sky-800">
            🎉 {t.testBannerTitle}
          </p>
          <p className="text-xs text-sky-600 mt-1 leading-relaxed">
            {t.testBannerDesc}
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-email" className="text-sm font-medium text-slate">{t.email}</label>
        <input
          id="signup-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-password" className="text-sm font-medium text-slate">{t.password}</label>
        <input
          id="signup-password"
          type="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.passwordPlaceholder}
          className={inputClass}
          autoComplete="new-password"
        />
        {/* 비밀번호 규칙 실시간 피드백 */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-1">
          {RULE_KEYS.map((key) => {
            const ok = ruleStatus[key]
            return (
              <li
                key={key}
                className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-stone'}`}
              >
                <span className="w-3.5 text-center select-none" aria-hidden>
                  {ok ? '✅' : '○'}
                </span>
                <span>{t.rules[key]}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-password-confirm" className="text-sm font-medium text-slate">{t.passwordConfirm}</label>
        <input
          id="signup-password-confirm"
          type="password"
          name="passwordConfirm"
          required
          aria-invalid={showMismatchError ? 'true' : 'false'}
          aria-describedby={passwordConfirm.length > 0 ? 'signup-password-confirm-status' : undefined}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder={t.passwordConfirmPlaceholder}
          className={`${inputClass} ${showMismatchError ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
          autoComplete="new-password"
        />
        {passwordConfirm.length > 0 && (
          <p
            id="signup-password-confirm-status"
            role={showMismatchError ? 'alert' : undefined}
            className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
          >
            <span aria-hidden>{passwordsMatch ? '✅' : '⚠️'}</span>
            {passwordsMatch ? t.passwordMatch : t.passwordMismatch}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="signup-nickname" className="text-sm font-medium text-slate">{t.nickname}</label>
          <span className={`text-xs ${nickname.length > 18 ? "text-blossom-deep" : "text-stone"}`}>
            {nickname.length}/20
          </span>
        </div>
        <input
          id="signup-nickname"
          type="text"
          name="nickname"
          required
          maxLength={20}
          autoComplete="username"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t.nicknamePlaceholder}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-birth-date" className="text-sm font-medium text-slate">{t.birthDateLabel}</label>
        <input
          id="signup-birth-date"
          type="date"
          name="birth_date"
          required
          autoComplete="bday"
          aria-invalid={showAgeError ? 'true' : 'false'}
          aria-describedby="signup-birth-date-hint"
          value={birthDate}
          max={maxBirthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`${inputClass} ${showAgeError ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
        />
        {/* 입력 전: 안내 텍스트 / 입력 후 미달: 빨간 에러 (이모지 X — 디자인팀 우려 반영) */}
        {showAgeError ? (
          <p id="signup-birth-date-hint" role="alert" className="text-xs text-red-600">{t.errors.UNDER_14}</p>
        ) : (
          <p id="signup-birth-date-hint" className="text-xs text-stone">{t.birthDateHint}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-language" className="text-sm font-medium text-slate">{t.language}</label>
        <select
          id="signup-language"
          name="language"
          defaultValue={lang}
          className={inputClass}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <label className="flex items-start gap-2 text-sm text-slate cursor-pointer">
          <input
            type="checkbox"
            checked={agreedPrivacy}
            onChange={(e) => setAgreedPrivacy(e.target.checked)}
            className="mt-0.5 accent-blossom-deep w-4 h-4 shrink-0"
            required
          />
          <span className="flex-1">{t.agreePrivacy}</span>
          <Link href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blossom-deep underline ml-1 shrink-0">{t.view}</Link>
        </label>
        <label className="flex items-start gap-2 text-sm text-slate cursor-pointer">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 accent-blossom-deep w-4 h-4 shrink-0"
            required
          />
          <span className="flex-1">{t.agreeTerms}</span>
          <Link href={`/${locale}/terms`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blossom-deep underline ml-1 shrink-0">{t.view}</Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="
          h-12 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-semibold text-sm
          hover:bg-[#374151] active:bg-[#1F2937]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-150 shadow-sm mt-1
        "
      >
        {loading ? t.submitting : t.submit}
      </button>

      <p className="text-center text-sm text-stone">
        {t.hasAccount}{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="font-semibold text-blossom-deep hover:underline"
        >
          {t.login}
        </Link>
      </p>
    </form>
  )
}
