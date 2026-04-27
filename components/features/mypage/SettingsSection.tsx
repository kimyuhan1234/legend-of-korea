'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  icon: string
  title: string
  children: React.ReactNode
}

export function SettingsSection({ icon, title, children }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
        <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
          <span className="text-base">{icon}</span> {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  )
}

interface RowProps {
  icon: string
  label: string
  onClick?: () => void
  href?: string
  isOpen?: boolean
  danger?: boolean
}

export function SettingsRow({ icon, label, onClick, href, isOpen, danger }: RowProps) {
  const base = `flex items-center gap-3 w-full px-5 py-4 text-sm font-bold transition-colors border-b border-slate-100 last:border-b-0 ${
    danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50'
  }`

  const content = (
    <>
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {onClick !== undefined ? (
        isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />
      ) : (
        <ChevronRight className="w-4 h-4 text-slate-500" />
      )}
    </>
  )

  if (href) {
    return <Link href={href} className={base}>{content}</Link>
  }

  return (
    <button onClick={onClick} className={base}>
      {content}
    </button>
  )
}
