'use client'

interface DifficultyBadgeProps {
  difficulty: "easy" | "medium" | "hard"
  locale: string
  size?: "sm" | "md"
}

const LABELS = {
  ko: { easy: "초급", medium: "중급", hard: "고급" },
  ja: { easy: "初級", medium: "中級", hard: "上級" },
  en: { easy: "Easy", medium: "Medium", hard: "Hard" },
}

const STYLES = {
  easy:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  hard:   "bg-red-100 text-red-700 border-red-200",
}

const ICONS = { easy: "🌱", medium: "🔥", hard: "⚡" }

export function DifficultyBadge({ difficulty, locale, size = "sm" }: DifficultyBadgeProps) {
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.ko
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${sizeClass} ${STYLES[difficulty]}`}>
      <span>{ICONS[difficulty]}</span>
      {labels[difficulty]}
    </span>
  )
}
