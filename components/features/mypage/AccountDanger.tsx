'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { SettingsSection, SettingsRow } from './SettingsSection'

interface Props {
  locale: string
}

const CONFIRM_PHRASES: Record<string, string> = {
  ko: '탈퇴합니다',
  en: 'DELETE',
  ja: '退会します',
  'zh-CN': '注销',
  'zh-TW': '註銷',
}

export function AccountDanger({ locale }: Props) {
  const t = useTranslations('mypage')
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const requiredPhrase = CONFIRM_PHRASES[locale] ?? CONFIRM_PHRASES.en
  const isConfirmValid = confirmInput.trim() === requiredPhrase

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const res = await fetch('/api/account/export')
      if (!res.ok) {
        toast({ variant: 'destructive', title: t('settings.exportFailed') })
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const cd = res.headers.get('Content-Disposition') || ''
      const match = cd.match(/filename="([^"]+)"/)
      a.download = match?.[1] ?? `clouds-with-you-data-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: t('settings.exportSuccess') })
    } catch {
      toast({ variant: 'destructive', title: t('settings.exportFailed') })
    } finally {
      setExporting(false)
    }
  }

  const handleDelete = async () => {
    if (!isConfirmValid || deleting) return
    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        // Supabase 클라이언트 세션 제거
        const supabase = createClient()
        await supabase.auth.signOut()
        toast({ title: t('settings.deleteSuccess') })
        router.push(`/${locale}`)
        router.refresh()
      } else {
        toast({ variant: 'destructive', title: data.error || 'Failed' })
        setDeleting(false)
      }
    } catch {
      toast({ variant: 'destructive', title: 'Failed' })
      setDeleting(false)
    }
  }

  return (
    <>
      <SettingsSection icon="⚠️" title={t('settings.account')}>
        <SettingsRow
          icon="🚪"
          label={t('settings.logout')}
          onClick={handleLogout}
        />
        <SettingsRow
          icon="📥"
          label={exporting ? t('settings.exporting') : t('settings.exportData')}
          onClick={handleExport}
        />
        <SettingsRow
          icon="🗑️"
          label={t('settings.deleteAccount')}
          onClick={() => setShowDeleteModal(true)}
          danger
        />
      </SettingsSection>

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
              <h3 className="font-black text-slate-800">{t('settings.deleteConfirmTitle')}</h3>
            </div>

            <p className="text-sm text-slate-500">{t('settings.deleteConfirmDesc')}</p>

            <ul className="space-y-1.5 text-xs text-slate-600 bg-rose-50 border border-rose-100 rounded-xl p-4">
              <li className="flex gap-2"><span>•</span>{t('settings.deleteWarning1')}</li>
              <li className="flex gap-2"><span>•</span>{t('settings.deleteWarning2')}</li>
              <li className="flex gap-2"><span>•</span>{t('settings.deleteWarning3')}</li>
              <li className="flex gap-2"><span>•</span>{t('settings.deleteWarning4')}</li>
            </ul>

            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">
                {t('settings.deleteConfirmPlaceholder')}
              </p>
              <p className="text-center font-mono font-black text-rose-500 mb-2 py-2 bg-rose-50 rounded-lg">
                {requiredPhrase}
              </p>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={requiredPhrase}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-rose-300 transition-colors"
                disabled={deleting}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                {t('cancelButton')}
              </button>
              <button
                onClick={handleDelete}
                disabled={!isConfirmValid || deleting}
                className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-black text-sm hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> {t('settings.deleteAccount')}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
