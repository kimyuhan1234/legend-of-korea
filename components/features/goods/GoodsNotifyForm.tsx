"use client"

import { useState } from "react"

interface GoodsNotifyFormProps {
  placeholder: string
  buttonLabel: string
  successMsg: string
  errorMsg: string
}

// TODO: Supabase goods_notify 테이블 연동

export function GoodsNotifyForm({
  placeholder,
  buttonLabel,
  successMsg,
  errorMsg,
}: GoodsNotifyFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valid) {
      setStatus("error")
      return
    }
    setStatus("success")
    setEmail("")
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/30">
        <span className="text-xl">✅</span>
        <p className="text-sm text-[#1B2A4A] font-medium">{successMsg}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === "error") setStatus("idle")
          }}
          placeholder={placeholder}
          className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors ${
            status === "error"
              ? "border-red-400 focus:border-red-500"
              : "border-[#e8ddd0] focus:border-[#D4A843]"
          }`}
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#D4A843] hover:bg-[#e0b84e] text-[#1B2A4A] font-bold text-sm transition-colors whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500 pl-1">{errorMsg}</p>
      )}
    </form>
  )
}
