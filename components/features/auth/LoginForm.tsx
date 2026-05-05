"use client"

import { useState } from "react"
import Link from "next/link"
import { loginWithEmail } from "@/lib/auth/actions"
import { TurnstileWidget } from "./TurnstileWidget"

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
    captchaRequired: "사람 확인을 완료해주세요",
    captchaFailed: "사람 확인 검증에 실패했습니다",
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
    captchaRequired: "人間確認を完了してください",
    captchaFailed: "人間確認に失敗しました",
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
    captchaRequired: "Please complete the human verification",
    captchaFailed: "Human verification failed",
  },
  'zh-CN': {
    email: "电子邮件",
    password: "密码",
    submit: "登录",
    submitting: "登录中...",
    noAccount: "没有账户?",
    signup: "注册",
    emailPlaceholder: "请输入电子邮件",
    passwordPlaceholder: "请输入密码",
    captchaRequired: "请完成人机验证",
    captchaFailed: "人机验证失败",
  },
  'zh-TW': {
    email: "電子郵件",
    password: "密碼",
    submit: "登入",
    submitting: "登入中...",
    noAccount: "沒有帳號?",
    signup: "註冊",
    emailPlaceholder: "請輸入電子郵件",
    passwordPlaceholder: "請輸入密碼",
    captchaRequired: "請完成人機驗證",
    captchaFailed: "人機驗證失敗",
  },
}

export function LoginForm({ locale, next }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const t = TEXT[locale as keyof typeof TEXT] || TEXT.en || TEXT.ko

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!turnstileToken) {
      setError(t.captchaRequired)
      return
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("locale", locale)
    formData.set("turnstile_token", turnstileToken)
    if (next) formData.set("next", next)

    const result = await loginWithEmail(formData)
    if (result?.error) {
      setError(result.error === "TURNSTILE_FAILED" ? t.captchaFailed : result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
        <label htmlFor="login-email" className="text-sm font-medium text-slate">{t.email}</label>
        <input
          id="login-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t.emailPlaceholder}
          className="
            h-12 px-4 rounded-xl border border-mist bg-white
            text-[#111] placeholder:text-stone text-sm
            focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 focus:border-blossom-deep
            transition-all
          "
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-sm font-medium text-slate">{t.password}</label>
        <input
          id="login-password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder={t.passwordPlaceholder}
          className="
            h-12 px-4 rounded-xl border border-mist bg-white
            text-[#111] placeholder:text-stone text-sm
            focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 focus:border-blossom-deep
            transition-all
          "
        />
      </div>

      <TurnstileWidget locale={locale} onTokenChange={setTurnstileToken} />

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="
          h-12 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-semibold text-sm
          hover:bg-[#374151] active:bg-[#1F2937]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-150 shadow-sm
        "
      >
        {loading ? t.submitting : t.submit}
      </button>

      <p className="text-center text-sm text-stone">
        {t.noAccount}{" "}
        <Link
          href={`/${locale}/auth/signup`}
          className="font-semibold text-blossom-deep hover:underline"
        >
          {t.signup}
        </Link>
      </p>
    </form>
  )
}
