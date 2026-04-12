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

  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

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
    h-12 px-4 rounded-xl border border-[#d5c9b8] bg-white
    text-[#111] placeholder:text-[#9CA3AF] text-sm
    focus:outline-none focus:ring-2 focus:ring-[#F0B8B8]/40 focus:border-[#F0B8B8]
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
        <label className="text-sm font-medium text-[#4B5563]">{t.email}</label>
        <input
          type="email"
          name="email"
          required
          placeholder={t.emailPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#4B5563]">{t.password}</label>
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
          <label className="text-sm font-medium text-[#4B5563]">{t.nickname}</label>
          <span className={`text-xs ${nicknameLen > 18 ? "text-blossom-deep" : "text-[#9CA3AF]"}`}>
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
        <label className="text-sm font-medium text-[#4B5563]">{t.language}</label>
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

      <button
        type="submit"
        disabled={loading}
        className="
          h-12 rounded-xl bg-[#F0F2F5] text-white font-semibold text-sm
          hover:bg-[#374151] active:bg-[#1F2937]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-150 shadow-sm mt-1
        "
      >
        {loading ? t.submitting : t.submit}
      </button>

      <p className="text-center text-sm text-[#9CA3AF]">
        {t.hasAccount}{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="font-semibold text-[#F0B8B8] hover:underline"
        >
          {t.login}
        </Link>
      </p>
    </form>
  )
}
