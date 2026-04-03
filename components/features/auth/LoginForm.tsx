"use client"

import { useState } from "react"
import Link from "next/link"
import { loginWithEmail } from "@/lib/auth/actions"

interface LoginFormProps {
  locale: string
  next?: string
}

const TEXT = {
  ko: {
    email: "이메일",
    password: "비밀번호",
    submit: "로그인",
    submitting: "로그인 중...",
    noAccount: "계정이 없으신가요?",
    signup: "회원가입",
    emailPlaceholder: "이메일을 입력하세요",
    passwordPlaceholder: "비밀번호를 입력하세요",
  },
  ja: {
    email: "メールアドレス",
    password: "パスワード",
    submit: "ログイン",
    submitting: "ログイン中...",
    noAccount: "アカウントをお持ちでないですか？",
    signup: "新規登録",
    emailPlaceholder: "メールアドレスを入力",
    passwordPlaceholder: "パスワードを入力",
  },
  en: {
    email: "Email",
    password: "Password",
    submit: "Sign In",
    submitting: "Signing in...",
    noAccount: "Don't have an account?",
    signup: "Sign Up",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
  },
}

export function LoginForm({ locale, next }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const t = TEXT[locale as keyof typeof TEXT] || TEXT.ko

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("locale", locale)
    if (next) formData.set("next", next)

    const result = await loginWithEmail(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#3a3028]">{t.email}</label>
        <input
          type="email"
          name="email"
          required
          placeholder={t.emailPlaceholder}
          className="
            h-12 px-4 rounded-xl border border-[#d5c9b8] bg-white
            text-[#1B2A4A] placeholder:text-[#b0a090] text-sm
            focus:outline-none focus:ring-2 focus:ring-[#D4A843]/40 focus:border-[#D4A843]
            transition-all
          "
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#3a3028]">{t.password}</label>
        <input
          type="password"
          name="password"
          required
          placeholder={t.passwordPlaceholder}
          className="
            h-12 px-4 rounded-xl border border-[#d5c9b8] bg-white
            text-[#1B2A4A] placeholder:text-[#b0a090] text-sm
            focus:outline-none focus:ring-2 focus:ring-[#D4A843]/40 focus:border-[#D4A843]
            transition-all
          "
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          h-12 rounded-xl bg-[#1B2A4A] text-white font-semibold text-sm
          hover:bg-[#243a63] active:bg-[#152038]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-150 shadow-sm
        "
      >
        {loading ? t.submitting : t.submit}
      </button>

      <p className="text-center text-sm text-[#7a6a58]">
        {t.noAccount}{" "}
        <Link
          href={`/${locale}/auth/signup`}
          className="font-semibold text-[#D4A843] hover:underline"
        >
          {t.signup}
        </Link>
      </p>
    </form>
  )
}
