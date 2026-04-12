"use client"

import { useState } from "react"

interface GoodsNotifyFormProps {
  placeholder: string
  buttonLabel: string
  successMsg: string
  errorMsg: string
  locale: string
}

const DUPLICATE_MSG: Record<string, string> = {
  ko: "이미 알림 신청이 완료된 이메일입니다 ✓",
  ja: "すでに通知登録済みのメールアドレスです ✓",
  en: "This email is already registered ✓",
}

const SERVER_ERROR_MSG: Record<string, string> = {
  ko: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  ja: "一時的なエラーが発生しました。しばらくしてから再度お試しください。",
  en: "A temporary error occurred. Please try again shortly.",
}

export function GoodsNotifyForm({
  placeholder,
  buttonLabel,
  successMsg,
  errorMsg,
  locale,
}: GoodsNotifyFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "invalid" | "server_error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valid) {
      setStatus("invalid")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("/api/goods-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      })
      const json = await res.json()
      if (json.duplicate) {
        setStatus("duplicate")
      } else if (res.ok && json.success) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("server_error")
      }
    } catch {
      setStatus("server_error")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#F0B8B8]/10 border border-[#F0B8B8]/30">
        <span className="text-xl">✅</span>
        <p className="text-sm text-[#111] font-medium">{successMsg}</p>
      </div>
    )
  }

  if (status === "duplicate") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200">
        <span className="text-xl">✓</span>
        <p className="text-sm text-emerald-700 font-medium">
          {DUPLICATE_MSG[locale] || DUPLICATE_MSG.ko}
        </p>
      </div>
    )
  }

  const isInputError = status === "invalid"

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== "idle") setStatus("idle")
          }}
          placeholder={placeholder}
          className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors ${
            isInputError
              ? "border-red-400 focus:border-red-500"
              : "border-[#E4E7EB] focus:border-[#F0B8B8]"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-xl bg-[#F0B8B8] hover:bg-[#F5D0D0] text-[#111] font-bold text-sm transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "..." : buttonLabel}
        </button>
      </div>
      {isInputError && (
        <p className="text-xs text-red-500 pl-1">{errorMsg}</p>
      )}
      {status === "server_error" && (
        <p className="text-xs text-orange-500 pl-1">
          {SERVER_ERROR_MSG[locale] || SERVER_ERROR_MSG.ko}
        </p>
      )}
    </form>
  )
}
