"use client"

import { logout } from "@/lib/auth/actions"

interface LogoutButtonProps {
  locale: string
  className?: string
}

const LABEL = { ko: "로그아웃", ja: "ログアウト", en: "Sign Out" }

export function LogoutButton({ locale, className }: LogoutButtonProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko

  return (
    <button
      onClick={() => logout(locale)}
      className={className ?? "text-sm text-[#7a6a58] hover:text-red-500 transition-colors"}
    >
      {label}
    </button>
  )
}
