"use client"

import { useState } from "react"
import Link from "next/link"
import { signupWithEmail } from "@/lib/auth/actions"

interface SignupFormProps {
  locale: string
}

const TEXT = {
  ko: {
    email: "이메일",
    password: "비밀번호 (8자 이상)",
    nickname: "닉네임 (최대 20자)",
    language: "서비스 언어",
    submit: "회원가입",
    submitting: "가입 중...",
    hasAccount: "이미 계정이 있으신가요?",
    login: "로그인",
    emailPlaceholder: "이메일을 입력하세요",
    passwordPlaceholder: "비밀번호를 입력하세요",
    nicknamePlaceholder: "닉네임을 입력하세요",
    success: "가입이 완료되었습니다! 로그인해주세요.",
    agreePrivacy: "개인정보처리방침에 동의합니다 (필수)",
    agreeTerms: "이용약관에 동의합니다 (필수)",
    view: "보기",
  },
  ja: {
    email: "メールアドレス",
    password: "パスワード（8文字以上）",
    nickname: "ニックネーム（20文字以内）",
    language: "言語設定",
    submit: "新規登録",
    submitting: "登録中...",
    hasAccount: "すでにアカウントをお持ちですか？",
    login: "ログイン",
    emailPlaceholder: "メールアドレスを入力",
    passwordPlaceholder: "パスワードを入力",
    nicknamePlaceholder: "ニックネームを入力",
    success: "登録が完了しました！ログインしてください。",
    agreePrivacy: "プライバシーポリシーに同意します (必須)",
    agreeTerms: "利用規約に同意します (必須)",
    view: "見る",
  },
  en: {
    email: "Email",
    password: "Password (min. 8 characters)",
    nickname: "Nickname (max 20 characters)",
    language: "Language",
    submit: "Sign Up",
    submitting: "Creating account...",
    hasAccount: "Already have an account?",
    login: "Sign In",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    nicknamePlaceholder: "Enter your nickname",
    success: "Account created! Please sign in.",
    agreePrivacy: "I agree to the Privacy Policy (required)",
    agreeTerms: "I agree to the Terms of Service (required)",
    view: "View",
  },
  'zh-CN': {
    email: "电子邮件",
    password: "密码 (至少8个字符)",
    nickname: "昵称 (最多20个字符)",
    language: "语言",
    submit: "注册",
    submitting: "注册中...",
    hasAccount: "已有账户?",
    login: "登录",
    emailPlaceholder: "请输入电子邮件",
    passwordPlaceholder: "请输入密码",
    nicknamePlaceholder: "请输入昵称",
    success: "注册完成! 请登录。",
    agreePrivacy: "同意隐私政策 (必选)",
    agreeTerms: "同意服务条款 (必选)",
    view: "查看",
  },
  'zh-TW': {
    email: "電子郵件",
    password: "密碼 (至少8個字元)",
    nickname: "暱稱 (最多20個字元)",
    language: "語言",
    submit: "註冊",
    submitting: "註冊中...",
    hasAccount: "已有帳號?",
    login: "登入",
    emailPlaceholder: "請輸入電子郵件",
    passwordPlaceholder: "請輸入密碼",
    nicknamePlaceholder: "請輸入暱稱",
    success: "註冊完成! 請登入。",
    agreePrivacy: "同意隱私權政策 (必選)",
    agreeTerms: "同意服務條款 (必選)",
    view: "查看",
  },
}

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
]

export function SignupForm({ locale }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [nicknameLen, setNicknameLen] = useState(0)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)

  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("locale", locale)

    const result = await signupWithEmail(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(result.success)
      setLoading(false)
    }
  }

  const inputClass = `
    h-12 px-4 rounded-xl border border-mist bg-white
    text-[#111] placeholder:text-stone text-sm
    focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 focus:border-blossom-deep
    transition-all w-full
  `

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate">{t.email}</label>
        <input
          type="email"
          name="email"
          required
          placeholder={t.emailPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate">{t.password}</label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder={t.passwordPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate">{t.nickname}</label>
          <span className={`text-xs ${nicknameLen > 18 ? "text-blossom-deep" : "text-stone"}`}>
            {nicknameLen}/20
          </span>
        </div>
        <input
          type="text"
          name="nickname"
          required
          maxLength={20}
          placeholder={t.nicknamePlaceholder}
          onChange={(e) => setNicknameLen(e.target.value.length)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate">{t.language}</label>
        <select
          name="language"
          defaultValue={locale}
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
          <Link href={`/${locale}/privacy`} className="text-blossom-deep underline ml-1 shrink-0">{t.view}</Link>
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
          <Link href={`/${locale}/terms`} className="text-blossom-deep underline ml-1 shrink-0">{t.view}</Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !agreedPrivacy || !agreedTerms}
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
