'use client'

import { useState, useTransition } from 'react'

interface Props {
  locale: string
  labels: {
    parentEmailLabel: string
    parentEmailPlaceholder: string
    submit: string
    sending: string
    errorInvalidEmail: string
    errorGeneric: string
    sentHeadline: string
    sentBody: string
    disclaimer: string
    backCta: string
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ParentConsentForm({ labels }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError(labels.errorInvalidEmail)
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/parent-consent/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parent_email: trimmed }),
        })
        if (!res.ok) {
          setError(labels.errorGeneric)
          return
        }
        setSubmitted(true)
      } catch {
        setError(labels.errorGeneric)
      }
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-3" aria-hidden>📧</div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          {labels.sentHeadline}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {labels.sentBody}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="block mb-5">
        <span className="block text-xs font-semibold text-slate-700 mb-2">
          {labels.parentEmailLabel}
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.parentEmailPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-mist bg-snow text-sm text-slate-800
                     placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 focus:border-blossom-deep
                     transition"
          aria-invalid={error ? 'true' : 'false'}
          autoComplete="email"
          inputMode="email"
        />
      </label>

      {error && (
        <p className="text-xs text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-xl bg-blossom-deep text-white font-bold text-sm
                   hover:bg-blossom-deep/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? labels.sending : labels.submit}
      </button>

      <p className="text-[11px] text-stone leading-relaxed mt-4 text-center">
        {labels.disclaimer}
      </p>
    </form>
  )
}
