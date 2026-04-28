"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { BirthDatePicker } from "./BirthDatePicker"

interface Props {
  /** 현재 사용자 locale — 부모 동의 redirect 시 prefix 로 사용 */
  locale: string
  /** birth_date_deadline (ISO). null 이면 신규 가입자 (이미 입력 완료). */
  deadlineIso: string | null
}

/**
 * P0F-2: 재인증 birth_date 모달 — birth_date NULL 사용자에게 강제 노출.
 *
 * UX 정책 (PRD):
 *   - 닫기 버튼 X (ESC 차단, backdrop click 차단) — 인증 강제
 *   - 14세 미만 입력 시 자동으로 /auth/parent-consent 로 redirect
 *   - 입력 완료 시 페이지 새로고침 → server component 가 다시 user 데이터 fetch
 *   - WCAG 2.2 AA 준수: aria-modal / aria-describedby / focus trap
 */
export function ReauthBirthDateModal({ locale, deadlineIso }: Props) {
  const t = useTranslations("reauth")
  const router = useRouter()
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // ESC 키 차단 — 사용자 임의로 닫지 못하도록
  useEffect(() => {
    const blockEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener("keydown", blockEsc, true)
    return () => document.removeEventListener("keydown", blockEsc, true)
  }, [])

  // body scroll 잠금
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  // 마감 D-day 계산
  const today = new Date().toISOString().slice(0, 10)
  let daysLeft: number | null = null
  if (deadlineIso) {
    const d = new Date(deadlineIso).getTime() - Date.now()
    daysLeft = Math.max(0, Math.ceil(d / (1000 * 60 * 60 * 24)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      setError(t("errorGeneric"))
      return
    }
    if (birthDate > today) {
      setError(t("errorFutureDate"))
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/reauth-birth-date", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthDate }),
        })
        if (!res.ok) {
          setError(t("errorGeneric"))
          return
        }
        const data = (await res.json()) as { ok: boolean; requiresParentConsent: boolean }
        if (data.requiresParentConsent) {
          // 14세 미만 — 부모 동의 페이지로 (P0-5-C-2 자산)
          router.push(`/${locale}/auth/parent-consent`)
          return
        }
        // 입력 완료 — server component re-fetch 위해 새로고침
        router.refresh()
      } catch {
        setError(t("errorGeneric"))
      }
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reauth-title"
      aria-describedby="reauth-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl"
      >
        <h2 id="reauth-title" className="text-xl md:text-2xl font-black text-slate-900 mb-3">
          {t("title")}
        </h2>
        <p id="reauth-desc" className="text-sm text-slate-700 leading-relaxed mb-5">
          {t("description")}
        </p>

        {daysLeft !== null && daysLeft <= 30 && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-800 font-medium"
          >
            ⚠️ {t("warning", { days: daysLeft })}
          </div>
        )}

        <div className="mb-5">
          <span className="block text-xs font-semibold text-slate-700 mb-2">
            {t("birthDateLabel")}
          </span>
          <BirthDatePicker
            value={birthDate}
            onChange={setBirthDate}
            labels={{ year: t("birthDateYear"), month: t("birthDateMonth"), day: t("birthDateDay") }}
            idPrefix="reauth-birth-date"
            required
            invalid={Boolean(error)}
          />
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-600 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !birthDate}
          className="w-full py-3 rounded-xl bg-mint-deep text-white font-bold text-sm
                     hover:bg-mint-deep/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? t("submitting") : t("submit")}
        </button>

        <p className="text-[11px] text-slate-500 leading-relaxed mt-4 text-center">
          {t("legalNotice")}
        </p>
      </form>
    </div>
  )
}
